import { useRoutes } from 'react-router-dom'

import { routes } from './routes'

export const Router = () => {
  const routing = useRoutes(routes)
  return routing
}
