import { useState } from 'react';
import { motion } from 'framer-motion';
import { PackagePlus, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COMPONENT_TYPES } from '@/types/component';
import { mockComponents } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function ComponentIn() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [componentId, setComponentId] = useState('');
  const [idChecked, setIdChecked] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    serialNumber: '',
    fromUnitId: '',
    dateReceived: new Date().toISOString().split('T')[0],
    conditionNotes: '',
  });

  const handleCheckId = () => {
    if (!componentId.trim()) {
      toast({ title: 'Error', description: 'Please enter a Component ID', variant: 'destructive' });
      return;
    }
    const exists = mockComponents.some(c => c.id === componentId);
    setIdChecked(exists);
    if (exists) {
      toast({ title: 'Component Found', description: `${componentId} exists. Proceeding to QA-1.` });
    } else {
      toast({ title: 'New Component', description: 'Component ID not found. Please register this component.' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.serialNumber) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    toast({ title: 'Component Received', description: `${componentId || 'New component'} has been registered and sent to QA-1.` });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Component In</h1>
        <p className="text-sm text-muted-foreground mt-1">Receive and register incoming components</p>
      </div>

      {/* ID Check */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border p-6"
      >
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          Check Component ID
        </h2>
        <div className="flex gap-3">
          <Input
            placeholder="Enter Component ID (e.g., CMP-2024-001)"
            value={componentId}
            onChange={(e) => { setComponentId(e.target.value); setIdChecked(null); }}
            className="font-mono"
          />
          <Button onClick={handleCheckId} className="shrink-0">
            Check
          </Button>
        </div>
        {idChecked !== null && (
          <div className={`mt-3 p-3 rounded-lg text-sm ${
            idChecked 
              ? 'bg-status-rfu/10 text-status-rfu border border-status-rfu/20' 
              : 'bg-status-qa/10 text-status-qa border border-status-qa/20'
          }`}>
            {idChecked 
              ? '✓ Component found in database. It will proceed to QA-1 inspection.' 
              : '⚠ Component not found. Please fill the registration form below.'}
            {idChecked && (
              <Button 
                size="sm" 
                className="mt-2"
                onClick={() => navigate(`/qa-tracker/${componentId}`)}
              >
                Go to QA-1 <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        )}
      </motion.div>

      {/* Registration Form */}
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="bg-card rounded-xl border p-6 space-y-5"
      >
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <PackagePlus className="w-4 h-4 text-primary" />
          Receiving Form
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Component Type *</Label>
            <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {COMPONENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Serial Number *</Label>
            <Input 
              placeholder="e.g., TR-SN-88412" 
              className="font-mono"
              value={formData.serialNumber}
              onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>From Unit ID</Label>
            <Input 
              placeholder="e.g., EX-2200-017" 
              className="font-mono"
              value={formData.fromUnitId}
              onChange={(e) => setFormData({...formData, fromUnitId: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Date Received</Label>
            <Input 
              type="date" 
              value={formData.dateReceived}
              onChange={(e) => setFormData({...formData, dateReceived: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Condition Notes</Label>
          <Textarea 
            placeholder="Describe the condition of the component..."
            value={formData.conditionNotes}
            onChange={(e) => setFormData({...formData, conditionNotes: e.target.value})}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit">
            <PackagePlus className="w-4 h-4 mr-2" />
            Register & Send to QA-1
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
