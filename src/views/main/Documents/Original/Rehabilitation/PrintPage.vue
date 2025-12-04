<template>
  <div class="rehabilitationprint pa-2">
    <h3>{{ cData.company_name }}</h3>

    <div class="text-center border-bottom my-2">
      <h1>
        <strong>復健評估表</strong>
      </h1>
    </div>

    <div v-for="(list, index) in items" :key="list.snkey || index" class="mb-4">
      <table class="form_title rehabilitationprint__table" style="width: 100%">
        <thead>
          <tr>
            <th colspan="2" class="p-2">
              <div class="d-flex flex-wrap">
                <div class="px-2" style="width: 16.66%;">病歷號: {{ uData.p_code }}</div>
                <div class="px-2" style="width: 16.66%;">床號: {{ uData.bed_name }}</div>
                <div class="px-2" style="width: 16.66%;">姓名: {{ uData.name }}</div>
                <div class="px-2" style="width: 16.66%;">性別: {{ uData.sex }}</div>
                <div class="px-2" style="width: 16.66%;">生日: {{ uData.birthday }}</div>
                <div class="px-2" style="width: 16.66%;">年齡: {{ getAge() }}</div>
              </div>
            </th>
          </tr>
          <tr>
            <th colspan="2" class="grey lighten-2 px-4">
              <div class="d-flex flex-wrap">
                <div class="px-2" style="width: 50%;">評估日期: {{ formatDate(list.date) }}</div>
                <div class="px-2" style="width: 50%;">評估人: {{ getCreatorName(list) }}</div>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td class="text-left p-2">1.關節活動度（ROM）</td>
            <td class="p-2">
              <div class="d-flex flex-wrap">
                <div class="px-2" style="width: 25%;">右上肢: {{ list.rom1 || '—' }}</div>
                <div class="px-2" style="width: 25%;">右下肢: {{ list.rom2 || '—' }}</div>
                <div class="px-2" style="width: 25%;">左上肢: {{ list.rom3 || '—' }}</div>
                <div class="px-2" style="width: 25%;">左下肢: {{ list.rom4 || '—' }}</div>
              </div>
            </td>
          </tr>

          <tr>
            <td class="text-left p-2">2.肌肉力量（MMT）</td>
            <td class="p-2">
              <div class="d-flex flex-wrap">
                <div class="px-2" style="width: 25%;">右上肢: {{ list.mmt1 || '—' }}</div>
                <div class="px-2" style="width: 25%;">右下肢: {{ list.mmt2 || '—' }}</div>
                <div class="px-2" style="width: 25%;">左上肢: {{ list.mmt3 || '—' }}</div>
                <div class="px-2" style="width: 25%;">左下肢: {{ list.mmt4 || '—' }}</div>
              </div>
            </td>
          </tr>

          <tr>
            <td class="text-left p-2">3.動作、姿態與步態</td>
            <td class="p-2">{{ list.action || '—' }}</td>
          </tr>

          <tr>
            <td class="text-left p-2">4.肌肉張力(Muscle tone)</td>
            <td class="p-2">
              <div class="d-flex flex-wrap">
                <div class="px-2" style="width: 20%;">軀幹: {{ list.muscletone1 || '—' }}</div>
                <div class="px-2" style="width: 20%;">右上肢: {{ list.muscletone2 || '—' }}</div>
                <div class="px-2" style="width: 20%;">右下肢: {{ list.muscletone3 || '—' }}</div>
                <div class="px-2" style="width: 20%;">左上肢: {{ list.muscletone4 || '—' }}</div>
                <div class="px-2" style="width: 20%;">左下肢: {{ list.muscletone5 || '—' }}</div>
              </div>
            </td>
          </tr>

          <tr>
            <td class="text-left p-2">5.平衡（Balance）</td>
            <td class="p-2">
              <div class="d-flex flex-wrap">
                <div class="px-2" style="width: 33.33%;">坐姿靜態: {{ list.balance1 || '—' }}</div>
                <div class="px-2" style="width: 33.33%;">坐姿動態: {{ list.balance2 || '—' }}</div>
                <div class="px-2" style="width: 33.33%;">站姿靜態: {{ list.balance3 || '—' }}</div>
                <div class="px-2" style="width: 33.33%;">站姿動態: {{ list.balance4 || '—' }}</div>
                <div class="px-2" style="width: 66.66%;">坐姿到站姿/站姿到坐姿平衡: {{ list.balance5 || '—' }}</div>
              </div>
            </td>
          </tr>

          <tr>
            <td class="text-left p-2">6.布郎斯壯分期（Brunnstrom's stage）(針對中風個案)</td>
            <td class="p-2">
              <div class="d-flex flex-wrap">
                <div class="px-2" style="width: 16.66%;">右上肢-近: {{ list.brunnstrom1 || '—' }}</div>
                <div class="px-2" style="width: 16.66%;">右上肢-遠: {{ list.brunnstrom2 || '—' }}</div>
                <div class="px-2" style="width: 16.66%;">左上肢-近: {{ list.brunnstrom3 || '—' }}</div>
                <div class="px-2" style="width: 16.66%;">左上肢-遠: {{ list.brunnstrom4 || '—' }}</div>
                <div class="px-2" style="width: 16.66%;">右下肢: {{ list.brunnstrom5 || '—' }}</div>
                <div class="px-2" style="width: 16.66%;">左下肢: {{ list.brunnstrom6 || '—' }}</div>
              </div>
            </td>
          </tr>

          <tr>
            <td class="text-left p-2">7.短期目標（Short term goals）</td>
            <td class="p-2">{{ list.shorttermgoals || '—' }}</td>
          </tr>
          <tr>
            <td class="text-left p-2">8.長期目標（Long term goals）</td>
            <td class="p-2">{{ list.longtermgoals || '—' }}</td>
          </tr>
          <tr>
            <td class="text-left p-2">9.治療項目（Treatment programs）</td>
            <td class="p-2">{{ list.treatmentprograms || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'

const cData = ref({})
const uData = ref({})
const items = ref([])

const formatDate = (date) => {
  if (!date) return '—'
  const parsed = dayjs(date)
  return parsed.isValid() ? parsed.format('YYYY/MM/DD') : date
}

const getAge = () => {
  if (!uData.value.birthday) return '—'
  const birthYear = dayjs(uData.value.birthday).format('YYYY')
  const currentYear = dayjs().format('YYYY')
  return currentYear - birthYear
}

const getCreatorName = (item) => {
  if (item.createInfo && item.createInfo.name) {
    return item.createInfo.name
  }
  if (item.createInfo) {
    const parts = item.createInfo.name.split('(')
    return parts[0] || '—'
  }
  return '—'
}

onMounted(() => {
  try {
    cData.value = JSON.parse(sessionStorage.getItem('cData') || '{}')
    uData.value = JSON.parse(sessionStorage.getItem('uData') || '{}')
    const printData = JSON.parse(sessionStorage.getItem('printData') || '[]')
    
    // 處理資料格式
    items.value = printData.map((item) => {
      // 如果 item 有 datalist，需要解析
      if (item.datalist) {
        const parsed = JSON.parse(item.datalist || '{}')
        return {
          ...parsed,
          snkey: item.snkey,
        }
      }
      return item
    })
  } catch (error) {
    console.error('讀取列印資料失敗:', error)
  }
})
</script>

<style lang="scss" scoped>
.rehabilitationprint {
  .form_title {
    font-size: 1.2rem;
    font-family: '微軟正黑體';
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    border: 2px solid #000; /* 外框實線 */

    thead th,
    tbody th,
    tbody td {
      border: 1px solid #000; /* 內框實線 */
      padding: 8px;
    }

    th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
  }
}

@media print {
  .rehabilitationprint {
    &__table {
      border: 2px solid #000 !important;

      thead th,
      tbody th,
      tbody td {
        border: 1px solid #000 !important;
        padding: 4px;
      }
    }
  }

  @page {
    size: A4 portrait;
    margin: 1cm;
  }
}
</style>