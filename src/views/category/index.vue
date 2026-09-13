<script setup>
import { computed, onMounted, ref } from 'vue'
import { getCategoryTree } from '@/api/category'
import { useCartStore } from '@/store/modules/cart'
import { formatPrice } from '@/utils/format'

defineOptions({ name: 'Category' })

const cartStore = useCartStore()

const nav = ref([])
const subsMap = ref({})
const goods = ref([])

const activeCat = ref(0) // 当前一级分类 id
const activeSub = ref(0) // 当前二级分类下标

const currentSubs = computed(() => subsMap.value[activeCat.value] || [])
const currentGoods = computed(() =>
  goods.value.filter(
    (g) => g.catId === activeCat.value && g.sub === activeSub.value
  )
)

function selectCat(id) {
  if (activeCat.value === id) return
  activeCat.value = id
  activeSub.value = 0
}

function selectSub(i) {
  activeSub.value = i
}

function onAddCart(g) {
  cartStore.addItem({
    id: g.id,
    name: g.name,
    price: g.price,
    img: g.img,
    stock: g.stock
  })
}

onMounted(async () => {
  const data = await getCategoryTree()
  nav.value = data.nav
  subsMap.value = data.subs
  goods.value = data.goods
  activeCat.value = data.nav[0]?.id ?? 0
})
</script>

<template>
  <div class="category">
    <!-- 左侧一级分类 -->
    <aside class="side-nav">
      <div
        v-for="c in nav"
        :key="c.id"
        class="side-nav__item"
        :class="{ active: c.id === activeCat }"
        @click="selectCat(c.id)"
      >
        <span class="side-nav__emoji">{{ c.emoji }}</span>
        <span class="side-nav__name">{{ c.name }}</span>
      </div>
    </aside>

    <!-- 右侧内容 -->
    <section class="content">
      <!-- 二级分类 -->
      <div class="sub-nav">
        <span
          v-for="(s, i) in currentSubs"
          :key="i"
          class="sub-nav__item"
          :class="{ active: i === activeSub }"
          @click="selectSub(i)"
        >{{ s }}</span>
      </div>

      <!-- 商品列表 -->
      <div class="goods-list">
        <div v-for="g in currentGoods" :key="g.id" class="goods-item">
          <img :src="g.img" :alt="g.name" class="goods-img" />
          <div class="goods-info">
            <div class="goods-name">{{ g.name }}</div>
            <div class="goods-unit">{{ g.unit }}</div>
            <div class="goods-bottom">
              <span class="goods-price">{{ formatPrice(g.price) }}</span>
              <button class="add-btn" @click="onAddCart(g)" aria-label="加入购物车">+</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.category {
  display: flex;
  height: 100%;
  min-height: 0;
  background: var(--bg-page);
}

/* ===== 左侧一级分类 ===== */
.side-nav {
  width: 88px;
  height: 100%;
  overflow-y: auto;
  background: var(--bg-card);
  border-right: 1px solid var(--border-color);
  flex-shrink: 0;
}
.side-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-md) 4px;
  font-size: var(--font-size-sm);
  color: var(--text-regular);
  position: relative;
  cursor: pointer;
}
.side-nav__emoji { font-size: 22px; }
.side-nav__name { line-height: 1.2; }
.side-nav__item.active {
  background: var(--bg-page);
  color: var(--color-primary);
  font-weight: 600;
}
.side-nav__item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: var(--color-primary);
  border-radius: 0 3px 3px 0;
}

/* ===== 右侧内容 ===== */
.content {
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  padding: var(--space-md);
  background: var(--bg-page);
}

/* 二级分类 */
.sub-nav {
  display: flex;
  gap: var(--space-sm);
  overflow-x: auto;
  padding-bottom: var(--space-sm);
  scrollbar-width: none;
}
.sub-nav::-webkit-scrollbar { display: none; }
.sub-nav__item {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: var(--radius-round);
  background: var(--bg-card);
  color: var(--text-regular);
  font-size: var(--font-size-sm);
  cursor: pointer;
}
.sub-nav__item.active {
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
}

/* 商品列表 */
.goods-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding-bottom: var(--space-xl);
}
.goods-item {
  display: flex;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}
.goods-img {
  width: 96px;
  height: 96px;
  object-fit: cover;
  flex-shrink: 0;
}
.goods-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: var(--space-sm) var(--space-md);
}
.goods-name {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  line-height: 1.35;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.goods-unit {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-top: 2px;
}
.goods-bottom {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.goods-price {
  color: var(--color-price);
  font-weight: 700;
  font-size: var(--font-size-md);
}
.add-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: transform var(--transition-fast);
}
.add-btn:active { transform: scale(.9); }
</style>
