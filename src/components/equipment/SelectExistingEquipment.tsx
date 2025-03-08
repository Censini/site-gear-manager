
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Equipment } from "@/types/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SelectExistingEquipmentProps {
  siteId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const SelectExistingEquipment = ({ siteId, onCancel, onSuccess }: SelectExistingEquipmentProps) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUnassignedEquipment = async () => {
      try {
        const { data, error } = await supabase
          .from("equipment")
          .select("*")
          .is("site_id", null);
        
        if (error) throw error;
        
        const formattedData = data.map(item => ({
          id: item.id,
          name: item.name,
          siteId: item.site_id || "",
          type: item.type,
          model: item.model,
          manufacturer: item.manufacturer,
          ipAddress: item.ip_address || "",
          macAddress: item.mac_address || "",
          firmware: item.firmware || "",
          installDate: item.install_date || "",
          status: item.status,
          netbios: item.netbios || ""
        } as Equipment));
        
        setEquipment(formattedData);
      } catch (error) {
        console.error("Error fetching unassigned equipment:", error);
        toast.error("Failed to load unassigned equipment");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnassignedEquipment();
  }, []);

  const handleAssignEquipment = async () => {
    if (!selectedEquipmentId) {
      toast.error("Please select equipment");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("equipment")
        .update({ site_id: siteId })
        .eq("id", selectedEquipmentId);
      
      if (error) throw error;
      
      // Invalidate the equipment queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      queryClient.invalidateQueries({ queryKey: ["equipment", "site", siteId] });
      
      toast.success("Equipment successfully assigned to site");
      onSuccess();
    } catch (error) {
      console.error("Error assigning equipment:", error);
      toast.error("Failed to assign equipment to site");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Existing Equipment</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : equipment.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No unassigned equipment available. Create new equipment instead.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="equipment">Select Equipment</Label>
              <Select
                value={selectedEquipmentId}
                onValueChange={setSelectedEquipmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment to assign" />
                </SelectTrigger>
                <SelectContent>
                  {equipment.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.manufacturer} {item.model})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleAssignEquipment}
          disabled={isSubmitting || !selectedEquipmentId}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Assigning...
            </>
          ) : (
            "Assign to Site"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SelectExistingEquipment;
