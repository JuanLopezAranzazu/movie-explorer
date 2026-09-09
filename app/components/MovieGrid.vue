<script setup lang="ts">
import type { TmdbMovie } from '~/types/tmdb'

defineProps<{
  movies: TmdbMovie[]
  pending?: boolean
  emptyTitle?: string
  emptyDescription?: string
}>()
</script>

<template>
  <div>
    <div
      v-if="pending"
      class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      <div v-for="n in 10" :key="n" class="space-y-2">
        <div class="aspect-[2/3] animate-pulse rounded-sm bg-ink-800" />
        <div class="h-3 w-4/5 animate-pulse rounded-sm bg-ink-800" />
        <div class="h-3 w-1/4 animate-pulse rounded-sm bg-ink-800" />
      </div>
    </div>

    <div
      v-else-if="!movies.length"
      class="flex flex-col items-center gap-3 border border-dashed border-ink-700 rounded-sm py-16 text-center"
    >
      <UIcon name="i-lucide-film" class="size-7 text-ink-500" />
      <p class="font-display text-lg text-ink-100">
        {{ emptyTitle || 'No hay resultados' }}
      </p>
      <p class="max-w-xs text-sm text-ink-400">
        {{ emptyDescription || 'Prueba con otro título, otro género o revisa la ortografía.' }}
      </p>
    </div>

    <div
      v-else
      class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>
  </div>
</template>
