
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Building, Server, Wifi, AlertTriangle } from "lucide-react";
import StatsCard from "@/components/cards/StatsCard";
import StatusChart from "@/components/dashboard/StatusChart";
import TypeChart from "@/components/dashboard/TypeChart";
import SiteContactsCard from "@/components/sites/SiteContactsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardStats } from "@/types/types";

const Dashboard = () => {
  // Query pour récupérer les statistiques de base
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Récupérer le nombre de sites
      const { count: sitesCount, error: sitesError } = await supabase
        .from("sites")
        .select("*", { count: "exact", head: true });

      // Récupérer le nombre total d'équipements
      const { count: equipmentCount, error: equipmentError } = await supabase
        .from("equipment")
        .select("*", { count: "exact", head: true });

      // Récupérer le nombre d'équipements avec problèmes
      const { count: equipmentWithIssuesCount, error: issuesError } = await supabase
        .from("equipment")
        .select("*", { count: "exact", head: true })
        .eq("status", "Problème");

      // Récupérer le nombre de connexions internet
      const { count: connectionsCount, error: connectionsError } = await supabase
        .from("network_connections")
        .select("*", { count: "exact", head: true });

      if (sitesError || equipmentError || issuesError || connectionsError) {
        throw new Error("Erreur lors de la récupération des statistiques");
      }

      return {
        sitesCount: sitesCount || 0,
        equipmentCount: equipmentCount || 0,
        equipmentWithIssuesCount: equipmentWithIssuesCount || 0,
        connectionsCount: connectionsCount || 0,
      };
    },
  });

  // Query pour récupérer les statistiques par statut et type d'équipement
  const { data: chartStats, isLoading: isLoadingChartStats } = useQuery({
    queryKey: ["equipment-stats"],
    queryFn: async () => {
      // Récupérer les équipements pour compter par statut et type
      const { data, error } = await supabase
        .from("equipment")
        .select("status, type");

      if (error) throw error;

      // Compter par statut
      const statusCounts = {
        active: 0,
        maintenance: 0,
        failure: 0,
        unknown: 0
      };

      // Compter par type
      const typeCounts = {
        router: 0,
        switch: 0,
        hub: 0,
        wifi: 0,
        server: 0,
        printer: 0,
        other: 0
      };

      // Compter les équipements par statut et type
      data.forEach(item => {
        // Statut
        if (item.status === "Actif") statusCounts.active += 1;
        else if (item.status === "Maintenance") statusCounts.maintenance += 1;
        else if (item.status === "Problème") statusCounts.failure += 1;
        else statusCounts.unknown += 1;

        // Type
        if (typeCounts.hasOwnProperty(item.type?.toLowerCase())) {
          typeCounts[item.type.toLowerCase()] += 1;
        } else {
          typeCounts.other += 1;
        }
      });

      return {
        equipmentByStatus: statusCounts,
        equipmentByType: typeCounts
      } as DashboardStats;
    }
  });

  // Query pour récupérer les équipements avec problèmes
  const { data: equipmentWithIssues, isLoading: isLoadingIssues } = useQuery({
    queryKey: ["equipment-with-issues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment")
        .select("id, name, type, manufacturer, model, site_id, sites(name)")
        .eq("status", "Problème")
        .limit(5);

      if (error) throw error;

      return data.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        manufacturer: item.manufacturer,
        model: item.model,
        siteName: item.sites?.name || "N/A",
      }));
    },
  });

  // Query pour récupérer les providers internet les plus utilisés
  const { data: providers, isLoading: isLoadingProviders } = useQuery({
    queryKey: ["providers-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("network_connections")
        .select("provider, count")
        .select();

      if (error) throw error;

      // Regrouper par provider et compter
      const providerCounts: Record<string, number> = {};
      data.forEach(item => {
        providerCounts[item.provider] = (providerCounts[item.provider] || 0) + 1;
      });

      // Convertir en tableau et trier
      return Object.entries(providerCounts)
        .map(([provider, count]) => ({ provider, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    },
  });

  const isLoading = isLoadingStats || isLoadingIssues || isLoadingProviders || isLoadingChartStats;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>

      {/* Statistiques */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Sites"
          value={stats?.sitesCount || 0}
          icon={<Building className="h-6 w-6" />}
        />
        <StatsCard
          title="Équipements"
          value={stats?.equipmentCount || 0}
          icon={<Server className="h-6 w-6" />}
        />
        <StatsCard
          title="Liens Internet"
          value={stats?.connectionsCount || 0}
          icon={<Wifi className="h-6 w-6" />}
        />
        <StatsCard
          title="Équipements avec problèmes"
          value={stats?.equipmentWithIssuesCount || 0}
          icon={<AlertTriangle className="h-6 w-6" />}
          className="bg-destructive/10 dark:bg-destructive/20"
        />
      </div>

      {/* Graphiques et tableaux */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Graphique des statuts */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Statut des équipements</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusChart stats={chartStats as DashboardStats} />
          </CardContent>
        </Card>

        {/* Graphique des types */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Types d'équipements</CardTitle>
          </CardHeader>
          <CardContent>
            <TypeChart stats={chartStats as DashboardStats} />
          </CardContent>
        </Card>
        
        {/* Carte des contacts de sites */}
        <SiteContactsCard />
      </div>

      {/* Tableaux d'informations */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Équipements avec problèmes */}
        <Card>
          <CardHeader>
            <CardTitle>Équipements avec problèmes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Site</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipmentWithIssues?.length ? (
                  equipmentWithIssues.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.siteName}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Aucun équipement avec problèmes
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Fournisseurs Internet */}
        <Card>
          <CardHeader>
            <CardTitle>Fournisseurs Internet</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead>Nombre de liens</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers?.length ? (
                  providers.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.provider}</TableCell>
                      <TableCell>{item.count}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      Aucun fournisseur internet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
