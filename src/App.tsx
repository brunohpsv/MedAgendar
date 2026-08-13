import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { DoctorDetails } from './components/DoctorDetails';
import { ConsultAppointments } from './components/ConsultAppointments';
import { ProfessionalSignup } from './components/ProfessionalSignup';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Doctor, Appointment } from './types';
import { INITIAL_DOCTORS } from './constants';

const App = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('medagendar_doctors');
    const initial = saved ? JSON.parse(saved) : INITIAL_DOCTORS;
    // Migration: ensure new fields exist
    return initial.map((d: any) => ({
      ...d,
      clinicNames: d.clinicNames || (d.clinicName ? [d.clinicName] : []),
      workConfig: {
        daysOfWeek: d.workConfig?.daysOfWeek || [1, 2, 3, 4, 5],
        startTime: d.workConfig?.startTime || "08:00",
        endTime: d.workConfig?.endTime || "18:00",
        slotDuration: d.workConfig?.slotDuration || 30,
        slotCapacity: d.workConfig?.slotCapacity || 1,
        minInterval: d.workConfig?.minInterval || 0,
        breaks: d.workConfig?.breaks || {
          lunch: { start: "12:00", end: "13:00", active: true },
          snack: { start: "16:00", end: "16:15", active: false }
        }
      }
    }));
  });
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('medagendar_appointments');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentView, setCurrentView] = useState('home');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [loggedInDoctorId, setLoggedInDoctorId] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').split('?')[0] || 'home';
      setCurrentView(hash);
      const params = new URLSearchParams(window.location.hash.split('?')[1]);
      setSelectedDoctorId(params.get('id'));
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => { localStorage.setItem('medagendar_doctors', JSON.stringify(doctors)); }, [doctors]);
  useEffect(() => { localStorage.setItem('medagendar_appointments', JSON.stringify(appointments)); }, [appointments]);

  useEffect(() => {
    const interval = setInterval(() => {
      const savedDoctors = localStorage.getItem('medagendar_doctors');
      if (savedDoctors) {
        const parsedDoctors = JSON.parse(savedDoctors);
        setDoctors(current => {
          if (JSON.stringify(parsedDoctors) !== JSON.stringify(current)) return parsedDoctors;
          return current;
        });
      }
      const savedAppointments = localStorage.getItem('medagendar_appointments');
      if (savedAppointments) {
        const parsedAppointments = JSON.parse(savedAppointments);
        setAppointments(current => {
          if (JSON.stringify(parsedAppointments) !== JSON.stringify(current)) return parsedAppointments;
          return current;
        });
      }
      console.log('Dados atualizados automaticamente');
    }, 120000); // 2 minutos

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'medagendar_doctors' && e.newValue) setDoctors(JSON.parse(e.newValue));
      if (e.key === 'medagendar_appointments' && e.newValue) setAppointments(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const navigateTo = (view: string, params?: Record<string, string>) => {
    let hash = `#${view}`;
    if (params) hash += `?${new URLSearchParams(params).toString()}`;
    window.location.hash = hash;
  };

  const handleConfirm = (app: Appointment) => { setAppointments(prev => [app, ...prev]); navigateTo('home'); };
  const handleCancel = (id: string) => { setAppointments(prev => prev.map(a => a.id === id ? {...a, status: 'cancelled'} : a)); };

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentView={currentView} setView={navigateTo} />
      <main className="flex-1">
        {currentView === 'home' && <Home doctors={doctors} onSelectDoctor={(id) => navigateTo('doctor_details', {id})} selectedDoctorId={selectedDoctorId} />}
        <div className="lg:max-w-none mx-auto px-4 py-8">
          {currentView === 'doctor_details' && selectedDoctor && <DoctorDetails doctor={selectedDoctor} appointments={appointments} onConfirm={handleConfirm} />}
          {currentView === 'consult_appointments' && <ConsultAppointments appointments={appointments} onCancel={handleCancel} />}
          {currentView === 'professional_signup' && <ProfessionalSignup onSignup={(d) => setDoctors(prev => [...prev, d])} />}
          {currentView === 'professional_dashboard' && <ProfessionalDashboard doctors={doctors} appointments={appointments} setDoctors={setDoctors} loggedInId={loggedInDoctorId} onLogin={setLoggedInDoctorId} onLogout={() => setLoggedInDoctorId(null)} onCancelAppointment={handleCancel} />}
          {currentView === 'admin_dashboard' && <AdminDashboard doctors={doctors} setDoctors={setDoctors} isAuthenticated={isAdminAuthenticated} onAuthenticate={setIsAdminAuthenticated} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
