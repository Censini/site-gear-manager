
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface EquipmentDeleteDialogProps {
  equipmentId: string;
  equipmentName: string;
  children: React.ReactNode;
}

const EquipmentDeleteDialog = ({ 
  equipmentId, 
  equipmentName, 
  children 
}: EquipmentDeleteDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteEquipment = async () => {
    if (!equipmentId) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("equipment")
        .delete()
        .eq("id", equipmentId);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      
      toast({
        title: "Equipment deleted",
        description: "Equipment has been successfully deleted",
      });
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete equipment. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the equipment "{equipmentName}".
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteEquipment}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EquipmentDeleteDialog;
