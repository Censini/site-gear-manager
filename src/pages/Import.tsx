
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileText, Upload, FileJson, FileSpreadsheet, CheckCircle, AlertTriangle } from "lucide-react";
import { parseJsonFile, parseCsvFile, saveImportedData } from "@/utils/importUtils";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const Import = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<null | {
    sites: { success: number; error: number };
    equipment: { success: number; error: number };
    connections: { success: number; error: number };
    ipRanges: { success: number; error: number };
  }>(null);
  const navigate = useNavigate();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, format: "json" | "csv") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setImportProgress(10);
    try {
      let data;
      
      if (format === "json") {
        data = await parseJsonFile(file);
        setImportProgress(30);
      } else if (format === "csv") {
        data = await parseCsvFile(file);
        setImportProgress(30);
      } else {
        throw new Error("Unsupported file format");
      }
      
      console.log("Parsed data:", data);
      setImportProgress(50);
      
      // Save the imported data to Supabase
      const results = await saveImportedData(data);
      setImportProgress(100);
      setImportResults(results);
      
      const totalSuccess = Object.values(results).reduce((sum, value) => sum + value.success, 0);
      const totalErrors = Object.values(results).reduce((sum, value) => sum + value.error, 0);
      
      // Display success message with details
      if (totalSuccess > 0) {
        toast.success(`Import successful`, {
          description: `Successfully imported ${totalSuccess} items (${totalErrors > 0 ? `with ${totalErrors} errors` : 'with no errors'})`,
          duration: 5000,
        });
      } else if (totalErrors > 0) {
        toast.error(`Import failed`, {
          description: `Failed to import any items (${totalErrors} errors)`,
          duration: 5000,
        });
      } else {
        toast.info(`No data was imported`, {
          description: `The file didn't contain any valid items to import`,
          duration: 5000,
        });
      }
      
      // Reset the file input
      e.target.value = "";
      
    } catch (error) {
      console.error("Import error:", error);
      setImportProgress(0);
      toast.error(error instanceof Error ? error.message : "Failed to import data");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, format: "json" | "csv") => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    
    const file = files[0];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if ((format === "json" && fileExt !== "json") || 
        (format === "csv" && fileExt !== "csv")) {
      toast.error(`Please drop a ${format.toUpperCase()} file`);
      return;
    }
    
    // Create a synthetic change event to reuse the existing handler
    const syntheticEvent = {
      target: {
        files: [file],
        value: ""
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    await handleFileUpload(syntheticEvent, format);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Import Data</h1>
        <p className="text-muted-foreground mt-1">
          Import your network data from JSON or CSV files
        </p>
      </div>

      {importResults && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {Object.values(importResults).some(value => value.success > 0) ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                Import Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="text-sm font-medium">Sites</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-green-600">{importResults.sites.success} imported</span>
                    {importResults.sites.error > 0 && (
                      <span className="text-sm text-red-600">{importResults.sites.error} failed</span>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="text-sm font-medium">Equipment</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-green-600">{importResults.equipment.success} imported</span>
                    {importResults.equipment.error > 0 && (
                      <span className="text-sm text-red-600">{importResults.equipment.error} failed</span>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="text-sm font-medium">Connections</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-green-600">{importResults.connections.success} imported</span>
                    {importResults.connections.error > 0 && (
                      <span className="text-sm text-red-600">{importResults.connections.error} failed</span>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="text-sm font-medium">IP Ranges</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-green-600">{importResults.ipRanges.success} imported</span>
                    {importResults.ipRanges.error > 0 && (
                      <span className="text-sm text-red-600">{importResults.ipRanges.error} failed</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button onClick={() => navigate("/sites")} variant="outline">
                  View Sites
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isUploading && importProgress > 0 && (
        <div className="mb-6">
          <Alert>
            <AlertTitle>Importing data...</AlertTitle>
            <AlertDescription>
              <Progress value={importProgress} className="mt-2" />
            </AlertDescription>
          </Alert>
        </div>
      )}

      <Tabs defaultValue="json" className="max-w-3xl">
        <TabsList className="mb-4">
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="csv">CSV</TabsTrigger>
        </TabsList>
        
        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                Import JSON Data
              </CardTitle>
              <CardDescription>
                Upload a JSON file containing your network data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "json")}
                onClick={() => document.getElementById("json-upload")?.click()}
              >
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
                  variant="outline"
                  disabled={isUploading}
                  className="mt-2"
                >
                  {isUploading ? "Uploading..." : "Select JSON File"}
                </Button>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">JSON format example:</h3>
                <div className="bg-muted p-3 rounded-md overflow-x-auto">
                  <pre className="text-xs text-left">
                    {`{
  "sites": [
    { "id": "uuid", "name": "Site name", "location": "City", ... }
  ],
  "equipment": [
    { "id": "uuid", "name": "Router name", "type": "router", ... }
  ],
  "connections": [
    { "id": "uuid", "type": "fiber", "provider": "Provider name", ... }
  ],
  "ipRanges": [
    { "id": "uuid", "range": "192.168.1.0/24", ... }
  ]
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="csv">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Import CSV Data
              </CardTitle>
              <CardDescription>
                Upload a CSV file containing your network data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "csv")}
                onClick={() => document.getElementById("csv-upload")?.click()}
              >
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
                  variant="outline"
                  disabled={isUploading}
                  className="mt-2"
                >
                  {isUploading ? "Uploading..." : "Select CSV File"}
                </Button>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">CSV format note:</h3>
                <p className="text-sm text-muted-foreground">
                  Your CSV should include a header row with field names that match the expected data structure.
                  Include a 'type' column to help identify the type of data (site, equipment, connection, ipRange).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Import;
