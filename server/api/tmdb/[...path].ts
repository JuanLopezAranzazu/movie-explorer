// Proxy server-side hacia TMDB. La app nunca expone la api_key al cliente:
// el navegador solo llama a /api/tmdb/..., y este handler adjunta la key
// desde runtimeConfig (variable de entorno NUXT_TMDB_API_KEY) antes de
// reenviar la petición a api.themoviedb.org.
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.tmdbApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Falta configurar NUXT_TMDB_API_KEY en el servidor (archivo .env).'
    })
  }

  const path = getRouterParam(event, 'path')
  const query = getQuery(event)

  try {
    return await $fetch(`https://api.themoviedb.org/3/${path}`, {
      query: {
        ...query,
        api_key: config.tmdbApiKey,
        language: query.language || 'es-ES'
      }
    })
  } catch (err: any) {
    throw createError({
      statusCode: err?.response?.status || 502,
      statusMessage: err?.data?.status_message || 'No se pudo consultar TMDB.'
    })
  }
})
