
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import EquipmentDetail from "./pages/EquipmentDetail";
import AddEquipment from "./pages/AddEquipment";
import EditEquipment from "./pages/EditEquipment";
import Sites from "./pages/Sites";
import SiteDetail from "./pages/SiteDetail";
import AddSite from "./pages/AddSite";
import EditSite from "./pages/EditSite";
import IPAM from "./pages/IPAM";
import Connections from "./pages/Connections";
import AddConnection from "./pages/AddConnection";
import EditConnection from "./pages/EditConnection";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route element={<ProtectedRoute />}>
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
                <Route path="/equipment/add" element={
                  <MainLayout>
                    <AddEquipment />
                  </MainLayout>
                } />
                <Route path="/equipment/edit/:id" element={
                  <MainLayout>
                    <EditEquipment />
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
                <Route path="/sites/add" element={
                  <MainLayout>
                    <AddSite />
                  </MainLayout>
                } />
                <Route path="/sites/edit/:id" element={
                  <MainLayout>
                    <EditSite />
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
                <Route path="/connections/add" element={
                  <MainLayout>
                    <AddConnection />
                  </MainLayout>
                } />
                <Route path="/connections/edit/:id" element={
                  <MainLayout>
                    <EditConnection />
                  </MainLayout>
                } />
                <Route path="/ipam" element={
                  <MainLayout>
                    <IPAM />
                  </MainLayout>
                } />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
