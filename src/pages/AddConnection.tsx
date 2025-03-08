
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConnectionForm from "@/components/connection/ConnectionForm";

const AddConnection = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Add New Connection</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Connection Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ConnectionForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddConnection;
