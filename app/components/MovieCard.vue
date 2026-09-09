<script setup lang="ts">
import type { TmdbMovie } from '~/types/tmdb'

const props = defineProps<{ movie: TmdbMovie }>()

const { posterUrl, releaseYear } = useTmdb()

const poster = computed(() => posterUrl(props.movie.poster_path, 'w342'))
const rating = computed(() => (props.movie.vote_average ? props.movie.vote_average.toFixed(1) : null))
</script>

<template>
  <NuxtLink
    :to="`/movie/${movie.id}`"
    class="group block focus-visible:outline-2 focus-visible:outline-gold-400 outline-offset-2 rounded-sm"
  >
    <div class="relative aspect-[2/3] overflow-hidden rounded-sm bg-ink-800 ring-1 ring-ink-700 group-hover:ring-gold-400/70 transition-[box-shadow,ring-color] duration-200">
      <img
        v-if="poster"
        :src="poster"
        :alt="`Póster de ${movie.title}`"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      >
      <div
        v-else
        class="flex h-full w-full flex-col items-center justify-center gap-2 bg-ink-800 px-4 text-center text-ink-400"
      >
        <UIcon
          name="i-lucide-image-off"
          class="size-6"
        />
        <span class="text-xs">Sin póster disponible</span>
      </div>

      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/0 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div
        v-if="rating"
        class="absolute right-2 top-2 flex items-center gap-1 rounded-sm bg-ink-950/80 px-1.5 py-0.5 text-xs font-medium text-gold-300 backdrop-blur-sm"
      >
        <UIcon
          name="i-lucide-star"
          class="size-3 fill-gold-400 text-gold-400"
        />
        {{ rating }}
      </div>
    </div>

    <div class="mt-2">
      <h3 class="truncate text-sm font-medium text-ink-50 group-hover:text-gold-300 transition-colors">
        {{ movie.title }}
      </h3>
      <p class="text-xs text-ink-400">
        {{ releaseYear(movie.release_date) }}
      </p>
    </div>
  </NuxtLink>
</template>
