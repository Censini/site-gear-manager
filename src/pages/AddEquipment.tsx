
import EquipmentForm from "@/components/equipment/EquipmentForm";

const AddEquipment = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Ajouter un équipement</h1>
      </div>
      
      <EquipmentForm mode="add" />
    </div>
  );
};

export default AddEquipment;
