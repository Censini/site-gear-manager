
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import { exportToJSON, exportToCSV, exportToMarkdown } from "@/utils/exportUtils";

const Export = () => {
  const [isExporting, setIsExporting] = useState({
    json: false,
    csv: false,
    markdown: false
  });

  const handleExport = async (format: "json" | "csv" | "markdown") => {
    setIsExporting(prev => ({ ...prev, [format]: true }));
    
    try {
      let filename = "";
      const timestamp = new Date().toISOString().split("T")[0];
      
      if (format === "json") {
        filename = `network-data-${timestamp}.json`;
        await exportToJSON(filename);
      } else if (format === "csv") {
        filename = `network-data-${timestamp}.csv`;
        await exportToCSV(filename);
      } else if (format === "markdown") {
        filename = `network-data-${timestamp}.md`;
        await exportToMarkdown(filename);
      }
      
      toast.success(`Successfully exported data to ${format.toUpperCase()}`);
    } catch (error) {
      console.error(`Export to ${format} error:`, error);
      toast.error(`Failed to export to ${format.toUpperCase()}`);
    } finally {
      setIsExporting(prev => ({ ...prev, [format]: false }));
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Export Data</h1>
        <p className="text-muted-foreground mt-1">
          Export your network data in different formats
        </p>
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
                  disabled={isExporting.json}
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
                  disabled={isExporting.csv}
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
                  disabled={isExporting.markdown}
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
