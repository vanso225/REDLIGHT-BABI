import React from 'react';
import { Hotel } from '../types/hotel';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { List, X, Search, Plus } from 'lucide-react';

interface SidebarProps {
  communes: string[];
  selectedCommune: string | null;
  setSelectedCommune: (commune: string | null) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  onHotelClick: (hotel: Hotel) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSubmitModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  communes,
  selectedCommune,
  setSelectedCommune,
  maxPrice,
  setMaxPrice,
  hotels,
  selectedHotel,
  onHotelClick,
  searchQuery,
  setSearchQuery,
  onOpenSubmitModal,
}) => {
  const [drawerHeight, setDrawerHeight] = React.useState<'min' | 'max'>('min');
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-expand on hotel selection on mobile to show details
  React.useEffect(() => {
    if (selectedHotel && isMobile) {
      setDrawerHeight('max');
    }
  }, [selectedHotel, isMobile]);

  const heightClasses = {
    min: 'h-[70px]',
    max: 'h-[70vh]'
  };

  const shareText = encodeURIComponent("Trouve ton passage (12h-23h) ou ton dormant (23h-12h) en un clic sur REDLIGHT Abidjan !");
  const shareUrl = encodeURIComponent(window.location.href);
  const whatsappShareUrl = `https://wa.me/?text=${shareText}%20${shareUrl}`;

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search Header for Mobile - Simplified Bottom Sheet Header */}
      {isMobile && drawerHeight === 'min' ? (
        <div 
          onClick={() => setDrawerHeight('max')} 
          className="flex items-center justify-between px-6 py-2 cursor-pointer h-full"
        >
          <div className="flex items-center gap-3">
             <h2 className="text-sm font-black tracking-tight text-red-500 uppercase">Hôtels disponibles</h2>
             <span className="text-[10px] font-bold text-zinc-500 bg-zinc-900 px-2 rounded-full">{hotels.length}</span>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
            <span className="flex items-center gap-1">⚡ Passage</span>
            <span className="flex items-center gap-1">🌙 Dormant</span>
          </div>
        </div>
      ) : (
        <>
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center shrink-0">
            <div>
              <h1 className="text-2xl font-black tracking-tighter neon-red">REDLIGHT</h1>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={onOpenSubmitModal}
                className="p-2 bg-[#e11d48]/10 text-[#e11d48] rounded-full hover:bg-[#e11d48]/20 transition-colors border border-[#e11d48]/20"
                title="Proposer un établissement"
              >
                <Plus size={18} />
              </button>
              <a 
                href={whatsappShareUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-green-600/10 text-green-500 rounded-full hover:bg-green-600/20 transition-colors"
                title="Partager sur WhatsApp"
              >
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </motion.div>
              </a>
              {isMobile && (
                <button 
                  onClick={() => setDrawerHeight('min')}
                  className="p-2 bg-zinc-900 rounded-full text-zinc-500"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Sticky Search Bar - Top of Menu */}
          <div className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 p-6 shrink-0">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#e11d48] transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Rechercher un hôtel ou un quartier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#e11d48]/20 rounded-[12px] py-4 pl-14 pr-12 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50 focus:border-[#e11d48] shadow-2xl transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
            {/* Infos Horaires - New for mobile as requested */}
            {isMobile && (
              <div className="grid grid-cols-2 gap-3 pb-4 border-b border-white/5">
                <div className="bg-[#1a1a1a] p-3 rounded-[12px] border border-white/5">
                  <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">⚡ Passage</p>
                  <p className="text-[10px] font-bold text-zinc-300">12h00 – 23h00</p>
                </div>
                <div className="bg-[#1a1a1a] p-3 rounded-[12px] border border-white/5">
                  <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">🌙 Dormant</p>
                  <p className="text-[10px] font-bold text-zinc-300">23h00 – 12h00</p>
                </div>
              </div>
            )}

        {/* Filtres par Commune */}
        <section>
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-4">
            Filtres Commune
          </label>
          <div className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase tracking-widest">
            <button 
              onClick={() => setSelectedCommune(null)}
              className={`p-3 rounded-[10px] text-left transition-all border ${!selectedCommune ? 'border-[#e11d48] bg-[#e11d48]/10 text-white' : 'bg-[#1a1a1a] border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
            >
              Toutes
            </button>
            {communes.map(commune => (
              <button
                key={commune}
                onClick={() => setSelectedCommune(commune)}
                className={`p-3 rounded-[10px] text-left transition-all border ${selectedCommune === commune ? 'border-[#e11d48] bg-[#e11d48]/10 text-white' : 'bg-[#1a1a1a] border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
              >
                {commune}
              </button>
            ))}
          </div>
        </section>

        {/* Filtre par Prix */}
        <section>
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-3">
            Budget Max (H/Clim)
          </label>
          <input 
            type="range" 
            className="w-full accent-red-600 cursor-pointer" 
            min="2000" 
            max="15000" 
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          />
          <div className="flex justify-between text-[10px] mt-1 text-zinc-500">
            <span>2,000 CFA</span>
            <span className="text-red-500 font-bold">{maxPrice.toLocaleString()} CFA</span>
            <span>15,000 CFA</span>
          </div>
        </section>

        {/* Liste des Hôtels */}
        <section className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
            Hôtels Disponibles ({hotels.length})
          </label>
          
          <AnimatePresence mode="popLayout">
            {hotels.map((hotel) => (
              <motion.div
                key={hotel.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => onHotelClick(hotel)}
                className={`p-3 cursor-pointer rounded-lg border transition-all ${
                  selectedHotel?.id === hotel.id 
                    ? 'bg-red-950/20 border-red-900/50' 
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                } ${hotel.Statut_Actuel === 'Fermé' ? 'opacity-60' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold truncate pr-2">{hotel.Nom}</h3>
                  <span className={`text-[10px] uppercase font-black ${hotel.isFull ? 'text-zinc-600' : hotel.Statut_Actuel === 'Ouvert' ? 'text-red-500' : 'text-zinc-500'}`}>
                    {hotel.isFull ? 'Complet' : hotel.Statut_Actuel}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">{hotel.Quartier}</p>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-zinc-400 flex items-center gap-1">
                      <span className="text-red-500">⚡</span> Passage: {hotel.Prix_Heure_Clim > 0 || hotel.Prix_Heure_Ventile > 0 ? (hotel.Prix_Heure_Clim > 0 ? hotel.Prix_Heure_Clim : hotel.Prix_Heure_Ventile).toLocaleString() : '-'} F
                    </span>
                    <span className="text-[9px] font-black text-zinc-400 flex items-center gap-1">
                      <span className="text-blue-500">🌙</span> Dormant: {hotel.Prix_Nuit_Clim > 0 || hotel.Prix_Nuit_Ventile > 0 ? (hotel.Prix_Nuit_Clim > 0 ? hotel.Prix_Nuit_Clim : hotel.Prix_Nuit_Ventile).toLocaleString() : '-'} F
                    </span>
                  </div>
                  <div className={`w-3 h-3 transition-all ${hotel.isFull ? 'bulb-full' : hotel.Statut_Actuel === 'Ouvert' ? 'bulb-on scale-110' : 'bulb-off opacity-30'}`}>
                     <div className="w-full h-full rounded-full bg-current shadow-[inherit]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {hotels.length === 0 && (
            <div className="text-center py-8 text-zinc-600 text-xs italic">
              Aucun hôtel trouvé pour ces critères.
            </div>
          )}

          <div className="pt-6 pb-12">
            <button 
              onClick={onOpenSubmitModal}
              className="w-full py-5 bg-[#e11d48] hover:bg-[#be123c] text-white rounded-[12px] text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#e11d48]/20 active:scale-[0.98] flex items-center justify-center gap-3 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              Proposer un établissement
            </button>
            <p className="text-[9px] text-zinc-600 text-center mt-4 uppercase font-bold tracking-[0.1em] italic">
              Contribuez à la mise à jour des prix à Abidjan
            </p>
          </div>
        </section>
      </div>
      </>
      )}
    </div>
  );

  const dragControls = useDragControls();

  const drawerVariants = {
    min: { y: 'calc(100% - 70px)' },
    max: { y: 0 }
  };

  if (isMobile) {
    return (
      <motion.aside
        initial="min"
        animate={drawerHeight}
        variants={drawerVariants}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) {
            setDrawerHeight('min');
          } else if (info.offset.y < -100) {
            setDrawerHeight('max');
          }
        }}
        className="fixed bottom-0 left-0 right-0 z-[999] pointer-events-none h-[70vh]"
      >
        <div className="flex flex-col h-full bg-zinc-950 border-t border-zinc-800 rounded-t-[32px] shadow-[0_-20px_40px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto">
          {/* Handle bar - High z-index, touch-none, and clickable to toggle */}
          <div 
            className="w-full h-14 flex items-center justify-center cursor-grab active:cursor-grabbing border-b border-white/5 shrink-0 touch-none z-[70] py-4"
            onPointerDown={(e) => dragControls.start(e)}
            onClick={() => setDrawerHeight(prev => prev === 'min' ? 'max' : 'min')}
          >
            <div className="w-16 h-1.5 bg-zinc-800 rounded-full" />
          </div>
          <div className="flex-1 overflow-hidden">
            {sidebarContent}
          </div>
        </div>
      </motion.aside>
    );
  }

  return (
    <aside className="w-72 flex flex-col border-r border-zinc-800 bg-zinc-950 h-full">
      {sidebarContent}
    </aside>
  );
};

export default Sidebar;
