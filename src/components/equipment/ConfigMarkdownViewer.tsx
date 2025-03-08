
import { useState } from "react";
import { marked } from "marked";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Eye, FileText, X } from "lucide-react";

interface ConfigMarkdownViewerProps {
  initialConfig?: string;
  equipmentId: string;
  onSave: (config: string) => Promise<void>;
}

const ConfigMarkdownViewer = ({ initialConfig = "", equipmentId, onSave }: ConfigMarkdownViewerProps) => {
  const [config, setConfig] = useState<string>(initialConfig);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setConfig(content);
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      setIsUploading(false);
    };
    
    reader.readAsText(file);
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(config);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleClear = () => {
    setConfig("");
  };
  
  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Configuration</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={!config}
            >
              <X className="h-4 w-4 mr-1" />
              Effacer
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => document.getElementById(`file-upload-${equipmentId}`)?.click()}
            >
              <Upload className="h-4 w-4 mr-1" />
              Importer
            </Button>
            <input 
              type="file" 
              id={`file-upload-${equipmentId}`} 
              className="hidden" 
              accept=".txt,.md,.conf,.config"
              onChange={handleFileUpload}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="edit">
              <FileText className="h-4 w-4 mr-2" />
              Éditer
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <div className="space-y-4">
              <Textarea 
                value={config} 
                onChange={(e) => setConfig(e.target.value)} 
                placeholder="Coller ou importer la configuration de l'équipement ici..." 
                className="font-mono h-80 text-sm"
              />
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !config}
                className="w-full md:w-auto md:ml-auto"
              >
                {isSaving ? "Enregistrement..." : "Enregistrer la configuration"}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="preview">
            {config ? (
              <div className="border rounded-md p-4 h-[500px] overflow-auto bg-muted/20">
                <div 
                  className="markdown-preview prose max-w-none prose-pre:bg-muted prose-pre:p-4 dark:prose-invert" 
                  dangerouslySetInnerHTML={{ __html: marked(config) }} 
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-center text-muted-foreground">
                <FileText className="h-16 w-16 mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium">Aucune configuration</h3>
                <p className="max-w-md mt-2">
                  Importez ou collez la configuration de l'équipement pour afficher un aperçu au format Markdown.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ConfigMarkdownViewer;
