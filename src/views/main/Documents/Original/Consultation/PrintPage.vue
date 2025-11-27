<template>
  <div class="consultationprint pa-2">
    <h3 class="text-center mb-4">{{ cData.company_name }}</h3>

    <div class="text-center border-bottom my-3">
      <h1 class="mb-0">
        <strong>住民需求轉介照會單</strong>
      </h1>
    </div>

    <table class="consultationprint__table" style="width: 100%">
      <!-- 基本資料 -->
      <tr>
        <th class="consultationprint__label">基本資料</th>
        <td class="consultationprint__content">
          <div class="consultationprint__info-row">
            <span>病歷號: {{ uData.p_code || '—' }}</span>
            <span>姓名: {{ uData.name || '—' }}</span>
            <span>性別: {{ uData.sex || '—' }}</span>
            <span>診斷: {{ diagnosis() }}</span>
          </div>
        </td>
      </tr>

      <!-- 預計照會人員 -->
      <tr>
        <th class="consultationprint__label">預計照會人員</th>
        <td class="consultationprint__content">
          <div class="consultationprint__checkbox-group">
            <span v-if="list.doctor" class="consultationprint__checkbox-item consultationprint__checkbox-item--checked">☑ 醫師</span>
            <span v-else class="consultationprint__checkbox-item">☐ 醫師</span>
            <span v-if="list.nutritionist" class="consultationprint__checkbox-item consultationprint__checkbox-item--checked">☑ 營養師</span>
            <span v-else class="consultationprint__checkbox-item">☐ 營養師</span>
            <span v-if="list.socialworker" class="consultationprint__checkbox-item consultationprint__checkbox-item--checked">☑ 社工</span>
            <span v-else class="consultationprint__checkbox-item">☐ 社工</span>
            <span v-if="list.rehabilitation" class="consultationprint__checkbox-item consultationprint__checkbox-item--checked">☑ 物理治療師</span>
            <span v-else class="consultationprint__checkbox-item">☐ 物理治療師</span>
            <span v-if="list.attendant" class="consultationprint__checkbox-item consultationprint__checkbox-item--checked">☑ 照服員</span>
            <span v-else class="consultationprint__checkbox-item">☐ 照服員</span>
            <span v-if="list.otherworker" class="consultationprint__checkbox-item consultationprint__checkbox-item--checked">☑ 其他人員</span>
            <span v-else class="consultationprint__checkbox-item">☐ 其他人員</span>
            <span v-if="list.otherworker && list.otherworker_content" class="consultationprint__checkbox-item">
              ({{ list.otherworker_content }})
            </span>
          </div>
        </td>
      </tr>

      <!-- 照會原因及狀況 -->
      <tr>
        <th class="consultationprint__label">照會原因及狀況</th>
        <td class="consultationprint__content">
          <div class="consultationprint__reason-list">
            <div v-if="list.result1 && list.result1_content" class="consultationprint__reason-item">
              <span class="consultationprint__checkbox consultationprint__checkbox--checked">☑</span>
              <span class="consultationprint__reason-label">精神及行為異常:</span>
              <span class="consultationprint__reason-content">{{ list.result1_content }}</span>
            </div>
            <div v-if="list.result2 && list.result2_content" class="consultationprint__reason-item">
              <span class="consultationprint__checkbox consultationprint__checkbox--checked">☑</span>
              <span class="consultationprint__reason-label">健康狀況異常:</span>
              <span class="consultationprint__reason-content">{{ list.result2_content }}</span>
            </div>
            <div v-if="list.result3 && list.result3_content" class="consultationprint__reason-item">
              <span class="consultationprint__checkbox consultationprint__checkbox--checked">☑</span>
              <span class="consultationprint__reason-label">日常生活無法自理:</span>
              <span class="consultationprint__reason-content">{{ list.result3_content }}</span>
            </div>
            <div v-if="list.result4 && list.result4_content" class="consultationprint__reason-item">
              <span class="consultationprint__checkbox consultationprint__checkbox--checked">☑</span>
              <span class="consultationprint__reason-label">肢體功能退化:</span>
              <span class="consultationprint__reason-content">{{ list.result4_content }}</span>
            </div>
            <div v-if="list.result5 && list.result5_content" class="consultationprint__reason-item">
              <span class="consultationprint__checkbox consultationprint__checkbox--checked">☑</span>
              <span class="consultationprint__reason-label">疑自殺意圖:</span>
              <span class="consultationprint__reason-content">{{ list.result5_content }}</span>
            </div>
            <div v-if="list.result6 && list.result6_content" class="consultationprint__reason-item">
              <span class="consultationprint__checkbox consultationprint__checkbox--checked">☑</span>
              <span class="consultationprint__reason-label">服藥不合作:</span>
              <span class="consultationprint__reason-content">{{ list.result6_content }}</span>
            </div>
            <div v-if="list.result7 && list.result7_content" class="consultationprint__reason-item">
              <span class="consultationprint__checkbox consultationprint__checkbox--checked">☑</span>
              <span class="consultationprint__reason-label">營養狀況異常:</span>
              <span class="consultationprint__reason-content">{{ list.result7_content }}</span>
            </div>
            <div v-if="list.result8 && list.result8_content" class="consultationprint__reason-item">
              <span class="consultationprint__checkbox consultationprint__checkbox--checked">☑</span>
              <span class="consultationprint__reason-label">其他:</span>
              <span class="consultationprint__reason-content">{{ list.result8_content }}</span>
            </div>
            <div v-if="!hasAnyReason" class="consultationprint__no-data">無</div>
          </div>
          <div class="consultationprint__thank-note">※ 謝 謝 您 的 照 會 ※</div>
          <div class="consultationprint__signature-row">
            <span>護理人員: {{ list.nurse_name || '—' }}</span>
            <span>日期: {{ formatDate(list.date) }}</span>
          </div>
        </td>
      </tr>

      <!-- 醫師照會回覆 -->
      <tr v-if="list.doctor">
        <th class="consultationprint__label">醫師照會回覆</th>
        <td class="consultationprint__content">
          <div class="consultationprint__response-content">{{ list.doctor_response || '—' }}</div>
          <div class="consultationprint__signature-row">
            <span>照會人員: {{ list.doctor_name || '—' }}</span>
            <span>日期: {{ formatDate(list.doctor_name_date) }}</span>
          </div>
        </td>
      </tr>

      <!-- 營養師照會回覆 -->
      <tr v-if="list.nutritionist">
        <th class="consultationprint__label">營養師照會回覆</th>
        <td class="consultationprint__content">
          <div class="consultationprint__response-content">{{ list.nutritionist_response || '—' }}</div>
          <div class="consultationprint__signature-row">
            <span>照會人員: {{ list.nutritionist_name || '—' }}</span>
            <span>日期: {{ formatDate(list.nutritionist_name_date) }}</span>
          </div>
        </td>
      </tr>

      <!-- 社工照會回覆 -->
      <tr v-if="list.socialworker">
        <th class="consultationprint__label">社工照會回覆</th>
        <td class="consultationprint__content">
          <div class="consultationprint__response-content">{{ list.socialworker_response || '—' }}</div>
          <div class="consultationprint__signature-row">
            <span>照會人員: {{ list.socialworker_name || '—' }}</span>
            <span>日期: {{ formatDate(list.socialworker_name_date) }}</span>
          </div>
        </td>
      </tr>

      <!-- 物理治療師照會回覆 -->
      <tr v-if="list.rehabilitation">
        <th class="consultationprint__label">物理治療師照會回覆</th>
        <td class="consultationprint__content">
          <div class="consultationprint__response-content">{{ list.rehabilitation_response || '—' }}</div>
          <div class="consultationprint__signature-row">
            <span>照會人員: {{ list.rehabilitation_name || '—' }}</span>
            <span>日期: {{ formatDate(list.rehabilitation_name_date) }}</span>
          </div>
        </td>
      </tr>

      <!-- 照服員照會回覆 -->
      <tr v-if="list.attendant">
        <th class="consultationprint__label">照服員照會回覆</th>
        <td class="consultationprint__content">
          <div class="consultationprint__response-content">{{ list.attendant_response || '—' }}</div>
          <div class="consultationprint__signature-row">
            <span>照會人員: {{ list.attendant_name || '—' }}</span>
            <span>日期: {{ formatDate(list.attendant_name_date) }}</span>
          </div>
        </td>
      </tr>

      <!-- 其他人員照會回覆 -->
      <tr v-if="list.otherworker">
        <th class="consultationprint__label">其他人員({{ list.otherworker_content || '' }})照會回覆</th>
        <td class="consultationprint__content">
          <div class="consultationprint__response-content">{{ list.otherworker_response || '—' }}</div>
          <div class="consultationprint__signature-row">
            <span>照會人員: {{ list.otherworker_name || '—' }}</span>
            <span>日期: {{ formatDate(list.otherworker_name_date) }}</span>
          </div>
        </td>
      </tr>

      <!-- 追蹤處理 -->
      <tr>
        <th class="consultationprint__label">追蹤處理</th>
        <td class="consultationprint__content">
          <div class="consultationprint__response-content">{{ list.track_response || '—' }}</div>
          <div class="consultationprint__signature-row">
            <span>處理者簽名: {{ list.track_name || '—' }}</span>
            <span>日期: {{ formatDate(list.track_name_date) }}</span>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'

const route = useRoute()

const cData = ref(JSON.parse(sessionStorage.getItem('cData') || '{}'))
const pData = ref(JSON.parse(sessionStorage.getItem('pData') || '{}'))
const uData = ref(JSON.parse(sessionStorage.getItem('uData') || '{}'))
const list = ref({})

// 回傳住民診斷
const diagnosis = () => {
  if (uData.value.diagnosis) {
    const diagnosisArr = Object.values(uData.value.diagnosis).map((item) => item)
    return diagnosisArr.reduce(
      function (prev, element) {
        if (prev == '') {
          return element
        } else {
          return prev + ',' + element
        }
      },
      ''
    )
  }
  return '—'
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '—'
  const parsed = dayjs(date)
  return parsed.isValid() ? parsed.format('YYYY/MM/DD') : date
}

// 檢查是否有任何照會原因
const hasAnyReason = computed(() => {
  return (
    (list.value.result1 && list.value.result1_content) ||
    (list.value.result2 && list.value.result2_content) ||
    (list.value.result3 && list.value.result3_content) ||
    (list.value.result4 && list.value.result4_content) ||
    (list.value.result5 && list.value.result5_content) ||
    (list.value.result6 && list.value.result6_content) ||
    (list.value.result7 && list.value.result7_content) ||
    (list.value.result8 && list.value.result8_content)
  )
})

onMounted(() => {
  // 從 query 參數獲取資料
  if (route.query.data) {
    list.value = JSON.parse(route.query.data)
  }
})
</script>

<style lang="scss" scoped>
.consultationprint {
  font-family: '微軟正黑體', 'Microsoft JhengHei', sans-serif;

  h3 {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 16px;
  }

  h1 {
    font-size: 1.8rem;
    font-weight: 700;
  }

  .border-bottom {
    border-bottom: 2px solid #000;
    padding-bottom: 12px;
    margin-bottom: 20px;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    border: 2px solid #000;
    font-size: 1.1rem;

    th,
    td {
      border: 1px solid #000;
      padding: 12px;
      vertical-align: top;
    }
  }

  &__label {
    width: 180px;
    background-color: rgba(168, 197, 181, 0.15);
    font-weight: 600;
    text-align: center;
    font-size: 1.1rem;
  }

  &__content {
    padding: 12px 16px;
  }

  &__info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px 24px;

    span {
      font-size: 1rem;
      white-space: nowrap;
    }
  }

  &__checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 20px;
    align-items: center;
  }

  &__checkbox-item {
    font-size: 1rem;
    white-space: nowrap;

    &--checked {
      font-size: 1.2rem;
      font-weight: 700;
    }
  }

  &__reason-list {
    margin-bottom: 12px;
  }

  &__reason-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 8px;
    line-height: 1.6;
  }

  &__checkbox {
    margin-right: 8px;
    font-size: 1.1rem;

    &--checked {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }

  &__reason-label {
    font-weight: 600;
    margin-right: 8px;
    min-width: 140px;
  }

  &__reason-content {
    flex: 1;
  }

  &__no-data {
    color: #666;
    font-style: italic;
    padding: 8px 0;
  }

  &__thank-note {
    text-align: center;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 16px 0;
    padding: 8px 0;
  }

  &__signature-row {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px dashed #ccc;
    font-size: 0.95rem;

    span {
      white-space: nowrap;
    }
  }

  &__response-content {
    min-height: 120px;
    line-height: 1.8;
    white-space: pre-wrap;
    word-wrap: break-word;
    margin-bottom: 8px;
    padding: 8px;
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 4px;
  }
}

@media print {
  .consultationprint {
    padding: 0;

    h3 {
      font-size: 1.2rem;
      margin-bottom: 12px;
    }

    h1 {
      font-size: 1.6rem;
    }

    &__table {
      border: 2px solid #000 !important;
      font-size: 1rem;

      th,
      td {
        border: 1px solid #000 !important;
        padding: 8px !important;
      }
    }

    &__label {
      width: 160px;
      font-size: 1rem;
      padding: 8px !important;
    }

    &__content {
      padding: 8px 12px !important;
    }

    &__info-row,
    &__checkbox-group {
      gap: 8px 16px;
    }

    &__response-content {
      min-height: 100px;
      padding: 6px;
      background-color: transparent;
    }

    &__signature-row {
      margin-top: 8px;
      padding-top: 6px;
      font-size: 0.9rem;
    }
  }

  @page {
    size: A4 portrait;
    margin: 1cm;
  }
}
</style>
