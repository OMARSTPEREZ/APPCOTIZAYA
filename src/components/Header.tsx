import React from 'react';
import { FileText, Building2, History, Settings2, Sparkles, Cloud, CloudOff } from 'lucide-react';

interface HeaderProps {
  activeTab: 'editor' | 'preview' | 'business' | 'history' | 'cloud';
  setActiveTab: (tab: 'editor' | 'preview' | 'business' | 'history' | 'cloud') => void;
  isCloudConnected: boolean;
  itemCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isCloudConnected,
  itemCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div 
            onClick={() => setActiveTab('editor')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Cotiza<span className="text-emerald-600">Rápido</span></span>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Free $0</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Cotizaciones y Cuentas de Cobro en PDF</p>
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

          {/* Cloud Status / Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('cloud')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                isCloudConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title={isCloudConnected ? 'Conectado a Supabase' : 'Modo local (Sin costos de servidor)'}
            >
              {isCloudConnected ? <Cloud size={14} className="text-emerald-600" /> : <CloudOff size={14} className="text-slate-400" />}
              <span className="hidden sm:inline">{isCloudConnected ? 'Nube Activa' : 'Modo Offline'}</span>
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
      </div>
    </header>
  );
};
