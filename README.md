# Handoff: Sitio web Solario

> Para Claude Code (o cualquier desarrollador/diseñadora). Este README es autosuficiente:
> explica qué es el sitio, cómo editarlo, cómo verlo en local y cómo publicarlo.

## Qué es esto

Un **sitio web estático** de una sola página (one-pager) para Solario, ya funcional.
Está hecho con **HTML + CSS + JavaScript puro** (sin framework, sin build step).
Incluye una animación de "wallpaper" interactiva por WebGL (el cursor actúa como sol),
tipografía Montserrat, paleta de marca Solario (cobalto + celeste del rombo), y una
transición de fondo de cobalto oscuro → blanco al hacer scroll.

**Importante:** Estos archivos son el sitio real, no una maqueta. Se pueden editar y
publicar tal cual. NO necesitas reescribirlo en React/Vue/etc. — a menos que la diseñadora
quiera migrarlo a otra plataforma, en cuyo caso úsalos como referencia de alta fidelidad.

## Fidelidad

**Alta fidelidad (producción).** Colores, tipografía, espaciado, fotos e interacciones son
los definitivos. Lo que ves es lo que se publica.

## Archivos

| Archivo | Qué es | ¿Editar? |
|---|---|---|
| `Solario Website.html` | La página. Estructura (hero, foto, secciones), textos y el `<script>` de comportamiento. | **Sí** — aquí van textos y estructura. |
| `site.css` | Todos los estilos: colores, tipografía, layout, la transición de fondo. | **Sí** — aquí van colores, tamaños, espaciado. |
| `shaders.js` | Motor WebGL del wallpaper animado (5 wallpapers, el cursor es el sol). | Avanzado — solo si se quiere tocar la animación. |
| `assets/` | Las 4 fotos (instalación BESS + 3 detalles de galería). | Reemplazar por fotos reales. |
| `tweaks.jsx` + `tweaks-panel.jsx` | Panel de "Tweaks" para experimentar en vivo (acento, velocidad, fondo blanco, etc.). | **Opcional / quitar en producción** (ver abajo). |

## Cómo verlo en local

No hay build. Solo necesitas servir la carpeta con un servidor estático (porque el HTML
carga `site.css`, `shaders.js` y las fotos por ruta relativa; abrir el archivo con doble
clic puede bloquear esas cargas por seguridad del navegador).

```bash
# dentro de esta carpeta
python3 -m http.server 8000
# luego abre http://localhost:8000/Solario%20Website.html
```

O con Node: `npx serve` y abre la URL que imprime.

## Cómo editar (lo más común)

- **Cambiar textos:** edita `Solario Website.html` directamente (busca el texto en el archivo).
- **Cambiar fotos:** reemplaza los archivos en `assets/` conservando el nombre, o cambia el
  `src` en el HTML. Recomendado: exportar a **JPG** (~1600px de ancho, calidad ~82%) para que
  el sitio cargue más rápido — hoy son PNG y pesan.
- **Colores de marca:** en `site.css`, al inicio, en `:root`:
  - `--accent: #8ecff1;` (celeste del rombo Solario — botones y acentos)
  - `--bg: #060c22;` (cobalto oscuro de fondo)
  - La transición cobalto→blanco está en las reglas `.dawn`, `.zone-mid`, `.zone-light`.
- **Tipografía:** Montserrat, cargada desde Google Fonts en el `<head>` del HTML. La variable
  es `--font` en `site.css`.
- **La animación del wallpaper:** `shaders.js`. El sol se estaciona cuando no hay movimiento;
  el tamaño/brillo del sol se controla con la expresión `exp(-d*2.7)` (subir el número = sol
  más chico). Es código WebGL — tratar con cuidado.

### El panel de "Tweaks" (importante para producción)

El sitio incluye un panel de ajustes en vivo (`tweaks.jsx`, `tweaks-panel.jsx`) que sirvió
para diseñar. **Es una herramienta de edición, no parte del sitio público.** Antes de
publicar para usuarios finales, conviene quitarlo:

1. En `Solario Website.html`, elimina los `<script>` que cargan React, Babel, `tweaks-panel.jsx`
   y `tweaks.jsx` (cerca del final del archivo).
2. Los valores que controla el panel (acento, "fondo blanco tras la foto", etc.) ya tienen
   un default aplicado en el HTML/CSS, así que el sitio se ve igual sin el panel.

> Si la diseñadora quiere conservar el panel para seguir experimentando, puede dejarlo —
> solo aparece cuando se activa el modo Tweaks.

## Cómo publicarlo (hosting)

Es un sitio estático, así que es muy fácil. Opción recomendada:

**Netlify (gratis, sin configuración):**
1. Crea cuenta en netlify.com.
2. Arrastra esta carpeta a `app.netlify.com/drop` → queda publicado con una URL temporal.
3. En *Domain settings*, conecta el dominio `solario.mx` (Netlify te da los registros DNS
   que pones con el proveedor del dominio).

Alternativas equivalentes: **Vercel**, **Cloudflare Pages**, **GitHub Pages**, o el hosting
que ya use Solario (subir los archivos por FTP a la raíz pública).

## Pendientes recomendados antes del lanzamiento

- [ ] Comprimir las fotos de `assets/` a JPG (hoy pesan ~8 MB en total).
- [ ] Quitar el panel de Tweaks (ver arriba).
- [ ] Revisar textos/datos definitivos (tarifas, números, copys).
- [ ] Agregar `<title>`, `favicon` y meta tags Open Graph (para que el link se vea bien al
      compartir y en Google). Hoy el `<title>` es básico.
- [ ] Decidir si los enlaces del menú (Soluciones, Tarifas, etc.) hacen scroll dentro de la
      página (actual) o llevan a páginas separadas.

## Tokens de diseño (referencia)

- **Color**
  - Acento / celeste rombo: `#8ECFF1`
  - Cobalto fondo: `#060C22` → `#123069` (gradiente)
  - Tinta clara (texto sobre oscuro): `#EEF2FB`
  - Tinta oscura (texto sobre blanco): `#0C1733`
- **Tipografía:** Montserrat (400/500/600/700)
- **Radios:** tarjetas 16–20px
- **Secciones:** padding vertical ~130px, ancho máx. ~1240px

## Notas

- No hay backend ni base de datos: todo es estático.
- El sitio funciona sin conexión una vez cargado, salvo la fuente de Google (se puede
  autoalojar Montserrat si se quiere 100% offline).
- Para una versión empaquetada en **un solo archivo** (para mandar por correo/WhatsApp),
  existe `Solario Website - Compartir.html` en el proyecto original — pero para hosting y
  edición usa los archivos sueltos de esta carpeta.
