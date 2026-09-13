import request from './request'

/**
 * 个人中心 API（当前由 mockAdapter 路由到本地数据）
 */
export const getUserInfo = () => request.get('/user/info')
