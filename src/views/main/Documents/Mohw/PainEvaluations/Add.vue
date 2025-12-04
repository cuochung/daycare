<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-heart-pulse</v-icon>
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
            <v-text-field v-model="list.Date" type="date" label="評估日期" variant="outlined" density="comfortable"
              prepend-inner-icon="mdi-calendar" :rules="requiredDateRules" />
          </v-sheet>

          <!-- 備註 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="warning-lighten-5" elevation="1" border>
            <div class="d-flex align-center mb-3">
              <v-icon color="warning" class="mr-2">mdi-information</v-icon>
              <h3 class="text-h6 font-weight-medium">備註（若個案無疼痛或其他情形請填寫）</h3>
            </div>
            <v-text-field v-model="list.qq5" label="備註" variant="outlined" density="comfortable"
              placeholder="例如：個案無疼痛、無法評估等" hint="若填寫備註，則下方評估項目將隱藏" persistent-hint />
          </v-sheet>

          <!-- 評估項目 -->
          <div v-if="!list.qq5">
            <v-sheet class="mb-4 pa-4" rounded="lg" color="blue-lighten-5" elevation="1" border>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="list.qq1" label="部位" variant="outlined" density="comfortable"
                    prepend-inner-icon="mdi-map-marker" :rules="emptyRules" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="list.qq2" type="number" label="分數" variant="outlined" density="comfortable"
                    prepend-inner-icon="mdi-numeric" :rules="scoreRules" hint="1-10分，1-3分為輕微，4-6分為中度，7-9分為重度，10分為最無法忍受"
                    persistent-hint />
                </v-col>
              </v-row>
            </v-sheet>

            <v-sheet class="mb-4 pa-4" rounded="lg" color="green-lighten-5" elevation="1" border>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="list.qq3" type="date" label="時間" variant="outlined" density="comfortable"
                    prepend-inner-icon="mdi-clock" :rules="emptyRules" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="list.qq4" label="性質" variant="outlined" density="comfortable"
                    prepend-inner-icon="mdi-tag" :rules="emptyRules" />
                </v-col>
              </v-row>
            </v-sheet>
          </div>

          <!-- 說明提示 -->
          <v-alert class="mt-4" color="info" variant="tonal" border="start" density="comfortable">
            <template #prepend>
              <v-icon>mdi-information</v-icon>
            </template>
            <div class="text-body-2">
              <strong>疼痛分數評估說明：</strong><br>
              「1-3分」為輕微疼痛<br>
              「4-6分」為中度疼痛<br>
              「7-9分」為重度疼痛<br>
              「10分」為最無法忍受的疼痛程度<br>
              若個案無疼痛或其他情形請填寫備註。
            </div>
          </v-alert>
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
    default: 'painevaluations',
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

const requiredDateRules = [(v) => !!v || '不可空白']
const emptyRules = [(v) => !!v || '不可空白']
const scoreRules = [
  (v) => {
    if (!v) return '不可空白'
    const num = Number(v)
    if (isNaN(num) || num < 1 || num > 10) {
      return '分數必須在 1-10 之間'
    }
    return true
  }
]

const headerTitle = computed(() => (processType.value === 'add' ? '新增疼痛評估' : '修改疼痛評估'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民疼痛評估，包含部位、分數、時間、性質等評估項目。'
    : '更新既有評估紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const openForAdd = () => {
  processType.value = 'add'
  Object.keys(list).forEach(key => delete list[key])
  
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
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const closeDialog = () => {
  dialog.value = false
  loading.value = false
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

  // 驗證：如果沒有填寫備註，則必須填寫所有評估項目
  if (!list.qq5) {
    if (!list.qq1 || !list.qq2 || !list.qq3 || !list.qq4) {
      store.showToastMulti({
        type: 'warning',
        message: '若未填寫備註，則必須填寫所有評估項目（部位、分數、時間、性質）',
        closeTime: 3,
      })
      return
    }
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

  // 驗證：如果沒有填寫備註，則必須填寫所有評估項目
  if (!list.qq5) {
    if (!list.qq1 || !list.qq2 || !list.qq3 || !list.qq4) {
      store.showToastMulti({
        type: 'warning',
        message: '若未填寫備註，則必須填寫所有評估項目（部位、分數、時間、性質）',
        closeTime: 3,
      })
      return
    }
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
