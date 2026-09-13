/**
 * 首页 Mock 数据
 * 商品 price 单位：分（整数），与购物车 store 约定一致
 */

// 轮播图：图片为本地 SVG，URL 字符串形式与远程一致，替换为 https://... 即可
export const bannerList = [
  {
    id: 1,
    title: '\u4ea7\u5730\u76f4\u91c7',
    subtitle: '\u65b0\u9c9c\u6c34\u679c \u00b7 \u7b2c\u4e8c\u4ef6\u534a\u4ef7',
    extra: '\u6bcf\u65e5\u91c7\u6458 \u00b7 \u51b7\u94fe\u76f4\u8fbe',
    img: '/images/banner-fruit.svg'
  },
  {
    id: 2,
    title: '\u6d77\u9c9c\u76db\u5bb4',
    subtitle: '\u51b0\u9c9c\u76f4\u8fbe \u00b7 \u6ee1199\u51cf30',
    extra: '\u6df1\u6d77\u6355\u635e \u00b7 \u5f53\u65e5\u53d1\u8d27',
    img: '/images/banner-seafood.svg'
  },
  {
    id: 3,
    title: '\u6709\u673a\u852c\u83dc',
    subtitle: '\u5f53\u65e5\u91c7\u6458 \u00b7 \u5065\u5eb7\u8f7b\u98df',
    extra: '\u519c\u5bb6\u76f4\u4f9b \u00b7 \u65b0\u9c9c\u5230\u5bb6',
    img: '/images/banner-veg.svg'
  }
]

// 分类：emoji + 渐变色（CSS 渲染，零图片资源）
export const categoryList = [
  { id: 1,  name: '\u6c34\u679c', emoji: '\u{1F34E}', color: '#FF6B6B' },
  { id: 2,  name: '\u852c\u83dc', emoji: '\u{1F96C}', color: '#6DBE45' },
  { id: 3,  name: '\u6d77\u9c9c', emoji: '\u{1F41F}', color: '#22D3EE' },
  { id: 4,  name: '\u8089\u7c7b', emoji: '\u{1F969}', color: '#C0392B' },
  { id: 5,  name: '\u86cb\u5976', emoji: '\u{1F95A}', color: '#F1C40F' },
  { id: 6,  name: '\u7c73\u9762', emoji: '\u{1F35A}', color: '#E67E22' },
  { id: 7,  name: '\u901f\u98df', emoji: '\u{1F35C}', color: '#E74C3C' },
  { id: 8,  name: '\u96f6\u98df', emoji: '\u{1F36A}', color: '#D35400' },
  { id: 9,  name: '\u9152\u6c34', emoji: '\u{1F964}', color: '#3498DB' },
  { id: 10, name: '\u9c9c\u82b1', emoji: '\u{1F490}', color: '#9B59B6' }
]

// 商品推荐：price 存「分」，img 为本地 SVG 链接
export const recommendList = [
  { id: 101, name: '\u4e39\u4e1c99\u8349\u8393', price: 2980, originalPrice: 3980, img: '/images/product-strawberry.svg', tag: '\u4ea7\u5730\u76f4\u91c7', unit: '1\u76d2/\u7ea6350g', emoji: '\u{1F353}', color: '#E63946' },
  { id: 102, name: '\u83f2\u5f8b\u5bbe\u9999\u8549', price: 990,  originalPrice: 1290, img: '/images/product-banana.svg',    tag: '\u4eca\u65e5\u7279\u4ef7', unit: '1\u4efd/500g',   emoji: '\u{1F34C}', color: '#F4A261' },
  { id: 103, name: '\u58a8\u897f\u54e5\u725b\u6cb9\u679c', price: 1990, originalPrice: 2590, img: '/images/product-avocado.svg',   tag: '\u6709\u673a',       unit: '1\u4e2a/\u7ea6200g', emoji: '\u{1F951}', color: '#558B2F' },
  { id: 104, name: '\u51b0\u9c9c\u632a\u5a01\u4e09\u6587\u9c7c', price: 8800, originalPrice: 10800, img: '/images/product-salmon.svg',    tag: '\u51b0\u9c9c\u76f4\u8fbe', unit: '1\u5207/\u7ea6200g', emoji: '\u{1F363}', color: '#E64A19' },
  { id: 105, name: '\u5185\u8499\u9ec4\u725b\u8089', price: 4580, originalPrice: 5280, img: '/images/product-beef.svg',      tag: '\u8349\u539f\u76f4\u4f9b', unit: '1\u4efd/500g',   emoji: '\u{1F969}', color: '#8E2828' },
  { id: 106, name: '\u8d63\u5357\u8110\u6a59', price: 1480, originalPrice: 1980, img: '/images/product-orange.svg',    tag: '\u7206\u6b3e',         unit: '1\u7bb1/\u7ea62.5kg', emoji: '\u{1F34A}', color: '#E65100' },
  { id: 107, name: '\u519c\u5bb6\u571f\u9e21\u86cb', price: 1980, originalPrice: 2580, img: '/images/product-egg.svg',       tag: '\u6563\u517b',         unit: '1\u76d2/20\u679a',  emoji: '\u{1F95A}', color: '#F9A825' },
  { id: 108, name: '\u4e91\u5357\u6709\u673a\u897f\u5170\u82b1', price: 680,  originalPrice: 980,  img: '/images/product-broccoli.svg',  tag: '\u6709\u673a',         unit: '1\u9897/\u7ea6400g', emoji: '\u{1F966}', color: '#2E7D32' },
  { id: 109, name: '\u751c\u7cef\u6c34\u679c\u7389\u7c73', price: 1280, originalPrice: 1680, img: '/images/product-corn.svg',      tag: '\u5f53\u5b63',         unit: '1\u6839/\u7ea6300g', emoji: '\u{1F33D}', color: '#F57F17' },
  { id: 110, name: '\u6cd5\u5f0f\u624b\u5de5\u9762\u5305', price: 1880, originalPrice: 2280, img: '/images/product-bread.svg',     tag: '\u5f53\u65e5\u70d8\u7119', unit: '1\u4e2a/\u7ea6300g', emoji: '\u{1F35E}', color: '#8D6E63' }
]