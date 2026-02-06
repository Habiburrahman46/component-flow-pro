// src/pages/Index.tsx (Contoh perbaikan)
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { mockComponents } from "@/data/mockData"; // Fallback jika API error
import { StatCard } from "@/components/StatCard"; // Asumsi path
// ... import komponen UI lainnya

export default function Index() {
  // Menggunakan React Query untuk fetch data
  const { data: components, isLoading, error } = useQuery({
    queryKey: ['components'],
    queryFn: api.getComponents,
    initialData: [], // Bisa gunakan mockComponents sebagai data awal jika mau
  });

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading data</div>;

  // Hitung statistik secara dinamis berdasarkan data API
  const stats = {
    totalInWorkshop: components.filter(c => c.status !== 'installed').length,
    rfuStock: components.filter(c => c.status === 'rfu').length,
    // ... hitung statistik lain
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {/* Render komponen UI menggunakan variabel 'stats' dan 'components' */}
    </div>
  );
}
