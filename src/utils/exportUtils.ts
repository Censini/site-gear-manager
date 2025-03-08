
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { marked } from 'marked';

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
