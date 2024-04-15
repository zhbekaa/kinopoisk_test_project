export interface FilmCardInterface {
  id: number;
  img: string;
  title: string;
  year: number;
  genre: string;
  rating: number;
}
export interface FilmCardResponse {
  kinopoiskId: number;
  filmId?: number;
  posterUrlPreview: string;
  nameRu: string;
  nameEn?: string;
  nameOriginal?: string;
  year: number;
  genres: { genre: string }[];
  ratingKinopoisk: number;
  ratingImdb: number;
}

export interface FilmState {
  films: FilmCardInterface[];
  page: number;
  status: "idle" | "loading" | "succeeded" | "failed" | "done";
  filter: FilterInterface | null;
  error: null | string | undefined;
}

export interface FilterInterface {
  yearFrom: number;
  yearTo: number;
  ratingFrom: number;
  ratingTo: number;
}

export interface FilmDetailedInterface {
  id: number;
  title: string;
  description: string;
  year: number;
  genres: { genre: string }[];
  img: string;
  trailerUrl: string;
  ratingKinopoisk: number;
  ratingImdb: number;
  
  boxOffice: {
    type: string;
    amount: number;
    symbol: string;
  }[];
  similar: FilmCardInterface[];
}

export interface FilmDetailedState {
  film: FilmDetailedInterface;
  status: "idle" | "loading" | "succeeded" | "failed" | "done";
  error: null | string | undefined;
}
