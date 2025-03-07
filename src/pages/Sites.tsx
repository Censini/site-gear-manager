
import { sites } from "@/data/mockData";
import SiteCard from "@/components/cards/SiteCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useState } from "react";

const Sites = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Sites</h1>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sites..."
            className="pl-8 max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="flex items-center gap-1 w-full md:w-auto">
          <Plus className="h-4 w-4" />
          <span>Add Site</span>
        </Button>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSites.map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}
        {filteredSites.length === 0 && (
          <div className="col-span-full text-center py-10">
            <h3 className="text-lg font-medium">No sites found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sites;
