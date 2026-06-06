# Informe de Deuda Técnica — Migración a Next.js 16

> Auditoría y plan de migración (2026-06-06). Stack actual: Next.js 14.2.35 (App Router) +
> React 18.3.1 + Tailwind 3 + Framer Motion. SPA de presskit DJ, deploy en Vercel.
> Node 20.20.1 / npm 10.8.2.
>
> **Versión objetivo: Next.js 16.2.x** (la estable más reciente; doc de upgrade actualizada
> 2026-05-13). Alcance de esta migración: **Next 16 + React 19**. Tailwind se mantiene en v3.
>
> Fuentes: [Upgrading to Version 16 — Next.js](https://nextjs.org/docs/app/guides/upgrading/version-16) ·
> [Next.js 16 blog](https://nextjs.org/blog/next-16)

> ## ✅ Migración completada (2026-06-06)
>
> Next 16.2.7 + React 19.2.7 en producción local; `npm run build` y smoke test manual OK.
> Resumen de lo ejecutado:
> - `next` 14.2.35 → **16.2.7**, `react`/`react-dom` 18.3.1 → **19.2.7**, `@types/react(-dom)` → 19.x
>   (vía codemod `@next/codemod upgrade`, que además agregó `overrides` para los `@types`).
> - `eslint` ^8 → **^9** y `eslint-config-next` → **16.2.7**. El codemod no subió `eslint`,
>   provocó un `ERESOLVE` en el install; se corrigió a mano antes de reintentar.
> - ESLint migrado a **flat config** (`eslint.config.mjs`), `.eslintrc.json` eliminado y script
>   `"lint": "next lint"` → `"lint": "eslint ."`. **Ojo:** el codemod `next-lint-to-eslint-cli`
>   no hizo esta migración; se hizo manualmente. La flat config usa los imports **nativos**
>   de `eslint-config-next/core-web-vitals` y `/typescript` (arrays `Linter.Config[]`),
>   **no** `FlatCompat` — envolver la config legacy con `FlatCompat` rompía con
>   `TypeError: Converting circular structure to JSON`.
> - `data-scroll-behavior="smooth"` añadido al `<html>` en `layout.tsx`.
> - `npm audit fix` (sin `--force`): resueltas las *high* de la cadena de ESLint (`glob`,
>   `minimatch`, `flatted`) y de `picomatch`/`brace-expansion`. Se pasó de 10 vulns (7 high) a
>   **2 moderate**.
>
> **Pendiente / no realizado:**
> - 2 vulns *moderate* restantes: `postcss` anidado dentro de `next`
>   (`node_modules/next/node_modules/postcss`, arrastra `@vercel/analytics`). **No fixeable** desde
>   acá: lo bundlea Next y el advisory cubre hasta 16.3.0-canary. ⚠️ **No correr `npm audit fix
>   --force`** — propone downgrade de `next` a 9.3.3. Se resolverá con un patch upstream de Next.
> - Opcionales del runbook: ✅ `next.config.mjs` → **`next.config.ts`** (tipado con `NextConfig`);
>   ✅ bumps minor de `framer-motion` (→12.40) y `react-icons` (→5.6) vía `npm update` (dentro de
>   rango `^`). ⏸ `@vercel/analytics` a 2.x **descartado**: es un major sin beneficio (el postcss
>   vulnerable lo bundlea Next, no lo arregla este bump) → se mantiene en 1.6.1.
> - Subsección "Deuda de código" (§6) — ✅ resuelta (ver detalle en §6).

---

## 0. Resumen ejecutivo

La migración es **de bajo riesgo**. La app es una SPA App Router 100% client-rendered, sin rutas
dinámicas, sin `middleware`, sin APIs de servidor ni de caching, así que la mayoría de los
breaking changes de Next 16 **no aplican**.

El trabajo real se reduce a:

1. Subir `next` → 16, `react`/`react-dom` → 19 y sus `@types` (React 19 es obligatorio en Next 16).
2. Migrar ESLint a **flat config** (el comando `next lint` se elimina en v16).
3. Un ajuste menor de scroll en `layout.tsx`.

**Bonus:** subir `eslint-config-next` a 16 elimina de paso las vulnerabilidades *high* que hoy
arrastra la cadena de ESLint (`glob`, `minimatch`).

---

## 1. Pre-requisitos (ya cumplidos ✓)

| Requisito Next 16 | Mínimo | Actual | Estado |
|---|---|---|---|
| Node.js | 20.9.0 | 20.20.1 | ✓ |
| TypeScript | 5.1.0 | 5.9.3 | ✓ |

Navegadores soportados por v16: Chrome/Edge/Firefox 111+, Safari 16.4+ (sin impacto para este sitio).

---

## 2. Qué NO aplica a este proyecto (por qué es bajo riesgo)

Verificado por búsqueda en el código: **no se usa** ninguno de los grandes breaking changes de v16.

| Breaking change de Next 16 | ¿Se usa en el proyecto? |
|---|---|
| Async Request APIs (`cookies`, `headers`, `params`, `searchParams`) | No (no hay rutas dinámicas) |
| `middleware` → `proxy` | No hay middleware |
| APIs de caching (`revalidateTag`, `use cache`, PPR / `cacheComponents`) | No se usan |
| `next/legacy/image` | No (usa `next/image`) |
| `images.domains` | No (no hay imágenes remotas) |
| `serverRuntimeConfig` / `publicRuntimeConfig` | No se usan |
| Rutas paralelas (`default.js` obligatorio) | No hay rutas paralelas |
| AMP (`next/amp`) | No se usa |
| Config `webpack` custom | No existe |

---

## 3. Qué SÍ aplica — consideraciones reales

1. **React 18 → 19 (obligatorio).** Next 16 requiere React 19. Compatibilidad de dependencias ya
   verificada vía `peerDependencies`, sin conflictos:
   - `framer-motion` 12 → `^18.0.0 || ^19.0.0` ✓
   - `@vercel/analytics` 1.6.1 → `^18 || ^19` ✓
   - `react-icons` 5 → compatible ✓

2. **`next lint` eliminado.** El script `"lint": "next lint"` en `package.json` deja de funcionar.
   Hay que migrar a la ESLint CLI. Además `@next/eslint-plugin-next` ahora usa **flat config** por
   defecto (alineado con ESLint 10), por lo que `.eslintrc.json` → `eslint.config.mjs`.
   `next build` ya **no** corre lint automáticamente.

3. **Turbopack por defecto** en `next dev` y `next build`. Como no hay configuración `webpack`
   custom, el build no se rompe; simplemente pasa a Turbopack. (Si hiciera falta, existe `--webpack`
   para opt-out, pero no es necesario aquí.)

4. **`scroll-behavior: smooth` global.** En `src/app/globals.css` (líneas 22–24) el `<html>` tiene
   `scroll-behavior: smooth`. Next 16 ya **no** lo sobreescribe durante las transiciones de ruta.
   Impacto bajo (es single-page), pero para conservar el comportamiento previo conviene añadir
   `data-scroll-behavior="smooth"` al `<html>` en `src/app/layout.tsx`.

5. **Nuevos defaults de `next/image`** (informativo, sin cambios requeridos). La config actual de
   `next.config.mjs` (`formats`, `deviceSizes`) sigue siendo válida. Cambian defaults que no afectan
   a este sitio:
   - `qualities` → `[75]` (no se usa la prop `quality`).
   - `minimumCacheTTL` → 4h (antes 60s).
   - `imageSizes` → ya no incluye 16px.

---

## 4. Runbook paso a paso

```bash
# 1. Pre-flight: árbol limpio y branch dedicado
git checkout -b migrate/next-16

# 2. Codemod oficial (sube next/react/react-dom/@types, mueve config de turbopack
#    a top-level y migra `next lint` → ESLint CLI)
npx @next/codemod@canary upgrade latest

#    Alternativa manual al codemod:
#    npm i next@latest react@latest react-dom@latest
#    npm i -D @types/react@latest @types/react-dom@latest eslint-config-next@latest
```

3. **ESLint flat config:**
   - Convertir `.eslintrc.json` (`extends: ["next/core-web-vitals", "next/typescript"]`) a
     `eslint.config.mjs` con flat config.
   - Cambiar el script en `package.json`: `"lint": "next lint"` → `"lint": "eslint ."`.
   - Subir `eslint` a 9/10.

4. **`src/app/layout.tsx`:** añadir `data-scroll-behavior="smooth"` al elemento
   `<html lang="es">` para preservar el scroll suave en navegación.

5. **(Opcional)** subir `@vercel/analytics` a 2.x; bump minor de `framer-motion` (12.40) y
   `react-icons` (5.6).

6. **(Opcional)** convertir `next.config.mjs` → `next.config.ts` tipado con `NextConfig`.

---

## 5. Verificación post-migración

- `npm run build` (ahora con Turbopack) sin errores.
- `npm run dev` + smoke test manual:
  - Hero: imagen de fondo, parallax del título, animaciones.
  - VideoGallery: autoplay por IntersectionObserver (mobile) y hover (desktop), toggle de mute.
  - PhotoGallery: hover/contact-sheet (desktop) y carrusel swipe (mobile).
  - LiveSets: iframes de SoundCloud cargan.
  - Contact/Footer: links `tel:`/`mailto:`/Instagram.
  - Página 404 (`not-found.tsx`).
- `npm run lint` corre con la flat config.
- `npm audit`: confirmar que desaparecen las *high* de `glob`/`minimatch` (cadena de ESLint).

---

## 6. Contexto de soporte (deuda restante, fuera del alcance de esta migración)

### Versiones (estado tras migrar Next/React)

| Paquete | Pre-migración | Objetivo migración | Post-migración | Latest |
|---|---|---|---|---|
| next | 14.2.35 | **16.2.x** | ✅ 16.2.7 | 16.2.7 |
| react / react-dom | 18.3.1 | **19.x** | ✅ 19.2.7 | 19.2.7 |
| eslint-config-next | 14.2.35 | **16.x** | ✅ 16.2.7 | 16.2.7 |
| eslint | 8.57.1 | **9/10** | ✅ ^9 | 10.4.1 |
| tailwindcss | 3.4.19 | *(se mantiene v3)* | 3.4.x (sin cambios) | 4.3.0 |
| @vercel/analytics | 1.6.1 | opcional 2.0.1 | ⏸ 1.6.1 (no hecho) | 2.0.1 |
| framer-motion | 12.23.26 | opcional 12.40 | ⏸ 12.23.26 (no hecho) | 12.40.0 |

### Seguridad
Pre-migración: 10 vulnerabilidades (7 high, 3 moderate), todas en deps transitivas/dev.
**Post-migración: 2 moderate.** La subida a `eslint-config-next` 16 + `npm audit fix` resolvió las
*high* de la cadena de ESLint (`glob`, `minimatch`, `picomatch`, `flatted`) y `brace-expansion`.
Las 2 moderate restantes son del `postcss` que **bundlea Next** (`node_modules/next/node_modules/postcss`,
con `@vercel/analytics` colgando de next); npm solo lo "arregla" con `--force` haciendo downgrade de
`next` a 9.3.3, así que **no se aplica** — queda a la espera de un patch upstream de Next.

### Deuda de código

#### ✅ Resuelto (2026-06-06) — correcciones de código
- **`dangerouslySetInnerHTML` eliminado** en `Biography.tsx`. La biografía ahora es un array
  tipado de `BiographySegment[]` (`{ text, emphasis?: 'brand' | 'strong' }`) en `data.ts`; el
  componente renderiza cada segmento como `<span class="font-orbitron">` / `<strong>` / `<span>`.
  Sin HTML embebido en strings.
- **Tipado fuerte en `data.ts`.** Se agregó la interfaz `PresskitData` y tipos exportados
  (`Photo`, `Video`, `VideoOrientation`, `LiveSet`, `EventInfo`, `Contact`, `BiographySegment`).
  `VideoGallery.tsx` y `LiveSets.tsx` ahora **importan** los tipos en vez de redefinirlos, y se
  eliminaron los `as Video[]` / `as LiveSet[]`.
- **Email centralizado.** `Contact.tsx` ya no hardcodea `info.ando.ku@gmail.com`; sale de
  `presskitData.directEmail`.
- **Keys estables.** Reemplazados los `key={index}` / `key={i + 1}` por keys derivadas de datos
  (`video.src`, `photo.src`, `set.trackUrl`, `contact.name`, `'column1'/'column2'`) en
  `VideoGallery`, `PhotoGallery`, `LiveSets`, `Contact` y `Biography`.
- **Extensiones normalizadas en `data.ts`.** Las refs de video pasaron todas a `.mp4` minúscula
  (`video-1.mp4`, `piba.mp4`, `video-5.mp4`). ⚠️ **Requiere renombrar los archivos en disco**
  (ver comandos abajo) — hasta entonces dará 404 también en local (Linux es case-sensitive).
- **Código muerto removido de `page.tsx`:** import y uso comentados de `Events`.

#### ⏳ Pendiente — requiere correr comandos (a cargo del dev)
```bash
# 1. Normalizar extensiones en disco (data.ts ya apunta a minúsculas)
cd public/videos
git mv piba.MP4 piba.mp4
git mv video-1.MP4 video-1.mp4
git mv video-5.MP4 video-5.mp4
cd ../..

# 2. Borrar assets huérfanos (no referenciados en data.ts; ~21 MB)
git rm public/videos/rancho_aparte_2.mp4 public/videos/video-3.mp4

# 3. Borrar componentes muertos (sin uso tras limpiar page.tsx)
git rm src/components/Events.tsx src/components/SectionTittle.tsx
```
> Nota: si el filesystem local es case-insensitive y `git mv` se queja, usar
> `git mv piba.MP4 piba.tmp && git mv piba.tmp piba.mp4`.
