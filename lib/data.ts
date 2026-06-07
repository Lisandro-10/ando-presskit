export interface BiographySegment {
  text: string;
  emphasis?: 'brand' | 'strong';
}

export interface Photo {
  src: string;
  title: string;
  description?: string;
}

export interface LiveSet {
  title: string;
  trackUrl: string;
  description?: string;
}

export type VideoOrientation = 'tall' | 'wide';

export interface Video {
  src: string;
  orientation?: VideoOrientation;
  poster?: string;
}

export interface EventInfo {
  name: string;
  location: string;
  date: string;
}

export interface Contact {
  name: string;
  email?: string;
  phone: string;
  instagram: string;
}
