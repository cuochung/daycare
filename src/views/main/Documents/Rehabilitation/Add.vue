<template>
  <v-dialog v-model="dialog" persistent max-width="1200" :retain-focus="false">
    <v-card rounded="xl" class="rehabilitation-add">
      <v-sheet
        class="rehabilitation-add__header px-6 py-4"
        :color="headerColor"
        rounded="t-xl"
      >
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="48" :color="headerColor" class="mr-4">
              <v-icon color="white" size="26">mdi-dumbbell</v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h6 font-weight-bold mb-1">{{ headerTitle }}</h2>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ headerSubtitle }}
              </p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
        </div>
      </v-sheet>

      <v-card-text class="px-6 py-5">
        <v-form ref="formRef">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="formData.date"
                label="評估日期"
                type="date"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <v-alert color="primary" variant="outlined" class="rehabilitation-add-alert-left-border">
                <v-sheet color="primary dark-1" class="pa-2 white--text" elevation="4">
                  <h2>1.關節活動度（ROM）</h2>
                </v-sheet>
                <v-row class="mt-3">
                  <v-col cols="12" sm="3">
                    <v-select :items="romItems" label="右上肢" v-model="formData.rom1" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-select :items="romItems" label="右下肢" v-model="formData.rom2" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-select :items="romItems" label="左上肢" v-model="formData.rom3" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-select :items="romItems" label="左下肢" v-model="formData.rom4" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
            <v-col cols="12">
              <v-alert color="primary" variant="outlined" class="rehabilitation-add-alert-left-border">
                <v-sheet color="primary dark-1" class="pa-2 white--text" elevation="4">
                  <h2>2.肌肉力量（MMT）</h2>
                </v-sheet>
                <v-row class="mt-3">
                  <v-col cols="12" sm="3">
                    <v-select :items="mmtItems" label="右上肢" v-model="formData.mmt1" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-select :items="mmtItems" label="右下肢" v-model="formData.mmt2" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-select :items="mmtItems" label="左上肢" v-model="formData.mmt3" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-select :items="mmtItems" label="左下肢" v-model="formData.mmt4" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
            <v-col cols="12">
              <v-alert color="primary" variant="outlined" class="rehabilitation-add-alert-left-border">
                <v-sheet color="primary dark-1" class="pa-2 white--text" elevation="4">
                  <h2>3.動作、姿態與步態</h2>
                </v-sheet>
                <v-row class="mt-3">
                  <v-col cols="12">
                    <v-select :items="actionItems" label="動作、姿態與步態" v-model="formData.action" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
            <v-col cols="12">
              <v-alert color="primary" variant="outlined" class="rehabilitation-add-alert-left-border">
                <v-sheet color="primary dark-1" class="pa-2 white--text" elevation="4">
                  <h2>4.肌肉張力(Muscle tone)</h2>
                </v-sheet>
                <v-row class="mt-3">
                  <v-col cols="12" sm="2">
                    <v-select :items="muscletoneItems" label="軀幹" v-model="formData.muscletone1" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-select :items="muscletoneItems" label="右上肢" v-model="formData.muscletone2" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-select :items="muscletoneItems" label="右下肢" v-model="formData.muscletone3" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-select :items="muscletoneItems" label="左上肢" v-model="formData.muscletone4" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-select :items="muscletoneItems" label="左下肢" v-model="formData.muscletone5" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
            <v-col cols="12">
              <v-alert color="primary" variant="outlined" class="rehabilitation-add-alert-left-border">
                <v-sheet color="primary dark-1" class="pa-2 white--text" elevation="4">
                  <h2>5.平衡（Balance）</h2>
                </v-sheet>
                <v-row class="mt-3">
                  <v-col cols="12" sm="2">
                    <v-select :items="balanceItems" label="坐姿靜態" v-model="formData.balance1" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-select :items="balanceItems" label="坐姿動態" v-model="formData.balance2" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-select :items="balanceItems" label="站姿靜態" v-model="formData.balance3" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-select :items="balanceItems" label="站姿動態" v-model="formData.balance4" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-select :items="balanceItems" label="坐姿到站姿/站姿到坐姿平衡" v-model="formData.balance5"
                      variant="outlined" density="comfortable" hide-details />
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
            <v-col cols="12">
              <v-alert color="primary" variant="outlined" class="rehabilitation-add-alert-left-border">
                <v-sheet color="primary dark-1" class="pa-2 white--text" elevation="4">
                  <h2>6.布郎斯壯分期（Brunnstrom's stage）(針對中風個案)</h2>
                </v-sheet>
                <v-row class="mt-3">
                  <v-col cols="12" sm="2">
                    <v-select :items="brunnstromItems" label="右上肢-近" v-model="formData.brunnstrom1"
                      variant="outlined" density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-select :items="brunnstromItems" label="右上肢-遠" v-model="formData.brunnstrom2"
                      variant="outlined" density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-select :items="brunnstromItems" label="左上肢-近" v-model="formData.brunnstrom3"
                      variant="outlined" density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-select :items="brunnstromItems" label="左上肢-遠" v-model="formData.brunnstrom4"
                      variant="outlined" density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-select :items="brunnstromItems" label="右下肢" v-model="formData.brunnstrom5" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-select :items="brunnstromItems" label="左下肢" v-model="formData.brunnstrom6" variant="outlined"
                      density="comfortable" hide-details />
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
            <v-col cols="12">
              <v-alert color="primary" variant="outlined" class="rehabilitation-add-alert-left-border">
                <v-sheet color="primary dark-1" class="pa-2 white--text" elevation="4">
                  <h2>7.短期目標（Short term goals）</h2>
                </v-sheet>
                <v-row class="mt-3">
                  <v-col cols="12">
                    <v-textarea label="短期目標（Short term goals）" v-model="formData.shorttermgoals"
                      variant="outlined" auto-grow rows="3" hide-details />
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
            <v-col cols="12">
              <v-alert color="primary" variant="outlined" class="rehabilitation-add-alert-left-border">
                <v-sheet color="primary dark-1" class="pa-2 white--text" elevation="4">
                  <h2>8.長期目標（Long term goals）</h2>
                </v-sheet>
                <v-row class="mt-3">
                  <v-col cols="12">
                    <v-textarea label="長期目標（Long term goals）" v-model="formData.longtermgoals"
                      variant="outlined" auto-grow rows="3" hide-details />
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
            <v-col cols="12">
              <v-alert color="primary" variant="outlined" class="rehabilitation-add-alert-left-border">
                <v-sheet color="primary dark-1" class="pa-2 white--text" elevation="4">
                  <h2>9.治療項目（Treatment programs）</h2>
                </v-sheet>
                <v-row class="mt-3">
                  <v-col cols="12">
                    <v-textarea label="治療項目（Treatment programs）" v-model="formData.treatmentprograms"
                      variant="outlined" auto-grow rows="3" hide-details />
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-6 py-4">
        <v-spacer />
        <v-btn color="secondary" variant="text" @click="closeDialog" :disabled="loading">
          取消
        </v-btn>
        <v-btn
          v-if="isAddMode"
          color="primary"
          variant="flat"
          prepend-icon="mdi-content-save"
          :loading="loading"
          :disabled="loading"
          @click="handleAdd"
        >
          確認新增
        </v-btn>
        <v-btn
          v-else
          color="success"
          variant="flat"
          prepend-icon="mdi-content-save"
          :loading="loading"
          :disabled="loading"
          @click="handleEdit"
        >
          確認修改
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import dayjs from 'dayjs'
import { computed, getCurrentInstance, reactive, ref } from 'vue'

import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const emit = defineEmits(['refresh'])

const store = useStore()
const { proxy } = getCurrentInstance()

const dialog = ref(false)
const formRef = ref(null)
const loading = ref(false)

const processType = ref('add')
const formData = reactive({
  snkey: '',
  date: dayjs().format('YYYY-MM-DD'),
  rom1: '',
  rom2: '',
  rom3: '',
  rom4: '',
  mmt1: '',
  mmt2: '',
  mmt3: '',
  mmt4: '',
  action: '',
  muscletone1: '',
  muscletone2: '',
  muscletone3: '',
  muscletone4: '',
  muscletone5: '',
  balance1: '',
  balance2: '',
  balance3: '',
  balance4: '',
  balance5: '',
  brunnstrom1: '',
  brunnstrom2: '',
  brunnstrom3: '',
  brunnstrom4: '',
  brunnstrom5: '',
  brunnstrom6: '',
  shorttermgoals: '',
  longtermgoals: '',
  treatmentprograms: '',
})

const romItems = ['無障礙', '輕度限制', '中度限制', '重度限制', '完全限制']
const mmtItems = ['5', '4', '3', '2', '1', '無法施測']
const actionItems = [
  '床上活動困難',
  '轉位困難',
  '坐姿功能異常',
  '站姿功能異常',
  '步態不穩',
  '上肢功能受限',
  '姿態或動作型態異常',
  '正常',
]
const muscletoneItems = ['正常', '高張', '低張']
const balanceItems = ['良好', '較差', '不佳', '無法評估']
const brunnstromItems = ['I', 'II', 'III', 'IV', 'V', 'VI']

const rules = {
  required: (value) => !!value || '不可空白',
}

const isAddMode = computed(() => processType.value === 'add')

const headerTitle = computed(() => (isAddMode.value ? '新增復健評估' : '修改復健評估'))
const headerSubtitle = computed(() =>
  isAddMode.value
    ? '記錄個案的復健評估資料，包含關節活動度、肌肉力量、平衡能力等評估項目。'
    : '更新復健評估，追蹤復健進度變化。'
)
const headerColor = computed(() => (isAddMode.value ? 'primary' : 'success'))

const resetForm = () => {
  formData.snkey = ''
  formData.date = dayjs().format('YYYY-MM-DD')
  formData.rom1 = ''
  formData.rom2 = ''
  formData.rom3 = ''
  formData.rom4 = ''
  formData.mmt1 = ''
  formData.mmt2 = ''
  formData.mmt3 = ''
  formData.mmt4 = ''
  formData.action = ''
  formData.muscletone1 = ''
  formData.muscletone2 = ''
  formData.muscletone3 = ''
  formData.muscletone4 = ''
  formData.muscletone5 = ''
  formData.balance1 = ''
  formData.balance2 = ''
  formData.balance3 = ''
  formData.balance4 = ''
  formData.balance5 = ''
  formData.brunnstrom1 = ''
  formData.brunnstrom2 = ''
  formData.brunnstrom3 = ''
  formData.brunnstrom4 = ''
  formData.brunnstrom5 = ''
  formData.brunnstrom6 = ''
  formData.shorttermgoals = ''
  formData.longtermgoals = ''
  formData.treatmentprograms = ''
  formRef.value?.resetValidation()
}

const closeDialog = () => {
  // if (loading.value) return
  dialog.value = false
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
      message: '資料輸入不完整，請檢查後再試',
      closeTime: 2,
    })
    return
  }

  loading.value = true
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const currentData = JSON.parse(JSON.stringify(formData))
  currentData.u_snkey = store.state?.uData?.snkey
  currentData.createInfo = {
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: timestamp,
  }
  currentData.editInfo = []

  const payload = {
    datalist: JSON.stringify(currentData),
  }

  try {
    const response = await api.add('rehabilitation', payload)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '復健評估已新增',
        closeTime: 2,
      })
      resetForm()
      closeDialog()
      emit('refresh')
    } else {
      store.showToastMulti({
        type: 'error',
        message: '新增失敗，請稍後再試',
        closeTime: 3,
      })
    }
  } catch (error) {
    console.error('新增失敗:', error)
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
      message: '資料輸入不完整，請檢查後再試',
      closeTime: 2,
    })
    return
  }

  loading.value = true
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const currentData = JSON.parse(JSON.stringify(formData))
  currentData.u_snkey = store.state?.uData?.snkey

  if (!Array.isArray(currentData.editInfo)) {
    currentData.editInfo = []
  }
  currentData.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: timestamp,
  })

  const payload = {
    snkey: formData.snkey,
    datalist: JSON.stringify(currentData),
  }

  try {
    const response = await api.post('rehabilitation', payload)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '復健評估已修改',
        closeTime: 2,
      })
      closeDialog()
      emit('refresh')
    } else {
      store.showToastMulti({
        type: 'error',
        message: '修改失敗，請稍後再試',
        closeTime: 3,
      })
    }
  } catch (error) {
    console.error('修改失敗:', error)
    store.showToastMulti({
      type: 'error',
      message: '修改失敗，請稍後再試',
      closeTime: 3,
    })
  } finally {
    loading.value = false
  }
}

const openForAdd = () => {
  processType.value = 'add'
  resetForm()
  dialog.value = true
}

const openForEdit = (record) => {
  processType.value = 'edit'
  Object.assign(formData, JSON.parse(JSON.stringify(record)))
  formData.snkey = record.snkey || ''

  formRef.value?.resetValidation()
  dialog.value = true
}

defineExpose({
  openForAdd,
  openForEdit,
  closeDialog,
})
</script>

<style scoped lang="scss">
.rehabilitation-add {
  &-alert-left-border {
    border-left: 4px solid #1976d2 !important;
  }
}
</style>