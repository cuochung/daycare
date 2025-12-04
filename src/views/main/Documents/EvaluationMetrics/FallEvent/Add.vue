<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-alert-circle</v-icon>
          </v-avatar>
            <div>
            <h2 class="text-h6 font-weight-bold mb-1">{{ headerTitle }}</h2>
            <p class="text-body-2 mb-0">{{ headerSubtitle }}</p>
              </div>
            </div>
        <v-btn icon="mdi-close" variant="text" color="white" @click="closeDialog" />
      </v-sheet>

      <v-card-text class="px-6 py-5">
        <v-form ref="formRef">
          <!-- 住民基本資訊 -->
          <v-alert class="mb-6" color="info" variant="tonal" border="start" density="comfortable">
            <div class="d-flex flex-wrap ga-4">
              <span><strong>姓名：</strong>{{ store.state.uData?.name || '—' }}</span>
              <span><strong>床號：</strong>{{ store.state.uData?.bed_name || '—' }}</span>
              <span><strong>性別：</strong>{{ store.state.uData?.sex || '—' }}</span>
              <span><strong>年齡：</strong>{{ residentAge || '—' }}</span>
              </div>
            <div class="mt-2">
              <span><strong>主要診斷：</strong>{{ store.state.uData?.hadadisease || '—' }}</span>
              </div>
          </v-alert>

          <!-- 基本資料 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="primary-lighten-5" elevation="1" border>
            <div class="d-flex align-center mb-3">
              <v-icon color="primary" class="mr-2">mdi-account-circle</v-icon>
              <h3 class="text-h6 font-weight-medium">基本資料</h3>
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete v-model="list.ageRange" :items="ageRangeItems" label="年齡層" variant="outlined"
                  density="comfortable" :rules="emptyRules" item-title="text" item-value="text" return-object />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete v-model="list.adl" :items="adlItems" label="ADL分數" variant="outlined"
                  density="comfortable" :rules="emptyRules" item-title="text" item-value="text" return-object />
              </v-col>
            </v-row>
          </v-sheet>

          <!-- 跌倒特性分析 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="warning-lighten-5" elevation="1" border>
            <div class="d-flex align-center mb-3">
              <v-icon color="warning" class="mr-2">mdi-chart-line</v-icon>
              <h3 class="text-h6 font-weight-medium">跌倒特性分析</h3>
              </div>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="list.Date" type="date" label="日期" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-calendar" :rules="emptyRules" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="list.Time" type="time" label="時間" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-clock" :rules="emptyRules" />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete v-model="list.location" :items="locationItems" label="地點" variant="outlined"
                  density="comfortable" :rules="emptyRules" item-title="text" item-value="text" return-object />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="3">
                <v-autocomplete v-model="list.situation" :items="situationItems" label="情境" variant="outlined"
                  density="comfortable" :rules="emptyRules" item-title="text" item-value="text" return-object />
              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete v-model="list.reason" :items="reasonItems" label="原因" variant="outlined"
                  density="comfortable" :rules="emptyRules" item-title="text" item-value="text" return-object />
              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete v-model="list.restraint" :items="restraintItems" label="約束物" variant="outlined"
                  density="comfortable" :rules="emptyRules" item-title="text" item-value="text" return-object />
              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete v-model="list.medicine" :items="medicineItems" label="藥物" variant="outlined"
                  density="comfortable" :rules="emptyRules" item-title="text" item-value="text" return-object />
              </v-col>
            </v-row>
          </v-sheet>

          <!-- 身體傷害 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="error-lighten-5" elevation="1" border>
            <div class="d-flex align-center mb-3">
              <v-icon color="error" class="mr-2">mdi-alert</v-icon>
              <h3 class="text-h6 font-weight-medium">身體傷害</h3>
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete v-model="list.hurt" :items="hurtItems" label="傷害嚴重度" variant="outlined"
                  density="comfortable" :rules="emptyRules" item-title="text" item-value="text" return-object />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="list.part" label="部位" variant="outlined" density="comfortable" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea v-model="list.hurtDetail" label="狀況描述" variant="outlined" density="comfortable"
                  rows="3" />
              </v-col>
            </v-row>
          </v-sheet>

          <!-- 跌倒次數 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="success-lighten-5" elevation="1" border>
            <div class="d-flex align-center mb-3">
              <v-icon color="success" class="mr-2">mdi-counter</v-icon>
              <h3 class="text-h6 font-weight-medium">跌倒次數</h3>
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete v-model="list.counts" :items="countsItems" label="跌倒次數" variant="outlined"
                  density="comfortable" :rules="emptyRules" item-title="text" item-value="text" return-object />
              </v-col>
            </v-row>
          </v-sheet>
          </v-form>
        </v-card-text>

      <v-divider />

      <v-card-actions class="px-6 py-4">
        <v-spacer />
        <v-btn variant="tonal" color="secondary" @click="closeDialog">
          取消
        </v-btn>
        <v-btn v-if="processType === 'add'" color="primary" variant="flat" :loading="loading" @click="handleAdd">
          確認新增
        </v-btn>
        <v-btn v-else color="primary" variant="flat" :loading="loading" @click="handleEdit">
          確認修改
        </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const emit = defineEmits(['refresh', 'getAllData'])

const props = defineProps({
  useDataBase: {
    type: String,
    default: 'fallevent',
  },
  items: {
    type: Array,
    default: () => [],
  },
})

const store = useStore()
const { proxy } = getCurrentInstance()

const dialog = ref(false)
const processType = ref('add')
const loading = ref(false)
const formRef = ref(null)
const originalRecord = ref(null)

const thisYear = dayjs().format('YYYY')

const emptyRules = [(v) => !!v || '不可空白']

const createDefaultRecord = () => ({
  snkey: '',
  u_snkey: '',
  Date: dayjs().format('YYYY-MM-DD'),
  Time: '',
  ageRange: null,
  adl: null,
  location: null,
  situation: null,
  reason: null,
  restraint: null,
  medicine: null,
  hurt: null,
  part: '',
  hurtDetail: '',
  counts: null,
  createInfo: {},
  editInfo: [],
})

const list = reactive(createDefaultRecord())

const ageRangeItems = [
  { text: '<65' },
  { text: '65-74' },
  { text: '75-84' },
  { text: '85-94' },
  { text: '>94' },
]

const adlItems = [
  { text: '0-20完全依賴' },
  { text: '21-60嚴重依賴' },
  { text: '61-90中度依賴' },
  { text: '91-99輕度依賴' },
  { text: '100獨立' },
]

const locationItems = [
  { text: '房間內' },
  { text: '床邊' },
  { text: '浴廁' },
  { text: '活動區' },
  { text: '走道' },
  { text: '其他' },
]

const situationItems = [
  { text: '如廁' },
  { text: '上下床' },
  { text: '活動當中' },
  { text: '由輪椅滑落' },
  { text: '輪椅上站起' },
  { text: '跨床欄' },
  { text: '其他' },
]

const reasonItems = [
  { text: '因住民健康狀況' },
  { text: '因治療或藥物反應' },
  { text: '因環境中危險因子' },
  { text: '因其他因素' },
]

const restraintItems = [
  { text: '雙側床欄' },
  { text: '單側床欄' },
  { text: '腰部約束帶' },
  { text: '背心約束帶' },
  { text: '未使用約束' },
]

const medicineItems = [
  { text: '抗組織胺' },
  { text: '抗高血壓' },
  { text: '鎮靜安眠藥' },
  { text: '肌肉鬆弛劑' },
  { text: '輕瀉劑' },
  { text: '利尿劑' },
  { text: '抗抑鬱藥' },
  { text: '血糖藥' },
]

const hurtItems = [
  { text: '無' },
  { text: '1級' },
  { text: '2級' },
  { text: '3級' },
]

const countsItems = [
  { text: '1次' },
  { text: '>1次' },
]

const residentAge = computed(() => {
  if (store.state.uData?.birthday) {
    const birthYear = store.state.uData.birthday.split('-')[0]
    return thisYear - birthYear
  }
  return '無資料'
})

const headerTitle = computed(() => (processType.value === 'add' ? '新增跌倒事件分析' : '修改跌倒事件分析'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民跌倒事件分析，包含基本資料、跌倒特性、身體傷害等評估項目。'
    : '更新既有跌倒事件分析紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const normalizeAutocompleteValue = (value) => {
  if (typeof value === 'object' && value !== null && value.text) {
    return value.text
  }
  return value
}

const convertStringToObject = (value, items) => {
  if (typeof value === 'string' && value) {
    const found = items.find(item => item.text === value)
    if (found) return found
  }
  return value
}

const resetRecord = () => {
  Object.assign(list, createDefaultRecord())
  originalRecord.value = null
}

const openForAdd = () => {
  resetRecord()
  processType.value = 'add'
  dialog.value = true
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const openForEdit = (item) => {
  resetRecord()
  processType.value = 'edit'
  originalRecord.value = { ...item }
  
  const itemCopy = JSON.parse(JSON.stringify(item))
  
  // 將字串值轉換為物件（如果需要的話）
  itemCopy.ageRange = convertStringToObject(itemCopy.ageRange, ageRangeItems)
  itemCopy.adl = convertStringToObject(itemCopy.adl, adlItems)
  itemCopy.location = convertStringToObject(itemCopy.location, locationItems)
  itemCopy.situation = convertStringToObject(itemCopy.situation, situationItems)
  itemCopy.reason = convertStringToObject(itemCopy.reason, reasonItems)
  itemCopy.restraint = convertStringToObject(itemCopy.restraint, restraintItems)
  itemCopy.medicine = convertStringToObject(itemCopy.medicine, medicineItems)
  itemCopy.hurt = convertStringToObject(itemCopy.hurt, hurtItems)
  itemCopy.counts = convertStringToObject(itemCopy.counts, countsItems)
  
  // 確保 editInfo 是陣列
  if (!itemCopy.editInfo || !Array.isArray(itemCopy.editInfo)) {
    itemCopy.editInfo = []
  }
  
  Object.assign(list, itemCopy)
  dialog.value = true
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const closeDialog = () => {
  dialog.value = false
  loading.value = false
}

const validateForm = async () => {
  const result = await formRef.value?.validate()
  return result?.valid ?? false
}

const handleAdd = async () => {
  const isValid = await validateForm()
  if (!isValid) {
    proxy.$swal({ icon: 'warning', title: '資料輸入不完整，請檢查欄位內容。' })
    return
  }

  loading.value = true

  const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
  
  const submitData = {
    ...list,
    u_snkey: store.state.uData?.snkey ?? '',
    ageRange: normalizeAutocompleteValue(list.ageRange),
    adl: normalizeAutocompleteValue(list.adl),
    location: normalizeAutocompleteValue(list.location),
    situation: normalizeAutocompleteValue(list.situation),
    reason: normalizeAutocompleteValue(list.reason),
    restraint: normalizeAutocompleteValue(list.restraint),
    medicine: normalizeAutocompleteValue(list.medicine),
    hurt: normalizeAutocompleteValue(list.hurt),
    counts: normalizeAutocompleteValue(list.counts),
    createInfo: {
      snkey: store.state.pData.snkey,
      name: store.state.pData.username,
      time: timeNow,
    },
  }

  const postData = {
    datalist: JSON.stringify(submitData),
  }

  const response = await api.add(props.useDataBase, postData)
  loading.value = false

  if (response?.state == 1) {
    proxy.$swal({ icon: 'success', title: '新增成功' })
    dialog.value = false
    emit('refresh')
    emit('getAllData')
  } else {
    proxy.$swal({ icon: 'error', title: '新增失敗，請稍後再試。' })
  }
}

const handleEdit = async () => {
  const isValid = await validateForm()
  if (!isValid) {
    proxy.$swal({ icon: 'warning', title: '資料輸入不完整，請檢查欄位內容。' })
    return
  }

  loading.value = true

  const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
  
  if (!list.editInfo || !Array.isArray(list.editInfo)) {
    list.editInfo = []
  }
  
  list.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: timeNow,
  })

  const submitData = {
    ...list,
    ageRange: normalizeAutocompleteValue(list.ageRange),
    adl: normalizeAutocompleteValue(list.adl),
    location: normalizeAutocompleteValue(list.location),
    situation: normalizeAutocompleteValue(list.situation),
    reason: normalizeAutocompleteValue(list.reason),
    restraint: normalizeAutocompleteValue(list.restraint),
    medicine: normalizeAutocompleteValue(list.medicine),
    hurt: normalizeAutocompleteValue(list.hurt),
    counts: normalizeAutocompleteValue(list.counts),
  }

  const postData = {
    snkey: submitData.snkey,
    datalist: JSON.stringify(submitData),
    updateTime: timeNow,
  }

  const response = await api.post(props.useDataBase, postData)
  loading.value = false

  if (response?.state == 1) {
    proxy.$swal({ icon: 'success', title: '修改成功' })
    dialog.value = false
    emit('refresh')
    emit('getAllData')
  } else {
    proxy.$swal({ icon: 'error', title: '修改失敗，請稍後再試。' })
  }
}

defineExpose({
  openForAdd,
  openForEdit,
})
</script>
