import { useDispatch, useSelector } from "react-redux";
import { fetchFilms } from "../state/films/filmSlice";
import { useEffect } from "react";
import { AppDispatch } from "../state/store";
import { FilmCardInterface, FilmState } from "../interfaces/FilmInterfaces";
import FilmCard from "../components/FilmCard";
import { Button, Col, Flex, FloatButton, Result, Row } from "antd";
import Filter from "../components/Filter";
import Loading from "../components/Loading";
import useWindowDimensions from "../hooks/useWindowDimensions";
interface State {
  films: FilmState;
}
export default function Feed() {
  const dispatch = useDispatch<AppDispatch>();
  const page = useSelector((state: State) => state.films.page);
  const films = useSelector((state: State) => state.films.films);
  const status = useSelector((state: State) => state.films.status);
  const error = useSelector((state: State) => state.films.error);
  const filter = useSelector((state: State) => state.films.filter);

  const { width } = useWindowDimensions();
  // const status = useSelector(state => state.status)
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFilms({ page: 1, filter: null }));
    } else if (status === "failed") {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (error) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Что-то пошло не так."
        extra={<Button type="primary">На Главную Страницу</Button>}
      />
    );
  }
  return (
    <>
      {status === "loading" && <Loading />}
      <Filter />
      <Row
        justify={width >= 768 ? "start" : "center"}
        gutter={[32, 16]}
        style={{
          padding: 10,
          margin: 0,
        }}
      >
        {films &&
          films.length > 0 &&
          films.map((film: FilmCardInterface) => (
            <Col key={film.id}>
              <FilmCard film={film}></FilmCard>
            </Col>
          ))}
      </Row>
      <Flex justify="center">
        {status !== "done" && (
          <Button
            type="primary"
            loading={status === "loading"}
            onClick={() => {
              dispatch(fetchFilms({ page: page, filter: filter }));
            }}
            disabled={status == "loading"}
            style={{ width: "50%", height: "40px", margin: 20 }}
          >
            {status === "loading" && <span>Загрузка...</span>}
            {status !== "loading" && <span>Еще</span>}
          </Button>
        )}
      </Flex>
      <FloatButton.BackTop />
    </>
  );
}
