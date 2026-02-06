import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, ArrowLeft, Search, Package, Wrench, Truck, CheckCircle2, ArrowDownToLine, ArrowUpFromLine, ClipboardCheck, FileCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockComponents, mockTimelineEvents, mockInstallRecords } from '@/data/mockData';
import { Component, TimelineEvent } from '@/types/component';
import StatusBadge from '@/components/StatusBadge';

const eventIcons: Record<TimelineEvent['type'], typeof Package> = {
  received: Package,
  qa: ClipboardCheck,
  repair: Wrench,
  vendor: Truck,
  rfu: CheckCircle2,
  installed: ArrowDownToLine,
  removed: ArrowUpFromLine,
  fabrication: FileCheck,
  approval: FileCheck,
};

const eventColors: Record<TimelineEvent['type'], string> = {
  received: 'bg-status-received text-primary-foreground',
  qa: 'bg-status-qa text-primary-foreground',
  repair: 'bg-status-waiting text-primary-foreground',
  vendor: 'bg-status-vendor text-primary-foreground',
  rfu: 'bg-status-rfu text-primary-foreground',
  installed: 'bg-status-installed text-primary-foreground',
  removed: 'bg-status-removed text-primary-foreground',
  fabrication: 'bg-status-approval text-primary-foreground',
  approval: 'bg-status-approval text-primary-foreground',
};

export default function ComponentTimeline() {
  const { componentId: paramId } = useParams();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(paramId || '');

  const component = mockComponents.find(c => c.id === selectedId);
  const events = mockTimelineEvents
    .filter(e => e.componentId === selectedId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const installHistory = mockInstallRecords.filter(r => r.componentId === selectedId);
  const totalLifetime = installHistory.reduce((sum, r) => sum + (r.lifetime || 0), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Component History</h1>
        <p className="text-sm text-muted-foreground mt-1">Full lifecycle timeline and accumulated lifetime data</p>
      </div>

      {/* Component Selector */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border p-5"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a component to view history" />
            </SelectTrigger>
            <SelectContent>
              {mockComponents.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.id} — {c.type} ({c.serialNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {component && (
        <>
          {/* Component Summary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl border p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-mono text-xl font-bold text-primary">{component.id}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {component.type} • SN: {component.serialNumber} • {component.modelCompatibility}
                </p>
              </div>
              <StatusBadge status={component.status} />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold font-mono">{component.cycles}</p>
                <p className="text-[11px] text-muted-foreground font-medium">Total Cycles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold font-mono text-status-rfu">{totalLifetime.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground font-medium">Total Lifetime (hrs)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold font-mono">
                  {component.cycles > 0 ? Math.round(totalLifetime / component.cycles).toLocaleString() : '—'}
                </p>
                <p className="text-[11px] text-muted-foreground font-medium">Avg per Cycle (hrs)</p>
              </div>
            </div>
          </motion.div>

          {/* Install/Remove History Table */}
          {installHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card rounded-xl border p-5"
            >
              <h3 className="text-sm font-semibold mb-4">Installation Cycles</h3>
              <div className="space-y-2">
                {installHistory.map((rec, i) => (
                  <div key={rec.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {installHistory.length - i}
                    </div>
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Unit</p>
                        <p className="font-mono font-semibold">{rec.unitId}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Period</p>
                        <p className="font-medium">{rec.installDate} → {rec.removeDate || 'Active'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">HM Range</p>
                        <p className="font-mono font-medium">{rec.hmStart.toLocaleString()} → {rec.hmEnd?.toLocaleString() || '—'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Lifetime</p>
                        {rec.lifetime ? (
                          <p className="font-mono font-bold text-status-rfu">{rec.lifetime.toLocaleString()} hrs</p>
                        ) : (
                          <p className="font-medium text-status-installed">In Service</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl border p-5"
          >
            <h3 className="text-sm font-semibold mb-6">Event Timeline</h3>
            
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />

              <div className="space-y-6">
                {events.map((event, i) => {
                  const Icon = eventIcons[event.type];
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.05 }}
                      className="flex gap-4 relative"
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${eventColors[event.type]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 pb-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold">{event.title}</p>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">{event.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {events.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No timeline events found for this component.
              </p>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
