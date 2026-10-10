import type { BusinessProfile, QuoteDocument } from '../types';
import { detectRegionalCurrency } from './currencyService';

const PROFILE_KEY = 'cotizarapido_business_profile';
const DRAFT_KEY = 'cotizarapido_active_draft';
const HISTORY_KEY = 'cotizarapido_quote_history';

export const getDefaultProfile = (): BusinessProfile => {
  const detectedCurrency = detectRegionalCurrency();
  return {
    business_name: 'Soluciones & Servicios Pro',
    owner_name: 'Juan Pérez',
    phone: '3001234567',
    email: 'contacto@minegocio.com',
    document_id: 'NIT 900.123.456-7',
    logo_url: '',
    currency_symbol: detectedCurrency.symbol,
    bank_details: 'Bancolombia Ahorros # 123-456789-01 a nombre de Juan Pérez',
    default_terms: '• Validez de esta cotización: 15 días calendario.\n• Forma de pago: 50% anticipo, 50% contra entrega.',
  };
};

export const defaultProfile: BusinessProfile = getDefaultProfile();

export const loadProfile = (): BusinessProfile => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return getDefaultProfile();
    return { ...getDefaultProfile(), ...JSON.parse(raw) };
  } catch {
    return getDefaultProfile();
  }
};

export const saveProfile = (profile: BusinessProfile) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error guardando perfil en localStorage:', e);
  }
};

export const loadDraft = (): QuoteDocument | null => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveDraft = (quote: QuoteDocument) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(quote));
  } catch (e) {
    console.error('Error guardando borrador en localStorage:', e);
  }
};

export const clearDraft = () => {
  localStorage.removeItem(DRAFT_KEY);
};

export const loadHistory = (): QuoteDocument[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveToHistory = (quote: QuoteDocument): QuoteDocument[] => {
  try {
    const history = loadHistory();
    const existingIndex = history.findIndex((q) => q.id === quote.id);
    let updated: QuoteDocument[];
    if (existingIndex >= 0) {
      updated = [...history];
      updated[existingIndex] = quote;
    } else {
      updated = [quote, ...history];
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error guardando en historial:', e);
    return [];
  }
};

export const deleteFromHistory = (id: string): QuoteDocument[] => {
  try {
    const history = loadHistory();
    const updated = history.filter((q) => q.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};
