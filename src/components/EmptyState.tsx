interface EmptyStateProps {
  type: 'history' | 'search';
  onCreateNew?: () => void;
}

export function EmptyState({ type, onCreateNew }: EmptyStateProps) {
  if (type === 'history') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        {/* Ilustración animada */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-inner">
            <span className="text-5xl">📋</span>
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-white text-base">+</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Aún no hay documentos
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-6">
          ¡Crea tu primera cotización y empieza a cerrar negocios! Solo tarda unos segundos. 🚀
        </p>

        {/* Pasos rápidos */}
        <div className="w-full max-w-xs bg-slate-50 rounded-2xl p-4 mb-6 text-left space-y-2">
          {[
            { icon: '🏢', text: 'Configura tu perfil de negocio' },
            { icon: '✍️', text: 'Completa los datos del cliente' },
            { icon: '📄', text: 'Agrega servicios y precios' },
            { icon: '📲', text: 'Descarga en PDF o envía por WhatsApp' },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xl">{step.icon}</span>
              <span className="text-xs text-slate-600 font-medium">{step.text}</span>
            </div>
          ))}
        </div>

        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all"
          >
            <span className="text-lg">✨</span>
            Crear mi primera cotización
          </button>
        )}
      </div>
    );
  }

  // Empty state para búsqueda sin resultados
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
        <span className="text-4xl">🔍</span>
      </div>
      <h3 className="text-lg font-bold text-slate-700 mb-1">Sin resultados</h3>
      <p className="text-sm text-slate-400">
        No encontramos documentos que coincidan con tu búsqueda.
      </p>
    </div>
  );
}

export default EmptyState;
