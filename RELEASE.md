# Revisión para entrega de M&R Consultores

## Alcance

Revisión del contenido público y árbol completo de la rama main, HTML, CSS, JavaScript y publicación GitHub Pages. No se auditaron todos los commits históricos ni la configuración privada de Formspree/correo. No se enviaron consultas a producción.

## Correcciones

- Selector alineado con los servicios actuales; Contabilidad y Auditorías conserva el valor `Contabilidad` para la preselección de planes.
- Nombre sin espacios vacíos y longitud limitada, correo con límite y teléfono con 7–15 dígitos; límites en HTML y JavaScript.
- Campo señuelo `_gotcha`, validación antes del POST, feedback accesible, prevención de duplicados y datos conservados ante errores. El éxito requiere HTTP satisfactorio y `ok: true` de Formspree.
- Aviso y página de privacidad; no se guardan datos de consulta en localStorage/sessionStorage. No hay claves privadas en el código revisado. El endpoint Formspree es un identificador público, no un secreto.
- CSP por meta compatible con el sitio estático: scripts locales, conexiones solo a Formspree y recursos externos limitados. Referrer-Policy por meta y enlaces externos con noopener/noreferrer.
- Contraste mejorado de botones turquesa con texto blanco, foco visible, salto al contenido, movimiento reducido y reparación del ancho de portada en tablet.
- CTA de diagnóstico al formulario y enlace de mapa unificado con la dirección vigente.
- Cabecera/footer usan una exportación WebP del logo existente (~25 KB); favicon conserva la ruta SVG con una versión ligera (~9 KB). La apariencia se conserva mediante renderizado del logo, sin redibujarlo. El original permanece en assets/logo/.
- Metadatos Open Graph/Twitter e imagen JPEG de 1200 × 675 para compartir (~64 KB). Canonical e imagen absoluta usan el dominio definitivo indicado por el propietario: https://myrconsultores.cl/.
- Exclusión de README de recursos, documentación y archivos de desarrollo en la generación de Pages. Se elimina el archivo de prueba vacío `archivo.txt` y el marcador de favicon, ya innecesario. `.gitignore` evita agregar secretos y resultados de desarrollo por accidente.

## Validación realizada

Chromium con HTTP local bajo `/MyR2/`, CSP activa y las fuentes Inter/Poppins reales descargadas para las pruebas (no incorporadas al repositorio). Anchos 1920, 1440, 1024, 768, 680, 390 y 320 px: menú móvil, Escape/foco, enlaces internos existentes, textos sin desbordamiento y enlaces externos seguros.

Los tres planes se verificaron en 1440, 390 y 320 px con POST interceptado: servicio contable y Plan de interés correctos, limpieza tras éxito, borrado del plan al cambiar servicio. Casos: datos inválidos, campo señuelo, HTTP 422/429, fallo de red, JSON inválido, respuesta sin confirmar, tiempo de espera y doble envío. No hubo errores JavaScript ni violaciones CSP en las pruebas controladas.

Se decodificaron realmente los logos de clientes, imágenes de Oficina Virtual, cabecera/footer, retratos de Camila y Gustavo, y la imagen social. Las rutas restantes se contrastaron con el árbol de GitHub. Cuatro PNG de retratos de más de 1 MB (Daniela, Fabiola, Johanna y Estefany) no pudieron descargarse: el conector devuelve contenido vacío para esos archivos y el proxy impide usar raw.githubusercontent.com. Se conservan intactos. La carga real de esos cuatro retratos queda pendiente; son también la principal mejora de peso pendiente.

No se comprobó la disponibilidad en vivo de redes sociales, redirecciones de mapas, entrega de correo ni Reply-To. Durante las pruebas se sustituyeron mapa/Unsplash por respuestas controladas para aislar el sitio y no depender de servicios externos.

## Antes de publicar / configuración externa

1. Revisar y fusionar el PR. El último despliegue de Pages observado antes de este PR era satisfactorio. Comprobar que el nuevo despliegue finalice y que Jekyll aplique las exclusiones de `_config.yml` (no usar `.nojekyll` sin una alternativa que excluya documentación).
2. Configurar el dominio definitivo `myrconsultores.cl` en el hosting, DNS y certificado HTTPS. Canonical, og:url y og:image ya apuntan a https://myrconsultores.cl/. Configurar la redirección de www al dominio principal. Las rutas públicas son relativas y el ZIP se extrae en la raíz pública del hosting.
3. En Formspree, verificar casilla destino, Reply-To desde `email`, dominios permitidos, límites de uso, filtros antispam y conservación/eliminación de consultas. Activar protección adicional de bots si el volumen lo requiere. La validación del navegador y el campo señuelo no sustituyen la validación y limitación en el proveedor.
4. Prueba manual autorizada con datos ficticios tras publicar: recepción en bandeja y spam y respuesta al correo ficticio/controlado correcto. La aceptación HTTP no acredita llegada a la bandeja de entrada.
5. Validar con el responsable el aviso de privacidad, plazos de conservación y requisitos de consentimiento para los recursos externos (Google Fonts, Maps y Unsplash). No se inventaron plazos ni políticas de proveedores.
6. GitHub Pages no permite fijar todos los headers de seguridad del servidor desde este HTML. HTTPS obligatorio se activa en Pages. `frame-ancestors`, HSTS y otros headers requieren configuración del hosting/CDN; no incluir frame-ancestors en una meta CSP, donde no se aplica.
7. Revisión final en navegador publicado: favicon, vista previa al compartir, cuatro retratos grandes y enlaces externos. Optimizar esos PNG a WebP a 400–600 px cuando se disponga de los originales.

## Dependencias y contenido

No hay paquetes JavaScript, lockfiles ni scripts remotos en producción. Google Fonts y el mapa son recursos externos permitidos por CSP; los recursos de marca y clientes siguen locales. No se encontraron contraseñas, tokens privados, textos de ejemplo visibles ni menciones accidentales de herramientas de IA en la página. Los archivos README de recursos contienen instrucciones internas y se excluyen del sitio generado, conservándolos como documentación del repositorio. No se eliminaron atribuciones ni licencias.
