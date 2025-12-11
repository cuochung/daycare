<template>
  <div class="pop">
    <v-dialog v-model="dialog" fullscreen persistent>
      <template v-slot:activator="{ props }">
        <v-btn color="primary" variant="flat" v-bind="props" @click="enterProcess" prepend-icon="mdi-clipboard-list-outline">
          護理紀錄
        </v-btn>
      </template>

      <v-card class="nursing-record-dialog">
        <!-- 標題區域 -->
        <v-sheet color="primary" class="d-flex align-center justify-space-between px-6 py-4 nursing-header" rounded="0">
          <div class="d-flex align-center">
            <v-avatar size="48" color="white" variant="tonal" class="mr-4">
              <v-icon color="white" size="28">mdi-clipboard-list-outline</v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h6 font-weight-bold mb-1 text-white">{{ title || '護理紀錄一覽' }}</h2>
              <p class="text-body-2 mb-0 text-white text-opacity-90">查看與查詢護理紀錄資料</p>
            </div>
          </div>
          <div class="d-flex align-center ga-3">
            <v-chip
              :color="isShowAll ? 'white' : 'success'"
              variant="flat"
              size="large"
              prepend-icon="mdi-calendar-range"
            >
              {{ isShowAll ? "全部資料" : "90日內資料" }}
            </v-chip>
            <v-btn color="white" variant="flat" prepend-icon="mdi-download" @click="importAllNursingRecordData()">
              載入所有資料
            </v-btn>
            <v-btn icon variant="text" color="white" @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-sheet>

        <v-card-text class="pa-0">
          <v-row no-gutters class="nursing-content-row">
            <!-- 左側：病歷資料列表 -->
            <v-col cols="12" md="4" class="nursing-sidebar">
              <v-card rounded="0" elevation="0" class="h-100" style="border-right: 1px solid rgba(0,0,0,0.12);">
                <v-card-title class="primary text-white d-flex align-center">
                  <v-icon class="mr-2">mdi-account-group</v-icon>
                  病歷資料列表
                  <v-spacer></v-spacer>
                  <v-chip size="small" variant="flat" color="white" text-color="primary">
                    {{ filterUser.length }}
                  </v-chip>
                </v-card-title>
                <v-card-text class="pa-4">
                  <v-text-field
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    label="搜尋病歷"
                    v-model="serachKey"
                    variant="outlined"
                    density="comfortable"
                    class="mb-4"
                    clearable
                  ></v-text-field>

                  <div class="nursing-user-list">
                    <v-list class="pa-0" style="max-height: calc(100vh - 280px); overflow-y: auto;">
                      <v-list-item
                        v-for="(item, i) in filterUser"
                        :key="i"
                        @click="selectUser = item; model = i"
                        :active="model === i"
                        color="primary"
                        variant="flat"
                        rounded="lg"
                        class="mb-2"
                      >
                        <template v-slot:prepend>
                          <v-avatar size="40" color="primary" variant="tonal">
                            <v-icon color="primary">mdi-account</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-title class="font-weight-medium">
                          {{ item.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <div class="d-flex align-center ga-2 mt-1">
                            <span class="text-caption">病歷號: {{ item.p_code }}</span>
                          </div>
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item v-if="filterUser.length === 0" class="text-center">
                        <v-list-item-title class="text-medium-emphasis">
                          <v-icon class="mb-2">mdi-account-off</v-icon>
                          <div>尚無病歷資料</div>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- 右側：護理紀錄內容 -->
            <v-col cols="12" md="8" class="nursing-main-content">
              <v-card rounded="0" elevation="0" class="h-100">
                <v-card-title class="d-flex flex-column ga-3 pa-4" style="border-bottom: 1px solid rgba(0,0,0,0.12);">
                  <div class="d-flex align-center ga-2">
                    <v-icon color="primary">mdi-filter</v-icon>
                    <span class="text-subtitle-1 font-weight-bold contentfontColor">時間範圍</span>
                  </div>
                  <div class="d-flex flex-wrap align-center ga-3">
                    <div class="d-flex flex-wrap align-center ga-2">
                      <v-text-field
                        label="開始日期"
                        type="date"
                        v-model="start_day"
                        hide-details
                        variant="outlined"
                        density="compact"
                        style="max-width: 170px;"
                      ></v-text-field>
                      <v-text-field
                        label="開始時間"
                        type="time"
                        v-model="start_time"
                        hide-details
                        variant="outlined"
                        density="compact"
                        style="max-width: 140px;"
                      ></v-text-field>
                    </div>
                    <v-icon color="primary">mdi-arrow-right</v-icon>
                    <div class="d-flex flex-wrap align-center ga-2">
                      <v-text-field
                        label="結束日期"
                        type="date"
                        v-model="end_day"
                        hide-details
                        variant="outlined"
                        density="compact"
                        style="max-width: 170px;"
                      ></v-text-field>
                      <v-text-field
                        label="結束時間"
                        type="time"
                        v-model="end_time"
                        hide-details
                        variant="outlined"
                        density="compact"
                        style="max-width: 140px;"
                      ></v-text-field>
                    </div>
                  </div>
                </v-card-title>

                <v-card-text class="pa-4" style="max-height: calc(100vh - 200px); overflow-y: auto;">
                  <div class="d-flex align-center justify-space-between mb-4">
                    <div class="d-flex align-center ga-2">
                      <v-icon color="primary" size="24">mdi-clipboard-text</v-icon>
                      <h3 class="text-h6 font-weight-bold mb-0 contentfontColor">護理紀錄內容</h3>
                      <v-chip v-if="selectUser.name" size="small" variant="tonal" color="primary">
                        {{ selectUser.name }}
                      </v-chip>
                    </div>
                    <v-chip v-if="filterNursingRecordStartEnd().length > 0" size="small" variant="flat" color="primary">
                      共 {{ filterNursingRecordStartEnd().length }} 筆紀錄
                    </v-chip>
                  </div>

                  <v-divider class="mb-4"></v-divider>

                  <!-- 空狀態 -->
                  <div v-if="!selectUser.name" class="text-center py-12">
                    <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-account-question</v-icon>
                    <p class="text-h6 text-medium-emphasis mb-2">請選擇病歷</p>
                    <p class="text-body-2 text-medium-emphasis">從左側列表選擇病歷以查看護理紀錄</p>
                  </div>

                  <!-- 無資料狀態 -->
                  <div v-else-if="filterNursingRecordStartEnd().length === 0" class="text-center py-12">
                    <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-clipboard-text-off</v-icon>
                    <p class="text-h6 text-medium-emphasis mb-2">尚無護理紀錄資料</p>
                    <p class="text-body-2 text-medium-emphasis">
                      {{ start_day && end_day ? '此時間範圍內' : '' }}尚無 {{ selectUser.name }} 的護理紀錄
                    </p>
                  </div>

                  <!-- 護理紀錄列表 -->
                  <div v-else class="nursing-records-list">
                    <v-card
                      v-for="(item, index) in filterNursingRecordStartEnd()"
                      :key="index"
                      :class="['nursing-record-card', 'mb-4', { 'focus-record': item.focus == 'true' }]"
                      rounded="lg"
                      elevation="2"
                      :color="item.focus == 'true' ? 'error-lighten-5' : undefined"
                    >
                      <v-card-title class="d-flex align-center justify-space-between pa-4" :class="item.focus == 'true' ? 'error-lighten-4' : 'primary-lighten-5'">
                        <div class="d-flex align-center ga-3">
                          <v-avatar size="40" :color="item.focus == 'true' ? 'error' : 'primary'" variant="tonal">
                            <v-icon :color="item.focus == 'true' ? 'error' : 'primary'">mdi-calendar-clock</v-icon>
                          </v-avatar>
                          <div>
                            <div class="d-flex align-center ga-2">
                              <span class="text-subtitle-1 font-weight-bold">{{ item.date }}</span>
                              <v-chip size="x-small" variant="flat" :color="item.focus == 'true' ? 'error' : 'primary'">
                                {{ item.time }}
                              </v-chip>
                              <v-chip v-if="item.focus == 'true'" size="x-small" variant="flat" color="error" prepend-icon="mdi-alert">
                                重點紀錄
                              </v-chip>
                            </div>
                          </div>
                        </div>
                      </v-card-title>

                      <v-divider></v-divider>

                      <v-card-text class="pa-4">
                        <div class="nursing-record-content" style="white-space: pre-wrap; line-height: 1.8;">
                          {{ item.nursingrecord_content }}
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { useStore } from '@/stores/useStore'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'

const { proxy } = getCurrentInstance()
const store = useStore()

// 響應式數據
const dialog = ref(false)
const title = ref('')
const titleClass = ref('')
const userItems = ref([])
const serachKey = ref('')
const model = ref(null)
const selectUser = ref({})
const nursingrecordItems = ref([])
const matchNursingRecord = ref([])
const start_day = ref('')
const end_day = ref('')
const start_time = ref('')
const end_time = ref('')
const isShowAll = ref(false)

// 計算屬性
const filterUser = computed(() => {
  const keys = serachKey.value.split(' ')
  let str = ''

  return keys.reduce((prev, element) => {
    return prev.filter((item) => {
      str = JSON.stringify(item).toUpperCase()
      if (str.includes(element.toUpperCase())) {
        return item
      }
    })
  }, userItems.value)
})

// 監聽 selectUser 變化
watch(selectUser, (newVal) => {
  if (Object.keys(newVal).length > 0 && newVal.snkey) {
    matchNursingRecord.value = nursingrecordItems.value.filter((i) => {
      // 檢查是否有 u_snkey 欄位（舊資料）或直接比對 snkey
      return (i.u_snkey == newVal.snkey) || (i.snkey && i.snkey == newVal.snkey)
    })
  } else {
    matchNursingRecord.value = []
  }
}, { deep: true })

// 方法
const enterProcess = (item) => {
  title.value = '護理紀錄一覽'
  titleClass.value = 'font-weight-black primary text-white'
}

// 取得所有病歷資料
const getUserData = async () => {
  try {
    const rs = await api.get('user')
    userItems.value = rs.map((i) => {
      return {
        ...JSON.parse(i.datalist),
        snkey: i.snkey,
      }
    })
    // .sort((a, b) => {
    //   const aBed = a.bed_name
    //   const bBed = b.bed_name

    //   if (aBed === bBed) {
    //     return 0
    //   } else if (aBed === null) {
    //     return 1
    //   } else if (bBed === null) {
    //     return -1
    //   } else {
    //     return aBed > bBed ? 1 : -1
    //   }
    // })
  } catch (error) {
    console.error('取得病歷資料失敗:', error)
  }
}

// 取得所有護理紀錄;2023.8.18 調整為90日內的資料
const getNursingRecordData = async () => {
  try {
    const postData = {
      key: "date",
      start: dayjs().subtract(90, 'day').format('YYYY-MM-DD'),
      end: dayjs().format('YYYY-MM-DD')
    }
    const url = `byjson/getZoneData/${store.state.databaseName}/nursingrecord`
    const rs = await api.options(url, postData)
    console.log('rs', rs)

    let newData = rs.map((i) => {
      const newItem = JSON.parse(i.datalist)
      newItem.snkey = i.snkey
      // 保留 u_snkey 以確保與病歷的關聯（如果資料中有）
      if (i.u_snkey) {
        newItem.u_snkey = i.u_snkey
      }
      return newItem
    })

    newData = newData.sort((a, b) => {
      return a.date > b.date ? 1 : -1
    })
    nursingrecordItems.value = newData.sort((a, b) => {
      if (a.date == b.date) {
        return a.time > b.time ? 1 : -1
      }
      return 0
    })

    isShowAll.value = false
  } catch (error) {
    console.error('取得護理紀錄資料失敗:', error)
  }
}

// 載入所有資料
const importAllNursingRecordData = async () => {
  try {
    const result = await proxy.$swal({
      title: '確認載入全部資料？',
      text: '此操作將載入所有護理紀錄資料，可能需要較長時間。',
      icon: 'question',
      toast: false,
      timer: null,
      showConfirmButton: true,
      showCancelButton: true,
      position: 'center'
    })

    if (result.isConfirmed) {
      const rs = await api.get('nursingrecord')
      let newData = rs.map((i) => {
        const newItem = JSON.parse(i.datalist)
        newItem.snkey = i.snkey
        // 保留 u_snkey 以確保與病歷的關聯（如果資料中有）
        if (i.u_snkey) {
          newItem.u_snkey = i.u_snkey
        }
        return newItem
      })

      newData = newData.sort((a, b) => {
        return a.date > b.date ? 1 : -1
      })
      nursingrecordItems.value = newData.sort((a, b) => {
        if (a.date == b.date) {
          return a.time > b.time ? 1 : -1
        }
        return 0
      })

      isShowAll.value = true
    }
  } catch (error) {
    console.error('載入所有資料失敗:', error)
  }
}

// 選出符合指定時間的護理紀錄
const filterNursingRecordStartEnd = () => {
  if (
    start_day.value != '' &&
    end_day.value != '' &&
    start_time.value != '' &&
    end_time.value != ''
  ) {
    return matchNursingRecord.value.filter((i) => {
      return (
        dayjs(`${start_day.value} ${start_time.value}`).unix() <=
          dayjs(`${i.date} ${i.time}`).unix() &&
        dayjs(`${end_day.value} ${end_time.value}`).unix() >=
          dayjs(`${i.date} ${i.time}`).unix()
      )
    })
  } else {
    return matchNursingRecord.value
  }
}

// 生命週期
onMounted(() => {
  getUserData()
  getNursingRecordData()
})

// 暴露方法供父組件調用
defineExpose({
  enterProcess
})
</script>

<style scoped>
.contentfontColor {
  color: var(--daycare-primary);
}

.nursing-record-dialog {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.nursing-header {
  flex-shrink: 0;
}

.nursing-content-row {
  height: calc(100vh - 80px);
  overflow: hidden;
}

.nursing-sidebar {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.nursing-main-content {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.nursing-user-list {
  flex: 1;
  overflow: hidden;
}

.nursing-records-list {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nursing-record-card {
  transition: all 0.3s ease;
}

.nursing-record-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.focus-record {
  border-left: 4px solid rgb(var(--v-theme-error));
}

.nursing-record-content {
  font-size: 0.95rem;
  color: rgba(0, 0, 0, 0.87);
  line-height: 1.8;
}

/* 自定義滾動條樣式 */
.nursing-user-list :deep(.v-list)::-webkit-scrollbar,
.nursing-main-content :deep(.v-card-text)::-webkit-scrollbar {
  width: 8px;
}

.nursing-user-list :deep(.v-list)::-webkit-scrollbar-track,
.nursing-main-content :deep(.v-card-text)::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.nursing-user-list :deep(.v-list)::-webkit-scrollbar-thumb,
.nursing-main-content :deep(.v-card-text)::-webkit-scrollbar-thumb {
  background: var(--daycare-secondary);
  border-radius: 4px;
}

.nursing-user-list :deep(.v-list)::-webkit-scrollbar-thumb:hover,
.nursing-main-content :deep(.v-card-text)::-webkit-scrollbar-thumb:hover {
  background: var(--daycare-primary);
}
</style>