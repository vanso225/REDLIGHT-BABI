export interface ForumMessage {
  id: number;
  user: string;
  neighborhood: string;
  text: string;
  time: string;
  rating: number;
  hotelId?: string;
}
