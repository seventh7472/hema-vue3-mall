import request from './request'

/**
 * 分类页 API（当前由 mockAdapter 路由到本地数据）
 * 返回 { nav: 一级分类, subs: 二级分类映射, goods: 商品池 }
 */
export const getCategoryTree = () => request.get('/category/tree')
