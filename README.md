# Amigurumis Artesanales - Sitio Web

Un sitio web para vender amigurumis (peluches tejidos a mano) con panel de administración integrado.

## Despliegue en Render

### 1. Preparación del Repositorio

1. Crea un repositorio en GitHub con todo el código
2. Asegúrate de que el archivo `public/data/db.json` esté incluido

### 2. Configuración en Render

1. Ve a [render.com](https://render.com) y crea una cuenta si no tienes una
2. Conecta tu cuenta de GitHub
3. Clic en "New" → "Static Site"
4. Selecciona tu repositorio
5. Configura:
   - **Name**: amigurumi-shop (o el nombre que prefieras)
   - **Branch**: main
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `out`
6. En "Environment", agrega la variable:
   - `NODE_ENV`: `production`
7. Clic en "Create Static Site"

### 3. Configuración de next.config.mjs para Static Export

Asegúrate de que tu `next.config.mjs` incluya:

\`\`\`javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
\`\`\`

## Panel de Administración

### Acceso

1. Ve a `/admin` en tu sitio
2. Ingresa la contraseña: `Jose_Pl00`

### Funciones

- **Productos**: Agregar, editar, eliminar productos con imágenes
- **Contenido**: Editar todos los textos del sitio (hero, catálogo, historia, contacto, footer)
- **Galería**: Agregar, reordenar y eliminar imágenes de la galería

### Publicar Cambios

Al hacer clic en "Guardar y Publicar", se te pedirá:

1. **GitHub Personal Access Token (PAT)**: Se guarda en sessionStorage para sesiones futuras
2. **Nombre del repositorio**: formato `usuario/nombre-repo`

Los cambios se guardan directamente en el repositorio vía GitHub API, y Render redesplega automáticamente (30-60 segundos).

## Cómo obtener un GitHub PAT

1. Ve a GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Selecciona scope: `repo` (acceso completo)
5. Genera y copia el token

## Configuración de Cloudinary (Opcional)

Para subir imágenes reales en lugar de placeholders:

1. Crea una cuenta en [cloudinary.com](https://cloudinary.com)
2. Ve a Settings → Upload
3. Scroll hasta "Upload presets"
4. Clic en "Add upload preset"
5. Configura:
   - **Signing Mode**: Unsigned
   - **Upload preset name**: `amigurumi_shop`
6. Guarda
7. En `components/admin-dashboard.tsx`, cambia `CLOUDINARY_CLOUD_NAME` por tu cloud name

## Estructura del Proyecto

\`\`\`
├── app/
│   ├── admin/
│   │   └── page.tsx          # Panel de administración
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página principal
├── components/
│   ├── admin-dashboard.tsx   # Dashboard completo
│   ├── admin-login.tsx       # Formulario de login
│   ├── navbar.tsx            # Navegación
│   ├── hero-section.tsx      # Sección hero
│   ├── products-grid.tsx     # Grid de productos
│   ├── about-section.tsx     # Sección historia
│   ├── gallery-section.tsx   # Galería de imágenes
│   ├── contact-form.tsx      # Formulario de contacto
│   ├── footer.tsx            # Footer
│   └── ui/                   # Componentes shadcn/ui
├── lib/
│   └── db-context.tsx        # Contexto de datos global
└── public/
    └── data/
        └── db.json           # Base de datos JSON
\`\`\`

## Tecnologías

- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4
- shadcn/ui
- Cloudinary (imágenes)
- GitHub API (persistencia)
