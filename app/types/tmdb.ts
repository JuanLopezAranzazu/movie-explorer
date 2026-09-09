export interface TmdbGenre {
  id: number
  name: string
}

export interface TmdbMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
  genres?: TmdbGenre[]
}

export interface TmdbCastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface TmdbVideo {
  id: string
  key: string
  site: string
  type: string
  name: string
}

export interface TmdbMovieDetails extends TmdbMovie {
  tagline: string | null
  runtime: number | null
  credits?: { cast: TmdbCastMember[] }
  videos?: { results: TmdbVideo[] }
  similar?: { results: TmdbMovie[] }
}

export interface TmdbPagedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}
