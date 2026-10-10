import React from 'react';
import { X, Sparkles, ShieldCheck, Cloud, ArrowRight, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInWithGoogle: () => void;
  isConnecting?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSignInWithGoogle,
  isConnecting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="relative bg-linear-to-br from-slate-900 via-indigo-950 to-emerald-950 p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>

          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
            <Sparkles className="text-emerald-400" size={28} />
          </div>

          <h3 className="text-xl font-black tracking-tight">
            Accede a <span className="text-emerald-400">CotizaYa!</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Guarda tus cotizaciones en la nube y accede desde cualquier teléfono o computadora.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Beneficios */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Cloud size={14} />
              </div>
              <span>Sincronización multi-dispositivo en tiempo real</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
              <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <ShieldCheck size={14} />
              </div>
              <span>Respaldo seguro de tus datos fiscales y logo</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
              <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Sparkles size={14} />
              </div>
              <span>Acceso a funciones Pro y plantillas avanzadas</span>
            </div>
          </div>

          {/* Botón de Google */}
          <button
            type="button"
            onClick={onSignInWithGoogle}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm border-2 border-slate-200 hover:border-slate-300 shadow-md shadow-slate-200/50 transition-all active:scale-98 disabled:opacity-50"
          >
            {/* SVG Oficial de Google */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>{isConnecting ? 'Conectando con Google...' : 'Continuar con Google'}</span>
          </button>

          {/* Opción Modo Invitado */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition inline-flex items-center gap-1.5"
            >
              <User size={13} />
              <span>Continuar en Modo Invitado (Sin registro)</span>
              <ArrowRight size={12} />
            </button>
            <p className="text-[10px] text-slate-400 mt-1">
              Tus cotizaciones seguirán guardándose localmente en tu navegador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
