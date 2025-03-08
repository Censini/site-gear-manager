
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { IPRangeSchema, IPRangeFormValues } from "@/schemas/ipRangeSchema";
import { useAddIPRange } from "@/hooks/useAddIPRange";
import { useUpdateIPRange } from "@/hooks/useUpdateIPRange";
import { useGetSitesForSelect } from "@/hooks/useGetSitesForSelect";

interface IPRangeFormProps {
  isEditing?: boolean;
  ipRangeId?: string;
  defaultValues?: IPRangeFormValues;
  defaultSiteId?: string;
  onCancel: () => void;
  onSuccess: (siteId: string) => void;
}

export const IPRangeForm = ({ 
  isEditing = false, 
  ipRangeId = "", 
  defaultValues, 
  defaultSiteId = "", 
  onCancel, 
  onSuccess 
}: IPRangeFormProps) => {
  const form = useForm<IPRangeFormValues>({
    resolver: zodResolver(IPRangeSchema),
    defaultValues: defaultValues || {
      range: "",
      description: "",
      isReserved: false,
      dhcpScope: false,
      siteId: defaultSiteId || null
    }
  });

  const { data: sites = [], isLoading: sitesLoading } = useGetSitesForSelect();
  const addIPRange = useAddIPRange();
  const updateIPRange = useUpdateIPRange();

  const onSubmit = (data: IPRangeFormValues) => {
    console.log("Formulaire soumis avec les valeurs:", data);
    
    if (isEditing && ipRangeId) {
      updateIPRange.mutate({
        id: ipRangeId,
        ...data
      }, {
        onSuccess: () => {
          onSuccess(data.siteId || "");
        }
      });
    } else {
      addIPRange.mutate({
        range: data.range,
        description: data.description,
        isReserved: data.isReserved,
        dhcpScope: data.dhcpScope,
        siteId: data.siteId || null
      }, {
        onSuccess: () => {
          onSuccess(data.siteId || "");
        }
      });
    }
  };

  const isPending = isEditing ? updateIPRange.isPending : addIPRange.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plage IP*</FormLabel>
                <FormControl>
                  <Input placeholder="192.168.1.0/24" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description de cette plage IP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="siteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site</FormLabel>
                <Select 
                  value={field.value || "none"} 
                  onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                  disabled={sitesLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un site (optionnel)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Aucun site (non assigné)</SelectItem>
                    {sitesLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="dhcpScope"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Portée DHCP</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isReserved"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Plage Réservée</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (isEditing ? "Mise à jour..." : "Ajout...") : (isEditing ? "Mettre à jour la plage IP" : "Ajouter la plage IP")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
