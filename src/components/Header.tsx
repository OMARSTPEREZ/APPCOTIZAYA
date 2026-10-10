import React, { useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { FileText, Building2, History, Settings2, Sparkles, Cloud, CloudOff, LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  activeTab: 'editor' | 'preview' | 'business' | 'history' | 'cloud';
  setActiveTab: (tab: 'editor' | 'preview' | 'business' | 'history' | 'cloud') => void;
  isCloudConnected: boolean;
  itemCount: number;
  user: SupabaseUser | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isCloudConnected,
  itemCount,
  user,
  onOpenAuthModal,
  onSignOut,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario';
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand */}
          <div 
            onClick={() => setActiveTab('editor')}
            className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  Cotiza<span className="text-emerald-600">Rápido</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Free $0
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">
                Cotizaciones y Cuentas de Cobro en PDF
              </p>
            </div>
          </div>

          {/* Navigation Tabs Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'editor'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText size={15} />
              Editor {itemCount > 0 && <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center">{itemCount}</span>}
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'preview'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>👁️</span> Vista Previa & PDF
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'business'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 size={15} />
              Mi Negocio
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History size={15} />
              Historial
            </button>
          </nav>

          {/* Right Actions: Google Auth & Cloud Status */}
          <div className="flex items-center gap-2">
            {/* Google Login / User Profile */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition text-left"
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-7 h-7 rounded-full object-cover border border-emerald-500 shadow-xs"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[110px] leading-tight">
                      {userName}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-semibold leading-tight">
                      Google Conectado
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveTab('business');
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Building2 size={14} className="text-slate-500" />
                      Perfil de Negocio
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onSignOut();
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-[11px] sm:text-xs border border-slate-300 shadow-xs hover:border-slate-400 transition active:scale-95"
                title="Inicia sesión con Google para sincronizar tus cotizaciones en la nube"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden sm:inline">Iniciar con Google</span>
                <span className="sm:hidden">Ingresar</span>
              </button>
            )}

            {/* Cloud Status / Mode Badge */}
            <button
              onClick={() => setActiveTab('cloud')}
              className={`flex items-center gap-1.5 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all ${
                isCloudConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title={isCloudConnected ? 'Conectado a Supabase' : 'Modo Invitado / Local (Sin servidor)'}
            >
              {isCloudConnected ? <Cloud size={14} className="text-emerald-600" /> : <CloudOff size={14} className="text-slate-400" />}
              <span className="hidden lg:inline">{isCloudConnected ? 'Nube Activa' : 'Modo Invitado'}</span>
              <Settings2 size={12} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-1.5 bg-white">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold rounded-lg ${
            activeTab === 'editor' ? 'text-emerald-700' : 'text-slate-500'
          }`}
        >
          <FileText size={16} />
          <span>Editor</span>
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold rounded-lg ${
            activeTab === 'preview' ? 'text-emerald-700' : 'text-slate-500'
          }`}
        >
          <span className="text-sm leading-none">👁️</span>
          <span>PDF</span>
        </button>
        <button
          onClick={() => setActiveTab('business')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold rounded-lg ${
            activeTab === 'business' ? 'text-emerald-700' : 'text-slate-500'
          }`}
        >
          <Building2 size={16} />
          <span>Negocio</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold rounded-lg ${
            activeTab === 'history' ? 'text-emerald-700' : 'text-slate-500'
          }`}
        >
          <History size={16} />
          <span>Historial</span>
        </button>
        {!user && (
          <button
            onClick={onOpenAuthModal}
            className="flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold rounded-lg text-indigo-600"
          >
            <UserIcon size={16} />
            <span>Google</span>
          </button>
        )}
      </div>
    </header>
  );
};
