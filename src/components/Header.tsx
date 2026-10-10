import React, { useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { FileText, Building2, History, Sparkles, LogOut, User as UserIcon, LogIn } from 'lucide-react';

interface HeaderProps {
  activeTab: 'editor' | 'preview' | 'business' | 'history';
  setActiveTab: (tab: 'editor' | 'preview' | 'business' | 'history') => void;
  itemCount: number;
  user: SupabaseUser | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  itemCount,
  user,
  onOpenAuthModal,
  onSignOut,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Mi Cuenta';
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
              <Sparkles size={18} />
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

          {/* Right Actions: User Profile or Sign In */}
          <div className="flex items-center gap-2">
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
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[120px] leading-tight">
                      {userName}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-semibold leading-tight">
                      Sincronizado
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
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg hidden sm:inline">
                  Modo Offline
                </span>
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] sm:text-xs shadow-xs transition active:scale-95"
                >
                  <LogIn size={13} />
                  <span>Iniciar Sesión</span>
                </button>
              </div>
            )}
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
            className="flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold rounded-lg text-slate-800"
          >
            <UserIcon size={16} />
            <span>Cuenta</span>
          </button>
        )}
      </div>
    </header>
  );
};
