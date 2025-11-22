<template>
  <v-dialog v-model="dialog" max-width="900px" persistent>
    <v-card rounded="xl" class="inspectionreport-add">
      <v-sheet
        class="inspectionreport-add__header px-6 py-4"
        :color="headerColor"
        rounded="t-xl"
      >
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="48" :color="headerColor" class="mr-4">
              <v-icon color="white" size="26">mdi-clipboard-text</v-icon>
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
          <v-table class="inspectionreport-add__table">
            <thead>
              <tr>
                <th colspan="2" class="text-center">項目</th>
                <th>數值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-left" colspan="2">日期</td>
                <td>
                  <v-text-field
                    v-model="formData.date"
                    type="date"
                    variant="outlined"
                    density="compact"
                    hide-details
                    :rules="[rules.required]"
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">檢驗地點</td>
                <td>
                  <v-text-field
                    v-model="formData.location"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">白血球 3054~9060</td>
                <td>
                  <v-text-field
                    v-model="formData.leukocyte"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">紅血球 ♂:4~5.52 ♀:3.78~4.99</td>
                <td>
                  <v-text-field
                    v-model="formData.erythrocyte"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">血色素 ♂:13.2~17.2 ♀:10.8~14.9</td>
                <td>
                  <v-text-field
                    v-model="formData.hemoglobin"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">血小板 ♂:148~339 ♀:150~361</td>
                <td>
                  <v-text-field
                    v-model="formData.platelet"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">白蛋白 3.5~5.7</td>
                <td>
                  <v-text-field
                    v-model="formData.albumin"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">醣化血色素 4.0-6.0</td>
                <td>
                  <v-text-field
                    v-model="formData.glycosylatedhemoglobin"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">GOT(AST) 8 ~ 31</td>
                <td>
                  <v-text-field
                    v-model="formData.got"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">GPT(ALT) 0 ~ 41</td>
                <td>
                  <v-text-field
                    v-model="formData.gpt"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">血糖 AC:70-100、PC:﹤140</td>
                <td>
                  <v-text-field
                    v-model="formData.bloodsugar"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">膽固醇 ﹤200</td>
                <td>
                  <v-text-field
                    v-model="formData.cholesterol"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">TG ﹤150</td>
                <td>
                  <v-text-field
                    v-model="formData.tg"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">BUN 7~25</td>
                <td>
                  <v-text-field
                    v-model="formData.bun"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">CRE 0.6~1.3</td>
                <td>
                  <v-text-field
                    v-model="formData.cre"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">UA ♂:4.4~7.6 ♀:2.3~6.6</td>
                <td>
                  <v-text-field
                    v-model="formData.ua"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">Na 135~148</td>
                <td>
                  <v-text-field
                    v-model="formData.na"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">K 3.5~5.0</td>
                <td>
                  <v-text-field
                    v-model="formData.k"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">HDL ﹥40 / LDL ﹤130</td>
                <td>
                  <v-text-field
                    v-model="formData.hdlldl"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left align-middle" rowspan="7">尿液</td>
                <td>PH 5~8</td>
                <td>
                  <v-text-field
                    v-model="formData.ph"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td>尿蛋白 (-)</td>
                <td>
                  <v-text-field
                    v-model="formData.urineprotein"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td>OB (-)</td>
                <td>
                  <v-text-field
                    v-model="formData.ob"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td>RBC 0~5</td>
                <td>
                  <v-text-field
                    v-model="formData.rbc"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td>WBC 0~10</td>
                <td>
                  <v-text-field
                    v-model="formData.wbc"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td>Bacteria (-)</td>
                <td>
                  <v-text-field
                    v-model="formData.bacteria"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td>GLU (-)</td>
                <td>
                  <v-text-field
                    v-model="formData.glu"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left align-middle" rowspan="2">細菌培養</td>
                <td>Urine</td>
                <td>
                  <v-text-field
                    v-model="formData.urine"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td>Sputum</td>
                <td>
                  <v-text-field
                    v-model="formData.sputum"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">其他備註</td>
                <td>
                  <v-textarea
                    v-model="formData.note"
                    variant="outlined"
                    density="compact"
                    hide-details
                    rows="2"
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">處置</td>
                <td>
                  <v-text-field
                    v-model="formData.dispose"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
              <tr>
                <td class="text-left" colspan="2">追蹤</td>
                <td>
                  <v-text-field
                    v-model="formData.track"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="closeDialog"
        >
          取消
        </v-btn>
        <v-btn
          v-if="process === 'add'"
          color="primary"
          variant="flat"
          :loading="loading"
          :disabled="loading || !formValid"
          @click="handleAdd"
        >
          確認新增
        </v-btn>
        <v-btn
          v-if="process === 'edit'"
          color="success"
          variant="flat"
          :loading="loading"
          :disabled="loading || !formValid"
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

const headerTitle = computed(() => {
  return process.value === 'add' ? '新增檢驗報告單' : '修改檢驗報告單'
})

const headerSubtitle = computed(() =>
  process.value === 'add'
    ? '記錄檢驗報告數據，包含血液、尿液等各項檢驗結果。'
    : '更新檢驗報告單，保留完整醫療記錄。'
)

const headerColor = computed(() => (process.value === 'add' ? 'primary' : 'success'))

const rules = {
  required: (v) => !!v || '不可空白',
}

const resetForm = () => {
  formData.value = {
    date: dayjs().format('YYYY-MM-DD'),
    location: '',
    leukocyte: '',
    erythrocyte: '',
    hemoglobin: '',
    platelet: '',
    albumin: '',
    glycosylatedhemoglobin: '',
    got: '',
    gpt: '',
    bloodsugar: '',
    cholesterol: '',
    tg: '',
    bun: '',
    cre: '',
    ua: '',
    na: '',
    k: '',
    hdlldl: '',
    ph: '',
    urineprotein: '',
    ob: '',
    rbc: '',
    wbc: '',
    bacteria: '',
    glu: '',
    urine: '',
    sputum: '',
    note: '',
    dispose: '',
    track: '',
  }
  formRef.value?.resetValidation()
}

const openForAdd = () => {
  process.value = 'add'
  resetForm()
  dialog.value = true
}

const openForEdit = (record) => {
  process.value = 'edit'
  formData.value = { ...record }
  formRef.value?.resetValidation()
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  resetForm()
}

const buildPayload = () => {
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const username = store.state.pData.username ?? ''
  const userSnkey = store.state.pData.snkey ?? ''

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
    const response = await api.add('inspectionreport', payload)

    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '檢驗報告單已新增',
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
    console.error('新增檢驗報告單失敗:', error)
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
    const response = await api.post('inspectionreport', payload)

    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '檢驗報告單已修改',
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
    console.error('修改檢驗報告單失敗:', error)
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
.inspectionreport-add {
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
</style>
