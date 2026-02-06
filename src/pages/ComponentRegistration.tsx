import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COMPONENT_TYPES } from '@/types/component';
import { useToast } from '@/hooks/use-toast';

export default function ComponentRegistration() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    category: '',
    oemPartNumber: '',
    modelCompatibility: '',
    vendorReference: '',
  });

  const generatedId = `CMP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      toast({ title: 'Error', description: 'Please select a category', variant: 'destructive' });
      return;
    }
    toast({ title: 'Component Registered', description: `Component ${generatedId} registered successfully.` });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Component Registration</h1>
        <p className="text-sm text-muted-foreground mt-1">Register a new component into the master database</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-card rounded-xl border p-6 space-y-5"
      >
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary" />
          New Component
        </h2>

        <div className="p-3 rounded-lg bg-accent border border-primary/10">
          <p className="text-xs text-muted-foreground">Auto-generated Component ID</p>
          <p className="font-mono text-lg font-bold text-primary mt-0.5">{generatedId}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Component Category *</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {COMPONENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>OEM Part Number</Label>
            <Input 
              placeholder="e.g., 20Y-30-00014" 
              className="font-mono"
              value={formData.oemPartNumber}
              onChange={(e) => setFormData({...formData, oemPartNumber: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Model Compatibility</Label>
            <Input 
              placeholder="e.g., PC200-8"
              value={formData.modelCompatibility}
              onChange={(e) => setFormData({...formData, modelCompatibility: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Vendor Reference</Label>
            <Input 
              placeholder="e.g., PT. Trakindo"
              value={formData.vendorReference}
              onChange={(e) => setFormData({...formData, vendorReference: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit">
            <ClipboardList className="w-4 h-4 mr-2" />
            Register Component
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
