# ANDO — Electronic Press Kit

Press kit de una sola página para el dúo de DJs **ANDO**, construido con **Next.js 16** (App Router) y **React 19**. El contenido vive en un único archivo del repo — no hay CMS. Desplegado en Vercel ([ando-ku.com](https://ando-ku.com)).

## Stack

- **Next.js 16.2** (App Router) + **React 19.2**
- **Tailwind CSS** con tokens de marca personalizados
- **Framer Motion** para animaciones
- **TypeScript**
- **Vercel Analytics**

Sin CMS, sin base de datos y sin variables de entorno: el sitio es **estático puro** (sin `fetch`, sin ISR).

## Editar el contenido

Todo el contenido —textos, rutas de fotos, fechas, live sets, contactos y redes— vive en el objeto `presskitData` de [lib/data.ts](lib/data.ts). Se edita ahí, se commitea y Vercel redeploya en el push.

```ts
export const presskitData: PresskitData = {
  hero:     { tagline, bio, imageSrc },
  events:   { imageSrc, list: [{ name, location, date }] },
  liveSets: [{ title, url }],
  contact:  { imageSrc, people: [{ name, phone }], directEmail, socials: [{ label, url }] },
}
```

Dos reglas al cargar datos:

- **`date` es un contrato, no texto libre**: formato `DD.MM.YYYY` con ceros a la izquierda. El orden de la lista no lo define el array sino la fecha, que `Events.tsx` parsea. Una fecha mal tipeada no rompe el build ni el lint: se va al final de la lista en silencio.
- **`liveSets[].url`** acepta tanto SoundCloud como YouTube (`youtube.com/watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`). El componente detecta cuál es y arma el embed correspondiente.

Si `events.list` queda vacío, la sección directamente no se renderiza. Lo mismo con `liveSets`.

## Arquitectura

### Página

[src/app/page.tsx](src/app/page.tsx) es un Server Component sincrónico que importa `presskitData` y reparte cada slice por props. Cuatro secciones, en orden:

| Sección | Componente | Fondo |
|---|---|---|
| Hero | [Hero.tsx](src/components/Hero.tsx) | foto + scrim + grano |
| Próximas Fechas | [Events.tsx](src/components/Events.tsx) | foto `grayscale` + scrim |
| Live Sets | [LiveSets.tsx](src/components/LiveSets.tsx) | `bg-ando-navy` liso |
| Contact | [Contact.tsx](src/components/Contact.tsx) | `bg-ando-navy` liso |

Cada sección es un componente `'use client'` con animaciones Framer Motion. La página termina en Contact, que absorbió el footer (wordmark, redes y copyright).

### Detalles que no son obvios leyendo el código

- **El texto del Hero se renderiza visible desde el SSR, a propósito.** Es el elemento LCP del sitio: gatearlo detrás de un `initial={{ opacity: 0 }}` de Framer lo dejaba sin pintar hasta que hidrataba el JS y empujaba el LCP a ~3,4 s en mobile. Sin eso baja a ~0,6 s. El parallax de mouse y scroll sí se conserva. **No agregar `opacity: 0` a nada dentro del Hero.** En las secciones de abajo el reveal `whileInView` está bien.
- **Próximas Fechas ordena de la fecha más nueva a la más vieja** y pagina de a 5 con un botón que despliega el resto. Para invertir el orden hay un solo lugar: el comparador `compareByDate` en `Events.tsx`.
- **Las filas que aparecen al desplegar no usan `whileInView`**: montan dentro del viewport y el observer puede no dispararse, dejándolas invisibles. Usan `initial` + `animate` directo.
- **El contraste sobre la foto de Events se resuelve con panel local** (`bg-black/50 backdrop-blur-md`), no subiendo el scrim global — subir el scrim tapa la foto, que es justamente lo que se quiere mostrar. Medido: 9,4:1 en el peor panel.

### Estilos

- Tokens de Tailwind: `ando-navy` (`#111111`), `ando-cyan` (`#00d9ff`), `ando-text`, `ando-muted`.
- Fuentes (Google Fonts vía `next/font`): `font-orbitron` (títulos) y `font-spaceGrotesk` (texto).
- Textura de grano solo en el Hero, vía `.hero-grain` en `globals.css`. Su `z-index` va **por debajo** del `z-10` del contenido; si sube, el grano pinta sobre el título.

### Imágenes

Viven en `public/photos/` y se usan tal cual (todas ≤186 KB); `next/image` las sirve en avif/webp. No hay videos.

Dos reglas: todo `<Image fill>` lleva `sizes`, y **solo la imagen del Hero lleva `priority`** — es la única above-the-fold.

## Comandos

```bash
npm install
npm run dev      # servidor de desarrollo en localhost:3000
npm run build    # build de producción
npm run start    # servir el build
npm run lint     # ESLint
```

No hay suite de tests configurada. El proyecto no requiere ninguna variable de entorno.

## Documentación

- [roadmaps/background_section_images_roadmap.md](roadmaps/background_section_images_roadmap.md) — rediseño a 4 secciones sin CMS. **Es el que describe el estado actual**, con las métricas medidas de contraste y LCP.
- El resto de `roadmaps/` y `docs/` es histórico: describe etapas anteriores del proyecto (integración de Sanity, bento grid, migración a Next 16) que ya no reflejan el código.
