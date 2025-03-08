
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { IPRange } from "@/types/types";

interface SelectExistingIPRangeProps {
  siteId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const SelectExistingIPRange = ({ siteId, onCancel, onSuccess }: SelectExistingIPRangeProps) => {
  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  const { data: ipRanges = [], isLoading } = useQuery({
    queryKey: ["unassignedIPRanges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ip_ranges")
        .select("*")
        .is("site_id", null);
      
      if (error) {
        console.error("Error fetching unassigned IP ranges:", error);
        toast.error("Failed to load unassigned IP ranges");
        return [];
      }
      
      return data.map((range) => ({
        id: range.id,
        range: range.range,
        description: range.description,
        isReserved: range.is_reserved,
        dhcpScope: range.dhcp_scope,
        siteId: range.site_id
      })) as IPRange[];
    }
  });

  const handleToggleRange = (id: string) => {
    setSelectedRanges((prev) => 
      prev.includes(id) 
        ? prev.filter(rangeId => rangeId !== id) 
        : [...prev, id]
    );
  };

  const handleAssignRanges = async () => {
    if (selectedRanges.length === 0) {
      toast.error("Please select at least one IP range");
      return;
    }

    setIsAssigning(true);

    try {
      const { error } = await supabase
        .from("ip_ranges")
        .update({ site_id: siteId })
        .in("id", selectedRanges);
      
      if (error) {
        throw error;
      }

      toast.success(`Successfully assigned ${selectedRanges.length} IP range(s) to site`);
      onSuccess();
    } catch (error) {
      console.error("Error assigning IP ranges:", error);
      toast.error("Failed to assign IP ranges");
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Assigner un range IP existant</h3>
      
      {ipRanges.length === 0 ? (
        <p className="text-muted-foreground">Aucun range IP non-assigné disponible.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Range IP</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>DHCP Scope</TableHead>
              <TableHead>Réservé</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ipRanges.map((range) => (
              <TableRow key={range.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRanges.includes(range.id)}
                    onCheckedChange={() => handleToggleRange(range.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{range.range}</TableCell>
                <TableCell>{range.description}</TableCell>
                <TableCell>{range.dhcpScope ? "Oui" : "Non"}</TableCell>
                <TableCell>{range.isReserved ? "Oui" : "Non"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleAssignRanges} 
          disabled={selectedRanges.length === 0 || isAssigning}
        >
          {isAssigning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Assigning...
            </>
          ) : (
            `Assign ${selectedRanges.length} Range${selectedRanges.length !== 1 ? 's' : ''}`
          )}
        </Button>
      </div>
    </div>
  );
};

export default SelectExistingIPRange;
