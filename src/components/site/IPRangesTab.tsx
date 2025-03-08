
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IPRange } from "@/types/types";
import { useDeleteIPRange } from "@/hooks/useDeleteIPRange";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface IPRangesTabProps {
  ipRanges: IPRange[];
  onRefresh?: () => Promise<void>;
}

const IPRangesTab = ({ ipRanges, onRefresh }: IPRangesTabProps) => {
  const navigate = useNavigate();
  const { mutate: deleteIPRange, isPending } = useDeleteIPRange();
  const [rangeToDelete, setRangeToDelete] = useState<string | null>(null);

  const handleEditRange = (id: string) => {
    navigate(`/ipam/edit/${id}`);
  };

  const handleDeleteRange = (id: string) => {
    deleteIPRange(id, {
      onSuccess: () => {
        if (onRefresh) onRefresh();
      }
    });
    setRangeToDelete(null);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>IP Range</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>DHCP Scope</TableHead>
          <TableHead>Reserved</TableHead>
          <TableHead className="w-[120px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ipRanges.map((range) => (
          <TableRow key={range.id}>
            <TableCell className="font-medium">{range.range}</TableCell>
            <TableCell>{range.description}</TableCell>
            <TableCell>{range.dhcpScope ? "Yes" : "No"}</TableCell>
            <TableCell>{range.isReserved ? "Yes" : "No"}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleEditRange(range.id)}
                  title="Edit Range"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                
                <AlertDialog open={rangeToDelete === range.id} onOpenChange={(open) => !open && setRangeToDelete(null)}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setRangeToDelete(range.id)}
                      title="Delete Range"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the IP range "{range.range}".
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteRange(range.id)}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {ipRanges.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No IP ranges found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default IPRangesTab;
