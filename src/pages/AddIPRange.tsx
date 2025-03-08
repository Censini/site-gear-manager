
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { useAddIPRange } from "@/hooks/useAddIPRange";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const IPRangeSchema = z.object({
  range: z.string().min(1, "IP range is required"),
  description: z.string().optional(),
  isReserved: z.boolean().default(false),
  dhcpScope: z.boolean().default(false),
  siteId: z.string().min(1, "Site selection is required")
});

type IPRangeFormValues = z.infer<typeof IPRangeSchema>;

const AddIPRange = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get site ID from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const siteIdFromQuery = queryParams.get("siteId") || "";

  // Fetch all sites for the dropdown
  const { data: sites = [], isLoading: sitesLoading } = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("id, name")
        .order("name");
      
      if (error) {
        console.error("Error fetching sites:", error);
        toast.error("Failed to load sites");
        return [];
      }
      
      return data;
    }
  });

  const form = useForm<IPRangeFormValues>({
    resolver: zodResolver(IPRangeSchema),
    defaultValues: {
      range: "",
      description: "",
      isReserved: false,
      dhcpScope: false,
      siteId: siteIdFromQuery
    }
  });

  const addIPRange = useAddIPRange();

  const onSubmit = (data: IPRangeFormValues) => {
    console.log("Form submitted with values:", data);
    addIPRange.mutate(data, {
      onSuccess: () => {
        // Navigate back to site detail if siteId is provided, otherwise to IPAM
        if (data.siteId) {
          navigate(`/sites/${data.siteId}`);
        } else {
          navigate("/ipam");
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add IP Range</h1>
          <p className="text-muted-foreground">Add a new IP range to your inventory</p>
        </div>
      </div>

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
              onClick={() => siteIdFromQuery ? navigate(`/sites/${siteIdFromQuery}`) : navigate("/ipam")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addIPRange.isPending}>
              {addIPRange.isPending ? "Adding..." : "Add IP Range"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddIPRange;
