<template>
  <nav class="nav">

    <v-navigation-drawer app temporary v-model="drawer" location="right" color="rgba(74, 107, 95, 0.9)">
      <v-list-item-title class="text-center text-white my-2">功能選擇</v-list-item-title>
      <v-divider color="white"></v-divider>

      <v-list density="compact" nav>
        <v-list-item v-for="item in items" :key="item.label" :to="item.route" v-show="checkAuth(item.authKey)">
          <template v-slot:prepend>
            <v-icon color="yellow">{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title class="text-yellow" style="font-size:1rem;">{{ item.label }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="logout">
          <template v-slot:prepend>
            <v-icon color="yellow">mdi-logout</v-icon>
          </template>
          <v-list-item-title class="text-yellow" style="font-size:1rem;">登出</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="rgba(74, 107, 95, 0.9)" app fixed class="align-center">
      <v-toolbar-title style="cursor: pointer;">
        <router-link to="/main/functionlist" custom v-slot="{ navigate }">
          <div @click="navigate" @keypress.enter="navigate" class="d-flex">
            <span class="font-weight-black text-white subtitle-1 text-sm-h6">
              {{ store.state.cData.company_name }}
            </span>
            <span class="subtitle-1 text-white ml-2 d-none d-sm-flex">
              v.{{ store.state.verMsg }}
            </span>
          </div>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="white" @click.stop="drawer = !drawer"
        class="font-weight-black text-white text-caption text-sm-h6">
        {{ store.state.pData.username }}
        <v-icon>mdi-apps</v-icon>
      </v-btn>
    </v-app-bar>


  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/useStore'

const router = useRouter()
const store = useStore()

// 響應式數據
const personnel_key = ref(true)
const drawer = ref(false)

// 計算屬性
const items = computed(() => {
  return store.state.authKeys
})

// 方法
const logout = () => {
  store.state.logined = false
  router.push("/login")
  sessionStorage.clear() //清除sessionStorage
}

const getSessionStorage = () => {
  if (sessionStorage.getItem("pData") != null) {
    store.state.cData = JSON.parse(sessionStorage.getItem("cData"))
    store.state.pData = JSON.parse(sessionStorage.getItem("pData"))
  } else {
    router.push("/login")
  }
}

const checkAuth = (authkey) => {
  if (store.state.pData[authkey] === "true" || authkey === "pass") {
    return true
  }
  return false
}

// 生命週期鉤子
onMounted(() => {
  getSessionStorage() //取得暫存的廠商及使用者資料
  checkAuth() //判斷授權的功能
})
</script>

<style lang="scss">
.v-toolbar__content,
.v-navigation-drawer {
  background-image: url("@/assets/BG_top.png");
  background-repeat: repeat;
}

.v-snack__content {
  font-size: 2rem;
}
</style>