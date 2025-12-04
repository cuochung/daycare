<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-hospital-box</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold mb-1">{{ headerTitle }}</h2>
            <p class="text-body-2 mb-0">{{ headerSubtitle }}</p>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
      </v-sheet>

      <v-card-text class="px-6 py-5">
        <v-form ref="formRef" class="mt-3">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                type="date"
                label="評估日期"
                v-model="record.Date"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="8">
              <v-alert type="info" variant="tonal" border="start" color="primary">
                請依照評估流程逐項填寫疾病史評估項目。
              </v-alert>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="主要診斷(ICD10)"
                v-model="record.AnsOther_1"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="次要診斷"
                v-model="record.AnsOther_2"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                :items="QuestionItems"
                label="心臟問題(只包含心臟)"
                v-model="record.qq1"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                :items="QuestionItems"
                label="周邊血管系統問題(包括高血壓)"
                v-model="record.qq2"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                :items="QuestionItems"
                label="造血系統問題(貧血、血球、淋巴、骨髓、脾臟等)"
                v-model="record.qq3"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                :items="QuestionItems"
                label="呼吸系統問題(肺部、支氣管、氣管及抽菸狀況)"
                v-model="record.qq4"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                :items="QuestionItems"
                label="眼耳鼻喉問題"
                v-model="record.qq5"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                :items="QuestionItems"
                label="上消化道問題(食道、胃、十二指腸)"
                v-model="record.qq6"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                :items="QuestionItems"
                label="下消化道問題(小腸、大腸、直腸)"
                v-model="record.qq7"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                :items="QuestionItems"
                label="肝膽胰臟問題"
                v-model="record.qq8"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                :items="QuestionItems"
                label="腎臟問題"
                v-model="record.qq9"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                :items="QuestionItems"
                label="其他泌尿生殖系統問題(輸尿管、尿道、膀胱、攝護腺、其他生殖系統問題)"
                v-model="record.qq10"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                :items="QuestionItems"
                label="肌肉骨骼皮膚問題"
                v-model="record.qq11"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                :items="QuestionItems"
                label="神經系統問題(腦部、脊髓、周邊神經等、不包含失智症)"
                v-model="record.qq12"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                :items="QuestionItems"
                label="內分泌、感染與代謝問題(包含糖尿病、甲狀腺、肥胖、乳房異常、感染性疾病與毒藥物問題)"
                v-model="record.qq13"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                :items="QuestionItems"
                label="情緒與行為問題(包括憂鬱、焦慮、激躁、急性混亂、瞻妄及失智症等問題)"
                v-model="record.qq14"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-6 py-4">
        <v-spacer></v-spacer>
        <v-btn variant="tonal" color="secondary" @click="closeDialog">
          取消
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="handleAdd"
          v-if="processType == 'add'"
          :loading="loading"
          :disabled="loading"
        >
          確認新增
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="handleEdit"
          v-if="processType == 'edit'"
          :loading="loading"
          :disabled="loading"
        >
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

const emit = defineEmits(['refresh'])

const props = defineProps({
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

const emptyRules = [(v) => !!v || '不可空白']

const QuestionItems = ['無', '輕微', '中等', '重度', '極重度']

const createDefaultRecord = () => ({
  snkey: '',
  user_snkey: '',
  Date: '',
  AnsOther_1: '',
  AnsOther_2: '',
  qq1: '',
  qq2: '',
  qq3: '',
  qq4: '',
  qq5: '',
  qq6: '',
  qq7: '',
  qq8: '',
  qq9: '',
  qq10: '',
  qq11: '',
  qq12: '',
  qq13: '',
  qq14: '',
  createInfo: {},
  editInfo: [],
})

const record = reactive(createDefaultRecord())

const headerTitle = computed(() => (processType.value === 'add' ? '新增疾病史評估' : '修改疾病史評估'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民疾病史評估資料，包含心臟、血管、呼吸等十四項系統評估項目。'
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

  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
  record.user_snkey = store.state.uData?.snkey
  record.createInfo = {
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: timestamp,
  }

  try {
    const postData = {
      datalist: JSON.stringify(record),
    }

    const response = await api.add('medicalhistories', postData)
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

  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
  if (!record.editInfo) {
    record.editInfo = []
  }
  record.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: timestamp,
  })

  try {
    const postData = {
      snkey: record.snkey,
      datalist: JSON.stringify(record),
      updateTime: timestamp,
    }

    const response = await api.post('medicalhistories', postData)
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
