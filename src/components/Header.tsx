import React, { useState, useRef, useEffect } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  FileText, 
  Building2, 
  History, 
  Sparkles, 
  LogOut, 
  LogIn, 
  Sun, 
  Moon, 
  ChevronDown,
  ShieldCheck,
  Crown
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'editor' | 'preview' | 'business' | 'history';
  setActiveTab: (tab: 'editor' | 'preview' | 'business' | 'history') => void;
  itemCount: number;
  user: SupabaseUser | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  showExtendedTabs?: boolean;
  isWelcomeScreen?: boolean;
  onGoToWelcome?: () => void;
  onOpenFreemiumWall?: () => void;
  subscriptionTier?: 'free' | 'pro';
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  itemCount,
  user,
  onOpenAuthModal,
  onSignOut,
  isDarkMode,
  onToggleDarkMode,
  showExtendedTabs = true,
  isWelcomeScreen = false,
  onGoToWelcome,
  onOpenFreemiumWall,
  subscriptionTier = 'free',
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showUserMenu]);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Mi Perfil';
  const userEmail = user?.email || 'Sin correo asociado';
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs no-print transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand */}
          <div 
            onClick={() => {
              if (isWelcomeScreen && onGoToWelcome) {
                onGoToWelcome();
              } else {
                setActiveTab('editor');
              }
            }}
            className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                  Cotiza<span className="text-emerald-600 dark:text-emerald-400">Ya!</span>
                </span>
                {subscriptionTier === 'pro' ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFreemiumWall?.();
                    }}
                    className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 text-white shadow-xs flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform"
                    title="Plan PRO Activo — Cotizaciones e Impresiones Ilimitadas"
                  >
                    <span>PRO</span>
                    <Crown size={11} className="text-amber-200 fill-amber-200 shrink-0" />
                  </span>
                ) : (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFreemiumWall?.();
                    }}
                    className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
                    title="Plan Free $0 — Haz clic para ver Planes PRO"
                  >
                    Free $0
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Cotizaciones y Cuentas de Cobro en PDF
              </p>
            </div>
          </div>

          {/* Navigation Tabs Desktop (Oculta Mi Negocio e Historial si !showExtendedTabs) */}
          {!isWelcomeScreen && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'editor'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText size={15} />
                Editor {itemCount > 0 && <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center">{itemCount}</span>}
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>👁️</span> Vista Previa & PDF
              </button>
              {showExtendedTabs && (
                <>
                  <button
                    onClick={() => setActiveTab('business')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'business'
                        ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Building2 size={15} />
                    Mi Negocio
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'history'
                        ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <History size={15} />
                    Historial
                  </button>
                </>
              )}
            </nav>
          )}

          {/* Right Header Area: Authenticated User Dropdown or Guest / Sign In */}
          <div className="flex items-center gap-2">
            {/* Botón Ver Planes / Estado PRO */}
            {onOpenFreemiumWall && (
              <button
                type="button"
                onClick={onOpenFreemiumWall}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl font-extrabold text-[11px] sm:text-xs shadow-xs hover:shadow transition active:scale-95 cursor-pointer shrink-0 ${
                  subscriptionTier === 'pro'
                    ? 'bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 text-white'
                    : 'bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white'
                }`}
                title={subscriptionTier === 'pro' ? 'Tu suscripción PRO está Activa' : 'Ver Planes y Precios PRO'}
              >
                <Crown size={14} className="text-amber-200 shrink-0 animate-pulse" />
                <span>{subscriptionTier === 'pro' ? 'PLAN PRO ✨' : 'Ver Planes PRO'}</span>
              </button>
            )}

            {/* Quick Dark Mode button for Guest/Offline users */}
            {!user && (
              <button
                type="button"
                onClick={onToggleDarkMode}
                title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {isDarkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
              </button>
            )}

            {user ? (
              /* MENÚ DE USUARIO REGISTRADO */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-expanded={showUserMenu}
                  aria-label="Menú de perfil"
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 transition text-left cursor-pointer select-none"
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div className="hidden sm:block">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate max-w-[130px] leading-tight">
                      {userName}
                    </p>
                    <div className="flex items-center gap-1 leading-tight">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-[110px]">
                        Conectado
                      </span>
                    </div>
                  </div>

                  <ChevronDown 
                    size={15} 
                    className={`text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* DROPDOWN MENU */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* 1. Información del Perfil */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3 mb-2">
                        {userAvatar ? (
                          <img
                            src={userAvatar}
                            alt={userName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-emerald-600 to-teal-500 text-white font-black text-sm flex items-center justify-center shadow-xs">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <p className="text-xs font-black text-slate-900 dark:text-white truncate leading-tight">
                            {userName}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                            {userEmail}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                        <ShieldCheck size={12} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="truncate">Cuenta protegida y respaldada</span>
                      </div>
                    </div>

                    {/* Accesos rápidos */}
                    <div className="py-1">
                      {onOpenFreemiumWall && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onOpenFreemiumWall();
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/60 flex items-center gap-2.5 transition border-y border-amber-100 dark:border-amber-900/30"
                        >
                          <Crown size={16} className="text-amber-500 shrink-0 animate-bounce" />
                          <div className="flex-1">
                            <p className="leading-tight flex items-center gap-1">
                              <span>Planes & Precios PRO</span>
                              <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full uppercase">Ilimitado</span>
                            </p>
                            <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-normal">
                              Desde $15.000 COP/mes
                            </p>
                          </div>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveTab('business');
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 flex items-center gap-2.5 transition"
                      >
                        <Building2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div className="flex-1">
                          <p className="leading-tight">Mi Negocio & Facturación</p>
                          <p className="text-[10px] text-slate-400 font-normal">Logo, NIT, moneda y bancos</p>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveTab('history');
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 flex items-center gap-2.5 transition"
                      >
                        <History size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div className="flex-1">
                          <p className="leading-tight">Mis Cotizaciones en la Nube</p>
                          <p className="text-[10px] text-slate-400 font-normal">Historial sincronizado</p>
                        </div>
                      </button>
                    </div>

                    {/* 2. Cambiar Apariencia (Modo Oscuro / Claro Switch) */}
                    <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {isDarkMode ? (
                            <Moon size={16} className="text-indigo-400 shrink-0" />
                          ) : (
                            <Sun size={16} className="text-amber-500 shrink-0" />
                          )}
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                              Modo Oscuro
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {isDarkMode ? 'Tema nocturno activo' : 'Tema claro activo'}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Toggle Switch */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isDarkMode}
                          onClick={onToggleDarkMode}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                            isDarkMode ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              isDarkMode ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* 3. Cerrar Sesión (Sign Out) */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onSignOut();
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2.5 transition"
                      >
                        <LogOut size={16} className="shrink-0" />
                        <div className="flex-1">
                          <p className="leading-tight">Cerrar Sesión</p>
                          <p className="text-[10px] text-red-500/80 font-normal">
                            Regresar a pantalla de bienvenida
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ESTADO INVITADO / OFFLINE (Boton Ingresar visible) */
              <div className="flex items-center gap-2">
                {!isWelcomeScreen && (
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg hidden sm:inline">
                    Modo Offline
                  </span>
                )}
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-extrabold text-[11px] sm:text-xs shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <LogIn size={13} />
                  <span>Iniciar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar: Únicamente visible cuando está dentro de la app (no en la pantalla de bienvenida) */}
      {!isWelcomeScreen && (
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 dark:border-slate-800 px-2 py-1.5 bg-white dark:bg-slate-900 transition-colors duration-200">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold rounded-lg transition-colors ${
              activeTab === 'editor' 
                ? 'text-emerald-700 dark:text-emerald-400' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <FileText size={17} />
            <span>Editor</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold rounded-lg transition-colors ${
              activeTab === 'preview' 
                ? 'text-emerald-700 dark:text-emerald-400' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <span className="text-base leading-none">👁️</span>
            <span>PDF</span>
          </button>
          {showExtendedTabs && (
            <>
              <button
                onClick={() => setActiveTab('business')}
                className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold rounded-lg transition-colors ${
                  activeTab === 'business' 
                    ? 'text-emerald-700 dark:text-emerald-400' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Building2 size={17} />
                <span>Negocio</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold rounded-lg transition-colors ${
                  activeTab === 'history' 
                    ? 'text-emerald-700 dark:text-emerald-400' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <History size={17} />
                <span>Historial</span>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
