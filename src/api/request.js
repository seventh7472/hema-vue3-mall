import axios from 'axios'
import mockRoutes from '@/mock/routes'

/**
 * 自定义 adapter：无后端时按 URL 路由到 mock 数据
 * 接入真实后端：删除本 adapter，并将 baseURL 指向真实接口域名
 */
const mockAdapter = (config) => {
  // config.url 在 adapter 阶段已被 axios 合并 baseURL，如 "/api/home/banner"
  const rawUrl = (config.url || '').replace(/^https?:\/\/[^/]+/, '').replace(/^\/api/, '')
  const route = mockRoutes.find(
    (r) => r.method.toLowerCase() === (config.method || 'get').toLowerCase() && r.url === rawUrl
  )

  return new Promise((resolve, reject) => {
    if (!route) {
      return reject(new Error(`[mock] no route for ${config.method} ${config.url}`))
    }
    setTimeout(() => {
      resolve({
        data: route.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      })
    }, route.delay ?? 200)
  })
}

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  adapter: mockAdapter
})

// 请求拦截器：预留（注入 token、loading 等）
request.interceptors.request.use(
  (config) => config,
  (err) => Promise.reject(err)
)

// 响应拦截器：成功直接返回 data 主体
request.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // eslint-disable-next-line no-console
    console.error('[request error]', err?.message || err)
    return Promise.reject(err)
  }
)

export default request