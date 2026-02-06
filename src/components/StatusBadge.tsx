import { ComponentStatus, STATUS_LABELS, STATUS_COLOR_MAP, StatusColorKey } from '@/types/component';
import { cn } from '@/lib/utils';

const colorClasses: Record<StatusColorKey, string> = {
  received: 'bg-status-received/15 text-status-received border-status-received/30',
  qa: 'bg-status-qa/15 text-status-qa border-status-qa/30',
  approval: 'bg-status-approval/15 text-status-approval border-status-approval/30',
  vendor: 'bg-status-vendor/15 text-status-vendor border-status-vendor/30',
  rfu: 'bg-status-rfu/15 text-status-rfu border-status-rfu/30',
  installed: 'bg-status-installed/15 text-status-installed border-status-installed/30',
  removed: 'bg-status-removed/15 text-status-removed border-status-removed/30',
  waiting: 'bg-status-waiting/15 text-status-waiting border-status-waiting/30',
};

interface StatusBadgeProps {
  status: ComponentStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorKey = STATUS_COLOR_MAP[status];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
        colorClasses[colorKey],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
