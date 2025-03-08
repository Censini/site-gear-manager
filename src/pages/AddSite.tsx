import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AddSite = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    country: "",
    address: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      if (!session?.user?.id) {
        throw new Error("You must be logged in to create a site");
      }

      // Map frontend form fields to database columns
      const siteData = {
        name: formData.name,
        location: formData.location,
        country: formData.country,
        address: formData.address,
        contact_name: formData.contactName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        user_id: session.user.id, // Add user_id to the siteData
      };

      const { data, error } = await supabase
        .from("sites")
        .insert(siteData)
        .select()
        .single();

      if (error) throw error;

      console.log("Site created:", data);
      
      toast({
        title: "Success",
        description: "Site has been created successfully.",
      });
      
      navigate("/sites");
    } catch (error) {
      console.error("Error creating site:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create site. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/sites")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Site</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Site Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter site name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  rows={2}
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Primary contact name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/sites")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Site
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddSite;
