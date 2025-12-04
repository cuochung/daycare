<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-hospital-building</v-icon>
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

          <!-- 評估日期 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="primary-lighten-5" elevation="1" border>
            <v-text-field v-model="list.Date" type="date" label="登記日期" variant="outlined" density="comfortable"
              prepend-inner-icon="mdi-calendar" :rules="emptyRules" />
          </v-sheet>

          <!-- 非計畫性轉至急性醫院住院 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="warning-lighten-5" elevation="1" border>
            <div class="d-flex align-center mb-3">
              <v-icon color="warning" class="mr-2">mdi-hospital-building</v-icon>
              <h3 class="text-h6 font-weight-medium">非計畫性轉至急性醫院住院</h3>
            </div>
            <v-row>
              <v-col cols="12" class="d-flex align-center">
                <v-checkbox v-model="list.unplanned" label="非計畫性轉至急性醫院住院" hide-details density="compact" />
              </v-col>
              <v-col cols="12" md="6" v-if="list.unplanned">
                <v-autocomplete v-model="list.reason" :items="reasonItems" label="住院原因" variant="outlined"
                  density="comfortable" :rules="emptyRules" prepend-inner-icon="mdi-file-document-edit" />
              </v-col>
            </v-row>
          </v-sheet>

          <!-- 入住後72小時內 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="success-lighten-5" elevation="1" border>
            <div class="d-flex align-center">
              <v-icon color="success" class="mr-2">mdi-clock-alert</v-icon>
              <v-checkbox v-model="list.livein72hour" label="入住後72小時內非計畫性轉至急性醫院住院"
                hide-details density="compact" />
            </div>
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
    default: 'unplannedevent',
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

const reasonItems = [
  '因心血管代償機能減退',
  '因骨折之治療或評估',
  '因腸胃道出血',
  '因感染',
  '因其他內外科原因',
]

const residentAge = computed(() => {
  if (store.state.uData?.birthday) {
    const birthYear = store.state.uData.birthday.split('-')[0]
    return thisYear - birthYear
  }
  return '無資料'
})

const headerTitle = computed(() => (processType.value === 'add' ? '新增非計畫性轉急性住院登記' : '修改非計畫性轉急性住院登記'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民非計畫性轉至急性醫院住院事件，包含登記日期、住院原因等評估項目。'
    : '更新既有非計畫性轉急性住院登記紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const createDefaultRecord = () => ({
  snkey: '',
  u_snkey: '',
  Date: dayjs().format('YYYY-MM-DD'),
  unplanned: false,
  reason: '',
  livein72hour: false,
  createInfo: {},
  editInfo: [],
})

const list = reactive(createDefaultRecord())

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

  // 驗證：至少需要勾選一個選項
  if (!list.unplanned && !list.livein72hour) {
    proxy.$swal({ icon: 'warning', title: '至少需要勾選「非計畫性轉至急性醫院住院」或「入住後72小時內非計畫性轉至急性醫院住院」其中一項。' })
    return
  }

  // 驗證：如果勾選了非計畫性轉至急性醫院住院，則必須填寫住院原因
  if (list.unplanned && !list.reason) {
    proxy.$swal({ icon: 'warning', title: '若勾選「非計畫性轉至急性醫院住院」，則必須填寫住院原因。' })
    return
  }

  loading.value = true

  const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
  
  const submitData = {
    ...list,
    u_snkey: store.state.uData?.snkey ?? '',
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

  // 驗證：至少需要勾選一個選項
  if (!list.unplanned && !list.livein72hour) {
    proxy.$swal({ icon: 'warning', title: '至少需要勾選「非計畫性轉至急性醫院住院」或「入住後72小時內非計畫性轉至急性醫院住院」其中一項。' })
    return
  }

  // 驗證：如果勾選了非計畫性轉至急性醫院住院，則必須填寫住院原因
  if (list.unplanned && !list.reason) {
    proxy.$swal({ icon: 'warning', title: '若勾選「非計畫性轉至急性醫院住院」，則必須填寫住院原因。' })
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
