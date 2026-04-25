export interface Hotel {
  id: string;
  Nom: string;
  Commune: string;
  Quartier: string;
  Telephone: string;
  Prix_Heure_Ventile: number;
  Prix_Heure_Clim: number;
  Prix_Nuit_Ventile: number;
  Prix_Nuit_Clim: number;
  Wifi: boolean;
  Parking: boolean;
  Discret_Entree: boolean;
  isFull: boolean;
  Statut_Actuel: 'Ouvert' | 'Fermé';
  Latitude: number;
  Longitude: number;
}
