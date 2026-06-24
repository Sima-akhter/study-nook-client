import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  isConfirming = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={!isConfirming}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isConfirming}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} disabled={isConfirming}>
            {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
