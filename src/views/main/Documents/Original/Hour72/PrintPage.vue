<template>
  <div class="hour72print pa-2">
      <!-- 畫面顯示內容區域 -->
    <h3>{{ cData.company_name }}</h3>

      <div class="text-center border-bottom my-2">
        <h1>
          <strong>72小時適應評估紀錄表</strong>
        </h1>
      </div>

    <table class="form_title text-nowrap hour72print__table">
        <tr>
          <td class="text-center align-middle">
            <strong>基本資料</strong>
          </td>
          <td>
            <v-row>
            <v-col cols="2">姓名: {{ uData.name }}</v-col>
            <v-col cols="2">性別: {{ uData.sex }}</v-col>
            <v-col cols="4">入住日期: {{ formatDate(uData.in_date) }}</v-col>
            <v-col cols="4">評估日期: {{ formatDate(list.date) }}</v-col>
            </v-row>
          </td>
        </tr>

        <tr>
          <td class="text-center align-middle">
            <strong>生理現況需求</strong>
          </td>
          <td>
          <div class="ml-3 mt-2">
            <span v-if="!list.physiologicalNeeds || list.physiologicalNeeds.length === 0">—</span>
            <span v-else>{{ list.physiologicalNeeds.join('、') }}</span>
          </div>
          </td>
        </tr>

        <tr>
          <td class="text-center align-middle">
            <strong>心理評估</strong>
          </td>
          <td>
          <div class="ml-3 mt-2">
            <span v-if="!list.psychologicalAssessments || list.psychologicalAssessments.length === 0">—</span>
            <span v-else>{{ list.psychologicalAssessments.join('、') }}</span>
            <span v-if="list.psychologicalAssessmentOther" class="ml-2">
              （其他：{{ list.psychologicalAssessmentOther }}）
            </span>
          </div>
          </td>
        </tr>

        <tr>
          <td class="text-center align-middle">
            <strong>社會需求評估</strong>
          </td>
          <td>
          <div class="ml-3 mt-2">
            <span v-if="!list.socialNeedsAssessments || list.socialNeedsAssessments.length === 0">—</span>
            <span v-else>{{ list.socialNeedsAssessments.join('、') }}</span>
            <span v-if="list.socialNeedsAssessmentOther" class="ml-2">
              （其他：{{ list.socialNeedsAssessmentOther }}）
            </span>
          </div>
          </td>
        </tr>

        <tr>
          <td class="text-center align-middle">
            <strong>認知功能評估</strong>
          </td>
          <td>
          <div class="ml-3 mt-2">
            <span v-if="!list.cognitiveFunctionAssessments || list.cognitiveFunctionAssessments.length === 0">—</span>
            <span v-else>{{ list.cognitiveFunctionAssessments.join('、') }}</span>
            <span v-if="list.cognitiveFunctionAssessmentOther" class="ml-2">
              （其他：{{ list.cognitiveFunctionAssessmentOther }}）
            </span>
          </div>
          </td>
        </tr>
        <tr>
          <td class="text-center align-middle">
            <strong>社工處遇計畫</strong>
          </td>
          <td>
          <div class="ml-3 mt-2">
            <span v-if="!list.encounterPlans || list.encounterPlans.length === 0">—</span>
            <span v-else>{{ list.encounterPlans.join('、') }}</span>
            <span v-if="list.encounterPlanOther" class="ml-2">
              （其他：{{ list.encounterPlanOther }}）
            </span>
          </div>
          </td>
        </tr>
      </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'

const route = useRoute()

const cData = ref({})
const uData = ref({})
const list = ref({
  date: '',
  physiologicalNeeds: [],
  psychologicalAssessments: [],
  psychologicalAssessmentOther: '',
  socialNeedsAssessments: [],
  socialNeedsAssessmentOther: '',
  cognitiveFunctionAssessments: [],
  cognitiveFunctionAssessmentOther: '',
  encounterPlans: [],
  encounterPlanOther: ''
})

const formatDate = (date) => {
  if (!date) return '—'
  const parsed = dayjs(date)
  return parsed.isValid() ? parsed.format('YYYY/MM/DD') : date
}

onMounted(() => {
  try {
    cData.value = JSON.parse(sessionStorage.getItem('cData') || '{}')
    uData.value = JSON.parse(sessionStorage.getItem('uData') || '{}')
    
    const queryData = route.query.data
    if (queryData) {
      const parsed = JSON.parse(queryData)
      // 確保所有陣列欄位都是陣列
      list.value = {
        date: parsed.date || '',
        physiologicalNeeds: Array.isArray(parsed.physiologicalNeeds) ? parsed.physiologicalNeeds : [],
        psychologicalAssessments: Array.isArray(parsed.psychologicalAssessments) ? parsed.psychologicalAssessments : [],
        psychologicalAssessmentOther: parsed.psychologicalAssessmentOther || '',
        socialNeedsAssessments: Array.isArray(parsed.socialNeedsAssessments) ? parsed.socialNeedsAssessments : [],
        socialNeedsAssessmentOther: parsed.socialNeedsAssessmentOther || '',
        cognitiveFunctionAssessments: Array.isArray(parsed.cognitiveFunctionAssessments) ? parsed.cognitiveFunctionAssessments : [],
        cognitiveFunctionAssessmentOther: parsed.cognitiveFunctionAssessmentOther || '',
        encounterPlans: Array.isArray(parsed.encounterPlans) ? parsed.encounterPlans : [],
        encounterPlanOther: parsed.encounterPlanOther || ''
      }
    }
  } catch (error) {
    console.error('讀取列印資料失敗:', error)
  }
})
</script>

<style lang="scss">
.hour72print {
  .form_title {
    font-size: 1.6rem;
    font-family: '微軟正黑體';
    td {
      padding: 5px;
    }
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    border: 2px solid #000; /* 外框實線 */

    td {
      border: 1px solid #000; /* 內框實線 */
    }
  }

  .v-label {
    font-size: 1.6rem;
  }
}

@media print {
  .hour72print {
    &__table {
      border: 2px solid #000 !important;

      td {
        border: 1px solid #000 !important;
      }
    }
  }
}
</style>
