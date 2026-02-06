// src/pages/ComponentIn.tsx (Snippet Bagian Submit)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"; // Pastikan path benar

export default function ComponentIn() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: api.addComponent,
    onSuccess: () => {
      // PENTING: Refresh data di cache agar Dashboard terupdate
      queryClient.invalidateQueries({ queryKey: ['components'] });
      
      toast({ title: "Success", description: "Component Registered" });
      navigate("/"); // Kembali ke dashboard
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save data", variant: "destructive" });
    }
  });

  const onSubmit = (values: any) => {
    // Format data sesuai tipe Component
    const newComponent = {
      ...values,
      id: `CMP-${Date.now()}`, // Generate ID unik sederhana
      dateReceived: new Date().toISOString().split('T')[0],
      totalLifetime: 0,
      cycles: 0
    };
    mutation.mutate(newComponent);
  };

  // ... return JSX Form
}
