import React, { useState, useMemo } from 'react';
import { Doctor, Appointment } from '../types';

interface DoctorDetailsProps {
  doctor: Doctor;
  appointments: Appointment[];
  onConfirm: (app: any) => void;
}

export const DoctorDetails = ({ doctor, appointments, onConfirm }: DoctorDetailsProps) => {
  const [step, setStep] = useState('schedule');
  const [selectedDayDate, setSelectedDayDate] = useState(doctor.schedule?.[0]?.date || "");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [patientData, setPatientData] = useState({ name: '', phone: '', cpf: '' });

  const availableSlots = useMemo(() => {
    const day = doctor.schedule.find(d => d.date === selectedDayDate);
    if (!day) return [];
    return day.slots.filter(slot => !appointments.some(app => app.doctorId === doctor.id && app.date === day.label && app.time === slot && app.status === 'confirmed'));
  }, [doctor, selectedDayDate, appointments]);

  const finalize = () => {
    onConfirm({ id: Math.random().toString(36).substr(2, 6).toUpperCase(), doctorId: doctor.id, doctorName: doctor.name, date: doctor.schedule.find(d => d.date === selectedDayDate)?.label, time: selectedSlot, patientName: patientData.name, patientPhone: patientData.phone, patientCPF: patientData.cpf, status: 'confirmed' });
    setStep('success');
  };

  if (step === 'success') return <div className="lg:max-w-none mx-auto py-12 text-center border border-red-600 bg-white shadow-xl mt-6"><h2 className="text-xl font-black text-red-600 mb-2 uppercase">Confirmado!</h2><p className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">Seu agendamento foi processado.</p></div>;

  return (
    <div className="bg-white border border-slate-900 p-8 shadow-2xl animate-slide-up">
      <div className="flex flex-col md:flex-row gap-10 mb-10">
        <div className="w-full md:w-1/3">
          <div className="aspect-square border-4 border-slate-900 shadow-xl overflow-hidden">
            <img src={doctor.image} className="w-full h-full object-cover" alt={doctor.name} referrerPolicy="no-referrer" />
          </div>
        </div>
        <div className="w-full md:w-2/3 space-y-6">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none mb-2">{doctor.name}</h2>
            <p className="text-xs font-black text-red-600 uppercase tracking-widest">{doctor.specialties.join(' • ')}</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {doctor.onlineConsultation && (
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <i className="fas fa-video"></i> CONSULTA ONLINE DISPONÍVEL
              </span>
            )}
            <span className="px-4 py-2 bg-slate-100 text-slate-700 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
              <i className="fas fa-map-marker-alt"></i> {doctor.city}, {doctor.state}
            </span>
            {doctor.clinics && doctor.clinics.length > 0 && doctor.clinics.map((clinic, idx) => (
              <span key={idx} className="px-4 py-2 bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <i className="fas fa-hospital"></i> {clinic}
              </span>
            ))}
          </div>

          <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"{doctor.bio}"</p>
          
          <div className="p-6 bg-slate-50 border border-slate-100 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Local de Atendimento</h4>
            <p className="text-xs font-black uppercase text-slate-900">{doctor.address || doctor.clinicAddress || 'Endereço não informado'}</p>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-slate-900 pt-10">
        <h3 className="text-xl font-black uppercase mb-8 tracking-tighter">Agendar Horário</h3>
        {step === 'schedule' ? (
        <div className="space-y-6">
          <select value={selectedDayDate} onChange={(e) => setSelectedDayDate(e.target.value)} className="w-full p-4 border border-slate-200 font-black uppercase text-xs">
            {doctor.schedule.map(day => <option key={day.date} value={day.date}>{day.label}</option>)}
          </select>
          <div className="grid grid-cols-4 gap-2">
            {availableSlots.map(slot => (
              <button key={slot} onClick={() => setSelectedSlot(slot)} className={`p-2 text-[10px] font-black border ${selectedSlot === slot ? 'bg-red-600 text-white' : 'bg-slate-50'}`}>{slot}</button>
            ))}
          </div>
          <button disabled={!selectedSlot} onClick={() => setStep('form')} className="w-full py-4 bg-red-600 text-white font-black uppercase text-xs disabled:opacity-50">CONTINUAR</button>
        </div>
      ) : (
        <div className="space-y-4">
          <input placeholder="NOME" className="w-full p-4 border border-slate-200 font-black uppercase text-xs" value={patientData.name} onChange={e => setPatientData({...patientData, name: e.target.value})} />
          <input placeholder="CPF" className="w-full p-4 border border-slate-200 font-black uppercase text-xs" value={patientData.cpf} onChange={e => setPatientData({...patientData, cpf: e.target.value})} />
          <input placeholder="WHATSAPP" className="w-full p-4 border border-slate-200 font-black uppercase text-xs" value={patientData.phone} onChange={e => setPatientData({...patientData, phone: e.target.value})} />
          <button onClick={finalize} className="w-full py-4 bg-red-600 text-white font-black uppercase text-xs">FINALIZAR</button>
        </div>
      )}
      </div>
    </div>
  );
};
