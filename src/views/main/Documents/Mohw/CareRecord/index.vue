<template>
  <div class="care-record-list">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <v-sheet class="care-record-list__hero" rounded="xl" elevation="0">
            <div class="d-flex flex-column flex-md-row justify-space-between align-start">
              <div class="d-flex align-center mb-4 mb-md-0">
                <v-avatar size="56" color="primary" variant="tonal" class="mr-4">
                  <v-icon color="primary" size="32">mdi-clipboard-text</v-icon>
                </v-avatar>
                <div>
                  <h2 class="care-record-list__title mb-1">照護紀錄</h2>
                  <p class="care-record-list__subtitle mb-0">
                    記錄住民照護過程，包含生命徵象、身體狀況、照護措施等評估項目。
                  </p>
                </div>
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="care-record-list__meta d-flex flex-wrap ga-3">
              <v-chip variant="tonal" color="primary">
                住民：{{ residentName }}
              </v-chip>
              <v-chip variant="tonal" color="secondary">
                住編：{{ residentCode }}
              </v-chip>
            </div>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-text-field v-model="searchKey" prepend-inner-icon="mdi-magnify" label="搜尋" variant="outlined"
                density="comfortable" hide-details style="max-width: 300px;" @keyup.stop="handleSearch"></v-text-field>
              <v-spacer></v-spacer>
              <v-btn v-if="isPrintSelect && printCheckedCounts.length" color="primary" variant="flat" prepend-icon="mdi-printer"
                @click="printConfirm">
                確認列印 ({{ printCheckedCounts.length }})
              </v-btn>
              <v-btn :color="isPrintSelect ? 'success' : 'secondary'" variant="tonal" prepend-icon="mdi-printer"
                @click="isPrintSelect = !isPrintSelect">
                {{ isPrintSelect ? '取消列印模式' : '列印模式' }}
              </v-btn>
              <v-btn color="primary" variant="flat" prepend-icon="mdi-plus-circle" @click="openAdd" class="ml-2">
                新增紀錄
              </v-btn>
              <CareRecordAdd ref="addDialogRef" :useDataBase="useDataBase" @refresh="getAllData" />
            </v-card-title>
            <v-card-text>
              <PaginatedIterator :items="filteredItems" :items-per-page-options="itemsPerPageOptions"
                :items-per-page="itemsPerPage" @update:items-per-page="itemsPerPage = $event">
                <template #default="{ items }">
                  <v-table fixed-header class="text-no-wrap">
                    <thead style="background-color: #e3f2fd">
                      <tr>
                        <th v-if="isPrintSelect">列印選擇({{ printCheckedCounts.length }})</th>
                        <th v-else></th>
                        <th>上傳紀錄</th>
                        <th>評估日期</th>
                        <th v-if="store.state?.cData?.isShowCreaterName">紀錄人姓名</th>
                        <th v-if="store.state?.cData?.isShowCreaterInfo">紀錄人紀錄</th>
                        <th v-if="store.state?.cData?.isShowEditerInfo">修改紀錄</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="index">
                        <td class="text-center">
                          <v-checkbox v-if="isPrintSelect" v-model="item.raw.printChecked" class="ma-0 pt-2"
                            hide-details></v-checkbox>
                          <v-menu v-else location="bottom">
                            <template #activator="{ props }">
                              <v-btn v-bind="props" variant="text" icon="mdi-dots-vertical" color="primary" />
                            </template>
                            <v-list>
                              <v-list-item @click="edit(item.raw)">
                                <template #prepend>
                                  <v-icon color="primary">mdi-square-edit-outline</v-icon>
                                </template>
                                <v-list-item-title>修改</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="del(item.raw)">
                                <template #prepend>
                                  <v-icon color="error">mdi-delete-outline</v-icon>
                                </template>
                                <v-list-item-title>刪除</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="pushToMOHW(item.raw)">
                                <template #prepend>
                                  <v-icon color="info">mdi-cloud-upload-outline</v-icon>
                                </template>
                                <v-list-item-title>上傳衛福部</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="checkMOHWData(item.raw)" v-if="item.raw.uploadData">
                                <template #prepend>
                                  <v-icon color="success">mdi-check-circle-outline</v-icon>
                                </template>
                                <v-list-item-title>確認上傳資料狀況</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </td>
                        <td>
                          <div v-if="!item.raw.uploadData">
                            <span>未上傳</span>
                          </div>
                          <div v-else>
                            <span>已上傳</span>
                            <span v-if="!item.raw.uploadState">(未確認)</span>
                            <span v-if="item.raw.uploadState">(已確認-{{ returnState(item.raw) }})</span>
                          </div>
                        </td>
                        <td>{{ item.raw.Date }}</td>
                        <td v-if="canShowCreatorName">
                          {{ (item.raw?.createInfo?.name || '').split('(')[0] }}
                        </td>
                        <td v-if="canShowCreatorInfo">
                          {{ item.raw?.createInfo?.name || '' }}
                        </td>
                        <td v-if="canShowEditorInfo" class="text-truncate" style="max-width: 400px;">
                          {{ item.raw?.editInfo?.name || '' }}
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </template>
              </PaginatedIterator>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'
import PaginatedIterator from '@/components/PaginatedIterator.vue'
import CareRecordAdd from './Add.vue'
import mohwFn from '@/assets/js/mohwFn'

const store = useStore()
const router = useRouter()
const { proxy } = getCurrentInstance()

const useDataBase = 'carerecord'
const items = ref([])
const searchKey = ref('')
const itemsPerPageOptions = [10, 20, 30]
const itemsPerPage = ref(10)
const addDialogRef = ref(null)
const isPrintSelect = ref(false) // 列印模式

const residentName = computed(() => store.state?.uData?.name ?? '未選擇住民')
const residentCode = computed(() => store.state?.uData?.p_code ?? '---')

const canShowCreatorName = computed(() => store.state?.cData?.isShowCreaterName)
const canShowCreatorInfo = computed(() => store.state?.cData?.isShowCreaterInfo)
const canShowEditorInfo = computed(() => store.state?.cData?.isShowEditerInfo)

const normalizeRecord = (row) => {
  const parsed = JSON.parse(row.datalist || '{}')
  return {
    ...parsed,
    snkey: row.snkey,
    printChecked: false, // 初始化列印選擇狀態
  }
}

const filteredItems = computed(() => {
  if (!searchKey.value) return items.value

  const keys = searchKey.value.split(' ')
  let str = ''
  return keys.reduce((prev, element) => {
    return prev.filter((item) => {
      str = JSON.stringify(item).toUpperCase()
      if (str.includes(element.toUpperCase())) {
        return item
      }
    })
  }, items.value)
})

const printCheckedCounts = computed(() => {
  return filteredItems.value.filter((i) => i.printChecked)
})

const getAllData = async () => {
  if (!store.state?.uData?.snkey) {
    items.value = []
    return
  }

  try {
    const url = `byjson/searchByKeyValue/${store.state.databaseName}/${useDataBase}`
    const payload = {
      key: 'user_snkey',
      value: store.state.uData.snkey,
    }
    const response = await api.options(url, payload)

    if (response && response.length > 0) {
      items.value = response
        .map(normalizeRecord)
        .sort((a, b) => (a.Date < b.Date ? 1 : -1))
    } else {
      items.value = []
    }
  } catch (error) {
    console.error('Get all data error:', error)
    store.showToastMulti({
      type: 'error',
      message: '讀取資料失敗',
      closeTime: 3,
    })
  }
}

const openAdd = () => {
  addDialogRef.value?.openForAdd()
}

const edit = (item) => {
  addDialogRef.value?.openForEdit(item)
}

const del = async (delData) => {
  const result = await proxy?.$swal?.({
    title: '確認刪除?',
    icon: 'question',
    showConfirmButton: true,
    showCancelButton: true,
    toast: false,
    timer: null,
    position: 'center'
  })

  if (result.isConfirmed) {
    delData.delman =
      store.state.pData.username + '(' + dayjs().format('YYYY-MM-DD HH:mm:ss') + ')'
    const payload = {
      snkey: delData.snkey,
      tablename: useDataBase,
      info: JSON.stringify(delData),
    }

    try {
      const response = await api.delete(useDataBase, payload)
      if (response?.state == 1) {
        store.showToastMulti({
          type: 'success',
          message: '已刪除',
          closeTime: 2,
        })
        await getAllData()
      }
    } catch (error) {
      console.error('Delete error:', error)
      store.showToastMulti({
        type: 'error',
        message: '刪除失敗，請稍後再試',
        closeTime: 3,
      })
    }
  }
}

const pushToMOHW = async (postItem) => {
  const result = await proxy?.$swal?.({
    title: '確認上傳資料到衛福部?',
    icon: 'question',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: '確認',
    cancelButtonText: '取消',
  })

  if (result.isConfirmed) {
    try {
      let jsonfile = JSON.stringify(dataToJson(postItem))
      const result = await mohwFn.pushToMOHW(postItem, useDataBase, jsonfile, 'CareRecord')
      if (result) {
        await getAllData()
      }
    } catch (error) {
      console.error('Push to MOHW error:', error)
    }
  }
}

const checkMOHWData = async (postItem) => {
  try {
    const result = await mohwFn.checkMOHWData(postItem, useDataBase, 'CareRecord')
    if (result) {
      await getAllData()
    }
  } catch (error) {
    console.error('Check MOHW data error:', error)
  }
}

const dataToJson = (postItem) => {
  const postData = [postItem]
  const finalPostData = mohwFn.returnCareRecordJSON(postData, store.state.uData)

  return {
    DataList: finalPostData,
  }
}

const returnState = (item) => {
  if (!item?.uploadState?.data) return ''
  try {
    const data = JSON.parse(item.uploadState.data)
    return dayjs(data[0]?.log_date).format('YYYY-MM-DD HH:mm:ss')
  } catch (e) {
    return ''
  }
}

const printConfirm = async () => {
  const result = await proxy?.$swal?.({
    title: '確認顯示列印畫面？',
    text: '列印畫面將在新的分頁中顯示，請再次確認。',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center'
  })

  if (result.isConfirmed) {
    let printData = {
      data: printCheckedCounts.value,
    }
    // 送出資料到列印頁面
    let routeData = router.resolve({
      path: '/CareRecordPrint',
      query: { data: JSON.stringify(printData) },
    })
    window.open(routeData.href, '_blank')
  }
}

const handleSearch = () => {
  // 搜尋邏輯已在 computed 中處理
}

onMounted(() => {
  getAllData()
})
</script>

<style scoped lang="scss">
.care-record-list {
  &__hero {
    padding: 28px;
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.12), rgba(33, 150, 243, 0.04));
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.87);
  }

  &__subtitle {
    font-size: 0.95rem;
    color: rgba(0, 0, 0, 0.6);
  }

  &__meta {
    margin-top: 12px;
  }

  thead {
    th {
      font-size: 1.2rem;
      font-family: '微軟正黑體';
    }
  }

  tbody {
    td {
      font-size: 1rem;
    }
  }
}
</style>
