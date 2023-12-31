import { routes } from "./routes";
import { useRoutes } from "react-router-dom";

export const Router = () => {
  const routing = useRoutes(routes);
  return routing;
};
