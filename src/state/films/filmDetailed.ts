import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  FilmDetailedInterface,
  FilmDetailedState,
} from "../../interfaces/FilmInterfaces";
import apiClient from "../../apiClient";
import { tranformFilmResponse } from "./filmSlice";

export const fetchFilmDetailed = createAsyncThunk(
  "filmDetailed/fetchFilmDetailed",
  async (id: number) => {
    const responseDetailed = (await apiClient.get(`v2.2/films/${id}`)).data;
    const responseVideos = (await apiClient.get(`v2.2/films/${id}/videos`)).data;
    const responseSimilar = (await apiClient.get(`v2.2/films/${id}/similars`)).data;
    const responseBox = (await apiClient.get(`v2.2/films/${id}/box_office`)).data;

    const boxOfficeWorld = responseBox.items.find((item: { type: string }) => {
      return item.type === "WORLD";
    });
    const boxOfficeUSA = responseBox.items.find((item: { type: string }) => {
      return item.type === "USA";
    });
    const boxOfficeRus = responseBox.items.find((item: { type: string }) => {
      return item.type === "RUS";
    });

    const boxOffice = [boxOfficeRus, boxOfficeUSA, boxOfficeWorld];

    const trailerUrlItem = responseVideos.items.find(
      (item: { site: string }) => {
        return item.site === "YOUTUBE";
      }
    );

    const trailerUrl = trailerUrlItem?.url ?? "";

    const film: FilmDetailedInterface = {
      id: id,
      title: responseDetailed.nameRu,
      description:
        responseDetailed.description ?? responseDetailed.shortDescription,
      img: responseDetailed.posterUrl,
      ratingKinopoisk: responseDetailed.ratingKinopoisk,
      ratingImdb: responseDetailed.ratingImdb,
      year: responseDetailed.year ?? "-",
      genres: responseDetailed.genres,

      trailerUrl: trailerUrl ?? "",
      boxOffice: boxOffice,
      similar: tranformFilmResponse(responseSimilar),
    };
    return film;
  }
);
const filmSlice = createSlice({
  name: "film",
  initialState: {
    film: {},
    status: "idle",
    error: null,
  } as FilmDetailedState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchFilmDetailed.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFilmDetailed.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.film = action.payload;
      })

      .addCase(fetchFilmDetailed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default filmSlice.reducer;
