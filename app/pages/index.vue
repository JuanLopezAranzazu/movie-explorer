<script setup lang="ts">
const { searchMovies, getTrending, getPopular, getGenres, discoverByGenre } = useTmdb()

// --- Búsqueda con debounce manual ---
const searchInput = ref('')
const debouncedQuery = ref('')
let debounceTimer: ReturnType<typeof setTimeout>

watch(searchInput, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = value.trim()
  }, 400)
})

// --- Géneros ---
const { data: genresData } = await useAsyncData('genres', () => getGenres())
const genres = computed(() => genresData.value?.genres ?? [])

const selectedGenre = ref<number | null>(null)

function toggleGenre(id: number) {
  selectedGenre.value = selectedGenre.value === id ? null : id
  if (selectedGenre.value !== null) {
    searchInput.value = ''
    debouncedQuery.value = ''
  }
}

const selectedGenreName = computed(
  () => genres.value.find(g => g.id === selectedGenre.value)?.name ?? ''
)

// --- Modo de la página: búsqueda / género / explorar ---
const mode = computed<'search' | 'genre' | 'browse'>(() => {
  if (debouncedQuery.value) return 'search'
  if (selectedGenre.value) return 'genre'
  return 'browse'
})

const { data: searchData, pending: searchPending } = useAsyncData(
  'search-results',
  () => (debouncedQuery.value ? searchMovies(debouncedQuery.value) : Promise.resolve(null)),
  { watch: [debouncedQuery] }
)

const { data: genreResultsData, pending: genrePending } = useAsyncData(
  'genre-results',
  () => (selectedGenre.value ? discoverByGenre(selectedGenre.value) : Promise.resolve(null)),
  { watch: [selectedGenre] }
)

const { data: trendingData, pending: trendingPending } = await useAsyncData('trending', () => getTrending('week'))
const { data: popularData, pending: popularPending } = await useAsyncData('popular', () => getPopular())
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="marquee-noise relative overflow-hidden border-b border-ink-800 bg-ink-900">
      <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p class="font-display text-sm italic text-gold-400">
          Cartelera abierta día y noche
        </p>
        <h1 class="text-balance mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-ink-50 sm:text-5xl">
          Encuentra tu próxima película
        </h1>
        <p class="mt-4 max-w-lg text-ink-300">
          Busca entre miles de títulos, descubre lo que está en tendencia esta semana o explora por género.
        </p>

        <div class="mt-8 max-w-xl">
          <UInput
            v-model="searchInput"
            icon="i-lucide-search"
            size="xl"
            placeholder="Busca por título — “Ciudad de Dios”, “Amélie”…"
            :ui="{ base: 'bg-ink-950 ring-1 ring-ink-700 focus-visible:ring-gold-400 rounded-sm' }"
          >
            <template v-if="searchInput" #trailing>
              <UButton
                icon="i-lucide-x"
                variant="link"
                color="neutral"
                size="sm"
                aria-label="Borrar búsqueda"
                @click="searchInput = ''"
              />
            </template>
          </UInput>
        </div>

        <!-- Géneros -->
        <div v-if="genres.length" class="mt-6 flex flex-wrap gap-2">
          <button
            v-for="genre in genres"
            :key="genre.id"
            type="button"
            class="rounded-sm border px-3 py-1.5 text-sm transition-colors"
            :class="selectedGenre === genre.id
              ? 'border-gold-400 bg-gold-400/10 text-gold-300'
              : 'border-ink-700 text-ink-300 hover:border-ink-500 hover:text-ink-100'"
            @click="toggleGenre(genre.id)"
          >
            {{ genre.name }}
          </button>
        </div>
      </div>

      <div class="filmstrip h-3 w-full" />
    </section>

    <!-- Contenido -->
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <!-- Modo búsqueda -->
      <section v-if="mode === 'search'">
        <h2 class="font-display text-2xl text-ink-50">
          Resultados para «{{ debouncedQuery }}»
        </h2>
        <p v-if="searchData?.total_results" class="mt-1 text-sm text-ink-400">
          {{ searchData.total_results }} título{{ searchData.total_results === 1 ? '' : 's' }} encontrado{{ searchData.total_results === 1 ? '' : 's' }}
        </p>
        <div class="mt-6">
          <MovieGrid
            :movies="searchData?.results ?? []"
            :pending="searchPending"
            empty-title="Sin coincidencias"
            empty-description="No encontramos ninguna película con ese título. Revisa la ortografía o prueba con otro nombre."
          />
        </div>
      </section>

      <!-- Modo género -->
      <section v-else-if="mode === 'genre'">
        <h2 class="font-display text-2xl text-ink-50">
          Explorando: {{ selectedGenreName }}
        </h2>
        <div class="mt-6">
          <MovieGrid
            :movies="genreResultsData?.results ?? []"
            :pending="genrePending"
            empty-title="Nada por aquí todavía"
            empty-description="Prueba con otro género."
          />
        </div>
      </section>

      <!-- Modo explorar (por defecto) -->
      <template v-else>
        <section>
          <div class="flex items-baseline justify-between">
            <h2 class="font-display text-2xl text-ink-50">
              Tendencia esta semana
            </h2>
            <UIcon name="i-lucide-flame" class="size-5 text-gold-400" />
          </div>
          <div class="mt-6">
            <MovieGrid :movies="trendingData?.results ?? []" :pending="trendingPending" />
          </div>
        </section>

        <section class="mt-16">
          <div class="flex items-baseline justify-between">
            <h2 class="font-display text-2xl text-ink-50">
              Populares
            </h2>
            <UIcon name="i-lucide-ticket" class="size-5 text-gold-400" />
          </div>
          <div class="mt-6">
            <MovieGrid :movies="popularData?.results ?? []" :pending="popularPending" />
          </div>
        </section>
      </template>
    </div>
  </div>
</template>
