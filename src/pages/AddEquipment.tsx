
import { useNavigate } from "react-router-dom";
import EquipmentForm from "@/components/equipment/EquipmentForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AddEquipment = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/equipment")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Ajouter un équipement</h1>
        </div>
      </div>
      
      <EquipmentForm mode="add" />
    </div>
  );
};

export default AddEquipment;
