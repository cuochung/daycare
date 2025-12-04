<template>
  <v-dialog v-model="dialog" fullscreen persistent>
      <v-card rounded="xl">
        <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
          <div class="d-flex align-center">
            <v-avatar size="48" color="white" variant="tonal" class="mr-4">
              <v-icon color="white" size="28">mdi-alert-circle</v-icon>
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
            <!-- 評估日期 -->
            <v-sheet class="mb-6 pa-4" rounded="lg" color="primary-lighten-5" elevation="1" border>
              <v-row>
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
            </v-sheet>

            <!-- 問題1: 年紀≧65歲以上 -->
            <v-sheet class="mb-4 pa-4" rounded="lg" color="cyan-lighten-5" elevation="1" border>
              <v-row>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    :items="qq1Items"
                    label="1. 年紀≧65歲以上"
                    v-model="list.qq1"
                    :rules="emptyRules"
                    return-object
                    item-title="text"
                    item-value="text"
                    variant="outlined"
                    density="comfortable"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-sheet>

            <!-- 問題2: 過去一年內曾跌倒 -->
            <v-sheet class="mb-4 pa-4" rounded="lg" color="amber-lighten-5" elevation="1" border>
              <v-row>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    :items="qq2Items"
                    label="2. 過去一年內曾跌倒"
                    v-model="list.qq2"
                    :rules="emptyRules"
                    return-object
                    item-title="text"
                    item-value="text"
                    variant="outlined"
                    density="comfortable"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-sheet>

          <!-- 問題3: 最近意識/認知出現異常 -->
          <v-sheet class="mb-4 pa-4" rounded="lg" color="blue-lighten-5" elevation="1" border>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="qq3Items"
                  label="3. 最近意識/認知出現異常"
                  v-model="list.qq3"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" v-if="list.qq3 && list.qq3.text == '是'">
                <v-autocomplete
                  :items="qq3OptionsItems"
                  label="→ 異常選擇"
                  v-model="list.qq3.Options"
                  :rules="emptyObjRules"
                  multiple
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-sheet>

          <!-- 問題4: 活動功能異常 -->
          <v-sheet class="mb-4 pa-4" rounded="lg" color="green-lighten-5" elevation="1" border>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="qq4Items"
                  label="4. 活動功能異常"
                  v-model="list.qq4"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" v-if="list.qq4 && list.qq4.text == '是'">
                <v-autocomplete
                  :items="qq4OptionsItems"
                  label="→ 異常選擇"
                  v-model="list.qq4.Options"
                  :rules="emptyObjRules"
                  multiple
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-sheet>

          <!-- 問題5: 體能虛弱 -->
          <v-sheet class="mb-4 pa-4" rounded="lg" color="orange-lighten-5" elevation="1" border>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="qq5Items"
                  label="5. 體能虛弱"
                  v-model="list.qq5"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" v-if="list.qq5 && list.qq5.text == '是'">
                <v-autocomplete
                  :items="qq5OptionsItems"
                  label="→ 異常選擇"
                  v-model="list.qq5.Options"
                  :rules="emptyObjRules"
                  multiple
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-sheet>

          <!-- 問題6: 知覺障礙 -->
          <v-sheet class="mb-4 pa-4" rounded="lg" color="purple-lighten-5" elevation="1" border>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="qq6Items"
                  label="6. 知覺障礙"
                  v-model="list.qq6"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" v-if="list.qq6 && list.qq6.text == '是'">
                <v-autocomplete
                  :items="qq6OptionsItems"
                  label="→ 異常選擇"
                  v-model="list.qq6.Options"
                  :rules="emptyObjRules"
                  multiple
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-sheet>

          <!-- 問題7: 暈眩/低血壓 -->
          <v-sheet class="mb-4 pa-4" rounded="lg" color="pink-lighten-5" elevation="1" border>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="qq7Items"
                  label="7. 暈眩/低血壓"
                  v-model="list.qq7"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" v-if="list.qq7 && list.qq7.text == '是'">
                <v-autocomplete
                  :items="qq7OptionsItems"
                  label="→ 異常選擇"
                  v-model="list.qq7.Options"
                  :rules="emptyObjRules"
                  multiple
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-sheet>

          <!-- 問題8: 使用藥物 -->
          <v-sheet class="mb-4 pa-4" rounded="lg" color="teal-lighten-5" elevation="1" border>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="qq8Items"
                  label="8. 使用藥物"
                  v-model="list.qq8"
                  :rules="emptyRules"
                  return-object
                  item-title="text"
                  item-value="text"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" v-if="list.qq8 && list.qq8.text == '是'">
                <v-autocomplete
                  :items="qq8OptionsItems"
                  label="→ 異常選擇"
                  v-model="list.qq8.Options"
                  :rules="emptyObjRules"
                  multiple
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" v-if="list.qq8 && list.qq8.Options && list.qq8.Options.includes('其他')">
                <v-text-field
                  label="→ 其他說明"
                  v-model="list.qq8.Other"
                  :rules="emptyRules"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-sheet>
            
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
    default: 'fallrisks',
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
const emptyObjRules = [v => Boolean(Object.keys(v || {})[0]) || '不可空白']

const headerTitle = computed(() => (processType.value === 'add' ? '新增跌倒危險性評估' : '修改跌倒危險性評估'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民跌倒風險評估，包含年紀、過去跌倒史、意識認知等八項評估項目。'
    : '更新既有評估紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const qq1Items = [{ text: '否', Point: 0 }, { text: '是', Point: 1 }]
const qq2Items = [{ text: '否', Point: 0 }, { text: '是', Point: 3 }]
const qq3Items = [{ text: '否', Point: 0 }, { text: '是', Point: 3 }]
const qq4Items = [{ text: '否', Point: 0 }, { text: '是', Point: 3 }]
const qq5Items = [{ text: '否', Point: 0 }, { text: '是', Point: 3 }]
const qq6Items = [{ text: '否', Point: 0 }, { text: '是', Point: 3 }]
const qq7Items = [{ text: '否', Point: 0 }, { text: '是', Point: 3 }]
const qq8Items = [{ text: '否', Point: 0 }, { text: '是', Point: 3 }]

const qq3OptionsItems = [
  '曾突發意識改變', '曾突發全身性抽蓄', '目前意識狀態變差', '目前心智狀態變差', '躁動', '合作度差', '麻醉未醒'
]
const qq4OptionsItems = [
  '活動障礙', '一側肢體肌力≦4分', '平衡感障礙', '行走協調功能差'
]
const qq5OptionsItems = [
  '無力', '活動費力', '身體耐受力不足', '行動遲緩'
]
const qq6OptionsItems = [
  '雙眼視力障礙', '位置感缺失', '偏盲', '半邊忽略', '無法判定'
]
const qq7OptionsItems = [
  '頭暈', '暈眩', '姿位性低血壓', '低血壓'
]
const qq8OptionsItems = [
  '麻醉止痛劑', '鎮靜安眠劑', '散瞳劑', '鎮攣劑', '肌肉鬆弛劑', '降壓利尿劑', '瀉劑', '抗鬱劑', '其他'
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