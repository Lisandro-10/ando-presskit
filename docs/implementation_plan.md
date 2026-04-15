# Refactorización Integral "State of the Art 2026": ANDO Presskit

Esta es una refactorización de **toda la web** enfocada en elevarla al máximo nivel visual y de interacción, fusionando el **Bento Grid Asimétrico (A)** con las **Tarjetas Interactivas de Hover (C)**, y aplicando este lenguaje fluido y *Premium* a todos los componentes.

## Visión Holística del Diseño (El Sistema Visual 2026)
*   **Aura Dinámica (Glow-sync):** El fondo oscuro (`ando-navy`) dejará de ser plano. Al interactuar con videos o eventos, destellos sutiles de colores (cian/morado) se proyectarán dinámicamente detrás del grid.
*   **Glassmorfismo Profundo:** Las tarjetas, fondos de texto y modales serán paneles de cristal ahumado (`backdrop-blur-md bg-white/5 border-white/10`), dando sensación de profundidad cinematográfica.
*   **Framer Motion Avanzado:** Utilizaremos animaciones fluidas (springs físicos), desenfoques dinámicos (`blur`), y efectos de brillo condicionales dependiendo de dónde esté el ratón.

---

## Cambios Propuestos por Componente

### 1. `VideoGallery.tsx` (El Foco Principal)
**Diseño:** Bento Grid Híbrido Asimétrico con Blur Dinámico.
*   **Layout:** En desktop, mostraremos todos los videos principales a la vez en una cuadrícula irregular (ej: El primer video es más grande ocupando un eje central/lateral, y al lado videos en cuadrícula 2x2. Estilos Masonry asimétricos).
*   **Interacción (Opción A + C combinadas):**
    *   En estado de reposo, todos tienen un sutil overlay oscuro.
    *   Al hacer **hover en un video**, éste se ilumina, hace un ligero *zoom in* y comienza a reproducirse asumiendo foco total.
    *   **Efecto "Focus":** Simultáneamente, **el resto de los videos se oscurecen aún más o se desenfocan por completo (`blur-md lg:blur-lg`)**. Esto crea un contraste de altísimo nivel visto en sitios tope de gama, atrayendo la mirada solo a lo que importa.

### 2. `Events.tsx`
*   Pasaremos del esquema estático de cajas a un estilo **Neon/Glassmorphic Cards**.
*   Agregaremos un efecto **Hover 3D Tilt** en la tarjeta del evento principal (Main Event): La tarjeta se inclina físicamente hacia el cursor simulando 3D utilizando `framer-motion` al mover el ratón encima.

### 3. `Hero.tsx`
*   La foto de fondo tendrá un efecto de "respiración" constante (escalado hiper suave entre 1.0 y 1.05 infinito) que da vida a la intro.
*   Efecto de Partículas o textura de "Ruido/Grano" sutil por encima de la foto para maximizar la vibra *"Underground"*.
*   El texto "ANDO." reaccionará a la entrada del ratón y con parallax al hacer scroll.

### 4. `PhotoGallery.tsx`
*   Dejaremos atrás el clásico "carrusel slider con flechas".
*   Las fotos se presentarán en un **Scattered o Bento Masonry**, donde unas fotos pueden estar ligeramente rotadas o solapadas. Al pasar el mouse, emergen al frente (`z-index` y escala).

### 5. `Biography.tsx`
*   El texto estará alojado dentro de tarjetas flotantes con gradientes dinámicos bajo ellas en vez de ser texto sobre fondo oscuro plano. Aparecerán flotando suavemente desde abajo (`y: 50` a `y: 0` progresivo con scroll).

### 6. `Footer.tsx` e Información de Contacto
*   Botones magnéticos (el botón "sigue" al mouse unos píxeles cuando estás cerca).
