
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteData } from "@/hooks/useSiteData";
import SiteHeader from "@/components/site/SiteHeader";
import SiteInfoCard from "@/components/site/SiteInfoCard";
import SiteResourcesCard from "@/components/site/SiteResourcesCard";
import SiteDocumentsCard from "@/components/site/SiteDocumentsCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SiteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bucketReady, setBucketReady] = useState(false);
  const [checkingBucket, setCheckingBucket] = useState(true);
  
  console.log("ID du site depuis l'URL:", id);
  console.log("Type d'ID du site:", typeof id);
  
  // Use our custom hook to fetch all site data
  const { 
    site, 
    equipment, 
    connections, 
    ipRanges, 
    isLoading, 
    error, 
    deleteSite,
    refetch 
  } = useSiteData(id);

  // Check storage access - Complètement repensée pour les buckets publics
  useEffect(() => {
    const verifyStorageAccess = async () => {
      try {
        setCheckingBucket(true);
        
        // Tester la connectivité au bucket en supposant qu'il existe et qu'il est public
        // Une simple vérification si nous pouvons récupérer l'URL publique
        const testUrl = supabase.storage
          .from('site-documents')
          .getPublicUrl('test.txt');
          
        if (testUrl.data.publicUrl) {
          console.log("URL publique générée, le bucket semble accessible:", testUrl.data.publicUrl);
          
          // Essayer de lister le contenu pour vérifier la connexion réelle
          const { data: files, error: listError } = await supabase.storage
            .from('site-documents')
            .list();
            
          if (listError) {
            console.error("Erreur lors de la tentative de liste des fichiers:", listError);
            
            if (listError.message.includes("does not exist")) {
              toast.error("Le bucket 'site-documents' n'existe pas. Créez-le dans le dashboard Supabase et assurez-vous qu'il est public.");
              setBucketReady(false);
            } else {
              toast.error(`Erreur d'accès au bucket: ${listError.message}`);
              setBucketReady(false);
            }
          } else {
            console.log("Bucket vérifié et accessible, fichiers:", files);
            toast.success("Stockage de documents prêt à l'utilisation");
            setBucketReady(true);
          }
        } else {
          console.error("Impossible de générer une URL publique");
          toast.error("Le bucket n'est pas correctement configuré comme public");
          setBucketReady(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'accès au stockage:", error);
        toast.error("Erreur d'accès au stockage");
        setBucketReady(false);
      } finally {
        setCheckingBucket(false);
      }
    };
    
    if (id) {
      verifyStorageAccess();
    }
  }, [id]);

  // Handle site deletion
  const handleDeleteSite = async () => {
    try {
      await deleteSite();
      // Navigation is now handled inside the deleteSite function
    } catch (error) {
      console.error("Erreur dans handleDeleteSite:", error);
      // Errors are already handled inside deleteSite
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show error state
  if (error || !site) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold">Site non trouvé</h2>
        <p className="text-muted-foreground mb-4">Le site que vous recherchez n'existe pas.</p>
        <Button onClick={() => navigate("/sites")}>Retour aux Sites</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SiteHeader site={site} onDelete={handleDeleteSite} />
      
      <div className="grid gap-6 md:grid-cols-3">
        <SiteInfoCard site={site} />
        <SiteResourcesCard 
          siteId={id || ''}
          equipment={equipment} 
          connections={connections} 
          ipRanges={ipRanges} 
          onRefresh={refetch}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <SiteDocumentsCard 
          site={site} 
          bucketReady={bucketReady} 
          isCheckingBucket={checkingBucket}
        />
      </div>
    </div>
  );
};

export default SiteDetail;
