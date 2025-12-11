<template>
  <div class="handoverlist">
    <NursingPlanList class="slideBtn"></NursingPlanList>

    <!-- 標題區域 -->
    <v-sheet color="primary" class="d-flex align-center justify-space-between px-6 py-4 mb-4 handover-header" rounded="lg"
      elevation="2">
      <div class="d-flex align-center">
        <v-avatar size="48" color="white" variant="tonal" class="mr-4">
          <v-icon color="white" size="28">mdi-text-box-outline</v-icon>
        </v-avatar>
        <div>
          <h2 class="text-h6 font-weight-bold mb-1 text-white">交班表</h2>
          <p class="text-body-2 mb-0 text-white text-opacity-90">記錄與追蹤交班資訊</p>
        </div>
      </div>
      <v-chip :color="isShowAll ? 'white' : 'success'" variant="flat" size="large" prepend-icon="mdi-calendar-range">
        {{ isShowAll ? '全部資料' : '30日內資料' }}
      </v-chip>
    </v-sheet>

    <!-- 操作區域 -->
    <v-card rounded="xl" elevation="2" class="mb-4">
      <v-card-title class="d-flex flex-wrap align-center ga-3 pa-4">
        <v-btn color="primary" variant="flat" prepend-icon="mdi-download" @click="importAllData">
          載入所有資料
        </v-btn>
        <v-text-field hide-details prepend-inner-icon="mdi-magnify" label="搜尋" v-model="serachKey" variant="outlined"
          density="comfortable" style="max-width: 300px;"></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus-circle" @click="openForAdd">
          新增交班表
        </v-btn>
        <popupadd @finishAdd="finishAdd" @finishEdit="finishEdit" ref="enterEditRef"></popupadd>
      </v-card-title>
    </v-card>

    <!-- 交班記錄列表 -->
    <PaginatedIterator :items="searchfilter" v-model:page="currentPage" v-model:items-per-page="itemsPerPage"
      :items-per-page-options="itemsPerPageOptions">
      <template #default="{ items }">
        <div class="handover-records">
          <v-card v-for="(item, index) in items" :key="index" class="handover-record-card mb-4" rounded="lg"
            elevation="2">
            <!-- 卡片標題：日期時間和操作按鈕 -->
            <v-card-title :class="['handover-card-header', 'd-flex', 'align-center', 'justify-space-between', 'pa-4', { 'today-header': isToday(item.raw.date) }]">
              <div class="d-flex align-center">
                <v-icon class="mr-3" :color="isToday(item.raw.date) ? 'primary' : 'primary'" size="24">mdi-calendar-clock</v-icon>
                <div>
                  <div class="d-flex align-center ga-2">
                    <div :class="isToday(item.raw.date) ? 'text-subtitle-1 font-weight-bold text-primary' : 'text-subtitle-1 font-weight-bold'">
                      {{ formatDateTime(item.raw.date, item.raw.time) }}
                    </div>
                    <v-chip v-if="isToday(item.raw.date)" size="small" color="primary" variant="flat" prepend-icon="mdi-star">
                      今天
                    </v-chip>
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    <v-icon size="14" class="mr-1">mdi-account</v-icon>
                    紀錄人: {{ item.raw.createInfo?.name || '—' }}({{ item.raw.createInfo?.time || '—' }})
                  </div>
                </div>
              </div>
              <div class="d-flex align-center ga-2">
                <v-btn icon variant="text" color="primary" size="small" @click="enterEdit(item.raw)"
                  v-if="checkEdit(item.raw)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon variant="text" color="error" size="small" @click="enterDel(item.raw)"
                  v-if="checkEdit(item.raw)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <!-- 卡片內容 -->
            <v-card-text class="pa-4">
              <!-- 交班內容 -->
              <div class="handover-section mb-4">
                <div class="d-flex justify-space-between align-center mb-3">
                  <div class="d-flex align-center">
                    <v-icon class="mr-2" color="primary">mdi-clipboard-text</v-icon>
                    <h3 class="text-subtitle-1 font-weight-bold mb-0">交班內容</h3>
                  </div>
                  <div class="d-flex align-center ga-2">
                    <div v-if="item.raw.checkedList?.length" class="text-caption">
                      <span class="text-medium-emphasis">已簽核人員：</span>
                      <template v-for="(user, idx) in item.raw.checkedList" :key="idx">
                        <v-chip v-if="user.type == 'user'" size="small" variant="tonal" color="success" class="ml-1">
                          {{ user.name }}({{ user.time }})
                        </v-chip>
                      </template>
                    </div>
                    <v-btn v-if="!isChecked(item.raw.checkedList, 'user')" size="small" color="primary"
                      variant="tonal" prepend-icon="mdi-check" @click="OnDuty(item.raw, 'user')">
                      值班簽核
                    </v-btn>
                  </div>
                </div>
                <v-textarea v-model="item.raw.content" readonly variant="outlined" density="comfortable"
                  rows="6" auto-grow class="handover-textarea"></v-textarea>
              </div>

              <!-- 行政內容 -->
              <div v-if="item.raw.administrativeContent?.length" class="handover-section">
                <div class="d-flex justify-space-between align-center mb-3">
                  <div class="d-flex align-center">
                    <v-icon class="mr-2" color="success">mdi-file-document-edit</v-icon>
                    <h3 class="text-subtitle-1 font-weight-bold mb-0">行政內容</h3>
                  </div>
                  <div class="d-flex align-center ga-2">
                    <div v-if="item.raw.checkedList?.length" class="text-caption">
                      <span class="text-medium-emphasis">已簽核行政：</span>
                      <template v-for="(user, idx) in item.raw.checkedList" :key="idx">
                        <v-chip v-if="user.type == 'administrative'" size="small" variant="tonal" color="success"
                          class="ml-1">
                          {{ user.name }}({{ user.time }})
                        </v-chip>
                      </template>
                    </div>
                    <v-btn v-if="!isChecked(item.raw.checkedList, 'administrative')" size="small"
                      color="primary" variant="tonal" prepend-icon="mdi-check"
                      @click="OnDuty(item.raw, 'administrative')">
                      行政簽核
                    </v-btn>
                  </div>
                </div>
                <v-textarea v-model="item.raw.administrativeContent" readonly variant="outlined"
                  density="comfortable" color="success" rows="4" auto-grow class="handover-textarea"></v-textarea>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </template>
    </PaginatedIterator>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'
import popupadd from '@/views/main/Handover/Add.vue'
import NursingPlanList from '@/views/main/Handover/NursingPlanList.vue'
import PaginatedIterator from '@/components/PaginatedIterator.vue'

const store = useStore()
const { proxy } = getCurrentInstance()

const items = ref([])
const serachKey = ref('')
const isShowAll = ref(false)
const enterEditRef = ref(null)

const currentPage = ref(1)
const itemsPerPage = ref(30)
const itemsPerPageOptions = [
  { value: 10, title: '10' },
  { value: 20, title: '20' },
  { value: 30, title: '30' },
]

// 格式化日期時間顯示
const formatDateTime = (date, time) => {
  if (date && time) {
    return `${date} ${time}`
  } else if (date) {
    return date
  } else if (time) {
    return time
  }
  return ''
}

// 判斷日期是否為今天
const isToday = (date) => {
  if (!date) return false
  const today = dayjs().format('YYYY-MM-DD')
  const recordDate = dayjs(date).format('YYYY-MM-DD')
  return today === recordDate
}

const searchfilter = computed(() => {
  const keys = serachKey.value.split(' ')
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

const isChecked = (checkedList, type) => {
  return checkedList?.some(user =>
    user.type === type && user.name === store.state.pData.username
  )
}

const checkEdit = (item) => {
  if (item.create_man?.includes(store.state.pData.username)) {
    return true
  } else {
    return false
  }
}

const getAllData = async () => {
  try {
    const postData = {
      key: "date",
      start: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
      end: dayjs().format('YYYY-MM-DD')
    }
    const url = `byjson/getZoneData/${store.state.databaseName}/handover`
    const rs = await api.options(url, postData)
    if (!rs || !Array.isArray(rs)) {
      console.warn('getAllData: 返回的數據不是數組', rs)
      items.value = []
      isShowAll.value = false
      return
    }

    const newData = rs.map((i) => ({
      ...JSON.parse(i.datalist),
      snkey: i.snkey,
    }))
    // 排序：先按日期，再按時間
    const datas = newData.sort((a, b) => {
      const dateA = a.date || ''
      const dateB = b.date || ''
      const timeA = a.time || ''
      const timeB = b.time || ''

      if (dateA !== dateB) {
        return dateA < dateB ? 1 : -1
      }
      return timeA < timeB ? 1 : -1
    })

    items.value = datas.map(i => {
      // 處理從 datalist 解析的資料
      let parsedData = i
      if (i.datalist) {
        try {
          parsedData = {
            ...JSON.parse(i.datalist),
            snkey: i.snkey
          }
        } catch (e) {
          console.warn('解析 datalist 失敗:', e)
        }
      }

      return {
        ...parsedData,
        checkedList: typeof parsedData.checkedList === 'string'
          ? JSON.parse(parsedData.checkedList || '[]')
          : (parsedData.checkedList || [])
      }
    })
    isShowAll.value = false
  } catch (error) {
    console.error('getAllData error:', error)
    items.value = []
    store.showToastMulti({
      type: 'error',
      message: '載入交班表資料失敗',
      closeTime: 3,
    })
  }
}

const importAllData = async () => {
  const result = await proxy?.$swal?.({
    title: '確認載入全部資料？',
    text: '將載入所有交班表資料，可能會影響載入速度。',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center'
  })

  if (!result?.isConfirmed) {
    return
  }

  try {
    const rs = await api.get('handover')
    if (!rs || !Array.isArray(rs)) {
      console.warn('importAllData: 返回的數據不是數組', rs)
      items.value = []
      store.showToastMulti({
        type: 'warning',
        message: '載入資料失敗，返回的數據格式不正確',
        closeTime: 3,
      })
      return
    }

    // 處理資料並排序：先按日期，再按時間
    const normalizeRecord = (row) => {
      const parsed = JSON.parse(row.datalist || '{}')
      return {
        ...parsed,
        snkey: row.snkey,
      }
    }

    const normalizedData = rs.map(i => normalizeRecord(i))

    items.value = normalizedData.sort((a, b) => {
      const dateA = a.date || ''
      const dateB = b.date || ''
      const timeA = a.time || ''
      const timeB = b.time || ''

      if (dateA !== dateB) {
        return dateA < dateB ? 1 : -1
      }
      return timeA < timeB ? 1 : -1
    }).map(i => ({
      ...i,
      checkedList: typeof i.checkedList === 'string'
        ? JSON.parse(i.checkedList || '[]')
        : (i.checkedList || [])
    }))

    store.showToastMulti({
      type: 'success',
      message: '已載入',
      closeTime: 2,
    })
    isShowAll.value = true
  } catch (error) {
    console.error('importAllData error:', error)
    items.value = []
    store.showToastMulti({
      type: 'error',
      message: '載入全部資料失敗',
      closeTime: 3,
    })
  }
}

const OnDuty = async (item, type) => {
  const result = await proxy?.$swal?.({
    title: '確認簽核？',
    text: type === 'user' ? '確認進行值班簽核？' : '確認進行行政簽核？',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center'
  })

  if (!result?.isConfirmed) {
    return
  }

  try {
    if (!item.checkedList) {
      item.checkedList = []
    }
    item.checkedList.push({
      name: store.state.pData.username,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      type: type
    })

    const postData = {
      snkey: item.snkey,
      datalist: JSON.stringify(item)
    }

    const rs = await api.post('handover', postData)
    if (rs.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已簽核',
        closeTime: 2,
      })
      getAllData()
    }
  } catch (error) {
    console.error('OnDuty error:', error)
  }
}

const openForAdd = () => {
  if (enterEditRef.value) {
    enterEditRef.value.openForAdd()
  }
}

const enterEdit = (item) => {
  if (enterEditRef.value) {
    enterEditRef.value.openForEdit(item)
  }
}

const finishAdd = async (item) => {
  try {
    item.createInfo = {
      snkey: store.state.pData.snkey,
      name: store.state.pData.username,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

    let postData = {
      datalist: JSON.stringify(item)
    }
    const rs = await api.add('handover', postData)

    if (rs.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已新增',
        closeTime: 2,
      })
      getAllData()
    }
  } catch (error) {
    console.error('finishAdd error:', error)
  }
}

const finishEdit = async (item) => {
  try {
    if (!item.editInfo) {
      item.editInfo = []
    }
    item.editInfo.push({
      name: store.state.pData.username,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss')
    })

    const postData = {
      snkey: item.snkey,
      datalist: JSON.stringify(item)
    }

    const rs = await api.post('handover', postData)
    if (rs.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已修改',
        closeTime: 2,
      })
      getAllData()
    }
  } catch (error) {
    console.error('finishEdit error:', error)
  }
}

const enterDel = async (delData) => {
  const result = await proxy?.$swal?.({
    title: '確認刪除？',
    text: '此操作無法復原，請再次確認。',
    icon: 'warning',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center'
  })

  if (!result?.isConfirmed) {
    return
  }

  try {
    delData.delInfo = {
      name: store.state.pData.username,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }
    const postData = {
      snkey: delData.snkey,
      tablename: 'handover',
      datalist: JSON.stringify(delData),
    }

    const rs = await api.delete('handover', postData)
    if (rs.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已刪除',
        closeTime: 2,
      })
      getAllData()
    }
  } catch (error) {
    console.error('enterDel error:', error)
  }
}

onMounted(() => {
  getAllData()
})
</script>

<style lang="scss">
.handoverlist {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;

  .slideBtn {
    position: fixed;
    left: 10px;
    bottom: 10px;
    z-index: 100;
  }

  .handover-header {
    width: 100%;
  }

  .handover-records {
    width: 100%;
    max-width: 100%;
  }

  .handover-record-card {
    width: 100%;
    max-width: 100%;

    .handover-card-header {
      background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
      border-bottom: 2px solid rgba(var(--v-theme-primary), 0.2);
      
      &.today-header {
        background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.25) 0%, rgba(var(--v-theme-primary), 0.15) 100%);
        border-bottom: 3px solid rgba(var(--v-theme-primary), 0.5);
        box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.2);
      }
    }

    .handover-section {
      .handover-textarea {
        width: 100%;

        :deep(.v-field) {
          width: 100%;
        }

        :deep(.v-field__input) {
          width: 100%;
        }
      }
    }
  }
}
</style>
