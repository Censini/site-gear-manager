
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

  // Check storage access - Improved bucket detection
  useEffect(() => {
    const verifyStorageAccess = async () => {
      try {
        setCheckingBucket(true);
        
        // Essayer d'abord une opération simple qui échouera si le bucket n'existe pas
        // Au lieu de simplement lister les buckets, essayons directement de lister les fichiers
        const { data: files, error: directCheckError } = await supabase.storage
          .from('site-documents')
          .list();
          
        if (directCheckError) {
          console.error("Erreur lors de la vérification directe du bucket:", directCheckError);
          
          // Vérifions quand même la liste des buckets
          const { data: buckets, error: listError } = await supabase.storage.listBuckets();
          
          console.log("Available buckets:", buckets);
          
          if (listError) {
            console.error("Erreur listing buckets:", listError);
            toast.error("Erreur d'accès au stockage. Vérifiez vos permissions.");
            setBucketReady(false);
          } else {
            // Vérifier si notre bucket existe dans la liste
            const bucketExists = buckets?.some(bucket => bucket.name === 'site-documents');
            
            if (bucketExists) {
              console.log("Bucket site-documents trouvé dans la liste mais l'accès direct a échoué");
              setBucketReady(true);
              toast.success("Stockage de documents configuré");
            } else {
              console.log("Bucket site-documents introuvable. Veuillez le créer dans le dashboard Supabase.");
              toast.error("Le bucket 'site-documents' n'est pas disponible. Créez-le dans le dashboard Supabase.");
              setBucketReady(false);
            }
          }
        } else {
          // La vérification directe a réussi, le bucket existe et est accessible
          console.log("Bucket site-documents vérifié avec succès:", files);
          setBucketReady(true);
          toast.success("Stockage de documents prêt à l'utilisation");
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
