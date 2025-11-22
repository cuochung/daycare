<template>
  <div class="MultiPrintOption">
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center bg-primary-lighten-2">
          <v-icon color="primary" class="mr-2">mdi-printer</v-icon>
          <span class="text-h6 font-weight-bold">{{ title }}</span>
          <v-spacer />
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="closeDialog"
          />
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-alert
            type="info"
            variant="tonal"
            border="start"
            color="primary"
            class="mb-4"
            icon="mdi-information-outline"
          >
            <div class="d-flex justify-end ga-2 mb-3">
              <v-btn
                color="primary"
                variant="tonal"
                size="small"
                @click="selectAll"
              >
                全選
              </v-btn>
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                @click="noAll"
              >
                全不選
              </v-btn>
            </div>

            <v-checkbox
              v-model="list.record"
              label="住民定期評估表"
              hide-details
              @click.stop
            />
            <v-checkbox
              v-model="list.kb"
              label="柯氏/巴氏(ADL)量表"
              hide-details
              @click.stop
            />
            <v-checkbox
              v-model="list.fall"
              label="跌倒危險因子評估表"
              hide-details
              @click.stop
            />
            <v-checkbox
              v-model="list.braden"
              label="Braden壓力性損傷風險評估表"
              hide-details
              @click.stop
            />
            <v-checkbox
              v-model="list.spmsq"
              label="簡易心智狀態SPMSQ"
              hide-details
              @click.stop
            />
          </v-alert>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            variant="text"
            @click="closeDialog"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-printer"
            :disabled="!hasSelection"
            @click="handlePrint"
          >
            確認列印
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const store = useStore()
const { proxy } = getCurrentInstance()
const router = useRouter()

const props = defineProps({
  printItems: {
    type: Array,
    default: () => [],
  },
})

const dialog = ref(false)
const list = ref({
  record: false,
  kb: false,
  fall: false,
  braden: false,
  spmsq: false,
})

const documents = ['record', 'kb', 'fall', 'braden', 'spmsq']
const documentItems = ref({
  recordItems: [],
  kbItems: [],
  fallItems: [],
  bradenItems: [],
  spmsqItems: [],
})

const title = '列印表單選擇'

const hasSelection = computed(() => {
  return Object.values(list.value).some((value) => value === true)
})

const open = () => {
  dialog.value = true
  selectAll()
  // 取得所有表單的資料
  documents.forEach((document) => {
    getItems(document)
  })
}

const closeDialog = () => {
  dialog.value = false
  // 重置為全選狀態
  selectAll()
}

const selectAll = () => {
  documents.forEach((doc) => {
    list.value[doc] = true
  })
}

const noAll = () => {
  documents.forEach((doc) => {
    list.value[doc] = false
  })
}

const getItems = async (document) => {
  if (!store.state?.uData?.snkey) return

  const payload = {
    key: 'u_snkey',
    value: store.state.uData.snkey,
  }
  const url = `byjson/searchByKeyValue/${store.state.databaseName}/${document}`
  try {
    const response = await api.options(url, payload)
    documentItems.value[`${document}Items`] = response ?? []
  } catch (error) {
    console.error(`取得 ${document} 資料失敗:`, error)
    documentItems.value[`${document}Items`] = []
  }
}

const handlePrint = async () => {
  const result = await proxy.$swal({
    title: '確認顯示列印畫面？',
    text: '列印畫面將在新的分頁中顯示，請再次確認。',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center',
  })

  if (!result?.isConfirmed) return

  const printData = {}

  // 取得匹配的日期
  printData.matchDate = props.printItems.map((i) => i.date)
  const matchStr = JSON.stringify(printData.matchDate.sort())

  // 過濾每個表單的資料
  documents.forEach((document) => {
    printData[document] = documentItems.value[`${document}Items`].filter((i) => {
      try {
        const newItem = JSON.parse(i.datalist || '{}')
        return matchStr.includes(newItem.date)
      } catch (error) {
        return false
      }
    })
  })

  // 將 boolean 轉換為字符串格式以符合原始格式
  printData.choiceDocuments = {
    record: list.value.record ? 'true' : '',
    kb: list.value.kb ? 'true' : '',
    fall: list.value.fall ? 'true' : '',
    braden: list.value.braden ? 'true' : '',
    spmsq: list.value.spmsq ? 'true' : '',
  }

  // 存入 sessionStorage
  sessionStorage.setItem('printData', JSON.stringify(printData))

  // 開啟列印頁面
  const routeData = router.resolve({
    path: '/MultiDocumentPrint',
  })
  window.open(routeData.href, '_blank')
  closeDialog()
}

onMounted(() => {
  selectAll()
})

defineExpose({
  open,
})
</script>

<style scoped lang="scss">
// 樣式已由 Vuetify 3 元件處理
</style>
