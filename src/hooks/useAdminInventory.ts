import { useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SareeProduct } from '@/types/product.types';
import { ProductFormData, InventoryMetrics } from '@/types/admin.types';

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // fallback if randomUUID fails
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useAdminInventory(
  products: SareeProduct[],
  setProducts: React.Dispatch<React.SetStateAction<SareeProduct[]>>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Compute live metrics
  const metrics: InventoryMetrics = {
    totalProducts: products.length,
    inStockPieces: products.reduce((acc, p) => acc + (p.stockCount > 0 ? p.stockCount : 0), 0),
    soldOutPieces: products.filter((p) => p.stockCount === 0).length,
    featuredShowstoppers: products.filter((p) => p.isFeaturedShowstopper).length,
    totalInventoryValue: products.reduce((acc, p) => acc + p.price * Math.max(1, p.stockCount), 0),
    totalDealerLots: new Set(products.map((p) => p.provenance)).size,
  };

  // Helper to test if an ID is a valid Postgres UUID
  const isUuid = (id: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  // Helper with 12s timeout to avoid any indefinite hanging
  const withTimeout = async <T>(promise: PromiseLike<T>, timeoutMs = 12000): Promise<T> => {
    return Promise.race([
      Promise.resolve(promise),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Network request timed out. Please check your internet connection.')), timeoutMs)
      ),
    ]);
  };

  // 1. Create Product
  const createProduct = useCallback(
    async (formData: ProductFormData): Promise<{ success: boolean; error?: string }> => {
      setIsSubmitting(true);
      setActionError(null);

      const discountPercent = Math.max(
        0,
        Math.round(((formData.originalPrice - formData.price) / (formData.originalPrice || 1)) * 100)
      );

      const newId = generateUUID();
      const newProduct: SareeProduct = {
        id: newId,
        provenance: formData.provenance || '',
        fabric: formData.fabric || '',
        zariType: formData.zariType || '',
        blouseDetails: formData.blouseDetails || '',
        color: formData.color || '',
        ...formData,
        price: Number(formData.price) || 0,
        originalPrice: Number(formData.originalPrice) || 0,
        stockCount: typeof formData.stockCount === 'number' ? formData.stockCount : 1,
        discountPercent,
        createdAt: new Date().toISOString(),
      };

      // Optimistic update so UI reflects immediately
      setProducts((prev) => [newProduct, ...prev]);

      if (isSupabaseConfigured) {
        try {
          const insertPayload = {
            id: newId,
            sku: (formData.sku || '').trim().toUpperCase(),
            name: (formData.name || '').trim(),
            category: formData.category,
            provenance: (formData.provenance || '').trim(),
            lot_id: formData.lot_id && isUuid(formData.lot_id) ? formData.lot_id : null,
            price: Number(formData.price) || 0,
            original_price: Number(formData.originalPrice) || 0,
            discount_percent: discountPercent,
            fabric: formData.fabric || '',
            zari_type: formData.zariType || '',
            blouse_details: formData.blouseDetails || '',
            stock_count: typeof formData.stockCount === 'number' ? formData.stockCount : 1,
            is_dealer_unique: Boolean(formData.isDealerUnique),
            is_silk_mark_certified: Boolean(formData.isSilkMarkCertified),
            is_featured_showstopper: Boolean(formData.isFeaturedShowstopper),
            is_published: formData.isPublished ?? true,
            images: Array.isArray(formData.images) ? formData.images : [],
            description: formData.description || '',
            color: formData.color || '',
          };

          const dbPromise = supabase.from('products').insert([insertPayload]).select().single();
          const { data: dbData, error } = (await withTimeout(dbPromise)) as any;

          if (error) {
            console.error('Supabase insert failed:', error.message);
            // Revert optimistic update
            setProducts((prev) => prev.filter((p) => p.id !== newId));
            setActionError(error.message);
            return { success: false, error: error.message };
          }

          // Sync returned row if ID or server defaults differ
          if (dbData) {
            setProducts((prev) =>
              prev.map((p) =>
                p.id === newId
                  ? {
                      ...p,
                      id: dbData.id,
                      createdAt: dbData.created_at || p.createdAt,
                    }
                  : p
              )
            );
          }
        } catch (err: any) {
          console.error('Supabase insert exception:', err);
          // Revert optimistic update
          setProducts((prev) => prev.filter((p) => p.id !== newId));
          const msg = err.message || 'Failed to save saree to database.';
          setActionError(msg);
          return { success: false, error: msg };
        } finally {
          setIsSubmitting(false);
        }
      }

      setIsSubmitting(false);
      return { success: true };
    },
    [setProducts]
  );

  // 2. Update Product
  const updateProduct = useCallback(
    async (
      id: string,
      formData: ProductFormData
    ): Promise<{ success: boolean; error?: string }> => {
      setIsSubmitting(true);
      setActionError(null);

      const discountPercent = Math.max(
        0,
        Math.round(((formData.originalPrice - formData.price) / (formData.originalPrice || 1)) * 100)
      );

      // Save previous state in case we need to roll back
      const previousProducts = products;

      // Optimistic update
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                ...formData,
                price: Number(formData.price) || 0,
                originalPrice: Number(formData.originalPrice) || 0,
                stockCount: typeof formData.stockCount === 'number' ? formData.stockCount : 1,
                discountPercent,
              }
            : p
        )
      );

      if (isSupabaseConfigured) {
        try {
          const updatePayload = {
            sku: (formData.sku || '').trim().toUpperCase(),
            name: (formData.name || '').trim(),
            category: formData.category,
            provenance: (formData.provenance || '').trim(),
            lot_id: formData.lot_id && isUuid(formData.lot_id) ? formData.lot_id : null,
            price: Number(formData.price) || 0,
            original_price: Number(formData.originalPrice) || 0,
            discount_percent: discountPercent,
            fabric: formData.fabric || '',
            zari_type: formData.zariType || '',
            blouse_details: formData.blouseDetails || '',
            stock_count: typeof formData.stockCount === 'number' ? formData.stockCount : 1,
            is_dealer_unique: Boolean(formData.isDealerUnique),
            is_silk_mark_certified: Boolean(formData.isSilkMarkCertified),
            is_featured_showstopper: Boolean(formData.isFeaturedShowstopper),
            is_published: formData.isPublished ?? true,
            images: Array.isArray(formData.images) ? formData.images : [],
            description: formData.description || '',
            color: formData.color || '',
          };

          const query = isUuid(id)
            ? supabase.from('products').update(updatePayload).eq('id', id)
            : supabase.from('products').update(updatePayload).eq('sku', formData.sku);

          const { error } = (await withTimeout(query)) as any;
          if (error) {
            console.error('Supabase update failed:', error.message);
            setProducts(previousProducts);
            setActionError(error.message);
            return { success: false, error: error.message };
          }
        } catch (err: any) {
          console.error('Supabase update exception:', err);
          setProducts(previousProducts);
          const msg = err.message || 'Failed to update saree in database.';
          setActionError(msg);
          return { success: false, error: msg };
        } finally {
          setIsSubmitting(false);
        }
      }

      setIsSubmitting(false);
      return { success: true };
    },
    [products, setProducts]
  );

  // 3. Delete Product
  const deleteProduct = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      setIsSubmitting(true);
      setActionError(null);

      const target = products.find((p) => p.id === id);
      const previousProducts = products;

      // Optimistic update
      setProducts((prev) => prev.filter((p) => p.id !== id));

      if (isSupabaseConfigured) {
        try {
          const query = isUuid(id)
            ? supabase.from('products').delete().eq('id', id)
            : target
            ? supabase.from('products').delete().eq('sku', target.sku)
            : null;

          if (query) {
            const { error } = (await withTimeout(query)) as any;
            if (error) {
              console.error('Supabase delete failed:', error.message);
              setProducts(previousProducts);
              setActionError(error.message);
              return { success: false, error: error.message };
            }
          }
        } catch (err: any) {
          console.error('Supabase delete exception:', err);
          setProducts(previousProducts);
          const msg = err.message || 'Failed to delete saree from database.';
          setActionError(msg);
          return { success: false, error: msg };
        } finally {
          setIsSubmitting(false);
        }
      }

      setIsSubmitting(false);
      return { success: true };
    },
    [products, setProducts]
  );

  // 4. Instant Stock Toggle
  const toggleStock = useCallback(
    async (id: string, currentStock: number) => {
      const target = products.find((p) => p.id === id);
      const nextStock = currentStock > 0 ? 0 : 1;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stockCount: nextStock } : p))
      );

      if (isSupabaseConfigured) {
        try {
          const query = isUuid(id)
            ? supabase.from('products').update({ stock_count: nextStock } as any).eq('id', id)
            : target
            ? supabase.from('products').update({ stock_count: nextStock } as any).eq('sku', target.sku)
            : null;

          if (query) {
            const { error } = await query;
            if (error) console.error('Supabase stock toggle failed:', error.message);
          }
        } catch (err: any) {
          console.error('Supabase stock toggle exception:', err.message);
        }
      }
    },
    [products, setProducts]
  );

  // 5. Instant Showstopper Toggle
  const toggleShowstopper = useCallback(
    async (id: string, currentVal: boolean) => {
      const target = products.find((p) => p.id === id);
      const nextVal = !currentVal;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFeaturedShowstopper: nextVal } : p))
      );

      if (isSupabaseConfigured) {
        try {
          const query = isUuid(id)
            ? supabase.from('products').update({ is_featured_showstopper: nextVal } as any).eq('id', id)
            : target
            ? supabase.from('products').update({ is_featured_showstopper: nextVal } as any).eq('sku', target.sku)
            : null;

          if (query) {
            const { error } = await query;
            if (error) console.error('Supabase showstopper toggle failed:', error.message);
          }
        } catch (err: any) {
          console.error('Supabase showstopper toggle exception:', err.message);
        }
      }
    },
    [products, setProducts]
  );

  return {
    metrics,
    isSubmitting,
    actionError,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    toggleShowstopper,
  };
}
