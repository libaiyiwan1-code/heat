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
    path: '/special',
    children: [
      {
        path: '/production',
        name: 'production',
        component: () => import('@/views/framework/serialport/SerialPort.vue'),
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/login/Login.vue'),
      },
      {
        path: 'serialPort',
        name: 'serialPort',
        component: () => import('@/views/device/WAC710C.vue'),
      },
    ]
  }
]

export default constantRouterMap
