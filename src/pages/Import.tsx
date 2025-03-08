
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { importData } from '@/utils/importUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, FileJson, FileSpreadsheet, Loader2, FileUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Form schema for file upload
const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size > 0, { message: 'File is required' })
    .refine(
      file => ['application/json', 'text/csv'].includes(file.type) || 
              file.name.endsWith('.json') || 
              file.name.endsWith('.csv'),
      { message: 'File must be JSON or CSV' }
    )
});

type FileUploadValues = z.infer<typeof fileUploadSchema>;

// Simplified schemas for data validation
const equipmentSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  manufacturer: z.string().min(1),
  model: z.string().min(1),
  status: z.string().min(1),
  // Optional fields
  site_id: z.string().uuid().nullable().optional(),
  ip_address: z.string().nullable().optional(),
  mac_address: z.string().nullable().optional(),
  firmware: z.string().nullable().optional(),
  netbios: z.string().nullable().optional(),
  install_date: z.string().nullable().optional(),
});

const siteSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  country: z.string().min(1),
  // Optional fields
  address: z.string().nullable().optional(),
  contact_name: z.string().nullable().optional(),
  contact_email: z.string().nullable().optional(),
  contact_phone: z.string().nullable().optional(),
});

const connectionSchema = z.object({
  type: z.string().min(1),
  provider: z.string().min(1),
  status: z.string().min(1),
  // Optional fields
  bandwidth: z.string().nullable().optional(),
  contract_ref: z.string().nullable().optional(),
  sla: z.string().nullable().optional(),
  site_id: z.string().uuid().nullable().optional(),
});

const ipRangeSchema = z.object({
  range: z.string().min(1),
  // Optional fields
  description: z.string().nullable().optional(),
  site_id: z.string().uuid().nullable().optional(),
  is_reserved: z.boolean().nullable().optional(),
  dhcp_scope: z.boolean().nullable().optional(),
});

const Import = () => {
  const [activeTab, setActiveTab] = useState('equipment');
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<FileUploadValues>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      file: undefined,
    },
  });
  
  const selectedFile = form.watch('file');
  
  const resetForm = () => {
    form.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const onSubmit = async (values: FileUploadValues) => {
    setIsImporting(true);
    setProgress(10);
    
    try {
      let schema;
      let tableName;
      
      // Select the appropriate schema and table based on active tab
      switch (activeTab) {
        case 'equipment':
          schema = equipmentSchema;
          tableName = 'equipment';
          break;
        case 'sites':
          schema = siteSchema;
          tableName = 'sites';
          break;
        case 'connections':
          schema = connectionSchema;
          tableName = 'network_connections';
          break;
        case 'ipranges':
          schema = ipRangeSchema;
          tableName = 'ip_ranges';
          break;
        default:
          throw new Error('Invalid tab selected');
      }
      
      setProgress(30);
      
      // Process and validate the imported data
      await importData(values.file, schema, async (validData) => {
        setProgress(60);
        
        if (validData.length === 0) {
          toast.warning('No valid data to import');
          setIsImporting(false);
          setProgress(0);
          return;
        }
        
        // Insert validated data into the database
        const { data, error } = await supabase
          .from(tableName)
          .insert(validData);
        
        setProgress(90);
        
        if (error) {
          throw error;
        }
        
        toast.success(`Successfully imported ${validData.length} ${activeTab}`);
        resetForm();
      });
      
      setProgress(100);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsImporting(false);
      // Reset progress after a delay to show completion
      setTimeout(() => setProgress(0), 1000);
    }
  };
  
  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">Import Data</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Import Data</CardTitle>
          <CardDescription>
            Import data from JSON or CSV files into the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="equipment" className="flex-1">Equipment</TabsTrigger>
              <TabsTrigger value="sites" className="flex-1">Sites</TabsTrigger>
              <TabsTrigger value="connections" className="flex-1">Connections</TabsTrigger>
              <TabsTrigger value="ipranges" className="flex-1">IP Ranges</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Upload File</FormLabel>
                      <FormControl>
                        <div className="grid w-full items-center gap-4">
                          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-primary/50 p-10 text-center">
                            <FileUp className="h-8 w-8 text-muted-foreground" />
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <p className="text-sm">Drag and drop your {activeTab} file here</p>
                              <p className="text-xs">Supported formats: JSON, CSV</p>
                            </div>
                            
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="hidden"
                              accept=".json,.csv"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(file);
                                }
                              }}
                              {...field}
                            />
                            
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              Select File
                            </Button>
                          </div>
                          
                          {selectedFile && (
                            <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                              {selectedFile.name.endsWith('.json') ? (
                                <FileJson className="h-5 w-5 text-primary" />
                              ) : (
                                <FileSpreadsheet className="h-5 w-5 text-primary" />
                              )}
                              <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={resetForm}
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        {activeTab === 'equipment' && 'The file should contain equipment data with name, type, manufacturer, model, and status fields.'}
                        {activeTab === 'sites' && 'The file should contain site data with name, location, and country fields.'}
                        {activeTab === 'connections' && 'The file should contain connection data with type, provider, and status fields.'}
                        {activeTab === 'ipranges' && 'The file should contain IP range data with range field.'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {progress > 0 && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-xs text-center text-muted-foreground">
                      {progress < 100 ? 'Importing...' : 'Import complete!'}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={!selectedFile || isImporting}
                  >
                    {isImporting ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Importing...</>
                    ) : (
                      <><Upload className="h-4 w-4 mr-2" /> Import {activeTab}</>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Import;
