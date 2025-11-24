<template>
  <div class="adaptabilityprint pa-2">
    <h3>{{ cData.company_name }}</h3>

    <div class="text-center border-bottom my-2">
      <h1>
        <strong>適應性評估表</strong>
      </h1>
    </div>

    <table class="form_title adaptabilityprint__table" style="width: 100%">
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
          <th style="width: 25%;">評估項目</th>
          <th style="width: 25%;">結果</th>
          <th style="width: 25%;">評估項目</th>
          <th style="width: 25%;">結果</th>
        </tr>
        <tr>
          <td class="text-left">1.入住意願接受度</td>
          <td>{{ getQuestionText(item.question1) }}</td>
          <td class="text-left">4.行為</td>
          <td>{{ getQuestionText(item.question4) }}</td>
        </tr>
        <tr>
          <td class="text-left">2.家屬配合度</td>
          <td>{{ getQuestionText(item.question2) }}</td>
          <td class="text-left">5.社會化(參與度)</td>
          <td>{{ getQuestionText(item.question5) }}</td>
        </tr>
        <tr>
          <td class="text-left">3.情緒</td>
          <td>{{ getQuestionText(item.question3) }}</td>
          <td class="text-left">6.家庭支持度</td>
          <td>{{ getQuestionText(item.question6) }}</td>
        </tr>
        <tr>
          <td colspan="2" class="text-center font-weight-bold">總分</td>
          <td colspan="2" class="text-center font-weight-bold">{{ item.total || '—' }} 分</td>
        </tr>
        <tr>
          <th colspan="4" class="text-left">結果說明</th>
        </tr>
        <tr>
          <td colspan="4" class="text-left pa-2">{{ item.result_description || '—' }}</td>
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

const cData = ref({})
const uData = ref({})
const item = ref({})

const formatDate = (date) => {
  if (!date) return '—'
  const parsed = dayjs(date)
  return parsed.isValid() ? parsed.format('YYYY/MM/DD') : date
}

const getQuestionText = (question) => {
  if (!question) return '—'
  if (typeof question === 'object' && question.text) {
    return question.text
  }
  if (typeof question === 'string') {
    return question
  }
  return '—'
}

onMounted(() => {
  try {
    cData.value = JSON.parse(sessionStorage.getItem('cData') || '{}')
    uData.value = JSON.parse(sessionStorage.getItem('uData') || '{}')
    const printData = JSON.parse(sessionStorage.getItem('printData') || '{}')
    console.log('printData', printData);
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
  } catch (error) {
    console.error('讀取列印資料失敗:', error)
  }
})
</script>

<style lang="scss" scoped>
.adaptabilityprint {
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
  }
}

@media print {
  .adaptabilityprint {
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
