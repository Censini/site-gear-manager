
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
    <aside className="hidden md:block w-64 bg-white shadow-md h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
              location.pathname === item.path
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-gray-700 hover:bg-muted"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
