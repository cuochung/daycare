<template>
  <div class="medical-record-add">
    <v-dialog v-model="dialog" max-width="1200" persistent fullscreen>
      <FloatingPanel title="快速操作">
        <v-sheet color="primary-lighten-5" variant="tonal" elevation="2" rounded="lg" class="pa-3">
          <div class="d-flex flex-column" style="gap: 8px;">
            <v-btn variant="tonal" color="secondary" block prepend-icon="mdi-close" @click="closeDialog">
              取消
            </v-btn>
            <v-btn v-if="processType === 'add'" color="primary" variant="flat" block :loading="loading"
              prepend-icon="mdi-check" @click="handleAdd">
              確認新增
            </v-btn>
            <v-btn v-else color="primary" variant="flat" block :loading="loading"
              prepend-icon="mdi-content-save" @click="handleEdit">
              確認修改
            </v-btn>
          </div>
        </v-sheet>
      </FloatingPanel>

      <v-card rounded="xl">
        <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
          <div class="d-flex align-center">
            <v-avatar size="48" color="white" variant="tonal" class="mr-4">
              <v-icon color="white" size="28">mdi-hospital-building</v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h6 font-weight-bold mb-1">{{ headerTitle }}</h2>
              <p class="text-body-2 mb-0">{{ headerSubtitle }}</p>
            </div>
          </div>
          <div class="d-flex align-center ga-2">
            <v-btn v-if="processType === 'add'" color="white" variant="tonal" @click.stop="insertLast">
              載入最近一次就診資料
            </v-btn>
            <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
          </div>
        </v-sheet>

        <v-card-text class="px-6 py-5">
          <!-- 住民資料 -->
          <v-card variant="outlined" color="primary-lighten-5" class="mb-6" rounded="lg">
            <v-card-title class="d-flex align-center py-3">
              <v-avatar size="32" color="primary" variant="tonal" class="mr-3">
                <v-icon color="primary" size="20">mdi-account</v-icon>
              </v-avatar>
              <span class="text-subtitle-1 font-weight-bold text-primary">住民資料</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-4">
              <v-row dense>
                <v-col cols="12" sm="6" md="3">
                  <v-text-field label="床位" variant="outlined" density="comfortable" readonly hide-details
                    :model-value="store.state.uData?.bed_name" />
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-text-field label="姓名" variant="outlined" density="comfortable" readonly hide-details
                    :model-value="store.state.uData?.name" />
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-text-field label="住民證號" variant="outlined" density="comfortable" readonly hide-details
                    :model-value="store.state.uData?.p_code" />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field label="疾病史" variant="outlined" density="comfortable" readonly hide-details
                    :model-value="diagnosis" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-form ref="formRef">
            <!-- 基本就診資訊 -->
            <v-card variant="outlined" rounded="lg" class="mb-6">
              <v-card-title class="d-flex align-center py-4">
                <v-avatar size="32" color="primary" variant="tonal" class="mr-3">
                  <v-icon color="primary" size="20">mdi-hospital-building</v-icon>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold">基本就診資訊</span>
                  <span class="text-body-2 text-medium-emphasis">填寫就診日期、醫院、科別等基本資訊</span>
                </div>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pt-4">
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="list.date" label="就診日期" type="date" variant="outlined" density="comfortable"
                      :rules="emptyRules" prepend-inner-icon="mdi-calendar" />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="list.outpatient" :items="outpatientItems" label="診別" variant="outlined"
                      density="comfortable" />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="list.time" :items="timeItems" label="時段" variant="outlined"
                      density="comfortable" />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="list.back_date" label="回診日期" type="date" variant="outlined"
                      density="comfortable" prepend-inner-icon="mdi-calendar-clock" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- 醫院資訊 -->
            <v-card variant="outlined" rounded="lg" class="mb-6">
              <v-card-title class="d-flex align-center py-4">
                <v-avatar size="32" color="info" variant="tonal" class="mr-3">
                  <v-icon color="info" size="20">mdi-stethoscope</v-icon>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-info">醫院資訊</span>
                  <span class="text-body-2 text-medium-emphasis">選擇就診醫院、科別及醫師</span>
                </div>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pt-4">
                <v-row>
                  <v-col cols="12" md="4" class="d-flex align-center ga-2">
                    <v-autocomplete v-model="list.hospitaldata" :items="hospitalItems" label="醫院" variant="outlined"
                      density="comfortable" :rules="emptyRules" item-title="text" item-value="snkey" return-object
                      prepend-inner-icon="mdi-hospital-building" class="flex-grow-1" />
                    <HospitalList @getSelect="getSelect" />
                  </v-col>
                  <v-col cols="12" md="4" class="d-flex align-center ga-2">
                    <v-autocomplete v-model="list.branchdata" :items="branchItems" label="科別" variant="outlined"
                      density="comfortable" :rules="emptyRules" item-title="text" item-value="snkey" return-object
                      prepend-inner-icon="mdi-stethoscope" class="flex-grow-1" />
                    <BranchList @getSelect="getSelect" />
                  </v-col>
                  <v-col cols="12" md="4" class="d-flex align-center ga-2">
                    <v-autocomplete v-model="list.doctordata" :items="doctorItems" label="醫師" variant="outlined"
                      density="comfortable" :rules="emptyRules" item-title="text" item-value="snkey" return-object
                      prepend-inner-icon="mdi-doctor" class="flex-grow-1" />
                    <DoctorList @getSelect="getSelect" />
                  </v-col>
                </v-row>
                <v-row class="mt-2">
                  <v-col cols="12" class="d-flex align-center ga-2">
                    <v-autocomplete v-model="list.main_cause_of_treatmentdata" :items="main_cause_of_treatmentItems"
                      label="就診主因" variant="outlined" density="comfortable" :rules="emptyRules" item-title="text"
                      item-value="snkey" return-object prepend-inner-icon="mdi-clipboard-text" class="flex-grow-1" />
                    <MainCauseOfTreatmentList @getSelect="getSelect" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- 就診安排資訊 -->
            <v-card variant="outlined" rounded="lg" class="mb-6">
              <v-card-title class="d-flex align-center py-4">
                <v-avatar size="32" color="secondary" variant="tonal" class="mr-3">
                  <v-icon color="secondary" size="20">mdi-car</v-icon>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-secondary">就診安排資訊</span>
                  <span class="text-body-2 text-medium-emphasis">記錄交通工具、陪診人員及攜帶物品</span>
                </div>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pt-4">
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="list.car" :items="carItems" label="使用車輛" variant="outlined" density="comfortable"
                      prepend-inner-icon="mdi-car" />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="list.accompany" :items="accompanyItems" label="陪診人員" variant="outlined"
                      density="comfortable" prepend-inner-icon="mdi-account-group" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-combobox v-model="list.carryArray" :items="carryitemsItems" multiple label="攜帶物品"
                      variant="outlined" density="comfortable" chips closable-chips
                      prepend-inner-icon="mdi-briefcase" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- 使用中管路 -->
            <v-card variant="outlined" rounded="lg" class="mb-6">
              <v-card-title class="d-flex align-center py-4">
                <v-avatar size="32" color="warning" variant="tonal" class="mr-3">
                  <v-icon color="warning" size="20">mdi-pipe</v-icon>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-warning">使用中管路</span>
                  <span class="text-body-2 text-medium-emphasis">顯示當前使用中的管路資訊</span>
                </div>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pt-4">
                <div v-if="matchPipelineItems.length > 0">
                  <v-chip v-for="(plist, index) in matchPipelineItems" :key="index" color="warning" variant="tonal"
                    class="ma-1" label size="large">
                    <v-icon start>mdi-pipe</v-icon>
                    {{ plist.name }} - {{ plist.end_date }}
                  </v-chip>
                </div>
                <div v-else class="text-body-2 text-medium-emphasis py-4 text-center">
                  目前無使用中管路
                </div>
              </v-card-text>
            </v-card>

            <!-- 就診內容 -->
            <v-card variant="outlined" rounded="lg" class="mb-6">
              <v-card-title class="d-flex align-center py-4">
                <v-avatar size="32" color="success" variant="tonal" class="mr-3">
                  <v-icon color="success" size="20">mdi-text</v-icon>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-success">就診內容</span>
                  <span class="text-body-2 text-medium-emphasis">記錄就診原因及醫師回覆</span>
                </div>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pt-4">
                <v-row>
                  <v-col cols="12">
                    <v-textarea v-model="list.description" label="原因狀況描述" variant="outlined" auto-grow rows="4"
                      prepend-inner-icon="mdi-text" density="comfortable" />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="list.response" label="就醫情形回覆" variant="outlined" auto-grow rows="4"
                      prepend-inner-icon="mdi-message-reply-text" density="comfortable" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="px-6 py-4">
          <v-spacer />
          <v-checkbox v-if="processType === 'edit'" v-model="accountingCheck" label="會計項目判斷" color="error" value="true"
            hide-details class="mr-4" />
          <v-btn variant="tonal" color="secondary" @click="closeDialog">
            取消
          </v-btn>
          <v-btn v-if="processType === 'add'" color="primary" variant="flat" :loading="loading" :disabled="loading"
            @click="handleAdd">
            確認新增
          </v-btn>
          <v-btn v-else color="primary" variant="flat" :loading="loading" :disabled="loading" @click="handleEdit">
            確認修改
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'
import FloatingPanel from '@/components/FloatingPanel.vue'
import HospitalList from './HospitalList.vue'
import BranchList from './BranchList.vue'
import DoctorList from './DoctorList.vue'
import MainCauseOfTreatmentList from './MainCauseOfTreatmentList.vue'

const emit = defineEmits(['getMedicalData'])

const props = defineProps({
  medicalRecordItems: {
    type: Array,
    default: () => [],
  },
})

const store = useStore()
const { proxy } = getCurrentInstance()

const dialog = ref(false)
const loading = ref(false)
const formRef = ref(null)
const accountingCheck = ref('')

const timeItems = ['上午', '下午', '夜間']
const outpatientItems = ['門診', '急診', '拿藥', '巡診', '駐診']
const carItems = [
  '',
  '復康巴士(私人)',
  '復康巴士(公立)',
  '計程車',
  '救護車',
  '慈愛復健車',
  '家屬自載',
  '代拿藥',
  '家屬自取藥',
]
const accompanyItems = ['', '機構安排', '家屬自陪', '看護', '不需陪診']
const carryitemsItems = ['健保卡', '殘障手冊', '重大傷病卡', 'TB手冊']

const hospitalItems = ref([])
const branchItems = ref([])
const doctorItems = ref([])
const main_cause_of_treatmentItems = ref([])
const matchPipelineItems = ref([])

const emptyRules = [(v) => !!v || '不可空白']

const list = reactive({
  date: '',
  outpatient: '',
  time: '',
  hospitaldata: null,
  branchdata: null,
  doctordata: null,
  main_cause_of_treatmentdata: null,
  back_date: '',
  car: '',
  accompany: '',
  carryArray: [],
  description: '',
  response: '',
})

const processType = ref('add')

const diagnosis = computed(() => {
  if (store.state?.uData?.diagnosis) {
    return Object.values(store.state.uData.diagnosis).join(', ')
  }
  return ''
})

const headerTitle = computed(() =>
  processType.value === 'add' ? '新增醫院就診紀錄' : '修改醫院就診紀錄'
)
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫醫院就診紀錄，包含就診日期、醫院、科別、醫生、就診主因等資訊。'
    : '更新既有就診紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const getSelect = async () => {
  await getSelectItems('hospital')
  await getSelectItems('branch')
  await getSelectItems('doctor')
  await getSelectItems('main_cause_of_treatment')
}

const getSelectItems = async (database) => {
  try {
    const response = await api.get(database)
    if (response && response.length) {
      const items = response.map((i) => ({
        snkey: i.snkey,
        text: i.name,
      }))

      if (database === 'hospital') {
        hospitalItems.value = items
      } else if (database === 'branch') {
        branchItems.value = items
      } else if (database === 'doctor') {
        doctorItems.value = items
      } else if (database === 'main_cause_of_treatment') {
        main_cause_of_treatmentItems.value = items
      }
    }
  } catch (error) {
    console.error(`getSelectItems ${database} error:`, error)
  }
}

const getPipeline = async () => {
  try {
    const response = await api.options(
      `byjson/searchByKeyValue/${store.state.databaseName}/pipeline_used`,
      {
        key: 'u_snkey',
        value: store.state.uData.snkey,
      }
    )

    if (response && response.length) {
      const pipelineData = response.map((i) => {
        const newItem = JSON.parse(i.datalist || '{}')
        newItem.snkey = i.snkey
        newItem.create_man = i.create_man
        newItem.edit_man = i.edit_man
        return newItem
      })

      matchPipelineItems.value = pipelineData.filter((i) => {
        return dayjs(i.end_date).format('YYYY-MM-DD') > dayjs().format('YYYY-MM-DD')
      })
    } else {
      matchPipelineItems.value = []
    }
  } catch (error) {
    console.error('getPipeline error:', error)
    matchPipelineItems.value = []
  }
}

const insertLast = () => {
  if (!props.medicalRecordItems || props.medicalRecordItems.length === 0) {
    store.showToastMulti({
      type: 'warning',
      message: '無最近一次就診資料可載入',
      closeTime: 3,
    })
    return
  }

  const lastData = [...props.medicalRecordItems].sort((a, b) => {
    return a.date < b.date ? 1 : -1
  })

  Object.assign(list, { ...lastData[0] })

  const checkCol = ['hospital', 'branch', 'doctor', 'main_cause_of_treatment']
  checkCol.forEach((i) => {
    const items =
      i === 'hospital'
        ? hospitalItems.value
        : i === 'branch'
          ? branchItems.value
          : i === 'doctor'
            ? doctorItems.value
            : main_cause_of_treatmentItems.value

    const found = items.find((cItem) => {
      return cItem.snkey == list[i + '_snkey']
    })

    if (found) {
      list[i + 'data'] = found
    }
  })

  list.date = dayjs().format('YYYY-MM-DD')
}

const openForAdd = () => {
  processType.value = 'add'
  Object.keys(list).forEach((key) => {
    if (key === 'hospitaldata' || key === 'branchdata' || key === 'doctordata' || key === 'main_cause_of_treatmentdata') {
      list[key] = null
    } else if (key === 'carryArray') {
      list[key] = []
    } else {
      list[key] = ''
    }
  })
  list.date = dayjs().format('YYYY-MM-DD')
  list.car = ''
  list.accompany = ''
  dialog.value = true
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetValidation()
    }
  })
  getPipeline()
}

const openForEdit = (item) => {
  processType.value = 'edit'
  Object.assign(list, { ...item })

  const checkCol = ['hospital', 'branch', 'doctor', 'main_cause_of_treatment']
  checkCol.forEach((i) => {
    const items =
      i === 'hospital'
        ? hospitalItems.value
        : i === 'branch'
          ? branchItems.value
          : i === 'doctor'
            ? doctorItems.value
            : main_cause_of_treatmentItems.value

    const found = items.find((cItem) => {
      return cItem.snkey == list[i + '_snkey']
    })

    if (found) {
      list[i + 'data'] = found
    }
  })

  if (list.carryitems) {
    list.carryArray = list.carryitems.split(',').filter((i) => i)
  } else {
    list.carryArray = []
  }

  dialog.value = true
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetValidation()
    }
  })
  getPipeline()
}

const closeDialog = () => {
  dialog.value = false
  loading.value = false
}

const validateForm = () => {
  const checkCol = ['hospital', 'branch', 'doctor', 'main_cause_of_treatment']
  const noMatch = checkCol.filter((i) => {
    if (!list[i + 'data']) {
      return i
    }
    if (!list[i + 'data'].snkey) {
      return i
    }
  })

  if (noMatch.length > 0) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完整或不符合規定,請再確認!!',
      closeTime: 3,
    })
    return false
  }

  if (list.car && list.car.includes('復康巴士') && !list.accompany) {
    store.showToastMulti({
      type: 'warning',
      message: '使用復康巴需選擇陪診人員,請再確認',
      closeTime: 3,
    })
    return false
  }

  return true
}

const accountingFeesCheck = async () => {
  const carFee = { ...list }

  if (!carFee.car || !carFee.hospitaldata) {
    return
  }

  try {
    const feeResponse = await api.get('fee')
    if (!feeResponse || !feeResponse.length) {
      return
    }

    let feeData = []

    if (carFee.car.includes('復康巴士(私人)')) {
      if (
        list.main_cause_of_treatmentdata?.text == '急診就醫' ||
        list.main_cause_of_treatmentdata?.text == '出院帶藥'
      ) {
        feeData = feeResponse.filter((i) => {
          return i.name.includes(carFee.hospitaldata.text + '(出、入院)')
        })
      } else {
        feeData = feeResponse.filter((i) => {
          return i.name.includes(carFee.hospitaldata.text + '(來回)')
        })
      }
    }

    if (carFee.car.includes('計程車') || carFee.car.includes('救護車')) {
      feeData = feeResponse.filter((i) => {
        return i.name.includes(carFee.car)
      })
    }

    if (carFee.car.includes('代拿藥')) {
      feeData = feeResponse.filter((i) => {
        return i.name.includes(carFee.car)
      })
    }

    if (carFee.accompany && carFee.accompany.includes('機構安排')) {
      const matchRs = feeResponse.find((i) => {
        return i.name.includes('陪診費')
      })
      if (matchRs) {
        feeData.push(matchRs)
      }
    }

    if (feeData.length > 0) {
      const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
      const postData = feeData.map((feeContent) => {
        let pushData = {
          user_snkey: store.state.uData.snkey,
          fee_snkey: feeContent.snkey,
          date: carFee.date,
          start_day: carFee.date,
          end_day: carFee.date,
          quantity: 1,
          price: feeContent.price,
          note: '(A)',
          create_man: store.state.pData.username + '(' + timeNow + ')',
        }

        if (dayjs(pushData.date).format('DD') >= 26) {
          pushData.date = dayjs(pushData.date).add(1, 'month').format('YYYY-MM-01')
        }

        return pushData
      })

      const response = await api.options(
        `general/addMulti/${store.state.databaseName}/accounting`,
        postData
      )

      if (response?.state == 1) {
        store.showToastMulti({
          type: 'success',
          message: '就診紀錄已新增;[相關費用已新增]',
          closeTime: 3,
        })
      }
    }
  } catch (error) {
    console.error('accountingFeesCheck error:', error)
  }
}

const cloneToMedicalRecordPlan = async (item) => {
  const result = await proxy?.$swal?.({
    title: '是否新增 預約就診紀錄?',
    text: '將根據回診日期建立預約就診紀錄，請再次確認。',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center',
  })

  if (!result?.isConfirmed) return

  try {
    const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const postData = {
      ...item,
      date: '',
      create_man: `${store.state.pData.username}(${timeNow})`,
      edit_man: '',
    }

    delete postData.snkey

    const response = await api.add('medical_record_plan', postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '預約回診記錄 已新增',
        closeTime: 2,
      })
    } else {
      store.showToastMulti({
        type: 'error',
        message: '新增預約回診記錄失敗，請稍後再試',
        closeTime: 3,
      })
    }
  } catch (error) {
    console.error('cloneToMedicalRecordPlan error:', error)
    store.showToastMulti({
      type: 'error',
      message: '新增預約回診記錄失敗，請稍後再試',
      closeTime: 3,
    })
  }
}

const handleAdd = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完整,請再確認',
      closeTime: 3,
    })
    return
  }

  if (!validateForm()) {
    return
  }

  loading.value = true

  const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const postData = {
    datalist: JSON.stringify({
      ...list,
      user_snkey: store.state.uData.snkey,
      createInfo: {
        snkey: store.state.pData.snkey,
        name: store.state.pData.username,
        time: timeNow,
      },
      editInfo: [],
    }),
  }

  try {
    const response = await api.add('medical_record', postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已新增',
        closeTime: 2,
      })
      dialog.value = false
      emit('getMedicalData')

      await accountingFeesCheck()

      if (postData.back_date) {
        await cloneToMedicalRecordPlan(postData)
      }
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

  if (!validateForm()) {
    return
  }

  loading.value = true

  list.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })
  const postData = {
    snkey: list.snkey,
    datalist: JSON.stringify({
      ...list,
    }),
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }

  try {
    const response = await api.post('medical_record', postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已修改',
        closeTime: 2,
      })
      dialog.value = false
      emit('getMedicalData')

      if (accountingCheck.value) {
        await accountingFeesCheck()
      }

      if (postData.back_date) {
        await cloneToMedicalRecordPlan(postData)
      }
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
})

defineExpose({
  openForAdd,
  openForEdit,
})
</script>
