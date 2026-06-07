# Roadmap: Integración de Sanity.io (CMS) — Portal de contenido en `/studio`

Este roadmap detalla los pasos para integrar **Sanity.io** al Electronic Press Kit de ANDO,
de modo que el contenido (imágenes, videos, URLs de sets, bio, contactos y eventos) se
gestione desde un portal visual en **ando-ku.com/studio**, usando el **plan gratuito**, sin
escribir código hasta que se apruebe.

## Contexto

Hoy todo el contenido vive hardcodeado en `lib/data.ts` (objeto `presskitData`) y se edita a
mano + deploy. El objetivo es que ANDO administre el contenido desde un portal, sin tocar código.

Decisiones confirmadas:

- **Alcance:** TODO el contenido pasa a Sanity (fotos, videos, live sets, bio, contactos, eventos).
- **Videos:** se suben como archivos a Sanity (gestionables desde el portal, servidos por su CDN).
- **Migración:** se migra el contenido actual de `lib/data.ts` y los assets de `public/`.

> **Plan gratuito:** ~10GB banda/mes y ~5GB storage. **El riesgo es el bandwidth, no el storage.**
> El homepage **autoplaya** los videos (en mobile el IntersectionObserver descarga el archivo
> completo) y el CDN de Sanity **no transcodifica** → un celular baja el mp4 full-res. Los 6 videos
> que se usan pesan ~32MB → 10GB/mes ≈ ~300 vistas completas. **Decisión: videos a Sanity crudo +
> mitigación** (poster + `preload="none"` + comprimir los fuentes, ver Fase 6). Mux queda como
> upgrade si el egress se acerca a 10GB (la metadata ya estaría en Sanity; sólo cambiaría el player).
> Nota: `public/videos` tiene huérfanos NO usados (`rancho_aparte_2.mp4` 19MB, `video-3.mp4` 1.9MB)
> y `public/photos/piba.JPEG` está comentado en `lib/data.ts` — la migración itera los arrays, no la carpeta.

> **Compatibilidad:** el proyecto usa **Next 16.2.7 + React 19.2**. Instalar las versiones más
> recientes de `sanity`/`next-sanity` (soportan Next 16 / React 19) y verificar peer-deps tras
> el install; resolver conflictos puntuales con la versión compatible más nueva (no `--force` a ciegas).

## Fase 0: Setup de cuenta Sanity (manual, una vez)

- **Paso 0.1:** `npx sanity@latest login` y crear un proyecto gratuito → obtener `projectId` y dataset `production`.
- **Paso 0.2:** En **manage.sanity.io → API → CORS origins** agregar `https://ando-ku.com`,
  `http://localhost:3000` **y el origen de Preview de Vercel** (`https://<proyecto>-*.vercel.app` o
  el dominio fijo de preview). Sin esto el Studio embebido se rompe en los deploys de Preview.
- **Paso 0.3:** Crear un token de escritura (rol Editor) para el script de migración.
- **Paso 0.4:** (Opcional) Invitar a Juan Pablo como miembro del proyecto para que también edite.

## Fase 1: Dependencias y variables de entorno

- **Paso 1.1:** Instalar dependencias:
  ```
  sanity  next-sanity  @sanity/vision  @sanity/image-url  @sanity/orderable-document-list  styled-components
  ```
- **Paso 1.2:** Crear `.env.local` (ya cubierto por `.gitignore` → `.env*.local`):
  ```
  NEXT_PUBLIC_SANITY_PROJECT_ID=...
  NEXT_PUBLIC_SANITY_DATASET=production
  SANITY_API_WRITE_TOKEN=...   # solo para el script de migración
  ```
- **Paso 1.3:** Cargar `NEXT_PUBLIC_SANITY_PROJECT_ID` y `NEXT_PUBLIC_SANITY_DATASET` en Vercel (Production + Preview).

## Fase 2: Esquemas de contenido (`sanity/schemaTypes/`)

- **Paso 2.1:** `siteSettings` (singleton — un solo documento, con `_id` fijo):
  - `heroTagline` (string)
  - `heroImage` (image con hotspot) — **el fondo del Hero** (`hero-bg.jpg`); hoy está hardcodeado en
    `Hero.tsx` y NO está en el array `photos`, así que sin esto se perdería al borrar `public/photos`.
  - `biographyColumn1`, `biographyColumn2`: array de objeto `segment` `{ text: string, emphasis?: 'brand' | 'strong' }`
  - `socials`: `{ instagram, soundcloud, spotify }`
  - `directEmail` (string)
- **Paso 2.2:** `photo` (document): `image` (image con hotspot), `title`, `description`, `orderRank`.
- **Paso 2.3:** `video` (document): `file` (file, accept `video/mp4`), `orientation` (`'tall' | 'wide'`),
  `poster` (image, opcional — frame de previsualización para evitar descargar el video hasta el play), `orderRank`.
- **Paso 2.4:** `liveSet` (document): `title`, `trackUrl` (url), `description` (opcional — existe en la interfaz `LiveSet`), `orderRank`.
- **Paso 2.5:** `contact` (document): `name`, `email`, `phone`, `instagram`, `orderRank`.
- **Paso 2.6:** `event` (document): `name`, `location`, `date`, `isMain` (boolean), `orderRank`.
  **Nota:** el componente `Events` no se renderiza hoy (`page.tsx` no lo incluye). Se crea el esquema,
  pero el refactor público y la migración de eventos quedan **diferidos** hasta descomentar `Events`.
- **Objetivo:** mantener las mismas formas que las interfaces de `lib/data.ts` para minimizar el
  cambio en los componentes. Ordenamiento drag-and-drop de galerías con
  `@sanity/orderable-document-list` (`orderRankField` + `orderRankOrdering`).

## Fase 3: Configuración del Studio embebido (`ando-ku.com/studio`)

- **Paso 3.1:** `sanity.config.ts` (raíz): `defineConfig` con `projectId`/`dataset` desde env,
  `basePath: '/studio'`, plugins `structureTool` (con singleton de `siteSettings` y listas
  ordenables), `visionTool`, y los `schemaTypes`.
- **Paso 3.2:** `sanity.cli.ts` (raíz): `projectId`/`dataset` para comandos CLI.
- **Paso 3.3:** `sanity/structure.ts`: estructura del Studio (forzar `siteSettings` como
  documento único + listas ordenables para el resto).
- **Paso 3.4:** `src/app/studio/[[...tool]]/page.tsx` y `layout.tsx`: montar el Studio embebido
  con `NextStudio` de `next-sanity/studio`. El layout del studio debe evitar el `<main>`/estilos
  globales del sitio (metadata y `viewport` propios).
- **Objetivo:** al deployar en Vercel con el dominio actual, `ando-ku.com/studio` queda disponible
  sin infraestructura adicional.

## Fase 4: Capa de datos (`sanity/`)

- **Paso 4.1:** `sanity/env.ts`: lee `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `apiVersion`.
- **Paso 4.2:** `sanity/client.ts`: `createClient` con `useCdn: true`.
- **Paso 4.3:** `sanity/image.ts`: helper `urlFor()` con `@sanity/image-url`.
- **Paso 4.4:** `sanity/queries.ts`: queries GROQ.
  - `video` resuelve la URL del asset: `"src": file.asset->url`, más `"poster": poster.asset->url`.
  - `photo` devuelve la referencia de imagen para `urlFor()`. `siteSettings` incluye `heroImage`.
  - Una query agregada que traiga todo el contenido para `page.tsx`, ordenado por `orderRank`.

## Fase 5: Refactor del sitio público (datos por props)

- **Paso 5.1:** `lib/data.ts`: quitar el objeto `presskitData`; **conservar las interfaces**
  (`Photo`, `Video`, `LiveSet`, `Contact`, etc.) como tipos compartidos. Mapear la respuesta de
  Sanity a estas mismas formas.
- **Paso 5.2:** `src/app/page.tsx`: convertir a Server Component `async`; hacer el fetch agregado
  a Sanity y pasar props a cada sección. Agregar `export const revalidate = 60` (ISR) para que los
  cambios del portal aparezcan sin redeploy.
- **Paso 5.3:** Componentes (`PhotoGallery`, `VideoGallery`, `LiveSets`, `Biography`, `Contact`,
  `Hero`, `Footer`): reemplazar `import { presskitData }` por **props** tipadas.
  Mantienen `'use client'` y las animaciones Framer Motion.
  - `Hero`: recibir `heroTagline` y **`heroImage`** por prop (hoy el `src` está hardcodeado).
  - `PhotoGallery`: `src` se construye con `urlFor(photo.image).url()` (sigue usando `next/image` + grayscale).
  - `VideoGallery`: `video.src` es la URL del asset de Sanity; usar **`preload="none"` + `poster={video.poster}`**
    para no descargar el video hasta el play (mitigación de bandwidth del free tier).
  - `Events`: **diferido** — sigue sin renderizarse, no se refactoriza por ahora.
- **Paso 5.4:** `next.config.ts`: agregar `images.remotePatterns` para `cdn.sanity.io`
  (manteniendo `formats`/`deviceSizes` actuales).

## Fase 6: Migración del contenido actual

- **Paso 6.1:** Script `scripts/migrate.ts` (correr con `npx tsx scripts/migrate.ts`) usando
  `@sanity/client` con el token de escritura. **Idempotente:** usar `_id` determinísticos +
  `createOrReplace` para poder re-correrlo sin duplicar documentos.
  1. **Iterar `presskitData.photos`** (NO `glob` de la carpeta, que tiene huérfanos): subir el asset
     desde `public/<photo.src>` → crear doc `photo` con `title`/`description`/orden.
  2. **Iterar `presskitData.videos`**: subir el asset → crear doc `video` con `orientation`/orden.
  3. Subir `public/photos/hero-bg.jpg` como asset de `siteSettings.heroImage`.
  4. Crea docs `liveSet`, `contact`. (`event`: diferido / opcional.)
  5. Crea el singleton `siteSettings` (hero, segments de bio, socials, directEmail, **heroImage**).
  6. Asigna `orderRank` con el **helper de `@sanity/orderable-document-list`** (rank strings, no
     índices enteros) según el orden actual de los arrays.
- **Paso 6.5:** **Mitigación de bandwidth (video):** antes de subir, comprimir/capar los 6 mp4 usados
  y generar un `poster` por video. En el componente, `preload="none"` + `poster` (Paso 5.3).
- **Paso 6.2:** (Opcional, commit posterior) tras verificar que el sitio lee bien desde Sanity
  (incluido `heroImage` y todos los assets), borrar `public/photos` y `public/videos` para aligerar
  el repo. **No borrar antes de confirmar** que el Hero y las galerías cargan desde Sanity.

## Fase 7: Verificación end-to-end

- **Paso 7.1:** `npm install` + `npm run dev` → abrir `localhost:3000/studio`, loguear, confirmar
  los esquemas (Site Settings, Photos, Videos, Live Sets, Contacts, Events).
- **Paso 7.2:** `npx tsx scripts/migrate.ts` → verificar en el Studio que se cargó todo. Re-correrlo
  **no debe duplicar** documentos (idempotencia).
- **Paso 7.3:** `localhost:3000` → confirmar que la home renderiza desde Sanity, idéntica a antes
  (**Hero con su fondo**, fotos grayscale, videos con poster/autoplay, embeds de SoundCloud, bio, contactos).
- **Paso 7.4:** Editar un dato en `/studio` → esperar la revalidación (≤60s) o recargar →
  confirmar que el cambio se refleja sin redeploy.
- **Paso 7.5:** `npm run build` y `npm run lint` sin errores.
- **Paso 7.6:** Deploy a Vercel → verificar `ando-ku.com/studio` accesible, la home pública correcta,
  y que el Studio también funciona en un deploy de **Preview** (depende del CORS del Paso 0.2).

## Fuera de alcance / mejoras opcionales

- Revalidación instantánea (webhook de Sanity → `revalidateTag`) en lugar del ISR de 60s.
- Autenticación del Studio la maneja Sanity (login con la cuenta del proyecto).
