export type DocumentType = 'cotizacion' | 'cuenta_cobro';
export type DocumentStatus = 'pending' | 'sent' | 'accepted' | 'rejected' | 'converted';
export type SubscriptionTier = 'free' | 'pro';

export const FREE_QUOTA_LIMIT = 3; // documentos/mes plan Free

export interface BusinessProfile {
  id?: string;
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  document_id?: string;       // NIT / RUT / Cédula fiscal
  logo_url: string;            // Base64 o URL remota
  currency_symbol: string;
  bank_details?: string;
  default_terms?: string;
  // Freemium
  subscription_tier?: SubscriptionTier;
  monthly_quote_count?: number;
  quota_reset_date?: string;
}

export interface QuoteItem {
  id: string;
  desc: string;
  qty: number;
  price: number;
}

export interface QuoteDocument {
  id: string;
  quote_number: number | string;
  document_type: DocumentType;
  issue_date: string;
  due_date?: string;
  client_name: string;
  client_phone: string;
  client_phone_code: string;
  client_email: string;
  client_id_number?: string;
  items: QuoteItem[];
  notes: string;
  tax_rate?: number;
  subtotal: number;
  tax_amount?: number;
  total: number;
  status?: DocumentStatus;
  public_token?: string;       // Token único para vista pública del cliente
  created_at: string;
  synced_to_supabase?: boolean;
}

// Errores de validación del formulario
export interface QuoteValidationErrors {
  client_name?: string;
  items?: string;
  total?: string;
}

// Resultado de validación
export interface ValidationResult {
  isValid: boolean;
  errors: QuoteValidationErrors;
}

// Validar cotización antes de generar PDF
export function validateQuote(quote: QuoteDocument): ValidationResult {
  const errors: QuoteValidationErrors = {};

  if (!quote.client_name || quote.client_name.trim().length < 2) {
    errors.client_name = 'El nombre del cliente es obligatorio.';
  }

  if (!quote.items || quote.items.length === 0) {
    errors.items = 'Debes agregar al menos un servicio o producto.';
  } else {
    const hasEmptyItem = quote.items.some(
      (item) => !item.desc.trim() || item.qty <= 0 || item.price <= 0
    );
    if (hasEmptyItem) {
      errors.items = 'Todos los ítems deben tener descripción, cantidad y precio mayor a $0.';
    }
  }

  if (!quote.total || quote.total <= 0) {
    errors.total = 'El total del documento no puede ser $0.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// Verificar si el usuario puede generar más documentos (freemium)
export function canGenerateDocument(profile: BusinessProfile): {
  allowed: boolean;
  reason?: string;
  remaining?: number;
} {
  const tier = profile.subscription_tier || 'free';
  if (tier === 'pro') return { allowed: true };

  const count = profile.monthly_quote_count || 0;
  const remaining = FREE_QUOTA_LIMIT - count;

  if (count >= FREE_QUOTA_LIMIT) {
    return {
      allowed: false,
      reason: `Has alcanzado el límite de ${FREE_QUOTA_LIMIT} documentos mensuales del plan Free. ¡Pasa a Pro para generación ilimitada!`,
      remaining: 0,
    };
  }

  return { allowed: true, remaining };
}
