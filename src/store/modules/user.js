import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const userInfo = ref(null)

    function setToken(value) {
      token.value = value
    }

    function setUserInfo(info) {
      userInfo.value = info
    }

    function logout() {
      token.value = ''
      userInfo.value = null
    }

    return { token, userInfo, setToken, setUserInfo, logout }
  },
  {
    persist: true
  }
)
