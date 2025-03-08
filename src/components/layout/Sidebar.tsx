
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

const sidebarItems = [
  { name: "Tableau de bord", path: "/", icon: Home },
  { name: "Équipements", path: "/equipment", icon: Server },
  { name: "Sites", path: "/sites", icon: Building },
  { name: "Connexions", path: "/connections", icon: Network },
  { name: "IPAM", path: "/ipam", icon: Wifi },
  { name: "Import", path: "/import", icon: Upload },
  { name: "Export", path: "/export", icon: Download },
  { name: "Paramètres", path: "/settings", icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="h-full flex flex-col justify-between py-6 bg-sidebar">
      <div>
        {/* Logo ou titre */}
        <div className="px-5 mb-10">
          <h2 className="text-xl font-semibold text-sidebar-foreground">
            Inventaire Réseau
          </h2>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-accent/20",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:text-primary"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 mr-3",
                location.pathname === item.path
                  ? "text-primary"
                  : ""
              )} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Profil utilisateur en bas */}
      <div className="px-4 py-4 mt-auto border-t border-sidebar-border/20">
        <div className="flex items-center space-x-3">
          <div className="size-10 rounded-full bg-accent flex items-center justify-center">
            <User className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">Administrateur</p>
            <p className="text-xs text-muted-foreground">admin@exemple.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
