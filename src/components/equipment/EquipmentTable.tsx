import { useState } from "react";
import { Equipment } from "@/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EquipmentTableRow from "./EquipmentTableRow";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface EquipmentTableProps {
  equipmentList: Equipment[];
  onAddEquipment: () => void;
  sortColumn?: keyof Equipment | null;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: keyof Equipment) => void;
}

// Define sorting types
type SortColumn = keyof Pick<Equipment, 'name' | 'type' | 'ipAddress' | 'manufacturer' | 'model' | 'status'>;
type SortDirection = 'asc' | 'desc';

const EquipmentTable = ({ equipmentList }: EquipmentTableProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<string | null>(null);
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { data: sites } = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("id, name");
      
      if (error) throw error;
      
      return data.reduce((acc, site) => {
        acc[site.id] = site.name;
        return acc;
      }, {} as Record<string, string>);
    }
  });
  
  const getSiteName = (siteId: string) => {
    return sites?.[siteId] || "Not assigned";
  };

  // Sorting handler
  const handleSort = (column: SortColumn) => {
    // If clicking the same column, toggle direction
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new column, default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Sorting function
  const sortedEquipmentList = () => {
    if (!sortColumn) return equipmentList;

    return [...equipmentList].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      // Handle different types of sorting
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      // Fallback for other types or when values are different types
      return 0;
    });
  };

  // Helper function to render sort icon
  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-2 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-2" /> 
      : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  // Columns that can be sorted
  const sortableColumns: SortColumn[] = ['name', 'type', 'ipAddress', 'manufacturer', 'model', 'status'];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {['Name', 'Type', 'IP Address', 'Manufacturer', 'Model', 'Site', 'Status', 'Actions'].map((header, index) => {
              const column = sortableColumns[index];
              return (
                <TableHead 
                  key={header}
                  className={column ? "cursor-pointer hover:bg-gray-100" : ""}
                  onClick={() => column && handleSort(column)}
                >
                  <div className="flex items-center">
                    {header}
                    {column && renderSortIcon(column)}
                  </div>
                </TableHead>
              );
            })}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEquipmentList().length > 0 ? (
            sortedEquipmentList().map((item) => (
              <EquipmentTableRow 
                key={item.id}
                equipment={item}
                getSiteName={getSiteName}
                isDeleting={isDeleting}
                equipmentToDelete={equipmentToDelete}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No equipment found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EquipmentTable;