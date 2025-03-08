
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NetworkConnection } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ConnectionFormProps {
  connection?: NetworkConnection;
  onSubmit?: () => void;
}

export default function ConnectionForm({ connection, onSubmit }: ConnectionFormProps) {
  const navigate = useNavigate();
  const [sites, setSites] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [siteId, setSiteId] = useState(connection?.siteId || "");
  const [type, setType] = useState<string>(connection?.type || "fiber");
  const [provider, setProvider] = useState(connection?.provider || "");
  const [contractRef, setContractRef] = useState(connection?.contractRef || "");
  const [bandwidth, setBandwidth] = useState(connection?.bandwidth || "");
  const [sla, setSla] = useState(connection?.sla || "");
  const [status, setStatus] = useState<string>(connection?.status || "active");
  
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const { data, error } = await supabase
          .from("sites")
          .select("id, name");
        
        if (error) throw error;
        setSites(data || []);
      } catch (error) {
        console.error("Error fetching sites:", error);
        toast.error("Failed to load sites");
      }
    };
    
    fetchSites();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const connectionData = {
        site_id: siteId,
        type,
        provider,
        contract_ref: contractRef,
        bandwidth,
        sla,
        status
      };
      
      let result;
      
      if (connection?.id) {
        // Update existing connection
        result = await supabase
          .from("network_connections")
          .update(connectionData)
          .eq("id", connection.id);
      } else {
        // Create new connection
        result = await supabase
          .from("network_connections")
          .insert(connectionData);
      }
      
      if (result.error) throw result.error;
      
      toast.success(connection?.id ? "Connection updated successfully" : "Connection created successfully");
      
      if (onSubmit) {
        onSubmit();
      } else {
        navigate("/connections");
      }
    } catch (error) {
      console.error("Error saving connection:", error);
      toast.error("Failed to save connection");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="site">Site</Label>
            <Select
              value={siteId}
              onValueChange={setSiteId}
              required
            >
              <SelectTrigger id="site">
                <SelectValue placeholder="Select a site" />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Connection Type</Label>
            <Select
              value={type}
              onValueChange={setType}
              required
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fiber">Fiber</SelectItem>
                <SelectItem value="adsl">ADSL</SelectItem>
                <SelectItem value="sdsl">SDSL</SelectItem>
                <SelectItem value="satellite">Satellite</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="provider">Provider</Label>
          <Input 
            id="provider" 
            value={provider} 
            onChange={(e) => setProvider(e.target.value)} 
            required 
          />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contractRef">Contract Reference</Label>
            <Input 
              id="contractRef" 
              value={contractRef} 
              onChange={(e) => setContractRef(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bandwidth">Bandwidth</Label>
            <Input 
              id="bandwidth" 
              value={bandwidth} 
              onChange={(e) => setBandwidth(e.target.value)} 
              placeholder="e.g. 1 Gbps" 
            />
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sla">SLA</Label>
            <Input 
              id="sla" 
              value={sla} 
              onChange={(e) => setSla(e.target.value)} 
              placeholder="e.g. 99.9%, 4h response" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={setStatus}
              required
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate("/connections")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : connection?.id ? "Update Connection" : "Add Connection"}
        </Button>
      </div>
    </form>
  );
}
