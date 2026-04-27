import React from 'react';
import { Hotel } from '../types/hotel';
import { ForumMessage } from '../types/forum';
import { motion } from 'motion/react';
import { X, Wifi, Car, EyeOff, MapPin, Wind, Thermometer, Phone, MessageCircle, Edit, Lightbulb, Star, ExternalLink, Clock, Zap, Moon } from 'lucide-react';
import { OWNER_WHATSAPP } from '../constants';

interface HotelDetailPanelProps {
  hotel: Hotel;
  onClose: () => void;
  forumMessages?: ForumMessage[];
  onViewForum?: () => void;
}

const HotelDetailPanel: React.FC<HotelDetailPanelProps> = ({ hotel, onClose, forumMessages = [], onViewForum }) => {
  // Calculate average rating
  const hotelReviews = forumMessages.filter(m => m.hotelId === hotel.id);
  const avgRating = hotelReviews.length > 0 
    ? Math.round(hotelReviews.reduce((acc, curr) => acc + curr.rating, 0) / hotelReviews.length) 
    : 4; // Default to 4 if new
  
  const isNew = hotelReviews.length === 0;

  const handleItinerary = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hotel.Latitude},${hotel.Longitude}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ x: '100%', y: 0 }}
      animate={{ x: 0, y: 0 }}
      exit={{ x: '100%', y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed md:absolute right-0 top-0 bottom-0 w-full md:w-80 glass p-6 shadow-2xl z-[1001] flex flex-col overflow-y-auto"
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-zinc-500 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
      >
        <X size={20} />
      </button>

      <div className="mb-8 mt-4">
        <div className="flex justify-between items-start mb-3">
          <span className="tag">Cat: Économique</span>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase font-black tracking-tighter ${
              hotel.isFull ? 'text-zinc-600' : hotel.Statut_Actuel === 'Fermé' ? 'text-zinc-600' : 'text-green-500'}`}>
              {hotel.isFull ? 'Complet (Éteint)' : hotel.Statut_Actuel === 'Fermé' ? 'Fermé' : 'Disponible'}
            </span>
            <Lightbulb 
              size={14} 
              className={
                hotel.isFull || hotel.Statut_Actuel === 'Fermé' 
                ? 'text-zinc-700' 
                : 'text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]'
              } 
            />
          </div>
        </div>
        <h2 className="text-2xl font-black leading-tight tracking-tight mb-2 uppercase">{hotel.Nom}</h2>
        
        {/* RATING */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                size={14} 
                fill={avgRating >= s ? "#fbbf24" : "transparent"} 
                className={avgRating >= s ? "text-amber-400" : "text-zinc-800"} 
              />
            ))}
          </div>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            {isNew ? 'Nouveau' : `${avgRating}/5`}
          </span>
          {onViewForum && (
            <button 
              onClick={onViewForum}
              className="text-[9px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest ml-auto flex items-center gap-1 group"
            >
              Avis <ExternalLink size={10} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        <p className="text-zinc-400 text-xs italic mt-1 flex items-center gap-1 font-medium pb-4 border-b border-zinc-800/50">
          <MapPin size={14} className="text-zinc-600" />
          {hotel.Commune}, {hotel.Quartier}
        </p>

        {/* HORAIRES */}
        <div className="mt-4 space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block pl-1">
            Horaires Habituels
          </label>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between bg-zinc-900/60 p-3 rounded-xl border border-white/5 hover:border-red-900/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-red-500/10 rounded-lg text-red-500">
                  <Zap size={14} fill="currentColor" fillOpacity={0.2} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">⚡ Passage</p>
                  <p className="text-[12px] font-black text-zinc-200">12h00 – 23h00</p>
                </div>
              </div>
              <span className="text-[8px] font-bold text-zinc-600 uppercase bg-zinc-800/50 px-2 py-0.5 rounded-full">Rapide</span>
            </div>

            <div className="flex items-center justify-between bg-zinc-900/60 p-3 rounded-xl border border-white/5 hover:border-red-900/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
                  <Moon size={14} fill="currentColor" fillOpacity={0.2} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">🌙 Dormant</p>
                  <p className="text-[12px] font-black text-zinc-200">23h00 – 12h00</p>
                </div>
              </div>
              <span className="text-[8px] font-bold text-zinc-600 uppercase bg-zinc-800/50 px-2 py-0.5 rounded-full">Nuitée</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 flex-1">
        {/* Tarifs Heure */}
        <div className="space-y-2">
           <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
            Tarifs / Heure
          </label>
          <div className="grid grid-cols-2 gap-4 text-center border-y border-zinc-800 py-6">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-zinc-600 mb-1">
                <Wind size={12} />
                <p className="text-[10px] font-black uppercase">Ventilé</p>
              </div>
              <p className="text-2xl font-black text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.2)]">
                {hotel.Prix_Heure_Ventile > 0 ? hotel.Prix_Heure_Ventile.toLocaleString() : '-'}
              </p>
              <p className="text-[9px] text-zinc-600 font-bold tracking-widest uppercase">CFA</p>
            </div>
            <div className="space-y-1 border-l border-zinc-800">
              <div className="flex items-center justify-center gap-1 text-zinc-600 mb-1">
                <Thermometer size={12} />
                <p className="text-[10px] font-black uppercase">Clim</p>
              </div>
              <p className="text-2xl font-black text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.2)]">
                {hotel.Prix_Heure_Clim > 0 ? hotel.Prix_Heure_Clim.toLocaleString() : '-'}
              </p>
              <p className="text-[9px] text-zinc-600 font-bold tracking-widest uppercase">CFA</p>
            </div>
          </div>
        </div>

        {/* Tarifs Nuit */}
        <div className="space-y-2">
           <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
            Tarifs / Nuit
          </label>
          <div className="grid grid-cols-2 gap-4 text-center border-b border-zinc-800 pb-6">
            <div className="space-y-1">
              <p className="text-xl font-black text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.1)]">
                {hotel.Prix_Nuit_Ventile > 0 ? hotel.Prix_Nuit_Ventile.toLocaleString() : '-'}
              </p>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Ventilé</p>
            </div>
            <div className="space-y-1 border-l border-zinc-800">
              <p className="text-xl font-black text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.1)]">
                {hotel.Prix_Nuit_Clim > 0 ? hotel.Prix_Nuit_Clim.toLocaleString() : '-'}
              </p>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Clim</p>
            </div>
          </div>
        </div>

        {/* Commodités */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
            Commodités
          </label>
          <div className="flex items-center justify-between text-xs p-2 bg-white/5 rounded border border-white/5">
            <span className="text-zinc-400 flex items-center gap-2">
              <Wifi size={14} /> Wifi Gratuit
            </span>
            <span className={hotel.Wifi ? 'text-green-500 font-bold' : 'text-zinc-600'}>
              {hotel.Wifi ? 'OUI' : 'NON'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs p-2 bg-white/5 rounded border border-white/5">
            <span className="text-zinc-400 flex items-center gap-2">
              <Car size={14} /> Parking Interne
            </span>
            <span className={hotel.Parking ? 'text-green-500 font-bold' : 'text-zinc-600'}>
              {hotel.Parking ? 'OUI' : 'NON'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs p-2 bg-white/5 rounded border border-white/5">
            <span className="text-zinc-400 flex items-center gap-2">
              <EyeOff size={14} /> Entrée Discrète
            </span>
            <span className={hotel.Discret_Entree ? 'text-red-500 font-bold font-serif italic' : 'text-zinc-600'}>
              {hotel.Discret_Entree ? 'TOP SECRET' : 'OUI'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {hotel.Telephone && (
          <>
            <a 
              href={`tel:${hotel.Telephone}`}
              className="w-full bg-zinc-100 hover:bg-white text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
            >
              <Phone size={18} />
              APPELER POUR RÉSERVER
            </a>
            
            <a 
              href={`https://wa.me/${hotel.Telephone.replace(/\s+/g, '')}?text=${encodeURIComponent(`Bonjour, j'aimerais réserver une chambre à l'hôtel ${hotel.Nom} via REDLIGHT.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-900/20"
            >
              <MessageCircle size={18} />
              RÉSERVER SUR WHATSAPP
            </a>
          </>
        )}
        
        <button 
          onClick={handleItinerary}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-900/30"
        >
          <MapPin size={18} />
          ITINÉRAIRE GPS
        </button>

        <a 
          href={`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(`Bonjour RedLight, je suis le gérant de l'établissement ${hotel.Nom}. Je souhaite mettre à jour mes informations.`)}`}
          target="_blank"
          rel="noreferrer"
          className="w-full py-2 text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center justify-center gap-1 transition-colors underline decoration-zinc-800"
        >
          Modifier les infos (Gérants)
        </a>
      </div>
    </motion.div>
  );
};

export default HotelDetailPanel;
