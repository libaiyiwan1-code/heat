/**
 * 基础路由
 * @type { *[] }
 */

const constantRouterMap = [

  {
    path: '/',
    name: 'device',
    component: () => import('@/views/device/Device.vue'),
    children: []
  },
]

export default constantRouterMap
