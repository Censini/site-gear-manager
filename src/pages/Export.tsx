import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Download, FileJson, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { exportAsJson, exportAsCsv, exportAsMarkdown, fetchAllData } from "@/utils/exportUtils";
import { useQuery } from "@tanstack/react-query";
import { saveAs } from "file-saver";

const Export = () => {
  const [isExporting, setIsExporting] = useState({
    json: false,
    csv: false,
    markdown: false
  });

  // Fetch all data using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['exportData'],
    queryFn: fetchAllData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleExport = async (format: "json" | "csv" | "markdown") => {
    if (!data) {
      toast.error("Aucune donnée disponible pour l'export");
      return;
    }

    setIsExporting(prev => ({ ...prev, [format]: true }));
    
    try {
      let filename = "";
      const timestamp = new Date().toISOString().split("T")[0];
      
      if (format === "json") {
        filename = `network-data-${timestamp}`;
        await exportAsJson(data.allData, filename);
      } else if (format === "csv") {
        // Pour CSV, on aplatit les données
        const flatData = [
          ...data.sites.map(site => ({ type: 'site', ...site })),
          ...data.equipment.map(eq => ({ type: 'equipment', ...eq })),
          ...data.connections.map(conn => ({ type: 'connection', ...conn })),
          ...data.ipRanges.map(range => ({ type: 'ipRange', ...range })),
        ];
        filename = `network-data-${timestamp}`;
        await exportAsCsv(flatData, filename);
      } else if (format === "markdown") {
        filename = `network-data-${timestamp}`;
        // Pour Markdown, on crée un document structuré
        const mdContent = `# Exportation des données réseau\n\n` +
          `Date: ${new Date().toLocaleString()}\n\n` +
          
          `## Sites (${data.sites.length})\n\n` +
          generateMarkdownTable(data.sites) +
          
          `\n## Équipements (${data.equipment.length})\n\n` +
          generateMarkdownTable(data.equipment) +
          
          `\n## Connexions réseau (${data.connections.length})\n\n` +
          generateMarkdownTable(data.connections) +
          
          `\n## Plages IP (${data.ipRanges.length})\n\n` +
          generateMarkdownTable(data.ipRanges);
        
        // Télécharger le document Markdown
        const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
        saveAs(blob, `${filename}.md`);
      }
      
      toast.success(`Exportation réussie au format ${format.toUpperCase()}`);
    } catch (error) {
      console.error(`Erreur d'exportation au format ${format}:`, error);
      toast.error(`Échec de l'exportation au format ${format.toUpperCase()}`);
    } finally {
      setIsExporting(prev => ({ ...prev, [format]: false }));
    }
  };

  // Helper function to generate Markdown tables
  const generateMarkdownTable = (data: any[]) => {
    if (data.length === 0) return 'Aucune donnée disponible.\n\n';
    
    const headers = Object.keys(data[0]);
    let table = `| ${headers.join(' | ')} |\n`;
    table += `| ${headers.map(() => '---').join(' | ')} |\n`;
    
    data.forEach(item => {
      const values = headers.map(header => {
        const value = item[header];
        return value !== null && value !== undefined ? String(value) : '';
      });
      table += `| ${values.join(' | ')} |\n`;
    });
    
    return table;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Export Data</h1>
          <p className="text-muted-foreground mt-1">
            Export your network data in different formats
          </p>
        </div>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="ml-2">Chargement des données...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Export Data</h1>
          <p className="text-muted-foreground mt-1">
            Export your network data in different formats
          </p>
        </div>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h3 className="font-semibold">Erreur lors du chargement des données</h3>
          <p>Impossible de récupérer les données pour l'exportation. Veuillez réessayer plus tard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Export Data</h1>
        <p className="text-muted-foreground mt-1">
          Export your network data in different formats
        </p>
      </div>

      <div className="mb-6 bg-accent/30 p-4 rounded-md">
        <h2 className="font-medium mb-2">Données disponibles pour l'exportation</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Sites: {data?.sites.length || 0}</li>
          <li>Équipements: {data?.equipment.length || 0}</li>
          <li>Connexions réseau: {data?.connections.length || 0}</li>
          <li>Plages IP: {data?.ipRanges.length || 0}</li>
        </ul>
      </div>

      <Tabs defaultValue="json" className="max-w-3xl">
        <TabsList className="mb-4">
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="csv">CSV</TabsTrigger>
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle>Export to JSON</CardTitle>
              <CardDescription>
                Download all your network data in JSON format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileJson className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-medium">JSON Format</h3>
                    <p className="text-sm text-muted-foreground">
                      Best for importing into other systems or backup
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleExport("json")}
                  disabled={isExporting.json || !data}
                >
                  {isExporting.json ? "Exporting..." : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export to JSON
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="csv">
          <Card>
            <CardHeader>
              <CardTitle>Export to CSV</CardTitle>
              <CardDescription>
                Download your network data in CSV format for spreadsheet applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-medium">CSV Format</h3>
                    <p className="text-sm text-muted-foreground">
                      Compatible with Excel, Google Sheets, and other spreadsheet applications
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleExport("csv")}
                  disabled={isExporting.csv || !data}
                >
                  {isExporting.csv ? "Exporting..." : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export to CSV
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="markdown">
          <Card>
            <CardHeader>
              <CardTitle>Export to Markdown</CardTitle>
              <CardDescription>
                Download your network data in Markdown format for documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-medium">Markdown Format</h3>
                    <p className="text-sm text-muted-foreground">
                      Perfect for documentation, README files, or sharing on platforms like GitHub
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleExport("markdown")}
                  disabled={isExporting.markdown || !data}
                >
                  {isExporting.markdown ? "Exporting..." : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export to Markdown
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Export;
