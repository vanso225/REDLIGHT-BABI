import React from 'react';
import { Hotel } from '../types/hotel';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { List } from 'lucide-react';

interface SidebarProps {
  communes: string[];
  selectedCommune: string | null;
  setSelectedCommune: (commune: string | null) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  onHotelClick: (hotel: Hotel) => void;
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
}) => {
  const [drawerHeight, setDrawerHeight] = React.useState<'min' | 'mid' | 'max'>('mid');
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-reduce on hotel selection on mobile
  React.useEffect(() => {
    if (selectedHotel && isMobile) {
      setDrawerHeight('min');
    }
  }, [selectedHotel, isMobile]);

  const heightClasses = {
    min: 'h-[70px]',
    mid: 'h-[30vh]',
    max: 'h-[85vh]'
  };

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tighter neon-red">REDLIGHT</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Abidjan Budget Census</p>
        </div>
        {isMobile && (
          <button 
            onClick={() => setDrawerHeight(drawerHeight === 'max' ? 'mid' : 'max')}
            className="p-2 bg-zinc-900 rounded-full text-zinc-500"
          >
            <List size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
        {/* Filtres par Commune */}
        <section>
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-3">
            Filtres Commune
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button 
              onClick={() => setSelectedCommune(null)}
              className={`p-2 rounded text-left transition-all ${!selectedCommune ? 'border border-red-900/50 bg-red-950/20 text-red-500' : 'bg-zinc-900 border border-zinc-800 hover:border-red-600'}`}
            >
              Toutes
            </button>
            {communes.map(commune => (
              <button
                key={commune}
                onClick={() => setSelectedCommune(commune)}
                className={`p-2 rounded text-left transition-all ${selectedCommune === commune ? 'border border-red-900/50 bg-red-950/20 text-red-500 font-bold' : 'bg-zinc-900 border border-zinc-800 hover:border-red-600'}`}
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
                  <span className="text-xs font-mono text-zinc-400">
                    {hotel.Prix_Heure_Clim > 0 
                      ? `${hotel.Prix_Heure_Clim.toLocaleString()} CFA / h` 
                      : hotel.Prix_Heure_Ventile > 0 
                        ? `${hotel.Prix_Heure_Ventile.toLocaleString()} CFA / h (Ventilé)` 
                        : 'Tarif ND'}
                  </span>
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
        </section>
      </div>
    </div>
  );

  const dragControls = useDragControls();

  if (isMobile) {
    return (
      <motion.aside
        initial={false}
        animate={{ height: heightClasses[drawerHeight] }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.y > 50) {
            if (drawerHeight === 'max') setDrawerHeight('mid');
            else if (drawerHeight === 'mid') setDrawerHeight('min');
          } else if (info.offset.y < -50) {
            if (drawerHeight === 'min') setDrawerHeight('mid');
            else if (drawerHeight === 'mid') setDrawerHeight('max');
          }
        }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950 border-t border-zinc-800 rounded-t-[32px] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
      >
        {/* Handle bar - Using dragControls to trigger drawer drag */}
        <div 
          className="w-full h-10 flex items-center justify-center cursor-grab active:cursor-grabbing border-b border-white/5 shrink-0 touch-none"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="w-12 h-1.5 bg-zinc-800 rounded-full" />
        </div>
        {sidebarContent}
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
