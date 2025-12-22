<template>
  <v-dialog v-model="dialog" max-width="900px" persistent>
    <template #activator="{ props }">
      <v-btn v-bind="props" color="success" variant="elevated" prepend-icon="mdi-file-import" @click="openDialog">
        匯入 HTML
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="d-flex align-center bg-success text-white pa-4">
        <v-icon class="mr-2">mdi-file-import</v-icon>
        <span class="text-h6">匯入照服平台資料</span>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" color="white" @click="closeDialog"></v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- 步驟指示器 -->
        <v-stepper v-model="step" alt-labels>
          <v-stepper-header>
            <v-stepper-item title="選擇檔案" value="1" :complete="parseInt(step) > 1"></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item title="預覽資料" value="2" :complete="parseInt(step) > 2"></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item title="確認匯入" value="3"></v-stepper-item>
          </v-stepper-header>

          <v-stepper-window v-model="step">
            <!-- 步驟 1: 選擇檔案 -->
            <v-stepper-window-item value="1">
              <v-card flat>
                <v-card-text>
                  <v-alert type="info" variant="tonal" class="mb-4">
                    <div class="text-subtitle-2 mb-2">支援格式說明</div>
                    <ul class="text-body-2">
                      <li>僅支援從「照顧服務管理資訊平臺」匯出的 HTML 檔案</li>
                      <li>系統會自動解析檔案內容並提取個案資料</li>
                      <li>若身分證字號重複，將更新現有資料</li>
                    </ul>
                  </v-alert>

                  <v-file-input v-model="files" label="選擇 HTML 檔案" accept=".html,.htm" multiple chips
                    prepend-icon="mdi-file-document" variant="outlined" :rules="fileRules" show-size
                    @change="onFileChange">
                    <template #selection="{ fileNames }">
                      <template v-for="(fileName, index) in fileNames" :key="fileName">
                        <v-chip v-if="index < 3" color="primary" size="small" class="mr-2">
                          {{ fileName }}
                        </v-chip>
                      </template>
                      <span v-if="fileNames.length > 3" class="text-caption text-grey">
                        +{{ fileNames.length - 3 }} 個檔案
                      </span>
                    </template>
                  </v-file-input>

                  <v-progress-linear v-if="parsing" indeterminate color="primary" class="mt-4"></v-progress-linear>
                  
                  <div v-if="parseErrors.length > 0" class="mt-4">
                    <v-alert type="warning" variant="tonal">
                      <div class="text-subtitle-2 mb-2">解析警告（共 {{ parseErrors.length }} 項）</div>
                      <div class="text-body-2" style="max-height: 300px; overflow-y: auto;">
                        <div v-for="(error, index) in parseErrors" :key="index" class="mb-2">
                          <strong>{{ index + 1 }}.</strong> {{ error }}
                        </div>
                      </div>
                    </v-alert>
                  </div>
                </v-card-text>
              </v-card>
            </v-stepper-window-item>

            <!-- 步驟 2: 預覽資料 -->
            <v-stepper-window-item value="2">
              <v-card flat>
                <v-card-text>
                  <v-alert type="success" variant="tonal" class="mb-4">
                    成功解析 {{ parsedData.length }} 筆資料（預覽項目：{{ previewItems.length }}）
                  </v-alert>

                  <!-- 除錯資訊 -->
                  <div v-if="parsedData.length > 0" class="mb-4 pa-3 bg-grey-lighten-4 rounded">
                    <div class="text-caption mb-2">除錯資訊：</div>
                    <div class="text-caption">parsedData.length: {{ parsedData.length }}</div>
                    <div class="text-caption">previewItems.length: {{ previewItems.length }}</div>
                    <div class="text-caption">第一筆資料預覽: {{ JSON.stringify(previewItems[0]) }}</div>
                  </div>

                  <v-data-table :headers="previewHeaders" :items="previewItems" :items-per-page="5" density="comfortable">
                    <template #item.name="{ item }">
                      <div class="font-weight-medium">{{ item.name || '--' }}</div>
                    </template>
                    <template #item.id_num="{ item }">
                      <v-chip size="small" variant="tonal">{{ item.id_num || '--' }}</v-chip>
                    </template>
                    <template #item.sex="{ item }">
                      <v-icon :color="item.sex === '男' ? 'blue' : 'pink'" size="small">
                        {{ item.sex === '男' ? 'mdi-gender-male' : 'mdi-gender-female' }}
                      </v-icon>
                      {{ item.sex || '--' }}
                    </template>
                    <template #item.birthday="{ item }">
                      {{ item.birthday || '--' }}
                    </template>
                    <template #item.status="{ item }">
                      <v-chip v-if="item.success" color="success" size="small" variant="tonal">
                        <v-icon start size="small">mdi-check-circle</v-icon>
                        有效
                      </v-chip>
                      <v-chip v-else color="error" size="small" variant="tonal">
                        <v-icon start size="small">mdi-alert-circle</v-icon>
                        錯誤
                      </v-chip>
                    </template>
                    <template #item.errors="{ item }">
                      <div v-if="!item.success && item.errors && item.errors.length > 0" class="text-caption text-error" style="max-width: 300px;">
                        <div v-for="(error, idx) in item.errors.slice(0, 2)" :key="idx" class="mb-1">
                          • {{ error }}
                        </div>
                        <div v-if="item.errors.length > 2" class="text-grey">
                          ...還有 {{ item.errors.length - 2 }} 個錯誤
                        </div>
                      </div>
                      <span v-else class="text-caption text-grey">--</span>
                    </template>
                    <template #item.actions="{ item }">
                      <v-btn icon="mdi-eye" size="small" variant="text" @click="viewDetail(item.rawItem)"></v-btn>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-stepper-window-item>

            <!-- 步驟 3: 確認匯入 -->
            <v-stepper-window-item value="3">
              <v-card flat>
                <v-card-text>
                  <v-alert type="warning" variant="tonal" class="mb-4">
                    <div class="text-subtitle-2 mb-2">匯入前確認</div>
                    <ul class="text-body-2">
                      <li>即將匯入 {{ validDataCount }} 筆有效資料</li>
                      <li>若身分證字號已存在，將更新原有資料</li>
                      <li>匯入後無法復原，請確認資料正確</li>
                    </ul>
                  </v-alert>

                  <v-progress-linear v-if="importing" :model-value="importProgress" color="success" height="25"
                    class="mb-4">
                    <template #default="{ value }">
                      <strong>{{ Math.ceil(value) }}%</strong>
                    </template>
                  </v-progress-linear>

                  <div v-if="importResult" class="mt-4">
                    <v-alert :type="importResult.success ? 'success' : 'error'" variant="tonal">
                      <div class="text-subtitle-2 mb-2">{{ importResult.message }}</div>
                      <div v-if="importResult.details" class="text-body-2">
                        <div>成功: {{ importResult.details.success }} 筆</div>
                        <div>失敗: {{ importResult.details.failed }} 筆</div>
                        <div v-if="importResult.details.updated > 0">更新: {{ importResult.details.updated }} 筆</div>
                      </div>
                    </v-alert>
                  </div>
                </v-card-text>
              </v-card>
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn v-if="parseInt(step) > 1 && !importing && !importResult" variant="text" @click="previousStep">
          上一步
        </v-btn>
        <v-btn v-if="parseInt(step) < 3" color="primary" variant="elevated" :disabled="!canProceed" @click="nextStep">
          下一步
        </v-btn>
        <v-btn v-if="step === '3' && !importing && !importResult" color="success" variant="elevated"
          :disabled="validDataCount === 0" @click="startImport">
          開始匯入
        </v-btn>
        <v-btn v-if="importResult" color="primary" variant="elevated" @click="finishImport">
          完成
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- 詳細資料對話框 -->
    <v-dialog v-model="detailDialog" max-width="800px" scrollable>
      <v-card v-if="selectedItem">
        <v-card-title class="bg-primary text-white">
          <div class="d-flex align-center justify-space-between">
            <span>資料詳情 - {{ selectedItem.data?.name || '未命名' }}</span>
            <v-chip v-if="!selectedItem.success" color="error" size="small">
              <v-icon start size="small">mdi-alert</v-icon>
              有錯誤
            </v-chip>
          </div>
        </v-card-title>
        
        <v-card-text class="pa-4">
          <!-- 錯誤訊息 -->
          <v-alert v-if="!selectedItem.success && selectedItem.errors?.length > 0" type="error" variant="tonal" class="mb-4">
            <div class="text-subtitle-2 mb-2">驗證錯誤</div>
            <ul class="text-body-2">
              <li v-for="(error, idx) in selectedItem.errors" :key="idx">{{ error }}</li>
            </ul>
          </v-alert>

          <!-- 基本資料 -->
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon class="mr-2">mdi-account</v-icon>
                基本資料
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title>檔案名稱</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.fileName }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>姓名</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.data?.name || '--' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>身分證字號</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.data?.id_num || '--' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>性別</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.data?.sex || '--' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>出生日期</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.data?.birthday || '--' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>電話</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.data?.phone || '--' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>戶籍地址</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.data?.registered_address || '--' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>居住地址</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.data?.living_address || '--' }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- 聯絡人資料 -->
            <v-expansion-panel v-if="selectedItem.data?.contactMan?.length > 0">
              <v-expansion-panel-title>
                <v-icon class="mr-2">mdi-contacts</v-icon>
                聯絡人資料
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list density="compact">
                  <v-list-item v-for="(contact, idx) in selectedItem.data.contactMan" :key="idx">
                    <v-list-item-title>聯絡人 {{ idx + 1 }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ contact.man }} ({{ contact.relationship }})<br>
                      電話：{{ contact.phone }}<br>
                      地址：{{ contact.address }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- ADL 評估 -->
            <v-expansion-panel v-if="selectedItem.data?.adl_assessment">
              <v-expansion-panel-title>
                <v-icon class="mr-2">mdi-human-handsup</v-icon>
                ADL 評估（總分：{{ selectedItem.data.adl_assessment.total_score }}）
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list density="compact">
                  <v-list-item v-for="(value, key) in selectedItem.data.adl_assessment" :key="key">
                    <v-list-item-title v-if="key !== 'total_score'">{{ key }}</v-list-item-title>
                    <v-list-item-subtitle v-if="key !== 'total_score'">{{ value || '--' }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- 原始資料摘要 -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon class="mr-2">mdi-code-json</v-icon>
                原始資料摘要
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list density="compact">
                  <v-list-item v-if="selectedItem.data?.raw_data">
                    <v-list-item-title>資料來源</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.data.raw_data.source }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item v-if="selectedItem.data?.adl_assessment">
                    <v-list-item-title>ADL 總分</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.data.adl_assessment.total_score }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item v-if="selectedItem.data?.iadl_assessment">
                    <v-list-item-title>IADL 總分</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.data.iadl_assessment.total_score }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="detailDialog = false">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { parseMultipleHTMLFiles } from '@/assets/js/htmlParser.js'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'
import dayjs from 'dayjs'

const store = useStore()
const emit = defineEmits(['import-success'])

const dialog = ref(false)
const step = ref('1') // 使用字串以匹配 v-stepper-item 的 value
const files = ref([])
const parsing = ref(false)
const parseErrors = ref([])
const parsedData = ref([])
const importing = ref(false)
const importProgress = ref(0)
const importResult = ref(null)
const detailDialog = ref(false)
const selectedItem = ref(null)

const fileRules = [
  (value) => !value || value.length === 0 || value.every(f => f.name.endsWith('.html') || f.name.endsWith('.htm')) || '僅支援 HTML 檔案'
]

const previewHeaders = [
  { title: '姓名', key: 'name', sortable: true },
  { title: '身分證字號', key: 'id_num', sortable: true },
  { title: '性別', key: 'sex', sortable: true },
  { title: '出生日期', key: 'birthday', sortable: true },
  { title: '狀態', key: 'status', sortable: false },
  { title: '錯誤訊息', key: 'errors', sortable: false },
  { title: '操作', key: 'actions', sortable: false }
]

const canProceed = computed(() => {
  console.log('計算 canProceed，step:', step.value)
  
  if (step.value === '1') {
    const can = files.value && files.value.length > 0 && !parsing.value && parsedData.value.length > 0
    console.log('步驟 1 canProceed:', can, {
      hasFiles: files.value && files.value.length > 0,
      notParsing: !parsing.value,
      hasParsedData: parsedData.value.length > 0
    })
    return can
  }
  if (step.value === '2') {
    const can = parsedData.value.length > 0
    console.log('步驟 2 canProceed:', can)
    return can
  }
  return true
})

const validDataCount = computed(() => {
  return parsedData.value.filter(item => item.success).length
})

const previewItems = computed(() => {
  console.log('計算 previewItems，parsedData.value:', parsedData.value)
  const items = parsedData.value.map(item => {
    const previewItem = {
      name: item.data?.name || '--',
      id_num: item.data?.id_num || '--',
      sex: item.data?.sex || '--',
      birthday: item.data?.birthday || '--',
      success: item.success,
      errors: item.errors || [],
      rawItem: item // 保留原始資料供詳細檢視使用
    }
    console.log('previewItem:', previewItem)
    return previewItem
  })
  console.log('previewItems 結果:', items)
  return items
})

const openDialog = () => {
  dialog.value = true
  resetDialog()
}

const closeDialog = () => {
  if (!importing.value) {
    dialog.value = false
    resetDialog()
  }
}

const resetDialog = () => {
  step.value = '1'
  files.value = []
  parsing.value = false
  parseErrors.value = []
  parsedData.value = []
  importing.value = false
  importProgress.value = 0
  importResult.value = null
}

const onFileChange = async () => {
  console.log('onFileChange 觸發，files:', files.value)
  if (files.value && files.value.length > 0) {
    await parseFiles()
    console.log('parseFiles 完成後，parsedData.length:', parsedData.value.length)
    console.log('canProceed:', canProceed.value)
  }
}

const parseFiles = async () => {
  parsing.value = true
  parseErrors.value = []
  parsedData.value = []

  try {
    console.log('開始解析檔案，共', files.value.length, '個檔案')
    const results = await parseMultipleHTMLFiles(files.value)
    console.log('解析完成，結果：', results)
    parsedData.value = results

    const errors = results.filter(r => !r.success)
    if (errors.length > 0) {
      parseErrors.value = errors.flatMap(e => e.errors)
      console.log('解析錯誤：', parseErrors.value)
    }
    
    console.log('parsedData.value:', parsedData.value)
  } catch (error) {
    console.error('解析過程發生錯誤：', error)
    parseErrors.value = [error.message]
  } finally {
    parsing.value = false
  }
}

const nextStep = () => {
  console.log('點擊下一步，當前 step:', step.value)
  console.log('parsedData.length:', parsedData.value.length)
  console.log('canProceed:', canProceed.value)
  
  const stepNum = parseInt(step.value)
  if (stepNum < 3) {
    step.value = String(stepNum + 1)
    console.log('步驟已更新為:', step.value)
    
    // 如果進入步驟 2，強制觸發 previewItems 的計算
    if (step.value === '2') {
      console.log('進入步驟 2，previewItems:', previewItems.value)
    }
  }
}

const previousStep = () => {
  const stepNum = parseInt(step.value)
  if (stepNum > 1) {
    step.value = String(stepNum - 1)
    console.log('返回步驟:', step.value)
  }
}

const viewDetail = (item) => {
  selectedItem.value = item
  detailDialog.value = true
}

const startImport = async () => {
  importing.value = true
  importProgress.value = 0

  const validData = parsedData.value.filter(item => item.success)
  const total = validData.length
  let successCount = 0
  let failedCount = 0
  let updatedCount = 0

  try {
    // 先取得所有現有用戶資料
    const existingUsers = await api.get('user')
    
    for (let i = 0; i < validData.length; i++) {
      const item = validData[i]
      
      try {
        // 檢查是否已存在（以身分證字號為準）
        const existing = existingUsers.find(u => {
          const userData = JSON.parse(u.datalist)
          return userData.id_num === item.data.id_num
        })

        if (existing) {
          // 更新現有資料
          const existingData = JSON.parse(existing.datalist)
          
          // 合併資料，保留原有的 snkey, createInfo, editInfo, picInfo
          const updatedData = {
            ...item.data,
            snkey: existing.snkey,
            createInfo: existingData.createInfo || {},
            editInfo: existingData.editInfo || [],
            picInfo: existingData.picInfo || { picName: '', picOriginalName: '' },
            p_code: existingData.p_code || item.data.p_code
          }

          // 新增編輯記錄
          updatedData.editInfo.unshift({
            snkey: store.state.pData?.snkey || '',
            name: store.state.pData?.username || '系統',
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            note: '從 HTML 匯入更新'
          })

          const postData = {
            snkey: existing.snkey,
            datalist: JSON.stringify(updatedData),
            updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
          }

          const rs = await api.post('user', postData)
          if (rs?.state == 1) {
            successCount++
            updatedCount++
          } else {
            failedCount++
          }
        } else {
          // 新增資料
          // 生成病歷號
          const userCount = existingUsers.length + successCount
          item.data.p_code = (userCount + 1).toString().padStart(4, '0')
          
          item.data.createInfo = {
            snkey: store.state.pData?.snkey || '',
            name: store.state.pData?.username || '系統',
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            note: '從 HTML 匯入'
          }

          const postData = {
            datalist: JSON.stringify(item.data)
          }

          const rs = await api.add('user', postData)
          if (rs?.state == 1) {
            successCount++
          } else {
            failedCount++
          }
        }
      } catch (error) {
        console.error('匯入單筆資料失敗:', error)
        failedCount++
      }

      importProgress.value = ((i + 1) / total) * 100
    }

    importResult.value = {
      success: failedCount === 0,
      message: failedCount === 0 ? '匯入完成！' : '匯入完成，部分資料失敗',
      details: {
        success: successCount,
        failed: failedCount,
        updated: updatedCount
      }
    }
  } catch (error) {
    console.error('匯入過程發生錯誤:', error)
    importResult.value = {
      success: false,
      message: '匯入失敗: ' + error.message,
      details: {
        success: successCount,
        failed: failedCount,
        updated: updatedCount
      }
    }
  } finally {
    importing.value = false
  }
}

const finishImport = () => {
  emit('import-success')
  closeDialog()
}
</script>

<style scoped>
.v-stepper {
  box-shadow: none;
}
</style>

