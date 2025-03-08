
import Papa from 'papaparse';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  
  try {
    // Handle different data formats
    if (Array.isArray(data)) {
      // If it's a flat array, try to determine the type of each item
      for (const item of data) {
        await saveItemByType(item, results);
      }
    } else {
      // If it's a structured object with separate arrays for each type
      if (data.sites && Array.isArray(data.sites)) {
        for (const site of data.sites) {
          await saveSite(site, results);
        }
      }
      
      if (data.equipment && Array.isArray(data.equipment)) {
        for (const eq of data.equipment) {
          await saveEquipment(eq, results);
        }
      }
      
      if (data.connections && Array.isArray(data.connections)) {
        for (const conn of data.connections) {
          await saveConnection(conn, results);
        }
      }
      
      if (data.ipRanges && Array.isArray(data.ipRanges)) {
        for (const range of data.ipRanges) {
          await saveIPRange(range, results);
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
const saveItemByType = async (item: any, results: any) => {
  // Try to infer the item type from its properties
  if (item.location && item.country) {
    await saveSite(item, results);
  } else if (item.type === 'router' || item.type === 'switch' || item.type === 'server' || 
             item.type === 'wifi' || item.type === 'hub' || item.type === 'printer' || 
             item.type === 'other' || item.macAddress) {
    await saveEquipment(item, results);
  } else if (item.provider && (item.type === 'fiber' || item.type === 'adsl' || 
             item.type === 'sdsl' || item.type === 'satellite' || item.type === 'other')) {
    await saveConnection(item, results);
  } else if (item.range && (item.dhcpScope !== undefined || item.isReserved !== undefined)) {
    await saveIPRange(item, results);
  } else {
    console.warn('Could not determine type for item:', item);
  }
};

// Helper functions to save each type of data
const saveSite = async (site: any, results: any) => {
  try {
    // Convert camelCase to snake_case for database compatibility
    const siteData = {
      id: site.id,
      name: site.name,
      location: site.location,
      country: site.country,
      address: site.address,
      contact_name: site.contactName,
      contact_email: site.contactEmail,
      contact_phone: site.contactPhone
    };
    
    const { error } = await supabase
      .from('sites')
      .upsert(siteData, { onConflict: 'id' });
    
    if (error) throw error;
    results.sites.success++;
  } catch (error) {
    console.error('Error saving site:', error);
    results.sites.error++;
  }
};

const saveEquipment = async (equipment: any, results: any) => {
  try {
    // Convert camelCase to snake_case for database compatibility
    const equipmentData = {
      id: equipment.id,
      name: equipment.name,
      site_id: equipment.siteId,
      type: equipment.type,
      model: equipment.model,
      manufacturer: equipment.manufacturer,
      ip_address: equipment.ipAddress,
      mac_address: equipment.macAddress,
      firmware: equipment.firmware,
      install_date: equipment.installDate,
      status: equipment.status,
      netbios: equipment.netbios
    };
    
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

const saveConnection = async (connection: any, results: any) => {
  try {
    // Convert camelCase to snake_case for database compatibility
    const connectionData = {
      id: connection.id,
      site_id: connection.siteId,
      type: connection.type,
      provider: connection.provider,
      contract_ref: connection.contractRef,
      bandwidth: connection.bandwidth,
      sla: connection.sla,
      status: connection.status
    };
    
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

const saveIPRange = async (ipRange: any, results: any) => {
  try {
    // Convert camelCase to snake_case for database compatibility
    const ipRangeData = {
      id: ipRange.id,
      site_id: ipRange.siteId,
      range: ipRange.range,
      description: ipRange.description,
      is_reserved: ipRange.isReserved,
      dhcp_scope: ipRange.dhcpScope
    };
    
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
