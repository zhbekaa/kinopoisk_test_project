import { Card } from "antd";
import { FilmCardInterface } from "../interfaces/FilmInterfaces";
import { useNavigate } from "react-router-dom";
import Meta from "antd/es/card/Meta";

export default function FilmCard({ film }: { film: FilmCardInterface }) {
  const navigate = useNavigate();
  const year = film.year ?? "";
  const genre = film.genre ?? "";
  
  const description = `${year ? `${year}, ` : ""}${genre}`;
  return (
    <Card
      hoverable
      style={{ minWidth: 240, maxWidth: 240 ,position: "relative" }}
      loading={false}
      cover={film.img && <img alt={film.title} src={film.img} height={350} />}
      onClick={() => navigate(`/films/${film.id}`)}
    >
      <Meta
        title={film.title}
        description={description}
      ></Meta>
      <div
        style={{
          position: "absolute",
          top: 10,
          backgroundColor: film.rating > 6 ? "green" : "red",
          color: "white",
          width: 40,
          display: "flex",
          justifyContent: "center",
          borderRadius: 4,
        }}
      >
        <span
          style={{
            fontSize: 20,
          }}
        >
          {film.rating}
        </span>
      </div>
    </Card>
  );
}
