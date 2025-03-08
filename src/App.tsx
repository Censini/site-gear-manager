import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sites from "./pages/Sites";
import AddSite from "./pages/AddSite";
import SiteDetail from "./pages/SiteDetail";
import EquipmentDetail from "./pages/EquipmentDetail";
import EditSite from "./pages/EditSite";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { currentUser } = useAuth();

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    return currentUser ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/sites"
        element={
          <PrivateRoute>
            <Sites />
          </PrivateRoute>
        }
      />
      <Route
        path="/sites/add"
        element={
          <PrivateRoute>
            <AddSite />
          </PrivateRoute>
        }
      />
      <Route
        path="/sites/:id"
        element={
          <PrivateRoute>
            <SiteDetail />
          </PrivateRoute>
        }
      />
       <Route
        path="/sites/edit/:id"
        element={
          <PrivateRoute>
            <EditSite />
          </PrivateRoute>
        }
      />
      <Route
        path="/equipment/:id"
        element={
          <PrivateRoute>
            <EquipmentDetail />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
