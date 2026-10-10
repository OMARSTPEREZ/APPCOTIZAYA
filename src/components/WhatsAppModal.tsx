import React, { useState } from 'react';
import type { QuoteDocument, BusinessProfile } from '../types';
import { 
  WHATSAPP_TEMPLATES, 
  generateWhatsAppMessage, 
  buildWhatsAppUrlWithCustomText,
  type WhatsAppTone
} from '../services/whatsappService';
import { X, Send, Copy, Check, Sparkles, MessageSquare } from 'lucide-react';

interface WhatsAppModalProps {
  quote: QuoteDocument;
  profile: BusinessProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  quote,
  profile,
  isOpen,
  onClose,
}) => {
  const [selectedTone, setSelectedTone] = useState<WhatsAppTone>(
    quote.document_type === 'cuenta_cobro' ? 'cobro' : 'formal'
  );
  const [customMessage, setCustomMessage] = useState<string>(() =>
    generateWhatsAppMessage(quote, profile, quote.document_type === 'cuenta_cobro' ? 'cobro' : 'formal')
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSelectTone = (tone: WhatsAppTone) => {
    setSelectedTone(tone);
    const msg = generateWhatsAppMessage(quote, profile, tone);
    setCustomMessage(msg);
  };

  const handleSend = () => {
    const url = buildWhatsAppUrlWithCustomText(
      quote.client_phone,
      quote.client_phone_code || '+57',
      customMessage
    );
    window.open(url, '_blank');
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                Auto-Mensaje para WhatsApp
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Inteligente
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Cliente: <strong className="text-slate-800">{quote.client_name || 'Sin nombre'}</strong> ({quote.client_phone_code} {quote.client_phone || 'Sin teléfono'})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selector de Tonos / Plantillas */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
            <Sparkles size={12} className="text-emerald-600" />
            Selecciona el tono del mensaje:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {WHATSAPP_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTone === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleSelectTone(tmpl.id)}
                  className={`p-2.5 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <span>{tmpl.icon}</span>
                    <span>{tmpl.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                    {tmpl.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor de Texto Editable */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Vista previa del mensaje (puedes editarlo):
            </label>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11px] font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1"
            >
              {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              {copied ? '¡Copiado!' : 'Copiar Texto'}
            </button>
          </div>
          <textarea
            rows={7}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs font-sans text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/30"
          />
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSend}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition cursor-pointer"
          >
            <Send size={15} />
            Abrir Chat en WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
