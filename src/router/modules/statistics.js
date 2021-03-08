/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const moduleRouter = {
  name: 'statistics',
  path: '/statistics',
  component: Layout,
  meta: { title: '数据统计', icon: 'dashboard' },
  order: 1,
  children: [
    {
      name: 'index',
      path: 'index',
      component: () => import('@/views/statistics'),
      meta: { title: '数据统计', icon: 'dashboard' }
    }
  ]
}

export default moduleRouter
