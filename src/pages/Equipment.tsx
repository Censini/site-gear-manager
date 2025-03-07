
import { equipment } from "@/data/mockData";
import EquipmentTable from "@/components/equipment/EquipmentTable";

const Equipment = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Equipment Inventory</h1>
      <EquipmentTable equipmentList={equipment} />
    </div>
  );
};

export default Equipment;
