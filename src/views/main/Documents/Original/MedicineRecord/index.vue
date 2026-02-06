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
                  
                <v-select v-model="sortKey" :items="sortItems" label="排序依據" variant="outlined"
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
                          <v-menu
                            location="bottom"
                            :model-value="openMenuIndex === index"
                            @update:model-value="(val) => openMenuIndex = val ? index : null"
                          >
                            <template #activator="{ props: menuProps }">
                              <v-btn v-bind="menuProps" variant="text" icon="mdi-dots-vertical" color="primary"
                                @click.stop />
                            </template>
                            <v-list>
                              <v-list-item @click.stop="edit(item.raw, index)">
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
                        <td>{{ item.raw.hospitaldata?.text || item.raw.hospital_name || '—' }}</td>
                        <td>{{ item.raw.branchdata?.text || item.raw.branch_name || '—' }}</td>
                        <td>{{ item.raw.doctordata?.text || item.raw.doctor_name || '—' }}</td>
                        <td>{{ item.raw.back_date || '—' }}</td>
                        <td>{{ item.raw.main_cause_of_treatmentdata?.text || item.raw.main_cause_of_treatment_name || '—' }}</td>
                        <td v-if="store.state?.cData?.isShowCreaterName">
                          {{ item.raw.createInfo?.name ? item.raw.createInfo.name.split('(')[0] : '—' }}
                        </td>
                        <td v-if="store.state?.cData?.isShowCreaterInfo">
                          {{ item.raw.createInfo?.name || '—' }}
                        </td>
                        <td v-if="store.state?.cData?.isShowEditerInfo" class="text-truncate" style="max-width: 400px;">
                          {{ (Array.isArray(item.raw.editInfo) && item.raw.editInfo.length > 0 ? item.raw.editInfo[0] : item.raw.editInfo)?.name || '—' }}
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
                  ({{ medicalRecordList.date }} / {{ medicalRecordList.hospitaldata?.text || medicalRecordList.hospital_name }} /
                  {{ medicalRecordList.branchdata?.text || medicalRecordList.branch_name }})
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
                      {{ item.createInfo?.name ? item.createInfo.name.split('(')[0] : '—' }}
                    </td>
                    <td v-if="store.state?.cData?.isShowCreaterInfo">{{ item.createInfo?.name || '—' }}</td>
                    <td v-if="store.state?.cData?.isShowEditerInfo" class="text-truncate" style="max-width: 400px;">
                      {{ (Array.isArray(item.editInfo) && item.editInfo.length > 0 ? item.editInfo[0] : item.editInfo)?.name || '—' }}
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
import { ref, reactive, computed, watch, onMounted, getCurrentInstance, nextTick } from 'vue'
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
const printPerPage = ref('10')
const sortKey = ref({ "text": "就診日", "key": "date", "type": "date" })
const openMenuIndex = ref(null)

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

  // 先進行搜尋過濾
  let filtered = medicalRecordItems.value

  if (searchKey.value) {
    const keys = searchKey.value.split(' ')
    filtered = keys.reduce((prev, element) => {
      return prev.filter((item) => {
        const str = JSON.stringify(item).toUpperCase()
        return str.includes(element.toUpperCase())
      })
    }, filtered)
  }

  // 轉換為 PaginatedIterator 需要的格式
  let result = filtered.map(item => ( item ))

  // 再進行排序（如果有設定排序依據）
  if (sortKey.value && sortKey.value.key) {
    result = sort([...result], sortKey.value.key, sortKey.value.type)
  }
  return result
})

const sort = (items, key, type) => {
  return items.sort((a, b) => {
    // 取得實際的資料物件
    const aItem = a.raw || a
    const bItem = b.raw || b
    const aValue = aItem[key]
    const bValue = bItem[key]

    // 處理空值：空值排在最後
    if (!aValue && !bValue) return 0
    if (!aValue) return 1
    if (!bValue) return -1

    if (type === 'int') {
      // 數字排序：大值在前（降序）
      const aNum = Number(aValue)
      const bNum = Number(bValue)
      if (isNaN(aNum) || isNaN(bNum)) {
        // 如果無法轉換為數字，則按字串比較
        return String(aValue) < String(bValue) ? 1 : -1
      }
      return aNum < bNum ? 1 : -1
    } else if (type === 'date') {
      // 日期排序：較新日期在前（降序）
      const aDate = dayjs(aValue)
      const bDate = dayjs(bValue)

      if (!aDate.isValid() && !bDate.isValid()) return 0
      if (!aDate.isValid()) return 1
      if (!bDate.isValid()) return -1

      // 降序：較新日期在前
      return aDate.isBefore(bDate) ? 1 : -1
    } else {
      // 字串排序：降序
      return String(aValue) < String(bValue) ? 1 : -1
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
    
    // 取得所有關聯資料
    const [hospitalResponse, branchResponse, doctorResponse, mainCauseResponse] = await Promise.all([
      api.get('hospital').catch(() => []),
      api.get('branch').catch(() => []),
      api.get('doctor').catch(() => []),
      api.get('main_cause_of_treatment').catch(() => []),
    ])

    // 建立關聯資料的映射表
    const hospitalMap = new Map(hospitalResponse.map(item => [item.snkey, { snkey: item.snkey, text: item.name }]))
    const branchMap = new Map(branchResponse.map(item => [item.snkey, { snkey: item.snkey, text: item.name }]))
    const doctorMap = new Map(doctorResponse.map(item => [item.snkey, { snkey: item.snkey, text: item.name }]))
    const mainCauseMap = new Map(mainCauseResponse.map(item => [item.snkey, { snkey: item.snkey, text: item.name }]))
    
    medicalRecordItems.value = response.map(item => {
      const parsedData = JSON.parse(item.datalist)
      
      // 補充關聯資料物件
      const result = {
        ...parsedData,
        snkey: item.snkey,
      }

      // 如果有外鍵但沒有關聯物件，則從映射表中取得
      if (result.hospital_snkey && !result.hospitaldata) {
        result.hospitaldata = hospitalMap.get(String(result.hospital_snkey)) || null
        result.hospital_name = result.hospitaldata?.text || ''
      }
      if (result.branch_snkey && !result.branchdata) {
        result.branchdata = branchMap.get(String(result.branch_snkey)) || null
        result.branch_name = result.branchdata?.text || ''
      }
      if (result.doctor_snkey && !result.doctordata) {
        result.doctordata = doctorMap.get(String(result.doctor_snkey)) || null
        result.doctor_name = result.doctordata?.text || ''
      }
      if (result.main_cause_of_treatment_snkey && !result.main_cause_of_treatmentdata) {
        result.main_cause_of_treatmentdata = mainCauseMap.get(String(result.main_cause_of_treatment_snkey)) || null
        result.main_cause_of_treatment_name = result.main_cause_of_treatmentdata?.text || ''
      }

      return result
    })

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
    console.log('getEatMedicineTime response:', response)
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
      store.showToastMulti({
        type: 'warning',
        message: '暫無用藥內容',
        closeTime: 2,
      })
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

const edit = (item, menuIndex = null) => {
  // 關閉選單
  if (menuIndex !== null) {
    openMenuIndex.value = null
  }
  // 延遲執行以確保選單已關閉
  nextTick(() => {
    if (editProcessRef.value && editProcessRef.value.openForEdit) {
      editProcessRef.value.openForEdit(item)
    }
  })
}

const del = async (delData) => {
  // 執行狀態標記
  const executionStatus = {
    step1_getMedicineRecords: { status: 'pending', message: '尚未執行', data: null },
    step2_prepareMedicineData: { status: 'pending', message: '尚未執行', data: null },
    step3_deleteMedicineRecords: { status: 'pending', message: '尚未執行', data: null },
    step4_deleteMedicalRecord: { status: 'pending', message: '尚未執行', data: null },
    step5_refreshData: { status: 'pending', message: '尚未執行', data: null },
  }

  console.log('【刪除流程開始】', { medicalSnkey: delData.snkey, executionStatus })

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

  if (!result?.isConfirmed) {
    console.log('【刪除流程取消】用戶取消操作')
    return
  }

  try {
    // 步驟 1: 取得相關用藥內容（透過 medical_snkey 取得對應的 medicine_record）
    console.log('【步驟 1】開始取得相關用藥內容...')
    executionStatus.step1_getMedicineRecords.status = 'processing'
    executionStatus.step1_getMedicineRecords.message = '執行中'

    const medicineResponse = await api.options(
      `general/getByKey/${store.state.databaseName}/medicine_record`,
      {
        key: 'medical_snkey',
        value: delData.snkey,
      }
    )

    executionStatus.step1_getMedicineRecords.status = 'success'
    executionStatus.step1_getMedicineRecords.message = `成功取得 ${medicineResponse?.length || 0} 筆用藥紀錄`
    executionStatus.step1_getMedicineRecords.data = {
      count: medicineResponse?.length || 0,
      snkeys: medicineResponse?.map(item => item.snkey) || [],
    }
    console.log('【步驟 1】✓ 完成', executionStatus.step1_getMedicineRecords)

    const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const delman = `${store.state.pData.username}(${timeNow})`

    // 步驟 2: 準備要刪除的用藥紀錄資料
    console.log('【步驟 2】開始準備要刪除的用藥紀錄資料...')
    executionStatus.step2_prepareMedicineData.status = 'processing'
    executionStatus.step2_prepareMedicineData.message = '執行中'

    const medicinePostData = []
    if (medicineResponse && medicineResponse.length) {
      medicineResponse.forEach((item) => {
        // 解析 datalist 以獲取完整資料
        const itemData = item.datalist ? JSON.parse(item.datalist) : item
        itemData.delman = delman
        medicinePostData.push({
          snkey: item.snkey,
          tablename: 'medicine_record',
          datalist: JSON.stringify(itemData),
        })
      })
    }

    executionStatus.step2_prepareMedicineData.status = 'success'
    executionStatus.step2_prepareMedicineData.message = `成功準備 ${medicinePostData.length} 筆刪除資料`
    executionStatus.step2_prepareMedicineData.data = {
      count: medicinePostData.length,
      snkeys: medicinePostData.map(item => item.snkey),
    }
    console.log('【步驟 2】✓ 完成', executionStatus.step2_prepareMedicineData)

    // 步驟 3: 批次刪除所有用藥紀錄（如果存在）
    if (medicinePostData.length > 0) {
      console.log('【步驟 3】開始批次刪除用藥紀錄...')
      executionStatus.step3_deleteMedicineRecords.status = 'processing'
      executionStatus.step3_deleteMedicineRecords.message = '執行中'

      const medicineDeleteResult = await api.deleteMulti('medicine_record', medicinePostData)

      // 檢查所有用藥紀錄是否都成功刪除
      const isAllMedicineDeleted = medicineDeleteResult.every(
        (result) => result.del_state === true || result.state === 1 || result.del_state === 1
      )

      if (!isAllMedicineDeleted) {
        // 如果有任何用藥紀錄刪除失敗，停止整個流程
        executionStatus.step3_deleteMedicineRecords.status = 'failed'
        executionStatus.step3_deleteMedicineRecords.message = '部分或全部用藥紀錄刪除失敗'
        executionStatus.step3_deleteMedicineRecords.data = {
          totalCount: medicinePostData.length,
          resultDetails: medicineDeleteResult,
          failedCount: medicineDeleteResult.filter(
            (result) => !(result.del_state === true || result.state === 1 || result.del_state === 1)
          ).length,
        }
        console.error('【步驟 3】✗ 失敗', executionStatus.step3_deleteMedicineRecords)
        console.log('【刪除流程中斷】所有步驟狀態:', executionStatus)

        store.showToastMulti({
          type: 'error',
          message: '刪除用藥紀錄失敗，操作已中止',
          closeTime: 5,
        })
        return
      }

      executionStatus.step3_deleteMedicineRecords.status = 'success'
      executionStatus.step3_deleteMedicineRecords.message = `成功刪除 ${medicinePostData.length} 筆用藥紀錄`
      executionStatus.step3_deleteMedicineRecords.data = {
        deletedCount: medicinePostData.length,
        results: medicineDeleteResult,
      }
      console.log('【步驟 3】✓ 完成', executionStatus.step3_deleteMedicineRecords)
    } else {
      executionStatus.step3_deleteMedicineRecords.status = 'skipped'
      executionStatus.step3_deleteMedicineRecords.message = '無需刪除的用藥紀錄，跳過此步驟'
      console.log('【步驟 3】- 跳過（無需刪除的資料）', executionStatus.step3_deleteMedicineRecords)
    }

    // 步驟 4: 確認所有用藥紀錄都成功刪除後，才刪除就診紀錄
    console.log('【步驟 4】開始刪除就診紀錄...')
    executionStatus.step4_deleteMedicalRecord.status = 'processing'
    executionStatus.step4_deleteMedicalRecord.message = '執行中'

    const medicalPostData = {
      snkey: delData.snkey,
      tablename: 'medical_record',
      info: JSON.stringify({
        ...delData,
        delman: delman,
      }),
    }

    const medicalDeleteResult = await api.delete('medical_record', medicalPostData)

    // 確認就診紀錄是否成功刪除
    if (medicalDeleteResult?.state == 1) {
      executionStatus.step4_deleteMedicalRecord.status = 'success'
      executionStatus.step4_deleteMedicalRecord.message = '成功刪除就診紀錄'
      executionStatus.step4_deleteMedicalRecord.data = {
        snkey: delData.snkey,
        result: medicalDeleteResult,
      }
      console.log('【步驟 4】✓ 完成', executionStatus.step4_deleteMedicalRecord)

      // 步驟 5: 刷新資料
      console.log('【步驟 5】開始刷新資料...')
      executionStatus.step5_refreshData.status = 'processing'
      executionStatus.step5_refreshData.message = '執行中'

      store.showToastMulti({
        type: 'success',
        message: '已刪除',
        closeTime: 2,
      })
      getMedicalData()
      medicalRecordList.value = {}
      medicineRecordItems.value = []

      executionStatus.step5_refreshData.status = 'success'
      executionStatus.step5_refreshData.message = '成功刷新資料'
      console.log('【步驟 5】✓ 完成', executionStatus.step5_refreshData)
      console.log('【刪除流程完成】所有步驟狀態:', executionStatus)
    } else {
      // 刪除就診紀錄失敗，但用藥紀錄已刪除（這種情況較少見，但需要記錄）
      executionStatus.step4_deleteMedicalRecord.status = 'failed'
      executionStatus.step4_deleteMedicalRecord.message = '刪除就診紀錄失敗'
      executionStatus.step4_deleteMedicalRecord.data = {
        snkey: delData.snkey,
        result: medicalDeleteResult,
        medicineDeletedCount: medicinePostData.length,
        warning: '用藥紀錄已刪除，但就診紀錄刪除失敗',
      }
      console.error('【步驟 4】✗ 失敗', executionStatus.step4_deleteMedicalRecord)
      console.log('【刪除流程異常完成】所有步驟狀態:', executionStatus)

      store.showToastMulti({
        type: 'error',
        message: '刪除就診紀錄失敗，但相關用藥紀錄已刪除，請聯繫系統管理員',
        closeTime: 5,
      })
      // 刷新資料，確保 UI 狀態正確
      await getMedicalData()

      executionStatus.step5_refreshData.status = 'success'
      executionStatus.step5_refreshData.message = '已刷新資料（異常情況）'
      console.log('【步驟 5】✓ 完成（異常刷新）', executionStatus.step5_refreshData)
    }
  } catch (error) {
    console.error('【刪除流程異常】發生錯誤:', error)
    console.log('【刪除流程異常中斷】所有步驟狀態:', executionStatus)

    // 標記當前執行的步驟為失敗
    Object.keys(executionStatus).forEach((key) => {
      if (executionStatus[key].status === 'processing') {
        executionStatus[key].status = 'failed'
        executionStatus[key].message = `執行中發生錯誤: ${error.message || '未知錯誤'}`
        executionStatus[key].data = { error: error.message || '未知錯誤' }
      }
    })

    store.showToastMulti({
      type: 'error',
      message: `刪除失敗: ${error.message || '未知錯誤'}，請稍後再試`,
      closeTime: 5,
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
      // 清空本地列表（僅在成功時）
      medicineRecordItems.value = []
      return true
    } else {
      // 刪除失敗，拋出錯誤
      throw new Error(`刪除用藥紀錄失敗，API 回應: ${JSON.stringify(response)}`)
    }
  } catch (error) {
    // 記錄詳細錯誤並重新拋出，讓上層處理
    console.error('delMedicineRecordMulti error:', error)
    throw error
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
      // 從 eat_medicine_timedata.snkey 取得 snkey（如果 eat_medicine_timedata 是物件）
      // 或直接使用 eat_medicine_time_snkey（向後兼容）
      const eatMedicineTimeSnkey = (i.eat_medicine_timedata && typeof i.eat_medicine_timedata === 'object' && i.eat_medicine_timedata.snkey) 
        ? i.eat_medicine_timedata.snkey 
        : (i.eat_medicine_timedata && typeof i.eat_medicine_timedata === 'string')
        ? i.eat_medicine_timedata
        : i.eat_medicine_time_snkey
      
      const matcheatMedicineTime = eatMedicineTimeItems.value.find((j) => {
        return eatMedicineTimeSnkey == j.snkey
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
  // 執行狀態標記
  const executionStatus = {
    step1_confirm: { status: 'pending', message: '尚未執行', data: null },
    step2_handleBackDate: { status: 'pending', message: '尚未執行', data: null },
    step3_copyMedicalInfo: { status: 'pending', message: '尚未執行', data: null },
    step4_createMedicalRecord: { status: 'pending', message: '尚未執行', data: null },
    step5_getMedicineRecords: { status: 'pending', message: '尚未執行', data: null },
    step6_calculateNewDates: { status: 'pending', message: '尚未執行', data: null },
    step7_processTimeSlots: { status: 'pending', message: '尚未執行', data: null },
    step8_recalculateEndInfo: { status: 'pending', message: '尚未執行', data: null },
    step9_batchAddMedicine: { status: 'pending', message: '尚未執行', data: null },
    step10_refreshUI: { status: 'pending', message: '尚未執行', data: null },
  }

  console.log('【延續用藥流程開始】', { originalMedicalSnkey: item.snkey, executionStatus })

  // 步驟 1: 確認操作
  console.log('【步驟 1】確認操作...')
  executionStatus.step1_confirm.status = 'processing'
  executionStatus.step1_confirm.message = '執行中'

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

  if (!result?.isConfirmed) {
    executionStatus.step1_confirm.status = 'cancelled'
    executionStatus.step1_confirm.message = '用戶取消操作'
    console.log('【延續用藥流程取消】用戶取消操作')
    return
  }

  executionStatus.step1_confirm.status = 'success'
  executionStatus.step1_confirm.message = '用戶確認操作'
  console.log('【步驟 1】✓ 完成', executionStatus.step1_confirm)

  try {
    const medicalRecord = { ...item }

    // 步驟 2: 處理回診日期
    console.log('【步驟 2】處理回診日期...')
    executionStatus.step2_handleBackDate.status = 'processing'
    executionStatus.step2_handleBackDate.message = '執行中'

    let visitDate = null
    const today = dayjs().format('YYYY-MM-DD')
    const originalBackDate = medicalRecord.back_date

    // 檢查回診日期是否為合法日期格式
    if (!medicalRecord.back_date || 
        medicalRecord.back_date === '0000-00-00' || 
        !dayjs(medicalRecord.back_date).isValid()) {
      // 如果回診日期不合法，則設今日為就診日期
      visitDate = today
      executionStatus.step2_handleBackDate.data = {
        note: '回診日期為空或無效，已設定為今日',
        originalBackDate: originalBackDate,
        newVisitDate: visitDate,
      }
    } else {
      // 有回診日期時，日期設定為回診日期
      visitDate = dayjs(medicalRecord.back_date).format('YYYY-MM-DD')
      executionStatus.step2_handleBackDate.data = {
        note: '使用回診日期作為就診日期',
        originalBackDate: originalBackDate,
        newVisitDate: visitDate,
      }
    }

    executionStatus.step2_handleBackDate.status = 'success'
    executionStatus.step2_handleBackDate.message = `就診日期設定為: ${visitDate}`
    console.log('【步驟 2】✓ 完成', executionStatus.step2_handleBackDate)

    // 步驟 3: 複製就診紀錄資訊
    console.log('【步驟 3】複製就診紀錄資訊...')
    executionStatus.step3_copyMedicalInfo.status = 'processing'
    executionStatus.step3_copyMedicalInfo.message = '執行中'

    // 處理 carryitems - 如果是陣列則轉為字串
    let carryitems = ''
    if (medicalRecord.carryArray && Array.isArray(medicalRecord.carryArray)) {
      carryitems = medicalRecord.carryArray.join(',')
    } else if (medicalRecord.carryitems) {
      carryitems = medicalRecord.carryitems
    }

    const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
    
    // 構建 postData，複製就診紀錄資訊
    const postData = {
      datalist: JSON.stringify({
        date: visitDate, // 就診日期設為回診日期（經過驗證後）
        user_snkey: medicalRecord.user_snkey || medicalRecord.u_snkey || store.state.uData.snkey,
        hospital_snkey: medicalRecord.hospital_snkey || medicalRecord.hospitaldata?.snkey, // 醫院
        branch_snkey: medicalRecord.branch_snkey || medicalRecord.branchdata?.snkey, // 科別
        doctor_snkey: medicalRecord.doctor_snkey || medicalRecord.doctordata?.snkey, // 醫師
        main_cause_of_treatment_snkey: medicalRecord.main_cause_of_treatment_snkey || medicalRecord.main_cause_of_treatmentdata?.snkey, // 就診主因
        description: medicalRecord.description || '', // 描述
        outpatient: medicalRecord.outpatient || '',
        time: medicalRecord.time || '',
        back_date: '', // 回診日期設為空白（新就診尚未有下次回診日期）
        car: medicalRecord.car || '',
        accompany: medicalRecord.accompany || '',
        carryitems: carryitems,
        response: medicalRecord.response || '',
        count: Number(medicalRecord.count || 0) + 1, // 就診次數 +1
        createInfo: { // 記錄建立人員與時間
          snkey: store.state.pData.snkey,
          name: store.state.pData.username,
          time: timeNow,
        },
        editInfo: [],
      }),
    }

    executionStatus.step3_copyMedicalInfo.status = 'success'
    executionStatus.step3_copyMedicalInfo.message = '就診紀錄資訊複製完成'
    executionStatus.step3_copyMedicalInfo.data = {
      hospitalSnkey: medicalRecord.hospital_snkey || medicalRecord.hospitaldata?.snkey,
      branchSnkey: medicalRecord.branch_snkey || medicalRecord.branchdata?.snkey,
      doctorSnkey: medicalRecord.doctor_snkey || medicalRecord.doctordata?.snkey,
      mainCauseSnkey: medicalRecord.main_cause_of_treatment_snkey || medicalRecord.main_cause_of_treatmentdata?.snkey,
    }
    console.log('【步驟 3】✓ 完成', executionStatus.step3_copyMedicalInfo)

    // 步驟 4: 建立新就診紀錄
    console.log('【步驟 4】建立新就診紀錄...')
    executionStatus.step4_createMedicalRecord.status = 'processing'
    executionStatus.step4_createMedicalRecord.message = '執行中'

    const response = await api.add('medical_record', postData)
    console.log('response createMedicalRecord', response)
    if (response?.state != 1) {
      executionStatus.step4_createMedicalRecord.status = 'failed'
      executionStatus.step4_createMedicalRecord.message = '建立就診紀錄失敗'
      executionStatus.step4_createMedicalRecord.data = {
        response: response,
        error: 'API 回應 state 不為 1',
      }
      console.error('【步驟 4】✗ 失敗', executionStatus.step4_createMedicalRecord)
      console.log('【延續用藥流程中斷】所有步驟狀態:', executionStatus)

      store.showToastMulti({
        type: 'error',
        message: '新增失敗，請稍後再試',
        closeTime: 3,
      })
      return
    }

    // 從 response 取得新建立的 medical_record 的 snkey
    const newMedicalRecordSnkey = response.snkey || response.data?.snkey || response.result?.snkey
    console.log('newMedicalRecordSnkey', newMedicalRecordSnkey, 'from response:', response)
    
    if (!newMedicalRecordSnkey) {
      executionStatus.step4_createMedicalRecord.status = 'failed'
      executionStatus.step4_createMedicalRecord.message = '無法取得新建立的就診紀錄 snkey'
      executionStatus.step4_createMedicalRecord.data = {
        response: response,
        error: 'response 中沒有 snkey',
      }
      console.error('【步驟 4】✗ 失敗：無法取得 snkey', executionStatus.step4_createMedicalRecord)
      console.log('【延續用藥流程中斷】所有步驟狀態:', executionStatus)

      store.showToastMulti({
        type: 'error',
        message: '無法取得新建立的就診紀錄編號，請稍後再試',
        closeTime: 3,
      })
      return
    }
    executionStatus.step4_createMedicalRecord.status = 'success'
    executionStatus.step4_createMedicalRecord.message = '成功建立新的就診紀錄'
    executionStatus.step4_createMedicalRecord.data = {
      newMedicalSnkey: newMedicalRecordSnkey,
        originalMedicalSnkey: medicalRecord.snkey,
        response: response,
      }
    console.log('【步驟 4】✓ 完成', executionStatus.step4_createMedicalRecord)

    // 步驟 5: 取得原始就診的所有用藥紀錄
    console.log('【步驟 5】取得原始就診的所有用藥紀錄...')
    executionStatus.step5_getMedicineRecords.status = 'processing'
    executionStatus.step5_getMedicineRecords.message = '執行中'

    let medicineResponse = await api.options(
      `general/getByKey/${store.state.databaseName}/medicine_record`,
      {
        key: 'medical_snkey',
        value: medicalRecord.snkey,
      }
    )

    console.log('medicineResponse', medicineResponse)

    if (!medicineResponse || !medicineResponse.length) {
      executionStatus.step5_getMedicineRecords.status = 'skipped'
      executionStatus.step5_getMedicineRecords.message = '無原始用藥紀錄，跳過後續步驟'
      executionStatus.step5_getMedicineRecords.data = { count: 0 }
      console.log('【步驟 5】- 跳過（無資料）', executionStatus.step5_getMedicineRecords)

      // 直接跳到步驟 10: 更新畫面
      console.log('【步驟 10】更新畫面...')
      executionStatus.step10_refreshUI.status = 'processing'
      executionStatus.step10_refreshUI.message = '執行中'

      store.showToastMulti({
        type: 'success',
        message: '已新增就診紀錄（無用藥紀錄）',
        closeTime: 2,
      })
      await getMedicalData()
      medicalRecordList.value = {}
      medicineRecordItems.value = []

      executionStatus.step10_refreshUI.status = 'success'
      executionStatus.step10_refreshUI.message = '畫面更新完成'
      console.log('【步驟 10】✓ 完成', executionStatus.step10_refreshUI)
      console.log('【延續用藥流程完成】所有步驟狀態:', executionStatus)
      return
    }

    // 將 medicineResponse 映射為已解析的資料格式
    const processedMedicineResponse = medicineResponse.map(item => {
      return {
        ...JSON.parse(item.datalist),
        snkey: item.snkey,
      }
    })
    console.log('medicineResponse reMap:', processedMedicineResponse)

    executionStatus.step5_getMedicineRecords.status = 'success'
    executionStatus.step5_getMedicineRecords.message = `成功取得 ${processedMedicineResponse.length} 筆用藥紀錄`
    executionStatus.step5_getMedicineRecords.data = {
      count: processedMedicineResponse.length,
      snkeys: processedMedicineResponse.map(item => item.snkey),
    }
    console.log('【步驟 5】✓ 完成', executionStatus.step5_getMedicineRecords)

    // 步驟 6-9: 處理用藥紀錄（在 createMedicineRecord 函數中處理）
    console.log('【步驟 6-9】處理用藥紀錄...')
    executionStatus.step6_calculateNewDates.status = 'processing'
    executionStatus.step7_processTimeSlots.status = 'processing'
    executionStatus.step8_recalculateEndInfo.status = 'processing'
    executionStatus.step9_batchAddMedicine.status = 'processing'
    
    // 傳遞新的就診日期（visitDate）給 createMedicineRecord
    const createResult = await createMedicineRecord(medicalRecord, newMedicalRecordSnkey, processedMedicineResponse, visitDate, executionStatus)
    
    executionStatus.step6_calculateNewDates.status = createResult.status === 'success' ? 'success' : 'failed'
    executionStatus.step7_processTimeSlots.status = createResult.status === 'success' ? 'success' : 'failed'
    executionStatus.step8_recalculateEndInfo.status = createResult.status === 'success' ? 'success' : 'failed'
    executionStatus.step9_batchAddMedicine.status = createResult.status === 'success' ? 'success' : 'failed'
    
    console.log('【步驟 6-9】', createResult.status === 'success' ? '✓ 完成' : '✗ 失敗', createResult.message)

    // 步驟 10: 更新畫面
    console.log('【步驟 10】更新畫面...')
    executionStatus.step10_refreshUI.status = 'processing'
    executionStatus.step10_refreshUI.message = '執行中'

    store.showToastMulti({
      type: 'success',
      message: '已新增資料',
      closeTime: 2,
    })
    await getMedicalData()
    // 清空當前選取的用藥內容
    medicalRecordList.value = {}
    medicineRecordItems.value = []

    executionStatus.step10_refreshUI.status = 'success'
    executionStatus.step10_refreshUI.message = '畫面更新完成'
    console.log('【步驟 10】✓ 完成', executionStatus.step10_refreshUI)
    console.log('【延續用藥流程完成】所有步驟狀態:', executionStatus)
  } catch (error) {
    console.error('【延續用藥流程異常】發生錯誤:', error)
    console.log('【延續用藥流程異常中斷】所有步驟狀態:', executionStatus)

    // 標記當前執行的步驟為失敗
    Object.keys(executionStatus).forEach((key) => {
      if (executionStatus[key].status === 'processing') {
        executionStatus[key].status = 'failed'
        executionStatus[key].message = `執行中發生錯誤: ${error.message || '未知錯誤'}`
        executionStatus[key].data = { error: error.message || '未知錯誤', stack: error.stack }
      }
    })

    store.showToastMulti({
      type: 'error',
      message: `新增失敗: ${error.message || '未知錯誤'}，請稍後再試`,
      closeTime: 5,
    })
  }
}

// 計算藥物用完資訊，參照 MedicineRecordAdd.vue 的計算方式
const calculateMedicineEndInfo = (medicineList, eatMedicineTime) => {
  const timeArr = eatMedicineTime.time.split(',')
  const intervalDay = eatMedicineTime.day
  const repeatDate = eatMedicineTime.repeatDate
  const repeatWeek = eatMedicineTime.repeatWeek

  // 判斷指定日期 loop 給藥的狀況
  if (repeatDate) {
    const DateArrs = repeatDate.split(',').map(d => parseInt(d, 10))
    const TimeArrs = timeArr.map(t => parseInt(t, 10))
    const startDate = dayjs(medicineList.start_date)
    const startTime = parseInt(medicineList.start_time, 10)

    // 檢查 start_date 是否在指定日期內
    if (!DateArrs.includes(startDate.date())) {
      return '起始給藥日期不在指定的用藥日期範圍內'
    }

    let finalDate = null
    let finalTime = null
    let checkDate = startDate.clone()
    let currentTimeIndex = TimeArrs.indexOf(startTime)

    for (let i = 0; i < medicineList.medicine_counts; i++) {
      while (!DateArrs.includes(checkDate.date())) {
        checkDate = checkDate.add(1, 'day')
        currentTimeIndex = 0
      }

      finalDate = checkDate.clone()
      finalTime = TimeArrs[currentTimeIndex]

      currentTimeIndex++
      if (currentTimeIndex >= TimeArrs.length) {
        currentTimeIndex = 0
        checkDate = checkDate.add(1, 'day')
      }
    }

    return '日期:' + finalDate.format('YYYY-MM-DD') + ' 時段:' + finalTime
  }

  // 判斷指定星期 loop 給藥的狀況
  if (repeatWeek && repeatWeek.length > 0) {
    const WeekArrs = repeatWeek.split(',').map(w => parseInt(w, 10))
    const TimeArrs = timeArr.map(t => parseInt(t, 10))
    const startDate = dayjs(medicineList.start_date)
    const startTime = parseInt(medicineList.start_time, 10)

    const startWeek = startDate.day() === 0 ? 7 : startDate.day()
    if (!WeekArrs.includes(startWeek)) {
      return '起始給藥日期的星期不在指定用藥星期範圍內'
    }

    let finalDate = null
    let finalTime = null
    let checkDate = startDate.clone()
    let currentTimeIndex = TimeArrs.indexOf(startTime)

    for (let i = 0; i < medicineList.medicine_counts; i++) {
      while (!WeekArrs.includes(checkDate.day() === 0 ? 7 : checkDate.day())) {
        checkDate = checkDate.add(1, 'day')
        currentTimeIndex = 0
      }

      finalDate = checkDate.clone()
      finalTime = TimeArrs[currentTimeIndex]

      currentTimeIndex++
      if (currentTimeIndex >= TimeArrs.length) {
        currentTimeIndex = 0
        checkDate = checkDate.add(1, 'day')
      }
    }

    return '日期:' + finalDate.format('YYYY-MM-DD') + ' 時段:' + finalTime
  }

  // 一般間隔天數計算
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

// 保留舊的函數名稱以向後兼容
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

const createMedicineRecord = async (medicalRecord, newMedicalRecordSnkey, medicineResponse, newVisitDate, executionStatus = null) => {
  
  try {
    // 步驟 6: 計算每筆用藥的新開始日期與時間
    console.log('  【步驟 6】計算每筆用藥的新開始日期與時間...')
    if (executionStatus) {
      executionStatus.step6_calculateNewDates.status = 'processing'
      executionStatus.step6_calculateNewDates.message = '執行中'
    }

    const newMedicineRecord = []
    const skippedRecords = []
    const processedRecords = []

    // 使用已取得的用藥紀錄（從步驟 5 傳入）
    const response = medicineResponse || []

    if (!response || !response.length) {
      if (executionStatus) {
        executionStatus.step6_calculateNewDates.status = 'skipped'
        executionStatus.step6_calculateNewDates.message = '無用藥紀錄需要處理'
      }
      return { status: 'skipped', message: '無用藥紀錄需要複製', data: null }
    }

    for (const itemData of response) {
      try {
        // 確保有 medicineEndInfo
        if (!itemData.medicineEndInfo) {
          skippedRecords.push({
            snkey: itemData.snkey,
            reason: '缺少 medicineEndInfo',
          })
          console.warn('  用藥紀錄缺少 medicineEndInfo，跳過:', itemData.snkey)
          continue
        }

        // 從 eat_medicine_timedata 取得 snkey（用於查找 eatMedicineTime）
        let eatMedicineTimeSnkey = null
        if (itemData.eat_medicine_timedata) {
          if (typeof itemData.eat_medicine_timedata === 'object' && itemData.eat_medicine_timedata.snkey) {
            eatMedicineTimeSnkey = itemData.eat_medicine_timedata.snkey
          } else if (typeof itemData.eat_medicine_timedata === 'string') {
            eatMedicineTimeSnkey = itemData.eat_medicine_timedata
          }
        }
        
        // 向後兼容：如果還是沒有，嘗試其他可能的欄位名稱
        if (!eatMedicineTimeSnkey) {
          eatMedicineTimeSnkey = itemData.eat_medicine_time_snkey || 
                                 itemData.eatMedicineTimeSnkey || 
                                 itemData.eatMedicineTime_snkey
        }

        if (!eatMedicineTimeSnkey) {
          skippedRecords.push({
            snkey: itemData.snkey,
            reason: '缺少 eat_medicine_time_snkey 欄位',
          })
          console.warn('  缺少 eat_medicine_time_snkey 欄位，跳過:', itemData.snkey)
          continue
        }

        // 檢查 eatMedicineTimeItems 是否已載入
        if (!eatMedicineTimeItems.value || eatMedicineTimeItems.value.length === 0) {
          skippedRecords.push({
            snkey: itemData.snkey,
            reason: 'eatMedicineTimeItems 尚未載入',
          })
          console.warn('  eatMedicineTimeItems 尚未載入，跳過:', itemData.snkey)
          continue
        }

        const eatMedicineTime = eatMedicineTimeItems.value.find((item2) => {
          return String(item2.snkey) == String(eatMedicineTimeSnkey)
        })

        if (!eatMedicineTime) {
          skippedRecords.push({
            snkey: itemData.snkey,
            reason: '找不到對應的用藥時間設定',
            eatMedicineTimeSnkey: eatMedicineTimeSnkey,
          })
          console.warn('  找不到對應的用藥時間設定，跳過:', itemData.snkey, eatMedicineTimeSnkey)
          continue
        }

        // 新的開始日期使用新的就診日期（visitDate）
        let newStartDate = newVisitDate
        
        // 從藥物用完資訊 (medicineEndInfo) 取得時段
        // medicineEndInfo 格式: "日期:2025-12-13 時段:17"
        const endTimeFromInfo = itemData.medicineEndInfo.substring(17) // 從第18個字元開始取時段
        
        // 如果無法從 medicineEndInfo 取得時段，使用原始資料的 start_time
        if (!endTimeFromInfo || endTimeFromInfo.length === 0) {
          skippedRecords.push({
            snkey: itemData.snkey,
            reason: '無法從 medicineEndInfo 取得時段',
            medicineEndInfo: itemData.medicineEndInfo,
          })
          console.warn('  無法從 medicineEndInfo 取得時段，跳過:', itemData.snkey)
          continue
        }
        
        // 驗證新的開始日期
        if (!dayjs(newStartDate).isValid()) {
          skippedRecords.push({
            snkey: itemData.snkey,
            reason: '新的就診日期格式無效',
            newVisitDate: newVisitDate,
          })
          console.warn('  新的就診日期格式無效，跳過:', itemData.snkey, newVisitDate)
          continue
        }

        // 確保數值類型正確（從 test.json 看到 day 可能是字串）
        const intervalDay = Number(eatMedicineTime.day) || 1
        const timeArr = eatMedicineTime.time.split(',')
        const repeatDate = eatMedicineTime.repeatDate
        const repeatWeek = eatMedicineTime.repeatWeek
        
        // 驗證時段是否在用藥時間設定中
        const endTimeIndex = timeArr.indexOf(endTimeFromInfo)
        if (endTimeIndex === -1) {
          skippedRecords.push({
            snkey: itemData.snkey,
            reason: `時段 "${endTimeFromInfo}" 不在用藥時間設定中`,
            availableTimes: timeArr,
          })
          console.warn('  時段不在用藥時間設定中，跳過:', itemData.snkey, endTimeFromInfo)
          continue
        }
        
        const originalStartDate = itemData.start_date
        const originalStartTime = itemData.start_time

        // 步驟 7: 計算下一個時段作為起始時間
        // 從藥物用完資訊的時段計算下一個時段
        let newStartTime = ''
        
        // 參照 MedicineRecordAdd.vue 的邏輯處理不同類型的用藥時間
        if (repeatDate) {
          // 指定日期 loop 給藥的情況
          const DateArrs = repeatDate.split(',').map(d => parseInt(d, 10))
          const TimeArrs = timeArr.map(t => parseInt(t, 10))
          const startDate = dayjs(newStartDate)
          const endTime = parseInt(endTimeFromInfo, 10)

          // 計算下一個時段
          let nextTimeIndex = TimeArrs.indexOf(endTime) + 1
          let nextDate = startDate.clone()

          if (nextTimeIndex >= TimeArrs.length) {
            // 如果已到達該天的最後一個時段，則跨天並切換到下一個指定日期的第一個時段
            nextTimeIndex = 0
            nextDate = nextDate.add(intervalDay, 'day')
            // 找到下一個符合的指定日期
            while (!DateArrs.includes(nextDate.date())) {
              nextDate = nextDate.add(1, 'day')
            }
          }

          newStartDate = nextDate.format('YYYY-MM-DD')
          newStartTime = String(TimeArrs[nextTimeIndex])
        } else if (repeatWeek && repeatWeek.length > 0) {
          // 指定星期 loop 給藥的情況
          const WeekArrs = repeatWeek.split(',').map(w => parseInt(w, 10))
          const TimeArrs = timeArr.map(t => parseInt(t, 10))
          const startDate = dayjs(newStartDate)
          const endTime = parseInt(endTimeFromInfo, 10)

          // 計算下一個時段
          let nextTimeIndex = TimeArrs.indexOf(endTime) + 1
          let nextDate = startDate.clone()

          if (nextTimeIndex >= TimeArrs.length) {
            // 如果已到達該天的最後一個時段，則跨天並切換到下一個指定星期的第一個時段
            nextTimeIndex = 0
            nextDate = nextDate.add(intervalDay, 'day')
            // 找到下一個符合的指定星期
            while (!WeekArrs.includes(nextDate.day() === 0 ? 7 : nextDate.day())) {
              nextDate = nextDate.add(1, 'day')
            }
          }

          newStartDate = nextDate.format('YYYY-MM-DD')
          newStartTime = String(TimeArrs[nextTimeIndex])
        } else {
          // 一般間隔天數計算
          const endTimeIndex = timeArr.indexOf(endTimeFromInfo)
          
          // 檢查是否是最後一個時段
          if (endTimeIndex === timeArr.length - 1) {
            // 如果已到達該天的最後一個時段，則跨天並切換到下一個間隔週期的第一個時段
            newStartDate = dayjs(newStartDate).add(intervalDay, 'day').format('YYYY-MM-DD')
            newStartTime = timeArr[0]
          } else {
            // 否則切換到同一天的下一個時段
            newStartTime = timeArr[endTimeIndex + 1]
          }
        }

        const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
        
        // 步驟 8: 重新計算藥物用完資訊
        // 使用 calculateMedicineEndInfo 方法依新的開始日期與時間計算
        const updatedItem = {
          ...itemData,
          start_date: newStartDate,
          start_time: newStartTime,
        }
        
        // 計算新的 medicineEndInfo
        const newMedicineEndInfo = calculateMedicineEndInfo(updatedItem, eatMedicineTime)
        
        // 準備新增的資料：複製原始資料，只重構指定欄位
        // 參考 MedicineRecordAdd.vue 的格式
        // newMedicalRecordSnkey 是從步驟 4 建立新就診紀錄時取得的 response.snkey
        console.log('  準備新增用藥紀錄，newMedicalRecordSnkey:', newMedicalRecordSnkey)
        
        const newItem = {
          user_snkey: itemData.user_snkey || medicalRecord.user_snkey || medicalRecord.u_snkey || store.state.uData.snkey,
          medical_snkey: newMedicalRecordSnkey, // 外層的 medical_snkey（用於 API）
          datalist: JSON.stringify({
            ...itemData, // 複製所有原始資料（包括 medicinedata, unitdata, methoddata, eat_medicine_timedata 等物件）
            medical_snkey: newMedicalRecordSnkey, // 重構：改為新的就診紀錄 snkey（從步驟 4 的 response.snkey 取得）
            start_date: newStartDate, // 重構：新的開始日期
            start_time: newStartTime, // 重構：新的開始時間
            medicineEndInfo: newMedicineEndInfo, // 重構：重新計算的藥物用完資訊
            createInfo: { // 重構：新的建立資訊
              snkey: store.state.pData.snkey,
              name: store.state.pData.username,
              time: timeNow,
            },
            editInfo: [], // 重構：清空編輯資訊
          })
        }
        
        console.log('  新增用藥紀錄資料結構:', {
          medical_snkey: newItem.medical_snkey,
          datalist_medical_snkey: JSON.parse(newItem.datalist).medical_snkey,
        })

        newMedicineRecord.push(newItem)
        processedRecords.push({
          originalSnkey: itemData.snkey,
          originalStartDate: originalStartDate,
          originalStartTime: originalStartTime,
          newStartDate: newStartDate,
          newStartTime: newStartTime,
          medicineEndInfo: newMedicineEndInfo,
        })
      } catch (itemError) {
        skippedRecords.push({
          snkey: itemData.snkey,
          reason: `處理錯誤: ${itemError.message}`,
          error: itemError.message,
        })
        console.error('  處理用藥紀錄時發生錯誤:', itemData.snkey, itemError)
      }
    }

    if (executionStatus) {
      executionStatus.step6_calculateNewDates.status = 'success'
      executionStatus.step6_calculateNewDates.message = `成功計算 ${processedRecords.length} 筆用藥的新開始日期與時間`
      executionStatus.step6_calculateNewDates.data = {
      total: response.length,
      processed: processedRecords.length,
      skipped: skippedRecords.length,
      }
      executionStatus.step7_processTimeSlots.status = 'success'
      executionStatus.step7_processTimeSlots.message = '用藥時段邏輯處理完成'
      executionStatus.step8_recalculateEndInfo.status = 'success'
      executionStatus.step8_recalculateEndInfo.message = '藥物用完資訊重新計算完成'
    }
    console.log('  【步驟 6-8】✓ 完成', { processed: processedRecords.length, skipped: skippedRecords.length })

    // 步驟 9: 批量新增用藥紀錄
    if (newMedicineRecord.length > 0) {
      console.log('  【步驟 9】批量新增用藥紀錄...')
      if (executionStatus) {
        executionStatus.step9_batchAddMedicine.status = 'processing'
        executionStatus.step9_batchAddMedicine.message = '執行中'
      }

      console.log('newMedicineRecord', newMedicineRecord)
      // 使用 API: general/addMulti/{databaseName}/medicine_record
      const addResult = await api.options(`general/addMulti/${store.state.databaseName}/medicine_record`, newMedicineRecord)
      
      if (executionStatus) {
        executionStatus.step9_batchAddMedicine.status = 'success'
        executionStatus.step9_batchAddMedicine.message = `成功新增 ${newMedicineRecord.length} 筆用藥紀錄`
        executionStatus.step9_batchAddMedicine.data = {
        addedCount: newMedicineRecord.length,
        result: addResult,
      }
    }
      console.log('  【步驟 9】✓ 完成', { addedCount: newMedicineRecord.length })
    } else {
    if (executionStatus) {
        executionStatus.step9_batchAddMedicine.status = 'skipped'
        executionStatus.step9_batchAddMedicine.message = '無需新增的用藥紀錄，跳過'
      }
      console.log('  【步驟 9】- 跳過（無需新增的資料）')
    }

    return {
      status: 'success',
      message: `完成用藥紀錄建立（成功: ${processedRecords.length}, 跳過: ${skippedRecords.length}）`,
      data: {
        processed: processedRecords.length,
        skipped: skippedRecords.length,
        processedRecords: processedRecords,
        skippedRecords: skippedRecords,
      },
    }
  } catch (error) {
    console.error('  【createMedicineRecord 異常】發生錯誤:', error)
    
    // 標記當前執行的步驟為失敗
    if (executionStatus) {
      if (executionStatus.step6_calculateNewDates.status === 'processing') {
        executionStatus.step6_calculateNewDates.status = 'failed'
        executionStatus.step6_calculateNewDates.message = `執行中發生錯誤: ${error.message || '未知錯誤'}`
      }
      if (executionStatus.step7_processTimeSlots.status === 'processing') {
        executionStatus.step7_processTimeSlots.status = 'failed'
        executionStatus.step7_processTimeSlots.message = `執行中發生錯誤: ${error.message || '未知錯誤'}`
      }
      if (executionStatus.step8_recalculateEndInfo.status === 'processing') {
        executionStatus.step8_recalculateEndInfo.status = 'failed'
        executionStatus.step8_recalculateEndInfo.message = `執行中發生錯誤: ${error.message || '未知錯誤'}`
      }
      if (executionStatus.step9_batchAddMedicine.status === 'processing') {
        executionStatus.step9_batchAddMedicine.status = 'failed'
        executionStatus.step9_batchAddMedicine.message = `執行中發生錯誤: ${error.message || '未知錯誤'}`
      }
    }

    throw error
  }
}

const print = (item) => {
  if (printOptionRef.value && printOptionRef.value.enterProcess) {
    printOptionRef.value.enterProcess(item)
  }
}

// watch(sortKey, (newVal) => {
//   if (newVal && newVal.key) {
//     medicalRecordItems.value = sort([...medicalRecordItems.value], newVal.key, newVal.type)
//   }
// })

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
