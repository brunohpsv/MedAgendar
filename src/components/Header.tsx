import React, { useState } from 'react';
import { LogoIcon } from './LogoIcon';

export const Header = ({ currentView, setView }: { currentView: string; setView: (view: string) => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleNav = (view: string) => { setView(view); setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const menuLinks = [
    { id: 'home', label: 'BUSCAS', icon: 'fa-search' },
    { id: 'consult_appointments', label: 'MEUS AGENDAMENTOS', icon: 'fa-calendar-check' },
    { id: 'professional_signup', label: 'SEJA PARCEIRO', icon: 'fa-user-md' },
    { id: 'professional_dashboard', label: 'PAINEL PROFISSIONAL', icon: 'fa-chart-line' },
    { id: 'admin_dashboard', label: 'ADMIN', icon: 'fa-lock' }
  ];

  return (
    <header className="bg-white border-b-2 border-red-600 sticky top-0 z-[100] shadow-2xl">
      <div className="lg:max-w-none mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        <div onClick={() => handleNav('home')} className="flex items-center gap-4 cursor-pointer group">
          <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110"><LogoIcon /></div>
          <div className="flex flex-col">
            <span className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-none">Med<span className="text-red-600 italic">Agendar</span></span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Sync</span>
            </div>
          </div>
        </div>
        <nav className="hidden lg:flex items-center gap-2">
          {menuLinks.map((link) => (
            <button key={link.id} onClick={() => handleNav(link.id)} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${currentView === link.id ? "text-red-600 border-red-600" : "text-slate-400 border-transparent hover:text-slate-900"}`}>{link.label}</button>
          ))}
        </nav>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden w-12 h-12 flex items-center justify-center text-slate-900 text-xl"><i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i></button>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b-2 border-red-600 p-6 grid grid-cols-1 gap-3 shadow-2xl">
          {menuLinks.map((link) => (
            <button key={link.id} onClick={() => handleNav(link.id)} className={`flex items-center gap-5 px-6 py-5 text-xs font-black uppercase tracking-widest transition-colors border ${currentView === link.id ? "bg-red-600 text-white border-red-600" : "bg-transparent text-slate-400 border-slate-200"}`}><i className={`fas ${link.icon} w-6`}></i>{link.label}</button>
          ))}
        </div>
      )}
    </header>
  );
};
