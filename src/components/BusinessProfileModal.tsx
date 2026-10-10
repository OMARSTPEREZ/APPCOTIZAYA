import React, { useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { BusinessProfile } from '../types';
import { 
  Building2, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  Cloud, 
  RefreshCw, 
  LogOut 
} from 'lucide-react';
import { uploadLogoToSupabase } from '../services/supabase';
import { SUPPORTED_CURRENCIES, detectRegionalCurrency } from '../services/currencyService';

interface BusinessProfileModalProps {
  profile: BusinessProfile;
  onSaveProfile: (profile: BusinessProfile) => void;
  isCloudConnected: boolean;
  user?: SupabaseUser | null;
  onSignInWithGoogle?: () => void;
  onSignOut?: () => void;
  onSyncHistory?: () => void;
  isSyncing?: boolean;
}

export const BusinessProfileModal: React.FC<BusinessProfileModalProps> = ({
  profile,
  onSaveProfile,
  isCloudConnected,
  user,
  onSignInWithGoogle,
  onSignOut,
  onSyncHistory,
  isSyncing = false,
}) => {
  const [form, setForm] = useState<BusinessProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSavedSuccess(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isCloudConnected) {
      setUploadingLogo(true);
      const url = await uploadLogoToSupabase(file);
      setUploadingLogo(false);
      if (url) {
        setForm((prev) => ({ ...prev, logo_url: url }));
        return;
      }
    }

    // Modo local / Fallback instantáneo a Base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setForm((prev) => ({ ...prev, logo_url: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setForm((prev) => ({ ...prev, logo_url: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '';
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="text-emerald-600" size={26} />
            Configuración de Mi Negocio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personaliza el membrete, logo y datos que aparecerán automáticamente en tus cotizaciones y cuentas de cobro.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold animate-in fade-in">
            <CheckCircle2 size={16} />
            ¡Configuración guardada exitosamente!
          </div>
        )}
      </div>

      {/* Tarjeta de Respaldo en la Nube con Google */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-indigo-900/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Cloud size={18} className="text-emerald-400" />
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
                {user ? `Respaldo Activo: ${userName || user.email}` : 'Respaldar datos y cotizaciones con Google'}
              </h2>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-white/10 text-emerald-300">
                {user ? 'Sincronizado' : 'Modo Offline'}
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {user
                ? `Tus cotizaciones y perfil de negocio están respaldados en tu cuenta de Google (${user.email}).`
                : 'La app funciona 100% offline sin restricciones. Si deseas acceder desde otros dispositivos o no perder tus datos al borrar el navegador, puedes respaldar con Google.'}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
            {user ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {userAvatar && (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-8 h-8 rounded-full border border-emerald-400 shadow-xs hidden sm:block"
                  />
                )}
                {onSyncHistory && (
                  <button
                    type="button"
                    onClick={onSyncHistory}
                    disabled={isSyncing}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                    <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}</span>
                  </button>
                )}
                {onSignOut && (
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                    title="Cerrar sesión"
                  >
                    <LogOut size={15} />
                  </button>
                )}
              </div>
            ) : (
              onSignInWithGoogle && (
                <button
                  type="button"
                  onClick={onSignInWithGoogle}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs shadow-lg shadow-black/20 transition active:scale-95"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Iniciar Sesión con Google</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Formulario de Datos */}
        <div className="md:col-span-7 space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nombre de la Empresa o Negocio *
              </label>
              <input
                type="text"
                name="business_name"
                value={form.business_name}
                onChange={handleChange}
                required
                placeholder="Ej: Soluciones Tecnológicas SAS"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nombre del Titular o Representante *
              </label>
              <input
                type="text"
                name="owner_name"
                value={form.owner_name}
                onChange={handleChange}
                required
                placeholder="Ej: Carlos Rodríguez"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                NIT / RUT / Identificación Fiscal
              </label>
              <input
                type="text"
                name="document_id"
                value={form.document_id || ''}
                onChange={handleChange}
                placeholder="Ej: NIT 900.123.456-7"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Teléfono de Contacto (WhatsApp) *
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="+57 300 123 4567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="contacto@miempresa.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold transition"
              />
            </div>
          </div>

          {/* Moneda */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Moneda Predeterminada
            </label>
            <div className="flex gap-2">
              <select
                name="currency_symbol"
                value={form.currency_symbol}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold transition bg-white"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.symbol}>
                    {c.label} ({c.symbol})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  const detected = detectRegionalCurrency();
                  setForm((prev) => ({ ...prev, currency_symbol: detected.symbol }));
                }}
                className="px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 shrink-0"
                title="Detectar automáticamente según tu país"
              >
                Auto-detectar
              </button>
            </div>
          </div>

          {/* Datos Bancarios para Cuentas de Cobro */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Datos Bancarios (Para Cuentas de Cobro)
            </label>
            <textarea
              name="bank_details"
              value={form.bank_details || ''}
              onChange={handleChange}
              rows={3}
              placeholder="Ej: Bancolombia Ahorros # 123-456789-00 a nombre de..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-mono transition"
            />
          </div>

          {/* Términos por defecto */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Términos y Condiciones Predeterminados
            </label>
            <textarea
              name="default_terms"
              value={form.default_terms || ''}
              onChange={handleChange}
              rows={3}
              placeholder="Ej: Validez de la oferta: 15 días. Anticipo del 50%..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition active:scale-98"
          >
            Guardar Configuración de Negocio
          </button>
        </div>

        {/* Columna Derecha: Logo y Previsualización */}
        <div className="md:col-span-5 space-y-6">
          {/* Carga de Logo */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Logotipo de tu Empresa
            </h2>

            {form.logo_url ? (
              <div className="relative group border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col items-center justify-center">
                <img
                  src={form.logo_url}
                  alt="Logo del negocio"
                  className="max-h-28 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="mt-3 flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold bg-white px-3 py-1.5 rounded-lg border border-rose-200 shadow-xs transition"
                >
                  <Trash2 size={13} />
                  Quitar Logo
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-emerald-50/30 transition group">
                <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition">
                  <Upload size={18} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-700 group-hover:text-emerald-700 transition">
                    {uploadingLogo ? 'Subiendo imagen...' : 'Cargar Logo Corporativo'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, SVG o WebP (Max 2MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Previsualización en Vivo de Membrete */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Previsualización de Membrete
              </span>
              <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                En vivo
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-linear-to-b from-slate-50/50 to-white relative overflow-hidden">
              <div className="absolute right-2 -bottom-4 text-6xl font-black text-slate-100/70 select-none pointer-events-none uppercase">
                {form.business_name.split(' ')[0] || 'MEMBRETE'}
              </div>

              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="space-y-1">
                  <p className="font-black text-sm text-slate-900 leading-tight">
                    {form.business_name || 'Nombre de tu Empresa'}
                  </p>
                  <p className="text-[11px] font-medium text-slate-600">
                    {form.owner_name || 'Nombre del Titular'}
                  </p>
                  {form.document_id && (
                    <p className="text-[10px] text-slate-400 font-mono">
                      {form.document_id}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-500">
                    📞 {form.phone || 'Teléfono'} | ✉️ {form.email || 'correo@ejemplo.com'}
                  </p>
                </div>

                {form.logo_url && (
                  <img
                    src={form.logo_url}
                    alt="Logo preview"
                    className="h-10 object-contain rounded shrink-0"
                  />
                )}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 text-center italic">
              Este membrete encabezará cada PDF generado y transmitirá una imagen 100% corporativa.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
