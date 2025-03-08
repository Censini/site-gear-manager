
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Site } from "@/types/types";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

interface SiteCardProps {
  site: Site;
  refetchSites: () => void;
}

const SiteCard = ({ site, refetchSites }: SiteCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDeleteSite = async () => {
    if (!site.id) return;
    
    setIsDeleting(true);
    
    try {
      // First check if there are related records
      const { data: equipmentData } = await supabase
        .from("equipment")
        .select("id")
        .eq("site_id", site.id);
        
      const { data: connectionsData } = await supabase
        .from("network_connections")
        .select("id")
        .eq("site_id", site.id);
        
      const { data: ipRangesData } = await supabase
        .from("ip_ranges")
        .select("id")
        .eq("site_id", site.id);
      
      // Delete related records if they exist
      if (equipmentData && equipmentData.length > 0) {
        await supabase
          .from("equipment")
          .delete()
          .eq("site_id", site.id);
      }
      
      if (connectionsData && connectionsData.length > 0) {
        await supabase
          .from("network_connections")
          .delete()
          .eq("site_id", site.id);
      }
      
      if (ipRangesData && ipRangesData.length > 0) {
        await supabase
          .from("ip_ranges")
          .delete()
          .eq("site_id", site.id);
      }
      
      // Delete the site
      const { error } = await supabase
        .from("sites")
        .delete()
        .eq("id", site.id);
      
      if (error) throw error;
      
      // Update cache
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      
      toast.success("Site deleted successfully");
      
      refetchSites();
    } catch (error) {
      console.error("Error deleting site:", error);
      toast.error("Failed to delete site. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="cursor-pointer hover:text-primary" onClick={() => navigate(`/sites/${site.id}`)}>
          {site.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{site.location}, {site.country}</p>
          {site.address && <p>{site.address}</p>}
          {site.contactName && <p>Contact: {site.contactName}</p>}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/sites/edit/${site.id}`);
          }}
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex items-center gap-1"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span>Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the site "{site.name}" and all of its associated data.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteSite}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default SiteCard;
