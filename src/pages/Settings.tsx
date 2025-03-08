
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isDarkMode = theme === "dark";

  const handleToggleDarkMode = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save settings logic would go here
      console.log("Paramètres sauvegardés:", { darkMode: isDarkMode, notifications, autoSave });
      
      toast.success("Paramètres sauvegardés avec succès");
    } catch (error) {
      console.error("Échec de la sauvegarde des paramètres:", error);
      toast.error("Échec de la sauvegarde des paramètres");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos préférences d'application et paramètres de compte
        </p>
      </div>

      <Tabs defaultValue="general" className="max-w-3xl">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="account">Compte</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
              <CardDescription>
                Configurez vos préférences générales d'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Mode Sombre</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer le mode sombre pour l'interface de l'application
                  </p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={isDarkMode} 
                  onCheckedChange={handleToggleDarkMode} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save">Sauvegarde Automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Sauvegarder automatiquement les modifications sans confirmation
                  </p>
                </div>
                <Switch 
                  id="auto-save" 
                  checked={autoSave} 
                  onCheckedChange={setAutoSave} 
                />
              </div>

              <Button 
                onClick={handleSaveSettings} 
                disabled={isSaving}
                className="mt-4"
              >
                {isSaving ? "Sauvegarde en cours..." : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder les Paramètres
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du Compte</CardTitle>
              <CardDescription>
                Gérez vos informations de compte et préférences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Les paramètres du compte seront implémentés dans une mise à jour future.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Notification</CardTitle>
              <CardDescription>
                Configurez comment vous recevez les notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-notifications">Activer les Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications concernant les événements importants
                  </p>
                </div>
                <Switch 
                  id="enable-notifications" 
                  checked={notifications} 
                  onCheckedChange={setNotifications} 
                />
              </div>

              <Button 
                onClick={handleSaveSettings} 
                disabled={isSaving}
                className="mt-4"
              >
                {isSaving ? "Sauvegarde en cours..." : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder les Paramètres
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
