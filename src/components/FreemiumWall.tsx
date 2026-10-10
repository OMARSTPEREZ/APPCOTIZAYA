import { FREE_QUOTA_LIMIT } from '../types';

interface FreemiumWallProps {
  usedCount: number;
  onUpgrade?: () => void;
  onClose?: () => void;
}

export function FreemiumWall({ usedCount, onUpgrade, onClose }: FreemiumWallProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl overflow-hidden">
        {/* Banner gradiente */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-6 py-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 80 + 20}px`,
                  height: `${Math.random() * 80 + 20}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.3,
                }}
              />
            ))}
          </div>
          <div className="relative">
            <div className="text-5xl mb-3">🚀</div>
            <h2 className="text-2xl font-black text-white mb-1">¡Límite alcanzado!</h2>
            <p className="text-white/80 text-sm">
              Has generado {usedCount} de {FREE_QUOTA_LIMIT} documentos este mes con el plan Free.
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-5">
          {/* Comparación Free vs Pro */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Free */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Plan Free</p>
              <ul className="space-y-1.5 text-xs text-slate-500">
                <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> {FREE_QUOTA_LIMIT} docs/mes</li>
                <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> PDF ilimitado</li>
                <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> WhatsApp</li>
                <li className="flex items-center gap-1.5"><span className="text-red-400">✗</span> Sin nube</li>
                <li className="flex items-center gap-1.5"><span className="text-red-400">✗</span> Sin marca</li>
              </ul>
            </div>
            {/* Pro */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border-2 border-indigo-300 relative">
              <div className="absolute -top-2 right-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                RECOMENDADO
              </div>
              <p className="text-xs font-bold text-indigo-600 uppercase mb-2">Plan Pro</p>
              <ul className="space-y-1.5 text-xs text-indigo-700">
                <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Docs ilimitados</li>
                <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> PDF ilimitado</li>
                <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> WhatsApp</li>
                <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Sincronización nube</li>
                <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Sin marca de agua</li>
              </ul>
            </div>
          </div>

          {/* Precio */}
          <div className="text-center mb-4">
            <p className="text-3xl font-black text-slate-800">$4.99 <span className="text-sm font-medium text-slate-400">/mes</span></p>
            <p className="text-xs text-slate-500 mt-0.5">O prueba gratis por 7 días sin tarjeta</p>
          </div>

          {/* CTAs */}
          <button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 mb-2 active:scale-95 transition-transform"
          >
            ⚡ Pasarme a Pro ahora
          </button>
          <button
            onClick={onClose}
            className="w-full text-slate-500 text-sm py-2 font-medium"
          >
            Quedarse con el plan Free
          </button>
        </div>
      </div>
    </div>
  );
}

export default FreemiumWall;
