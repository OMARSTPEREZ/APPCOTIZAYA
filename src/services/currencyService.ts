export interface CurrencyInfo {
  code: string;
  symbol: string;
  label: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'COP', symbol: 'COP $', label: 'COP $ (Colombia)', locale: 'es-CO' },
  { code: 'USD', symbol: 'USD $', label: 'USD $ (Dólar EE.UU. / Int)', locale: 'en-US' },
  { code: 'MXN', symbol: 'MXN $', label: 'MXN $ (México)', locale: 'es-MX' },
  { code: 'EUR', symbol: '€', label: '€ (Euro - España/Europa)', locale: 'es-ES' },
  { code: 'PEN', symbol: 'S/', label: 'S/ (Perú)', locale: 'es-PE' },
  { code: 'CLP', symbol: 'CLP $', label: 'CLP $ (Chile)', locale: 'es-CL' },
  { code: 'ARS', symbol: 'ARS $', label: 'ARS $ (Argentina)', locale: 'es-AR' },
  { code: 'GEN', symbol: '$', label: '$ (Genérico)', locale: 'es-CO' },
];

/**
 * Detecta automáticamente la moneda y región según el navegador y zona horaria
 */
export const detectRegionalCurrency = (): CurrencyInfo => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const lang = (navigator.language || '').toLowerCase();

    if (tz.includes('Bogota') || lang.includes('es-co')) {
      return SUPPORTED_CURRENCIES[0]; // COP
    }
    if (tz.includes('Mexico') || tz.includes('Cancun') || tz.includes('Monterrey') || lang.includes('es-mx')) {
      return SUPPORTED_CURRENCIES[2]; // MXN
    }
    if (tz.includes('Madrid') || lang.includes('es-es') || tz.includes('Europe/Paris') || tz.includes('Europe/Berlin')) {
      return SUPPORTED_CURRENCIES[3]; // EUR
    }
    if (tz.includes('Lima') || lang.includes('es-pe')) {
      return SUPPORTED_CURRENCIES[4]; // PEN
    }
    if (tz.includes('Santiago') || lang.includes('es-cl')) {
      return SUPPORTED_CURRENCIES[5]; // CLP
    }
    if (tz.includes('Buenos_Aires') || lang.includes('es-ar')) {
      return SUPPORTED_CURRENCIES[6]; // ARS
    }
    if (lang.includes('en-us') || tz.includes('America/New_York') || tz.includes('America/Chicago') || tz.includes('America/Los_Angeles') || tz.includes('Panama') || tz.includes('Guayaquil')) {
      return SUPPORTED_CURRENCIES[1]; // USD
    }
  } catch (e) {
    console.warn('Error detectando moneda regional:', e);
  }

  // Predeterminado si no coincide
  return SUPPORTED_CURRENCIES[0]; // Default a COP o $
};

/**
 * Formatea un número según la moneda seleccionada
 */
export const formatCurrencyAmount = (amount: number, symbol: string): string => {
  const match = SUPPORTED_CURRENCIES.find((c) => c.symbol === symbol);
  const locale = match ? match.locale : 'es-CO';
  try {
    return Number(amount || 0).toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  } catch {
    return Number(amount || 0).toLocaleString('es-CO');
  }
};
