<template>
  <div class="medicine-print" @click="onCellClick">
    <div>
      <!-- 上半月 -->
      <div
        v-for="(page, i) in Math.ceil(filterUpMedicine().length / perPageItemsPrintSet)"
        :key="'page1' + i"
      >
        <v-table class="medicine-print__table" density="compact">
          <thead>
            <tr>
              <th :colspan="upMonth + 2" style="border: 1px solid #000;">
                <h3>{{ cData.company_name }}</h3>
                <div class="text-center">
                  <h1>
                    <strong>{{ printMonth }} 月 給藥紀錄單</strong>
                  </h1>
                </div>
              </th>
            </tr>
          </thead>

          <tbody v-for="(list, index) in printPageSet(page, 'up')" :key="index">
            <tr v-if="printTitle(index)">
              <th :colspan="upMonth + 2" class="medicine-print__user-msg" style="border: 1px solid #000;">
                <v-row>
                  <v-col cols="3" class="py-0">姓名: {{ uData.name }}</v-col>
                  <v-col cols="3" class="py-0">病歷號: {{ uData.p_code }}</v-col>
                  <v-col cols="3" class="py-0">床號: {{ uData.bed_name }}</v-col>
                  <v-col cols="3" class="text-right py-0">
                    第{{ Math.ceil(index / perPageItemsPrintSet) + 1 }}頁 /
                    共{{ Math.ceil(filterUpMedicine().length / perPageItemsPrintSet) }}頁 /
                    共{{ filterUpMedicine().length }}筆
                  </v-col>
                  <v-col cols="12" class="py-0">藥物過敏: {{ uData.allergyhistory2 }}</v-col>
                </v-row>
              </th>
            </tr>

            <tr class="text-center" v-if="printTitle(index)">
              <th style="border: 1px solid #000; width: 20%;" class="align-middle">藥名及用藥資訊</th>
              <th style="border: 1px solid #000;" class="align-middle">日期</th>
              <th style="border: 1px solid #000;" v-for="dayIndex in upMonth" :key="dayIndex">
                {{ dayIndex }}
                <br />
                {{ showWeek(dayIndex) }}
              </th>
            </tr>

            <tr v-if="reprint(index, printPageSet(page, 'up'))" class="medicine-print__medicine-name">
              <td style="border: 1px solid #000;" :colspan="upMonth + 2">
                <strong
                  >【{{ list.medical.hospital_name }}-{{ list.medical.branch_name }}
                  醫師:{{ list.medical.doctor_name }}】</strong
                >
              </td>
            </tr>

            <tr>
              <td style="border: 1px solid #000;">
                <v-row>
                  <v-col cols="6" class="medicine-print__medicine-name py-0 my-0"
                    >{{ list.name }} {{ checkRepeat(list) }}</v-col
                  >
                  <v-col cols="6" class="text-right py-0 my-0 medicine-print__medicine-detail"
                    >{{ list.dosage }}</v-col
                  >
                  <v-col cols="2" class="py-0 my-0 medicine-print__medicine-detail"
                    >{{ list.eat_medicine_time.name }}
                  </v-col>
                  <v-col cols="10" class="text-right py-0 my-0 medicine-print__medicine-detail"
                    >{{ list.method_name }} / {{ list.quantity }} {{ list.unit_name }} /
                    {{ returnEatMedicineTime(list) }}</v-col
                  >
                  <v-col cols="12" class="py-0 my-0 medicine-print__medicine-detail"
                    >用藥期間:{{ list.start_date }}~{{ list.end_date }}</v-col
                  >
                </v-row>
              </td>

              <td class="text-center" style="border: 1px solid #000;">
                <div class="text-center" style="margin-bottom: 1px;">早</div>
                <div class="text-center" style="margin-bottom: 1px;">中</div>
                <div class="text-center" style="margin-bottom: 1px;">晚</div>
                <div class="text-center">睡前</div>
              </td>

              <td
                style="border: 1px solid #000;"
                v-html="checkMediceTime(dayIndex, list)"
                v-for="dayIndex in upMonth"
                :key="dayIndex"
              ></td>
            </tr>
          </tbody>

          <tbody class="medicine-print__footer" v-if="printPageSet(page, 'up').length > 0">
            <tr v-for="emptyIndex in perPageItemsPrintSet - printPageSet(page, 'up').length" :key="emptyIndex">
              <td style="border: 1px solid #000;"></td>
              <td style="border: 1px solid #000;">
                <div class="text-center" style="margin-bottom: 1px;">早</div>
                <div class="text-center" style="margin-bottom: 1px;">中</div>
                <div class="text-center" style="margin-bottom: 1px;">晚</div>
                <div class="text-center">睡前</div>
              </td>
              <td style="border: 1px solid #000;" v-for="dayIndex in upMonth" :key="dayIndex"></td>
            </tr>

            <tr>
              <td rowspan="4" style="border: 1px solid #000;">
                <v-row class="medicine-print__medicine-name">
                  <v-col cols="8">
                    禁食 N 檢查E
                    <br />手術 OP 拒絕X
                    <br />外出 O 睡眠S
                    <br />暫停 * 住院A
                  </v-col>
                  <v-col cols="4" class="text-right">
                    簽
                    <br />
                    <br />
                    <br />名
                  </v-col>
                </v-row>
                <br />
              </td>
              <td style="border: 1px solid #000;" class="text-center align-middle">早</td>
              <td v-for="dayIndex in upMonth" :key="dayIndex" style="border: 1px solid #000;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #000;" class="text-center align-middle">中</td>
              <td v-for="dayIndex in upMonth" :key="dayIndex" style="border: 1px solid #000;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #000;" class="text-center align-middle">晚</td>
              <td v-for="dayIndex in upMonth" :key="dayIndex" style="border: 1px solid #000;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #000;" class="text-center align-middle">睡前</td>
              <td v-for="dayIndex in upMonth" :key="dayIndex" style="border: 1px solid #000;"></td>
            </tr>
          </tbody>
        </v-table>

        <p style="page-break-after: always"></p>
      </div>

      <!-- 下半月 -->
      <div
        v-for="(page, i) in Math.ceil(filterDownMedicine().length / perPageItemsPrintSet)"
        :key="'page2' + i"
      >
        <v-table class="medicine-print__table" density="compact">
          <thead>
            <tr>
              <th :colspan="downMonth + 2" style="border: 1px solid #000;">
                <h3>{{ cData.company_name }}</h3>
                <div class="text-center">
                  <h1>
                    <strong>{{ printMonth }} 月 給藥紀錄單</strong>
                  </h1>
                </div>
              </th>
            </tr>
          </thead>

          <tbody v-for="(list, index) in printPageSet(page, 'down')" :key="index">
            <tr v-if="printTitle(index)">
              <th :colspan="downMonth + 2" class="medicine-print__user-msg" style="border: 1px solid #000;">
                <v-row>
                  <v-col cols="3" class="py-0">姓名: {{ uData.name }}</v-col>
                  <v-col cols="3" class="py-0">病歷號: {{ uData.p_code }}</v-col>
                  <v-col cols="3" class="py-0">床號: {{ uData.bed_name }}</v-col>
                  <v-col cols="3" class="text-right py-0">
                    第{{ Math.ceil(index / perPageItemsPrintSet) + 1 }}頁 /
                    共{{ Math.ceil(filterDownMedicine().length / perPageItemsPrintSet) }}頁 /
                    共{{ filterDownMedicine().length }}筆
                  </v-col>
                  <v-col cols="12" class="py-0">藥物過敏: {{ uData.allergyhistory2 }}</v-col>
                </v-row>
              </th>
            </tr>

            <tr class="text-center" v-if="printTitle(index)">
              <th style="border: 1px solid #000; width: 20%;" class="align-middle">藥名及用藥資訊</th>
              <th style="border: 1px solid #000;" class="align-middle">日期</th>
              <th style="border: 1px solid #000;" v-for="dayIndex in downMonth" :key="dayIndex">
                {{ dayIndex + 15 }}
                <br />
                {{ showWeek(dayIndex + 15) }}
              </th>
            </tr>

            <tr v-if="reprint(index, printPageSet(page, 'down'))" class="medicine-print__medicine-name">
              <td style="border: 1px solid #000;" :colspan="downMonth + 2">
                <strong
                  >【{{ list.medical.hospital_name }}-{{ list.medical.branch_name }}
                  醫師:{{ list.medical.doctor_name }}】</strong
                >
              </td>
            </tr>

            <tr>
              <td style="border: 1px solid #000;">
                <v-row>
                  <v-col cols="6" class="medicine-print__medicine-name py-0 my-0"
                    >{{ list.name }} {{ checkRepeat(list) }}</v-col
                  >
                  <v-col cols="6" class="text-right py-0 my-0 medicine-print__medicine-detail"
                    >{{ list.dosage }}</v-col
                  >
                  <v-col cols="2" class="py-0 my-0 medicine-print__medicine-detail"
                    >{{ list.eat_medicine_time.name }}
                  </v-col>
                  <v-col cols="10" class="text-right py-0 my-0 medicine-print__medicine-detail"
                    >{{ list.method_name }} / {{ list.quantity }} {{ list.unit_name }} /
                    {{ returnEatMedicineTime(list) }}</v-col
                  >
                  <v-col cols="12" class="py-0 my-0 medicine-print__medicine-detail"
                    >用藥期間:{{ list.start_date }}~{{ list.end_date }}</v-col
                  >
                </v-row>
              </td>

              <td class="text-center" style="border: 1px solid #000;">
                <div class="text-center" style="margin-bottom: 1px;">早</div>
                <div class="text-center" style="margin-bottom: 1px;">中</div>
                <div class="text-center" style="margin-bottom: 1px;">晚</div>
                <div class="text-center">睡前</div>
              </td>

              <td
                style="border: 1px solid #000;"
                v-html="checkMediceTime(dayIndex + 15, list)"
                v-for="dayIndex in downMonth"
                :key="dayIndex"
              ></td>
            </tr>
          </tbody>

          <tbody class="medicine-print__footer" v-if="printPageSet(page, 'down').length > 0">
            <tr
              v-for="emptyIndex in perPageItemsPrintSet - printPageSet(page, 'down').length"
              :key="emptyIndex"
            >
              <td style="border: 1px solid #000;"></td>
              <td style="border: 1px solid #000;">
                <div class="text-center" style="margin-bottom: 1px;">早</div>
                <div class="text-center" style="margin-bottom: 1px;">中</div>
                <div class="text-center" style="margin-bottom: 1px;">晚</div>
                <div class="text-center">睡前</div>
              </td>
              <td style="border: 1px solid #000;" v-for="dayIndex in downMonth" :key="dayIndex"></td>
            </tr>

            <tr>
              <td rowspan="4" style="border: 1px solid #000;">
                <v-row class="medicine-print__medicine-name">
                  <v-col cols="8">
                    禁食 N 檢查E
                    <br />手術 OP 拒絕X
                    <br />外出 O 睡眠S
                    <br />暫停 * 住院A
                  </v-col>
                  <v-col cols="4" class="text-right">
                    簽
                    <br />
                    <br />
                    <br />名
                  </v-col>
                </v-row>
                <br />
              </td>
              <td style="border: 1px solid #000; height: 30px" class="text-center align-middle">早</td>
              <td v-for="dayIndex in downMonth" :key="dayIndex" style="border: 1px solid #000;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; height: 30px" class="text-center align-middle">中</td>
              <td v-for="dayIndex in downMonth" :key="dayIndex" style="border: 1px solid #000;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; height: 30px" class="text-center align-middle">晚</td>
              <td v-for="dayIndex in downMonth" :key="dayIndex" style="border: 1px solid #000;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; height: 30px" class="text-center align-middle">睡前</td>
              <td v-for="dayIndex in downMonth" :key="dayIndex" style="border: 1px solid #000;"></td>
            </tr>
          </tbody>
        </v-table>

        <p style="page-break-after: always"></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/zh-tw'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

dayjs.extend(isBetween)
dayjs.locale('zh-tw')

const store = useStore()
const { proxy } = getCurrentInstance()

const cData = ref({})
const pData = ref({})
const uData = ref({})
const items = ref([])
const printMonth = ref('')
const lastDay = ref('')
const upMonth = ref(15)
const downMonth = computed(() => parseInt(lastDay.value, 10) - 15)
const perPageItemsPrintSet = ref(10)
const givenMap = reactive({})
const givenMapWithNames = reactive({})
const loadingGivenStatus = ref(false)
const isShowName = ref(false)

const styles = {
  timeCell: 'border:1px #000000 solid;margin-bottom:1px;cursor:pointer;',
  timeCellLast: 'border:1px #000000 solid;cursor:pointer;',
  checkmark: 'margin-left:3px;color:blue;font-weight:bold;',
  operatorName: 'font-size:1;color:#666;',
}

const returnEatMedicineTime = (list) => {
  if (list.eat_medicine_time.repeatWeek && list.eat_medicine_time.repeatWeek.length > 0) {
    return '每週:' + list.eat_medicine_time.repeatWeek
  } else if (list.eat_medicine_time.repeatDate && list.eat_medicine_time.repeatDate.length > 0) {
    return '每月:' + list.eat_medicine_time.repeatDate
  } else {
    return list.eat_medicine_time.day + ' 天'
  }
}

const makeKey = (list, dateStr, timeStr) => {
  const medKey = list.medical_snkey || list.medicine_snkey || ''
  return `${uData.value.p_code}|${medKey}|${dateStr}|${timeStr}`
}

const loadGivenStatus = async () => {
  try {
    loadingGivenStatus.value = true

    const searchKey = {
      key: `p_code='${uData.value.p_code}' AND print_month='${printMonth.value}'`,
    }
    const url = `general/searchByWhere/${store.state.databaseName}/medicine_given_status`

    const filteredData = await api.options(url, searchKey)

    Object.keys(givenMap).forEach(key => delete givenMap[key])
    Object.keys(givenMapWithNames).forEach(key => delete givenMapWithNames[key])

    filteredData.forEach((item) => {
      const key = `${item.p_code}|${item.medical_key}|${item.date}|${item.time}`
      givenMap[key] = item.is_given === 1 || item.is_given === true || item.is_given === '1'
      givenMapWithNames[key] = {
        is_given: item.is_given === 1 || item.is_given === true || item.is_given === '1',
        lastEditMan: item.lastEditMan || '',
      }
    })
  } catch (error) {
    console.error('載入給藥狀態失敗:', error)
    Object.keys(givenMap).forEach(key => delete givenMap[key])
    store.showToastMulti({
      type: 'error',
      message: '載入給藥狀態失敗，請重新整理頁面',
      closeTime: 3,
    })
  } finally {
    loadingGivenStatus.value = false
  }
}

const isGiven = (key) => {
  const value = givenMap[key]
  return value === 1 || value === true || value === '1'
}

const setGiven = async (key, val) => {
  try {
    loadingGivenStatus.value = true

    const [p_code, medical_key, date, time] = key.split('|')

    const apiData = {
      p_code: p_code,
      medical_key: medical_key,
      date: date,
      time: time,
      print_month: printMonth.value,
      is_given: val ? 1 : 0,
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      lastEditMan: pData.value.username,
    }

    const existingRecord = await findExistingRecord(p_code, medical_key, date, time)

    let result
    if (existingRecord) {
      const delData = {
        snkey: existingRecord.snkey,
        tablename: 'medicine_given_status',
        info: JSON.stringify(existingRecord),
      }
      result = await api.delete('medicine_given_status', delData)
    } else {
      result = await api.add('medicine_given_status', apiData)
    }

    if (result && (result.code === 200 || result.state === true || result.state == 1)) {
      await loadGivenStatus()
    } else {
      throw new Error(`API 回應失敗: ${JSON.stringify(result)}`)
    }
  } catch (error) {
    console.error('儲存給藥狀態失敗:', error)
    throw error
  } finally {
    loadingGivenStatus.value = false
  }
}

const findExistingRecord = async (p_code, medical_key, date, time) => {
  try {
    const response = await api.get('medicine_given_status')
    const found = response.find(
      (item) =>
        item.p_code === p_code &&
        item.medical_key === medical_key &&
        item.date === date &&
        item.time === time
    )
    return found || null
  } catch (error) {
    console.error('查找現有記錄失敗:', error)
    return null
  }
}

const toggleShowName = () => {
  isShowName.value = !isShowName.value
}

const generateTimeCellHtml = (key, time, isLast = false) => {
  const bg = isGiven(key) ? 'background-color:#c6f6d5;' : ''
  const checkmark = isGiven(key) ? `<span style="${styles.checkmark}">✓</span>` : ''

  const operatorName =
    isGiven(key) && isShowName.value && givenMapWithNames[key] && givenMapWithNames[key].lastEditMan
      ? `<br><small style="${styles.operatorName}">${givenMapWithNames[key].lastEditMan}</small>`
      : ''

  const cellStyle = isLast ? styles.timeCellLast : styles.timeCell

  return `<div data-key="${key}" style="${cellStyle}${bg}" class="text-center">${time}${checkmark}${operatorName}</div>`
}

const onCellClick = (e) => {
  if (loadingGivenStatus.value) return

  const el = e.target.closest('[data-key]')
  if (!el) return
  const key = el.getAttribute('data-key')
  if (!key) return

  const currentStatus = isGiven(key)
  const newStatus = !currentStatus

  givenMap[key] = newStatus
  if (newStatus) {
    el.style.backgroundColor = '#c6f6d5'
  } else {
    el.style.backgroundColor = ''
  }

  setGiven(key, newStatus).catch((error) => {
    console.error('API 失敗，回滾狀態:', error)
    givenMap[key] = currentStatus
    if (currentStatus) {
      el.style.backgroundColor = '#c6f6d5'
    } else {
      el.style.backgroundColor = ''
    }
    store.showToastMulti({
      type: 'error',
      message: '儲存給藥狀態失敗，請重試',
      closeTime: 3,
    })
  })
}

const checkRepeat = (list) => {
  const matchData = items.value.filter((i) => {
    return i.medical_snkey != list.medical_snkey && i.medicine_snkey == list.medicine_snkey
  })

  if (matchData.length > 0) {
    if (list.start_date < matchData[0].end_date && matchData[0].start_date < list.end_date) {
      return '[*]'
    }
  }
  return ''
}

const printPageSet = (page, helf) => {
  const pageData = helf === 'up' ? filterUpMedicine() : filterDownMedicine()

  return pageData.filter((i, index) => {
    if (index >= (page - 1) * perPageItemsPrintSet.value && index < page * perPageItemsPrintSet.value) {
      return i
    }
  })
}

const sortByHospitalBranchDoctor = (matchs) => {
  return matchs.sort((a, b) => {
    const medicalA = a.medical || {}
    const medicalB = b.medical || {}

    const hospitalA = medicalA.hospital_snkey || medicalA.hospital_name || ''
    const hospitalB = medicalB.hospital_snkey || medicalB.hospital_name || ''
    if (hospitalA !== hospitalB) {
      return hospitalA > hospitalB ? 1 : -1
    }

    const branchA = medicalA.branch_snkey || medicalA.branch_name || ''
    const branchB = medicalB.branch_snkey || medicalB.branch_name || ''
    if (branchA !== branchB) {
      return branchA > branchB ? 1 : -1
    }

    const doctorA = medicalA.doctor_name || ''
    const doctorB = medicalB.doctor_name || ''
    if (doctorA !== doctorB) {
      return doctorA > doctorB ? 1 : -1
    }

    const snkeyA = a.snkey || a.medical_snkey || a.medicine_snkey || medicalA.snkey || 0
    const snkeyB = b.snkey || b.medical_snkey || b.medicine_snkey || medicalB.snkey || 0
    const numA = parseInt(snkeyA, 10) || 0
    const numB = parseInt(snkeyB, 10) || 0
    if (numA !== numB) {
      return numA > numB ? 1 : -1
    }

    return 0
  })
}

const filterUpMedicine = () => {
  const matchs = []

  // 1. 一般型資料；隔幾日用藥的情況
  items.value.forEach((list) => {
    if (list.eat_medicine_time && list.eat_medicine_time.day && list.eat_medicine_time.day != '0') {
      const startDay = dayjs(list.start_date).format('YYYY-MM-DD')
      const endDay = dayjs(list.end_date).format('YYYY-MM-DD')

      if (dayjs(endDay).isBefore(dayjs(printMonth.value).format(`YYYY-MM-${upMonth.value + 1}`))) {
        matchs.push(list)
      } else if (dayjs(startDay).isAfter(dayjs(printMonth.value).format(`YYYY-MM-${upMonth.value}`))) {
        // 不加入
      } else {
        matchs.push(list)
      }
    }
  })

  // 2. 用藥時間類型為每月幾日的情況
  items.value.forEach((list) => {
    if (list.eat_medicine_time && list.eat_medicine_time.repeatDate && list.eat_medicine_time.repeatDate.length > 0) {
      const dateArr = list.eat_medicine_time.repeatDate.split(',').map((d) => parseInt(d, 10))
      for (const d of dateArr) {
        if (d >= 1 && d <= upMonth.value) {
          if (!matchs.includes(list)) {
            matchs.push(list)
          }
        }
      }
    }
  })

  // 3. 用藥時間類型為星期幾的情況
  items.value.forEach((list) => {
    if (list.eat_medicine_time && list.eat_medicine_time.repeatWeek && list.eat_medicine_time.repeatWeek.length > 0) {
      const weekArr = list.eat_medicine_time.repeatWeek.split(',').map((w) => parseInt(w, 10))
      const startDay = dayjs(list.start_date).format('YYYY-MM-DD')
      const endDay = dayjs(list.end_date).format('YYYY-MM-DD')

      for (let d = 1; d <= upMonth.value; d++) {
        const thisDay = dayjs(printMonth.value).format(`YYYY-MM-${d}`)
        if (dayjs(thisDay).isBetween(startDay, endDay, null, '[]')) {
          const thisWeek = dayjs(thisDay).day() === 0 ? 7 : dayjs(thisDay).day()
          if (weekArr.includes(thisWeek)) {
            if (!matchs.includes(list)) {
              matchs.push(list)
            }
          }
        }
      }
    }
  })

  const sorted = sortByHospitalBranchDoctor(matchs)
  return sorted.reverse()
}

const filterDownMedicine = () => {
  const matchs = []

  // 1. 一般型資料；隔幾日用藥的情況
  items.value.forEach((list) => {
    if (list.eat_medicine_time && list.eat_medicine_time.day && list.eat_medicine_time.day != '0') {
      const startDay = dayjs(list.start_date).format('YYYY-MM-DD')
      const endDay = dayjs(list.end_date).format('YYYY-MM-DD')

      if (dayjs(startDay).isAfter(dayjs(printMonth.value).format(`YYYY-MM-${upMonth.value}`))) {
        matchs.push(list)
      } else if (dayjs(endDay).isBefore(dayjs(printMonth.value).format(`YYYY-MM-${upMonth.value + 1}`))) {
        // 不加入
      } else {
        matchs.push(list)
      }
    }
  })

  // 2. 用藥時間類型為每月幾日的情況
  items.value.forEach((list) => {
    if (list.eat_medicine_time && list.eat_medicine_time.repeatDate && list.eat_medicine_time.repeatDate.length > 0) {
      const dateArr = list.eat_medicine_time.repeatDate.split(',').map((d) => parseInt(d, 10))
      for (const d of dateArr) {
        if (d >= upMonth.value + 1 && d <= parseInt(lastDay.value, 10)) {
          if (!matchs.includes(list)) {
            matchs.push(list)
          }
        }
      }
    }
  })

  // 3. 用藥時間類型為星期幾的情況
  items.value.forEach((list) => {
    if (list.eat_medicine_time && list.eat_medicine_time.repeatWeek && list.eat_medicine_time.repeatWeek.length > 0) {
      const weekArr = list.eat_medicine_time.repeatWeek.split(',').map((w) => parseInt(w, 10))
      const startDay = dayjs(list.start_date).format('YYYY-MM-DD')
      const endDay = dayjs(list.end_date).format('YYYY-MM-DD')
      for (let d = 16; d <= parseInt(lastDay.value, 10); d++) {
        const thisDay = dayjs(printMonth.value).format(`YYYY-MM-${d}`)
        if (dayjs(thisDay).isBetween(startDay, endDay, null, '[]')) {
          const thisWeek = dayjs(thisDay).day() === 0 ? 7 : dayjs(thisDay).day()
          if (weekArr.includes(thisWeek)) {
            if (!matchs.includes(list)) {
              matchs.push(list)
            }
          }
        }
      }
    }
  })

  const sorted = sortByHospitalBranchDoctor(matchs)
  return sorted.reverse()
}

const showWeek = (index) => {
  const theDay = dayjs(printMonth.value).format(`YYYY-MM-${index}`)
  return dayjs(theDay).locale('zh-tw').format('dddd').substr(2, 1)
}

const printTitle = (index) => {
  return index % perPageItemsPrintSet.value == 0
}

const printFooter = (index) => {
  return index % perPageItemsPrintSet.value == perPageItemsPrintSet.value - 1
}

const reprint = (index, items) => {
  if (index == 0) {
    return true
  } else {
    if (
      items[index].medical.hospital_snkey == items[index - 1].medical.hospital_snkey &&
      items[index].medical.branch_snkey == items[index - 1].medical.branch_snkey
    ) {
      return false
    } else {
      return true
    }
  }
}

const checkWeekRepeat = (index, list) => {
  let thisDay = dayjs(printMonth.value).format(`YYYY-MM-${index}`)
  thisDay = dayjs(thisDay).format('YYYY-MM-DD')

  const startDay = dayjs(list.start_date).format('YYYY-MM-DD')
  const endDay = dayjs(list.end_date).format('YYYY-MM-DD')

  if (thisDay < startDay || thisDay > endDay) return '　'

  const weekArr = list.eat_medicine_time.repeatWeek.split(',').map((w) => parseInt(w, 10))
  const thisWeek = dayjs(thisDay).day() === 0 ? 7 : dayjs(thisDay).day()

  if (!weekArr.includes(thisWeek)) return '　'

  const timeArr = list.eat_medicine_time.time.split(',')
  let showTime = {
    0: '<div>　</div>',
    1: '<div>　</div>',
    2: '<div>　</div>',
    3: '<div>　</div>',
  }

  if (timeArr.length >= 5) {
    let start = thisDay === startDay ? '' : 'runPrint'
    timeArr.forEach((i) => {
      if (thisDay === startDay && i == list.start_time) start = 'runPrint'
      if (start === 'runPrint') {
        const key = makeKey(list, thisDay, i)
        showTime[0] += generateTimeCellHtml(key, i)
      }
    })
    return showTime[0]
  } else {
    timeArr.forEach((i) => {
      if (parseInt(i) <= 9 && parseInt(i) > 0)
        showTime[0] = generateTimeCellHtml(makeKey(list, thisDay, i), i)
      if (parseInt(i) >= 10 && parseInt(i) <= 15)
        showTime[1] = generateTimeCellHtml(makeKey(list, thisDay, i), i)
      if (parseInt(i) >= 16 && parseInt(i) <= 20)
        showTime[2] = generateTimeCellHtml(makeKey(list, thisDay, i), i)
      if (parseInt(i) >= 21) showTime[3] = generateTimeCellHtml(makeKey(list, thisDay, i), i, true)
    })
    return `${showTime[0]}${showTime[1]}${showTime[2]}${showTime[3]}`
  }
}

const checkDateRepeat = (index, list) => {
  let thisDay = dayjs(printMonth.value).format(`YYYY-MM-${index}`)
  thisDay = dayjs(thisDay).format('YYYY-MM-DD')

  const startDay = dayjs(list.start_date).format('YYYY-MM-DD')
  const endDay = dayjs(list.end_date).format('YYYY-MM-DD')

  if (thisDay < startDay || thisDay > endDay) return '　'

  const dateArr = list.eat_medicine_time.repeatDate.split(',').map((d) => parseInt(d, 10))
  const thisDate = dayjs(thisDay).date()

  if (!dateArr.includes(thisDate)) return '　'

  const timeArr = list.eat_medicine_time.time.split(',')
  let showTime = {
    0: '<div>　</div>',
    1: '<div>　</div>',
    2: '<div>　</div>',
    3: '<div>　</div>',
  }

  if (timeArr.length >= 5) {
    let start = thisDay === startDay ? '' : 'runPrint'
    timeArr.forEach((i) => {
      if (thisDay === startDay && i == list.start_time) start = 'runPrint'
      if (start === 'runPrint') {
        const key = makeKey(list, thisDay, i)
        showTime[0] += generateTimeCellHtml(key, i)
      }
    })
    return showTime[0]
  } else {
    timeArr.forEach((i) => {
      if (parseInt(i) <= 9 && parseInt(i) > 0)
        showTime[0] = generateTimeCellHtml(makeKey(list, thisDay, i), i)
      if (parseInt(i) >= 10 && parseInt(i) <= 15)
        showTime[1] = generateTimeCellHtml(makeKey(list, thisDay, i), i)
      if (parseInt(i) >= 16 && parseInt(i) <= 20)
        showTime[2] = generateTimeCellHtml(makeKey(list, thisDay, i), i)
      if (parseInt(i) >= 21) showTime[3] = generateTimeCellHtml(makeKey(list, thisDay, i), i, true)
    })
    return `${showTime[0]}${showTime[1]}${showTime[2]}${showTime[3]}`
  }
}

const checkMediceTime = (index, list) => {
  // 判斷是否為每周重覆
  if (list.eat_medicine_time.repeatWeek && list.eat_medicine_time.repeatWeek.length > 0) {
    return checkWeekRepeat(index, list)
  }

  if (list.eat_medicine_time.repeatDate && list.eat_medicine_time.repeatDate.length > 0) {
    return checkDateRepeat(index, list)
  }

  let thisDay = dayjs(printMonth.value).format(`YYYY-MM-${index}`)
  thisDay = dayjs(thisDay).format('YYYY-MM-DD')

  const startDay = dayjs(list.start_date).format('YYYY-MM-DD')
  const endDay = dayjs(list.end_date).format('YYYY-MM-DD')

  if (thisDay >= startDay && thisDay <= endDay) {
    const daysDiff = dayjs(thisDay).diff(dayjs(startDay), 'day')
    if (daysDiff % list.eat_medicine_time.day == 0 || daysDiff == 0) {
      const timeArr = list.eat_medicine_time.time.split(',')

      // 判斷每日用藥數超過5以上的狀況
      if (timeArr.length >= 5) {
        let showTime = ''
        let start = ''

        // 判斷是不是第一天使用藥物
        if (thisDay == startDay) {
          timeArr.forEach((i) => {
            if (i == list.start_time) {
              start = 'runPrint'
            }

            if (start == 'runPrint') {
              const key = makeKey(list, thisDay, i)
              showTime += generateTimeCellHtml(key, i)
            }
          })
        } else {
          // 判斷是不是最後一天
          if (thisDay == endDay) {
            let stop = false
            timeArr.forEach((i) => {
              if (!stop) {
                if (i == list.start_time) {
                  stop = true
                } else {
                  const key = makeKey(list, thisDay, i)
                  showTime += generateTimeCellHtml(key, i)
                }
              }
            })
          } else {
            // 當日正常列印
            timeArr.forEach((i) => {
              const key = makeKey(list, thisDay, i)
              showTime += generateTimeCellHtml(key, i)
            })
          }
        }

        return showTime
      } else {
        // 正常列印
        let showTime = {
          0: '<div>　</div>',
          1: '<div>　</div>',
          2: '<div>　</div>',
          3: '<div>　</div>',
        }

        const lastprintTime = list.medicineEndInfo.split(':')[2]

        // 判斷是不是第一天使用藥物
        if (thisDay == startDay) {
          let start = ''
          timeArr.forEach((i) => {
            if (i == list.start_time) {
              start = 'runPrint'
            }

            if (start == 'runPrint') {
              if (parseInt(i) <= 9 && parseInt(i) > 0) {
                const key = makeKey(list, thisDay, i)
                showTime[0] = generateTimeCellHtml(key, i)
              }
              if (parseInt(i) >= 10 && parseInt(i) <= 15) {
                const key = makeKey(list, thisDay, i)
                showTime[1] = generateTimeCellHtml(key, i)
              }
              if (parseInt(i) >= 16 && parseInt(i) <= 20) {
                const key = makeKey(list, thisDay, i)
                showTime[2] = generateTimeCellHtml(key, i)
              }
              if (parseInt(i) >= 21) {
                const key = makeKey(list, thisDay, i)
                showTime[3] = generateTimeCellHtml(key, i, true)
              }
            }
          })
        } else {
          let stop = ''
          // 判斷是不是用藥的最後一天
          if (thisDay == endDay) {
            timeArr.forEach((i) => {
              if (parseInt(i) <= 9 && parseInt(i) > 0) {
                const key = makeKey(list, thisDay, i)
                showTime[0] = generateTimeCellHtml(key, i)
                if (i == lastprintTime) {
                  stop = true
                }
              }

              if (stop) {
                return
              }

              if (parseInt(i) >= 10 && parseInt(i) <= 15) {
                const key = makeKey(list, thisDay, i)
                showTime[1] = generateTimeCellHtml(key, i)
                if (i == lastprintTime) {
                  stop = true
                }
              }

              if (stop) {
                return
              }

              if (parseInt(i) >= 16 && parseInt(i) <= 20) {
                const key = makeKey(list, thisDay, i)
                showTime[2] = generateTimeCellHtml(key, i)
                if (i == lastprintTime) {
                  stop = true
                }
              }

              if (stop) {
                return
              }

              if (parseInt(i) >= 21) {
                const key = makeKey(list, thisDay, i)
                showTime[3] = generateTimeCellHtml(key, i, true)
              }
            })
          } else {
            // 目前只判斷了每天用藥,隔天用藥的未判斷
            timeArr.forEach((i) => {
              if (parseInt(i) <= 9 && parseInt(i) > 0) {
                const key = makeKey(list, thisDay, i)
                showTime[0] = generateTimeCellHtml(key, i)
              }
              if (parseInt(i) >= 10 && parseInt(i) <= 15) {
                const key = makeKey(list, thisDay, i)
                showTime[1] = generateTimeCellHtml(key, i)
              }
              if (parseInt(i) >= 16 && parseInt(i) <= 20) {
                const key = makeKey(list, thisDay, i)
                showTime[2] = generateTimeCellHtml(key, i)
              }
              if (parseInt(i) >= 21) {
                const key = makeKey(list, thisDay, i)
                showTime[3] = generateTimeCellHtml(key, i, true)
              }
            })
          }
        }

        return `${showTime[0]}${showTime[1]}${showTime[2]}${showTime[3]}`
      }
    }
  } else {
    // 不列印
    return '　'
  }
}

onMounted(() => {
  try {
    const cDataStr = sessionStorage.getItem('cData')
    const pDataStr = sessionStorage.getItem('pData')
    const uDataStr = sessionStorage.getItem('uData')
    const printDataStr = sessionStorage.getItem('printData')

    if (cDataStr) {
      cData.value = JSON.parse(cDataStr)
    }
    if (pDataStr) {
      pData.value = JSON.parse(pDataStr)
    }
    if (uDataStr) {
      uData.value = JSON.parse(uDataStr)
    }
    if (printDataStr) {
      const printData = JSON.parse(printDataStr)
      perPageItemsPrintSet.value = printData.printPerPage || 10
      items.value = printData.medicineData || []
      printMonth.value = dayjs(printData.printMonth).format('YYYY-MM')
      lastDay.value = dayjs(printMonth.value).endOf('month').format('DD')
    }

    // 載入已給藥狀態
    // loadGivenStatus()
  } catch (error) {
    console.error('PrintPage initialization error:', error)
  }
})
</script>

<style lang="scss" scoped>
.medicine-print {
  position: relative;

  &__table {
    width: 100%;
    border: 1px solid #000;
    border-collapse: collapse;
    font-size: 1rem;
    font-family: '微軟正黑體';

    :deep(thead) {
      th {
        border: 1px solid #000;
        padding: 2px;
        font-size: 1rem;
        font-family: '微軟正黑體';
      }
    }

    :deep(tbody) {
      td,
      th {
        border: 1px solid #000;
        padding: 2px;
        font-size: 1rem;
      }
    }
  }

  &__user-msg {
    font-size: 1.2rem;
  }

  &__medicine-name {
    font-size: 1.4rem;
  }

  &__medicine-detail {
    font-size: 1.2rem;
  }

  &__footer {
    tr {
      height: 60px;
    }
  }
}

@media print {
  .medicine-print {
    line-height: 22px;

    &__table {
      font-size: 1rem;
      font-family: '微軟正黑體';

      :deep(thead) {
        th {
          font-size: 1rem;
          font-family: '微軟正黑體';
        }
      }

      :deep(tbody) {
        td,
        th {
          font-size: 1rem;
        }
      }
    }

    &__user-msg {
      font-size: 1.2rem;
    }

    &__medicine-name {
      font-size: 1.4rem;
    }

    &__medicine-detail {
      font-size: 1.2rem;
    }

    &__footer {
      tr {
        height: 60px;
      }
    }
  }

  @page {
    size: A4 portrait;
    margin: 0cm;
    padding: 0cm;
  }
}
</style>
