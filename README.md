# Movie Explorer

App para explorar películas hecha con **Nuxt 4 + Nuxt UI**, consumiendo la API pública de [TMDB](https://www.themoviedb.org/documentation/api).

## Qué incluye

- Búsqueda de películas con debounce
- Tendencias de la semana y populares en portada
- Filtro por género
- Página de detalle: sinopsis, reparto, tráiler y "similares"
- La API key de TMDB **nunca se expone al navegador**: vive solo en el servidor (`server/api/tmdb/[...path].ts`), que actúa de proxy hacia TMDB.

## 1. Consigue una API key de TMDB (gratis)

1. Crea una cuenta en https://www.themoviedb.org/signup
2. Ve a **Configuración → API** → https://www.themoviedb.org/settings/api
3. Solicita una key tipo "Developer" (uso personal/no comercial, aprobación instantánea)
4. Copia el valor de **"API Key (v3 auth)"**

## 2. Configura las variables de entorno

```bash
cp .env.example .env
```

Y pega tu key en `.env`:

```
NUXT_TMDB_API_KEY=tu_api_key_de_tmdb
```

## 3. Instala y corre

```bash
pnpm install
pnpm dev
```

Abre http://localhost:3000

## Estructura relevante

```
app/
  pages/index.vue          → búsqueda, tendencias, populares, filtro por género
  pages/movie/[id].vue     → ficha de la película
  components/MovieCard.vue → tarjeta de póster
  components/MovieGrid.vue → grid con estados de carga/vacío
  composables/useTmdb.ts   → todas las llamadas a la API
  assets/css/main.css      → tema visual (paleta, tipografía, texturas)
server/
  api/tmdb/[...path].ts    → proxy que añade la api_key en el servidor
```

## Producción

```bash
pnpm build
pnpm preview
```

Recuerda definir `NUXT_TMDB_API_KEY` como variable de entorno en tu plataforma de despliegue (Vercel, Netlify, etc.), no la subas en el `.env` al repositorio.
