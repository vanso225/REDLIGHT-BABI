import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MapPin, Camera, Plus, CheckCircle2 } from 'lucide-react';
import { ABIDJAN_COMMUNES, OWNER_WHATSAPP } from '../constants';

interface SubmitHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubmitHotelModal: React.FC<SubmitHotelModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nom: '',
    commune: '',
    quartier: '',
    prixPassageVentile: '',
    prixPassageClim: '',
    prixNuitVentile: '',
    prixNuitClim: '',
    latitude: '',
    longitude: '',
    hasWifi: false,
    hasParking: false,
    hasSecurity: false,
  });

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleAmenity = (key: 'hasWifi' | 'hasParking' | 'hasSecurity') => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
        setIsGettingLocation(false);
      }, (error) => {
        console.error("Error getting location:", error);
        setIsGettingLocation(false);
      });
    } else {
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `PROPOSITION NOUVEL ÉTABLISSEMENT%0A%0A` +
      `Nom: ${formData.nom}%0A` +
      `Commune: ${formData.commune}%0A` +
      `Quartier: ${formData.quartier}%0A%0A` +
      `TARIFS PASSAGE:%0A` +
      `- Ventilé: ${formData.prixPassageVentile || 'N/A'} F%0A` +
      `- Clim: ${formData.prixPassageClim || 'N/A'} F%0A%0A` +
      `TARIFS NUIT:%0A` +
      `- Ventilé: ${formData.prixNuitVentile || 'N/A'} F%0A` +
      `- Clim: ${formData.prixNuitClim || 'N/A'} F%0A%0A` +
      `EQUIPEMENTS:%0A` +
      `${formData.hasWifi ? '✓ Wifi ' : ''}${formData.hasParking ? '✓ Parking ' : ''}${formData.hasSecurity ? '✓ Sécurité' : ''}%0A%0A` +
      `GPS: ${formData.latitude}, ${formData.longitude}%0A%0A` +
      `Merci de vérifier cet établissement !`;

    const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-[24px] overflow-hidden shadow-2xl"
        >
          {!submitted ? (
            <div className="flex flex-col h-[85vh] md:h-auto">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-950 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <Plus size={24} className="text-[#e11d48]" />
                  <h2 className="text-2xl font-bebas uppercase tracking-tight text-white">Proposer un établissement</h2>
                </div>
                <button onClick={onClose} className="p-2 bg-[#1a1a1a] rounded-full text-zinc-500 hover:text-white transition-colors border border-white/5">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 block mb-2">Nom de l'établissement</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-[#1a1a1a] border border-[#e11d48]/20 rounded-[12px] p-4 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50 focus:border-[#e11d48] transition-all placeholder:text-zinc-700"
                      placeholder="Ex: Hôtel Pleine Lune"
                      value={formData.nom}
                      onChange={e => setFormData({...formData, nom: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 block mb-2">Commune</label>
                      <div className="relative">
                        <select 
                          required
                          className="w-full bg-[#1a1a1a] border border-[#e11d48]/20 rounded-[12px] p-4 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50 focus:border-[#e11d48] transition-all appearance-none"
                          value={formData.commune}
                          onChange={e => setFormData({...formData, commune: e.target.value})}
                        >
                          <option value="">Choisir...</option>
                          {ABIDJAN_COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#e11d48]">
                          <Plus size={14} className="rotate-45" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 block mb-2">Quartier</label>
                      <input 
                        required
                        type="text"
                        className="w-full bg-[#1a1a1a] border border-[#e11d48]/20 rounded-[12px] p-4 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50 focus:border-[#e11d48] transition-all placeholder:text-zinc-700"
                        placeholder="Ex: Angré"
                        value={formData.quartier}
                        onChange={e => setFormData({...formData, quartier: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#e11d48] uppercase tracking-widest px-1 block border-l-2 border-[#e11d48] pl-2">Tarifs Passage (CFA)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight px-1 block mb-2">Ventilé</label>
                        <input 
                          type="number"
                          className="w-full bg-[#1a1a1a] border border-[#e11d48]/20 rounded-[12px] p-4 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50 focus:border-[#e11d48] transition-all placeholder:text-zinc-700"
                          placeholder="Ex: 3000"
                          value={formData.prixPassageVentile}
                          onChange={e => setFormData({...formData, prixPassageVentile: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight px-1 block mb-2">Climatisé</label>
                        <input 
                          type="number"
                          className="w-full bg-[#1a1a1a] border border-[#e11d48]/20 rounded-[12px] p-4 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50 focus:border-[#e11d48] transition-all placeholder:text-zinc-700"
                          placeholder="Ex: 5000"
                          value={formData.prixPassageClim}
                          onChange={e => setFormData({...formData, prixPassageClim: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#e11d48] uppercase tracking-widest px-1 block border-l-2 border-[#e11d48] pl-2">Tarifs Nuitée (CFA)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight px-1 block mb-2">Ventilé</label>
                        <input 
                          type="number"
                          className="w-full bg-[#1a1a1a] border border-[#e11d48]/20 rounded-[12px] p-4 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50 focus:border-[#e11d48] transition-all placeholder:text-zinc-700"
                          placeholder="Ex: 8000"
                          value={formData.prixNuitVentile}
                          onChange={e => setFormData({...formData, prixNuitVentile: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight px-1 block mb-2">Climatisé</label>
                        <input 
                          type="number"
                          className="w-full bg-[#1a1a1a] border border-[#e11d48]/20 rounded-[12px] p-4 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50 focus:border-[#e11d48] transition-all placeholder:text-zinc-700"
                          placeholder="Ex: 15000"
                          value={formData.prixNuitClim}
                          onChange={e => setFormData({...formData, prixNuitClim: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#e11d48] uppercase tracking-widest px-1 block border-l-2 border-[#e11d48] pl-2">Équipements</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: 'hasWifi', label: 'Wifi' },
                        { key: 'hasParking', label: 'Parking' },
                        { key: 'hasSecurity', label: 'Sécurité' },
                      ].map(item => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => toggleAmenity(item.key as any)}
                          className={`flex-1 py-3 px-4 rounded-[12px] text-[10px] font-black uppercase tracking-widest transition-all border ${
                            formData[item.key as keyof typeof formData] === true
                            ? 'bg-[#e11d48] border-[#e11d48] text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                            : 'bg-[#1a1a1a] border-zinc-800 text-zinc-600 hover:border-[#e11d48]/30'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 bg-[#1a1a1a] border border-[#e11d48]/10 rounded-[12px] space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Position GPS</label>
                      {formData.latitude && (
                        <span className="text-[9px] text-[#e11d48] font-bold uppercase drop-shadow-[0_0_8px_rgba(225,29,72,0.4)]">Signal Reçu ✓</span>
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isGettingLocation}
                      className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all border border-white/5 active:scale-95"
                    >
                      <MapPin size={16} className={isGettingLocation ? 'animate-pulse text-[#e11d48]' : 'text-[#e11d48]'} />
                      {isGettingLocation ? 'Localisation...' : 'Utiliser ma position actuelle'}
                    </button>
                    {(formData.latitude || formData.longitude) && (
                      <p className="text-[8px] text-zinc-600 font-mono text-center">
                        Lat: {formData.latitude} | Lng: {formData.longitude}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 block mb-2">Photo de la façade</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-800 rounded-[12px] cursor-pointer hover:bg-[#1a1a1a] hover:border-[#e11d48]/30 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-8 h-8 mb-2 text-zinc-600" />
                          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">Joindre photo façade</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-6 sticky bottom-0 bg-zinc-950">
                  <button 
                    type="submit"
                    className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white font-black py-5 rounded-[12px] text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#e11d48]/20 active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <Send size={18} />
                    Envoyer sur WhatsApp
                  </button>
                  <p className="text-[9px] text-zinc-600 text-center mt-4 uppercase font-bold tracking-tight pb-4">
                    Les établissements sont soumis à validation avant apparition sur la carte
                  </p>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-16 text-center space-y-8">
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-bebas uppercase tracking-tight">Merci !</h2>
                <p className="text-base text-zinc-400 font-medium leading-relaxed italic">
                  Votre proposition a été envoyée. Nous vérifions les informations avant de l'ajouter à <span className="text-[#e11d48] font-black">REDLIGHT</span>.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-full bg-[#1a1a1a] hover:bg-zinc-900 text-white font-black py-5 rounded-[12px] text-xs uppercase tracking-widest transition-all border border-white/5 active:scale-95"
              >
                Fermer
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubmitHotelModal;
