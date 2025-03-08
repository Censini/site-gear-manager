
import { Site } from "@/types/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Building, Globe, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SiteCardProps {
  site: Site;
}

const SiteCard = ({ site }: SiteCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-primary/10 rounded-full mr-4">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{site.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Globe className="h-4 w-4 mr-1" />
                <span>{site.location}, {site.country}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 flex-grow">
            {site.address && <p className="text-sm">{site.address}</p>}
            
            {site.contactEmail && (
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{site.contactEmail}</span>
              </div>
            )}
            
            {site.contactPhone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{site.contactPhone}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-muted/50">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate(`/sites/${site.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SiteCard;
