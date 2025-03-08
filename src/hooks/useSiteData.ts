
import { useGetSite } from "./useGetSite";
import { useGetSiteEquipment } from "./useGetSiteEquipment";
import { useGetSiteConnections } from "./useGetSiteConnections";
import { useGetSiteIPRanges } from "./useGetSiteIPRanges";
import { deleteSite as deleteSiteAction } from "@/utils/siteActions";

export const useSiteData = (id: string | undefined) => {
  // Fetch site data
  const { 
    data: site, 
    isLoading: isLoadingSite, 
    error: siteError 
  } = useGetSite(id);
  
  // Fetch equipment data
  const { 
    data: equipment = [], 
    isLoading: isLoadingEquipment 
  } = useGetSiteEquipment(id);
  
  // Fetch network connections
  const { 
    data: connections = [], 
    isLoading: isLoadingConnections 
  } = useGetSiteConnections(id);
  
  // Fetch IP ranges
  const { 
    data: ipRanges = [], 
    isLoading: isLoadingIPRanges 
  } = useGetSiteIPRanges(id);

  // Delete site function wrapper
  const deleteSite = async () => {
    return await deleteSiteAction(id);
  };

  return {
    site,
    equipment,
    connections,
    ipRanges,
    isLoading: isLoadingSite || isLoadingEquipment || isLoadingConnections || isLoadingIPRanges,
    error: siteError,
    deleteSite
  };
};
