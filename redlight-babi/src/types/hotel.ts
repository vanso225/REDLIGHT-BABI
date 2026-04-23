export type StatutActuel = 'Ouvert' | 'Fermé';

export interface Hotel {
  id: string;
  Nom: string;
  Commune: string;
  Quartier: string;
  Latitude: number;
  Longitude: number;
  Prix_Heure_Ventile: number;
  Prix_Heure_Clim: number;
  Prix_Nuit_Ventile: number;
  Prix_Nuit_Clim: number;
  Wifi: boolean;
  Parking: boolean;
  Discret_Entree: boolean;
  Statut_Actuel: StatutActuel;
  isFull: boolean;
  Telephone?: string;
  Description?: string;
}
