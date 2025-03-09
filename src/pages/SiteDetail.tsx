
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
  
  // More debugging logs
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

  // Check storage access
  useEffect(() => {
    const verifyStorageAccess = async () => {
      try {
        setCheckingBucket(true);
        // First, get existing buckets to check if our bucket exists
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        console.log("Available buckets:", buckets);
        
        if (listError) {
          console.error("Error listing buckets:", listError);
          toast.error("Erreur d'accès au stockage. Vérifiez vos permissions.");
          setCheckingBucket(false);
          return;
        }
        
        // Check if our bucket exists
        const bucketExists = buckets?.some(bucket => bucket.name === 'site-documents');
        
        if (bucketExists) {
          console.log("Bucket site-documents found successfully");
          setBucketReady(true);
        } else {
          console.log("Bucket site-documents not found. Please create it in the Supabase dashboard.");
          toast.info("Le bucket 'site-documents' n'est pas disponible. Rafraîchissez la page si vous venez de le créer.", { duration: 5000 });
        }
      } catch (error) {
        console.error("Error checking storage access:", error);
        toast.error("Erreur d'accès au stockage");
      } finally {
        setCheckingBucket(false);
      }
    };
    
    verifyStorageAccess();
  }, []);

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
