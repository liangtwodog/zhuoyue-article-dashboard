/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemRouter = {
  name: 'system',
  path: '/system',
  component: Layout,
  meta: { title: '系统设置', icon: 'el-icon-setting' },
  permissions: ['管理员管理-列表', '角色管理-列表'],
  order: 10000,
  hidden: true,
  children: [
    {
      name: 'role',
      path: 'role',
      component: () => import('@/views/system/role'),
      meta: { title: '角色管理' },
      permissions: ['角色管理-列表']
    },
    {
      name: 'admin',
      path: 'admin',
      component: () => import('@/views/system/admin'),
      meta: { title: '后台用户管理' },
      permissions: ['管理员管理-列表']
    }
  ]
}

export default systemRouter
