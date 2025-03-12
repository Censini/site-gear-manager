
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { mockRedundantRules } from "@/data/firewallMockData";

const FirewallRedundancyAnalysis = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-medium">Analyse de Redondance</h3>
        <Badge variant="outline" className="bg-amber-50 text-amber-700">
          12 Règles Redondantes Détectées
        </Badge>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Règles potentiellement redondantes</CardTitle>
          <CardDescription>
            Ces règles semblent créer des redondances dans votre configuration qui pourraient affecter les performances ou créer des confusions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[100px]">Règle 1</TableHead>
                <TableHead className="w-[100px]">Règle 2</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRedundantRules.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant={item.type === "Redondance" ? "outline" : "secondary"} className={item.type === "Redondance" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="font-mono text-sm">{item.rule1}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="font-mono text-sm">{item.rule2}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="font-medium text-sm">{item.description}</div>
                      {item.impact === "Élevé" && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      item.impact === "Élevé" ? "destructive" : 
                      item.impact === "Moyen" ? "default" : "outline"
                    }>
                      {item.impact}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Optimisations recommandées</CardTitle>
          <CardDescription>
            Suggestions pour simplifier votre configuration et résoudre les problèmes détectés.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">Fusionner les règles similaires</h4>
              <p className="text-sm text-blue-800 mb-2">
                Nous avons détecté 5 règles qui pourraient être fusionnées en utilisant des groupes d'objets.
              </p>
              <div className="bg-white rounded p-3 text-sm">
                <div className="font-mono mb-2">Règle 23, 24, 25 <ArrowRight className="inline h-3 w-3" /> Nouvelle règle avec groupe</div>
                <div className="font-mono">Règle 56, 57 <ArrowRight className="inline h-3 w-3" /> Nouvelle règle avec groupe</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-md">
              <h4 className="font-medium text-green-800 mb-2">Supprimer les règles masquées</h4>
              <p className="text-sm text-green-800 mb-2">
                3 règles sont complètement masquées par des règles précédentes et peuvent être supprimées.
              </p>
              <div className="bg-white rounded p-3 text-sm">
                <div className="font-mono">Règles 78, 92, 124 <ArrowRight className="inline h-3 w-3" /> Peuvent être supprimées</div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-md">
              <h4 className="font-medium text-purple-800 mb-2">Réorganiser les règles par fréquence</h4>
              <p className="text-sm text-purple-800 mb-2">
                Déplacez les règles les plus utilisées en haut pour améliorer les performances.
              </p>
              <div className="bg-white rounded p-3 text-sm">
                <div className="font-mono">Règle 45 <ArrowRight className="inline h-3 w-3" /> Déplacer avant la règle 12</div>
                <div className="font-mono">Règle 67 <ArrowRight className="inline h-3 w-3" /> Déplacer avant la règle 34</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirewallRedundancyAnalysis;
