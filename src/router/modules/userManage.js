/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const moduleRouter = {
  name: 'users',
  path: '/users',
  component: Layout,
  meta: { title: '用户管理' },
  order: 3,
  children: [
    {
      name: 'index',
      path: 'index',
      component: () => import('@/views/userManage/list'),
      meta: { title: '用户管理' }
    }
  ]
}

export default moduleRouter
