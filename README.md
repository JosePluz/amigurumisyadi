# Amigurumis Yadi

Este es un proyecto de sitio web estático para "Amigurumis Yadi", una tienda en línea de muñecos de ganchillo hechos a mano. El sitio está diseñado para ser desplegado en plataformas de hosting estático como Render, Vercel o Netlify.

## Estructura del Proyecto

- `index.html`: La página de inicio principal del sitio.
- `admin.html`: Un panel de administración protegido por contraseña para gestionar el contenido.
- `data/db.json`: Un archivo JSON que actúa como una base de datos simple para los productos y mensajes.
- `css/`: Contiene las hojas de estilo.
  - `styles.css`: Estilos para la página principal.
  - `admin.css`: Estilos para el panel de administración.
- `js/`: Contiene los scripts de JavaScript.
  - `main.js`: Lógica para la página principal (carga de productos).
  - `admin.js`: Lógica para el panel de administración (autenticación, gestión de contenido a través de la API de GitHub).
- `public/`: Contiene imágenes y otros activos estáticos.

## Administración de Contenido

El contenido del sitio (productos y mensajes) se gestiona a través del panel en `admin.html`.

1.  **Acceso**: Navega a `admin.html` y usa la contraseña para iniciar sesión (la contraseña está hardcodeada en `js/admin.js` para este ejemplo).
2.  **Gestión de Productos**: En la pestaña "Productos", puedes editar los detalles de cada producto. Haz clic en "Guardar y Publicar Cambios" para confirmar.
3.  **Gestión de Mensajes**: La pestaña "Mensajes de Clientes" muestra los mensajes enviados a través del formulario de contacto. Puedes borrarlos con el botón "Limpiar Mensajes".

**Importante**: El panel de administración utiliza la API de GitHub para escribir los cambios directamente en el archivo `data/db.json` del repositorio. Para que esto funcione, se ha incluido un token de acceso personal de GitHub en `js/admin.js`. **En un entorno de producción real, este token nunca debe exponerse en el lado del cliente.**

## Despliegue en Render

Este proyecto está optimizado para un despliegue sin problemas en Render.

-   **Build Command**: `echo "Static site"`
-   **Publish Directory**: `./`

El sitio es 100% estático y no requiere un proceso de construcción. Render servirá los archivos directamente desde el directorio raíz.