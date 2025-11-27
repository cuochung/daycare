<template>
  <div class="NutritionMultiPrint">
    <div class="py-0 my-0" v-for="(list, index) in items" :key="index">
      <p style="page-break-after: always" v-if="printnextpage(index, items)"></p>
      <h3 v-if="reprint(index, items)">{{ cData.company_name }}</h3>

      <div class="text-center border-bottom my-2" v-if="reprint(index, items)">
        <h1>
          <strong>營養評估單</strong>
        </h1>
      </div>

      <table class="print-table py-0 my-0" style="width: 100%">
        <tr v-if="reprint(index, items)">
          <td class="text-center align-middle">
            <strong>基本資料</strong>
          </td>
          <td colspan="2">
            <v-row>
              <v-col cols="4">姓名: {{ list.name }}</v-col>
              <v-col cols="4">性別: {{ list.sex }}</v-col>
              <v-col cols="4">年齡: {{ getAge(list.birthday) }}</v-col>
              <v-col cols="4">身高: {{ list.height }}</v-col>
              <v-col cols="4">標準體重(IBW): {{ getIbw(list) }}</v-col>
              <v-col cols="12">疾病史: {{ list.hadadisease }}</v-col>
            </v-row>
          </td>
        </tr>

        <tr>
          <td rowspan="4">
            評估日期:
            <br />
            {{ list.date }}
          </td>
          <td class="text-center align-middle">
            <strong>生理資料</strong>
          </td>
          <td>
            <v-row>
              <v-col cols="4">活動狀況: {{ list.action }}</v-col>
              <v-col cols="8">
                <div class="d-flex">
                  <span>腸胃狀況: {{ getgastrointestinal(list) }}</span>
                </div>
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
              <v-col cols="4">咀嚼能力: {{ setRecord(list, 'occlusal') }}</v-col>
              <v-col cols="4">吞嚥能力: {{ setRecord(list, 'swallowing') }}</v-col>
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
              <v-col cols="4">營養師: {{ list.createInfo?.name }}</v-col>
            </v-row>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'

const cData = ref(JSON.parse(sessionStorage.getItem('cData') || '{}'))
const pData = ref(JSON.parse(sessionStorage.getItem('pData') || '{}'))
const items = ref(JSON.parse(sessionStorage.getItem('printData') || '[]'))
const recordItems = ref([])

const getAge = (val) => {
  if (!val) return ''
  return dayjs().format('YYYY') - dayjs(val).format('YYYY')
}

const getIbw = (item) => {
  if (!item.height) return ''
  const ibw = (item.height / 100) * (item.height / 100) * 22
  return ibw.toFixed(2)
}

const printnextpage = (index, items) => {
  if (index == 0) {
    return false
  } else {
    if (items[index].name == items[index - 1].name) {
      return false
    } else {
      return true
    }
  }
}

const reprint = (index, items) => {
  if (index == 0) {
    return true
  } else {
    if (items[index].name == items[index - 1].name) {
      return false
    } else {
      return true
    }
  }
}

const getgastrointestinal = (list) => {
  if (!list.nursingAssessment || !list.nursingAssessment.gastrointestinal) {
    return ''
  }

  const gastrointestinal = list.nursingAssessment.gastrointestinal
  const gastrointestinalOther = list.nursingAssessment.gastrointestinalOther || ''

  let outtext = ''
  if (Array.isArray(gastrointestinal) && gastrointestinal.length > 0) {
    outtext = gastrointestinal.join(';') + (gastrointestinal.length > 0 ? ';' : '')
  }
  
  if (gastrointestinalOther) {
    outtext += gastrointestinalOther
  }

  return outtext
}

const getRecord = async () => {
  try {
    const response = await api.get('record')
    recordItems.value = response || []
  } catch (error) {
    console.error('Get record error:', error)
  }
}

const setRecord = (list, col) => {
  if (recordItems.value.length > 0) {
    const rs = recordItems.value.filter((i) => {
      return i.u_snkey == list.u_snkey
    })

    if (rs.length > 0) {
      return JSON.parse(rs[0].datalist || '{}')[col] || ''
    }
  }
  return ''
}

onMounted(() => {
  getRecord()
})
</script>

<style scoped lang="scss">
.NutritionMultiPrint {
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

  @media print {
    .NutritionMultiPrint {
      padding: 0;
    }

    .print-table {
      page-break-inside: avoid;
    }
  }
}
</style>
