import { useState, useEffect } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Header } from './components/Header';
import { BusinessProfileModal } from './components/BusinessProfileModal';
import { DocumentEditor } from './components/DocumentEditor';
import { DocumentPreview } from './components/DocumentPreview';
import { DocumentHistory } from './components/DocumentHistory';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { EmptyState } from './components/EmptyState';
import { FreemiumWall } from './components/FreemiumWall';
import { PublicView } from './components/PublicView';
import { AuthModal } from './components/AuthModal';
import type { BusinessProfile, QuoteDocument, QuoteValidationErrors } from './types';
import { validateQuote, canGenerateDocument } from './types';
import {
  loadProfile,
  saveProfile,
  loadDraft,
  saveDraft,
  loadHistory,
  saveToHistory,
  deleteFromHistory
} from './services/storageService';
import { 
  getSupabase, 
  saveProfileToSupabase, 
  saveQuoteToSupabase,
  signInWithGoogle,
  signOut,
  getCurrentUser,
  fetchProfileFromSupabase
} from './services/supabase';
import confetti from 'canvas-confetti';

const createInitialQuote = (profile: BusinessProfile, nextNumber: number = 1): QuoteDocument => {
  const today = new Date().toISOString().split('T')[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15);

  return {
    id: `quote_${Date.now()}`,
    quote_number: String(nextNumber).padStart(3, '0'),
    document_type: 'cotizacion',
    issue_date: today,
    due_date: dueDate.toISOString().split('T')[0],
    client_name: '',
    client_phone: '',
    client_phone_code: '+57',
    client_email: '',
    client_id_number: '',
    items: [
      {
        id: `item_${Date.now()}_1`,
        desc: 'Diseño y desarrollo de solución digital',
        qty: 1,
        price: 350000,
      },
    ],
    notes: profile.default_terms || '• Validez de la cotización: 15 días.\n• Forma de pago: 50% anticipo, 50% contra entrega.',
    tax_rate: 0,
    subtotal: 350000,
    tax_amount: 0,
    total: 350000,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
};

export function App() {
  // ── Routing para vista pública (cliente final) ────────────────────────────
  const urlParams = new URLSearchParams(window.location.search);
  const publicToken = urlParams.get('token');
  if (publicToken) {
    return <PublicView token={publicToken} />;
  }

  // ── Estado principal ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'business' | 'history' | 'cloud'>('editor');
  const [profile, setProfile] = useState<BusinessProfile>(() => loadProfile());
  const [history, setHistory] = useState<QuoteDocument[]>(() => loadHistory());
  const [quote, setQuote] = useState<QuoteDocument>(() => {
    const savedDraft = loadDraft();
    if (savedDraft) return savedDraft;
    return createInitialQuote(loadProfile(), (loadHistory().length || 0) + 1);
  });
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showFreemiumWall, setShowFreemiumWall] = useState(false);
  const [validationErrors, setValidationErrors] = useState<QuoteValidationErrors>({});

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Verificar conexión Supabase y usuario autenticado
  useEffect(() => {
    const client = getSupabase();
    if (!client) return;

    // 0. Probar conexión activa inmediata con Supabase
    const pingSupabase = async () => {
      try {
        const { error } = await client.from('profiles').select('id').limit(1);
        if (!error || error.code === 'PGRST116') {
          setIsCloudConnected(true);
        }
      } catch {
        // Ignorar si no responde
      }
    };
    pingSupabase();

    // 1. Verificar estado de autenticación inicial
    getCurrentUser().then(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsCloudConnected(true);
        const remote = await fetchProfileFromSupabase();
        if (remote) {
          setProfile(remote);
          saveProfile(remote);
        } else {
          saveProfileToSupabase(profile, currentUser.id);
        }
      }
    });

    // 2. Suscribirse a eventos de autenticación en tiempo real
    const { data: authListener } = client.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        setIsCloudConnected(true);
        const remote = await fetchProfileFromSupabase();
        if (remote) {
          setProfile(remote);
          saveProfile(remote);
        } else {
          saveProfileToSupabase(profile, currentUser.id);
        }
        if (event === 'SIGNED_IN') {
          showToast(`👋 ¡Bienvenido, ${currentUser.user_metadata?.full_name || 'Usuario'}!`);
        }
      } else if (event === 'SIGNED_OUT') {
        setIsCloudConnected(false);
        showToast('Sesión cerrada. Modo Invitado activo.');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Registrar Service Worker para PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(() => { /* sw.js es opcional */ });
    }
  }, []);

  // ── Handlers de Autenticación ─────────────────────────────────────────────

  const handleSignInWithGoogle = async () => {
    setIsAuthLoading(true);
    try {
      await signInWithGoogle();
      setShowAuthModal(false);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error al conectar con Google';
      console.warn('Google Auth notice:', errorMsg);
      showToast(`⚠️ ${errorMsg}`, 'error');
      setShowAuthModal(false);
      setActiveTab('cloud');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setIsCloudConnected(false);
    showToast('Sesión cerrada. Continuando en Modo Invitado.');
  };

  // ── Handlers de Documentos ────────────────────────────────────────────────

  const handleSaveProfile = (newProfile: BusinessProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
    if (isCloudConnected && user) {
      saveProfileToSupabase(newProfile, user.id);
    }
    showToast('✅ Configuración de negocio guardada');
  };

  const handleUpdateProfileCurrency = (currencySymbol: string) => {
    const updated = { ...profile, currency_symbol: currencySymbol };
    setProfile(updated);
    saveProfile(updated);
    showToast(`Moneda actualizada a ${currencySymbol}`);
  };

  const handleSaveDraft = () => {
    saveDraft(quote);
    showToast('💾 Borrador guardado localmente');
  };

  const handleNewDocument = () => {
    const nextNumber = history.length + 1;
    const fresh = createInitialQuote(profile, nextNumber);
    setQuote(fresh);
    saveDraft(fresh);
    setValidationErrors({});
    setActiveTab('editor');
    showToast('📄 Nuevo documento en blanco iniciado');
  };

  // Guardar en historial con validación y control de cuota freemium
  const handleSaveToHistory = () => {
    // 1. Validar el documento
    const { isValid, errors } = validateQuote(quote);
    if (!isValid) {
      setValidationErrors(errors);
      const firstError = Object.values(errors)[0];
      showToast(`⚠️ ${firstError}`, 'error');
      return;
    }
    setValidationErrors({});

    // 2. Verificar cuota freemium
    const { allowed, reason } = canGenerateDocument(profile);
    if (!allowed) {
      setShowFreemiumWall(true);
      showToast(`🔒 ${reason}`, 'error');
      return;
    }

    // 3. Incrementar contador mensual local
    const updatedProfile = {
      ...profile,
      monthly_quote_count: (profile.monthly_quote_count || 0) + 1,
    };
    setProfile(updatedProfile);
    saveProfile(updatedProfile);

    // 4. Guardar en historial
    const updatedHistory = saveToHistory(quote);
    setHistory(updatedHistory);

    if (isCloudConnected) {
      saveQuoteToSupabase(quote);
    }

    showToast('✅ Documento guardado en historial');
  };

  // Conversión 1-clic: Cotización → Cuenta de Cobro
  const handleConvertToInvoice = (targetQuote: QuoteDocument) => {
    const today = new Date().toISOString().split('T')[0];
    const newInvoiceNumber = targetQuote.quote_number.toString().startsWith('CC-')
      ? targetQuote.quote_number
      : `CC-${targetQuote.quote_number}`;

    const newInvoice: QuoteDocument = {
      ...targetQuote,
      id: `invoice_${Date.now()}`,
      document_type: 'cuenta_cobro',
      quote_number: newInvoiceNumber,
      issue_date: today,
      status: 'converted',
      notes: profile.bank_details
        ? `Favor consignar a la siguiente cuenta bancaria:\n${profile.bank_details}`
        : targetQuote.notes,
      created_at: new Date().toISOString(),
    };

    setQuote(newInvoice);
    saveDraft(newInvoice);
    const updatedHistory = saveToHistory(newInvoice);
    setHistory(updatedHistory);

    if (isCloudConnected) {
      saveQuoteToSupabase(newInvoice);
    }

    setActiveTab('preview');
    showToast(`⚡ ¡Cotización #${targetQuote.quote_number} convertida a Cuenta de Cobro!`);

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch { /* ignorar */ }
  };

  const handleLoadQuote = (loadedQuote: QuoteDocument) => {
    setQuote(loadedQuote);
    saveDraft(loadedQuote);
    setValidationErrors({});
    setActiveTab('preview');
    showToast(`Abierto documento #${loadedQuote.quote_number}`);
  };

  const handleDeleteQuote = (id: string) => {
    const updated = deleteFromHistory(id);
    setHistory(updated);
    showToast('Documento eliminado del historial');
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCloudConnected={isCloudConnected}
        itemCount={quote.items.length}
        user={user}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-20 left-4 right-4 z-50 text-white text-sm font-bold px-4 py-3 rounded-2xl shadow-xl text-center transition-all
            ${toastType === 'error'
              ? 'bg-red-600 border border-red-500'
              : 'bg-slate-900 border border-slate-700'
            }`}
        >
          {toastMessage}
        </div>
      )}

      {/* Modal de Autenticación con Google / Modo Invitado */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignInWithGoogle={handleSignInWithGoogle}
        isConnecting={isAuthLoading}
      />

      {/* Muro de pago Freemium */}
      {showFreemiumWall && (
        <FreemiumWall
          usedCount={profile.monthly_quote_count || 0}
          onUpgrade={() => {
            setShowFreemiumWall(false);
            window.open('https://github.com/OMARSTPEREZ/APPCOTIZAYA#upgrade', '_blank');
          }}
          onClose={() => setShowFreemiumWall(false)}
        />
      )}

      {/* Contenido Principal */}
      <main className="flex-1">
        {activeTab === 'editor' && (
          <DocumentEditor
            quote={quote}
            setQuote={setQuote}
            profile={profile}
            validationErrors={validationErrors}
            onUpdateProfileCurrency={handleUpdateProfileCurrency}
            onGoToPreview={() => setActiveTab('preview')}
            onSaveDraft={handleSaveDraft}
            onNewDocument={handleNewDocument}
            onConvertToInvoice={handleConvertToInvoice}
          />
        )}

        {activeTab === 'preview' && (
          <DocumentPreview
            quote={quote}
            profile={profile}
            onBackToEdit={() => setActiveTab('editor')}
            onSaveToHistory={handleSaveToHistory}
            onConvertToInvoice={handleConvertToInvoice}
          />
        )}

        {activeTab === 'business' && (
          <BusinessProfileModal
            profile={profile}
            onSaveProfile={handleSaveProfile}
            isCloudConnected={isCloudConnected}
          />
        )}

        {activeTab === 'history' && (
          history.length === 0 ? (
            <EmptyState
              type="history"
              onCreateNew={() => {
                handleNewDocument();
                setActiveTab('editor');
              }}
            />
          ) : (
            <DocumentHistory
              history={history}
              profile={profile}
              onLoadQuote={handleLoadQuote}
              onDeleteQuote={handleDeleteQuote}
              onGoToEditor={() => setActiveTab('editor')}
              onConvertToInvoice={handleConvertToInvoice}
            />
          )
        )}

        {activeTab === 'cloud' && (
          <SupabaseConfigModal
            onConnectionChange={(connected) => setIsCloudConnected(connected)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print py-4 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400">
        <p className="font-medium">
          CotizaRápido • {user ? `Conectado como ${user.email}` : 'Modo Invitado (Offline)'} •{' '}
          {profile.subscription_tier === 'pro' ? '⭐ Plan Pro' : `Free: ${profile.monthly_quote_count || 0}/5 docs este mes`}
        </p>
      </footer>
    </div>
  );
}

export default App;
