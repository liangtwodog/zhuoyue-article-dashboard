/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const moduleRouter = {
  name: 'article',
  path: '/article',
  component: Layout,
  meta: { title: '文章管理' },
  order: 2,
  children: [
    {
      name: 'index',
      path: 'index',
      component: () => import('@/views/article/list'),
      meta: { title: '文章管理' }
    },
    {
      name: 'details',
      path: 'details/:id',
      component: () => import('@/views/article/details'),
      meta: { title: '文章详情' },
      hidden: true
    }
  ]
}

export default moduleRouter
