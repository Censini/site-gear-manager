
import { Bell, Menu, UserCircle2, LogOut, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { session, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    toast.success(`Mode ${newTheme === "dark" ? "sombre" : "clair"} activé`);
  };

  // Handle mobile menu click
  const handleMobileMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-between px-6 py-4 bg-card shadow-md">
      <div className="flex items-center">
        {isMobile && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2"
                onClick={onMenuClick ? handleMobileMenuClick : undefined}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px]">
              <Sidebar />
            </SheetContent>
          </Sheet>
        )}
        <div className="flex items-center space-x-2">
          <img src="/lovable-uploads/3894b93e-3829-4eae-a0e3-bcf4c74b9a99.png" alt="Logo" className="h-8 w-auto" />
          <h1 className="text-xl font-bold">Network Asset Inventory</h1>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          className="rounded-full"
          aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
        >
          {theme === "dark" ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserCircle2 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {session?.user?.email || 'Mon compte'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
