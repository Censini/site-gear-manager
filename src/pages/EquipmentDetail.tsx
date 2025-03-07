
import { useParams, useNavigate } from "react-router-dom";
import { getEquipmentById, getSiteById } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import EquipmentTypeIcon from "@/components/ui/EquipmentTypeIcon";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

const EquipmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const equipment = getEquipmentById(id || "");
  const site = equipment ? getSiteById(equipment.siteId) : undefined;

  if (!equipment) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold">Equipment not found</h2>
        <p className="text-muted-foreground mb-4">The equipment you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/equipment")}>Go back to Equipment</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/equipment")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{equipment.name}</h1>
          <StatusBadge status={equipment.status} className="ml-2" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button variant="destructive" className="flex items-center gap-1">
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <div className="flex items-center gap-2 mt-1">
                  <EquipmentTypeIcon type={equipment.type} />
                  <p className="capitalize">{equipment.type}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Site</p>
                <p className="mt-1">{site?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Model</p>
                <p className="mt-1">{equipment.model}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Manufacturer</p>
                <p className="mt-1">{equipment.manufacturer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Installation Date</p>
                <p className="mt-1">{equipment.installDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-1">
                  <StatusBadge status={equipment.status} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Network Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                <p className="mt-1">{equipment.ipAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">MAC Address</p>
                <p className="mt-1">{equipment.macAddress}</p>
              </div>
              {equipment.netbios && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">NetBIOS Name</p>
                  <p className="mt-1">{equipment.netbios}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Firmware</p>
                <p className="mt-1">{equipment.firmware}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EquipmentDetail;
