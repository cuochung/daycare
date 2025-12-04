<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-account-cog</v-icon>
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
                label="1. 購物"
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
                label="2. 家務"
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
                label="3. 理財"
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
                label="4. 備食"
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
                label="5. 交通"
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
                label="6. 電話"
                v-model="list.qq6"
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
                :items="qq7Items"
                label="7. 洗衣"
                v-model="list.qq7"
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
                :items="qq8Items"
                label="8. 服藥"
                v-model="list.qq8"
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
    default: 'iadls',
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

const headerTitle = computed(() => (processType.value === 'add' ? '新增工具性日常生活活動功能評估' : '修改工具性日常生活活動功能評估'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民工具性日常生活活動能力評估，包含購物、家務、理財等八項功能評估項目。'
    : '更新既有評估紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const qq1Items = [
  { text: '能獨立完成所有購物需求。', Point: 1 },
  { text: '只能獨立購買簡單日常必需品。', Point: 0 },
  { text: '每一次購物都需要有人陪，只要有人陪伴就可以完成購物。', Point: 0 },
  { text: '完全不會獨立購物。', Point: 0 },
]

const qq2Items = [
  { text: '能單獨處理家事或偶而需要協助較繁重的家事(如：搬動家具、清理廚房且完成歸位)。', Point: 1 },
  { text: '能做較簡單的家事，如洗碗、鋪床、疊被。', Point: 1 },
  { text: '能做較簡單的家事，但不能達到可被接受的整潔程度。', Point: 1 },
  { text: '所有的家事都需要別人協助。', Point: 1 },
  { text: '完全不會做家事。', Point: 0 },
]

const qq3Items = [
  { text: '可獨立處理財務(指到郵局(銀行)提存款、支付房租、帳單、給錢、找錢等)。', Point: 1 },
  { text: '可以處理日常的購買(給錢、找錢)，但需要別人協助與銀行往來或大宗買賣。', Point: 1 },
  { text: '完全不能處理錢財。', Point: 0 },
]

const qq4Items = [
  { text: '能獨立計畫、準備食材及佐料、烹煮和擺設一頓飯菜。', Point: 1 },
  { text: '如果準備好一切食材及佐料，會做一頓的飯菜。', Point: 0 },
  { text: '會將已做好的飯菜加熱。', Point: 0 },
  { text: '需要別人把飯菜煮好、擺好。', Point: 0 },
]

const qq5Items = [
  { text: '能夠自己開車、騎車或自己搭乘大眾運輸工具。', Point: 1 },
  { text: '能夠自己搭乘計程車但不能搭乘大眾運輸工具。', Point: 1 },
  { text: '當有人陪同時，可搭乘大眾運輸工具。', Point: 1 },
  { text: '只能在有人協助或陪同時，可搭乘計程車或自用車。', Point: 0 },
  { text: '完全不能出門。', Point: 0 },
]

const qq6Items = [
  { text: '能獨立使用電話，含查電話簿、撥號等。', Point: 1 },
  { text: '僅能撥熟悉的電話號碼(個案只能撥少於5組的常用電話)。', Point: 1 },
  { text: '僅能接電話，但不能撥電話。', Point: 1 },
  { text: '完全不會使用電話。', Point: 0 },
]

const qq7Items = [
  { text: '自己清洗所有衣物。', Point: 1 },
  { text: '只能清洗小件衣物(如內衣褲、襪子)，需協助晾曬衣物或洗滌厚重衣物。', Point: 1 },
  { text: '需完全協助，所有衣物需完全由別人協助洗及晾曬。', Point: 0 },
]

const qq8Items = [
  { text: '能自己負責在正確的時間服用正確的藥物。', Point: 1 },
  { text: '如果能事先將藥物的份量備妥，則可自行服用。', Point: 0 },
  { text: '不能自己負責服藥。', Point: 0 },
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
