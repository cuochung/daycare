<template>
  <div class="inspectionreport-print">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="text-center mb-4">
            <h3 class="text-h5 font-weight-bold mb-2">{{ cData.company_name }}</h3>
            <h1 class="text-h4 font-weight-bold border-bottom pb-3">檢驗報告單</h1>
          </div>

          <v-table class="inspectionreport-print__table" border>
            <thead>
              <tr>
                <th class="pa-3">
                  <v-row dense>
                    <v-col cols="2">病歷號: {{ uData.p_code }}</v-col>
                    <v-col cols="2">姓名: {{ uData.name }}</v-col>
                    <v-col cols="2">床號: {{ uData.bed_name }}</v-col>
                    <v-col cols="2">性別: {{ uData.sex }}</v-col>
                    <v-col cols="2">生日: {{ formatDate(uData.birthday) }}</v-col>
                    <v-col cols="2">年齡: {{ age }}</v-col>
                  </v-row>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in items" :key="item.snkey || item.date">
                <td class="pa-2">
                  <v-row dense class="bg-grey-lighten-2 pa-2 mb-2">
                    <v-col cols="3">評估日期: {{ formatDate(item.date) }}</v-col>
                    <v-col cols="3">檢驗地點: {{ item.location || '—' }}</v-col>
                    <v-col cols="6">
                      評估人: {{ extractName(item.create_man) }}
                      <strong class="ml-3">簽名:</strong>
                    </v-col>
                  </v-row>

                  <v-row dense class="pa-2 mb-2">
                    <v-col cols="2">白血球: {{ item.leukocyte || '—' }}</v-col>
                    <v-col cols="2">紅血球: {{ item.erythrocyte || '—' }}</v-col>
                    <v-col cols="2">血色素: {{ item.hemoglobin || '—' }}</v-col>
                    <v-col cols="2">血小板: {{ item.platelet || '—' }}</v-col>
                    <v-col cols="2">白蛋白: {{ item.albumin || '—' }}</v-col>
                    <v-col cols="2">醣化血色素: {{ item.glycosylatedhemoglobin || '—' }}</v-col>
                    <v-col cols="2">GOT(AST): {{ item.got || '—' }}</v-col>
                    <v-col cols="2">GPT(ALT): {{ item.gpt || '—' }}</v-col>
                    <v-col cols="2">血糖: {{ item.bloodsugar || '—' }}</v-col>
                    <v-col cols="2">膽固醇: {{ item.cholesterol || '—' }}</v-col>
                    <v-col cols="2">TG: {{ item.tg || '—' }}</v-col>
                    <v-col cols="2">BUN: {{ item.bun || '—' }}</v-col>
                    <v-col cols="2">CRE: {{ item.cre || '—' }}</v-col>
                    <v-col cols="2">UA: {{ item.ua || '—' }}</v-col>
                    <v-col cols="2">Na: {{ item.na || '—' }}</v-col>
                    <v-col cols="2">K: {{ item.k || '—' }}</v-col>
                    <v-col cols="2">HDL/LDL: {{ item.hdlldl || '—' }}</v-col>
                  </v-row>

                  <v-row dense class="pa-2 mb-2">
                    <v-col cols="12">
                      <strong>尿液</strong>
                    </v-col>
                  </v-row>

                  <v-row dense class="pa-2 mb-2">
                    <v-col cols="2">PH: {{ item.ph || '—' }}</v-col>
                    <v-col cols="2">尿蛋白: {{ item.urineprotein || '—' }}</v-col>
                    <v-col cols="2">OB: {{ item.ob || '—' }}</v-col>
                    <v-col cols="2">RBC: {{ item.rbc || '—' }}</v-col>
                    <v-col cols="2">WBC: {{ item.wbc || '—' }}</v-col>
                    <v-col cols="2">Bacteria: {{ item.bacteria || '—' }}</v-col>
                    <v-col cols="2">GLU: {{ item.glu || '—' }}</v-col>
                  </v-row>

                  <v-row dense class="pa-2 mb-2">
                    <v-col cols="12">
                      <strong>細菌培養</strong>
                    </v-col>
                  </v-row>

                  <v-row dense class="pa-2 mb-2">
                    <v-col cols="2">Urine: {{ item.urine || '—' }}</v-col>
                    <v-col cols="2">Sputum: {{ item.sputum || '—' }}</v-col>
                    <v-col cols="8">其他備註: {{ item.note || '—' }}</v-col>
                  </v-row>

                  <v-row dense class="pa-2 mb-2">
                    <v-col cols="12">處置: {{ item.dispose || '—' }}</v-col>
                  </v-row>

                  <v-row dense class="pa-2">
                    <v-col cols="12">
                      追蹤: {{ item.track || '—' }}
                      <strong class="ml-3">簽名:</strong>
                    </v-col>
                  </v-row>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue'

const cData = ref({})
const uData = ref({})
const items = ref([])

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

const extractName = (value) => {
  if (!value) return '—'
  const parts = value.split('(')
  return parts[0] || '—'
}

onMounted(() => {
  try {
    const cDataStr = sessionStorage.getItem('cData')
    const uDataStr = sessionStorage.getItem('uData')
    const printDataStr = sessionStorage.getItem('printData')

    if (cDataStr) cData.value = JSON.parse(cDataStr)
    if (uDataStr) uData.value = JSON.parse(uDataStr)
    if (printDataStr) items.value = JSON.parse(printDataStr)
  } catch (error) {
    console.error('讀取列印資料失敗:', error)
  }
})
</script>

<style scoped lang="scss">
.inspectionreport-print {
  font-size: 1rem;

  &__table {
    width: 100%;
    border-collapse: collapse;

    thead th {
      background: rgba(0, 0, 0, 0.05);
      font-weight: 600;
      font-size: 1.1rem;
      border: 2px solid #000;
    }

    tbody td {
      border: 2px solid #000;
      padding: 8px;
    }

    .v-col {
      padding-top: 4px;
      padding-bottom: 4px;
    }
  }
}

@media print {
  .inspectionreport-print {
    font-size: 0.75rem;

    &__table {
      thead th {
        font-size: 0.9rem;
      }

      tbody td {
        padding: 4px;
      }
    }

    .v-col {
      padding-top: 2px;
      padding-bottom: 2px;
    }
  }

  @page {
    size: A4 portrait;
    margin: 1cm;
  }
}
</style>
