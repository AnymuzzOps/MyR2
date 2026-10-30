# Logo del header

Esta carpeta contiene el recurso que aparece a la izquierda del header.

## Cómo reemplazarlo

1. Exporta el logo preferentemente como SVG, con fondo transparente y formato cuadrado o aproximadamente cuadrado.
2. Reemplaza `logo-myr.svg` conservando exactamente el mismo nombre y esta ubicación.
3. Si el archivo final es PNG o WebP, guárdalo aquí y cambia `assets/logo/logo-myr.svg` en `index.html` por el nombre correspondiente.

El componente adapta automáticamente el recurso a escritorio y móvil mediante `object-fit: contain`; no es necesario exportarlo con las dimensiones exactas del header.
