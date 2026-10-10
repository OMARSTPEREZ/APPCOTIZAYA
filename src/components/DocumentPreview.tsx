import React, { useState } from 'react';
import type { QuoteDocument, BusinessProfile } from '../types';
import { 
  Download, 
  Printer, 
  ArrowLeft, 
  Share2, 
  CheckCircle2, 
  Loader2,
  Receipt,
  Sparkles
} from 'lucide-react';
import { generatePdfFromElement, triggerPrint } from '../services/pdfService';
import { formatCurrencyAmount } from '../services/currencyService';
import { WhatsAppModal } from './WhatsAppModal';
import confetti from 'canvas-confetti';

interface DocumentPreviewProps {
  quote: QuoteDocument;
  profile: BusinessProfile;
  onBackToEdit: () => void;
  onSaveToHistory: () => void;
  onConvertToInvoice?: (quote: QuoteDocument) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  quote,
  profile,
  onBackToEdit,
  onSaveToHistory,
  onConvertToInvoice,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  const currency = profile.currency_symbol || '$';
  const isQuote = quote.document_type === 'cotizacion';
  const docTitle = isQuote ? 'COTIZACIÓN' : 'CUENTA DE COBRO';

  const handleDownloadPdf = async () => {
    setDownloading(true);
    const fileName = `${docTitle}_${quote.quote_number}_${(quote.client_name || 'cliente').replace(/\s+/g, '_')}.pdf`;
    const success = await generatePdfFromElement('pdf-document-render', fileName);
    setDownloading(false);

    if (success) {
      onSaveToHistory();
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch (e) {
        // Confetti opcional
      }
    }
  };

  const handleOpenWhatsAppModal = () => {
    onSaveToHistory();
    setIsWhatsAppModalOpen(true);
  };

  const handleCopySummary = () => {
    const textSummary = `${docTitle} #${quote.quote_number}\nCliente: ${quote.client_name}\nTotal: ${currency}${formatCurrencyAmount(quote.total, currency)}\nEmitido por: ${profile.business_name}`;
    navigator.clipboard.writeText(textSummary);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Action Bar (No-Print) */}
      <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToEdit}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
        >
          <ArrowLeft size={16} />
          Volver a Editar
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Botón 1-Clic: Convertir Cotización a Cuenta de Cobro */}
          {isQuote && onConvertToInvoice && (
            <button
              type="button"
              onClick={() => onConvertToInvoice(quote)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-extrabold text-xs shadow-xs transition group"
              title="Clona todos los ítems y genera una cuenta de cobro lista para enviar"
            >
              <Receipt size={15} className="group-hover:scale-110 transition-transform" />
              <span>Convertir a Cuenta de Cobro</span>
              <Sparkles size={12} className="text-amber-500" />
            </button>
          )}

          <button
            type="button"
            onClick={triggerPrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
          >
            <Printer size={15} />
            Imprimir
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
          >
            {copySuccess ? <CheckCircle2 size={15} className="text-emerald-600" /> : <Share2 size={15} />}
            {copySuccess ? '¡Copiado!' : 'Copiar Texto'}
          </button>

          {/* Botón Descargar PDF */}
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownloadPdf}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition disabled:opacity-50"
          >
            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {downloading ? 'Generando PDF...' : 'Descargar PDF'}
          </button>

          {/* Botón Destacado: ENVIAR POR WHATSAPP */}
          <button
            type="button"
            onClick={handleOpenWhatsAppModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition cursor-pointer"
          >
            <span className="text-base leading-none">💬</span>
            Enviar por WhatsApp
          </button>
        </div>
      </div>

      {/* DOCUMENT CANVAS / RENDERED TEMPLATE FOR PDF & PRINT */}
      <div className="overflow-x-auto pb-4">
        <div
          id="pdf-document-render"
          className="print-container w-[794px] min-h-[1050px] mx-auto bg-white p-12 rounded-2xl shadow-xl border border-slate-200/90 relative text-slate-800 flex flex-col justify-between"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* Marca de agua sutil de fondo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none text-8xl font-black uppercase rotate-[-25deg]">
            {profile.business_name || docTitle}
          </div>

          <div>
            {/* Header del Documento con Logo y Membrete */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 gap-6">
              <div className="space-y-1.5 max-w-sm">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
                  {profile.business_name}
                </h2>
                <p className="text-sm font-semibold text-slate-700">
                  {profile.owner_name}
                </p>
                {profile.document_id && (
                  <p className="text-xs font-mono text-slate-500">
                    {profile.document_id}
                  </p>
                )}
                <div className="text-xs text-slate-500 space-y-0.5 pt-1">
                  <p>📞 {profile.phone}</p>
                  <p>✉️ {profile.email}</p>
                </div>
              </div>

              <div className="flex flex-col items-end text-right space-y-3">
                {profile.logo_url ? (
                  <img
                    src={profile.logo_url}
                    alt="Logo"
                    className="max-h-20 max-w-[200px] object-contain rounded-lg"
                  />
                ) : (
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 shadow-xs select-none">
                    <div className="w-9 h-9 rounded-lg bg-linear-to-tr from-slate-900 to-slate-700 text-white flex items-center justify-center font-black text-sm tracking-wider shadow-xs">
                      {(profile.business_name || 'CY').charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black text-slate-900 leading-tight tracking-tight uppercase">
                        {profile.business_name || 'CotizaYa!'}
                      </p>
                      <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
                        Documento Oficial
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 text-right">
                  <span className={`text-[10px] font-black uppercase tracking-wider block ${
                    isQuote ? 'text-emerald-700' : 'text-blue-700'
                  }`}>
                    {docTitle}
                  </span>
                  <span className="text-xl font-extrabold text-slate-900">
                    #{quote.quote_number || '001'}
                  </span>
                </div>
              </div>
            </div>

            {/* Fechas y Datos del Cliente */}
            <div className="grid grid-cols-2 gap-8 my-8">
              {/* Cliente */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  {isQuote ? 'Cotización para:' : 'Cobrado a:'}
                </span>
                <p className="font-extrabold text-base text-slate-900">
                  {quote.client_name || 'Nombre del Cliente'}
                </p>
                {quote.client_id_number && (
                  <p className="text-xs font-mono text-slate-500">
                    NIT / CC: {quote.client_id_number}
                  </p>
                )}
                {quote.client_phone && (
                  <p className="text-xs text-slate-600">
                    Tel: {quote.client_phone_code} {quote.client_phone}
                  </p>
                )}
                {quote.client_email && (
                  <p className="text-xs text-slate-600">
                    Email: {quote.client_email}
                  </p>
                )}
              </div>

              {/* Detalles de Emisión y Vigencia */}
              <div className="p-4 rounded-xl border border-slate-200/80 flex flex-col justify-center space-y-2 text-right">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Fecha de Emisión
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    {quote.issue_date || new Date().toISOString().split('T')[0]}
                  </p>
                </div>
                {quote.due_date && (
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Fecha de Vencimiento
                    </span>
                    <p className="text-sm font-bold text-rose-600">
                      {quote.due_date}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tabla de Conceptos / Ítems */}
            <div className="mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-slate-900 text-xs font-black uppercase tracking-wider">
                    <th className="py-3 px-2 w-12 text-center">#</th>
                    <th className="py-3 px-3">Descripción</th>
                    <th className="py-3 px-3 w-20 text-center">Cant.</th>
                    <th className="py-3 px-3 w-32 text-right">Precio Unit.</th>
                    <th className="py-3 px-3 w-36 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs font-medium">
                  {quote.items.map((item, index) => {
                    const itemTotal = Number(item.qty || 0) * Number(item.price || 0);
                    return (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="py-3.5 px-2 text-center text-slate-400 font-mono">
                          {index + 1}
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800">
                          {item.desc || 'Concepto sin descripción'}
                        </td>
                        <td className="py-3.5 px-3 text-center text-slate-700 font-bold">
                          {item.qty}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-slate-600">
                          {currency}{formatCurrencyAmount(item.price, currency)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-black text-slate-900">
                          {currency}{formatCurrencyAmount(itemTotal, currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bloque Inferior: Notas y Totales */}
            <div className="grid grid-cols-12 gap-6 pt-4 border-t-2 border-slate-100">
              {/* Notas y Condiciones */}
              <div className="col-span-7 space-y-3">
                {quote.notes && (
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Términos y Condiciones / Notas
                    </span>
                    <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                      {quote.notes}
                    </p>
                  </div>
                )}

                {profile.bank_details && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                      Instrucciones de Pago / Datos Bancarios
                    </span>
                    <p className="text-xs font-semibold text-slate-700 whitespace-pre-line">
                      {profile.bank_details}
                    </p>
                  </div>
                )}
              </div>

              {/* Totales */}
              <div className="col-span-5 space-y-2 text-right">
                <div className="flex justify-between text-xs text-slate-600 py-1 border-b border-slate-100">
                  <span>Subtotal:</span>
                  <span className="font-bold">{currency}{formatCurrencyAmount(quote.subtotal, currency)}</span>
                </div>
                {(quote.tax_amount || 0) > 0 && (
                  <div className="flex justify-between text-xs text-slate-600 py-1 border-b border-slate-100">
                    <span>IVA ({quote.tax_rate}%):</span>
                    <span className="font-bold">{currency}{formatCurrencyAmount(quote.tax_amount || 0, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-900 py-2.5 px-3 bg-slate-100 rounded-xl">
                  <span className="font-black text-xs uppercase tracking-wider">TOTAL A PAGAR:</span>
                  <span className="text-lg font-black text-emerald-700">
                    {currency}{formatCurrencyAmount(quote.total, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pie de Página y Firma */}
          <div className="pt-16 mt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-400">
            <div>
              <p className="font-bold text-slate-600">{profile.business_name}</p>
              <p>Generado con CotizaRápido • Documento oficial digital</p>
            </div>

            <div className="text-center w-52 space-y-1">
              <div className="border-b border-slate-400 h-8"></div>
              <p className="font-bold text-slate-700">{profile.owner_name}</p>
              <p className="text-[10px] text-slate-400">Firma Autorizada</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de WhatsApp */}
      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        quote={quote}
        profile={profile}
      />
    </div>
  );
};
