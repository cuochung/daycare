<template>
  <div class="medicine-record-add">
    <v-dialog v-model="dialog" max-width="1200" persistent fullscreen>
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
          <v-form ref="formRef">
            <!-- 藥品基本資訊 -->
            <v-card variant="outlined" rounded="lg" class="mb-6">
              <v-card-title class="d-flex align-center py-4">
                <v-avatar size="32" color="primary" variant="tonal" class="mr-3">
                  <v-icon color="primary" size="20">mdi-pill</v-icon>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold">藥品基本資訊</span>
                  <span class="text-body-2 text-medium-emphasis">選擇藥品及相關資訊</span>
                </div>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pt-4">
            <v-row>
                  <v-col cols="12" md="6" class="d-flex align-center ga-2">
                <v-autocomplete
                  v-model="list.medicinedata"
                  :items="medicineItems"
                  label="藥品"
                  variant="outlined"
                  density="comfortable"
                  :rules="emptyRules"
                  item-title="text"
                  item-value="snkey"
                  return-object
                  @update:model-value="getMedicine"
                  prepend-inner-icon="mdi-pill"
                      class="flex-grow-1"
                />
                <MedicineList @getSelect="getSelect" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-if="list.medicinedata && list.medicinedata.effect"
                  v-model="list.medicinedata.effect"
                  label="作用"
                  variant="outlined"
                  density="comfortable"
                  readonly
                  prepend-inner-icon="mdi-information"
                />
              </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- 用藥規格 -->
            <v-card variant="outlined" rounded="lg" class="mb-6">
              <v-card-title class="d-flex align-center py-4">
                <v-avatar size="32" color="info" variant="tonal" class="mr-3">
                  <v-icon color="info" size="20">mdi-scale-balance</v-icon>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-info">用藥規格</span>
                  <span class="text-body-2 text-medium-emphasis">設定單位、劑量、用量、用法等</span>
                </div>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pt-4">
                <v-row>
                  <v-col cols="12" sm="6" md="3" class="d-flex align-center ga-2">
                <v-autocomplete
                  v-model="list.unitdata"
                  :items="unitItems"
                  label="單位"
                  variant="outlined"
                  density="comfortable"
                  :rules="emptyRules"
                  item-title="text"
                  item-value="snkey"
                  return-object
                  prepend-inner-icon="mdi-scale-balance"
                      class="flex-grow-1"
                />
                <UnitList @getSelect="getSelect" />
              </v-col>
                  <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="list.dosage"
                  label="劑量"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-numeric"
                />
              </v-col>
                  <v-col cols="12" sm="6" md="3">
                <v-text-field
                      v-model="list.quantity"
                      label="用量"
                  variant="outlined"
                  density="comfortable"
                      :rules="emptyRules"
                      prepend-inner-icon="mdi-numeric"
                />
              </v-col>
                  <v-col cols="12" sm="6" md="3" class="d-flex align-center ga-2">
                <v-autocomplete
                  v-model="list.methoddata"
                  :items="methodItems"
                  label="用法"
                  variant="outlined"
                  density="comfortable"
                  :rules="emptyRules"
                  item-title="text"
                  item-value="snkey"
                  return-object
                  prepend-inner-icon="mdi-format-list-bulleted"
                      class="flex-grow-1"
                />
                <MethodList @getSelect="getSelect" />
              </v-col>
                </v-row>
                <v-row class="mt-2">
                  <v-col cols="12" md="6">
                <v-text-field
                      v-model="list.attention"
                      label="注意事項"
                  variant="outlined"
                  density="comfortable"
                      prepend-inner-icon="mdi-alert"
                />
              </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- 給藥時間安排 -->
            <v-card variant="outlined" rounded="lg" class="mb-6">
              <v-card-title class="d-flex align-center py-4">
                <v-avatar size="32" color="success" variant="tonal" class="mr-3">
                  <v-icon color="success" size="20">mdi-clock-outline</v-icon>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-success">給藥時間安排</span>
                  <span class="text-body-2 text-medium-emphasis">設定給藥時間、起始日期及給藥次數</span>
                </div>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pt-4">
                <v-row>
                  <v-col cols="12" md="4" class="d-flex align-center ga-2">
                <v-autocomplete
                  v-model="list.eat_medicine_timedata"
                  :items="eat_medicine_timeItems"
                  label="給藥時間"
                  variant="outlined"
                  density="comfortable"
                  :rules="emptyRules"
                  item-title="text"
                  item-value="snkey"
                  return-object
                  @update:model-value="getEatMedicineTime"
                  prepend-inner-icon="mdi-clock-outline"
                      class="flex-grow-1"
                />
                <EatMedicineTimeList @getSelect="getSelect" />
              </v-col>
                  <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="list.start_date"
                  label="給藥起始日期"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                  :rules="emptyRules"
                  prepend-inner-icon="mdi-calendar"
                />
              </v-col>
                  <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="list.start_time"
                  :items="start_timeItems"
                  label="給藥起始時間"
                  variant="outlined"
                  density="comfortable"
                  :rules="emptyRules"
                  prepend-inner-icon="mdi-clock"
                />
              </v-col>
                  <v-col cols="12" sm="6" md="2">
                <v-text-field
                  v-model="list.medicine_counts"
                  label="給藥次數"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  :rules="emptyRules"
                  prepend-inner-icon="mdi-counter"
                />
              </v-col>
                </v-row>
                <v-row class="mt-2">
                  <v-col cols="12">
                    <v-alert
                      :model-value="!!medicineEndInfo"
                      color="info"
                      variant="tonal"
                      border="start"
                      class="mb-0"
                    >
                      <template #prepend>
                        <v-icon>mdi-information-outline</v-icon>
                      </template>
                      <div class="d-flex align-center">
                        <span class="text-body-1 font-weight-medium mr-2">藥物用完資訊：</span>
                        <span class="text-body-1">{{ medicineEndInfo || '請完成以上欄位以計算' }}</span>
                      </div>
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
          <v-btn variant="tonal" color="secondary" @click="closeDialog">
            取消
          </v-btn>
          <v-btn
            v-if="processType === 'add'"
            color="primary"
            variant="flat"
            :loading="loading"
            :disabled="loading"
            @click="handleAdd"
          >
            確認新增
          </v-btn>
          <v-btn
            v-else
            color="primary"
            variant="flat"
            :loading="loading"
            :disabled="loading"
            @click="handleEdit"
          >
            確認修改
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'
import MedicineList from '@/components/MedicineList.vue'
import UnitList from '@/components/UnitList.vue'
import MethodList from '@/components/MethodList.vue'
import EatMedicineTimeList from '@/components/EatMedicineTimeList.vue'

const emit = defineEmits(['getMedicineRecord'])

const props = defineProps({
  medicalRecordList: {
    type: Object,
    default: () => ({}),
  },
  medicalRecordItems: {
    type: Array,
    default: () => [],
  },
  medicineRecordItems: {
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
const start_timeItems = ref([])
const intervalDay = ref(1)
const allUsedMedicineItems = ref([])
const medicineItems = ref([])
const unitItems = ref([])
const methodItems = ref([])
const eat_medicine_timeItems = ref([])

const emptyRules = [(v) => !!v || '不可空白']

const list = reactive({
  medicinedata: null,
  unitdata: null,
  methoddata: null,
  eat_medicine_timedata: null,
  start_date: '',
  start_time: '',
  medicine_counts: '',
  dosage: '',
  attention: '',
  quantity: '',
  medicineEndInfo: '',
})

const headerTitle = computed(() => (processType.value === 'add' ? '新增用藥' : '修改用藥'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫用藥資訊，包含藥品、劑量、用法、給藥時間等項目。'
    : '更新既有用藥紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

// 藥物用完資訊計算
const medicineEndInfo = computed(() => {
  if (
    list.eat_medicine_timedata &&
    list.start_date &&
    list.start_time &&
    list.medicine_counts
  ) {
    // 判斷指定日期loop給藥的狀況
    if (list.eat_medicine_timedata && list.eat_medicine_timedata.repeatDate) {
      const DateArrs = list.eat_medicine_timedata.repeatDate.split(',').map(d => parseInt(d, 10))
      const TimeArrs = list.eat_medicine_timedata.time.split(',').map(t => parseInt(t, 10))
      const startDate = dayjs(list.start_date)
      const startTime = parseInt(list.start_time, 10)

      // 檢查 start_date 是否在指定日期內
          if (!DateArrs.includes(startDate.date())) {
        store.showToastMulti({
          type: 'warning',
          message: `起始給藥日期不在指定的用藥日期範圍內：${DateArrs.join(',')},請確認!!`,
          closeTime: 3,
        })
        return '起始給藥日期不在指定的用藥日期範圍內'
      }

      let finalDate = null
      let finalTime = null
      let checkDate = startDate.clone()
      let currentTimeIndex = TimeArrs.indexOf(startTime)

      for (let i = 0; i < list.medicine_counts; i++) {
            while (!DateArrs.includes(checkDate.date())) {
          checkDate = checkDate.add(1, 'day')
          currentTimeIndex = 0
            }

        finalDate = checkDate.clone()
        finalTime = TimeArrs[currentTimeIndex]

        currentTimeIndex++
            if (currentTimeIndex >= TimeArrs.length) {
          currentTimeIndex = 0
          checkDate = checkDate.add(1, 'day')
        }
      }

      list.medicineEndInfo = '日期:' + finalDate.format('YYYY-MM-DD') + ' 時段:' + finalTime
      return list.medicineEndInfo
    }

    // 判斷指定星期 loop給藥的狀況
    if (list.eat_medicine_timedata && list.eat_medicine_timedata.repeatWeek && list.eat_medicine_timedata.repeatWeek.length > 0) {
      const WeekArrs = list.eat_medicine_timedata.repeatWeek.split(',').map(w => parseInt(w, 10))
      const TimeArrs = list.eat_medicine_timedata.time.split(',').map(t => parseInt(t, 10))
      const startDate = dayjs(list.start_date)
      const startTime = parseInt(list.start_time, 10)

      const startWeek = startDate.day() === 0 ? 7 : startDate.day()
          if (!WeekArrs.includes(startWeek)) {
        store.showToastMulti({
          type: 'warning',
          message: `起始給藥日期的星期不在指定用藥星期範圍內：${WeekArrs.join(',')}, 請確認!!`,
          closeTime: 3,
        })
        return '起始給藥日期的星期不在指定用藥星期範圍內'
      }

      let finalDate = null
      let finalTime = null
      let checkDate = startDate.clone()
      let currentTimeIndex = TimeArrs.indexOf(startTime)

      for (let i = 0; i < list.medicine_counts; i++) {
            while (!WeekArrs.includes(checkDate.day() === 0 ? 7 : checkDate.day())) {
          checkDate = checkDate.add(1, 'day')
          currentTimeIndex = 0
            }

        finalDate = checkDate.clone()
        finalTime = TimeArrs[currentTimeIndex]

        currentTimeIndex++
            if (currentTimeIndex >= TimeArrs.length) {
          currentTimeIndex = 0
          checkDate = checkDate.add(1, 'day')
        }
      }

      list.medicineEndInfo = '日期:' + finalDate.format('YYYY-MM-DD') + ' 時段:' + finalTime
      return list.medicineEndInfo
    }

    // 一般間隔天數計算
    const addday = Math.ceil(list.medicine_counts / start_timeItems.value.length)
    const intervaldaycount = Math.floor((list.medicine_counts - 1) / start_timeItems.value.length)
    const last = (list.medicine_counts - 1) % start_timeItems.value.length
    const selectIndex = start_timeItems.value.indexOf(list.start_time)
    let nextDay = 0

    if (selectIndex + last >= start_timeItems.value.length) {
      nextDay = 1
    }
    const newindex = (selectIndex + last) % start_timeItems.value.length

    if (intervalDay.value > 1) {
      list.medicineEndInfo =
        '日期:' +
        dayjs(list.start_date)
          .add(addday - 1 + intervaldaycount * (intervalDay.value - 1) + nextDay, 'day')
          .format('YYYY-MM-DD') +
        ' 時段:' +
        start_timeItems.value[newindex]
    } else {
      list.medicineEndInfo =
        '日期:' +
        dayjs(list.start_date)
          .add(addday - 1 + nextDay, 'day')
          .format('YYYY-MM-DD') +
        ' 時段:' +
        start_timeItems.value[newindex]
    }
    return list.medicineEndInfo
  }
  return ''
})

// 監聽 list 變化，檢查重複用藥
watch(
  () => [list.medicinedata, list.start_date],
  () => {
    if (list.medicinedata && list.medicinedata.snkey && list.start_date && processType.value === 'add') {
      const matchData = allUsedMedicineItems.value.filter((i) => {
        return (
          i.medicine_snkey == list.medicinedata.snkey &&
          list.start_date >= i.start_date &&
          list.start_date <= i.end_date
        )
      })

      if (matchData.length > 0) {
        const matchMedical = props.medicalRecordItems.find((i) => {
          return i.snkey == matchData[0].medical_snkey
        })

        if (matchMedical) {
          const msg = `與 [${matchMedical.date}] [${matchMedical.hospital_name}-${matchMedical.branch_name}]`
          store.showToastMulti({
            type: 'warning',
            message: msg + ',藥品使用重覆!!,請注意!!',
            closeTime: 3,
          })
        }
      }
    }
  },
  { deep: true }
)

const mapData = (database, data) => {
  const items = data.map((item) => {
    if (database === 'medicine') {
          return {
            snkey: item.snkey,
            text: item.name,
            effect: item.effect,
      }
    }

    if (database === 'eat_medicine_time') {
          return {
            snkey: item.snkey,
        text: item.repeatWeek
          ? item.name + ' [' + item.time + ']' + ' / 每周 ' + item.repeatWeek
          : item.repeatDate
            ? item.name + ' [' + item.time + ']' + ' / 每月 ' + item.repeatDate + '號'
            : item.name + ' [' + item.time + ']' + ' / 間隔 ' + item.day + '天',
            time: item.time,
            day: item.day,
            repeatWeek: item.repeatWeek,
            repeatDate: item.repeatDate ? item.repeatDate : '',
      }
        }

        return {
          snkey: item.snkey,
          text: item.name,
    }
  })

  if (database === 'medicine') {
    medicineItems.value = items
  } else if (database === 'unit') {
    unitItems.value = items
  } else if (database === 'method') {
    methodItems.value = items
  } else if (database === 'eat_medicine_time') {
    eat_medicine_timeItems.value = items
  }
}

const getSelect = async () => {
  await getSelectItems('medicine')
  await getSelectItems('unit')
  await getSelectItems('method')
  await getSelectItems('eat_medicine_time')
}

const getSelectItems = async (database) => {
  try {
    const response = await api.get(database)
    if (response && response.length) {
      mapData(database, response)
    }
  } catch (error) {
    console.error(`getSelectItems ${database} error:`, error)
  }
}

const getAllUsedMedicine = async () => {
  try {
    const response = await api.options(`byjson/searchByKeyValue/${store.state.databaseName}/medicine_record`, {
      key: 'user_snkey',
      value: store.state.uData.snkey,
    })

    if (response && response.length) {
      allUsedMedicineItems.value = response.map((i) => {
        const newItem = { ...i }
        if (newItem.medicineEndInfo && newItem.medicineEndInfo.length > 13) {
          newItem.end_date = newItem.medicineEndInfo.substring(3, 13)
        }
        return newItem
      })
    } else {
      allUsedMedicineItems.value = []
    }
  } catch (error) {
    console.error('getAllUsedMedicine error:', error)
    allUsedMedicineItems.value = []
  }
}

const getMedicine = () => {
  if (!list.medicinedata) return false

  const repeat = props.medicineRecordItems.find((i) => {
    return i.medicine_snkey == list.medicinedata.snkey
  })

  if (repeat) {
    store.showToastMulti({
      type: 'warning',
      message: '本次就診藥品輸入重覆,請確認!!',
      closeTime: 3,
    })
  }
}

const getEatMedicineTime = () => {
  if (!list.eat_medicine_timedata) {
    store.showToastMulti({
      type: 'warning',
      message: '未正確選擇給藥時間或給藥時間不正確,請重新確認!!',
      closeTime: 3,
    })
    return false
  }

  if (!list.eat_medicine_timedata.snkey) {
    store.showToastMulti({
      type: 'warning',
      message: '未正確選擇給藥時間或給藥時間不正確,請重新確認!!',
      closeTime: 3,
    })
    return false
  }

  list.start_time = ''
  start_timeItems.value = list.eat_medicine_timedata.time.split(',')
  intervalDay.value = list.eat_medicine_timedata.day
}

const openForAdd = () => {
  processType.value = 'add'
  Object.keys(list).forEach(key => {
    if (key === 'medicinedata' || key === 'unitdata' || key === 'methoddata' || key === 'eat_medicine_timedata') {
      list[key] = null
      } else {
      list[key] = ''
    }
  })
  dialog.value = true
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetValidation()
    }
  })
}

const openForEdit = (item) => {
  processType.value = 'edit'
  Object.assign(list, { ...item })

  const checkCol = ['medicine', 'unit', 'method', 'eat_medicine_time']
  checkCol.forEach((i) => {
    const items = i === 'medicine' ? medicineItems.value :
      i === 'unit' ? unitItems.value :
      i === 'method' ? methodItems.value :
      eat_medicine_timeItems.value

    const found = items.find((cItem) => {
      return cItem.snkey == list[i + '_snkey']
    })

    if (found) {
      list[i + 'data'] = found
    }
  })

  getEatMedicineTime()
  list.start_time = item.start_time
  dialog.value = true
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetValidation()
    }
  })
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

  const postData = {
    user_snkey: store.state.uData.snkey,
    medical_snkey: props.medicalRecordList.snkey,
    datalist: JSON.stringify({
      ...list,
      user_snkey: store.state.uData.snkey,
      medical_snkey: props.medicalRecordList.snkey,
      createInfo: {
        snkey: store.state.pData.snkey,
        name: store.state.pData.username,
        time: dayjs().format('YYYY-MM-DD HH:mm:ss')
      },
      editInfo: []
    })
  }

  try {
    const response = await api.add('medicine_record', postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已新增',
        closeTime: 2,
      })
      dialog.value = false
      emit('getMedicineRecord')
      } else {
      store.showToastMulti({
        type: 'error',
        message: '新增失敗，請稍後再試',
        closeTime: 3,
      })
    }
  } catch (error) {
    console.error('handleAdd error:', error)
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

  list.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })

  let postData = {
    snkey: list.snkey,
    datalist: JSON.stringify(list),
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }

  try {
    const response = await api.post('medicine_record', postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已修改',
        closeTime: 2,
      })
      dialog.value = false
      emit('getMedicineRecord')
    } else {
      store.showToastMulti({
        type: 'error',
        message: '修改失敗，請稍後再試',
        closeTime: 3,
      })
    }
  } catch (error) {
    console.error('handleEdit error:', error)
    store.showToastMulti({
      type: 'error',
      message: '修改失敗，請稍後再試',
      closeTime: 3,
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getSelect()
  getAllUsedMedicine()
})

defineExpose({
  openForAdd,
  openForEdit,
})
</script>
