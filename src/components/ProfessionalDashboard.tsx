import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { generateScheduleFromConfig } from '../utils';
import { Doctor, Appointment } from '../types';

interface ProfessionalDashboardProps {
  doctors: Doctor[];
  appointments: Appointment[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
  loggedInId: string | null;
  onLogin: (id: string) => void;
  onLogout: () => void;
  onCancelAppointment: (id: string) => void;
}

export const ProfessionalDashboard = ({ doctors, appointments, setDoctors, loggedInId, onLogin, onLogout, onCancelAppointment }: ProfessionalDashboardProps) => {
  const [accessCode, setAccessCode] = useState('');
  const [activeTab, setActiveTab] = useState('appointments');
  const loggedInDoctor = doctors.find(d => d.id === loggedInId);

  const handleLogin = () => {
    const doctor = doctors.find(d => d.accessCode === accessCode);
    if (doctor) onLogin(doctor.id);
  };

  const updateDoctor = (updates: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === loggedInId ? { ...d, ...updates } : d));
  };

  if (!loggedInDoctor) return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-8 border border-slate-200 border-b-4 border-b-red-600 text-center shadow-2xl animate-slide-up">
      <h2 className="text-slate-900 font-black uppercase mb-8 tracking-widest">Acesso Profissional</h2>
      <div className="space-y-4">
        <input type="password" placeholder="SUA SENHA DE ACESSO" className="w-full p-4 text-center font-black uppercase text-xs outline-none border border-slate-200 focus:ring-2 focus:ring-red-600" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
        <button onClick={handleLogin} className="w-full py-4 bg-red-600 text-white font-black uppercase text-xs hover:bg-red-700 transition-all active-scale">ENTRAR NO PAINEL</button>
      </div>
      <p className="mt-6 text-[9px] text-slate-500 font-bold uppercase tracking-widest">Esqueceu sua senha? Entre em contato com o suporte.</p>
    </div>
  );

  const doctorAppointments = appointments.filter(a => a.doctorId === loggedInId);

  return (
    <div className="lg:max-w-none mx-auto animate-slide-up">
      {/* Header do Painel */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 text-slate-900 border border-slate-200 border-b-4 border-b-red-600 shadow-xl mb-8">
        <div className="flex items-center gap-6 mb-4 md:mb-0">
          <div className="w-16 h-16 border-2 border-red-600 overflow-hidden">
            <img src={loggedInDoctor.image} className="w-full h-full object-cover" alt={loggedInDoctor.name} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">{loggedInDoctor.name}</h2>
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{loggedInDoctor.crm} • {loggedInDoctor.specialties.join(', ')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => window.location.hash = '#home'} className="px-6 py-3 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">VER SITE</button>
          <button onClick={onLogout} className="px-6 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all">SAIR</button>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
        {[
          { id: 'appointments', label: 'AGENDA', icon: 'fa-calendar' },
          { id: 'profile', label: 'MEU PERFIL', icon: 'fa-user' },
          { id: 'schedule', label: 'CONFIG. AGENDA', icon: 'fa-clock' },
          { id: 'share', label: 'COMPARTILHAR', icon: 'fa-share-alt' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all whitespace-nowrap border-b-2 ${activeTab === tab.id ? "border-red-600 text-red-600 bg-white" : "border-transparent text-slate-400 hover:text-slate-900"}`}
          >
            <i className={`fas ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      <div className="bg-white border border-slate-200 p-6 md:p-10 shadow-sm">
        {activeTab === 'appointments' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black uppercase tracking-tighter">Próximos Agendamentos</h3>
              <span className="bg-slate-100 px-4 py-1 text-[9px] font-black uppercase text-slate-500">{doctorAppointments.length} TOTAL</span>
            </div>
            {doctorAppointments.length === 0 ? (
              <div className="py-20 text-center">
                <i className="fas fa-calendar-times text-4xl text-slate-100 mb-4"></i>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nenhum agendamento encontrado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {doctorAppointments.map(app => (
                  <div key={app.id} className={`p-6 border flex flex-col md:flex-row justify-between items-center gap-6 transition-all ${app.status === 'cancelled' ? 'opacity-50 bg-slate-50 border-slate-100' : 'bg-white border-slate-200 hover:border-red-600'}`}>
                    <div className="flex gap-6 items-center w-full md:w-auto">
                      <div className={`w-20 h-20 flex flex-col items-center justify-center font-black ${app.status === 'cancelled' ? 'bg-slate-200 text-slate-400' : 'bg-white border border-slate-200 text-slate-900'}`}>
                        <span className="text-[9px] uppercase opacity-50">HORA</span>
                        <span className="text-lg">{app.time}</span>
                      </div>
                      <div>
                        <p className="font-black uppercase text-slate-900">{app.patientName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{app.date}</p>
                        <div className="flex gap-4">
                          <a href={`tel:${app.patientPhone}`} className="text-[9px] font-black text-red-600 uppercase hover:underline"><i className="fas fa-phone mr-1"></i> {app.patientPhone}</a>
                          <span className="text-[9px] font-black text-slate-400 uppercase"><i className="fas fa-id-card mr-1"></i> {app.patientCPF}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                      {app.status === 'cancelled' ? (
                        <span className="px-4 py-2 bg-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-widest">CANCELADO</span>
                      ) : (
                        <>
                          <button className="px-4 py-2 bg-slate-100 text-slate-900 text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">DETALHES</button>
                          <button onClick={() => onCancelAppointment(app.id)} className="px-4 py-2 border border-red-600 text-red-600 text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">CANCELAR</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="lg:max-w-none space-y-8">
            <h3 className="text-lg font-black uppercase tracking-tighter border-b border-slate-100 pb-4">Editar Perfil Público</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400">Nome Completo</label>
                  <input
                    className="w-full p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600"
                    value={loggedInDoctor?.name}
                    onChange={(e) => updateDoctor({ name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400">CRM / Registro</label>
                  <input
                    className="w-full p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600"
                    value={loggedInDoctor?.crm}
                    onChange={(e) => updateDoctor({ crm: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400">Biografia Profissional</label>
                <textarea
                  className="w-full p-4 border border-slate-200 font-black uppercase text-xs min-h-[120px] outline-none focus:border-red-600"
                  value={loggedInDoctor?.bio}
                  onChange={(e) => updateDoctor({ bio: e.target.value })}
                ></textarea>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black uppercase text-slate-400">Especialidades</label>
                  <button 
                    onClick={() => updateDoctor({ specialties: [...(loggedInDoctor?.specialties || []), ''] })}
                    className="text-red-600 hover:text-slate-900 transition-colors"
                  >
                    <i className="fas fa-plus-circle text-lg"></i>
                  </button>
                </div>
                <div className="space-y-3">
                  {loggedInDoctor?.specialties.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        className="flex-1 p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600"
                        value={spec}
                        onChange={(e) => {
                          const newSpecs = [...(loggedInDoctor?.specialties || [])];
                          newSpecs[index] = e.target.value;
                          updateDoctor({ specialties: newSpecs });
                        }}
                      />
                      {(loggedInDoctor?.specialties.length || 0) > 1 && (
                        <button 
                          onClick={() => {
                            const newSpecs = (loggedInDoctor?.specialties || []).filter((_, i) => i !== index);
                            updateDoctor({ specialties: newSpecs });
                          }}
                          className="px-4 text-slate-300 hover:text-red-600 transition-colors"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black uppercase text-slate-400">Clínica(s)</label>
                  <button 
                    onClick={() => updateDoctor({ clinics: [...(loggedInDoctor?.clinics || []), ''] })}
                    className="text-red-600 hover:text-slate-900 transition-colors"
                  >
                    <i className="fas fa-plus-circle text-lg"></i>
                  </button>
                </div>
                <div className="space-y-3">
                  {(loggedInDoctor?.clinics || ['']).map((clinic, index) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        className="flex-1 p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600"
                        value={clinic}
                        placeholder="NOME DA CLÍNICA"
                        onChange={(e) => {
                          const newClinics = [...(loggedInDoctor?.clinics || [''])];
                          newClinics[index] = e.target.value;
                          updateDoctor({ clinics: newClinics });
                        }}
                      />
                      {(loggedInDoctor?.clinics?.length || 0) > 1 && (
                        <button 
                          onClick={() => {
                            const newClinics = (loggedInDoctor?.clinics || []).filter((_, i) => i !== index);
                            updateDoctor({ clinics: newClinics });
                          }}
                          className="px-4 text-slate-300 hover:text-red-600 transition-colors"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400">Valor da Consulta (R$)</label>
                  <input
                    type="number"
                    className="w-full p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600"
                    value={loggedInDoctor?.price}
                    onChange={(e) => updateDoctor({ price: Number(e.target.value) })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400">Cidade</label>
                    <input
                      className="w-full p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600"
                      value={loggedInDoctor?.city}
                      onChange={(e) => updateDoctor({ city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400">UF</label>
                    <input
                      className="w-full p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600"
                      value={loggedInDoctor?.state}
                      maxLength={2}
                      onChange={(e) => updateDoctor({ state: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400">Endereço do Consultório</label>
                <input
                  className="w-full p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600"
                  value={loggedInDoctor?.address || ''}
                  onChange={(e) => updateDoctor({ address: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100">
                <input
                  type="checkbox"
                  id="online_edit"
                  className="w-5 h-5 accent-red-600"
                  checked={loggedInDoctor?.onlineConsultation}
                  onChange={(e) => updateDoctor({ onlineConsultation: e.target.checked })}
                />
                <label htmlFor="online_edit" className="text-[10px] font-black uppercase tracking-widest text-slate-900 cursor-pointer">Ofereço Consulta Online</label>
              </div>
            </div>
            <div className="pt-6">
              <button className="px-10 py-4 bg-white border border-slate-900 text-slate-900 font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg">SALVAR ALTERAÇÕES</button>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="lg:max-w-none space-y-8">
            <h3 className="text-lg font-black uppercase tracking-tighter border-b border-slate-100 pb-4">Configurações de Horários</h3>
            <div className="grid grid-cols-1 gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400">Início do Expediente</label>
                  <input
                    type="time"
                    className="w-full p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600"
                    value={loggedInDoctor?.workConfig.startTime}
                    onChange={(e) => updateDoctor({ workConfig: { ...loggedInDoctor!.workConfig, startTime: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400">Fim do Expediente</label>
                  <input
                    type="time"
                    className="w-full p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600"
                    value={loggedInDoctor?.workConfig.endTime}
                    onChange={(e) => updateDoctor({ workConfig: { ...loggedInDoctor!.workConfig, endTime: e.target.value } })}
                  />
                </div>
              </div>

              {/* Configuração de Intervalos */}
              <div className="space-y-6 p-6 bg-slate-50 border border-slate-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2">Intervalos e Descansos</h4>
                
                {/* Almoço */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="lunch_active"
                      className="w-4 h-4 accent-red-600"
                      checked={loggedInDoctor?.workConfig.breaks.lunch.active}
                      onChange={(e) => updateDoctor({ workConfig: { ...loggedInDoctor!.workConfig, breaks: { ...loggedInDoctor!.workConfig.breaks, lunch: { ...loggedInDoctor!.workConfig.breaks.lunch, active: e.target.checked } } } })}
                    />
                    <label htmlFor="lunch_active" className="text-[10px] font-black uppercase text-slate-900">Intervalo de Almoço</label>
                  </div>
                  {loggedInDoctor?.workConfig.breaks.lunch.active && (
                    <div className="grid grid-cols-2 gap-4 ml-8">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase text-slate-400">Início</label>
                        <input
                          type="time"
                          className="w-full p-2 border border-slate-200 font-black uppercase text-[10px] outline-none focus:border-red-600"
                          value={loggedInDoctor?.workConfig.breaks.lunch.start}
                          onChange={(e) => updateDoctor({ workConfig: { ...loggedInDoctor!.workConfig, breaks: { ...loggedInDoctor!.workConfig.breaks, lunch: { ...loggedInDoctor!.workConfig.breaks.lunch, start: e.target.value } } } })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase text-slate-400">Fim</label>
                        <input
                          type="time"
                          className="w-full p-2 border border-slate-200 font-black uppercase text-[10px] outline-none focus:border-red-600"
                          value={loggedInDoctor?.workConfig.breaks.lunch.end}
                          onChange={(e) => updateDoctor({ workConfig: { ...loggedInDoctor!.workConfig, breaks: { ...loggedInDoctor!.workConfig.breaks, lunch: { ...loggedInDoctor!.workConfig.breaks.lunch, end: e.target.value } } } })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Descanso da Tarde */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="snack_active"
                      className="w-4 h-4 accent-red-600"
                      checked={loggedInDoctor?.workConfig.breaks.snack.active}
                      onChange={(e) => updateDoctor({ workConfig: { ...loggedInDoctor!.workConfig, breaks: { ...loggedInDoctor!.workConfig.breaks, snack: { ...loggedInDoctor!.workConfig.breaks.snack, active: e.target.checked } } } })}
                    />
                    <label htmlFor="snack_active" className="text-[10px] font-black uppercase text-slate-900">Descanso da Tarde</label>
                  </div>
                  {loggedInDoctor?.workConfig.breaks.snack.active && (
                    <div className="grid grid-cols-2 gap-4 ml-8">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase text-slate-400">Início</label>
                        <input
                          type="time"
                          className="w-full p-2 border border-slate-200 font-black uppercase text-[10px] outline-none focus:border-red-600"
                          value={loggedInDoctor?.workConfig.breaks.snack.start}
                          onChange={(e) => updateDoctor({ workConfig: { ...loggedInDoctor!.workConfig, breaks: { ...loggedInDoctor!.workConfig.breaks, snack: { ...loggedInDoctor!.workConfig.breaks.snack, start: e.target.value } } } })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase text-slate-400">Fim</label>
                        <input
                          type="time"
                          className="w-full p-2 border border-slate-200 font-black uppercase text-[10px] outline-none focus:border-red-600"
                          value={loggedInDoctor?.workConfig.breaks.snack.end}
                          onChange={(e) => updateDoctor({ workConfig: { ...loggedInDoctor!.workConfig, breaks: { ...loggedInDoctor!.workConfig.breaks, snack: { ...loggedInDoctor!.workConfig.breaks.snack, end: e.target.value } } } })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase text-slate-400">Dias de Atendimento</label>
                <div className="flex flex-wrap gap-2">
                  {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map((day, idx) => (
                    <button
                      key={day}
                      onClick={() => {
                        const days = loggedInDoctor!.workConfig.daysOfWeek;
                        const newDays = days.includes(idx) ? days.filter(d => d !== idx) : [...days, idx].sort();
                        updateDoctor({ workConfig: { ...loggedInDoctor!.workConfig, daysOfWeek: newDays } });
                      }}
                      className={`w-12 h-12 text-[10px] font-black border transition-all ${loggedInDoctor?.workConfig.daysOfWeek.includes(idx) ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-900'}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400">Duração de cada Consulta (Minutos)</label>
                <select
                  className="w-full p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600"
                  value={loggedInDoctor?.workConfig.slotDuration}
                  onChange={(e) => updateDoctor({ workConfig: { ...loggedInDoctor!.workConfig, slotDuration: Number(e.target.value) } })}
                >
                  {[15, 20, 30, 45, 60, 90].map(m => <option key={m} value={m}>{m} MINUTOS</option>)}
                </select>
              </div>
            </div>
            <div className="pt-6 flex gap-4">
              <button
                onClick={() => {
                  const newSchedule = generateScheduleFromConfig(loggedInDoctor!.workConfig);
                  updateDoctor({ schedule: newSchedule });
                }}
                className="px-10 py-4 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-lg"
              >
                REGERAR AGENDA COM NOVOS HORÁRIOS
              </button>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Atenção: Regerar a agenda não afetará consultas já confirmadas.</p>
          </div>
        )}

        {activeTab === 'share' && (
          <div className="lg:max-w-none space-y-12 animate-slide-up">
            <div className="border-b border-slate-100 pb-6">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Compartilhar meu Perfil</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Envie este link ou QR Code para seus pacientes agendarem diretamente com você.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              {/* Link Direto */}
              <div className="space-y-6">
                <div className="p-8 bg-slate-50 border border-slate-200">
                  <label className="text-[9px] font-black uppercase text-slate-400 mb-4 block">Link Direto para Agendamento</label>
                  <div className="flex flex-col gap-4">
                    <div className="bg-white p-4 border border-slate-200 font-mono text-[10px] break-all select-all">
                      {`${window.location.origin}${window.location.pathname}#doctor_details?id=${loggedInDoctor.id}`}
                    </div>
                    <button 
                      onClick={() => {
                        const url = `${window.location.origin}${window.location.pathname}#doctor_details?id=${loggedInDoctor.id}`;
                        navigator.clipboard.writeText(url);
                        alert('Link copiado para a área de transferência!');
                      }}
                      className="w-full py-4 bg-white border border-slate-900 text-slate-900 font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                      <i className="fas fa-copy"></i> COPIAR LINK
                    </button>
                  </div>
                </div>

                <div className="p-8 border-2 border-dashed border-slate-200">
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Como usar?</h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-[10px] font-bold text-slate-600 uppercase">
                      <span className="text-red-600 font-black">01.</span>
                      Copie o link acima e cole na sua bio do Instagram ou envie pelo WhatsApp.
                    </li>
                    <li className="flex gap-3 text-[10px] font-bold text-slate-600 uppercase">
                      <span className="text-red-600 font-black">02.</span>
                      Baixe ou copie a imagem do QR Code ao lado para imprimir em cartões ou placas no consultório.
                    </li>
                  </ul>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center p-12 bg-white border-4 border-slate-200 shadow-xl">
                <div className="bg-white p-4 border-2 border-slate-200 mb-8" id="qrcode-container">
                  <QRCodeCanvas 
                    value={`${window.location.origin}${window.location.pathname}#doctor_details?id=${loggedInDoctor.id}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="text-center space-y-4 w-full">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">QR CODE DE AGENDAMENTO</p>
                  <button 
                    onClick={() => {
                      const canvas = document.querySelector('#qrcode-container canvas') as HTMLCanvasElement;
                      if (canvas) {
                        const url = canvas.toDataURL('image/png');
                        const link = document.createElement('a');
                        link.download = `qrcode-${loggedInDoctor.name.toLowerCase().replace(/\s+/g, '-')}.png`;
                        link.href = url;
                        link.click();
                      }
                    }}
                    className="w-full py-4 border-2 border-slate-200 text-slate-900 font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3"
                  >
                    <i className="fas fa-download"></i> BAIXAR QR CODE
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
