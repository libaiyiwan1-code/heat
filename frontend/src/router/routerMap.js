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
    path: '/version',
    name: 'version',
    component: () => import('@/views/version/Version.vue'),
  },
  {
    path: '/device',
    name: 'device',
    component: () => import('@/views/device/Device.vue'),
  },
]

export default constantRouterMap
