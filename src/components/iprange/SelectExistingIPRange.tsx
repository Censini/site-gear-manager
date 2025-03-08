
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { IPRange } from "@/types/types";

interface SelectExistingIPRangeProps {
  siteId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const SelectExistingIPRange = ({ siteId, onCancel, onSuccess }: SelectExistingIPRangeProps) => {
  const [selectedRange, setSelectedRange] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  // Fetch unassigned IP ranges
  const { data: ipRanges = [], isLoading } = useQuery({
    queryKey: ['unassigned-ip-ranges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ip_ranges')
        .select('*')
        .is('site_id', null);
        
      if (error) {
        console.error('Error fetching unassigned IP ranges:', error);
        toast.error('Failed to load unassigned IP ranges');
        throw error;
      }
      
      return data.map((item): IPRange => ({
        id: item.id,
        siteId: item.site_id || '',
        range: item.range,
        description: item.description || '',
        isReserved: item.is_reserved || false,
        dhcpScope: item.dhcp_scope || false
      }));
    }
  });

  const handleAssign = async () => {
    if (!selectedRange) {
      toast.error('Please select an IP range to assign');
      return;
    }

    setIsAssigning(true);
    try {
      const { error } = await supabase
        .from('ip_ranges')
        .update({ site_id: siteId })
        .eq('id', selectedRange);

      if (error) throw error;
      
      toast.success('IP range assigned to site successfully');
      onSuccess();
    } catch (error) {
      console.error('Error assigning IP range:', error);
      toast.error('Failed to assign IP range to site');
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Assign Existing IP Range</h3>
      
      {ipRanges.length === 0 ? (
        <p className="text-muted-foreground">No unassigned IP ranges available.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>IP Range</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>DHCP Scope</TableHead>
              <TableHead>Reserved</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ipRanges.map((range) => (
              <TableRow 
                key={range.id}
                className={selectedRange === range.id ? "bg-muted cursor-pointer" : "cursor-pointer"}
                onClick={() => setSelectedRange(range.id)}
              >
                <TableCell>
                  <input 
                    type="radio" 
                    checked={selectedRange === range.id} 
                    onChange={() => setSelectedRange(range.id)}
                    className="h-4 w-4"
                  />
                </TableCell>
                <TableCell className="font-medium">{range.range}</TableCell>
                <TableCell>{range.description}</TableCell>
                <TableCell>{range.dhcpScope ? "Yes" : "No"}</TableCell>
                <TableCell>{range.isReserved ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Annuler</Button>
        <Button 
          onClick={handleAssign} 
          disabled={!selectedRange || isAssigning}
        >
          {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Assigner le range IP
        </Button>
      </div>
    </div>
  );
};

export default SelectExistingIPRange;
