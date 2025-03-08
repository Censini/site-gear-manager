
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetIPRanges } from "@/hooks/useGetIPRanges";
import { useNavigate } from "react-router-dom";

const IPAM = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [siteFilter, setSiteFilter] = useState<string>("all");
  
  const { data: ipRanges = [], isLoading } = useGetIPRanges();
  
  // Get unique sites for the filter
  const uniqueSites = ipRanges.reduce((sites: {id: string, name: string}[], range) => {
    if (range.siteId && !sites.some(site => site.id === range.siteId)) {
      sites.push({
        id: range.siteId,
        name: range.siteName || "Unknown Site"
      });
    }
    return sites;
  }, []);

  const filteredRanges = ipRanges.filter((range) => {
    const matchesSearch = 
      range.range.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (range.description && range.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (range.siteName && range.siteName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSite = siteFilter === "all" || range.siteId === siteFilter;
    
    return matchesSearch && matchesSite;
  });

  const handleAddRange = () => {
    navigate("/ipam/add");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">IP Address Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>IP Ranges by Site</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search IP ranges..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select
                  value={siteFilter}
                  onValueChange={(value) => setSiteFilter(value)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sites</SelectItem>
                    {uniqueSites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="flex items-center gap-1" onClick={handleAddRange}>
                  <Plus className="h-4 w-4" />
                  <span>Add Range</span>
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IP Range</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>DHCP Scope</TableHead>
                      <TableHead>Reserved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRanges.map((range) => (
                      <TableRow key={range.id}>
                        <TableCell className="font-medium">{range.range}</TableCell>
                        <TableCell>{range.siteName || "—"}</TableCell>
                        <TableCell>{range.description || "—"}</TableCell>
                        <TableCell>{range.dhcpScope ? "Yes" : "No"}</TableCell>
                        <TableCell>{range.isReserved ? "Yes" : "No"}</TableCell>
                      </TableRow>
                    ))}
                    {filteredRanges.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No IP ranges found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IPAM;
