# Guía de Overlays de Elecciones

Esta es una referencia de los parámetros URL disponibles para los overlays en `OverlayView.tsx`. Estos parámetros permiten personalizar la visualización de los resultados en vivo.

## Parámetros Comunes
- `w` / `width`: Ancho del overlay (por defecto `100%`). Ej: `w=800`
- `h` / `height`: Alto del overlay (por defecto `auto`). Ej: `h=400`
- `party`: Alternar entre vista de candidato (0) o partido (1). Afecta a `top`, `summary` y `bars`.

## Modos de Overlay (`?overlay=...`)

### `candidate`
Muestra información detallada de un candidato específico.
- `id`: ID del candidato (Requerido).
- `img`: Mostrar foto (1) u ocultar (0).
- `party`: Mostrar nombre del partido (1) u ocultar (0).
- `v`: Mostrar barra de porcentaje (1) u ocultar (0).
- `e`: Mostrar bloques de encuestas (1) u ocultar (0).
- `p`: Mostrar propuestas (1) u ocultar (0).
- `r`: Mostrar posición en el ranking (1) u ocultar (0).
- `ideo`: Mostrar ideología (1) u ocultar (0).

### `party`
Similar a `candidate` pero prioriza el nombre y logo del partido.
- `id`: ID del candidato asociado al partido (Requerido).
- `img`: Mostrar logo del partido (1) u ocultar (0).
- `cand`: Mostrar nombre del candidato como subtítulo (1) u ocultar (0).
- Parámetros adicionales: `v`, `e`, `r`, `ideo`.

### `top`
Muestra el ranking de los mejores resultados.
- `n`: Número de elementos a mostrar (por defecto 5, máx 10).
- `party`: Mostrar partidos (1) o candidatos (0) como principal.

### `summary` / `totals`
Resumen de la elección y estadísticas globales.
- `leader`: Mostrar sección de líder (1 o automático en summary).
- `countdown`: Mostrar cronómetro (1 o automático en summary).
- `stats`: Mostrar estadísticas globales (1 o automático en totals).
- `party`: Mostrar líder por partido (1) o candidato (0).
- `date`: Mostrar fecha de elección "DOMINGO 12 DE ABRIL, 2026" (1).
- `e`: Mostrar encuestas (Ipsos/Datum) del líder (1).
- `url`: Mostrar enlace `vote.auralixpe.xyz` al final (1).
- `size`: `small` para una versión más compacta.

### `ticker`
Cinta deslizante de resultados.
- `speed`: Velocidad de deslizamiento (por defecto 60).
- `h`: Altura de la cinta (por defecto 52).
- `bg`: Color de fondo en hexadecimal (ej: `0a0a14`).
- `accent`: Color de acento en hexadecimal (ej: `D4920A`).

### `lower-third`
Zócalos informativos para el tercio inferior.
- `id`: ID del candidato.
- `style`: Estilo visual (`line`, `block`, `pill`).
- `name`: Sobrescribir nombre del candidato.
- `sub`: Sobrescribir subtítulo.
- `pct`: Mostrar porcentaje (1) u ocultar (0).
- `img`: Mostrar imagen (1) u ocultar (0).

### `alert`
Alertas de proyecciones o avisos importantes.
- `id`: ID del candidato asociado.
- `type`: Tipo de alerta (`winner`, `update`, `info`).
- `title`: Título de la alerta.
- `body`: Cuerpo del mensaje.

### `bars`
Gráfico de barras de resultados.
- `n`: Número de candidatos a mostrar.
- `dir`: Dirección `v` para vertical (horizontal por defecto).
- `party`: Mostrar nombres y logos de partidos (1) o candidatos (0).