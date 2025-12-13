<template>
  <div class="activitylist">
    <v-container fluid class="pa-2">
      <v-row>
        <v-col cols="12">
          <v-sheet class="activitylist__hero" rounded="xl" elevation="0">
            <div class="d-flex flex-column flex-md-row justify-space-between align-start">
              <div class="d-flex align-center mb-4 mb-md-0">
                <v-avatar size="56" class="mr-4 activitylist__avatar">
                  <v-icon size="32" class="activitylist__avatar-icon">mdi-ticket</v-icon>
                </v-avatar>
                <div>
                  <h2 class="activitylist__title mb-1">活動參與紀錄表</h2>
                  <p class="activitylist__subtitle mb-0">
                    記錄活動歷程，支援關鍵字搜尋與日期排序。
                  </p>
                </div>
              </div>
              <div class="d-flex align-center ga-3">
                <v-chip class="activitylist__tag" prepend-icon="mdi-theme-light-dark" variant="outlined" size="small">
                  Daycare Style
                </v-chip>
                <v-btn variant="outlined" class="activitylist__refresh-btn" prepend-icon="mdi-refresh" size="small" @click="fetchAll">
                  重新整理
                </v-btn>
              </div>
            </div>
            <v-divider class="my-4 activitylist__divider" />
            <div class="activitylist__meta d-flex flex-wrap ga-3">
              <v-chip variant="tonal" class="activitylist__chip-primary">
                總記錄筆數：{{ totalCount }}
              </v-chip>
              <v-chip variant="tonal" class="activitylist__chip-secondary">
                搜尋結果：{{ filteredCount }}
              </v-chip>
              <v-chip v-if="latestActivity" variant="text" class="activitylist__chip-accent" prepend-icon="mdi-calendar-clock">
                最新活動：{{ latestActivity.date }} {{ latestActivity.time }}
              </v-chip>
            </div>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row class="mt-4" dense>
        <v-col cols="12" md="4">
          <v-card variant="tonal" rounded="xl" class="activitylist__summary-card activitylist__summary-card--primary">
            <v-icon size="28" class="mb-2 activitylist__summary-icon">mdi-format-list-numbered</v-icon>
            <div class="summary-title">總紀錄筆數</div>
            <div class="summary-value">{{ totalCount }}</div>
            <div class="summary-caption">目前載入的活動參與資料</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card variant="tonal" rounded="xl" class="activitylist__summary-card activitylist__summary-card--secondary">
            <v-icon size="28" class="mb-2 activitylist__summary-icon">mdi-magnify</v-icon>
            <div class="summary-title">搜尋結果</div>
            <div class="summary-value">{{ filteredCount }}</div>
            <div class="summary-caption">符合條件的顯示筆數</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card variant="tonal" rounded="xl" class="activitylist__summary-card activitylist__summary-card--accent">
            <v-icon size="28" class="mb-2 activitylist__summary-icon">mdi-calendar-star</v-icon>
            <div class="summary-title">最新活動</div>
            <div class="summary-value summary-value--note">
              {{ latestActivity?.name || '尚無活動記錄' }}
            </div>
            <div class="summary-caption">最近一次的活動名稱</div>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-sheet class="activitylist__toolbar" rounded="xl" elevation="0">
            <v-row align="center" no-gutters>
              <v-col cols="12" md="6">
                <v-text-field v-model="searchKey" variant="outlined" density="comfortable" class="pr-md-4"
                  prepend-inner-icon="mdi-magnify" label="搜尋關鍵字" hide-details inset />
              </v-col>
              <v-col cols="12" md="6" class="d-flex justify-end ga-2 mt-3 mt-md-0">
                <v-btn variant="tonal" class="activitylist__btn-print" prepend-icon="mdi-printer" @click="printAll">
                  匯出列印
                </v-btn>
                <v-btn variant="flat" class="activitylist__btn-add" prepend-icon="mdi-plus-circle" @click="openAdd">
                  新增紀錄
                </v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col cols="12">
          <v-alert v-if="!filteredCount" type="info" variant="tonal" border="start" color="primary" class="mb-4">
            目前沒有符合搜尋條件的資料，可調整搜尋關鍵字或新增紀錄。
          </v-alert>

          <PaginatedIterator v-if="filteredCount" :items="filteredItems" v-model:items-per-page="itemsPerPage"
            :items-per-page-options="itemsPerPageOptions">
            <template #default="{ items }">
              <v-card class="activitylist__table-card" rounded="xl" variant="outlined">
                <v-card-title class="d-flex align-center">
                  <div class="text-subtitle-1 font-weight-bold">顯示筆數：{{ filteredCount }}</div>
                  <v-spacer></v-spacer>
                  <v-chip size="small" variant="tonal" class="activitylist__sort-chip" prepend-icon="mdi-calendar">
                    依日期由新到舊排序
                  </v-chip>
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-0">
                  <v-table class="activitylist__table text-no-wrap" fixed-header>
                    <thead>
                      <tr>
                        <th class="text-center" style="width: 80px;">操作</th>
                        <th>活動名稱</th>
                        <th>日期</th>
                        <th>時間</th>
                        <th>目標</th>
                        <th>地點</th>
                        <th>器具設備</th>
                        <th>帶領者</th>
                        <th>協助者</th>
                        <th>活動說明</th>
                        <th>活動檢討與建議</th>
                        <th v-if="showCreaterName">紀錄人姓名</th>
                        <th v-if="showCreaterInfo">紀錄詳細資訊</th>
                        <th v-if="showEditerInfo">編輯詳細資訊</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="({ raw }, index) in items" :key="raw?.snkey ?? index">
                        <td class="text-center">
                          <v-menu location="bottom">
                            <template #activator="{ props }">
                              <v-btn v-bind="props" variant="text" icon="mdi-dots-vertical" class="activitylist__menu-btn" />
                            </template>
                            <v-list>
                              <v-list-item @click="openEdit(raw)">
                                <template #prepend>
                                  <v-icon color="primary">mdi-square-edit-outline</v-icon>
                                </template>
                                <v-list-item-title>修改</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="askDelete(raw)">
                                <template #prepend>
                                  <v-icon color="error">mdi-delete-outline</v-icon>
                                </template>
                                <v-list-item-title>刪除</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="handlePrint(raw)">
                                <template #prepend>
                                  <v-icon color="info">mdi-printer</v-icon>
                                </template>
                                <v-list-item-title>列印</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </td>
                        <td>{{ raw?.name }}</td>
                        <td>{{ raw?.date }}</td>
                        <td>{{ raw?.time }}</td>
                        <td>{{ raw?.target }}</td>
                        <td>{{ raw?.location }}</td>
                        <td>{{ raw?.device }}</td>
                        <td>{{ raw?.leader }}</td>
                        <td>{{ raw?.helper }}</td>
                        <td class="text-truncate" style="max-width: 200px;">{{ raw?.explanation }}</td>
                        <td class="text-truncate" style="max-width: 200px;">{{ raw?.suggest }}</td>
                        <td v-if="showCreaterName">{{ (raw?.createInfo?.name || '').split('(')[0] }}</td>
                        <td v-if="showCreaterInfo">{{ raw?.createInfo?.name }} ({{ raw?.createInfo?.time }})</td>
                        <td v-if="showEditerInfo" class="text-truncate" style="max-width: 240px;">
                          <div v-if="raw?.editInfo" class="text-truncate" style="max-width: 400px">
                            <span v-for="(i, index) in raw.editInfo" :key="index">
                              {{ `${i.name}(${i.time})` }}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-card-text>
              </v-card>
            </template>
          </PaginatedIterator>
        </v-col>
      </v-row>
    </v-container>

    <PopupAdd ref="popupRef" @finish-add="handleAdd" @finish-edit="handleEdit" @refresh="handleRefresh" />
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'
import PaginatedIterator from '@/components/PaginatedIterator.vue'
import PopupAdd from './Add.vue'

const store = useStore()
const router = useRouter()
const { proxy } = getCurrentInstance()

const popupRef = ref(null)

const allItems = ref([])
const searchKey = ref('')
const itemsPerPage = ref(10)
const itemsPerPageOptions = [
  { value: 5, title: '5' },
  { value: 10, title: '10' },
  { value: 20, title: '20' },
  { value: 30, title: '30' },
]

const showCreaterName = computed(() => store.state.cData?.isShowCreaterName)
const showCreaterInfo = computed(() => store.state.cData?.isShowCreaterInfo)
const showEditerInfo = computed(() => store.state.cData?.isShowEditerInfo)

const keywordTokens = computed(() => {
  if (!searchKey.value) return []
  return searchKey.value
    .split(' ')
    .map((token) => token.trim())
    .filter(Boolean)
})

const filteredItems = computed(() => {
  if (!keywordTokens.value.length) return allItems.value

  return allItems.value.filter((item) => {
    const content = JSON.stringify(item).toUpperCase()
    return keywordTokens.value.every((token) => content.includes(token.toUpperCase()))
  })
})

const totalCount = computed(() => allItems.value.length)
const filteredCount = computed(() => filteredItems.value.length)
const latestActivity = computed(() => allItems.value[0] ?? null)

const sortItems = (data) => {
  if (!Array.isArray(data)) return []

  return [...data]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .sort((a, b) => {
      if (a.date === b.date) {
        return a.time < b.time ? 1 : -1
      }
      return 0
    })
}

const fetchAll = async () => {
  try {
    const rs = await api.get('activity')
    if (Array.isArray(rs)) {
      const data = rs.map((row) => {
        const parsed = JSON.parse(row.datalist || '{}')
        return { ...parsed, snkey: row.snkey }
      })
      allItems.value = sortItems(data)
    }
  } catch (error) {
    console.error('取得資料失敗:', error)
    store.showToastMulti({
      type: 'error',
      message: '取得資料失敗，請稍後再試',
      closeTime: 3,
    })
  }
}

const openAdd = () => {
  popupRef.value?.openAdd()
}

const openEdit = (item) => {
  popupRef.value?.openEdit(item)
}

const handleAdd = async (item) => {
  const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const payload = {
    ...item,
    createInfo: {
      snkey: store.state.pData.snkey,
      name: store.state.pData.username,
      time: timeNow
    }
  }
  const postData = { datalist: JSON.stringify(payload) }
  const rs = await api.add('activity', postData)
  if (rs.state == 1) {
    store.showToastMulti({
      type: 'success',
      message: '活動參與紀錄已建立',
      closeTime: 2,
    })
    // 確保資料刷新
    await fetchAll()
  } else {
    store.showToastMulti({
      type: 'error',
      message: '新增失敗，請稍後再試',
      closeTime: 3,
    })
  }
}

const handleRefresh = () => {
  fetchAll()
}

const handleEdit = async (item) => {
  const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const payload = { ...item }
  if (!Array.isArray(payload.editInfo)) {
    payload.editInfo = []
  }
  payload.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: timeNow
  })
  const postData = {
    snkey: payload.snkey,
    datalist: JSON.stringify(payload),
    updateTime: timeNow
  }
  const rs = await api.post('activity', postData)
  if (rs.state == 1) {
    store.showToastMulti({
      type: 'success',
      message: '已更新活動參與紀錄',
      closeTime: 2,
    })
    await fetchAll()
  }
}

const askDelete = (target) => {
  proxy.$swal({
    title: '確認要刪除這筆紀錄嗎？',
    text: '將連同相關圖片一併刪除，此操作無法復原，請再次確認。',
    icon: 'warning',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center'
  }).then(async (result) => {
    if (!result.isConfirmed) return

    //刪除圖片
    if (target.picItems.length) {
      let picNames = target.picItems.map(i => i.picName)
      let delResult = await api.delFileMulti('activity', picNames)
    }

    const postData = {
      snkey: target.snkey,
      tablename: 'activity',
      datalist: JSON.stringify({
        ...target,
        delInfo: {
          snkey: store.state.pData.snkey,
          name: store.state.pData.username,
          time: dayjs().format('YYYY-MM-DD HH:mm:ss')
        },
      }),
    }

    let rs = await api.delete('activity', postData)
    
    if (rs.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '活動參與紀錄已刪除',
        closeTime: 2,
      })
      await fetchAll()
    } else {
      store.showToastMulti({
        type: 'error',
        message: '刪除失敗，請稍後再試',
        closeTime: 3,
      })
    }
  })
}

const handlePrint = (item) => {
  const routeData = router.resolve({
    name: 'ActivityPrint',
    query: { data: JSON.stringify(item) },
  })
  window.open(routeData.href, '_blank')
}

const printAll = () => {
  if (!filteredCount.value) {
    store.showToastMulti({
      type: 'warning',
      message: '目前沒有可列印的資料。',
      closeTime: 2,
    })
    return
  }

  const printTarget = filteredItems.value
  const tableRows = printTarget
    .map((item) => {
      return `
        <tr>
          <td>${item.name || ''}</td>
          <td>${item.date || ''}</td>
          <td>${item.time || ''}</td>
          <td>${item.target || ''}</td>
          <td>${item.location || ''}</td>
          <td>${item.device || ''}</td>
          <td>${item.leader || ''}</td>
          <td>${item.helper || ''}</td>
          <td>${item.explanation || ''}</td>
          <td>${item.suggest || ''}</td>
        </tr>
      `
    })
    .join('')

  const html = `
    <!DOCTYPE html>
    <html lang="zh-TW">
      <head>
        <meta charset="utf-8" />
        <title>活動參與紀錄表 - 列印</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; color: #2d3a3a; }
          h1 { margin-bottom: 4px; color: #f57c00; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; }
          th, td { border: 1px solid #cddbd6; padding: 6px 8px; font-size: 13px; }
          th { background-color: #fff3e0; text-align: left; }
          tr:nth-child(even) td { background-color: #f7faf8; }
        </style>
      </head>
      <body>
        <h1>活動參與紀錄表</h1>
        <table>
          <thead>
            <tr>
              <th>活動名稱</th>
              <th>日期</th>
              <th>時間</th>
              <th>目標</th>
              <th>地點</th>
              <th>器具設備</th>
              <th>帶領者</th>
              <th>協助者</th>
              <th>活動說明</th>
              <th>活動檢討與建議</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    store.showToastMulti({
      type: 'error',
      message: '瀏覽器阻擋了列印視窗，請允許彈出視窗後再試一次。',
      closeTime: 4,
    })
    return
  }

  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 300)
}


onMounted(() => {
  fetchAll()
})
</script>

<style scoped lang="scss">
.activitylist__hero {
  padding: 24px 28px;
  background: linear-gradient(135deg, rgba(168, 197, 181, 0.16), rgba(107, 154, 138, 0.12));
  border: 1px solid var(--daycare-divider-light);
}

.activitylist__avatar {
  background-color: var(--daycare-primary) !important;
  
  .activitylist__avatar-icon {
    color: #FFFFFF !important;
  }
}

.activitylist__title {
  font-size: 1.6rem;
  color: var(--daycare-primary);
}

.activitylist__subtitle {
  color: var(--daycare-secondary);
}

.activitylist__tag {
  border-color: var(--daycare-divider);
  color: var(--daycare-primary);
}

.activitylist__refresh-btn {
  border-color: var(--daycare-divider) !important;
  color: var(--daycare-primary) !important;
  
  &:hover {
    background-color: rgba(74, 107, 95, 0.08) !important;
  }
}

.activitylist__divider {
  border-color: var(--daycare-divider) !important;
}

.activitylist__chip-primary {
  background-color: rgba(74, 107, 95, 0.12) !important;
  color: var(--daycare-primary) !important;
}

.activitylist__chip-secondary {
  background-color: rgba(107, 154, 138, 0.12) !important;
  color: var(--daycare-secondary) !important;
}

.activitylist__chip-accent {
  color: var(--daycare-accent) !important;
}

.activitylist__meta {
  gap: 12px;
}

.activitylist__summary-card {
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px var(--daycare-shadow);
  }

  &--primary {
    background-color: rgba(74, 107, 95, 0.08) !important;
    color: var(--daycare-primary);
  }

  &--secondary {
    background-color: rgba(107, 154, 138, 0.08) !important;
    color: var(--daycare-secondary);
  }

  &--accent {
    background-color: rgba(123, 163, 184, 0.08) !important;
    color: var(--daycare-accent);
  }

  .activitylist__summary-icon {
    color: inherit;
  }

  .summary-title {
    font-size: 0.95rem;
    margin-bottom: 8px;
    opacity: 0.85;
  }

  .summary-value {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 6px;
    color: inherit;

    &--note {
      font-size: 1.1rem;
      font-weight: 600;
      min-height: 40px;
    }
  }

  .summary-caption {
    font-size: 0.8rem;
    opacity: 0.7;
  }
}

.activitylist__toolbar {
  padding: 18px 24px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--daycare-divider-light);
  box-shadow: 0 16px 32px var(--daycare-shadow-light);
}

.activitylist__btn-print {
  background-color: rgba(123, 163, 184, 0.12) !important;
  color: var(--daycare-accent) !important;
  
  &:hover {
    background-color: rgba(123, 163, 184, 0.2) !important;
  }
}

.activitylist__btn-add {
  background-color: var(--daycare-button) !important;
  color: #FFFFFF !important;
  
  &:hover {
    background-color: var(--daycare-primary) !important;
    box-shadow: 0 4px 12px var(--daycare-btn-hover-shadow) !important;
  }
}

.activitylist__sort-chip {
  background-color: rgba(74, 107, 95, 0.12) !important;
  color: var(--daycare-primary) !important;
}

.activitylist__menu-btn {
  color: var(--daycare-primary) !important;
  
  &:hover {
    background-color: rgba(74, 107, 95, 0.08) !important;
  }
}

.activitylist__table-card {
  border-color: var(--daycare-divider);
  box-shadow: 0 20px 40px var(--daycare-shadow-light);
}

.activitylist__table {
  thead {
    background-color: rgba(168, 197, 181, 0.18);

    th {
      font-weight: 600;
      color: var(--daycare-primary);
      white-space: nowrap;
    }
  }

  tbody tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.6);
  }

  tbody tr:hover {
    background-color: rgba(168, 197, 181, 0.12);
  }
}
</style>