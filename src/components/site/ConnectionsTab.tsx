
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
    
    if (confirm("Are you sure you want to remove this connection from the site?")) {
      setRemovingId(connectionId);
      
      try {
        const { error } = await supabase
          .from("network_connections")
          .update({ site_id: null })
          .eq("id", connectionId);
          
        if (error) throw error;
        
        toast.success("Connection removed from site");
        
        // Refresh the data
        if (onRefresh) await onRefresh();
      } catch (error) {
        console.error("Error removing connection from site:", error);
        toast.error("Failed to remove connection from site");
      } finally {
        setRemovingId(null);
      }
    }
  };

  const handleDeleteConnection = async (connectionId: string) => {
    console.log("Deleting connection with ID:", connectionId);
    setDeletingId(connectionId);
    
    try {
      const { error } = await supabase
        .from("network_connections")
        .delete()
        .eq("id", connectionId);
        
      if (error) {
        console.error("Error deleting connection:", error);
        throw error;
      }
      
      toast.success("Connection deleted successfully");
      
      // Refresh the data
      if (onRefresh) await onRefresh();
    } catch (error) {
      console.error("Error in handleDeleteConnection:", error);
      toast.error("Failed to delete connection");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Contract Ref</TableHead>
          <TableHead>Bandwidth</TableHead>
          <TableHead>Status</TableHead>
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
              <StatusBadge status={connection.status} />
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
                  <span className="sr-only">Remove from site</span>
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
                      <span className="sr-only">Delete connection</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the connection
                        and remove it from the system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteConnection(connection.id)} 
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
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
              No connections found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ConnectionsTab;
