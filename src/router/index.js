import { createRouter, createWebHistory } from 'vue-router'

// 布局组件同样懒加载
const TabBarLayout = () => import('@/layouts/TabBarLayout.vue')

const routes = [
  {
    path: '/',
    component: TabBarLayout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { keepAlive: true, title: '首页' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/index.vue'),
        meta: { keepAlive: true, title: '分类' }
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/cart/index.vue'),
        meta: { keepAlive: true, title: '购物车' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/user/index.vue'),
        meta: { keepAlive: true, title: '我的' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 收集所有配置 keepAlive 的组件 name，供 keep-alive 的 include 使用
export const cachedViews = routes
  .flatMap((r) => r.children || [])
  .filter((r) => r.meta?.keepAlive && r.name)
  .map((r) => r.name)

// 动态设置页面标题
router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 盒马生鲜`
  }
})

export default router
