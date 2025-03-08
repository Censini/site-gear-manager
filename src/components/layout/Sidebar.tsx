
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
  Settings 
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Equipment", path: "/equipment", icon: Server },
  { name: "Sites", path: "/sites", icon: Building },
  { name: "Connections", path: "/connections", icon: Network },
  { name: "IPAM", path: "/ipam", icon: Wifi },
  { name: "Import", path: "/import", icon: Upload },
  { name: "Export", path: "/export", icon: Download },
  { name: "Settings", path: "/settings", icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="h-[calc(100vh-4rem)] bg-sidebar dark:bg-sidebar md:shadow-md fixed md:relative top-16 md:top-0 left-0 z-40 w-64 overflow-y-auto transition-transform transform">
      <div className="py-8">
        <div className="px-4 mb-6">
          <h2 className="text-xl font-semibold text-sidebar-foreground dark:text-sidebar-foreground">
            Network Inventory
          </h2>
        </div>
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-sidebar-accent dark:text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
