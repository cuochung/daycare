<template>
  <div class="carerecord-print">
    <v-container fluid class="pa-6">
      <v-sheet class="carerecord-print__header mb-6" rounded="lg">
        <v-row class="pa-4" align="center">
          <v-col cols="12" md="4">
            <h3 class="text-h5 font-weight-bold mb-1">{{ companyName }}</h3>
            <p class="text-body-2 mb-0">日間照護照護紀錄列印</p>
          </v-col>
          <v-col cols="12" md="4" class="text-center">
            <h1 class="text-h4 font-weight-black mb-0">照護紀錄</h1>
            <p class="text-caption mt-1">Care Record</p>
          </v-col>
          <v-col cols="12" md="4" class="text-right">
            <div class="text-body-2">
              列印日期：{{ today }}
            </div>
          </v-col>
        </v-row>
        
        <v-row class="pa-4 pb-5 text-body-2 carerecord-print__resident-info">
          <v-col cols="12" sm="6" md="3">姓名：{{ resident.name || '—' }}</v-col>
          <v-col cols="12" sm="6" md="3">病歷號：{{ resident.p_code || '—' }}</v-col>
        </v-row>
      </v-sheet>

      <v-table class="carerecord-print__table" density="comfortable">
        <thead>
          <tr>
            <th class="text-center" style="width: 200px;">日期</th>
            <th>護理紀錄內容</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in printData" :key="index">
            <td class="text-center text-nowrap pa-3">
              {{ item.Date || '—' }}
            </td>
            <td class="text-pre-wrap pa-3">
              {{ item.Statement || '—' }}
            </td>
          </tr>
          <tr v-if="!printData || printData.length === 0">
            <td colspan="2" class="text-center py-8">
              目前沒有列印資料。
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const cData = ref({})
const resident = ref({})
const printData = ref([])

const today = computed(() => dayjs().format('YYYY/MM/DD'))

const companyName = computed(() => cData.value?.company_name ?? '日間照護中心')

onMounted(() => {
  try {
    const uDataStr = sessionStorage.getItem('uData')
    const cDataStr = sessionStorage.getItem('cData')
    
    if (uDataStr) {
      resident.value = JSON.parse(uDataStr)
    }
    
    if (cDataStr) {
      cData.value = JSON.parse(cDataStr)
    }
    
    if (route.query.data) {
      const queryData = JSON.parse(route.query.data)
      printData.value = queryData.data || []
    }
  } catch (error) {
    console.error('PrintPage initialization error:', error)
  }
})
</script>

<style lang="scss" scoped>
.carerecord-print {
  &__header {
    border: 1px solid #000;
  }

  &__resident-info {
    border-top: 1px solid #000;
  }

  &__table {
    :deep(thead) {
      th {
        font-size: 1.2rem;
        font-weight: 600;
        border: 1px solid #000;
        padding: 12px;
        font-family: '微軟正黑體';
      }
    }

    :deep(tbody) {
      td {
        font-size: 1rem;
        border: 1px solid #000;
        vertical-align: top;
      }
    }
  }
}
</style>
