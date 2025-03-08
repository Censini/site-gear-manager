
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
import { useGetSitesForSelect } from "@/hooks/useGetSitesForSelect";

interface IPRangeFormProps {
  defaultSiteId?: string;
  onCancel: () => void;
  onSuccess: (siteId: string) => void;
}

export const IPRangeForm = ({ defaultSiteId = "", onCancel, onSuccess }: IPRangeFormProps) => {
  const form = useForm<IPRangeFormValues>({
    resolver: zodResolver(IPRangeSchema),
    defaultValues: {
      range: "",
      description: "",
      isReserved: false,
      dhcpScope: false,
      siteId: defaultSiteId
    }
  });

  const { data: sites = [], isLoading: sitesLoading } = useGetSitesForSelect();
  const addIPRange = useAddIPRange();

  const onSubmit = (data: IPRangeFormValues) => {
    console.log("Form submitted with values:", data);
    // We need to ensure all required fields are present
    addIPRange.mutate({
      range: data.range, // This is required
      description: data.description,
      isReserved: data.isReserved,
      dhcpScope: data.dhcpScope,
      siteId: data.siteId // This is required
    }, {
      onSuccess: () => {
        onSuccess(data.siteId);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IP Range*</FormLabel>
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
                  <Textarea placeholder="Description of this IP range" {...field} />
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
                <FormLabel>Site*</FormLabel>
                <Select 
                  value={field.value} 
                  onValueChange={field.onChange}
                  disabled={sitesLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
                    <FormLabel>DHCP Scope</FormLabel>
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
                    <FormLabel>Reserved Range</FormLabel>
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
            Cancel
          </Button>
          <Button type="submit" disabled={addIPRange.isPending}>
            {addIPRange.isPending ? "Adding..." : "Add IP Range"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
