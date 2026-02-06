import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, FileOutput, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/StatusBadge';
import { mockComponents } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function RFUStock() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [outDialogOpen, setOutDialogOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [outForm, setOutForm] = useState({ dateOut: '', takenBy: '', destination: '' });

  const rfuComponents = mockComponents.filter(c => c.status === 'rfu');
  const filtered = rfuComponents.filter(c =>
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase()) ||
    c.serialNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleOut = () => {
    if (!outForm.takenBy || !outForm.destination) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    toast({ title: 'Component Released', description: `${selectedComponent} has been released to ${outForm.destination}.` });
    setOutDialogOpen(false);
    setOutForm({ dateOut: '', takenBy: '', destination: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">RFU Stock</h1>
        <p className="text-sm text-muted-foreground mt-1">Components Ready For Use — available for installation</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search RFU components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <p className="text-xs text-muted-foreground self-center ml-auto">
            {filtered.length} component(s) in RFU stock
          </p>
        </div>

        <div className="bg-card rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Component ID</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Type</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Serial No.</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Model</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((comp) => (
                <TableRow key={comp.id} className="hover:bg-muted/20">
                  <TableCell className="font-mono text-sm font-semibold text-primary">{comp.id}</TableCell>
                  <TableCell className="text-sm">{comp.type}</TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground hidden md:table-cell">{comp.serialNumber}</TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{comp.modelCompatibility || '—'}</TableCell>
                  <TableCell><StatusBadge status={comp.status} /></TableCell>
                  <TableCell className="text-right">
                    <Dialog open={outDialogOpen && selectedComponent === comp.id} onOpenChange={(open) => {
                      setOutDialogOpen(open);
                      if (open) setSelectedComponent(comp.id);
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-xs">
                          <FileOutput className="w-3 h-3 mr-1" /> Out Component
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Component Out — {comp.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label>Date Out</Label>
                            <Input 
                              type="date" 
                              value={outForm.dateOut || new Date().toISOString().split('T')[0]}
                              onChange={(e) => setOutForm({...outForm, dateOut: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Taken By (Picker Name) *</Label>
                            <Input 
                              placeholder="Enter picker name"
                              value={outForm.takenBy}
                              onChange={(e) => setOutForm({...outForm, takenBy: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Destination *</Label>
                            <Input 
                              placeholder="Warehouse / Unit ID"
                              value={outForm.destination}
                              onChange={(e) => setOutForm({...outForm, destination: e.target.value})}
                            />
                          </div>
                          <Button onClick={handleOut} className="w-full">
                            <FileOutput className="w-4 h-4 mr-2" /> Release Component
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No RFU components found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}
