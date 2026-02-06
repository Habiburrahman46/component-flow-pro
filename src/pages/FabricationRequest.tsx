import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Send, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockFabricationRequests } from '@/data/mockData';
import { COMPONENT_TYPES } from '@/types/component';
import { useToast } from '@/hooks/use-toast';

export default function FabricationRequest() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    componentId: '',
    reason: '',
    vendorName: '',
    estimatedCost: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.componentId || !formData.reason) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    toast({ title: 'Request Submitted', description: 'Fabrication request sent for GL approval.' });
  };

  const handleApprove = (id: string, level: string) => {
    toast({ title: `${level} Approved`, description: `Fabrication request ${id} approved.` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fabrication Request</h1>
        <p className="text-sm text-muted-foreground mt-1">Submit and track vendor repair requests with approval flow</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Request Form */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-card rounded-xl border p-6 space-y-5 h-fit"
        >
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            New Fabrication Request
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Component ID *</Label>
              <Input 
                placeholder="CMP-2024-XXX" 
                className="font-mono"
                value={formData.componentId}
                onChange={(e) => setFormData({...formData, componentId: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Reason for Outsource *</Label>
              <Select value={formData.reason} onValueChange={(v) => setFormData({...formData, reason: v})}>
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-tools">No Tools / Equipment Available</SelectItem>
                  <SelectItem value="major-damage">Major Damage Beyond Capability</SelectItem>
                  <SelectItem value="specialized">Requires Specialized Vendor Work</SelectItem>
                  <SelectItem value="warranty">Warranty Claim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Vendor Name</Label>
              <Input 
                placeholder="e.g., PT. Trakindo Utama"
                value={formData.vendorName}
                onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Estimated Cost (IDR)</Label>
              <Input 
                type="number" 
                placeholder="e.g., 15000000"
                className="font-mono"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea 
                placeholder="Describe the required work..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Submit for GL Approval
          </Button>
        </motion.form>

        {/* Existing Requests */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-sm font-semibold">Active Requests</h2>
          {mockFabricationRequests.map((req) => (
            <div key={req.id} className="bg-card rounded-xl border p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-sm font-bold text-primary">{req.componentId}</p>
                  <p className="text-xs text-muted-foreground mt-1">{req.componentType} • {req.id}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  req.status === 'planner-approved' 
                    ? 'bg-status-rfu/15 text-status-rfu border-status-rfu/30' 
                    : req.status === 'gl-approved'
                    ? 'bg-status-approval/15 text-status-approval border-status-approval/30'
                    : 'bg-muted text-muted-foreground border-border'
                }`}>
                  {req.status === 'planner-approved' ? '✓ Fully Approved' : req.status === 'gl-approved' ? 'Awaiting Planner' : 'Awaiting GL'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Vendor</p>
                  <p className="font-medium">{req.vendorName || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Est. Cost</p>
                  <p className="font-mono font-medium">IDR {req.estimatedCost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reason</p>
                  <p className="font-medium">{req.reason}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created By</p>
                  <p className="font-medium">{req.createdBy}</p>
                </div>
              </div>

              {/* Approval Actions */}
              {req.status === 'pending' && (
                <div className="flex gap-2 pt-1">
                  <Button size="sm" onClick={() => handleApprove(req.id, 'GL')}>
                    <CheckCircle2 className="w-3 h-3 mr-1" /> GL Approve
                  </Button>
                  <Button size="sm" variant="outline">
                    <XCircle className="w-3 h-3 mr-1" /> Reject
                  </Button>
                </div>
              )}
              {req.status === 'gl-approved' && (
                <div className="flex gap-2 pt-1">
                  <Button size="sm" onClick={() => handleApprove(req.id, 'Planner')}>
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Planner Approve
                  </Button>
                  <Button size="sm" variant="outline">
                    <XCircle className="w-3 h-3 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
