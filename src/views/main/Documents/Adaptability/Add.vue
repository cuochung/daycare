<template>
  <v-dialog v-model="dialog" persistent max-width="900">
    <v-card rounded="xl" class="adaptability-add">
      <v-sheet
        class="adaptability-add__header px-6 py-4"
        :color="headerColor"
        rounded="t-xl"
      >
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="48" :color="headerColor" class="mr-4">
              <v-icon color="white" size="26">mdi-account-check</v-icon>
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
          <v-table class="adaptability-add__table">
            <thead>
              <tr>
                <th colspan="2" class="text-center">評估項目</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td class="text-center align-middle">評估日期</td>
                  <td>
                  <v-text-field v-model="form.date" type="date" variant="outlined" density="comfortable"
                    :rules="[rules.required]" hide-details />
                  </td>
                </tr>
              <tr>
                <td class="text-left">1.入住意願接受度</td>
                <td>
                  <v-select :items="question1Items" v-model="formData.question1" item-title="text" return-object
                    variant="outlined" density="comfortable" hide-details />
                </td>
              </tr>
              <tr>
                <td class="text-left">2.家屬配合度</td>
                <td>
                  <v-select :items="question2Items" v-model="formData.question2" item-title="text" return-object
                    variant="outlined" density="comfortable" hide-details />
                </td>
              </tr>
              <tr>
                <td class="text-left">3.情緒</td>
                <td>
                  <v-select :items="question3Items" v-model="formData.question3" item-title="text" return-object
                    variant="outlined" density="comfortable" hide-details />
                </td>
              </tr>
              <tr>
                <td class="text-left">4.行為</td>
                <td>
                  <v-select :items="question4Items" v-model="formData.question4" item-title="text" return-object
                    variant="outlined" density="comfortable" hide-details />
                </td>
              </tr>
              <tr>
                <td class="text-left">5.社會化(參與度)</td>
                <td>
                  <v-select :items="question5Items" v-model="formData.question5" item-title="text" return-object
                    variant="outlined" density="comfortable" hide-details />
                </td>
              </tr>
              <tr>
                <td class="text-left">6.家庭支持度</td>
                <td>
                  <v-select :items="question6Items" v-model="formData.question6" item-title="text" return-object
                    variant="outlined" density="comfortable" hide-details />
                </td>
              </tr>
            </tbody>
          </v-table>

          <v-alert color="error" variant="outlined" class="mt-4 adaptability-add-alert-left-border">
              <v-sheet color="error dark-1" class="pa-2 white--text" elevation="4">
                <h2 class="d-flex">
                  評估結果:
                <v-spacer />
                <span>總分: {{ total }} 分</span>
                </h2>
              </v-sheet>
            </v-alert>

          <v-alert color="success" variant="outlined" class="mt-4 adaptability-add-alert-left-border-success">
              <v-sheet color="success dark-1" class="pa-2 white--text" elevation="4">
                <h2>結果說明</h2>
              </v-sheet>
            <v-textarea v-model="formData.result_description" variant="outlined" rows="8" class="mt-3" hide-details />
                </v-alert>
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
const form = reactive({
  snkey: '',
  date: dayjs().format('YYYY-MM-DD'),
})
const formData = reactive({
  question1: null,
  question2: null,
  question3: null,
  question4: null,
  question5: null,
  question6: null,
  result_description: '',
  total: 0,
})

const question1Items = [
  { score: 0, text: '無法評估' },
  { score: 1, text: '不願意' },
  { score: 2, text: '無意見' },
  { score: 3, text: '可接受' },
]

const question2Items = [
  { score: 0, text: '無家屬' },
  { score: 1, text: '欠佳' },
  { score: 2, text: '需溝通' },
  { score: 3, text: '良好' },
]

const question3Items = [
  { score: 0, text: '暴躁' },
  { score: 0, text: '無法評估' },
  { score: 1, text: '鬱悶' },
  { score: 2, text: '有起伏' },
  { score: 3, text: '穩定' },
]

const question4Items = [
  { score: 0, text: '衝動' },
  { score: 0, text: '無法評估' },
  { score: 1, text: '不穩' },
  { score: 2, text: '偶違常' },
  { score: 3, text: '正常' },
]

const question5Items = [
  { score: 0, text: '拒絕' },
  { score: 0, text: '無法評估' },
  { score: 1, text: '較被動需帶領' },
  { score: 2, text: '需鼓勵' },
  { score: 3, text: '主動' },
]

const question6Items = [
  { score: 0, text: '失聯' },
  { score: 1, text: '偶爾訪' },
  { score: 2, text: '月訪' },
  { score: 3, text: '週訪' },
]

const rules = {
  required: (value) => !!value || '不可空白',
}

const isAddMode = computed(() => processType.value === 'add')

const headerTitle = computed(() => (isAddMode.value ? '新增適應性評估' : '修改適應性評估'))
const headerSubtitle = computed(() =>
  isAddMode.value
    ? '評估住民入住後的適應性，包含入住意願、家屬配合度、情緒、行為等面向。'
    : '更新適應性評估，追蹤住民適應狀況變化。'
)
const headerColor = computed(() => (isAddMode.value ? 'primary' : 'success'))

const total = computed(() => {
  let sum = 0
  const questions = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6']
  questions.forEach((key) => {
    if (formData[key] && formData[key].score !== undefined) {
      sum += formData[key].score
    }
  })
  formData.total = sum
  return sum
})

const resetForm = () => {
  form.snkey = ''
  form.date = dayjs().format('YYYY-MM-DD')
  formData.question1 = null
  formData.question2 = null
  formData.question3 = null
  formData.question4 = null
  formData.question5 = null
  formData.question6 = null
  formData.result_description = ''
  formData.total = 0
  formRef.value?.resetValidation()
}

const closeDialog = () => {
  if (loading.value) return
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
  const payload = {
    datalist: JSON.stringify({
      u_snkey: store.state?.uData?.snkey,
      date: form.date,
      question1: formData.question1,
      question2: formData.question2,
      question3: formData.question3,
      question4: formData.question4,
      question5: formData.question5,
      question6: formData.question6,
      total: total.value,
      result_description: formData.result_description,
      createInfo: {
        snkey: store.state.pData.snkey,
        name: store.state.pData.username,
        time: timestamp,
      },
      editInfo: [],
    }),
  }

  const response = await api.add('adaptability', payload)
  loading.value = false

  if (response?.state == 1) {
    store.showToastMulti({
      type: 'success',
      message: '適應性評估已新增',
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
  currentData.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: timestamp,
  })

  const payload = {
    snkey: formData.snkey,
    datalist: JSON.stringify(currentData),
    updateTime: timestamp,
  }

  const response = await api.post('adaptability', payload)
  loading.value = false

  if (response?.state == 1) {
    store.showToastMulti({
      type: 'success',
      message: '適應性評估已更新',
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
}

const openForAdd = () => {
  processType.value = 'add'
  resetForm()
  dialog.value = true
}

const openForEdit = (record) => {
  processType.value = 'edit'
  Object.assign(formData, JSON.parse(JSON.stringify(record)))

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
.adaptability-add {
  &__header {
    background-image: linear-gradient(135deg, rgba(33, 150, 243, 0.12), rgba(33, 150, 243, 0.04));
  }

  &__table {
    width: 100%;

    thead th {
      background: rgba(33, 150, 243, 0.08);
      font-weight: 600;
      padding: 12px;
    }

    tbody td {
      padding: 8px 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }
  }
}

.adaptability-add-alert-left-border {
  border-left: 4px solid rgb(var(--v-theme-error)) !important;
}

.adaptability-add-alert-left-border-success {
  border-left: 4px solid rgb(var(--v-theme-success)) !important;
}
</style>
