<template>
  <div class="nutritionprintmanage">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <v-sheet class="nutritionprintmanage__hero" rounded="xl" elevation="0">
            <div class="d-flex flex-column flex-md-row justify-space-between align-start">
              <div class="d-flex align-center mb-4 mb-md-0">
                <v-avatar size="56" color="primary" variant="tonal" class="mr-4">
                  <v-icon color="primary" size="32">mdi-printer</v-icon>
                </v-avatar>
                <div>
                  <h2 class="nutritionprintmanage__title mb-1">營養評估單列印管理</h2>
                  <p class="nutritionprintmanage__subtitle mb-0">
                    選擇住民並勾選要列印的營養評估單，支援多筆批次列印。
                  </p>
                </div>
              </div>
              <div class="d-flex align-center ga-2">
                <v-btn color="primary" variant="flat" prepend-icon="mdi-arrow-left" @click="goNutrition">
                  回營養評估單頁面
                </v-btn>
              </div>
            </div>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12" md="3">
          <v-card rounded="xl" variant="outlined" class="nutritionprintmanage__card">
            <v-card-title class="nutritionprintmanage__card-title">病歷資料列表</v-card-title>
            <v-card-text class="mt-2">
              <v-text-field v-model="searchKey" prepend-inner-icon="mdi-magnify" label="搜尋" variant="outlined"
                density="comfortable" hide-details></v-text-field>

              <div style="overflow: auto">
                <v-list class="mt-2" height="60vh">
                  <v-list-item v-for="(item, i) in searchfilter" :key="i" :active="model === i"
                    @click="getUserAccounting(item, i)" color="primary">
                    <template #prepend>
                      <v-icon class="mx-2">mdi-account</v-icon>
                    </template>
                    <v-list-item-title>{{ item.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>病歷號:{{ item.p_code }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="9">
          <v-card rounded="xl" variant="outlined" class="nutritionprintmanage__card">
            <v-card-title class="nutritionprintmanage__card-title">
              營養評估單列表
              <v-spacer></v-spacer>
              <v-chip v-if="selectUser.name" variant="tonal" color="primary" size="small">
                {{ selectUser.name }} 病歷號:{{ selectUser.p_code }}
                <!-- 床號:{{ selectUser.bed_name }} -->
              </v-chip>
            </v-card-title>
            <v-card-text>
              <v-table fixed-header class="nutritionprintmanage__table text-no-wrap">
                <thead>
                  <tr>
                    <th>選取</th>
                    <th>評估日期</th>
                    <th>體重</th>
                    <th>BMI</th>
                    <th>飲食處方</th>
                    <th>熱量(Kcal)</th>
                    <th>醣類(%)</th>
                    <th>醣類(g)</th>
                    <th>蛋白質(%)</th>
                    <th>蛋白質(g)</th>
                    <th>脂肪(%)</th>
                    <th>脂肪(g)</th>
                    <th>營養建議</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in nutritionfilter" :key="item.raw?.snkey || index">
                    <td>
                      <v-checkbox :model-value="item.check"
                        @update:model-value="(val) => updateCheckStatus(item.raw.snkey, val)" density="comfortable"
                        hide-details></v-checkbox>
                    </td>
                    <td>{{ item.raw.date }}</td>
                    <td>{{ item.raw.weight }}</td>
                    <td>{{ item.raw.bmi }}</td>
                    <td>{{ item.raw.dietprescription }}</td>
                    <td>{{ item.raw.kcal }}</td>
                    <td>{{ item.raw.carbohydrate }}</td>
                    <td>{{ item.raw.carbohydrate_g }}</td>
                    <td>{{ item.raw.protein }}</td>
                    <td>{{ item.raw.protein_g }}</td>
                    <td>{{ item.raw.fat }}</td>
                    <td>{{ item.raw.fat_g }}</td>
                    <td class="text-truncate" style="max-width: 200px;">{{ item.raw.suggest }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>

          <v-card class="mt-2 nutritionprintmanage__card" rounded="xl" variant="outlined">
            <v-card-title class="nutritionprintmanage__card-title d-flex">
              已選取資料 - 已選取 {{ checkedNutritionfilter.length }} 筆
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="flat" prepend-icon="mdi-printer" @click="printConfirm"
                v-if="checkedNutritionfilter.length > 0">
                確認列印
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-table fixed-header class="nutritionprintmanage__table text-no-wrap">
                <thead>
                  <tr>
                    <th></th>
                    <th>病歷號</th>
                    <th>姓名</th>
                    <th>床號</th>
                    <th>評估日期</th>
                    <th>體重</th>
                    <th>BMI</th>
                    <th>飲食處方</th>
                    <th>熱量(Kcal)</th>
                    <th>醣類(%)</th>
                    <th>醣類(g)</th>
                    <th>蛋白質(%)</th>
                    <th>蛋白質(g)</th>
                    <th>脂肪(%)</th>
                    <th>脂肪(g)</th>
                    <th>營養建議</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in checkedNutritionfilter" :key="item.raw?.snkey || index">
                    <td>
                      <v-btn icon variant="text" color="error" size="small"
                        @click="updateCheckStatus(item.raw.snkey, false)">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </td>
                    <td>
                      {{ item.raw.p_code }}
                    </td>
                    <td>{{ item.raw.name }}</td>
                    <td>{{ item.raw.bed_name }}</td>
                    <td>{{ item.raw.date }}</td>
                    <td>{{ item.raw.weight }}</td>
                    <td>{{ item.raw.bmi }}</td>
                    <td>{{ item.raw.dietprescription }}</td>
                    <td>{{ item.raw.kcal }}</td>
                    <td>{{ item.raw.carbohydrate }}</td>
                    <td>{{ item.raw.carbohydrate_g }}</td>
                    <td>{{ item.raw.protein }}</td>
                    <td>{{ item.raw.protein_g }}</td>
                    <td>{{ item.raw.fat }}</td>
                    <td>{{ item.raw.fat_g }}</td>
                    <td class="text-truncate" style="max-width: 200px;">{{ item.raw.suggest }}</td>
                  </tr>
                </tbody>
              </v-table>
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
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const store = useStore()
const { proxy } = getCurrentInstance()
const router = useRouter()

const items = ref([])
const NutritionItems = ref([])
const searchKey = ref('')
const model = ref(null)
const selectUser = ref({})

const normalizeRecord = (row) => {
  const parsed = JSON.parse(row.datalist || '{}')
  return {
    ...parsed,
    snkey: row.snkey,
  }
}

// 根据 u_snkey 获取用户信息
const getUserInfoBySnkey = (uSnkey) => {
  if (!uSnkey) return null
  return items.value.find((user) => user.snkey === uSnkey) || null
}

// 格式化 nursingAssessment 数据（参考 Servicerecord/PrintPage.vue）
const formatNursingAssessment = (nursingAssessment, field) => {
  if (!nursingAssessment || !nursingAssessment[field]) {
    return '—'
  }
  const value = nursingAssessment[field]
  if (Array.isArray(value)) {
    return value.length > 0 ? value.toString() : '—'
  }
  return value || '—'
}

const searchfilter = computed(() => {
  if (items.value.length === 0) {
    return []
  }

  const keys = searchKey.value.split(' ')
  let str = ''

  return keys.reduce(
    (prev, element) => {
      return prev.filter((item) => {
        str = JSON.stringify(item).toUpperCase()
        if (str.includes(element.toUpperCase())) {
          return item
        }
      })
    },
    items.value
  )
})

const nutritionfilter = computed(() => {
  if (!selectUser.value?.snkey) {
    return []
  }
  return NutritionItems.value
    .map((item) => {
      const parsed = normalizeRecord(item)
      const data = {
        ...parsed,
        check: item.check || false,
        p_code: selectUser.value.p_code,
        name: selectUser.value.name,
        sex: selectUser.value.sex,
        birthday: selectUser.value.birthday,
        height: selectUser.value.height,
        hadadisease: selectUser.value.hadadisease,
      }
      return {
        raw: data,
        check: item.check || false,
      }
    })
    .sort((a, b) => {
      return parseInt(a.raw.date) < parseInt(b.raw.date) ? 1 : -1
    })
})

const checkedNutritionfilter = computed(() => {
  const checked = NutritionItems.value
    .filter((item) => item.check === true)
    .map((item) => {
      const parsed = normalizeRecord(item)
      // 根据 u_snkey 获取对应用户信息
      const userInfo = getUserInfoBySnkey(parsed.u_snkey) || selectUser.value
      const data = {
        ...parsed,
        // 基本資料（用於列印，NutritionMultiPrint.vue 需要）
        p_code: userInfo?.p_code || parsed.p_code || '',
        name: userInfo?.name || parsed.name || '',
        sex: userInfo?.sex || parsed.sex || '',
        birthday: userInfo?.birthday || parsed.birthday || '',
        height: userInfo?.height || parsed.height || '',
        hadadisease: userInfo?.hadadisease || parsed.hadadisease || '',
        bed_name: userInfo?.bed_name || parsed.bed_name || '',
        // nursingAssessment 資料（用於列印腸胃狀況等）
        nursingAssessment: userInfo?.nursingAssessment || parsed.nursingAssessment || null,
      }
      return {
        raw: data,
      }
    })
  const sorted = sortBybedname(checked.map(item => item.raw))
  return sorted.map(item => ({ raw: item }))
})

const sortBybedname = (items) => {
  return items.sort((a, b) => {
    const aBed = a.bed_name
    const bBed = b.bed_name

    if (aBed === bBed) {
      return 0
    } else if (aBed === null) {
      return 1
    } else if (bBed === null) {
      return -1
    } else {
      return aBed > bBed ? 1 : -1
    }
  })
}

const goNutrition = () => {
  router.push('/main/Documents/Nutrition')
}

const getAllUserData = async () => {
  try {
    const response = await api.get('user')
    if (!response || !Array.isArray(response)) {
      items.value = []
      return
    }
    const data = response
      .map((item) => {
        try {
          const parsed = JSON.parse(item.datalist || '{}')
          return {
            ...parsed,
            snkey: item.snkey,
          }
        } catch (parseError) {
          console.error('Parse datalist error:', parseError, item)
          return null
        }
      })
      .filter(Boolean)
    items.value = sortBybedname(data)
  } catch (error) {
    console.error('Get all data error:', error)
    items.value = []
  }
}

const getNutritionByUser = async (userSnkey) => {
  if (!userSnkey) {
    NutritionItems.value = []
    return
  }

  try {
    const payload = {
      key: 'u_snkey',
      value: userSnkey,
    }
    const url = `byjson/searchByKeyValue/${store.state.databaseName}/nutrition`
    const response = await api.options(url, payload)

    if (response && response.length > 0) {
      NutritionItems.value = response.map((item) => ({
        ...item,
        check: false,
      }))
    } else {
      NutritionItems.value = []
    }
  } catch (error) {
    console.error('Get nutrition error:', error)
    NutritionItems.value = []
  }
}

const getUserAccounting = async (item, index) => {
  model.value = index
  selectUser.value = item
  await getNutritionByUser(item.snkey)
}

const updateCheckStatus = (snkey, checked) => {
  const item = NutritionItems.value.find((i) => i.snkey === snkey)
  if (item) {
    item.check = checked
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
    position: 'center',
  })

  if (result.isConfirmed) {
    const printData = checkedNutritionfilter.value.map(item => item.raw)
    
    sessionStorage.setItem('printData', JSON.stringify(printData))
    const routeData = router.resolve({
      path: '/print/nutritionmultiprint',
    })
    window.open(routeData.href, '_blank')
  }
}

onMounted(async () => {
  await getAllUserData()
})
</script>

<style scoped lang="scss">
.nutritionprintmanage {
  padding: 12px;
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

  &__card {
    border-color: var(--daycare-divider);
    box-shadow: 0 4px 12px rgba(74, 107, 95, 0.08);

    &-title {
      background: linear-gradient(135deg, rgba(168, 197, 181, 0.25), rgba(91, 143, 163, 0.2));
      color: rgba(53, 88, 80, 0.92);
      font-weight: 600;
      padding: 16px 24px;
    }
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
}
</style>
