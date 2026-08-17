import React, { useState } from 'react';
import { Appointment } from '../types';

interface ConsultAppointmentsProps {
  appointments: Appointment[];
  onCancel: (id: string) => void;
}

export const ConsultAppointments = ({ appointments, onCancel }: ConsultAppointmentsProps) => {
  const [cpf, setCpf] = useState('');
  const [searchResult, setSearchResult] = useState<any[] | null>(null);
  const handleSearch = () => setSearchResult(appointments.filter((app: any) => app.patientCPF === cpf && !app.rescheduledToId && app.status !== 'rescheduled'));
  return (
    <div className="lg:max-w-none mx-auto">
      <h2 className="text-3xl font-black uppercase mb-8">Suas Consultas</h2>
      <div className="bg-white border border-slate-200 p-8 flex gap-4 mb-10 shadow-sm">
        <input placeholder="DIGITE SEU CPF" className="flex-1 p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600" value={cpf} onChange={(e) => setCpf(e.target.value)} />
        <button onClick={handleSearch} className="bg-red-600 text-white px-8 font-black uppercase text-xs hover:bg-red-700 transition-all">BUSCAR</button>
      </div>
      {searchResult && (
        <div className="space-y-4">
          {searchResult.map(app => (
            <div key={app.id} className="bg-white border border-slate-200 p-6 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black uppercase">{app.doctorName}</h3>
                  {(app.isRescheduled || app.rescheduledFromId || app.rescheduled) && (
                    <span className="px-2 py-0.5 bg-amber-500 text-white text-[9px] font-black uppercase rounded">Reagendamento</span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{app.date} às {app.time}</p>
              </div>
              {app.status !== 'cancelled' && <button onClick={() => onCancel(app.id)} className="text-red-600 font-black uppercase text-[10px]">CANCELAR</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
