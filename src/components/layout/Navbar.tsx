
import { Bell, Menu, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-primary text-primary-foreground shadow-md">
      <div className="flex items-center">
        {isMobile && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
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
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <UserCircle2 className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
