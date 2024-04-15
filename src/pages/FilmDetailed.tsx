import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { fetchFilmDetailed } from "../state/films/filmDetailed";
import { AppDispatch } from "../state/store";
import { FilmDetailedState } from "../interfaces/FilmInterfaces";
import { Divider, Flex, Image, Rate, Typography } from "antd";
import ReactPlayer from "react-player";
import FilmCard from "../components/FilmCard";
import Loading from "../components/Loading";
import useWindowDimensions from "../hooks/useWindowDimensions";

interface State {
  film: FilmDetailedState;
}

export default function FilmDetailed() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;
  const { width } = useWindowDimensions();

  const dispatch = useDispatch<AppDispatch>();
  const film = useSelector((state: State) => state.film.film);
  const status = useSelector((state: State) => state.film.status);
  const error = useSelector((state: State) => state.film.error);

  useEffect(() => {
    dispatch(fetchFilmDetailed(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) {
    return <Navigate to={"/*"} />; // Render nothing if the film details are not available yet
  }
  if (status === "loading") {
    return <Loading />;
  }
  if (status === "succeeded" && film) {
    return (
      <Flex
        vertical
        gap={40}
        style={{
          margin: width >= 768 ? "10px 20%" : "10px 5%",
        }}
      >
        <Flex
          style={{
            width: "100%",
          }}
          gap={40}
          vertical={width < 768}
          align={width < 768 ? "center" : ""}
        >
          {film.img && (
            <Image
              style={{
                width: 300,
              }}
              alt={film.title}
              src={film.img}
            />
          )}

          <Flex vertical>
            {film.title && (
              <Typography.Title style={{ marginTop: 0 }}>
                {film.title}
              </Typography.Title>
            )}
            <Typography.Title level={3} style={{ marginTop: 0 }}>
              О фильме
            </Typography.Title>

            <Typography.Text> Год выпуска: {film.year ?? "-"}</Typography.Text>

            <Typography.Text>
              Жанр:{" "}
              {film.genres && film.genres.length > 0
                ? film.genres.map((genre, i) => (
                    <span key={genre.genre}>
                      {genre.genre}
                      {i < film.genres.length - 1 && <em>, </em>}
                    </span>
                  ))
                : "-"}
            </Typography.Text>
            <Typography.Text>
              Сборы в России:{" "}
              {film.boxOffice[0]
                ? `${
                    film.boxOffice[0].symbol
                  }${film.boxOffice[0].amount.toLocaleString("en-US", {})}`
                : "-"}
            </Typography.Text>
            <Typography.Text>
              Сборы в США:{" "}
              {film.boxOffice[1]
                ? `${
                    film.boxOffice[1].symbol
                  }${film.boxOffice[1].amount.toLocaleString("en-US", {})}`
                : "-"}
            </Typography.Text>
            <Typography.Text>
              Сборы в мире:{" "}
              {film.boxOffice[2]
                ? `${
                    film.boxOffice[2].symbol
                  }${film.boxOffice[2].amount.toLocaleString("en-US", {})}`
                : "-"}
            </Typography.Text>
            {film.description && (
              <>
                <Typography.Title level={3}>Короткое описание</Typography.Title>
                <Typography.Paragraph>{film.description}</Typography.Paragraph>
              </>
            )}
          </Flex>
        </Flex>

        {(film.ratingImdb || film.ratingKinopoisk) && (
          <Flex
            align="center"
            vertical
            style={{
              textAlign: "center",
            }}
          >
            <Divider plain>
              <Typography.Title level={3} style={{ margin: 0 }}>
                Рейтинг фильма
              </Typography.Title>
            </Divider>
            <Rate disabled value={film.ratingKinopoisk} allowHalf count={10} />
            <Flex
              style={{
                gap: 40,
              }}
            >
              <Flex vertical>
                <span
                  style={{
                    fontSize: 24,
                  }}
                >
                  {film.ratingKinopoisk}
                </span>
                <span>Рейтинг Kinopoisk</span>
              </Flex>
              <Flex vertical>
                <span
                  style={{
                    fontSize: 24,
                  }}
                >
                  {film.ratingImdb}
                </span>
                <span>Рейтинг IMDb</span>
              </Flex>
            </Flex>
          </Flex>
        )}

        {film.trailerUrl && (
          <Flex justify="center">
            <ReactPlayer
              width="80%"
              height="400px"
              url={film.trailerUrl}
            ></ReactPlayer>
          </Flex>
        )}
        {film.similar && film.similar.length > 0 && (
          <>
            <Divider>
              <Typography.Title level={3} style={{ margin: 0 }}>
                Похожие фильмы
              </Typography.Title>
            </Divider>
            {/* <Carousel
              autoplay
              style={{
                width: "100%",
                background: "#gray",
                padding: 50,
              }}
            > */}
            <Flex
              style={{
                overflow: "auto",
                paddingBottom: 30,
                gap: 5,
              }}
            >
              {film.similar.map((simFilm) => (
                <FilmCard key={simFilm.id} film={simFilm}></FilmCard>
              ))}
            </Flex>
            {/* </Carousel> */}
          </>
        )}
      </Flex>
    );
  }
}
