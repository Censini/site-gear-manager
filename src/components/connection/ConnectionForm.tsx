
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddConnection } from "@/hooks/useAddConnection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NetworkConnection } from "@/types/types";

const connectionSchema = z.object({
  siteId: z.string({
    required_error: "Please select a site",
  }),
  type: z.enum(["fiber", "adsl", "sdsl", "satellite", "other"], {
    required_error: "Please select a connection type",
  }),
  provider: z.string().min(1, { message: "Provider is required" }),
  contractRef: z.string().optional(),
  bandwidth: z.string().optional(),
  sla: z.string().optional(),
  status: z.enum(["active", "maintenance", "failure", "unknown"], {
    required_error: "Please select a status",
  }),
});

type ConnectionFormValues = z.infer<typeof connectionSchema>;

const ConnectionForm = () => {
  const navigate = useNavigate();
  const { mutate: addConnection, isPending } = useAddConnection();
  
  const form = useForm<ConnectionFormValues>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      type: "fiber",
      provider: "",
      contractRef: "",
      bandwidth: "",
      sla: "",
      status: "active",
    },
  });

  const { data: sites = [] } = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("id, name");
      
      if (error) {
        console.error("Error fetching sites:", error);
        throw error;
      }
      
      return data || [];
    },
  });

  const onSubmit = (data: ConnectionFormValues) => {
    const connectionData: Omit<NetworkConnection, "id" | "siteName"> = {
      siteId: data.siteId,
      type: data.type,
      provider: data.provider,
      contractRef: data.contractRef || "",
      bandwidth: data.bandwidth || "",
      sla: data.sla || "",
      status: data.status,
    };

    addConnection(connectionData, {
      onSuccess: () => {
        navigate("/connections");
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="siteId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Connection Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="fiber">Fiber</SelectItem>
                  <SelectItem value="adsl">ADSL</SelectItem>
                  <SelectItem value="sdsl">SDSL</SelectItem>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <FormControl>
                <Input placeholder="Enter provider name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contractRef"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract Reference</FormLabel>
              <FormControl>
                <Input placeholder="Enter contract reference" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bandwidth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bandwidth</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 100Mbps" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sla"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SLA</FormLabel>
              <FormControl>
                <Input placeholder="Service Level Agreement" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="failure">Failure</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/connections")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Connection"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ConnectionForm;
