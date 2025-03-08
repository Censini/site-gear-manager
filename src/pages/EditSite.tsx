
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Site } from "@/types/types";

// Schéma de validation pour le formulaire
const siteFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  location: z.string().min(1, "L'emplacement est requis"),
  country: z.string().min(1, "Le pays est requis"),
  address: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Email invalide").optional().or(z.literal("")),
  contactPhone: z.string().optional()
});

type SiteFormValues = z.infer<typeof siteFormSchema>;

const EditSite = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Récupérer les données du site
  const { data: site, isLoading, error } = useQuery({
    queryKey: ["site", id],
    queryFn: async () => {
      if (!id) throw new Error("Aucun ID de site fourni");
      
      try {
        const { data, error } = await supabase
          .from("sites")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        
        if (error) throw error;
        if (!data) throw new Error("Site non trouvé");
        
        return {
          id: data.id,
          name: data.name,
          location: data.location,
          country: data.country,
          address: data.address || "",
          contactName: data.contact_name || "",
          contactEmail: data.contact_email || "",
          contactPhone: data.contact_phone || ""
        } as Site;
      } catch (error) {
        console.error("Erreur lors de la récupération du site:", error);
        throw error;
      }
    }
  });

  // Initialiser le formulaire
  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: "",
      location: "",
      country: "",
      address: "",
      contactName: "",
      contactEmail: "",
      contactPhone: ""
    }
  });

  // Remplir le formulaire avec les données du site
  useEffect(() => {
    if (site) {
      form.reset({
        name: site.name,
        location: site.location,
        country: site.country,
        address: site.address || "",
        contactName: site.contactName || "",
        contactEmail: site.contactEmail || "",
        contactPhone: site.contactPhone || ""
      });
    }
  }, [site, form]);

  // Gestion de la soumission du formulaire
  const onSubmit = async (values: SiteFormValues) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("sites")
        .update({
          name: values.name,
          location: values.location,
          country: values.country,
          address: values.address,
          contact_name: values.contactName,
          contact_email: values.contactEmail,
          contact_phone: values.contactPhone
        })
        .eq("id", id);
      
      if (error) throw error;
      
      toast.success("Site mis à jour avec succès");
      navigate(`/sites/${id}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du site:", error);
      toast.error("Échec de la mise à jour du site");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher le chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Afficher l'erreur
  if (error || !site) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold">Site non trouvé</h2>
        <p className="text-muted-foreground mb-4">Le site que vous recherchez n'existe pas.</p>
        <Button onClick={() => navigate("/sites")}>Retour aux sites</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate(`/sites/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Modifier le site</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du site" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emplacement</FormLabel>
                  <FormControl>
                    <Input placeholder="Ville" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pays</FormLabel>
                  <FormControl>
                    <Input placeholder="Pays" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse complète" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email du contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Email du contact" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone du contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Téléphone du contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/sites/${id}`)}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditSite;
