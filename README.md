# ANDO — Electronic Press Kit

Press kit de una sola página para el dúo de DJs **ANDO**, construido con **Next.js 16** (App Router) y **React 19**, con el contenido gestionado desde un **CMS Sanity** embebido en `/studio`. Desplegado en Vercel ([ando-ku.com](https://ando-ku.com)).

## Stack

- **Next.js 16.2** (App Router) + **React 19.2**
- **Sanity 5** como CMS, con Studio embebido en `/studio` (`next-sanity`)
- **Tailwind CSS** con tokens de marca personalizados
- **Framer Motion** para animaciones
- **TypeScript**
- **Vercel Analytics**

## Arquitectura

### Contenido (CMS — Sanity)

Todo el contenido (bio, fotos, videos, live sets, contactos, settings del Hero) vive en **Sanity** y se administra desde el Studio embebido en **`/studio`**, sin tocar código.

- **Esquemas** — `sanity/schemaTypes/`: `siteSettings` (singleton), `photo`, `video`, `liveSet`, `contact`, `event`. El orden de las galerías se gestiona con drag-and-drop (`@sanity/orderable-document-list`).
- **Capa de datos** — `sanity/`: `client.ts` (cliente con CDN), `image.ts` (`urlFor()` para imágenes), `queries.ts` (consultas GROQ), `structure.ts` (estructura del Studio).
- **Config** — `sanity.config.ts` y `sanity.cli.ts` en la raíz.

### Sitio público

- **Página** — [src/app/page.tsx](src/app/page.tsx): Server Component `async` que hace un único fetch a Sanity (`PRESSKIT_QUERY`), mapea la respuesta a tipos compartidos y pasa los datos por props a cada sección. Usa **ISR** (`revalidate = 60`), por lo que los cambios del Studio se reflejan en ≤60s sin redeploy.
- **Orden de secciones**: `Hero → Biography → LiveSets → PhotoGallery → VideoGallery → Contact → Footer`. El componente `Events` existe pero no se renderiza.
- **Componentes** — `src/components/`: cada sección es un componente `'use client'` con animaciones Framer Motion que recibe sus datos por props.
- **Tipos** — [lib/data.ts](lib/data.ts): interfaces compartidas (`Photo`, `Video`, `LiveSet`, `Contact`, `BiographySegment`, etc.) que mapean la respuesta de Sanity.

### Estilos

- Tokens de Tailwind: `ando-navy` (`#111111`), `ando-cyan` (`#00d9ff`), `ando-text`, `ando-muted`.
- Fuentes (Google Fonts vía `next/font`): `font-orbitron` (títulos) y `font-spaceGrotesk` (texto).
- Textura de grano en el Hero vía `.hero-grain` en `globals.css`.

### Imágenes y video

- Imágenes optimizadas con `next/image` (avif/webp). Sanity CDN (`cdn.sanity.io`) habilitado en `next.config.ts`.
- Los videos se sirven desde el CDN de Sanity con `preload="none"` + `poster` para limitar el consumo de ancho de banda.

## Variables de entorno

Crear `.env.local` (cubierto por `.gitignore`):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01   # opcional
SANITY_API_WRITE_TOKEN=...                   # solo para el script de migración
```

Las variables `NEXT_PUBLIC_*` deben cargarse también en Vercel (Production + Preview).

## Comandos

```bash
npm install
npm run dev      # servidor de desarrollo en localhost:3000 (Studio en localhost:3000/studio)
npm run build    # build de producción
npm run start    # servir el build
npm run lint     # ESLint
```

No hay suite de tests configurada.

## Migración de contenido

Existe un script idempotente para migrar el contenido inicial a Sanity (sube assets desde `public/` y crea los documentos):

```bash
npx tsx scripts/migrate.ts
```

Requiere `SANITY_API_WRITE_TOKEN`. Usa `_id` determinísticos + `createOrReplace`, por lo que puede re-ejecutarse sin duplicar documentos.

## Documentación

- `roadmaps/sanity_cms_integration_roadmap.md` — roadmap de la integración de Sanity.
- `docs/` — plan de implementación y deuda técnica.
```