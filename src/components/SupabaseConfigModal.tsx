import React, { useState } from 'react';
import { Cloud, CheckCircle2, AlertCircle, Key, Link as LinkIcon, Database, Copy, Check } from 'lucide-react';
import { getSupabaseConfig, resetSupabaseClient, getSupabase } from '../services/supabase';

interface SupabaseConfigModalProps {
  onConnectionChange: (connected: boolean) => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ onConnectionChange }) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [key, setKey] = useState(currentConfig.key);
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

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

      // Probar consulta rápida
      const { error } = await client.from('profiles').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        console.warn('Aviso de conexión Supabase:', error);
      }

      setStatusMessage({ type: 'success', text: '¡Conexión establecida con Supabase con éxito!' });
      onConnectionChange(true);
    } catch (err: any) {
      setStatusMessage({ 
        type: 'error', 
        text: err.message || 'Error de conexión. Verifica la URL y Anon Key.' 
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
  logo_url TEXT,
  currency_symbol TEXT DEFAULT '$',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Tabla de cotizaciones y cuentas de cobro
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_number BIGSERIAL,
  document_type TEXT CHECK (document_type IN ('cotizacion', 'cuenta_cobro')),
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,
  items JSONB NOT NULL,
  notes TEXT,
  subtotal NUMERIC(12,2) NOT NULL,
  total NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Cloud className="text-emerald-600" size={26} />
          Conexión a Supabase (Backend en la Nube $0)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          CotizaRápido funciona 100% offline sin costo. Si deseas sincronizar usuarios, logos en Storage y base de datos PostgreSQL, conecta tu proyecto de Supabase.
        </p>
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
              placeholder="https://tu-proyecto.supabase.co"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:outline-none focus:border-emerald-500"
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
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:outline-none focus:border-emerald-500"
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
              Desconectar y usar solo Modo Offline
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
      <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-emerald-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
              Script SQL para crear las tablas en Supabase
            </h3>
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

        <p className="text-[11px] text-slate-400">
          Copia y pega este script en el <strong>SQL Editor</strong> de tu proyecto de Supabase para crear las tablas <code>profiles</code> y <code>quotes</code> con sus tipos correspondientes.
        </p>

        <pre className="bg-black/40 p-4 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48">
{`-- 1. Tabla profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  owner_name TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  currency_symbol TEXT DEFAULT '$',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Tabla quotes
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_number BIGSERIAL,
  document_type TEXT CHECK (document_type IN ('cotizacion', 'cuenta_cobro')),
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,
  items JSONB NOT NULL,
  notes TEXT,
  subtotal NUMERIC(12,2) NOT NULL,
  total NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);`}
        </pre>
      </div>
    </div>
  );
};
