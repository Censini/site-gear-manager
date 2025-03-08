
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { marked } from 'marked';
import { supabase } from '@/integrations/supabase/client';

// Generic export types
export type ExportFormat = 'json' | 'csv' | 'markdown';

// Helper function to download data as a file
const downloadFile = (data: string, filename: string, type: string) => {
  const blob = new Blob([data], { type });
  saveAs(blob, filename);
};

// Export data as JSON
export const exportAsJson = <T,>(data: T[], filename: string = 'export') => {
  const jsonStr = JSON.stringify(data, null, 2);
  downloadFile(jsonStr, `${filename}.json`, 'application/json');
};

// Export data as CSV
export const exportAsCsv = <T extends Record<string, any>>(data: T[], filename: string = 'export') => {
  const csv = Papa.unparse(data);
  downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8');
};

// Export data as Markdown
export const exportAsMarkdown = <T extends Record<string, any>>(
  data: T[], 
  title: string = 'Export Data',
  filename: string = 'export'
) => {
  let markdown = `# ${title}\n\n`;
  
  if (data.length > 0) {
    // Create headers
    const headers = Object.keys(data[0]);
    markdown += `| ${headers.join(' | ')} |\n`;
    markdown += `| ${headers.map(() => '---').join(' | ')} |\n`;
    
    // Create rows
    data.forEach(item => {
      const values = headers.map(header => {
        const value = item[header];
        return value !== null && value !== undefined ? String(value) : '';
      });
      markdown += `| ${values.join(' | ')} |\n`;
    });
  } else {
    markdown += 'No data available.\n';
  }
  
  downloadFile(markdown, `${filename}.md`, 'text/markdown;charset=utf-8');
};

// Generic export function
export const exportData = <T extends Record<string, any>>(
  data: T[], 
  format: ExportFormat, 
  filename: string = 'export',
  title: string = 'Export Data'
) => {
  switch (format) {
    case 'json':
      exportAsJson(data, filename);
      break;
    case 'csv':
      exportAsCsv(data, filename);
      break;
    case 'markdown':
      exportAsMarkdown(data, title, filename);
      break;
  }
};

// Fetch all data from the database
export const fetchAllData = async () => {
  try {
    // Fetch sites
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select('*');
    
    if (sitesError) throw sitesError;
    
    // Fetch equipment
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment')
      .select('*');
    
    if (equipmentError) throw equipmentError;
    
    // Fetch network connections
    const { data: connections, error: connectionsError } = await supabase
      .from('network_connections')
      .select('*');
    
    if (connectionsError) throw connectionsError;
    
    // Fetch IP ranges
    const { data: ipRanges, error: ipRangesError } = await supabase
      .from('ip_ranges')
      .select('*');
    
    if (ipRangesError) throw ipRangesError;
    
    // Convert snake_case to camelCase for frontend use
    const formattedSites = sites.map(site => ({
      id: site.id,
      name: site.name,
      location: site.location,
      country: site.country,
      address: site.address,
      contactName: site.contact_name,
      contactEmail: site.contact_email,
      contactPhone: site.contact_phone,
      createdAt: site.created_at,
      updatedAt: site.updated_at
    }));
    
    const formattedEquipment = equipment.map(item => ({
      id: item.id,
      name: item.name,
      siteId: item.site_id,
      type: item.type,
      model: item.model,
      manufacturer: item.manufacturer,
      ipAddress: item.ip_address,
      macAddress: item.mac_address,
      firmware: item.firmware,
      installDate: item.install_date,
      status: item.status,
      netbios: item.netbios,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
    
    const formattedConnections = connections.map(conn => ({
      id: conn.id,
      siteId: conn.site_id,
      type: conn.type,
      provider: conn.provider,
      contractRef: conn.contract_ref,
      bandwidth: conn.bandwidth,
      sla: conn.sla,
      status: conn.status,
      createdAt: conn.created_at,
      updatedAt: conn.updated_at
    }));
    
    const formattedIPRanges = ipRanges.map(range => ({
      id: range.id,
      siteId: range.site_id,
      range: range.range,
      description: range.description,
      isReserved: range.is_reserved,
      dhcpScope: range.dhcp_scope,
      createdAt: range.created_at,
      updatedAt: range.updated_at
    }));
    
    return {
      sites: formattedSites,
      equipment: formattedEquipment,
      connections: formattedConnections,
      ipRanges: formattedIPRanges,
      allData: {
        sites: formattedSites,
        equipment: formattedEquipment,
        connections: formattedConnections,
        ipRanges: formattedIPRanges
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
