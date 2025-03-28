
import { Button } from "@/components/ui/button";
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
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Site } from "@/types/types";

interface SiteHeaderProps {
  site: Site;
  onDelete: () => Promise<void>;
}

const SiteHeader = ({ site, onDelete }: SiteHeaderProps) => {
  const navigate = useNavigate();
  
  const handleDelete = async () => {
    try {
      // Call the onDelete function without checking its return value
      await onDelete();
      // Navigation is now handled inside the onDelete function
    } catch (error) {
      console.error("Erreur dans handleDelete:", error);
      // Errors are already handled inside onDelete
    }
  };
  
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate("/sites")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{site.name}</h1>
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <Button 
          variant="outline" 
          className="flex items-center gap-1 flex-1 md:flex-none" 
          onClick={() => navigate(`/sites/edit/${site.id}`)}
        >
          <Edit className="h-4 w-4" />
          <span>Modifier</span>
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-1 flex-1 md:flex-none">
              <Trash2 className="h-4 w-4" />
              <span>Supprimer</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Cela supprimera définitivement le site
                "{site.name}" et toutes les données associées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SiteHeader;
