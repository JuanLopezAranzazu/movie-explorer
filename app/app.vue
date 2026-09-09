<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'es' },
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }]
})

const title = 'Movie Explorer'
const description = 'Explora películas populares, en tendencia y por género usando la API de TMDB.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  themeColor: '#0D0D12'
})
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-ink-950 text-ink-50">
      <header class="sticky top-0 z-30 border-b border-ink-800 bg-ink-950/90 backdrop-blur">
        <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <NuxtLink
            to="/"
            class="rounded-sm outline-gold-400 outline-offset-4 focus-visible:outline-2"
          >
            <AppLogo />
          </NuxtLink>

          <UButton
            to="https://www.themoviedb.org/"
            target="_blank"
            variant="ghost"
            color="neutral"
            size="sm"
            class="text-ink-400 hover:text-ink-100"
          >
            Datos de TMDB
          </UButton>
        </div>
      </header>

      <main>
        <NuxtPage />
      </main>

      <footer class="mt-24 border-t border-ink-800">
        <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p class="text-sm text-ink-500">
            Movie Explorer usa la API de TMDB pero no está respaldada ni certificada por TMDB.
          </p>
        </div>
      </footer>
    </div>
  </UApp>
</template>
