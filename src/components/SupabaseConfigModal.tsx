import React, { useState, useEffect } from 'react';
import { Cloud, CheckCircle2, AlertCircle, Key, Link as LinkIcon, Copy, Check, Sparkles } from 'lucide-react';
import { getSupabaseConfig, resetSupabaseClient, getSupabase } from '../services/supabase';

interface SupabaseConfigModalProps {
  onConnectionChange: (connected: boolean) => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ onConnectionChange }) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url || 'https://rnznvwniwcvljxdjpzib.supabase.co');
  const [key, setKey] = useState(currentConfig.key || 'sb_publishable_ETHSJ80C_pX5HmS77fKwAQ_92ZF65aX');
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Comprobar estado de conexión automáticamente al abrir
  useEffect(() => {
    const checkLiveConnection = async () => {
      const client = getSupabase();
      if (!client) return;
      try {
        const { error } = await client.from('profiles').select('id').limit(1);
        if (!error || error.code === 'PGRST116') {
          setStatusMessage({ 
            type: 'success', 
            text: '¡Conexión activa con Supabase (Proyecto: rnznvwniwcvljxdjpzib)!' 
          });
          onConnectionChange(true);
        }
      } catch {
        // Silencioso
      }
    };
    checkLiveConnection();
  }, [onConnectionChange]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setStatusMessage(null);

    localStorage.setItem('cotizarapido_sb_url', url.trim());
    localStorage.setItem('cotizarapido_sb_key', key.trim());
    resetSupabaseClient();

    try {
      const client = getSupabase();
      if (!client) {
        throw new Error('Faltan credenciales de Supabase');
      }

      // Probar consulta rápida a la tabla de profiles
      const { error } = await client.from('profiles').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        console.warn('Aviso de conexión Supabase:', error);
      }

      setStatusMessage({ type: 'success', text: '¡Conexión establecida con Supabase con éxito!' });
      onConnectionChange(true);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error de conexión. Verifica la URL y Anon Key.';
      setStatusMessage({ 
        type: 'error', 
        text: errorMsg 
      });
      onConnectionChange(false);
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('cotizarapido_sb_url');
    localStorage.removeItem('cotizarapido_sb_key');
    resetSupabaseClient();
    setUrl('');
    setKey('');
    setStatusMessage(null);
    onConnectionChange(false);
  };

  const copySqlSchema = () => {
    const sql = `-- Tabla de perfiles de usuario / negocio
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  owner_name TEXT,
  phone TEXT,
  email TEXT,
  document_id TEXT,
  logo_url TEXT,
  currency_symbol TEXT DEFAULT '$',
  bank_details TEXT,
  default_terms TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  monthly_quote_count INTEGER NOT NULL DEFAULT 0,
  quota_reset_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Tabla de cotizaciones y cuentas de cobro
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
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'rejected', 'converted')),
  public_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- RLS y Storage
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Perfil propio" ON public.profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Cotizaciones propias" ON public.quotes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Vista publica presupuestos" ON public.quotes FOR SELECT USING (public_token IS NOT NULL);

INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Logos publicos" ON storage.objects FOR ALL USING (bucket_id = 'logos');`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Cloud className="text-emerald-600" size={26} />
              Conexión a Supabase (Backend en la Nube $0)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sincroniza tus datos de negocio, cotizaciones y logos en la nube de PostgreSQL.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shrink-0">
            <Sparkles size={14} className="text-emerald-600" />
            <span>Nube Lista</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <LinkIcon size={14} className="text-slate-400" />
              Supabase Project URL (SUPABASE_URL)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://rnznvwniwcvljxdjpzib.supabase.co"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 bg-slate-50/50 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Key size={14} className="text-slate-400" />
              Supabase Anon Public Key (SUPABASE_ANON_KEY)
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sb_publishable_..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 bg-slate-50/50 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {statusMessage.text}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 transition"
            >
              Restablecer valores
            </button>

            <button
              type="submit"
              disabled={testing || !url || !key}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
            >
              {testing ? 'Comprobando conexión...' : 'Guardar y Probar Conexión'}
            </button>
          </div>
        </form>
      </div>

      {/* Script SQL de referencia rápida */}
      <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
              Esquema SQL de Supabase (v2.0)
            </span>
          </div>

          <button
            type="button"
            onClick={copySqlSchema}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
          >
            {copiedSql ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copiedSql ? '¡Copiado!' : 'Copiar SQL'}
          </button>
        </div>

        <pre className="text-[11px] font-mono bg-slate-950 p-4 rounded-xl overflow-x-auto text-emerald-300 max-h-48 border border-slate-800 leading-relaxed">
          {`-- 1. Tabla profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  owner_name TEXT,
  phone TEXT,
  email TEXT,
  document_id TEXT,
  logo_url TEXT,
  currency_symbol TEXT DEFAULT '$',
  bank_details TEXT,
  default_terms TEXT,
  subscription_tier TEXT DEFAULT 'free',
  monthly_quote_count INTEGER DEFAULT 0
);

-- 2. Tabla quotes
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_number TEXT NOT NULL,
  document_type TEXT,
  client_name TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC(12,2) NOT NULL
);`}
        </pre>
      </div>
    </div>
  );
};
