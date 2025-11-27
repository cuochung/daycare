<template>
  <v-dialog v-model="dialog" max-width="1200" persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-account-switch</v-icon>
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
          <v-card variant="outlined" class="mb-4">
            <v-alert color="primary" variant="tonal" border="start">
              <h3 class="mb-3">預計照會人員:</h3>
              <v-row class="px-2">
                <v-col cols="12" sm="6" md="4">
                  <v-checkbox label="醫師" v-model="list.doctor" value="true" hide-details density="comfortable" />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-checkbox label="營養師" v-model="list.nutritionist" value="true" hide-details density="comfortable" />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-checkbox label="社工" v-model="list.socialworker" value="true" hide-details density="comfortable" />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-checkbox label="物理治療師" v-model="list.rehabilitation" value="true" hide-details density="comfortable" />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-checkbox label="照服員" v-model="list.attendant" value="true" hide-details density="comfortable" />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-checkbox label="其他人員" v-model="list.otherworker" value="true" hide-details density="comfortable" />
                </v-col>
                <v-col cols="12" v-if="list.otherworker">
                  <v-text-field
                    label="其他人員說明"
                    v-model="list.otherworker_content"
                    hide-details
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
              </v-row>
            </v-alert>
          </v-card>

          <v-card variant="outlined" class="mb-4">
            <v-alert color="primary" variant="tonal" border="start">
              <h3 class="mb-3">照會原因及狀況:</h3>
              <v-row class="px-2 mb-3" align="center">
                <v-col cols="12" sm="4" md="3">
                  <v-checkbox label="精神及行為異常" v-model="list.result1" value="true" hide-details density="comfortable" />
                </v-col>
                <v-col cols="12" sm="8" md="9">
                  <v-text-field label="內容" v-model="list.result1_content" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
              <v-row class="px-2 mb-3" align="center">
                <v-col cols="12" sm="4" md="3">
                  <v-checkbox label="健康狀況異常" v-model="list.result2" value="true" hide-details density="comfortable" />
                </v-col>
                <v-col cols="12" sm="8" md="9">
                  <v-text-field label="內容" v-model="list.result2_content" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
              <v-row class="px-2 mb-3" align="center">
                <v-col cols="12" sm="4" md="3">
                  <v-checkbox label="日常生活無法自理" v-model="list.result3" value="true" hide-details density="comfortable" />
                </v-col>
                <v-col cols="12" sm="8" md="9">
                  <v-text-field label="內容" v-model="list.result3_content" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
              <v-row class="px-2 mb-3" align="center">
                <v-col cols="12" sm="4" md="3">
                  <v-checkbox label="肢體功能退化" v-model="list.result4" value="true" hide-details density="comfortable" />
                </v-col>
                <v-col cols="12" sm="8" md="9">
                  <v-text-field label="內容" v-model="list.result4_content" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
              <v-row class="px-2 mb-3" align="center">
                <v-col cols="12" sm="4" md="3">
                  <v-checkbox label="疑自殺意圖" v-model="list.result5" value="true" hide-details density="comfortable" />
                </v-col>
                <v-col cols="12" sm="8" md="9">
                  <v-text-field label="內容" v-model="list.result5_content" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
              <v-row class="px-2 mb-3" align="center">
                <v-col cols="12" sm="4" md="3">
                  <v-checkbox label="服藥不合作" v-model="list.result6" value="true" hide-details density="comfortable" />
                </v-col>
                <v-col cols="12" sm="8" md="9">
                  <v-text-field label="內容" v-model="list.result6_content" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
              <v-row class="px-2 mb-3" align="center">
                <v-col cols="12" sm="4" md="3">
                  <v-checkbox label="營養狀況異常" v-model="list.result7" value="true" hide-details density="comfortable" />
                </v-col>
                <v-col cols="12" sm="8" md="9">
                  <v-text-field label="內容" v-model="list.result7_content" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
              <v-row class="px-2 mb-3" align="center">
                <v-col cols="12" sm="4" md="3">
                  <v-checkbox label="其他" v-model="list.result8" value="true" hide-details density="comfortable" />
                </v-col>
                <v-col cols="12" sm="8" md="9">
                  <v-text-field label="內容" v-model="list.result8_content" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
              <v-divider class="my-3" />
              <v-row class="px-2 mt-3">
                <v-col cols="12" sm="6">
                  <v-text-field label="護理人員" v-model="list.nurse_name" hide-details variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="日期" type="date" v-model="list.date" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
            </v-alert>
          </v-card>

          <v-card variant="outlined" class="mb-4" v-if="list.doctor">
            <v-alert color="primary" variant="tonal" border="start">
              <h3 class="mb-3">醫師照會回覆</h3>
              <v-textarea rows="6" v-model="list.doctor_response" hide-details variant="outlined" class="mb-3" />
              <v-row class="px-2">
                <v-col cols="12" sm="6">
                  <v-text-field label="照會人員" v-model="list.doctor_name" hide-details variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="日期" type="date" v-model="list.doctor_name_date" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
            </v-alert>
          </v-card>

          <v-card variant="outlined" class="mb-4" v-if="list.nutritionist">
            <v-alert color="primary" variant="tonal" border="start">
              <h3 class="mb-3">營養師照會回覆</h3>
              <v-textarea rows="6" v-model="list.nutritionist_response" hide-details variant="outlined" class="mb-3" />
              <v-row class="px-2">
                <v-col cols="12" sm="6">
                  <v-text-field label="照會人員" v-model="list.nutritionist_name" hide-details variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="日期" type="date" v-model="list.nutritionist_name_date" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
            </v-alert>
          </v-card>

          <v-card variant="outlined" class="mb-4" v-if="list.socialworker">
            <v-alert color="primary" variant="tonal" border="start">
              <h3 class="mb-3">社工照會回覆</h3>
              <v-textarea rows="6" v-model="list.socialworker_response" hide-details variant="outlined" class="mb-3" />
              <v-row class="px-2">
                <v-col cols="12" sm="6">
                  <v-text-field label="照會人員" v-model="list.socialworker_name" hide-details variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="日期" type="date" v-model="list.socialworker_name_date" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
            </v-alert>
          </v-card>

          <v-card variant="outlined" class="mb-4" v-if="list.rehabilitation">
            <v-alert color="primary" variant="tonal" border="start">
              <h3 class="mb-3">物理治療師照會回覆</h3>
              <v-textarea rows="6" v-model="list.rehabilitation_response" hide-details variant="outlined" class="mb-3" />
              <v-row class="px-2">
                <v-col cols="12" sm="6">
                  <v-text-field label="照會人員" v-model="list.rehabilitation_name" hide-details variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="日期" type="date" v-model="list.rehabilitation_name_date" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
            </v-alert>
          </v-card>

          <v-card variant="outlined" class="mb-4" v-if="list.attendant">
            <v-alert color="primary" variant="tonal" border="start">
              <h3 class="mb-3">照服員照會回覆</h3>
              <v-textarea rows="6" v-model="list.attendant_response" hide-details variant="outlined" class="mb-3" />
              <v-row class="px-2">
                <v-col cols="12" sm="6">
                  <v-text-field label="照會人員" v-model="list.attendant_name" hide-details variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="日期" type="date" v-model="list.attendant_name_date" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
            </v-alert>
          </v-card>

          <v-card variant="outlined" class="mb-4" v-if="list.otherworker">
            <v-alert color="primary" variant="tonal" border="start">
              <h3 class="mb-3">其他人員({{ list.otherworker_content }})照會回覆</h3>
              <v-textarea rows="6" v-model="list.otherworker_response" hide-details variant="outlined" class="mb-3" />
              <v-row class="px-2">
                <v-col cols="12" sm="6">
                  <v-text-field label="照會人員" v-model="list.otherworker_name" hide-details variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="日期" type="date" v-model="list.otherworker_name_date" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
            </v-alert>
          </v-card>

          <v-card variant="outlined" class="mb-4">
            <v-alert color="success" variant="tonal" border="start">
              <h3 class="mb-3">追蹤處理</h3>
              <v-textarea rows="6" v-model="list.track_response" hide-details variant="outlined" class="mb-3" />
              <v-row class="px-2">
                <v-col cols="12" sm="6">
                  <v-text-field label="處理者簽名" v-model="list.track_name" hide-details variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="日期" type="date" v-model="list.track_name_date" hide-details variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
            </v-alert>
          </v-card>
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

const store = useStore()
const { proxy } = getCurrentInstance()

const dialog = ref(false)
const processType = ref('add')
const loading = ref(false)
const formRef = ref(null)
// const originalRecord = ref(null)

const createDefaultList = () => ({
  snkey: '',
  u_snkey: '',
  date: dayjs().format('YYYY-MM-DD'),
  doctor: false,
  nutritionist: false,
  socialworker: false,
  rehabilitation: false,
  attendant: false,
  otherworker: false,
  otherworker_content: '',
  result1: false,
  result1_content: '',
  result2: false,
  result2_content: '',
  result3: false,
  result3_content: '',
  result4: false,
  result4_content: '',
  result5: false,
  result5_content: '',
  result6: false,
  result6_content: '',
  result7: false,
  result7_content: '',
  result8: false,
  result8_content: '',
  nurse_name: '',
  nurse_name_date: '',
  doctor_response: '',
  doctor_name: '',
  doctor_name_date: '',
  nutritionist_response: '',
  nutritionist_name: '',
  nutritionist_name_date: '',
  socialworker_response: '',
  socialworker_name: '',
  socialworker_name_date: '',
  rehabilitation_response: '',
  rehabilitation_name: '',
  rehabilitation_name_date: '',
  attendant_response: '',
  attendant_name: '',
  attendant_name_date: '',
  otherworker_response: '',
  otherworker_name: '',
  otherworker_name_date: '',
  track_response: '',
  track_name: '',
  track_name_date: '',
  createInfo: {},
  editInfo: [],
})

const list = reactive(createDefaultList())

const headerTitle = computed(() => (processType.value === 'add' ? '新增轉介照會單' : '修改轉介照會單'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民轉介照會資訊，促進跨專業團隊協作與溝通。'
    : '更新既有紀錄，維持資料正確性與完整性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const resetList = () => {
  Object.assign(list, createDefaultList())
  // originalRecord.value = null
}

const closeDialog = () => {
  dialog.value = false
  loading.value = false
}

const openForAdd = () => {
  resetList()
  processType.value = 'add'
  dialog.value = true
}

const openForEdit = (item) => {
  console.log('item', item)

  resetList()
  processType.value = 'edit'
  // originalRecord.value = { ...item }
  Object.assign(list, item)
  // 確保 editInfo 是數組
  if (!Array.isArray(list.editInfo)) {
    list.editInfo = []
  }
  console.log('list', list)
  dialog.value = true
}

const validateForm = async () => {
  const result = await formRef.value?.validate()
  return result?.valid ?? false
}

const handleAdd = async () => {
  const isValid = await validateForm()
  if (!isValid) {
    proxy?.$swal?.({ icon: 'warning', title: '資料輸入不完整，請檢查欄位內容。' })
    return
  }

  loading.value = true

  list.u_snkey = store.state.uData?.snkey ?? ''
  list.createInfo = {
    snkey: store.state.pData?.snkey ?? '',
    name: store.state.pData?.username ?? '',
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }
  list.editInfo = []

  const postData = {
    datalist: JSON.stringify(list),
  }

  try {
    const response = await api.add('consultation', postData)
    loading.value = false

    if (response?.state == 1) {
      proxy?.$swal?.({ icon: 'success', title: '新增成功' })
      dialog.value = false
      emit('refresh')
    } else {
      proxy?.$swal?.({ icon: 'error', title: '新增失敗，請稍後再試。' })
    }
  } catch (error) {
    console.error('Add error:', error)
    loading.value = false
    proxy?.$swal?.({ icon: 'error', title: '新增失敗，請稍後再試。' })
  }
}

const handleEdit = async () => {
  const isValid = await validateForm()
  if (!isValid) {
    proxy?.$swal?.({ icon: 'warning', title: '資料輸入不完整，請檢查欄位內容。' })
    return
  }

  loading.value = true

  // 確保 editInfo 是數組
  if (!Array.isArray(list.editInfo)) {
    list.editInfo = []
  }

  list.editInfo.unshift({
    snkey: store.state.pData?.snkey ?? '',
    name: store.state.pData?.username ?? '',
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })

  const postData = {
    snkey: list.snkey,
    datalist: JSON.stringify(list),
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }

  try {
    const response = await api.post('consultation', postData)
    loading.value = false

    if (response?.state == 1) {
      proxy?.$swal?.({ icon: 'success', title: '修改成功' })
      dialog.value = false
      emit('refresh')
    } else {
      proxy?.$swal?.({ icon: 'error', title: '修改失敗，請稍後再試。' })
    }
  } catch (error) {
    console.error('Edit error:', error)
    loading.value = false
    proxy?.$swal?.({ icon: 'error', title: '修改失敗，請稍後再試。' })
  }
}

defineExpose({
  openForAdd,
  openForEdit,
})
</script>

<style scoped>
</style>
