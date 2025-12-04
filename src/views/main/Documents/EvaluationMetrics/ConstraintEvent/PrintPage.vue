<template>
  <div class="constraint-event-print">
    <v-container fluid class="pa-6">
      <v-sheet class="constraint-event-print__header mb-6" rounded="lg">
        <v-row class="pa-4" align="center">
          <v-col cols="12" md="4">
            <h3 class="text-h5 font-weight-bold mb-1">{{ companyName }}</h3>
            <p class="text-body-2 mb-0">日間照護約束登記列印</p>
          </v-col>
          <v-col cols="12" md="4" class="text-center">
            <div class="d-flex align-center justify-space-between">
              <div class="text-h6 font-weight-bold">{{ month }}月</div>
              <h1 class="text-h4 font-weight-black mb-0">身體約束情況登記表</h1>
              <div></div>
            </div>
          </v-col>
          <v-col cols="12" md="4" class="text-right">
            <div class="text-body-2">
              列印日期：{{ today }}
            </div>
          </v-col>
        </v-row>
      </v-sheet>

      <!-- 標題表格 -->
      <v-table class="constraint-event-print__table mb-6" density="comfortable">
        <thead>
          <tr>
            <th class="text-center">約束理由</th>
            <th class="text-center">代號</th>
            <th class="text-center">身體約束設備</th>
            <th class="text-center">代號</th>
            <th class="text-center">身體約束部位</th>
            <th class="text-center">代號</th>
            <th class="text-center">每日身體約束持續時間</th>
            <th class="text-center">代號</th>
            <th class="text-center">身體約束開始時間</th>
            <th class="text-center">代號</th>
            <th class="text-center">解除身體約束原因</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in titleTableDatas" :key="index">
            <td class="text-center pa-2">{{ item.reason || '—' }}</td>
            <td class="text-center pa-2">{{ item.reasonCode || '—' }}</td>
            <td class="text-center pa-2">{{ item.equipment || '—' }}</td>
            <td class="text-center pa-2">{{ item.equipmentCode || '—' }}</td>
            <td class="text-center pa-2">{{ item.part || '—' }}</td>
            <td class="text-center pa-2">{{ item.partCode || '—' }}</td>
            <td class="text-center pa-2">{{ item.hour || '—' }}</td>
            <td class="text-center pa-2">{{ item.hourCode || '—' }}</td>
            <td class="text-center pa-2">{{ item.zone || '—' }}</td>
            <td class="text-center pa-2">{{ item.zoneCode || '—' }}</td>
            <td class="text-center pa-2">{{ item.freereason || '—' }}</td>
          </tr>
        </tbody>
      </v-table>

      <!-- 資料表格 -->
      <v-table v-if="constrainteventItems.length" class="constraint-event-print__table" density="comfortable">
        <thead>
          <tr>
            <th class="text-center">編號</th>
            <th class="text-center">姓名</th>
            <th class="text-center">床號</th>
            <th class="text-center">開始時間</th>
            <th class="text-center">約束理由</th>
            <th class="text-center">約束設備</th>
            <th class="text-center">約束部位</th>
            <th class="text-center">持續時間</th>
            <th class="text-center">開始時間</th>
            <th class="text-center">解除日期</th>
            <th class="text-center">解除原因</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in constrainteventItems" :key="index">
            <td class="text-center pa-2">{{ index + 1 }}</td>
            <td class="text-center pa-2">{{ item.userData?.name || '—' }}</td>
            <td class="text-center pa-2">{{ item.bedData?.name || '—' }}</td>
            <td class="text-center pa-2">{{ item.Date || '—' }}</td>
            <td class="text-center pa-2">{{ item.reasonCode || '—' }}</td>
            <td class="text-center pa-2">{{ formatArray(item.equipmentCode) }}</td>
            <td class="text-center pa-2">{{ formatArray(item.partCode) }}</td>
            <td class="text-center pa-2">{{ item.hourCode || '—' }}</td>
            <td class="text-center pa-2">{{ formatArray(item.zoneCode) }}</td>
            <td class="text-center pa-2">{{ item.releaseOKDate || '—' }}</td>
            <td class="text-center pa-2">{{ item.freereason || '—' }}</td>
          </tr>
        </tbody>
      </v-table>

      <div v-else class="text-center text-medium-emphasis py-8">
        目前沒有約束資料。
      </div>
    </v-container>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/assets/js/api.js'

const route = useRoute()

const cData = ref({})
const constrainteventItems = ref([])

const titleTableDatas = [
  { reason: '預防跌倒', reasonCode: '1', equipment: '約束帶', equipmentCode: '1', part: '腰部', partCode: '1', hour: '≦4小時', hourCode: '1', zone: '白班', zoneCode: '1', freereason: '認知改善' },
  { reason: '預防自拔管路', reasonCode: '2', equipment: '約束背心', equipmentCode: '2', part: '足踝', partCode: '2R、2L', hour: '>4小時 ≦8小時', hourCode: '2', zone: '小夜', zoneCode: '2', freereason: '情緒穩定' },
  { reason: '預防自傷', reasonCode: '3', equipment: '手套', equipmentCode: '3', part: '手腕', partCode: '3R、3L', hour: '>8小時 ≦24小時', hourCode: '3', zone: '大夜', zoneCode: '3', freereason: '病情惡化' },
  { reason: '行為紊亂', reasonCode: '4', equipment: '餐板', equipmentCode: '4', part: '膝部', partCode: '4R、4L', hour: '>24小時', hourCode: '4', zone: '', zoneCode: '', freereason: '死亡' },
  { reason: '協助治療(短期)', reasonCode: '5', equipment: '其他', equipmentCode: '5', part: '軀幹', partCode: '5', hour: '', hourCode: '', zone: '', zoneCode: '', freereason: '其他' },
  { reason: '其他', reasonCode: '6', equipment: '', equipmentCode: '', part: '其他', partCode: '5', hour: '', hourCode: '', zone: '', zoneCode: '', freereason: '' },
]

const today = computed(() => dayjs().format('YYYY/MM/DD'))
const companyName = computed(() => cData.value?.company_name ?? '日間照護中心')
const month = computed(() => route.params.month || dayjs().format('M'))

const returnZone = (val) => {
  if (!val || !Array.isArray(val)) return []
  const replacements = {
    '白班': '1',
    '小夜': '2',
    '大夜': '3',
  }
  return val.map(item => replacements[item] || item)
}

const returnPart = (val) => {
  if (!val || !Array.isArray(val)) return []
  const replacements = {
    '腰部': '1',
    '足踝-右': '2R',
    '足踝-左': '2L',
    '手腕-右': '3R',
    '手腕-左': '3L',
    '膝部-右': '4R',
    '膝部-左': '4L',
    '軀幹': '5',
    '其他': '5',
  }
  let rs = val.map(i => {
    if (i.part && Array.isArray(i.part)) {
      return i.part.map(item => replacements[item] || item)
    }
    return []
  })
  rs = [...new Set(rs.flat())]
  rs = rs.sort((a, b) => a > b ? 1 : -1)
  return rs
}

const returnEquipment = (val) => {
  if (!val || !Array.isArray(val)) return []
  const replacements = {
    '約束帶': '1',
    '約束背心': '2',
    '手套': '3',
    '餐板': '4',
    '其他': '5',
  }
  let rs = val.map(i => {
    if (i.equipment && Array.isArray(i.equipment)) {
      return i.equipment.map(item => replacements[item] || item)
    }
    return []
  })
  rs = [...new Set(rs.flat())]
  rs = rs.sort((a, b) => a > b ? 1 : -1)
  return rs
}

const returnSingleMatch = (val, key) => {
  if (!val) return '無符合項目'
  const match = titleTableDatas.find(i => i[key] === val)
  if (match) {
    return match[key + 'Code']
  }
  return '無符合項目'
}

const formatArray = (val) => {
  if (!val) return '—'
  if (Array.isArray(val)) {
    return val.length > 0 ? val.join(', ') : '—'
  }
  return val.toString()
}

onMounted(async () => {
  try {
    const cDataStr = sessionStorage.getItem('cData')
    if (cDataStr) {
      cData.value = JSON.parse(cDataStr)
    }

    // 取得床位資料
    const bedItems = await api.get('bed')
    const bedMaps = new Map()
    if (bedItems && bedItems.length) {
      bedItems.forEach(i => {
        bedMaps.set(i.u_snkey, i)
      })
    }

    // 取得約束事件資料
    const constrainteventResponse = await api.get('constraintevent')
    if (constrainteventResponse && constrainteventResponse.length) {
      constrainteventItems.value = constrainteventResponse
        .map(i => {
          const parsed = JSON.parse(i.datalist || '{}')
          return {
            ...parsed,
            snkey: i.snkey,
          }
        })
        .map(i => ({
          ...i,
          reasonCode: returnSingleMatch(i.reason, 'reason'),
          equipmentCode: i.equipmentArrs ? returnEquipment(i.equipmentArrs) : '無符合項目',
          partCode: i.equipmentArrs ? returnPart(i.equipmentArrs) : '無符合項目',
          hourCode: returnSingleMatch(i.hour, 'hour'),
          zoneCode: returnZone(i.zone),
          bedData: bedMaps.get(i.userData?.snkey),
        }))
    } else {
      constrainteventItems.value = []
    }
  } catch (error) {
    console.error('PrintPage initialization error:', error)
    constrainteventItems.value = []
  }
})
</script>

<style lang="scss" scoped>
.constraint-event-print {
  &__header {
    border: 1px solid #000;
  }

  &__table {
    :deep(thead) {
      th {
        font-size: 1.1rem;
        font-weight: 600;
        border: 1px solid #000;
        padding: 12px 8px;
        font-family: '微軟正黑體';
        background-color: #f5f5f5;
      }
    }

    :deep(tbody) {
      td {
        font-size: 0.95rem;
        border: 1px solid #000;
        vertical-align: middle;
      }
    }
  }
}
</style>
