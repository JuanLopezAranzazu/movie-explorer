<script setup lang="ts">
const route = useRoute()
const { getMovieDetails, posterUrl, backdropUrl, profileUrl, releaseYear } = useTmdb()

const { data: movie, pending, error } = await useAsyncData(
  `movie-${route.params.id}`,
  () => getMovieDetails(route.params.id as string)
)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 404,
    statusMessage: 'No pudimos encontrar esa película.'
  })
}

useSeoMeta({
  title: () => movie.value?.title,
  description: () => movie.value?.overview
})

const poster = computed(() => posterUrl(movie.value?.poster_path, 'w500'))
const backdrop = computed(() => backdropUrl(movie.value?.backdrop_path, 'w1280'))
const rating = computed(() => movie.value?.vote_average?.toFixed(1))
const runtime = computed(() => {
  const mins = movie.value?.runtime
  if (!mins) return null
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h ? `${h} h ${m} min` : `${m} min`
})

const trailer = computed(() =>
  movie.value?.videos?.results.find(v => v.site === 'YouTube' && v.type === 'Trailer')
  ?? movie.value?.videos?.results.find(v => v.site === 'YouTube')
)

const cast = computed(() => movie.value?.credits?.cast.slice(0, 8) ?? [])
const similar = computed(() => movie.value?.similar?.results.slice(0, 10) ?? [])
</script>

<template>
  <div v-if="pending" class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
    <div class="h-8 w-1/3 animate-pulse rounded-sm bg-ink-800" />
    <div class="mt-6 aspect-video w-full animate-pulse rounded-sm bg-ink-800" />
  </div>

  <div v-else-if="movie">
    <!-- Backdrop -->
    <section class="relative border-b border-ink-800">
      <div class="absolute inset-0">
        <img
          v-if="backdrop"
          :src="backdrop"
          :alt="''"
          class="h-full w-full object-cover opacity-30"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-ink-950/40" />
      </div>

      <div class="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <UButton
          to="/"
          icon="i-lucide-arrow-left"
          variant="ghost"
          color="neutral"
          size="sm"
          class="mb-6 -ms-2 text-ink-300 hover:text-ink-50"
        >
          Volver a la cartelera
        </UButton>

        <div class="flex flex-col gap-8 sm:flex-row">
          <div class="w-40 shrink-0 sm:w-56">
            <div class="aspect-[2/3] overflow-hidden rounded-sm bg-ink-800 ring-1 ring-ink-700">
              <img
                v-if="poster"
                :src="poster"
                :alt="`Póster de ${movie.title}`"
                class="h-full w-full object-cover"
              >
              <div v-else class="flex h-full items-center justify-center text-ink-500">
                <UIcon name="i-lucide-image-off" class="size-8" />
              </div>
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <h1 class="text-balance font-display text-3xl font-semibold text-ink-50 sm:text-4xl">
              {{ movie.title }}
            </h1>
            <p v-if="movie.tagline" class="mt-2 font-display italic text-gold-400">
              {{ movie.tagline }}
            </p>

            <div class="mt-4 flex flex-wrap items-center gap-2">
              <span class="rounded-sm border border-ink-700 px-2.5 py-1 text-sm text-ink-200">
                {{ releaseYear(movie.release_date) }}
              </span>
              <span v-if="runtime" class="rounded-sm border border-ink-700 px-2.5 py-1 text-sm text-ink-200">
                {{ runtime }}
              </span>
              <span
                v-for="genre in movie.genres"
                :key="genre.id"
                class="rounded-sm border border-ink-700 px-2.5 py-1 text-sm text-ink-200"
              >
                {{ genre.name }}
              </span>
              <span v-if="rating" class="flex items-center gap-1 rounded-sm bg-gold-400/10 px-2.5 py-1 text-sm font-medium text-gold-300">
                <UIcon name="i-lucide-star" class="size-3.5 fill-gold-400 text-gold-400" />
                {{ rating }}
                <span class="text-gold-300/60">({{ movie.vote_count }})</span>
              </span>
            </div>

            <p class="mt-6 max-w-2xl text-ink-200 leading-relaxed">
              {{ movie.overview || 'No hay sinopsis disponible para esta película.' }}
            </p>

            <UButton
              v-if="trailer"
              :to="`https://www.youtube.com/watch?v=${trailer.key}`"
              target="_blank"
              icon="i-lucide-play"
              color="primary"
              class="mt-6 text-ink-950"
            >
              Ver tráiler
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <!-- Reparto -->
      <section v-if="cast.length">
        <h2 class="font-display text-2xl text-ink-50">
          Reparto
        </h2>
        <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-8">
          <div v-for="member in cast" :key="member.id" class="text-center">
            <div class="mx-auto aspect-square w-full overflow-hidden rounded-full bg-ink-800 ring-1 ring-ink-700">
              <img
                v-if="profileUrl(member.profile_path)"
                :src="profileUrl(member.profile_path) ?? undefined"
                :alt="member.name"
                class="h-full w-full object-cover"
              >
              <div v-else class="flex h-full items-center justify-center text-ink-500">
                <UIcon name="i-lucide-user" class="size-6" />
              </div>
            </div>
            <p class="mt-2 truncate text-sm font-medium text-ink-100">
              {{ member.name }}
            </p>
            <p class="truncate text-xs text-ink-400">
              {{ member.character }}
            </p>
          </div>
        </div>
      </section>

      <!-- Similares -->
      <section v-if="similar.length" class="mt-16">
        <h2 class="font-display text-2xl text-ink-50">
          Si te gustó esta, prueba con
        </h2>
        <div class="mt-6">
          <MovieGrid :movies="similar" />
        </div>
      </section>
    </div>
  </div>
</template>
