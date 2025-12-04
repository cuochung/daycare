<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-food</v-icon>
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

          <!-- 評估問題 -->
          <v-sheet class="mb-4 pa-4" rounded="lg" color="blue-lighten-5" elevation="1" border>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete :items="qq1Items" label="1. 過去三個月之中，是否因食慾不佳、消化問題、咀嚼或吞嚥困難，以致進食量減少?"
                  v-model="list.qq1" :rules="emptyRules" return-object item-title="text" item-value="text"
                  variant="outlined" density="comfortable"></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete :items="qq2Items" label="2. 近三個月體重變化" v-model="list.qq2" :rules="emptyRules"
                  return-object item-title="text" item-value="text" variant="outlined" density="comfortable"></v-autocomplete>
              </v-col>
            </v-row>
          </v-sheet>

          <v-sheet class="mb-4 pa-4" rounded="lg" color="green-lighten-5" elevation="1" border>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete :items="qq3Items" label="3. 行動力" v-model="list.qq3" :rules="emptyRules" return-object
                  item-title="text" item-value="text" variant="outlined" density="comfortable"></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete :items="qq4Items" label="4. 過去三個月內曾有精神性壓力或急性疾病發作?" v-model="list.qq4"
                  :rules="emptyRules" return-object item-title="text" item-value="text" variant="outlined"
                  density="comfortable"></v-autocomplete>
              </v-col>
            </v-row>
          </v-sheet>

          <v-sheet class="mb-4 pa-4" rounded="lg" color="orange-lighten-5" elevation="1" border>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete :items="qq5Items" label="5. 神經精神問題" v-model="list.qq5" :rules="emptyRules"
                  return-object item-title="text" item-value="text" variant="outlined" density="comfortable"></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete :items="qq6Items" label="6. 身體質量指數(BMI)=體重(公斤)/身高(公尺)²" v-model="list.qq6"
                  return-object item-title="text" item-value="text" variant="outlined" density="comfortable"></v-autocomplete>
              </v-col>
            </v-row>
          </v-sheet>

          <v-sheet class="mb-4 pa-4" rounded="lg" color="purple-lighten-5" elevation="1" border>
            <v-autocomplete :items="qq7Items" label="7. 若BMI無法取得,用小腿圍或臂中圍代替(公分)" v-model="list.qq7"
              return-object item-title="text" item-value="text" variant="outlined" density="comfortable"></v-autocomplete>
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
    default: 'mnasfs',
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

const headerTitle = computed(() => (processType.value === 'add' ? '新增簡易營養評估' : '修改簡易營養評估'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民營養狀況評估，包含食慾、體重變化、行動力等七項評估項目。'
    : '更新既有評估紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const qq1Items = [
  { text: '嚴重食慾不佳', Point: 0 },
  { text: '中度食慾不佳', Point: 1 },
  { text: '食慾無變化', Point: 2 },
]

const qq2Items = [
  { text: '體重減輕>3公斤', Point: 0 },
  { text: '不知道', Point: 1 },
  { text: '體重減輕1~3公斤', Point: 2 },
  { text: '體重無改變', Point: 3 },
]

const qq3Items = [
  { text: '臥床或輪椅', Point: 0 },
  { text: '可以下床活動或離開輪椅但無法自由活動', Point: 1 },
  { text: '可以自由走動', Point: 2 },
]

const qq4Items = [
  { text: '是', Point: 0 },
  { text: '否', Point: 2 },
]

const qq5Items = [
  { text: '嚴重認知障礙或抑鬱', Point: 0 },
  { text: '輕度痴呆', Point: 1 },
  { text: '無精神問題', Point: 2 },
]

const qq6Items = [
  { text: 'BMI<19', Point: 0 },
  { text: '19≦BMI<21', Point: 1 },
  { text: '21≦BMI<23', Point: 2 },
  { text: 'BMI≧23', Point: 3 },
  { text: '', Point: 0 },
]

const qq7Items = [
  { text: '小腿圍<31', Point: 0 },
  { text: '小腿圍≧31', Point: 3 },
  { text: '臂中圍<22', Point: 0 },
  { text: '臂中圍≧22', Point: 3 },
  { text: '', Point: 0 },
]

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
