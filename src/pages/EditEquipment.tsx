
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { EquipmentType, Status } from "@/types/types";
import { useAuth } from "@/contexts/AuthContext";

const EditEquipment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sites, setSites] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingSites, setIsLoadingSites] = useState(true);
  const [equipmentData, setEquipmentData] = useState({
    name: "",
    type: "router" as EquipmentType,
    model: "",
    manufacturer: "",
    ipAddress: "",
    macAddress: "",
    firmware: "",
    status: "active" as Status,
    netbios: "",
    siteId: ""
  });

  const { isLoading: isLoadingEquipment, error: equipmentError } = useQuery({
    queryKey: ["equipment", id],
    queryFn: async () => {
      if (!id) throw new Error("No equipment ID provided");
      
      const { data, error } = await supabase
        .from("equipment")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      
      setEquipmentData({
        name: data.name,
        type: data.type as EquipmentType,
        model: data.model,
        manufacturer: data.manufacturer,
        ipAddress: data.ip_address || "",
        macAddress: data.mac_address || "",
        firmware: data.firmware || "",
        status: data.status as Status,
        netbios: data.netbios || "",
        siteId: data.site_id || ""
      });
      
      return data;
    }
  });

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const { data, error } = await supabase
          .from("sites")
          .select("id, name")
          .order("name");
        
        if (error) throw error;
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
      if (!session?.user?.id) {
        throw new Error("Vous devez être connecté pour modifier un équipement");
      }

      if (!id) {
        throw new Error("ID de l'équipement manquant");
      }

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
        netbios: equipmentData.netbios,
        site_id: equipmentData.siteId || null, // Null if not selected
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from("equipment")
        .update(dbData)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Équipement modifié",
        description: `${equipmentData.name} a été modifié avec succès.`,
      });

      navigate(`/equipment/${id}`);
    } catch (error) {
      console.error("Error updating equipment:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de la modification de l'équipement.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingEquipment) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (equipmentError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold">Équipement introuvable</h2>
        <p className="text-muted-foreground mb-4">L'équipement que vous recherchez n'existe pas.</p>
        <Button onClick={() => navigate("/equipment")}>Retourner à la liste des équipements</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate(`/equipment/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Modifier l'équipement</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Détails de l'équipement</CardTitle>
            <CardDescription>
              Modifiez les informations de l'équipement.
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
                    <SelectItem value="">Non déployé</SelectItem>
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
                  onValueChange={(value) => handleSelectChange("status", value as Status)}
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
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => navigate(`/equipment/${id}`)}
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
                "Enregistrer les modifications"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditEquipment;
