
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { IPRange } from "@/types/types";
import { Search, Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteIPRange } from "@/hooks/useDeleteIPRange";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const IPAM = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rangeToDelete, setRangeToDelete] = useState<string | null>(null);
  const { mutate: deleteIPRange, isPending: isDeleting } = useDeleteIPRange();
  
  const { data: ipRanges = [], isLoading, refetch } = useQuery({
    queryKey: ["ipRanges"],
    queryFn: async () => {
      const { data: ranges, error } = await supabase
        .from("ip_ranges")
        .select(`
          *,
          sites(name)
        `);
      
      if (error) {
        console.error("Error fetching IP ranges:", error);
        throw error;
      }
      
      return ranges.map(range => ({
        id: range.id,
        siteId: range.site_id || "",
        range: range.range,
        description: range.description || "",
        isReserved: range.is_reserved || false,
        dhcpScope: range.dhcp_scope || false,
        siteName: range.sites?.name || "Site inconnu"
      })) as (IPRange & { siteName: string })[];
    }
  });
  
  const filteredRanges = ipRanges.filter(range => 
    range.range.toLowerCase().includes(searchTerm.toLowerCase()) ||
    range.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    range.siteName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRange = (id: string) => {
    deleteIPRange(id, {
      onSuccess: () => {
        refetch();
        setRangeToDelete(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Gestion des adresses IP</h1>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des plages IP..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="flex items-center gap-1" asChild>
          <Link to="/ipam/add">
            <Plus className="h-4 w-4" />
            <span>Ajouter une plage IP</span>
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site</TableHead>
              <TableHead>Plage IP</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Réservé</TableHead>
              <TableHead>DHCP</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredRanges.length > 0 ? (
              filteredRanges.map((range) => (
                <TableRow key={range.id}>
                  <TableCell>{range.siteName}</TableCell>
                  <TableCell className="font-mono">{range.range}</TableCell>
                  <TableCell>{range.description}</TableCell>
                  <TableCell>{range.isReserved ? "Oui" : "Non"}</TableCell>
                  <TableCell>{range.dhcpScope ? "Oui" : "Non"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" asChild title="Modifier">
                        <Link to={`/ipam/edit/${range.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      
                      <AlertDialog open={rangeToDelete === range.id} onOpenChange={(open) => !open && setRangeToDelete(null)}>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setRangeToDelete(range.id)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cela supprimera définitivement la plage IP "{range.range}".
                              Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteRange(range.id)}
                              disabled={isDeleting}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : null}
                              Supprimer
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
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucune plage IP trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default IPAM;
