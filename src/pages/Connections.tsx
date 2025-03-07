
import { networkConnections, getSiteById } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";

const Connections = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredConnections = networkConnections.filter((connection) => {
    const matchesSearch = 
      connection.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.contractRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.bandwidth.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || connection.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Internet Connections</h1>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search connections..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="fiber">Fiber</SelectItem>
              <SelectItem value="adsl">ADSL</SelectItem>
              <SelectItem value="sdsl">SDSL</SelectItem>
              <SelectItem value="satellite">Satellite</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Connection</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Contract Ref</TableHead>
              <TableHead>Bandwidth</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConnections.map((connection) => (
              <TableRow key={connection.id}>
                <TableCell>{getSiteById(connection.siteId)?.name}</TableCell>
                <TableCell className="capitalize">{connection.type}</TableCell>
                <TableCell>{connection.provider}</TableCell>
                <TableCell>{connection.contractRef}</TableCell>
                <TableCell>{connection.bandwidth}</TableCell>
                <TableCell>{connection.sla}</TableCell>
                <TableCell>
                  <StatusBadge status={connection.status} />
                </TableCell>
              </TableRow>
            ))}
            {filteredConnections.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No connections found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Connections;
