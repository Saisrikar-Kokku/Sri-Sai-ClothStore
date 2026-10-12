-- ====================================================================
-- SRI SAI CLOTHSTORE - DASARA GRAND LAUNCH RELATIONAL SCHEMA
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Role-Based Access Control)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'staff', 'viewer')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can update profile roles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 3. Dealer Consignment Lots ("Maal" Origins)
CREATE TABLE IF NOT EXISTS public.dealer_lots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lot_code TEXT NOT NULL UNIQUE,              -- e.g. "LOT-2026-KANCHI-01"
    dealer_name TEXT NOT NULL,                  -- Master weaver / dealer firm
    origin_hub TEXT NOT NULL,                   -- e.g. "Kanchipuram", "Varanasi", "Surat", "Dharmavaram"
    arrival_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_pieces INT NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.dealer_lots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view dealer lots"
    ON public.dealer_lots FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Only admins can insert/update dealer lots"
    ON public.dealer_lots FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 4. Products Table ("Maal" Inventory)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT NOT NULL UNIQUE,                   -- e.g. "SSC-KP-101"
    name TEXT NOT NULL,                         -- Full Product Title
    category TEXT NOT NULL CHECK (
        category IN ('Kanchi Pattu', 'Banarasi Silk', 'Organza', 'Fancy Sarees', 'Partywear & Kurtis')
    ),
    provenance TEXT NOT NULL DEFAULT '',
    lot_id UUID REFERENCES public.dealer_lots(id) ON DELETE SET NULL,
    price NUMERIC(10, 2) NOT NULL,              -- Dasara Offer Price (INR)
    original_price NUMERIC(10, 2) NOT NULL,     -- MRP before discount
    discount_percent INT GENERATED ALWAYS AS (
        ROUND(((original_price - price) / original_price) * 100)
    ) STORED,
    fabric TEXT NOT NULL DEFAULT '',
    zari_type TEXT NOT NULL DEFAULT '',
    blouse_details TEXT NOT NULL DEFAULT '',
    stock_count INT NOT NULL DEFAULT 1,         -- Scarcity indicator (1 = 1-of-1 piece)
    is_dealer_unique BOOLEAN NOT NULL DEFAULT true, -- 1-of-1 dealer piece
    is_silk_mark_certified BOOLEAN NOT NULL DEFAULT false,
    is_featured_showstopper BOOLEAN NOT NULL DEFAULT false,
    images TEXT[] NOT NULL DEFAULT '{}',        -- URLs in saree-images storage bucket
    description TEXT NOT NULL DEFAULT '',
    color TEXT NOT NULL DEFAULT '',
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Customer Storefront: View published products
CREATE POLICY "Public can view published products"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

-- Admin Dashboard: Full CRUD access
CREATE POLICY "Admins have full product CRUD access"
    ON public.products FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 5. Supabase Storage: Public Bucket for Saree Photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('saree-images', 'saree-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for images
CREATE POLICY "Public Saree Image Access"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'saree-images');

-- Admin upload & update access for images
CREATE POLICY "Admin Saree Image Upload"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'saree-images' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin Saree Image Delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'saree-images' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
