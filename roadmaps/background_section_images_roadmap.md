# ANDO Presskit — Roadmap

## Rediseño: 4 secciones, sin CMS

> **Reemplaza la versión anterior de este roadmap.** Aquella planificaba convertir el material de las galerías en fondos full-bleed de 5 secciones, con un wrapper `SectionBackground`, presets de overlay, un video de loop en LiveSets y un campo `section` en los schemas de Sanity. Partía de conservar Biografía, las galerías como fuente de medios y Sanity como CMS: las tres premisas cayeron.

La dirección definitiva es más chica y más simple.

- **4 secciones:** Hero → Próximas Fechas → Live Sets → Contact.
- **Máximo 4 fotos en todo el sitio**, y no todas como fondo de sección.
- Hero conserva su diseño actual. Próximas Fechas lleva foto de fondo. Live Sets **sin** foto de fondo — tiene iframes de SoundCloud y probablemente YouTube. Contact es de dos columnas: info a un lado, foto al otro.
- Se mantiene la paleta (`ando-navy`, `ando-cyan`) y la tipografía.
- **Sanity sale del proyecto.** Con ~3 imágenes, 4 textos y un puñado de URLs el Studio no se paga: el contenido vuelve a `lib/data.ts` y las imágenes a `public/photos/`. Las fechas las carga el dueño del repo con git; Vercel redeploya en el push.
- No hay video de fondo: desaparece toda la fase de compresión del plan anterior, y con ella el riesgo de ancho de banda.

De 7 secciones y 9 componentes a **4 secciones y 4 componentes**, sin capa de CMS.

---

## Estado final

| Sección | Componente | Fondo | Foto |
|---|---|---|---|
| Hero | `Hero.tsx` | imagen + scrim + grano (como hoy) | `hero-bg.jpg` |
| Próximas Fechas | `Events.tsx` | imagen `grayscale` + scrim | `piba_16-05-2026.jpg` |
| Live Sets | `LiveSets.tsx` | `bg-ando-navy` liso | — |
| Contact | `Contact.tsx` | `bg-ando-navy` liso | `fiesta_under.jpeg` (columna, no fondo) |

**3 de las 4 fotos permitidas.** El cuarto slot queda libre; `finca_anita_byn.jpeg` es el suplente, aunque viene con barras negras de screenshot.

Elección de fotos, mirando el material real:
- `hero-bg.jpg` — nocturna, desenfocada, luces de ciudad, mucho espacio negativo arriba. Ya es el fondo del Hero y funciona.
- `piba_16-05-2026.jpg` — nocturna, en color, contrapicado dramático. La única de "gig en vivo": encaja narrativamente con Próximas Fechas y es lo bastante oscura para llevar texto encima.
- `fiesta_under.jpeg` — retrato de estudio B/N de los dos, vertical 4:5. Es la foto de "a quién estás contactando": columna de Contact.

**Se elimina:** `Biography.tsx`, `PhotoGallery.tsx`, `VideoGallery.tsx`, `Footer.tsx`, `SectionTittle.tsx`, todo `sanity/`, `/studio`, `scripts/migrate.*`.

---

## Decisiones tomadas

| Tema | Decisión |
|---|---|
| Biografía | Se elimina la sección. Sobrevive como 1–2 líneas bajo el tagline del Hero. |
| Footer | Se absorbe dentro de Contact. La página termina en Contact. |
| Fechas | Lista simple, sin destaque "Main Event". Ordenada de más nueva a más vieja, paginada de a 5 con un botón "ver todas". `date` con formato fijo `DD.MM.YYYY`. |
| Imágenes | Locales en `public/photos/`, usadas tal cual (las 4 que quedan pesan ≤186 KB). |
| Sanity | Sale por completo. Las fechas las edita el dueño del repo con git. |

---

## Fase 0 — Rescatar el contenido del dataset ✅ HECHO

El contenido vivía **solo** en Sanity, no en el repo. Ya está extraído y transcrito abajo (§ Apéndice). Verificado además que `siteSettings.heroImage` es **byte-idéntico** a `public/photos/hero-bg.jpg` (mismo md5), así que apuntar al archivo local no cambia nada.

No existen documentos `event` en el dataset: las fechas del apéndice salen del `lib/data.ts` anterior a la integración de Sanity (commit `9b6a6ac`) y **están vencidas** (feb/mar 2026). Hay que reemplazarlas.

---

## Fase 1 — Sacar Sanity

Un commit propio, mecánico. La página queda rota hasta la Fase 3: hacer 1→3 sin publicar en el medio.

**Borrar:**
- `sanity/` completo — `client.ts`, `env.ts`, `image.ts`, `queries.ts`, `structure.ts`, `schemaTypes/*` (6 schemas)
- `sanity.config.ts`, `sanity.cli.ts`
- `src/app/studio/[[...tool]]/` (layout + page)
- `scripts/migrate.js`, `scripts/migrate.ts` — poblaban el dataset

**Editar:**
- `package.json`: quitar `sanity`, `next-sanity`, `@sanity/image-url`, `@sanity/vision`, `@sanity/orderable-document-list` y `styled-components` (solo estaba para el Studio). `npm install` para regenerar el lockfile.
- [next.config.ts](../next.config.ts): eliminar `images.remotePatterns` — era solo `cdn.sanity.io`. `formats` y `deviceSizes` se quedan.
- `.env.local`: quedan 3 vars `*_SANITY_*` sin uso. Vaciarlo o borrarlo, y **revisar también las env vars del proyecto en Vercel**, que no se limpian solas.

**Verificar:** `grep -ri sanity src/ lib/ next.config.ts package.json` no devuelve nada.

---

## Fase 2 — `lib/data.ts` vuelve a ser la fuente de contenido

Hoy [lib/data.ts](../lib/data.ts) es solo tipos. Pasa a exportar tipos **y** un objeto `presskitData` — el patrón que ya describe [CLAUDE.md](../CLAUDE.md) y que la integración de Sanity había desmontado.

```ts
export const presskitData: PresskitData = {
  hero:     { tagline, bio, imageSrc },              // bio: 1–2 líneas
  events:   { imageSrc, list: [{ name, location, date }] },   // date: 'DD.MM.YYYY'
  liveSets: [{ title, url }],                        // SoundCloud o YouTube
  contact:  { imageSrc, people: [{ name, phone }], directEmail, socials: [{ label, url }] },
}
```

Valores concretos en el apéndice.

**`date` deja de ser string libre.** El orden de la lista ya no lo define el array sino la fecha (Fase 4), y eso obliga a poder parsearla: el formato pasa a ser `DD.MM.YYYY`, fijo. Se sigue escribiendo a mano, pero el formato es un contrato. Documentarlo en un comentario arriba del array.

**Tipos a podar:** `Photo`, `Video`, `VideoOrientation` y `BiographySegment` quedan sin consumidor. `EventInfo` sobrevive tal cual; `Contact` se reemplaza por `Person` (solo `name` + `phone`).

`orientation`, `poster`, `photo.description`, `contact.email` y `contact.instagram` ya eran datos muertos — se mapeaban en `page.tsx` y no los renderizaba nadie. No se migran.

---

## Fase 3 — `page.tsx` + Hero

### [src/app/page.tsx](../src/app/page.tsx)

Deja de ser `async`. Se van el `client.fetch`, `revalidate = 60`, los 5 bloques de `.map()` y el `eslint-disable` de `any`. Queda:

```tsx
import { presskitData } from '../../lib/data'

<main className="min-h-screen bg-ando-navy">
  <Hero {...presskitData.hero} />
  <Events {...presskitData.events} />
  <LiveSets sets={presskitData.liveSets} />
  <Contact {...presskitData.contact} />
</main>
```

Sin `Footer` (Fase 6). El sitio pasa a ser estático puro: sin fetch, sin ISR.

### [src/components/Hero.tsx](../src/components/Hero.tsx)

Diseño intacto — parallax de mouse, doble `h1` desktop/mobile, scrim, grano, `scale` en loop. Tres cambios:

1. **Línea de bio** bajo el tagline (después de [Hero.tsx:106](../src/components/Hero.tsx#L106)): `font-spaceGrotesk`, `text-white/80`, `max-w-xl`, `text-sm lg:text-base`, con el mismo `text-shadow` que el resto del bloque. Es lo único que sobrevive de Biografía.
2. **`sizes="100vw"`** en el `<Image fill>` de [Hero.tsx:52](../src/components/Hero.tsx#L52), que hoy no lo tiene.
3. `src` directo (`/photos/hero-bg.jpg`), sin el fallback `heroImageUrl ?? …` de [Hero.tsx:36](../src/components/Hero.tsx#L36).

`priority` se queda: Hero sigue siendo el LCP y es la única imagen que debe tenerlo.

---

## Fase 4 — Próximas Fechas con foto de fondo

[Events.tsx](../src/components/Events.tsx) existe pero **nadie lo importa**, y su único cambio sin commitear es el título `Próximos Eventos` → `Próximas Fechas` (ya correcto). Se reescribe.

### Estructura

Root: `"relative w-full overflow-hidden bg-ando-navy px-6 py-20 lg:px-10 lg:py-28"`. Hoy le falta `relative`; sin eso un `absolute inset-0` se posiciona contra el viewport, no contra la sección.

Capas, siguiendo el patrón ya validado en Hero (imagen → scrim → contenido `z-10`), **sin** copiar la animación de `scale` en loop ni `priority`:

```tsx
<Image src={imageSrc} alt="" fill sizes="100vw" className="object-cover grayscale" />
<div className="absolute inset-0 bg-ando-navy/70" />   {/* scrim */}
<motion.div className="relative z-10 mx-auto max-w-5xl"> … </motion.div>
```

`grayscale` mantiene la identidad visual — las galerías servían las fotos así — y sube el contraste sin gastar opacidad.

### Contenido

- Encabezado igual al de LiveSets: `h2` "Próximas Fechas" + regla cyan `"mx-auto mt-4 h-0.5 w-16 bg-ando-cyan"`.
- **Una sola lista.** Se elimina el destaque "Main Event" y la grilla de dos columnas ([Events.tsx:27-59](../src/components/Events.tsx#L27-L59)): filas apiladas con fecha (`text-ando-cyan`, tabular), nombre y ubicación.
- Si `list` viene vacío, la sección no renderiza (`if (list.length === 0) return null`). El guard actual es `if (!main) return null` y desaparece junto con `main`.

### Orden y paginación

**Orden: de la más nueva a la más vieja** (descendente por fecha). No depende del orden del array — se ordena en el componente:

```ts
const PAGE_SIZE = 5

// 'DD.MM.YYYY' → timestamp. Formato fijo, ver Fase 2.
const toTime = (d: string) => {
  const [dd, mm, yyyy] = d.split('.').map(Number)
  return new Date(yyyy, mm - 1, dd).getTime()
}

const sorted = useMemo(
  () => [...list].sort((a, b) => toTime(b.date) - toTime(a.date)),   // b - a = descendente
  [list],
)
```

Para invertir a "la próxima primero" se cambia `toTime(b.date) - toTime(a.date)` por `a - b`. Es el único lugar donde vive esa decisión.

**Paginación:** se muestran las primeras `PAGE_SIZE` filas. Si `sorted.length > PAGE_SIZE`, debajo va un botón que despliega el resto:

```tsx
const [expanded, setExpanded] = useState(false)
const visible = expanded ? sorted : sorted.slice(0, PAGE_SIZE)
```

- El botón solo se renderiza si hay más de 5 fechas — con 5 o menos no debe aparecer.
- Label con el total, para que se entienda qué esconde: `Ver todas (12)` ⇄ `Ver menos`. Estilo consistente con el sitio: `text-[10px] uppercase tracking-[0.3em]`, `text-ando-muted` → `hover:text-ando-cyan`.
- `aria-expanded={expanded}` en el `<button>`.
- Es un toggle, no paginación por páginas: no hay "siguiente/anterior" ni estado de página. Despliega todo y vuelve a plegar.
- Al plegar, hacer scroll de vuelta al tope de la sección si el usuario quedó por debajo — si no, colapsar 20 filas lo deja flotando en el medio de Live Sets.

### Animación

- Las primeras 5 filas mantienen el reveal `whileInView` + `viewport={{ once: true }}` con `delay: index * 0.1`.
- **Las filas que aparecen al desplegar NO usan `whileInView`.** Montan ya dentro del viewport o por debajo, y `whileInView` con `once: true` puede dejarlas en `opacity: 0` si el observer no dispara. Usar `initial` + `animate` directo, con `AnimatePresence` para la salida al plegar.
- El delay escalonado se calcula sobre el índice **dentro del tramo desplegado**, no sobre el índice global: con 20 fechas, `index * 0.1` daría 2 segundos hasta la última fila. Cortar el escalonado en ~6 filas (`Math.min(index, 6) * 0.05`).

### Contraste

Sobre foto, las cards `bg-white/5` actuales no alcanzan. Cada fila va sobre `bg-black/50 backdrop-blur-md` con borde `border-white/10`, y el texto secundario sube de `text-white/50` a `text-white/70` mínimo.

**Objetivo ≥ 4.5:1 medido, no a ojo.** Si no cierra, primero se sube el panel, no el scrim global: subir el scrim tapa la foto en toda la sección, que es justamente lo que se quiere mostrar.

---

## Fase 5 — Live Sets

[LiveSets.tsx](../src/components/LiveSets.tsx) es el que menos cambia. Ya tiene `relative … overflow-hidden` + inner `relative z-10`, y **no lleva foto de fondo**: `bg-ando-navy` liso, como hoy.

Único cambio real — soporte YouTube en `buildEmbedUrl` ([LiveSets.tsx:10-16](../src/components/LiveSets.tsx#L10-L16)), que hoy asume SoundCloud siempre:

```ts
function buildEmbedUrl(url: string): string {
  if (/youtu\.?be/.test(url)) {
    const id = /* extraer v= de youtube.com o el path de youtu.be */
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0`
  }
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&visual=true&color=%2300d9ff&…`
}
```

El `<iframe>` conserva `loading="lazy"` y la card `bg-white/5 backdrop-blur-md`; a `allow="autoplay"` hay que sumarle `; encrypted-media; picture-in-picture` para YouTube. La altura `h-[300px] md:h-[450px]` sirve para ambos; si un video de YouTube queda con barras, pasar esa card a `aspect-video`.

Renombrar la prop `trackUrl` → `url` en `LiveSet` — ya no es solo un track de SoundCloud. Agregar el guard de lista vacía que hoy falta.

---

## Fase 6 — Contact a dos columnas, absorbiendo el Footer

[Contact.tsx](../src/components/Contact.tsx) se reescribe y [Footer.tsx](../src/components/Footer.tsx) desaparece: wordmark ANDO, links de Instagram y copyright pasan acá. La página termina en Contact.

Root: `"relative w-full overflow-hidden bg-ando-navy px-6 py-20 lg:px-10 lg:py-28"`.

```
<div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
  ├─ columna info
  └─ columna imagen
</div>
```

En mobile colapsa a una columna, **info primero y foto después**: el CTA no debe quedar debajo del pliegue por una imagen.

### Columna izquierda — info

1. `h2` "Contact" con la regla cyan, para igualar el tratamiento de las otras dos secciones. Hoy Contact es la única sin `<h2>`, solo un eyebrow.
2. Personas: `name` en `text-lg font-bold text-white`, teléfono como `tel:`. **Subir de `text-white/50` a `text-white/70`** ([Contact.tsx:39](../src/components/Contact.tsx#L39)) — es el contraste más bajo del sitio.
3. Divisor + "Consultas Directas" + `mailto:`. El bloque de [Contact.tsx:47-60](../src/components/Contact.tsx#L47-L60) se conserva tal cual.
4. Socials desde `presskitData.contact.socials`. **Reutilizar `MagneticLink`** ([Footer.tsx:12-63](../src/components/Footer.tsx#L12-L63)): mover ese componente dentro de `Contact.tsx` sin cambios — ya trae el spring, el radio de 80px y el check `matchMedia('(hover: hover)')`. De paso arregla que los handles estén hardcodeados ([Footer.tsx:70,74](../src/components/Footer.tsx#L70)) mientras el dato existía en `siteSettings.socials`.
5. Cierre: wordmark "ANDO" + `© {new Date().getFullYear()}`, en menor jerarquía que el bloque de contacto.

### Columna derecha — imagen

`fiesta_under.jpeg` en `"relative aspect-[4/5] w-full overflow-hidden rounded-2xl"` + `<Image fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />`, **sin `priority`**. Sin scrim ni overlay: acá la foto es contenido, no fondo, y no hay texto encima.

---

## Fase 7 — Limpieza de assets y estilos globales

### Componentes a borrar

`Biography.tsx`, `PhotoGallery.tsx` (151 ln), `VideoGallery.tsx` (239 ln), `Footer.tsx`, `SectionTittle.tsx` — este último ya estaba muerto y su espaciado ni siquiera coincide con los encabezados reales.

### `public/`

- **Borrar `public/videos/` entero — 54.5 MB, 8 archivos**, todos huérfanos cuando muere `VideoGallery`. Vercel despliega `public/` completo: es la mayor reducción de peso del rediseño.
- Borrar de `public/photos/`: `finca-la-anita.jpg` (1.88 MB) y `piba.JPEG` (1.62 MB), sin uso. Quedan las 4 chicas (155 / 131 / 178 / 186 KB), que se usan tal cual — `next/image` las sirve en avif/webp.

### [src/app/globals.css](../src/app/globals.css)

- **Corregir `.hero-grain`**: `z-index: 11` ([globals.css:29](../src/app/globals.css#L29)) es mayor que el `z-10` del contenido del Hero, y su padre `absolute` no crea contexto de apilamiento — el grano pinta sobre el título. Pasa desapercibido solo por `opacity: .055` + `mix-blend-mode: overlay`. Bajarlo a `z-index: 1`: encima de la imagen y el scrim, debajo del contenido.
- El grano se queda **solo en Hero**; no replicarlo en Events.

### [src/app/layout.tsx](../src/app/layout.tsx)

La imagen OG apunta a `/hero-bg.jpg` (línea 17) y el archivo está en `/photos/hero-bg.jpg`. Corregir la ruta.

---

## Verificación

1. `npm run lint` y `npm run build` — limpio, sin referencias muertas. Confirmar que el build ya no depende de env vars (`sanity/env.ts` lanzaba si faltaban).
2. `npm run dev`, recorrer las 4 secciones en desktop y mobile (≤375px):
   - **Hero:** parallax de mouse, el grano **no** pinta sobre el título, la línea de bio entra sin romper el layout.
   - **Próximas Fechas:** la foto se lee **como foto** fuera de los paneles. Si con el scrim aplicado no se distingue qué muestra, está mal calibrado.
   - **Paginación de fechas:** cargar >5 fechas desordenadas en `presskitData` y confirmar que se muestran ordenadas de más nueva a más vieja, que se ven solo 5, que el botón despliega el resto **visibles** (no en `opacity: 0`) y que vuelve a plegar sin dejar el scroll colgado. Con exactamente 5 o menos, el botón no aparece.
   - **Live Sets:** cargar una URL de SoundCloud y una de YouTube en `presskitData` y confirmar que ambas embeben.
   - **Contact:** dos columnas en desktop, apilado con info arriba en mobile; el imán de los socials funciona con mouse y no rompe en touch.
3. **Contraste medido** con el color picker de DevTools: texto sobre los paneles de Próximas Fechas **≥ 4.5:1**.
4. Network: ninguna request a `cdn.sanity.io`, ningún `.mp4`, ninguna imagen below-the-fold con `priority`, todo `<Image fill>` con `sizes`.
5. `/studio` devuelve 404.
6. Lighthouse mobile sobre `npm run build && npm start`: **LCP < 2.5s**, sin regresión de CLS. Debería mejorar: se van dos secciones de `78vh` con video y la carga de datos remota.

**Criterio de salida:** se aprueba solo si cumple el punto 2 (foto legible), el 3 (AA medido) y el 6 (LCP). «Mejora la estética» no es criterio de salida.

---

## Orden de implementación

0. ~~Rescatar el contenido del dataset~~ ✅ hecho, ver apéndice.
1. Sacar Sanity: archivos, deps, config, studio, scripts.
2. `lib/data.ts` con `presskitData`.
3. `page.tsx` estático + Hero (bio, `sizes`, src local).
4. Events: fondo, lista simple, contraste.
5. LiveSets: YouTube + guard.
6. Contact a dos columnas absorbiendo Footer.
7. Borrar componentes muertos, `public/videos/`, fotos sin uso; fix de `.hero-grain` y de la ruta OG.
8. Verificación con los umbrales medidos.

---

## Fuera de alcance

- **No se crea el wrapper `SectionBackground`** del plan anterior: con **una sola** sección con fondo, un componente polimórfico con presets es más maquinaria que la que ahorra. Si aparece una segunda, se extrae ahí.
- Sin video de fondo, y por lo tanto sin `prefers-reduced-motion`: no hay nada nuevo que respetar, el `scale` del Hero ya existía.
- Sin comprimir imágenes: las 4 que quedan pesan ≤186 KB.
- No se tocan `tailwind.config.ts` ni las fuentes.

---

## Riesgos a controlar

- **El contenido vivía solo en Sanity.** Mitigado: ya está transcrito abajo. No borrar `sanity/` sin haber commiteado el `lib/data.ts` nuevo.
- **Las fechas del apéndice están vencidas** (feb/mar 2026). Sin fechas reales, la sección Próximas Fechas no renderiza y el sitio queda en 3 secciones.
- **Una fecha mal tipeada rompe el orden en silencio.** `toTime` sobre un string que no sea `DD.MM.YYYY` devuelve `NaN` y esa fila queda en una posición arbitraria, sin error visible. Si aparece más de una vez, conviene un fallback que mande los `NaN` al final.
- **Con solo 2 fechas cargadas, la paginación no se puede probar.** Verificarla con datos de prueba antes de dar la fase por cerrada, no cuando ya haya 6 fechas reales en producción.
- **La página queda corta:** −390 líneas de galerías más Biografía y Footer. Medir el largo final antes de dar el rediseño por cerrado.
- **El overlay ahoga la foto en Events** → mitigado por contraste local (panel) en vez de global (scrim).
- **Env vars huérfanas en Vercel** tras quitar Sanity: no se limpian solas.
- Hero anima su fondo con `scale` en loop infinito ([Hero.tsx:48-50](../src/components/Hero.tsx#L48-L50)). **No replicar esa animación en Events.**

---

## Estado actual

- [x] Definidas las 4 secciones finales y el rol de cada foto
- [x] Decidido: Biografía → línea en Hero; Footer → dentro de Contact
- [x] Decidido: fechas como lista simple, `date` string libre
- [x] Decidido: Sanity sale del proyecto
- [x] Fase 0 — contenido rescatado del dataset
- [x] Fase 1 — Sanity fuera
- [x] Fase 2 — `lib/data.ts` con `presskitData`
- [x] Fase 3 — `page.tsx` + Hero
- [x] Fase 4 — Próximas Fechas
- [x] Fase 5 — Live Sets
- [x] Fase 6 — Contact
- [x] Fase 7 — limpieza
- [x] Verificación con umbrales medidos

### Resultados medidos (2026-08-07)

| Criterio | Umbral | Medido | |
|---|---|---|---|
| Contraste texto sobre paneles de Próximas Fechas | ≥ 4.5:1 | **9.43:1** (peor panel, `white/70`); cyan 11.03:1; nombre 18.73:1 | ✅ |
| LCP mobile (build de producción, 4x CPU + Slow 4G) | < 2.5 s | **0.64 s** en frío, 0.27 s tibio | ✅ |
| CLS | sin regresión | **0** | ✅ |
| Foto de Events legible como foto | cualitativo | sí, fuera de los paneles se lee la escena completa | ✅ |
| `/studio` | 404 | 404 | ✅ |
| Requests a `cdn.sanity.io` / `.mp4` | 0 | 0 | ✅ |
| `public/` | — | 57 MB → **648 KB** | ✅ |
| Largo de página (desktop) | medir | 3819 px, 4 secciones | ✅ |

**Desvío del plan — animación de entrada del Hero.** El elemento LCP no era la
imagen sino el texto del Hero: con `initial={{ opacity: 0 }}` no pinta hasta que
hidrata Framer Motion, lo que daba **3412 ms** en carga fría y hacía fallar el
criterio 6. Se quitó la animación de entrada (fade + scale) del título, el
tagline, la bio y el top bar, que ahora se renderizan visibles desde el SSR.
El parallax de mouse y de scroll, y el `scale` en loop del fondo, se conservan.
Esto contradice el «Hero: diseño intacto» de la Fase 3 y fue una decisión
explícita del dueño del repo frente a la alternativa de reimplementar la entrada
en CSS.

---

## Apéndice — Contenido rescatado del dataset

Extraído de Sanity el 2026-08-07, antes de desmontarlo. **Es la única copia fuera del dataset.**

**Hero**
- Tagline: `Progressive House/  Organic House/ Underground House` (normalizar espacios)
- Imagen: `siteSettings.heroImage` es byte-idéntico a `public/photos/hero-bg.jpg`

**Biografía** (fuente para la línea del Hero — hay que condensarla a 1–2 líneas)
> **ANDO** es un proyecto conformado por Juan Pablo y Lisandro Andia, dos primos unidos por la música y el descubrimiento de sonidos en conjunto. Su propuesta sonora gira en torno a un groove hipnótico y persistente que da identidad a cada set. El sonido oscila entre atmósferas oscuras y profundas o momentos más orgánicos, donde la melodía y la emoción cobran protagonismo, sin perder el groove hipnótico que los define.
>
> Haber crecido juntos escuchando música les permite retroalimentar sus gustos logrando una conexión que se traduce en un sello propio.

**Live Sets**
| Título | URL |
|---|---|
| Hidden Echoes Vol. 1 | `https://soundcloud.com/ando-ku/ando-hidden-echoes-set-vol-1` |
| Echoes in the Dark Set (Vol.2) | `https://soundcloud.com/ando-ku/ando-echoes-in-the-dark-set` |

**Contacto**
| Nombre | Teléfono |
|---|---|
| Lisandro Andia | `+54 9 261 2567201` |
| Juan Pablo Andia | `+54 9 261 2191185` |

- Email directo: `info.ando.ku@gmail.com`
- Socials: `instagram.com/ando.ku` · `instagram.com/lisan_andia` · `instagram.com/coloandia`
- (`soundcloud.com/ando-ku` y `ando-ku.com` estaban en `siteSettings.socials`; decidir si entran en Contact)

**Fechas** — ⚠️ no hay documentos `event` en el dataset. Esto sale del `lib/data.ts` anterior a Sanity (commit `9b6a6ac`) y **está vencido**:
| Fecha | Nombre | Lugar |
|---|---|---|
| 28.02.2026 | PIBÄ BAR | Carrodilla, Mendoza |
| 28.03.2026 | OSA Club | Mendoza, Argentina |
