export interface CurrencyInfo {
  code: string;
  symbol: string;
  label: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'COP', symbol: '$ ', label: 'Pesos Colombianos ($ COP)', locale: 'es-CO' },
  { code: 'USD', symbol: 'USD $ ', label: 'USD $ (Dólar EE.UU. / Int)', locale: 'en-US' },
  { code: 'MXN', symbol: 'MXN $ ', label: 'MXN $ (México)', locale: 'es-MX' },
  { code: 'EUR', symbol: '€ ', label: '€ (Euro - España/Europa)', locale: 'es-ES' },
  { code: 'PEN', symbol: 'S/ ', label: 'S/ (Perú)', locale: 'es-PE' },
  { code: 'CLP', symbol: 'CLP $ ', label: 'CLP $ (Chile)', locale: 'es-CL' },
  { code: 'ARS', symbol: 'ARS $ ', label: 'ARS $ (Argentina)', locale: 'es-AR' },
  { code: 'GEN', symbol: '$ ', label: '$ (Genérico)', locale: 'es-CO' },
];

/**
 * Detecta automáticamente la moneda y región según el navegador y zona horaria (Default: COP Pesos Colombianos)
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

  // Predeterminado: Pesos Colombianos ($ COP)
  return SUPPORTED_CURRENCIES[0];
};

/**
 * Formatea un número según la moneda seleccionada (por defecto en pesos con separadores de miles ej. $ 150.000)
 */
export const formatCurrencyAmount = (amount: number, symbol?: string): string => {
  const match = SUPPORTED_CURRENCIES.find((c) => c.symbol.trim() === (symbol || '').trim() || c.code === symbol);
  const locale = match ? match.locale : 'es-CO';
  try {
    const num = Math.round(Number(amount || 0));
    return num.toLocaleString(locale);
  } catch {
    return Number(amount || 0).toLocaleString('es-CO');
  }
};
