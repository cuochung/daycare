<template>
  <div class="hour72nutrition-print">
    <h3>{{ cData.company_name }}</h3>

    <div class="text-center border-bottom my-4">
      <h1>
        <strong>72小時營養篩檢表</strong>
      </h1>
    </div>

    <table class="print-table" style="width: 100%">
      <tr>
        <td class="text-center align-middle">
          <strong>基本資料</strong>
        </td>
        <td>
          <v-row>
            <v-col cols="3">姓名: {{ uData.name }}</v-col>
            <v-col cols="3">病歷號: {{ uData.p_code }}</v-col>
            <v-col cols="3">性別: {{ uData.sex }}</v-col>
            <v-col cols="3">出生日期: {{ uData.birthday }}</v-col>
            <v-col cols="4">入住日期: {{ uData.in_date }}</v-col>
            <v-col cols="4">評估日期: {{ list.date }}</v-col>
            <v-col cols="4">年齡: {{ age }}</v-col>
          </v-row>
        </td>
      </tr>

      <tr>
        <td class="text-center align-middle">
          <strong>1.體重變化</strong>
        </td>
        <td>
          <v-row>
            <v-col cols="3">入住身高 {{ uData.height }} cm</v-col>
            <v-col cols="3">入住體重 {{ uData.weight }} kg</v-col>
            <v-col cols="3">BMI {{ bmi }} kg/m<sup>2</sup></v-col>
            <v-col cols="3">理想體重 {{ ibw }} kg</v-col>
          </v-row>
        </td>
      </tr>

      <tr>
        <td class="text-center align-middle">
          <strong>2.飲食攝取</strong>
        </td>
        <td>
          <v-row>
            <v-col cols="12">
              (1)飲食種類: {{ formatArray(nursingassessmentData.dietType) }}
              <span v-if="nursingassessmentData.diet5">，其他：{{ nursingassessmentData.diet5 }}</span>
            </v-col>
            <v-col cols="12">
              (2)飲食型態: {{ formatArray(nursingassessmentData.dietForm) }}
              <span v-if="nursingassessmentData.diet13">，其他：{{ nursingassessmentData.diet13 }}</span>
            </v-col>
            <v-col cols="12" class="d-flex">(3)進食型態: {{ list.eatingpattern || '—' }}</v-col>
            <v-col cols="12">
              (4)食物攝取量(與供應量比較):
              <table class="print-table-inner" style="width: 100%">
                <tr>
                  <td class="text-center">早餐</td>
                  <td class="text-center">午餐</td>
                  <td class="text-center">晚餐</td>
                  <td class="text-center">點心</td>
                </tr>
                <tr>
                  <td class="text-center">{{ list.breakfast || '—' }}</td>
                  <td class="text-center">{{ list.lunch || '—' }}</td>
                  <td class="text-center">{{ list.dinner || '—' }}</td>
                  <td class="text-center">{{ list.dessert || '—' }}</td>
                </tr>
              </table>
            </v-col>
            <v-col cols="12">
              (5)飲食偏好: {{ formatArray(nursingassessmentData.dietPreference) }}
            </v-col>
            <v-col cols="12">
              (6)過敏食物: {{ formatArray(nursingassessmentData.allergyFood) }}
            </v-col>
          </v-row>
        </td>
      </tr>

      <tr>
        <td class="text-center align-middle">
          <strong>3.腸胃道症狀</strong>
        </td>
        <td>
          <v-row>
            <v-col cols="12">
              {{ formatArray(nursingassessmentData.gastrointestinal) }}
              <span v-if="nursingassessmentData.gastrointestinal16">，其他：{{ nursingassessmentData.gastrointestinal16 }}</span>
            </v-col>
          </v-row>
        </td>
      </tr>

      <tr>
        <td class="text-center align-middle">
          <strong>4.功能性評估: <br>
            （依柯氏表：<br>
            0為無功能不全；<br>
            1-2為可走動；<br>
            3為輪椅；<br>
            4為臥床）</strong>
        </td>
        <td>
          <h2>{{ kbData.klv || '—' }}</h2>
        </td>
      </tr>
      <tr>
        <td class="text-center align-middle">
          <strong>5.生理測驗：<br>
            (0=正常；<br>
            1+=輕微；<br>
            2+普通；<br>
            3+=嚴重)</strong>
        </td>
        <td>
          <table class="print-table-inner" style="width: 100%">
            <tr>
              <td class="text-center">皮下組織減少</td>
              <td class="text-center">肌肉耗弱</td>
              <td class="text-center">下肢水腫</td>
              <td class="text-center">腹水</td>
              <td class="text-center">褥瘡</td>
              <td class="text-center">褥瘡級數</td>
            </tr>
            <tr>
              <td class="text-center">{{ list.physiologicaltest1 || '—' }}</td>
              <td class="text-center">{{ list.physiologicaltest2 || '—' }}</td>
              <td class="text-center">{{ list.physiologicaltest3 || '—' }}</td>
              <td class="text-center">{{ list.physiologicaltest4 || '—' }}</td>
              <td class="text-center">{{ list.physiologicaltest5 || '—' }}</td>
              <td class="text-center">{{ list.physiologicaltest6 || '—' }}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td class="text-center align-middle"><strong>綜合主觀評估</strong></td>
        <td>
          <div class="d-flex justify-space-between">
            <span>{{ list.assessment || '—' }}</span>
            <span>評估人: {{ createManName }}</span>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useStore } from '@/stores/useStore'

const store = useStore()
const route = useRoute()

const cData = ref({})
const uData = ref({})
const list = ref({})
const nursingassessmentData = ref({})
const kbData = ref({})

const age = computed(() => {
  if (!uData.value.birthday) return '—'
  return dayjs().format('YYYY') - dayjs(uData.value.birthday).format('YYYY')
})

const bmi = computed(() => {
  if (!uData.value.weight || !uData.value.height) return '—'
  const bmiValue =
    uData.value.weight / ((uData.value.height / 100) * (uData.value.height / 100))
  return bmiValue.toFixed(2)
})

const ibw = computed(() => {
  if (!uData.value.height) return '—'
  const ibwValue = (uData.value.height / 100) * (uData.value.height / 100) * 22
  return ibwValue.toFixed(2)
})

const createManName = computed(() => {
  if (!list.value.createInfo) {
    if (list.value.createInfo.name) {
      return list.value.createInfo.name.split('(')[0] || '—'
    }
    return '—'
  } else {
    return list.value.createInfo.name || '—'
  }
})

const formatArray = (value) => {
  if (Array.isArray(value) && value.length > 0) {
    return value.join('、')
  }
  return '—'
}

onMounted(() => {
  cData.value = JSON.parse(sessionStorage.getItem('cData') || '{}')
  uData.value = JSON.parse(sessionStorage.getItem('uData') || '{}')

  const data = JSON.parse(route.query.data || '{}')
  list.value = data.list || {}
  nursingassessmentData.value = data.nursingassessmentData || {}
  kbData.value = data.kbData || {}
})
</script>

<style scoped lang="scss">
.hour72nutrition-print {
  padding: 20px;

  h3 {
    text-align: center;
    margin-bottom: 20px;
  }

  .border-bottom {
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  .print-table {
    border-collapse: collapse;
    width: 100%;
    font-size: 1rem;
    font-family: '微軟正黑體';

    td {
      padding: 8px;
      border: 2px solid #000;
      vertical-align: top;
    }

    .text-center {
      text-align: center;
    }

    .align-middle {
      vertical-align: middle;
    }
  }

  .print-table-inner {
    border-collapse: collapse;
    width: 100%;
    margin-top: 8px;

    td {
      padding: 6px;
      border: 1px solid #000;
    }
  }

  @media print {
    .hour72nutrition-print {
      padding: 0;
    }

    .print-table,
    .print-table-inner {
      page-break-inside: avoid;
    }
  }
}
</style>
