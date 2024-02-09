// https://github.com/remix-run/react-router/tree/dev/examples/modal-route-with-outlet
// https://github.com/remix-run/react-router/tree/dev/examples/modal

// 现在就是吧...有上面这两种方式来实现弹窗路由。上面的那个是新出的，在大组件的根节点上价格 outlet 就可以让匹配渲染它的子组件的时候，把它渲染到 outlet 里面去，而不是替换掉它。这样就可以实现弹窗路由了。下面那个是早已有之的，大概是...
// ↓，你看他们自己都说是 trick 2333...大概是写两组路由，然后在跳转到弹窗的时候在路由里塞个变量，去判断第二组路由也就是弹窗路由是否真的要渲染。 react 啊 react，你怎么这么甜蜜的可爱呢。
// 1. The `backgroundLocation` state is the location that we were at when one of
// the gallery links was clicked. If it's there, use it as the location for
// the <Routes> so we show the gallery in the background, behind the modal.
// 2. This is the trick! Set the `backgroundLocation` in location state
// so that when we open the modal we still see the current page in
// the background.

import { Navigate, createBrowserRouter } from 'react-router-dom'

import { HomeLayout } from '~/layout/Home'
import { Detail } from '~/pages/Detail'
import { Explore } from '~/pages/Explore'
import { Notice } from '~/pages/Notice'
import { PeopleDetail, PeopleEdit } from '~/pages/People'
import { Publish } from '~/pages/Publish'
import { Tag } from '~/pages/Tag'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomeLayout,
    children: [
      {
        path: '/',
        Component: () => Navigate({ to: '/explore', replace: true }),
      },
      {
        path: 'explore',
        Component: Explore,
        children: [
          {
            path: ':id',
            Component: Detail,
          },
        ],
      },
      {
        path: 'detail/:id',
        Component: Detail,
      },
      {
        path: 'notice',
        Component: Notice,
      },
      {
        path: 'people/edit',
        Component: PeopleEdit,
      },
      {
        path: 'people/:username',
        Component: PeopleDetail,
      },
      {
        path: 'tag/:tagName',
        Component: Tag,
      },
      {
        path: 'publish',
        Component: Publish,
      },
      {
        path: '*',
        Component: () => 404,
      },
    ],
  },
])
