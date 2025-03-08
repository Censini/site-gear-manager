
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConnectionForm from "@/components/connection/ConnectionForm";
import { useGetConnection } from "@/hooks/useGetConnection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const EditConnection = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: connection, isLoading, error } = useGetConnection(id || "");

  if (isLoading) {
    return <div className="p-8">Loading connection details...</div>;
  }

  if (error || !connection) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold mb-4">Error Loading Connection</h1>
        <p className="text-red-500 mb-4">
          {error instanceof Error ? error.message : "Failed to load connection data"}
        </p>
        <Button variant="outline" onClick={() => navigate("/connections")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Connections
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/connections")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Connection</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Connection Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ConnectionForm connectionToEdit={connection} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditConnection;
