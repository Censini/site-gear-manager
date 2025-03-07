
import { EquipmentType } from "@/types/types";
import { Router, Network, Cpu, Wifi, Server, Printer, HelpCircle } from "lucide-react";

interface EquipmentTypeIconProps {
  type: EquipmentType;
  className?: string;
  size?: number;
}

const EquipmentTypeIcon = ({ type, className, size = 16 }: EquipmentTypeIconProps) => {
  switch (type) {
    case "router":
      return <Router className={className} size={size} />;
    case "switch":
      return <Network className={className} size={size} />;
    case "hub":
      return <Network className={className} size={size} />;
    case "wifi":
      return <Wifi className={className} size={size} />;
    case "server":
      return <Server className={className} size={size} />;
    case "printer":
      return <Printer className={className} size={size} />;
    case "other":
    default:
      return <HelpCircle className={className} size={size} />;
  }
};

export default EquipmentTypeIcon;
