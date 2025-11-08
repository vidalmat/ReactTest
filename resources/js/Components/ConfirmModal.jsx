import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmModal({
    open,
    title = "Confirmer",
    description = "Voulez-vous vraiment effectuer cette action ?",
    confirmLabel = "Confirmer",
    cancelLabel = "Annuler",
    loading = false,
    onConfirm = () => { },
    onClose = () => { },
}) {
    // Dialog gère l'ouverture; onOpenChange permet de détecter la fermeture via overlay / ESC
    return (
        <Dialog open={!!open} onOpenChange={(o) => { if (!o) onClose(); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4">
                    <div className="flex w-full justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4"
                        >
                            {cancelLabel}
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            disabled={loading}
                            className="px-4"
                        >
                            {loading ? "Suppression..." : confirmLabel}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}