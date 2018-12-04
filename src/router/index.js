import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    // name: '主页',
    // hidden: true,
    meta: { title: '主页' },
    children: [{
      path: '/dashboard',
      name: '主页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'homes' }
    }]
  },

  {
    path: '/cache',
    component: Layout,
    redirect: '/cache',
    // name: '主页',
    // hidden: true,
    meta: { title: '更新缓存' },
    children: [{
      path: '/cache',
      name: '更新缓存',
      component: () => import('@/views/cache/index'),
      meta: { title: '更新缓存', icon: 'homes' }
    }]
  },

  {
    path: '/school',
    component: Layout,
    redirect: '/school/list',
    name: '学校管理',
    meta: { title: '学校管理', icon: 'school' },
    children: [
      {
        path: '/school/list',
        name: '学校列表',
        component: () => import('@/views/school/index'),
        meta: { title: '学校列表', icon: 'lists' }
      },
      {
        path: '/school/create',
        name: '添加学校',
        hidden: true,
        component: () => import('@/views/school/operating'),
        meta: { title: '添加学校', icon: 'list' }
      },
      {
        path: '/school/create/:id',
        name: '编辑学校',
        hidden: true,
        component: () => import('@/views/school/operating'),
        meta: { title: '编辑学校', icon: 'list' }
      },
      {
        path: '/school/type',
        name: '学校类别',
        // hidden: true,
        component: () => import('@/views/type/index'),
        meta: { title: '学校类别', icon: 'cate' }
      },
      {
        path: '/school/milieu/:id',
        name: '学校环境',
        hidden: true,
        component: () => import('@/views/milieus/index'),
        meta: { title: '学校环境', icon: 'school' }
      },
      {
        path: '/school/present/:id',
        name: '学校专业',
        hidden: true,
        component: () => import('@/views/present/index'),
        meta: { title: '学校专业', icon: 'school' }
      }
    ]
  },

  {
    path: '/news',
    component: Layout,
    redirect: '/news/list',
    name: '资讯管理',
    meta: { title: '资讯管理', icon: 'news' },
    children: [
      {
        path: '/news/list',
        name: '资讯列表',
        component: () => import('@/views/news/index'),
        meta: { title: '资讯列表', icon: 'lists' }
      },
      {
        path: '/news/operation',
        name: '添加资讯',
        hidden: true,
        component: () => import('@/views/news/operation'),
        meta: { title: '添加资讯', icon: 'list' }
      },
      {
        path: '/news/operation/:id',
        name: '编辑资讯',
        hidden: true,
        component: () => import('@/views/news/operation'),
        meta: { title: '编辑资讯', icon: 'list' }
      },
      {
        path: '/category/index',
        name: '资讯分类',
        // hidden: true,
        component: () => import('@/views/category/index'),
        meta: { title: '资讯分类', icon: 'list' }
      }
    ]
  },

  {
    path: '/leave',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '留言管理',
        component: () => import('@/views/leave/index'),
        meta: { title: '留言管理', icon: 'leave' }
      }
    ]
  },

  {
    path: '/area',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '地区管理',
        component: () => import('@/views/area/index'),
        meta: { title: '地区管理', icon: 'addr' }
      }
    ]
  },

  {
    path: '/links',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '友情链接',
        component: () => import('@/views/links/index'),
        meta: { title: '友情链接', icon: 'links' }
      }
    ]
  },

  {
    path: '/admin',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '账户管理',
        component: () => import('@/views/admin/index'),
        meta: { title: '账户管理', icon: 'account' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
