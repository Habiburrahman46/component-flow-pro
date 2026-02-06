import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ClipboardCheck, Truck, CheckCircle2, Cog, AlertTriangle } from 'lucide-react';
import StatCard from '@/components/StatCard';
import ComponentTable from '@/components/ComponentTable';
import StatusBadge from '@/components/StatusBadge';
import { mockComponents, mockFabricationRequests, dashboardStats } from '@/data/mockData';
import { Component, ComponentStatus, COMPONENT_TYPES, ComponentType } from '@/types/component';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statCards = [
  { label: 'Total in Workshop', value: dashboardStats.totalInWorkshop, icon: Package, color: 'text-primary' },
  { label: 'Waiting QA', value: dashboardStats.waitingQA, icon: ClipboardCheck, color: 'text-status-qa' },
  { label: 'At Vendor', value: dashboardStats.atVendor, icon: Truck, color: 'text-status-vendor' },
  { label: 'RFU Stock', value: dashboardStats.rfuStock, icon: CheckCircle2, color: 'text-status-rfu' },
  { label: 'Installed', value: dashboardStats.installed, icon: Cog, color: 'text-status-installed' },
  { label: 'Waiting Repair', value: dashboardStats.waitingRepair, icon: AlertTriangle, color: 'text-status-waiting' },
];

export default function Dashboard() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = mockComponents.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Rotable Component Monitoring & Lifetime Tracking</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <StatCard 
            key={stat.label} 
            label={stat.label} 
            value={stat.value} 
            icon={stat.icon} 
            colorClass={stat.color}
            delay={i * 0.05}
          />
        ))}
      </div>

      {/* Filters + Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-card">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="qa-1">QA-1</SelectItem>
              <SelectItem value="qa-2">QA-2</SelectItem>
              <SelectItem value="qa-3">QA-3</SelectItem>
              <SelectItem value="qa-4">QA-4</SelectItem>
              <SelectItem value="qa-5">QA-5</SelectItem>
              <SelectItem value="qa-6">QA-6</SelectItem>
              <SelectItem value="qa-7">QA-7</SelectItem>
              <SelectItem value="vendor-repair">Vendor Repair</SelectItem>
              <SelectItem value="rfu">RFU</SelectItem>
              <SelectItem value="installed">Installed</SelectItem>
              <SelectItem value="waiting-repair">Waiting Repair</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-card">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {COMPONENT_TYPES.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1" />
          <p className="text-xs text-muted-foreground self-center">
            Showing {filtered.length} of {mockComponents.length} components
          </p>
        </div>

        <ComponentTable components={filtered} />
      </motion.div>

      {/* Recent Fabrication Requests */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-card rounded-xl border p-5"
      >
        <h2 className="text-sm font-semibold mb-4">Recent Fabrication Requests</h2>
        <div className="space-y-3">
          {mockFabricationRequests.map((req) => (
            <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-semibold text-primary">{req.componentId}</span>
                <span className="text-sm text-muted-foreground">{req.componentType}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground hidden sm:block">{req.vendorName}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  req.status === 'planner-approved' 
                    ? 'bg-status-rfu/15 text-status-rfu border-status-rfu/30' 
                    : req.status === 'gl-approved'
                    ? 'bg-status-approval/15 text-status-approval border-status-approval/30'
                    : 'bg-muted text-muted-foreground border-border'
                }`}>
                  {req.status === 'planner-approved' ? 'Approved' : req.status === 'gl-approved' ? 'GL Approved' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
