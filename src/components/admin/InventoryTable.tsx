import React from 'react';
import { SareeProduct } from '@/types/product.types';
import { Edit2, Trash2, Star, CheckCircle2, XCircle, Sparkles, Camera } from 'lucide-react';

interface InventoryTableProps {
  products: SareeProduct[];
  onEdit: (product: SareeProduct) => void;
  onDelete: (id: string) => void;
  onToggleStock: (id: string, currentStock: number) => void;
  onToggleShowstopper: (id: string, currentVal: boolean) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  onEdit,
  onDelete,
  onToggleStock,
  onToggleShowstopper,
}) => {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e5dfd3] bg-white p-8 sm:p-12 text-center text-[#8a7a6b]">
        <p className="font-serif text-base text-[#4c0d17]">No sarees match your current search or category filter.</p>
        <span className="text-xs mt-1 block font-sans">Try clearing the search query or changing the category filter.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-[#e5dfd3] bg-white p-4 space-y-4 shadow-sm"
          >
            {/* Top Row: Image & Basics */}
            <div className="flex items-start gap-3">
              <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-[#e5dfd3]">
                <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                {product.images.length > 1 && (
                  <span className="absolute bottom-1 right-1 rounded bg-white/90 backdrop-blur-md px-1 py-0.5 text-[8px] font-mono font-bold text-[#b08a47] border border-[#b08a47]/30 flex items-center gap-0.5">
                    <Camera className="h-2 w-2" /> {product.images.length}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-serif font-bold text-[#4c0d17] text-xs truncate leading-snug">
                    {product.name}
                  </h4>
                  <button
                    onClick={() => onToggleShowstopper(product.id, product.isFeaturedShowstopper)}
                    className={`p-1 rounded-full transition cursor-pointer shrink-0 ${
                      product.isFeaturedShowstopper
                        ? 'bg-[#4c0d17] text-[#b08a47] border border-[#4c0d17]'
                        : 'text-[#8a7a6b] hover:text-[#4c0d17] bg-[#f9f5ec]'
                    }`}
                  >
                    <Star className={`h-3 w-3 ${product.isFeaturedShowstopper ? 'fill-[#b08a47]' : ''}`} />
                  </button>
                </div>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  <span className="font-mono text-[10px] text-[#8a7a6b]">SKU: {product.sku}</span>
                  <span className="text-[10px] text-[#4c0d17] font-medium truncate">📍 {product.category}</span>
                </div>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="flex items-center justify-between border-t border-[#e5dfd3] pt-3">
              <div>
                <span className="font-sans font-bold text-sm text-[#4c0d17]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#8a7a6b] line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] font-bold text-[#065f46]">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => onToggleStock(product.id, product.stockCount)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition cursor-pointer border ${
                  product.stockCount > 0
                    ? product.stockCount === 1
                      ? 'bg-[#b08a47]/10 border-[#b08a47]/30 text-[#b08a47]'
                      : 'bg-[#065f46]/10 border-[#065f46]/20 text-[#065f46]'
                    : 'bg-[#4c0d17]/10 border-[#4c0d17]/20 text-[#4c0d17]'
                }`}
              >
                {product.stockCount > 0 ? (
                  product.stockCount === 1 ? (
                    <>
                      <Sparkles className="h-3 w-3 text-[#b08a47]" /> Single Piece
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-[#065f46]" /> {product.stockCount} In Stock
                    </>
                  )
                ) : (
                  <>
                    <XCircle className="h-3 w-3 text-[#4c0d17]" /> Sold Out
                  </>
                )}
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2 border-t border-[#e5dfd3] pt-3">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f9f5ec] hover:bg-[#e5dfd3] text-[#4c0d17] transition cursor-pointer text-xs font-bold"
              >
                <Edit2 className="h-3.5 w-3.5" /> Edit Details
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer border border-red-100 shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-[#e5dfd3] bg-white shadow-sm">
        <table className="w-full text-left text-xs text-[#4c0d17]">
          <thead className="border-b border-[#e5dfd3] bg-[#f9f5ec] text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a7a6b]">
            <tr>
              <th className="px-5 py-4 w-1/4">Saree / SKU</th>
              <th className="px-5 py-4 w-1/4">Category & Hub</th>
              <th className="px-5 py-4 w-1/6">Price</th>
              <th className="px-5 py-4 text-center">Stock Available</th>
              <th className="px-5 py-4 text-center">Star Unique</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5dfd3]">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-[#f9f5ec]/50 transition">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-[#e5dfd3] bg-white shadow-sm">
                      <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                      {product.images.length > 1 && (
                        <span className="absolute bottom-0 right-0 rounded-tl bg-white/90 backdrop-blur-md px-1 text-[8px] font-mono font-bold text-[#b08a47] border-t border-l border-[#e5dfd3]">
                          <Camera className="h-2 w-2 inline" /> {product.images.length}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif font-bold text-[#4c0d17] truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] text-[#8a7a6b]">SKU: {product.sku}</span>
                        {product.isSilkMarkCertified && (
                          <span className="text-[9px] font-bold text-[#065f46] bg-[#065f46]/10 px-1.5 py-0.5 rounded border border-[#065f46]/20">
                            Silk Mark
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="block text-[#4c0d17] font-medium font-serif">{product.category}</span>
                  <span className="text-[10px] text-[#8a7a6b] truncate inline-block max-w-[150px]">📍 {product.provenance}</span>
                </td>
                <td className="px-5 py-3">
                  <span className="font-sans text-sm font-bold text-[#4c0d17]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-[#8a7a6b] line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-[#065f46] font-bold">
                        ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-5 py-3 text-center">
                  <button
                    onClick={() => onToggleStock(product.id, product.stockCount)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer border ${
                      product.stockCount > 0
                        ? product.stockCount === 1
                          ? 'bg-[#b08a47]/10 border-[#b08a47]/30 text-[#b08a47] hover:bg-[#b08a47]/20'
                          : 'bg-[#065f46]/10 border-[#065f46]/20 text-[#065f46] hover:bg-[#065f46]/20'
                        : 'bg-[#4c0d17]/10 border-[#4c0d17]/20 text-[#4c0d17] hover:bg-[#4c0d17]/20'
                    }`}
                  >
                    {product.stockCount > 0 ? (
                      product.stockCount === 1 ? (
                        <>
                          <Sparkles className="h-3 w-3 text-[#b08a47]" /> Single Piece
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-[#065f46]" /> {product.stockCount} In Stock
                        </>
                      )
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 text-[#4c0d17]" /> Sold Out
                      </>
                    )}
                  </button>
                </td>
                <td className="px-5 py-3 text-center">
                  <button
                    onClick={() => onToggleShowstopper(product.id, product.isFeaturedShowstopper)}
                    className={`p-1.5 rounded-full transition cursor-pointer mx-auto ${
                      product.isFeaturedShowstopper
                        ? 'bg-[#4c0d17] text-[#b08a47] border border-[#4c0d17] shadow-sm'
                        : 'text-[#8a7a6b] hover:text-[#4c0d17] bg-[#f9f5ec] border border-[#e5dfd3]'
                    }`}
                    title={product.isFeaturedShowstopper ? 'Remove from Showstoppers' : 'Feature as Showstopper'}
                  >
                    <Star className={`h-4 w-4 ${product.isFeaturedShowstopper ? 'fill-[#b08a47]' : ''}`} />
                  </button>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 rounded-lg bg-[#f9f5ec] hover:bg-[#e5dfd3] text-[#4c0d17] transition cursor-pointer border border-[#e5dfd3]"
                      title="Edit Saree"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer border border-red-100"
                      title="Delete Saree"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
