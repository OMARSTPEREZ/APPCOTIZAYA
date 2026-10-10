import React from 'react';
import { 
  Sparkles, 
  LogIn, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  WifiOff, 
  Cloud, 
  Share2, 
  Building2, 
  ShieldCheck,
  Zap
} from 'lucide-react';

interface WelcomeLandingProps {
  onOpenAuthModal: () => void;
  onEnterGuest: () => void;
}

export const WelcomeLanding: React.FC<WelcomeLandingProps> = ({
  onOpenAuthModal,
  onEnterGuest,
}) => {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between px-4 sm:px-6 py-8 sm:py-12 max-w-6xl mx-auto">
      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-2 sm:pt-6">
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-black shadow-xs tracking-wide">
          <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span>¡CotizaYa! • Facturación & Cotizaciones Free $0</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          <span className="text-emerald-600 dark:text-emerald-400">CotizaYa!</span> — Crea cotizaciones y cuentas de cobro{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-teal-500 to-emerald-500">
            profesionales en segundos
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
          Diseñado para contratistas, profesionales y negocios independientes. Genera documentos formales en PDF, compártelos por WhatsApp y controla tus cotizaciones sin complicaciones.
        </p>

        {/* ── BOTONES DE ACCIÓN PRINCIPALES (CTAs) ───────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
          {/* Llamada a la Acción Principal: Iniciar Sesión / Registrarse */}
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-slate-900/20 dark:shadow-emerald-900/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <LogIn size={18} />
            <span>Iniciar Sesión / Registrarse</span>
          </button>

          {/* Llamada a la Acción Secundaria: Probar como Invitado */}
          <button
            type="button"
            onClick={onEnterGuest}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-extrabold text-sm sm:text-base border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Zap size={18} className="text-amber-500" />
            <span>Probar como Invitado</span>
            <ArrowRight size={16} className="text-slate-400 dark:text-slate-500" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          🔒 100% Privado • Funciona en modo offline sin conexión obligatoria
        </p>
      </div>

      {/* ── MOCKUP INTERACTIVO / TARJETA DEMO ──────────────────────────────── */}
      <div className="my-10 max-w-4xl mx-auto w-full">
        <div className="relative rounded-3xl bg-linear-to-b from-slate-100 to-white dark:from-slate-800/80 dark:to-slate-900/90 p-4 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-2xl backdrop-blur-xs">
          {/* Header de la tarjeta demo */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200/70 dark:border-slate-700/80 pb-4 mb-5 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md">
                <FileText size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">
                    COTIZACIÓN #001
                  </h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Lista para PDF
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Validez: 15 días • Moneda: COP ($)
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total a Pagar</span>
              <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                $ 350.000 COP
              </p>
            </div>
          </div>

          {/* Items de ejemplo */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Desarrollo de Solución Digital a Medida
                </span>
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white">$ 250.000</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Configuración de Identidad y Catálogo
                </span>
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white">$ 100.000</span>
            </div>
          </div>

          {/* Badges de soporte */}
          <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 font-semibold">
            <div className="flex items-center gap-1.5">
              <Share2 size={15} className="text-emerald-600" />
              <span>Envío por WhatsApp</span>
            </div>
            <div className="flex items-center gap-1.5">
              <WifiOff size={15} className="text-teal-600" />
              <span>100% Sin Conexión</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cloud size={15} className="text-indigo-500" />
              <span>Respaldo en la Nube con Google</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 size={15} className="text-amber-500" />
              <span>Datos Bancarios y NIT</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CUADRÍCULA DE BENEFICIOS CLAVE ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto w-full my-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 mb-3 font-bold">
            <WifiOff size={20} />
          </div>
          <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">
            Modo Offline Garantizado
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Tus datos se guardan en tu navegador. Puedes cotizar en cualquier lugar sin depender de señal de internet.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 mb-3 font-bold">
            <FileText size={20} />
          </div>
          <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">
            PDF Profesional Listo
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Formatos limpios y vectoriales de cotización o cuenta de cobro listos para imprimir o adjuntar por correo.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300 mb-3 font-bold">
            <Cloud size={20} />
          </div>
          <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">
            Respaldo con Google
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Inicia sesión con 1 clic para sincronizar tus cotizaciones entre varios dispositivos de forma segura.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300 mb-3 font-bold">
            <ShieldCheck size={20} />
          </div>
          <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">
            Tus Datos te Pertenecen
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Sin suscripciones forzadas ni publicidad invasiva. Exporta tus datos cuando lo necesites.
          </p>
        </div>
      </div>

      {/* ── BANNER INFERIOR DE ACCIÓN RÁPIDA ──────────────────────────────── */}
      <div className="mt-8 text-center py-6 border-t border-slate-200/60 dark:border-slate-800">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          ¿Listo para crear tu primera cotización profesional? Elige una opción arriba y empieza en segundos.
        </p>
      </div>
    </div>
  );
};
