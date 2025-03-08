
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Server, 
  Building, 
  Network, 
  Wifi, 
  Upload, 
  Download,
  Settings,
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const sidebarItems = [
  { name: "Tableau de bord", path: "/", icon: Home },
  { name: "Équipements", path: "/equipment", icon: Server },
  { name: "Sites", path: "/sites", icon: Building },
  { name: "Liens Internet", path: "/connections", icon: Network },
  { name: "IPAM", path: "/ipam", icon: Wifi },
  { name: "Import", path: "/import", icon: Upload },
  { name: "Export", path: "/export", icon: Download },
  { name: "Paramètres", path: "/settings", icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();
  const { session } = useAuth();
  
  // Extraire l'adresse email de l'utilisateur ou utiliser une valeur par défaut
  const userEmail = session?.user?.email || "Non connecté";
  
  // Prendre la première partie de l'email avant @ pour le nom d'utilisateur
  const username = userEmail.split('@')[0] || "Invité";

  return (
    <aside className="h-full flex flex-col justify-between py-4 bg-sidebar w-full">
      {/* Logo ou titre */}
      <div className="px-5 mb-8">
        <h2 className="text-xl font-semibold text-sidebar-foreground">
          SAMAT IT
        </h2>
      </div>
      
      {/* Navigation */}
      <nav className="space-y-1 px-3 flex-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all",
              location.pathname === item.path
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      
      {/* Profil utilisateur en bas */}
      <div className="px-4 py-4 mt-auto border-t border-sidebar-border/20">
        <div className="flex items-center space-x-3">
          <div className="size-10 rounded-full bg-accent flex items-center justify-center">
            <User className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">{username}</p>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
