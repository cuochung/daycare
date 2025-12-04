<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-virus</v-icon>
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
              <span><strong>入住日期：</strong>{{ store.state.uData?.margin_date || '—' }}</span>
            </div>
            <div class="mt-2">
              <span><strong>主要診斷：</strong>{{ store.state.uData?.hadadisease || '—' }}</span>
            </div>
          </v-alert>

          <!-- 記錄內容 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="primary-lighten-5" elevation="1" border>
            <div class="d-flex align-center mb-3">
              <v-icon color="primary" class="mr-2">mdi-clipboard-text</v-icon>
              <h3 class="text-h6 font-weight-medium">記錄內容</h3>
            </div>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="list.Date" type="date" label="日期" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-calendar" :rules="emptyRules" />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete v-model="list.part" :items="partItems" label="感染部位" variant="outlined"
                  density="comfortable" :rules="emptyRules" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="list.OKDate" type="date" label="康復日期" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-calendar-check" />
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
    default: 'infectionevent',
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

const partItems = [
  '呼吸道感染',
  '下呼吸道感染',
  '泌尿道感染',
  '皮膚感染',
  '皮膚及軟組織感染(蜂窩性組織炎/軟組織/傷口感染)',
  '疥瘡感染',
  '腸胃道感染',
]

const residentAge = computed(() => {
  if (store.state.uData?.birthday) {
    const birthYear = store.state.uData.birthday.split('-')[0]
    return thisYear - birthYear
  }
  return '無資料'
})

const headerTitle = computed(() => (processType.value === 'add' ? '新增感染登記' : '修改感染登記'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民感染事件，包含感染日期、部位、康復日期等評估項目。'
    : '更新既有感染登記紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const createDefaultRecord = () => ({
  snkey: '',
  u_snkey: '',
  Date: dayjs().format('YYYY-MM-DD'),
  part: '',
  OKDate: '',
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
