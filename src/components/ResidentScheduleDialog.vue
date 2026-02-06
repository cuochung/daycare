<template>
  <v-dialog v-model="dialog" persistent max-width="95vw" scrollable class="schedule-dialog-wide">
    <v-card>
      <v-card-title class="d-flex align-center pa-4 bg-primary text-white">
        <v-icon class="mr-2">mdi-calendar-edit</v-icon>
        服務項目設定
        <span v-if="userName" class="ml-2 font-weight-normal text-body-2">－ {{ userName }}</span>
        <v-spacer></v-spacer>
        <v-btn icon variant="text" color="white" @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="pa-4">
        <!-- 開始日期（存於病歷 user.datalist） -->
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">開始日期</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="scheduleStartDate"
              label="服務項目開始日期（當天可排或指定日後才建構）"
              type="date"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
            />
            <p class="text-caption text-medium-emphasis mt-2 mb-0">請先填寫開始日期後，方可新增服務項目組合並儲存；表格「開始日期」預設由上方開始日期帶出。</p>
          </v-card-text>
        </v-card>

        <!-- 服務項目設定列表（新表 resident_schedule） -->
        <v-card variant="outlined">
          <v-card-title class="d-flex align-center">
            <span class="text-subtitle-1">服務項目組合</span>
            <v-btn class="ml-2" size="small" color="primary" variant="tonal" prepend-icon="mdi-plus" @click="addRow"
              :disabled="!hasStartDate">
              新增一筆
            </v-btn>
            <v-btn class="ml-2" size="small" color="secondary" variant="tonal" prepend-icon="mdi-import"
              :disabled="!hasStartDate"
              @click="openImportCareFeeDialog">
              導入符合服務項目資料
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-alert v-if="scheduleRows.length === 0" type="info" variant="tonal" density="compact" class="mb-3">
              尚無服務項目設定；請先填寫上方「開始日期」後，再點「新增一筆」或「導入符合服務項目資料」。可同時存在全日與半日多筆。
            </v-alert>
            <v-table v-else density="compact" class="elevation-0 schedule-items-table">
              <thead>
                <tr>
                  <th class="col-start-date">開始日期</th>
                  <th>照顧組合</th>
                  <th class="text-end">服務數量</th>
                  <th>每週使用日</th>
                  <th>配額</th>
                  <th>全日/半日</th>
                  <th width="80">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in scheduleRows" :key="row._localId || row.snkey">
                  <td class="td-start-date">
                    <v-text-field
                      v-model="row.month"
                      type="date"
                      placeholder="YYYY-MM-DD"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </td>
                  <td>
                    <v-select
                      v-model="row.schedule_type"
                      :items="scheduleTypeItems"
                      item-title="label"
                      item-value="code"
                      variant="outlined"
                      density="compact"
                      hide-details
                      @update:model-value="onScheduleTypeChange(row)"
                    >
                      <template #item="{ item, props }">
                        <v-list-item v-bind="props" :title="null">
                          <template #title>
                            <span class="font-weight-medium">{{ item.raw.shortLabel }}</span>
                          </template>
                        </v-list-item>
                      </template>
                      <template #selection="{ item }">
                        <span class="font-weight-medium">{{ item.raw.shortLabel }}</span>
                      </template>
                    </v-select>
                  </td>
                  <td class="td-service-qty">
                    <v-text-field
                      v-model="row.服務數量"
                      type="number"
                      min="0"
                      step="1"
                      variant="outlined"
                      density="compact"
                      hide-details
                      placeholder="0"
                    />
                  </td>
                  <td>
                    <v-select
                      v-model="row.weekdaysArray"
                      :items="weekdaySelectItems"
                      item-title="title"
                      item-value="value"
                      multiple
                      chips
                      closable-chips
                      variant="outlined"
                      density="compact"
                      hide-details
                      placeholder="選擇星期"
                      class="weekday-select-pills"
                    />
                  </td>
                  <td class="td-quota">
                    <v-select
                      v-model="row.quota_type"
                      :items="quotaTypeItems"
                      item-title="label"
                      item-value="value"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </td>
                  <td>
                    <span class="text-body-2">{{ row.day_type === 'full' ? '全日' : '半日' }}</span>
                  </td>
                  <td>
                    <v-btn icon size="small" color="error" variant="text" @click="removeRow(idx)">
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="outlined" @click="close">取消</v-btn>
        <v-btn color="primary" :loading="saving" :disabled="!hasStartDate" @click="save">儲存</v-btn>
      </v-card-actions>
    </v-card>

    <!-- 導入符合服務項目資料：從 userFullData 服務項目中勾選加入 -->
    <v-dialog v-model="importCareFeeDialog" persistent max-width="680" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-import</v-icon>
          導入符合服務項目資料
          <v-spacer></v-spacer>
          <v-btn icon variant="text" size="small" @click="importCareFeeDialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-alert v-if="importCareFeeItems.length === 0 && !importCareFeeLoading" type="info" variant="tonal" density="compact">
            此住民尚無資料一覽（userFullData），或其中沒有符合收費表的服務項目（BB01-BB14、GA03、GA04、SC03、SC04）。請先從「病歷管理」匯入 HTML 資料一覽。
          </v-alert>
          <v-progress-linear v-else-if="importCareFeeLoading" indeterminate color="primary" class="mb-3"></v-progress-linear>
          <v-table v-else density="compact" class="import-carefee-table">
            <thead>
              <tr>
                <th width="48">加入</th>
                <th class="text-nowrap">服務項目</th>
                <th class="text-end text-nowrap">服務數量</th>
                <th class="text-end text-nowrap">小計</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in importCareFeeItems" :key="item.code">
                <td class="text-nowrap">
                  <v-checkbox v-model="importCareFeeSelected" :value="item" hide-details density="compact"></v-checkbox>
                </td>
                <td class="font-weight-medium text-nowrap">{{ item.name }}</td>
                <td class="text-end text-nowrap">{{ item.服務數量 || '--' }}</td>
                <td class="text-end text-nowrap">{{ item.小計 || '--' }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="importCareFeeDialog = false">取消</v-btn>
          <v-btn color="primary" :disabled="importCareFeeSelected.length === 0" @click="confirmImportCareFee">
            加入所選項目
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'
import {
  CARE_FEE_SCHEDULE_OPTIONS,
  QUOTA_TYPES,
  WEEKDAY_LABELS,
} from '@/assets/js/careFeeOptions.js'
import { getCareFeeServiceItemsFromRawData } from '@/assets/js/serviceItemsFromRawData.js'

const emit = defineEmits(['saved'])
const store = useStore()
const dialog = ref(false)
const userSnkey = ref('')
const userName = ref('')
const scheduleStartDate = ref('')
const scheduleRows = ref([])
const saving = ref(false)
const importCareFeeDialog = ref(false)
const importCareFeeItems = ref([])
const importCareFeeSelected = ref([])
const importCareFeeLoading = ref(false)
let userRecord = null
let _localIdCounter = 0

/** 照顧組合選項，加上簡短顯示：code 全日/半日 型（不顯示「日間照顧」等字） */
const scheduleTypeItems = computed(() =>
  CARE_FEE_SCHEDULE_OPTIONS.map((opt) => {
    const dayLabel = opt.day_type === 'full' ? '全日' : '半日'
    const typePart = (opt.label.match(/[—\-](第.型)/) || [])[1] || ''
    const shortLabel = [opt.code, dayLabel, typePart].filter(Boolean).join(' ')
    return { ...opt, shortLabel }
  })
)
const quotaTypeItems = computed(() => QUOTA_TYPES)
const weekdaySelectItems = computed(() =>
  [1, 2, 3, 4, 5, 6, 7].map((d) => ({ value: d, title: WEEKDAY_LABELS[d] || `周${d}` }))
)
const hasStartDate = computed(() => !!scheduleStartDate.value?.trim())
/** 表格每筆「開始日期」預設值：與上方服務項目開始日期同一天，或今日 */
const defaultStartDate = computed(() =>
  scheduleStartDate.value ? dayjs(scheduleStartDate.value).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
)

function onScheduleTypeChange(row) {
  const opt = CARE_FEE_SCHEDULE_OPTIONS.find(o => o.code === row.schedule_type)
  if (opt) row.day_type = opt.day_type
}

function addRow() {
  scheduleRows.value.push({
    _localId: `new_${++_localIdCounter}`,
    month: defaultStartDate.value,
    schedule_type: 'BB07',
    day_type: 'full',
    quota_type: 'month',
    服務數量: '',
    weekdaysArray: [1, 2, 3, 4, 5],
  })
}

function removeRow(index) {
  scheduleRows.value.splice(index, 1)
}

async function openImportCareFeeDialog() {
  importCareFeeDialog.value = true
  importCareFeeItems.value = []
  importCareFeeSelected.value = []
  importCareFeeLoading.value = true
  try {
    const raw = await api.get('userFullData')
    const list = Array.isArray(raw) ? raw : (raw?.data ?? raw?.list ?? [])
    const userSnkeyStr = String(userSnkey.value)
    const fullRecord = list.find((item) => {
      const rowKey = item.user_snkey != null ? String(item.user_snkey) : null
      if (rowKey === userSnkeyStr) return true
      try {
        const d = JSON.parse(item.datalist || '{}')
        return d.user_snkey == userSnkey.value || String(d.user_snkey) === userSnkeyStr
      } catch {
        return false
      }
    })
    if (!fullRecord) {
      importCareFeeItems.value = []
      return
    }
    const parsed = JSON.parse(fullRecord.datalist || '{}')
    const rawData = parsed.rawData || {}
    importCareFeeItems.value = getCareFeeServiceItemsFromRawData(rawData)
  } catch (e) {
    console.error('openImportCareFeeDialog error:', e)
    store.showToastMulti({ type: 'error', message: '讀取資料一覽失敗: ' + (e.message || e), closeTime: 3 })
    importCareFeeItems.value = []
  } finally {
    importCareFeeLoading.value = false
  }
}

function confirmImportCareFee() {
  const selected = importCareFeeSelected.value
  if (!selected.length) return
  const startDate = defaultStartDate.value
  for (const item of selected) {
    scheduleRows.value.push({
      _localId: `new_${++_localIdCounter}`,
      month: startDate,
      schedule_type: item.code,
      day_type: item.day_type || 'full',
      quota_type: item.code && item.code.startsWith('GA') ? 'year' : 'month',
      服務數量: item.服務數量 ?? '',
      weekdaysArray: [1, 2, 3, 4, 5],
    })
  }
  importCareFeeDialog.value = false
  importCareFeeSelected.value = []
  store.showToastMulti({ type: 'success', message: `已加入 ${selected.length} 筆服務項目（開始日期：${startDate}）`, closeTime: 2 })
}

function open(snkey, name = '') {
  userSnkey.value = snkey
  userName.value = name || ''
  dialog.value = true
  scheduleStartDate.value = ''
  scheduleRows.value = []
  loadData()
}

function close() {
  dialog.value = false
}

async function loadData() {
  if (!userSnkey.value) return
  try {
    const users = await api.get('user')
    const u = users.find(i => i.snkey === userSnkey.value || String(i.snkey) === String(userSnkey.value))
    if (u) {
      userRecord = u
      const data = JSON.parse(u.datalist || '{}')
      scheduleStartDate.value = data.schedule_start_date || ''
    }

    let allSchedules = []
    try {
      allSchedules = await api.get('resident_schedule') || []
    } catch (e) {
      console.warn('resident_schedule get failed (table may not exist yet):', e)
    }
    const forUser = allSchedules.filter(i => {
      try {
        const d = JSON.parse(i.datalist || '{}')
        return d.user_snkey === userSnkey.value || String(d.user_snkey) === String(userSnkey.value)
      } catch {
        return false
      }
    })
    scheduleRows.value = forUser.map(i => {
      const d = JSON.parse(i.datalist || '{}')
      const weekdaysStr = d.weekdays || ''
      const weekdaysArray = weekdaysStr ? weekdaysStr.split(',').map(n => parseInt(n, 10)).filter(Boolean) : []
      return {
        snkey: i.snkey,
        month: d.start_date || d.month || '',
        schedule_type: d.schedule_type || 'BB07',
        day_type: d.day_type || 'full',
        quota_type: d.quota_type || 'month',
        服務數量: d.服務數量 ?? '',
        weekdaysArray: weekdaysArray.length ? weekdaysArray : [1, 2, 3, 4, 5],
      }
    })
    scheduleRows.value.forEach(row => {
      if (!row.snkey) row._localId = `new_${++_localIdCounter}`
    })
  } catch (e) {
    console.error('loadData error:', e)
    store.showToastMulti({ type: 'error', message: '載入失敗: ' + (e.message || e), closeTime: 3 })
  }
}

async function save() {
  if (!userSnkey.value) return
  if (!hasStartDate.value) {
    store.showToastMulti({ type: 'warning', message: '請先填寫「服務項目開始日期」後再儲存。', closeTime: 3 })
    return
  }
  saving.value = true
  try {
    if (userRecord) {
      const data = JSON.parse(userRecord.datalist || '{}')
      data.schedule_start_date = scheduleStartDate.value || ''
      data.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      const postData = {
        snkey: userRecord.snkey,
        datalist: JSON.stringify(data),
        updateTime: data.updateTime,
      }
      const rs = await api.post('user', postData)
      if (rs?.state != 1) throw new Error(rs?.message || '更新病歷失敗')
    }

    const existingSnkeys = new Set(scheduleRows.value.filter(r => r.snkey).map(r => r.snkey))
    let allSchedules = []
    try {
      allSchedules = await api.get('resident_schedule') || []
    } catch (e) {
      // table may not exist
    }
    const forUser = allSchedules.filter(i => {
      try {
        const d = JSON.parse(i.datalist || '{}')
        return d.user_snkey === userSnkey.value || String(d.user_snkey) === String(userSnkey.value)
      } catch {
        return false
      }
    })

    const toDelete = forUser
      .filter((row) => !existingSnkeys.has(row.snkey))
      .map((row) => ({
        snkey: row.snkey,
        tablename: 'resident_schedule',
        datalist: row.datalist,
      }))
    if (toDelete.length > 0) {
      await api.deleteMulti('resident_schedule', toDelete)
    }

    const toUpdate = scheduleRows.value.filter((r) => r.snkey)
    const toAdd = scheduleRows.value.filter((r) => !r.snkey)

    for (const row of toUpdate) {
      // 從當前表單狀態取該列，確保送出的是使用者剛修改的內容
      const current = scheduleRows.value.find((r) => r.snkey === row.snkey)
      if (!current) continue
      const payload = {
        user_snkey: userSnkey.value,
        start_date: current.month || dayjs().format('YYYY-MM-DD'),
        schedule_type: current.schedule_type,
        day_type: current.day_type,
        quota_type: current.quota_type,
        服務數量: current.服務數量 ?? '',
        weekdays: (current.weekdaysArray || []).slice().sort((a, b) => a - b).join(','),
      }
      const datalist = JSON.stringify(payload)
      const rs = await api.post('resident_schedule', {
        snkey: current.snkey,
        datalist,
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      })
      if (rs?.state != 1) throw new Error(rs?.message || '更新排班失敗')
    }

    if (toAdd.length > 0) {
      const addPayload = toAdd.map((row) => ({
        datalist: JSON.stringify({
          user_snkey: userSnkey.value,
          start_date: row.month || dayjs().format('YYYY-MM-DD'),
          schedule_type: row.schedule_type,
          day_type: row.day_type,
          quota_type: row.quota_type,
          服務數量: row.服務數量 ?? '',
          weekdays: (row.weekdaysArray || []).slice().sort((a, b) => a - b).join(','),
        }),
      }))
      await api.addMulti('resident_schedule', addPayload)
    }

    store.showToastMulti({ type: 'success', message: '已儲存', closeTime: 2 })
    emit('saved')
    close()
  } catch (e) {
    console.error('save error:', e)
    store.showToastMulti({ type: 'error', message: '儲存失敗: ' + (e.message || e), closeTime: 3 })
  } finally {
    saving.value = false
  }
}

defineExpose({ open, close })
</script>

<style scoped>
.schedule-dialog-wide :deep(.v-overlay__content) {
  max-width: min(95vw, calc(100vw - 48px));
}
.weekday-select-pills :deep(.v-field) {
  min-height: 36px;
}
.weekday-select-pills :deep(.v-chip) {
  font-size: 0.75rem;
  height: 24px;
}
/* 配額欄位：略寬、較易點選 */
.td-quota {
  min-width: 100px;
}
.td-quota :deep(.v-field) {
  min-height: 40px;
}
/* 開始日期欄位：表頭與儲格加寬，讓完整日期可見 */
.col-start-date {
  min-width: 160px;
}
.td-start-date {
  min-width: 160px;
}
.td-start-date :deep(.v-field__input) {
  min-width: 8ch;
}
.td-service-qty {
  width: 1%;
  min-width: 100px;
}
.td-service-qty :deep(.v-field) {
  min-width: 100px;
  max-width: none;
}
.td-service-qty :deep(.v-field__input) {
  text-align: right;
  min-width: 4ch;
}
/* 服務項目組合表格、導入表格：儲格不換行 */
.schedule-items-table :deep(td),
.schedule-items-table :deep(th),
.import-carefee-table :deep(td),
.import-carefee-table :deep(th) {
  white-space: nowrap;
}
</style>
