<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-shield-alert-outline</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold mb-1">{{ headerTitle }}</h2>
            <p class="text-body-2 mb-0">{{ headerSubtitle }}</p>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" color="white" @click="closeDialog" />
      </v-sheet>

      <v-card-text class="px-6 py-5">
        <v-form ref="formRef">
          <v-row class="mb-4">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="list.Date"
                type="date"
                label="評估日期"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-calendar"
                :rules="requiredDateRules"
              />
            </v-col>
          </v-row>

          <v-divider class="mb-6" />

          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                :items="qq1Items"
                label="知覺感受"
                v-model="list.qq1"
                :rules="emptyRules"
                return-object
                item-title="text"
                item-value="text"
                variant="outlined"
                density="comfortable"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                :items="qq2Items"
                label="潮溼程度"
                v-model="list.qq2"
                :rules="emptyRules"
                return-object
                item-title="text"
                item-value="text"
                variant="outlined"
                density="comfortable"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                :items="qq3Items"
                label="活動能力"
                v-model="list.qq3"
                :rules="emptyRules"
                return-object
                item-title="text"
                item-value="text"
                variant="outlined"
                density="comfortable"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                :items="qq4Items"
                label="移動能力"
                v-model="list.qq4"
                :rules="emptyRules"
                return-object
                item-title="text"
                item-value="text"
                variant="outlined"
                density="comfortable"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                :items="qq5Items"
                label="營養攝取"
                v-model="list.qq5"
                :rules="emptyRules"
                return-object
                item-title="text"
                item-value="text"
                variant="outlined"
                density="comfortable"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                :items="qq6Items"
                label="摩擦力/剪力"
                v-model="list.qq6"
                :rules="emptyRules"
                return-object
                item-title="text"
                item-value="text"
                variant="outlined"
                density="comfortable"
              ></v-autocomplete>
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
import { ref, reactive, computed, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const emit = defineEmits(['refresh', 'getAllData'])

const props = defineProps({
  useDataBase: {
    type: String,
    default: 'pressureinjuries',
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
const list = reactive({})

const requiredDateRules = [(v) => !!v || '不可空白']
const emptyRules = [(v) => !!v || '不可空白']

const headerTitle = computed(() => (processType.value === 'add' ? '新增壓力性損傷危險評估' : '修改壓力性損傷危險評估'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民壓力性損傷風險評估，包含知覺感受、潮溼程度、活動能力、移動能力、營養攝取、摩擦力/剪力等六項評估項目。'
    : '更新既有評估紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const qq1Items = [
  { text: '完全受限：因為意識減弱或使用鎮定劑，對疼痛刺激沒有反應', Point: 1 },
  { text: '大部分受限：只對疼痛刺激有反應；除了呻吟或焦躁不安，無法表達不適', Point: 2 },
  { text: '稍微受限：對指令有反應；但有時無法表達不適；(一或兩個肢體對疼痛或不適的感覺能力受限)', Point: 3 },
  { text: '沒有受損：對指令有反應；能表達不適', Point: 4 },
]

const qq2Items = [
  { text: '總是潮溼：皮膚總是被汗水、大小便等浸潤；每兩小時予病人翻身時，都會發現皮膚是潮溼的', Point: 1 },
  { text: '經常潮溼：皮膚經常是浸潤的；衣褲/尿布/看護墊等至少每8小時需更換 ≧ 2次', Point: 2 },
  { text: '偶爾潮溼：皮膚偶爾是浸潤的；衣褲/尿布/看護墊等至少每8小時需更換1次', Point: 3 },
  { text: '很少潮溼：皮膚通常保持乾燥；衣褲/尿布/看護墊等只需要依常規的時間，每天更換一次', Point: 4 },
]

const qq3Items = [
  { text: '受限於床上', Point: 1 },
  { text: '受限於椅子：無法行走或走路極為困難；無法支撐自己的體重', Point: 2 },
  { text: '偶爾走動：但是步行短距離，有時需要協助；大部份時間在床上或椅子上', Point: 3 },
  { text: '經常走動', Point: 4 },
]

const qq4Items = [
  { text: '完全無法自行移動', Point: 1 },
  { text: '大部份需協助才能移動', Point: 2 },
  { text: '少部份需協助才能移動', Point: 3 },
  { text: '無限制', Point: 4 },
]

const qq5Items = [
  { text: '總攝取量 < 50%', Point: 1 },
  { text: '50% ≦ 總攝取量 < 75%', Point: 2 },
  { text: '總攝取量 ≧ 75%', Point: 3 },
  { text: '總攝取量完整', Point: 4 },
]

const qq6Items = [
  { text: '有此問題：移動時需要中度到極大的協助；完全抬起來而不與床單接觸是不可能的', Point: 1 },
  { text: '有潛在問題：移動時需要輕微協助', Point: 2 },
  { text: '沒有明顯問題：可獨立在床上或椅子上移動', Point: 3 },
]

const openForAdd = () => {
  processType.value = 'add'
  Object.keys(list).forEach(key => delete list[key])
  
  if (props.items && props.items.length > 0) {
    const firstItem = JSON.parse(JSON.stringify(props.items[0]))
    delete firstItem.snkey
    delete firstItem.user_snkey
    delete firstItem.createInfo
    delete firstItem.create_man
    delete firstItem.create_man_snkey
    delete firstItem.editInfo
    delete firstItem.edit_man
    delete firstItem.uploadData
    delete firstItem.uploadState
    Object.assign(list, firstItem)
  }
  
  dialog.value = true
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const openForEdit = (item) => {
  dialog.value = true
  processType.value = 'edit'
  Object.keys(list).forEach(key => delete list[key])
  Object.assign(list, JSON.parse(JSON.stringify(item)))
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const closeDialog = () => {
  dialog.value = false
  loading.value = false
}

const handleAdd = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完全!!請重新確認!!',
      closeTime: 3,
    })
    return
  }

  loading.value = true
  list.user_snkey = store.state.uData.snkey
  list.createInfo = {
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }

  try {
    const postData = {
      datalist: JSON.stringify(list),
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
      emit('getAllData')
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
  const { valid } = await formRef.value?.validate()
  if (!valid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完全!!請重新確認!!',
      closeTime: 3,
    })
    return
  }

  loading.value = true

  if (!list.editInfo) {
    list.editInfo = []
  }
  list.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })

  try {
    const postData = {
      snkey: list.snkey,
      datalist: JSON.stringify(list),
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
      emit('getAllData')
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