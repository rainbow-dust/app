import { Detail } from '@/pages/Detail'
import { Feed } from '@/pages/Feed'
import { Home } from '@/pages/Home'
import { Post } from '@/pages/Post'
import { Self } from '@/pages/Self'

export const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/detail/:id',
    element: <Detail />,
  },
  {
    path: '/self',
    element: <Self />,
  },
  {
    path: '/post',
    element: <Post />,
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
