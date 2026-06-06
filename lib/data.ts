// Fragmento de texto de la biografía. `emphasis` controla cómo lo renderiza
// el componente (sin HTML embebido en strings).
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

export interface PresskitData {
  hero: { tagline: string };
  biography: { column1: BiographySegment[]; column2: BiographySegment[] };
  photos: Photo[];
  liveSets: LiveSet[];
  videos: Video[];
  events: { main: EventInfo; upcoming: EventInfo[] };
  socials: { instagram: string; soundcloud: string; spotify: string };
  contacts: Contact[];
  directEmail: string;
}

export const presskitData: PresskitData = {
  hero: {
    tagline: "Groove, Ritmos Bailables y Underground Elegante",
  },

  biography: {
    column1: [
      { text: "ANDO", emphasis: "brand" },
      {
        text: " es un proyecto de música House conformado por Juan Pablo y Lisandro Andia, dos primos unidos por la música y el descubrimiento de sonidos en conjunto. Su propuesta sonora transita entre la profundidad del ",
      },
      { text: "Progressive House", emphasis: "strong" },
      { text: " y la energía del " },
      { text: "Tech House", emphasis: "strong" },
      {
        text: ", convergiendo siempre en un groove persistente que funciona como hilo conductor de su identidad. La narrativa de sus sets es progresiva, evolucionando desde sonidos orgánicos hacia momentos de mayor intensidad.",
      },
    ],

    column2: [
      { text: "Lo que define a " },
      { text: "ANDO", emphasis: "brand" },
      {
        text: " es la química natural en el set. Haber crecido juntos escuchando música les permite retroalimentar sus gustos logrando una conexión que se traduce en un sello propio.",
      },
    ],
  },

  photos: [
    {
      src: "/photos/fiesta_under.jpeg",
      title: "RANCHO APARTE",
      description: "",
    },
    {
      src: "/photos/finca-la-anita.jpg",
      title: "FINCA LA ANITA",
      description: "",
    },
    {
      src: "/photos/piba_16-05-2026.jpg",
      title: "PIBÄ BAR",
      description: "",
    },
    {
      src: "/photos/finca_anita_byn.jpeg",
      title: "SUNSET FINCA LA ANITA",
      description: "",
    },
    // {
    //   src: "/photos/piba.JPEG",
    //   title: "PIBÄ BAR",
    //   description: "",
    // },
  ],

  liveSets: [
    {
      title: "Hidden Echoes Vol. 1",
      trackUrl: "https://soundcloud.com/ando-ku/ando-hidden-echoes-set-vol-1",
    },
    {
      title: "Echoes in the Dark Set (Vol.2)",
      trackUrl: "https://soundcloud.com/ando-ku/ando-echoes-in-the-dark-set",
    },
  ],

  videos: [
    { src: '/videos/video-1.mp4', orientation: 'wide' },
    { src: '/videos/piba_16-05-2026.mp4', orientation: 'tall' },
    { src: '/videos/rancho_aparte_3.mp4', orientation: 'wide' },
    { src: '/videos/piba.mp4', orientation: 'tall' },
    { src: '/videos/video-2.mp4', orientation: 'wide' },
    { src: '/videos/video-5.mp4', orientation: 'tall' },
  ],

  events: {
    main: {
      name: "OSA Club",
      location: "Mendoza, Argentina",
      date: "28.03.2026",
    },
    upcoming: [
      {
        name: "PIBA BAR",
        location: "Carrodilla, Mendoza",
        date: "28.02.2026",
      },
      {
        name: "OSA Club",
        location: "Mendoza, Argentina",
        date: "28.03.2026",
      },
    ],
  },

  socials: {
    instagram: "https://instagram.com/ando.ku",
    soundcloud: "#",
    spotify: "#",
  },

  contacts: [
    {
      name: "Lisandro Andia",
      email: "lisandroandia14@gmail.com",
      phone: "+54 9 261 2567201",
      instagram: "https://instagram.com/lisan_andia",
    },
    {
      name: "Juan Pablo Andia",
      phone: "+54 9 261 2191185",
      instagram: "https://instagram.com/coloandia",
    },
  ],

  directEmail: "info.ando.ku@gmail.com",
};
