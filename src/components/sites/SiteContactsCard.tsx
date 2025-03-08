
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Phone, Mail, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Site } from "@/types/types";

const SiteContactsCard = () => {
  const { data: sites, isLoading, error } = useQuery({
    queryKey: ["site-contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("id, name, contact_name, contact_phone, contact_email")
        .not("contact_phone", "is", null)
        .order("name");
      
      if (error) throw error;
      
      return data.map(site => ({
        id: site.id,
        name: site.name,
        contactName: site.contact_name,
        contactPhone: site.contact_phone,
        contactEmail: site.contact_email
      })) as Partial<Site>[];
    }
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contacts des sites</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (error || !sites || sites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contacts des sites</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-6">
            Aucun contact disponible
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts des sites</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Téléphone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{site.contactName || "-"}</TableCell>
                  <TableCell>
                    {site.contactPhone ? (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-primary" />
                        {site.contactPhone}
                      </span>
                    ) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteContactsCard;
