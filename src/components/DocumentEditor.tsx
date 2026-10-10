import React from 'react';
import type { QuoteDocument, BusinessProfile, QuoteItem, QuoteValidationErrors } from '../types';
import { 
  FileText, 
  Receipt, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  Eye, 
  Save, 
  RotateCcw,
  Sparkles,
  Globe,
  AlertCircle
} from 'lucide-react';
import { 
  SUPPORTED_CURRENCIES, 
  formatCurrencyAmount, 
  detectRegionalCurrency 
} from '../services/currencyService';

interface DocumentEditorProps {
  quote: QuoteDocument;
  setQuote: React.Dispatch<React.SetStateAction<QuoteDocument>>;
  profile: BusinessProfile;
  validationErrors?: QuoteValidationErrors;
  onUpdateProfileCurrency: (symbol: string) => void;
  onGoToPreview: () => void;
  onSaveDraft: () => void;
  onNewDocument: () => void;
  onConvertToInvoice?: (quote: QuoteDocument) => void;
}

const COUNTRY_CODES = [
  { code: '+57', country: '🇨🇴 +57 (Colombia)' },
  { code: '+1', country: '🇺🇸/🇨🇦 +1 (USA/Canadá)' },
  { code: '+52', country: '🇲🇽 +52 (México)' },
  { code: '+34', country: '🇪🇸 +34 (España)' },
  { code: '+54', country: '🇦🇷 +54 (Argentina)' },
  { code: '+56', country: '🇨🇱 +56 (Chile)' },
  { code: '+51', country: '🇵🇪 +51 (Perú)' },
  { code: '+593', country: '🇪🇨 +593 (Ecuador)' },
  { code: '+507', country: '🇵🇦 +507 (Panamá)' },
  { code: '+506', country: '🇨🇷 +506 (Costa Rica)' },
  { code: '+58', country: '🇻🇪 +58 (Venezuela)' },
];

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  quote,
  setQuote,
  profile,
  validationErrors = {},
  onUpdateProfileCurrency,
  onGoToPreview,
  onSaveDraft,
  onNewDocument,
  onConvertToInvoice,
}) => {
  const currency = profile.currency_symbol || '$';
  const isQuote = quote.document_type === 'cotizacion';

  // Recalcular subtotal y total
  const recalculateTotals = (items: QuoteItem[], taxRate: number = 0) => {
    const sub = items.reduce((acc, it) => acc + (Number(it.qty || 0) * Number(it.price || 0)), 0);
    const tax = taxRate > 0 ? (sub * taxRate) / 100 : 0;
    const tot = sub + tax;
    return { subtotal: sub, tax_amount: tax, total: tot };
  };

  const handleDocTypeChange = (type: 'cotizacion' | 'cuenta_cobro') => {
    setQuote((prev) => ({
      ...prev,
      document_type: type,
      notes: type === 'cuenta_cobro' && profile.bank_details
        ? `Favor consignar a la siguiente cuenta bancaria:\n${profile.bank_details}`
        : prev.notes || profile.default_terms || '',
    }));
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuote((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    const newItem: QuoteItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      desc: '',
      qty: 1,
      price: 0,
    };
    const updatedItems = [...quote.items, newItem];
    const { subtotal, tax_amount, total } = recalculateTotals(updatedItems, quote.tax_rate || 0);
    setQuote((prev) => ({
      ...prev,
      items: updatedItems,
      subtotal,
      tax_amount,
      total,
    }));
  };

  const handleUpdateItem = (id: string, field: keyof QuoteItem, value: any) => {
    const updatedItems = quote.items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    const { subtotal, tax_amount, total } = recalculateTotals(updatedItems, quote.tax_rate || 0);
    setQuote((prev) => ({
      ...prev,
      items: updatedItems,
      subtotal,
      tax_amount,
      total,
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (quote.items.length <= 1) {
      const resetItems: QuoteItem[] = [{ id: `item_${Date.now()}`, desc: '', qty: 1, price: 0 }];
      const { subtotal, tax_amount, total } = recalculateTotals(resetItems, quote.tax_rate || 0);
      setQuote((prev) => ({ ...prev, items: resetItems, subtotal, tax_amount, total }));
      return;
    }
    const updatedItems = quote.items.filter((item) => item.id !== id);
    const { subtotal, tax_amount, total } = recalculateTotals(updatedItems, quote.tax_rate || 0);
    setQuote((prev) => ({
      ...prev,
      items: updatedItems,
      subtotal,
      tax_amount,
      total,
    }));
  };

  const handleTaxRateChange = (rate: number) => {
    const { subtotal, tax_amount, total } = recalculateTotals(quote.items, rate);
    setQuote((prev) => ({
      ...prev,
      tax_rate: rate,
      subtotal,
      tax_amount,
      total,
    }));
  };

  const handleAutoDetectCurrency = () => {
    const detected = detectRegionalCurrency();
    onUpdateProfileCurrency(detected.symbol);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner / Type Selector */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="text-emerald-600" size={24} />
              Creador de Documentos
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Completa los datos y obtén en segundos un documento listo para PDF o WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Botón 1-Clic para convertir a cuenta de cobro si es cotización */}
            {isQuote && onConvertToInvoice && (
              <button
                type="button"
                onClick={() => onConvertToInvoice(quote)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition border border-blue-200"
                title="Convertir esta cotización en cuenta de cobro automáticamente"
              >
                <Receipt size={14} />
                Convertir a Cobro
                <Sparkles size={11} className="text-amber-500" />
              </button>
            )}

            <button
              type="button"
              onClick={onNewDocument}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200"
            >
              <RotateCcw size={14} />
              Nuevo
            </button>
            <button
              type="button"
              onClick={onSaveDraft}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition border border-emerald-200"
            >
              <Save size={14} />
              Guardar Borrador
            </button>
            <button
              type="button"
              onClick={onGoToPreview}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition active:scale-95"
            >
              <Eye size={14} />
              Vista Previa & PDF
            </button>
          </div>
        </div>

        {/* Segmented Document Type Selector */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200/80">
          <button
            type="button"
            onClick={() => handleDocTypeChange('cotizacion')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all ${
              quote.document_type === 'cotizacion'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText size={16} />
            Cotización Comercial
          </button>
          <button
            type="button"
            onClick={() => handleDocTypeChange('cuenta_cobro')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all ${
              quote.document_type === 'cuenta_cobro'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Receipt size={16} />
            Cuenta de Cobro
          </button>
        </div>

        {/* Selector Dinámico de Moneda y Detección Regional */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-emerald-600" />
            <span className="text-xs font-bold text-slate-700">Moneda del documento:</span>
            <select
              value={currency}
              onChange={(e) => onUpdateProfileCurrency(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-extrabold text-slate-900 bg-white focus:outline-none focus:border-emerald-500"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.symbol}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleAutoDetectCurrency}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 self-end sm:self-center"
            title="Detecta tu país y zona horaria para ajustar la moneda automáticamente"
          >
            <Sparkles size={12} />
            Detectar moneda según mi región
          </button>
        </div>

        {/* Document Number and Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Número de {quote.document_type === 'cotizacion' ? 'Cotización' : 'Cuenta'}
            </label>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-300">
              <span className="text-xs font-bold text-slate-400">#</span>
              <input
                type="text"
                name="quote_number"
                value={quote.quote_number}
                onChange={handleClientChange}
                placeholder="001"
                className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
              <Calendar size={13} className="text-slate-400" />
              Fecha de Emisión
            </label>
            <input
              type="date"
              name="issue_date"
              value={quote.issue_date}
              onChange={handleClientChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
              <Calendar size={13} className="text-slate-400" />
              Fecha de Vencimiento
            </label>
            <input
              type="date"
              name="due_date"
              value={quote.due_date || ''}
              onChange={handleClientChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Datos del Cliente */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <User size={16} className="text-emerald-600" />
          Datos del Cliente
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nombre de la Persona o Razón Social de la Empresa *
            </label>
            <input
              type="text"
              name="client_name"
              value={quote.client_name}
              onChange={handleClientChange}
              placeholder="Ej: Inversiones Globales S.A. / Andrés Gómez"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 ${
                validationErrors.client_name
                  ? 'border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
            />
            {validationErrors.client_name && (
              <p className="mt-1 text-xs text-red-600 font-bold flex items-center gap-1">
                <AlertCircle size={12} />
                {validationErrors.client_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Phone size={13} className="text-emerald-600" />
              Teléfono para Enlace Directo a WhatsApp *
            </label>
            <div className="flex gap-2">
              <select
                name="client_phone_code"
                value={quote.client_phone_code || '+57'}
                onChange={handleClientChange}
                className="w-32 px-2 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 focus:outline-none focus:border-emerald-500"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.country}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="client_phone"
                value={quote.client_phone}
                onChange={handleClientChange}
                placeholder="Ej: 3101234567"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Permitirá enviarle el mensaje automático al chat de WhatsApp con 1 clic.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Mail size={13} className="text-slate-400" />
              Correo Electrónico
            </label>
            <input
              type="email"
              name="client_email"
              value={quote.client_email}
              onChange={handleClientChange}
              placeholder="cliente@ejemplo.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <CreditCard size={13} className="text-slate-400" />
              Identificación del Cliente (NIT / C.C.)
            </label>
            <input
              type="text"
              name="client_id_number"
              value={quote.client_id_number || ''}
              onChange={handleClientChange}
              placeholder="Ej: CC 1.020.304.506 o NIT 900.555.444"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Lista Dinámica de Ítems */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Receipt size={16} className="text-emerald-600" />
            Conceptos / Servicios / Productos
          </h2>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition border border-emerald-200"
          >
            <Plus size={14} />
            Agregar Ítem
          </button>
        </div>

        <div className="space-y-3">
          {quote.items.map((item, index) => {
            const lineTotal = Number(item.qty || 0) * Number(item.price || 0);
            return (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 sm:gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 items-center"
              >
                <div className="col-span-12 sm:col-span-6">
                  <label className="block sm:hidden text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Descripción #{index + 1}
                  </label>
                  <input
                    type="text"
                    value={item.desc}
                    onChange={(e) => handleUpdateItem(item.id, 'desc', e.target.value)}
                    placeholder="Descripción del servicio o producto..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label className="block sm:hidden text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Cant.
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={item.qty}
                    onChange={(e) => handleUpdateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                    placeholder="1"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-center focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label className="block sm:hidden text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Precio Unit.
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.price}
                    onChange={(e) => handleUpdateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-right focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1 text-right">
                  <label className="block sm:hidden text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Total
                  </label>
                  <p className="text-xs font-extrabold text-slate-900 truncate">
                    {currency}{formatCurrencyAmount(lineTotal, currency)}
                  </p>
                </div>

                <div className="col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Eliminar ítem"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl text-xs font-bold text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/20 transition flex items-center justify-center gap-1.5"
        >
          <Plus size={15} />
          Agregar otro concepto o línea
        </button>

        {/* Resumen de Totales e Impuestos */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Impuesto / IVA:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[0, 19].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => handleTaxRateChange(rate)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    (quote.tax_rate || 0) === rate
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {rate === 0 ? 'Sin IVA (0%)' : `${rate}%`}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtotal:</span>
              <span className="font-semibold">{currency}{formatCurrencyAmount(quote.subtotal, currency)}</span>
            </div>
            {(quote.tax_amount || 0) > 0 && (
              <div className="flex justify-between text-xs text-slate-500">
                <span>IVA ({quote.tax_rate}%):</span>
                <span className="font-semibold">{currency}{formatCurrencyAmount(quote.tax_amount || 0, currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
              <span className="uppercase">Total:</span>
              <span className="text-emerald-600 text-base">{currency}{formatCurrencyAmount(quote.total, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notas / Condiciones de Pago */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Notas, Términos y Condiciones de Pago
        </label>
        <textarea
          rows={3}
          name="notes"
          value={quote.notes}
          onChange={(e) => setQuote((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Ej: Forma de pago, cuenta bancaria, tiempo de entrega o vigencia..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>

      {/* Acciones Finales del Editor */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onNewDocument}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
        >
          Limpiar y Empezar de Nuevo
        </button>

        <div className="w-full sm:w-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onSaveDraft}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
          >
            <Save size={16} />
            Guardar Borrador
          </button>
          <button
            type="button"
            onClick={onGoToPreview}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            <Eye size={16} />
            Previsualizar y Generar PDF
          </button>
        </div>
      </div>
    </div>
  );
};
