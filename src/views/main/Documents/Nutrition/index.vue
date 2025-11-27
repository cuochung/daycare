<template>
  <div class="nutritionlist">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <v-sheet class="nutritionlist__hero" rounded="xl" elevation="0">
            <div class="d-flex flex-column flex-md-row justify-space-between align-start">
              <div class="d-flex align-center mb-4 mb-md-0">
                <v-avatar size="56" color="primary" variant="tonal" class="mr-4">
                  <v-icon color="primary" size="32">mdi-food</v-icon>
                </v-avatar>
                <div>
                  <h2 class="nutritionlist__title mb-1">營養評估單</h2>
                  <p class="nutritionlist__subtitle mb-0">
                    記錄住民營養狀況評估，包含生理資料、飲食資料、營養建議等完整資訊。
                  </p>
                </div>
              </div>
              <div class="d-flex align-center ga-3">
                <v-btn variant="outlined" color="primary" prepend-icon="mdi-refresh" size="small" @click="getAllData">
                  重新整理
                </v-btn>
              </div>
            </div>
            <v-divider class="my-4" />
            <div class="nutritionlist__meta d-flex flex-wrap ga-3">
              <v-chip variant="tonal" color="primary">
                住民：{{ residentName }}
              </v-chip>
              <v-chip variant="tonal" color="secondary">
                住編：{{ residentCode }}
              </v-chip>
              <v-chip variant="text" color="primary" prepend-icon="mdi-account-heart">
                記錄筆數：{{ totalCount }}
              </v-chip>
              <v-chip v-if="latestRecord" variant="text" color="teal" prepend-icon="mdi-calendar-clock">
                最新評估：{{ latestRecord.date }}
              </v-chip>
            </div>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row class="mt-4" dense>
        <v-col cols="12" md="4">
          <v-card variant="tonal" color="primary" rounded="xl" class="nutritionlist__summary-card">
            <v-icon size="28" class="mb-2">mdi-format-list-numbered</v-icon>
            <div class="summary-title">總紀錄筆數</div>
            <div class="summary-value">{{ totalCount }}</div>
            <div class="summary-caption">目前載入的營養評估資料</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card variant="tonal" color="info" rounded="xl" class="nutritionlist__summary-card">
            <v-icon size="28" class="mb-2">mdi-magnify</v-icon>
            <div class="summary-title">搜尋結果</div>
            <div class="summary-value">{{ filteredCount }}</div>
            <div class="summary-caption">符合條件的顯示筆數</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card variant="tonal" color="success" rounded="xl" class="nutritionlist__summary-card">
            <v-icon size="28" class="mb-2">mdi-lightbulb-outline</v-icon>
            <div class="summary-title">最新建議</div>
            <div class="summary-value summary-value--note">
              {{ latestRecord?.suggest || '尚無營養建議' }}
            </div>
            <div class="summary-caption">最近一次評估的建議</div>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-sheet class="nutritionlist__toolbar" rounded="xl" elevation="0">
            <v-row align="center" no-gutters>
              <v-col cols="12" md="6">
                <v-text-field v-model="searchKey" variant="outlined" density="comfortable" class="pr-md-4"
                  prepend-inner-icon="mdi-magnify" label="搜尋關鍵字" hide-details inset />
              </v-col>
              <v-col cols="12" md="6" class="d-flex justify-end ga-2 mt-3 mt-md-0">
                <v-btn color="tertiary" variant="tonal" prepend-icon="mdi-printer" @click="goPrint">
                  多筆列印
                </v-btn>
                <popupadd @getAllData="getAllData" ref="addDialogRef"></popupadd>
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

          <v-alert v-else-if="!filteredCount" type="info" variant="tonal" border="start" color="primary" class="mb-4">
            目前沒有符合搜尋條件的資料，可調整搜尋關鍵字或新增紀錄。
          </v-alert>

          <PaginatedIterator v-if="filteredCount" :items="filteredItems" v-model:items-per-page="itemsPerPage"
            :items-per-page-options="itemsPerPageOptions">
            <template #default="{ items }">
              <v-card class="nutritionlist__table-card" rounded="xl" variant="outlined">
                <v-card-title class="d-flex align-center">
                  <div class="text-subtitle-1 font-weight-bold">顯示筆數：{{ filteredCount }}</div>
                  <v-spacer></v-spacer>
                  <v-chip size="small" variant="tonal" color="primary" prepend-icon="mdi-calendar">
                    依日期由新到舊排序
                  </v-chip>
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-0">
                  <v-table class="nutritionlist__table text-no-wrap" fixed-header>
                    <thead>
                      <tr>
                        <th class="text-center" style="width: 80px;">操作</th>
                        <th>評估日期</th>
                        <th>活動狀況</th>
                        <th>體重</th>
                        <th>BMI</th>
                        <th>食慾</th>
                        <th>飲食質地</th>
                        <th>進食方式</th>
                        <th>飲食處方</th>
                        <th>熱量(Kcal)</th>
                        <th>醣類(%)</th>
                        <th>醣類(g)</th>
                        <th>蛋白質(%)</th>
                        <th>蛋白質(g)</th>
                        <th>脂肪(%)</th>
                        <th>脂肪(g)</th>
                        <th>營養建議</th>
                        <th v-if="showCreateName">紀錄人姓名</th>
                        <th v-if="showCreateInfo">紀錄人紀錄</th>
                        <th v-if="showEditInfo">修改紀錄</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="item.raw?.snkey ?? index">
                        <td class="text-center">
                          <v-menu location="bottom">
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
                              <v-list-item @click="askDelete(item.raw)">
                                <template #prepend>
                                  <v-icon color="error">mdi-delete-outline</v-icon>
                                </template>
                                <v-list-item-title>刪除</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </td>
                        <td>{{ item.raw.date }}</td>
                        <td>{{ item.raw.action }}</td>
                        <td>{{ item.raw.weight }}</td>
                        <td>{{ item.raw.bmi }}</td>
                        <td>{{ item.raw.appetite }}</td>
                        <td>{{ item.raw.texture }}</td>
                        <td>{{ item.raw.eat }}</td>
                        <td>{{ item.raw.dietprescription }}</td>
                        <td>{{ item.raw.kcal }}</td>
                        <td>{{ item.raw.carbohydrate }}</td>
                        <td>{{ item.raw.carbohydrate_g }}</td>
                        <td>{{ item.raw.protein }}</td>
                        <td>{{ item.raw.protein_g }}</td>
                        <td>{{ item.raw.fat }}</td>
                        <td>{{ item.raw.fat_g }}</td>
                        <td class="text-truncate" style="max-width: 220px;">{{ item.raw.suggest }}</td>
                        <td v-if="showCreateName">{{ (item.raw?.createInfo?.name || '').split('(')[0] }}</td>
                        <td v-if="showCreateInfo">{{ item.raw?.createInfo?.name }} ({{ item.raw?.createInfo?.time }})</td>
                        <td v-if="showEditInfo" class="text-truncate" style="max-width: 240px;">
                          <div v-if="item.raw.editInfo" class="text-truncate" style="max-width: 400px">
                            <span v-for="(i, index) in item.raw.editInfo" :key="index">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'
import PaginatedIterator from '@/components/PaginatedIterator.vue'
import popupadd from './Add.vue'

const store = useStore()
const { proxy } = getCurrentInstance()
const router = useRouter()

const items = ref([])
const searchKey = ref('')
const itemsPerPageOptions = [
  { value: 5, title: '5' },
  { value: 10, title: '10' },
  { value: 20, title: '20' },
  { value: 30, title: '30' },
]
const itemsPerPage = ref(10)
const addDialogRef = ref(null)

const hasUser = computed(() => Boolean(store.state?.uData?.snkey))
const residentName = computed(() => store.state?.uData?.name ?? '尚未選擇')
const residentCode = computed(() => store.state?.uData?.p_code ?? '--')

const showCreateName = computed(() => store.state?.cData?.isShowCreaterName)
const showCreateInfo = computed(() => store.state?.cData?.isShowCreaterInfo)
const showEditInfo = computed(() => store.state?.cData?.isShowEditerInfo)

const keywordTokens = computed(() => {
  if (!searchKey.value) return []
  return searchKey.value
    .split(' ')
    .map((token) => token.trim())
    .filter(Boolean)
})

const filteredItems = computed(() => {
  if (!keywordTokens.value.length) return items.value

  return items.value.filter((item) => {
    const content = JSON.stringify(item).toUpperCase()
    return keywordTokens.value.every((token) => content.includes(token.toUpperCase()))
  })
})

const totalCount = computed(() => items.value.length)
const filteredCount = computed(() => filteredItems.value.length)
const latestRecord = computed(() => items.value[0] ?? null)

const normalizeRecord = (row) => {
  const parsed = JSON.parse(row.datalist || '{}')
  return {
    ...parsed,
    snkey: row.snkey,
  }
}

const getAllData = async () => {
  if (!hasUser.value) {
    items.value = []
    return
  }

  const payload = {
    key: 'u_snkey',
    value: store.state.uData.snkey,
  }
  const url = `byjson/searchByKeyValue/${store.state.databaseName}/nutrition`
  const response = await api.options(url, payload)

  if (response && response.length > 0) {
    const data = response.map(normalizeRecord)
    items.value = sortRecords(data)
  } else {
    items.value = []
  }
}

const sortRecords = (data) => {
  if (!Array.isArray(data)) return []
  return [...data].sort((a, b) => {
    return parseInt(a.date) < parseInt(b.date) ? 1 : -1
  })
}

const edit = (item) => {
  addDialogRef.value?.openForEdit(item)
}

const askDelete = (record) => {
  proxy.$swal({
    title: '確認要刪除這筆紀錄嗎？',
    text: '此操作無法復原，請再次確認。',
    icon: 'warning',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center'
  }).then(async (result) => {
    if (!result.isConfirmed) return

    const postData = {
      snkey: record.snkey,
      tablename: 'nutrition',
      datalist: JSON.stringify({
        ...record,
        delman: `${store.state.pData?.username ?? ''} (${dayjs().format('YYYY-MM-DD HH:mm:ss')})`,
      }),
    }

    const rs = await api.delete('nutrition', postData)
    if (rs?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '紀錄已刪除',
        closeTime: 2,
      })
      getAllData()
    } else {
      store.showToastMulti({
        type: 'error',
        message: '刪除失敗，請稍後再試',
        closeTime: 3,
      })
    }
  })
}

const goPrint = () => {
  router.push('/print/nutritionprintmanage')
}

onMounted(() => {
  getAllData()
})
</script>

<style scoped lang="scss">
.nutritionlist {
  &__hero {
    padding: 24px 28px;
    background: linear-gradient(135deg, rgba(168, 197, 181, 0.16), rgba(91, 143, 163, 0.12));
    border: 1px solid rgba(91, 143, 163, 0.12);
  }

  &__title {
    font-size: 1.6rem;
    color: rgba(53, 88, 80, 0.92);
  }

  &__subtitle {
    color: rgba(53, 88, 80, 0.7);
  }

  &__meta {
    gap: 12px;
  }

  &__summary-card {
    padding: 20px;
    text-align: center;
    color: rgba(53, 88, 80, 0.9);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }

    .summary-title {
      font-size: 0.95rem;
      margin-bottom: 8px;
      color: rgba(53, 88, 80, 0.78);
    }

    .summary-value {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 6px;

      &--note {
        font-size: 1.1rem;
        font-weight: 600;
        min-height: 40px;
      }
    }

    .summary-caption {
      font-size: 0.8rem;
      color: rgba(53, 88, 80, 0.6);
    }
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
      }
    }

    tbody tr:nth-child(even) {
      background-color: rgba(255, 255, 255, 0.6);
    }

    tbody tr:hover {
      background-color: rgba(168, 197, 181, 0.12);
    }
  }
}
</style>
