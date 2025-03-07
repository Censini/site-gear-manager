
import { Badge } from "@/components/ui/badge";
import { Status } from "@/types/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const getStatusColor = (status: Status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "maintenance":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "failure":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "unknown":
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const getStatusText = (status: Status) => {
  switch (status) {
    case "active":
      return "Active";
    case "maintenance":
      return "Maintenance";
    case "failure":
      return "Failure";
    case "unknown":
    default:
      return "Unknown";
  }
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <Badge className={cn(getStatusColor(status), className)}>
      {getStatusText(status)}
    </Badge>
  );
};

export default StatusBadge;
