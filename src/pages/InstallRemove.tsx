import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from '@/components/StatusBadge';
import { mockComponents, mockInstallRecords } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function InstallRemove() {
  const { toast } = useToast();
  const [installForm, setInstallForm] = useState({ componentId: '', unitId: '', installDate: '', hmStart: '' });
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [removeForm, setRemoveForm] = useState({ removeDate: '', hmEnd: '', reason: '' });

  const rfuComponents = mockComponents.filter(c => c.status === 'rfu');
  const installedRecords = mockInstallRecords.filter(r => !r.removeDate);
  const historyRecords = mockInstallRecords.filter(r => r.removeDate);

  const handleInstall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!installForm.componentId || !installForm.unitId || !installForm.hmStart) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    toast({ title: 'Component Installed', description: `${installForm.componentId} installed to ${installForm.unitId}. Lifetime tracking started.` });
    setInstallForm({ componentId: '', unitId: '', installDate: '', hmStart: '' });
  };

  const handleRemove = () => {
    if (!removeForm.hmEnd || !removeForm.reason) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    toast({ title: 'Component Removed', description: `Component removed. Lifetime calculated. Sent to QA-1.` });
    setRemoveDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Install / Remove</h1>
        <p className="text-sm text-muted-foreground mt-1">Track component installation and removal with lifetime calculation</p>
      </div>

      <Tabs defaultValue="install">
        <TabsList className="bg-card border">
          <TabsTrigger value="install" className="gap-1.5">
            <ArrowDownToLine className="w-3.5 h-3.5" /> Install
          </TabsTrigger>
          <TabsTrigger value="installed" className="gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5" /> Currently Installed
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <ArrowUpFromLine className="w-3.5 h-3.5" /> Removal History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="install" className="mt-4">
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleInstall}
            className="bg-card rounded-xl border p-6 space-y-5 max-w-2xl"
          >
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4 text-primary" />
              Install Component to Unit
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Component ID *</Label>
                <Select value={installForm.componentId} onValueChange={(v) => setInstallForm({...installForm, componentId: v})}>
                  <SelectTrigger><SelectValue placeholder="Select RFU component" /></SelectTrigger>
                  <SelectContent>
                    {rfuComponents.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.id} — {c.type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Unit ID *</Label>
                <Input 
                  placeholder="e.g., EX-2200-017" 
                  className="font-mono"
                  value={installForm.unitId}
                  onChange={(e) => setInstallForm({...installForm, unitId: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Install Date</Label>
                <Input 
                  type="date"
                  value={installForm.installDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setInstallForm({...installForm, installDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>HM Start (Hour Meter) *</Label>
                <Input 
                  type="number" 
                  placeholder="e.g., 12500"
                  className="font-mono"
                  value={installForm.hmStart}
                  onChange={(e) => setInstallForm({...installForm, hmStart: e.target.value})}
                />
              </div>
            </div>

            <Button type="submit">
              <ArrowDownToLine className="w-4 h-4 mr-2" /> Install & Start Tracking
            </Button>
          </motion.form>
        </TabsContent>

        <TabsContent value="installed" className="mt-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-card rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Component</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Type</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Unit</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Install Date</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">HM Start</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {installedRecords.map((rec) => (
                    <TableRow key={rec.id} className="hover:bg-muted/20">
                      <TableCell className="font-mono text-sm font-semibold text-primary">{rec.componentId}</TableCell>
                      <TableCell className="text-sm">{rec.componentType}</TableCell>
                      <TableCell className="font-mono text-sm">{rec.unitId}</TableCell>
                      <TableCell className="text-sm">{rec.installDate}</TableCell>
                      <TableCell className="font-mono text-sm">{rec.hmStart.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Dialog open={removeDialogOpen && selectedRecord === rec.id} onOpenChange={(open) => {
                          setRemoveDialogOpen(open);
                          if (open) setSelectedRecord(rec.id);
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="text-xs">
                              <ArrowUpFromLine className="w-3 h-3 mr-1" /> Remove
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Remove {rec.componentId} from {rec.unitId}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-2">
                              <div className="p-3 rounded-lg bg-muted/50 text-xs">
                                <span className="text-muted-foreground">HM at Install:</span>{' '}
                                <span className="font-mono font-bold">{rec.hmStart.toLocaleString()}</span>
                              </div>
                              <div className="space-y-2">
                                <Label>Remove Date</Label>
                                <Input 
                                  type="date"
                                  value={removeForm.removeDate || new Date().toISOString().split('T')[0]}
                                  onChange={(e) => setRemoveForm({...removeForm, removeDate: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>HM End (Hour Meter) *</Label>
                                <Input 
                                  type="number" 
                                  placeholder="Current hour meter reading"
                                  className="font-mono"
                                  value={removeForm.hmEnd}
                                  onChange={(e) => setRemoveForm({...removeForm, hmEnd: e.target.value})}
                                />
                                {removeForm.hmEnd && (
                                  <p className="text-xs text-status-rfu font-semibold">
                                    Lifetime: {(Number(removeForm.hmEnd) - rec.hmStart).toLocaleString()} hours
                                  </p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label>Removal Reason *</Label>
                                <Select value={removeForm.reason} onValueChange={(v) => setRemoveForm({...removeForm, reason: v})}>
                                  <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="leak">Leak</SelectItem>
                                    <SelectItem value="broken">Broken</SelectItem>
                                    <SelectItem value="wear">Wear / End of Life</SelectItem>
                                    <SelectItem value="scheduled">Scheduled Maintenance</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button onClick={handleRemove} variant="destructive" className="w-full">
                                <ArrowUpFromLine className="w-4 h-4 mr-2" /> Remove & Send to QA-1
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-card rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Component</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Unit</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Install</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Remove</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">HM Start</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">HM End</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Lifetime</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyRecords.map((rec) => (
                    <TableRow key={rec.id} className="hover:bg-muted/20">
                      <TableCell className="font-mono text-sm font-semibold text-primary">{rec.componentId}</TableCell>
                      <TableCell className="font-mono text-sm">{rec.unitId}</TableCell>
                      <TableCell className="text-sm">{rec.installDate}</TableCell>
                      <TableCell className="text-sm">{rec.removeDate}</TableCell>
                      <TableCell className="font-mono text-sm">{rec.hmStart.toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-sm">{rec.hmEnd?.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="font-mono text-sm font-bold text-status-rfu">
                          {rec.lifetime?.toLocaleString()} hrs
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{rec.removalReason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
