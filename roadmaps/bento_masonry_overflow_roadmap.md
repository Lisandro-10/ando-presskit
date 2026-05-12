# ANDO Presskit — Roadmap

## Video Gallery: Overflow escalable

### Contexto

`VideoGallery.tsx` tiene un bento desktop fijo para exactamente 5 videos ([VideoGallery.tsx:178-203](../src/components/VideoGallery.tsx#L178-L203)). Hoy hay 7 videos en [lib/data.ts:35-58](../lib/data.ts#L35-L58) y se irán sumando a medida que toquen más eventos (estimado: hasta ~10, pero abierto).

Problemas del bento actual:
- `videos[5+]` no se renderiza.
- Si el array baja a `<5`, crashea por índices undefined (`videos[4]`).
- No escala a más eventos sin tocar el componente.

### Decisión de diseño

**Grid uniforme con `orientation` declarada en data**, no masonry.

Razones (auditoría del approach masonry original):
- CSS `columns` rompe orden de lectura (top-down-luego-derecha).
- Requiere `break-inside-avoid` por card, no mencionado.
- `whileInView` de framer-motion interactúa raro con columnas CSS.
- `aspectClass` ciclado por índice mentía sobre el contenido real → `object-cover` croppea feo.
- Masonry con 2 items (overflow actual) en 3 columnas se ve desbalanceado.

Grid uniforme: simple, escala lineal, respeta aspect real de cada video, mantiene orden de lectura, sin librerías ni hacks CSS.

---

## Fase 1 — Overflow escalable + defensa <5 videos

### 1.1 `lib/data.ts` — agregar `orientation` opcional

Cada video declara su orientación. Default `wide` si se omite.

```ts
videos: [
  { src: '/videos/video-1.MP4', orientation: 'tall' },
  { src: '/videos/video-2.mp4', orientation: 'wide' },
  // ...
]
```

Valores: `'tall'` (9/16, vertical de celular) o `'wide'` (16/9, filmación de cámara).

### 1.2 `src/components/VideoGallery.tsx`

**a) Type local actualizado:**
```ts
interface Video {
  src: string;
  orientation?: 'tall' | 'wide';
}
```

**b) Defensa del bento para `videos.length < 5`:**
El bento desktop sólo se renderiza si `videos.length >= 5`. Si hay menos, cae al grid uniforme con todos los videos. Mobile no cambia (ya itera todos con `.map`).

**c) Sección overflow desktop (sólo si `videos.length > 5`):**

Debajo del bento, `videos.slice(5)` en grid uniforme `grid-cols-3`:

```tsx
<div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 mt-4">
  {videos.slice(5).map((video, i) => (
    <VideoCard
      key={i + 5}
      video={video}
      playOnHover
      isDimmed={hoveredId !== null && hoveredId !== i + 5}
      onHoverStart={() => setHoveredId(i + 5)}
      onHoverEnd={() => setHoveredId(null)}
      className={video.orientation === 'tall' ? 'aspect-[9/16]' : 'aspect-video'}
      animDelay={i * 0.08}
      preloadMode="none"
    />
  ))}
</div>
```

- `grid-cols-3` fijo: con 2 overflow llena 2 de 3 cols; con 5 llena 1 fila + 2; escala sin huecos.
- `aspect-video` (16/9) o `aspect-[9/16]` según `orientation` — alturas heterogéneas por row son aceptables en grid.
- `hoveredId` se extiende con índice global (`i + 5`) → dim cross-section funciona sin tocar la lógica existente.

**d) Optimización de carga:**
Prop nueva `preloadMode?: 'metadata' | 'none'` en `VideoCard`. Pasada como `'none'` en overflow. El `<video>` actual usa `preload="metadata"` hardcodeado en [VideoGallery.tsx:110](../src/components/VideoGallery.tsx#L110); con 10 videos eso son 10 requests al mount. Overflow carga cuando entra al viewport.

### Lo que NO se toca

- Mobile vertical stack + IntersectionObserver ([líneas 169-173](../src/components/VideoGallery.tsx#L169-L173)).
- Bento desktop (`grid-cols-4 grid-rows-2`, `78vh`, `slice(1,5)`).
- Lógica de mute, play overlay, framer-motion en `VideoCard`.

---

## Fase 2 — (Futuro / Opcional) Metadata extendida

Si se quieren títulos o nombres de eventos por video:

```ts
title?: string       // ej. "OSA Club — Mar 2026"
venue?: string       // ej. "OSA Club, Mendoza"
```

Renderizar como overlay sutil en hover sobre cada card. No bloqueante para Fase 1.

## Fase 3 — (Futuro / Opcional) Lightbox

Modal de reproducción al click con controles completos. Usar `<video controls>` nativo dentro de un modal — **no** introducir `react-player`. Útil para booking agents revisando en desktop.

---

## Archivos afectados

| Archivo | Fase 1 | Fase 2 | Fase 3 |
|---------|--------|--------|--------|
| `lib/data.ts` | ✅ `orientation` | ✅ `title`, `venue` | — |
| `src/components/VideoGallery.tsx` | ✅ Modifica | ✅ Modifica | ✅ Modifica |
| `src/components/VideoModal.tsx` | — | — | ✅ Nuevo |

---

## Por qué escala

- **Agregar un video** = 1 línea en `lib/data.ts` con su `orientation`. Cero cambios de componente.
- **Hasta ~10 videos**: bento (5) + overflow grid de 5 = una fila perfecta de 3 + segunda fila con 2. Balanceado.
- **Si baja a `<5`**: fallback automático, no crashea.
- **Performance**: overflow no pide metadata hasta entrar al viewport.

---

## Verificación

1. `npm run dev` y abrir `localhost:3000`.
2. Desktop (`>=1024px`):
   - Con 7 videos actuales: bento + 2 cards overflow en primera fila.
   - Editar `lib/data.ts` a 10 videos: bento + 5 overflow (1 fila + 2 en segunda).
   - Editar a 4 videos: solo grid uniforme, sin bento, sin crash.
   - Hover sobre overflow: dim cross-section funciona.
3. Mobile (`<1024px`): stack vertical igual, todos los videos con autoplay IntersectionObserver.
4. Network tab: videos overflow no piden metadata hasta scroll cerca.
5. `npm run lint` limpio.

---

## Descartado (del roadmap original)

- **Masonry CSS `columns`**: orden lectura roto, `break-inside-avoid` faltante, conflicto con `whileInView`.
- **`aspectClass` ciclado por índice**: arbitrario, miente sobre contenido real.
- **Fase 2 metadata como fase separada**: `orientation` (mínimo necesario) se integra en Fase 1.
- **Etiqueta "Más momentos"**: rompe continuidad visual con el bento.
- **`react-player`** para lightbox: `<video controls>` nativo alcanza.

---

## Estado actual

- [x] Análisis del bento existente
- [x] Auditoría del approach masonry → descartado
- [x] Definición de arquitectura grid uniforme + `orientation`
- [x] **Fase 1 — Implementación overflow escalable + defensa <5**
- [ ] Fase 2 — Metadata extendida (title, venue)
- [ ] Fase 3 — Lightbox
