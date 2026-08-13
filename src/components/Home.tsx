import React, { useState, useMemo } from 'react';
import { Doctor } from '../types';
import { DoctorCard } from './DoctorCard';
import { PartnerSection } from './PartnerSection';

interface HomeProps {
  doctors: Doctor[];
  onSelectDoctor: (id: string) => void;
  selectedDoctorId: string | null;
}

export const Home = ({ doctors, onSelectDoctor, selectedDoctorId }: HomeProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const isActive = doc.status === 'active';
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLocation = doc.city.toLowerCase().includes(locationTerm.toLowerCase()) || doc.state.toLowerCase().includes(locationTerm.toLowerCase());
      return isActive && matchesSearch && matchesLocation;
    });
  }, [doctors, searchTerm, locationTerm]);

  return (
    <div className="animate-slide-up">
      <section className="bg-white py-12 lg:py-20 border-b border-slate-200 relative">
        <div className="lg:max-w-none mx-auto px-6 sm:px-8 relative z-10">
          <h1 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none uppercase mb-10">ENCONTRE O SEU <br/><span className="text-red-600">ESPECIALISTA</span></h1>
          <div className="lg:max-w-none grid grid-cols-1 md:grid-cols-12 gap-0 border border-slate-200 bg-white shadow-2xl">
            <div className="md:col-span-5 flex items-center px-6 py-4 border-b md:border-b-0 md:border-r border-slate-100 bg-white">
              <i className="fas fa-search text-red-600 mr-4 text-sm"></i>
              <input type="text" placeholder="MÉDICO OU ESPECIALIDADE" className="bg-transparent w-full outline-none text-slate-900 font-black text-xs placeholder:text-slate-300 uppercase tracking-widest" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="md:col-span-4 flex items-center px-6 py-4 bg-white">
              <i className="fas fa-location-arrow text-red-600 mr-4 text-sm"></i>
              <input type="text" placeholder="CIDADE OU UF" className="bg-transparent w-full outline-none text-slate-900 font-black text-xs placeholder:text-slate-300 uppercase tracking-widest" value={locationTerm} onChange={(e) => setLocationTerm(e.target.value)} />
            </div>
            <button className="md:col-span-3 bg-red-600 px-8 py-5 font-black text-[11px] uppercase tracking-[0.2em] text-white transition-all hover:bg-red-700 border border-white">FILTRAR BASE</button>
          </div>
        </div>
      </section>
      <section className="lg:max-w-none mx-auto px-4 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 gap-4">
          {filteredDoctors.map(doc => (
            <DoctorCard key={doc.id} doctor={doc} isActive={selectedDoctorId === doc.id} onClick={() => onSelectDoctor(doc.id)} />
          ))}
        </div>
      </section>

      {/* Seção Parceiro Prominente */}
      <section className="lg:max-w-none mx-auto px-4 lg:px-8 py-10 lg:py-16 border-t border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <PartnerSection />
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-black uppercase tracking-tighter">JUNTE-SE À <br/><span className="text-red-600">MAIOR REDE</span> DE SAÚDE</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Nossa plataforma conecta milhares de pacientes a profissionais qualificados todos os dias. Tenha sua agenda organizada e sua visibilidade aumentada com o MedAgendar.</p>
            <button 
              onClick={() => window.location.hash = '#professional_signup'}
              className="px-10 py-5 bg-red-600 text-white font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-lg active-scale"
            >
              QUERO SER PARCEIRO AGORA
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
