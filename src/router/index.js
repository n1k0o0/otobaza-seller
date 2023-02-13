import Vue from 'vue'
import Router from 'vue-router'
import i18n from '@/lang'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' }
      },
      {
        path: '/profile',
        component: () => import('@/views/profile/index'),
        hidden: true
      }
    ]
  },
  {
    path: '/orders',
    component: Layout,
    redirect: '/orders',
    name: 'OrdersLayout',
    meta: { title: i18n.t('orders.title'), icon: 'example' },
    children: [
      {
        path: '/orders',
        name: 'Orders',
        component: () => import('@/views/orders/index'),
        meta: { title: i18n.t('orders.title'), icon: 'table' }
      },
      {
        path: '/orders/:id',
        name: 'Order',
        hidden: true,
        component: () => import('@/views/orders/detailed'),
        meta: { title: i18n.t('orders.order'), icon: 'table' }
      }
    ]
  },
  {
    path: '/parts',
    component: Layout,
    redirect: '/parts',
    name: 'PartsLayout',
    meta: { title: i18n.t('menu.products'), icon: 'example' },
    children: [
      {
        path: '/parts',
        name: 'Parts',
        component: () => import('@/views/parts/index'),
        meta: { title: i18n.t('parts.title'), icon: 'table' }
      },
      {
        path: '/parts/add',
        name: 'AddParts',
        hidden: true,
        component: () => import('@/views/parts/add'),
        meta: { title: i18n.t('dismantles.add'), icon: 'table' }
      },
      {
        path: '/used',
        name: 'Used',
        component: () => import('@/views/used/index'),
        meta: { title: i18n.t('menu.used'), icon: 'table' }
      },
      {
        path: '/used/add',
        name: 'AddUsed',
        hidden: true,
        component: () => import('@/views/used/create'),
        meta: { title: i18n.t('menu.used'), icon: 'table' }
      },
      {
        path: '/used/:id',
        name: 'EditUsed',
        hidden: true,
        component: () => import('@/views/used/edit'),
        meta: { title: i18n.t('menu.used'), icon: 'table' }
      },
    ]
  },
  /*{
    path: '/dismantles',
    component: Layout,
    redirect: '/dismantles',
    name: 'DismantlesMenu',
    meta: { title: i18n.t('dismantles.title'), icon: 'example' },
    children: [
      {
        path: '/dismantles',
        name: 'Dismantles',
        component: () => import('@/views/dismantles/index'),
        meta: { title: i18n.t('dismantles.title'), icon: 'table' }
      },
      {
        path: '/dismantles/add',
        hidden: true,
        component: () => import('@/views/dismantles/add'),
        name: 'DismantlesAdd',
        meta: {
          title: i18n.t('dismantles.add'),
          icon: 'table',
          noCache: true
        }
      },
      {
        path: '/dismantles/:id',
        hidden: true,
        component: () => import('@/views/dismantles/edit'),
        name: 'DismantlesEdit',
        meta: {
          title: i18n.t('dismantles.title'),
          icon: 'table',
          noCache: true
        }
      }
    ]
  },*/
  {
    path: '/statistics',
    component: Layout,
    name: 'StatisticsMenu',
    meta: { title: i18n.t('statistics.title'), icon: 'statistics' },
    redirect: '/dismantles',
    children: [
      {
        path: '/statistics/clicks',
        name: 'Statistics',
        component: () => import('@/views/statistics/clicks'),
        meta: {
          title: i18n.t('statistics.clicks'),
          icon: 'statistics'
        }
      },
      {
        path: '/statistics/clicks/:date',
        name: 'StatisticByDate',
        hidden: true,
        component: () => import('@/views/statistics/date'),
        meta: {
          title: i18n.t('statistics.clicks'),
          icon: 'statistics'
        }
      },
      {
        path: '/statistics/payment-history',
        name: 'PaymentHistory',
        component: () => import('@/views/statistics/payments'),
        meta: {
          title: i18n.t('payment_history.title'),
          icon: 'payment'
        }
      }
    ]
  },

  {
    component: Layout,
    redirect: '/packages',
    path: '/packages',
    name: 'PackagesLayout',
    children: [
      {
        path: '/packages',
        component: () => import('@/views/packages'),
        name: 'Packages',
        meta: { title: i18n.t('packages.title'), icon: 'example' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
