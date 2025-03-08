
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { EquipmentType, Status } from "@/types/types";

const AddEquipment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipmentData, setEquipmentData] = useState({
    name: "",
    type: "router" as EquipmentType,
    model: "",
    manufacturer: "",
    ipAddress: "",
    macAddress: "",
    firmware: "",
    status: "active" as Status,
    netbios: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEquipmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setEquipmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert camelCase to snake_case for Supabase
      const dbData = {
        name: equipmentData.name,
        type: equipmentData.type,
        model: equipmentData.model,
        manufacturer: equipmentData.manufacturer,
        ip_address: equipmentData.ipAddress,
        mac_address: equipmentData.macAddress,
        firmware: equipmentData.firmware,
        status: equipmentData.status,
        netbios: equipmentData.netbios
      };

      const { data, error } = await supabase
        .from("equipment")
        .insert(dbData)
        .select("id")
        .single();

      if (error) throw error;

      toast({
        title: "Équipement ajouté",
        description: `${equipmentData.name} a été ajouté avec succès.`,
      });

      navigate("/equipment");
    } catch (error) {
      console.error("Error adding equipment:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de l'ajout de l'équipement.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Ajouter un équipement</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Détails de l'équipement</CardTitle>
            <CardDescription>
              Saisissez les informations du nouvel équipement à ajouter à l'inventaire.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Nom de l'équipement" 
                  value={equipmentData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={equipmentData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="router">Router</SelectItem>
                    <SelectItem value="switch">Switch</SelectItem>
                    <SelectItem value="hub">Hub</SelectItem>
                    <SelectItem value="wifi">WiFi</SelectItem>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="printer">Printer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Fabricant</Label>
                <Input 
                  id="manufacturer" 
                  name="manufacturer" 
                  placeholder="Fabricant" 
                  value={equipmentData.manufacturer}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Modèle</Label>
                <Input 
                  id="model" 
                  name="model" 
                  placeholder="Modèle" 
                  value={equipmentData.model}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipAddress">Adresse IP</Label>
                <Input 
                  id="ipAddress" 
                  name="ipAddress" 
                  placeholder="192.168.1.1" 
                  value={equipmentData.ipAddress}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="macAddress">Adresse MAC</Label>
                <Input 
                  id="macAddress" 
                  name="macAddress" 
                  placeholder="00:00:00:00:00:00" 
                  value={equipmentData.macAddress}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firmware">Firmware</Label>
                <Input 
                  id="firmware" 
                  name="firmware" 
                  placeholder="Version du firmware" 
                  value={equipmentData.firmware}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="netbios">Nom NetBIOS</Label>
                <Input 
                  id="netbios" 
                  name="netbios" 
                  placeholder="MACHINE01" 
                  value={equipmentData.netbios}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={equipmentData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="failure">Panne</SelectItem>
                    <SelectItem value="unknown">Inconnu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => navigate("/equipment")}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Ajouter l'équipement"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddEquipment;
