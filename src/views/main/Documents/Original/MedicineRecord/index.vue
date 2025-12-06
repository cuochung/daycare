<template>
  <div class="medicine-record-list">
    <MedicalPrintOption ref="printOptionRef" :medical-record-items="medicalRecordItems"
      :eat-medicine-time-items="eatMedicineTimeItems" />

    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <v-sheet class="medicine-record-list__hero mb-4" rounded="xl" elevation="0">
            <div class="d-flex flex-column flex-md-row justify-space-between align-start">
              <div class="d-flex align-center mb-4 mb-md-0">
                <v-avatar size="56" color="primary" variant="tonal" class="mr-4">
                  <v-icon color="primary" size="32">mdi-pill</v-icon>
                </v-avatar>
                <div>
                  <h2 class="medicine-record-list__title mb-1">
                    就醫及藥品紀錄維護
                  </h2>
                  <p class="medicine-record-list__subtitle mb-0">{{ store.state.uData?.p_code }} / {{
                    store.state.uData?.name }}</p>
                </div>
              </div>
              <div class="d-flex align-center ga-2">
                <v-text-field v-model="printMonth" label="列印月份設定" type="month" variant="outlined" density="comfortable"
                  hide-details style="max-width: 200px;" />
                <v-menu location="bottom">
                  <template #activator="{ props: menuProps }">
                    <v-btn color="primary" variant="flat" v-bind="menuProps">
                      功能
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="printConfirm">
                      <template #prepend>
                        <v-icon>mdi-pill</v-icon>
                      </template>
                      <v-list-item-title>
                        列印藥單
                        <span class="ml-2">每頁</span>
                        <input v-model="printPerPage" type="text" @click.stop maxlength="2"
                          style="width: 30px; text-align: center; border: 1px solid #ccc; border-radius: 4px;" />
                        <span class="ml-1">筆</span>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="goPrint">
                      <template #prepend>
                        <v-icon>mdi-printer</v-icon>
                      </template>
                      <v-list-item-title>前往多筆列印頁面</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <!-- 醫院就診紀錄 -->
          <v-card class="mb-4">
            <v-card-title
              class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between ga-4 py-4">
              <h3 class="text-h6 font-weight-bold mb-0">醫院就診紀錄</h3>
              <div class="d-flex flex-column flex-md-row align-stretch align-md-center ga-3 flex-grow-1 flex-md-grow-0"
                style="width: 100%;">
                <v-text-field v-model="searchKey" prepend-inner-icon="mdi-magnify" label="搜尋" variant="outlined"
                  density="comfortable" hide-details class="flex-md-grow-1" style="min-width: 200px;" />
                <v-autocomplete v-model="sortKey" :items="sortItems" label="排序依據" variant="outlined"
                  density="comfortable" hide-details item-title="text" return-object
                  style="min-width: 160px; max-width: 200px;" />
                <div class="d-flex align-center ga-2 flex-shrink-0">
                  <v-btn color="primary" variant="flat" prepend-icon="mdi-plus-circle" @click="openAdd">
                    新增就診紀錄
                  </v-btn>
                  <MedicalRecordAdd ref="editProcessRef" :medical-record-items="medicalRecordItems"
                    @get-medical-data="getMedicalData" />
                </div>
              </div>
            </v-card-title>
            <v-card-text>
              <PaginatedIterator :items="filteredItems" :items-per-page-options="itemsPerPageOptions"
                :items-per-page="itemsPerPage" @update:items-per-page="itemsPerPage = $event">
                <template #default="{ items }">
                  <v-table fixed-header class="text-no-wrap" height="50vh">
                    <thead style="background-color: #e3f2fd">
                      <tr>
                        <th></th>
                        <th>就診日</th>
                        <th>醫院</th>
                        <th>科別</th>
                        <th>醫師</th>
                        <th>回診日期</th>
                        <th>就診主因</th>
                        <th v-if="store.state?.cData?.isShowCreaterName">紀錄人姓名</th>
                        <th v-if="store.state?.cData?.isShowCreaterInfo">紀錄人紀錄</th>
                        <th v-if="store.state?.cData?.isShowEditerInfo">修改紀錄</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="index" @click="selectMedicalRecord(item.raw)"
                        style="cursor: pointer;">
                        <td class="text-center">
                          <v-menu location="bottom">
                            <template #activator="{ props: menuProps }">
                              <v-btn v-bind="menuProps" variant="text" icon="mdi-dots-vertical" color="primary"
                                @click.stop />
                            </template>
                            <v-list>
                              <v-list-item @click.stop="edit(item.raw)">
                                <template #prepend>
                                  <v-icon color="primary">mdi-pencil</v-icon>
                                </template>
                                <v-list-item-title>修改</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click.stop="del(item.raw)">
                                <template #prepend>
                                  <v-icon color="error">mdi-delete</v-icon>
                                </template>
                                <v-list-item-title>刪除</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click.stop="print(item.raw)">
                                <template #prepend>
                                  <v-icon color="info">mdi-printer</v-icon>
                                </template>
                                <v-list-item-title>列印</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click.stop="medicalCopy(item.raw)">
                                <template #prepend>
                                  <v-icon color="success">mdi-content-copy</v-icon>
                                </template>
                                <v-list-item-title>延續用藥</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </td>
                        <td>{{ item.raw.date || '—' }}</td>
                        <td>{{ item.raw.hospitaldata.text || '—' }}</td>
                        <td>{{ item.raw.branchdata.text || '—' }}</td>
                        <td>{{ item.raw.doctordata.text || '—' }}</td>
                        <td>{{ item.raw.back_date || '—' }}</td>
                        <td>{{ item.raw.main_cause_of_treatmentdata.text || '—' }}</td>
                        <td v-if="store.state?.cData?.isShowCreaterName">
                          {{ item.raw.createInfo.name ? item.raw.createInfo.name.split('(')[0] : '—' }}
                        </td>
                        <td v-if="store.state?.cData?.isShowCreaterInfo">
                          {{ item.raw.createInfo.name || '—' }}
                        </td>
                        <td v-if="store.state?.cData?.isShowEditerInfo" class="text-truncate" style="max-width: 400px;">
                          {{ item.raw.editInfo.name || '—' }}
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

          <!-- 用藥內容 -->
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center ga-2">
                <h3 class="text-h6 font-weight-bold">用藥內容</h3>
                <div v-if="medicalRecordList.date" class="text-body-2 text-medium-emphasis">
                  ({{ medicalRecordList.date }} / {{ medicalRecordList.hospitaldata.text }} /
                  {{ medicalRecordList.branchdata.text }})
                </div>
              </div>
              <div v-if="medicalRecordList.date" class="d-flex align-center ga-2">
                <v-btn color="primary" variant="flat" prepend-icon="mdi-plus-circle" @click="openAddMedicine">
                  新增用藥紀錄
                </v-btn>
                <MedicineRecordAdd ref="editMedicineProcessRef"
                  :medicine-record-items="medicineRecordItems"
                  :medical-record-list="medicalRecordList"
                  :medical-record-items="medicineRecordItems"
                  @get-medicine-record="getMedicineRecord" />
              </div>
            </v-card-title>
            <v-card-text>
              <v-table fixed-header class="text-no-wrap">
                <thead style="background-color: #e3f2fd">
                  <tr>
                    <th></th>
                    <th>藥品</th>
                    <th>單位</th>
                    <th>劑量</th>
                    <th>用量</th>
                    <th>給藥次數</th>
                    <th>開始日期</th>
                    <th>藥物用完資訊</th>
                    <th>停藥</th>
                    <th v-if="store.state?.cData?.isShowCreaterName">紀錄人姓名</th>
                    <th v-if="store.state?.cData?.isShowCreaterInfo">紀錄人紀錄</th>
                    <th v-if="store.state?.cData?.isShowEditerInfo">修改紀錄</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in medicineRecordItems" :key="index">
                    <td class="text-center">
                      <v-icon color="primary" class="mr-2" @click.stop="editMedicineRecord(item)">
                        mdi-pencil
                      </v-icon>
                      <v-icon color="error" @click.stop="delMedicineRecord(item)">mdi-delete</v-icon>
                    </td>
                    <td>{{ item.medicinedata ? item.medicinedata.text : '—' }}</td>
                    <td>{{ item.unitdata ? item.unitdata.text : '—' }}</td>
                    <td>{{ item.dosage || '—' }}</td>
                    <td>{{ item.quantity || '—' }}</td>
                    <td>{{ item.medicine_counts || '—' }}</td>
                    <td>{{ item.start_date || '—' }}</td>
                    <td>{{ item.medicineEndInfo || '—' }}</td>
                    <td @click.stop>
                      <v-checkbox
                        :model-value="item.stop === 'true' || item.stop === true"
                        @update:model-value="(val) => stopMedicine(item, val)"
                        hide-details
                        density="compact"
                      />
                    </td>
                    <td v-if="store.state?.cData?.isShowCreaterName">
                      {{ item.createInfo.name ? item.createInfo.name.split('(')[0] : '—' }}
                    </td>
                    <td v-if="store.state?.cData?.isShowCreaterInfo">{{ item.createInfo.name || '—' }}</td>
                    <td v-if="store.state?.cData?.isShowEditerInfo" class="text-truncate" style="max-width: 400px;">
                      {{ item.editInfo.name || '—' }}
                    </td>
                  </tr>
                  <tr v-if="!medicineRecordItems || medicineRecordItems.length === 0">
                    <td :colspan="medicineColumnCount" class="text-center text-medium-emphasis py-8">
                      目前沒有資料。
                    </td>
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
import { ref, reactive, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'
import PaginatedIterator from '@/components/PaginatedIterator.vue'
import MedicalRecordAdd from './MedicalRecordAdd.vue'
import MedicineRecordAdd from './MedicineRecordAdd.vue'
import MedicalPrintOption from './PrintOption.vue'

const store = useStore()
const router = useRouter()
const { proxy } = getCurrentInstance()

const searchKey = ref('')
const itemsPerPageOptions = [10, 20, 30]
const itemsPerPage = ref(10)
const medicalRecordItems = ref([])
const medicalRecordList = ref({})
const medicineRecordItems = ref([])
const eatMedicineTimeItems = ref([])
const printMonth = ref(dayjs().format('YYYY-MM'))
const loading = ref(false)
const printPerPage = ref('10')
const sortKey = ref(null)

const editProcessRef = ref(null)
const editMedicineProcessRef = ref(null)
const printOptionRef = ref(null)

const sortItems = [
  { text: '建檔日', key: 'snkey', type: 'int' },
  { text: '就診日', key: 'date', type: 'date' },
]

const columnCount = computed(() => {
  let count = 7 // 功能、就診日、醫院/科別、科別、醫師、回診日期、就診主因
  if (store.state?.cData?.isShowCreaterName) count++
  if (store.state?.cData?.isShowCreaterInfo) count++
  if (store.state?.cData?.isShowEditerInfo) count++
  return count
})

const medicineColumnCount = computed(() => {
  let count = 9 // 功能、藥品、單位、劑量、用量、給藥次數、開始日期、藥物用完資訊、停藥
  if (store.state?.cData?.isShowCreaterName) count++
  if (store.state?.cData?.isShowCreaterInfo) count++
  if (store.state?.cData?.isShowEditerInfo) count++
  return count
})

const filteredItems = computed(() => {
  console.log('filteredItems medicalRecordItems', medicalRecordItems.value)

  if (!searchKey.value) {
    return medicalRecordItems.value
  }

  const keys = searchKey.value.split(' ')
  return keys
    .reduce((prev, element) => {
      return prev.filter((item) => {
        const str = JSON.stringify(item.raw || item).toUpperCase()
        return str.includes(element.toUpperCase())
      })
    }, medicalRecordItems.value.map(item => ({ raw: item })))
})

const sort = (items, key, type) => {
  return items.sort((a, b) => {
    if (type === 'int') {
      return Number(a[key]) < Number(b[key]) ? 1 : -1
    } else {
      return a[key] < b[key] ? 1 : -1
    }
  })
}

// const sortBy = (key) => {
//   if (key === 'medicalRecordItems') {
//     medicalRecordItems.value = medicalRecordItems.value.sort((a, b) => {
//       return Number(a.snkey) < Number(b.snkey) ? 1 : -1
//     })
//   }

//   if (key === 'medicineRecordItems') {
//     medicineRecordItems.value = medicineRecordItems.value.sort((a, b) => {
//       return Number(a.snkey) < Number(b.snkey) ? 1 : -1
//     })
//   }
// }

const getMedicalData = async () => {
  try {
    let postData = {
      key: 'user_snkey',
      value: store.state.uData.snkey,
    }

    const response = await api.options(`byjson/searchByKeyValue/${store.state.databaseName}/medical_record`, postData)
    console.log('response', response)
    
    medicalRecordItems.value = response.map(item => ({
      ...JSON.parse(item.datalist),
      snkey: item.snkey,
    }))

    console.log('medicalRecordItems', medicalRecordItems.value)

  } catch (error) {
    console.error('getMedicalData error:', error)
    medicalRecordItems.value = []
    medicineRecordItems.value = []
  }
}

const getEatMedicineTime = async () => {
  try {
    const response = await api.get('eat_medicine_time')
    if (response && response.length) {
      eatMedicineTimeItems.value = response
    } else {
      eatMedicineTimeItems.value = []
    }
  } catch (error) {
    console.error('getEatMedicineTime error:', error)
    eatMedicineTimeItems.value = []
  }
}

const getMedicineRecord = async () => {
  if (!medicalRecordList.value.snkey) return

  try {
    const response = await api.options(
      `byjson/searchByKeyValue/${store.state.databaseName}/medicine_record`,
      {
        key: 'medical_snkey',
        value: medicalRecordList.value.snkey,
      }
    )

    if (response && response.length) {
      medicineRecordItems.value = response.map(item => ({
        ...JSON.parse(item.datalist),
        snkey: item.snkey,
      }))

      console.log('medicineRecordItems', medicineRecordItems.value)

      // sortBy('medicineRecordItems')
      store.showToastMulti({
        type: 'success',
        message: '用藥內容已載入',
        closeTime: 2,
      })
    } else {
      medicineRecordItems.value = []
    }
  } catch (error) {
    console.error('getMedicineRecord error:', error)
    medicineRecordItems.value = []
  }
}

const selectMedicalRecord = (item) => {
  medicalRecordList.value = item
  getMedicineRecord()
}

const openAdd = () => {
  if (editProcessRef.value && editProcessRef.value.openForAdd) {
    editProcessRef.value.openForAdd()
  }
}

const edit = (item) => {
  if (editProcessRef.value && editProcessRef.value.openForEdit) {
    editProcessRef.value.openForEdit(item)
  }
}

const del = async (delData) => {
  const result = await proxy?.$swal?.({
    title: '確認刪除？',
    text: '將連同相關用藥內容一同刪除，此操作無法復原，請再次確認。',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center',
  })

  if (!result?.isConfirmed) return

  try {
    // 刪除相關用藥內容
    const medicineResponse = await api.options(
      `medicinerecord/getMedicineRecordByMedicalSnkey/${store.state.databaseName}/${delData.snkey}`
    )

    if (medicineResponse && medicineResponse.length) {
      for (const item of medicineResponse) {
        await delMedicineRecordMulti(item)
      }
    }

    // 刪除就診紀錄
    const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const postData = {
      snkey: delData.snkey,
      tablename: 'medical_record',
      info: JSON.stringify({
        ...delData,
        delman: store.state.pData.username + '(' + timeNow + ')',
      }),
    }

    const response = await api.delete('medical_record', postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已刪除',
        closeTime: 2,
      })
      getMedicalData()
      medicalRecordList.value = {}
      medicineRecordItems.value = []
    } else {
      store.showToastMulti({
        type: 'error',
        message: '刪除失敗，請稍後再試',
        closeTime: 3,
      })
    }
  } catch (error) {
    console.error('del error:', error)
    store.showToastMulti({
      type: 'error',
      message: '刪除失敗，請稍後再試',
      closeTime: 3,
    })
  }
}

const delMedicineRecordMulti = async (delData) => {
  const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const postData = {
    snkey: delData.snkey,
    tablename: 'medicine_record',
    info: JSON.stringify({
      ...delData,
      delman: store.state.pData.username + '(' + timeNow + ')',
    }),
  }

  try {
    const response = await api.delete('medicine_record', postData)
    if (response?.state == 1) {
      medicineRecordItems.value = []
    }
  } catch (error) {
    console.error('delMedicineRecordMulti error:', error)
  }
}

const delMedicineRecord = async (delData) => {
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

  if (!result?.isConfirmed) return

  const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const postData = {
    snkey: delData.snkey,
    tablename: 'medicine_record',
    info: JSON.stringify({
      ...delData,
      delman: store.state.pData.username + '(' + timeNow + ')',
    }),
  }

  try {
    const response = await api.delete('medicine_record', postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已刪除',
        closeTime: 2,
      })
      getMedicineRecord()
    } else {
      store.showToastMulti({
        type: 'error',
        message: '刪除失敗，請稍後再試',
        closeTime: 3,
      })
    }
  } catch (error) {
    console.error('delMedicineRecord error:', error)
    store.showToastMulti({
      type: 'error',
      message: '刪除失敗，請稍後再試',
      closeTime: 3,
    })
  }
}

const openAddMedicine = () => {
  if (editMedicineProcessRef.value && editMedicineProcessRef.value.openForAdd) {
    editMedicineProcessRef.value.openForAdd()
  }
}

const editMedicineRecord = (item) => {
  if (editMedicineProcessRef.value && editMedicineProcessRef.value.openForEdit) {
    editMedicineProcessRef.value.openForEdit(item)
  }
}

const stopMedicine = async (item, newValue) => {
  // 更新 item.stop 的值
  item.stop = newValue ? 'true' : ''

  // 確保 editInfo 存在
  if (!item.editInfo || !Array.isArray(item.editInfo)) {
    item.editInfo = []
  }

  // 添加修改記錄到 editInfo
  item.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })

  // 構建完整的 postData，參照 MedicineRecordAdd.vue 的 handleEdit
  const postData = {
    snkey: item.snkey,
    datalist: JSON.stringify(item),
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }

  try {
    const response = await api.post('medicine_record', postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已修改',
        closeTime: 2,
      })
      // 刷新用藥記錄列表
      await getMedicineRecord()
    } else {
      store.showToastMulti({
        type: 'error',
        message: '修改失敗，請稍後再試',
        closeTime: 3,
      })
    }
  } catch (error) {
    console.error('stopMedicine error:', error)
    store.showToastMulti({
      type: 'error',
      message: '修改失敗，請稍後再試',
      closeTime: 3,
    })
  }
}

const printConfirm = async () => {
  const result = await proxy?.$swal?.({
    title: '確認顯示列印藥單畫面？',
    text: '列印畫面將在新的分頁中顯示，請再次確認。',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center',
  })

  if (!result?.isConfirmed) return

  try {
    // 取得該病歷所有用藥資料
    const response = await api.options(
      `byjson/searchByKeyValue/${store.state.databaseName}/medicine_record`,
      {
        key: 'user_snkey',
        value: store.state.uData.snkey,
      }
    )

    if (!response || !response.length) {
      store.showToastMulti({
        type: 'warning',
        message: '暫無符合資料,請重新確認月份',
        closeTime: 3,
      })
      return
    }

    // 判斷本月藥物中還在使用的
    let medicineData = response.filter((i) => {
      if (
        i.stop != 'true' &&
        dayjs(printMonth.value).format('YYYY-MM') >= dayjs(i.start_date).format('YYYY-MM') &&
        dayjs(printMonth.value).format('YYYY-MM') <=
        dayjs(i.medicineEndInfo?.substring(3, 13)).format('YYYY-MM')
      ) {
        i.end_date = i.medicineEndInfo.substring(3, 13)
        return i
      }
    })

    if (medicineData.length === 0) {
      store.showToastMulti({
        type: 'warning',
        message: '暫無符合資料,請重新確認月份',
        closeTime: 3,
      })
      return
    }

    // 取得各藥物的就診紀錄
    medicineData = medicineData.filter((i) => {
      const matchmedicalRecord = medicalRecordItems.value.find((j) => {
        return i.medical_snkey == j.snkey
      })

      if (matchmedicalRecord) {
        i.medical = matchmedicalRecord
        return i
      }
    })

    // 取得各藥物的吃藥時間紀錄
    medicineData = medicineData.filter((i) => {
      const matcheatMedicineTime = eatMedicineTimeItems.value.find((j) => {
        return i.eat_medicine_time_snkey == j.snkey
      })

      if (matcheatMedicineTime) {
        i.eat_medicine_time = matcheatMedicineTime
        return i
      }
    })

    medicineData = medicineData.sort((a, b) => {
      return Number(a.medical_snkey) < Number(b.medical_snkey) ? 1 : -1
    })

    const printData = {
      printMonth: printMonth.value,
      medicineData: medicineData,
      printPerPage: printPerPage.value,
    }

    // 送出資料到列印頁面
    sessionStorage.setItem('printData', JSON.stringify(printData))
    const routeData = router.resolve({
      path: '/print/medicineprint',
    })
    window.open(routeData.href, '_blank')
  } catch (error) {
    console.error('printConfirm error:', error)
    store.showToastMulti({
      type: 'error',
      message: '列印失敗，請稍後再試',
      closeTime: 3,
    })
  }
}

const goPrint = () => {
  router.push('/main/printmanager/medicinerecordprintmanage')
}

const medicalCopy = async (item) => {
  const result = await proxy?.$swal?.({
    title: '確認延續用藥？',
    text: '將複製就診紀錄及用藥內容，請再次確認。',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center',
  })

  if (!result?.isConfirmed) return

  try {
    const medicalRecord = { ...item }

    // 沒有回診日的時候,就設定成跟上次的就診日一樣
    if (medicalRecord.back_date == '0000-00-00') {
      medicalRecord.back_date = medicalRecord.date
    }

    const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const postData = {
      date: medicalRecord.back_date,
      user_snkey: medicalRecord.user_snkey,
      hospital_snkey: medicalRecord.hospital_snkey,
      branch_snkey: medicalRecord.branch_snkey,
      doctor_snkey: medicalRecord.doctor_snkey,
      outpatient: medicalRecord.outpatient,
      main_cause_of_treatment_snkey: medicalRecord.main_cause_of_treatment_snkey,
      description: medicalRecord.description,
      count: Number(medicalRecord.count) + 1,
      create_man: store.state.pData.username + '(' + timeNow + ')',
    }

    const response = await api.add('medical_record', postData)
    if (response?.state == 1) {
      await createMedicineRecord(medicalRecord, response.snkey)
      store.showToastMulti({
        type: 'success',
        message: '已新增資料',
        closeTime: 2,
      })
      getMedicalData()
    } else {
      store.showToastMulti({
        type: 'error',
        message: '新增失敗，請稍後再試',
        closeTime: 3,
      })
    }
  } catch (error) {
    console.error('medicalCopy error:', error)
    store.showToastMulti({
      type: 'error',
      message: '新增失敗，請稍後再試',
      closeTime: 3,
    })
  }
}

const medicineEndInfoMath = (medicineList, intervalDay, timeArr) => {
  const addday = Math.ceil(medicineList.medicine_counts / timeArr.length)
  const intervaldaycount = Math.floor((medicineList.medicine_counts - 1) / timeArr.length)
  const last = (medicineList.medicine_counts - 1) % timeArr.length
  const selectIndex = timeArr.indexOf(medicineList.start_time)
  let nextDay = 0

  if (selectIndex + last >= timeArr.length) {
    nextDay = 1
  }
  const newindex = (selectIndex + last) % timeArr.length

  if (intervalDay > 1) {
    return (
      '日期:' +
      dayjs(medicineList.start_date)
        .add(addday - 1 + intervaldaycount * (intervalDay - 1) + nextDay, 'day')
        .format('YYYY-MM-DD') +
      ' 時段:' +
      timeArr[newindex]
    )
  } else {
    return (
      '日期:' +
      dayjs(medicineList.start_date)
        .add(addday - 1 + nextDay, 'day')
        .format('YYYY-MM-DD') +
      ' 時段:' +
      timeArr[newindex]
    )
  }
}

const createMedicineRecord = async (medicalRecord, newMedicalRecordSnkey) => {
  try {
    const response = await api.options(
      `medicinerecord/getMedicineRecordByMedicalSnkey/${store.state.databaseName}/${medicalRecord.snkey}`
    )

    if (!response || !response.length) return

    const newMedicineRecord = []

    for (const item of response) {
      // 取得新的用藥日期及時間
      let newStartDate = item.medicineEndInfo.substr(3, 10)
      let newStartTime = item.medicineEndInfo.substr(17, 2)

      const eatMedicineTime = eatMedicineTimeItems.value.find((item2) => {
        return item2.snkey == item.eat_medicine_time_snkey
      })

      if (eatMedicineTime) {
        const intervalDay = eatMedicineTime.day
        const timeArr = eatMedicineTime.time.split(',')
        if (timeArr.length == timeArr.indexOf(newStartTime) + 1) {
          newStartDate = dayjs(newStartDate).add(intervalDay, 'day').format('YYYY-MM-DD')
          newStartTime = timeArr[0]
        } else {
          newStartTime = timeArr[timeArr.indexOf(newStartTime) + 1]
        }

        const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const newItem = {
          ...item,
          medical_snkey: newMedicalRecordSnkey,
          start_date: newStartDate,
          start_time: newStartTime,
          medicineEndInfo: medicineEndInfoMath(item, intervalDay, timeArr),
          create_man: store.state.pData.username + '(' + timeNow + ')',
          edit_man: '',
        }

        delete newItem.snkey
        delete newItem.name
        delete newItem.method_name
        delete newItem.unit_name
        delete newItem.effect

        newMedicineRecord.push(newItem)
      }
    }

    // 新增資料到資料庫中(多筆型)
    if (newMedicineRecord.length > 0) {
      await api.options(`general/addMulti/${store.state.databaseName}/medicine_record`, newMedicineRecord)
    }
  } catch (error) {
    console.error('createMedicineRecord error:', error)
  }
}

const print = (item) => {
  if (printOptionRef.value && printOptionRef.value.enterProcess) {
    printOptionRef.value.enterProcess(item)
  }
}

watch(sortKey, (newVal) => {
  if (newVal && newVal.key) {
    medicalRecordItems.value = sort([...medicalRecordItems.value], newVal.key, newVal.type)
  }
})

onMounted(async () => {
  await getMedicalData()
  await getEatMedicineTime()
})
</script>

<style lang="scss" scoped>
.medicine-record-list {
  margin-bottom: 8vh;

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
}
</style>
