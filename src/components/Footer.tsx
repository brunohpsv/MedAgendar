import React from 'react';
import { LogoIcon } from './LogoIcon';

export const Footer = () => (
  <footer className="bg-white text-slate-900 pt-24 pb-12 mt-20 overflow-hidden relative border-t border-slate-200">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>
    <div className="lg:max-w-none mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
        <div className="md:col-span-5 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center transition-transform hover:scale-110"><LogoIcon /></div>
            <span className="text-2xl font-black uppercase tracking-tighter">Med<span className="text-red-600 italic">Agendar</span></span>
          </div>
          <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">O MedAgendar é a plataforma inovadora de agendamento de consultas médicas em tempo real, conectando pacientes, médicos e clínicas de forma rápida, simples e segura.</p>
        </div>
      </div>
      <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
        <p>© 2026 MEDAGENDAR HEALTHCARE SOLUTIONS LTDA.</p>
        <p>Feito com <i className="fas fa-heart text-red-600 mx-1"></i> no Brasil</p>
      </div>
    </div>
  </footer>
);
