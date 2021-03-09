/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const moduleRouter = {
  name: 'browse',
  path: '/browse',
  component: Layout,
  meta: { title: '浏览记录' },
  order: 4,
  children: [
    {
      name: 'index',
      path: 'index',
      component: () => import('@/views/browse/list'),
      meta: { title: '浏览记录' }
    }
  ]
}

export default moduleRouter
