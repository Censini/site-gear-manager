import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Equipment, EquipmentType, Status } from "@/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/ui/StatusBadge";
import EquipmentTypeIcon from "@/components/ui/EquipmentTypeIcon";
import { Search, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EquipmentTableProps {
  equipmentList: Equipment[];
  onAddEquipment: () => void;
}

const EquipmentTable = ({ equipmentList, onAddEquipment }: EquipmentTableProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [typeFilter, setTypeFilter] = useState<EquipmentType | "all">("all");

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
            className="flex items-center gap-1"
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((item) => (
                <TableRow 
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/equipment/${item.id}`)}
                >
                  <TableCell>
                    <div className="font-medium">{item.name}</div>
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
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
