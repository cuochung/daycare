<template>
  <div class="multidocumentprint">
    <div class="multidocumentprint__container">
      <div class="text-center mb-4">
        <h3 class="multidocumentprint__company">{{ cData.company_name }}</h3>
        <h1 class="multidocumentprint__title">住民身心社會健康評估表</h1>
      </div>

      <table class="multidocumentprint__table">
        <tbody>
          <tr>
            <td colspan="9" class="pa-2">
              <div class="form_title">
                <div class="form_title__row">
                  <div class="form_title__col">病歷號: {{ uData.p_code }}</div>
                  <div class="form_title__col">床號: {{ uData.bed_name }}</div>
                  <div class="form_title__col">姓名: {{ uData.name }}</div>
                  <div class="form_title__col">性別: {{ uData.sex }}</div>
                  <div class="form_title__col">生日: {{ formatDate(uData.birthday) }}</div>
                  <div class="form_title__col">年齡: {{ age }}</div>
                </div>
                <div class="form_title__row">
                  <div class="form_title__col">入住日期: {{ formatDate(uData.in_date) }}</div>
                </div>
                <div class="form_title__row">
                  <div class="form_title__col">疾病史: {{ uData.hadadisease || '—' }}</div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>

        <tbody>
          <tr class="text-center font-weight-bold">
            <td colspan="4">評估日期</td>
            <td v-for="index in 5" :key="index" style="width: 8%;">
              {{ matchDate[index - 1] || '—' }}
            </td>
          </tr>
        </tbody>

        <RecordPrint v-if="choiceDocuments.record" />
        <KbPrint v-if="choiceDocuments.kb" />
        <FallPrint v-if="choiceDocuments.fall" />
        <BradenPrint v-if="choiceDocuments.braden" />
        <SpmsqPrint v-if="choiceDocuments.spmsq" />

        <tbody>
          <tr>
            <td colspan="4" class="text-center font-weight-bold">簽名</td>
            <td v-for="index in 5" :key="index"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue'

import RecordPrint from '@/views/print/RecordPrint.vue'
import KbPrint from '@/views/print/KbPrint.vue'
import FallPrint from '@/views/print/FallPrint.vue'
import BradenPrint from '@/views/print/BradenPrint.vue'
import SpmsqPrint from '@/views/print/SpmsqPrint.vue'

const cData = ref({})
const uData = ref({})
const printData = ref({})
const matchDate = ref([])
const choiceDocuments = ref({})

const age = computed(() => {
  if (!uData.value.birthday) return '—'
  const birthYear = dayjs(uData.value.birthday).year()
  const currentYear = dayjs().year()
  return currentYear - birthYear
})

const formatDate = (date) => {
  if (!date) return '—'
  const parsed = dayjs(date)
  return parsed.isValid() ? parsed.format('YYYY/MM/DD') : date
}

onMounted(() => {
  try {
    const cDataStr = sessionStorage.getItem('cData')
    const uDataStr = sessionStorage.getItem('uData')
    const printDataStr = sessionStorage.getItem('printData')

    if (cDataStr) cData.value = JSON.parse(cDataStr)
    if (uDataStr) uData.value = JSON.parse(uDataStr)
    if (printDataStr) {
      printData.value = JSON.parse(printDataStr)
      matchDate.value = printData.value.matchDate || []
      choiceDocuments.value = printData.value.choiceDocuments || {}
    }
  } catch (error) {
    console.error('讀取列印資料失敗:', error)
  }
})
</script>

<style scoped lang="scss">
.multidocumentprint {
  font-size: 1rem;
  width: 100%;
  padding: 20px;

  &__container {
    width: 100%;
    max-width: 100%;
  }

  &__company {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 8px;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    border-bottom: 2px solid #000;
    padding-bottom: 12px;
    margin-bottom: 16px;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    border: 2px solid #000;

    thead th,
    tbody th,
    tbody td {
      border: 1px solid #000;
      padding: 8px;
    }

    thead th {
      border-bottom: 2px solid #000;
    }

    tbody tr:first-child td {
      border-top: 2px solid #000;
    }

    tbody tr td:first-child,
    tbody tr th:first-child {
      border-left: 2px solid #000;
    }

    tbody tr td:last-child,
    tbody tr th:last-child {
      border-right: 2px solid #000;
    }

    tbody:last-child tr:last-child td {
      border-bottom: 2px solid #000;
    }

    .form_title {
      font-size: 1.1rem;
      font-family: '微軟正黑體';

      &__row {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 4px;
      }

      &__col {
        flex: 0 0 auto;
        margin-right: 16px;
        padding: 2px 0;
      }
    }
  }
}

@media print {
  .multidocumentprint {
    font-size: 0.75rem;
    padding: 0;
    width: 100%;

    &__table {
      width: 100%;
      border: 2px solid #000 !important;

      thead th,
      tbody th,
      tbody td {
        border: 1px solid #000 !important;
        padding: 4px;
      }

      thead th {
        border-bottom: 2px solid #000 !important;
      }

      tbody tr:first-child td {
        border-top: 2px solid #000 !important;
      }

      tbody tr td:first-child,
      tbody tr th:first-child {
        border-left: 2px solid #000 !important;
      }

      tbody tr td:last-child,
      tbody tr th:last-child {
        border-right: 2px solid #000 !important;
      }

      tbody:last-child tr:last-child td {
        border-bottom: 2px solid #000 !important;
      }
    }
  }

  @page {
    size: A4 portrait;
    margin: 1cm;
  }
}
</style>
