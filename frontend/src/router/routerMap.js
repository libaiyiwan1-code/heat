/**
 * 基础路由
 * @type { *[] }
 */

const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/layouts/ParamSetting.vue'),
    children: []
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Login.vue'),
  },
  {
    path: '/device',
    name: 'device',
    component: () => import('@/views/device/VAC710S.vue'),
  },
]

export default constantRouterMap
