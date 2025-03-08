
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
    const success = await onDelete();
    if (success) {
      // Force navigation to sites page after successful deletion
      navigate("/sites", { replace: true });
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
          <span>Edit</span>
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-1 flex-1 md:flex-none">
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the site
                "{site.name}" and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SiteHeader;
