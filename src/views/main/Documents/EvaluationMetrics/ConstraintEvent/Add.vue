<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-lock</v-icon>
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

          <!-- 記錄內容 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="primary-lighten-5" elevation="1" border>
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-clipboard-text</v-icon>
                <h3 class="text-h6 font-weight-medium">記錄內容</h3>
              </div>
              <div class="d-flex align-center ga-3">
                <v-checkbox v-model="list.releaseOK" label="已解除約束" hide-details density="compact" />
                <v-text-field v-if="list.releaseOK" v-model="list.releaseOKDate" type="date" label="解除約束日期"
                  variant="outlined" density="compact" style="max-width: 200px;" hide-details />
              </div>
            </div>
            <v-alert class="mb-4" color="info" variant="tonal" density="compact" border="start">
              <div class="text-caption">提示: 00:00 或 24:00 請輸入 '上午12:00'</div>
            </v-alert>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="list.Date" type="date" label="日期" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-calendar" :rules="emptyRules" />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete v-model="list.reason" :items="reasonItems" label="約束理由" variant="outlined"
                  density="comfortable" :rules="emptyRules" />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete v-model="list.zone" :items="zoneItems" label="身體約束時間" variant="outlined"
                  density="comfortable" :rules="emptyRules" multiple />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-autocomplete v-model="list.hour" :items="hourItems" label="每日身體約束持續時間(小時)" variant="outlined"
                  density="comfortable" :rules="emptyRules" />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete v-model="list.freereason" :items="freereasonItems" label="解除身體約束原因"
                  variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" md="4" v-if="list.freereason && list.freereason.includes('其他')">
                <v-text-field v-model="list.freereasonOther" label="其他原因" variant="outlined" density="comfortable"
                  :rules="emptyRules" />
              </v-col>
            </v-row>
          </v-sheet>

          <!-- 約束設備列表 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="warning-lighten-5" elevation="1" border>
            <div class="d-flex align-center mb-3">
              <v-icon color="warning" class="mr-2">mdi-tools</v-icon>
              <h3 class="text-h6 font-weight-medium">約束設備</h3>
            </div>
            <div v-for="(item, index) in list.equipmentArrs" :key="index" class="mb-4">
              <v-sheet class="pa-3" rounded="lg" color="white" elevation="1">
                <div class="d-flex align-center mb-3">
                  <v-chip color="red" text-color="white" size="small" class="mr-2">
                    {{ index + 1 }}
                  </v-chip>
                  <v-spacer />
                  <v-btn v-if="list.equipmentArrs.length > 1" icon="mdi-delete" variant="text" color="error" size="small"
                    @click="delEquipment(index)" />
                </div>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-autocomplete v-model="item.equipment" :items="equipmentItems" label="身體約束設備"
                      variant="outlined" density="comfortable" :rules="arrayNotEmptyRules" multiple />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete v-model="item.part" :items="partItems" label="身體約束部位" variant="outlined"
                      density="comfortable" :rules="arrayNotEmptyRules" multiple />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="item.startTime" type="time" label="每日開始時間" variant="outlined"
                      density="comfortable" :rules="emptyRules" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="item.endTime" type="time" label="每日結束時間" variant="outlined"
                      density="comfortable" :rules="emptyRules" />
                  </v-col>
                </v-row>
              </v-sheet>
            </div>
            <v-btn color="primary" variant="tonal" prepend-icon="mdi-plus-circle" @click="addEquipment">
              增加約束部位
            </v-btn>
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
    default: 'constraintevent',
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
const arrayNotEmptyRules = [
  (v) => (Array.isArray(v) && v.length > 0) || '不可空白'
]

const reasonItems = ['預防跌倒', '預防自拔管路', '預防自傷', '行為紊亂', '協助治療(短期)', '其他']
const equipmentItems = ['約束帶', '約束背心', '手套', '餐板', '其他']
const partItems = ['腰部', '足踝-右', '足踝-左', '手腕-右', '手腕-左', '膝部-右', '膝部-左', '軀幹', '其他']
const zoneItems = ['白班', '小夜', '大夜']
const hourItems = ['≦4小時', '>4小時 ≦8小時', '>8小時 ≦24小時', '>24小時']
const freereasonItems = ['認知改善', '情緒穩定', '病情惡化', '死亡', '其他', '']

const residentAge = computed(() => {
  if (store.state.uData?.birthday) {
    const birthYear = store.state.uData.birthday.split('-')[0]
    return thisYear - birthYear
  }
  return '無資料'
})

const headerTitle = computed(() => (processType.value === 'add' ? '新增約束登記' : '修改約束登記'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民約束事件，包含約束日期、理由、設備、部位等評估項目。'
    : '更新既有約束登記紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const createDefaultRecord = () => ({
  snkey: '',
  u_snkey: '',
  Date: dayjs().format('YYYY-MM-DD'),
  reason: '',
  zone: [],
  hour: '',
  freereason: '',
  freereasonOther: '',
  releaseOK: false,
  releaseOKDate: '',
  releaseInfo: '',
  equipmentArrs: [{
    equipment: [],
    part: [],
    startTime: '',
    endTime: '',
  }],
  createInfo: {},
  editInfo: [],
})

const list = reactive(createDefaultRecord())

const resetRecord = () => {
  Object.assign(list, createDefaultRecord())
  originalRecord.value = null
}

const addEquipment = () => {
  list.equipmentArrs.push({
    equipment: [],
    part: [],
    startTime: '',
    endTime: '',
  })
}

const delEquipment = (index) => {
  if (list.equipmentArrs.length === 1) {
    store.showToastMulti({
      type: 'error',
      message: '不可少於一個部位',
      closeTime: 3,
    })
    return
  }
  list.equipmentArrs.splice(index, 1)
}

const openForAdd = () => {
  resetRecord()
  processType.value = 'add'
  
  if (props.items && props.items.length > 0) {
    // 如果有資料,則建構最後一筆資料
    const sortedItems = [...props.items].sort((a, b) => (a.Date < b.Date ? 1 : -1))
    const lastItem = JSON.parse(JSON.stringify(sortedItems[0]))
    
    // 清除不需要的欄位
    delete lastItem.snkey
    delete lastItem.userData
    delete lastItem.create_man
    delete lastItem.create_man_snkey
    delete lastItem.edit_man
    delete lastItem.editInfo
    delete lastItem.createInfo
    delete lastItem.uploadData
    delete lastItem.uploadState
    
    // 確保 equipmentArrs 存在
    if (!lastItem.equipmentArrs || !Array.isArray(lastItem.equipmentArrs) || lastItem.equipmentArrs.length === 0) {
      lastItem.equipmentArrs = [{
        equipment: [],
        part: [],
        startTime: '',
        endTime: '',
      }]
    }
    
    lastItem.Date = dayjs().format('YYYY-MM-DD')
    Object.assign(list, lastItem)
  }
  
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
  
  // 確保 equipmentArrs 存在
  if (!itemCopy.equipmentArrs || !Array.isArray(itemCopy.equipmentArrs) || itemCopy.equipmentArrs.length === 0) {
    itemCopy.equipmentArrs = [{
      equipment: [],
      part: [],
      startTime: '',
      endTime: '',
    }]
  }
  
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
