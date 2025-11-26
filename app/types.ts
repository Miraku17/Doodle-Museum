export interface Painting {
  id: string;
  dataUrl: string; // Base64 image
  title: string;
  artist: string;
  critique?: string; // AI generated critique
  votes: number;
  timestamp: number;
}

export type ViewMode = 'HOME' | 'PAINT' | 'GALLERY';

export interface AICritiqueResponse {
  title: string;
  critique: string;
}
