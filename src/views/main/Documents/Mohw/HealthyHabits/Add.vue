<template>
    <v-dialog v-model="dialog" fullscreen persistent>
      <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
          <div class="d-flex align-center">
            <v-avatar size="48" color="white" variant="tonal" class="mr-4">
              <v-icon color="white" size="28">mdi-heart-pulse</v-icon>
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
          <v-text-field type="date" label="評估日期" v-model="record.Date" :rules="emptyRules" variant="outlined" density="comfortable"></v-text-field>
          <div class="d-flex flex-wrap">
            <v-autocomplete :items="IsSmokingItems" label="吸菸" v-model="record.IsSmoking" :rules="emptyRules" variant="outlined" density="comfortable" class="mr-2 mb-2"></v-autocomplete>
            <v-text-field type="number" label="已戒菸(年)" v-model="record.QuitSmoking" variant="outlined" density="comfortable" class="mx-2 mb-2" :rules="emptyRules" v-if="record.IsSmoking=='已戒菸'"></v-text-field>
            <v-text-field type="number" label="之前吸菸(年)" v-model="record.BeforeSmoking" variant="outlined" density="comfortable" class="mx-2 mb-2" :rules="emptyRules" v-if="record.IsSmoking=='已戒菸'"></v-text-field>
            <v-text-field type="number" label="吸菸約(年)" v-model="record.SmokingYear" variant="outlined" density="comfortable" class="mx-2 mb-2" :rules="emptyRules" v-if="record.IsSmoking=='吸菸'"></v-text-field>
            </div>
          <div class="d-flex flex-wrap">
            <v-autocomplete :items="IsAlcoholItems" label="飲酒" v-model="record.IsAlcohol" :rules="emptyRules" variant="outlined" density="comfortable" class="mr-2 mb-2"></v-autocomplete>
            <v-text-field type="number" label="已戒酒(年)" v-model="record.QuitAlcohol" variant="outlined" density="comfortable" class="mx-2 mb-2" :rules="emptyRules" v-if="record.IsAlcohol=='已戒酒'"></v-text-field>
            <v-text-field type="number" label="之前喝酒(年)" v-model="record.BeforequitAlcohol" variant="outlined" density="comfortable" class="mx-2 mb-2" :rules="emptyRules" v-if="record.IsAlcohol=='已戒酒'"></v-text-field>
            <v-text-field type="number" label="喝酒約(年)" v-model="record.AlcoholYear" variant="outlined" density="comfortable" class="mx-2 mb-2" :rules="emptyRules" v-if="record.IsAlcohol=='喝酒'"></v-text-field>
            </div>
          <div class="d-flex flex-wrap">
            <v-autocomplete :items="IsBetelNutItems" label="嚼食檳榔" v-model="record.IsBetelNut" :rules="emptyRules" variant="outlined" density="comfortable" class="mr-2 mb-2"></v-autocomplete>
            <v-text-field type="number" label="已戒(年)" v-model="record.QuitBetelNut" variant="outlined" density="comfortable" class="mx-2 mb-2" :rules="emptyRules" v-if="record.IsBetelNut=='已戒'"></v-text-field>
            <v-text-field type="number" label="之前嚼食(年)" v-model="record.BeforequitBetelNut" variant="outlined" density="comfortable" class="mx-2 mb-2" :rules="emptyRules" v-if="record.IsBetelNut=='已戒'"></v-text-field>
            <v-text-field type="number" label="嚼食約(年)" v-model="record.BetelNutYear" variant="outlined" density="comfortable" class="mx-2 mb-2" :rules="emptyRules" v-if="record.IsBetelNut=='嚼食'"></v-text-field>
            </div>
          <div class="d-flex flex-wrap">
            <v-autocomplete :items="YesNoItems" label="食物過敏" v-model="record.IsAllergy" :rules="emptyRules" variant="outlined" density="comfortable" class="mr-2 mb-2"></v-autocomplete>
            <v-text-field label="食物過敏說明" v-model="record.Allergy_Desc" variant="outlined" density="comfortable" class="mx-2 mb-2" :rules="emptyRules" v-if="record.IsAllergy=='有'"></v-text-field>
            </div>
          <div class="d-flex flex-wrap">
            <v-autocomplete :items="YesNoItems" label="藥物過敏" v-model="record.IsAllergyDrug" :rules="emptyRules" variant="outlined" density="comfortable" class="mr-2 mb-2"></v-autocomplete>
            <v-text-field label="藥物過敏說明" v-model="record.AllergyDrug_Desc" variant="outlined" density="comfortable" class="mx-2 mb-2" :rules="emptyRules" v-if="record.IsAllergyDrug=='有'"></v-text-field>
            </div>
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

const IsSmokingItems = ['不吸菸', '已戒菸', '吸菸']
const IsAlcoholItems = ['不喝酒', '已戒酒', '喝酒']
const IsBetelNutItems = ['不嚼', '已戒', '嚼食']
const YesNoItems = ['無', '有', '不知道']

const createDefaultRecord = () => ({
  snkey: '',
  user_snkey: '',
  Date: '',
  IsSmoking: '',
  QuitSmoking: '',
  BeforeSmoking: '',
  SmokingYear: '',
  IsAlcohol: '',
  QuitAlcohol: '',
  BeforequitAlcohol: '',
  AlcoholYear: '',
  IsBetelNut: '',
  QuitBetelNut: '',
  BeforequitBetelNut: '',
  BetelNutYear: '',
  IsAllergy: '',
  Allergy_Desc: '',
  IsAllergyDrug: '',
  AllergyDrug_Desc: '',
  createInfo: {},
  editInfo: [],
})

const record = reactive(createDefaultRecord())

const headerTitle = computed(() => (processType.value === 'add' ? '新增健康習慣評估' : '修改健康習慣評估'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民健康習慣評估資料，包含吸菸、飲酒、嚼食檳榔、過敏等完整資訊。'
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

    const response = await api.add('healthyhabits', postData)
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

    const response = await api.post('healthyhabits', postData)
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
