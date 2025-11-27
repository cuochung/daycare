<template>
  <v-dialog v-model="dialog" persistent>
    <v-card rounded="xl" class="spmsq-add">
      <v-sheet
        class="spmsq-add__header px-6 py-4"
        :color="headerColor"
        rounded="t-xl"
      >
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="48" :color="headerColor" class="mr-4">
              <v-icon color="white" size="26">mdi-brain</v-icon>
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

      <v-divider />

      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="formValid">
          <v-table class="spmsq-add__table">
            <tbody>
              <tr>
                <td class="form_title align-middle" colspan="4">評估日期</td>
                <td>
                  <v-text-field v-model="formData.date" type="date" variant="outlined" density="compact" hide-details
                    :rules="[rules.required]" />
                </td>
              </tr>
              <tr>
                <td class="form_title vertical-mode" rowspan="12">
                  簡易心智狀態 SPMSQ ( 錯誤請打X )
                </td>
                <td class="form_title">1</td>
                <td colspan="2">今天是幾號? (年、月、日都對才算正確)</td>
                <td>
                  <v-select v-model="formData.q1" :items="answerOptions" variant="outlined" density="compact"
                    hide-details />
                </td>
              </tr>
              <tr>
                <td class="form_title">2</td>
                <td colspan="2">今天是星期幾? (星期對才算正確)</td>
                <td>
                  <v-select v-model="formData.q2" :items="answerOptions" variant="outlined" density="compact"
                    hide-details />
                </td>
              </tr>
              <tr>
                <td class="form_title">3</td>
                <td colspan="2">這是什麼地方? (對所在地有任何的描述都正確;說"我的家"或正確說出城鎮、醫院、機構的名稱都可以)</td>
                <td>
                  <v-select v-model="formData.q3" :items="answerOptions" variant="outlined" density="compact"
                    hide-details />
                </td>
              </tr>
              <tr>
                <td class="form_title">4-1</td>
                <td colspan="2" class="text-nowrap">您的電話號碼是幾號? (經確認號碼後証實無誤即算正確;或在會談時,能在二次間隔較長時間內重覆相同的號碼即算正確)</td>
                <td>
                  <v-select v-model="formData['q4-1']" :items="answerOptions" variant="outlined" density="compact"
                    hide-details />
                </td>
              </tr>
              <tr>
                <td class="form_title">4-2</td>
                <td colspan="2">您住在什麼地方? (如長輩沒有電話才問此問題)</td>
                <td>
                  <v-select v-model="formData['q4-2']" :items="answerOptions" variant="outlined" density="compact"
                    hide-details />
                </td>
              </tr>
              <tr>
                <td class="form_title">5</td>
                <td colspan="2">您幾歲了? (年齡與出生年月日符合才算正確)</td>
                <td>
                  <v-select v-model="formData.q5" :items="answerOptions" variant="outlined" density="compact"
                    hide-details />
                </td>
              </tr>
              <tr>
                <td class="form_title">6</td>
                <td colspan="2">您的出生年月日? (年、月、日都對才算正確)</td>
                <td>
                  <v-select v-model="formData.q6" :items="answerOptions" variant="outlined" density="compact"
                    hide-details />
                </td>
              </tr>
              <tr>
                <td class="form_title">7</td>
                <td colspan="2">現任的總統是誰? (姓氏正確即可)</td>
                <td>
                  <v-select v-model="formData.q7" :items="answerOptions" variant="outlined" density="compact"
                    hide-details />
                </td>
              </tr>
              <tr>
                <td class="form_title">8</td>
                <td colspan="2">前任的總統是誰? (姓氏正確即可)</td>
                <td>
                  <v-select v-model="formData.q8" :items="answerOptions" variant="outlined" density="compact"
                    hide-details />
                </td>
              </tr>
              <tr>
                <td class="form_title">9</td>
                <td colspan="2">您媽媽叫什麼名字? (不需要特別証實,只需長輩說出一個與他不同的女性姓名即可)</td>
                <td>
                  <v-select v-model="formData.q9" :items="answerOptions" variant="outlined" density="compact"
                    hide-details />
                </td>
              </tr>
              <tr>
                <td class="form_title">10</td>
                <td colspan="2">從20減3開始算,一直減3減下去 (期間如有出現任何錯誤或無法繼續進行即算錯誤)</td>
                <td>
                  <v-select v-model="formData.q10" :items="answerOptions" variant="outlined" density="compact"
                    hide-details />
                </td>
              </tr>
              <tr>
                <td class="form_title" colspan="2">
                  <div class="text-body-2">
                    <strong>註1:進行方式:</strong><br />
                    依上表所列的問題,詢問住民並將結果紀錄下來,(如果住民家中沒有電話,可將4-1題改為4-2題),答錯的問題請紀錄下來。<br />
                    <strong>註2:失智症狀評估標準:</strong><br />
                    錯0~2題:心智功功能完整<br />
                    錯3~4題:輕度心智功能障礙<br />
                    錯5~7題:中度心智功能障礙<br />
                    錯8~10題:重度心智功能障礙
                  </div>
                </td>
                <td>錯幾題</td>
                <td>
                  <v-text-field :model-value="total" readonly variant="outlined" density="compact" hide-details
                    color="error" class="font-weight-bold" />
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="closeDialog">
          取消
        </v-btn>
        <v-btn v-if="process === 'add'" color="primary" variant="flat" :loading="loading"
          :disabled="loading || !formValid" @click="handleAdd">
          確認新增
        </v-btn>
        <v-btn v-if="process === 'edit'" color="success" variant="flat" :loading="loading"
          :disabled="loading || !formValid" @click="handleEdit">
          確認修改
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import dayjs from 'dayjs'
import { computed, getCurrentInstance, ref } from 'vue'

import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const store = useStore()
const { proxy } = getCurrentInstance()

const emit = defineEmits(['refresh'])

const dialog = ref(false)
const formRef = ref(null)
const formValid = ref(false)
const loading = ref(false)
const process = ref('')
const formData = ref({})

const answerOptions = [
  { title: 'O (正確)', value: '0' },
  { title: 'X (錯誤)', value: '1' },
]

const headerTitle = computed(() => {
  return process.value === 'add' ? '新增簡易心智狀態SPMSQ' : '修改簡易心智狀態SPMSQ'
})

const headerSubtitle = computed(() =>
  process.value === 'add'
    ? '評估住民認知功能，記錄簡易心智狀態問卷結果。'
    : '更新簡易心智狀態評估，追蹤認知功能變化。'
)

const headerColor = computed(() => (process.value === 'add' ? 'primary' : 'success'))

const total = computed(() => {
  let totalPoint = 0
  const questionKeys = ['q1', 'q2', 'q3', 'q4-1', 'q4-2', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10']
  questionKeys.forEach((key) => {
    if (formData.value[key] === '1') {
      totalPoint++
    }
  })
  formData.value.total = totalPoint
  return totalPoint
})

const rules = {
  required: (v) => !!v || '不可空白',
}

const resetForm = () => {
  formData.value = {
    date: '',
    q1: '0',
    q2: '0',
    q3: '0',
    'q4-1': '0',
    'q4-2': '0',
    q5: '0',
    q6: '0',
    q7: '0',
    q8: '0',
    q9: '0',
    q10: '0',
    total: 0,
  }
  formRef.value?.resetValidation()
}

const openForAdd = () => {
  process.value = 'add'
  resetForm()
  formData.value.date = dayjs().format('YYYY-MM-DD')
  dialog.value = true
}

const openForEdit = (record) => {
  process.value = 'edit'
  formData.value = {
    ...record,
    date: record.date || '',
    q1: record.q1 || '0',
    q2: record.q2 || '0',
    q3: record.q3 || '0',
    'q4-1': record['q4-1'] || '0',
    'q4-2': record['q4-2'] || '0',
    q5: record.q5 || '0',
    q6: record.q6 || '0',
    q7: record.q7 || '0',
    q8: record.q8 || '0',
    q9: record.q9 || '0',
    q10: record.q10 || '0',
  }
  formRef.value?.resetValidation()
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  resetForm()
}

const buildPayload = () => {
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const username = store.state?.pData?.username ?? ''
  const userSnkey = store.state?.pData?.snkey ?? ''

  const dataPayload = {
    ...formData.value,
    u_snkey: store.state?.uData?.snkey,
  }

  if (process.value === 'add') {
    dataPayload.createInfo = {
      snkey: userSnkey,
      name: username,
      time: timestamp,
    }
    dataPayload.editInfo = []
  } else {
    dataPayload.editInfo = [
      {
        snkey: userSnkey,
        name: username,
        time: timestamp,
      },
    ]
  }

  const payload = {
    datalist: JSON.stringify(dataPayload),
  }

  if (process.value === 'edit') {
    payload.snkey = formData.value.snkey
  }

  return payload
}

const handleAdd = async () => {
  const valid = await formRef.value?.validate()
  if (!valid?.valid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完全，請重新確認！',
      closeTime: 3,
    })
    return
  }

  loading.value = true
  try {
    const payload = buildPayload()
    const response = await api.add('spmsq', payload)

    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '評估資料已新增',
        closeTime: 2,
      })
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
    console.error('新增評估資料失敗:', error)
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
  const valid = await formRef.value?.validate()
  if (!valid?.valid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完全，請重新確認！',
      closeTime: 3,
    })
    return
  }

  loading.value = true
  try {
    const payload = buildPayload()
    const response = await api.post('spmsq', payload)

    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '評估資料已修改',
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
    console.error('修改評估資料失敗:', error)
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
.spmsq-add {
  &__header {
    background-image: linear-gradient(135deg, rgba(33, 150, 243, 0.12), rgba(33, 150, 243, 0.04));
  }

  &__table {
    width: 100%;

    tbody td {
      padding: 8px 12px;
      border: 1px solid rgba(0, 0, 0, 0.12);
    }

    .form_title {
      font-size: 1.1rem;
      text-align: center;
      font-weight: 600;
      background: rgba(33, 150, 243, 0.08);
    }

    .vertical-mode {
      writing-mode: vertical-rl;
      -webkit-writing-mode: vertical-rl;
      white-space: nowrap;
    }
  }
}
</style>
