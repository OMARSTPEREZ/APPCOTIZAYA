import type { BusinessProfile, QuoteDocument } from '../types';
import { formatCurrencyAmount } from './currencyService';

export type WhatsAppTone = 'formal' | 'amable' | 'directo' | 'cobro';

export interface WhatsAppTemplate {
  id: WhatsAppTone;
  name: string;
  icon: string;
  description: string;
}

export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'formal',
    name: 'Formal / Corporativo',
    icon: '💼',
    description: 'Ideal para empresas, licitaciones y clientes corporativos.',
  },
  {
    id: 'amable',
    name: 'Cercano & Amable',
    icon: '🤝',
    description: 'Tono amigable y cordial, ideal para clientes frecuentes.',
  },
  {
    id: 'directo',
    name: 'Rápido & Concreto',
    icon: '⚡',
    description: 'Resumen al grano con monto total y conceptos.',
  },
  {
    id: 'cobro',
    name: 'Cobro / Datos Bancarios',
    icon: '💸',
    description: 'Enfocado en instrucciones de pago y confirmación de transferencia.',
  },
];

/**
 * Genera el texto profesional para WhatsApp según la plantilla seleccionada
 */
export const generateWhatsAppMessage = (
  quote: QuoteDocument,
  profile: BusinessProfile,
  tone: WhatsAppTone = 'formal'
): string => {
  const isQuote = quote.document_type === 'cotizacion';
  const docTypeName = isQuote ? 'Cotización' : 'Cuenta de Cobro';
  const currency = profile.currency_symbol || '$';
  const formattedTotal = formatCurrencyAmount(quote.total, currency);
  const clientName = quote.client_name ? quote.client_name.trim() : 'Estimado(a) Cliente';

  const itemsList = quote.items
    .map((item) => `• *${item.desc || 'Servicio'}* (Cant: ${item.qty}) -> ${currency}${formatCurrencyAmount(item.price * item.qty, currency)}`)
    .join('\n');

  switch (tone) {
    case 'amable':
      return (
        `¡Hola *${clientName}*! 👋 Espero que estés muy bien.\n\n` +
        `Te comparto la *${docTypeName} #${quote.quote_number}* que conversamos para tu revisión:\n\n` +
        `📋 *Detalle de la propuesta:*\n${itemsList}\n\n` +
        `💰 *Valor Total:* ${currency}${formattedTotal}\n` +
        (quote.due_date ? `📅 *Válida hasta:* ${quote.due_date}\n` : '') +
        (profile.bank_details ? `\n🏦 *Datos para pago:*\n${profile.bank_details}\n` : '') +
        `\nCualquier duda que tengas, escríbeme con total tranquilidad. ¡Quedo muy atento!\n\n` +
        `Un cordial saludo,\n*${profile.owner_name}*\n${profile.business_name}`
      );

    case 'directo':
      return (
        `Hola *${clientName}*, adjunto el detalle de la *${docTypeName} #${quote.quote_number}* emitida por *${profile.business_name}*.\n\n` +
        `📋 *Conceptos:*\n${itemsList}\n\n` +
        `💰 *Total:* ${currency}${formattedTotal}\n` +
        (quote.due_date ? `📅 *Fecha límite:* ${quote.due_date}\n` : '') +
        (profile.bank_details ? `🏦 *Pago:* ${profile.bank_details}\n` : '') +
        `\n¡Gracias por tu confianza!`
      );

    case 'cobro':
      return (
        `Hola *${clientName}*, un gusto saludarte.\n\n` +
        `Te hago entrega formal de la *${docTypeName} #${quote.quote_number}* correspondiente a los servicios prestados por *${profile.business_name}*:\n\n` +
        `📋 *Servicios completados:*\n${itemsList}\n\n` +
        `💵 *Monto Total a Transferir:* ${currency}${formattedTotal}\n` +
        (profile.bank_details ? `\n🏦 *Instrucciones de Pago:*\n${profile.bank_details}\n` : '') +
        `\nAgradecemos enviarnos el comprobante de transferencia una vez efectuado el pago. ¡Muchas gracias!\n\n` +
        `Atentamente,\n*${profile.owner_name}*\n${profile.phone}`
      );

    case 'formal':
    default:
      return (
        `Estimado(a) *${clientName}*,\n\n` +
        `Reciba un cordial saludo. Por medio de la presente, adjuntamos la *${docTypeName} N° ${quote.quote_number}* expedida por *${profile.business_name}*.\n\n` +
        `📋 *Resumen de la propuesta:*\n${itemsList}\n\n` +
        `💰 *Valor Total:* ${currency}${formattedTotal}\n` +
        (quote.due_date ? `📅 *Fecha de Vencimiento:* ${quote.due_date}\n` : '') +
        (profile.bank_details ? `\n🏦 *Datos para consignación bancaria:*\n${profile.bank_details}\n` : '') +
        `\nQuedamos a su completa disposición para resolver cualquier inquietud técnica o comercial.\n\n` +
        `Atentamente,\n*${profile.owner_name}*\n${profile.business_name}\n📞 ${profile.phone}`
      );
  }
};

/**
 * Construye la URL final de WhatsApp
 */
export const buildWhatsAppUrlWithCustomText = (
  phone: string,
  phoneCode: string,
  message: string
): string => {
  const cleanPhone = (phone || '').replace(/\D/g, '');
  const cleanCode = (phoneCode || '+57').replace(/\D/g, '');
  const fullPhone = `${cleanCode}${cleanPhone}`;

  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${fullPhone}?text=${encodedText}`;
};
