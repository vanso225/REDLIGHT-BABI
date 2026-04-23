/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Zap, 
  MapPin, 
  Wifi, 
  Car, 
  EyeOff, 
  Plus, 
  Minus, 
  Navigation,
  ChevronDown,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [selectedCommune, setSelectedCommune] = useState('Toutes les communes');
  const [priceRange, setPriceRange] = useState(15000);

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-zinc-100 font-sans overflow-hidden border-4 border-[#1a1a1a] selection:bg-red-600/30">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-red-900/30 bg-zinc-950 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)] flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic text-red-500">
            REDLIGHT <span className="text-zinc-500 font-light italic ml-1">Abidjan</span>
          </h1>
        </div>
        <div className="flex gap-8 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total Recensés</span>
            <span className="text-xl font-mono text-red-500 leading-none">124</span>
          </div>
          <div className="w-10 h-10 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-colors cursor-pointer">
            <Info className="w-5 h-5" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Filters */}
        <aside className="w-72 border-r border-red-900/20 bg-zinc-950 p-6 flex flex-col gap-8 shrink-0 overflow-y-auto">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-red-500/70 font-bold mb-4 block">Commune</label>
            <div className="relative">
              <select 
                value={selectedCommune}
                onChange={(e) => setSelectedCommune(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-sm p-3 rounded appearance-none focus:border-red-600 outline-none cursor-pointer transition-colors"
              >
                <option>Toutes les communes</option>
                <option>Yopougon</option>
                <option>Cocody</option>
                <option>Abobo</option>
                <option>Marcory</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-red-500/70 font-bold mb-4 block">Prix Max (Nuit)</label>
            <input 
              type="range" 
              min="5000" 
              max="25000" 
              step="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full accent-red-600 cursor-pointer" 
            />
            <div className="flex justify-between mt-2 text-[11px] font-mono text-zinc-500">
              <span>5 000 FCFA</span>
              <span className="text-red-400 font-bold">{priceRange.toLocaleString()} FCFA</span>
              <span>25 000 FCFA</span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-4 rounded border border-red-900/30 bg-red-950/10 backdrop-blur-sm">
              <h3 className="text-xs font-bold text-red-500 uppercase mb-2">Statut Temps Réel</h3>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <motion.div 
                  animate={{ opacity: [1, 0.4, 1] }} 
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"
                />
                <span>92 Ouverts actuellement</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main: Map Container */}
        <main className="flex-1 relative bg-zinc-900 overflow-hidden">
          {/* Simulated Map Canvas Background */}
          <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-black/20"></div>
          
          {/* Map Grid Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-px bg-red-900/10"></div>
            <div className="absolute top-0 left-0 w-px h-full bg-red-900/10"></div>
          </div>

          {/* Map Markers */}
          <HotelMarker 
            top="25%" 
            left="33%" 
            name="Hôtel Du Bonheur" 
            status="Ouvert" 
          />
          <HotelMarker 
            top="66%" 
            left="50%" 
            name="Le Relais" 
            status="Fermé" 
          />
          <HotelMarker 
            top="50%" 
            left="66%" 
            name="Espace Ivoire" 
            status="Ouvert" 
          />

          {/* Map Controls */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-2 shadow-2xl">
            <button className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded flex items-center justify-center text-zinc-400 hover:bg-zinc-900 hover:text-red-500 transition-all active:scale-95 shadow-lg">
              <Plus className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded flex items-center justify-center text-zinc-400 hover:bg-zinc-900 hover:text-red-500 transition-all active:scale-95 shadow-lg">
              <Minus className="w-5 h-5" />
            </button>
          </div>
        </main>

        {/* Sidebar: Hotel Details Card */}
        <aside className="w-80 border-l border-red-900/20 bg-zinc-950 p-6 shrink-0 overflow-y-auto">
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-block px-2 py-0.5 rounded bg-red-600 text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              >
                Ouvert
              </motion.span>
              <h2 className="text-2xl font-black mt-2 leading-tight tracking-tight uppercase">HÔTEL DU BONHEUR</h2>
              <p className="text-zinc-500 text-xs italic flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" /> Cocody, Angré 7e Tranche
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 p-3 rounded border border-zinc-800 group hover:border-zinc-700 transition-colors">
                  <p className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Ventilation</p>
                  <p className="text-lg font-mono">5 000 <span className="text-[10px] opacity-50">F</span></p>
                  <p className="text-[9px] text-zinc-500 italic uppercase">Par heure</p>
                </div>
                <div className="bg-zinc-900 p-3 rounded border border-red-900/30 bg-red-950/10 group hover:bg-red-950/20 transition-colors">
                  <p className="text-[10px] uppercase text-red-500 font-bold mb-1">Climatisation</p>
                  <p className="text-lg font-mono text-red-400">8 500 <span className="text-[10px] opacity-50">F</span></p>
                  <p className="text-[9px] text-zinc-500 italic uppercase">Par heure</p>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Nuit Vent.</p>
                  <p className="text-sm font-mono">12 000 F</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Nuit Clim.</p>
                  <p className="text-sm font-mono">20 000 F</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <FeatureRow icon={<Wifi className="w-3 h-3" />} label="Wifi Gratuit" value="OUI" />
              <FeatureRow icon={<Car className="w-3 h-3" />} label="Parking Privé" value="OUI" />
              <FeatureRow icon={<EyeOff className="w-3 h-3" />} label="Entrée Discrète" value="MAXIMALE" />
            </div>

            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 mt-auto transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(220,38,38,0.2)] hover:shadow-[0_0_40px_rgba(220,38,38,0.4)]">
              <Navigation className="w-5 h-5 fill-white" />
              ITINÉRAIRE GPS
            </button>
          </div>
        </aside>
      </div>

      {/* Bottom Status Bar */}
      <footer className="h-8 bg-zinc-950 border-t border-zinc-900 flex items-center px-4 justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <span className="text-[9px] uppercase tracking-widest text-zinc-600">Status: 05.3400° N, 4.0200° W</span>
          <span className="text-[9px] uppercase tracking-widest text-zinc-600">Data: Redlight v1.0 MVP</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]" 
          />
          <span className="text-[9px] uppercase tracking-widest text-zinc-600">Système Connecté</span>
        </div>
      </footer>
    </div>
  );
}

function HotelMarker({ top, left, name, status }: { top: string, left: string, name: string, status: 'Ouvert' | 'Fermé' }) {
  const isOpen = status === 'Ouvert';
  
  return (
    <div className="absolute group cursor-pointer" style={{ top, left }}>
      <motion.div 
        whileHover={{ scale: 1.2 }}
        className={`w-6 h-6 rounded-full border-2 border-white shadow-xl transition-all ${
          isOpen 
            ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)]' 
            : 'bg-zinc-600 border-zinc-400 shadow-lg opacity-60'
        }`}
      />
      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/90 border px-2 py-1 rounded text-[10px] whitespace-nowrap transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 ${
        isOpen ? 'border-red-600 text-white' : 'border-zinc-600 text-zinc-500'
      }`}>
        {name} {status === 'Fermé' && '(Fermé)'}
      </div>
    </div>
  );
}

function FeatureRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between text-xs group">
      <div className="flex items-center gap-2 text-zinc-500 group-hover:text-zinc-400 transition-colors">
        {icon}
        <span className="uppercase tracking-tight">{label}</span>
      </div>
      <span className="text-red-500 font-bold">{value}</span>
    </div>
  );
}
