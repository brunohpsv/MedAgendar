import React from 'react';

export const PartnerSection = () => {
  return (
    <div className="bg-white p-10 text-slate-900 border-b-4 border-red-600 shadow-xl border border-slate-100">
      <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Por que ser <br/><span className="text-red-600">Parceiro?</span></h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-black uppercase text-red-600 tracking-widest mb-2">Quem deve se cadastrar?</h3>
          <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Médicos, dentistas, fisioterapeutas, psicólogos e clínicas que buscam automatizar seus agendamentos e aumentar sua visibilidade digital.</p>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase text-red-600 tracking-widest mb-2">Investimento</h3>
          <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Mensalidade única de <span className="text-slate-900 font-black">R$ 30,00</span>. Sem taxas ocultas por agendamento.</p>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase text-red-600 tracking-widest mb-2">Funcionalidades</h3>
          <ul className="text-slate-500 text-[11px] font-medium space-y-2">
            <li><i className="fas fa-check text-red-600 mr-2"></i> Agenda Inteligente</li>
            <li><i className="fas fa-check text-red-600 mr-2"></i> Painel de Gestão</li>
            <li><i className="fas fa-check text-red-600 mr-2"></i> Telemedicina Integrada</li>
            <li><i className="fas fa-check text-red-600 mr-2"></i> Suporte Prioritário</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
