import request from './request'

/**
 * 首页 API（当前由 mockAdapter 路由到本地数据）
 * 接入真实后端后保持函数签名不变即可
 */
export const getHomeBanner    = () => request.get('/home/banner')
export const getHomeCategory  = () => request.get('/home/category')
export const getHomeRecommend = () => request.get('/home/recommend')