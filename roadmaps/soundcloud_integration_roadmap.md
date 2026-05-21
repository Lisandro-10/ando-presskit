# Roadmap: Integración de SoundCloud (Sección "SOUNDS")

Este roadmap detalla los pasos secuenciales para implementar la sección de sets en vivo en el Electronic Press Kit de ANDO, sin escribir código hasta que se apruebe.

## Fase 1: Preparación de Datos
- **Paso 1.1:** Modificar `lib/data.ts` para incluir una nueva key top-level `liveSets` en `presskitData`, alineada con el patrón flat existente (`photos`, `videos`, `events`). **No** anidar bajo `music` u otro namespace.
- **Paso 1.2:** Definir el shape TypeScript explícito del array:
  ```ts
  liveSets: Array<{ title: string; trackUrl: string; description?: string }>
  ```
  Guardar únicamente `trackUrl` (URL canónica del track en SoundCloud, ej. `https://soundcloud.com/ando/hidden-echoes-vol-1`), **no** la URL completa del embed. El primer elemento será el set "Hidden Echoes Vol. 1".
- **Objetivo:** Separar datos de configuración del embed; cuando haya un segundo set, agregar un objeto al array alcanza y los parámetros del player se mantienen consistentes en un único lugar (ver Paso 3.1).

## Fase 2: Construcción del Componente Base
- **Paso 2.1:** Crear el archivo `/src/components/LiveSets.tsx`.
- **Paso 2.2:** **Clonar la estructura de `src/components/VideoGallery.tsx`** para garantizar consistencia visual y técnica con el resto del sitio:
  - Directiva `'use client'`.
  - Animación con `motion.div` de Framer Motion (`initial`, `whileInView`, `viewport={{ once: true }}`, `transition`).
  - Wrapper de sección con `bg-ando-navy`.
  - Contenedor glassmorphism: `bg-white/5 backdrop-blur-md` + bordes redondeados.
  - Etiqueta "Live Sets" estilizada sobre el título.
  - Título H2 "SOUNDS" con `font-orbitron`.
  - Línea acento en `ando-cyan` debajo del H2.
- **Paso 2.3:** Implementar layout responsive que escale gracefully al agregar o quitar sets del array (la lista se cura manualmente desde `lib/data.ts`, sin cap programático):
  - **1 set:** 1 columna centrada (`max-w-3xl mx-auto`), tratada como ítem destacado.
  - **2+ sets:** grilla `grid-cols-1 md:grid-cols-2 gap-6` (o `gap-8`).
  - **Tope de 2 columnas en desktop** (no escalar a 3): el iframe con `visual=true` necesita ≥~500px de ancho para que el artwork y los controles no se rompan. Con 3 cols en un container `max-w-7xl` cada celda cae a ~400px y entra en zona de riesgo visual.
  - Cada celda mantiene la altura definida en Paso 3.2 (`h-[300px]` mobile, `h-[400px]`/`h-[450px]` desktop) independientemente del número de ítems.

## Fase 3: Integración del Reproductor (Iframe)
- **Paso 3.1:** Crear un helper local `buildEmbedUrl(trackUrl: string): string` dentro del componente que arme la URL del iframe con parámetros consistentes:
  - `url={encodeURIComponent(trackUrl)}`
  - `visual=true`
  - `color=%2300d9ff` (alineado con el token `ando-cyan` del design system)
  - `auto_play=false`
  - `hide_related=true`
  - `show_comments=false`
  - `show_user=true`
  - `show_reposts=false`
  - `show_teaser=false`

  El `<iframe>` debe incluir los siguientes atributos:
  - `loading="lazy"` (crítico — el iframe de SoundCloud es pesado, evita degradar LCP).
  - `title="{set.title}"` (accesibilidad).
  - `allow="autoplay"`.
  - `frameBorder="0"`.
  - `scrolling="no"`.
- **Paso 3.2:** Ajustar clases Tailwind para responsive (con `visual=true` el artwork necesita altura suficiente para no colapsar):
  - Móvil (por defecto): `h-[300px]`.
  - Desktop (`md:` o `lg:`): `h-[400px]` o `h-[450px]`.
- **Paso 3.3:** Validar que el reproductor ocupe `w-full` del contenedor y respete el padding general de la página.

## Fase 4: Ensamblado Final y Testing Narrativo
- **Paso 4.1:** Modificar `/src/app/page.tsx` para importar el nuevo componente `LiveSets`.
- **Paso 4.2:** Ubicar el componente entre `<Biography />` y `<PhotoGallery />` (posición confirmada).
- **Paso 4.3:** Ejecutar en el navegador y validar el siguiente checklist:
  - Transición visual coherente Biografía → SOUNDS → Galería de fotos.
  - Comportamiento responsive correcto en mobile y desktop.
  - **Probar en mobile real** (no solo devtools): los iframes de SoundCloud tienen quirks de touch scroll que no se reproducen en emulación.
  - **LCP/CLS** no se degradan respecto al baseline (el `loading="lazy"` debería mitigar; medir con Lighthouse).
  - **Color match** visual entre el `#00d9ff` del player y el token `ando-cyan` del resto del sitio.
  - Efecto "One-Click Play": ninguna UI extra de SoundCloud (comentarios, related, reposts) debe aparecer y distraer al usuario.
