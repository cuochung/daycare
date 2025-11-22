<template>
  <div class="servicerecordprint pa-2">
    <h3>{{ cData.company_name }}</h3>

    <div class="text-center border-bottom my-2">
      <h1>
        <strong>個案服務紀錄表</strong>
      </h1>
    </div>

    <table class="form_title servicerecordprint__table" style="width: 100%">
      <thead>
        <tr>
          <th colspan="5" class="p-2">
            <div class="d-flex flex-wrap">
              <div class="px-2" style="width: 20%;">病歷號: {{ uData.p_code }}</div>
              <div class="px-2" style="width: 20%;">姓名: {{ uData.name }}</div>
              <div class="px-2" style="width: 20%;">性別: {{ uData.sex }}</div>
              <div class="px-2" style="width: 20%;">教育程度: {{ uData.nursingAssessment ? uData.nursingAssessment.education.toString() : '—' }}</div>
              <div class="px-2" style="width: 20%;">步態: {{ uData.nursingAssessment ? uData.nursingAssessment.gait.toString() : '—' }}</div>
            </div>
          </th>
        </tr>
      </thead>

      <tbody v-for="item in items" :key="item.snkey">
        <tr>
          <td colspan="5" class="grey lighten-3"></td>
        </tr>
        <tr>
          <th>評估日期</th>
          <th>服務對象</th>
          <th>服務類型</th>
          <th>服務地點</th>
          <th>服務模式</th>
        </tr>
        <tr class="text-center">
          <td class="text-no-wrap">{{ formatDate(item.date) }}</td>
          <td>{{ item.target || '—' }}</td>
          <td>{{ item.type || '—' }}</td>
          <td>{{ item.location || '—' }}</td>
          <td>{{ item.model || '—' }}</td>
        </tr>
        <tr>
          <th>近況簡述</th>
          <td colspan="4" class="text-left pa-2">{{ item.simplecontent || '—' }}</td>
        </tr>
        <tr>
          <th>下次計畫</th>
          <td colspan="4" class="text-left pa-2">{{ item.nextplan || '—' }}</td>
        </tr>
        <tr>
          <td colspan="5" class="text-right pr-2">紀錄人: {{ item.createInfo.name ? item.createInfo.name : '—' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'


const cData = ref({})
const pData = ref({})
const uData = ref({})
const items = ref([])

const formatDate = (date) => {
  if (!date) return '—'
  const parsed = dayjs(date)
  return parsed.isValid() ? parsed.format('YYYY/MM/DD') : date
}

onMounted(() => {
  try {
    cData.value = JSON.parse(sessionStorage.getItem('cData') || '{}')
    pData.value = JSON.parse(sessionStorage.getItem('pData') || '{}')
    uData.value = JSON.parse(sessionStorage.getItem('uData') || '{}')
    items.value = JSON.parse(sessionStorage.getItem('printData') || '[]')
  } catch (error) {
    console.error('讀取列印資料失敗:', error)
  }
})
</script>

<style lang="scss" scoped>
.servicerecordprint {
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
  .servicerecordprint {
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
