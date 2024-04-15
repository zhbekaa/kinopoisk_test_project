import { Navigate, createBrowserRouter } from "react-router-dom";
import Feed from "./pages/Feed";
import FilmDetailed from "./pages/FilmDetailed";
import NotFound from "./pages/NotFound";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Navigate to="/films" />,
      },
      {
        path: "films",
        children: [
          {
            path: "",
            element: <Feed />,
          },
          {
            path: ":id",
            element: <FilmDetailed />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
