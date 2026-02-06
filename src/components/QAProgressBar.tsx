import { QA_STAGES } from '@/types/component';
import { Check } from 'lucide-react';

interface QAProgressBarProps {
  currentStage: number;
  completedStages?: number[];
}

export default function QAProgressBar({ currentStage, completedStages = [] }: QAProgressBarProps) {
  return (
    <div className="flex items-center w-full gap-1">
      {QA_STAGES.map((stage, index) => {
        const isCompleted = completedStages.includes(stage.stage) || stage.stage < currentStage;
        const isActive = stage.stage === currentStage;
        const isPending = stage.stage > currentStage && !isCompleted;

        return (
          <div key={stage.stage} className="flex items-center flex-1">
            <div className="qa-step flex-1">
              <div
                className={`qa-step-circle ${
                  isCompleted ? 'completed' : isActive ? 'active' : 'pending'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{stage.stage}</span>
                )}
              </div>
              <span className={`text-[9px] mt-1.5 font-medium text-center leading-tight ${
                isActive ? 'text-primary' : isCompleted ? 'text-status-rfu' : 'text-muted-foreground'
              }`}>
                {stage.name}
              </span>
            </div>
            {index < QA_STAGES.length - 1 && (
              <div className={`h-0.5 flex-1 mx-0.5 rounded-full mt-[-14px] ${
                isCompleted ? 'bg-status-rfu' : 'bg-border'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
