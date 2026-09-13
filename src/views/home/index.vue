<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { getHomeBanner, getHomeCategory, getHomeRecommend } from '@/api/home'
import { useCartStore } from '@/store/modules/cart'
import { formatPrice } from '@/utils/format'

defineOptions({ name: 'Home' })

const cartStore = useCartStore()

const loading = ref(true)
const banners = ref([])
const categories = ref([])
const recommends = ref([])

// 轮播状态
const trackRef = ref(null)
const bannerIndex = ref(0)
let timer = null
let isProgrammaticScroll = false

function scrollToBanner(i) {
  const el = trackRef.value
  if (!el || !banners.value.length) return
  isProgrammaticScroll = true
  bannerIndex.value = i
  el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  setTimeout(() => { isProgrammaticScroll = false }, 450)
}

function onBannerScroll() {
  if (isProgrammaticScroll) return
  const el = trackRef.value
  if (!el) return
  bannerIndex.value = Math.round(el.scrollLeft / el.clientWidth)
}

function startAuto() {
  stopAuto()
  if (banners.value.length < 2) return
  timer = setInterval(() => {
    scrollToBanner((bannerIndex.value + 1) % banners.value.length)
  }, 3000)
}
function stopAuto() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function onAddCart(g) {
  // price 已是「分」，cart store 约定一致，无需单位换算
  cartStore.addItem({ id: g.id, name: g.name, price: g.price, img: g.img })
}

onMounted(async () => {
  try {
    const [b, c, r] = await Promise.all([
      getHomeBanner(),
      getHomeCategory(),
      getHomeRecommend()
    ])
    banners.value = b
    categories.value = c
    recommends.value = r
  } finally {
    loading.value = false
    // 等 DOM 更新使 track 有 clientWidth 再启动轮播
    requestAnimationFrame(() => startAuto())
  }
})
// keep-alive 下：切走暂停，切回恢复
onActivated(() => startAuto())
onDeactivated(() => stopAuto())
onUnmounted(() => stopAuto())
</script>

<template>
  <div class="home">
    <!-- 顶部搜索区（盒马蓝） -->
    <header class="search-header">
      <div class="location">📍 配送至：北京市朝阳区</div>
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input class="search-input" type="text" placeholder="搜索 生鲜 商品" readonly />
        <span class="search-extra">扫码</span>
      </div>
    </header>

    <!-- 主内容 -->
    <div class="content">
      <!-- 轮播 -->
      <section v-if="banners.length" class="banner">
        <div ref="trackRef" class="banner-track" @scroll="onBannerScroll">
          <div v-for="b in banners" :key="b.id" class="banner-item">
            <img :src="b.img" :alt="b.title" class="banner-img" />
          </div>
        </div>
        <div class="banner-dots">
          <span
            v-for="(b, i) in banners"
            :key="b.id"
            class="dot"
            :class="{ active: i === bannerIndex }"
            @click="scrollToBanner(i)"
          />
        </div>
      </section>

      <!-- 分类 -->
      <section class="category">
        <div v-for="c in categories" :key="c.id" class="cat-item">
          <div
            class="cat-icon"
            :style="{ background: `linear-gradient(135deg, ${c.color}, ${c.color}99)` }"
          >{{ c.emoji }}</div>
          <div class="cat-name">{{ c.name }}</div>
        </div>
      </section>

      <!-- 为你推荐 -->
      <div class="section-title"><span>为你推荐</span></div>

      <!-- 商品网格 -->
      <section class="recommend">
        <div v-for="g in recommends" :key="g.id" class="goods-card">
          <div class="goods-img-wrap">
            <img :src="g.img" :alt="g.name" class="goods-img" />
            <span v-if="g.tag" class="goods-tag">{{ g.tag }}</span>
          </div>
          <div class="goods-name">{{ g.name }}</div>
          <div class="goods-unit">{{ g.unit }}</div>
          <div class="goods-bottom">
            <div class="goods-price">
              <span class="price-cur">{{ formatPrice(g.price) }}</span>
              <span
                v-if="g.originalPrice && g.originalPrice > g.price"
                class="price-orig"
              >{{ formatPrice(g.originalPrice) }}</span>
            </div>
            <button class="add-btn" @click.stop="onAddCart(g)" aria-label="加入购物车">+</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home { min-height: 100%; background: var(--bg-page); }

/* ============ 搜索区 ============ */
.search-header {
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  padding: var(--space-md) var(--space-lg) var(--space-lg);
  color: #fff;
}
.location {
  font-size: var(--font-size-sm);
  opacity: .92;
  margin-bottom: var(--space-sm);
}
.search-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: var(--radius-round);
  padding: 0 var(--space-md);
  height: 36px;
  color: var(--text-regular);
}
.search-icon { margin-right: var(--space-sm); font-size: 14px; }
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size-base);
  color: var(--text-primary);
}
.search-input::placeholder { color: var(--text-placeholder); }
.search-extra {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: 600;
  margin-left: var(--space-sm);
  cursor: pointer;
}

/* ============ 内容容器 ============ */
.content {
  padding: var(--space-md) var(--space-lg) var(--space-xl);
}

/* ============ 轮播 ============ */
.banner {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  margin-bottom: var(--space-md);
}
.banner-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
}
.banner-track::-webkit-scrollbar { display: none; }
.banner-item {
  flex: 0 0 100%;
  scroll-snap-align: start;
}
.banner-img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 750 / 320;
}
.banner-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: var(--space-sm) 0;
}
.dot {
  width: 6px; height: 6px;
  border-radius: var(--radius-round);
  background: var(--border-color-dark);
  transition: all var(--transition-fast);
  cursor: pointer;
}
.dot.active {
  width: 18px;
  background: var(--color-primary);
}

/* ============ 分类 ============ */
.category {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-md) var(--space-sm);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) var(--space-md);
  margin-bottom: var(--space-md);
  box-shadow: var(--shadow-card);
}
.cat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}
.cat-icon {
  width: 44px; height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .08);
}
.cat-name {
  font-size: var(--font-size-sm);
  color: var(--text-regular);
}

/* ============ section title ============ */
.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md) 0;
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-primary);
}
.section-title::before,
.section-title::after {
  content: '';
  width: 24px;
  height: 1px;
  background: var(--border-color-dark);
  margin: 0 var(--space-sm);
}

/* ============ 推荐商品网格 ============ */
.recommend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}
.goods-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
}
.goods-img-wrap {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}
.goods-img {
  width: 100%; height: 100%;
  display: block;
  object-fit: cover;
}
.goods-tag {
  position: absolute;
  top: var(--space-sm);
  left: var(--space-sm);
  background: var(--color-price);
  color: #fff;
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-weight: 500;
}
.goods-name {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  padding: var(--space-sm) var(--space-md) 0;
  line-height: 1.35;
  height: 2.7em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.goods-unit {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  padding: 2px var(--space-md) 0;
}
.goods-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md) var(--space-md);
  margin-top: auto;
}
.goods-price {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.price-cur {
  color: var(--color-price);
  font-weight: 700;
  font-size: var(--font-size-md);
}
.price-orig {
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  text-decoration: line-through;
}
.add-btn {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: transform var(--transition-fast);
  flex-shrink: 0;
}
.add-btn:active { transform: scale(.9); }
</style>