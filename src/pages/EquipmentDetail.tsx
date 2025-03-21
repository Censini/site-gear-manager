import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import EquipmentTypeIcon from "@/components/ui/EquipmentTypeIcon";
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react";
import { Equipment } from "@/types/types";
import { toast } from "sonner";
import ConfigMarkdownViewer from "@/components/equipment/ConfigMarkdownViewer";
import EquipmentDeleteDialog from "@/components/equipment/EquipmentDeleteDialog";

const EquipmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: equipment, isLoading, error } = useQuery({
    queryKey: ["equipment", id],
    queryFn: async () => {
      if (!id) throw new Error("No equipment ID provided");
      
      const { data, error } = await supabase
        .from("equipment")
        .select("*, config_markdown")
        .eq("id", id)
        .single();
      
      if (error) {
        console.error("Error fetching equipment:", error);
        throw error;
      }
      
      return {
        id: data.id,
        name: data.name,
        siteId: data.site_id || "",
        type: data.type,
        model: data.model,
        manufacturer: data.manufacturer,
        ipAddress: data.ip_address || "",
        macAddress: data.mac_address || "",
        firmware: data.firmware || "",
        installDate: data.install_date || "",
        status: data.status,
        netbios: data.netbios || "",
        configMarkdown: data.config_markdown || ""
      } as Equipment;
    }
  });
  
  const { data: site } = useQuery({
    queryKey: ["site", equipment?.siteId],
    enabled: !!equipment?.siteId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .eq("id", equipment?.siteId)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        location: data.location,
        country: data.country,
        address: data.address || "",
        contactName: data.contact_name || "",
        contactEmail: data.contact_email || "",
        contactPhone: data.contact_phone || ""
      };
    }
  });

  const saveConfigMutation = useMutation({
    mutationFn: async (config: string) => {
      if (!id) throw new Error("ID d'équipement non fourni");
      
      const { error } = await supabase
        .from("equipment")
        .update({
          config_markdown: config,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment", id] });
      toast.success("Configuration enregistrée");
    },
    onError: (error) => {
      console.error("Error saving config:", error);
      toast.error("Erreur lors de l'enregistrement de la configuration");
    }
  });

  const handleSaveConfig = async (config: string) => {
    await saveConfigMutation.mutateAsync(config);
  };

  const handleEdit = () => {
    navigate(`/equipment/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold">Equipment not found</h2>
        <p className="text-muted-foreground mb-4">The equipment you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/equipment")}>Go back to Equipment</Button>
      </div>
    );
  }

  const canHaveConfig = ['switch', 'router', 'wifi'];
  
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
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="flex items-center gap-1 flex-1 md:flex-none" 
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
            <span>Modifier</span>
          </Button>
          
          <EquipmentDeleteDialog
            equipmentId={equipment.id}
            equipmentName={equipment.name}
          >
            <Button 
              variant="destructive" 
              className="flex items-center gap-1 flex-1 md:flex-none"
            >
              <Trash2 className="h-4 w-4" />
              <span>Supprimer</span>
            </Button>
          </EquipmentDeleteDialog>
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
                <p className="mt-1">{site?.name || "Not assigned"}</p>
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
                <p className="mt-1">{equipment.installDate || "Not specified"}</p>
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
                <p className="mt-1">{equipment.ipAddress || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">MAC Address</p>
                <p className="mt-1">{equipment.macAddress || "Not specified"}</p>
              </div>
              {equipment.netbios && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">NetBIOS Name</p>
                  <p className="mt-1">{equipment.netbios}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Firmware</p>
                <p className="mt-1">{equipment.firmware || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {canHaveConfig.includes(equipment.type) && (
        <ConfigMarkdownViewer 
          initialConfig={equipment.configMarkdown || ''} 
          equipmentId={id || ''} 
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
};

export default EquipmentDetail;
