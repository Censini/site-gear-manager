
import Papa from 'papaparse';
import { z } from 'zod';
import { toast } from 'sonner';

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
        const json = JSON.parse(event.target?.result as string);
        resolve(json);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

// Generic import function with schema validation
export const importData = async <T>(
  file: File, 
  schema: z.ZodType<T>, 
  onSuccess: (data: T[]) => void
): Promise<void> => {
  try {
    let data: any[];
    
    if (file.name.endsWith('.csv')) {
      data = await parseCsvFile(file);
    } else if (file.name.endsWith('.json')) {
      data = await parseJsonFile(file);
      // Ensure data is an array
      if (!Array.isArray(data)) {
        data = [data];
      }
    } else {
      toast.error('Unsupported file format. Please use CSV or JSON files.');
      return;
    }
    
    // Validate each item in the data array
    const validatedData: T[] = [];
    const errors: { index: number; errors: string[] }[] = [];
    
    data.forEach((item, index) => {
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
      const errorSummary = errors.length === data.length 
        ? 'All data is invalid' 
        : `${errors.length} of ${data.length} items have validation errors`;
      
      toast.error(errorSummary, {
        description: 'Check the console for detailed errors',
        duration: 5000,
      });
      console.error('Import validation errors:', errors);
      
      // If some data is valid, ask if the user wants to proceed with valid data only
      if (validatedData.length > 0) {
        const willProceed = window.confirm(
          `${validatedData.length} of ${data.length} items are valid. Do you want to import only the valid items?`
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
