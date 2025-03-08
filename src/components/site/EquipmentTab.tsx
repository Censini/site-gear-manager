
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import EquipmentTypeIcon from "@/components/ui/EquipmentTypeIcon";
import { useNavigate } from "react-router-dom";
import { Equipment } from "@/types/types";

interface EquipmentTabProps {
  equipment: Equipment[];
}

const EquipmentTab = ({ equipment }: EquipmentTabProps) => {
  const navigate = useNavigate();
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Adresse IP</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {equipment.map((item) => (
          <TableRow 
            key={item.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/equipment/${item.id}`)}
          >
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <EquipmentTypeIcon type={item.type} className="text-muted-foreground" />
                <span className="capitalize">{item.type}</span>
              </div>
            </TableCell>
            <TableCell>{item.ipAddress}</TableCell>
            <TableCell>
              <StatusBadge status={item.status} />
            </TableCell>
          </TableRow>
        ))}
        {equipment.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              Aucun équipement trouvé.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default EquipmentTab;
