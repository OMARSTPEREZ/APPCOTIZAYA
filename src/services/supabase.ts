import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { BusinessProfile, QuoteDocument } from '../types';

// Configuración directa de Supabase para CotizaRápido
const DEFAULT_SUPABASE_URL = 'https://rnznvwniwcvljxdjpzib.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_ETHSJ80C_pX5HmS77fKwAQ_92ZF65aX';

// Leer de variables de entorno o de configuración guardada en LocalStorage
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
  const customUrl = localStorage.getItem('cotizarapido_sb_url') || '';
  const customKey = localStorage.getItem('cotizarapido_sb_key') || '';

  return {
    url: customUrl || envUrl,
    key: customKey || envKey,
  };
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (e) {
      console.warn('Error inicializando Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
};

export const resetSupabaseClient = () => {
  supabaseInstance = null;
};

// ==========================================
// AUTENTICACIÓN
// ==========================================

export const getCurrentUser = async (): Promise<User | null> => {
  const client = getSupabase();
  if (!client) return null;
  try {
    const { data } = await client.auth.getUser();
    return data.user || null;
  } catch {
    return null;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase no está configurado');
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase no está configurado');
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

export const signInWithGoogle = async () => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase no está configurado. Ve a Configuración de Nube.');
  const redirectTo = window.location.origin;
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const client = getSupabase();
  if (!client) return;
  await client.auth.signOut();
};

// ==========================================
// STORAGE: SUBIDA DE LOGO
// ==========================================

export const uploadLogoToSupabase = async (file: File): Promise<string | null> => {
  const client = getSupabase();
  if (!client) return null;

  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `logo_${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await client.storage
      .from('logos')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Error subiendo logo a Supabase:', uploadError);
      return null;
    }

    const { data } = client.storage.from('logos').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Excepción en uploadLogoToSupabase:', error);
    return null;
  }
};

// ==========================================
// PERFIL (PROFILES)
// ==========================================

export const fetchProfileFromSupabase = async (): Promise<BusinessProfile | null> => {
  const client = getSupabase();
  if (!client) return null;

  try {
    const user = (await client.auth.getUser()).data.user;
    if (!user) return null;

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      business_name: data.business_name || '',
      owner_name: data.owner_name || '',
      phone: data.phone || '',
      email: data.email || '',
      document_id: data.document_id || '',
      logo_url: data.logo_url || '',
      currency_symbol: data.currency_symbol || '$',
      bank_details: data.bank_details || '',
      default_terms: data.default_terms || '',
    };
  } catch (err) {
    console.warn('No se pudo obtener el perfil de Supabase:', err);
    return null;
  }
};

export const saveProfileToSupabase = async (profile: BusinessProfile, userId?: string) => {
  const client = getSupabase();
  if (!client) return null;

  try {
    const targetUserId = userId || (await client.auth.getUser()).data.user?.id;
    if (!targetUserId) return null;

    const payload = {
      id: targetUserId,
      business_name: profile.business_name,
      owner_name: profile.owner_name,
      phone: profile.phone,
      email: profile.email,
      document_id: profile.document_id,
      logo_url: profile.logo_url,
      currency_symbol: profile.currency_symbol,
      bank_details: profile.bank_details,
      default_terms: profile.default_terms,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from('profiles')
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error guardando perfil en Supabase:', err);
    return null;
  }
};

// ==========================================
// COTIZACIONES Y CUENTAS DE COBRO (QUOTES)
// ==========================================

export const fetchQuotesFromSupabase = async (): Promise<QuoteDocument[]> => {
  const client = getSupabase();
  if (!client) return [];

  try {
    const user = (await client.auth.getUser()).data.user;
    const query = client.from('quotes').select('*').order('created_at', { ascending: false });
    
    // Si hay usuario autenticado, filtra por su ID
    if (user) {
      query.eq('user_id', user.id);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id,
      quote_number: item.quote_number,
      document_type: item.document_type || 'cotizacion',
      issue_date: item.issue_date || new Date().toISOString().split('T')[0],
      due_date: item.due_date,
      client_name: item.client_name || '',
      client_phone: item.client_phone || '',
      client_phone_code: item.client_phone?.startsWith('+') ? item.client_phone.split(' ')[0] : '+57',
      client_email: item.client_email || '',
      client_id_number: item.client_id_number || '',
      items: Array.isArray(item.items) ? item.items : [],
      notes: item.notes || '',
      tax_rate: Number(item.tax_rate) || 0,
      subtotal: Number(item.subtotal) || 0,
      tax_amount: Number(item.tax_amount) || 0,
      total: Number(item.total) || 0,
      created_at: item.created_at,
      synced_to_supabase: true,
    }));
  } catch (err) {
    console.warn('Error trayendo cotizaciones de Supabase:', err);
    return [];
  }
};

export const saveQuoteToSupabase = async (quote: QuoteDocument, userId?: string) => {
  const client = getSupabase();
  if (!client) return null;

  try {
    const targetUserId = userId || (await client.auth.getUser()).data.user?.id || null;

    const payload: any = {
      document_type: quote.document_type,
      issue_date: quote.issue_date,
      due_date: quote.due_date,
      client_name: quote.client_name,
      client_phone: `${quote.client_phone_code || ''} ${quote.client_phone}`.trim(),
      client_email: quote.client_email,
      client_id_number: quote.client_id_number,
      items: quote.items,
      notes: quote.notes,
      tax_rate: quote.tax_rate || 0,
      subtotal: quote.subtotal,
      tax_amount: quote.tax_amount || 0,
      total: quote.total,
    };

    if (targetUserId) {
      payload.user_id = targetUserId;
    }

    const { data, error } = await client
      .from('quotes')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error guardando cotización en Supabase:', err);
    return null;
  }
};
