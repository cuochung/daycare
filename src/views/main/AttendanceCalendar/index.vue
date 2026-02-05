<template>
  <div class="attendance-calendar">
    <v-container fluid class="pa-2">
      <!-- Toolbar: title, month nav, drawer toggle -->
      <v-row>
        <v-col cols="12">
          <v-sheet class="attendance-hero" rounded="xl" elevation="0">
            <div class="d-flex flex-column flex-md-row justify-space-between align-center flex-wrap ga-3">
              <div class="d-flex align-center">
                <v-avatar size="48" color="primary" variant="tonal" class="mr-3">
                  <v-icon color="primary">mdi-calendar-month</v-icon>
                </v-avatar>
                <div>
                  <h2 class="text-h6 font-weight-bold mb-0">出席一覽</h2>
                  <p class="text-body-2 text-medium-emphasis mb-0">月曆排班與住民服務項目設定</p>
                </div>
              </div>
              <div class="d-flex align-center ga-2">
                <v-btn icon variant="text" @click="prevMonth" :disabled="loading">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <span class="text-h6 font-weight-medium min-width-120 text-center">{{ displayMonth }}</span>
                <v-btn icon variant="text" @click="nextMonth" :disabled="loading">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
                <v-btn
                  class="d-md-none"
                  variant="outlined"
                  color="primary"
                  prepend-icon="mdi-menu"
                  @click="drawerLeft = !drawerLeft"
                >
                  住民排班清單
                </v-btn>
              </div>
            </div>
          </v-sheet>
        </v-col>
      </v-row>

      <!-- API 取得結果標籤（2026-02 查詢條件與內容） -->
      <v-row v-if="selectedMonth === '2026-02'" class="mt-2">
        <v-col cols="12">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-chip size="small" color="info" class="mr-2">API 查詢 2026-02</v-chip>
                <v-chip size="small" variant="outlined">start: {{ firstDayOfMonth }}, end: {{ lastDayOfMonth }}</v-chip>
                <v-chip size="small" variant="outlined" class="ml-2">取得 {{ scheduleList.length }} 筆</v-chip>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="d-flex flex-wrap ga-2 pa-2">
                  <template v-if="scheduleList.length">
                    <v-chip
                      v-for="(row, idx) in scheduleList"
                      :key="row.snkey || idx"
                      size="small"
                      variant="outlined"
                      color="primary"
                    >
                      {{ getScheduleChipLabel(row) }}
                    </v-chip>
                  </template>
                  <v-chip v-else size="small" color="grey" variant="tonal">尚無資料</v-chip>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <v-row>
        <!-- Left Drawer: resident schedule list -->
        <v-col cols="12" md="4" lg="3" class="d-none d-md-block">
          <v-sheet class="drawer-sheet" rounded="xl" elevation="0">
            <v-toolbar color="transparent" flat density="compact" class="px-3">
              <v-toolbar-title class="d-flex align-center text-subtitle-1">
                <v-icon color="primary" class="mr-2">mdi-account-multiple</v-icon>
                指定月份住民排班
              </v-toolbar-title>
            </v-toolbar>
            <v-divider />
            <v-card-text class="py-2">
              <v-text-field
                v-model="searchKey"
                label="搜尋住民"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-magnify"
                hide-details
                clearable
                class="mb-3"
              />
            </v-card-text>
            <v-divider />
            <div class="drawer-list-wrapper pa-3">
              <template v-if="filteredList.length">
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="item in filteredList"
                    :key="`${item.user_snkey}-${item.snkey}`"
                    class="drawer-list-item mb-3"
                    lines="four"
                    rounded
                    variant="tonal"
                  >
                    <div class="drawer-item-inner w-100">
                      <div class="d-flex align-center mb-1">
                        <v-avatar color="primary-lighten-5" size="40" class="mr-2 shrink-0">
                          <v-icon color="primary" size="20">mdi-account</v-icon>
                        </v-avatar>
                        <span class="font-weight-medium text-body-2">{{ item.name || '未命名' }}</span>
                      </div>
                      <ul class="drawer-schedule-list ma-0 pl-4 text-caption">
                        <li v-if="item.start_date">開始：{{ formatDate(item.start_date) }}</li>
                        <li>{{ scheduleTypeLabel(item.schedule_type) }} · {{ item.day_type === 'full' ? '全日' : '半日' }}</li>
                        <li v-if="item.weekdaysDisplay">{{ item.weekdaysDisplay }}</li>
                      </ul>
                    </div>
                  </v-list-item>
                </v-list>
              </template>
              <div v-else class="drawer-empty text-center py-8">
                <v-icon color="grey" size="48" class="mb-2">mdi-database-search</v-icon>
                <p class="text-body-2 text-medium-emphasis mb-0">查無符合的住民排班資料</p>
                <p class="text-caption text-disabled mt-1">請確認月份或至病歷管理設定排班</p>
              </div>
            </div>
          </v-sheet>
        </v-col>

        <!-- Main: Calendar -->
        <v-col cols="12" md="8" lg="9">
          <v-sheet class="calendar-sheet" rounded="xl" elevation="0">
            <div class="calendar-grid">
              <div class="calendar-weekdays">
                <div v-for="w in 7" :key="w" class="weekday-cell">{{ weekdayLabelNum(w) }}</div>
              </div>
              <div class="calendar-days">
                <div
                  v-for="cell in calendarCells"
                  :key="cell.key"
                  class="day-cell"
                  :class="{ 'day-other-month': !cell.isCurrentMonth, 'day-clickable': cell.isCurrentMonth }"
                  @click="cell.isCurrentMonth && openDayDetail(cell.dateStr)"
                >
                  <div class="day-num">{{ cell.day }}</div>
                  <div v-if="cell.stats && (cell.stats.am || cell.stats.pm)" class="day-stats text-caption">
                    <span v-if="cell.stats.am">AM {{ cell.stats.am }}</span>
                    <span v-if="cell.stats.am && cell.stats.pm"> · </span>
                    <span v-if="cell.stats.pm">PM {{ cell.stats.pm }}</span>
                  </div>
                </div>
              </div>
            </div>
          </v-sheet>
        </v-col>
      </v-row>

      <!-- Mobile Drawer -->
      <v-navigation-drawer v-model="drawerLeft" temporary location="left" class="d-md-none">
        <v-toolbar color="transparent" flat density="compact">
          <v-toolbar-title>指定月份住民排班</v-toolbar-title>
        </v-toolbar>
        <v-divider />
        <v-card-text class="py-2">
          <v-text-field
            v-model="searchKey"
            label="搜尋住民"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            hide-details
            clearable
          />
        </v-card-text>
        <v-divider />
        <div class="drawer-list-wrapper pa-3" style="max-height: 60vh; overflow-y: auto">
          <template v-if="filteredList.length">
            <v-list density="compact" class="pa-0">
              <v-list-item
                v-for="item in filteredList"
                :key="`${item.user_snkey}-${item.snkey}`"
                class="mb-3"
                lines="four"
                rounded
                variant="tonal"
              >
                <div class="drawer-item-inner w-100">
                  <div class="d-flex align-center mb-1">
                    <v-avatar color="primary-lighten-5" size="40" class="mr-2 shrink-0">
                      <v-icon color="primary" size="20">mdi-account</v-icon>
                    </v-avatar>
                    <span class="font-weight-medium text-body-2">{{ item.name || '未命名' }}</span>
                  </div>
                  <ul class="drawer-schedule-list ma-0 pl-4 text-caption">
                    <li v-if="item.start_date">開始：{{ formatDate(item.start_date) }}</li>
                    <li>{{ scheduleTypeLabel(item.schedule_type) }} · {{ item.day_type === 'full' ? '全日' : '半日' }}</li>
                    <li v-if="item.weekdaysDisplay">{{ item.weekdaysDisplay }}</li>
                  </ul>
                </div>
              </v-list-item>
            </v-list>
          </template>
          <div v-else class="text-center py-8">
            <v-icon color="grey" size="48" class="mb-2">mdi-database-search</v-icon>
            <p class="text-body-2 text-medium-emphasis mb-0">查無符合的住民排班資料</p>
          </div>
        </div>
      </v-navigation-drawer>
    </v-container>

    <ResidentScheduleDialog ref="residentScheduleDialogRef" @saved="fetchScheduleData" />

    <!-- 當日詳情 Dialog -->
    <v-dialog v-model="dayDetailDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-calendar-today</v-icon>
          {{ dayDetailDate ? dayjs(dayDetailDate).format('YYYY年M月D日') : '' }} 可排住民
          <v-spacer />
          <v-btn icon variant="text" @click="dayDetailDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-list v-if="dayDetailList.length" density="compact" lines="two">
            <v-list-item v-for="item in dayDetailList" :key="`${item.user_snkey}-${item.snkey}`">
              <template #prepend>
                <v-avatar color="primary-lighten-5" size="36">
                  <v-icon color="primary" size="18">mdi-account</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title>{{ item.name || '未命名' }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ scheduleTypeLabel(item.schedule_type) }} · {{ item.day_type === 'full' ? '全日' : '半日' }}
              </v-list-item-subtitle>
              <template #append>
                <v-btn icon size="small" variant="text" color="primary" @click="openEdit(item)">
                  <v-icon size="small">mdi-pencil</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
          <div v-else class="text-center py-6 text-medium-emphasis">
            當日無符合條件的住民
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

import api from '@/assets/js/api'
import { useStore } from '@/stores/useStore'
import { CARE_FEE_SCHEDULE_OPTIONS, WEEKDAY_LABELS } from '@/assets/js/careFeeOptions'
import ResidentScheduleDialog from '@/components/ResidentScheduleDialog.vue'

dayjs.locale('zh-tw')

const store = useStore()
const residentScheduleDialogRef = ref(null)
const drawerLeft = ref(false)
const searchKey = ref('')
const loading = ref(false)
const dayDetailDialog = ref(false)
const dayDetailDate = ref('')

const selectedMonth = ref(dayjs().format('YYYY-MM'))
const scheduleList = ref([])
const userMap = ref({})

const db = computed(() => store.state.databaseName)

const displayMonth = computed(() => dayjs(selectedMonth.value + '-01').format('YYYY年M月'))

const firstDayOfMonth = computed(() =>
  dayjs(selectedMonth.value + '-01').startOf('month').format('YYYY-MM-DD')
)
const lastDayOfMonth = computed(() =>
  dayjs(selectedMonth.value + '-01').endOf('month').format('YYYY-MM-DD')
)

function scheduleTypeLabel(code) {
  const opt = CARE_FEE_SCHEDULE_OPTIONS.find((o) => o.code === code)
  return opt ? opt.label : code
}

function formatDate(str) {
  if (!str) return ''
  const d = dayjs(str)
  return d.isValid() ? d.format('YYYY/MM/DD') : str
}

function getScheduleChipLabel(row) {
  let parsed = {}
  try {
    parsed = typeof row.datalist === 'string' ? JSON.parse(row.datalist || '{}') : row.datalist || {}
  } catch {}
  const sd = parsed.start_date || parsed.month || ''
  const name = userMap.value[String(parsed.user_snkey ?? '')]?.name || parsed.user_snkey || '?'
  return `${name} | start: ${sd || '--'}`
}

function weekdaysToDisplay(weekdaysStr) {
  if (!weekdaysStr) return ''
  const arr = weekdaysStr.split(',').map((n) => parseInt(n, 10)).filter(Boolean)
  return arr.map((d) => WEEKDAY_LABELS[d] || `週${d}`).join('、')
}

const mergedList = computed(() => {
  const list = []
  for (const row of scheduleList.value) {
    let parsed = {}
    try {
      parsed = typeof row.datalist === 'string' ? JSON.parse(row.datalist || '{}') : row.datalist || {}
    } catch {
      continue
    }
    const userSnkey = String(parsed.user_snkey ?? '')
    const userInfo = userMap.value[userSnkey] || {}
    list.push({
      snkey: row.snkey,
      user_snkey: userSnkey,
      name: userInfo.name || '未命名',
      p_code: userInfo.p_code,
      schedule_type: parsed.schedule_type || '',
      weekdays: parsed.weekdays || '',
      weekdaysDisplay: weekdaysToDisplay(parsed.weekdays),
      day_type: parsed.day_type || 'full',
      quota_type: parsed.quota_type || 'month',
      start_date: parsed.start_date || parsed.month || '',
      datalist: row.datalist,
    })
  }
  return list
})

// 左側住民排班清單：只顯示 start_date 落在當月內的排班
const sliderList = computed(() => {
  const first = firstDayOfMonth.value
  const last = lastDayOfMonth.value
  return mergedList.value.filter((item) => {
    const sd = item.start_date || ''
    if (!sd) return false
    return dayjs(sd).isSameOrBefore(last) && dayjs(sd).isSameOrAfter(first)
  })
})

const keywordTokens = computed(() =>
  searchKey.value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.toUpperCase())
)

const filteredList = computed(() => {
  if (!keywordTokens.value.length) return sliderList.value
  return sliderList.value.filter((item) => {
    const str = JSON.stringify(item).toUpperCase()
    return keywordTokens.value.every((k) => str.includes(k))
  })
})

const dayDetailList = computed(() => {
  if (!dayDetailDate.value) return []
  const d = dayjs(dayDetailDate.value)
  const weekday = d.day() === 0 ? 7 : d.day()
  return mergedList.value.filter((item) => {
    const startDate = item.start_date || ''
    if (!startDate || dayjs(startDate).isAfter(d)) return false
    const weekdays = (item.weekdays || '').split(',').map((n) => parseInt(n, 10)).filter(Boolean)
    return weekdays.includes(weekday)
  })
})

function weekdayLabelNum(n) {
  const map = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '日' }
  return map[n] ?? ''
}

const calendarCells = computed(() => {
  const y = parseInt(selectedMonth.value.split('-')[0], 10)
  const m = parseInt(selectedMonth.value.split('-')[1], 10)
  const first = dayjs(`${y}-${String(m).padStart(2, '0')}-01`)
  const startPad = (first.day() === 0 ? 7 : first.day()) - 1
  const daysInMonth = first.daysInMonth()
  const prevMonth = first.subtract(1, 'month')
  const prevDays = prevMonth.daysInMonth()
  const cells = []
  for (let i = 0; i < startPad; i++) {
    const d = prevDays - startPad + i + 1
    const dateStr = prevMonth.date(d).format('YYYY-MM-DD')
    cells.push({
      key: `p-${d}`,
      day: d,
      dateStr,
      isCurrentMonth: false,
      stats: getDayStatsFromDate(dateStr),
    })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({
      key: `c-${d}`,
      day: d,
      dateStr,
      isCurrentMonth: true,
      stats: getDayStatsFromDate(dateStr),
    })
  }
  const remain = 42 - cells.length
  const nextMonth = first.add(1, 'month')
  for (let i = 0; i < remain; i++) {
    const d = i + 1
    const dateStr = nextMonth.date(d).format('YYYY-MM-DD')
    cells.push({
      key: `n-${d}`,
      day: d,
      dateStr,
      isCurrentMonth: false,
      stats: getDayStatsFromDate(dateStr),
    })
  }
  return cells
})

function getDayStatsFromDate(dateStr) {
  const d = dayjs(dateStr)
  const weekday = d.day() === 0 ? 7 : d.day()
  let am = 0
  let pm = 0
  for (const item of mergedList.value) {
    const startDate = item.start_date || ''
    if (!startDate || dayjs(startDate).isAfter(d)) continue
    const weekdays = (item.weekdays || '').split(',').map((n) => parseInt(n, 10)).filter(Boolean)
    if (!weekdays.includes(weekday)) continue
    if (item.day_type === 'full') {
      am++
      pm++
    } else {
      am++
      pm++
    }
  }
  if (am === 0 && pm === 0) return null
  return { am, pm }
}

function prevMonth() {
  selectedMonth.value = dayjs(selectedMonth.value + '-01').subtract(1, 'month').format('YYYY-MM')
}

function nextMonth() {
  selectedMonth.value = dayjs(selectedMonth.value + '-01').add(1, 'month').format('YYYY-MM')
}

async function fetchUsers() {
  try {
    const users = await api.get('user')
    const map = {}
    for (const u of users || []) {
      let data = {}
      try {
        data = typeof u.datalist === 'string' ? JSON.parse(u.datalist || '{}') : u.datalist || {}
      } catch {}
      map[String(u.snkey)] = { name: data.name || '未命名', p_code: data.p_code }
    }
    userMap.value = map
  } catch (e) {
    console.error('fetchUsers error:', e)
    store.showToastMulti({ type: 'error', message: '取得住民資料失敗', closeTime: 3 })
  }
}

async function fetchScheduleData() {
  loading.value = true
  try {
    const raw = await api.options(
      `byjson/getZoneData/${db.value}/resident_schedule`,
      { key: 'start_date', start: firstDayOfMonth.value, end: lastDayOfMonth.value }
    )
    scheduleList.value = Array.isArray(raw) ? raw : raw?.data ?? raw?.list ?? []
  } catch (e) {
    console.warn('getZoneData failed, fallback to api.get:', e)
    try {
      const all = await api.get('resident_schedule') || []
      const first = firstDayOfMonth.value
      const last = lastDayOfMonth.value
      scheduleList.value = all.filter((row) => {
        let parsed = {}
        try {
          parsed = typeof row.datalist === 'string' ? JSON.parse(row.datalist || '{}') : row.datalist || {}
        } catch {
          return false
        }
        const sd = parsed.start_date || parsed.month || ''
        if (!sd) return false
        return dayjs(sd).isSameOrAfter(first) && dayjs(sd).isSameOrBefore(last)
      })
    } catch (e2) {
      console.error('fetchScheduleData error:', e2)
      scheduleList.value = []
      store.showToastMulti({ type: 'error', message: '取得排班資料失敗', closeTime: 3 })
    }
  } finally {
    loading.value = false
  }
}

function openEdit(item) {
  residentScheduleDialogRef.value?.open(item.user_snkey, item.name)
  drawerLeft.value = false
}

function openDayDetail(dateStr) {
  dayDetailDate.value = dateStr
  dayDetailDialog.value = true
}

watch(selectedMonth, () => {
  fetchScheduleData()
}, { immediate: false })

onMounted(async () => {
  await fetchUsers()
  await fetchScheduleData()
})
</script>

<style scoped>
.attendance-hero {
  padding: 1rem 1.5rem;
}
.drawer-sheet {
  padding-bottom: 1rem;
}
.drawer-list-wrapper {
  max-height: 60vh;
  overflow-y: auto;
}
.drawer-schedule-list {
  list-style: none;
}
.drawer-schedule-list li {
  margin-bottom: 0.25rem;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.calendar-weekdays {
  display: contents;
}
.weekday-cell {
  padding: 0.5rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
}
.calendar-days {
  display: contents;
}
.day-cell {
  min-height: 80px;
  padding: 0.5rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
}
.day-other-month {
  opacity: 0.5;
  background: rgba(0, 0, 0, 0.02);
}
.day-clickable {
  cursor: pointer;
}
.day-clickable:hover {
  background: rgba(var(--v-theme-primary), 0.08);
}
.day-num {
  font-weight: 600;
  font-size: 0.9rem;
}
.day-stats {
  margin-top: 0.25rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}
</style>
