<script setup>
import { computed } from 'vue'
import TabBar from '@/components/TabBar/TabBar.vue'
import { cachedViews } from '@/router'

const includeList = computed(() => cachedViews)
</script>

<template>
  <div class="tabbar-layout">
    <main class="tabbar-layout__main">
      <router-view v-slot="{ Component }">
        <keep-alive :include="includeList">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>

    <TabBar />
  </div>
</template>

<style scoped>
.tabbar-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  max-width: var(--content-max-width);
  margin: 0 auto;
  background: var(--bg-page);
}

.tabbar-layout__main {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
</style>
