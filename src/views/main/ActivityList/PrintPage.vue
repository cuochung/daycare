<template>
  <div class="activityprint">
    <div class="mb-4">
      <v-row>
        <v-col cols="4">
          <h2 class="text-h6">{{ cData?.company_name }}</h2>
        </v-col>
        <v-col cols="4" class="text-center">
          <h1 class="text-h4 font-weight-bold">活動參與紀錄表</h1>
        </v-col>
        <v-col cols="4"></v-col>
      </v-row>
    </div>

    <v-divider class="mb-4" />

    <v-table class="print-table" density="comfortable">
      <tbody>
        <tr>
          <td class="title">活動名稱</td>
          <td colspan="3">{{ list.name }}</td>
        </tr>
        <tr>
          <td class="title">日期</td>
          <td colspan="3">
            <v-row class="ma-0">
              <v-col class="pa-0">{{ list.date }}</v-col>
              <v-col class="title pa-0">時間</v-col>
              <v-col class="pa-0">{{ list.time }}</v-col>
            </v-row>
          </td>
        </tr>
        <tr>
          <td class="title">活動目標</td>
          <td colspan="3">{{ list.target }}</td>
        </tr>
        <tr>
          <td class="title">活動地點</td>
          <td colspan="3">{{ list.location }}</td>
        </tr>
        <tr>
          <td class="title">活動成員</td>
          <td colspan="3">
            <span v-if="list.memberArray?.length">{{ members }}</span>
          </td>
        </tr>
        <tr>
          <td class="title">活動人數</td>
          <td colspan="3">
            <span v-if="list.memberArray?.length">{{ userCounts }}</span>
          </td>
        </tr>
        <tr>
          <td class="title">器具設備</td>
          <td colspan="3">{{ list.device }}</td>
        </tr>
        <tr>
          <td class="title">帶領者</td>
          <td colspan="3">
            <v-row class="ma-0">
              <v-col class="pa-0">{{ list.leader }}</v-col>
              <v-col class="title pa-0">協助者</v-col>
              <v-col class="pa-0">{{ list.helper }}</v-col>
            </v-row>
          </td>
        </tr>

        <tr>
          <td colspan="4" class="text-center font-weight-bold section-header">
            <h2 class="text-h6 mb-0">活動時間表</h2>
          </td>
        </tr>
        <tr>
          <td colspan="2" class="title">活動時間</td>
          <td colspan="2" class="title">活動內容</td>
        </tr>
        <tr v-for="(schedule, index) in list.scheduleArray" :key="index">
          <td colspan="2">{{ schedule.time }}</td>
          <td colspan="2">{{ schedule.content }}</td>
        </tr>

        <tr>
          <td class="title">活動說明</td>
          <td colspan="3">{{ list.explanation }}</td>
        </tr>

        <tr>
          <td class="title">活動檢討與建議</td>
          <td colspan="3">{{ list.suggest }}</td>
        </tr>

        <tr v-if="list.picItems?.length">
          <td colspan="4" class="text-center font-weight-bold section-header">
            <h2 class="text-h6 mb-0">活動照片</h2>
          </td>
        </tr>

        <tr v-if="list.picItems?.length">
          <td colspan="4">
            <v-row class="ma-0">
              <v-col
                v-for="(item, index) in list.picItems"
                :key="getPicName(item) || index"
                cols="12"
                sm="4"
                class="pa-2"
              >
                <img
                  :src="`${baseUrl}/upload/activity/${getPicName(item)}`"
                  style="width: 100%; height: auto; display: block"
                  alt="活動照片"
                />
              </v-col>
            </v-row>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const route = useRoute()
const store = useStore()

const cData = ref(store.state.cData || {})
const list = ref({})
const picItems = ref([])

const baseUrl = computed(() => store.state.base_url)

const getPicName = (item) => {
  // 支援兩種資料格式：字串或物件
  if (typeof item === 'string') {
    return item
  }
  if (item && typeof item === 'object') {
    return item.picName || item
  }
  return item
}

const members = computed(() => {
  if (!list.value.memberArray?.length) return ''
  return list.value.memberArray
    .map((member) => member.text)
    .join('、')
})

const userCounts = computed(() => {
  if (!list.value.memberArray?.length) return ''
  const men = list.value.memberArray.filter((item) => item.sex === '男').length
  const women = list.value.memberArray.filter((item) => item.sex === '女').length
  return `總人數:${list.value.memberArray.length}人, 男:${men}人, 女:${women}人`
})

const getPic = async () => {
  if (!list.value.snkey) return
  // 如果 list.picItems 已經有資料，就不需要再從服務器獲取
  if (list.value.picItems?.length) return
  
  const url = `general/getPicBySnkey/${store.state.databaseName}/activity/activity/${list.value.snkey}`
  const rs = await api.options(url)
  if (rs?.state === 1 && Array.isArray(rs.picArray)) {
    picItems.value = rs.picArray
    list.value.picItems = rs.picArray
  }
}

onMounted(() => {
  if (route.query.data) {
    try {
      list.value = JSON.parse(route.query.data)
      getPic()
    } catch (error) {
      console.error('解析列印資料失敗:', error)
    }
  }
})
</script>

<style scoped lang="scss">
.activityprint {
  padding: 16px;

  .title {
    font-weight: bold;
    white-space: nowrap;
    background-color: #f5f5f5;
    padding: 8px 12px;
    border: 1px solid #ddd;
  }

  .section-header {
    background-color: #e0e0e0;
    padding: 12px;
    border: 1px solid #bbb;
  }

  .print-table {
    border-collapse: collapse;
    width: 100%;

    td {
      font-size: 1rem;
      padding: 8px 12px;
      border: 1px solid #ddd;
      vertical-align: top;
    }

    tr:not(:last-child) td {
      border-bottom: 1px solid #ddd;
    }
  }

  @media print {
    padding: 0;

    .title {
      font-weight: bold;
      white-space: nowrap;
      background-color: #f5f5f5 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .section-header {
      background-color: #e0e0e0 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .print-table {
      td {
        font-size: 1rem;
        padding: 6px 10px;
        border: 1px solid #000 !important;
      }
    }

    @page {
      size: A4 portrait;
      margin: 1cm;
    }
  }
}
</style>