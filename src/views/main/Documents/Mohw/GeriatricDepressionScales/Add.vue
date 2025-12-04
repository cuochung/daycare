<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-emoticon-sad</v-icon>
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
          <!-- 評估日期 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="primary-lighten-5" elevation="1" border>
            <v-row align="center">
              <v-col cols="12" md="4">
                <v-text-field v-model="list.Date" type="date" label="評估日期" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-calendar" :rules="requiredDateRules" />
              </v-col>
              <v-col cols="12" md="8" class="d-flex align-center justify-end">
                <v-checkbox v-model="isUnableToAssess" label="無法評估" color="warning" hide-details density="comfortable"
                  @update:model-value="handleUnableToAssessChange"></v-checkbox>
              </v-col>
            </v-row>
          </v-sheet>

          <!-- 無法評估原因 -->
          <v-sheet v-if="isUnableToAssess" class="mb-6 pa-4" rounded="lg" color="warning-lighten-5" elevation="1"
            border>
            <div class="d-flex align-center mb-3">
              <v-icon color="warning" class="mr-2">mdi-alert-circle</v-icon>
              <h3 class="text-h6 font-weight-medium">無法評估原因</h3>
            </div>
            <v-text-field label="請說明無法評估的原因" v-model="list.note" variant="outlined" density="comfortable"
              placeholder="例如：個案意識不清、無法配合評估等" hint="請詳細說明無法進行評估的原因" persistent-hint
              :rules="requiredRemarkRules" />
          </v-sheet>

          <!-- 評估問題 -->
          <div v-if="!isUnableToAssess">
            <v-sheet class="mb-4 pa-4" rounded="lg" color="blue-lighten-5" elevation="1" border>
              <v-row>
                <v-col cols="12" md="6">
                  <v-autocomplete :items="YnItems" label="1. 您對您的生活感到滿意嗎？" v-model="list.qq1" :rules="emptyRules"
                    return-object item-title="text" item-value="text" variant="outlined"
                    density="comfortable"></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete :items="YnItems2" label="2. 您是否常常感到厭煩？" v-model="list.qq2" :rules="emptyRules"
                    return-object item-title="text" item-value="text" variant="outlined"
                    density="comfortable"></v-autocomplete>
                </v-col>
              </v-row>
            </v-sheet>

            <v-sheet class="mb-4 pa-4" rounded="lg" color="green-lighten-5" elevation="1" border>
              <v-row>
                <v-col cols="12" md="6">
                  <v-autocomplete :items="YnItems" label="3. 您是否常常感到無論做什麼都沒有用？" v-model="list.qq3"
                    :rules="emptyRules" return-object item-title="text" item-value="text" variant="outlined"
                    density="comfortable"></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete :items="YnItems"
                    label="4. 您是否比較喜歡待在家裡，較不喜歡外出及不喜歡做新的事？" v-model="list.qq4"
                    :rules="emptyRules" return-object item-title="text" item-value="text" variant="outlined"
                    density="comfortable"></v-autocomplete>
                </v-col>
              </v-row>
            </v-sheet>

            <v-sheet class="mb-4 pa-4" rounded="lg" color="orange-lighten-5" elevation="1" border>
              <v-row>
                <v-col cols="12" md="6">
                  <v-autocomplete :items="YnItems" label="5. 您是否感覺活得很沒有價值？" v-model="list.qq5" :rules="emptyRules"
                    return-object item-title="text" item-value="text" variant="outlined"
                    density="comfortable"></v-autocomplete>
                </v-col>
              </v-row>
            </v-sheet>
          </div>
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
    default: 'geriatricdepressionscales',
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
const list = reactive({})
const isUnableToAssess = ref(false)

const requiredDateRules = [(v) => !!v || '不可空白']
const emptyRules = [(v) => !!v || '不可空白']
const requiredRemarkRules = computed(() => [
  (v) => {
    if (isUnableToAssess.value && !v) {
      return '無法評估時，原因為必填'
    }
    return true
  }
])

const headerTitle = computed(() => (processType.value === 'add' ? '新增情緒問題評估' : '修改情緒問題評估'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民情緒問題評估，包含生活滿意度、厭煩感、無用感等五項評估項目。'
    : '更新既有評估紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const YnItems = [
  { text: '是', Point: 0 },
  { text: '否', Point: 1 },
]

const YnItems2 = [
  { text: '是', Point: 1 },
  { text: '否', Point: 0 },
]

const handleUnableToAssessChange = (value) => {
  if (value) {
    // 勾選時，清除所有評估問題的答案
    list.qq1 = null
    list.qq2 = null
    list.qq3 = null
    list.qq4 = null
    list.qq5 = null
    if (!list.note) {
      list.note = ''
    }
  } else {
    // 取消勾選時，清除備註
    list.note = ''
  }
}

const openForAdd = () => {
  processType.value = 'add'
  Object.keys(list).forEach(key => delete list[key])
  isUnableToAssess.value = false
  
  if (props.items && props.items.length > 0) {
    const firstItem = JSON.parse(JSON.stringify(props.items[0]))
    delete firstItem.snkey
    delete firstItem.user_snkey
    delete firstItem.createInfo
    delete firstItem.create_man
    delete firstItem.create_man_snkey
    delete firstItem.editInfo
    delete firstItem.edit_man
    delete firstItem.uploadData
    delete firstItem.uploadState
    Object.assign(list, firstItem)
    // 根據 note 是否存在來設置 checkbox 狀態
    isUnableToAssess.value = !!list.note
  }
  
  dialog.value = true
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const openForEdit = (item) => {
  dialog.value = true
  processType.value = 'edit'
  Object.keys(list).forEach(key => delete list[key])
  Object.assign(list, JSON.parse(JSON.stringify(item)))
  // 根據 note 是否存在來設置 checkbox 狀態
  isUnableToAssess.value = !!list.note
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const closeDialog = () => {
  dialog.value = false
  loading.value = false
  isUnableToAssess.value = false
}

const handleAdd = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完全!!請重新確認!!',
      closeTime: 3,
    })
    return
  }

  loading.value = true
  list.user_snkey = store.state.uData.snkey
  list.createInfo = {
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }

  try {
    const postData = {
      datalist: JSON.stringify(list),
    }
    const response = await api.add(props.useDataBase, postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已新增',
        closeTime: 2,
      })
      dialog.value = false
      emit('refresh')
      emit('getAllData')
    } else {
      store.showToastMulti({
        type: 'error',
        message: '新增失敗，請稍後再試',
        closeTime: 3,
      })
    }
  } catch (error) {
    console.error('Add error:', error)
    store.showToastMulti({
      type: 'error',
      message: '新增失敗，請稍後再試',
      closeTime: 3,
    })
  } finally {
    loading.value = false
  }
}

const handleEdit = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完全!!請重新確認!!',
      closeTime: 3,
    })
    return
  }

  loading.value = true

  if (!list.editInfo) {
    list.editInfo = []
  }
  list.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })

  try {
    const postData = {
      snkey: list.snkey,
      datalist: JSON.stringify(list),
    }
    const response = await api.post(props.useDataBase, postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已修改',
        closeTime: 2,
      })
      dialog.value = false
      emit('refresh')
      emit('getAllData')
    } else {
      store.showToastMulti({
        type: 'error',
        message: '修改失敗，請稍後再試',
        closeTime: 3,
      })
    }
  } catch (error) {
    console.error('Edit error:', error)
    store.showToastMulti({
      type: 'error',
      message: '修改失敗，請稍後再試',
      closeTime: 3,
    })
  } finally {
    loading.value = false
  }
}

defineExpose({
  openForAdd,
  openForEdit,
})
</script>