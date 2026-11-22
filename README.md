# M&R Consultores

Sitio estático publicado con GitHub Pages. La página usa HTML, CSS y JavaScript sin dependencias de ejecución ni compilación.

- Entrada: `index.html`; estilos: `styles.css`; comportamiento: `script.js`.
- Formulario: Formspree, identificador público configurado en el HTML. No guardar credenciales en el navegador ni en el repositorio.
- Privacidad: `privacidad.html`.
- Publicación: GitHub Pages/Jekyll con exclusiones en `_config.yml`.
- Revisión de entrega, validación y pendientes externos: [RELEASE.md](RELEASE.md).

Para revisar localmente, sirve la raíz mediante HTTP (por ejemplo, `python -m http.server 8000`). Las pruebas de formularios deben interceptar o simular Formspree para evitar consultas reales.
