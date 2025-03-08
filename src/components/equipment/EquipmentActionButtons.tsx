
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EquipmentDeleteDialog from "./EquipmentDeleteDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 rounded-lg hover:bg-accent"
              onClick={() => navigate(`/equipment/edit/${equipmentId}`)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:inline-block">Edit</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit equipment</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <EquipmentDeleteDialog 
              equipmentId={equipmentId} 
              equipmentName={equipmentName}
            >
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center gap-1 rounded-lg"
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
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete equipment</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default EquipmentActionButtons;
