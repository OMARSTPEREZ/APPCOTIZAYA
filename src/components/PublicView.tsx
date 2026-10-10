import { useState, useEffect } from 'react';
import type { QuoteDocument, BusinessProfile } from '../types';

interface PublicViewProps {
  token: string;
}

// Componente de vista pública para el cliente final
export function PublicView({ token }: PublicViewProps) {
  const [quote, setQuote] = useState<QuoteDocument | null>(null);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [status, setStatus] = useState<'loading' | 'found' | 'not_found' | 'accepted' | 'error'>('loading');
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    loadPublicQuote();
  }, [token]);

  const loadPublicQuote = async () => {
    try {
      // Intentar cargar desde Supabase por public_token
      const supabaseUrl = localStorage.getItem('supabase_url');
      const supabaseKey = localStorage.getItem('supabase_anon_key');

      if (supabaseUrl && supabaseKey) {
        const res = await fetch(
          `${supabaseUrl}/rest/v1/quotes?public_token=eq.${token}&select=*`,
          { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
        );
        const data = await res.json();
        if (data && data.length > 0) {
          setQuote(data[0] as QuoteDocument);
          // Cargar perfil del negocio
          const profRes = await fetch(
            `${supabaseUrl}/rest/v1/profiles?id=eq.${data[0].user_id}&select=*`,
            { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
          );
          const profData = await profRes.json();
          if (profData && profData.length > 0) setProfile(profData[0]);
          setStatus('found');
          return;
        }
      }
      setStatus('not_found');
    } catch {
      setStatus('error');
    }
  };

  const handleAccept = async () => {
    if (!quote || accepting) return;
    setAccepting(true);
    try {
      const supabaseUrl = localStorage.getItem('supabase_url');
      const supabaseKey = localStorage.getItem('supabase_anon_key');
      if (supabaseUrl && supabaseKey) {
        await fetch(
          `${supabaseUrl}/rest/v1/quotes?public_token=eq.${token}`,
          {
            method: 'PATCH',
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'accepted' }),
          }
        );
      }
      setStatus('accepted');
    } catch {
      alert('Error al aceptar. Intenta nuevamente.');
    } finally {
      setAccepting(false);
    }
  };

  const formatCurrency = (amount: number, symbol: string = '$') => {
    return `${symbol} ${amount.toLocaleString('es-CO', { minimumFractionDigits: 0 })}`;
  };

  // ── Estados de carga ──────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Cargando tu cotización...</p>
        </div>
      </div>
    );
  }

  if (status === 'not_found' || status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Documento no encontrado</h1>
          <p className="text-slate-500 text-sm">
            El enlace puede haber expirado o no existe. Solicita un nuevo enlace al emisor.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'accepted') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-7xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">¡Cotización Aceptada!</h1>
          <p className="text-slate-600 text-sm mb-6">
            Has confirmado la cotización #{quote?.quote_number}. El proveedor recibirá una notificación y se pondrá en contacto contigo pronto.
          </p>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
            <p className="text-xs text-slate-500 font-medium">Número de referencia</p>
            <p className="text-xl font-bold text-green-600">#{quote?.quote_number}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) return null;

  const isInvoice = quote.document_type === 'cuenta_cobro';
  const currencySymbol = profile?.currency_symbol || '$';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header público */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {profile?.logo_url && (
              <img src={profile.logo_url} alt="Logo" className="w-9 h-9 rounded-lg object-contain" />
            )}
            <div>
              <p className="text-xs text-slate-400 font-medium">Documento de</p>
              <p className="text-sm font-bold text-slate-800">{profile?.business_name || 'Negocio'}</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
            isInvoice
              ? 'bg-orange-100 text-orange-700'
              : 'bg-indigo-100 text-indigo-700'
          }`}>
            {isInvoice ? '💰 Cuenta de Cobro' : '📋 Cotización'}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4 pb-32">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Banner */}
          <div className={`px-5 py-4 ${isInvoice ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600'}`}>
            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
              {isInvoice ? 'Cuenta de Cobro' : 'Cotización'}
            </p>
            <h1 className="text-white text-2xl font-bold">#{quote.quote_number}</h1>
            <p className="text-white/70 text-xs mt-1">Emitida el {new Date(quote.issue_date).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          {/* Datos del cliente */}
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Para</p>
            <p className="font-bold text-slate-800 text-lg">{quote.client_name}</p>
            {quote.client_email && <p className="text-sm text-slate-500">{quote.client_email}</p>}
            {quote.client_phone && <p className="text-sm text-slate-500">{quote.client_phone_code} {quote.client_phone}</p>}
          </div>

          {/* Ítems */}
          <div className="px-5 py-4">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Detalle de servicios</p>
            <div className="space-y-3">
              {quote.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 leading-tight">{item.desc}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.qty} {item.qty === 1 ? 'unidad' : 'unidades'}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-800 whitespace-nowrap">
                    {formatCurrency(item.qty * item.price, currencySymbol)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totales */}
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>{formatCurrency(quote.subtotal, currencySymbol)}</span>
            </div>
            {(quote.tax_amount ?? 0) > 0 && (
              <div className="flex justify-between text-sm text-slate-500">
                <span>IVA ({quote.tax_rate}%)</span>
                <span>{formatCurrency(quote.tax_amount ?? 0, currencySymbol)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-800">TOTAL</span>
              <span className={`text-xl font-black ${isInvoice ? 'text-orange-600' : 'text-indigo-600'}`}>
                {formatCurrency(quote.total, currencySymbol)}
              </span>
            </div>
          </div>

          {/* Notas */}
          {quote.notes && (
            <div className="px-5 py-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Condiciones</p>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{quote.notes}</p>
            </div>
          )}

          {/* Datos bancarios para cuentas de cobro */}
          {isInvoice && profile?.bank_details && (
            <div className="px-5 py-4 bg-amber-50 border-t border-amber-100">
              <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-2">💳 Datos de pago</p>
              <p className="text-sm text-amber-800 leading-relaxed whitespace-pre-line">{profile.bank_details}</p>
            </div>
          )}
        </div>

        {/* Info del emisor */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Emitida por</p>
          <div className="flex items-center gap-3">
            {profile?.logo_url ? (
              <img src={profile.logo_url} alt="Logo" className="w-12 h-12 rounded-xl object-contain border border-slate-100" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl">🏢</div>
            )}
            <div>
              <p className="font-bold text-slate-800">{profile?.business_name}</p>
              {profile?.owner_name && <p className="text-sm text-slate-500">{profile.owner_name}</p>}
              {profile?.phone && <p className="text-xs text-slate-400">{profile.phone}</p>}
            </div>
          </div>
        </div>
      </main>

      {/* Botón flotante de aceptación */}
      {!isInvoice && (
        <div className="fixed bottom-0 inset-x-0 p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200 safe-area-inset-bottom">
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-green-200 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {accepting ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Confirmando...
              </>
            ) : (
              <>
                <span className="text-xl">✅</span>
                Aceptar Cotización
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-2">
            Al aceptar, confirmas tu intención de contratar los servicios detallados.
          </p>
        </div>
      )}

      {isInvoice && (
        <div className="fixed bottom-0 inset-x-0 p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200">
          <a
            href={`https://wa.me/${profile?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola! Vi la cuenta de cobro #${quote.quote_number} por ${formatCurrency(quote.total, currencySymbol)}. Procedo con el pago.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg"
          >
            <span className="text-xl">💬</span>
            Confirmar pago por WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

export default PublicView;
