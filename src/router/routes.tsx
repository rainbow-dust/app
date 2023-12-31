import { Home } from "@/pages/Home";
import { Detail } from "@/pages/Detail";

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/detail/:id",
    element: <Detail />,
  },
  {
    path: "*",
    element: <div>404</div>,
  },
];
