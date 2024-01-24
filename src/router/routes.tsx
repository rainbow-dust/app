import { Detail } from '~/pages/Detail'
// import { Explore } from '~/pages/Explore'
import { Feed } from '~/pages/Feed'
import { Notice } from '~/pages/Notice'
import { PeopleDetail, PeopleEdit } from '~/pages/People'
import { Publish } from '~/pages/Publish'

export const routes = [
  {
    path: '/detail/:id',
    element: <Detail />,
  },
  {
    path: '/people/:username',
    element: <PeopleDetail />,
  },
  {
    path: '/people/edit',
    element: <PeopleEdit />,
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
    path: '/notification',
    element: <Notice />,
  },
  {
    path: '/',
    element: <Feed />,
  },
  {
    path: '*',
    element: <div>404</div>,
  },
]
