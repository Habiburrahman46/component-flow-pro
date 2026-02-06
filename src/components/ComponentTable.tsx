import { Component } from '@/types/component';
import StatusBadge from './StatusBadge';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ComponentTableProps {
  components: Component[];
  showActions?: boolean;
}

export default function ComponentTable({ components, showActions = true }: ComponentTableProps) {
  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="text-xs font-semibold uppercase tracking-wider">Component ID</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider">Type</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Serial No.</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Unit</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Lifetime (hrs)</TableHead>
            {showActions && <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.map((comp) => (
            <TableRow key={comp.id} className="hover:bg-muted/20 transition-colors">
              <TableCell>
                <span className="font-mono text-sm font-semibold text-primary">{comp.id}</span>
              </TableCell>
              <TableCell className="text-sm">{comp.type}</TableCell>
              <TableCell className="text-sm font-mono text-muted-foreground hidden md:table-cell">{comp.serialNumber}</TableCell>
              <TableCell><StatusBadge status={comp.status} /></TableCell>
              <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">{comp.fromUnitId || '—'}</TableCell>
              <TableCell className="text-sm font-mono hidden lg:table-cell">{comp.totalLifetime.toLocaleString()}</TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {comp.status.startsWith('qa-') && (
                      <Link 
                        to={`/qa-tracker/${comp.id}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Update QA
                      </Link>
                    )}
                    <Link 
                      to={`/timeline/${comp.id}`}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      History
                    </Link>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
          {components.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No components found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
