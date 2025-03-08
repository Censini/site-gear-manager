
import { useNavigate } from "react-router-dom";
import { Equipment } from "@/types/types";
import { TableRow, TableCell } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import EquipmentTypeIcon from "@/components/ui/EquipmentTypeIcon";
import EquipmentActionButtons from "./EquipmentActionButtons";

interface EquipmentTableRowProps {
  equipment: Equipment;
  getSiteName: (siteId: string) => string;
  isDeleting: boolean;
  equipmentToDelete: string | null;
}

const EquipmentTableRow = ({ 
  equipment, 
  getSiteName, 
  isDeleting,
  equipmentToDelete
}: EquipmentTableRowProps) => {
  const navigate = useNavigate();

  return (
    <TableRow key={equipment.id}>
      <TableCell 
        className="font-medium cursor-pointer hover:text-primary"
        onClick={() => navigate(`/equipment/${equipment.id}`)}
      >
        {equipment.name}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <EquipmentTypeIcon type={equipment.type} className="text-muted-foreground" />
          <span className="capitalize">{equipment.type}</span>
        </div>
      </TableCell>
      <TableCell>{equipment.ipAddress}</TableCell>
      <TableCell>{equipment.manufacturer}</TableCell>
      <TableCell>{equipment.model}</TableCell>
      <TableCell>{getSiteName(equipment.siteId)}</TableCell>
      <TableCell>
        <StatusBadge status={equipment.status} />
      </TableCell>
      <TableCell className="text-right">
        <EquipmentActionButtons 
          equipmentId={equipment.id} 
          equipmentName={equipment.name}
          isDeleting={isDeleting && equipmentToDelete === equipment.id}
        />
      </TableCell>
    </TableRow>
  );
};

export default EquipmentTableRow;
