import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { EquipmentType, EquipmentStatus, Equipment } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface EquipmentFormProps {
  initialData?: {
    name: string;
    type: EquipmentType;
    model: string;
    manufacturer: string;
    ipAddress: string;
    macAddress: string;
    firmware: string;
    status: EquipmentStatus;
    netbios: string;
    siteId: string;
  };
  initialValues?: {
    name: string;
    type: EquipmentType;
    model: string;
    manufacturer: string;
    ipAddress: string;
    macAddress: string;
    firmware: string;
    status: EquipmentStatus;
    netbios: string;
    siteId: string;
    installDate: string;
  };
  mode?: "add" | "edit";
  equipmentId?: string;
  onSubmit?: (data: Omit<Equipment, "id">) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

const EquipmentForm = ({ 
  initialData, 
  initialValues, 
  mode = "add", 
  equipmentId,
  onSubmit,
  isSubmitting: externalIsSubmitting,
  onCancel 
}: EquipmentFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sites, setSites] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingSites, setIsLoadingSites] = useState(true);
  const [errors, setErrors] = useState<{
    ipAddress?: string;
  }>({});
  
  const initialEquipmentData = initialData || initialValues || {
    name: "",
    type: "router" as EquipmentType,
    model: "",
    manufacturer: "",
    ipAddress: "",
    macAddress: "",
    firmware: "",
    status: "active" as EquipmentStatus,
    netbios: "",
    siteId: "not_deployed"
  };
  
  const [equipmentData, setEquipmentData] = useState(initialEquipmentData);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const { data, error } = await supabase
          .from("sites")
          .select("id, name")
          .order("name");
        
        if (error) throw error;
        console.log("Fetched sites:", data);
        setSites(data || []);
      } catch (error) {
        console.error("Error fetching sites:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger la liste des sites.",
        });
      } finally {
        setIsLoadingSites(false);
      }
    };

    fetchSites();
  }, [toast]);

  const validateIPAddress = (ipAddress: string): boolean => {
    if (!ipAddress) return true; // Allow empty IP address
    
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ipAddress);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEquipmentData(prev => ({ ...prev, [name]: value }));
    
    if (name === "ipAddress") {
      if (value && !validateIPAddress(value)) {
        setErrors(prev => ({ ...prev, ipAddress: "Format d'adresse IP invalide (ex: 192.168.1.1)" }));
      } else {
        setErrors(prev => ({ ...prev, ipAddress: undefined }));
      }
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setEquipmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSubmit) {
      if (equipmentData.ipAddress && !validateIPAddress(equipmentData.ipAddress)) {
        setErrors(prev => ({ ...prev, ipAddress: "Format d'adresse IP invalide (ex:, 192.168.1.1)" }));
        return;
      }
      
      const formattedData = {
        ...equipmentData,
        siteId: equipmentData.siteId === "not_deployed" ? "" : equipmentData.siteId
      };
      
      await onSubmit(formattedData as Omit<Equipment, "id">);
      return;
    }
    
    setIsSubmitting(true);

    try {
      if (!session?.user?.id) {
        throw new Error("Vous devez être connecté pour ajouter un équipement");
      }

      const dbData = {
        name: equipmentData.name,
        type: equipmentData.type,
        model: equipmentData.model,
        manufacturer: equipmentData.manufacturer,
        ip_address: equipmentData.ipAddress,
        mac_address: equipmentData.macAddress,
        firmware: equipmentData.firmware,
        status: equipmentData.status,
        netbios: equipmentData.netbios,
        user_id: session.user.id,
        site_id: equipmentData.siteId === "not_deployed" ? null : equipmentData.siteId
      };

      let result;
      
      if (mode === "add") {
        result = await supabase
          .from("equipment")
          .insert(dbData)
          .select("id")
          .single();
      } else if (mode === "edit" && equipmentId) {
        result = await supabase
          .from("equipment")
          .update(dbData)
          .eq("id", equipmentId)
          .select("id")
          .single();
      }

      const { data, error } = result || {};

      if (error) throw error;

      toast({
        title: mode === "add" ? "Équipement ajouté" : "Équipement modifié",
        description: `${equipmentData.name} a été ${mode === "add" ? "ajouté" : "modifié"} avec succès.`,
      });

      navigate("/equipment");
    } catch (error) {
      console.error(`Error ${mode === "add" ? "adding" : "editing"} equipment:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : `Une erreur s'est produite lors de l'${mode === "add" ? "ajout" : "édition"} de l'équipement.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{mode === "add" ? "Détails de l'équipement" : "Modifier l'équipement"}</CardTitle>
          <CardDescription>
            {mode === "add" 
              ? "Saisissez les informations du nouvel équipement à ajouter à l'inventaire."
              : "Modifiez les informations de l'équipement existant."}
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
              <Label htmlFor="siteId">Site</Label>
              <Select
                value={equipmentData.siteId}
                onValueChange={(value) => handleSelectChange("siteId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingSites ? "Chargement des sites..." : "Sélectionner un site (optionnel)"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_deployed">Non déployé</SelectItem>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <div className="space-y-2">
              <Label htmlFor="ipAddress">Adresse IP</Label>
              <Input 
                id="ipAddress" 
                name="ipAddress" 
                placeholder="192.168.1.1" 
                value={equipmentData.ipAddress}
                onChange={handleChange}
                className={errors.ipAddress ? "border-red-500" : ""}
              />
              {errors.ipAddress && (
                <p className="text-sm text-red-500">{errors.ipAddress}</p>
              )}
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
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            type="button"
            onClick={onCancel ? onCancel : () => navigate("/equipment")}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={(externalIsSubmitting !== undefined ? externalIsSubmitting : isSubmitting) || Object.values(errors).some(error => !!error)}
          >
            {(externalIsSubmitting !== undefined ? externalIsSubmitting : isSubmitting) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "add" ? "Enregistrement..." : "Mise à jour..."}
              </>
            ) : (
              mode === "add" ? "Ajouter l'équipement" : "Mettre à jour l'équipement"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EquipmentForm;
