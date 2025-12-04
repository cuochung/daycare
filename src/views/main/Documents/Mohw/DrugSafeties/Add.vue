<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-pill</v-icon>
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
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                type="date"
                label="評估日期"
                v-model="record.Date"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                label="是否有長期使用藥物"
                :items="LongUseingItems"
                v-model="record.LongUseing"
                :rules="emptyRules"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <div v-if="record.LongUseing == '有'">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  :items="YnItems2"
                  label="目前使用中的藥物種類"
                  v-model="record.qq1"
                  :rules="emptyRules"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6" v-if="record.qq1 == '有'">
                <v-text-field
                  type="number"
                  label="總共幾種"
                  v-model="record.qq1Statement1"
                  :rules="emptyRules"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="YnItems"
                  label="使用精神用藥"
                  v-model="record.qq2"
                  :rules="emptyRules"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="YnItems"
                  label="使用止痛用藥"
                  v-model="record.qq3"
                  :rules="emptyRules"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="YnKindItems"
                  label="是否存在多重用藥問題(自動判讀)"
                  v-model="record.qq4"
                  readonly
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="YnItems"
                  label="目前是否使用有自行購藥或保健營養品(電台、他人介紹..等非醫療院所取得)"
                  v-model="record.qq5"
                  :rules="emptyRules"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6" v-if="record.qq5 == '有'">
                <v-text-field
                  type="number"
                  label="總共幾種"
                  v-model="record.qq5Statement5"
                  :rules="emptyRules"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
            </v-row>
          </div>

          <v-card variant="outlined" class="mt-4">
            <v-card-title class="drug-list-header d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-pill-multiple</v-icon>
                <span class="text-h6 font-weight-bold">使用中之藥物</span>
                <v-chip
                  v-if="record.DrugInUses && record.DrugInUses.length > 0"
                  color="primary"
                  size="small"
                  class="ml-3"
                >
                  {{ record.DrugInUses.length }} 項
                </v-chip>
              </div>
              <v-btn
                color="primary"
                variant="elevated"
                prepend-icon="mdi-plus-circle"
                @click="addMedicine"
              >
                新增藥物
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-4">
              <div v-if="!record.DrugInUses || record.DrugInUses.length === 0" class="text-center py-8">
                <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-pill-off</v-icon>
                <p class="text-body-1 text-grey mb-4">目前沒有使用中的藥物</p>
                <v-btn
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-plus"
                  @click="addMedicine"
                >
                  新增第一項藥物
                </v-btn>
              </div>
              
              <v-card
                v-for="(item, index) in record.DrugInUses"
                :key="index"
                variant="outlined"
                class="mb-4 drug-item-card"
              >
                <v-card-title class="drug-item-header d-flex align-center justify-space-between py-2">
                  <div class="d-flex align-center">
                    <v-avatar size="32" color="primary" variant="tonal" class="mr-3">
                      <span class="text-caption font-weight-bold">{{ index + 1 }}</span>
                    </v-avatar>
                    <span class="text-subtitle-1 font-weight-medium">藥物項目 #{{ index + 1 }}</span>
                  </div>
                  <v-btn
                    color="error"
                    variant="text"
                    icon="mdi-delete-outline"
                    size="small"
                    @click="delMedicine(index)"
                  />
                </v-card-title>
                <v-card-text class="pa-4">
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field
                        label="品項名稱"
                        v-model="item.Name"
                        :rules="emptyRules"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-pill"
                        placeholder="請輸入藥物名稱"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        label="劑量"
                        type="number"
                        v-model="item.Volume"
                        :rules="emptyRules"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-numeric"
                        placeholder="例如：10"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        label="劑量單位"
                        v-model="item.VolumeUnit"
                        :rules="emptyRules"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-scale-balance"
                        placeholder="例如：mg、ml"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        label="頻率"
                        v-model="item.Frequency"
                        :rules="emptyRules"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-clock-outline"
                        placeholder="例如：每日3次"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        label="使用目的"
                        v-model="item.Purpose"
                        :rules="emptyRules"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-target"
                        placeholder="例如：降血壓"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        label="備註"
                        v-model="item.Remark"
                        variant="outlined"
                        density="comfortable"
                        rows="2"
                        prepend-inner-icon="mdi-note-text-outline"
                        placeholder="其他需要註記的事項（選填）"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
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
import { ref, reactive, computed, watch, getCurrentInstance } from 'vue'
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

const LongUseingItems = ['有', '無']
const YnItems = ['無', '有', '不知道']
const YnItems2 = ['有', '不知道']
const YnKindItems = ['無', '≧5種', '≧9種', '不知道']

const createDefaultRecord = () => ({
  snkey: '',
  user_snkey: '',
  Date: '',
  LongUseing: '',
  qq1: '',
  qq1Statement1: '',
  qq2: '',
  qq3: '',
  qq4: '',
  qq5: '',
  qq5Statement5: '',
  DrugInUses: [],
  createInfo: {},
  editInfo: [],
})

const record = reactive(createDefaultRecord())

const headerTitle = computed(() => (processType.value === 'add' ? '新增藥物安全性評估' : '修改藥物安全性評估'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民藥物安全性評估資料，包含多重用藥、不當用藥等完整評估項目。'
    : '更新既有評估紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

// 自動判讀多重用藥問題
watch(
  () => [record.qq1, record.qq1Statement1],
  () => {
    if (record.qq1 == '不知道') {
      record.qq4 = '不知道'
    } else {
      if (record.qq1Statement1 < 5 || record.qq1 == '無' || !record.qq1Statement1) {
        record.qq4 = '無'
      }
      if (record.qq1Statement1 >= 5) {
        if (record.qq1Statement1 >= 9) {
          record.qq4 = '≧9種'
        } else {
          record.qq4 = '≧5種'
        }
      }
    }
  },
  { deep: true }
)

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

const addMedicine = () => {
  if (!record.DrugInUses) {
    record.DrugInUses = []
  }
  record.DrugInUses.push({
    Name: '',
    Volume: '',
    VolumeUnit: '',
    Frequency: '',
    Purpose: '',
    Remark: '',
  })
}

const delMedicine = (index) => {
  if (record.DrugInUses && Array.isArray(record.DrugInUses)) {
    record.DrugInUses.splice(index, 1)
  }
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
    if (!firstItem.DrugInUses) {
      firstItem.DrugInUses = []
    }
    Object.assign(record, firstItem)
  } else {
    record.DrugInUses = []
  }
  
  dialog.value = true
}

const openForEdit = (item) => {
  resetRecord()
  processType.value = 'edit'
  originalRecord.value = { ...item }
  const itemCopy = JSON.parse(JSON.stringify(item))
  if (!itemCopy.DrugInUses) {
    itemCopy.DrugInUses = []
  }
  Object.assign(record, itemCopy)
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

    const response = await api.add('drugsafeties', postData)
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

    const response = await api.post('drugsafeties', postData)
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
.drug-item-card {
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

:deep(.drug-list-header) {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08), rgba(var(--v-theme-primary), 0.04));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

:deep(.drug-item-header) {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}
</style>
