import Layout from '@/components/layout'

export default {
  path: '/user',
  component: Layout,
  meta: { title: '用户管理' },
  redirect: '/user/staff',
  children: [
    {
      path: 'staff',
      name: 'user-staff',
      meta: { title: '员工管理' },
      component: () => import('@/views/user/Staff')
    }
  ]
}
