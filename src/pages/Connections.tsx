
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "@/components/ui/StatusBadge";
import { useGetConnections } from "@/hooks/useGetConnections";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const Connections = () => {
  const { data: connections = [], isLoading, refetch } = useGetConnections();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const filteredConnections = connections.filter((connection) => {
    const matchesSearch = 
      connection.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.contractRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.bandwidth.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (connection as any).siteName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || connection.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

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
      
      console.log("Connection deleted successfully");
      
      // Force remove this connection from the cache
      queryClient.setQueryData(
        ["connections"],
        (oldData: any) => {
          if (Array.isArray(oldData)) {
            return oldData.filter(conn => conn.id !== connectionId);
          }
          return oldData;
        }
      );
      
      // Invalidate and refetch queries to refresh data across the app
      await queryClient.invalidateQueries({ queryKey: ["connections"] });
      await refetch();
      
      toast.success("Connection deleted successfully");
    } catch (error) {
      console.error("Error in handleDeleteConnection:", error);
      toast.error("Failed to delete connection");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Internet Connections</h1>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search connections..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="fiber">Fiber</SelectItem>
              <SelectItem value="adsl">ADSL</SelectItem>
              <SelectItem value="sdsl">SDSL</SelectItem>
              <SelectItem value="satellite">Satellite</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-1" asChild>
            <Link to="/connections/add">
              <Plus className="h-4 w-4" />
              <span>Add Connection</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Contract Ref</TableHead>
              <TableHead>Bandwidth</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Loading connections...
                </TableCell>
              </TableRow>
            ) : filteredConnections.length > 0 ? (
              filteredConnections.map((connection) => (
                <TableRow key={connection.id}>
                  <TableCell>{(connection as any).siteName}</TableCell>
                  <TableCell className="capitalize">{connection.type}</TableCell>
                  <TableCell>{connection.provider}</TableCell>
                  <TableCell>{connection.contractRef}</TableCell>
                  <TableCell>{connection.bandwidth}</TableCell>
                  <TableCell>{connection.sla}</TableCell>
                  <TableCell>
                    <StatusBadge status={connection.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                      >
                        <Link to={`/connections/edit/${connection.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            disabled={deletingId === connection.id}
                          >
                            {deletingId === connection.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the connection
                              and remove it from all sites.
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No connections found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Connections;
