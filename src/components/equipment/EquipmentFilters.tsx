
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EquipmentType, Status } from "@/types/types";

interface EquipmentFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: Status | "all";
  setStatusFilter: (status: Status | "all") => void;
  typeFilter: EquipmentType | "all";
  setTypeFilter: (type: EquipmentType | "all") => void;
  onAddEquipment: () => void;
}

const EquipmentFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  onAddEquipment
}: EquipmentFiltersProps) => {
  return (
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
  );
};

export default EquipmentFilters;
