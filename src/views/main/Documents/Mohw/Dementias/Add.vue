<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-brain</v-icon>
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
          <v-row class="mb-4">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="list.Date"
                type="date"
                label="評估日期"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-calendar"
                :rules="requiredDateRules"
              />
            </v-col>
            <v-col cols="12" md="8">
              <v-text-field
                label="備註(無法評估時請備註原因)"
                v-model="list.qq12"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <v-divider class="mb-6" v-if="!list.qq12" />

          <div v-if="!list.qq12">
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="YnItems"
                  label="1. 今天是幾年幾月幾日？__年__月__日 [年月日都對才算正確。]"
                  v-model="list.qq1"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="YnItems"
                  label="2. 今天是星期幾？ [星期對才算正確。]"
                  v-model="list.qq2"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="YnItems"
                  label="3. 這裡是什麼地方？ [對所在地的任何描述皆正確，如正確說出「我家」或「城鎮」等都可接受。]"
                  v-model="list.qq3"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="YnItems"
                  label="4. 你的電話號碼是幾號？ [證實電話號碼無誤即算正確或會談時，能在兩次間隔較長的時間內重複相同的號碼即算正確。]"
                  v-model="list.qq4"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="YnItems"
                  label="5. 你住在什麼地方？ [當個案沒有電話時才問。]"
                  v-model="list.qq5"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="YnItems"
                  label="6. 你幾歲了？ [年齡與出生年月日符合才算正確。]"
                  v-model="list.qq6"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="YnItems"
                  label="7. 你的生日是哪一天？ [年月日都對才算正確。]"
                  v-model="list.qq7"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="YnItems"
                  label="8. 現任總統是誰？ [姓氏正確即可。]"
                  v-model="list.qq8"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="YnItems"
                  label="9. 前任總統是誰？ [姓氏正確即可。]"
                  v-model="list.qq9"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="YnItems"
                  label="10. 你媽媽叫什麼名字？ [不需特別證實，當個案說出一個與他不同的女性姓名即可。]"
                  v-model="list.qq10"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="YnItems"
                  label="11. 從 20 減 3 開始算，一直減 3 減下去。 [期間如出現任何錯誤或無法繼續進行即算錯誤。]"
                  v-model="list.qq11"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="DEGREEItems"
                  label="心智功能程度"
                  v-model="list.DEGREE"
                  :rules="emptyRules"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
            </v-row>
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
    default: 'dementias',
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

const headerTitle = computed(() => (processType.value === 'add' ? '新增認知功能評估' : '修改認知功能評估'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民認知功能評估，包含時間定向、記憶、計算等十一項評估項目。'
    : '更新既有評估紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const YnItems = [
  { text: '對', Point: 1 },
  { text: '錯', Point: 0 },
]

const DEGREEItems = [
  '心智功能完好',
  '輕度智力缺損',
  '中度智力缺損',
  '嚴重智力缺損'
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