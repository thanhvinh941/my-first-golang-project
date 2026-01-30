import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/app-layout";
import { Loader2 } from "lucide-react";
import { lazyWithDelay } from "./store/utils/lazy-with-delay";

const Home = lazyWithDelay(() => import("./page/home/home"));
const Symbol = lazyWithDelay(() => import("./page/symbol/symbol"));
const Favourite = lazyWithDelay(() => import("./page/favourite/favourites"));
const Etf = lazyWithDelay(() => import("./page/etf/etf"));
const Warrant = lazyWithDelay(() => import("./page/warrants/warrants"));
const Moniter = lazyWithDelay(() => import("./page/moniter/page"));


export default function AppLoading() {
  console.log("AppLoading....")
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<AppLoading />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "symbol",
        element: (
          <Suspense fallback={<AppLoading />}>
            <Symbol />
          </Suspense>
        ),
      },
      {
        path: "favourites",
        element: (
          <Suspense fallback={<AppLoading />}>
            <Favourite />
          </Suspense>
        ),
      },
      {
        path: "etf",
        element: (
          <Suspense fallback={<AppLoading />}>
            <Etf />
          </Suspense>
        ),
      },
      {
        path: "cw",
        element: (
          <Suspense fallback={<AppLoading />}>
            <Warrant />
          </Suspense>
        ),
      },
      {
        path: "moniter",
        element: (
          <Suspense fallback={<AppLoading />}>
            <Moniter />
          </Suspense>
        ),
      },
    ],
  },
]);

