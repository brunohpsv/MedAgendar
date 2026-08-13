import React, { useState } from 'react';
import { generateScheduleFromConfig } from '../utils';
import { DEFAULT_WORK_CONFIG } from '../constants';
import { PartnerSection } from './PartnerSection';

interface ProfessionalSignupProps {
  onSignup: (doctor: any) => void;
}

export const ProfessionalSignup = ({ onSignup }: ProfessionalSignupProps) => {
  const [step, setStep] = useState('form');
  const [specialties, setSpecialties] = useState(['']);
  const [clinics, setClinics] = useState(['']);

  const addSpecialty = () => setSpecialties([...specialties, '']);
  const updateSpecialty = (index: number, value: string) => {
    const newSpecs = [...specialties];
    newSpecs[index] = value;
    setSpecialties(newSpecs);
  };
  const removeSpecialty = (index: number) => {
    if (specialties.length > 1) {
      setSpecialties(specialties.filter((_, i) => i !== index));
    }
  };

  const addClinic = () => setClinics([...clinics, '']);
  const updateClinic = (index: number, value: string) => {
    const newClinics = [...clinics];
    newClinics[index] = value;
    setClinics(newClinics);
  };
  const removeClinic = (index: number) => {
    if (clinics.length > 1) {
      setClinics(clinics.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDoctor = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name'),
      crm: formData.get('crm'),
      specialties: specialties.filter(s => s.trim() !== ''),
      clinics: clinics.filter(c => c.trim() !== ''),
      city: formData.get('city'),
      state: formData.get('state'),
      address: formData.get('address'),
      onlineConsultation: formData.get('onlineConsultation') === 'on',
      additionalFeatures: formData.get('additionalFeatures'),
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
      bio: formData.get('bio'),
      price: Number(formData.get('price')),
      schedule: generateScheduleFromConfig(DEFAULT_WORK_CONFIG),
      workConfig: DEFAULT_WORK_CONFIG,
      accessCode: formData.get('accessCode'),
      paymentStatus: "unpaid",
      status: "active",
      createdAt: new Date().toISOString()
    };
    onSignup(newDoctor);
    setStep('success');
  };

  if (step === 'success') return <div className="lg:max-w-none mx-auto py-16 text-center border border-red-600 bg-white shadow-2xl mt-10"><h2 className="text-2xl font-black text-red-600 mb-2 uppercase">Cadastrado!</h2><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Seu perfil está em análise. Em breve você poderá acessar o painel.</p><button onClick={() => window.location.hash = '#home'} className="mt-6 px-10 py-4 bg-white border border-slate-900 text-slate-900 font-black uppercase text-[10px] hover:bg-red-600 hover:text-white transition-all">INÍCIO</button></div>;

  return (
    <div className="lg:max-w-none mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 animate-slide-up">
      {/* Sidebar Explicativa */}
      <div className="lg:col-span-4 space-y-8">
        <PartnerSection />
        <div className="p-8 border border-slate-200 bg-white">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Ao se cadastrar, você concorda com nossos termos de uso e política de privacidade para profissionais de saúde.</p>
        </div>
      </div>

      {/* Formulário */}
      <div className="lg:col-span-8 bg-white border border-slate-200 p-10 shadow-2xl">
        <h2 className="text-2xl font-black uppercase mb-10">Formulário de Credenciamento</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nome Completo</label>
              <input name="name" required placeholder="EX: DR. JOÃO SILVA" className="w-full p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">CRM / Registro Profissional</label>
              <input name="crm" required placeholder="EX: SP-123456" className="w-full p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Especialidades</label>
                <button type="button" onClick={addSpecialty} className="text-red-600 hover:text-slate-900 transition-colors">
                  <i className="fas fa-plus-circle text-lg"></i>
                </button>
              </div>
              <div className="space-y-3">
                {specialties.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      required 
                      placeholder={index === 0 ? "EX: CARDIOLOGIA" : "OUTRA ESPECIALIDADE"} 
                      className="flex-1 p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600"
                      value={spec}
                      onChange={(e) => updateSpecialty(index, e.target.value)}
                    />
                    {specialties.length > 1 && (
                      <button type="button" onClick={() => removeSpecialty(index)} className="px-4 text-slate-300 hover:text-red-600 transition-colors">
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Valor da Consulta (R$)</label>
              <input name="price" type="number" required placeholder="EX: 250" className="w-full p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Clínica(s)</label>
                <button type="button" onClick={addClinic} className="text-red-600 hover:text-slate-900 transition-colors">
                  <i className="fas fa-plus-circle text-lg"></i>
                </button>
              </div>
              <div className="space-y-3">
                {clinics.map((clinic, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      required 
                      placeholder={index === 0 ? "EX: CLÍNICA SANTA MARIA" : "OUTRA CLÍNICA"} 
                      className="flex-1 p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600"
                      value={clinic}
                      onChange={(e) => updateClinic(index, e.target.value)}
                    />
                    {clinics.length > 1 && (
                      <button type="button" onClick={() => removeClinic(index)} className="px-4 text-slate-300 hover:text-red-600 transition-colors">
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Endereço Completo do Consultório Principal</label>
              <input name="address" required placeholder="RUA, NÚMERO, BAIRRO, COMPLEMENTO" className="w-full p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Cidade</label>
              <input name="city" required placeholder="SÃO PAULO" className="w-full p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">UF</label>
              <input name="state" required placeholder="SP" maxLength={2} className="w-full p-4 border border-slate-200 font-black uppercase text-xs outline-none focus:border-red-600" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Biografia Profissional</label>
            <textarea name="bio" required placeholder="CONTE UM POUCO SOBRE SUA EXPERIÊNCIA..." className="w-full p-4 border border-slate-200 font-black uppercase text-xs min-h-[100px] outline-none focus:border-red-600"></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Outras Funcionalidades / Observações</label>
            <textarea name="additionalFeatures" placeholder="DESEJA ACRESCENTAR MAIS ALGUMA FUNCIONALIDADE OU DETALHE?" className="w-full p-4 border border-slate-200 font-black uppercase text-xs min-h-[80px] outline-none focus:border-red-600"></textarea>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100">
            <input type="checkbox" name="onlineConsultation" id="onlineConsultation" className="w-5 h-5 accent-red-600" />
            <label htmlFor="onlineConsultation" className="text-[10px] font-black uppercase tracking-widest text-slate-900 cursor-pointer">Ofereço Consulta Online (Telemedicina)</label>
          </div>

          <div className="space-y-2 pt-4">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Senha de Acesso ao Painel</label>
            <input name="accessCode" required type="password" placeholder="CRIE UMA SENHA SEGURA" className="w-full p-4 border border-slate-200 bg-white text-slate-900 font-black uppercase text-xs text-center outline-none focus:border-red-600 transition-colors" />
          </div>

          <button type="submit" className="w-full py-6 bg-red-600 text-white font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-lg active-scale">FINALIZAR CADASTRO E ADERIR AO PLANO</button>
        </form>
      </div>
    </div>
  );
};
