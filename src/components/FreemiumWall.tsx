import { useState } from 'react';
import { FREE_QUOTA_LIMIT } from '../types';
import { Zap, X, Check, Star, Crown, Sparkles, Shield, Infinity, ExternalLink, Link2 } from 'lucide-react';

interface FreemiumWallProps {
  usedCount: number;
  onUpgrade?: (plan: 'monthly' | 'annual', method?: 'all' | 'nequi' | 'daviplata' | 'pse' | 'card') => void;
  onClose?: () => void;
  onSyncProStatus?: () => void;
}

export function FreemiumWall({ usedCount, onUpgrade, onClose, onSyncProStatus }: FreemiumWallProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [showCustomLinkInput, setShowCustomLinkInput] = useState(false);
  const [customUrl, setCustomUrl] = useState(() => localStorage.getItem('cotizaya_custom_payment_url') || '');

  const plans = {
    monthly: { price: '$ 15.000', period: '/mes', savings: null, label: 'Mensual' },
    annual:  { price: '$ 99.000', period: '/año', savings: 'Ahorras $ 81.000', label: 'Anual' },
  };

  const selected = plans[billingCycle];

  const handleUpgrade = (method: 'all' | 'nequi' | 'daviplata' | 'pse' | 'card' = 'all') => {
    if (onUpgrade) onUpgrade(billingCycle, method);
  };

  const handleSaveCustomUrl = () => {
    if (customUrl.trim()) {
      localStorage.setItem('cotizaya_custom_payment_url', customUrl.trim());
    } else {
      localStorage.removeItem('cotizaya_custom_payment_url');
    }
    setShowCustomLinkInput(false);
  };

  const isLimitReached = usedCount >= FREE_QUOTA_LIMIT;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">

        {/* Botón cerrar */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        )}

        {/* Banner Gradiente Esmeralda de Marca */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 px-6 pt-8 pb-6 text-center relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full" />

          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20 shadow-inner">
              <Crown className="text-amber-300 fill-amber-300" size={30} />
            </div>

            {isLimitReached ? (
              <>
                <div className="inline-flex items-center gap-1.5 bg-white/15 text-white text-[11px] font-bold px-3 py-1 rounded-full mb-3 border border-white/20">
                  <Zap size={11} className="text-amber-300 animate-pulse" />
                  LÍMITE ALCANZADO ({usedCount}/{FREE_QUOTA_LIMIT})
                </div>
                <h2 className="text-2xl font-black text-white mb-1 tracking-tight">¡Pasa a Pro!</h2>
                <p className="text-white/90 text-sm leading-relaxed font-medium">
                  Has completado tu cuota gratuita de este mes. Actualiza para crear cotizaciones e impresiones ilimitadas.
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-1.5 bg-white/15 text-white text-[11px] font-bold px-3 py-1 rounded-full mb-3 border border-white/20">
                  <Star size={11} className="text-amber-300" />
                  PLANES & PRECIOS PRO
                </div>
                <h2 className="text-2xl font-black text-white mb-1 tracking-tight">¡Pasa a Pro!</h2>
                <p className="text-white/90 text-sm leading-relaxed font-medium">
                  Cotizaciones e impresiones ilimitadas, sin marca de agua y con respaldo en la nube.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Cuerpo del modal */}
        <div className="px-6 py-5 space-y-4">
          {/* Toggle Mensual / Anual */}
          <div className="flex items-center justify-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            {(['monthly', 'annual'] as const).map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setBillingCycle(cycle)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === cycle
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {cycle === 'annual' && <Star size={12} className="text-amber-500 fill-amber-500" />}
                {plans[cycle].label}
                {cycle === 'annual' && (
                  <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-black uppercase">
                    -44%
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Precio */}
          <div className="text-center py-0.5">
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {selected.price}
              <span className="text-sm font-medium text-slate-400 dark:text-slate-500 ml-1">{selected.period}</span>
            </div>
            {selected.savings && (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
                <Sparkles size={12} />
                {selected.savings} frente al plan mensual
              </p>
            )}
          </div>

          {/* Comparación Free vs Pro */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Free */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-700">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2">Plan Free</p>
              <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <li className="flex items-center gap-1"><Check size={11} className="text-emerald-500 shrink-0" />{FREE_QUOTA_LIMIT} docs / mes</li>
                <li className="flex items-center gap-1"><Check size={11} className="text-emerald-500 shrink-0" />PDF con marca</li>
                <li className="flex items-center gap-1 opacity-50"><X size={11} className="text-red-400 shrink-0" />Sin nube</li>
              </ul>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/90 dark:from-emerald-950/70 dark:to-teal-950/70 rounded-2xl p-3 border-2 border-emerald-500 dark:border-emerald-500 relative shadow-xs">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs">
                ⭐ PRO
              </div>
              <p className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 uppercase mb-2">Plan Pro</p>
              <ul className="space-y-1 text-[11px] text-emerald-900 dark:text-emerald-100 font-bold">
                <li className="flex items-center gap-1"><Infinity size={11} className="text-emerald-600 dark:text-emerald-400 shrink-0" />Docs ilimitados</li>
                <li className="flex items-center gap-1"><Shield size={11} className="text-emerald-600 dark:text-emerald-400 shrink-0" />Sin marca de agua</li>
                <li className="flex items-center gap-1"><Check size={11} className="text-emerald-600 dark:text-emerald-400 shrink-0" />Nube + historial</li>
              </ul>
            </div>
          </div>

          {/* BOTÓN PRINCIPAL: Abrir pasarela de pago en NUEVA PESTAÑA */}
          <button
            type="button"
            onClick={() => handleUpgrade('all')}
            className="w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-700 hover:to-teal-600 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap size={16} className="text-amber-300 fill-amber-300" />
            <span>¡Actualizar a Pro — {selected.price}{selected.period}!</span>
            <ExternalLink size={15} />
          </button>

          {/* SECCIÓN MÉTODOS DE PAGO DIRECTOS */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center mb-2">
              o selecciona tu método de pago directo (Abre otra pestaña):
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleUpgrade('nequi')}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-purple-950 dark:text-purple-200 text-center transition cursor-pointer active:scale-95"
              >
                <span className="text-base block">🟣</span>
                <span className="text-xs font-black block">Nequi</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpgrade('daviplata')}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 text-red-950 dark:text-red-200 text-center transition cursor-pointer active:scale-95"
              >
                <span className="text-base block">🔴</span>
                <span className="text-xs font-black block">Daviplata</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpgrade('pse')}
                className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200 text-center transition cursor-pointer active:scale-95"
              >
                <span className="text-base block">🔵</span>
                <span className="text-xs font-black block">PSE</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpgrade('pse')}
                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 text-center transition cursor-pointer active:scale-95"
              >
                <span className="text-base block">⚡</span>
                <span className="text-xs font-black block">Bre-B</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpgrade('card')}
                className="col-span-2 sm:col-span-2 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-center transition cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="text-base">💳</span>
                <span className="text-xs font-black">Tarjetas / Mercado Pago</span>
              </button>
            </div>
          </div>

          {/* Configuración de Enlace Personalizado de Pago (Mercado Pago / Wompi / ePayco) */}
          <div className="text-center">
            {showCustomLinkInput ? (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-left">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                  Pega tu Link Real de Mercado Pago / Pasarela de Pago:
                </label>
                <input
                  type="url"
                  placeholder="https://mpago.li/tu-link-real-de-pago"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveCustomUrl}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Guardar Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomLinkInput(false)}
                    className="py-1.5 px-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCustomLinkInput(true)}
                className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
              >
                <Link2 size={10} />
                {localStorage.getItem('cotizaya_custom_payment_url') ? '✏️ Link de pago personalizado configurado' : '⚙️ Configurar Link Personalizado de Pago'}
              </button>
            )}
          </div>

          {/* Opciones de Soporte y Cierre */}
          <div className="flex flex-col items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
            {onSyncProStatus && (
              <button
                type="button"
                onClick={onSyncProStatus}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline transition cursor-pointer"
              >
                ¿Ya realizaste el pago? Sincronizar estado PRO ⚡
              </button>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
              >
                Quedarse con el plan Free
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreemiumWall;
