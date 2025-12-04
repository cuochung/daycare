<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="whilte" size="28">mdi-account-cog</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold mb-1">{{ headerTitle }}</h2>
            <p class="text-body-2 mb-0">{{ headerSubtitle }}</p>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
      </v-sheet>

      <v-card-text class="px-6 py-5">
        <v-form ref="formRef">
          <v-row class="mb-4">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="record.Date"
                type="date"
                label="評估日期"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-calendar"
                :rules="requiredDateRules"
              />
            </v-col>
            <v-col cols="12" md="8">
              <v-alert type="info" variant="tonal" border="start" color="primary">
                請依照評估流程逐項填寫日常生活功能評估項目。
              </v-alert>
            </v-col>
          </v-row>

          <v-divider class="mb-6" />

          <v-row v-for="(question, index) in questions" :key="question.key" class="mb-3">
            <v-col cols="12">
              <v-select
                :items="questionItems[index]"
                :label="question.label"
                v-model="record[question.key]"
                variant="outlined"
                density="comfortable"
                :rules="emptyRules"
                return-object
                item-title="text"
                item-value="text"
              >
                <!-- <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <v-list-item-title>
                      {{ item.raw.text }}
                      <span class="text-caption ml-2">({{ item.raw.Point }}分)</span>
                    </v-list-item-title>
                  </v-list-item>
                </template> -->
                <template #selection="{ item }">
                  {{ item.raw.text }} ({{ item.raw.Point }}分)
                </template>
              </v-select>
            </v-col>
          </v-row>
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
import { computed, reactive, ref, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const emit = defineEmits(['refresh'])

const props = defineProps({
  useDataBase: {
    type: String,
    default: 'adls',
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

const requiredDateRules = [(v) => !!v || '不可空白']
const emptyRules = [(v) => !!v || '不可空白']

const questions = [
  { key: 'qq1', label: '進食' },
  { key: 'qq2', label: '移位' },
  { key: 'qq3', label: '衛生' },
  { key: 'qq4', label: '如廁' },
  { key: 'qq5', label: '洗澡' },
  { key: 'qq6', label: '走動' },
  { key: 'qq7', label: '樓梯' },
  { key: 'qq8', label: '穿脫' },
  { key: 'qq9', label: '大便' },
  { key: 'qq10', label: '小便' },
]

const questionItems = [
  [
    { text: '不需他人協助，在合理的時間(一小時)內，可自行用餐具取用眼前食物，或能自行取用穿脫進食輔具，將餐盤內食物吃完。', Point: 10 },
    { text: '需他人協助取用或切好食物或穿脫進食輔具，但可自行吃飯。', Point: 5 },
    { text: '無法自行取食。', Point: 0 },
  ],
  [
    { text: '可自行坐起，且由床移位至椅子或輪椅，使用輪椅的煞車及腳踏板，都不需要他人協助，且沒有安全上的顧慮。', Point: 15 },
    { text: '移位時需要少部分協助或提醒，且有安全上的顧慮。', Point: 10 },
    { text: '可自行坐起，但移位至椅子或輪椅，需他人大部份的協助。', Point: 5 },
    { text: '不能自行移位，完全需他人協助才能坐起或移位。', Point: 0 },
  ],
  [
    { text: '可自行刷牙、洗臉、洗手、梳頭及刮鬍子。', Point: 5 },
    { text: '他人協助才能完成上述盥洗項目。', Point: 0 },
  ],
  [
    { text: '可自行上下馬桶，穿脫衣褲且不弄髒衣物，自行取用衛生紙擦拭清潔，且不需他人協助。如使用便盆(尿壺)，可自行取放並清洗乾淨。', Point: 10 },
    { text: '需扶持使用馬桶或便盆(尿壺)，協助整理衣物或使用衛生紙或協助清理便盆(尿壺)。', Point: 5 },
    { text: '完全需要他人協助。', Point: 0 },
  ],
  [
    { text: '可自行完成盆浴、淋浴或擦澡。', Point: 5 },
    { text: '他人協助才能完成，或可自行完成，但執行困難或清潔度不佳。', Point: 0 },
  ],
  [
    { text: '使用或不使用輔具(包括拐杖、支架、義肢或助行器)皆可獨立行走50公尺以上，無安全顧慮。', Point: 15 },
    { text: '需他人稍微扶持(如一手攙扶)或口頭教導，才可行走50公尺以上(一口氣走完或中間休息一次)。', Point: 10 },
    { text: '雖無法行走，但可獨立操作輪椅或電動輪椅(包含轉彎、進門及接近桌子、床沿)並可推行輪椅50公尺以上。', Point: 5 },
    { text: '不能行走50公尺，且無法操縱輪椅，完全依賴他人。', Point: 5 },
  ],
  [
    { text: '可自行上下樓梯(可抓扶手或用柺扙)。', Point: 10 },
    { text: '需要他人稍微扶持(指一手輕扶)或口頭指導。', Point: 5 },
    { text: '完全無法上下樓梯。', Point: 0 },
  ],
  [
    { text: '可自行穿脫衣褲鞋襪，必要時使用輔具。', Point: 10 },
    { text: '在別人幫助下，可自行完成一半以上動作。', Point: 5 },
    { text: '需要他人完全幫忙。', Point: 0 },
  ],
  [
    { text: '無失禁(控)，或當便秘、需要時能自行使用塞劑、甘油球，不需他人協助。', Point: 10 },
    { text: '偶而失禁(控)(每週不超過一次)，或當便秘時需協助使用塞劑。', Point: 5 },
    { text: '失禁(控)(每週超過二次(含)以上)或當便秘時需要灌腸。', Point: 0 },
  ],
  [
    { text: '日夜皆無尿失禁(控)，可完全自我控制。', Point: 10 },
    { text: '偶而失禁(控)(每週不超過一次)，使用尿布尿套時需他人幫忙。', Point: 5 },
    { text: '失禁(控)(每週超過二次(含)以上)或使用導尿管。', Point: 0 },
  ],
]

const createDefaultRecord = () => {
  const defaultRecord = {
    snkey: '',
    user_snkey: '',
    Date: '',
  }
  questions.forEach((q) => {
    defaultRecord[q.key] = null
  })
  return defaultRecord
}

const record = reactive(createDefaultRecord())

const headerTitle = computed(() => (processType.value === 'add' ? '新增日常生活功能評估' : '修改日常生活功能評估'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民日常生活功能評估，包含進食、移位、衛生等十項功能評估項目。'
    : '更新既有評估紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))


const resetRecord = () => {
  Object.assign(record, createDefaultRecord())
  originalRecord.value = null
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const closeDialog = () => {
  dialog.value = false
  loading.value = false
}

const openForAdd = () => {
  resetRecord()
  processType.value = 'add'
  
  // 如果有既有資料，複製第一筆作為預設值
  if (props.items && props.items.length > 0) {
    const firstItem = JSON.parse(JSON.stringify(props.items[0]))
    delete firstItem.snkey
    delete firstItem.user_snkey
    delete firstItem.createInfo
    delete firstItem.editInfo
    delete firstItem.uploadData
    delete firstItem.uploadState
    Object.assign(record, firstItem)
  }
  
  dialog.value = true
}

const openForEdit = (item) => {
  resetRecord()
  processType.value = 'edit'
  originalRecord.value = { ...item }
  Object.assign(record, JSON.parse(JSON.stringify(item)))
  dialog.value = true
}

const validateForm = async () => {
  const result = await formRef.value?.validate()
  return result?.valid ?? false
}

const handleAdd = async () => {
  const isValid = await validateForm()
  if (!isValid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完全!!請重新確認!!',
      closeTime: 3,
    })
    return
  }

  loading.value = true

  record.user_snkey = store.state.uData?.snkey
  record.createInfo = {
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }

  try {
    const postData = {
      datalist: JSON.stringify(record),
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
  const isValid = await validateForm()
  if (!isValid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完全!!請重新確認!!',
      closeTime: 3,
    })
    return
  }

  loading.value = true

  if (!record.editInfo) {
    record.editInfo = []
  }
  
  record.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })
  try {
    const postData = {
      snkey: record.snkey,
      datalist: JSON.stringify(record),
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
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

<style scoped lang="scss">
// 樣式可以根據需要添加
</style>
