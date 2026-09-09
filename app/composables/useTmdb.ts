import type { TmdbGenre, TmdbMovie, TmdbMovieDetails, TmdbPagedResponse } from '~/types/tmdb'

export function useTmdb() {
  const searchMovies = (query: string, page = 1) =>
    $fetch<TmdbPagedResponse<TmdbMovie>>('/api/tmdb/search/movie', {
      query: { query, page, include_adult: false }
    })

  const getTrending = (window: 'day' | 'week' = 'week') =>
    $fetch<TmdbPagedResponse<TmdbMovie>>(`/api/tmdb/trending/movie/${window}`)

  const getPopular = (page = 1) =>
    $fetch<TmdbPagedResponse<TmdbMovie>>('/api/tmdb/movie/popular', { query: { page } })

  const getTopRated = (page = 1) =>
    $fetch<TmdbPagedResponse<TmdbMovie>>('/api/tmdb/movie/top_rated', { query: { page } })

  const getGenres = () =>
    $fetch<{ genres: TmdbGenre[] }>('/api/tmdb/genre/movie/list')

  const discoverByGenre = (genreId: number | null, page = 1) =>
    $fetch<TmdbPagedResponse<TmdbMovie>>('/api/tmdb/discover/movie', {
      query: {
        page,
        sort_by: 'popularity.desc',
        ...(genreId ? { with_genres: genreId } : {})
      }
    })

  const getMovieDetails = (id: string | number) =>
    $fetch<TmdbMovieDetails>(`/api/tmdb/movie/${id}`, {
      query: { append_to_response: 'credits,videos,similar' }
    })

  const posterUrl = (path?: string | null, size: 'w185' | 'w342' | 'w500' | 'original' = 'w500') =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null

  const backdropUrl = (path?: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null

  const profileUrl = (path?: string | null, size: 'w185' | 'original' = 'w185') =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null

  const releaseYear = (date?: string | null) => (date ? date.slice(0, 4) : '—')

  return {
    searchMovies,
    getTrending,
    getPopular,
    getTopRated,
    getGenres,
    discoverByGenre,
    getMovieDetails,
    posterUrl,
    backdropUrl,
    profileUrl,
    releaseYear
  }
}
