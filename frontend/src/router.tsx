import { createBrowserRouter } from "react-router-dom";
import Home from "./page/home/home";
import Symbol from "./page/symbol/symbol";
import AppLayout from "./layouts/app-layout";
import Favourite from "./page/favourite/favourites";
import Etf from "./page/etf/etf";
import Warrant from "./page/warrants/warrants";
import Moniter from "./page/moniter/page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout/>,
    children: [
      { index: true, element: <Home /> },
      { path: "symbol", element: <Symbol /> },
      { path: "favourites", element: <Favourite />},
      { path: "etf", element: <Etf />},
      { path: "cw", element: <Warrant />},
      { path: "moniter", element: <Moniter />}
    ],
  },
]);
