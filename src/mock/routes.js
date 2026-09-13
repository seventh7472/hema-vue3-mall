/**
 * Mock 路由表：把 axios 请求 URL 映射到本地数据
 * 接入真实后端时，移除 request.js 的 mockAdapter 即可
 */
import { bannerList, categoryList, recommendList } from './home'
import { categoryNav, categorySubs, categoryGoods } from './category'
import { mockUserInfo } from './user'

export default [
  { method: 'get', url: '/home/banner',    data: bannerList,    delay: 200 },
  { method: 'get', url: '/home/category',  data: categoryList,  delay: 100 },
  { method: 'get', url: '/home/recommend', data: recommendList, delay: 350 },
  { method: 'get', url: '/category/tree',  data: { nav: categoryNav, subs: categorySubs, goods: categoryGoods }, delay: 250 },
  { method: 'get', url: '/user/info',      data: mockUserInfo,  delay: 200 }
]
