
import { useNavigate, useParams } from "react-router-dom";
import { IPRangeForm } from "@/components/iprange/IPRangeForm";
import { useGetIPRange } from "@/hooks/useGetIPRange";
import { Loader2 } from "lucide-react";

const EditIPRange = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: ipRange, isLoading, error } = useGetIPRange(id);
  
  const handleCancel = () => {
    navigate("/ipam");
  };

  const handleSuccess = (siteId: string) => {
    // Navigate back to site detail if siteId is provided, otherwise to IPAM
    if (siteId) {
      navigate(`/sites/${siteId}`);
    } else {
      navigate("/ipam");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !ipRange) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Error</h1>
            <p className="text-muted-foreground">Failed to load IP range</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit IP Range</h1>
          <p className="text-muted-foreground">Update IP range details</p>
        </div>
      </div>

      <IPRangeForm 
        isEditing={true}
        ipRangeId={id}
        defaultValues={{
          range: ipRange.range,
          description: ipRange.description || "",
          isReserved: ipRange.isReserved,
          dhcpScope: ipRange.dhcpScope,
          siteId: ipRange.siteId
        }}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default EditIPRange;
