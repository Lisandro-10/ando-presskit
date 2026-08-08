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
    bio: string;
    imageSrc: string;
  };
  events: {
    imageSrc: string;
    list: EventInfo[];
  };
  liveSets: LiveSet[];
  contact: {
    imageSrc: string;
    people: Person[];
    directEmail: string;
    socials: SocialLink[];
  };
}

export const presskitData: PresskitData = {
  hero: {
    tagline: 'Progressive House / Organic House / Underground House',
    bio: 'ANDO es un proyecto conformado por Juan Pablo y Lisandro Andia, dos primos unidos por la música y el descubrimiento de sonidos en conjunto. Su propuesta sonora gira en torno a un groove hipnótico y persistente que da identidad a cada set. El sonido oscila entre atmósferas oscuras y profundas o momentos más orgánicos, donde la melodía y la emoción cobran protagonismo, sin perder el groove hipnótico que los define. Haber crecido juntos escuchando música les permite retroalimentar sus gustos logrando una conexión que se traduce en un sello propio.',
    imageSrc: '/photos/_MG_4466.jpg',
  },

  events: {
    imageSrc: '/photos/_MG_4296.jpg',
    // imageSrc: '/photos/IMG_4597.jpg',
    // `date` es un contrato, no texto libre: 'DD.MM.YYYY' con ceros a la izquierda.
    // El orden lo calcula Events.tsx a partir de la fecha, no del orden del array.
    list: [
      { name: 'PIBÄ BAR', location: 'Vistapueblo, Carrodilla', date: '28.02.2026' },
      { name: 'Rancho Aparte', location: '', date: '09.05.2026' },
      { name: 'PIBÄ BAR', location: 'Vistapueblo, Carrodilla', date: '16.05.2026' },
      { name: 'Calma Club', location: 'Bodega Giol, Maipú', date: '18.07.2026' },
      { name: 'Birra House', location: 'Arístides Villanueva', date: '06.09.2026' },

    ],
  },

  liveSets: [
    {
      title: 'ANDO - Opening Set | Calma | 18/07/26',
      url: 'https://www.youtube.com/watch?v=FBWrPMc4aCg&t=2997s',
    },
    {
      title: 'Hidden Echoes Vol. 1',
      url: 'https://soundcloud.com/ando-ku/ando-hidden-echoes-set-vol-1',
    },
    {
      title: 'Echoes in the Dark Set (Vol.2)',
      url: 'https://soundcloud.com/ando-ku/ando-echoes-in-the-dark-set',
    },
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
