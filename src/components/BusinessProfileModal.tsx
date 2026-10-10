import React, { useState } from 'react';
import type { BusinessProfile } from '../types';
import { Building2, Upload, Trash2, CheckCircle2, ShieldCheck, Image as ImageIcon, Sparkles } from 'lucide-react';
import { uploadLogoToSupabase } from '../services/supabase';
import { SUPPORTED_CURRENCIES, detectRegionalCurrency } from '../services/currencyService';

interface BusinessProfileModalProps {
  profile: BusinessProfile;
  onSaveProfile: (profile: BusinessProfile) => void;
  isCloudConnected: boolean;
}

export const BusinessProfileModal: React.FC<BusinessProfileModalProps> = ({
  profile,
  onSaveProfile,
  isCloudConnected,
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

    // Si hay conexión con Supabase intentamos subirlo al bucket
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="text-emerald-600" size={26} />
            Módulo 1: Configuración de Mi Negocio
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
                Nombre del Titular o Profesional *
              </label>
              <input
                type="text"
                name="owner_name"
                value={form.owner_name}
                onChange={handleChange}
                required
                placeholder="Ej: Juan Camilo Pérez"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Identificación Fiscal (NIT / Cédula)
              </label>
              <input
                type="text"
                name="document_id"
                value={form.document_id || ''}
                onChange={handleChange}
                placeholder="Ej: NIT 901.234.567-8"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Teléfono de Contacto / WhatsApp *
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Ej: 300 123 4567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition"
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
                placeholder="contacto@minegocio.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Símbolo de Moneda
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const detected = detectRegionalCurrency();
                    setForm((prev) => ({ ...prev, currency_symbol: detected.symbol }));
                  }}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Sparkles size={11} />
                  Detectar según mi región
                </button>
              </div>
              <select
                name="currency_symbol"
                value={form.currency_symbol}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold bg-white transition"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.symbol}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Datos Bancarios para Pago (Cuenta de Ahorros / Corriente / Nequi / Daviplata)
            </label>
            <textarea
              name="bank_details"
              rows={2}
              value={form.bank_details || ''}
              onChange={handleChange}
              placeholder="Ej: Bancolombia Ahorros # 123-456789-01 | Nequi: 3001234567"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-medium transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Términos y Condiciones Predeterminados
            </label>
            <textarea
              name="default_terms"
              rows={3}
              value={form.default_terms || ''}
              onChange={handleChange}
              placeholder="Ej: Validez de la cotización: 15 días. Anticipo del 50% para iniciar."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-medium transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck size={18} />
            Guardar Configuración de Negocio
          </button>
        </div>

        {/* Carga de Logo & Previsualización de Membrete */}
        <div className="md:col-span-5 space-y-6">
          {/* Tarjeta de Logo */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon size={18} className="text-emerald-600" />
              Logo Corporativo
            </h3>

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
