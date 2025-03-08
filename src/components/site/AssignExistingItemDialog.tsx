
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export type ItemType = "equipment" | "connection" | "iprange";

interface AssignExistingItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (itemId: string) => void;
  title: string;
  items: Array<{ id: string; name: string }>;
  isLoading: boolean;
  isSubmitting: boolean;
  type: ItemType;
}

const AssignExistingItemDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  items,
  isLoading,
  isSubmitting,
  type
}: AssignExistingItemDialogProps) => {
  const [selectedItemId, setSelectedItemId] = useState<string>("");

  const handleConfirm = () => {
    if (selectedItemId) {
      onConfirm(selectedItemId);
    }
  };

  let itemLabel = "";
  switch (type) {
    case "equipment":
      itemLabel = "équipement";
      break;
    case "connection":
      itemLabel = "connexion";
      break;
    case "iprange":
      itemLabel = "plage IP";
      break;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Aucun {itemLabel} disponible pour assignation
            </p>
          ) : (
            <div className="space-y-4">
              <Label htmlFor="itemSelect">Sélectionner un {itemLabel}</Label>
              <Select
                value={selectedItemId}
                onValueChange={setSelectedItemId}
              >
                <SelectTrigger id="itemSelect">
                  <SelectValue placeholder={`Choisir un ${itemLabel}`} />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedItemId || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assignation...
              </>
            ) : (
              "Assigner"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignExistingItemDialog;
