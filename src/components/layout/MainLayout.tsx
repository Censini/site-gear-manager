
import { ReactNode, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const menuBtn = document.getElementById('menu-button');
      
      if (sidebar && !sidebar.contains(e.target as Node) && 
          menuBtn && !menuBtn.contains(e.target as Node) &&
          isMobile && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, mobileSidebarOpen]);

  // Handle menu click for mobile
  const handleMenuClick = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Navbar onMenuClick={handleMenuClick} />
      <div className="flex relative">
        {/* Desktop Sidebar */}
        <div
          id="sidebar" 
          className={cn(
            "transition-all duration-300 ease-in-out fixed md:relative top-16 md:top-0 left-0 z-40 h-[calc(100vh-4rem)] bg-sidebar w-64",
            sidebarCollapsed ? "md:-ml-64" : "",
            isMobile ? (mobileSidebarOpen ? "translate-x-0" : "-translate-x-full") : ""
          )}
        >
          <Sidebar />
        </div>
        
        {/* Sidebar Toggle Button */}
        <div 
          className={cn(
            "fixed md:absolute top-24 z-50 transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "left-5" : "left-64"
          )}
        >
          <Button
            variant="default"
            size="icon"
            id="menu-button"
            onClick={() => {
              if (isMobile) {
                setMobileSidebarOpen(!mobileSidebarOpen);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            className="bg-primary hover:bg-primary/90 text-black rounded-full shadow-md size-10"
          >
            {isMobile ? (
              <Menu className="h-5 w-5" />
            ) : sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {/* Main Content */}
        <main 
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out p-6 md:p-8 bg-background",
            sidebarCollapsed ? "ml-0" : "",
            "mt-16 md:mt-0"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
