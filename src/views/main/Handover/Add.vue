<template>
  <v-dialog v-model="dialog" max-width="960" persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-text-box-outline</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold mb-1 text-white">{{ headerTitle }}</h2>
            <p class="text-body-2 mb-0 text-white text-opacity-90">{{ headerSubtitle }}</p>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" color="white" @click="closeDialog" />
      </v-sheet>

      <v-card-text class="px-6 py-5">
        <v-form ref="formRef">
          <v-row class="mb-4">
            <v-col cols="12">
              <v-alert type="info" variant="tonal" border="start" color="primary">
                紀錄時間: {{ formatDateTime(list.date, list.time) }}
              </v-alert>
            </v-col>
          </v-row>

          <v-divider class="mb-6" />

          <v-row>
            <v-col cols="12">
              <v-textarea
                label="交班內容"
                v-model="list.content"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-text-box-outline"
                rows="10"
                auto-grow
                ref="setfocus"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="行政內容"
                v-model="list.administrativeContent"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-file-document-outline"
                rows="5"
                auto-grow
              ></v-textarea>
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
        <v-btn 
          v-if="processType === 'add'" 
          color="primary" 
          variant="flat" 
          :loading="loading" 
          @click="addOK"
        >
          確認新增
        </v-btn>
        <v-btn 
          v-else 
          color="success" 
          variant="flat" 
          :loading="loading" 
          @click="editOK"
        >
          確認修改
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, nextTick, watch, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'

const emit = defineEmits(['finishAdd', 'finishEdit'])

const { proxy } = getCurrentInstance()

const dialog = ref(false)
const processType = ref('add')
const loading = ref(false)
const formRef = ref(null)
const setfocus = ref(null)

const list = ref({
  date: dayjs().format('YYYY-MM-DD'),
  time: dayjs().format('HH:mm'),
  content: '',
  administrativeContent: '',
  checkedList: []
})

const emptyRules = [(v) => !!v || '不可空白']

const headerTitle = computed(() => 
  processType.value === 'add' ? '新增交班表' : '修改交班表'
)

const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫交班內容，確保資訊傳遞完整性。'
    : '更新交班內容，維持資訊正確性。'
)

const headerColor = computed(() => 
  processType.value === 'add' ? 'primary' : 'success'
)

const formatDateTime = (date, time) => {
  if (date && time) {
    return `${date} ${time}`
  } else if (date) {
    return date
  } else if (time) {
    return time
  }
  return ''
}

const closeDialog = () => {
  dialog.value = false
  loading.value = false
}

const openForAdd = () => {
  processType.value = 'add'
  list.value = {
    date: dayjs().format('YYYY-MM-DD'),
    time: dayjs().format('HH:mm'),
    content: '',
    administrativeContent: '',
    checkedList: []
  }
  dialog.value = true
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetValidation()
    }
    if (setfocus.value) {
      setfocus.value.focus()
    }
  })
}

const openForEdit = (item) => {
  processType.value = 'edit'
  
  // 處理舊資料格式：如果有 time 欄位是 ISO 字符串，需要拆分為 date 和 time
  let date = item.date || ''
  let time = item.time || ''
  
  if (!date && !time && item.time) {
    // 如果只有 time 欄位（舊格式），嘗試解析
    const parsed = dayjs(item.time)
    if (parsed.isValid()) {
      date = parsed.format('YYYY-MM-DD')
      time = parsed.format('HH:mm')
    }
  }
  
  list.value = {
    ...item,
    date: date || dayjs().format('YYYY-MM-DD'),
    time: time || dayjs().format('HH:mm'),
    checkedList: item.checkedList || []
  }
  dialog.value = true
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetValidation()
    }
  })
}

const addOK = async () => {
  const { valid } = await formRef.value?.validate()
  if (valid) {
    loading.value = true
    emit('finishAdd', list.value)
    closeDialog()
    loading.value = false
  }
}

const editOK = async () => {
  const { valid } = await formRef.value?.validate()
  if (valid) {
    loading.value = true
    emit('finishEdit', list.value)
    closeDialog()
    loading.value = false
  }
}

watch(() => list.value.content, () => {
  if (list.value.content.length === 0) {
    nextTick(() => {
      if (setfocus.value) {
        setfocus.value.focus()
      }
      if (formRef.value) {
        formRef.value.resetValidation()
      }
    })
  }
})

defineExpose({
  openForAdd,
  openForEdit
})
</script>
