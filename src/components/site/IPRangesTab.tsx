
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IPRange } from "@/types/types";

interface IPRangesTabProps {
  ipRanges: IPRange[];
}

const IPRangesTab = ({ ipRanges }: IPRangesTabProps) => {
  const navigate = useNavigate();

  const handleEditRange = (id: string) => {
    navigate(`/ipam/edit/${id}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>IP Range</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>DHCP Scope</TableHead>
          <TableHead>Reserved</TableHead>
          <TableHead className="w-[80px]">Actions</TableHead>
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
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleEditRange(range.id)}
                title="Edit Range"
              >
                <Pencil className="h-4 w-4" />
              </Button>
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
