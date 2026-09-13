/**
 * 资源路径拼接：统一加上 Vite 的 base 前缀
 * 开发环境 BASE_URL = '/'，GitHub Pages 构建时为 '/hema-vue3-mall/'
 * 传入 '/images/xxx.svg' 或 'images/xxx.svg' 均可
 */
export function assetUrl(path) {
  const base = import.meta.env.BASE_URL
  const clean = String(path).replace(/^\//, '')
  return `${base}${clean}`
}
