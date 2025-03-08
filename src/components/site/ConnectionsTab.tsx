
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import { NetworkConnection } from "@/types/types";

interface ConnectionsTabProps {
  connections: NetworkConnection[];
}

const ConnectionsTab = ({ connections }: ConnectionsTabProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Contract Ref</TableHead>
          <TableHead>Bandwidth</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {connections.map((connection) => (
          <TableRow key={connection.id}>
            <TableCell className="font-medium capitalize">{connection.type}</TableCell>
            <TableCell>{connection.provider}</TableCell>
            <TableCell>{connection.contractRef}</TableCell>
            <TableCell>{connection.bandwidth}</TableCell>
            <TableCell>
              <StatusBadge status={connection.status} />
            </TableCell>
          </TableRow>
        ))}
        {connections.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No connections found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ConnectionsTab;
