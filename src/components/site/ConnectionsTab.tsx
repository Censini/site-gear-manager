
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import { NetworkConnection } from "@/types/types";
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
import { Unlink, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ConnectionsTabProps {
  connections: NetworkConnection[];
  onRefresh?: () => Promise<void>;
}

const ConnectionsTab = ({ connections, onRefresh }: ConnectionsTabProps) => {
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleNavigateToConnection = (id: string) => {
    navigate(`/connections/edit/${id}`);
  };

  const handleRemoveFromSite = async (connectionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the remove button
    
    if (confirm("Êtes-vous sûr de vouloir retirer cette connexion du site ?")) {
      setRemovingId(connectionId);
      
      try {
        const { error } = await supabase
          .from("network_connections")
          .update({ site_id: null })
          .eq("id", connectionId);
          
        if (error) throw error;
        
        toast.success("Connexion retirée du site");
        
        // Refresh the data
        if (onRefresh) await onRefresh();
      } catch (error) {
        console.error("Erreur lors du retrait de la connexion du site:", error);
        toast.error("Échec du retrait de la connexion du site");
      } finally {
        setRemovingId(null);
      }
    }
  };

  const handleDeleteConnection = async (connectionId: string) => {
    console.log("Suppression de la connexion avec l'ID:", connectionId);
    setDeletingId(connectionId);
    
    try {
      const { error } = await supabase
        .from("network_connections")
        .delete()
        .eq("id", connectionId);
        
      if (error) {
        console.error("Erreur lors de la suppression de la connexion:", error);
        throw error;
      }
      
      toast.success("Connexion supprimée avec succès");
      
      // Refresh the data
      if (onRefresh) await onRefresh();
    } catch (error) {
      console.error("Erreur dans handleDeleteConnection:", error);
      toast.error("Échec de la suppression de la connexion");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Fournisseur</TableHead>
          <TableHead>Réf. Contrat</TableHead>
          <TableHead>Bande passante</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="w-[150px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {connections.map((connection) => (
          <TableRow 
            key={connection.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleNavigateToConnection(connection.id)}
          >
            <TableCell className="font-medium capitalize">{connection.type}</TableCell>
            <TableCell>{connection.provider}</TableCell>
            <TableCell>{connection.contractRef}</TableCell>
            <TableCell>{connection.bandwidth}</TableCell>
            <TableCell>
              <StatusBadge status={connection.status as any} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleRemoveFromSite(connection.id, e)}
                  disabled={removingId === connection.id}
                  className="h-8 w-8 p-0"
                >
                  {removingId === connection.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Unlink className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">Retirer du site</span>
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      {deletingId === connection.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="sr-only">Supprimer la connexion</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Cela supprimera définitivement la connexion
                        et la retirera du système.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteConnection(connection.id)} 
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {connections.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              Aucune connexion trouvée.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ConnectionsTab;
