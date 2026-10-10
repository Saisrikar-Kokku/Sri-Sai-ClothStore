import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SareeProduct } from '@/types/product.types';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminInventory } from '@/hooks/useAdminInventory';
import { InventoryTable } from './InventoryTable';
import { ProductFormDialog } from './ProductFormDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { ToastNotification, ToastData } from '@/components/ui/ToastNotification';
import {
  Plus,
  Search,
  LogOut,
  X,
  Store,
} from 'lucide-react';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: SareeProduct[];
  setProducts: React.Dispatch<React.SetStateAction<SareeProduct[]>>;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  products,
  setProducts,
}) => {
  const { signOut } = useAdminAuth();
  const {
    metrics,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    toggleShowstopper,
  } = useAdminInventory(products, setProducts);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SareeProduct | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToast({ type, title, message });
  };

  const handleToggleStock = (id: string, currentStock: number) => {
    const target = products.find((p) => p.id === id);
    const nextStock = currentStock > 0 ? 0 : 1;
    toggleStock(id, currentStock);
    showToast(
      'info',
      nextStock > 0 ? 'Marked In-Stock' : 'Marked Sold Out',
      `"${target?.name}": ${nextStock > 0 ? 'Active in stock (1)' : 'Marked as Sold Out (0)'}.`
    );
  };

  const handleToggleShowstopper = (id: string, currentVal: boolean) => {
    const target = products.find((p) => p.id === id);
    const nextVal = !currentVal;
    toggleShowstopper(id, currentVal);
    showToast(
      'info',
      nextVal ? 'Featured as Unique Piece ★' : 'Removed from Showstoppers',
      `"${target?.name}" ${
        nextVal
          ? 'is now spotlighted at the top of the store!'
          : 'removed from the top Unique Pieces section.'
      }`
    );
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.provenance.toLowerCase().includes(q) ||
      p.fabric.toLowerCase().includes(q) ||
      p.color.toLowerCase().includes(q);
    const matchesCat = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: SareeProduct) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="fixed inset-0 !left-0 !top-0 !translate-x-0 !translate-y-0 z-50 !max-w-none !w-screen !h-screen bg-[#f9f5ec] !p-0 !border-0 !flex !flex-col !gap-0 select-none text-[#4c0d17] overflow-hidden !rounded-none [&>button]:hidden">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-[#e5dfd3] bg-white shrink-0 gap-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#4c0d17] border border-[#4c0d17] flex items-center justify-center text-[#b08a47] font-bold text-sm shadow-md">
                SS
              </div>
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#4c0d17] flex items-center gap-2">
                  <span>Operations Hub</span>
                  <span className="rounded-full bg-[#4c0d17] px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase text-white border border-[#4c0d17]">
                    Admin
                  </span>
                </h2>
                <p className="text-[11px] text-[#8a7a6b] hidden sm:block font-sans mt-0.5">
                  Mahadevpur Flagship Consignments • Live Stock Controls
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="sm:hidden h-8 w-8 rounded-lg bg-[#f9f5ec] border border-[#e5dfd3] flex items-center justify-center text-[#8a7a6b] hover:text-[#4c0d17]"
              title="Close Portal"
              aria-label="Close Portal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Button
              onClick={handleOpenAdd}
              className="bg-[#b08a47] hover:bg-[#9a773a] text-white font-bold text-xs py-2 px-3 sm:px-4 rounded-xl shadow-md cursor-pointer shrink-0 transition"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Saree (New Maal)
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#e5dfd3] text-[#8a7a6b] hover:text-[#4c0d17] hover:bg-[#f9f5ec] bg-white text-xs py-2 px-2.5 sm:px-3 rounded-xl cursor-pointer shrink-0 transition"
              title="Return to Storefront"
            >
              <Store className="mr-1.5 h-3.5 w-3.5 text-[#b08a47]" /> Storefront
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                signOut();
                onClose();
              }}
              className="border-[#e5dfd3] text-[#8a7a6b] hover:text-white hover:bg-[#4c0d17] bg-white text-xs py-2 px-2.5 sm:px-3 rounded-xl cursor-pointer shrink-0 transition"
              title="Sign Out from Admin"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> Sign Out
            </Button>
            <button
              onClick={onClose}
              className="hidden sm:flex h-9 w-9 rounded-xl bg-white border border-[#e5dfd3] items-center justify-center text-[#8a7a6b] hover:text-white hover:bg-[#4c0d17] transition cursor-pointer ml-1 shadow-sm"
              title="Close Portal"
              aria-label="Close Portal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Real-Time KPI Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-5 sm:px-6 bg-[#f9f5ec] border-b border-[#e5dfd3] shrink-0">
          <div className="p-3.5 rounded-xl bg-white border border-[#e5dfd3] shadow-sm flex flex-col justify-center">
            <span className="text-[9px] text-[#8a7a6b] block uppercase tracking-widest font-bold mb-1">Total Catalog</span>
            <span className="text-xl font-bold text-[#4c0d17] font-serif">{metrics.totalProducts} Pieces</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-[#e5dfd3] shadow-sm flex flex-col justify-center">
            <span className="text-[9px] text-[#8a7a6b] block uppercase tracking-widest font-bold mb-1">In-Stock</span>
            <span className="text-xl font-bold text-[#065f46] font-serif">{metrics.inStockPieces} Active</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-[#e5dfd3] shadow-sm flex flex-col justify-center">
            <span className="text-[9px] text-[#8a7a6b] block uppercase tracking-widest font-bold mb-1">Sold Out</span>
            <span className="text-xl font-bold text-red-600 font-serif">{metrics.soldOutPieces} Claimed</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-[#e5dfd3] shadow-sm flex flex-col justify-center">
            <span className="text-[9px] text-[#8a7a6b] block uppercase tracking-widest font-bold mb-1">Showstoppers</span>
            <span className="text-xl font-bold text-[#b08a47] font-serif">{metrics.featuredShowstoppers} Spotlighted</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-[#e5dfd3] shadow-sm hidden lg:flex flex-col justify-center">
            <span className="text-[9px] text-[#8a7a6b] block uppercase tracking-widest font-bold mb-1">Inventory Value</span>
            <span className="text-xl font-bold text-[#4c0d17] font-sans">₹{metrics.totalInventoryValue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white shrink-0 border-b border-[#e5dfd3] shadow-sm z-10">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8a7a6b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, Name, Hub, or Color..."
              className="w-full bg-[#f9f5ec] border border-[#e5dfd3] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#4c0d17] placeholder-[#8a7a6b]/70 focus:outline-none focus:border-[#b08a47] focus:ring-1 focus:ring-[#b08a47]/20 transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#f9f5ec] border border-[#e5dfd3] rounded-xl px-4 py-2.5 text-xs text-[#4c0d17] font-bold focus:outline-none focus:border-[#b08a47] cursor-pointer"
            >
              <option value="All">All Categories ({products.length})</option>
              <option value="Kanchi Pattu">Kanchi Pattu</option>
              <option value="Banarasi Silk">Banarasi Silk</option>
              <option value="Organza">Organza</option>
              <option value="Fancy Sarees">Fancy Sarees</option>
              <option value="Partywear & Kurtis">Partywear & Kurtis</option>
            </select>
            <span className="text-xs text-[#8a7a6b] font-sans whitespace-nowrap">
              Showing <span className="font-bold text-[#4c0d17]">{filteredProducts.length}</span> of {products.length}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f9f5ec] scrollbar-thin scrollbar-thumb-[#e5dfd3] scrollbar-track-transparent">
          <div className="bg-white rounded-2xl border border-[#e5dfd3] shadow-sm overflow-hidden">
            <InventoryTable
              products={filteredProducts}
              onEdit={handleOpenEdit}
              onDelete={(id) => setDeletingId(id)}
              onToggleStock={handleToggleStock}
              onToggleShowstopper={handleToggleShowstopper}
            />
          </div>
        </div>

        {/* Modals */}
        <ProductFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          productToEdit={editingProduct}
          onSubmit={async (data) => {
            try {
              if (editingProduct) {
                const res = await updateProduct(editingProduct.id, data);
                if (res.success) {
                  showToast(
                    'success',
                    'Saree Modified Successfully',
                    `"${data.name}" (${data.sku}) changes saved permanently to database.`
                  );
                } else {
                  showToast('error', 'Update Failed', res.error || 'Could not update saree.');
                }
                return res;
              } else {
                const res = await createProduct(data);
                if (res.success) {
                  showToast(
                    'success',
                    'Saree Added Successfully',
                    `"${data.name}" (${data.sku}) published to live store & database.`
                  );
                } else {
                  showToast('error', 'Add Failed', res.error || 'Could not save saree.');
                }
                return res;
              }
            } catch (err: any) {
              const msg = err.message || 'Operation failed.';
              showToast('error', 'Error', msg);
              return { success: false, error: msg };
            }
          }}
        />

        <DeleteConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={async () => {
            if (deletingId) {
              const target = products.find((p) => p.id === deletingId);
              const res = await deleteProduct(deletingId);
              if (res.success) {
                showToast(
                  'success',
                  'Saree Deleted Successfully',
                  `"${target?.name || 'Saree'}" (${target?.sku || ''}) was permanently removed from database.`
                );
              } else {
                showToast('error', 'Delete Failed', res.error || 'Could not delete saree.');
              }
              setDeletingId(null);
            }
          }}
        />

        {/* Floating Toast Notification Popup */}
        <ToastNotification toast={toast} onClose={() => setToast(null)} />

      </DialogContent>
    </Dialog>
  );
};
