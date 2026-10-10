import React, { useState } from 'react';
import type { QuoteDocument, BusinessProfile } from '../types';
import { History, Search, FileText, Receipt, Trash2, Edit3, ArrowRight, Sparkles } from 'lucide-react';
import { formatCurrencyAmount } from '../services/currencyService';

interface DocumentHistoryProps {
  history: QuoteDocument[];
  profile: BusinessProfile;
  onLoadQuote: (quote: QuoteDocument) => void;
  onDeleteQuote: (id: string) => void;
  onGoToEditor: () => void;
  onConvertToInvoice?: (quote: QuoteDocument) => void;
}

export const DocumentHistory: React.FC<DocumentHistoryProps> = ({
  history,
  profile,
  onLoadQuote,
  onDeleteQuote,
  onGoToEditor,
  onConvertToInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'cotizacion' | 'cuenta_cobro'>('all');
  const currency = profile.currency_symbol || '$';

  const filtered = history.filter((q) => {
    const matchesSearch =
      q.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(q.quote_number).includes(searchTerm);
    const matchesType = filterType === 'all' || q.document_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History className="text-emerald-600" size={26} />
            Historial de Documentos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Consulta, reutiliza, convierte o vuelve a descargar tus cotizaciones y cuentas de cobro guardadas.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToEditor}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
        >
          Crear Nuevo Documento
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Filtros y Buscador */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente o número..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Todos ({history.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('cotizacion')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterType === 'cotizacion' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            Cotizaciones
          </button>
          <button
            type="button"
            onClick={() => setFilterType('cuenta_cobro')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterType === 'cuenta_cobro' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            Cuentas de Cobro
          </button>
        </div>
      </div>

      {/* Lista de Documentos */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FileText size={22} />
          </div>
          <h3 className="font-bold text-slate-700 text-sm">No hay documentos registrados</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Cuando crees y descargues o guardes cotizaciones, aparecerán aquí para que puedas convertirlas a cuenta de cobro o volverlas a enviar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((doc) => {
            const isQuote = doc.document_type === 'cotizacion';
            return (
              <div
                key={doc.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isQuote ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {isQuote ? <FileText size={20} /> : <Receipt size={20} />}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isQuote ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isQuote ? 'Cotización' : 'Cuenta de Cobro'} #{doc.quote_number}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {doc.issue_date}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">
                      {doc.client_name || 'Sin cliente especificado'}
                    </h4>

                    <p className="text-xs text-slate-500">
                      {doc.items.length} {doc.items.length === 1 ? 'concepto' : 'conceptos'} • Total:{' '}
                      <strong className="text-slate-900">{currency}{formatCurrencyAmount(doc.total, currency)}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                  {/* Botón Convertir con 1 Clic desde el Historial */}
                  {isQuote && onConvertToInvoice && (
                    <button
                      type="button"
                      onClick={() => onConvertToInvoice(doc)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition"
                      title="Convertir esta cotización en una cuenta de cobro"
                    >
                      <Receipt size={13} />
                      Convertir a Cobro
                      <Sparkles size={11} className="text-amber-500" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onLoadQuote(doc)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    <Edit3 size={14} />
                    Ver / Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteQuote(doc.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Eliminar del historial"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
