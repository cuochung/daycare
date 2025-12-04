<template>
  <div class="constraint-event-list">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <v-sheet class="constraint-event-list__hero" rounded="xl" elevation="0">
            <div class="d-flex flex-column flex-md-row justify-space-between align-start">
              <div class="d-flex align-center mb-4 mb-md-0">
                <v-avatar size="56" color="primary" variant="tonal" class="mr-4">
                  <v-icon color="primary" size="32">mdi-lock</v-icon>
                </v-avatar>
                <div>
                  <h2 class="constraint-event-list__title mb-1">約束登記表</h2>
                  <p class="constraint-event-list__subtitle mb-0">
                    記錄住民約束事件，包含約束日期、理由、設備、部位等評估項目。
                  </p>
                </div>
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="constraint-event-list__meta d-flex flex-wrap ga-3">
              <v-chip variant="tonal" color="primary">
                病歷號：{{ residentCode }}
              </v-chip>
              <v-chip variant="tonal" color="secondary">
                姓名：{{ residentName }}
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
                density="comfortable" hide-details style="max-width: 300px;" />
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="flat" prepend-icon="mdi-plus-circle" @click="openAdd" class="ml-2">
                新增紀錄
              </v-btn>
              <ConstraintEventAdd ref="addDialogRef" :useDataBase="useDataBase" :items="items" @refresh="getAllData"
                @getAllData="getAllData" />
            </v-card-title>
            <v-card-text>
              <PaginatedIterator :items="filteredItems" :items-per-page-options="itemsPerPageOptions"
                :items-per-page="itemsPerPage" @update:items-per-page="itemsPerPage = $event">
                <template #default="{ items }">
                  <v-table fixed-header class="text-no-wrap">
                    <thead style="background-color: #e3f2fd">
                      <tr>
                        <th></th>
                        <th>評估日期</th>
                        <th>約束理由</th>
                        <th>解除約束</th>
                        <th v-if="store.state?.cData?.isShowCreaterName">紀錄人姓名</th>
                        <th v-if="store.state?.cData?.isShowCreaterInfo">紀錄人紀錄</th>
                        <th v-if="store.state?.cData?.isShowEditerInfo">修改紀錄</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="index">
                        <td class="text-center">
                          <v-menu location="bottom">
                            <template #activator="{ props }">
                              <v-btn v-bind="props" variant="text" icon="mdi-dots-vertical" color="primary" />
                            </template>
                            <v-list>
                              <v-list-item @click="edit(item.raw)">
                                <template #prepend>
                                  <v-icon color="primary">mdi-pencil</v-icon>
                                </template>
                                <v-list-item-title>修改</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="del(item.raw)">
                                <template #prepend>
                                  <v-icon color="error">mdi-delete</v-icon>
                                </template>
                                <v-list-item-title>刪除</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="print(item.raw)">
                                <template #prepend>
                                  <v-icon color="info">mdi-printer</v-icon>
                                </template>
                                <v-list-item-title>列印</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </td>
                        <td>{{ item.raw.Date || '—' }}</td>
                        <td>{{ item.raw.reason || '—' }}</td>
                        <td>
                          <v-checkbox v-model="item.raw.releaseOK" @change="update(item.raw)"
                            :label="item.raw.releaseOK ? item.raw.releaseInfo : ''" hide-details density="compact" />
                        </td>
                        <td v-if="store.state?.cData?.isShowCreaterName">
                          {{ item.raw.createInfo?.name || '—' }}
                        </td>
                        <td v-if="store.state?.cData?.isShowCreaterInfo">
                          {{ item.raw.createInfo ? `${item.raw.createInfo.name}(${item.raw.createInfo.time})` : '—' }}
                        </td>
                        <td v-if="store.state?.cData?.isShowEditerInfo" class="text-truncate" style="max-width: 240px;">
                          <div v-if="item.raw.editInfo && item.raw.editInfo.length > 0" class="text-truncate" style="max-width: 400px">
                            <span v-for="(i, idx) in item.raw.editInfo" :key="idx">
                              {{ `${i.name}(${i.time})` }}
                            </span>
                          </div>
                          <span v-else>—</span>
                        </td>
                      </tr>
                      <tr v-if="!filteredItems || filteredItems.length === 0">
                        <td :colspan="columnCount" class="text-center text-medium-emphasis py-8">
                          目前沒有資料。
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
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'
import { useRouter } from 'vue-router'
import ConstraintEventAdd from './Add.vue'
import PaginatedIterator from '@/components/PaginatedIterator.vue'

const store = useStore()
const router = useRouter()
const { proxy } = getCurrentInstance()

const useDataBase = ref('constraintevent')
const items = ref([])
const searchKey = ref('')
const itemsPerPageOptions = [10, 20, 30]
const itemsPerPage = ref(10)
const addDialogRef = ref(null)

const residentCode = computed(() => store.state.uData?.p_code || '—')
const residentName = computed(() => store.state.uData?.name || '—')

const columnCount = computed(() => {
  let count = 4 // 功能、評估日期、約束理由、解除約束
  if (store.state?.cData?.isShowCreaterName) count++
  if (store.state?.cData?.isShowCreaterInfo) count++
  if (store.state?.cData?.isShowEditerInfo) count++
  return count
})

const normalizeRecord = (row) => {
  const parsed = JSON.parse(row.datalist || '{}')
  return {
    ...parsed,
    snkey: row.snkey,
  }
}

const filteredItems = computed(() => {
  if (!searchKey.value) return items.value

  const keys = searchKey.value.split(' ')
  return keys.reduce((prev, element) => {
    return prev.filter((item) => {
      const str = JSON.stringify(item).toUpperCase()
      return str.includes(element.toUpperCase())
    })
  }, items.value)
})

const getAllData = async () => {
  try {
    const response = await api.options(`byjson/searchByKeyValue/${store.state.databaseName}/${useDataBase.value}`, {
      key: 'u_snkey',
      value: store.state.uData.snkey,
    })

    if (response.length) {
      items.value = response.map((row) => normalizeRecord(row))
        .sort((a, b) => (a.Date < b.Date ? 1 : -1))
    } else {
      items.value = []
    }
  } catch (error) {
    console.error('getAllData error:', error)
    items.value = []
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
    title: '確認刪除？',
    text: '此操作無法復原，請再次確認。',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center',
  })

  if (result?.isConfirmed) {
    try {
      const postData = {
        snkey: delData.snkey,
      }
      const response = await api.delete(useDataBase.value, postData)
      if (response?.state == 1) {
        store.showToastMulti({
          type: 'success',
          message: '已刪除',
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

const update = async (item) => {
  if (!item.editInfo || !Array.isArray(item.editInfo)) {
    item.editInfo = []
  }
  
  item.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })

  // 記錄解除約束 人+時間
  if (item.releaseOK) {
    item.releaseInfo = store.state.pData.username + '(' + dayjs().format('YYYY-MM-DD HH:mm:ss') + ')'
  }

  try {
    const postData = {
      snkey: item.snkey,
      datalist: JSON.stringify(item),
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }

    const response = await api.post(useDataBase.value, postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已修改',
        closeTime: 2,
      })
      getAllData()
    } else {
      store.showToastMulti({
        type: 'error',
        message: '修改失敗，請稍後再試',
        closeTime: 3,
      })
    }
  } catch (error) {
    console.error('Update error:', error)
    store.showToastMulti({
      type: 'error',
      message: '修改失敗，請稍後再試',
      closeTime: 3,
    })
  }
}

const print = (item) => {
  const routeData = router.resolve({
    path: `/print/constrainteventprint/${item.snkey}`,
  })
  window.open(routeData.href, '_blank')
}

onMounted(() => {
  getAllData()
})
</script>

<style lang="scss" scoped>
.constraint-event-list {
  &__hero {
    padding: 24px;
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.08), rgba(33, 150, 243, 0.02));
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #1976d2;
  }

  &__subtitle {
    font-size: 0.95rem;
    color: #666;
  }

  &__meta {
    margin-top: 16px;
  }
}
</style>
