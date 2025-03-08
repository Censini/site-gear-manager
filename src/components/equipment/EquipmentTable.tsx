
import { useState } from "react";
import { Equipment } from "@/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EquipmentTableRow from "./EquipmentTableRow";

interface EquipmentTableProps {
  equipmentList: Equipment[];
  onAddEquipment: () => void;
}

const EquipmentTable = ({ equipmentList }: EquipmentTableProps) => {
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

  return (
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
          {equipmentList.length > 0 ? (
            equipmentList.map((item) => (
              <EquipmentTableRow 
                key={item.id}
                equipment={item}
                getSiteName={getSiteName}
                isDeleting={isDeleting}
                equipmentToDelete={equipmentToDelete}
              />
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
  );
};

export default EquipmentTable;
