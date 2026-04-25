/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Map as MapIcon, MessageSquare, Home, Navigation, ShieldCheck, Star, Building2, CheckCircle2, Lightbulb, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import HotelDetailPanel from './components/HotelDetailPanel';
import hotelsData from './data/hotels.json';
import { Hotel } from './types/hotel';
import { ForumMessage } from './types/forum';
import { OWNER_WHATSAPP, ABIDJAN_COMMUNES } from './constants';

const hotels = hotelsData as Hotel[];

// Extract Navbar into a separate component for better performance
const Navbar = ({ 
  page, 
  setPage, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}: { 
  page: string; 
  setPage: (p: any) => void; 
  mobileMenuOpen: boolean; 
  setMobileMenuOpen: (o: boolean) => void;
}) => (
  <nav className="p-6 flex justify-between items-center border-b border-white/5 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-50">
    <h1 onClick={() => { setPage('home'); setMobileMenuOpen(false); }} className="text-2xl font-black tracking-tighter text-red-600 flex items-center gap-2 cursor-pointer transition-transform active:scale-95">
      <Lightbulb size={24} className="fill-red-600 text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
      REDLIGHT
    </h1>
    <div className="space-x-8 hidden md:flex items-center text-[10px] uppercase tracking-[0.2em] font-black italic">
      <button onClick={() => setPage('home')} className={`transition ${page === 'home' ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`}>Accueil</button>
      <button onClick={() => setPage('map')} className={`transition ${page === 'map' ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`}>La Carte</button>
      <button onClick={() => setPage('forum')} className={`transition ${page === 'forum' ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`}>Communauté</button>
      <button onClick={() => setPage('managers')} className={`transition px-4 py-2 rounded border border-white/5 bg-white/5 hover:bg-white/10 ${page === 'managers' ? 'text-red-500 border-red-500/30 bg-red-500/5' : 'text-zinc-500 hover:text-white'}`}>Espace Gérants</button>
    </div>
    <button 
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
      className="md:hidden text-xs font-black uppercase tracking-widest border border-white/10 px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400"
    >
      {mobileMenuOpen ? 'Fermer' : 'Menu'}
    </button>

    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-zinc-950 border-b border-white/10 p-8 flex flex-col gap-6 md:hidden z-50 shadow-2xl"
        >
          <button onClick={() => { setPage('home'); setMobileMenuOpen(false); }} className={`text-left text-xs font-black uppercase tracking-[0.2em] ${page === 'home' ? 'text-red-500' : 'text-zinc-400'}`}>Accueil</button>
          <button onClick={() => { setPage('map'); setMobileMenuOpen(false); }} className={`text-left text-xs font-black uppercase tracking-[0.2em] ${page === 'map' ? 'text-red-500' : 'text-zinc-400'}`}>La Carte</button>
          <button onClick={() => { setPage('forum'); setMobileMenuOpen(false); }} className={`text-left text-xs font-black uppercase tracking-[0.2em] ${page === 'forum' ? 'text-red-500' : 'text-zinc-400'}`}>Communauté</button>
          <button onClick={() => { setPage('managers'); setMobileMenuOpen(false); }} className={`text-left text-xs font-black uppercase tracking-[0.2em] ${page === 'managers' ? 'text-red-500' : 'text-zinc-400'}`}>Espace Gérants</button>
        </motion.div>
      )}
    </AnimatePresence>
  </nav>
);

export default function App() {
  const [page, setPage] = useState<'home' | 'map' | 'forum' | 'managers'>('home');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedCommune, setSelectedCommune] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(6000); // Default to a reasonable passage budget
  const [showOnlyAvailable, setShowOnlyAvailable] = useState<boolean>(true); // Default to true for better UX
  
  const [forumMessages, setForumMessages] = useState<ForumMessage[]>([
    { id: 1, user: 'Kouassi92', neighborhood: 'Yopougon', text: 'Hôtel La Mahinda vraiment propre pour le prix (2000 f/h). Idéal pour un passage rapide.', time: 'Il y a 2h', rating: 4, hotelId: '1' },
    { id: 2, user: 'Awa_B', neighborhood: 'Marcory', text: 'Les prix ont été mis à jour à Marcory. Attention, certains établissements sont fermés le lundi.', time: 'Il y a 5h', rating: 5, hotelId: '2' },
    { id: 3, user: 'Moussa_G', neighborhood: 'Cocody', text: 'Une adresse discrète à me conseiller vers Angré ? Budget 15k la nuit.', time: 'Hier', rating: 3, hotelId: '3' }
  ]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => {
      const matchCommune = selectedCommune ? hotel.Commune === selectedCommune : true;
      // Filter by any available hourly rate that is under the budget
      const matchPrice = (hotel.Prix_Heure_Clim > 0 && hotel.Prix_Heure_Clim <= maxPrice) || 
                         (hotel.Prix_Heure_Ventile > 0 && hotel.Prix_Heure_Ventile <= maxPrice);
      const matchAvailability = showOnlyAvailable ? !hotel.isFull && hotel.Statut_Actuel === 'Ouvert' : true;
      return matchCommune && matchPrice && matchAvailability;
    });
  }, [selectedCommune, maxPrice, showOnlyAvailable]);

  const communes = useMemo(() => {
    return Array.from(new Set(hotels.map(h => h.Commune))).sort();
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: 'REDLIGHT Abidjan',
      text: "Trouve ton passage (12h-23h) ou ton dormant (23h-12h) en un clic sur REDLIGHT !",
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Lien copié ! Partage-le à tes amis.');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };
  // --- COMPOSANT PAGE D'ACCUEIL ---
  const HomePage = () => {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15,
          delayChildren: 0.2
        }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
      }
    };

    return (
      <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-x-hidden border-x-[12px] md:border-x-[24px] border-[#1a1a1a]">
        <Navbar page={page} setPage={setPage} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        <motion.main 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto px-6 py-20 text-center relative"
        >
          {/* Animated Background Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600 rounded-full blur-[140px] pointer-events-none z-0" 
          />
          
          <motion.h2 
            variants={itemVariants}
            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none relative z-10 italic uppercase"
          >
            {"ABIDJAN LA NUIT,".split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.5 }}
              >
                {char}
              </motion.span>
            ))}
            <br />
            <motion.span 
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className="text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.4)] inline-block mt-2"
            >
              {"EN TOUTE SIMPLICITÉ.".split("").map((char, index) => (
                <motion.span
                  key={index}
                  animate={{ 
                    opacity: [1, 0.4, 1],
                    textShadow: ["0 0 10px rgba(220,38,38,0.4)", "0 0 20px rgba(220,38,38,0.8)", "0 0 10px rgba(220,38,38,0.4)"] 
                  }}
                  transition={{ 
                    delay: 1 + (index * 0.05), 
                    duration: 2, 
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-zinc-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium relative z-10 italic"
          >
            Découvrez les meilleurs établissements économiques à Yopougon et partout ailleurs. 
            Une cartographie discrète pour un confort immédiat.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 relative z-10"
          >
            <button 
              onClick={() => setPage('map')}
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-red-900/20 active:scale-95"
            >
              <MapIcon size={18} />
              Ouvrir la Carte
            </button>
            <button 
              onClick={() => setPage('forum')}
              className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 px-10 py-5 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95"
            >
              <MessageSquare size={18} />
              Rejoindre le Forum
            </button>
          </motion.div>

          {/* Features */}
          <motion.div 
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-8 mt-40 text-left relative z-10"
          >
            {[
              { icon: Lightbulb, title: "Ampoules Libres", desc: "Visualisez instantanément quels établissements ont encore des chambres disponibles sur la carte.", fill: true },
              { icon: ShieldCheck, title: "Discrétion Totale", desc: "Une interface sobre et rapide, pensée pour une utilisation mobile efficace et privée." },
              { icon: Home, title: "Tarifs Directs", desc: "Consultez les tarifs mis à jour par la communauté REDLIGHT en temps réel." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-zinc-900/50 rounded-2xl border border-white/5 backdrop-blur-sm group hover:border-red-900/30 transition-colors"
              >
                <feature.icon size={32} className={`text-red-600 mb-6 group-hover:scale-110 transition-transform ${feature.fill ? 'fill-red-600/20' : ''}`} />
                <h3 className="text-lg font-black mb-3 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.main>

        <footer className="p-10 border-t border-white/5 mt-20 text-center text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
          © 2026 REDLIGHT ABIDJAN - TOUS DROITS RÉSERVÉS
        </footer>
      </div>
    );
  };

  // --- COMPOSANT PAGE FORUM ---
  const ForumPage = () => {
    const [newMessage, setNewMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const handlePublish = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim() || rating === 0) return;

      const post: ForumMessage = {
        id: Date.now(),
        user: 'Anonyme',
        neighborhood: selectedCommune || 'Abidjan',
        text: newMessage,
        time: 'À l\'instant',
        rating: rating,
        hotelId: undefined
      };

      setForumMessages([post, ...forumMessages]);
      setNewMessage('');
      setRating(0);
    };

    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 text-white font-sans overflow-x-hidden border-x-[12px] md:border-x-[24px] border-[#1a1a1a]">
        <Navbar page={page} setPage={setPage} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        <main className="max-w-2xl mx-auto px-6 py-12 w-full flex-1">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase italic text-red-500">Communauté</h2>
            <p className="text-zinc-500 text-sm italic">Échanges discrets entre membres REDLIGHT.</p>
          </div>

          {/* Formulaire d'envoi */}
          <form onSubmit={handlePublish} className="mb-12 space-y-6">
            <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5 space-y-6 backdrop-blur-sm">
              <div className="flex flex-col items-center md:items-start gap-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Votre Note</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform active:scale-90 hover:scale-110"
                    >
                      <Star 
                        size={28} 
                        fill={(hoverRating || rating) >= star ? "#fbbf24" : "transparent"} 
                        className={(hoverRating || rating) >= star ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" : "text-zinc-700"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Partagez un avis, un prix ou une adresse..."
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-red-600 transition-all min-h-[120px] resize-none"
                />
                <div className="absolute right-4 bottom-4">
                  <button 
                    type="submit"
                    disabled={!newMessage.trim() || rating === 0}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 text-white p-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-900/20"
                  >
                    <Navigation size={18} className="rotate-90" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest px-2">
                <ShieldCheck size={12} />
                Publication Anonyme Activée
              </div>
            </div>
          </form>

          {/* Feed des messages */}
          <div className="space-y-6">
            {forumMessages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-900/20 flex items-center justify-center text-red-500 border border-red-900/30">
                      <MessageSquare size={14} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black tracking-tight">{msg.user}</h4>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={10} 
                              fill={msg.rating >= star ? "#fbbf24" : "transparent"} 
                              className={msg.rating >= star ? "text-amber-400" : "text-zinc-800"} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{msg.neighborhood}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-medium">{msg.time}</span>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {msg.text}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 flex gap-4">
                   <button className="text-[10px] font-bold text-zinc-600 hover:text-red-500 transition uppercase tracking-widest">Utile</button>
                   <button className="text-[10px] font-bold text-zinc-600 hover:text-zinc-400 transition uppercase tracking-widest">Répondre</button>
                </div>
              </motion.div>
            ))}
          </div>
        </main>

        <footer className="p-10 border-t border-white/5 text-center text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
          L'espace forum est modéré pour garantir la sécurité de la communauté.
        </footer>
      </div>
    );
  };

  // --- COMPOSANT PAGE GÉRANTS ---
  const ManagersPage = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
      Nom: '',
      Commune: '',
      Quartier: '',
      Telephone: '',
      Prix_Heure_Ventile: '',
      Prix_Heure_Clim: '',
      Prix_Nuit_Ventile: '',
      Prix_Nuit_Clim: '',
      Wifi: false,
      Parking: false,
      Discret_Entree: true
    });

    const toggleAmenity = (key: 'Wifi' | 'Parking' | 'Discret_Entree') => {
      setFormData(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = (e: React.FormEvent, isFullUpdate = false) => {
      if (e) e.preventDefault();
      
      const services = [];
      if (formData.Wifi) services.push('Wifi');
      if (formData.Parking) services.push('Parking');
      if (formData.Discret_Entree) services.push('Entrée Discrète');
      
      let message = "";
      if (isFullUpdate) {
        message = `Bonjour REDLIGHT, je suis le gérant de l'établissement : ${formData.Nom}. JE SOUHAITE ÉTEINDRE MON AMPOULE CAR MON ÉTABLISSEMENT EST COMPLET.`;
      } else {
        message = `Bonjour REDLIGHT, je souhaite ajouter mon établissement : ${formData.Nom} | Commune : ${formData.Commune} | Quartier : ${formData.Quartier} | Tarifs : H.Ventilé ${formData.Prix_Heure_Ventile}F, H.Clim ${formData.Prix_Heure_Clim}F, N.Ventilé ${formData.Prix_Nuit_Ventile}F, N.Clim ${formData.Prix_Nuit_Clim}F | Services : ${services.join(', ')}.`;
      }
      
      const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      setSubmitted(true);
    };

    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 text-white font-sans overflow-x-hidden border-x-[12px] md:border-x-[24px] border-[#1a1a1a]">
        <Navbar page={page} setPage={setPage} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        <main className="max-w-4xl mx-auto px-6 py-16 w-full flex-1">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6 border border-red-600/20">
                    <Building2 size={32} />
                  </div>
                  <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase italic text-red-500">Espace Partenaires</h2>
                  <p className="text-zinc-500 max-w-lg mx-auto font-medium italic">Référencez votre établissement sur la carte <span className="text-red-500 font-black">REDLIGHT</span> pour capter une clientèle locale ciblée.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-zinc-900/30 border border-white/5 rounded-[40px] p-8 md:p-12 backdrop-blur-xl shadow-2xl space-y-10">
                  {/* Informations Générales */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-red-600 uppercase tracking-[0.3em] pl-2 border-l-2 border-red-600">Informations Générales</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Nom de l'établissement</label>
                        <input 
                          required
                          type="text"
                          placeholder="Ex: Résidence Emeraude"
                          className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-red-600 transition-all font-medium"
                          value={formData.Nom}
                          onChange={e => setFormData({...formData, Nom: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Téléphone (WhatsApp)</label>
                         <input 
                           required
                           type="tel"
                           placeholder="Ex: 0707..."
                           className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-red-600 transition-all font-medium"
                           value={formData.Telephone}
                           onChange={e => setFormData({...formData, Telephone: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Commune</label>
                         <select 
                          required
                          className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-red-600 transition-all font-medium appearance-none"
                          value={formData.Commune}
                          onChange={e => setFormData({...formData, Commune: e.target.value})}
                         >
                           <option value="">Sélectionnez une commune</option>
                           {ABIDJAN_COMMUNES.map(c => (
                             <option key={c} value={c}>{c}</option>
                           ))}
                         </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Quartier Précis</label>
                        <input 
                          required
                          type="text"
                          placeholder="Ex: Riviera Palmeraie"
                          className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-red-600 transition-all font-medium"
                          value={formData.Quartier}
                          onChange={e => setFormData({...formData, Quartier: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grille Tarifaire */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-red-600 uppercase tracking-[0.3em] pl-2 border-l-2 border-red-600">Grille Tarifaire (FCFA)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2">Heure (Ventilé)</label>
                        <input type="number" placeholder="2000" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:border-red-600" value={formData.Prix_Heure_Ventile} onChange={e => setFormData({...formData, Prix_Heure_Ventile: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2">Heure (Clim)</label>
                        <input type="number" placeholder="4000" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:border-red-600" value={formData.Prix_Heure_Clim} onChange={e => setFormData({...formData, Prix_Heure_Clim: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2">Nuit (Ventilé)</label>
                        <input type="number" placeholder="8000" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:border-red-600" value={formData.Prix_Nuit_Ventile} onChange={e => setFormData({...formData, Prix_Nuit_Ventile: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2">Nuit (Clim)</label>
                        <input type="number" placeholder="15000" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:border-red-600" value={formData.Prix_Nuit_Clim} onChange={e => setFormData({...formData, Prix_Nuit_Clim: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* Commodités */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-red-600 uppercase tracking-[0.3em] pl-2 border-l-2 border-red-600">Équipements & Services</h3>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { key: 'Wifi', label: 'Wifi Gratuit' },
                        { key: 'Parking', label: 'Parking Privé' },
                        { key: 'Discret_Entree', label: 'Entrée Discrète' }
                      ].map(item => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => toggleAmenity(item.key as any)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                            formData[item.key as keyof typeof formData] === true
                            ? 'bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                            : 'bg-zinc-950/50 border-zinc-800 text-zinc-600 hover:border-zinc-700'
                          }`}
                        >
                          {formData[item.key as keyof typeof formData] === true ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 bg-red-950/10 border border-red-900/20 rounded-3xl flex gap-4">
                    <Navigation className="text-red-600 shrink-0 mt-1" size={18} />
                    <p className="text-[11px] text-zinc-400 font-medium leading-relaxed italic">
                      Les coordonnées GPS seront relevées sur place par nos agents ou vérifiées via vos photos pour garantir l'exactitude des épingles rouges sur la carte officielle.
                    </p>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-6 rounded-3xl text-sm uppercase tracking-[0.3em] transition-all shadow-2xl shadow-red-900/40 active:scale-[0.98] mt-4"
                  >
                    Soumettre mon établissement
                  </button>

                  <div className="pt-8 border-t border-white/5">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center mb-4">Déjà partenaire ?</p>
                    <button 
                      type="button"
                      onClick={() => handleSubmit(null as any, true)}
                      className="w-full bg-zinc-100 hover:bg-white text-black font-black py-5 rounded-3xl text-xs uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                      <Lightbulb size={18} className="fill-black" />
                      SIGNALEZ MON HÔTEL COMME COMPLET
                    </button>
                    <p className="text-[9px] text-zinc-600 text-center mt-3 font-medium uppercase tracking-tighter italic">Cliquer ici éteindra instantanément votre ampoule sur la carte REDLIGHT.</p>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 px-8 bg-zinc-900/40 rounded-[40px] border border-white/5 backdrop-blur-sm"
              >
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Demande envoyée !</h2>
                <p className="text-zinc-400 max-w-sm mx-auto mb-10 leading-relaxed font-medium italic">
                  Merci ! Votre établissement est en cours de vérification. <span className="text-red-500 font-black">REDLIGHT</span> vous répondra sur WhatsApp pour finaliser l'ajout sur la carte officielle.
                </p>
                <button 
                  onClick={() => setPage('home')}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 border border-white/5"
                >
                  Retour à l'accueil
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="p-10 border-t border-white/5 text-center text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
          Les partenariats REDLIGHT sont soumis à une charte de qualité et de discrétion.
        </footer>
      </div>
    );
  };

  // --- RENDU FINAL ---
  return (
    <div className="bg-[#050505] min-h-screen flex flex-col">
      {page === 'home' && <HomePage />}
      
      {page === 'map' && (
        <div className="flex-1 flex flex-col overflow-hidden text-[#e5e5e5] font-sans relative border-x-[12px] md:border-x-[24px] border-[#1a1a1a]">
          <Navbar page={page} setPage={setPage} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          
          <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
            {/* Sidebar - Filtres et Liste */}
            <Sidebar 
              communes={communes}
              selectedCommune={selectedCommune}
              setSelectedCommune={setSelectedCommune}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              hotels={filteredHotels}
              selectedHotel={selectedHotel}
              onHotelClick={setSelectedHotel}
            />

            {/* Boutons Utilitaires Carte */}
            <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 pointer-events-none">
              <div className="flex gap-2 pointer-events-auto">
                <button 
                  onClick={() => setPage('home')}
                  className="bg-black/90 hover:bg-black text-white px-4 py-2.5 rounded-xl shadow-2xl border border-zinc-800 text-[10px] uppercase font-black tracking-widest transition-all active:scale-95"
                >
                  ← Accueil
                </button>
                <button 
                  onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
                  className={`px-4 py-2.5 rounded-xl shadow-2xl border text-[10px] uppercase font-black tracking-widest transition-all active:scale-95 flex items-center gap-2 ${
                    showOnlyAvailable 
                    ? 'bg-red-600/20 border-red-600 text-red-500' 
                    : 'bg-black/90 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <Lightbulb size={12} className={showOnlyAvailable ? "fill-red-500" : ""} />
                  {showOnlyAvailable ? "Disponibles" : "Tous"}
                </button>
              </div>
            </div>

            {/* Bouton Partage Flottant Spécifique Carte */}
            <button
              onClick={handleShare}
              className="absolute bottom-32 md:bottom-10 right-4 z-50 bg-red-600 hover:bg-red-700 text-white p-3.5 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 group border border-white/10"
              title="Partager REDLIGHT"
            >
              <Share2 size={24} className="group-hover:rotate-12 transition-transform" />
            </button>

            {/* Main Content - Map */}
            <main className="flex-1 relative overflow-hidden bg-zinc-950 min-h-[400px] md:h-full border-l border-red-900/10">
              <Map 
                hotels={filteredHotels} 
                onHotelClick={setSelectedHotel} 
                selectedHotel={selectedHotel}
              />

              {/* Legend Panel - Hide on small mobile */}
              <div className="hidden sm:flex absolute top-4 right-4 z-10 bg-black/90 p-2.5 rounded-xl border border-zinc-800 gap-4 text-[9px] uppercase font-black tracking-widest">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_#ff0000]"></div>
                  <span>Ouvert</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                  <span>Fermé</span>
                </div>
              </div>

              {/* Detail Panel */}
              <AnimatePresence>
                {selectedHotel && (
                  <HotelDetailPanel 
                    hotel={selectedHotel} 
                    onClose={() => setSelectedHotel(null)} 
                    forumMessages={forumMessages}
                    onViewForum={() => setPage('forum')}
                  />
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      )}

      {page === 'forum' && <ForumPage />}
      {page === 'managers' && <ManagersPage />}

      {/* Bouton de Partage Flottant - Visible partout sauf sur la carte (où il y a déjà beaucoup de boutons) */}
      {page !== 'map' && (
        <button
          onClick={handleShare}
          className="fixed bottom-8 right-8 z-50 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl shadow-red-900/40 transition-all hover:scale-110 active:scale-95 flex items-center justify-center group border border-red-500/20"
          title="Partager REDLIGHT"
        >
          <Share2 size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 text-[10px] font-black uppercase tracking-widest">Partager</span>
        </button>
      )}
    </div>
  );
}
