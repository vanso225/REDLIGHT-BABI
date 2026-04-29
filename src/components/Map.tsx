import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Hotel } from '../types/hotel';
import { LocateFixed } from 'lucide-react';

// NOTE: You must provide a valid Mapbox token via VITE_MAPBOX_TOKEN environment variable.
const mapboxAccessToken = import.meta.env.VITE_MAPBOX_TOKEN || "pk.eyJ1IjoiZXZhbnN0IiwiYSI6ImNtb2JiNXQxMzAwcDIycHBsM29vdnZta2IifQ.BRH9j7JYzmPkWD1wXNHocg";
const IS_DEFAULT_TOKEN = !mapboxAccessToken;

interface MapProps {
  hotels: Hotel[];
  onHotelClick: (hotel: Hotel) => void;
  selectedHotel: Hotel | null;
}

const Map: React.FC<MapProps> = ({ hotels, onHotelClick, selectedHotel }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: mapboxgl.Marker }>({});
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    if (IS_DEFAULT_TOKEN) {
      console.error("Mapbox token is missing or using a restricted placeholder. Please set VITE_MAPBOX_TOKEN.");
      setTokenError(true);
      return;
    }

    mapboxgl.accessToken = mapboxAccessToken;
    
    if (!mapContainerRef.current) {
      console.error("Map container ref is null");
      return;
    }

    const { offsetWidth, offsetHeight } = mapContainerRef.current;
    
    if (!mapboxAccessToken) {
      console.error("CRITICAL: Mapbox token (VITE_MAPBOX_TOKEN) is completely missing.");
      setTokenError(true);
      return;
    }

    if (offsetHeight === 0) {
      console.warn("Mapbox: Container has 0 height. Check parent flexbox layout.");
    }

    let map: mapboxgl.Map | null = null;

    try {
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-4.07, 5.344],
        zoom: 14, // Zoom plus équilibré
        attributionControl: false
      });

      mapRef.current = map;

      map.on('load', () => {
        setMapLoaded(true);
        // Small timeout to ensure the container is fully rendered
        setTimeout(() => {
          if (mapRef.current) mapRef.current.resize();
        }, 100);
      });

      // Handle resize automatically via ResizeObserver for better responsiveness
      const resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);

      map.on('error', (e: any) => {
        const msg = e.message || e.error?.message || "Unknown error";
        console.error("Mapbox error:", msg);
        if (msg.toLowerCase().includes('token') || e.status === 401) {
          setTokenError(true);
        }
      });

      return () => {
        resizeObserver.disconnect();
        if (map) {
          map.remove();
          mapRef.current = null;
        }
      };
    } catch (err) {
      console.error("Failed to initialize Mapbox:", err);
      setTokenError(true);
    }
  }, []);

  // Update Markers when hotels change or map is loaded
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Clear existing markers
    Object.keys(markersRef.current).forEach(id => {
      markersRef.current[id].remove();
    });
    markersRef.current = {};

    // Add markers
    hotels.forEach(hotel => {
      // Validate coordinates
      if (typeof hotel.Longitude !== 'number' || typeof hotel.Latitude !== 'number' || 
          isNaN(hotel.Longitude) || isNaN(hotel.Latitude)) {
        console.warn(`Skipping marker for hotel ${hotel.Nom} due to invalid coordinates.`);
        return;
      }

      const el = document.createElement('div');
      
      // Determine bulb status
      let bulbStatus = 'bulb-on';
      if (hotel.isFull) {
        bulbStatus = 'bulb-full';
      } else if (hotel.Statut_Actuel === 'Fermé') {
        bulbStatus = 'bulb-off';
      }

      el.className = `bulb ${bulbStatus} ${selectedHotel?.id === hotel.id ? 'scale-150 drop-shadow-[0_0_20px_rgba(220,38,38,1)] z-[100]' : 'z-50'}`;
      el.style.pointerEvents = 'auto';
      el.style.cursor = 'pointer';
      el.style.zIndex = selectedHotel?.id === hotel.id ? '100' : '50';
      
      // Inject Lightbulb SVG (manually for speed and compatibility in vanilla Mapbox Marker)
      el.innerHTML = `
        <div style="pointer-events: none;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${hotel.isFull ? 'transparent' : 'currentColor'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/>
            <path d="M9 18h6"/>
            <path d="M10 22h4"/>
          </svg>
        </div>
      `;
      
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat([hotel.Longitude, hotel.Latitude])
        .addTo(mapRef.current!);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onHotelClick(hotel);
      });
      
      markersRef.current[hotel.id] = marker;
    });
  }, [hotels, onHotelClick, selectedHotel, mapLoaded]);

  // Center map on selected hotel
  useEffect(() => {
    if (selectedHotel && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedHotel.Longitude, selectedHotel.Latitude],
        zoom: 15,
        essential: true
      });
    }
  }, [selectedHotel]);

  const handleLocateUser = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { longitude, latitude } = position.coords;
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            essential: true
          });
        }
      }, (error) => {
        console.error("Error getting location:", error.message || "Unknown geolocation error");
        alert("Impossible d'accéder à votre position GPS.");
      });
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  return (
    <div className="absolute inset-0 w-[100vw] h-[100vh] z-0 overflow-hidden">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
      
      {tokenError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm p-8 text-center">
          <div className="max-w-xs border border-red-900/50 bg-black/50 p-6 rounded-lg">
            <h3 className="text-red-500 font-black uppercase tracking-tighter text-lg mb-2">Token Mapbox Invalide</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-4">
              Veuillez configurer votre clé API Mapbox dans les paramètres (VITE_MAPBOX_TOKEN) pour afficher la carte d'Abidjan.
            </p>
            <a 
              href="https://www.mapbox.com/" 
              target="_blank" 
              rel="noreferrer"
              className="text-[10px] text-zinc-600 underline hover:text-zinc-400 uppercase font-black"
            >
              Obtenir un token
            </a>
          </div>
        </div>
      )}

      {/* Around Me Button */}
      <button
        onClick={handleLocateUser}
        className="absolute bottom-10 right-4 z-20 bg-zinc-900 border border-red-900/50 p-3 rounded-full hover:bg-zinc-800 transition-all shadow-lg text-red-500 hover:scale-110 active:scale-95 group"
        title="Autour de moi"
      >
        <LocateFixed size={24} className="group-hover:animate-pulse" />
      </button>
    </div>
  );
};

export default Map;
