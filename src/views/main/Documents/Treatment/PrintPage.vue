<template>
  <div class="treatmentprint pa-2">
    <h3>{{ cData.company_name }}</h3>

    <div class="text-center border-bottom my-2">
      <h1>
        <strong>個案服務處遇計畫表</strong>
      </h1>
    </div>

    <table class="form_title treatmentprint__table" style="width: 100%">
      <thead>
        <tr>
          <th colspan="4" class="p-2">
            <div class="d-flex flex-wrap">
              <div class="px-2" style="width: 25%;">病歷號: {{ uData.p_code }}</div>
              <div class="px-2" style="width: 25%;">姓名: {{ uData.name }}</div>
              <div class="px-2" style="width: 25%;">性別: {{ uData.sex }}</div>
              <div class="px-2" style="width: 25%;">評估日期: {{ formatDate(item.date) }}</div>
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <th colspan="4" class="text-left p-2">一、住民基本資料</th>
        </tr>
        <tr>
          <td colspan="4" class="p-2">
            <div class="d-flex flex-wrap">
              <div class="px-2" style="width: 20%;">姓名: {{ uData.name }}</div>
              <div class="px-2" style="width: 20%;">性別: {{ uData.sex }}</div>
              <div class="px-2" style="width: 20%;">生日: {{ uData.birthday }}</div>
              <div class="px-2" style="width: 20%;">入住日期: {{ uData.in_date }}</div>
              <div class="px-2" style="width: 20%;">評估日期: {{ formatDate(item.date) }}</div>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="4" class="p-2">
            <div class="d-flex flex-wrap">
              <div class="px-2" style="width: 25%;">身分別: {{ getIdentity() }}</div>
              <div class="px-2" style="width: 25%;">障礙類別: {{ uData.obstacleInput?.kind || '—' }}</div>
              <div class="px-2" style="width: 25%;">障礙等級: {{ uData.obstacleInput?.lv || '—' }}</div>
              <div class="px-2" style="width: 25%;">教育程度: {{ getEducation() }}</div>
            </div>
            <div class="px-2 mt-2">致障原因: {{ item.obstaclereason || '—' }}</div>
          </td>
        </tr>

        <tr>
          <th colspan="4" class="text-left p-2">二、社會心理功能診斷分析</th>
        </tr>
        <tr>
          <td colspan="4" class="p-2">
            <div class="px-2">1.生活自理能力: {{ item.selfcareability || '—' }}</div>
            <div class="px-2">2.生活適應能力-適應評估表: {{ getAdaptabilityScore() }} 分</div>
            <div class="px-2">3.情緒狀況-憂鬱量表: {{ getMelancholyScore() }} 分</div>
            <div class="px-2">4.經濟來源: {{ item.economicsources || '—' }}</div>
            <div class="px-2">5.家庭支持功能: {{ item.familysupport || '—' }}</div>
          </td>
        </tr>

        <tr>
          <th colspan="4" class="text-left p-2">三、個案處遇計畫</th>
        </tr>
        <tr>
          <td colspan="4" class="p-2">
            <div class="px-2 mb-2">【服務對象問題及需求】</div>
            <div class="px-2 mb-3">{{ item.qa || '—' }}</div>
            <div class="px-2 mb-2">【服務目標】</div>
            <div class="px-2 mb-3">{{ item.target || '—' }}</div>
            <div class="px-2 mb-2">【服務策略】</div>
            <div class="px-2 mb-1">➤執行方法: {{ item.means || '—' }}</div>
            <div class="px-2 mb-1">➤服務資源: {{ item.resources || '—' }}</div>
            <div class="px-2 mb-1">➤執行期程: {{ item.schedule || '—' }}</div>
            <div class="px-2 mb-3">➤執行者: {{ item.executor || '—' }}</div>
            <div class="px-2 mb-2">【評值】</div>
            <div class="px-2">{{ item.evaluation || '—' }}</div>
          </td>
        </tr>
        <tr>
          <td colspan="4" class="text-right pr-2">紀錄人: {{ item.createInfo ? item.createInfo.name : '—' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'

const cData = ref({})
const uData = ref({})
const item = ref({})
const adaptabilityItems = ref([])
const melancholyItems = ref([])

const formatDate = (date) => {
  if (!date) return '—'
  const parsed = dayjs(date)
  return parsed.isValid() ? parsed.format('YYYY/MM/DD') : date
}

const getIdentity = () => {
  const identity = uData.value?.nursingAssessment?.identity
  if (Array.isArray(identity) && identity.length > 0) {
    return identity.join('、')
  }
  return '—'
}

const getEducation = () => {
  const education = uData.value?.nursingAssessment?.education
  if (Array.isArray(education) && education.length > 0) {
    return education.join('、')
  }
  return '—'
}

const getAdaptabilityScore = () => {
  if (Array.isArray(adaptabilityItems.value) && adaptabilityItems.value.length > 0) {
    const matchData = adaptabilityItems.value.filter((i) => {
      const data = JSON.parse(i.datalist || '{}')
      return data.date == item.value.date
    })
    if (matchData.length > 0) {
      const data = JSON.parse(matchData[0].datalist)
      return data.total || '—'
    }
  }
  return '—'
}

const getMelancholyScore = () => {
  if (Array.isArray(melancholyItems.value) && melancholyItems.value.length > 0) {
    const matchData = melancholyItems.value.filter((i) => {
      const data = JSON.parse(i.datalist || '{}')
      return data.date == item.value.date
    })
    if (matchData.length > 0) {
      const data = JSON.parse(matchData[0].datalist)
      return data.total || '—'
    }
  }
  return '—'
}

const getAdaptability = async () => {
  if (!uData.value?.snkey) return

  const postData = {
    key: 'u_snkey',
    value: uData.value.snkey,
  }

  try {
    const response = await api.options(
      `byjson/searchByKeyValue/${JSON.parse(sessionStorage.getItem('cData') || '{}').databaseName}/adaptability`,
      postData
    )
    adaptabilityItems.value = response
  } catch (error) {
    console.error('取得適應性評估表失敗:', error)
  }
}

const getMelancholy = async () => {
  if (!uData.value?.snkey) return

  const postData = {
    key: 'u_snkey',
    value: uData.value.snkey,
  }

  try {
    const response = await api.options(
      `byjson/searchByKeyValue/${JSON.parse(sessionStorage.getItem('cData') || '{}').databaseName}/melancholy`,
      postData
    )
    melancholyItems.value = response
  } catch (error) {
    console.error('取得憂鬱量表失敗:', error)
  }
}

onMounted(() => {
  try {
    cData.value = JSON.parse(sessionStorage.getItem('cData') || '{}')
    uData.value = JSON.parse(sessionStorage.getItem('uData') || '{}')
    const printData = JSON.parse(sessionStorage.getItem('printData') || '{}')
    
    // 如果 printData 是 datalist 格式，需要解析
    if (printData.datalist) {
      const parsed = JSON.parse(printData.datalist || '{}')
      item.value = {
        ...parsed,
        snkey: printData.snkey,
      }
    } else {
      item.value = printData
    }

    getAdaptability()
    getMelancholy()
  } catch (error) {
    console.error('讀取列印資料失敗:', error)
  }
})
</script>

<style lang="scss" scoped>
.treatmentprint {
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
  .treatmentprint {
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