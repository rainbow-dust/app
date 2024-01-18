import { Detail } from '~/pages/Detail'
import { Feed } from '~/pages/Feed'
import { People } from '~/pages/People'
import { Publish } from '~/pages/Publish'

export const routes = [
  {
    path: '/detail/:id',
    element: <Detail />,
  },
  {
    path: '/people/:username',
    element: <People />,
  },
  {
    path: '/publish',
    element: <Publish />,
  },
  {
    path: '/feed',
    element: <Feed />,
  },
  {
    path: '*',
    element: <div>404</div>,
  },
]
