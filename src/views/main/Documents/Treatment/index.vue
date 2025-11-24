<template>
  <div class="treatment">
    <TreatmentAddDialog ref="addDialogRef" @refresh="fetchRecords" />

    <v-container fluid class="pa-0">
        <v-row>
        <v-col cols="12">
          <v-sheet class="treatment__hero" rounded="xl" elevation="0">
            <div class="d-flex flex-column flex-md-row justify-space-between align-start">
              <div class="d-flex align-center mb-4 mb-md-0">
                <v-avatar size="56" color="primary" variant="tonal" class="mr-4">
                  <v-icon color="primary" size="32">mdi-file-document-edit</v-icon>
                </v-avatar>
                <div>
                  <h2 class="treatment__title mb-1">個案服務處遇計畫表</h2>
                  <p class="treatment__subtitle mb-0">
                    記錄個案的服務處遇計畫，包含基本資料、社會心理功能診斷分析、個案處遇計畫等。
                  </p>
                </div>
              </div>

              <div class="d-flex align-center ga-2">
                <v-btn color="primary" variant="flat" prepend-icon="mdi-plus-circle" :disabled="!hasUser"
                  @click="openAddDialog">
                  新增計畫
                </v-btn>
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="treatment__meta d-flex flex-wrap ga-3">
              <v-chip variant="tonal" color="primary">
                住民：{{ residentName }}
              </v-chip>
              <v-chip variant="tonal" color="secondary">
                住編：{{ residentCode }}
              </v-chip>
              <v-chip variant="text" color="primary" prepend-icon="mdi-format-list-bulleted-type">
                總筆數：{{ totalCount }}
              </v-chip>
              <v-chip v-if="latestRecord" variant="text" color="teal" prepend-icon="mdi-calendar-clock">
                最新計畫：{{ formatDate(latestRecord.raw?.date) }}
              </v-chip>
            </div>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row class="mt-4" dense>
        <v-col cols="12" md="4">
          <v-card variant="tonal" color="primary" rounded="xl" class="treatment__summary-card">
            <v-icon size="28" class="mb-2">mdi-format-list-numbered</v-icon>
            <div class="summary-title">總計畫筆數</div>
            <div class="summary-value">{{ totalCount }}</div>
            <div class="summary-caption">目前載入的計畫資料</div>
          </v-card>
          </v-col>
          <v-col cols="12" md="4">
          <v-card variant="tonal" color="info" rounded="xl" class="treatment__summary-card">
            <v-icon size="28" class="mb-2">mdi-magnify</v-icon>
            <div class="summary-title">搜尋結果</div>
            <div class="summary-value">{{ filteredCount }}</div>
            <div class="summary-caption">符合條件的顯示筆數</div>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-sheet class="treatment__toolbar" rounded="xl" elevation="0">
            <v-row align="center" no-gutters>
              <v-col cols="12" md="6">
                <v-text-field v-model="searchKey" variant="outlined" density="comfortable" class="pr-md-4"
                  prepend-inner-icon="mdi-magnify" label="搜尋關鍵字（日期、致障原因、服務目標等）" hide-details inset />
              </v-col>
              <v-col cols="12" md="6" class="d-flex justify-end ga-2 mt-3 mt-md-0 flex-wrap">
                <v-chip v-for="token in searchTokens" :key="token" color="primary" variant="tonal" size="small"
                  prepend-icon="mdi-pound">
                  {{ token }}
                </v-chip>
              </v-col>
            </v-row>
          </v-sheet>
          </v-col>
        </v-row>

      <v-row class="mt-2">
        <v-col cols="12">
          <v-alert v-if="!hasUser" type="warning" variant="tonal" border="start" color="warning" class="mb-4"
            icon="mdi-account-search">
            尚未選擇住民，請先至住民清單選擇後再維護個案服務處遇計畫資料。
          </v-alert>

          <v-alert v-else-if="hasUser && !filteredCount" type="info" variant="tonal" border="start" color="primary"
            class="mb-4" icon="mdi-information-outline">
            目前沒有符合搜尋條件的資料，可調整搜尋條件或新增個案服務處遇計畫。
          </v-alert>

          <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

          <PaginatedIterator v-if="filteredCount" :items="filteredItems" v-model:items-per-page="itemsPerPage"
            :items-per-page-options="itemsPerPageOptions">
            <template #default="{ items }">
              <v-card class="treatment__table-card" rounded="xl" variant="outlined">
                <v-card-title class="d-flex align-center">
                  <div class="text-subtitle-1 font-weight-bold">顯示筆數：{{ filteredCount }}</div>
                  <v-spacer />
                  <v-chip size="small" variant="tonal" color="primary" prepend-icon="mdi-calendar-range">
                    依日期由新到舊排序
                  </v-chip>
      </v-card-title>
                <v-divider />
                <v-card-text class="pa-0">
                  <v-table class="text-no-wrap" fixed-header>
                    <thead>
                      <tr>
                        <th style="width: 80px;" class="text-center">操作</th>
                        <th style="width: 120px;">評估日期</th>
                        <th style="width: 120px;">致障原因</th>
                        <th style="width: 120px;">生活自理能力</th>
                        <th style="width: 120px;">經濟來源</th>
                        <th style="width: 120px;">家庭支持功能</th>
                        <th style="width: 200px;">服務對象問題及需求</th>
                        <th style="width: 200px;">服務目標</th>
                        <th style="width: 200px;">服務策略-執行方法</th>
                        <th style="width: 200px;">服務策略-服務資源</th>
                        <th style="width: 150px;">服務策略-執行期程</th>
                        <th style="width: 120px;">服務策略-執行者</th>
                        <th style="width: 200px;">評值</th>
                        <th v-if="canShowCreatorName" style="width: 160px;">紀錄人姓名</th>
                        <th v-if="canShowCreatorInfo" style="width: 220px;">紀錄人紀錄</th>
                        <th v-if="canShowEditorInfo" style="width: 220px;">修改紀錄</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(record, index) in items"
                        :key="record.snkey || record.raw?.snkey || `treatment-${index}`">
                        <td class="text-center">
                          <v-menu v-if="hasUser" location="bottom">
                            <template #activator="{ props }">
                              <v-btn v-bind="props" variant="text" icon="mdi-dots-vertical" color="primary" />
                            </template>
                            <v-list density="compact">
                              <v-list-item @click="openEdit(record.raw)">
                                <template #prepend>
                                  <v-icon color="primary">mdi-square-edit-outline</v-icon>
                                </template>
                                <v-list-item-title>修改</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="askDelete(record.raw)">
                                <template #prepend>
                                  <v-icon color="error">mdi-delete-outline</v-icon>
                                </template>
                                <v-list-item-title>刪除</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="openPrint(record.raw)">
                                <template #prepend>
                                  <v-icon color="primary">mdi-printer</v-icon>
                                </template>
                                <v-list-item-title>列印</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </td>
                        <td>
                          <div class="text-body-2 font-weight-medium">
                            {{ formatDate(record.raw?.date) }}
                          </div>
                        </td>
                        <td>{{ record.raw?.obstaclereason || '—' }}</td>
                        <td>{{ record.raw?.selfcareability || '—' }}</td>
                        <td>{{ record.raw?.economicsources || '—' }}</td>
                        <td>{{ record.raw?.familysupport || '—' }}</td>
                        <td class="text-truncate" style="max-width: 200px;">{{ record.raw?.qa || '—' }}</td>
                        <td class="text-truncate" style="max-width: 200px;">{{ record.raw?.target || '—' }}</td>
                        <td class="text-truncate" style="max-width: 200px;">{{ record.raw?.means || '—' }}</td>
                        <td class="text-truncate" style="max-width: 200px;">{{ record.raw?.resources || '—' }}</td>
                        <td class="text-truncate" style="max-width: 150px;">{{ record.raw?.schedule || '—' }}</td>
                        <td>{{ record.raw?.executor || '—' }}</td>
                        <td class="text-truncate" style="max-width: 200px;">{{ record.raw?.evaluation || '—' }}</td>
                        <td v-if="canShowCreatorName">
                          {{ record.raw.createInfo ? record.raw.createInfo.name : '' }}
                        </td>
                        <td v-if="canShowCreatorInfo">
                          <div class="text-body-2">
                            {{ record.raw.createInfo ? `${record.raw.createInfo.name} (${record.raw.createInfo.time})` : '' }}
                          </div>
                        </td>
                        <td v-if="canShowEditorInfo">
                          <div class="text-body-2 text-truncate treatment__edit-info">
                            {{
                              Array.isArray(record.raw?.editInfo)
                                ? record.raw.editInfo.map((i) => `${i.name} (${i.time})`).join('，')
                                : ''
                            }}
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
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { computed, getCurrentInstance, ref, watch } from 'vue'

import PaginatedIterator from '@/components/PaginatedIterator.vue'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

import TreatmentAddDialog from './Add.vue'

const store = useStore()
const { proxy } = getCurrentInstance()

const addDialogRef = ref(null)

const records = ref([])
const searchKey = ref('')
const itemsPerPage = ref(10)
const itemsPerPageOptions = [
  { value: 10, title: '10' },
  { value: 20, title: '20' },
  { value: 30, title: '30' },
]
const loading = ref(false)

const hasUser = computed(() => Boolean(store.state?.uData?.snkey))
const residentName = computed(() => store.state?.uData?.name ?? '未選擇住民')
const residentCode = computed(() => store.state?.uData?.p_code ?? '---')

const totalCount = computed(() => records.value.length)
const latestRecord = computed(() => records.value[0] ?? null)

const searchTokens = computed(() => searchKey.value.split(/\s+/).filter(Boolean))

const filteredItems = computed(() => {
  if (!searchTokens.value.length) return records.value
  return records.value.filter((item) => {
    const str = JSON.stringify(item).toUpperCase()
    return searchTokens.value.every((token) => str.includes(token.toUpperCase()))
  })
})

const filteredCount = computed(() => filteredItems.value.length)

const canShowCreatorName = computed(() => Boolean(store.state?.cData?.isShowCreaterName))
const canShowCreatorInfo = computed(() => Boolean(store.state?.cData?.isShowCreaterInfo))
const canShowEditorInfo = computed(() => Boolean(store.state?.cData?.isShowEditerInfo))

const formatDate = (date) => {
  const parsed = dayjs(date)
  return parsed.isValid() ? parsed.format('YYYY/MM/DD') : date ?? ''
}

const normalizeRecord = (row) => {
  const parsed = JSON.parse(row.datalist || '{}')
    return {
    ...parsed,
    snkey: row.snkey,
  }
}

const sortRecords = (list) => {
  return [...list].sort((a, b) => {
    const dateA = a.date || a.raw?.date || ''
    const dateB = b.date || b.raw?.date || ''
    const dateCompare = dayjs(dateB).diff(dayjs(dateA))
    if (dateCompare !== 0) return dateCompare
    const snkeyA = a.snkey || a.raw?.snkey || ''
    const snkeyB = b.snkey || b.raw?.snkey || ''
    return snkeyB?.localeCompare?.(snkeyA ?? '') ?? 0
  })
}

const fetchRecords = async () => {
  if (!hasUser.value) {
    records.value = []
    return
  }

  loading.value = true
  try {
    const postData = {
      key: 'u_snkey',
      value: store.state.uData.snkey,
    }

    const response = await api.options(
      `byjson/searchByKeyValue/${store.state.databaseName}/treatment`,
      postData
    )

    const normalized = response.map((row) => {
      return {
        ...JSON.parse(row.datalist || '{}'),  
        snkey: row.snkey,
      }
    })

    records.value = sortRecords(normalized)
  } catch (error) {
    console.error('取得資料失敗:', error)
    store.showToastMulti({
      msg: '取得資料失敗',
      type: true,
      theme: 'error',
    })
  } finally {
    loading.value = false
  }
}

const openAddDialog = () => {
  addDialogRef.value?.openForAdd()
}

const openEdit = (record) => {
  addDialogRef.value?.openForEdit(record)
}

const askDelete = async (record) => {
  try {
    const result = await proxy.$swal({
      title: '確認刪除？',
      text: '此操作無法復原，請確認是否要刪除此筆資料。',
      icon: 'warning',
      toast: false,
      timer: null,
      showConfirmButton: true,
      showCancelButton: true,
      position: 'center',
    })

    if (result.isConfirmed) {
      await handleDelete(record)
    }
  } catch (error) {
    console.error('刪除確認失敗:', error)
  }
}

const handleDelete = async (record) => {
  try {
    loading.value = true
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const delman = `${store.state.pData.username}(${timestamp})`

    const postData = {
      snkey: record.snkey,
      tablename: 'treatment',
      info: JSON.stringify({ ...record, delman }),
    }

    await api.delete(
      `${store.state.databaseName}/treatment`,
      postData
    )

    store.showToastMulti({
      msg: '已刪除',
      type: true,
      theme: 'success',
    })

    await fetchRecords()
  } catch (error) {
    console.error('刪除失敗:', error)
    store.showToastMulti({
      msg: '刪除失敗',
      type: true,
      theme: 'error',
    })
  } finally {
    loading.value = false
  }
}

const openPrint = (record) => {
  sessionStorage.setItem('printData', JSON.stringify(record))
  const routeData = proxy.$router.resolve({
    path: '/TreatmentPrint',
  })
  window.open(routeData.href, '_blank')
}

watch(() => store.state?.uData?.snkey, () => {
  fetchRecords()
}, { immediate: true })
</script>

<style scoped lang="scss">
.treatment {
  &__hero {
    background: linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%);
    padding: 24px;
    margin-bottom: 16px;

    &__title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1976d2;
    }

    &__subtitle {
      font-size: 0.875rem;
      color: rgba(0, 0, 0, 0.6);
    }

    &__meta {
      margin-top: 16px;
    }
  }

  &__summary-card {
    padding: 20px;
    text-align: center;

    .summary-title {
      font-size: 0.875rem;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 8px;
    }

    .summary-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1976d2;
      margin-bottom: 4px;
    }

    .summary-caption {
      font-size: 0.75rem;
      color: rgba(0, 0, 0, 0.5);
    }
  }

  &__toolbar {
    padding: 16px;
    background-color: #f5f5f5;
  }

  &__table-card {
    overflow: hidden;
  }

  &__table {
  thead {
      background-color: #e3f2fd;

    th {
      font-size: 1.2rem;
        font-family: '微軟正黑體';
        color: #d32f2f;
        font-weight: 600;
    }
  }

  tbody {
    td {
      font-size: 1rem;
    }
    }
  }

  &__edit-info {
    max-width: 400px;
  }
}
</style>