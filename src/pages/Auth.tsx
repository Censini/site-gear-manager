
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Github, AlertTriangle } from "lucide-react";

const Auth = () => {
  const { session, signInWithGitHub } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleGitHubSignIn = async () => {
    try {
      setError(null);
      await signInWithGitHub();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue s'est produite lors de la connexion");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Bienvenue à Network Asset Inventory</CardTitle>
          <CardDescription>
            Connectez-vous pour gérer vos équipements réseau, sites et connexions
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Erreur de connexion</p>
                <p className="text-sm">{error}</p>
                {error.includes("provider is not enabled") && (
                  <p className="text-sm mt-2">
                    Le fournisseur GitHub n'est pas activé. Veuillez configurer l'authentification GitHub dans les paramètres de votre projet Supabase.
                  </p>
                )}
              </div>
            </div>
          )}
          <Button onClick={handleGitHubSignIn} className="w-full" variant="outline">
            <Github className="mr-2 h-4 w-4" />
            Se connecter avec GitHub
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-xs text-center text-muted-foreground">
            En vous connectant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
