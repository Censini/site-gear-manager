
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Upload, List, AlertTriangle, Activity, Network } from "lucide-react";
import FirewallRules from "@/components/firewall/FirewallRules";
import FirewallFlowVisualization from "@/components/firewall/FirewallFlowVisualization";
import FirewallRedundancyAnalysis from "@/components/firewall/FirewallRedundancyAnalysis";

const Firewall = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analyse de Pare-feu</h2>
          <p className="text-muted-foreground">
            Visualisez et analysez vos configurations Palo Alto
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Shield className="mr-2 h-4 w-4" />
            Connecter via API
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Importer Configuration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Règles Totales</CardTitle>
            <CardDescription>Nombre de règles configurées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <List className="h-8 w-8 text-blue-500 mr-3" />
              <div className="text-3xl font-bold">156</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Règles Redondantes</CardTitle>
            <CardDescription>Règles potentiellement dupliquées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-amber-500 mr-3" />
              <div className="text-3xl font-bold">12</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Activité Récente</CardTitle>
            <CardDescription>Dernières 24 heures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-500 mr-3" />
              <div className="text-3xl font-bold">2.4K</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="rules">Règles de Sécurité</TabsTrigger>
          <TabsTrigger value="flow">Visualisation des Flux</TabsTrigger>
          <TabsTrigger value="analysis">Analyse de Redondance</TabsTrigger>
        </TabsList>
        <TabsContent value="rules">
          <FirewallRules />
        </TabsContent>
        <TabsContent value="flow">
          <FirewallFlowVisualization />
        </TabsContent>
        <TabsContent value="analysis">
          <FirewallRedundancyAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Firewall;
