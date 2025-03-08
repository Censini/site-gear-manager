
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ConnectionForm from "@/components/connection/ConnectionForm";
import { useAddConnection } from "@/hooks/useAddConnection";
import { NetworkConnection } from "@/types/types";

const AddConnection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const addConnection = useAddConnection();
  
  // Get site ID from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const siteId = queryParams.get("siteId") || "";
  
  const initialValues = {
    siteId: siteId,
    type: "fiber" as const,
    provider: "",
    contractRef: "",
    bandwidth: "",
    sla: "",
    status: "active" as const
  };

  const handleSubmit = async (data: any) => {
    try {
      await addConnection.mutateAsync(data);
      // Navigate back to site detail if siteId is provided
      if (siteId) {
        navigate(`/sites/${siteId}`);
      } else {
        navigate("/connections");
      }
    } catch (error) {
      console.error("Failed to add connection:", error);
      // Error is already handled in the mutation
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Network Connection</h1>
        <p className="text-muted-foreground">
          Add a new network connection to your inventory
        </p>
      </div>

      <ConnectionForm 
        onSubmit={handleSubmit}
        initialValues={initialValues}
        isSubmitting={addConnection.isPending}
        onCancel={() => siteId ? navigate(`/sites/${siteId}`) : navigate("/connections")}
      />
    </div>
  );
};

export default AddConnection;
