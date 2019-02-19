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
    path: '/topic',
    component: Layout,
    redirect: '/topic/list',
    name: '专题管理',
    meta: { title: '专题管理', icon: 'news' },
    children: [
      {
        path: '/topic/list',
        name: '专题列表',
        component: () => import('@/views/topic/index'),
        meta: { title: '专题列表', icon: 'lists' }
      },
      {
        path: '/topic/operation',
        name: '添加专题',
        hidden: true,
        component: () => import('@/views/topic/operation'),
        meta: { title: '添加专题', icon: 'list' }
      },
      {
        path: '/topic/operation/:id',
        name: '编辑专题',
        hidden: true,
        component: () => import('@/views/topic/operation'),
        meta: { title: '编辑专题', icon: 'list' }
      },
      {
        path: '/topicDetails/list',
        name: '专题菜品',
        component: () => import('@/views/topicDetails/index'),
        meta: { title: '专题菜品', icon: 'lists' }
      },
      {
        path: '/topicDetails/operation',
        name: '添加专题菜品',
        hidden: true,
        component: () => import('@/views/topicDetails/operation'),
        meta: { title: '添加专题菜品', icon: 'list' }
      },
      {
        path: '/topicDetails/operation/:id',
        name: '编辑专题菜品',
        hidden: true,
        component: () => import('@/views/topicDetails/operation'),
        meta: { title: '编辑专题菜品', icon: 'list' }
      },
      {
        path: '/atlas/list/:id',
        name: '上传菜品图集',
        hidden: true,
        component: () => import('@/views/atlas/index'),
        meta: { title: '上传菜品图集', icon: 'list' }
      }
    ]
  },

  {
    path: '/food',
    component: Layout,
    redirect: '/food/index',
    name: '食物相克',
    meta: { title: '食物相克', icon: 'news' },
    children: [
      {
        path: '/food/list',
        name: '食物相克',
        component: () => import('@/views/food/index'),
        meta: { title: '食物相克', icon: 'lists' }
      },
      {
        path: '/food/operation',
        name: '添加食物相克',
        hidden: true,
        component: () => import('@/views/food/operation'),
        meta: { title: '添加食物相克', icon: 'list' }
      },
      {
        path: '/food/operation/:id',
        name: '编辑食物相克',
        hidden: true,
        component: () => import('@/views/food/operation'),
        meta: { title: '编辑食物相克', icon: 'list' }
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
