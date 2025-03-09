
import { useState } from "react";
import { File, ImageIcon, Maximize2, Minimize2, Upload, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Site } from "@/types/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SiteDocumentsCardProps {
  site: Site;
  bucketReady: boolean;
}

const SiteDocumentsCard = ({ site, bucketReady }: SiteDocumentsCardProps) => {
  const [activeTab, setActiveTab] = useState("floorplans");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<"floorplan" | "rackPhoto" | null>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const hasPDFs = site.floorplanUrl && site.floorplanUrl.length > 0;
  const hasImages = site.rackPhotosUrls && site.rackPhotosUrls.length > 0;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "floorplan" | "rackPhoto") => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    if (!bucketReady) {
      toast.error("Le stockage n'est pas disponible. Contactez l'administrateur.");
      return;
    }

    const file = files[0];
    setIsUploading(true);
    setUploadType(type);

    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `sites/${site.id}/${type === "floorplan" ? "floorplans" : "rack-photos"}/${fileName}`;

      // Upload file to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('site-documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw uploadError;
      }

      // Log successful upload
      console.log("File uploaded successfully:", data);

      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('site-documents')
        .getPublicUrl(filePath);

      console.log("Public URL data:", publicUrlData);

      // Update the site record with the new file URL
      if (type === "floorplan") {
        const { error: updateError } = await supabase
          .from('sites')
          .update({ floorplan_url: publicUrlData.publicUrl })
          .eq('id', site.id);

        if (updateError) throw updateError;
        
        // Update local state
        site.floorplanUrl = publicUrlData.publicUrl;
      } else {
        // For rack photos, we need to append to the existing array
        let updatedUrls = site.rackPhotosUrls || [];
        updatedUrls = [...updatedUrls, publicUrlData.publicUrl];
        
        const { error: updateError } = await supabase
          .from('sites')
          .update({ rack_photos_urls: updatedUrls })
          .eq('id', site.id);

        if (updateError) throw updateError;
        
        // Update local state
        site.rackPhotosUrls = updatedUrls;
      }

      toast.success(`${type === "floorplan" ? "Plan du local" : "Photo de baie"} ajouté avec succès`);
      
      // Refresh the page to show the new uploads
      window.location.reload();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(`Erreur lors de l'upload: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
      setUploadType(null);
      // Reset the input
      event.target.value = '';
    }
  };

  if (!bucketReady) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Le stockage de documents n'est pas disponible actuellement. Veuillez contacter l'administrateur pour créer le bucket "site-documents".
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isFullScreen ? "col-span-3" : "col-span-1 md:col-span-2"}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documentation</CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsFullScreen(!isFullScreen)}
        >
          {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="floorplans" className="flex-1">Plans des locaux</TabsTrigger>
            <TabsTrigger value="racks" className="flex-1">Photos des baies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="floorplans" className="space-y-4">
            <div className="mb-4 flex justify-end">
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  disabled={isUploading && uploadType === "floorplan"}
                >
                  {isUploading && uploadType === "floorplan" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Upload en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Ajouter un plan
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, "floorplan")}
                    disabled={isUploading}
                  />
                </Button>
              </div>
            </div>
            
            {hasPDFs ? (
              <div className="h-[500px] border rounded-md overflow-hidden">
                <iframe 
                  src={site.floorplanUrl} 
                  className="w-full h-full" 
                  title="Plans des locaux"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] border rounded-md p-4 text-muted-foreground">
                <File className="h-12 w-12 mb-2" />
                <p>Aucun plan disponible pour ce site</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="racks" className="space-y-4">
            <div className="mb-4 flex justify-end">
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  disabled={isUploading && uploadType === "rackPhoto"}
                >
                  {isUploading && uploadType === "rackPhoto" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Upload en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Ajouter une photo
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, "rackPhoto")}
                    disabled={isUploading}
                  />
                </Button>
              </div>
            </div>
            
            {hasImages ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {site.rackPhotosUrls.map((url, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer hover:opacity-80 transition-opacity border rounded-md overflow-hidden">
                        <img 
                          src={url} 
                          alt={`Photo de baie ${index + 1}`} 
                          className="w-full h-36 object-cover"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <div className="w-full h-full flex items-center justify-center">
                        <img 
                          src={url} 
                          alt={`Photo de baie ${index + 1}`} 
                          className="max-h-[70vh] w-auto"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] border rounded-md p-4 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-2" />
                <p>Aucune photo de baie disponible pour ce site</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SiteDocumentsCard;
