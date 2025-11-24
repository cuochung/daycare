<template>
  <v-dialog v-model="dialog" persistent max-width="1200" :retain-focus="false">
    <v-card rounded="xl" class="treatment-add">
      <v-sheet
        class="treatment-add__header px-6 py-4"
        :color="headerColor"
        rounded="t-xl"
      >
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="48" :color="headerColor" class="mr-4">
              <v-icon color="white" size="26">mdi-file-document-edit</v-icon>
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
            <v-card>
              <v-card-text>
              <v-row>
                <v-col cols="3">
                  <v-text-field
                    v-model="form.date"
                    label="評估日期"
                    type="date"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  />
                </v-col>
                <v-col cols="9"></v-col>

                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="treatment-add-alert-left-border">
                    <h3>一、住民基本資料</h3>
                    <v-row class="mt-2">
                      <v-col cols="3">床號:{{ userData.bed_name }}</v-col>
                      <v-col cols="3">入住日期:{{ userData.in_date }}</v-col>
                      <v-col cols="3">姓名:{{ userData.name }}</v-col>
                      <v-col cols="3">性別:{{ userData.sex }}</v-col>
                      <v-col cols="3">生日:{{ userData.birthday }}</v-col>
                      <v-col cols="9">身分別:{{ Array.isArray(userData.nursingAssessment?.identity) ? userData.nursingAssessment.identity.join('、') : '' }}</v-col>
                      <v-col cols="3">障礙類別:{{ userData.obstacleInput?.kind || '' }}</v-col>
                      <v-col cols="3">障礙等級:{{ userData.obstacleInput?.lv || '' }}</v-col>
                      <v-col cols="3">到期日:{{ userData.obstacleInput?.date || '' }}</v-col>
                      <v-col cols="3">教育程度:{{ Array.isArray(userData.nursingAssessment?.education) ? userData.nursingAssessment.education.join('、') : '' }}</v-col>
                      <v-col cols="4">
                        <v-select
                          :items="obstaclereasonItems"
                          label="致障原因"
                          v-model="formData.obstaclereason"
                          variant="outlined"
                          density="comfortable"
                          hide-details
                        />
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-col>

                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="treatment-add-alert-left-border">
                    <h3>二、家系圖</h3>
                    <v-img
                      :src="familyTreePicUrl"
                      :lazy-src="baseUrl + 'upload/familytree/lazypic.jpg'"
                    class="grey lighten-2"
                    height="500px"
                    contain
                    />
                  </v-alert>
                </v-col>

                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="treatment-add-alert-left-border">
                    <h3>三、社會心理功能診斷分析</h3>
                    <v-row class="mt-2">
                      <v-col cols="4">
                        <v-select
                          :items="selfcareabilityItems"
                          label="1.生活自理能力"
                          v-model="formData.selfcareability"
                          variant="outlined"
                          density="comfortable"
                          hide-details
                        />
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          label="2.生活適應能力-適應評估表(分)"
                          v-model="filteradaptability"
                          variant="outlined"
                          readonly
                          density="comfortable"
                          hide-details
                        />
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          label="3.情緒狀況-憂鬱量表(分)"
                          v-model="filtermelancholy"
                          variant="outlined"
                          readonly
                          density="comfortable"
                          hide-details
                        />
                      </v-col>
                      <v-col cols="4">
                        <v-select
                          :items="economicsourcesItems"
                          label="4.經濟來源"
                          v-model="formData.economicsources"
                          variant="outlined"
                          density="comfortable"
                          hide-details
                        />
                      </v-col>
                      <v-col cols="4">
                        <v-select
                          :items="familysupportItems"
                          label="5.家庭支持功能"
                          v-model="formData.familysupport"
                          variant="outlined"
                          density="comfortable"
                          hide-details
                        />
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-col>

                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="treatment-add-alert-left-border">
                    <h3>四、個案處遇計畫</h3>
                    <v-textarea label="服務對象問題及需求" v-model="formData.qa" variant="outlined" auto-grow rows="3" hide-details class="mt-3" />
                    <v-textarea label="服務目標" v-model="formData.target" variant="outlined" auto-grow rows="3" hide-details class="mt-3" />
                    <v-alert color="success" variant="outlined" class="mt-3 treatment-add-alert-left-border-success">
                      <v-sheet color="success dark-1" class="pa-2 white--text" elevation="4">
                        <h2>服務策略</h2>
                      </v-sheet>
                      <v-textarea label="執行方法" v-model="formData.means" variant="outlined" auto-grow rows="3" hide-details class="mt-3" />
                      <v-textarea label="服務資源" v-model="formData.resources" variant="outlined" auto-grow rows="3" hide-details class="mt-3" />
                      <v-textarea label="執行期程" v-model="formData.schedule" variant="outlined" auto-grow rows="3" hide-details class="mt-3" />
                      <v-text-field label="執行者" v-model="formData.executor" variant="outlined" density="comfortable" hide-details class="mt-3" />
                    </v-alert>
                    <v-textarea label="評值" v-model="formData.evaluation" variant="outlined" auto-grow rows="3" hide-details class="mt-3" />
                  </v-alert>
                </v-col>
              </v-row>
              </v-card-text>
            </v-card>
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
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue'

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
  obstaclereason: '',
  selfcareability: '',
  economicsources: '',
  familysupport: '',
  qa: '',
  target: '',
  means: '',
  resources: '',
  schedule: '',
  executor: '',
  evaluation: '',
})

const adaptabilityItems = ref([])
const melancholyItems = ref([])

const obstaclereasonItems = [
  '',
  '先天(出身即有)',
  '後天疾病',
  '老年退化',
  '交通事故',
  '職業傷害',
  '其他事故傷害',
  '家庭或社會環境因素',
]

const selfcareabilityItems = ['完全依賴', '部分依賴', '可自理']
const economicsourcesItems = ['子女提供', '退休俸或積蓄', '政府補助', '單位資助', '親戚朋友資助', '其他']
const familysupportItems = ['良好', '尚可', '不佳']

const baseUrl = computed(() => store.state?.base_url || '')

const familyTreePicUrl = computed(() => {
  const picName = userData.value?.familyTreeInfo?.picName
  if (picName) {
    return `${baseUrl.value}/upload/familytree/${picName}`
  }
  return `${baseUrl.value}/upload/familytree/lazypic.jpg`
})

const rules = {
  required: (value) => !!value || '不可空白',
}

const isAddMode = computed(() => processType.value === 'add')

const headerTitle = computed(() => (isAddMode.value ? '新增個案服務處遇計畫' : '修改個案服務處遇計畫'))
const headerSubtitle = computed(() =>
  isAddMode.value
    ? '記錄個案的服務處遇計畫，包含基本資料、社會心理功能診斷分析、個案處遇計畫等。'
    : '更新個案服務處遇計畫，追蹤服務執行狀況。'
)
const headerColor = computed(() => (isAddMode.value ? 'primary' : 'success'))

const userData = computed(() => store.state?.uData || {})

const filteradaptability = computed(() => {
  if (Array.isArray(adaptabilityItems.value) && adaptabilityItems.value.length > 0) {
    const matchData = adaptabilityItems.value.filter((i) => {
      const data = JSON.parse(i.datalist || '{}')
      return data.date == form.date
    })
        if (matchData.length > 0) {
      const data = JSON.parse(matchData[0].datalist)
      return data.total
    } else {
      return '未設定日期或暫無符合資料'
    }
  } else {
    return '未設定日期或暫無符合資料'
  }
})

const filtermelancholy = computed(() => {
  if (Array.isArray(melancholyItems.value) && melancholyItems.value.length > 0) {
    const matchData = melancholyItems.value.filter((i) => {
      const data = JSON.parse(i.datalist || '{}')
      return data.date == form.date
    })
        if (matchData.length > 0) {
      const data = JSON.parse(matchData[0].datalist)
      return data.total
    } else {
      return '未設定日期或暫無符合資料'
    }
  } else {
    return '未設定日期或暫無符合資料'
  }
})


const getData = async (dataTable) => {
  if (!store.state?.uData?.snkey) return

  const postData = {
    key: 'u_snkey',
    value: store.state.uData.snkey,
  }

  try {
    const response = await api.options(
      `byjson/searchByKeyValue/${store.state.databaseName}/${dataTable}`,
      postData
    )

    if (dataTable === 'adaptability') {
      adaptabilityItems.value = response
    } else if (dataTable === 'melancholy') {
      melancholyItems.value = response
    }
  } catch (error) {
    console.error(`取得 ${dataTable} 資料失敗:`, error)
  }
}

const resetForm = () => {
  form.snkey = ''
  form.date = dayjs().format('YYYY-MM-DD')
  formData.obstaclereason = ''
  formData.selfcareability = ''
  formData.economicsources = ''
  formData.familysupport = ''
  formData.qa = ''
  formData.target = ''
  formData.means = ''
  formData.resources = ''
  formData.schedule = ''
  formData.executor = ''
  formData.evaluation = ''
  formRef.value?.resetValidation()
}

const closeDialog = () => {
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
  currentData.date = form.date
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
    const response = await api.add('treatment', payload)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '個案服務處遇計畫已新增',
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
  currentData.date = form.date

  if (!Array.isArray(currentData.editInfo)) {
    currentData.editInfo = []
  }
  currentData.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: timestamp,
  })

  const payload = {
    snkey: form.snkey,
    datalist: JSON.stringify(currentData),
  }

  try {
    const response = await api.post('treatment', payload)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '個案服務處遇計畫已修改',
        closeTime: 2,
      })
      resetForm()
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
  form.snkey = record.snkey || ''
  form.date = record.date || dayjs().format('YYYY-MM-DD')

  formRef.value?.resetValidation()
  dialog.value = true
}

onMounted(() => {
  const readDatas = ['adaptability', 'melancholy']
  readDatas.forEach((i) => {
    getData(i)
  })
})

defineExpose({
  openForAdd,
  openForEdit,
  closeDialog,
})
</script>

<style scoped lang="scss">
.treatment-add {
  &-alert-left-border {
    border-left: 4px solid #1976d2 !important;
  }

  &-alert-left-border-success {
    border-left: 4px solid #4caf50 !important;
  }
}
</style>