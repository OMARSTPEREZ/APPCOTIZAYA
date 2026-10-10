-- ==============================================================================
-- COTIZARÁPIDO (APPCOTIZAYA) - ESQUEMA COMPLETO v2.0
-- Repo: https://github.com/OMARSTPEREZ/APPCOTIZAYA
-- ==============================================================================

-- 1. Tabla de perfiles de usuario / negocio
--    Incluye: subscription_tier (free/pro) y monthly_quote_count (muro freemium)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  owner_name TEXT,
  phone TEXT,
  email TEXT,
  document_id TEXT,                                -- NIT / RUT / Cédula fiscal
  logo_url TEXT,
  currency_symbol TEXT DEFAULT '$',
  bank_details TEXT,
  default_terms TEXT,
  -- ── FREEMIUM FIELDS ────────────────────────────────────────────────────────
  subscription_tier TEXT NOT NULL DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'pro')),  -- Plan del usuario
  monthly_quote_count INTEGER NOT NULL DEFAULT 0,  -- Docs generados este mes
  quota_reset_date DATE DEFAULT CURRENT_DATE,      -- Fecha de reinicio del contador
  -- ────────────────────────────────────────────────────────────────────────────
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Tabla de cotizaciones y cuentas de cobro
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_number TEXT NOT NULL,
  document_type TEXT CHECK (document_type IN ('cotizacion', 'cuenta_cobro')),
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_phone_code TEXT DEFAULT '+57',
  client_email TEXT,
  client_id_number TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  tax_rate NUMERIC(5,2) DEFAULT 0,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'accepted', 'rejected', 'converted')),
  public_token UUID DEFAULT gen_random_uuid(), -- Token único para vista pública
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes   ENABLE ROW LEVEL SECURITY;

-- ── Políticas para profiles ──────────────────────────────────────────────────
CREATE POLICY "Perfil propio: lectura"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Perfil propio: escritura"
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── Políticas para quotes ────────────────────────────────────────────────────
CREATE POLICY "Documentos propios: lectura"
  ON public.quotes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Documentos propios: inserción"
  ON public.quotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Documentos propios: actualización"
  ON public.quotes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Documentos propios: eliminación"
  ON public.quotes FOR DELETE
  USING (auth.uid() = user_id);

-- Vista pública por token (sin autenticación - para clientes finales)
CREATE POLICY "Vista pública por token"
  ON public.quotes FOR SELECT
  USING (public_token IS NOT NULL);

-- 4. Bucket de almacenamiento para logos corporativos
INSERT INTO storage.buckets (id, name, public)
  VALUES ('logos', 'logos', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Logos: subida pública"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Logos: lectura pública"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

-- 5. Función: Incrementar contador mensual (con reset automático)
CREATE OR REPLACE FUNCTION public.increment_monthly_quote_count(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  current_tier TEXT;
  current_count INTEGER;
  reset_date DATE;
  free_limit CONSTANT INTEGER := 5; -- Límite plan Free: 5 docs/mes
BEGIN
  SELECT subscription_tier, monthly_quote_count, quota_reset_date
    INTO current_tier, current_count, reset_date
    FROM public.profiles
    WHERE id = user_uuid;

  -- Reiniciar contador si cambió el mes
  IF reset_date < DATE_TRUNC('month', CURRENT_DATE) THEN
    UPDATE public.profiles
      SET monthly_quote_count = 1,
          quota_reset_date = CURRENT_DATE,
          updated_at = NOW()
      WHERE id = user_uuid;
    RETURN;
  END IF;

  -- Verificar límite Free
  IF current_tier = 'free' AND current_count >= free_limit THEN
    RAISE EXCEPTION 'QUOTA_EXCEEDED: Has alcanzado el límite de % documentos/mes en el plan Free.', free_limit;
  END IF;

  -- Incrementar contador
  UPDATE public.profiles
    SET monthly_quote_count = monthly_quote_count + 1,
        updated_at = NOW()
    WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON public.quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_public_token ON public.quotes(public_token);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes(created_at DESC);
