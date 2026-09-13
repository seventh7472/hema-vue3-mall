<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useCartStore } from '@/store/modules/cart'

const route = useRoute()
const cartStore = useCartStore()

const tabs = [
  {
    name: '首页',
    path: '/home',
    paths: ['M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z']
  },
  {
    name: '分类',
    path: '/category',
    paths: [
      'M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z'
    ]
  },
  {
    name: '购物车',
    path: '/cart',
    paths: [
      'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z'
    ]
  },
  {
    name: '我的',
    path: '/profile',
    paths: [
      'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
    ]
  }
]

// 角标数量实时取自 store 的 computed
const cartCount = computed(() => cartStore.cartCount)
const badgeText = computed(() =>
  cartCount.value > 99 ? '99+' : String(cartCount.value)
)

const isActive = (path) => route.path === path
</script>

<template>
  <nav class="tabbar">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="tabbar__item"
      :class="{ 'tabbar__item--active': isActive(tab.path) }"
    >
      <span class="tabbar__icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path v-for="(d, i) in tab.paths" :key="i" :d="d" />
        </svg>
        <span
          v-if="tab.path === '/cart' && cartCount > 0"
          class="tabbar__badge"
        >
          {{ badgeText }}
        </span>
      </span>
      <span class="tabbar__label">{{ tab.name }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.tabbar {
  display: flex;
  align-items: center;
  height: calc(var(--tabbar-height) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
}

.tabbar__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 100%;
  color: var(--text-secondary);
  -webkit-tap-highlight-color: transparent;
}

.tabbar__item--active {
  color: var(--color-primary);
}

.tabbar__icon {
  position: relative;
  display: flex;
  width: 24px;
  height: 24px;
}

.tabbar__icon svg {
  width: 100%;
  height: 100%;
}

.tabbar__badge {
  position: absolute;
  top: -4px;
  right: -10px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  box-sizing: border-box;
  border-radius: var(--radius-round);
  background: var(--color-danger);
  color: var(--text-inverse);
  font-size: var(--font-size-xs);
  line-height: 16px;
  text-align: center;
}

.tabbar__label {
  font-size: var(--font-size-xs);
  line-height: 1;
}
</style>
