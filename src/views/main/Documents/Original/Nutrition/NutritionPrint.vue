<template>
  <div class="nutritionprint">
    <h3>{{ cData.company_name }}</h3>

    <div class="text-center border-bottom my-4">
      <h1>
        <strong>營養評估單</strong>
      </h1>
    </div>

    <table class="print-table" style="width: 100%">
      <tr>
        <td class="text-center align-middle">
          <strong>基本資料</strong>
        </td>
        <td>
          <v-row>
            <v-col cols="4">姓名: {{ uData.name }}</v-col>
            <v-col cols="4">性別: {{ uData.sex }}</v-col>
            <v-col cols="4">評估日期: {{ list.date }}</v-col>
            <v-col cols="4">年齡: {{ age }}</v-col>
            <v-col cols="4">身高: {{ uData.height }}</v-col>
            <v-col cols="4">標準體重(IBW): {{ ibw }}</v-col>
          </v-row>
        </td>
      </tr>

      <tr>
        <td class="text-center align-middle">
          <strong>生理資料</strong>
        </td>
        <td>
          <v-row>
            <v-col cols="12">疾病史: {{ uData.hadadisease }}</v-col>
            <v-col cols="4">活動狀況: {{ list.action }}</v-col>
            <v-col cols="8">
              腸胃狀況:
              <span v-if="nursingassessmentItems.gastrointestinal1">正常;</span>
              <span v-if="nursingassessmentItems.gastrointestinal2">食慾增加;</span>
              <span v-if="nursingassessmentItems.gastrointestinal3">食慾減少;</span>
              <span v-if="nursingassessmentItems.gastrointestinal4">咀嚼困難;</span>
              <span v-if="nursingassessmentItems.gastrointestinal5">吞嚥困難;</span>
              <span v-if="nursingassessmentItems.gastrointestinal6">噁心;</span>
              <span v-if="nursingassessmentItems.gastrointestinal7">嘔吐;</span>
              <span v-if="nursingassessmentItems.gastrointestinal8">腹脹;</span>
              <span v-if="nursingassessmentItems.gastrointestinal9">胃不適;</span>
              <span v-if="nursingassessmentItems.gastrointestinal10">腹水;</span>
              <span v-if="nursingassessmentItems.gastrointestinal11">體重改變;</span>
              <span v-if="nursingassessmentItems.gastrointestinal12">便秘;</span>
              <span v-if="nursingassessmentItems.gastrointestinal13">腹瀉;</span>
              <span v-if="nursingassessmentItems.gastrointestinal14">痔瘡;</span>
              <span v-if="nursingassessmentItems.gastrointestinal15">血便,</span>
              <span v-if="nursingassessmentItems.gastrointestinal16">{{ nursingassessmentItems.gastrointestinal16 }}</span>
            </v-col>
            <v-col cols="4">當月體重: {{ list.weight }}</v-col>
            <v-col cols="4">BMI: {{ list.bmi }}</v-col>
          </v-row>
        </td>
      </tr>

      <tr>
        <td class="text-center align-middle">
          <strong>飲食資料</strong>
        </td>
        <td>
          <v-row>
            <v-col cols="4">咀嚼能力: {{ list.occlusal }}</v-col>
            <v-col cols="4">吞嚥能力: {{ list.swallowing }}</v-col>
            <v-col cols="4">食慾: {{ list.appetite }}</v-col>
            <v-col cols="4">飲食質地: {{ list.texture }}</v-col>
            <v-col cols="4">進食方式: {{ list.eat }}</v-col>
          </v-row>
        </td>
      </tr>

      <tr>
        <td class="text-center align-middle">
          <strong>評估</strong>
        </td>
        <td>
          <v-row>
            <v-col cols="4">飲食處方: {{ list.dietprescription }}</v-col>
            <v-col cols="8">熱量(Kcal): {{ list.kcal }}</v-col>
            <v-col cols="4">醣類(%): {{ list.carbohydrate }}</v-col>
            <v-col cols="4">蛋白質(%): {{ list.protein }}</v-col>
            <v-col cols="4">脂肪(%): {{ list.fat }}</v-col>
            <v-col cols="4">醣類(g): {{ list.carbohydrate_g }}</v-col>
            <v-col cols="4">蛋白質(g): {{ list.protein_g }}</v-col>
            <v-col cols="4">脂肪(g): {{ list.fat_g }}</v-col>
          </v-row>
        </td>
      </tr>

      <tr>
        <td class="text-center align-middle">
          <strong>營養建議</strong>
        </td>
        <td>
          <v-row>
            <v-col cols="8">
              <pre style="border: 0px; white-space: pre-wrap; font-family: inherit;">{{ list.suggest }}</pre>
            </v-col>
            <v-col cols="4" class="d-flex align-end">營養師: {{ list.createInfo?.name }}</v-col>
          </v-row>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'

const cData = ref(JSON.parse(sessionStorage.getItem('cData') || '{}'))
// const pData = ref(JSON.parse(sessionStorage.getItem('pData') || '{}'))
const uData = ref(JSON.parse(sessionStorage.getItem('uData') || '{}'))
const list = ref(JSON.parse(sessionStorage.getItem('printData') || '{}'))
const nursingassessmentItems = ref({})
const nutritionItems = ref([])
const recordItems = ref([])

const age = computed(() => {
  if (!uData.value.birthday) return ''
  return dayjs().format('YYYY') - dayjs(uData.value.birthday).format('YYYY')
})

const ibw = computed(() => {
  if (!uData.value.height) return ''
  const ibwValue = (uData.value.height / 100) * (uData.value.height / 100) * 22
  return ibwValue.toFixed(2)
})

const filterName = (val) => {
  if (val != undefined) {
    const name = val.split('(')
    return name[0]
  }
  return ''
}

const getNursingassessment = async () => {
  const payload = {
    key: 'u_snkey',
    value: uData.value.snkey,
  }
  const url = `byjson/searchByKeyValue/${sessionStorage.getItem('databaseName')}/nursingassessment`
  try {
    const response = await api.options(url, payload)
    if (response && response.length > 0) {
      nursingassessmentItems.value = response[0]
    }
  } catch (error) {
    console.error('Get nursingassessment error:', error)
  }
}

const getNutrition = async () => {
  const payload = {
    key: 'u_snkey',
    value: uData.value.snkey,
  }
  const url = `byjson/searchByKeyValue/${sessionStorage.getItem('databaseName')}/nutrition`
  try {
    const response = await api.options(url, payload)
    nutritionItems.value = response || []
  } catch (error) {
    console.error('Get nutrition error:', error)
  }
}

const getRecord = async () => {
  const payload = {
    key: 'u_snkey',
    value: uData.value.snkey,
  }
  const url = `byjson/searchByKeyValue/${sessionStorage.getItem('databaseName')}/record`
  try {
    const response = await api.options(url, payload)
    recordItems.value = (response || []).map((i) => {
      const newItem = JSON.parse(i.datalist || '{}')
      return newItem
    })
    setRecord()
  } catch (error) {
    console.error('Get record error:', error)
  }
}

const setRecord = () => {
  if (recordItems.value.length > 0) {
    const rs = recordItems.value.sort((a, b) => {
      return a.date < b.date ? 1 : -1
    })
    list.value.occlusal = rs[0].occlusal
    list.value.swallowing = rs[0].swallowing
  }
}

onMounted(() => {
  getNursingassessment()
  getNutrition()
  getRecord()
})
</script>

<style scoped lang="scss">
.nutritionprint {
  padding: 20px;

  .print-table {
    border-collapse: collapse;
    width: 100%;
    font-size: 1.2rem;
    font-family: '微軟正黑體';

    td {
      border: 2px solid #000000;
      padding: 8px;
      vertical-align: top;

      &.text-center {
        text-align: center;
      }

      &.align-middle {
        vertical-align: middle;
      }
    }

    strong {
      font-weight: bold;
    }
  }

  pre {
    margin: 0;
    font-family: '微軟正黑體';
    font-size: 1.2rem;
  }
}
</style>
