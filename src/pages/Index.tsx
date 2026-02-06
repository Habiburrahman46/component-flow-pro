import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, ClipboardCheck, Truck, CheckCircle2, Cog, AlertTriangle, Loader2 } from 'lucide-react';
import StatCard from '@/components/StatCard';
import ComponentTable from '@/components/ComponentTable';
import { mockFabricationRequests } from '@/data/mockData'; // Kita tetap pakai mock untuk request dulu
import { Component, COMPONENT_TYPES } from '@/types/component';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// URL API Google Script Anda
const API_URL = "https://script.google.com/macros/s/AKfycbwpnSovueVFpZM8rJnFJHp9tB4Era3SmEF35o5q7FHOHyo2fyXr3rznBpNTWd8oCG9sWw/exec";

export default function Dashboard() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // State untuk menyimpan data dari Google Sheet
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Transformasi Data: Mengubah Array 2D (Baris/Kolom) menjadi Array of Objects
        // Asumsi: Baris pertama Google Sheet adalah Header
        if (Array.isArray(data) && data.length > 1) {
          const headers = data[0].map((h: string) => h.toLowerCase()); // Header jadi huruf kecil
          
          const formattedData: Component[] = data.slice(1).map((row: any[], index: number) => {
            // Helper untuk ambil data berdasarkan nama kolom (atau index fallback)
            const getValue = (keyPart: string, fallbackIndex: number) => {
              const idx = headers.findIndex((h: string) => h.includes(keyPart));
              return idx !== -1 ? row[idx] : row[fallbackIndex];
            };

            // Mapping kolom Sheet ke format App
            // Pastikan kolom di Sheet mengandung kata kunci ini di Header-nya
            return {
              id: getValue('id', 0) || `ROW-${index}`, // Kolom 1
              name: getValue('nama', 1) || getValue('name', 1) || 'Unknown', // Kolom 2
              type: getValue('tipe', 2) || getValue('type', 2) || 'Other', // Kolom 3
              status: normalizeStatus(getValue('status', 3) || 'received'), // Kolom 4
              serialNumber: getValue('serial', 4) || '-', // Kolom 5
              location: getValue('lokasi', 5) || getValue('location', 5) || 'Workshop', // Kolom 6
              hm: Number(getValue('hm', 6)) || 0, // Kolom 7
            } as Component;
          });

          setComponents(formattedData);
        } else {
            console.warn("Data kosong atau format salah");
            setComponents([]);
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        setError("Gagal menghubungkan ke Google Sheet.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper: Normalisasi Status agar sesuai dengan badge warna
  // Mengubah "Ready For Use" -> "rfu", "Waiting Repair" -> "waiting-repair"
  const normalizeStatus = (rawStatus: string) => {
    const s = String(rawStatus).toLowerCase().trim();
    if (s.includes('ready') || s.includes('rfu')) return 'rfu';
    if (s.includes('install') || s.includes('pasang')) return 'installed';
    if (s.includes('vendor')) return 'vendor-repair';
    if (s.includes('waiting') || s.includes('tunggu')) return 'waiting-repair';
    if (s.includes('qa-1')) return 'qa-1';
    // Default fallback
    return s.replace(/\s+/g, '-'); 
  };

  // Kalkulasi Statistik secara Real-time dari data yang ditarik
  const stats = useMemo(() => {
    return {
      totalInWorkshop: components.length,
      waitingQA: components.filter(c => c.status.startsWith('qa')).length,
      atVendor: components.filter(c => c.status === 'vendor-repair').length,
      rfuStock: components.filter(c => c.status === 'rfu').length,
      installed: components.filter(c => c.status === 'installed').length,
      waitingRepair: components.filter(c => c.status === 'waiting-repair').length,
    };
  }, [components]);

  const statCards = [
    { label: 'Total Components', value: stats.totalInWorkshop, icon: Package, color: 'text-primary' },
    { label: 'Waiting QA', value: stats.waitingQA, icon: ClipboardCheck, color: 'text-status-qa' },
    { label: 'At Vendor', value: stats.atVendor, icon: Truck, color: 'text-status-vendor' },
    { label: 'RFU Stock', value: stats.rfuStock, icon: CheckCircle2, color: 'text-status-rfu' },
    { label: 'Installed', value: stats.installed, icon: Cog, color: 'text-status-installed' },
    { label: 'Waiting Repair', value: stats.waitingRepair, icon: AlertTriangle, color: 'text-status-waiting' },
  ];

  const filtered = components.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Menghubungkan ke Google Sheets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-200">
        <AlertTriangle className="h-10 w-10 mx-auto mb-2" />
        <p>{error}</p>
        <p className="text-sm mt-2 text-gray-600">Pastikan URL API benar dan Sheet memiliki akses 'Anyone'.</p>
      </div>
    );
  }

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
              <SelectItem value="qa-1">QA Process (All)</SelectItem>
              <SelectItem value="vendor-repair">Vendor Repair</SelectItem>
              <SelectItem value="rfu">RFU (Ready)</SelectItem>
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
            Showing {filtered.length} of {components.length} components
          </p>
        </div>

        <ComponentTable components={filtered} />
      </motion.div>

      {/* Recent Fabrication Requests (Masih Mock Data) */}
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
