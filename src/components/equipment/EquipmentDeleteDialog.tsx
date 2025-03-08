
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { toast } from "sonner";

interface EquipmentDeleteDialogProps {
  equipmentId: string;
  equipmentName: string;
  children: React.ReactNode;
  onDeleteSuccess?: () => void;
}

const EquipmentDeleteDialog = ({ 
  equipmentId, 
  equipmentName, 
  children,
  onDeleteSuccess
}: EquipmentDeleteDialogProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteEquipment = async () => {
    if (!equipmentId) return;
    
    setIsDeleting(true);
    
    try {
      console.log("Deleting equipment with ID:", equipmentId);
      
      const { error } = await supabase
        .from("equipment")
        .delete()
        .eq("id", equipmentId);
      
      if (error) {
        console.error("Error deleting equipment:", error);
        throw error;
      }
      
      // Invalidate and refetch equipment queries
      await queryClient.invalidateQueries({ queryKey: ["equipment"] });
      
      // Force remove this equipment from the cache
      queryClient.setQueryData(
        ["equipment", equipmentId],
        null
      );
      
      // Show success message
      toast.success(`${equipmentName} a été supprimé avec succès`);
      
      // Call success callback if provided
      if (onDeleteSuccess) {
        onDeleteSuccess();
      } else {
        // Navigate back to equipment list if no callback
        navigate("/equipment");
      }
    } catch (error) {
      console.error("Error in handleDeleteEquipment:", error);
      toast.error("Échec de la suppression de l'équipement");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action va définitivement supprimer l'équipement "{equipmentName}".
            Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteEquipment}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EquipmentDeleteDialog;
