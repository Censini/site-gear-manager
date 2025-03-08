
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
        <h1 className="text-3xl font-bold">Importer des données</h1>
        <p className="text-muted-foreground mt-1">
          Importez vos données réseau à partir de fichiers JSON ou CSV
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
                Résultats de l'importation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="text-sm font-medium">Sites</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-green-600">{importResults.sites.success} importés</span>
                    {importResults.sites.error > 0 && (
                      <span className="text-sm text-red-600">{importResults.sites.error} échoués</span>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="text-sm font-medium">Équipements</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-green-600">{importResults.equipment.success} importés</span>
                    {importResults.equipment.error > 0 && (
                      <span className="text-sm text-red-600">{importResults.equipment.error} échoués</span>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="text-sm font-medium">Connexions</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-green-600">{importResults.connections.success} importées</span>
                    {importResults.connections.error > 0 && (
                      <span className="text-sm text-red-600">{importResults.connections.error} échouées</span>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="text-sm font-medium">Plages IP</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-green-600">{importResults.ipRanges.success} importées</span>
                    {importResults.ipRanges.error > 0 && (
                      <span className="text-sm text-red-600">{importResults.ipRanges.error} échouées</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button onClick={() => navigate("/sites")} variant="outline">
                  Voir les sites
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isUploading && importProgress > 0 && (
        <div className="mb-6">
          <Alert>
            <AlertTitle>Importation des données...</AlertTitle>
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
                Importer des données JSON
              </CardTitle>
              <CardDescription>
                Téléchargez un fichier JSON contenant vos données réseau
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
                  Glissez-déposez votre fichier JSON ici, ou cliquez pour parcourir
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
                  {isUploading ? "Téléchargement..." : "Sélectionner un fichier JSON"}
                </Button>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Exemple de format JSON :</h3>
                <div className="bg-muted p-3 rounded-md overflow-x-auto">
                  <pre className="text-xs text-left">
                    {`{
  "sites": [
    { 
      "name": "Siège social", 
      "location": "Paris",
      "country": "France",
      "address": "123 Avenue de la République", 
      "contactName": "Jean Dupont",
      "contactEmail": "jean@example.com",
      "contactPhone": "01 23 45 67 89"
    }
  ],
  "equipment": [
    { 
      "name": "Routeur principal", 
      "siteId": "Siège social",  // Utilisez le nom du site comme référence
      "type": "router", 
      "model": "Cisco 2900",
      "manufacturer": "Cisco",
      "ipAddress": "192.168.1.1",
      "macAddress": "00:11:22:33:44:55",
      "firmware": "15.1",
      "installDate": "2023-01-01",
      "status": "active"
    }
  ],
  "connections": [
    {
      "type": "fiber",
      "siteId": "Siège social",  // Utilisez le nom du site comme référence
      "provider": "Orange Business",
      "contractRef": "OB-12345",
      "bandwidth": "1 Gbps",
      "sla": "99.9%",
      "status": "active"
    }
  ],
  "ipRanges": [
    {
      "siteId": "Siège social",  // Utilisez le nom du site comme référence
      "range": "192.168.1.0/24", 
      "description": "Réseau local principal",
      "isReserved": false,
      "dhcpScope": true
    }
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
                Importer des données CSV
              </CardTitle>
              <CardDescription>
                Téléchargez un fichier CSV contenant vos données réseau
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
                  Glissez-déposez votre fichier CSV ici, ou cliquez pour parcourir
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
                  {isUploading ? "Téléchargement..." : "Sélectionner un fichier CSV"}
                </Button>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Note sur le format CSV :</h3>
                <p className="text-sm text-muted-foreground">
                  Votre CSV doit inclure une ligne d'en-tête avec des noms de champs qui correspondent à la structure des données attendue.
                  Incluez une colonne 'type' pour aider à identifier le type de données (site, equipment, connection, ipRange).
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
