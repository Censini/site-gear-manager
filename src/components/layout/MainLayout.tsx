
import { ReactNode, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Navbar />
      <div className="flex relative">
        <div 
          className={`transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "w-0 -ml-64" : "w-64"
          } md:block hidden`}
        >
          <Sidebar />
        </div>
        <div className="absolute top-4 left-4 md:block hidden z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="shadow-md bg-background dark:bg-accent hover:bg-muted"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out p-6 md:p-8 ${
            isMobile || sidebarCollapsed ? "ml-0" : "md:ml-0"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
