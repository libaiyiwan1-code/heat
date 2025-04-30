/**
 * 基础路由
 * @type { *[] }
 */

const constantRouterMap = [
  // {
  //   path: '/',
  //   component: () => import('@/layouts/ParamSetting.vue'),
  //   children: []
  // },

  {
    path: '/',
    name: 'login',
    component: () => import('@/views/login/Login.vue'),
    children: []
  },
  {
    path: '/device',
    name: 'device',
    component: () => import('@/views/device/Device.vue'),
  },
]

export default constantRouterMap
