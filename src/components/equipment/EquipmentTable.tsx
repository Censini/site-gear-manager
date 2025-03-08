
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Equipment, EquipmentType, Status } from "@/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/ui/StatusBadge";
import EquipmentTypeIcon from "@/components/ui/EquipmentTypeIcon";
import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

interface EquipmentTableProps {
  equipmentList: Equipment[];
  onAddEquipment: () => void;
}

const EquipmentTable = ({ equipmentList, onAddEquipment }: EquipmentTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [typeFilter, setTypeFilter] = useState<EquipmentType | "all">("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<string | null>(null);

  const { data: sites } = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("id, name");
      
      if (error) throw error;
      
      return data.reduce((acc, site) => {
        acc[site.id] = site.name;
        return acc;
      }, {} as Record<string, string>);
    }
  });
  
  const getSiteName = (siteId: string) => {
    return sites?.[siteId] || "Not assigned";
  };

  const filteredEquipment = equipmentList.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.ipAddress && item.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDeleteEquipment = async (equipmentId: string) => {
    if (!equipmentId) return;
    
    setIsDeleting(true);
    setEquipmentToDelete(equipmentId);
    
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
      setEquipmentToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search equipment..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as Status | "all")}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="failure">Failure</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value as EquipmentType | "all")}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="router">Router</SelectItem>
              <SelectItem value="switch">Switch</SelectItem>
              <SelectItem value="hub">Hub</SelectItem>
              <SelectItem value="wifi">WiFi</SelectItem>
              <SelectItem value="server">Server</SelectItem>
              <SelectItem value="printer">Printer</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="flex items-center gap-1 w-full sm:w-auto"
            onClick={onAddEquipment}
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell 
                    className="font-medium cursor-pointer hover:text-primary"
                    onClick={() => navigate(`/equipment/${item.id}`)}
                  >
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EquipmentTypeIcon type={item.type} className="text-muted-foreground" />
                      <span className="capitalize">{item.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.ipAddress}</TableCell>
                  <TableCell>{item.manufacturer}</TableCell>
                  <TableCell>{item.model}</TableCell>
                  <TableCell>{getSiteName(item.siteId)}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => navigate(`/equipment/edit/${item.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:inline-block">Edit</span>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="flex items-center gap-1"
                            disabled={isDeleting && equipmentToDelete === item.id}
                          >
                            {isDeleting && equipmentToDelete === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only sm:not-sr-only sm:inline-block">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the equipment "{item.name}".
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteEquipment(item.id)}
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
                  No equipment found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EquipmentTable;
