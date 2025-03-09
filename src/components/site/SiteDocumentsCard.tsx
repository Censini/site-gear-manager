
import { useState } from "react";
import { File, ImageIcon, Maximize2, Minimize2, Upload, Loader2, AlertTriangle, RefreshCw, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Site } from "@/types/types";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

interface SiteDocumentsCardProps {
  site: Site;
  bucketReady: boolean;
  isCheckingBucket?: boolean;
}

const SiteDocumentsCard = ({ site, bucketReady, isCheckingBucket = false }: SiteDocumentsCardProps) => {
  const [activeTab, setActiveTab] = useState("floorplans");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<"floorplan" | "rackPhoto" | null>(null);
  const [refreshingPage, setRefreshingPage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { session } = useAuth();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const hasPDFs = site.floorplanUrl && site.floorplanUrl.length > 0;
  const hasImages = site.rackPhotosUrls && site.rackPhotosUrls.length > 0;

  const refreshPage = () => {
    setRefreshingPage(true);
    window.location.reload();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "floorplan" | "rackPhoto") => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    if (!bucketReady) {
      toast.error("Le stockage n'est pas disponible. Veuillez rafraîchir la page si vous venez de créer le bucket.");
      return;
    }
    
    // Vérifier si l'utilisateur est authentifié
    if (!session) {
      toast.error("Vous devez être connecté pour uploader des fichiers");
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
  
  const handleDeleteImage = async () => {
    if (!selectedImage || !session) return;
    
    setIsDeleting(true);
    
    try {
      // Extraire le chemin du fichier depuis l'URL
      const url = new URL(selectedImage);
      const pathParts = url.pathname.split('/');
      const filename = pathParts[pathParts.length - 1];
      const filePath = `sites/${site.id}/rack-photos/${filename}`;
      
      // Supprimer le fichier du stockage
      const { error: deleteError } = await supabase.storage
        .from('site-documents')
        .remove([filePath]);
        
      if (deleteError) throw deleteError;
      
      // Mettre à jour la liste des URLs dans la base de données
      const updatedUrls = site.rackPhotosUrls?.filter(url => url !== selectedImage) || [];
      
      const { error: updateError } = await supabase
        .from('sites')
        .update({ rack_photos_urls: updatedUrls })
        .eq('id', site.id);
        
      if (updateError) throw updateError;
      
      // Mettre à jour l'état local
      site.rackPhotosUrls = updatedUrls;
      
      toast.success("Photo supprimée avec succès");
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(`Erreur: ${(error as Error).message}`);
    } finally {
      setIsDeleting(false);
      setSelectedImage(null);
      // Actualiser la page pour montrer les changements
      window.location.reload();
    }
  };

  if (isCheckingBucket) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Vérification de l'accès au stockage...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              Le bucket "site-documents" n'est pas trouvé. Si vous venez de le créer, veuillez rafraîchir la page.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center mt-4">
            <Button 
              onClick={refreshPage} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={refreshingPage}
            >
              {refreshingPage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Rafraîchissement...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Rafraîchir la page
                </>
              )}
            </Button>
          </div>
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
                  disabled={isUploading && uploadType === "floorplan" || !session}
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
                    disabled={isUploading || !session}
                  />
                </Button>
              </div>
            </div>
            
            {!session && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Vous devez être connecté pour uploader des documents
                </AlertDescription>
              </Alert>
            )}
            
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
                  disabled={isUploading && uploadType === "rackPhoto" || !session}
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
                    disabled={isUploading || !session}
                  />
                </Button>
              </div>
            </div>
            
            {!session && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Vous devez être connecté pour uploader des documents
                </AlertDescription>
              </Alert>
            )}
            
            {hasImages ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {site.rackPhotosUrls.map((url, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer hover:opacity-80 transition-opacity border rounded-md overflow-hidden relative group">
                        <img 
                          src={url} 
                          alt={`Photo de baie ${index + 1}`} 
                          className="w-full h-36 object-cover"
                        />
                        {session && (
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(url);
                              setShowDeleteConfirm(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
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
      
      {/* Confirm Delete Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette photo ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Annuler</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteImage}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SiteDocumentsCard;
