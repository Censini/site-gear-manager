
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IPRange } from "@/types/types";

interface IPRangesTabProps {
  ipRanges: IPRange[];
}

const IPRangesTab = ({ ipRanges }: IPRangesTabProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>IP Range</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>DHCP Scope</TableHead>
          <TableHead>Reserved</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ipRanges.map((range) => (
          <TableRow key={range.id}>
            <TableCell className="font-medium">{range.range}</TableCell>
            <TableCell>{range.description}</TableCell>
            <TableCell>{range.dhcpScope ? "Yes" : "No"}</TableCell>
            <TableCell>{range.isReserved ? "Yes" : "No"}</TableCell>
          </TableRow>
        ))}
        {ipRanges.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              No IP ranges found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default IPRangesTab;
