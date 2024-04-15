import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  FilmCardInterface,
  FilmCardResponse,
  FilmState,
  FilterInterface,
} from "../../interfaces/FilmInterfaces";
import apiClient from "../../apiClient";

export const tranformFilmResponse = (data: { items: FilmCardResponse[]; }) => {
    return data.items.map((item: FilmCardResponse) => ({
        id: item.kinopoiskId ?? item.filmId,
        img: item.posterUrlPreview,
        title: item.nameRu ?? item.nameEn ?? item.nameOriginal ?? "",
        year: item.year,
        genre: item?.genres?.length > 0 ? item.genres[0].genre : "",
        rating: item.ratingKinopoisk ?? item.ratingImdb,
      }));
}


export const applyFilter = createAsyncThunk(
  "films/applyFilter",
  async (filter: FilterInterface) => {
    const res = await apiClient.get(`v2.2/films`, {
      params: {
        type: "FILM",
        page: 1,
        yearFrom: filter?.yearFrom,
        yearTo: filter?.yearTo,
        ratingFrom: filter?.ratingFrom,
        ratingTo: filter?.ratingTo,
      },
    });
    const data = res.data;
    const transformedFilms = tranformFilmResponse(data);

    const transformedObject = {
      films: transformedFilms,
      filter: filter,
    };
    return transformedObject;
  }
);

export const fetchFilms = createAsyncThunk(
  "films/fetchFilms",
  async ({
    page,
    filter,
  }: {
    page: number;
    filter: FilterInterface | null;
  }) => {
    const res = await apiClient.get(`v2.2/films`, {
      params: {
        type: "FILM",
        page: page,
        yearFrom: filter?.yearFrom,
        yearTo: filter?.yearTo,
        ratingFrom: filter?.ratingFrom,
        ratingTo: filter?.ratingTo,
      },
    });
    const data = res.data;
    const transformedFilms =tranformFilmResponse(data);
    return transformedFilms;
  }
);

const filmSlice = createSlice({
  name: "film",
  initialState: {
    films: [],
    page: 1, // Initial page number
    filter: null,
    status: "idle",
    error: null,
  } as FilmState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchFilms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFilms.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Фильтрует дублированные id при пагинации
        const newFilms = action.payload.filter((film: FilmCardInterface) => {
          return !state.films.some(
            (existingFilm) => existingFilm.id === film.id
          );
        });

        if (newFilms.length > 0) {
          state.films = [...state.films, ...newFilms];
          state.page += 1;
        } else {
          state.status = "done";
        }
      })
      .addCase(fetchFilms.rejected, (state, action) => {
        state.status = "failed";
        state.films = [];
        state.error = action.error.message;
      })

      .addCase(applyFilter.pending, (state) => {
        state.status = "loading";
      })
      .addCase(applyFilter.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.films = action.payload.films;
        state.filter = action.payload.filter;
      })
      .addCase(applyFilter.rejected, (state, action) => {
        state.status = "failed";
        state.films = [];
        state.error = action.error.message;
      });
  },
});

export default filmSlice.reducer;
