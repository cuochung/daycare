<template>
  <div class="functionlist tableImage">
    <div class="justTransparent mt-3" style="height:100%">
      <v-row appear tag="transition-group">
        <v-col class="align-center pa-0 py-1" cols="6" md="3" v-for="(item,index) in items" :key="item.label" v-ripple
          :data-index="index">
          <div class="zoneStyle myTransparent ma-2 px-4 py-2 rounded-xl" v-if="item.keyName != 'exit'">
            <router-link :to="item.route" custom v-slot="{ navigate }">
              <div @click="navigate" @keypress.enter="navigate">
                <h2 class="titleFontColor">{{ item.label }}</h2>
                <v-img :src="item.image" aspect-ratio="2.5" contain></v-img>
              </div>
            </router-link>
          </div>

          <div class="zoneStyle myTransparent ma-2 px-4 py-2 rounded-xl" v-if="item.keyName == 'exit'"
            @click.stop="logout">
            <h2 class="titleFontColor">{{ item.label }}</h2>
            <v-img :src="item.image" aspect-ratio="2.5" contain></v-img>
          </div>
        </v-col>

      </v-row>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/useStore'

const router = useRouter()
const store = useStore()

// 計算屬性：過濾有權限的功能項目
const items = computed(() => {
  return store.state.authKeys.filter(
    (item) =>
      store.state.pData[item.authKey] == "true" ||
      item.authKey == "pass" ||
      item.authKey == "exit_key"
  )
})

// 登出方法
const logout = () => {
  router.push("/login")
  sessionStorage.clear() // 清除sessionStorage
}
</script>


<style scoped>
.zoneStyle{
  transition: transform 0.5s ease;
  cursor: pointer;
  text-align: center;
}
.zoneStyle:hover{
  transform: scale(1.05);
}
</style>