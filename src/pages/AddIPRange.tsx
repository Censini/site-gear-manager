
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";

const IPRangeSchema = z.object({
  range: z.string().min(1, "IP range is required"),
  description: z.string().optional(),
  isReserved: z.boolean().default(false),
  dhcpScope: z.boolean().default(false),
  siteId: z.string().min(1, "Site ID is required")
});

type IPRangeFormValues = z.infer<typeof IPRangeSchema>;

const AddIPRange = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Get site ID from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const siteId = queryParams.get("siteId") || "";

  const form = useForm<IPRangeFormValues>({
    resolver: zodResolver(IPRangeSchema),
    defaultValues: {
      range: "",
      description: "",
      isReserved: false,
      dhcpScope: false,
      siteId: siteId
    }
  });

  const addIPRangeMutation = useMutation({
    mutationFn: async (data: IPRangeFormValues) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: result, error } = await supabase
        .from("ip_ranges")
        .insert({
          range: data.range,
          description: data.description || null,
          is_reserved: data.isReserved,
          dhcp_scope: data.dhcpScope,
          site_id: data.siteId,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding IP range:", error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      toast.success("IP range added successfully");
      queryClient.invalidateQueries({ queryKey: ["ipRanges"] });
      
      // Navigate back to site detail if siteId is provided
      if (siteId) {
        navigate(`/sites/${siteId}`);
      } else {
        navigate("/ipam");
      }
    },
    onError: (error) => {
      console.error("Error in add IP range mutation:", error);
      toast.error("Failed to add IP range");
    }
  });

  const onSubmit = (data: IPRangeFormValues) => {
    addIPRangeMutation.mutate(data);
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

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => siteId ? navigate(`/sites/${siteId}`) : navigate("/ipam")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addIPRangeMutation.isPending}>
              {addIPRangeMutation.isPending ? "Adding..." : "Add IP Range"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddIPRange;
