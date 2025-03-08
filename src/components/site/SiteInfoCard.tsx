
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Mail, MapPin, Phone } from "lucide-react";
import { Site } from "@/types/types";

interface SiteInfoCardProps {
  site: Site;
}

const SiteInfoCard = ({ site }: SiteInfoCardProps) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Informations du site</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Building className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Emplacement</p>
            <p>{site.location}, {site.country}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Adresse</p>
            <p>{site.address}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email de contact</p>
            <p>{site.contactEmail || "Non renseigné"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Téléphone de contact</p>
            <p>{site.contactPhone || "Non renseigné"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteInfoCard;
