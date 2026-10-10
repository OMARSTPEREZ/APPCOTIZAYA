import { useState } from 'react';
import { FREE_QUOTA_LIMIT } from '../types';
import { Zap, X, Check, Star, Crown, Sparkles, Shield, Infinity, ExternalLink, Link2, ArrowLeft } from 'lucide-react';

interface FreemiumWallProps {
  usedCount: number;
  onUpgrade?: (plan: 'monthly' | 'annual', method?: 'all' | 'nequi' | 'daviplata' | 'pse' | 'card') => void;
  onClose?: () => void;
  onSyncProStatus?: () => void;
}

export function FreemiumWall({ usedCount, onUpgrade, onClose, onSyncProStatus }: FreemiumWallProps) {
  const [step, setStep] = useState<1 | 2>(1);
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

            {step === 2 ? (
              <>
                <div className="inline-flex items-center gap-1.5 bg-white/15 text-white text-[11px] font-bold px-3 py-1 rounded-full mb-3 border border-white/20">
                  <Zap size={11} className="text-amber-300" />
                  MÉTODOS DE PAGO DIRECTOS
                </div>
                <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Elige cómo pagar</h2>
                <p className="text-white/90 text-sm leading-relaxed font-medium">
                  Plan seleccionado: <strong className="text-white font-black">{plans[billingCycle].label} ({selected.price}{selected.period})</strong>
                </p>
              </>
            ) : isLimitReached ? (
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
          {step === 1 ? (
            /* ── PASO 1: SELECCIÓN DE PLAN (SIN MÉTODOS DE PAGO VISIBLES HASTA DAR CLIC) ── */
            <>
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

              {/* BOTÓN PRINCIPAL: Al dar clic pasa al Paso 2 con los métodos de pago */}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-700 hover:to-teal-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap size={16} className="text-amber-300 fill-amber-300" />
                <span>¡Actualizar a Pro — {selected.price}{selected.period}!</span>
                <span>➔</span>
              </button>
            </>
          ) : (
            /* ── PASO 2: MÉTODOS DE PAGO APARICIÓN TRAS DAR CLIC EN ACTUALIZAR A PRO ── */
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">
                Selecciona tu método de pago preferido:
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleUpgrade('nequi')}
                  className="w-full p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-purple-950 dark:text-purple-200 flex items-center justify-between transition cursor-pointer active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🟣</span>
                    <div className="text-left">
                      <p className="text-xs font-black">Pagar con Nequi</p>
                      <p className="text-[10px] text-purple-700 dark:text-purple-400">Pago directo desde tu App Nequi</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-purple-700 dark:text-purple-300 flex items-center gap-1">Ir a Nequi <ExternalLink size={12} /></span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpgrade('daviplata')}
                  className="w-full p-3 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 text-red-950 dark:text-red-200 flex items-center justify-between transition cursor-pointer active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔴</span>
                    <div className="text-left">
                      <p className="text-xs font-black">Pagar con Daviplata</p>
                      <p className="text-[10px] text-red-700 dark:text-red-400">Pago desde celular Daviplata</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-red-700 dark:text-red-300 flex items-center gap-1">Ir a Daviplata <ExternalLink size={12} /></span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpgrade('pse')}
                  className="w-full p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200 flex items-center justify-between transition cursor-pointer active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔵</span>
                    <div className="text-left">
                      <p className="text-xs font-black">Pagar por PSE (Bancos Colombia)</p>
                      <p className="text-[10px] text-blue-700 dark:text-blue-400">Bancolombia, Davivienda, etc.</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-blue-700 dark:text-blue-300 flex items-center gap-1">Ir a PSE <ExternalLink size={12} /></span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpgrade('pse')}
                  className="w-full p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 flex items-center justify-between transition cursor-pointer active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div className="text-left">
                      <p className="text-xs font-black">Pagar con Bre-B / Transfiya</p>
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-400">Transferencias inmediatas</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1">Ir a Bre-B <ExternalLink size={12} /></span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpgrade('card')}
                  className="w-full p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 flex items-center justify-between transition cursor-pointer active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <div className="text-left">
                      <p className="text-xs font-black">Tarjetas de Crédito / Mercado Pago</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Visa, Mastercard, American Express</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">Pagar <ExternalLink size={12} /></span>
                </button>
              </div>

              {/* Botón para volver al Paso 1 */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Volver a cambiar de plan ({plans[billingCycle].label})</span>
              </button>
            </div>
          )}

          {/* Configuración de Enlace Personalizado de Pago */}
          <div className="text-center pt-1">
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
