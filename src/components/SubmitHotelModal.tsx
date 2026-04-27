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
    prixPassage: '',
    prixDormant: '',
    latitude: '',
    longitude: '',
  });

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        alert("Impossible de récupérer la position. Veuillez l'autoriser dans votre navigateur.");
      });
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `PROPOSITION NOUVEL ÉTABLISSEMENT%0A%0A` +
      `Nom: ${formData.nom}%0A` +
      `Commune: ${formData.commune}%0A` +
      `Quartier: ${formData.quartier}%0A` +
      `Prix Passage: ${formData.prixPassage} F%0A` +
      `Prix Dormant: ${formData.prixDormant} F%0A` +
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
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl"
        >
          {!submitted ? (
            <div className="flex flex-col h-[85vh] md:h-auto">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-950 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <Plus size={20} className="text-red-500" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-red-500">Proposer un établissement</h2>
                </div>
                <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 block mb-1.5">Nom de l'établissement</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-red-600 transition-all"
                      placeholder="Ex: Hôtel Pleine Lune"
                      value={formData.nom}
                      onChange={e => setFormData({...formData, nom: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 block mb-1.5">Commune</label>
                      <select 
                        required
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-red-600 transition-all appearance-none"
                        value={formData.commune}
                        onChange={e => setFormData({...formData, commune: e.target.value})}
                      >
                        <option value="">Choisir...</option>
                        {ABIDJAN_COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 block mb-1.5">Quartier</label>
                      <input 
                        required
                        type="text"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-red-600 transition-all"
                        placeholder="Ex: Angré"
                        value={formData.quartier}
                        onChange={e => setFormData({...formData, quartier: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 block mb-1.5">Prix Passage (H)</label>
                      <input 
                        required
                        type="number"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-red-600 transition-all"
                        placeholder="Ex: 5000"
                        value={formData.prixPassage}
                        onChange={e => setFormData({...formData, prixPassage: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 block mb-1.5">Prix Dormant (N)</label>
                      <input 
                        required
                        type="number"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-red-600 transition-all"
                        placeholder="Ex: 15000"
                        value={formData.prixDormant}
                        onChange={e => setFormData({...formData, prixDormant: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Position GPS</label>
                      {formData.latitude && (
                        <span className="text-[9px] text-green-500 font-bold uppercase">Signal Reçu ✓</span>
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isGettingLocation}
                      className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/5 active:scale-95"
                    >
                      <MapPin size={14} className={isGettingLocation ? 'animate-pulse' : ''} />
                      {isGettingLocation ? 'Localisation...' : 'Utiliser ma position actuelle'}
                    </button>
                    {(formData.latitude || formData.longitude) && (
                      <p className="text-[8px] text-zinc-600 font-mono text-center">
                        Lat: {formData.latitude} | Lng: {formData.longitude}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 block mb-1.5">Photo de la façade</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-800 rounded-2xl cursor-pointer hover:bg-zinc-900/50 hover:border-red-600/30 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-8 h-8 mb-2 text-zinc-600" />
                          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-tighter">Joindre photo façade</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 sticky bottom-0 bg-zinc-950">
                  <button 
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-900/20 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Send size={16} />
                    Envoyer sur WhatsApp
                  </button>
                  <p className="text-[9px] text-zinc-600 text-center mt-4 uppercase font-bold tracking-tight pb-2">
                    Les établissements sont soumis à validation avant apparition sur la carte
                  </p>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Merci !</h2>
                <p className="text-sm text-zinc-500 font-medium italic">
                  Votre proposition a été envoyée. Nous vérifions les informations avant de l'ajouter à <span className="text-red-500 font-black">REDLIGHT</span>.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all"
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
