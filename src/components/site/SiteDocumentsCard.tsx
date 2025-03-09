
import { useState } from "react";
import { File, ImageIcon, Maximize2, Minimize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Site } from "@/types/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface SiteDocumentsCardProps {
  site: Site;
}

const SiteDocumentsCard = ({ site }: SiteDocumentsCardProps) => {
  const [activeTab, setActiveTab] = useState("floorplans");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const hasPDFs = site.floorplanUrl && site.floorplanUrl.length > 0;
  const hasImages = site.rackPhotosUrls && site.rackPhotosUrls.length > 0;

  return (
    <Card className={isFullScreen ? "col-span-3" : "col-span-1 md:col-span-2"}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documentation</CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsFullScreen(!isFullScreen)}
        >
          {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="floorplans" className="flex-1">Plans des locaux</TabsTrigger>
            <TabsTrigger value="racks" className="flex-1">Photos des baies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="floorplans" className="space-y-4">
            {hasPDFs ? (
              <div className="h-[500px] border rounded-md overflow-hidden">
                <iframe 
                  src={site.floorplanUrl} 
                  className="w-full h-full" 
                  title="Plans des locaux"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] border rounded-md p-4 text-muted-foreground">
                <File className="h-12 w-12 mb-2" />
                <p>Aucun plan disponible pour ce site</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="racks" className="space-y-4">
            {hasImages ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {site.rackPhotosUrls.map((url, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer hover:opacity-80 transition-opacity border rounded-md overflow-hidden">
                        <img 
                          src={url} 
                          alt={`Photo de baie ${index + 1}`} 
                          className="w-full h-36 object-cover"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <div className="w-full h-full flex items-center justify-center">
                        <img 
                          src={url} 
                          alt={`Photo de baie ${index + 1}`} 
                          className="max-h-[70vh] w-auto"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] border rounded-md p-4 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-2" />
                <p>Aucune photo de baie disponible pour ce site</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SiteDocumentsCard;
