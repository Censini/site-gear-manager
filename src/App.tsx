
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import EquipmentDetail from "./pages/EquipmentDetail";
import Sites from "./pages/Sites";
import SiteDetail from "./pages/SiteDetail";
import IPAM from "./pages/IPAM";
import Connections from "./pages/Connections";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/equipment" element={
            <MainLayout>
              <Equipment />
            </MainLayout>
          } />
          <Route path="/equipment/:id" element={
            <MainLayout>
              <EquipmentDetail />
            </MainLayout>
          } />
          <Route path="/sites" element={
            <MainLayout>
              <Sites />
            </MainLayout>
          } />
          <Route path="/sites/:id" element={
            <MainLayout>
              <SiteDetail />
            </MainLayout>
          } />
          <Route path="/connections" element={
            <MainLayout>
              <Connections />
            </MainLayout>
          } />
          <Route path="/ipam" element={
            <MainLayout>
              <IPAM />
            </MainLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
