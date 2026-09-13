<script setup>
import { assetUrl } from '@/utils/asset'
import { computed, onMounted } from 'vue'
import { getUserInfo } from '@/api/user'
import { useUserStore } from '@/store/modules/user'
import { orderEntries, toolMenus } from '@/mock/user'

defineOptions({ name: 'Profile' })

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

onMounted(async () => {
  if (userStore.userInfo) return
  try {
    const info = await getUserInfo()
    userStore.setUserInfo(info)
  } catch (e) {
    // 拉取失败保持未登录态
  }
})
</script>

<template>
  <div class="profile">
    <!-- 顶部用户卡片 -->
    <header class="user-card">
      <img
        class="avatar"
        :src="userInfo?.avatar || assetUrl('/images/avatar.svg')"
        alt="头像"
      />
      <div class="user-info">
        <div class="nickname">{{ userInfo?.nickname || '未登录' }}</div>
        <div v-if="userInfo" class="level">
          <span class="level-badge">{{ userInfo.level }}</span>
          <span class="level-text">{{ userInfo.levelText }}</span>
        </div>
      </div>
    </header>

    <!-- 资产栏 -->
    <section v-if="userInfo" class="asset-bar">
      <div class="asset-item">
        <span class="asset-num">{{ userInfo.points }}</span>
        <span class="asset-label">积分</span>
      </div>
      <div class="asset-item">
        <span class="asset-num">{{ userInfo.coupons }}</span>
        <span class="asset-label">优惠券</span>
      </div>
      <div class="asset-item">
        <span class="asset-num">¥{{ userInfo.balance }}</span>
        <span class="asset-label">余额</span>
      </div>
    </section>

    <!-- 我的订单 -->
    <section class="card">
      <div class="card__header">
        <span class="card__title">我的订单</span>
        <span class="card__more">全部订单 ›</span>
      </div>
      <div class="order-entries">
        <div v-for="o in orderEntries" :key="o.key" class="order-entry">
          <span class="order-entry__icon">{{ o.icon }}</span>
          <span class="order-entry__name">{{ o.name }}</span>
          <span v-if="o.badge > 0" class="order-entry__badge">{{ o.badge }}</span>
        </div>
      </div>
    </section>

    <!-- 工具菜单 -->
    <section class="card">
      <div class="tool-grid">
        <div v-for="t in toolMenus" :key="t.key" class="tool-item">
          <span class="tool-item__icon">{{ t.icon }}</span>
          <span class="tool-item__name">{{ t.name }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.profile {
  min-height: 100%;
  background: var(--bg-page);
  padding-bottom: var(--space-xl);
}

/* 用户卡片 */
.user-card {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-xl) var(--space-lg);
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: #fff;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  object-fit: cover;
  flex-shrink: 0;
}
.user-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.nickname {
  font-size: var(--font-size-xl);
  font-weight: 600;
}
.level {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
.level-badge {
  font-size: var(--font-size-xs);
  background: rgba(255, 255, 255, 0.25);
  padding: 2px 8px;
  border-radius: var(--radius-round);
  font-weight: 500;
}
.level-text {
  font-size: var(--font-size-xs);
  opacity: 0.9;
}

/* 资产栏 */
.asset-bar {
  display: flex;
  margin: var(--space-md) var(--space-lg) 0;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
.asset-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-lg) 0;
}
.asset-item + .asset-item {
  border-left: 1px solid var(--border-color);
}
.asset-num {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
}
.asset-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* 通用卡片 */
.card {
  margin: var(--space-md) var(--space-lg) 0;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}
.card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--border-color);
}
.card__title {
  font-size: var(--font-size-md);
  font-weight: 600;
}
.card__more {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* 订单状态 */
.order-entries {
  display: flex;
  padding: var(--space-lg) 0;
}
.order-entry {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.order-entry__icon {
  font-size: 24px;
}
.order-entry__name {
  font-size: var(--font-size-sm);
  color: var(--text-regular);
}
.order-entry__badge {
  position: absolute;
  top: -6px;
  right: 50%;
  transform: translateX(calc(50% + 10px));
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  box-sizing: border-box;
  border-radius: var(--radius-round);
  background: var(--color-danger);
  color: #fff;
  font-size: var(--font-size-xs);
  line-height: 16px;
  text-align: center;
}

/* 工具菜单 */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--space-lg) 0;
}
.tool-item__icon {
  font-size: 24px;
}
.tool-item__name {
  font-size: var(--font-size-sm);
  color: var(--text-regular);
}
</style>
