
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EquipmentDeleteDialog from "./EquipmentDeleteDialog";

interface EquipmentActionButtonsProps {
  equipmentId: string;
  equipmentName: string;
  isDeleting: boolean;
}

const EquipmentActionButtons = ({ 
  equipmentId, 
  equipmentName,
  isDeleting
}: EquipmentActionButtonsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={() => navigate(`/equipment/edit/${equipmentId}`)}
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:inline-block">Edit</span>
      </Button>
      
      <EquipmentDeleteDialog 
        equipmentId={equipmentId} 
        equipmentName={equipmentName}
      >
        <Button 
          variant="destructive" 
          size="sm" 
          className="flex items-center gap-1"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          <span className="sr-only sm:not-sr-only sm:inline-block">Delete</span>
        </Button>
      </EquipmentDeleteDialog>
    </div>
  );
};

export default EquipmentActionButtons;
