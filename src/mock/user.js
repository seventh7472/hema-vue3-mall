/**
 * 个人中心 Mock 数据
 */

export const mockUserInfo = {
  id: 1001,
  nickname: '盒马小当家',
  avatar: '/images/avatar.svg',
  level: '银卡会员',
  levelText: '再消费 ¥200 升级金卡',
  points: 1280,
  coupons: 6,
  balance: 0
}

// 订单状态入口
export const orderEntries = [
  { key: 'pendingPay', name: '待付款', icon: '💰', badge: 2 },
  { key: 'pendingSend', name: '待发货', icon: '📦', badge: 1 },
  { key: 'pendingReceive', name: '待收货', icon: '🚚', badge: 3 },
  { key: 'afterSale', name: '退款/售后', icon: '↩️', badge: 0 }
]

// 常用工具菜单
export const toolMenus = [
  { key: 'address', name: '收货地址', icon: '📍' },
  { key: 'coupon', name: '优惠券', icon: '🎟️' },
  { key: 'points', name: '积分商城', icon: '🎁' },
  { key: 'service', name: '在线客服', icon: '🎧' },
  { key: 'feedback', name: '意见反馈', icon: '📝' },
  { key: 'settings', name: '设置', icon: '⚙️' }
]
