import { Detail } from '~/pages/Detail'
import { Feed } from '~/pages/Feed'
import { People } from '~/pages/People'
import { Edit } from '~/pages/People/Edit'
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
    path: '/people/edit',
    element: <Edit />,
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
