<template>
  <div class="medical-print-option">
    <v-dialog v-model="dialog" max-width="800" persistent>
      <v-card rounded="xl">
        <v-sheet color="primary" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
          <div class="d-flex align-center">
            <v-avatar size="48" color="white" variant="tonal" class="mr-4">
              <v-icon color="white" size="28">mdi-printer-settings</v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h6 font-weight-bold mb-1 text-white">列印醫院就診紀錄設定</h2>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" color="white" @click="closeDialog" />
        </v-sheet>

        <v-card-text class="px-6 py-5">
          <v-alert color="primary" variant="tonal" border="start" class="mb-4">
            <div class="d-flex justify-space-between align-center mb-3">
              <h3 class="text-h6 font-weight-medium">生命徵象指定列印內容設定</h3>
              <div>
                <v-btn color="primary" variant="tonal" size="small" class="mr-2" @click="selectAll">全選</v-btn>
                <v-btn color="primary" variant="outlined" size="small" @click="noAll">全不選</v-btn>
              </div>
            </div>
            <v-row class="mx-1">
              <v-col cols="6" md="3" v-for="field in signlifeFields" :key="field.key">
                <v-checkbox v-model="list.signlife[field.key]" :value="'true'" :label="field.label" hide-details
                  density="compact" />
              </v-col>
            </v-row>
            
            <v-divider class="my-4" />
            <h3 class="text-h6 font-weight-medium mb-3">資料距離今日天數設定</h3>
            <v-text-field v-model="list.day" label="天數" type="number" variant="outlined" density="comfortable" />
          </v-alert>
        </v-card-text>

        <v-divider />

        <v-card-actions class="px-6 py-4">
          <v-spacer />
          <v-btn variant="tonal" color="secondary" @click="closeDialog">
            取消
          </v-btn>
          <v-btn color="primary" variant="flat" @click="printOK">
            確認列印
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'
import { useRouter } from 'vue-router'

const props = defineProps({
  medicalRecordItems: {
    type: Array,
    default: () => [],
  },
  eatMedicineTimeItems: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['refresh'])

const store = useStore()
const router = useRouter()
const { proxy } = getCurrentInstance()

const dialog = ref(false)
const items = ref([])
const signlifeItems = ref([])

const signlifeFields = [
  { key: 'date', label: '評估日期' },
  { key: 'time', label: '評估時間' },
  { key: 'result', label: '檢查結果' },
  { key: 'weight', label: '體重' },
  { key: 'bp_h', label: '血壓(H)' },
  { key: 'bp_l', label: '血壓(L)' },
  { key: 'pulse', label: '脈搏' },
  { key: 'temperature', label: '體溫' },
  { key: 'breath', label: '呼吸' },
  { key: 'blood_sugar', label: '血糖' },
  { key: 'blood_oxygen', label: '血氧濃度' },
  { key: 'pain', label: '疼痛指數' },
  { key: 'gcs_e', label: 'GCS-E' },
  { key: 'gcs_v', label: 'GCS-V' },
  { key: 'gcs_m', label: 'GCS-M' },
  { key: 'stool', label: '大便次數' },
  { key: 'note', label: '備註' },
]

const list = reactive({
  signlife: {
    date: '',
    time: '',
    result: '',
    weight: '',
    bp_h: '',
    bp_l: '',
    pulse: '',
    temperature: '',
    breath: '',
    blood_sugar: '',
    blood_oxygen: '',
    pain: '',
    gcs_e: '',
    gcs_v: '',
    gcs_m: '',
    stool: '',
    note: '',
  },
  day: 10,
})

const getSignlife = async () => {
  try {
    const response = await api.options(`byjson/searchByKeyValue/${store.state.databaseName}/signlife`, {
      key: 'u_snkey',
      value: store.state.uData.snkey,
    })

    if (response && response.length) {
      signlifeItems.value = response
    } else {
      signlifeItems.value = []
    }
  } catch (error) {
    console.error('getSignlife error:', error)
    signlifeItems.value = []
  }
}

const selectAll = () => {
  signlifeFields.forEach(field => {
    list.signlife[field.key] = 'true'
  })
}

const noAll = () => {
  signlifeFields.forEach(field => {
    list.signlife[field.key] = ''
  })
}

const enterProcess = (item) => {
  items.value = item
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
}

const printOK = async () => {
  const result = await proxy?.$swal?.({
    title: '確認顯示列印就診紀錄單畫面？',
    text: '列印畫面將在新的分頁中顯示，請再次確認。',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center',
  })

  if (!result?.isConfirmed) return

  try {
    const item = items.value

    // 取得該病歷所有用藥資料
    const medicineResponse = await api.options(`byjson/searchByKeyValue/${store.state.databaseName}/medicine_record`, {
      key: 'user_snkey',
      value: store.state.uData.snkey,
    })

    let medicineData = []
    if (medicineResponse && medicineResponse.length) {
      // 判斷還在使用的藥物
      medicineData = medicineResponse.filter(i => {
        if (
          dayjs(item.date).isSameOrAfter(dayjs(i.start_date)) &&
          dayjs(i.medicineEndInfo?.substring(3, 13)).isAfter(dayjs(item.date))
        ) {
          i.end_date = i.medicineEndInfo.substring(3, 13)
          return i
        }
      })

      // 取得各藥物的就診紀錄
                 medicineData = medicineData.filter((i) => {
        const matchmedicalRecord = props.medicalRecordItems.find((j) => {
          return i.medical_snkey == j.snkey
        })

                if (matchmedicalRecord) {
          i.medical = matchmedicalRecord
          return i
        }
      })

      // 取得各藥物的吃藥時間紀錄
                medicineData = medicineData.filter((i) => {
        const matcheatMedicineTime = props.eatMedicineTimeItems.find((j) => {
          return i.eat_medicine_time_snkey == j.snkey
        })

                if (matcheatMedicineTime) {
          i.eat_medicine_time = matcheatMedicineTime
          return i
        }
      })
    }

    // 判斷符合指定日數內的生命徵象資料
    const startDay = dayjs(item.date).subtract(list.day, 'day').format('YYYY-MM-DD')
    const endDay = dayjs(item.date).format('YYYY-MM-DD')
    const signlifeData = signlifeItems.value.filter(i => {
                return (
        dayjs(i.date).format('YYYY-MM-DD') >= startDay &&
        dayjs(i.date).format('YYYY-MM-DD') <= endDay
      )
    })

    // 取得最後一筆體重
    let lastWeightVal = signlifeItems.value.filter(i => i.weight)
    if (lastWeightVal.length) {
      lastWeightVal = lastWeightVal.sort((a, b) => (a.date < b.date ? 1 : -1))
    }

    const printData = {
                medicalData: item,
                medicineData: medicineData,
                signlifeData: signlifeData,
      printSet: list,
      lastWeightVal: lastWeightVal.length ? lastWeightVal[0].weight : 'null',
    }

    // 送出資料到列印頁面
    sessionStorage.setItem('printData', JSON.stringify(printData))
    const routeData = router.resolve({
      path: '/print/medicalprint',
    })
    window.open(routeData.href, '_blank')
  } catch (error) {
    console.error('printOK error:', error)
    store.showToastMulti({
      type: 'error',
      message: '列印失敗，請稍後再試',
      closeTime: 3,
    })
  }
}

onMounted(() => {
  selectAll()
  getSignlife()
})

defineExpose({
  enterProcess,
})
</script>
