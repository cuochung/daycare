<template>
  <div class="rehabilitation">
    <RehabilitationAddDialog ref="addDialogRef" @refresh="fetchRecords" />
    <RehabilitationPrintOption ref="printDialogRef" />

    <v-container fluid class="pa-0">
        <v-row>
        <v-col cols="12">
          <v-sheet class="rehabilitation__hero" rounded="xl" elevation="0">
            <div class="d-flex flex-column flex-md-row justify-space-between align-start">
              <div class="d-flex align-center mb-4 mb-md-0">
                <v-avatar size="56" color="primary" variant="tonal" class="mr-4">
                  <v-icon color="primary" size="32">mdi-dumbbell</v-icon>
                </v-avatar>
                <div>
                  <h2 class="rehabilitation__title mb-1">復健評估表</h2>
                  <p class="rehabilitation__subtitle mb-0">
                    記錄個案的復健評估資料，包含關節活動度、肌肉力量、平衡能力等評估項目。
                  </p>
                </div>
              </div>

              <div class="d-flex align-center ga-2">
                <v-btn color="tertiary" variant="tonal" prepend-icon="mdi-printer"
                  :disabled="!hasUser || !filteredCount" @click="openPrintOptions">
                  匯出列印
                </v-btn>
                <v-btn color="primary" variant="flat" prepend-icon="mdi-plus-circle" :disabled="!hasUser"
                  @click="openAddDialog">
                  新增評估
                </v-btn>
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="rehabilitation__meta d-flex flex-wrap ga-3">
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
                最新評估：{{ formatDate(latestRecord.raw?.date) }}
              </v-chip>
            </div>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row class="mt-4" dense>
        <v-col cols="12" md="4">
          <v-card variant="tonal" color="primary" rounded="xl" class="rehabilitation__summary-card">
            <v-icon size="28" class="mb-2">mdi-format-list-numbered</v-icon>
            <div class="summary-title">總評估筆數</div>
            <div class="summary-value">{{ totalCount }}</div>
            <div class="summary-caption">目前載入的評估資料</div>
          </v-card>
          </v-col>
          <v-col cols="12" md="4">
          <v-card variant="tonal" color="info" rounded="xl" class="rehabilitation__summary-card">
            <v-icon size="28" class="mb-2">mdi-magnify</v-icon>
            <div class="summary-title">搜尋結果</div>
            <div class="summary-value">{{ filteredCount }}</div>
            <div class="summary-caption">符合條件的顯示筆數</div>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-sheet class="rehabilitation__toolbar" rounded="xl" elevation="0">
            <v-row align="center" no-gutters>
              <v-col cols="12" md="6">
                <v-text-field v-model="searchKey" variant="outlined" density="comfortable" class="pr-md-4"
                  prepend-inner-icon="mdi-magnify" label="搜尋關鍵字（日期、評估項目等）" hide-details inset />
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
            尚未選擇住民，請先至住民清單選擇後再維護復健評估資料。
          </v-alert>

          <v-alert v-else-if="hasUser && !filteredCount" type="info" variant="tonal" border="start" color="primary"
            class="mb-4" icon="mdi-information-outline">
            目前沒有符合搜尋條件的資料，可調整搜尋條件或新增復健評估。
          </v-alert>

          <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

          <PaginatedIterator v-if="filteredCount" :items="filteredItems" v-model:items-per-page="itemsPerPage"
            :items-per-page-options="itemsPerPageOptions">
            <template #default="{ items }">
              <v-card class="rehabilitation__table-card" rounded="xl" variant="outlined">
                <v-card-title class="d-flex align-center">
                  <div class="text-subtitle-1 font-weight-bold">顯示筆數：{{ filteredCount }}</div>
                  <v-spacer />
                  <v-chip size="small" variant="tonal" color="primary" prepend-icon="mdi-calendar-range">
                    依日期由新到舊排序
                  </v-chip>
      </v-card-title>
                <v-divider />
                <v-card-text class="pa-0">
                  <div class="rehabilitation__table-wrapper">
                    <v-table class="rehabilitation__table text-no-wrap" fixed-header>
                      <thead>
                        <tr>
                          <th rowspan="2" style="width: 80px;" class="text-center">操作</th>
                          <th rowspan="2" style="width: 120px;">評估日期</th>
                        <th colspan="4">關節活動度（ROM）</th>
                        <th colspan="4">肌肉力量（MMT）</th>
                          <th rowspan="2" style="width: 150px;">動作、姿態與步態</th>
                        <th colspan="5">肌肉張力(Muscle tone)</th>
                        <th colspan="5">平衡（Balance）</th>
                          <th colspan="6">布郎斯壯分期（Brunnstrom's stage）</th>
                          <th rowspan="2" style="width: 200px;">短期目標</th>
                          <th rowspan="2" style="width: 200px;">長期目標</th>
                          <th rowspan="2" style="width: 200px;">治療項目</th>
                          <th v-if="canShowCreatorName" rowspan="2" style="width: 160px;">紀錄人姓名</th>
                          <th v-if="canShowCreatorInfo" rowspan="2" style="width: 220px;">紀錄人紀錄</th>
                          <th v-if="canShowEditorInfo" rowspan="2" style="width: 220px;">修改紀錄</th>
                      </tr>
                      <tr>
                          <th style="width: 80px;">右上肢</th>
                          <th style="width: 80px;">右下肢</th>
                          <th style="width: 80px;">左上肢</th>
                          <th style="width: 80px;">左下肢</th>
                          <th style="width: 80px;">右上肢</th>
                          <th style="width: 80px;">右下肢</th>
                          <th style="width: 80px;">左上肢</th>
                          <th style="width: 80px;">左下肢</th>
                          <th style="width: 60px;">軀幹</th>
                          <th style="width: 60px;">右上肢</th>
                          <th style="width: 60px;">右下肢</th>
                          <th style="width: 60px;">左上肢</th>
                          <th style="width: 60px;">左下肢</th>
                          <th style="width: 60px;">坐姿靜態</th>
                          <th style="width: 60px;">坐姿動態</th>
                          <th style="width: 60px;">站姿靜態</th>
                          <th style="width: 60px;">站姿動態</th>
                          <th style="width: 60px;">坐站平衡</th>
                          <th style="width: 60px;">右上肢-近</th>
                          <th style="width: 60px;">右上肢-遠</th>
                          <th style="width: 60px;">左上肢-近</th>
                          <th style="width: 60px;">左上肢-遠</th>
                          <th style="width: 60px;">右下肢</th>
                          <th style="width: 60px;">左下肢</th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(record, index) in items"
                          :key="record.snkey || record.raw?.snkey || `rehabilitation-${index}`">
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
                            </v-list>
                          </v-menu>
                        </td>
                          <td>
                            <div class="text-body-2 font-weight-medium">
                              {{ formatDate(record.raw?.date) }}
                            </div>
                          </td>
                          <td>{{ record.raw?.rom1 || '—' }}</td>
                          <td>{{ record.raw?.rom2 || '—' }}</td>
                          <td>{{ record.raw?.rom3 || '—' }}</td>
                          <td>{{ record.raw?.rom4 || '—' }}</td>
                          <td>{{ record.raw?.mmt1 || '—' }}</td>
                          <td>{{ record.raw?.mmt2 || '—' }}</td>
                          <td>{{ record.raw?.mmt3 || '—' }}</td>
                          <td>{{ record.raw?.mmt4 || '—' }}</td>
                          <td>{{ record.raw?.action || '—' }}</td>
                          <td>{{ record.raw?.muscletone1 || '—' }}</td>
                          <td>{{ record.raw?.muscletone2 || '—' }}</td>
                          <td>{{ record.raw?.muscletone3 || '—' }}</td>
                          <td>{{ record.raw?.muscletone4 || '—' }}</td>
                          <td>{{ record.raw?.muscletone5 || '—' }}</td>
                          <td>{{ record.raw?.balance1 || '—' }}</td>
                          <td>{{ record.raw?.balance2 || '—' }}</td>
                          <td>{{ record.raw?.balance3 || '—' }}</td>
                          <td>{{ record.raw?.balance4 || '—' }}</td>
                          <td>{{ record.raw?.balance5 || '—' }}</td>
                          <td>{{ record.raw?.brunnstrom1 || '—' }}</td>
                          <td>{{ record.raw?.brunnstrom2 || '—' }}</td>
                          <td>{{ record.raw?.brunnstrom3 || '—' }}</td>
                          <td>{{ record.raw?.brunnstrom4 || '—' }}</td>
                          <td>{{ record.raw?.brunnstrom5 || '—' }}</td>
                          <td>{{ record.raw?.brunnstrom6 || '—' }}</td>
                          <td class="text-truncate" style="max-width: 200px;">{{ record.raw?.shorttermgoals || '—' }}</td>
                          <td class="text-truncate" style="max-width: 200px;">{{ record.raw?.longtermgoals || '—' }}</td>
                          <td class="text-truncate" style="max-width: 200px;">{{ record.raw?.treatmentprograms || '—' }}</td>
                          <td v-if="canShowCreatorName">
                            {{ record.raw?.createInfo?.name ?? '' }}
                          </td>
                          <td v-if="canShowCreatorInfo">
                            <div class="text-body-2">
                              {{ record.raw?.createInfo ? `${record.raw.createInfo.name} (${record.raw.createInfo.time})` : '' }}
                            </div>
                          </td>
                          <td v-if="canShowEditorInfo">
                            <div class="text-body-2 text-truncate rehabilitation__edit-info">
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
                  </div>
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

import RehabilitationAddDialog from './Add.vue'
import RehabilitationPrintOption from './PrintOptipn.vue'

const store = useStore()
const { proxy } = getCurrentInstance()

const addDialogRef = ref(null)
const printDialogRef = ref(null)

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
  // 如果有 datalist，解析它；否則直接使用 row 的資料
  if (row.datalist) {
    const parsed = JSON.parse(row.datalist || '{}')
    return {
      ...parsed,
      snkey: row.snkey,
    }
  }
  // 如果沒有 datalist，直接使用 row 的資料（舊格式兼容）
  return {
    ...row,
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
      `byjson/searchByKeyValue/${store.state.databaseName}/rehabilitation`,
      postData
    )

    const normalized = response.map((row) => {
      const parsed = normalizeRecord(row)
      const createInfo = parseAction(row.create_man)
      const editInfo = row.edit_man ? parseAction(row.edit_man) : null

      return {
        ...parsed,
        createInfo: createInfo ? { name: createInfo.name, time: createInfo.time } : null,
        editInfo: editInfo ? [{ name: editInfo.name, time: editInfo.time }] : null,
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

const parseAction = (value) => {
  if (!value) return null
  const parts = value.split('(')
  return {
    name: parts[0] ?? '',
    time: parts[1] ? parts[1].replace(')', '') : '',
  }
}

const openAddDialog = () => {
  addDialogRef.value?.openForAdd()
}

const openEdit = (record) => {
  addDialogRef.value?.openForEdit(record)
}

const openPrintOptions = () => {
  printDialogRef.value?.openDialog(records.value)
}

const askDelete = (record) => {
  proxy.$swal({
    title: '確認要刪除這筆復健評估嗎？',
    text: '刪除後將無法復原，請再次確認。',
    icon: 'warning',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center',
  }).then(async (result) => {
    if (!result?.isConfirmed) return

    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const payload = {
      snkey: record.snkey,
      tablename: 'rehabilitation',
      datalist: JSON.stringify({
        ...record,
        delman: `${store.state?.pData?.username ?? ''} (${timestamp})`,
      }),
    }

    const response = await api.delete('rehabilitation', payload)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '復健評估已刪除',
        closeTime: 2,
      })
      fetchRecords()
    } else {
      store.showToastMulti({
        type: 'error',
        message: '刪除失敗，請稍後再試',
        closeTime: 3,
      })
    }
  })
}

watch(() => store.state?.uData?.snkey, () => {
  fetchRecords()
}, { immediate: true })
</script>

<style scoped lang="scss">
.rehabilitation {
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

  &__table-wrapper {
    overflow-x: auto;
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