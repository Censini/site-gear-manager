
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ExportFormat, exportData } from '@/utils/exportUtils';
import { Loader2, DownloadCloud, FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import { toast } from 'sonner';

const Export = () => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');
  const [filename, setFilename] = useState('export');

  // Equipment query
  const equipmentQuery = useQuery({
    queryKey: ['equipment-export'],
    queryFn: async () => {
      const { data, error } = await supabase.from('equipment').select('*');
      if (error) throw error;
      return data;
    },
    enabled: false,
  });

  // Sites query
  const sitesQuery = useQuery({
    queryKey: ['sites-export'],
    queryFn: async () => {
      const { data, error } = await supabase.from('sites').select('*');
      if (error) throw error;
      return data;
    },
    enabled: false,
  });

  // Connections query
  const connectionsQuery = useQuery({
    queryKey: ['connections-export'],
    queryFn: async () => {
      const { data, error } = await supabase.from('network_connections').select('*');
      if (error) throw error;
      return data;
    },
    enabled: false,
  });

  // IP Ranges query
  const ipRangesQuery = useQuery({
    queryKey: ['ip-ranges-export'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ip_ranges').select('*');
      if (error) throw error;
      return data;
    },
    enabled: false,
  });

  const handleExport = async (
    queryFn: () => Promise<any>, 
    entityName: string,
    customFilename?: string
  ) => {
    try {
      const data = await queryFn();
      if (!data || data.length === 0) {
        toast.warning(`No ${entityName} data to export`);
        return;
      }
      
      exportData(
        data, 
        exportFormat, 
        customFilename || `${entityName}-${filename}`,
        `${entityName} Data`
      );
      
      toast.success(`Successfully exported ${data.length} ${entityName}`);
    } catch (error) {
      console.error(`Error exporting ${entityName}:`, error);
      toast.error(`Failed to export ${entityName}`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const formatIcon = () => {
    switch (exportFormat) {
      case 'json':
        return <FileJson className="h-5 w-5" />;
      case 'csv':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'markdown':
        return <FileText className="h-5 w-5" />;
      default:
        return <DownloadCloud className="h-5 w-5" />;
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">Export Data</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Options */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>Configure your export settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <RadioGroup 
                defaultValue="json" 
                value={exportFormat}
                onValueChange={(value) => setExportFormat(value as ExportFormat)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json" className="flex items-center gap-2">
                    <FileJson className="h-4 w-4" /> JSON
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" /> CSV
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="markdown" id="markdown" />
                  <Label htmlFor="markdown" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Markdown
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filename">Base Filename</Label>
              <Input 
                id="filename" 
                value={filename} 
                onChange={(e) => setFilename(e.target.value)} 
                placeholder="export"
              />
              <p className="text-xs text-muted-foreground">
                Entity type will be automatically added to the filename
              </p>
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => {
                // Export all data as a single JSON object
                const exportAll = async () => {
                  const equipment = await equipmentQuery.refetch().then(r => r.data || []);
                  const sites = await sitesQuery.refetch().then(r => r.data || []);
                  const connections = await connectionsQuery.refetch().then(r => r.data || []);
                  const ipRanges = await ipRangesQuery.refetch().then(r => r.data || []);
                  
                  const allData = {
                    equipment,
                    sites,
                    connections,
                    ipRanges
                  };
                  
                  exportData([allData], exportFormat, `all-${filename}`, 'All Data');
                  toast.success('Successfully exported all data');
                };
                
                exportAll().catch(error => {
                  console.error('Error exporting all data:', error);
                  toast.error('Failed to export all data');
                });
              }}
            >
              Export All Data
            </Button>
          </CardContent>
        </Card>
        
        {/* Export Entities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Export Entities</CardTitle>
            <CardDescription>Select which data you want to export</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="equipment">
              <TabsList className="w-full">
                <TabsTrigger value="equipment" className="flex-1">Equipment</TabsTrigger>
                <TabsTrigger value="sites" className="flex-1">Sites</TabsTrigger>
                <TabsTrigger value="connections" className="flex-1">Connections</TabsTrigger>
                <TabsTrigger value="ipranges" className="flex-1">IP Ranges</TabsTrigger>
              </TabsList>
              
              <TabsContent value="equipment" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Export Equipment</CardTitle>
                    <CardDescription>
                      Export all equipment data in your selected format
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      onClick={() => handleExport(() => equipmentQuery.refetch().then(r => r.data), 'equipment')} 
                      disabled={equipmentQuery.isFetching}
                    >
                      {equipmentQuery.isFetching ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...</>
                      ) : (
                        <>{formatIcon()} Export Equipment</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sites" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Export Sites</CardTitle>
                    <CardDescription>
                      Export all site data in your selected format
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      onClick={() => handleExport(() => sitesQuery.refetch().then(r => r.data), 'sites')} 
                      disabled={sitesQuery.isFetching}
                    >
                      {sitesQuery.isFetching ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...</>
                      ) : (
                        <>{formatIcon()} Export Sites</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="connections" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Export Connections</CardTitle>
                    <CardDescription>
                      Export all network connection data in your selected format
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      onClick={() => handleExport(() => connectionsQuery.refetch().then(r => r.data), 'connections')} 
                      disabled={connectionsQuery.isFetching}
                    >
                      {connectionsQuery.isFetching ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...</>
                      ) : (
                        <>{formatIcon()} Export Connections</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ipranges" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Export IP Ranges</CardTitle>
                    <CardDescription>
                      Export all IP range data in your selected format
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      onClick={() => handleExport(() => ipRangesQuery.refetch().then(r => r.data), 'ip-ranges')} 
                      disabled={ipRangesQuery.isFetching}
                    >
                      {ipRangesQuery.isFetching ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...</>
                      ) : (
                        <>{formatIcon()} Export IP Ranges</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Export;
