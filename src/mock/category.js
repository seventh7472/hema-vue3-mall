/**
 * 分类页 Mock 数据
 * 商品 price 单位：分（整数），含 stock（库存）用于购物车数量边界
 * 结构：nav 一级分类 + subs 二级分类 + goods 商品池（catId/sub 关联）
 */

// 一级分类导航
export const categoryNav = [
  { id: 1, name: '水果', emoji: '🍎' },
  { id: 2, name: '蔬菜', emoji: '🥦' },
  { id: 3, name: '海鲜', emoji: '🦐' },
  { id: 4, name: '肉禽蛋', emoji: '🥩' },
  { id: 5, name: '乳品烘焙', emoji: '🥛' },
  { id: 6, name: '速食', emoji: '🥟' }
]

// 每个一级分类下的二级分类（key 对应 nav.id，值为二级分类名数组）
export const categorySubs = {
  1: ['当季热卖', '进口水果'],
  2: ['叶菜类', '瓜果根茎'],
  3: ['冰鲜鱼类', '虾蟹贝类'],
  4: ['猪牛羊肉', '禽蛋'],
  5: ['乳品', '烘焙'],
  6: ['方便速食', '冷冻面点']
}

// 商品池：catId 关联一级分类，sub 关联二级分类下标（0 起）
export const categoryGoods = [
  // 水果
  { id: 201, catId: 1, sub: 0, name: '丹东99草莓', price: 2980, originalPrice: 3980, img: '/images/product-strawberry.svg', tag: '产地直采', unit: '1盒/约350g', stock: 20 },
  { id: 202, catId: 1, sub: 0, name: '菲律宾香蕉', price: 990, originalPrice: 1290, img: '/images/product-banana.svg', tag: '今日特价', unit: '1份/500g', stock: 50 },
  { id: 203, catId: 1, sub: 0, name: '巨峰葡萄', price: 1580, originalPrice: 1980, img: '/images/product-grape.svg', tag: '当季', unit: '1串/约500g', stock: 30 },
  { id: 204, catId: 1, sub: 1, name: '墨西哥牛油果', price: 1990, originalPrice: 2590, img: '/images/product-avocado.svg', tag: '有机', unit: '1个/约200g', stock: 25 },
  { id: 205, catId: 1, sub: 1, name: '赣南脐橙', price: 1480, originalPrice: 1980, img: '/images/product-orange.svg', tag: '爆款', unit: '1箱/约2.5kg', stock: 40 },
  { id: 206, catId: 1, sub: 1, name: '台农芒果', price: 1280, originalPrice: 1580, img: '/images/product-mango.svg', tag: '香甜', unit: '2个/约600g', stock: 35 },
  // 蔬菜
  { id: 211, catId: 2, sub: 0, name: '有机西兰花', price: 680, originalPrice: 980, img: '/images/product-broccoli.svg', tag: '有机', unit: '1颗/约400g', stock: 60 },
  { id: 212, catId: 2, sub: 0, name: '沙瓤番茄', price: 580, originalPrice: 780, img: '/images/product-tomato.svg', tag: '农家', unit: '1份/约500g', stock: 80 },
  { id: 213, catId: 2, sub: 1, name: '甜糯水果玉米', price: 1280, originalPrice: 1680, img: '/images/product-corn.svg', tag: '当季', unit: '1根/约300g', stock: 45 },
  // 海鲜
  { id: 221, catId: 3, sub: 0, name: '冰鲜挪威三文鱼', price: 8800, originalPrice: 10800, img: '/images/product-salmon.svg', tag: '冰鲜直送', unit: '1切/约200g', stock: 15 },
  { id: 222, catId: 3, sub: 1, name: '基围白虾', price: 3980, originalPrice: 4680, img: '/images/product-shrimp.svg', tag: '鲜活', unit: '1盒/约500g', stock: 20 },
  { id: 223, catId: 3, sub: 1, name: '阳澄湖大闸蟹', price: 12800, originalPrice: 15800, img: '/images/product-crab.svg', tag: '礼盒', unit: '1份/4只', stock: 8 },
  // 肉禽蛋
  { id: 231, catId: 4, sub: 0, name: '内蒙黄牛肉', price: 4580, originalPrice: 5280, img: '/images/product-beef.svg', tag: '草原直供', unit: '1份/500g', stock: 30 },
  { id: 232, catId: 4, sub: 0, name: '黑猪五花肉', price: 3280, originalPrice: 3880, img: '/images/product-pork.svg', tag: '散养', unit: '1份/500g', stock: 25 },
  { id: 233, catId: 4, sub: 1, name: '农家土鸡蛋', price: 1980, originalPrice: 2580, img: '/images/product-egg.svg', tag: '散养', unit: '1盒/20枚', stock: 100 },
  // 乳品烘焙
  { id: 241, catId: 5, sub: 0, name: '每日鲜牛奶', price: 1280, originalPrice: 1480, img: '/images/product-milk.svg', tag: '低温鲜奶', unit: '1瓶/950ml', stock: 60 },
  { id: 242, catId: 5, sub: 1, name: '法式手工面包', price: 1880, originalPrice: 2280, img: '/images/product-bread.svg', tag: '当日烘焙', unit: '1个/约300g', stock: 20 },
  // 速食
  { id: 251, catId: 6, sub: 0, name: '虾仁水饺', price: 2380, originalPrice: 2880, img: '/images/product-dumpling.svg', tag: '手工', unit: '1盒/24只', stock: 40 },
  { id: 252, catId: 6, sub: 1, name: '鲜肉馄饨', price: 2180, originalPrice: 2580, img: '/images/product-dumpling.svg', tag: '冷冻', unit: '1盒/20只', stock: 30 }
]
