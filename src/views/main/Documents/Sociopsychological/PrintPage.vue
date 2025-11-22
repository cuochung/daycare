<template>
  <div class="sociopsychologicalprint pa-2">
    <h3>{{ cData.company_name }}</h3>

    <div class="text-center border-bottom my-2">
      <h1>
        <strong>住民社會心理認知功能評估表</strong>
      </h1>
    </div>

    <table class="form_title text-nowrap sociopsychologicalprint__table" style="width: 100%">
      <thead>
        <tr>
          <th colspan="2" class="p-2">
            <div class="d-flex flex-wrap">
              <div class="px-2" style="width: 16.666%;">病歷號: {{ uData.p_code }}</div>
              <div class="px-2" style="width: 16.666%;">床號: {{ uData.bed_name }}</div>
              <div class="px-2" style="width: 16.666%;">姓名: {{ uData.name }}</div>
              <div class="px-2" style="width: 16.666%;">性別: {{ uData.sex }}</div>
              <div class="px-2" style="width: 16.666%;">生日: {{ formatDate(uData.birthday) }}</div>
              <div class="px-2" style="width: 16.666%;">年齡: {{ age }}</div>
              <div class="px-2" style="width: 100%;">疾病史: {{ uData.hadadisease || '—' }}</div>
              <div class="px-2" style="width: 33.333%;">評估日期: {{ formatDate(list.date) }}</div>
              <div class="px-2" style="width: 33.333%;">評估人: {{ extractName(list.createInfo) }}</div>
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>評估項目</td>
          <td>內容</td>
        </tr>
        <tr>
          <td>1.意識狀態</td>
          <td class="pa-2">
            <div>
              <span v-if="!list.stateConsciousness || list.stateConsciousness.length === 0">—</span>
              <span v-else>{{ Array.isArray(list.stateConsciousness) ? list.stateConsciousness.join('、') : '—' }}</span>
              <span v-if="list.stateConsciousnessOther" class="ml-2">
                （其他：{{ list.stateConsciousnessOther }}）
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <td>2.精神狀態</td>
          <td class="pa-2">
            <div>
              <span v-if="!list.mentalState || list.mentalState.length === 0">—</span>
              <span v-else>{{ Array.isArray(list.mentalState) ? list.mentalState.join('、') : '—' }}</span>
              <span v-if="list.mentalStateOther" class="ml-2">
                （其他：{{ list.mentalStateOther }}）
              </span>
            </div>
          </td>
        </tr>

        <tr>
          <td>3.社會需求評估</td>
          <td class="pa-2">
            <div>
              <span v-if="!list.socialNeedsAssessment || list.socialNeedsAssessment.length === 0">—</span>
              <span v-else>{{ Array.isArray(list.socialNeedsAssessment) ? list.socialNeedsAssessment.join('、') : '—' }}</span>
              <span v-if="list.socialNeedsAssessmentOther" class="ml-2">
                （其他：{{ list.socialNeedsAssessmentOther }}）
              </span>
            </div>
          </td>
        </tr>

        <tr>
          <td>4.人際關係狀況</td>
          <td class="pa-2">
            <div>
              <span v-if="!list.interpersonalRelationship || list.interpersonalRelationship.length === 0">—</span>
              <span v-else>{{ Array.isArray(list.interpersonalRelationship) ? list.interpersonalRelationship.join('、') : '—' }}</span>
              <span v-if="list.interpersonalRelationshipOther" class="ml-2">
                （其他：{{ list.interpersonalRelationshipOther }}）
              </span>
            </div>
          </td>
        </tr>

        <tr>
          <td>5.情緒狀況</td>
          <td class="pa-2">
            <div>
              <span v-if="!list.emotionalState || list.emotionalState.length === 0">—</span>
              <span v-else>{{ Array.isArray(list.emotionalState) ? list.emotionalState.join('、') : '—' }}</span>
              <span v-if="list.emotionalStateOther" class="ml-2">
                （其他：{{ list.emotionalStateOther }}）
              </span>
            </div>
          </td>
        </tr>

        <tr>
          <td>6.心理評估</td>
          <td class="pa-2">
            <div>
              <span v-if="!list.psychologicalAssessment || list.psychologicalAssessment.length === 0">—</span>
              <span v-else>{{ Array.isArray(list.psychologicalAssessment) ? list.psychologicalAssessment.join('、') : '—' }}</span>
              <span v-if="list.psychologicalAssessmentOther" class="ml-2">
                （其他：{{ list.psychologicalAssessmentOther }}）
              </span>
            </div>
          </td>
        </tr>

        <tr>
          <td>7.主要溝通方式</td>
          <td class="pa-2">
            <div>
              <span v-if="!list.mainCommunicationMethods || list.mainCommunicationMethods.length === 0">—</span>
              <span v-else>{{ Array.isArray(list.mainCommunicationMethods) ? list.mainCommunicationMethods.join('、') : '—' }}</span>
              <span v-if="list.mainCommunicationMethodsOther" class="ml-2">
                （其他：{{ list.mainCommunicationMethodsOther }}）
              </span>
            </div>
          </td>
        </tr>

        <tr>
          <td>8.溝通效果</td>
          <td class="pa-2">
            <div>
              <span v-if="!list.communicationEffect || list.communicationEffect.length === 0">—</span>
              <span v-else>{{ Array.isArray(list.communicationEffect) ? list.communicationEffect.join('、') : '—' }}</span>
              <span v-if="list.communicationEffectOther" class="ml-2">
                （其他：{{ list.communicationEffectOther }}）
              </span>
            </div>
          </td>
        </tr>

        <tr>
          <td>9.語言理解情形</td>
          <td class="pa-2">
            <div>
              <span v-if="!list.languageComprehension || list.languageComprehension.length === 0">—</span>
              <span v-else>{{ Array.isArray(list.languageComprehension) ? list.languageComprehension.join('、') : '—' }}</span>
              <span v-if="list.languageComprehensionOther" class="ml-2">
                （其他：{{ list.languageComprehensionOther }}）
              </span>
            </div>
          </td>
        </tr>

        <tr>
          <td>10.語言表達情形</td>
          <td class="pa-2">
            <div>
              <span v-if="!list.languageExpression || list.languageExpression.length === 0">—</span>
              <span v-else>{{ Array.isArray(list.languageExpression) ? list.languageExpression.join('、') : '—' }}</span>
              <span v-if="list.languageExpressionOther" class="ml-2">
                （其他：{{ list.languageExpressionOther }}）
              </span>
            </div>
          </td>
        </tr>

        <tr>
          <td>11.其他行為問題：(可複選)</td>
          <td class="pa-2">
            <div>
              <span v-if="!list.otherBehavior || list.otherBehavior.length === 0">—</span>
              <span v-else>{{ Array.isArray(list.otherBehavior) ? list.otherBehavior.join('、') : '—' }}</span>
              <span v-if="list.otherBehaviorOther" class="ml-2">
                （其他：{{ list.otherBehaviorOther }}）
              </span>
            </div>
          </td>
        </tr>

        <tr>
          <td>綜合評估及建議</td>
          <td class="text-left pa-2">{{ list.comprehensiveAssessmentRecommendations || '—' }}</td>
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
const list = ref({})

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

const extractName = (createInfo) => {
  if (!createInfo) return '—'
  if (typeof createInfo === 'string') {
    const parts = createInfo.split('(')
    return parts[0] || '—'
  }
  if (createInfo.name) {
    return createInfo.name
  }
  return '—'
}

onMounted(() => {
  try {
    cData.value = JSON.parse(sessionStorage.getItem('cData') || '{}')
    pData.value = JSON.parse(sessionStorage.getItem('pData') || '{}')
    uData.value = JSON.parse(sessionStorage.getItem('uData') || '{}')
    list.value = JSON.parse(sessionStorage.getItem('printData') || '{}')
  } catch (error) {
    console.error('讀取列印資料失敗:', error)
  }
})
</script>

<style lang="scss" scoped>
.sociopsychologicalprint {
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
  .sociopsychologicalprint {
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
