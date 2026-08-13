import React from 'react';
import { Doctor } from '../types';

export const DoctorCard = ({ doctor, onClick, isActive = false }: { doctor: Doctor; onClick: () => void; isActive?: boolean }) => {
  const displayPrice = doctor.price > 0 ? `R$ ${doctor.price.toFixed(2)}` : "VALOR A CONSULTAR";
  return (
    <div onClick={onClick} className={`group bg-white border transition-all duration-300 cursor-pointer active-scale flex items-center overflow-hidden shadow-sm hover:shadow-md ${isActive ? "border-red-600 ring-2 ring-red-600/10" : "border-slate-200"} p-4 lg:p-5 gap-6 lg:gap-10`}>
      <div className="shrink-0 relative">
        <div className="w-20 h-20 lg:w-24 lg:h-24 overflow-hidden border-2 border-slate-50 shadow-md">
          <img src={doctor.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={doctor.name} referrerPolicy="no-referrer" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base lg:text-lg font-black text-slate-900 uppercase tracking-tighter leading-tight truncate">{doctor.name}</h3>
        {doctor.clinics && doctor.clinics.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {doctor.clinics.map((clinic, idx) => (
              <span key={idx} className="text-[8px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 uppercase tracking-widest border border-slate-200">
                <i className="fas fa-hospital mr-1 text-[7px]"></i> {clinic}
              </span>
            ))}
          </div>
        )}
        <p className="text-[9px] text-slate-500 line-clamp-1 italic font-medium leading-relaxed mt-1">"{doctor.bio}"</p>
      </div>
      <div className="flex flex-col items-end gap-3 shrink-0">
        <div className="text-right">
          <span className="text-[7px] font-black text-slate-400 uppercase block tracking-widest leading-none mb-1">CONSULTA</span>
          <span className="text-base lg:text-xl font-black tracking-tighter text-slate-900">{displayPrice}</span>
        </div>
        <div className="px-5 lg:px-7 py-2.5 bg-red-600 text-white font-black text-[9px] uppercase tracking-[0.1em] flex items-center gap-3 hover:bg-red-700 transition-colors border border-white whitespace-nowrap shadow-lg shadow-black/5">AGENDAR <i className="fas fa-arrow-right text-[7px]"></i></div>
      </div>
    </div>
  );
};
