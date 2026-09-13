import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * 购物车 Store
 * 约定：商品价格 price 单位为「分」（整数），避免浮点精度问题
 * list item 结构：{ id, name, price(分), count, selected }
 */
export const useCartStore = defineStore(
  'cart',
  () => {
    const list = ref([])

    // 购物车角标数量（件数合计）
    const cartCount = computed(() =>
      list.value.reduce((sum, item) => sum + item.count, 0)
    )

    // 选中商品总金额，单位「分」，纯整数运算
    const totalPrice = computed(() =>
      list.value.reduce(
        (sum, item) => sum + (item.selected ? item.price * item.count : 0),
        0
      )
    )

    // 已选商品件数
    const selectedCount = computed(() =>
      list.value.reduce((sum, item) => sum + (item.selected ? item.count : 0), 0)
    )

    // 是否全选（列表非空且全部选中）
    const allSelected = computed(
      () => list.value.length > 0 && list.value.every((item) => item.selected)
    )

    function addItem(goods) {
      const exist = list.value.find((item) => item.id === goods.id)
      if (exist) {
        exist.count += goods.count || 1
      } else {
        list.value.push({ ...goods, count: goods.count || 1, selected: true })
      }
    }

    function removeItem(id) {
      const index = list.value.findIndex((item) => item.id === id)
      if (index > -1) list.value.splice(index, 1)
    }

    function updateCount(id, count) {
      const item = list.value.find((i) => i.id === id)
      if (item) item.count = Math.max(1, count)
    }

    function toggleSelected(id) {
      const item = list.value.find((i) => i.id === id)
      if (item) item.selected = !item.selected
    }

    function toggleAllSelected() {
      const target = !allSelected.value
      list.value.forEach((item) => {
        item.selected = target
      })
    }

    function clearCart() {
      list.value = []
    }

    return {
      list,
      cartCount,
      totalPrice,
      selectedCount,
      allSelected,
      addItem,
      removeItem,
      updateCount,
      toggleSelected,
      toggleAllSelected,
      clearCart
    }
  },
  {
    persist: true
  }
)
