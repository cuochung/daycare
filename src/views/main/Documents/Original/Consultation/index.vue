<template>
  <div class="consultation">
    <v-container fluid class="pa-0">
        <v-row>
        <v-col cols="12">
          <v-sheet class="consultation__hero" rounded="xl" elevation="0">
            <div class="d-flex flex-column flex-md-row justify-space-between align-start">
              <div class="d-flex align-center mb-4 mb-md-0">
                <v-avatar size="56" color="primary" variant="tonal" class="mr-4">
                  <v-icon color="primary" size="32">mdi-account-switch</v-icon>
                </v-avatar>
                <div>
                  <h2 class="consultation__title mb-1">轉介照會單</h2>
                  <p class="consultation__subtitle mb-0">
                    管理住民轉介照會紀錄，追蹤專業人員回覆與處理狀況。
                  </p>
                </div>
              </div>
              <div class="d-flex align-center ga-3">
                <v-btn variant="outlined" color="primary" prepend-icon="mdi-refresh" size="small" @click="fetchRecords">
                  重新整理
                </v-btn>
              </div>
            </div>
            <v-divider class="my-4" />
            <div class="consultation__meta d-flex flex-wrap ga-3">
              <v-chip variant="tonal" color="primary">
                住民：{{ residentName }}
              </v-chip>
              <v-chip variant="tonal" color="secondary">
                住編：{{ residentCode }}
              </v-chip>
              <v-chip variant="text" color="primary" prepend-icon="mdi-format-list-numbered">
                記錄筆數：{{ totalCount }}
              </v-chip>
            </div>
          </v-sheet>
          </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-sheet class="consultation__toolbar" rounded="xl" elevation="0">
            <v-row align="center" no-gutters>
              <v-col cols="12" md="6">
                <v-text-field v-model="searchKey" variant="outlined" density="comfortable" class="pr-md-4"
                  prepend-inner-icon="mdi-magnify" label="搜尋關鍵字" hide-details inset />
              </v-col>
              <v-col cols="12" md="6" class="d-flex justify-end ga-2 mt-3 mt-md-0">
                <v-btn color="primary" variant="flat" prepend-icon="mdi-plus-circle" @click="openAdd">
                  新增紀錄
                </v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col cols="12">
          <v-alert v-if="!hasUser" type="warning" variant="tonal" border="start" color="warning" class="mb-4">
            尚未選擇住民，請先至左側住民清單選擇後再進行紀錄查閱。
          </v-alert>
          <v-alert v-else-if="!filteredCount" type="info" variant="tonal" border="start" color="info" class="mb-4">
            目前沒有符合搜尋條件的資料。
          </v-alert>
          </v-col>
        </v-row>

      <v-row class="mt-2">
        <v-col cols="12">
          <v-card rounded="xl" variant="outlined" class="consultation__table-card">
            <PaginatedIterator :items="filteredItems" :items-per-page="itemsPerPage" :items-per-page-options="itemsPerPageOptions">
              <template v-slot:default="{ items }">
                <v-table fixed-header class="consultation__table text-no-wrap">
                  <thead>
                    <tr>
                      <th style="width: 80px;">功能</th>
                        <th>預照會人員</th>
                        <th>照會原因及狀況 [照會人員]</th>
                        <th>專業照會回覆 [照會人員] {日期}</th>
                        <th>追蹤處理</th>
                        <th>處理者簽名</th>
                        <th>日期</th>
                      <th v-if="showCreateName">紀錄人姓名</th>
                      <th v-if="showCreateInfo">紀錄人紀錄</th>
                      <th v-if="showEditInfo">修改紀錄</th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in items" :key="item.raw?.snkey || index">
                      <td>
                        <v-menu>
                          <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" variant="text" icon="mdi-dots-vertical" color="primary" />
                          </template>
                          <v-list>
                            <v-list-item @click="openEdit(item.raw)">
                              <template #prepend>
                                <v-icon color="primary">mdi-square-edit-outline</v-icon>
                              </template>
                              <v-list-item-title>修改</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="askDelete(item.raw)">
                              <template #prepend>
                                <v-icon color="error">mdi-delete-outline</v-icon>
                              </template>
                              <v-list-item-title>刪除</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="printRecord(item.raw)">
                              <template #prepend>
                                <v-icon color="info">mdi-printer</v-icon>
                              </template>
                              <v-list-item-title>列印</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </td>
                      <td class="consultation__multiline">{{ rebuildPersons(item.raw) }}</td>
                      <td class="consultation__multiline">{{ rebuildResult(item.raw) }}</td>
                      <td class="consultation__multiline">{{ rebuildPersonResponse(item.raw) }}</td>
                      <td>{{ item.raw.track_response || '—' }}</td>
                      <td>{{ item.raw.track_name || '—' }}</td>
                      <td>{{ item.raw.track_name_date || '—' }}</td>
                      <td v-if="showCreateName">{{ item.raw.createInfo?.name || '—' }}</td>
                      <td v-if="showCreateInfo">{{ item.raw.createInfo?.name || '—' }}</td>
                      <td v-if="showEditInfo" class="text-truncate" style="max-width: 400px;">{{ item.raw.editInfo || '—' }}</td>
                      </tr>
                    </tbody>
                </v-table>
              </template>
            </PaginatedIterator>
        </v-card>
        </v-col>
      </v-row>
    </v-container>

    <ConsultationAdd ref="addDialogRef" @refresh="fetchRecords" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import PaginatedIterator from '@/components/PaginatedIterator.vue'
import ConsultationAdd from './Add.vue'
import { useStore } from '@/stores/useStore'
import { useRouter } from 'vue-router'

const store = useStore()
const { proxy } = getCurrentInstance()
const router = useRouter()

const items = ref([])
const searchKey = ref('')
const itemsPerPage = ref(10)
const itemsPerPageOptions = [
  { value: 5, title: '5' },
  { value: 10, title: '10' },
  { value: 20, title: '20' },
  { value: 30, title: '30' },
]

const addDialogRef = ref(null)

const normalizeRecord = (row) => {
  const parsed = JSON.parse(row.datalist || '{}')
    return {
    ...parsed,
    snkey: row.snkey,
  }
}

const hasUser = computed(() => Boolean(store.state.uData?.snkey))
const residentName = computed(() => store.state.uData?.name ?? '尚未選擇')
const residentCode = computed(() => store.state.uData?.p_code ?? '--')

const keywordTokens = computed(() => {
  if (!searchKey.value) return []
  return searchKey.value
    .split(' ')
    .map((token) => token.trim())
    .filter(Boolean)
})

const filteredItems = computed(() => {
  if (!keywordTokens.value.length) return items.value

  return items.value.filter((record) => {
    const content = JSON.stringify(record).toUpperCase()
    return keywordTokens.value.every((token) => content.includes(token.toUpperCase()))
  })
})

const totalCount = computed(() => items.value.length)
const filteredCount = computed(() => filteredItems.value.length)

const showCreateName = computed(() => store.state.cData?.isShowCreaterName)
const showCreateInfo = computed(() => store.state.cData?.isShowCreaterInfo)
const showEditInfo = computed(() => store.state.cData?.isShowEditerInfo)

const sortRecords = (data) => {
  if (!Array.isArray(data)) return []
  return [...data].sort((a, b) => {
    return parseInt(a.date) < parseInt(b.date) ? 1 : -1
  })
}

const fetchRecords = async () => {
  if (!hasUser.value) {
    items.value = []
    return
  }

  try {
    const payload = {
      key: 'u_snkey',
      value: store.state.uData.snkey,
    }
    const url = `byjson/searchByKeyValue/${store.state.databaseName}/consultation`
    const response = await api.options(url, payload)

    if (response && response.length > 0) {
      const data = response.map(normalizeRecord)
      items.value = sortRecords(data)
    } else {
      items.value = []
    }
  } catch (error) {
    console.error('Get consultation error:', error)
    items.value = []
  }
}

const openAdd = () => {
  addDialogRef.value?.openForAdd()
}

const openEdit = (record) => {
  addDialogRef.value?.openForEdit(record)
}

const askDelete = (record) => {
  proxy?.$swal?.({
    title: '確認要刪除這筆紀錄嗎？',
    text: '此操作無法復原，請再次確認。',
    icon: 'warning',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center',
  }).then(async (result) => {
    if (!result.isConfirmed) return

    const postData = {
      snkey: record.snkey,
      tablename: 'consultation',
      datalist: JSON.stringify({
        ...record,
        delman: `${store.state.pData?.username ?? ''} (${dayjs().format('YYYY-MM-DD HH:mm:ss')})`,
      }),
    }

    try {
      const rs = await api.delete('consultation', postData)
      if (rs?.state == 1) {
        store.showToastMulti({
          type: 'success',
          message: '紀錄已刪除',
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
    } catch (error) {
      console.error('Delete error:', error)
      store.showToastMulti({
        type: 'error',
        message: '刪除失敗，請稍後再試',
        closeTime: 3,
      })
    }
  })
}

const printRecord = (record) => {
  const routeData = router.resolve({
    path: '/ConsultationPrint',
    query: { data: JSON.stringify(record) },
  })
  window.open(routeData.href, '_blank')
}

// 構築照會人員
const rebuildPersons = (item) => {
  const items = []
  if (item.doctor) items.push('醫生')
  if (item.nutritionist) items.push('營養師')
  if (item.socialworker) items.push('社工')
  if (item.rehabilitation) items.push('物理治療師')
  if (item.attendant) items.push('照服員')
  if (item.otherworker) {
    const otherText = item.otherworker_content ? `其他:${item.otherworker_content}` : '其他'
    items.push(otherText)
  }
  return items.length > 0 ? items.join('\n') : '—'
}

// 構築照會原因
const rebuildResult = (item) => {
  const items = []
  if (item.result1 && item.result1_content) {
    items.push(`精神及行為異常:${item.result1_content}`)
  }
  if (item.result2 && item.result2_content) {
    items.push(`健康狀況異常:${item.result2_content}`)
  }
  if (item.result3 && item.result3_content) {
    items.push(`日常生活無法自理:${item.result3_content}`)
  }
  if (item.result4 && item.result4_content) {
    items.push(`肢體功能退化:${item.result4_content}`)
  }
  if (item.result5 && item.result5_content) {
    items.push(`疑自殺意圖:${item.result5_content}`)
  }
  if (item.result6 && item.result6_content) {
    items.push(`服藥不合作:${item.result6_content}`)
  }
  if (item.result7 && item.result7_content) {
    items.push(`營養狀況異常:${item.result7_content}`)
  }
  if (item.result8 && item.result8_content) {
    items.push(`其他:${item.result8_content}`)
  }

  if (item.nurse_name) {
    items.push(`[護理人員:${item.nurse_name}]`)
  }
  if (item.nurse_name_date) {
    items.push(`{日期:${item.nurse_name_date}}`)
  }

  return items.length > 0 ? items.join('\n') : '—'
}

// 構築照會回覆
const rebuildPersonResponse = (item) => {
  const items = []
  
  if (item.doctor_response) {
    let doctorMsg = `醫師照會回覆:${item.doctor_response}`
    if (item.doctor_name) {
      doctorMsg += ` [照會人員:${item.doctor_name}]`
    }
    if (item.doctor_name_date) {
      doctorMsg += ` {日期:${item.doctor_name_date}}`
    }
    items.push(doctorMsg)
  }

  if (item.nutritionist_response) {
    let nutritionistMsg = `營養師照會回覆:${item.nutritionist_response}`
    if (item.nutritionist_name) {
      nutritionistMsg += ` [照會人員:${item.nutritionist_name}]`
    }
    if (item.nutritionist_name_date) {
      nutritionistMsg += ` {日期:${item.nutritionist_name_date}}`
    }
    items.push(nutritionistMsg)
  }

  if (item.socialworker_response) {
    let socialworkerMsg = `社工照會回覆:${item.socialworker_response}`
    if (item.socialworker_name) {
      socialworkerMsg += ` [照會人員:${item.socialworker_name}]`
    }
    if (item.socialworker_name_date) {
      socialworkerMsg += ` {日期:${item.socialworker_name_date}}`
    }
    items.push(socialworkerMsg)
  }

  if (item.rehabilitation_response) {
    let rehabilitationMsg = `物理治療師照會回覆:${item.rehabilitation_response}`
    if (item.rehabilitation_name) {
      rehabilitationMsg += ` [照會人員:${item.rehabilitation_name}]`
    }
    if (item.rehabilitation_name_date) {
      rehabilitationMsg += ` {日期:${item.rehabilitation_name_date}}`
    }
    items.push(rehabilitationMsg)
  }

  if (item.attendant_response) {
    let attendantMsg = `照服員照會回覆:${item.attendant_response}`
    if (item.attendant_name) {
      attendantMsg += ` [照會人員:${item.attendant_name}]`
    }
    if (item.attendant_name_date) {
      attendantMsg += ` {日期:${item.attendant_name_date}}`
    }
    items.push(attendantMsg)
  }

  if (item.otherworker_response) {
    let otherworkerMsg = `其他人員(${item.otherworker_content || ''})照會回覆:${item.otherworker_response}`
    if (item.otherworker_name) {
      otherworkerMsg += ` [照會人員:${item.otherworker_name}]`
    }
    if (item.otherworker_name_date) {
      otherworkerMsg += ` {日期:${item.otherworker_name_date}}`
    }
    items.push(otherworkerMsg)
  }

  return items.length > 0 ? items.join('\n') : '—'
}

onMounted(() => {
  fetchRecords()
})
</script>

<style scoped lang="scss">
.consultation {
  &__hero {
    padding: 24px 28px;
    background: linear-gradient(135deg, rgba(168, 197, 181, 0.16), rgba(91, 143, 163, 0.12));
    border: 1px solid rgba(91, 143, 163, 0.12);
  }

  &__title {
    font-size: 1.6rem;
    color: rgba(53, 88, 80, 0.92);
    font-weight: 600;
  }

  &__subtitle {
    font-size: 0.95rem;
    color: rgba(53, 88, 80, 0.7);
  }

  &__meta {
    gap: 12px;
  }

  &__toolbar {
    padding: 18px 24px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--daycare-divider-light);
    box-shadow: 0 16px 32px rgba(74, 107, 95, 0.12);
  }

  &__table-card {
    border-color: var(--daycare-divider);
    box-shadow: 0 20px 40px rgba(74, 107, 95, 0.16);
  }

  &__table {
  thead {
      background-color: rgba(168, 197, 181, 0.18);

      th {
        font-weight: 600;
        color: rgba(53, 88, 80, 0.85);
        white-space: nowrap;
        font-size: 0.95rem;
      }
    }

  tbody {
      tr:nth-child(even) {
        background-color: rgba(255, 255, 255, 0.6);
      }

      tr:hover {
        background-color: rgba(168, 197, 181, 0.12);
      }

      td {
        font-size: 0.9rem;
        color: rgba(53, 88, 80, 0.8);
      }
    }
  }

  &__multiline {
    white-space: pre-line;
    vertical-align: top;
    line-height: 1.6;
  }
}
</style>
