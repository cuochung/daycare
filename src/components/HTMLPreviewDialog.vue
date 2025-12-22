<template>
  <v-dialog v-model="dialog" persistent scrollable>
    <template #activator="{ props }">
      <v-btn v-bind="props" color="info" variant="elevated" prepend-icon="mdi-file-search" @click="openDialog">
        匯入 HTML 內容
      </v-btn>
    </template>

    <v-card>
      <v-card-title :class="['d-flex', 'align-center', 'text-white', 'pa-4', isPreviewMode ? 'bg-success' : 'bg-info']">
        <v-icon class="mr-2">mdi-file-search</v-icon>
        <span class="text-h6">{{ isPreviewMode ? '資料一覽' : '匯入 HTML 檔案內容' }}</span>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" color="white" @click="closeDialog"></v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- 檔案選擇區域（僅在非預覽模式顯示） -->
        <v-card v-if="!isPreviewMode" variant="outlined" class="mb-4">
          <v-card-text>
            <v-alert type="info" variant="tonal" class="mb-4">
              <div class="text-subtitle-2 mb-2">功能說明</div>
              <ul class="text-body-2">
                <li>選擇從「照顧服務管理資訊平臺」匯出的 HTML 檔案</li>
                <li>系統會解析並顯示檔案中所有可截取的資料</li>
                <li>解析完成後可執行匯入功能</li>
              </ul>
            </v-alert>

            <v-file-input 
              v-model="selectedFile" 
              label="選擇 HTML 檔案" 
              accept=".html,.htm" 
              prepend-icon="mdi-file-document" 
              variant="outlined" 
              :rules="fileRules" 
              show-size
              @change="onFileChange"
              clearable
            >
            </v-file-input>

            <v-progress-linear v-if="parsing" indeterminate color="info" class="mt-2"></v-progress-linear>
          </v-card-text>
        </v-card>

        <!-- 解析結果區域 -->
        <v-card v-if="parsedData || parseError" variant="outlined">
          <v-card-title class="d-flex align-center justify-space-between">
            <span>解析結果</span>
            <v-btn-toggle v-if="parsedData" v-model="viewMode" mandatory color="primary" density="compact">
              <v-btn value="sections" size="small">
                <v-icon start>mdi-file-tree</v-icon>
                區段檢視
              </v-btn>
              <v-btn value="fields" size="small">
                <v-icon start>mdi-table</v-icon>
                欄位清單
              </v-btn>
              <v-btn value="json" size="small">
                <v-icon start>mdi-code-json</v-icon>
                JSON 檢視
              </v-btn>
            </v-btn-toggle>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <!-- 解析錯誤 -->
            <v-alert v-if="parseError" type="error" variant="tonal">
              <div class="text-subtitle-2 mb-2">解析失敗</div>
              <div class="text-body-2">{{ parseError }}</div>
            </v-alert>

            <!-- 解析統計（僅在非預覽模式顯示） -->
            <v-alert v-if="parsedData && parsedData.metadata && !isPreviewMode" type="success" variant="tonal" class="mb-4">
              <div class="text-subtitle-2 mb-2">解析完成</div>
              <div class="text-body-2">
                <v-chip size="small" class="mr-2">區段：{{ parsedData.metadata.totalSections }}</v-chip>
                <v-chip size="small" class="mr-2">表格：{{ parsedData.metadata.totalTables }}</v-chip>
                <v-chip size="small">欄位：{{ parsedData.metadata.totalFields }}</v-chip>
              </div>
              <div v-if="parsedData.metadata.headerInfo" class="mt-2 text-body-2">
                <div v-for="(info, idx) in parsedData.metadata.headerInfo" :key="idx">
                  {{ info }}
                </div>
              </div>
            </v-alert>

            <!-- 區段檢視 -->
            <div v-if="viewMode === 'sections' && parsedData && filteredSections.length > 0">
              <v-expansion-panels variant="accordion">
                <v-expansion-panel v-for="(section, sectionIdx) in filteredSections" :key="sectionIdx">
                  <v-expansion-panel-title>
                    <v-icon class="mr-2">{{ getSectionIcon(section.sectionTitle) }}</v-icon>
                    <strong>{{ section.sectionTitle }}</strong>
                    <v-chip size="small" class="ml-2">
                      {{ getSectionFieldCount(section) }} 個欄位
                    </v-chip>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div v-for="(table, tableIdx) in section.tables" :key="tableIdx" class="mb-3">
                      <!-- 服務項目表格（從「照顧及專業服務」開始的區段） -->
                      <v-table v-if="isServiceSection(section.sectionTitle) && table.fields.some(f => isServiceItemField(f.fieldName))" density="compact" class="elevation-1">
                        <thead>
                          <tr>
                            <th class="font-weight-bold">服務項目</th>
                            <th class="font-weight-bold text-end">金額</th>
                            <th class="font-weight-bold text-end">服務數量</th>
                            <th class="font-weight-bold text-end">小計</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, itemIdx) in organizeServiceItems(table.fields)" :key="itemIdx">
                            <td class="font-weight-medium">{{ item.name }}</td>
                            <td class="text-end">{{ item.金額 || '--' }}</td>
                            <td class="text-end">{{ item.服務數量 || '--' }}</td>
                            <td class="text-end">{{ item.小計 || '--' }}</td>
                          </tr>
                          <tr v-if="organizeServiceItems(table.fields).length === 0">
                            <td colspan="4" class="text-center text-grey">暫無資料</td>
                          </tr>
                        </tbody>
                      </v-table>
                      
                      <!-- 一般欄位表格 -->
                      <v-table v-else density="compact" class="elevation-1">
                        <tbody>
                          <template v-for="(field, fieldIdx) in table.fields" :key="fieldIdx">
                            <!-- 子標題行（針對 G.特殊複雜照護需要 區段） -->
                            <tr v-if="section.sectionTitle && section.sectionTitle.includes('特殊複雜照護需要') && shouldShowSubtitle(field, fieldIdx, table.fields)">
                              <td colspan="2" class="font-weight-bold bg-grey-lighten-4 pa-3" style="font-size: 1rem;">
                                {{ getSubtitle(field) }}
                              </td>
                            </tr>
                            <!-- 一般欄位行 -->
                            <tr>
                              <td class="font-weight-bold" width="35%">
                                {{ field.fieldName }}
                              </td>
                              <td>
                                <!-- 顯示欄位值（無論是否為列表資料，都只顯示文字） -->
                                <span v-if="field.fieldValue || field.extraInfo?.mackayPlan">
                                  {{ field.fieldValue || '--' }}
                                  <v-chip v-if="field.extraInfo?.mackayPlan" size="small" color="info" variant="tonal" class="ml-2">
                                    馬偕計畫外籍人士
                                  </v-chip>
                                </span>
                                <span v-else class="text-grey">--</span>
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </v-table>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>

            <!-- 欄位清單檢視 -->
            <div v-if="viewMode === 'fields' && parsedData && Object.keys(allFieldsFromSections).length > 0">
              <v-card variant="outlined">
                <v-card-title>
                  所有欄位列表（共 {{ Object.keys(allFieldsFromSections).length }} 個欄位）
                </v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="fieldSearchQuery"
                    label="搜尋欄位"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    clearable
                    class="mb-3"
                  ></v-text-field>
                  
                  <v-table density="compact" class="elevation-1" fixed-header height="500px">
                    <thead>
                      <tr>
                        <th width="40%">欄位名稱</th>
                        <th>欄位值</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(value, key) in filteredFields" :key="key">
                        <td class="font-weight-bold">{{ key }}</td>
                        <td>
                          <span v-if="value">{{ value }}</span>
                          <span v-else class="text-grey">--</span>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-card-text>
              </v-card>
            </div>

            <!-- JSON 檢視 -->
            <div v-if="viewMode === 'json' && parsedData">
              <JsonViewer :data="{ sections: filteredSections, metadata: parsedData.metadata }" :max-depth="3"></JsonViewer>
            </div>
          </v-card-text>
        </v-card>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <!-- 匯入按鈕（僅在非預覽模式顯示） -->
        <v-btn 
          v-if="parsedData && !isPreviewMode" 
          color="success" 
          variant="elevated" 
          prepend-icon="mdi-import"
          :loading="importing"
          :disabled="importing"
          @click="handleImport"
        >
          匯入資料
        </v-btn>
        <v-btn color="primary" variant="elevated" @click="closeDialog">
          關閉
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { parseHTMLToRawData, parseHTMLToUserData } from '@/assets/js/htmlParser.js'
import JsonViewer from './JsonViewer.vue'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'
import dayjs from 'dayjs'

const store = useStore()
const emit = defineEmits(['import-success'])

const dialog = ref(false)
const selectedFile = ref(null)
const parsing = ref(false)
const parsedData = ref(null)
const parseError = ref(null)
const viewMode = ref('sections')
const fieldSearchQuery = ref('')
const importing = ref(false)
const userData = ref(null)
const isPreviewMode = ref(false) // 標記是否為預覽模式（從資料庫載入）

const fileRules = [
  (value) => !value || value.name.endsWith('.html') || value.name.endsWith('.htm') || '僅支援 HTML 檔案'
]

// 從 filteredSections 構建欄位列表（與區段檢視保持一致）
const allFieldsFromSections = computed(() => {
  if (!filteredSections.value || filteredSections.value.length === 0) return {}
  
  const fields = {}
  filteredSections.value.forEach(section => {
    section.tables.forEach(table => {
      table.fields.forEach(field => {
        if (field.fieldName && field.fieldValue !== undefined) {
          fields[field.fieldName] = field.fieldValue
        }
      })
    })
  })
  return fields
})

const filteredFields = computed(() => {
  const fields = allFieldsFromSections.value
  if (!fields || Object.keys(fields).length === 0) return {}
  
  const query = fieldSearchQuery.value?.toLowerCase() || ''
  if (!query) return fields
  
  const filtered = {}
  for (const [key, value] of Object.entries(fields)) {
    if (key.toLowerCase().includes(query) || String(value).toLowerCase().includes(query)) {
      filtered[key] = value
    }
  }
  return filtered
})

// 過濾後的區段列表（排除「申請表」和「評估結果」）
const filteredSections = computed(() => {
  if (!parsedData.value || !parsedData.value.sections) return []
  return parsedData.value.sections.filter(section => {
    if (!section.sectionTitle) return true
    // 排除「申請表」和「評估結果」
    return !section.sectionTitle.includes('申請表') && !section.sectionTitle.includes('評估結果')
  })
})

// 計算區段的實際欄位數（只計算有 fieldName 的欄位）
const getSectionFieldCount = (section) => {
  if (!section || !section.tables) return 0
  return section.tables.reduce((sum, table) => {
    if (!table.fields) return sum
    // 只計算有 fieldName 的欄位
    const validFields = table.fields.filter(field => field.fieldName && field.fieldName.trim() !== '')
    return sum + validFields.length
  }, 0)
}

// 判斷是否為服務項目區段（從「照顧及專業服務」開始的區段）
const isServiceSection = (sectionTitle) => {
  if (!sectionTitle) return false
  const serviceKeywords = ['照顧及專業服務', '交通接送', '喘息服務', '勞動部短照', '其他(OTHT)', '縣市自辨項目']
  return serviceKeywords.some(keyword => sectionTitle.includes(keyword))
}

// 判斷欄位是否為服務項目欄位（包含 [金額]、[服務數量]、[小計] 等）
const isServiceItemField = (fieldName) => {
  if (!fieldName) return false
  return /\[(金額|服務數量|小計|項次|服務項目)\]/i.test(fieldName)
}

// 從服務項目欄位名稱中提取服務項目名稱（移除 [金額] 等後綴）
// 欄位名稱格式可能是：BA01[基本身體清潔][金額] 或 BA07[金額] 或 BA20[陪伴服務](10712)[金額]
// 需要提取最後一個 [金額]、[服務數量] 或 [小計] 之前的所有內容
const extractServiceItemName = (fieldName) => {
  if (!fieldName) return ''
  
  // 先移除最後一個 [金額]、[服務數量] 或 [小計]
  const cleanedName = fieldName.replace(/\[(金額|服務數量|小計)\]$/, '')
  
  // 如果還有其他 [...]，保留完整的服務項目名稱（如 BA01[基本身體清潔] 或 BA20[陪伴服務](10712)）
  return cleanedName
}

// 從服務項目欄位名稱中提取欄位類型（金額、服務數量、小計等）
// 欄位名稱格式可能是：BA01[基本身體清潔][金額] 或 BA07[金額]
// 需要提取最後一個 [...] 的內容
const extractServiceFieldType = (fieldName) => {
  if (!fieldName) return ''
  // 匹配最後一個 [...] 的內容
  const matches = fieldName.match(/\[([^\]]+)\]$/g)
  if (matches && matches.length > 0) {
    // 取得最後一個匹配，並移除方括號
    const lastMatch = matches[matches.length - 1]
    return lastMatch.replace(/[\[\]]/g, '')
  }
  // 如果沒有找到，嘗試匹配第一個（向後兼容）
  const match = fieldName.match(/\[(.+?)\]/)
  return match ? match[1] : ''
}

// 將服務項目欄位組織成表格資料
const organizeServiceItems = (fields) => {
  const itemsMap = {}
  
  // 調試：輸出所有欄位
  if (fields && fields.length > 0) {
    console.log('[服務項目組織] 所有欄位:', fields.map(f => ({ name: f.fieldName, value: f.fieldValue })))
  }
  
  fields.forEach(field => {
    if (!field || !field.fieldName) return
    
    // 檢查是否為服務項目欄位（包含 [金額]、[服務數量]、[小計] 等）
    if (isServiceItemField(field.fieldName)) {
      const itemName = extractServiceItemName(field.fieldName)
      const fieldType = extractServiceFieldType(field.fieldName)
      
      console.log('[服務項目組織] 處理欄位:', { 
        fieldName: field.fieldName, 
        itemName, 
        fieldType, 
        fieldValue: field.fieldValue 
      })
      
      if (!itemName) return
      
      if (!itemsMap[itemName]) {
        itemsMap[itemName] = {
          name: itemName,
          金額: '',
          服務數量: '',
          小計: ''
        }
      }
      
      // 只記錄金額、服務數量、小計
      if (['金額', '服務數量', '小計'].includes(fieldType)) {
        const value = field.fieldValue
        // 即使值為空字串也要記錄（會顯示為 "--"）
        if (value !== undefined && value !== null) {
          itemsMap[itemName][fieldType] = String(value)
          console.log('[服務項目組織] 更新:', itemName, fieldType, '=', value)
        } else {
          // 如果值為 undefined 或 null，設為空字串
          itemsMap[itemName][fieldType] = ''
          console.log('[服務項目組織] 值為空:', itemName, fieldType, 'value=', value)
        }
      }
    }
  })
  
  const result = Object.values(itemsMap)
  console.log('[服務項目組織] 最終結果:', result)
  
  // 返回所有項目，即使值為空也顯示（但顯示為 --）
  return result
}

const openDialog = () => {
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  resetDialog()
}

const resetDialog = () => {
  selectedFile.value = null
  parsing.value = false
  parsedData.value = null
  parseError.value = null
  viewMode.value = 'sections'
  fieldSearchQuery.value = ''
  userData.value = null
  isPreviewMode.value = false
}

// 從 userFullData 讀取並顯示資料
const loadFromUserFullData = async (userSnkey) => {
  try {
    // 設置為預覽模式
    isPreviewMode.value = true
    dialog.value = true
    parsing.value = true
    parseError.value = null
    parsedData.value = null
    userData.value = null
    viewMode.value = 'sections'
    fieldSearchQuery.value = ''
    selectedFile.value = null

    // 從 userFullData 中讀取資料
    const allFullData = await api.get('userFullData')
    const fullDataRecord = allFullData.find(item => {
      const data = JSON.parse(item.datalist)
      return data.user_snkey === userSnkey || data.user_snkey === String(userSnkey)
    })

    if (!fullDataRecord) {
      parseError.value = '找不到對應的完整資料'
      parsing.value = false
      return
    }

    const fullData = JSON.parse(fullDataRecord.datalist)

    // 設置資料
    if (fullData.rawData) {
      parsedData.value = fullData.rawData
      
      // 確保 allFields 存在
      if (!parsedData.value.allFields) {
        parsedData.value.allFields = {}
      }
      
      // 確保基本欄位都加入到 allFields（如果還沒有或值為空/無效）
      if (fullData.userData && parsedData.value.allFields) {
        // 補充個案姓名（如果不存在或值為空/無效）
        if (fullData.userData.name) {
          const currentValue = parsedData.value.allFields['個案姓名']
          if (!currentValue || currentValue.trim() === '' || currentValue === '--') {
            parsedData.value.allFields['個案姓名'] = fullData.userData.name
          }
        }
        
        // 補充個案身分證（如果不存在或值為空/無效）
        if (fullData.userData.id_num) {
          const currentValue = parsedData.value.allFields['個案身分證']
          if (!currentValue || currentValue.trim() === '' || currentValue === '--') {
            parsedData.value.allFields['個案身分證'] = fullData.userData.id_num
          }
        }
        
        // 補充個案生日（如果不存在或值為空/無效）
        if (fullData.userData.birthday) {
          const currentValue = parsedData.value.allFields['個案生日']
          if (!currentValue || currentValue.trim() === '' || currentValue === '--') {
            parsedData.value.allFields['個案生日'] = fullData.userData.birthday
          }
        }
        
        // 補充性別（如果不存在或值為空/無效）
        if (fullData.userData.sex) {
          const currentValue = parsedData.value.allFields['性別']
          if (!currentValue || currentValue.trim() === '' || currentValue === '--') {
            parsedData.value.allFields['性別'] = fullData.userData.sex
          }
        }
        
        // 補充個案電話（如果不存在或值為空/無效）
        if (fullData.userData.phone) {
          const currentValue = parsedData.value.allFields['個案電話']
          if (!currentValue || currentValue.trim() === '' || currentValue === '--') {
            parsedData.value.allFields['個案電話'] = fullData.userData.phone
          }
        }
      }
    } else {
      parseError.value = '資料格式不正確：缺少 rawData'
      parsing.value = false
      return
    }

    if (fullData.userData) {
      userData.value = fullData.userData
    }

    parsing.value = false
    // 解析完成時輸出三個檢視的內容
    if (parsedData.value) {
      outputViewContents()
    }
  } catch (error) {
    parseError.value = '載入資料失敗: ' + (error.message || '未知錯誤')
    parsing.value = false
  }
}

// 暴露方法給父組件
defineExpose({
  loadFromUserFullData,
  openDialog
})

const onFileChange = async () => {
  if (selectedFile.value) {
    await parseFile()
  }
}

const parseFile = async () => {
  parsing.value = true
  parseError.value = null
  parsedData.value = null
  userData.value = null

  try {
    const content = await readFileAsText(selectedFile.value)
    const rawData = parseHTMLToRawData(content)
    parsedData.value = rawData
    
    // 同時解析為用戶資料格式
    try {
      userData.value = parseHTMLToUserData(content)
      
      // 確保 allFields 存在
      if (!parsedData.value.allFields) {
        parsedData.value.allFields = {}
      }
      
      // 檢查「需要服務者基本資料」區段的資料狀況
      let basicInfoSection = null
      if (parsedData.value.sections) {
        basicInfoSection = parsedData.value.sections.find(section => 
          section.sectionTitle && section.sectionTitle.includes('需要服務者基本資料')
        )
      }
      
      // 輸出「需要服務者基本資料」區段的資料狀況
      if (basicInfoSection) {
        
        // 去除「需要服務者基本資料」區段中的重複欄位
        // 從「身心障礙手冊/證明」到「最後異動日期」的欄位會在「身心障礙證明、ICF資料介接」區段中重複出現
        // 移除「需要服務者基本資料」區段中的這些欄位，保留「身心障礙證明、ICF資料介接」區段中的
        const duplicateFieldPatterns = ['身心障礙手冊', '身心障礙證明', 'ICD', '障礙類別', '障礙程度', '核發', '有效日期', '鑑定日期', '重新鑑定', '最後異動']
        
        // 直接從「需要服務者基本資料」區段中移除這些欄位
        basicInfoSection.tables.forEach((table) => {
          table.fields = table.fields.filter((field) => {
            if (!field.fieldName) return true
            
            // 檢查是否是可能重複的欄位，使用模式匹配
            const isDuplicateField = duplicateFieldPatterns.some(pattern => field.fieldName.includes(pattern))
            
            if (isDuplicateField) {
              // 在「需要服務者基本資料」區段中，直接移除這些欄位
              return false
            }
            
            return true
          })
        })
      }
      
      // 補充基本欄位（如果還沒有或值為空/無效）
      if (userData.value && parsedData.value && parsedData.value.allFields) {
        // 補充個案姓名
        if (userData.value.name) {
          const currentValue = parsedData.value.allFields['個案姓名']
          if (!currentValue || currentValue.trim() === '' || currentValue === '--') {
            parsedData.value.allFields['個案姓名'] = userData.value.name
          }
        }
        
        // 補充個案身分證（檢查可能的欄位名稱變體）
        if (userData.value.id_num) {
          // 可能的欄位名稱變體
          const possibleKeys = ['個案身分證', '個案身分證字號', '身分證', '身分證字號']
          let found = false
          let foundField = null
          
          // 在 sections 中查找「個案身分證」欄位
          if (parsedData.value.sections) {
            parsedData.value.sections.forEach(section => {
              if (section.sectionTitle && section.sectionTitle.includes('需要服務者基本資料')) {
                section.tables.forEach(table => {
                  table.fields.forEach(field => {
                    // 檢查欄位名稱是否包含「身分證」
                    if (field.fieldName && field.fieldName.includes('身分證')) {
                      foundField = field
                      if (field.fieldValue && field.fieldValue.trim() !== '' && field.fieldValue !== '--') {
                        found = true
                      }
                    }
                  })
                })
              }
            })
          }
          
          // 檢查 allFields 中是否有有效值
          for (const key of possibleKeys) {
            const currentValue = parsedData.value.allFields[key]
            if (currentValue && currentValue.trim() !== '' && currentValue !== '--') {
              found = true
              break
            }
          }
          
          // 如果沒找到有效的值，就補充
          if (!found) {
            parsedData.value.allFields['個案身分證'] = userData.value.id_num
            
            // 同時更新 sections 中的欄位值
            if (foundField) {
              foundField.fieldValue = userData.value.id_num
            }
          }
        }
        
        // 檢查「個案身分證」欄位是否有「馬偕計畫外籍人士」checkbox 被勾選
        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(content, 'text/html')
          
          // 查找「個案身分證」欄位所在的 td
          const tables = doc.querySelectorAll('table.table-bordered')
          for (const table of tables) {
            const rows = table.querySelectorAll('tr')
            for (const row of rows) {
              const ths = row.querySelectorAll('th')
              const tds = row.querySelectorAll('td')
              
              for (let i = 0; i < ths.length; i++) {
                const th = ths[i]
                const td = tds[i]
                
                if (th && td) {
                  const thText = th.textContent.trim().replace(/[＊※\s\n\r]/g, '')
                  
                  // 檢查是否是「個案身分證」欄位
                  if (thText.includes('個案身分證') || thText.includes('身分證')) {
                    // 檢查 td 中是否有「馬偕計畫外籍人士」的 checkbox 被勾選
                    const checkedImages = td.querySelectorAll('img[src*="checkbox_checked"]')
                    
                    for (const img of checkedImages) {
                      const label = img.parentElement
                      if (label) {
                        const labelText = label.textContent.trim()
                        // 檢查是否包含「馬偕計畫外籍人士」或「外籍人士」
                        if (labelText.includes('馬偕計畫外籍人士') || labelText.includes('外籍人士')) {
                          // 在 sections 中找到對應的 field 並標記
                          if (parsedData.value.sections) {
                            parsedData.value.sections.forEach(section => {
                              if (section.sectionTitle && section.sectionTitle.includes('需要服務者基本資料')) {
                                section.tables.forEach(tableData => {
                                  tableData.fields.forEach(field => {
                                    if (field.fieldName && field.fieldName.includes('身分證')) {
                                      if (!field.extraInfo) {
                                        field.extraInfo = {}
                                      }
                                      field.extraInfo.mackayPlan = true
                                    }
                                  })
                                })
                              }
                            })
                          }
                          break
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (err) {
          // 檢查「馬偕計畫外籍人士」checkbox 時發生錯誤
        }
        
        // 補充「主要照顧者身分證」欄位（如果沒有取得）
        if (userData.value && userData.value.primary_caregiver && userData.value.primary_caregiver.id_num) {
          if (parsedData.value.sections) {
            parsedData.value.sections.forEach(section => {
              if (section.sectionTitle && (section.sectionTitle.includes('主要及次要照顧者') || section.sectionTitle.includes('照顧者'))) {
                section.tables.forEach(table => {
                  table.fields.forEach(field => {
                    // 檢查欄位名稱是否包含「主要照顧者身分證」
                    if (field.fieldName && (field.fieldName.includes('主要照顧者身分證') || field.fieldName.includes('主要照顧者') && field.fieldName.includes('身分證'))) {
                      if (!field.fieldValue || field.fieldValue.trim() === '' || field.fieldValue === '--') {
                        field.fieldValue = userData.value.primary_caregiver.id_num
                      }
                    }
                  })
                })
              }
            })
          }
          
          // 同時補充到 allFields
          if (parsedData.value.allFields && (!parsedData.value.allFields['主要照顧者身分證'] || parsedData.value.allFields['主要照顧者身分證'].trim() === '' || parsedData.value.allFields['主要照顧者身分證'] === '--')) {
            parsedData.value.allFields['主要照顧者身分證'] = userData.value.primary_caregiver.id_num
          }
        }
        
        // 補充個案生日
        if (userData.value.birthday) {
          const currentValue = parsedData.value.allFields['個案生日']
          if (!currentValue || currentValue.trim() === '' || currentValue === '--') {
            parsedData.value.allFields['個案生日'] = userData.value.birthday
          }
        }
        
        // 補充性別
        if (userData.value.sex) {
          const currentValue = parsedData.value.allFields['性別']
          if (!currentValue || currentValue.trim() === '' || currentValue === '--') {
            parsedData.value.allFields['性別'] = userData.value.sex
          }
        }
        
        // 補充個案電話
        if (userData.value.phone) {
          const currentValue = parsedData.value.allFields['個案電話']
          if (!currentValue || currentValue.trim() === '' || currentValue === '--') {
            parsedData.value.allFields['個案電話'] = userData.value.phone
          }
        }
      }
    } catch (err) {
      // 解析用戶資料失敗
    }
    } catch (error) {
      parseError.value = error.message || '解析過程發生未知錯誤'
    } finally {
      parsing.value = false
      // 解析完成時輸出三個檢視的內容
      if (parsedData.value) {
        outputViewContents()
      }
    }
  }

const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      resolve(e.target.result)
    }
    
    reader.onerror = (e) => {
      reject(new Error('檔案讀取失敗'))
    }
    
    reader.readAsText(file, 'UTF-8')
  })
}

// 判斷是否應該顯示子標題
const shouldShowSubtitle = (field, fieldIdx, fields) => {
  if (!field || !field.fieldName) return false
  
  const fieldName = field.fieldName.trim()
  
  // 檢查是否為子區段的起始欄位
  // G1 開頭（但不是之前的 G1 開頭）
  if (fieldName.match(/^G1[a-z]?\./) && fieldIdx === 0) return true
  if (fieldName.match(/^G1[a-z]?\./)) {
    // 檢查前面是否有其他 G1 開頭的欄位
    for (let i = 0; i < fieldIdx; i++) {
      if (fields[i].fieldName && fields[i].fieldName.match(/^G1[a-z]?\./)) {
        return false // 已經有 G1 開頭的欄位了，不需要再顯示標題
      }
    }
    return true
  }
  
  // G2 開頭
  if (fieldName.match(/^G2/)) {
    for (let i = 0; i < fieldIdx; i++) {
      if (fields[i].fieldName && fields[i].fieldName.match(/^G2/)) {
        return false
      }
    }
    return true
  }
  
  // G3 開頭
  if (fieldName.match(/^G3/)) {
    for (let i = 0; i < fieldIdx; i++) {
      if (fields[i].fieldName && fields[i].fieldName.match(/^G3/)) {
        return false
      }
    }
    return true
  }
  
  // G4d 開頭（需要先於 G4 檢查）
  if (fieldName.match(/^G4d/)) {
    for (let i = 0; i < fieldIdx; i++) {
      if (fields[i].fieldName && fields[i].fieldName.match(/^G4d/)) {
        return false
      }
    }
    return true
  }
  
  // G4 開頭（但不是 G4d）
  if (fieldName.match(/^G4[^d]/)) {
    for (let i = 0; i < fieldIdx; i++) {
      if (fields[i].fieldName && fields[i].fieldName.match(/^G4[^d]/)) {
        return false
      }
    }
    return true
  }
  
  // G5 開頭
  if (fieldName.match(/^G5/)) {
    for (let i = 0; i < fieldIdx; i++) {
      if (fields[i].fieldName && fields[i].fieldName.match(/^G5/)) {
        return false
      }
    }
    return true
  }
  
  // G6 開頭
  if (fieldName.match(/^G6/)) {
    for (let i = 0; i < fieldIdx; i++) {
      if (fields[i].fieldName && fields[i].fieldName.match(/^G6/)) {
        return false
      }
    }
    return true
  }
  
  // G8 開頭
  if (fieldName.match(/^G8/)) {
    for (let i = 0; i < fieldIdx; i++) {
      if (fields[i].fieldName && fields[i].fieldName.match(/^G8/)) {
        return false
      }
    }
    return true
  }
  
  return false
}

// 獲取子標題文字
const getSubtitle = (field) => {
  if (!field || !field.fieldName) return ''
  
  const fieldName = field.fieldName.trim()
  
  if (fieldName.match(/^G1[a-z]?\./)) return 'G1. 疼痛評估'
  if (fieldName.match(/^G2/)) return 'G2. 皮膚狀況'
  if (fieldName.match(/^G3/)) return 'G3. 關節活動度'
  if (fieldName.match(/^G4d/)) return 'G4d. 衰弱評估（SOF）'
  if (fieldName.match(/^G4[^d]/)) return 'G4. 疾病史與營養評估'
  if (fieldName.match(/^G5/)) return 'G5. 進階照顧'
  if (fieldName.match(/^G6/)) return 'G6. 吞嚥能力'
  if (fieldName.match(/^G8/)) return 'G8. 跌倒、平衡及安全'
  
  return ''
}

// 輸出三個檢視的內容到 console
const outputViewContents = () => {
  console.log('=== 解析完成，三個檢視的內容 ===')
  
  // 1. 區段檢視
  console.log('【區段檢視】', filteredSections.value)
  
  // 2. 欄位清單
  console.log('【欄位清單】', allFieldsFromSections.value)
  
  // 3. JSON檢視
  const jsonViewData = {
    sections: filteredSections.value,
    metadata: parsedData.value?.metadata || {}
  }
  console.log('【JSON檢視】', jsonViewData)
  
  console.log('=== 輸出完成 ===')
}

const getSectionIcon = (sectionTitle) => {
  const title = sectionTitle.toLowerCase()
  if (title.includes('基本') || title.includes('申請')) return 'mdi-file-document'
  if (title.includes('個案') || title.includes('聯絡')) return 'mdi-account'
  if (title.includes('照顧')) return 'mdi-account-heart'
  if (title.includes('評估') || title.includes('量表')) return 'mdi-clipboard-check'
  if (title.includes('adl') || title.includes('iadl')) return 'mdi-human-handsup'
  if (title.includes('溝通')) return 'mdi-message-text'
  if (title.includes('認知')) return 'mdi-brain'
  if (title.includes('福利') || title.includes('身分')) return 'mdi-shield-account'
  if (title.includes('照護') || title.includes('計畫')) return 'mdi-clipboard-text'
  if (title.includes('服務')) return 'mdi-handshake'
  return 'mdi-folder'
}

// 匯入功能
const handleImport = async () => {
  if (!parsedData.value || !userData.value) {
    store.showToastMulti({
      type: 'warning',
      message: '請先解析 HTML 檔案',
      closeTime: 2,
    })
    return
  }

  importing.value = true

  try {
    // 功能1: 提取基本資料存到 user 表
    const basicData = await importToUser()
    
    if (!basicData || !basicData.snkey) {
      store.showToastMulti({
        type: 'error',
        message: '匯入基本資料失敗：未取得 user_snkey',
        closeTime: 3,
      })
      return
    }

    // 功能2: 存全部資料到 userFullData 表
    await importToUserFullData(basicData.snkey)

    store.showToastMulti({
      type: 'success',
      message: '匯入完成',
      closeTime: 2,
    })

    emit('import-success')
    closeDialog()
  } catch (error) {
    store.showToastMulti({
      type: 'error',
      message: '匯入失敗: ' + (error.message || '未知錯誤'),
      closeTime: 3,
    })
  } finally {
    importing.value = false
  }
}

// 功能1: 存基本資料到 user 表
const importToUser = async () => {
  try {
    // 從 allFields 或 userData 中提取所需欄位
    const allFields = parsedData.value.allFields || {}
    
    // 提取基本資料
    const name = allFields['個案姓名'] || userData.value?.name || ''
    const sex = allFields['性別'] || userData.value?.sex || ''
    const id_num = userData.value?.id_num || ''
    
    // 檢查是否已存在（以身分證字號為準）
    const existingUsers = await api.get('user')
    const existing = existingUsers.find(u => {
      const data = JSON.parse(u.datalist)
      return data.id_num === id_num && id_num
    })

    // 提取其他欄位（如果有的話）
    const publicexpenses = allFields['公費資格'] || 'false'
    const dnr = allFields['DNR'] || 'false'
    
    // 建立基本資料物件
    const basicUserData = {
      name,
      sex,
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      publicexpenses: publicexpenses.includes('有') || publicexpenses === 'true' ? 'true' : 'false',
      dnr: dnr.includes('有') || dnr === 'true' ? 'true' : 'false',
      picInfo: {
        picName: '',
        picOriginalName: ''
      }
    }

    // 如果有 userData，合併更多資料
    if (userData.value) {
      Object.assign(basicUserData, {
        id_num: userData.value.id_num || '',
        birthday: userData.value.birthday || '',
        phone: userData.value.phone || '',
        registered_address: userData.value.registered_address || '',
        living_address: userData.value.living_address || '',
      })
    }

    let result

    if (existing) {
      // 更新現有資料
      const existingData = JSON.parse(existing.datalist)
      
      // 合併資料，保留原有的重要欄位
      const updatedData = {
        ...existingData,
        ...basicUserData,
        snkey: existing.snkey,
        p_code: existingData.p_code || basicUserData.p_code,
        createInfo: existingData.createInfo || {},
        editInfo: existingData.editInfo || []
      }

      // 新增編輯記錄
      if (!updatedData.editInfo) {
        updatedData.editInfo = []
      }
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
        result = existing
      } else {
        throw new Error(rs?.message || '更新失敗')
      }
    } else {
      // 新增資料
      // 生成病歷號
      const userCount = Array.isArray(existingUsers) ? existingUsers.length : 0
      basicUserData.p_code = (userCount + 1).toString().padStart(4, '0')
      
      basicUserData.createInfo = {
        snkey: store.state.pData?.snkey || '',
        name: store.state.pData?.username || '系統',
        time: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }

      const postData = {
        datalist: JSON.stringify(basicUserData)
      }

      const rs = await api.add('user', postData)
      
      if (rs?.state == 1) {
        // 返回新增的資料（包含 snkey）
        const newUser = await api.get('user').then(users => 
          users.find(u => {
            const data = JSON.parse(u.datalist)
            return data.p_code === basicUserData.p_code
          })
        )
        result = newUser || { snkey: rs.snkey }
      } else {
        throw new Error(rs?.message || '新增失敗')
      }
    }

    return result
  } catch (error) {
    throw error
  }
}

// 功能2: 存全部資料到 userFullData 表
const importToUserFullData = async (userSnkey) => {
  try {
    if (!userSnkey) {
      throw new Error('缺少 user_snkey')
    }

    // 將全部資料轉換為 JSON，user_snkey 包含在資料物件中
    const fullData = {
      user_snkey: userSnkey,
      rawData: parsedData.value,
      userData: userData.value,
      importTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      importBy: {
        snkey: store.state.pData?.snkey || '',
        name: store.state.pData?.username || '系統'
      },
      createInfo: {
        snkey: store.state.pData?.snkey || '',
        name: store.state.pData?.username || '系統',
        time: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    }

    // 只傳 datalist，user_snkey 已經包含在 fullData 中
    const postData = {
      user_snkey: userSnkey,
      datalist: JSON.stringify(fullData)
    }

    const rs = await api.add('userFullData', postData)
    
    // API 回應的 state 可能是 true、1 或 '1'，使用寬鬆比較
    const isSuccess = rs?.state == 1 || rs?.state === true || rs?.state === '1'
    
    if (!isSuccess) {
      const errorMsg = rs?.message || rs?.error || '新增 userFullData 失敗'
      throw new Error(errorMsg)
    }
    
    return rs
  } catch (error) {
    throw error
  }
}
</script>

<style scoped>
.v-expansion-panel-title {
  font-size: 1rem;
}

.v-table tbody tr td {
  padding: 8px 16px;
}
</style>

