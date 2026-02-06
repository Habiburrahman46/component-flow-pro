import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PackagePlus, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COMPONENT_TYPES } from "@/types/component";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// --- URL API SHEETDB ANDA ---
const API_URL = "https://sheetdb.io/api/v1/2tawrqfufoll5";

const formSchema = z.object({
  type: z.string().min(1, "Tipe komponen wajib dipilih"),
  serialNumber: z.string().min(1, "Serial number wajib diisi"),
  fromUnitId: z.string().min(1, "Unit ID wajib diisi"),
  oemPartNumber: z.string().optional(),
  conditionNotes: z.string().optional(),
});

export default function ComponentIn() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      serialNumber: "",
      fromUnitId: "",
      oemPartNumber: "",
      conditionNotes: "",
    },
  });

  // Logika Pengiriman Data ke SheetDB
  const mutation = useMutation({
    mutationFn: async (newData: any) => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // SheetDB butuh format { data: object }
        body: JSON.stringify({ data: newData }),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan ke Spreadsheet");
      }
      return response.json();
    },
    onSuccess: () => {
      // Refresh cache agar dashboard terupdate otomatis
      queryClient.invalidateQueries({ queryKey: ['components'] });
      
      toast({
        title: "Berhasil!",
        description: "Data komponen telah disimpan ke Google Sheet.",
      });
      
      // Kembali ke dashboard setelah sukses
      navigate("/");
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Gagal",
        description: "Gagal menyimpan data. Cek koneksi internet Anda.",
        variant: "destructive",
      });
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Siapkan struktur data lengkap
    const newComponent = {
      id: `CMP-${Date.now()}`,
      ...values,
      status: 'received',
      dateReceived: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
      totalLifetime: 0,
      cycles: 0,
      currentQAStage: 0
    };

    mutation.mutate(newComponent);
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <PackagePlus className="w-8 h-8 text-primary" />
          Component In
        </h1>
        <p className="text-muted-foreground mt-1">Registrasi komponen masuk dari unit</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Komponen</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Component Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Komponen</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Tipe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COMPONENT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Serial Number */}
                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: TR-88412" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* From Unit */}
                <FormField
                  control={form.control}
                  name="fromUnitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dari Unit ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: EX-2200-017" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* OEM Part Number */}
                <FormField
                  control={form.control}
                  name="oemPartNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Part Number (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: 20Y-30-00014" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Condition Notes */}
              <FormField
                control={form.control}
                name="conditionNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catatan Kondisi Awal</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Deskripsikan kondisi fisik komponen saat diterima..." 
                        className="h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full md:w-auto"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Data
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
