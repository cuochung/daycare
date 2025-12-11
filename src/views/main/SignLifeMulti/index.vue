<template>
  <div class="signlifelistmulti">
    <v-sheet color="primary" class="d-flex align-center justify-space-between px-6 py-4 mb-4" rounded="lg"
      elevation="2">
      <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-table-eye</v-icon>
          </v-avatar>
        <div>
          <h2 class="text-h6 font-weight-bold mb-1 text-white">生命徵象紀錄單(多筆)</h2>
          <p class="text-body-2 mb-0 text-white text-opacity-90">批次記錄多位住民的生命徵象數據</p>
        </div>
      </div>
      <v-chip v-if="editingData" color="white" variant="flat" size="large" prepend-icon="mdi-pencil">
        {{ editingData }}
      </v-chip>
    </v-sheet>

    <v-form ref="formRef">
      <v-card rounded="xl" elevation="2">
        <v-card-title class="d-flex flex-wrap align-center ga-3 pa-4">
        <v-row dense class="flex-nowrap">
          <v-col cols="auto" style="min-width: 200px;">
            <v-text-field type="date" label="評估日期" v-model="nowday" :rules="emptyRules" variant="outlined"
              density="comfortable" prepend-inner-icon="mdi-calendar"></v-text-field>
          </v-col>
          <v-col cols="auto" style="min-width: 180px;">
            <v-text-field type="time" label="評估時間" v-model="nowtime" :rules="emptyRules" variant="outlined"
              density="comfortable" prepend-inner-icon="mdi-clock-outline"></v-text-field>
          </v-col>
        </v-row>
        <v-spacer></v-spacer>
        <div class="d-flex flex-wrap ga-2">
          <v-btn color="primary" variant="flat" prepend-icon="mdi-content-save" @click="saveData">
            存入資料
          </v-btn>
          <v-btn color="success" variant="tonal" prepend-icon="mdi-refresh" @click="emptyData">
            清空資料
          </v-btn>
          <v-btn v-if="isSignlifeSession" color="info" variant="tonal" prepend-icon="mdi-download"
            @click="getSessionData">
            載入暫存資料
          </v-btn>
          <v-btn color="error" variant="tonal" prepend-icon="mdi-delete" @click="delData">
            刪除評估日期所有資料
          </v-btn>
          <v-btn color="warning" variant="tonal" prepend-icon="mdi-check-circle" @click="checkIsAdd(true)">
            判斷指定日期資料狀態
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text class="pa-0">
        <PaginatedIterator :items="paginatedItems" v-model:page="currentPage" v-model:items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions">
          <template #default="{ items }">
            <div class="pt-4">
              <v-table fixed-header class="signlife-table text-no-wrap" height="65vh">
              <thead>
                <tr>
                  <th class="text-left">姓名</th>
                  <th class="text-left">血壓(H)</th>
                  <th class="text-left">血壓(L)</th>
                  <th class="text-left">脈搏</th>
                  <th class="text-left">體溫</th>
                  <th class="text-left">呼吸</th>
                  <th class="text-left">血糖</th>
                  <th class="text-left">血氧濃度</th>
                  <th class="text-left">疼痛指數</th>
                  <th class="text-left">GCS-E</th>
                  <th class="text-left">GCS-V</th>
                  <th class="text-left">GCS-M</th>
                  <th class="text-left">大便次數</th>
                  <th class="text-left">體重</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="item.raw?.u_snkey || index" @click.stop="setEditCol(item)"
                  :class="{ 'active-row': editCol === getItemIndex(item) }">
                  <td class="name-cell font-weight-medium">{{ item.raw?.name }}</td>
                  <td>
                    <span v-if="getItemIndex(item) != editCol">{{ item.raw?.bp_h }}</span>
                    <v-text-field v-model="item.raw.bp_h" v-if="getItemIndex(item) == editCol"
                      :ref="el => setFocusRef(el, 0)" @focus="editRow = 0" @keydown="handleKeyDown" :rules="pb_h_Rules" variant="outlined"
                      density="compact" class="ma-0"></v-text-field>
                  </td>
                  <td>
                    <span v-if="getItemIndex(item) != editCol">{{ item.raw?.bp_l }}</span>
                    <v-text-field v-model="item.raw.bp_l" v-if="getItemIndex(item) == editCol"
                      :ref="el => setFocusRef(el, 1)" @focus="editRow = 1" @keydown="handleKeyDown" :rules="pb_l_Rules" variant="outlined"
                      density="compact" class="ma-0"></v-text-field>
                  </td>
                  <td>
                    <span v-if="getItemIndex(item) != editCol">{{ item.raw?.pulse }}</span>
                    <v-text-field v-model="item.raw.pulse" v-if="getItemIndex(item) == editCol"
                      :ref="el => setFocusRef(el, 2)" @focus="editRow = 2" @keydown="handleKeyDown" :rules="pulse_Rules" variant="outlined"
                      density="compact" class="ma-0"></v-text-field>
                  </td>
                  <td>
                    <span v-if="getItemIndex(item) != editCol">{{ item.raw?.temperature }}</span>
                    <v-text-field v-model="item.raw.temperature" v-if="getItemIndex(item) == editCol"
                      :ref="el => setFocusRef(el, 3)" @focus="editRow = 3" @keydown="handleKeyDown" :rules="temperature_Rules" variant="outlined"
                      density="compact" class="ma-0"></v-text-field>
                  </td>
                  <td>
                    <span v-if="getItemIndex(item) != editCol">{{ item.raw?.breath }}</span>
                    <v-text-field v-model="item.raw.breath" v-if="getItemIndex(item) == editCol"
                      :ref="el => setFocusRef(el, 4)" @focus="editRow = 4" @keydown="handleKeyDown" :rules="breath_Rules" variant="outlined"
                      density="compact" class="ma-0"></v-text-field>
                  </td>
                  <td>
                    <span v-if="getItemIndex(item) != editCol">{{ item.raw?.blood_sugar }}</span>
                    <v-text-field v-model="item.raw.blood_sugar" v-if="getItemIndex(item) == editCol"
                      :ref="el => setFocusRef(el, 5)" @focus="editRow = 5" @keydown="handleKeyDown" variant="outlined" density="compact"
                      class="ma-0"></v-text-field>
                  </td>
                  <td>
                    <span v-if="getItemIndex(item) != editCol">{{ item.raw?.blood_oxygen }}</span>
                    <v-text-field v-model="item.raw.blood_oxygen" v-if="getItemIndex(item) == editCol"
                      :ref="el => setFocusRef(el, 6)" @focus="editRow = 6" @keydown="handleKeyDown" :rules="blood_oxygen_Rules"
                      variant="outlined" density="compact" class="ma-0"></v-text-field>
                  </td>
                  <td>
                    <span v-if="getItemIndex(item) != editCol">{{ item.raw?.pain }}</span>
                    <v-text-field v-model="item.raw.pain" v-if="getItemIndex(item) == editCol"
                      :ref="el => setFocusRef(el, 7)" @focus="editRow = 7" @keydown="handleKeyDown" :rules="pain_Rules" variant="outlined"
                      density="compact" class="ma-0"></v-text-field>
                  </td>
                  <td>
                    <span v-if="getItemIndex(item) != editCol">{{ item.raw?.gcs_e }}</span>
                    <v-text-field v-model="item.raw.gcs_e" v-if="getItemIndex(item) == editCol"
                      :ref="el => setFocusRef(el, 8)" @focus="editRow = 8" @keydown="handleKeyDown" :rules="gcs_e_Rules" variant="outlined"
                      density="compact" class="ma-0"></v-text-field>
                  </td>
                  <td>
                    <span v-if="getItemIndex(item) != editCol">{{ item.raw?.gcs_v }}</span>
                    <v-text-field v-model="item.raw.gcs_v" v-if="getItemIndex(item) == editCol"
                      :ref="el => setFocusRef(el, 9)" @focus="editRow = 9" @keydown="handleKeyDown" :rules="gcs_v_Rules" variant="outlined"
                      density="compact" class="ma-0"></v-text-field>
                  </td>
                  <td>
                    <span v-if="getItemIndex(item) != editCol">{{ item.raw?.gcs_m }}</span>
                    <v-text-field v-model="item.raw.gcs_m" v-if="getItemIndex(item) == editCol"
                      :ref="el => setFocusRef(el, 10)" @focus="editRow = 10" @keydown="handleKeyDown" :rules="gcs_m_Rules" variant="outlined"
                      density="compact" class="ma-0"></v-text-field>
                  </td>
                  <td>
                    <span v-if="getItemIndex(item) != editCol">{{ item.raw?.stool }}</span>
                    <v-text-field v-model="item.raw.stool" v-if="getItemIndex(item) == editCol"
                      :ref="el => setFocusRef(el, 11)" @focus="editRow = 11" @keydown="handleKeyDown" :rules="twoLength_Rules" variant="outlined"
                      density="compact" class="ma-0"></v-text-field>
                  </td>
                  <td>
                    <span v-if="getItemIndex(item) != editCol">{{ item.raw?.weight }}</span>
                    <v-text-field v-model="item.raw.weight" v-if="getItemIndex(item) == editCol"
                      :ref="el => setFocusRef(el, 12)" @focus="editRow = 12" @keydown="handleKeyDown" variant="outlined" density="compact"
                      class="ma-0"></v-text-field>
                  </td>
                </tr>
              </tbody>
            </v-table>
            </div>
          </template>
        </PaginatedIterator>
      </v-card-text>
    </v-card>
    </v-form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'
import PaginatedIterator from '@/components/PaginatedIterator.vue'

const store = useStore()
const { proxy } = getCurrentInstance()

// 響應式數據
const isSignlifeSession = ref(false)
const useritems = ref([])
const serachKey = ref('')
const tempData = ref([])
const feeItems = ref([])
const nowday = ref(dayjs().format('YYYY-MM-DD'))
const nowtime = ref(dayjs().format('HH:mm:ss'))
const editCol = ref(0)
const editRow = ref(0)
const formRef = ref(null)
const focuspoint = ref([])

// 分頁相關
const currentPage = ref(1)
const itemsPerPage = ref(10)
const itemsPerPageOptions = [
  { value: 10, title: '10' },
  { value: 20, title: '20' },
  { value: 30, title: '30' },
]

// 驗證規則
const emptyRules = [(v) => !!v || '不可空白']
const pb_h_Rules = [
  (v) => v == '' || (v.length < 4 && !v.includes('.')) || '數值不合法',
]
const pb_l_Rules = [(v) => v == '' || (v > 0 && v < 150) || '數值不合法']
const pulse_Rules = [
  (v) => v == '' || (v.length < 4 && !v.includes('.')) || '數值不合法',
]
const temperature_Rules = [
  (v) =>
    v == '' ||
    (v <= 42 && v.length <= 4 && !v.includes('..')) ||
    '數值不合法',
]
const breath_Rules = [
  (v) => v == '' || (v <= 40 && !v.includes('.')) || '數值不合法',
]
const blood_oxygen_Rules = [
  (v) => v == '' || (v <= 100 && !v.includes('.')) || '數值不合法',
]
const pain_Rules = [
  (v) => v == '' || (v <= 10 && !(v % 2)) || '只接受2,4,6,8,10',
]
const gcs_e_Rules = [(v) => v == '' || (v >= 1 && v <= 4) || '只接受1-4']
const gcs_v_Rules = [
  (v) =>
    v == '' ||
    (v >= 1 && v <= 5) ||
    v == 'T' ||
    v == 'A' ||
    v == 'E' ||
    '只接受1-5,A,T,E',
]
const gcs_m_Rules = [(v) => v == '' || (v >= 1 && v <= 6) || '只接受1-6']
const twoLength_Rules = [(v) => v == '' || v.length <= 2 || '數值不合法']

// 計算屬性
const paginatedItems = computed(() => {
  return tempData.value
})

const editingData = computed(() => {
  if (tempData.value.length > 0 && tempData.value[editCol.value]) {
    return `${tempData.value[editCol.value].name}`
  }
  return ''
})

// 方法
const getItemIndex = (item) => {
  const index = tempData.value.findIndex(t => t.u_snkey === item.raw?.u_snkey)
  return index
}

const setEditCol = (item) => {
  const index = tempData.value.findIndex(t => t.u_snkey === item.raw?.u_snkey)
  if (index !== -1) {
    editCol.value = index
  }
}

const setFocusRef = (el, rowIndex) => {
  if (el) {
    focuspoint.value[rowIndex] = el
  }
}

const setfocus = () => {
  nextTick(() => {
    if (focuspoint.value[editRow.value]?.focus) {
      focuspoint.value[editRow.value].focus()
    }
  })
}

const handleKeyDown = (event) => {
  // 處理方向鍵
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    event.stopPropagation()
    console.log('🔺 [鍵盤] 按下「上鍵」→ 移動到上一筆資料')
    changeCol('--')
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    event.stopPropagation()
    console.log('🔻 [鍵盤] 按下「下鍵」→ 移動到下一筆資料')
    changeCol('++')
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    event.stopPropagation()
    console.log('◀️ [鍵盤] 按下「左鍵」→ 移動到上一個輸入框')
    changeRow('--')
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    event.stopPropagation()
    console.log('▶️ [鍵盤] 按下「右鍵」→ 移動到下一個輸入框')
    changeRow('++')
  }
}

const changeCol = async (val) => {
  if (formRef.value) {
    try {
      const { valid } = await formRef.value.validate()
      console.log(`🔍 [changeCol] 驗證結果: ${valid}`)
      if (!valid) {
        console.log('❌ [驗證] 表單驗證失敗，無法移動')
        return
      }
    } catch (error) {
      console.log('⚠️ [changeCol] 驗證過程發生錯誤，允許移動:', error)
    }
  }
  
  if (val == '--') {
    console.log('🔺 [changeCol] 執行 editCol--')
    editCol.value--
  } else {
    console.log('🔻 [changeCol] 執行 editCol++')
    editCol.value++
  }
}

const changeRow = async (val) => {
  if (formRef.value) {
    try {
      const { valid } = await formRef.value.validate()
      console.log(`🔍 [changeRow] 驗證結果: ${valid}`)
      if (!valid) {
        console.log('❌ [驗證] 表單驗證失敗，無法移動')
        return
      }
    } catch (error) {
      console.log('⚠️ [changeRow] 驗證過程發生錯誤，允許移動:', error)
    }
  }
  
  if (val == '--') {
    console.log('◀️ [changeRow] 執行 editRow--')
    editRow.value--
  } else {
    console.log('▶️ [changeRow] 執行 editRow++')
    editRow.value++
  }
}

const importExcelDatas = (datas) => {
  console.log('importExcelDatas', datas)

  datas.forEach(excelData => {
    const matchedItem = tempData.value.find(item =>
      item.bed_name.includes(excelData['房號']) &&
      item.name.includes(excelData['姓名'])
    )

    if (matchedItem) {
      matchedItem.bp_l = excelData['數值1']
      matchedItem.bp_h = excelData['數值2']
      matchedItem.pulse = excelData['數值3']
      matchedItem.temperature = excelData['數值4']
      matchedItem.breath = excelData['數值5']
    }
  })
}

const getSessionData = () => {
  const sessionData = sessionStorage.getItem('signlifts')
  if (sessionData) {
    tempData.value = JSON.parse(sessionData)
  }
}

const emptyData = async () => {
  const result = await proxy?.$swal?.({
    title: '確認清空資料？',
    text: '此操作將清空所有已輸入的資料',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center'
  })

  if (result?.isConfirmed) {
    getAllData()
  }
}

const checkIsAdd = async (checkAll = false) => {
  let checkDatas = tempData.value.filter((item) => {
    delete item.isAddInfo

    const strLen =
      JSON.stringify(Object.values(item)).length -
      // item.bed_name.length -
      item.name.length -
      item.u_snkey.length
    return strLen > 58
  })

  if (checkAll) {
    checkDatas = tempData.value
  }

  const searhKey = {
    key: "date='" + nowday.value + "'",
  }

  const url = `general/searchByWhere/${store.state.databaseName}/signlife`

  try {
    const newDatas = await api.options(url, searhKey)
    console.log('general/searchByWhere', newDatas.length)
    let addProcessExisterror = false

    checkDatas.forEach((i) => {
      const match = newDatas.find((newData) => newData.u_snkey == i.u_snkey)
      if (match) {
        i.isAddInfo = { state: true }
      } else {
        i.isAddInfo = { state: false }
        addProcessExisterror = true
      }
    })

    if (addProcessExisterror && !checkAll) {
      store.showToastMulti({
        type: 'error',
        message: '新增資料過程有誤,部分資料未建立,請重新建構 [資料未建立] 的資料!!',
        closeTime: 5,
      })
    }
  } catch (error) {
    console.error('checkIsAdd error:', error)
  }
}

const getFee = async () => {
  try {
    const rs = await api.get('fee')
    feeItems.value = rs
  } catch (error) {
    console.error('getFee error:', error)
  }
}

const getAllData = async () => {
  try {
    const rs = await api.get('user')

    const userItems = rs.map((i) => ({
      ...JSON.parse(i.datalist),
      snkey: i.snkey
    }))
      // .filter((i) => !!i.bed_name)
      // .sort(function (a, b) {
      //   const aBed = a.bed_name
      //   const bBed = b.bed_name

      //   if (aBed === bBed) {
      //     return 0
      //   } else if (aBed === null) {
      //     return 1
      //   } else if (bBed === null) {
      //     return -1
      //   } else {
      //     return aBed > bBed ? 1 : -1
      //   }
      // })

    tempData.value = userItems.map((item) => {
      return {
        snkey: '',
        u_snkey: item.snkey,
        name: item.name,
        // bed_name: item.bed_name,
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
        createInfo: {},
        editInfo: [],
      }
    })
  } catch (error) {
    console.error('getAllData error:', error)
  }
}

const saveData = async () => {
  if (nowday.value.length == 0) {
    store.showToastMulti({
      type: 'warning',
      message: '評估日期不可為空白!!',
      closeTime: 3,
    })
    return false
  }

  if (nowtime.value.length == 0) {
    store.showToastMulti({
      type: 'warning',
      message: '評估時間不可為空白!!',
      closeTime: 3,
    })
    return false
  }

  // 存檔前加入session裡
  sessionStorage.setItem('signlifts', JSON.stringify(tempData.value))
  isSignlifeSession.value = true

  // 存入資料
  const result = await proxy?.$swal?.({
    title: '確認存入資料？',
    text: '確認要將資料存入系統嗎？',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center'
  })

  if (!result?.isConfirmed) {
    return
  }

  const timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss')
  
  // 取出有資料的 matchData
  let matchData = tempData.value.filter((item) => {
    delete item.isAddInfo

    const strLen =
      JSON.stringify(Object.values(item)).length -
      (item.bed_name?.length || 0) -
      item.name.length -
      item.u_snkey.length
    return strLen > 58
  })

  // 建構 postData，符合 test.json 的結構
  let postData = JSON.parse(JSON.stringify(matchData))

  postData = postData.map((item) => {
    // 基本欄位
    item['snkey'] = ''
    item['date'] = nowday.value
    item['time'] = nowtime.value
    
    // 建立 createInfo 物件
    item['createInfo'] = {
      snkey: store.state.pData.snkey,
      name: store.state.pData.username,
      time: timeNow
    }
    
    // 建立 editInfo 陣列（空陣列）
    item['editInfo'] = []
    
    // 刪除不需要的欄位
    delete item.name
    delete item.bed_name
    delete item.isAddInfo
    
    return {
      datalist: JSON.stringify(item),
    }
  })

  if (postData.length != 0) {
    try {
      const rs = await api.options(
        `general/addMulti/${store.state.databaseName}/signlife`,
        postData
      )
      console.log('general/addMulti/', rs)
      const matchErr = rs.filter((i) => !i.state)
      console.log(matchErr)

      if (matchErr.length) {
        store.showToastMulti({
          type: 'error',
          message: '紀錄過程有誤,請再確認',
          closeTime: 5,
        })
      } else {
        store.showToastMulti({
          type: 'success',
          message: '已新增',
          closeTime: 2,
        })
        checkIsAdd()
        checkBloodSugar(postData)
      }
    } catch (error) {
      console.error('saveData error:', error)
      store.showToastMulti({
        type: 'error',
        message: '儲存失敗，請稍後再試',
        closeTime: 3,
      })
    }
  } else {
    store.showToastMulti({
      type: 'warning',
      message: '未輸入任何資料!!請重新確認!!',
      closeTime: 3,
    })
  }
}

const checkBloodSugar = async (postData) => {
  const feeData = feeItems.value.find((i) => {
    return i.name.includes('驗血糖/次')
  })

  if (!feeData) {
    store.showToastMulti({
      type: 'warning',
      message: '未建立[驗血糖/次]的會計項目,請通知會計或系統工程師!!',
      closeTime: 5,
    })
    return false
  }

  const matchData = postData.filter((i) => {
    return !!i.blood_sugar
  })

  if (matchData.length > 0) {
    let accountingData = []
    matchData.forEach((i) => {
      accountingData.push({
        user_snkey: i.u_snkey,
        fee_snkey: feeData.snkey,
        date: nowday.value,
        start_day: nowday.value,
        end_day: nowday.value,
        quantity: 1,
        price: feeData.price,
        note: '(A)Multi',
        create_man:
          store.state.pData.username +
          '(' +
          dayjs().format('YYYY-MM-DD HH:mm:ss') +
          ')',
      })
    })

    // 判斷日期是否超過26日
    accountingData = accountingData.filter((i) => {
      if (dayjs(i.date).format('DD') >= 26) {
        i.note =
          i.date +
          '調整為' +
          dayjs(i.date).add(1, 'month').format('YYYY-MM-01') +
          i.note
        i.date = dayjs(i.date).add(1, 'month').format('YYYY-MM-01')
      }
      return i
    })

    try {
      const rs = await api.options(
        `general/addMulti/${store.state.databaseName}/accounting`,
        accountingData
      )
      console.log('checkBloodSugar,general/addMulti/', rs)
      const matchErr = rs.filter((i) => !i.state)
      console.log(matchErr)

      if (!matchErr.length) {
        store.showToastMulti({
          type: 'success',
          message: '紀錄已新增 ; 會計費用[驗血糖/次]已新增',
          closeTime: 3,
        })
      }
    } catch (error) {
      console.error('checkBloodSugar error:', error)
    }
  }
}

const delData = async () => {
  if (nowday.value.length == 0) {
    store.showToastMulti({
      type: 'warning',
      message: '評估日期不可為空白!!',
      closeTime: 3,
    })
    return false
  }

  const result = await proxy?.$swal?.({
    title: '確認刪除指定評估日期的所有資料？',
    text: '此操作無法復原',
    icon: 'warning',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center'
  })

  if (!result?.isConfirmed) {
    return
  }

  const delData = {
    date: nowday.value,
    info: `${store.state.pData.username}(${dayjs().format(
      'YYYY-MM-DD HH:ss:mm'
    )})(${nowday.value})`,
  }

  try {
    const rs = await api.options(
      `signlife/delMultiv2/${store.state.databaseName}/signlife`,
      delData
    )

    if (rs.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已刪除',
        closeTime: 2,
      })
      checkIsAdd(true)
    } else if (rs.state == 'nomatch') {
      store.showToastMulti({
        type: 'warning',
        message: '無符合的日期!!',
        closeTime: 3,
      })
    }
  } catch (error) {
    console.error('delData error:', error)
    store.showToastMulti({
      type: 'error',
      message: '刪除失敗，請稍後再試',
      closeTime: 3,
    })
  }
}

// 監聽器
watch(editCol, () => {
  console.log(`📊 [watch editCol] 當前值: ${editCol.value}`)
  if (editCol.value < 0) {
    console.log('⚠️ [watch editCol] editCol < 0，設為 0')
    editCol.value = 0
  }
  if (editCol.value > tempData.value.length - 1) {
    console.log(`⚠️ [watch editCol] editCol > ${tempData.value.length - 1}，設為 ${tempData.value.length - 1}`)
    editCol.value = tempData.value.length - 1
  }
  setfocus()
})

watch(editRow, () => {
  console.log(`📊 [watch editRow] 當前值: ${editRow.value}`)
  if (editRow.value < 0) {
    console.log('⚠️ [watch editRow] editRow < 0，執行 editCol-- 且 editRow = 12')
    editCol.value--
    editRow.value = 12
  }

  if (editRow.value > 12) {
    console.log('⚠️ [watch editRow] editRow > 12，執行 editCol++ 且 editRow = 0')
    editCol.value++
    editRow.value = 0
  }

  setfocus()
})

// 生命週期
onMounted(async () => {
  await getAllData()
  await getFee()

  // 判斷signlifes session是否存在
  isSignlifeSession.value = sessionStorage.getItem('signlifts') ? true : false
})
</script>

<style lang="scss">
.signlifelistmulti {
  .signlife-table {
    thead {
      th {
        font-size: 0.95rem;
        font-family: '微軟正黑體', 'Microsoft JhengHei', sans-serif;
        font-weight: 600;
        background-color: rgba(var(--v-theme-primary), 0.08);
        color: rgba(var(--v-theme-on-surface), 0.87);
        padding: 12px 16px;
        border-bottom: 2px solid rgba(var(--v-theme-primary), 0.2);
        white-space: nowrap;
      }
    }

    tbody {
      td {
        font-size: 0.9rem;
        padding: 10px 16px;
        border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
        vertical-align: middle;
      }

      tr {
        transition: background-color 0.2s ease;
        
        &:hover {
          background-color: rgba(var(--v-theme-primary), 0.04);
        }

        &.active-row {
          background-color: rgba(var(--v-theme-primary), 0.1);
          border-left: 3px solid rgb(var(--v-theme-primary));
        }
      }

      .name-cell {
        font-weight: 500;
        color: rgba(var(--v-theme-on-surface), 0.9);
        min-width: 120px;
      }

      .v-text-field {
        min-width: 80px;
        margin: 4px 0;
        
        :deep(.v-field) {
          font-size: 0.9rem;
        }
        
        :deep(.v-field__input) {
          padding: 8px 12px;
        }
      }
      
      td {
        padding: 8px 16px !important;
        
        .v-text-field {
          margin: 0;
        }
      }
    }
  }
}
</style>
