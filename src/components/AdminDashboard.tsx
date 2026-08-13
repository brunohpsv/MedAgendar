import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ADMIN_PASSWORD } from '../constants';
import { Doctor } from '../types';

interface AdminDashboardProps {
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
  isAuthenticated: boolean;
  onAuthenticate: (val: boolean) => void;
}

export const AdminDashboard = ({ doctors, setDoctors, isAuthenticated, onAuthenticate }: AdminDashboardProps) => {
  const [password, setPassword] = useState('');
  const [showShareModal, setShowShareModal] = useState<string | null>(null); // null = none, 'main' = company, doctorId = specific doctor

  const toggleStatus = (id: string) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'active' ? 'suspended' : 'active' } : d));
  };

  if (!isAuthenticated) return (
    <div className="lg:max-w-none mx-auto mt-20 p-8 bg-white border border-slate-200 shadow-2xl">
      <h2 className="text-2xl font-black uppercase mb-6 text-slate-900">Admin</h2>
      <input type="password" placeholder="SENHA MASTER" className="w-full p-4 border border-slate-200 mb-4 font-black outline-none focus:border-red-600" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => password === ADMIN_PASSWORD && onAuthenticate(true)} className="w-full bg-red-600 text-white p-4 font-black uppercase hover:bg-red-700 transition-all">ENTRAR</button>
    </div>
  );
  return (
    <div className="lg:max-w-none mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <h2 className="text-3xl font-black uppercase">Gestão de Profissionais</h2>
        <button 
          onClick={() => setShowShareModal('main')}
          className="px-6 py-3 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg"
        >
          <i className="fas fa-share-alt"></i> COMPARTILHAR SITE
        </button>
      </div>

      <div className="space-y-4">
        {doctors.map(doc => (
          <div key={doc.id} className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <img src={doc.image} className="w-12 h-12 object-cover border border-slate-900" alt={doc.name} />
              <div>
                <h3 className="font-black uppercase text-sm">{doc.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{doc.crm} • {doc.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              <button 
                onClick={() => setShowShareModal(doc.id)}
                className="p-3 bg-slate-100 text-slate-900 hover:bg-red-600 hover:text-white transition-all"
                title="Compartilhar Perfil"
              >
                <i className="fas fa-share-alt"></i>
              </button>
              <button 
                onClick={() => toggleStatus(doc.id)} 
                className={`px-4 py-2 font-black uppercase text-[9px] border-2 transition-colors ${doc.status === 'active' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-400 border-slate-100'}`}
              >
                {doc.status === 'active' ? 'ATIVO' : 'SUSPENSO'}
              </button>
              <button onClick={() => setDoctors(prev => prev.filter(d => d.id !== doc.id))} className="text-red-600 font-black uppercase text-[10px] hover:underline">EXCLUIR</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Compartilhamento */}
      {showShareModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl border-4 border-slate-200 shadow-2xl animate-slide-up overflow-hidden">
            <div className="bg-white border-b border-slate-200 p-6 flex justify-between items-center text-slate-900">
              <h3 className="font-black uppercase tracking-widest text-sm">
                {showShareModal === 'main' ? 'Compartilhar Site da Empresa' : `Compartilhar Perfil: ${doctors.find(d => d.id === showShareModal)?.name}`}
              </h3>
              <button onClick={() => setShowShareModal(null)} className="text-slate-400 hover:text-red-600 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400">Link Direto</label>
                    <div className="bg-slate-50 p-4 border border-slate-200 font-mono text-[10px] break-all select-all mb-4">
                      {showShareModal === 'main' 
                        ? `${window.location.origin}${window.location.pathname}`
                        : `${window.location.origin}${window.location.pathname}#doctor_details?id=${showShareModal}`
                      }
                    </div>
                    <button 
                      onClick={() => {
                        const url = showShareModal === 'main' 
                          ? `${window.location.origin}${window.location.pathname}`
                          : `${window.location.origin}${window.location.pathname}#doctor_details?id=${showShareModal}`;
                        navigator.clipboard.writeText(url);
                        alert('Link copiado!');
                      }}
                      className="w-full py-3 bg-white border border-slate-900 text-slate-900 font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-copy"></i> COPIAR LINK
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center bg-slate-50 p-6 border border-slate-200">
                  <div className="bg-white p-2 border border-slate-200 mb-4" id="admin-qrcode">
                    <QRCodeCanvas 
                      value={showShareModal === 'main' 
                        ? `${window.location.origin}${window.location.pathname}`
                        : `${window.location.origin}${window.location.pathname}#doctor_details?id=${showShareModal}`
                      }
                      size={150}
                      level="H"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const canvas = document.querySelector('#admin-qrcode canvas') as HTMLCanvasElement;
                      if (canvas) {
                        const url = canvas.toDataURL('image/png');
                        const link = document.createElement('a');
                        link.download = `qrcode-${showShareModal === 'main' ? 'empresa' : 'profissional'}.png`;
                        link.href = url;
                        link.click();
                      }
                    }}
                    className="text-[9px] font-black uppercase text-red-600 hover:underline"
                  >
                    BAIXAR IMAGEM
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
