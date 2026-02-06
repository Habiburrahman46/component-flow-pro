import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Wrench, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import QAProgressBar from '@/components/QAProgressBar';
import StatusBadge from '@/components/StatusBadge';
import { mockComponents, mockQARecords } from '@/data/mockData';
import { QA_STAGES } from '@/types/component';
import { useToast } from '@/hooks/use-toast';

export default function QADetail() {
  const { componentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const component = mockComponents.find(c => c.id === componentId);

  const [qaRecords, setQaRecords] = useState(mockQARecords.filter(r => r.componentId === componentId));
  const [notes, setNotes] = useState('');

  if (!component) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold">Component not found</p>
          <Button variant="outline" className="mt-3" onClick={() => navigate('/qa-tracker')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to QA Tracker
          </Button>
        </div>
      </div>
    );
  }

  const currentStage = component.currentQAStage || 1;
  const completedStages = qaRecords.filter(r => r.status === 'completed').map(r => r.stage);

  const handleCompleteStage = (stage: number) => {
    toast({ title: 'Stage Completed', description: `QA-${stage} marked as completed for ${componentId}` });
  };

  const handleCreateFabRequest = () => {
    navigate('/fabrication', { state: { componentId } });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/qa-tracker')} className="text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to QA Tracker
      </Button>

      {/* Component Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="font-mono text-xl font-bold text-primary">{component.id}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {component.type} • SN: {component.serialNumber}
            </p>
          </div>
          <StatusBadge status={component.status} />
        </div>

        <QAProgressBar currentStage={currentStage} completedStages={completedStages} />
      </motion.div>

      {/* Decision Panel at QA-1 */}
      {currentStage === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-accent rounded-xl border border-primary/20 p-5"
        >
          <h3 className="text-sm font-semibold mb-3">Repair Decision</h3>
          <p className="text-xs text-muted-foreground mb-4">
            After QA-1 inspection, choose the repair path for this component.
          </p>
          <div className="flex gap-3">
            <Button size="sm" onClick={() => handleCompleteStage(1)}>
              <Wrench className="w-3 h-3 mr-1.5" />
              Internal Repair (Continue QA)
            </Button>
            <Button size="sm" variant="outline" onClick={handleCreateFabRequest}>
              <Send className="w-3 h-3 mr-1.5" />
              Cannot Repair → Fabrication Request
            </Button>
          </div>
        </motion.div>
      )}

      {/* QA Stages Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Accordion type="multiple" defaultValue={[`stage-${currentStage}`]} className="space-y-3">
          {QA_STAGES.map((stage) => {
            const record = qaRecords.find(r => r.stage === stage.stage);
            const isCompleted = record?.status === 'completed';
            const isActive = stage.stage === currentStage;
            const isPending = stage.stage > currentStage;

            return (
              <AccordionItem
                key={stage.stage}
                value={`stage-${stage.stage}`}
                className={`bg-card rounded-xl border overflow-hidden ${
                  isActive ? 'border-primary/30 ring-1 ring-primary/10' : ''
                }`}
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted 
                        ? 'bg-status-rfu text-primary-foreground' 
                        : isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : stage.stage}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">{stage.name}: {stage.title}</p>
                      {record?.mechanicName && (
                        <p className="text-[11px] text-muted-foreground">
                          By {record.mechanicName} • {record.dateUpdated}
                        </p>
                      )}
                    </div>
                    {isCompleted && (
                      <span className="ml-2 text-[10px] font-semibold bg-status-rfu/15 text-status-rfu px-2 py-0.5 rounded-full">
                        COMPLETED
                      </span>
                    )}
                    {isActive && !isCompleted && (
                      <span className="ml-2 text-[10px] font-semibold bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                        IN PROGRESS
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  {isPending && !record ? (
                    <p className="text-sm text-muted-foreground py-4">
                      This stage will be available after previous stages are completed.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {/* Checklist */}
                      <div className="space-y-2.5">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Checklist Items</Label>
                        {(record?.checklistItems || [
                          { id: '1', label: 'Inspection step 1', checked: false },
                          { id: '2', label: 'Inspection step 2', checked: false },
                          { id: '3', label: 'Documentation complete', checked: false },
                          { id: '4', label: 'Sign-off ready', checked: false },
                        ]).map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
                            <Checkbox 
                              checked={item.checked} 
                              disabled={isCompleted || isPending}
                            />
                            <span className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Notes */}
                      {record?.notes && (
                        <div>
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Notes</Label>
                          <p className="text-sm mt-1 p-3 rounded-lg bg-muted/30">{record.notes}</p>
                        </div>
                      )}

                      {/* Action */}
                      {isActive && !isCompleted && (
                        <div className="space-y-3 pt-2">
                          <Textarea 
                            placeholder="Add inspection notes..." 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                          />
                          <Button size="sm" onClick={() => handleCompleteStage(stage.stage)}>
                            <Check className="w-3 h-3 mr-1.5" />
                            Complete {stage.name}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </motion.div>
    </div>
  );
}
