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
              <v-btn
                block
                color="primary"
                variant="tonal"
                prepend-icon="mdi-calendar-sync"
                :loading="building"
                :disabled="loading || !sliderList.length"
                class="mb-2"
                @click="buildAttendanceSchedule"
              >
                依當月住民建構出席資訊
              </v-btn>
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
                    clickable
                    @click="openEdit(item)"
                  >
                    <div class="drawer-item-inner w-100">
                      <div class="d-flex align-center mb-1">
                        <v-avatar color="primary-lighten-5" size="40" class="mr-2 shrink-0">
                          <v-icon color="primary" size="20">mdi-account</v-icon>
                        </v-avatar>
                        <span class="font-weight-medium text-body-2">{{ item.name || '未命名' }}</span>
                        <v-spacer />
                        <v-btn
                          size="small"
                          variant="tonal"
                          color="primary"
                          density="compact"
                          :loading="buildingForSnkey === item.snkey"
                          :disabled="!!building || !!buildingForSnkey"
                          @click.stop="buildAttendanceScheduleForResident(item)"
                        >
                          <v-icon size="small" start>mdi-calendar-plus</v-icon>
                          建構出席
                        </v-btn>
                        <v-btn v-show="false" icon size="small" variant="text" color="primary" density="compact" @click.stop="openEdit(item)">
                          <v-icon size="small">mdi-pencil</v-icon>
                        </v-btn>
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
                  :class="{
                    'day-other-month': !cell.isCurrentMonth,
                    'day-clickable': cell.isCurrentMonth,
                    'day-over-capacity': (cell.stats?.am?.total ?? 0) > 28 || (cell.stats?.pm?.total ?? 0) > 28
                  }"
                  @click="cell.isCurrentMonth && openDayDetail(cell.dateStr)"
                >
                  <div class="day-num">{{ cell.day }}</div>
                  <div v-if="cell.stats && (cell.stats.am?.total || cell.stats.pm?.total)" class="day-stats text-caption">
                    <span v-if="cell.stats.am?.total">上午 {{ cell.stats.am.total }}/{{ cell.stats.am.checkedIn ?? 0 }}</span>
                    <span v-if="cell.stats.am?.total && cell.stats.pm?.total"> · </span>
                    <span v-if="cell.stats.pm?.total">下午 {{ cell.stats.pm.total }}/{{ cell.stats.pm.checkedIn ?? 0 }}</span>
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
          <v-btn
            block
            color="primary"
            variant="tonal"
            prepend-icon="mdi-calendar-sync"
            :loading="building"
            :disabled="loading || !sliderList.length"
            class="mb-2"
            @click="buildAttendanceSchedule"
          >
            依當月住民建構出席資訊
          </v-btn>
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
                clickable
                @click="openEdit(item)"
              >
                <div class="drawer-item-inner w-100">
                  <div class="d-flex align-center mb-1">
                    <v-avatar color="primary-lighten-5" size="40" class="mr-2 shrink-0">
                      <v-icon color="primary" size="20">mdi-account</v-icon>
                    </v-avatar>
                    <span class="font-weight-medium text-body-2">{{ item.name || '未命名' }}</span>
                    <v-spacer />
                    <v-btn
                      size="small"
                      variant="tonal"
                      color="primary"
                      density="compact"
                      :loading="buildingForSnkey === item.snkey"
                      :disabled="!!building || !!buildingForSnkey"
                      @click.stop="buildAttendanceScheduleForResident(item)"
                    >
                      <v-icon size="small" start>mdi-calendar-plus</v-icon>
                      建構出席
                    </v-btn>
                    <v-btn v-show="false" icon size="small" variant="text" color="primary" density="compact" @click.stop="openEdit(item)">
                      <v-icon size="small">mdi-pencil</v-icon>
                    </v-btn>
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

    <!-- 當日詳情 Dialog（attendance_schedule）— 上午/下午分區、全部可編輯 -->
    <v-dialog v-model="dayDetailDialog" max-width="90vw" persistent scrollable class="day-detail-dialog">
      <v-card class="day-detail-card" elevation="8" rounded="xl">
        <v-card-title class="day-detail-header d-flex align-center">
          <v-avatar color="primary" size="40" variant="tonal" class="mr-3">
            <v-icon>mdi-calendar-check</v-icon>
          </v-avatar>
          <div>
            <span class="text-h6 font-weight-bold">{{ dayDetailDate ? dayjs(dayDetailDate).format('YYYY年M月D日') : '' }}</span>
            <span v-if="dayDetailDate" class="text-h6 font-weight-bold ml-2 text-medium-emphasis">{{ dayjs(dayDetailDate).format('dddd') }}</span>
            <span class="text-body-2 d-block text-medium-emphasis">出席紀錄</span>
          </div>
          <v-spacer />
          <v-btn color="primary" variant="flat" :loading="savingDayDetail" @click="saveAllDayDetail">
            <v-icon start>mdi-content-save</v-icon>
            儲存全部
          </v-btn>
          <v-btn icon variant="text" class="ml-2" @click="dayDetailDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="day-detail-body">
          <template v-if="dayDetailEditItems.length">
            <!-- 上午時段 -->
            <v-sheet class="day-detail-section day-detail-section-am rounded-xl pa-4 mb-4" elevation="1">
              <div class="day-detail-section-title day-detail-section-title-am d-flex align-center pa-2 rounded-lg mb-3">
                <v-avatar size="36" color="amber" variant="tonal" class="mr-2">
                  <v-icon>mdi-weather-sunny</v-icon>
                </v-avatar>
                <span class="text-subtitle-1 font-weight-bold">上午</span>
              </div>
              <v-table density="comfortable" class="day-detail-table day-detail-table-am rounded-lg overflow-hidden mb-0" elevation="0">
                <thead>
                  <tr>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:90px">姓名</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:100px">已簽到</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:150px">到機構時間</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:80px">體溫</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:80px">脈搏</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:110px">血壓</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:80px">血氧</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:80px">呼吸</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:100px">吃藥</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:100px">進食</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:90px">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in dayDetailAmItems" :key="item.snkey + '-' + idx" :class="{ 'day-detail-row-alt': idx % 2 === 1 }">
                    <td class="font-weight-medium day-detail-name">{{ item.name || '未命名' }}</td>
                    <td class="day-detail-check-cell">
                      <v-checkbox v-model="item.checked_in" hide-details density="comfortable" color="primary"
                        @update:model-value="(v) => onCheckChange(item, 'checked_in', v)" />
                      <span v-if="item.checked_in && item.checked_in_time" class="text-caption d-block text-medium-emphasis">{{ item.checked_in_time }}</span>
                    </td>
                    <td class="day-detail-td-arrival"><v-text-field v-model="item.arrival_time" type="time" variant="outlined" density="comfortable" hide-details class="day-detail-input" /></td>
                    <td><v-text-field v-model="item.temperature" variant="outlined" density="comfortable" hide-details class="day-detail-input" /></td>
                    <td><v-text-field v-model="item.pulse" variant="outlined" density="comfortable" hide-details class="day-detail-input" /></td>
                    <td class="day-detail-td-blood"><v-text-field v-model="item.blood_pressure" variant="outlined" density="comfortable" hide-details placeholder="120/80" class="day-detail-input" /></td>
                    <td><v-text-field v-model="item.blood_oxygen" variant="outlined" density="comfortable" hide-details class="day-detail-input" /></td>
                    <td><v-text-field v-model="item.respiration" variant="outlined" density="comfortable" hide-details class="day-detail-input" /></td>
                    <td class="day-detail-check-cell">
                      <v-checkbox v-model="item.medicine_taken" hide-details density="comfortable" color="primary"
                        @update:model-value="(v) => onCheckChange(item, 'medicine_taken', v)" />
                      <span v-if="item.medicine_taken && item.medicine_taken_time" class="text-caption d-block text-medium-emphasis">{{ item.medicine_taken_time }}</span>
                    </td>
                    <td class="day-detail-check-cell">
                      <v-checkbox v-model="item.ate" hide-details density="comfortable" color="primary"
                        @update:model-value="(v) => onCheckChange(item, 'ate', v)" />
                      <span v-if="item.ate && item.ate_time" class="text-caption d-block text-medium-emphasis">{{ item.ate_time }}</span>
                    </td>
                    <td>
                      <v-btn size="small" variant="tonal" color="secondary" prepend-icon="mdi-calendar-arrow-right"
                        @click="openMoveToDate(item)">
                        移動
                      </v-btn>
                    </td>
                  </tr>
                  <tr v-if="!dayDetailAmItems.length">
                    <td colspan="11" class="text-center text-medium-emphasis py-4">上午無排班</td>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
            <!-- 下午時段 -->
            <v-sheet class="day-detail-section day-detail-section-pm rounded-xl pa-4" elevation="1">
              <div class="day-detail-section-title day-detail-section-title-pm d-flex align-center pa-2 rounded-lg mb-3">
                <v-avatar size="36" color="indigo" variant="tonal" class="mr-2">
                  <v-icon>mdi-weather-night</v-icon>
                </v-avatar>
                <span class="text-subtitle-1 font-weight-bold">下午</span>
              </div>
              <v-table density="comfortable" class="day-detail-table day-detail-table-pm rounded-lg overflow-hidden" elevation="0">
                <thead>
                  <tr>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:90px">姓名</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:100px">已簽到</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:150px">到機構時間</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:80px">體溫</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:80px">脈搏</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:110px">血壓</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:80px">血氧</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:80px">呼吸</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:100px">吃藥</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:100px">進食</th>
                    <th class="text-left text-nowrap day-detail-th" style="min-width:90px">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in dayDetailPmItems" :key="item.snkey + '-' + idx" :class="{ 'day-detail-row-alt': idx % 2 === 1 }">
                    <td class="font-weight-medium day-detail-name">{{ item.name || '未命名' }}</td>
                    <td class="day-detail-check-cell">
                      <v-checkbox v-model="item.checked_in" hide-details density="comfortable" color="primary"
                        @update:model-value="(v) => onCheckChange(item, 'checked_in', v)" />
                      <span v-if="item.checked_in && item.checked_in_time" class="text-caption d-block text-medium-emphasis">{{ item.checked_in_time }}</span>
                    </td>
                    <td class="day-detail-td-arrival"><v-text-field v-model="item.arrival_time" type="time" variant="outlined" density="comfortable" hide-details class="day-detail-input" /></td>
                    <td><v-text-field v-model="item.temperature" variant="outlined" density="comfortable" hide-details class="day-detail-input" /></td>
                    <td><v-text-field v-model="item.pulse" variant="outlined" density="comfortable" hide-details class="day-detail-input" /></td>
                    <td class="day-detail-td-blood"><v-text-field v-model="item.blood_pressure" variant="outlined" density="comfortable" hide-details placeholder="120/80" class="day-detail-input" /></td>
                    <td><v-text-field v-model="item.blood_oxygen" variant="outlined" density="comfortable" hide-details class="day-detail-input" /></td>
                    <td><v-text-field v-model="item.respiration" variant="outlined" density="comfortable" hide-details class="day-detail-input" /></td>
                    <td class="day-detail-check-cell">
                      <v-checkbox v-model="item.medicine_taken" hide-details density="comfortable" color="primary"
                        @update:model-value="(v) => onCheckChange(item, 'medicine_taken', v)" />
                      <span v-if="item.medicine_taken && item.medicine_taken_time" class="text-caption d-block text-medium-emphasis">{{ item.medicine_taken_time }}</span>
                    </td>
                    <td class="day-detail-check-cell">
                      <v-checkbox v-model="item.ate" hide-details density="comfortable" color="primary"
                        @update:model-value="(v) => onCheckChange(item, 'ate', v)" />
                      <span v-if="item.ate && item.ate_time" class="text-caption d-block text-medium-emphasis">{{ item.ate_time }}</span>
                    </td>
                    <td>
                      <v-btn size="small" variant="tonal" color="secondary" prepend-icon="mdi-calendar-arrow-right"
                        @click="openMoveToDate(item)">
                        移動
                      </v-btn>
                    </td>
                  </tr>
                  <tr v-if="!dayDetailPmItems.length">
                    <td colspan="11" class="text-center text-medium-emphasis py-4">下午無排班</td>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </template>
          <v-sheet v-else class="text-center py-10 rounded-xl" color="grey-lighten-4">
            <v-icon size="64" color="grey" class="mb-2">mdi-calendar-blank-outline</v-icon>
            <p class="text-body-1 text-medium-emphasis mb-0">當日無出席排班資料</p>
            <p class="text-caption text-disabled mt-1">請先建構出席資訊</p>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 移動至指定日期 Dialog -->
    <v-dialog v-model="moveToDateDialog" max-width="400" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-calendar-arrow-right</v-icon>
          移動至指定日期
          <v-spacer />
          <v-btn icon variant="text" size="small" @click="moveToDateDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div v-if="moveToDateItem" class="mb-3">
            <span class="font-weight-medium">{{ moveToDateItem.name || '未命名' }}</span>
            <span class="text-caption text-medium-emphasis ml-2">{{ moveToDateItem.period === 'am' ? '上午' : '下午' }}</span>
          </div>
          <v-text-field
            v-model="moveToDateTarget"
            type="date"
            label="指定日期"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-3"
          />
          <div class="mb-1 text-body-2 text-medium-emphasis">目標時段</div>
          <v-btn-toggle
            v-model="moveToDateTargetPeriod"
            mandatory
            density="comfortable"
            variant="outlined"
            divided
            class="d-block"
          >
            <v-btn value="am" size="small">上午</v-btn>
            <v-btn value="pm" size="small">下午</v-btn>
          </v-btn-toggle>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" @click="moveToDateDialog = false">取消</v-btn>
          <v-btn color="primary" :loading="movingToDate" @click="confirmMoveToDate">
            確認移動
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
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

const { proxy } = getCurrentInstance()
const store = useStore()
const residentScheduleDialogRef = ref(null)
const drawerLeft = ref(false)
const searchKey = ref('')
const loading = ref(false)
const building = ref(false)
const buildingForSnkey = ref(null) // 單一住民建構中的 schedule snkey
const dayDetailDialog = ref(false)
const dayDetailDate = ref('')
const dayDetailEditItems = ref([])
const savingDayDetail = ref(false)
const moveToDateDialog = ref(false)
const moveToDateItem = ref(null)
const moveToDateTarget = ref('')
const moveToDateTargetPeriod = ref('am')
const movingToDate = ref(false)

const selectedMonth = ref(dayjs().format('YYYY-MM'))
const scheduleList = ref([])
const attendanceScheduleList = ref([])
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

function getAttendanceChipLabel(row) {
  let parsed = {}
  try {
    parsed = typeof row.datalist === 'string' ? JSON.parse(row.datalist || '{}') : row.datalist || {}
  } catch {}
  const name = userMap.value[String(parsed.user_snkey ?? '')]?.name || parsed.user_snkey || '?'
  const date = parsed.date || '--'
  const period = parsed.period === 'am' ? '上午' : parsed.period === 'pm' ? '下午' : parsed.period || '--'
  return `${date} ${period} ${name}`
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

// 當日 attendance_schedule 清單（供當日詳情顯示與編輯）
const dayAttendanceDetailList = computed(() => {
  if (!dayDetailDate.value) return []
  const dateStr = dayjs(dayDetailDate.value).format('YYYY-MM-DD')
  const items = []
  for (const row of attendanceScheduleList.value) {
    let parsed = {}
    try {
      parsed = typeof row.datalist === 'string' ? JSON.parse(row.datalist || '{}') : row.datalist || {}
    } catch { continue }
    if (parsed.date !== dateStr) continue
    const name = userMap.value[String(parsed.user_snkey ?? '')]?.name || '未命名'
    items.push({
      ...parsed,
      snkey: row.snkey,
      datalist: row.datalist,
      name,
    })
  }
  return items
})

const dayDetailAmItems = computed(() =>
  dayDetailEditItems.value.filter((i) => i.period === 'am')
)
const dayDetailPmItems = computed(() =>
  dayDetailEditItems.value.filter((i) => i.period === 'pm')
)

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
      stats: getDayStatsFromAttendance(dateStr),
    })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({
      key: `c-${d}`,
      day: d,
      dateStr,
      isCurrentMonth: true,
      stats: getDayStatsFromAttendance(dateStr),
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
      stats: getDayStatsFromAttendance(dateStr),
    })
  }
  return cells
})

function getDayStatsFromAttendance(dateStr) {
  let amTotal = 0
  let amCheckedIn = 0
  let pmTotal = 0
  let pmCheckedIn = 0
  for (const row of attendanceScheduleList.value) {
    let parsed = {}
    try {
      parsed = typeof row.datalist === 'string' ? JSON.parse(row.datalist || '{}') : row.datalist || {}
    } catch { continue }
    if (parsed.date !== dateStr) continue
    const checked = !!parsed.checked_in || parsed.checked_in === 1 || parsed.出席 === 1
    if (parsed.period === 'am') {
      amTotal++
      if (checked) amCheckedIn++
    } else if (parsed.period === 'pm') {
      pmTotal++
      if (checked) pmCheckedIn++
    }
  }
  if (amTotal === 0 && pmTotal === 0) return null
  return { am: { total: amTotal, checkedIn: amCheckedIn }, pm: { total: pmTotal, checkedIn: pmCheckedIn } }
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

const validScheduleCodes = computed(() =>
  new Set(CARE_FEE_SCHEDULE_OPTIONS.map((o) => o.code))
)

async function fetchAttendanceSchedule() {
  try {
    const raw = await api.options(
      `byjson/getZoneData/${db.value}/attendance_schedule`,
      { key: 'date', start: firstDayOfMonth.value, end: lastDayOfMonth.value }
    )
    const arr = Array.isArray(raw) ? raw : raw?.data ?? raw?.list ?? []
    attendanceScheduleList.value = arr
  } catch (e) {
    console.warn('fetchAttendanceSchedule failed:', e)
    attendanceScheduleList.value = []
  }
}

async function buildAttendanceSchedule() {
  const list = sliderList.value
  if (!list.length) {
    store.showToastMulti({ type: 'warning', message: '當月無住民排班資料可建構', closeTime: 3 })
    return
  }

  building.value = true
  try {
    const first = firstDayOfMonth.value
    const last = lastDayOfMonth.value
    const month = selectedMonth.value
    const daysInMonth = dayjs(month + '-01').daysInMonth()

    // 依 4.3 容量與收費規則：上午/下午各 28 人、收費表組合驗證
    const toAdd = []
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${month}-${String(d).padStart(2, '0')}`
      const dateObj = dayjs(dateStr)
      const weekday = dateObj.day() === 0 ? 7 : dateObj.day()
      let amCount = 0
      let pmCount = 0
      const AM_LIMIT = 28
      const PM_LIMIT = 28

      const eligible = list.filter((item) => {
        if (!validScheduleCodes.value.has(item.schedule_type)) return false
        if (item.start_date && dayjs(dateStr).isBefore(item.start_date)) return false
        const weekdays = (item.weekdays || '').split(',').map((n) => parseInt(n, 10)).filter(Boolean)
        return weekdays.includes(weekday)
      })

      for (const item of eligible) {
        if (item.day_type === 'full') {
          if (amCount < AM_LIMIT && pmCount < PM_LIMIT) {
            toAdd.push({
              datalist: JSON.stringify({
                month,
                date: dateStr,
                period: 'am',
                user_snkey: item.user_snkey,
                schedule_type: item.schedule_type,
                day_type: item.day_type,
                resident_schedule_snkey: item.snkey,
                checked_in: 0,
                checked_in_time: '',
                arrival_time: '',
                temperature: '',
                pulse: '',
                blood_pressure: '',
                blood_oxygen: '',
                respiration: '',
                medicine_taken: 0,
                medicine_taken_time: '',
                ate: 0,
                ate_time: '',
              }),
            })
            toAdd.push({
              datalist: JSON.stringify({
                month,
                date: dateStr,
                period: 'pm',
                user_snkey: item.user_snkey,
                schedule_type: item.schedule_type,
                day_type: item.day_type,
                resident_schedule_snkey: item.snkey,
                checked_in: 0,
                checked_in_time: '',
                arrival_time: '',
                temperature: '',
                pulse: '',
                blood_pressure: '',
                blood_oxygen: '',
                respiration: '',
                medicine_taken: 0,
                medicine_taken_time: '',
                ate: 0,
                ate_time: '',
              }),
            })
            amCount++
            pmCount++
          }
        } else {
          if (amCount < AM_LIMIT) {
            toAdd.push({
              datalist: JSON.stringify({
                month,
                date: dateStr,
                period: 'am',
                user_snkey: item.user_snkey,
                schedule_type: item.schedule_type,
                day_type: item.day_type,
                resident_schedule_snkey: item.snkey,
                checked_in: 0,
                checked_in_time: '',
                arrival_time: '',
                temperature: '',
                pulse: '',
                blood_pressure: '',
                blood_oxygen: '',
                respiration: '',
                medicine_taken: 0,
                medicine_taken_time: '',
                ate: 0,
                ate_time: '',
              }),
            })
            amCount++
          } else if (pmCount < PM_LIMIT) {
            toAdd.push({
              datalist: JSON.stringify({
                month,
                date: dateStr,
                period: 'pm',
                user_snkey: item.user_snkey,
                schedule_type: item.schedule_type,
                day_type: item.day_type,
                resident_schedule_snkey: item.snkey,
                checked_in: 0,
                checked_in_time: '',
                arrival_time: '',
                temperature: '',
                pulse: '',
                blood_pressure: '',
                blood_oxygen: '',
                respiration: '',
                medicine_taken: 0,
                medicine_taken_time: '',
                ate: 0,
                ate_time: '',
              }),
            })
            pmCount++
          }
        }
      }
    }

    if (!toAdd.length) {
      store.showToastMulti({ type: 'info', message: '無符合條件的出席記錄可建構', closeTime: 2 })
      return
    }

    // 刪除當月既有記錄（若有）
    const existing = attendanceScheduleList.value
    if (existing.length > 0) {
      const toDelete = existing.map((row) => ({
        snkey: row.snkey,
        tablename: 'attendance_schedule',
        datalist: row.datalist,
      }))
      try {
        await api.deleteMulti('attendance_schedule', toDelete)
      } catch (e) {
        console.warn('delete attendance_schedule failed:', e)
      }
    }

    await api.addMulti('attendance_schedule', toAdd)
    store.showToastMulti({ type: 'success', message: `已建構 ${toAdd.length} 筆出席資訊`, closeTime: 2 })
    await fetchAttendanceSchedule()
  } catch (e) {
    console.error('buildAttendanceSchedule error:', e)
    store.showToastMulti({ type: 'error', message: '建構出席資訊失敗: ' + (e?.message || e), closeTime: 3 })
  } finally {
    building.value = false
  }
}

/** 僅針對單一住民排班建構當月出席資訊（新增/覆寫該住民當月出席記錄） */
async function buildAttendanceScheduleForResident(item) {
  if (building.value || buildingForSnkey.value) return
  if (!validScheduleCodes.value.has(item.schedule_type)) {
    store.showToastMulti({ type: 'warning', message: '此排班類型不支援建構出席', closeTime: 2 })
    return
  }
  const month = selectedMonth.value
  const existingForResident = attendanceScheduleList.value.filter((row) => {
    let parsed = {}
    try {
      parsed = typeof row.datalist === 'string' ? JSON.parse(row.datalist || '{}') : row.datalist || {}
    } catch { return false }
    return String(parsed.resident_schedule_snkey) === String(item.snkey) && parsed.month === month
  })
  if (existingForResident.length > 0) {
    const result = await proxy?.$swal?.({
      title: '確認建構出席資訊？',
      text: `此住民（${item.name || '未命名'}）當月已有 ${existingForResident.length} 筆出席資料，建構將刪除該住民當月全部出席記錄後重新建立。確定要繼續嗎？`,
      icon: 'warning',
      toast: false,
      timer: null,
      showConfirmButton: true,
      showCancelButton: true,
      position: 'center',
    })
    if (!result?.isConfirmed) return
  }
  buildingForSnkey.value = item.snkey
  try {
    const daysInMonth = dayjs(month + '-01').daysInMonth()
    const list = [item]
    const toAdd = []

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${month}-${String(d).padStart(2, '0')}`
      const dateObj = dayjs(dateStr)
      const weekday = dateObj.day() === 0 ? 7 : dateObj.day()
      const eligible = list.filter((row) => {
        if (row.start_date && dayjs(dateStr).isBefore(row.start_date)) return false
        const weekdays = (row.weekdays || '').split(',').map((n) => parseInt(n, 10)).filter(Boolean)
        return weekdays.includes(weekday)
      })
      if (!eligible.length) continue

      const row = eligible[0]
      if (row.day_type === 'full') {
        toAdd.push({
          datalist: JSON.stringify({
            month,
            date: dateStr,
            period: 'am',
            user_snkey: row.user_snkey,
            schedule_type: row.schedule_type,
            day_type: row.day_type,
            resident_schedule_snkey: row.snkey,
            checked_in: 0,
            checked_in_time: '',
            arrival_time: '',
            temperature: '',
            pulse: '',
            blood_pressure: '',
            blood_oxygen: '',
            respiration: '',
            medicine_taken: 0,
            medicine_taken_time: '',
            ate: 0,
            ate_time: '',
          }),
        })
        toAdd.push({
          datalist: JSON.stringify({
            month,
            date: dateStr,
            period: 'pm',
            user_snkey: row.user_snkey,
            schedule_type: row.schedule_type,
            day_type: row.day_type,
            resident_schedule_snkey: row.snkey,
            checked_in: 0,
            checked_in_time: '',
            arrival_time: '',
            temperature: '',
            pulse: '',
            blood_pressure: '',
            blood_oxygen: '',
            respiration: '',
            medicine_taken: 0,
            medicine_taken_time: '',
            ate: 0,
            ate_time: '',
          }),
        })
      } else {
        toAdd.push({
          datalist: JSON.stringify({
            month,
            date: dateStr,
            period: 'am',
            user_snkey: row.user_snkey,
            schedule_type: row.schedule_type,
            day_type: row.day_type,
            resident_schedule_snkey: row.snkey,
            checked_in: 0,
            checked_in_time: '',
            arrival_time: '',
            temperature: '',
            pulse: '',
            blood_pressure: '',
            blood_oxygen: '',
            respiration: '',
            medicine_taken: 0,
            medicine_taken_time: '',
            ate: 0,
            ate_time: '',
          }),
        })
      }
    }

    if (!toAdd.length) {
      store.showToastMulti({ type: 'info', message: '此排班當月無符合條件的日期可建構', closeTime: 2 })
      return
    }

    // 刪除該住民當月既有出席記錄
    const existing = attendanceScheduleList.value
    const toDelete = []
    for (const row of existing) {
      let parsed = {}
      try {
        parsed = typeof row.datalist === 'string' ? JSON.parse(row.datalist || '{}') : row.datalist || {}
      } catch { continue }
      if (String(parsed.resident_schedule_snkey) !== String(item.snkey)) continue
      if (parsed.month !== month) continue
      toDelete.push({
        snkey: row.snkey,
        tablename: 'attendance_schedule',
        datalist: row.datalist,
      })
    }
    if (toDelete.length > 0) {
      try {
        await api.deleteMulti('attendance_schedule', toDelete)
      } catch (e) {
        console.warn('delete attendance_schedule failed:', e)
      }
    }

    await api.addMulti('attendance_schedule', toAdd)
    store.showToastMulti({ type: 'success', message: `已為 ${item.name || '該住民'} 建構 ${toAdd.length} 筆出席資訊`, closeTime: 2 })
    await fetchAttendanceSchedule()
  } catch (e) {
    console.error('buildAttendanceScheduleForResident error:', e)
    store.showToastMulti({ type: 'error', message: '建構出席資訊失敗: ' + (e?.message || e), closeTime: 3 })
  } finally {
    buildingForSnkey.value = null
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

function toEditItem(rec) {
  return {
    ...rec,
    checked_in: !!rec.checked_in || rec.checked_in === 1 || !!rec.出席,
    checked_in_time: rec.checked_in_time || rec.簽到時間 || '',
    arrival_time: rec.arrival_time || rec.到機構時間 || '',
    attendance_status: rec.attendance_status || rec.出席情況 || '',
    temperature: rec.temperature || rec.體溫 || '',
    pulse: rec.pulse || rec.脈搏 || '',
    blood_pressure: rec.blood_pressure || rec.血壓 || '',
    blood_oxygen: rec.blood_oxygen || rec.血氧 || '',
    respiration: rec.respiration || rec.呼吸 || '',
    medicine_taken: !!rec.medicine_taken || !!rec.吃藥,
    medicine_taken_time: rec.medicine_taken_time || rec.吃藥時間 || '',
    ate: !!rec.ate || !!rec.進食,
    ate_time: rec.ate_time || rec.進食時間 || '',
  }
}

function onCheckChange(item, field, checked) {
  const now = dayjs().format('YYYY-MM-DD HH:mm')
  if (field === 'checked_in') item.checked_in_time = checked ? now : ''
  else if (field === 'medicine_taken') item.medicine_taken_time = checked ? now : ''
  else if (field === 'ate') item.ate_time = checked ? now : ''
}

function initDayDetailEdit() {
  dayDetailEditItems.value = dayAttendanceDetailList.value.map((r) => toEditItem({ ...r }))
}

async function saveAllDayDetail() {
  const items = dayDetailEditItems.value
  if (!items.length) return
  savingDayDetail.value = true
  try {
    for (const item of items) {
      let parsed = {}
      try {
        parsed = typeof item.datalist === 'string' ? JSON.parse(item.datalist || '{}') : item.datalist || {}
      } catch { continue }
      const updated = {
        ...parsed,
        checked_in: item.checked_in ? 1 : 0,
        出席: item.checked_in ? 1 : 0,
        checked_in_time: item.checked_in_time || '',
        簽到時間: item.checked_in_time || '',
        arrival_time: item.arrival_time || '',
        到機構時間: item.arrival_time || '',
        attendance_status: item.attendance_status || '',
        出席情況: item.attendance_status || '',
        temperature: item.temperature || '',
        體溫: item.temperature || '',
        pulse: item.pulse || '',
        脈搏: item.pulse || '',
        blood_pressure: item.blood_pressure || '',
        血壓: item.blood_pressure || '',
        blood_oxygen: item.blood_oxygen || '',
        血氧: item.blood_oxygen || '',
        respiration: item.respiration || '',
        呼吸: item.respiration || '',
        medicine_taken: item.medicine_taken ? 1 : 0,
        吃藥: item.medicine_taken ? 1 : 0,
        medicine_taken_time: item.medicine_taken_time || '',
        吃藥時間: item.medicine_taken_time || '',
        ate: item.ate ? 1 : 0,
        進食: item.ate ? 1 : 0,
        ate_time: item.ate_time || '',
        進食時間: item.ate_time || '',
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }
      const rs = await api.post('attendance_schedule', {
        snkey: item.snkey,
        datalist: JSON.stringify(updated),
        updateTime: updated.updateTime,
      })
      if (rs?.state != 1) throw new Error(rs?.message || '儲存失敗')
    }
    store.showToastMulti({ type: 'success', message: '已儲存全部', closeTime: 2 })
    await fetchAttendanceSchedule()
    dayDetailDialog.value = false
  } catch (e) {
    console.error('saveAllDayDetail error:', e)
    store.showToastMulti({ type: 'error', message: '儲存失敗: ' + (e?.message || e), closeTime: 3 })
  } finally {
    savingDayDetail.value = false
  }
}

watch(selectedMonth, () => {
  fetchScheduleData()
  fetchAttendanceSchedule()
}, { immediate: false })

watch(dayDetailDialog, (open) => {
  if (open) initDayDetailEdit()
})

function openMoveToDate(item) {
  moveToDateItem.value = item
  const currentDate = dayDetailDate.value ? dayjs(dayDetailDate.value).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
  moveToDateTarget.value = dayjs(currentDate).add(1, 'day').format('YYYY-MM-DD')
  moveToDateTargetPeriod.value = item.period === 'pm' ? 'pm' : 'am'
  moveToDateDialog.value = true
}

async function confirmMoveToDate() {
  const item = moveToDateItem.value
  const targetDate = moveToDateTarget.value
  if (!item?.snkey || !targetDate) return

  const currentDate = dayDetailDate.value ? dayjs(dayDetailDate.value).format('YYYY-MM-DD') : ''
  if (targetDate === currentDate) {
    store.showToastMulti({ type: 'warning', message: '目標日期與當日相同', closeTime: 2 })
    return
  }

  movingToDate.value = true
  try {
    let parsed = {}
    try {
      parsed = typeof item.datalist === 'string' ? JSON.parse(item.datalist || '{}') : item.datalist || {}
    } catch { throw new Error('解析資料失敗') }

    const month = targetDate.substring(0, 7)
    const targetPeriod = moveToDateTargetPeriod.value === 'pm' ? 'pm' : 'am'
    const newDatalist = {
      ...parsed,
      month,
      date: targetDate,
      period: targetPeriod,
      checked_in: 0,
      checked_in_time: '',
      arrival_time: '',
      temperature: '',
      pulse: '',
      blood_pressure: '',
      blood_oxygen: '',
      respiration: '',
      medicine_taken: 0,
      medicine_taken_time: '',
      ate: 0,
      ate_time: '',
    }

    await api.addMulti('attendance_schedule', [{ datalist: JSON.stringify(newDatalist) }])
    await api.delete('attendance_schedule', {
      snkey: item.snkey,
      tablename: 'attendance_schedule',
      datalist: item.datalist,
    })

    const periodLabel = targetPeriod === 'am' ? '上午' : '下午'
    store.showToastMulti({ type: 'success', message: `已移動至 ${targetDate} ${periodLabel}`, closeTime: 2 })
    moveToDateDialog.value = false
    await fetchAttendanceSchedule()
    initDayDetailEdit()
  } catch (e) {
    console.error('confirmMoveToDate error:', e)
    store.showToastMulti({ type: 'error', message: '移動失敗: ' + (e?.message || e), closeTime: 3 })
  } finally {
    movingToDate.value = false
  }
}

onMounted(async () => {
  await fetchUsers()
  await fetchScheduleData()
  await fetchAttendanceSchedule()
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
/* 當日上午或下午已排人數超過 28 人時顯示紅色背景 */
.day-over-capacity {
  background: rgba(211, 47, 47, 0.2) !important;
}
.day-over-capacity.day-clickable:hover {
  background: rgba(211, 47, 47, 0.35) !important;
}
.day-num {
  font-weight: 600;
  font-size: 0.9rem;
}
.day-stats {
  margin-top: 0.25rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.day-detail-table :deep(.v-field) {
  font-size: 0.95rem;
}
.day-detail-table :deep(.v-field__input) {
  min-height: 42px;
  padding: 0 12px;
}
.day-detail-table :deep(.v-input) {
  font-size: 0.95rem;
}
.day-detail-table .day-detail-input :deep(.v-field) {
  min-width: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
.day-detail-table :deep(tbody td .v-input) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
.day-detail-table .day-detail-name {
  font-size: 0.95rem;
}
.day-detail-table .day-detail-check-cell {
  min-width: 100px;
  padding: 10px;
}
.day-detail-table .day-detail-check-cell .text-caption {
  font-size: 0.7rem;
  margin-top: 2px;
}
.day-detail-table :deep(table) {
  table-layout: fixed;
  width: 100%;
}
.day-detail-table th.day-detail-th {
  white-space: nowrap;
  padding: 10px;
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.04);
  font-weight: 600;
  vertical-align: middle;
  box-sizing: border-box;
}
.day-detail-table td {
  padding: 10px;
  vertical-align: middle;
  box-sizing: border-box;
}
.day-detail-table :deep(thead th),
.day-detail-table :deep(tbody td) {
  vertical-align: middle;
}
/* 各欄水平對齊：姓名左對齊，其餘數字/勾選/按鈕置中與表頭一致 */
.day-detail-table :deep(thead th:nth-child(1)),
.day-detail-table :deep(tbody td:nth-child(1)) { text-align: left; }
.day-detail-table :deep(thead th:nth-child(2)),
.day-detail-table :deep(tbody td:nth-child(2)) { text-align: center; }
.day-detail-table :deep(thead th:nth-child(3)),
.day-detail-table :deep(tbody td:nth-child(3)) { text-align: center; }
.day-detail-table :deep(thead th:nth-child(4)),
.day-detail-table :deep(tbody td:nth-child(4)) { text-align: center; }
.day-detail-table :deep(thead th:nth-child(5)),
.day-detail-table :deep(tbody td:nth-child(5)) { text-align: center; }
.day-detail-table :deep(thead th:nth-child(6)),
.day-detail-table :deep(tbody td:nth-child(6)) { text-align: center; }
.day-detail-table :deep(thead th:nth-child(7)),
.day-detail-table :deep(tbody td:nth-child(7)) { text-align: center; }
.day-detail-table :deep(thead th:nth-child(8)),
.day-detail-table :deep(tbody td:nth-child(8)) { text-align: center; }
.day-detail-table :deep(thead th:nth-child(9)),
.day-detail-table :deep(tbody td:nth-child(9)) { text-align: center; }
.day-detail-table :deep(thead th:nth-child(10)),
.day-detail-table :deep(tbody td:nth-child(10)) { text-align: center; }
.day-detail-table :deep(thead th:nth-child(11)),
.day-detail-table :deep(tbody td:nth-child(11)) { text-align: center; }
/* thead / tbody 欄位對齊：每欄固定寬度 */
.day-detail-table :deep(thead th:nth-child(1)),
.day-detail-table :deep(tbody td:nth-child(1)) { width: 90px; min-width: 90px; }
.day-detail-table :deep(thead th:nth-child(2)),
.day-detail-table :deep(tbody td:nth-child(2)) { width: 100px; min-width: 100px; }
.day-detail-table :deep(thead th:nth-child(3)),
.day-detail-table :deep(tbody td:nth-child(3)) { width: 150px; min-width: 150px; }
.day-detail-table :deep(thead th:nth-child(4)),
.day-detail-table :deep(tbody td:nth-child(4)) { width: 80px; min-width: 80px; }
.day-detail-table :deep(thead th:nth-child(5)),
.day-detail-table :deep(tbody td:nth-child(5)) { width: 80px; min-width: 80px; }
.day-detail-table :deep(thead th:nth-child(6)),
.day-detail-table :deep(tbody td:nth-child(6)) { width: 110px; min-width: 110px; }
.day-detail-table :deep(thead th:nth-child(7)),
.day-detail-table :deep(tbody td:nth-child(7)) { width: 80px; min-width: 80px; }
.day-detail-table :deep(thead th:nth-child(8)),
.day-detail-table :deep(tbody td:nth-child(8)) { width: 80px; min-width: 80px; }
.day-detail-table :deep(thead th:nth-child(9)),
.day-detail-table :deep(tbody td:nth-child(9)) { width: 100px; min-width: 100px; }
.day-detail-table :deep(thead th:nth-child(10)),
.day-detail-table :deep(tbody td:nth-child(10)) { width: 100px; min-width: 100px; }
.day-detail-table :deep(thead th:nth-child(11)),
.day-detail-table :deep(tbody td:nth-child(11)) { width: 90px; min-width: 90px; }
.day-detail-table tbody tr.day-detail-row-alt {
  background: rgba(0, 0, 0, 0.02);
}
.day-detail-table tbody tr:hover {
  background: rgba(var(--v-theme-primary), 0.04) !important;
}
.day-detail-card {
  overflow: hidden;
}
.day-detail-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
  padding: 20px 24px;
}
.day-detail-body {
  background: rgb(var(--v-theme-surface));
  padding: 20px 24px;
}
.day-detail-section {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), 0.2);
}
.day-detail-section-am {
  border-left: 4px solid #f59e0b;
}
.day-detail-section-pm {
  border-left: 4px solid #6366f1;
}
.day-detail-section-title-am {
  background: linear-gradient(90deg, rgba(255, 193, 7, 0.15) 0%, transparent 100%);
}
.day-detail-section-title-pm {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%);
}
.day-detail-dialog :deep(.v-overlay__content) {
  border-radius: 16px;
}
</style>
