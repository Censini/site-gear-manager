
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
import StatusBadge from "@/components/ui/StatusBadge";
import { NetworkConnection } from "@/types/types";

interface SelectExistingConnectionProps {
  siteId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const SelectExistingConnection = ({ siteId, onCancel, onSuccess }: SelectExistingConnectionProps) => {
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  // Fetch unassigned connections
  const { data: connections = [], isLoading } = useQuery({
    queryKey: ['unassigned-connections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('network_connections')
        .select('*')
        .is('site_id', null);
        
      if (error) {
        console.error('Error fetching unassigned connections:', error);
        toast.error('Failed to load unassigned connections');
        throw error;
      }
      
      // Transform to match our types
      return data.map((item): NetworkConnection => ({
        id: item.id,
        siteId: item.site_id || '',
        type: item.type as 'fiber' | 'adsl' | 'sdsl' | 'satellite' | 'other',
        provider: item.provider,
        contractRef: item.contract_ref || '',
        bandwidth: item.bandwidth || '',
        sla: item.sla || '',
        status: item.status as any,
      }));
    }
  });

  const handleAssign = async () => {
    if (!selectedConnection) {
      toast.error('Please select a connection to assign');
      return;
    }

    setIsAssigning(true);
    try {
      const { error } = await supabase
        .from('network_connections')
        .update({ site_id: siteId })
        .eq('id', selectedConnection);

      if (error) throw error;
      
      toast.success('Connection assigned to site successfully');
      onSuccess();
    } catch (error) {
      console.error('Error assigning connection:', error);
      toast.error('Failed to assign connection to site');
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
      <h3 className="text-lg font-medium">Assign Existing Connection</h3>
      
      {connections.length === 0 ? (
        <p className="text-muted-foreground">No unassigned connections available.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Bandwidth</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.map((connection) => (
              <TableRow 
                key={connection.id}
                className={selectedConnection === connection.id ? "bg-muted cursor-pointer" : "cursor-pointer"}
                onClick={() => setSelectedConnection(connection.id)}
              >
                <TableCell>
                  <input 
                    type="radio" 
                    checked={selectedConnection === connection.id} 
                    onChange={() => setSelectedConnection(connection.id)}
                    className="h-4 w-4"
                  />
                </TableCell>
                <TableCell className="font-medium capitalize">{connection.type}</TableCell>
                <TableCell>{connection.provider}</TableCell>
                <TableCell>{connection.bandwidth}</TableCell>
                <TableCell>
                  <StatusBadge status={connection.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={handleAssign} 
          disabled={!selectedConnection || isAssigning}
        >
          {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Assign Connection
        </Button>
      </div>
    </div>
  );
};

export default SelectExistingConnection;
