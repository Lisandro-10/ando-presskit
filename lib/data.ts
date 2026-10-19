export interface EventInfo {
  name: string;
  location: string;
  /** Formato fijo 'DD.MM.YYYY' — ver nota sobre el orden en `events.list`. */
  date: string;
}

export interface LiveSet {
  title: string;
  /** SoundCloud o YouTube. */
  url: string;
}

export interface RiderSetup {
  /** Tipo de setup: 'Players + Mixer', 'Controladora'... */
  label: string;
  gear: string[];
  /** El equipo es nuestro: lo podemos llevar. */
  owned?: boolean;
}

export interface Person {
  name: string;
  phone: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface PresskitData {
  hero: {
    tagline: string;
    imageSrc: string;
  };
  events: {
    imageSrc: string;
    list: EventInfo[];
  };
  liveSets: LiveSet[];
  techRider: RiderSetup[];
  contact: {
    imageSrc: string;
    people: Person[];
    directEmail: string;
    socials: SocialLink[];
  };
}

export const presskitData: PresskitData = {
  hero: {
    tagline: 'Progressive House / Underground House',
    imageSrc: '/photos/_MG_4466.jpg',
  },

  events: {
    imageSrc: '/photos/_MG_4296.jpg',
    list: [
      { name: 'PIBÄ BAR', location: 'Vistapueblo, Carrodilla', date: '28.02.2026' },
      { name: 'PIBÄ BAR', location: 'Vistapueblo, Carrodilla', date: '22.08.2026' },
      { name: 'Rancho Aparte', location: '', date: '09.05.2026' },
      { name: 'PIBÄ BAR', location: 'Vistapueblo, Carrodilla', date: '16.05.2026' },
      { name: 'Calma Club', location: 'Bodega Giol, Maipú', date: '18.07.2026' },
      { name: 'Birra House', location: 'Arístides Villanueva', date: '06.09.2026' },
      { name: 'El Rumano', location: 'Arístides Villanueva', date: '28.08.2026' },
      { name: 'Finca La Anita', location: 'Agrelo, Mendoza', date: '7-8.12.2025' },
      { name: 'Grooveoo', location: 'Complejo La Isla', date: '13.11.2026' },
    ],
  },

  liveSets: [
    {
      title: 'ANDO - Dj Set | Live at Quincho Rock | 16/09/2026',
      url: 'https://www.youtube.com/watch?v=5CZJ2qCzJes',
    },
    {
      title: 'Birra House - ANDO | 06/09/26',
      url: 'https://www.youtube.com/watch?v=fApQKP6bXrk',
    },
    {
      title: 'ANDO - Opening Set | Calma | 18/07/26',
      url: 'https://www.youtube.com/watch?v=FBWrPMc4aCg&t=2997s',
    },
    {
      title: 'Echoes in the Dark Set (Vol.2)',
      url: 'https://soundcloud.com/ando-ku/ando-echoes-in-the-dark-set',
    },
  ],

  // Solo equipos con los que ya tocamos — sin alternativas inventadas.
  techRider: [
    { label: 'Players + Mixer', gear: ['Pioneer CDJ-3000X', 'Pioneer DJM-V10'] },
    { label: 'Controladora', gear: ['Pioneer DDJ-400', 'rekordbox'], owned: true },
    { label: 'All-in-one', gear: ['Pioneer XDJ-RX3'] },
  ],

  contact: {
    imageSrc: '/photos/IMG_4597.jpg',
    people: [
      { name: 'Lisandro Andia', phone: '+54 9 261 2567201' },
      { name: 'Juan Pablo Andia', phone: '+54 9 261 2191185' },
    ],
    directEmail: 'info.ando.ku@gmail.com',
    socials: [
      { label: 'ando.sound', url: 'https://instagram.com/ando.sound' },
      { label: 'ando-ku', url: 'https://soundcloud.com/ando-ku' },
    ],
  },
};
