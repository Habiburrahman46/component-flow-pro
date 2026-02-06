import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';
import { mockComponents } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import QAProgressBar from '@/components/QAProgressBar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function QATracker() {
  const [stageFilter, setStageFilter] = useState<string>('all');

  const qaComponents = mockComponents.filter(c => 
    c.status.startsWith('qa-') || c.status === 'received' || c.status === 'waiting-repair'
  );

  const filtered = stageFilter === 'all' 
    ? qaComponents 
    : qaComponents.filter(c => c.status === stageFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">QA Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor component inspection progress (QA-1 → QA-7)</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex gap-3 mb-4">
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[200px] bg-card">
              <SelectValue placeholder="Filter by Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="qa-1">QA-1</SelectItem>
              <SelectItem value="qa-2">QA-2</SelectItem>
              <SelectItem value="qa-3">QA-3</SelectItem>
              <SelectItem value="qa-4">QA-4</SelectItem>
              <SelectItem value="qa-5">QA-5</SelectItem>
              <SelectItem value="qa-6">QA-6</SelectItem>
              <SelectItem value="qa-7">QA-7</SelectItem>
              <SelectItem value="waiting-repair">Waiting Repair</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground self-center ml-auto">
            {filtered.length} component(s) in QA process
          </p>
        </div>

        <div className="bg-card rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Component</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Type</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider hidden lg:table-cell min-w-[300px]">QA Progress</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((comp) => (
                <TableRow key={comp.id} className="hover:bg-muted/20">
                  <TableCell>
                    <span className="font-mono text-sm font-semibold text-primary">{comp.id}</span>
                    <p className="text-[11px] text-muted-foreground font-mono">{comp.serialNumber}</p>
                  </TableCell>
                  <TableCell className="text-sm">{comp.type}</TableCell>
                  <TableCell><StatusBadge status={comp.status} /></TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {comp.currentQAStage ? (
                      <QAProgressBar currentStage={comp.currentQAStage} />
                    ) : (
                      <span className="text-xs text-muted-foreground">Not started</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/qa-tracker/${comp.id}`}>
                      <Button size="sm" variant="outline" className="text-xs">
                        <ClipboardCheck className="w-3 h-3 mr-1" />
                        Update QA
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}
