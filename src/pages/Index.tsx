import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/StatCard";
import { Package, Wrench, CheckCircle2, Clock, RotateCcw, Truck } from "lucide-react";
import { Component } from "@/types/component";

// --- URL API SHEETDB ANDA ---
const API_URL = "https://sheetdb.io/api/v1/2tawrqfufoll5";

export default function Index() {
  // Mengambil data dari Google Sheet
  const { data: components, isLoading, error } = useQuery({
    queryKey: ['components'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Gagal mengambil data dari Google Sheet");
      return response.json();
    },
    initialData: [],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-lg font-medium text-muted-foreground animate-pulse">
          Sedang memuat data dari Spreadsheet...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg border border-red-200">
        <h3 className="font-bold text-lg mb-2">Terjadi Kesalahan</h3>
        <p>Gagal terhubung ke Database. Pastikan URL API benar atau cek koneksi internet Anda.</p>
      </div>
    );
  }

  // Menghitung Statistik secara Real-time dari data API
  const stats = {
    totalInWorkshop: components.filter((c: Component) => c.status !== 'installed').length,
    waitingQA: components.filter((c: Component) => c.status.startsWith('qa-')).length,
    atVendor: components.filter((c: Component) => c.status === 'vendor-repair').length,
    rfuStock: components.filter((c: Component) => c.status === 'rfu').length,
    installed: components.filter((c: Component) => c.status === 'installed').length,
    waitingRepair: components.filter((c: Component) => c.status === 'waiting-repair' || c.status === 'received').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Status pelacakan komponen terkini</p>
        </div>
        <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          Total Data: {components.length}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total In Workshop" 
          value={stats.totalInWorkshop} 
          icon={Package} 
          description="Komponen aktif di workshop" 
        />
        <StatCard 
          title="Waiting QA" 
          value={stats.waitingQA} 
          icon={CheckCircle2} 
          description="Menunggu inspeksi" 
          className="bg-blue-50/50" 
        />
        <StatCard 
          title="Waiting Repair" 
          value={stats.waitingRepair} 
          icon={Wrench} 
          description="Antrian perbaikan" 
          className="bg-orange-50/50" 
        />
        <StatCard 
          title="At Vendor" 
          value={stats.atVendor} 
          icon={Truck} 
          description="Sedang di vendor luar" 
        />
        <StatCard 
          title="RFU Stock" 
          value={stats.rfuStock} 
          icon={RotateCcw} 
          description="Siap digunakan" 
          className="bg-green-50/50" 
        />
        <StatCard 
          title="Installed" 
          value={stats.installed} 
          icon={Clock} 
          description="Terpasang di unit" 
        />
      </div>

      {/* Tabel Preview Singkat (Opsional) */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 border-b">
          <h3 className="font-semibold">Aktivitas Terbaru</h3>
        </div>
        <div className="p-0">
          {components.length > 0 ? (
            <div className="divide-y">
              {components.slice(0, 5).map((comp: Component) => (
                <div key={comp.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{comp.serialNumber} - {comp.type}</p>
                    <p className="text-xs text-muted-foreground capitalize">Status: {comp.status.replace('-', ' ')}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{comp.dateReceived}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground">Belum ada data komponen.</div>
          )}
        </div>
      </div>
    </div>
  );
}
