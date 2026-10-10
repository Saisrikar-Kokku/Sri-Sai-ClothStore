import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md border border-red-200 bg-white p-6 text-[#4c0d17] sm:rounded-2xl shadow-xl">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Destructive Action</span>
          </div>
          <DialogTitle className="font-serif text-xl font-bold text-[#4c0d17]">
            Remove Saree Consignment?
          </DialogTitle>
          <p className="text-xs text-[#8a7a6b] leading-relaxed">
            Are you sure you want to delete this saree consignment from the catalog? This action will remove it from all storefront grids and customer search indices.
          </p>
        </DialogHeader>

        <div className="mt-5 flex justify-end gap-2.5 border-t border-[#e5dfd3] pt-4">
          <Button variant="outline" onClick={onClose} className="border-[#e5dfd3] text-[#8a7a6b] hover:text-[#4c0d17] bg-white text-xs hover:bg-[#f9f5ec]">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
          >
            Confirm Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
