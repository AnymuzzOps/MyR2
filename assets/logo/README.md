# Logo del header

Esta carpeta contiene el recurso que aparece a la izquierda del header.

## Cómo reemplazarlo

1. Exporta el logo como SVG con fondo transparente y formato cuadrado o aproximadamente cuadrado.
2. Reemplaza `logo-myr.svg` conservando exactamente el mismo nombre y esta ubicación.
3. Si utilizas otro nombre o formato, actualiza `assets/logo/logo-myr.svg` en `index.html`.

El componente adapta automáticamente el recurso a escritorio y móvil mediante `object-fit: contain`; no es necesario exportarlo con las dimensiones exactas del header.
