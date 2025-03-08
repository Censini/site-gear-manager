
import { Site } from "@/types/types";
import SiteCard from "./SiteCard";

interface SitesListProps {
  sites: Site[];
  refetchSites: () => void;
}

const SitesList = ({ sites, refetchSites }: SitesListProps) => {
  if (sites.length === 0) {
    return (
      <div className="col-span-full text-center py-10">
        <h3 className="text-lg font-medium">No sites found</h3>
        <p className="text-muted-foreground">
          {sites.length === 0 ? "Add your first site to get started" : "Try adjusting your search terms"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sites.map((site) => (
        <SiteCard 
          key={site.id} 
          site={site} 
          refetchSites={refetchSites}
        />
      ))}
    </div>
  );
};

export default SitesList;
