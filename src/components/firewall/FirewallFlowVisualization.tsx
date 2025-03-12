
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Network, Server, Laptop, Lock, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FirewallFlowVisualization = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Chargement de la visualisation...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Visualisation des Flux</h3>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          Visualization Simplifiée
        </Badge>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-2">Ce composant afficherait un graphe interactif de vos règles et flux réseau.</p>
              <p className="text-sm text-muted-foreground">Dans une version complète, nous utiliserions <code>@xyflow/react</code> pour créer un graphe interactif et dynamique.</p>
            </div>

            <div className="w-full h-[400px] bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-10 p-8 w-full">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-4 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Globe className="h-10 w-10 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Internet (Zone Externe)</span>
                  <div className="flex space-x-1">
                    <Badge variant="outline" className="text-xs">10.0.0.0/8</Badge>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="p-4 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Lock className="h-10 w-10 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">Pare-feu Palo Alto</span>
                  <div className="flex space-x-1">
                    <Badge variant="outline" className="text-xs">156 Règles</Badge>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="p-4 rounded-lg bg-green-100 flex items-center justify-center">
                    <Network className="h-10 w-10 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">LAN Interne</span>
                  <div className="flex space-x-1">
                    <Badge variant="outline" className="text-xs">192.168.0.0/16</Badge>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="p-4 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Server className="h-8 w-8 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">Serveurs DMZ</span>
                  <div className="flex space-x-1">
                    <Badge variant="outline" className="text-xs">172.16.0.0/24</Badge>
                  </div>
                </div>

                <div className="col-span-1">
                  {/* Connexions stylisées */}
                  <div className="h-full flex items-center justify-center">
                    <div className="w-2/3 h-1 bg-gray-300 rounded relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-xs text-gray-600">
                        45 flux
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="p-4 rounded-lg bg-red-100 flex items-center justify-center">
                    <Laptop className="h-8 w-8 text-red-600" />
                  </div>
                  <span className="text-sm font-medium">Postes Clients</span>
                  <div className="flex space-x-1">
                    <Badge variant="outline" className="text-xs">192.168.10.0/24</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">Dans la version complète, vous pourriez :</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside mt-2">
                <li>Visualiser les flux entre zones</li>
                <li>Voir quelles règles s'appliquent à chaque flux</li>
                <li>Filtrer par source, destination ou service</li>
                <li>Zoomer et explorer les relations complexes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirewallFlowVisualization;
