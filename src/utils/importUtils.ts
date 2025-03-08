
import Papa from 'papaparse';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Generic import types
export type ImportFormat = 'json' | 'csv';

// Parse CSV file to JSON
export const parseCsvFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Parse JSON file
export const parseJsonFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const json = JSON.parse(jsonString);
        
        // Normalize JSON data structure - handle both flat and nested formats
        const normalizedData = normalizeJsonData(json);
        resolve(normalizedData);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

// Helper function to normalize JSON data structure
const normalizeJsonData = (data: any): any => {
  // If the data is an array, return it directly
  if (Array.isArray(data)) {
    return data;
  }
  
  // Check if the data has the structure like { sites: [...], equipment: [...], ... }
  const hasDataGroups = ['sites', 'equipment', 'connections', 'ipRanges'].some(key => 
    key in data && Array.isArray(data[key])
  );
  
  if (hasDataGroups) {
    return data;
  }
  
  // If it's a single object that doesn't match our expected structure,
  // wrap it in an array
  return [data];
};

// Generic import function with schema validation
export const importData = async <T>(
  file: File, 
  schema: z.ZodType<T>, 
  onSuccess: (data: T[]) => void
): Promise<void> => {
  try {
    let data: any;
    
    if (file.name.endsWith('.csv')) {
      data = await parseCsvFile(file);
    } else if (file.name.endsWith('.json')) {
      data = await parseJsonFile(file);
    } else {
      toast.error('Unsupported file format. Please use CSV or JSON files.');
      return;
    }
    
    // Ensure data is an array for validation
    const dataArray = Array.isArray(data) ? data : [data];
    
    // Validate each item in the data array
    const validatedData: T[] = [];
    const errors: { index: number; errors: string[] }[] = [];
    
    dataArray.forEach((item, index) => {
      const result = schema.safeParse(item);
      if (result.success) {
        validatedData.push(result.data);
      } else {
        const formattedErrors = result.error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        errors.push({ index, errors: formattedErrors });
      }
    });
    
    if (errors.length > 0) {
      const errorSummary = errors.length === dataArray.length 
        ? 'All data is invalid' 
        : `${errors.length} of ${dataArray.length} items have validation errors`;
      
      toast.error(errorSummary, {
        description: 'Check the console for detailed errors',
        duration: 5000,
      });
      console.error('Import validation errors:', errors);
      
      // If some data is valid, ask if the user wants to proceed with valid data only
      if (validatedData.length > 0) {
        const willProceed = window.confirm(
          `${validatedData.length} of ${dataArray.length} items are valid. Do you want to import only the valid items?`
        );
        
        if (willProceed) {
          onSuccess(validatedData);
          toast.success(`Successfully imported ${validatedData.length} items`);
        }
      }
    } else {
      onSuccess(validatedData);
      toast.success(`Successfully imported ${validatedData.length} items`);
    }
    
  } catch (error) {
    toast.error('Error importing data', { 
      description: error instanceof Error ? error.message : 'Unknown error',
    });
    console.error('Import error:', error);
  }
};

// Function to save imported data to Supabase
export const saveImportedData = async (data: any) => {
  const results = {
    sites: { success: 0, error: 0 },
    equipment: { success: 0, error: 0 },
    connections: { success: 0, error: 0 },
    ipRanges: { success: 0, error: 0 },
  };
  
  console.log("Data to save:", data);
  
  // Mapping to store the original site IDs to the newly created UUID
  const siteIdMapping: Record<string, string> = {};
  
  try {
    // Handle different data formats
    if (Array.isArray(data)) {
      // Traiter d'abord tous les sites pour construire le mapping d'IDs
      const sites = data.filter(item => 
        item.location && item.country
      );
      
      for (const site of sites) {
        const originalId = site.id || site.name?.replace(/\s+/g, '-').toLowerCase() || 'site-' + Date.now();
        const newSiteId = await saveSite(site, results);
        if (newSiteId) {
          siteIdMapping[originalId] = newSiteId;
        }
      }
      
      // Ensuite traiter le reste des éléments
      for (const item of data) {
        if (!(item.location && item.country)) {
          await saveItemByType(item, results, siteIdMapping);
        }
      }
    } else {
      // Si c'est une structure avec des tableaux pour chaque type
      if (data.sites && Array.isArray(data.sites)) {
        // D'abord traiter les sites pour construire le mapping
        for (const site of data.sites) {
          const originalId = site.id || site.name?.replace(/\s+/g, '-').toLowerCase() || 'site-' + Date.now();
          const newSiteId = await saveSite(site, results);
          if (newSiteId) {
            siteIdMapping[originalId] = newSiteId;
          }
        }
      }
      
      // Ensuite traiter l'équipement avec le mapping des sites
      if (data.equipment && Array.isArray(data.equipment)) {
        for (const eq of data.equipment) {
          await saveEquipment(eq, results, siteIdMapping);
        }
      }
      
      // Traiter les connexions réseau
      if (data.connections && Array.isArray(data.connections)) {
        for (const conn of data.connections) {
          await saveConnection(conn, results, siteIdMapping);
        }
      }
      
      // Traiter les plages IP
      if (data.ipRanges && Array.isArray(data.ipRanges)) {
        for (const range of data.ipRanges) {
          await saveIPRange(range, results, siteIdMapping);
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error saving imported data:', error);
    throw error;
  }
};

// Helper function to save an item based on its type
const saveItemByType = async (item: any, results: any, siteIdMapping: Record<string, string>) => {
  // Try to infer the item type from its properties
  if (item.type === 'router' || item.type === 'switch' || item.type === 'server' || 
      item.type === 'wifi' || item.type === 'hub' || item.type === 'printer' || 
      item.type === 'other' || item.macAddress || item.mac_address) {
    await saveEquipment(item, results, siteIdMapping);
  } else if ((item.provider || item.provider_name) && (item.type === 'fiber' || item.type === 'adsl' || 
      item.type === 'sdsl' || item.type === 'satellite' || item.type === 'other' || 
      item.bandwidth || item.sla)) {
    await saveConnection(item, results, siteIdMapping);
  } else if ((item.range || item.ip_range) && (item.dhcpScope !== undefined || 
      item.is_dhcp_scope !== undefined || item.dhcp_scope !== undefined || 
      item.isReserved !== undefined || item.is_reserved !== undefined)) {
    await saveIPRange(item, results, siteIdMapping);
  } else {
    console.warn('Could not determine type for item:', item);
  }
};

// Fonction pour générer un UUID valide ou utiliser celui fourni s'il est valide
const getValidUUID = (id: string | undefined): string => {
  if (!id) return uuidv4();
  
  // Vérifier si l'ID est déjà un UUID valide
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    return id;
  }
  
  // Générer un nouvel UUID
  return uuidv4();
};

// Helper function to get latest site IDs if needed
const getFirstSiteId = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('id')
      .limit(1);
    
    if (error) throw error;
    return data.length > 0 ? data[0].id : null;
  } catch (error) {
    console.error('Error getting site ID:', error);
    return null;
  }
};

// Helper functions to save each type of data
const saveSite = async (site: any, results: any): Promise<string | null> => {
  try {
    // Générer un UUID valide
    const validId = getValidUUID(site.id);
    
    // Mapper les champs du fichier JSON aux champs de la base de données
    const siteData = {
      id: validId,
      name: site.name,
      location: site.location,
      country: site.country,
      address: site.address || "",
      contact_name: site.contact_name || site.contactName || "",
      contact_email: site.contact_email || site.contactEmail || site.contact_mail || site.contactMail || "",
      contact_phone: site.contact_phone || site.contactPhone || ""
    };
    
    console.log("Saving site with data:", siteData);
    
    const { error } = await supabase
      .from('sites')
      .upsert(siteData, { onConflict: 'id' });
    
    if (error) throw error;
    results.sites.success++;
    return validId;
  } catch (error) {
    console.error('Error saving site:', error);
    results.sites.error++;
    return null;
  }
};

const saveEquipment = async (equipment: any, results: any, siteIdMapping: Record<string, string>) => {
  try {
    // Générer un UUID valide
    const validId = getValidUUID(equipment.id);
    
    // Récupérer le site ID mappé ou utiliser le premier site disponible
    let siteId = null;
    
    if (equipment.siteId || equipment.site_id) {
      const originalSiteId = equipment.siteId || equipment.site_id;
      
      // Vérifier si cet ID est dans notre mapping
      if (siteIdMapping[originalSiteId]) {
        siteId = siteIdMapping[originalSiteId];
      } else {
        // Si l'ID fourni est un UUID valide, l'utiliser directement
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(originalSiteId)) {
          siteId = originalSiteId;
        } else {
          // Sinon, utiliser le premier site disponible
          siteId = await getFirstSiteId();
        }
      }
    } else {
      // Si aucun siteId n'est spécifié, utiliser le premier site disponible
      siteId = await getFirstSiteId();
    }
    
    // Convert camelCase to snake_case for database compatibility
    const equipmentData = {
      id: validId,
      name: equipment.name,
      site_id: siteId,
      type: equipment.type,
      model: equipment.model || "",
      manufacturer: equipment.manufacturer || "",
      ip_address: equipment.ipAddress || equipment.ip_address || "",
      mac_address: equipment.macAddress || equipment.mac_address || "",
      firmware: equipment.firmware || "",
      install_date: equipment.installDate || equipment.install_date || "",
      status: equipment.status || "active",
      netbios: equipment.netbios || ""
    };
    
    console.log("Saving equipment with data:", equipmentData);
    
    const { error } = await supabase
      .from('equipment')
      .upsert(equipmentData, { onConflict: 'id' });
    
    if (error) throw error;
    results.equipment.success++;
  } catch (error) {
    console.error('Error saving equipment:', error);
    results.equipment.error++;
  }
};

const saveConnection = async (connection: any, results: any, siteIdMapping: Record<string, string>) => {
  try {
    // Générer un UUID valide
    const validId = getValidUUID(connection.id);
    
    // Récupérer le site ID mappé ou utiliser le premier site disponible
    let siteId = null;
    
    if (connection.siteId || connection.site_id) {
      const originalSiteId = connection.siteId || connection.site_id;
      
      // Vérifier si cet ID est dans notre mapping
      if (siteIdMapping[originalSiteId]) {
        siteId = siteIdMapping[originalSiteId];
      } else {
        // Si l'ID fourni est un UUID valide, l'utiliser directement
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(originalSiteId)) {
          siteId = originalSiteId;
        } else {
          // Sinon, utiliser le premier site disponible
          siteId = await getFirstSiteId();
        }
      }
    } else {
      // Si aucun siteId n'est spécifié, utiliser le premier site disponible
      siteId = await getFirstSiteId();
    }
    
    // Convert camelCase to snake_case for database compatibility
    const connectionData = {
      id: validId,
      site_id: siteId,
      type: connection.type || "other",
      provider: connection.provider || connection.provider_name || "",
      contract_ref: connection.contractRef || connection.contract_ref || connection.reference || "",
      bandwidth: connection.bandwidth || connection.speed || "",
      sla: connection.sla || connection.serviceLevelAgreement || "",
      status: connection.status || "active"
    };
    
    console.log("Saving connection with data:", connectionData);
    
    const { error } = await supabase
      .from('network_connections')
      .upsert(connectionData, { onConflict: 'id' });
    
    if (error) throw error;
    results.connections.success++;
  } catch (error) {
    console.error('Error saving connection:', error);
    results.connections.error++;
  }
};

const saveIPRange = async (ipRange: any, results: any, siteIdMapping: Record<string, string>) => {
  try {
    // Générer un UUID valide
    const validId = getValidUUID(ipRange.id);
    
    // Récupérer le site ID mappé ou utiliser le premier site disponible
    let siteId = null;
    
    if (ipRange.siteId || ipRange.site_id) {
      const originalSiteId = ipRange.siteId || ipRange.site_id;
      
      // Vérifier si cet ID est dans notre mapping
      if (siteIdMapping[originalSiteId]) {
        siteId = siteIdMapping[originalSiteId];
      } else {
        // Si l'ID fourni est un UUID valide, l'utiliser directement
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(originalSiteId)) {
          siteId = originalSiteId;
        } else {
          // Sinon, utiliser le premier site disponible
          siteId = await getFirstSiteId();
        }
      }
    } else {
      // Si aucun siteId n'est spécifié, utiliser le premier site disponible
      siteId = await getFirstSiteId();
    }
    
    // Convert camelCase to snake_case for database compatibility
    const ipRangeData = {
      id: validId,
      site_id: siteId,
      range: ipRange.range || ipRange.ip_range || ipRange.cidr || "",
      description: ipRange.description || ipRange.desc || ipRange.notes || "",
      is_reserved: ipRange.isReserved || ipRange.is_reserved || false,
      dhcp_scope: ipRange.dhcpScope || ipRange.dhcp_scope || ipRange.is_dhcp_scope || false
    };
    
    console.log("Saving IP range with data:", ipRangeData);
    
    const { error } = await supabase
      .from('ip_ranges')
      .upsert(ipRangeData, { onConflict: 'id' });
    
    if (error) throw error;
    results.ipRanges.success++;
  } catch (error) {
    console.error('Error saving IP range:', error);
    results.ipRanges.error++;
  }
};
