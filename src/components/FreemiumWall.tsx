import { useState } from 'react';
import { FREE_QUOTA_LIMIT } from '../types';
import { Zap, X, Check, Star, Crown, Sparkles, Shield, Infinity } from 'lucide-react';

interface FreemiumWallProps {
  usedCount: number;
  onUpgrade?: (plan: 'monthly' | 'annual') => void;
  onClose?: () => void;
}

export function FreemiumWall({ usedCount, onUpgrade, onClose }: FreemiumWallProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = {
    monthly: { price: '$ 15.000', period: '/mes', savings: null, label: 'Mensual' },
    annual:  { price: '$ 99.000', period: '/año', savings: 'Ahorras $ 81.000', label: 'Anual' },
  };

  const selected = plans[billingCycle];

  const handleUpgrade = () => {
    if (onUpgrade) onUpgrade(billingCycle);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">

        {/* Botón cerrar */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        )}

        {/* Banner Gradiente */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-6 pt-8 pb-6 text-center relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />

          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20 shadow-inner">
              <Crown className="text-yellow-300" size={30} />
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/15 text-white text-[11px] font-bold px-3 py-1 rounded-full mb-3 border border-white/20">
              <Zap size={11} className="text-yellow-300" />
              LÍMITE ALCANZADO
            </div>
            <h2 className="text-2xl font-black text-white mb-1">¡Pasa a Pro!</h2>
            <p className="text-white/75 text-sm leading-relaxed">
              Has usado <strong className="text-white">{usedCount}</strong> de{' '}
              <strong className="text-white">{FREE_QUOTA_LIMIT}</strong> documentos gratuitos este mes.
            </p>
          </div>
        </div>

        {/* Cuerpo del modal */}
        <div className="px-6 py-5 space-y-5">

          {/* Toggle Mensual / Anual */}
          <div className="flex items-center justify-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            {(['monthly', 'annual'] as const).map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setBillingCycle(cycle)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === cycle
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {cycle === 'annual' && <Star size={12} className="text-yellow-500" />}
                {plans[cycle].label}
                {cycle === 'annual' && (
                  <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[9px] font-black uppercase">
                    -44%
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Precio */}
          <div className="text-center py-1">
            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {selected.price}
              <span className="text-base font-medium text-slate-400 dark:text-slate-500 ml-1">{selected.period}</span>
            </div>
            {selected.savings && (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center justify-center gap-1">
                <Sparkles size={12} />
                {selected.savings} frente al plan mensual
              </p>
            )}
          </div>

          {/* Comparación Free vs Pro */}
          <div className="grid grid-cols-2 gap-3">
            {/* Free */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2.5">Plan Free</p>
              <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500 shrink-0" />{FREE_QUOTA_LIMIT} docs / mes</li>
                <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500 shrink-0" />PDF con marca de agua</li>
                <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500 shrink-0" />WhatsApp básico</li>
                <li className="flex items-center gap-1.5 opacity-50"><X size={12} className="text-red-400 shrink-0" />Sin nube</li>
                <li className="flex items-center gap-1.5 opacity-50"><X size={12} className="text-red-400 shrink-0" />Sin firma digital</li>
              </ul>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/60 rounded-2xl p-4 border-2 border-indigo-300 dark:border-indigo-600 relative">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap">
                ⭐ PRO
              </div>
              <p className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase mb-2.5">Plan Pro</p>
              <ul className="space-y-1.5 text-xs text-indigo-700 dark:text-indigo-300">
                <li className="flex items-center gap-1.5"><Infinity size={12} className="shrink-0" />Docs ilimitados</li>
                <li className="flex items-center gap-1.5"><Shield size={12} className="shrink-0" />Sin marca de agua</li>
                <li className="flex items-center gap-1.5"><Check size={12} className="shrink-0" />PDF premium</li>
                <li className="flex items-center gap-1.5"><Check size={12} className="shrink-0" />Nube + historial</li>
                <li className="flex items-center gap-1.5"><Check size={12} className="shrink-0" />Soporte prioritario</li>
              </ul>
            </div>
          </div>

          {/* CTA Principal */}
          <button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2"
          >
            <Zap size={16} className="text-yellow-300" />
            ¡Actualizar a Pro — {selected.price}{selected.period}!
          </button>

          {/* Métodos de pago */}
          <div className="text-center space-y-1">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              🇨🇴 Mercado Pago · Nequi · PSE · Tarjeta
            </p>
            <button
              onClick={onClose}
              className="text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              Quedarse con el plan Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreemiumWall;
