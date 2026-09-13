<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/store/modules/cart'
import { formatPrice } from '@/utils/format'

defineOptions({ name: 'Cart' })

const cartStore = useCartStore()
const MAX_COUNT = 99 // 无库存字段时的默认上限

const list = computed(() => cartStore.list)
const totalFen = computed(() => cartStore.totalPrice)
const selectedCount = computed(() => cartStore.selectedCount)
const allSelected = computed(() => cartStore.allSelected)

// 轻提示
const toast = ref('')
let toastTimer = null
function showToast(msg) {
  toast.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = ''
  }, 1600)
}

function onToggle(item) {
  cartStore.toggleSelected(item.id)
}
function onToggleAll() {
  cartStore.toggleAllSelected()
}
function onMinus(item) {
  if (item.count <= 1) return
  cartStore.updateCount(item.id, item.count - 1)
}
function onPlus(item) {
  const max = item.stock ?? MAX_COUNT
  if (item.count >= max) {
    showToast(`该商品库存仅 ${max} 件`)
    return
  }
  cartStore.updateCount(item.id, item.count + 1)
}
function onDelete(item) {
  cartStore.removeItem(item.id)
}
function onCheckout() {
  if (selectedCount.value === 0) {
    showToast('请先选择商品')
    return
  }
  showToast(`已提交 ${selectedCount.value} 件商品，合计 ${formatPrice(totalFen.value)}`)
  // 模拟下单：移除已选商品
  list.value
    .filter((i) => i.selected)
    .forEach((i) => cartStore.removeItem(i.id))
}
</script>

<template>
  <div class="cart">
    <header class="cart__header">
      <h2 class="cart__title">购物车</h2>
      <span class="cart__count">共 {{ cartStore.cartCount }} 件</span>
    </header>

    <!-- 空状态 -->
    <div v-if="list.length === 0" class="cart__empty">
      <div class="empty-icon">🛒</div>
      <p class="empty-text">购物车还是空的</p>
      <RouterLink to="/home" class="empty-btn">去逛逛</RouterLink>
    </div>

    <template v-else>
      <!-- 商品列表 -->
      <div class="cart__list">
        <div v-for="item in list" :key="item.id" class="cart-item">
          <span
            class="check"
            :class="{ checked: item.selected }"
            @click="onToggle(item)"
          >
            <span v-if="item.selected" class="check-mark">✓</span>
          </span>
          <img :src="item.img" :alt="item.name" class="cart-item__img" />
          <div class="cart-item__info">
            <div class="cart-item__name">{{ item.name }}</div>
            <div class="cart-item__stock">库存 {{ item.stock || MAX_COUNT }} 件</div>
            <div class="cart-item__row">
              <span class="cart-item__price">{{ formatPrice(item.price) }}</span>
              <div class="stepper">
                <button
                  class="stepper__btn"
                  :class="{ disabled: item.count <= 1 }"
                  @click="onMinus(item)"
                >−</button>
                <span class="stepper__num">{{ item.count }}</span>
                <button
                  class="stepper__btn"
                  :class="{ disabled: item.count >= (item.stock || MAX_COUNT) }"
                  @click="onPlus(item)"
                >+</button>
              </div>
            </div>
          </div>
          <button class="cart-item__del" @click="onDelete(item)" aria-label="删除">×</button>
        </div>
      </div>

      <!-- 底部结算栏 -->
      <footer class="cart__footer">
        <div class="select-all" @click="onToggleAll">
          <span class="check" :class="{ checked: allSelected }">
            <span v-if="allSelected" class="check-mark">✓</span>
          </span>
          <span>全选</span>
        </div>
        <div class="total">
          <span class="total-label">合计</span>
          <span class="total-price">{{ formatPrice(totalFen) }}</span>
        </div>
        <button
          class="checkout-btn"
          :class="{ disabled: selectedCount === 0 }"
          @click="onCheckout"
        >
          结算({{ selectedCount }})
        </button>
      </footer>
    </template>

    <!-- 轻提示 -->
    <transition name="fade">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </transition>
  </div>
</template>

<style scoped>
.cart {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-page);
}

.cart__header {
  position: sticky;
  top: 0;
  z-index: var(--z-index-sticky);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
}
.cart__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
}
.cart__count {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* 空状态 */
.cart__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-xxxl) 0;
}
.empty-icon { font-size: 56px; }
.empty-text { color: var(--text-secondary); font-size: var(--font-size-base); }
.empty-btn {
  padding: 8px 24px;
  border-radius: var(--radius-round);
  background: var(--color-primary);
  color: #fff;
  font-size: var(--font-size-base);
}

/* 列表 */
.cart__list {
  flex: 1;
  padding: var(--space-md) var(--space-lg) var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.cart-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
.check {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
}
.check.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
}
.check-mark {
  color: #fff;
  font-size: 12px;
  line-height: 1;
}
.cart-item__img {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-md);
  object-fit: cover;
  flex-shrink: 0;
}
.cart-item__info {
  flex: 1;
  min-width: 0;
}
.cart-item__name {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  line-height: 1.3;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.cart-item__stock {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-top: 2px;
}
.cart-item__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-sm);
}
.cart-item__price {
  color: var(--color-price);
  font-weight: 700;
  font-size: var(--font-size-md);
}
.stepper {
  display: flex;
  align-items: center;
  gap: 1px;
}
.stepper__btn {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: var(--bg-page);
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stepper__btn.disabled {
  color: var(--text-placeholder);
}
.stepper__num {
  min-width: 32px;
  text-align: center;
  font-size: var(--font-size-base);
}
.cart-item__del {
  font-size: 20px;
  color: var(--text-secondary);
  padding: 4px;
  flex-shrink: 0;
}

/* 底部结算栏 */
.cart__footer {
  position: sticky;
  bottom: 0;
  z-index: var(--z-index-sticky);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
}
.select-all {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-base);
  cursor: pointer;
}
.total {
  flex: 1;
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 4px;
}
.total-label {
  font-size: var(--font-size-sm);
  color: var(--text-regular);
}
.total-price {
  color: var(--color-price);
  font-weight: 700;
  font-size: var(--font-size-xl);
}
.checkout-btn {
  padding: 10px 20px;
  border-radius: var(--radius-round);
  background: var(--color-primary);
  color: #fff;
  font-size: var(--font-size-base);
  font-weight: 600;
}
.checkout-btn.disabled {
  background: var(--text-placeholder);
}

/* 轻提示 */
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 10px 18px;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  z-index: var(--z-index-toast);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-fast);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
