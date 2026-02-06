import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import ComponentIn from "./pages/ComponentIn";
import ComponentRegistration from "./pages/ComponentRegistration";
import QATracker from "./pages/QATracker";
import QADetail from "./pages/QADetail";
import FabricationRequest from "./pages/FabricationRequest";
import RFUStock from "./pages/RFUStock";
import InstallRemove from "./pages/InstallRemove";
import ComponentTimeline from "./pages/ComponentTimeline";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/component-in" element={<ComponentIn />} />
            <Route path="/registration" element={<ComponentRegistration />} />
            <Route path="/qa-tracker" element={<QATracker />} />
            <Route path="/qa-tracker/:componentId" element={<QADetail />} />
            <Route path="/fabrication" element={<FabricationRequest />} />
            <Route path="/rfu-stock" element={<RFUStock />} />
            <Route path="/install-remove" element={<InstallRemove />} />
            <Route path="/timeline" element={<ComponentTimeline />} />
            <Route path="/timeline/:componentId" element={<ComponentTimeline />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
