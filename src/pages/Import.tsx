
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { parseJsonFile, parseCsvFile } from "@/utils/importUtils";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Simple schema for network data
const networkItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  // Add other fields as needed, but make them optional for flexibility
}).passthrough();

const Import = () => {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, format: "json" | "csv") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      let data;
      let count = 0;
      
      if (format === "json") {
        data = await parseJsonFile(file);
        count = Array.isArray(data) ? data.length : 1;
        
        // Here you would normally process the data, e.g., save it to the database
        console.log("Imported JSON data:", data);
        
      } else if (format === "csv") {
        data = await parseCsvFile(file);
        count = data.length;
        
        // Here you would normally process the data, e.g., save it to the database
        console.log("Imported CSV data:", data);
      }
      
      // Reset the file input
      e.target.value = "";
      
      toast.success(`Successfully imported ${count} items from ${format.toUpperCase()}`);
      
      // Navigate back to dashboard or relevant page
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to import data");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Import Data</h1>
        <p className="text-muted-foreground mt-1">
          Import your network data from JSON or CSV files
        </p>
      </div>

      <Tabs defaultValue="json" className="max-w-3xl">
        <TabsList className="mb-4">
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="csv">CSV</TabsTrigger>
        </TabsList>
        
        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle>Import JSON Data</CardTitle>
              <CardDescription>
                Upload a JSON file containing your network data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                <p className="mb-4 text-sm text-gray-500">
                  Drag and drop your JSON file here, or click to browse
                </p>
                <input
                  type="file"
                  accept=".json"
                  id="json-upload"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "json")}
                  disabled={isUploading}
                />
                <Button 
                  onClick={() => document.getElementById("json-upload")?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Select JSON File"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="csv">
          <Card>
            <CardHeader>
              <CardTitle>Import CSV Data</CardTitle>
              <CardDescription>
                Upload a CSV file containing your network data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                <p className="mb-4 text-sm text-gray-500">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <input
                  type="file"
                  accept=".csv"
                  id="csv-upload"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "csv")}
                  disabled={isUploading}
                />
                <Button 
                  onClick={() => document.getElementById("csv-upload")?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Select CSV File"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Import;
