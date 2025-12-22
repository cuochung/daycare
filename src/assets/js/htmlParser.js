/**
 * HTML 解析工具 - 照顧服務管理資訊平臺
 * 用於解析從照服平台匯出的 HTML 檔案，並將資料轉換為系統可用格式
 */

/**
 * 民國年轉西元年
 * @param {string} rocDate - 民國年日期格式 (036/03/20)
 * @returns {string} - 西元年日期格式 (YYYY-MM-DD)
 */
export const convertROCToWestern = (rocDate) => {
  if (!rocDate || rocDate === '0000-00-00') return ''
  
  try {
    // 處理民國年格式 036/03/20
    const match = rocDate.match(/(\d{3})\/(\d{2})\/(\d{2})/)
    if (match) {
      const rocYear = parseInt(match[1], 10)
      const month = match[2]
      const day = match[3]
      const westernYear = rocYear + 1911
      return `${westernYear}-${month}-${day}`
    }
    
    // 如果已經是西元年格式，直接返回
    if (rocDate.match(/\d{4}-\d{2}-\d{2}/)) {
      return rocDate
    }
    
    return ''
  } catch (error) {
    return ''
  }
}

/**
 * 從表格中提取欄位值
 * @param {Document} doc - 解析後的 HTML Document
 * @param {string} fieldName - 欄位名稱
 * @returns {string} - 欄位值
 */
const extractFieldValue = (doc, fieldName) => {
  try {
    // 查找所有表格中的 th 元素
    const tables = doc.querySelectorAll('table.table-bordered')
    
    for (const table of tables) {
      const rows = table.querySelectorAll('tr')
      
      for (const row of rows) {
        const ths = row.querySelectorAll('th')
        const tds = row.querySelectorAll('td')
        
        // 遍歷每個 th，找到匹配的欄位
        for (let i = 0; i < ths.length; i++) {
          const th = ths[i]
          const thText = th.textContent.trim()
          // 移除特殊字元和符號進行比對
          const cleanText = thText.replace(/[＊※\s\n\r]/g, '')
          const cleanFieldName = fieldName.replace(/\s/g, '')
          
          if (cleanText.includes(cleanFieldName) || thText.includes(fieldName)) {
            // 找到對應的 td
            // 如果 th 和 td 是相鄰的（同一個 tr 中）
            let td = tds[i] || row.querySelector('td')
            
            if (td) {
              // 提取 td 的文字內容，但排除 label 和 img 標籤
              let value = ''
              
              // 先嘗試找出非 label 的文字節點
              const childNodes = td.childNodes
              for (const node of childNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                  const text = node.textContent.trim()
                  if (text) value += text + ' '
                } else if (node.nodeType === Node.ELEMENT_NODE && 
                          node.tagName !== 'LABEL' && 
                          node.tagName !== 'IMG' &&
                          node.tagName !== 'SPAN' &&
                          !node.querySelector('img')) {
                  const text = node.textContent.trim()
                  if (text) value += text + ' '
                }
              }
              
              // 如果沒有找到，就直接取 td 的文字（排除 label）
              if (!value.trim()) {
                // 克隆節點並移除所有 label
                const clonedTd = td.cloneNode(true)
                const labels = clonedTd.querySelectorAll('label')
                labels.forEach(label => label.remove())
                value = clonedTd.textContent
              }
              
              // 清理值：移除多餘的空白、換行符號
              const cleanValue = value.replace(/\s+/g, ' ').trim()
              if (cleanValue) {
                return cleanValue
              }
            }
          }
        }
      }
    }
    
    return ''
  } catch (error) {
    return ''
  }
}

/**
 * 提取多選項資料 (checkbox)
 * @param {Document} doc - 解析後的 HTML Document
 * @param {string} fieldName - 欄位名稱
 * @returns {Array} - 選中的項目陣列
 */
const extractCheckboxValues = (doc, fieldName) => {
  try {
    const tables = doc.querySelectorAll('table.table-bordered')
    const values = []
    
    for (const table of tables) {
      const rows = table.querySelectorAll('tr')
      
      for (const row of rows) {
        const th = row.querySelector('th')
        const td = row.querySelector('td')
        
        if (th && td) {
          const thText = th.textContent.trim()
          
          if (thText.includes(fieldName)) {
            // 查找所有 checkbox_checked.gif 的圖片
            const checkedImages = td.querySelectorAll('img[src*="checkbox_checked"]')
            
            checkedImages.forEach(img => {
              const label = img.parentElement
              if (label) {
                const labelText = label.textContent.trim()
                if (labelText) {
                  values.push(labelText)
                }
              }
            })
            
            return values
          }
        }
      }
    }
    
    return values
  } catch (error) {
    return []
  }
}

/**
 * 提取聯絡人資料
 * @param {Document} doc - 解析後的 HTML Document
 * @param {string} sectionName - 區段名稱 (主要聯絡人/代理人)
 * @returns {Object} - 聯絡人物件
 */
const extractContactInfo = (doc, sectionName) => {
  const contact = {
    man: '',
    relationship: '',
    phone: '',
    address: ''
  }
  
  try {
    // 找到對應區段的標題
    const headers = doc.querySelectorAll('h5')
    let targetTable = null
    
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].textContent.includes(sectionName)) {
        // 找到標題後，取得下一個表格
        let nextElement = headers[i].nextElementSibling
        while (nextElement) {
          if (nextElement.tagName === 'DIV') {
            targetTable = nextElement.querySelector('table.table-bordered')
            if (targetTable) break
          }
          nextElement = nextElement.nextElementSibling
        }
        break
      }
    }
    
    if (targetTable) {
      const rows = targetTable.querySelectorAll('tr')
      
      rows.forEach(row => {
        const th = row.querySelector('th')
        const td = row.querySelector('td')
        
        if (th && td) {
          const thText = th.textContent.trim()
          const tdText = td.textContent.trim()
          
          if (thText.includes('姓名')) {
            contact.man = tdText
          } else if (thText.includes('關係')) {
            contact.relationship = tdText
          } else if (thText.includes('手機')) {
            contact.phone = tdText
          } else if (thText.includes('地址')) {
            contact.address = tdText
          }
        }
      })
    }
  } catch (error) {
    // 提取聯絡人資料時發生錯誤
  }
  
  return contact
}

/**
 * 提取 ADL 評估資料
 * @param {Document} doc - 解析後的 HTML Document
 * @returns {Object} - ADL 評估物件
 */
const extractADLData = (doc) => {
  const adl = {
    e1_eating: '',
    e2_bathing: '',
    e3_grooming: '',
    e4_dressing: '',
    e5_bowel_control: '',
    e6_bladder_control: '',
    e7_toileting: '',
    e8_transfer: '',
    e9_walking: '',
    e10_stairs: '',
    e11_mobility: '',
    total_score: 0
  }
  
  try {
    adl.e1_eating = extractFieldValue(doc, 'E1.吃飯')
    adl.e2_bathing = extractFieldValue(doc, 'E2.洗澡')
    adl.e3_grooming = extractFieldValue(doc, 'E3.個人修飾')
    adl.e4_dressing = extractFieldValue(doc, 'E4.穿脫衣物')
    adl.e5_bowel_control = extractFieldValue(doc, 'E5.大便控制')
    adl.e6_bladder_control = extractFieldValue(doc, 'E6.小便控制')
    adl.e7_toileting = extractFieldValue(doc, 'E7.上廁所')
    adl.e8_transfer = extractFieldValue(doc, 'E8.移位')
    adl.e9_walking = extractFieldValue(doc, 'E9.走路')
    adl.e10_stairs = extractFieldValue(doc, 'E10.上下樓梯')
    adl.e11_mobility = extractFieldValue(doc, 'E11.請問您目前行動能力如何')
    
    // 計算總分（從文字中提取分數）
    const scores = [
      adl.e1_eating, adl.e2_bathing, adl.e3_grooming, adl.e4_dressing,
      adl.e5_bowel_control, adl.e6_bladder_control, adl.e7_toileting,
      adl.e8_transfer, adl.e9_walking, adl.e10_stairs
    ]
    
    adl.total_score = scores.reduce((sum, item) => {
      const match = item.match(/(\d+)分/)
      return sum + (match ? parseInt(match[1], 10) : 0)
    }, 0)
  } catch (error) {
    // 提取 ADL 資料時發生錯誤
  }
  
  return adl
}

/**
 * 提取 IADL 評估資料
 * @param {Document} doc - 解析後的 HTML Document
 * @returns {Object} - IADL 評估物件
 */
const extractIADLData = (doc) => {
  const iadl = {
    f1_phone: '',
    f2_shopping: '',
    f3_meal_prep: '',
    f4_housework: '',
    f5_laundry: '',
    f6_transportation: '',
    f7_medication: '',
    f8_finance: '',
    total_score: 0
  }
  
  try {
    iadl.f1_phone = extractFieldValue(doc, 'F1.使用電話')
    iadl.f2_shopping = extractFieldValue(doc, 'F2.購物')
    iadl.f3_meal_prep = extractFieldValue(doc, 'F3.備餐')
    iadl.f4_housework = extractFieldValue(doc, 'F4.家務維持')
    iadl.f5_laundry = extractFieldValue(doc, 'F5.洗衣服')
    iadl.f6_transportation = extractFieldValue(doc, 'F6.使用交通工具')
    iadl.f7_medication = extractFieldValue(doc, 'F7.服用藥物')
    iadl.f8_finance = extractFieldValue(doc, 'F8.處理財務')
    
    // 計算總分
    const scores = [
      iadl.f1_phone, iadl.f2_shopping, iadl.f3_meal_prep, iadl.f4_housework,
      iadl.f5_laundry, iadl.f6_transportation, iadl.f7_medication, iadl.f8_finance
    ]
    
    iadl.total_score = scores.reduce((sum, item) => {
      const match = item.match(/(\d+)分/)
      return sum + (match ? parseInt(match[1], 10) : 0)
    }, 0)
  } catch (error) {
    // 提取 IADL 資料時發生錯誤
  }
  
  return iadl
}

/**
 * 提取溝通能力資料
 * @param {Document} doc - 解析後的 HTML Document
 * @returns {Object} - 溝通能力物件
 */
const extractCommunicationData = (doc) => {
  return {
    c1_hearing: extractFieldValue(doc, 'C1.聽力'),
    c2_vision: extractFieldValue(doc, 'C2.視力'),
    c3_expression: extractFieldValue(doc, 'C3.表達能力'),
    c4_understanding: extractFieldValue(doc, 'C4.理解能力')
  }
}

/**
 * 提取認知功能資料
 * @param {Document} doc - 解析後的 HTML Document
 * @returns {Object} - 認知功能物件
 */
const extractCognitiveData = (doc) => {
  return {
    d1_short_term_memory: extractFieldValue(doc, 'D1.短期記憶'),
    d2_long_term_memory: extractFieldValue(doc, 'D2.長期記憶'),
    d3_orientation: extractFieldValue(doc, 'D3.定向感'),
    d4_calculation: extractFieldValue(doc, 'D4.計算能力'),
    d5_judgment: extractFieldValue(doc, 'D5.判斷能力')
  }
}

/**
 * 解析 HTML 並轉換為 User 資料格式
 * @param {string} htmlContent - HTML 內容
 * @returns {Object} - User 資料物件
 */
export const parseHTMLToUserData = (htmlContent) => {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    
    // 提取基本欄位
    const rawName = extractFieldValue(doc, '個案姓名')
    const rawIdNum = extractFieldValue(doc, '個案身分證')
    const rawBirthday = extractFieldValue(doc, '個案生日')
    const rawSex = extractFieldValue(doc, '性別')
    const rawPhone = extractFieldValue(doc, '個案電話')
    
    // 建立基本資料物件
    const userData = {
      // 基本資料
      name: rawName,
      id_num: rawIdNum ? rawIdNum.split(/\s+/)[0] : '', // 只取第一個連續字串
      birthday: convertROCToWestern(rawBirthday),
      sex: rawSex,
      phone: rawPhone,
      
      // 地址資料
      registered_address: extractFieldValue(doc, '戶籍地址'),
      living_address: extractFieldValue(doc, '居住(通訊)地址'),
      
      // 語言
      languages: extractCheckboxValues(doc, '常用語言'),
      
      // 婚姻狀況
      marriage_status: extractFieldValue(doc, 'A1.個案婚姻狀況') || extractFieldValue(doc, '個案婚姻狀況'),
      
      // 教育程度
      education: extractFieldValue(doc, 'A2.個案教育程度') || extractFieldValue(doc, '個案教育程度'),
      
      // 福利身份
      welfare_status: extractFieldValue(doc, '長照福利身份'),
      
      // 原住民身分
      indigenous: extractFieldValue(doc, '原住民身分'),
      indigenous_tribe: extractFieldValue(doc, '原住民族別'),
      
      // 居住狀況
      living_status: extractFieldValue(doc, '目前居住狀況'),
      
      // 就業狀況
      employment: extractFieldValue(doc, '就業中'),
      employment_willingness: extractFieldValue(doc, '就業意願'),
      
      // 機構居住
      in_institution: extractFieldValue(doc, '目前居住機構'),
      
      // 住院資訊
      recent_hospitalization: extractFieldValue(doc, '最近三個月有住院'),
      hospitalization_reason: '',
      
      // 身分別
      identity_types: extractCheckboxValues(doc, '個案身分別'),
      
      // 聯絡人資料
      contactMan: [],
      
      // 福利資料
      Welfare: {
        MajorIllnessCert: { Value: '無', Other: '' },
        DisabilityCert: { Value: '無', Other: [] }
      },
      
      // 照顧者資訊
      primary_caregiver: {},
      secondary_caregiver: {},
      
      // 評估資料
      adl_assessment: {},
      iadl_assessment: {},
      communication_ability: {},
      cognitive_function: {},
      
      // 其他
      hidden: '',
      picInfo: {
        picName: '',
        picOriginalName: ''
      },
      createInfo: {},
      editInfo: [],
      
      // 新增欄位以儲存更多資料
      imported_from_html: true,
      import_date: new Date().toISOString(),
      raw_data: {} // 儲存原始解析資料
    }
    
    // 提取主要聯絡人資料
    const mainContact = extractContactInfo(doc, '主要聯絡人資料')
    if (mainContact.man) {
      userData.contactMan.push(mainContact)
    }
    
    // 提取代理人資料
    const agent = extractContactInfo(doc, '代理人')
    if (agent.man) {
      agent.relationship = agent.relationship || '代理人'
      userData.contactMan.push(agent)
    }
    
    // 提取重大傷病證明
    const majorIllness = extractFieldValue(doc, '重大傷病證明')
    if (majorIllness) {
      userData.Welfare.MajorIllnessCert.Value = majorIllness.includes('有') ? '有' : '無'
      if (majorIllness.includes('有')) {
        // 提取說明
        const illnessDesc = extractFieldValue(doc, '說明')
        if (illnessDesc) {
          userData.Welfare.MajorIllnessCert.Other = illnessDesc
        }
      }
    }
    
    // 提取身心障礙證明
    const disability = extractFieldValue(doc, '身心障礙證明')
    if (disability) {
      userData.Welfare.DisabilityCert.Value = disability.includes('無') ? '無' : disability
      const disabilityTypes = extractCheckboxValues(doc, '身心障礙類別')
      if (disabilityTypes.length > 0) {
        userData.Welfare.DisabilityCert.Other = disabilityTypes
      }
    }
    
    // 提取主要照顧者資訊
    const primaryCaregiverIdNum = extractFieldValue(doc, '主要照顧者身分證')
    userData.primary_caregiver = {
      name: extractFieldValue(doc, 'B1a.主要照顧者姓名'),
      id_num: primaryCaregiverIdNum ? primaryCaregiverIdNum.split(/\s+/)[0] : '', // 只取第一個連續字串
      sex: extractFieldValue(doc, 'B2.主要照顧者性別'),
      age: extractFieldValue(doc, 'B3.主要照顧者年齡'),
      relationship: extractFieldValue(doc, 'B1b.與個案之關係') || extractFieldValue(doc, 'B1.與主要照顧者關係')
    }
    
    // 提取次要照顧者資訊
    const secondaryCaregiverIdNum = extractFieldValue(doc, '次要照顧者身分證')
    userData.secondary_caregiver = {
      name: extractFieldValue(doc, 'B4.次要照顧者姓名'),
      id_num: secondaryCaregiverIdNum ? secondaryCaregiverIdNum.split(/\s+/)[0] : '', // 只取第一個連續字串
      sex: extractFieldValue(doc, '次要照顧者性別'),
      relationship: extractFieldValue(doc, 'B5.次要照顧者與個案之關係') || extractFieldValue(doc, 'B5.與次要照顧者關係')
    }
    
    // 提取評估資料
    userData.adl_assessment = extractADLData(doc)
    userData.iadl_assessment = extractIADLData(doc)
    userData.communication_ability = extractCommunicationData(doc)
    userData.cognitive_function = extractCognitiveData(doc)
    
    // 提取更多欄位
    userData.living_location = extractFieldValue(doc, 'A5.居住地')
    userData.has_primary_caregiver = extractFieldValue(doc, 'B1.個案是否有主要照顧者')
    userData.primary_caregiver_disability = extractFieldValue(doc, 'B3.1.主要照顧者是否領有身心障礙證明')
    userData.has_secondary_caregiver = extractFieldValue(doc, '個案是否有次要照顧者')
    
    // 儲存完整的 HTML 內容摘要到 raw_data
    userData.raw_data = {
      source: '照顧服務管理資訊平臺',
      import_timestamp: new Date().toISOString(),
      data_summary: {
        name: userData.name,
        id_num: userData.id_num,
        birthday: userData.birthday,
        adl_score: userData.adl_assessment?.total_score || 0,
        iadl_score: userData.iadl_assessment?.total_score || 0
      }
    }
    
    return userData
  } catch (error) {
    throw new Error('HTML 解析失敗: ' + error.message)
  }
}

/**
 * 驗證必填欄位
 * @param {Object} userData - User 資料物件
 * @returns {Object} - { valid: boolean, errors: Array }
 */
export const validateUserData = (userData) => {
  const errors = []
  
  if (!userData.name || userData.name.trim() === '') {
    errors.push(`個案姓名為必填欄位（解析值：'${userData.name || ''}'）`)
  }
  
  if (!userData.id_num || userData.id_num.trim() === '') {
    errors.push(`個案身分證為必填欄位（解析值：'${userData.id_num || ''}'）`)
  }
  
  // 驗證身分證格式（寬鬆驗證，允許遮罩）
  if (userData.id_num && userData.id_num.trim()) {
    const idNum = userData.id_num.trim()
    // 移除所有空白字元
    const cleanIdNum = idNum.replace(/\s/g, '')
    
    // 檢查是否包含遮罩符號（*）
    const hasMask = cleanIdNum.includes('*')
    
    // 如果沒有遮罩，檢查長度是否為 10
    if (!hasMask && cleanIdNum.length !== 10) {
      errors.push(`身分證字號格式不正確（應為10碼，實際：${cleanIdNum.length}碼，解析值：'${idNum}'）`)
    }
    
    // 如果有遮罩，檢查長度是否至少為 6 (前後各保留部分)
    if (hasMask && cleanIdNum.length < 6) {
      errors.push(`身分證字號格式不正確（遮罩後長度過短，解析值：'${idNum}'）`)
    }
    
    // 檢查第一個字元是否為英文字母
    if (!/^[A-Z]/i.test(cleanIdNum)) {
      errors.push(`身分證字號格式不正確（首字應為英文字母，解析值：'${idNum}'）`)
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * 批次解析多個 HTML 檔案
 * @param {Array<File>} files - HTML 檔案陣列
 * @returns {Promise<Array>} - 解析結果陣列
 */
export const parseMultipleHTMLFiles = async (files) => {
  const results = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    try {
      const content = await readFileAsText(file)
      const userData = parseHTMLToUserData(content)
      const validation = validateUserData(userData)
      
      results.push({
        fileName: file.name,
        success: validation.valid,
        data: userData,
        errors: validation.errors
      })
    } catch (error) {
      results.push({
        fileName: file.name,
        success: false,
        data: null,
        errors: [error.message]
      })
    }
  }
  
  return results
}

/**
 * 讀取檔案為文字
 * @param {File} file - 檔案物件
 * @returns {Promise<string>} - 檔案內容
 */
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

/**
 * 提取 HTML 中所有的原始表格資料（不做任何欄位映射）
 * @param {string} htmlContent - HTML 內容
 * @returns {Object} - 原始資料物件，包含所有表格的所有欄位
 */
export const parseHTMLToRawData = (htmlContent) => {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    
    const rawData = {
      sections: [], // 所有區段
      allFields: {}, // 所有欄位的平面結構
      metadata: {
        parseTime: new Date().toISOString(),
        source: '照顧服務管理資訊平臺'
      }
    }
    
    // 提取頁面標題資訊
    const titleDiv = doc.querySelector('div[style*="font-size:25px"]')
    if (titleDiv) {
      rawData.metadata.title = titleDiv.textContent.trim()
    }
    
    // 提取個案基本資訊（頁面頂部）
    const infoDiv = doc.querySelector('div[style*="font-size:16px;float:left"]')
    if (infoDiv) {
      const infoText = infoDiv.textContent.trim()
      const lines = infoText.split('\n').map(l => l.trim()).filter(l => l)
      rawData.metadata.headerInfo = lines
    }
    
    // 找到所有的區段標題 (h5)
    const h5Elements = doc.querySelectorAll('h5')
    
    h5Elements.forEach((h5, h5Index) => {
      let sectionTitle = h5.textContent.trim().replace(/勾選後此區不列印/g, '').trim()
      // 使用 cleanText 清理區段標題（移除 setQtip 等內容）
      sectionTitle = cleanText(sectionTitle)
      
      // 找到這個 h5 後面的所有表格，直到下一個 h5 或結束
      let currentElement = h5.nextElementSibling
      const tables = []
      
      while (currentElement) {
        if (currentElement.tagName === 'H5') {
          break
        }
        
        // 在當前元素及其子元素中查找所有表格
        if (currentElement.tagName === 'TABLE' && currentElement.classList.contains('table-bordered')) {
          tables.push(currentElement)
        } else {
          const nestedTables = currentElement.querySelectorAll('table.table-bordered')
          nestedTables.forEach(table => tables.push(table))
        }
        
        currentElement = currentElement.nextElementSibling
      }
      
      if (tables.length > 0) {
        const sectionData = {
          sectionTitle,
          sectionIndex: h5Index,
          tables: []
        }
        
        tables.forEach((table, tableIndex) => {
          const tableData = {
            tableIndex,
            fields: []
          }
          
          // 檢查是否有 thead/tbody 結構（服務項目表格）
          const thead = table.querySelector('thead')
          const tbody = table.querySelector('tbody')
          
          if (thead && tbody) {
            // 處理有 thead/tbody 結構的表格（例如：照顧及專業服務(B)、交通接送(D)等）
            const headerRow = thead.querySelector('tr')
            const headerCells = headerRow ? headerRow.querySelectorAll('th') : []
            const dataRows = tbody.querySelectorAll('tr')
            
            // 提取表頭欄位名稱
            const headerNames = Array.from(headerCells).map(th => cleanText(th.textContent))
            
            // 處理每一行資料
            dataRows.forEach((row, rowIndex) => {
              const cells = row.querySelectorAll('td')
              
              // 找到「服務項目」欄位的索引
              const serviceItemIndex = headerNames.findIndex(name => name.includes('服務項目'))
              
              // 提取服務項目名稱（作為主要識別）
              let serviceItemName = ''
              if (serviceItemIndex >= 0 && cells[serviceItemIndex]) {
                serviceItemName = extractFieldValueFromTd(cells[serviceItemIndex])
              }
              
              // 如果沒有服務項目名稱，使用項次作為識別
              if (!serviceItemName && cells[0]) {
                serviceItemName = extractFieldValueFromTd(cells[0]) || `項目${rowIndex + 1}`
              }
              
              // 將每個 td 與對應的 th 配對，組成完整的服務項目資訊
              const serviceItemData = {}
              const importantFields = ['金額', '服務數量', '小計']
              cells.forEach((td, cellIndex) => {
                if (cellIndex < headerNames.length && headerNames[cellIndex]) {
                  const headerName = headerNames[cellIndex]
                  const fieldValue = extractFieldValueFromTd(td)
                  
                  // 對於重要欄位（金額、服務數量、小計），即使值為空也要記錄
                  if (fieldValue || importantFields.includes(headerName)) {
                    serviceItemData[headerName] = fieldValue || ''
                  }
                }
              })
              
              // 如果有服務項目名稱，建立欄位資料
              if (serviceItemName) {
                // 將金額、服務數量、小計分開記錄為獨立欄位
                const importantFields = ['金額', '服務數量', '小計']
                
                // 為每個重要欄位建立獨立的欄位資料（即使值為空也要建立）
                importantFields.forEach(fieldKey => {
                  // 找到該欄位在 headerNames 中的索引
                  const columnIndex = headerNames.findIndex(name => name === fieldKey || name.includes(fieldKey))
                  
                  // 即使值為空或不存在，也要建立欄位資料（使用空字串）
                  const fieldValue = serviceItemData[fieldKey] || ''
                  
                  const fieldData = {
                    rowIndex,
                    columnIndex: columnIndex >= 0 ? columnIndex : 0,
                    fieldName: `${serviceItemName}[${fieldKey}]`,
                    fieldValue: fieldValue,
                    rawFieldName: serviceItemName,
                    hasCheckbox: false,
                    hasInput: false
                  }
                  
                  tableData.fields.push(fieldData)
                  rawData.allFields[`${serviceItemName}[${fieldKey}]`] = fieldValue
                })
                
                // 如果有其他欄位（非重要欄位），也記錄下來
                Object.entries(serviceItemData).forEach(([key, value]) => {
                  if (key !== '服務項目' && key !== '項次' && !importantFields.includes(key) && value) {
                    // 找到該欄位在 headerNames 中的索引
                    const columnIndex = headerNames.findIndex(name => name === key || name.includes(key))
                    
                    const fieldData = {
                      rowIndex,
                      columnIndex: columnIndex >= 0 ? columnIndex : 0,
                      fieldName: `${serviceItemName}[${key}]`,
                      fieldValue: value,
                      rawFieldName: serviceItemName,
                      hasCheckbox: false,
                      hasInput: false
                    }
                    
                    tableData.fields.push(fieldData)
                    rawData.allFields[`${serviceItemName}[${key}]`] = value
                  }
                })
              }
            })
            
            // 如果有欄位，加入表格資料
            if (tableData.fields.length > 0) {
              sectionData.tables.push(tableData)
            }
            
            // 跳過後續的一般處理
            return
          }
          
          const rows = table.querySelectorAll('tr')
          
          // 檢查是否有 G4e 或 G5a 的特殊列
          const hasG4eRows = Array.from(rows).some(row => row.classList.contains('G4e'))
          const hasG5aRows = Array.from(rows).some(row => row.classList.contains('G5a'))
          
          // 處理 G4e 疾病史（只處理有 class="G4e" 的列）
          if (hasG4eRows) {
            const g4eDiseases = []
            
            rows.forEach((row) => {
              if (row.classList.contains('G4e')) {
                const tds = row.querySelectorAll('td')
                
                if (tds.length === 3) {
                  const diseaseNameTd = tds[0]
                  const hasDisease = diseaseNameTd.querySelector('img[src*="checkbox_checked"]') !== null
                  
                  if (hasDisease) {
                    const label = diseaseNameTd.querySelector('label')
                    if (label) {
                      const clonedLabel = label.cloneNode(true)
                      clonedLabel.querySelectorAll('script').forEach(script => script.remove())
                      clonedLabel.querySelectorAll('img').forEach(img => img.remove())
                      
                      let diseaseName = clonedLabel.textContent.trim()
                      
                      // 移除 jQuery 和 if 之後的內容
                      const jqueryIndex = diseaseName.indexOf('jQuery')
                      if (jqueryIndex !== -1) {
                        diseaseName = diseaseName.substring(0, jqueryIndex).trim()
                      }
                      const ifIndex = diseaseName.indexOf('if')
                      if (ifIndex !== -1) {
                        diseaseName = diseaseName.substring(0, ifIndex).trim()
                      }
                      
                      diseaseName = cleanText(diseaseName)
                      if (diseaseName) {
                        // 檢查是否有「目前正在治療」和「目前使用藥物」的勾選
                        const treatmentTd = tds[1] // 第二個 td 可能是「目前正在治療」
                        const medicationTd = tds[2] // 第三個 td 可能是「目前使用藥物」
                        
                        let diseaseItem = diseaseName
                        const additionalInfo = []
                        
                        // 檢查「目前正在治療」
                        if (treatmentTd && treatmentTd.querySelector('img[src*="checkbox_checked"]')) {
                          additionalInfo.push('目前正在治療')
                        }
                        
                        // 檢查「目前使用藥物」
                        if (medicationTd && medicationTd.querySelector('img[src*="checkbox_checked"]')) {
                          additionalInfo.push('目前使用藥物')
                        }
                        
                        // 如果有額外資訊，加入到疾病名稱中
                        if (additionalInfo.length > 0) {
                          diseaseItem = `${diseaseName}(${additionalInfo.join('、')})`
                        }
                        
                        g4eDiseases.push(diseaseItem)
                      }
                    }
                  }
                }
              }
            })
            
            if (g4eDiseases.length > 0) {
              tableData.fields.push({
                rowIndex: 0,
                columnIndex: 0,
                fieldName: 'G4e.疾病史',
                fieldValue: g4eDiseases.join('、'),
                rawFieldName: 'G4e.疾病史',
                isListData: true,
                listItems: g4eDiseases
              })
              
              rawData.allFields['G4e.疾病史'] = g4eDiseases.join('、')
            }
          }
          
          // 處理 G5a 進階照顧（只處理有 class="G5a" 的列）
          if (hasG5aRows) {
            const g5aItems = []
            
            rows.forEach((row) => {
              if (row.classList.contains('G5a')) {
                const tds = row.querySelectorAll('td')
                
                if (tds.length === 3) {
                  const itemNameTd = tds[1]
                  const statusTd = tds[2]
                  
                  const itemName = cleanText(itemNameTd.textContent)
                  const status = cleanText(statusTd.textContent)
                  
                  if (itemName && status && !status.includes('沒有使用') && !status.includes('1.沒有使用')) {
                    g5aItems.push(`${itemName}（${status}）`)
                  }
                }
              }
            })
            
            if (g5aItems.length > 0) {
              tableData.fields.push({
                rowIndex: 0,
                columnIndex: 0,
                fieldName: 'G5a.進階照顧',
                fieldValue: g5aItems.join('、'),
                rawFieldName: 'G5a.進階照顧',
                isListData: true,
                listItems: g5aItems
              })
              
              rawData.allFields['G5a.進階照顧'] = g5aItems.join('、')
            }
          }
          
          // 檢查是否為 I 或 J 項目的表格
          const isIorJSection = sectionTitle.includes('I.情緒及行為型態') || sectionTitle.includes('J.主要照顧者負荷')
          
          // 處理所有列（包括一般列和特殊列）
          {
            // 一般表格處理
            const processedFieldNames = new Set() // 用於追蹤已處理的欄位名稱，避免重複
            
            rows.forEach((row, rowIndex) => {
              const ths = row.querySelectorAll('th')
              const tds = row.querySelectorAll('td')
              
              // 特別處理 I 和 J 項目：問題在第一個 td，答案在第二個/第三個 td
              if (isIorJSection && ths.length === 0 && tds.length >= 2) {
                const itemNameTd = tds[0]
                const itemNameText = cleanText(itemNameTd.textContent)
                
                // 檢查項目名稱是否符合 I01, I02... 或 J01, J02... 格式
                const itemMatch = itemNameText.match(/^([IJ]\d+)\./i)
                if (itemMatch) {
                  const itemNumber = itemMatch[1] // 如 "I01", "J01"
                  
                  // 第二個 td：過去三個月內的答案（I 項目）或主要答案（J 項目）
                  const answer1Td = tds[1]
                  // 使用 extractFieldValueFromTd 以確保移除跳答等文字
                  const answer1Text = extractFieldValueFromTd(answer1Td)
                  
                  if (answer1Text) {
                    const fieldName1 = sectionTitle.includes('I.') ? `${itemNumber}a.${itemNameText.substring(itemMatch[0].length)}` : itemNameText
                    
                    const fieldData1 = {
                      rowIndex,
                      columnIndex: 1,
                      fieldName: fieldName1,
                      fieldValue: answer1Text,
                      rawFieldName: itemNameText,
                      hasCheckbox: answer1Td.querySelector('img[src*="checkbox"]') !== null,
                      hasInput: answer1Td.querySelector('input') !== null
                    }
                    
                    
                    tableData.fields.push(fieldData1)
                    rawData.allFields[fieldName1] = answer1Text
                  }
                  
                  // 第三個 td：過去一週內的答案（僅 I 項目）
                  if (tds.length >= 3 && sectionTitle.includes('I.')) {
                    const answer2Td = tds[2]
                    // 使用 extractFieldValueFromTd 以確保移除跳答等文字
                    const answer2Text = extractFieldValueFromTd(answer2Td)
                    
                    if (answer2Text) {
                      const fieldName2 = `${itemNumber}b.${itemNameText.substring(itemMatch[0].length)}`
                      
                      const fieldData2 = {
                        rowIndex,
                        columnIndex: 2,
                        fieldName: fieldName2,
                        fieldValue: answer2Text,
                        rawFieldName: itemNameText,
                        hasCheckbox: answer2Td.querySelector('img[src*="checkbox"]') !== null,
                        hasInput: answer2Td.querySelector('input') !== null
                      }
                      
                      tableData.fields.push(fieldData2)
                      rawData.allFields[fieldName2] = answer2Text
                    }
                  }
                }
                
                return // 跳過此列的其他處理
              }
              
              // 處理每一對 th-td
              for (let i = 0; i < ths.length; i++) {
                const th = ths[i]
                let td = tds[i]
                
                // 檢查是否為 colspan="2" 的特殊情況（th 內同時包含欄位名稱和值）
                const thColspan = th.getAttribute('colspan')
                if (thColspan === '2' && !td) {
                  // 這種情況下，欄位名稱在 <span class="text-required"> 內，值在 span 外面的文字節點
                  const requiredSpan = th.querySelector('span.text-required')
                  if (requiredSpan) {
                    // 提取欄位名稱（從 span 內提取）
                    // 先提取原始文字，只清理特殊符號和 setQtip，保留括號說明
                    let rawFieldName = requiredSpan.textContent.trim()
                    // 只移除開頭的星號和特殊符號，保留括號說明
                    let fieldNameText = rawFieldName
                      .replace(/^[＊※★\*]\s*/, '') // 移除開頭的星號
                      .replace(/\s+/g, ' ') // 統一空白
                      .replace(/setQtip\s*\([^)]*\)/gi, '') // 移除 setQtip 函數調用
                      .replace(/\s+說明\s*$/, '') // 移除末尾的「 說明」
                      .trim()
                    
                    // 只處理 G3a 開頭的欄位，過濾掉其他不正確的欄位
                    if (!fieldNameText || !fieldNameText.startsWith('G3a')) {
                      continue // 跳過非 G3a 的欄位
                    }
                    
                    // 檢查是否已經處理過 G3a 欄位
                    // 同時檢查 tableData.fields 和 rawData.allFields（因為可能在不同的表格實例中）
                    const existingIndex = tableData.fields.findIndex(f => f.fieldName && f.fieldName.startsWith('G3a'))
                    const hasInRawData = rawData.allFields && Object.keys(rawData.allFields).some(key => key.startsWith('G3a'))
                    const isAlreadyProcessed = existingIndex !== -1 || hasInRawData
                    
                    if (isAlreadyProcessed && existingIndex !== -1) {
                      const removedField = tableData.fields.splice(existingIndex, 1)[0]
                      // 也從 allFields 中移除
                      if (removedField.fieldName) {
                        delete rawData.allFields[removedField.fieldName]
                      }
                      // 移除所有相關的標記
                      processedFieldNames.delete('G3a')
                      processedFieldNames.delete(fieldNameText)
                      processedFieldNames.delete(removedField.fieldName)
                    } else if (isAlreadyProcessed && hasInRawData) {
                      // 從 allFields 中移除所有 G3a 相關的欄位
                      Object.keys(rawData.allFields).forEach(key => {
                        if (key.startsWith('G3a')) {
                          delete rawData.allFields[key]
                        }
                      })
                      // 也從 tableData.fields 中移除（如果在的話）
                      // 使用更精確的匹配，確保只移除真正的 G3a 欄位
                      const index = tableData.fields.findIndex(f => {
                        const fieldName = f.fieldName || ''
                        // 確保欄位名稱以 'G3a' 開頭，並且不是 'G2'、'G4' 等其他欄位
                        return fieldName.startsWith('G3a') && !fieldName.startsWith('G2') && !fieldName.startsWith('G4')
                      })
                      if (index !== -1) {
                        const removedField = tableData.fields.splice(index, 1)[0]
                        processedFieldNames.delete(removedField.fieldName)
                      }
                      // 移除所有相關的標記
                      processedFieldNames.delete('G3a')
                      processedFieldNames.delete(fieldNameText)
                    }
                    
                    // 注意：上面的邏輯已經處理了所有 isAlreadyProcessed 的情況
                    // 這裡不需要再處理，避免重複移除
                    
                    // 標記 G3a 欄位（無論是第一次還是覆蓋）
                    processedFieldNames.add('G3a') // 標記 G3a 作為通用標記
                    processedFieldNames.add(fieldNameText) // 也標記原始名稱
                    
                    // 提取欄位值（從 th 的文字節點中，排除 span 內容）
                    let fieldValue = ''
                    const childNodes = th.childNodes
                    for (const node of childNodes) {
                      // 跳過 span.text-required 元素（包含欄位名稱）
                      if (node.nodeType === Node.ELEMENT_NODE && 
                          node.classList && node.classList.contains('text-required')) {
                        continue
                      }
                      // 跳過所有 span 元素（包括 id="g3aSpan" 等，包含跳答說明）
                      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN') {
                        continue
                      }
                      // 提取文字節點
                      if (node.nodeType === Node.TEXT_NODE) {
                        const text = node.textContent.trim()
                        if (text) {
                          fieldValue += text + ' '
                        }
                      }
                    }
                    
                    // 如果沒有從文字節點提取到值，嘗試從整個 th 提取，但排除所有 span
                    if (!fieldValue.trim()) {
                      const clonedTh = th.cloneNode(true)
                      clonedTh.querySelectorAll('span').forEach(span => span.remove())
                      fieldValue = clonedTh.textContent.trim()
                    }
                    
                    // 確保移除可能殘留的「＊【選此項者請續答G3b】」等文字
                    fieldValue = fieldValue.replace(/＊【選此項者請續答[^】]*】/g, '')
                    fieldValue = fieldValue.replace(/【選此項者請續答[^】]*】/g, '')
                    
                    // 清理欄位值
                    fieldValue = fieldValue.replace(/\s+/g, ' ').trim()
                    
                    // 移除跳答相關文字（確保所有變體都被移除）
                    // 優先處理最常見的格式：＊【跳答I02】、＊【跳答J大題】等（沒有空格）
                    fieldValue = fieldValue.replace(/[＊*]?[【\[]跳答[^】\]]*[】\]]/g, '')
                    // 處理有空格的情況：＊ 【跳答...】、* 【跳答...】等
                    fieldValue = fieldValue.replace(/[＊*]?\s+[【\[]跳答[^】\]]*[】\]]/g, '')
                    // 處理沒有＊或*前綴的情況（例如：【跳答I02】、【跳答J大題】）
                    fieldValue = fieldValue.replace(/[【\[]跳答[^】\]]*[】\]]/g, '')
                    // 處理可能的其他格式變體（沒有括號的情況）
                    fieldValue = fieldValue.replace(/[＊*]?\s*跳答[^】\]]*/g, '')
                    
                    // 移除續答相關文字
                    fieldValue = fieldValue.replace(/[＊*]?\s*[【\[]\s*續答[^】\]]*[】\]]/g, '')
                    fieldValue = fieldValue.replace(/[＊*]?\s*[【\[]續答[^】\]]*[】\]]/g, '')
                    // 移除「選此項者請續答」相關文字（例如：＊【選此項者請續答G3b】）
                    fieldValue = fieldValue.replace(/[＊*]?\s*[【\[]選此項者請續答[^】]*[】\]]/g, '')
                    fieldValue = fieldValue.replace(/【選此項者請續答[^】]*】/g, '')
                    
                    // 移除獨立的括號說明文字（例如：(截肢者僅針對所剩關節評估)）
                    // 這些說明文字應該只出現在欄位名稱中，不應該出現在值中
                    fieldValue = fieldValue.replace(/(^|\s)\([^)]{5,}\)/g, '$1')
                    
                    // 移除函數調用
                    fieldValue = fieldValue.replace(/[a-zA-Z_$][a-zA-Z0-9_$]*\s*\([^)]*\)/g, '')
                    // 移除末尾的星號
                    fieldValue = fieldValue.replace(/[＊*]\s*$/, '')
                    fieldValue = fieldValue.replace(/\s+/g, ' ').trim()
                    
                    if (fieldNameText && fieldValue) {
                      // 保留完整的欄位名稱（包含說明文字，如"(截肢者僅針對所剩關節評估)"）
                      // fieldNameText 已經在提取時清理過了，直接使用
                      let shortFieldName = fieldNameText
                      
                      // 再次確認欄位名稱確實以 G3a 開頭（防止清理後名稱改變）
                      if (!shortFieldName || !shortFieldName.startsWith('G3a')) {
                        continue
                      }
                      
                      // 注意：這裡不需要再次檢查是否已經處理過，因為：
                      // 1. 在 940-941 行已經標記了 'G3a' 和 fieldNameText
                      // 2. 如果已經處理過，應該在 928-937 行的預先檢查就被跳過了
                      // 3. 如果這裡再次檢查，會導致第一次處理時也被跳過（因為自己剛剛標記的）
                      
                      const fieldData = {
                        rowIndex,
                        columnIndex: i,
                        fieldName: shortFieldName,
                        fieldValue: fieldValue,
                        rawFieldName: fieldNameText,
                        hasCheckbox: false,
                        hasInput: false
                      }
                      
                      // 標記簡短名稱（G3a 的通用標記和原始名稱已經在前面標記過了）
                      processedFieldNames.add(shortFieldName) // 標記為已處理
                      
                      tableData.fields.push(fieldData)
                      rawData.allFields[shortFieldName] = fieldValue
                    }
                    continue // 跳過後續處理
                  }
                }
                
                // 如果沒有對應的 td，可能是跨欄或其他佈局
                if (!td) {
                  td = row.querySelector('td')
                }
                
                if (th && td) {
                  // 如果 th 有 colspan="2" 屬性，可能已經在特殊處理中處理過了，跳過一般處理
                  if (th.getAttribute('colspan') === '2') {
                    continue
                  }
                  
                  const fieldName = cleanText(th.textContent)
                  
                  // 檢查是否已經處理過這個欄位名稱（避免重複）
                  // 對於 G3a 這類欄位，使用更寬鬆的匹配（檢查是否以 "G3a" 開頭）
                  let shouldSkip = false
                  if (fieldName) {
                    // 先檢查完全匹配
                    if (processedFieldNames.has(fieldName)) {
                      shouldSkip = true
                    } else if (fieldName.startsWith('G3a')) {
                      // 對於 G3a 欄位，檢查是否已經處理過任何以 "G3a" 開頭的欄位
                      for (const processedName of processedFieldNames) {
                        if (processedName.startsWith('G3a')) {
                          shouldSkip = true
                          break
                        }
                      }
                    }
                  }
                  
                  if (shouldSkip) {
                    continue // 跳過，已經處理過了
                  }
                  
                  const fieldValue = extractFieldValueFromTd(td)
                  
                  if (fieldName) {
                    
                    const fieldData = {
                      rowIndex,
                      columnIndex: i,
                      fieldName,
                      fieldValue,
                      rawFieldName: th.textContent.trim(),
                      hasCheckbox: td.querySelector('img[src*="checkbox"]') !== null,
                      hasInput: td.querySelector('input') !== null
                    }
                    
                    tableData.fields.push(fieldData)
                    
                    // 也加入平面結構（使用最後出現的值）
                    rawData.allFields[fieldName] = fieldValue
                    processedFieldNames.add(fieldName) // 標記為已處理
                  }
                }
              }
              
              // 特別處理：當整列只有一個 td colspan 的情況（如 G4f）
              if (ths.length === 0 && tds.length === 1) {
                const td = tds[0]
                const tdText = td.textContent.trim()
                
                // 尋找 G 開頭的欄位格式
                const lines = tdText.split('\n').map(l => l.trim()).filter(l => l)
                if (lines.length >= 2) {
                  // 第一行是問題，第二行是答案
                  const questionLine = lines[0]
                  const answerLine = lines[1]
                  
                  // 檢查第一行是否符合 G 開頭格式
                  if (questionLine.match(/^[A-Z]\d+[a-z]?\./)) {
                    const fieldName = cleanText(questionLine)
                    const fieldValue = cleanText(answerLine)
                    
                    if (fieldName && fieldValue) {
                      const fieldData = {
                        rowIndex,
                        columnIndex: 0,
                        fieldName,
                        fieldValue,
                        rawFieldName: questionLine,
                        hasCheckbox: false,
                        hasInput: false
                      }
                      
                      tableData.fields.push(fieldData)
                      rawData.allFields[fieldName] = fieldValue
                    }
                  }
                }
              }
              
              // 特別處理：th 中包含問題和答案（如 G5a）
              // 條件：有 th 但沒有 td（或 td 數量不匹配）
              ths.forEach((th, thIndex) => {
                const thText = th.textContent.trim()
                
                // 檢查是否包含 G 開頭的問題格式
                const match = thText.match(/([A-Z]\d+[a-z]?\.[^？?]+[？?])/)
                if (match) {
                  const questionText = match[1]
                  
                  // 只處理沒有對應 td 的 th
                  const correspondingTd = tds[thIndex]
                  
                  if (!correspondingTd || tds.length === 0) {
                    const fieldName = cleanText(questionText)
                    
                    // 先從原始文字找問號位置
                    const qIndex = thText.indexOf('？')
                    
                    if (qIndex !== -1) {
                      // 取得問號後的所有文字
                      let fieldValue = thText.substring(qIndex + 1).trim()
                      
                      // 移除所有 span 標籤內容（包括【...】提示）
                      // 創建臨時 div 來解析
                      const tempDiv = document.createElement('div')
                      tempDiv.innerHTML = fieldValue
                      tempDiv.querySelectorAll('span').forEach(span => span.remove())
                      fieldValue = tempDiv.textContent.trim()
                      
                      // 清理答案
                      fieldValue = fieldValue.replace(/【[^】]*】/g, '').trim()
                      fieldValue = fieldValue.replace(/\s+/g, ' ').trim()
                      
                      if (fieldName && fieldValue) {
                        const fieldData = {
                          rowIndex,
                          columnIndex: thIndex,
                          fieldName,
                          fieldValue,
                          rawFieldName: questionText,
                          hasCheckbox: false,
                          hasInput: false
                        }
                        
                        tableData.fields.push(fieldData)
                        rawData.allFields[fieldName] = fieldValue
                      }
                    }
                  }
                }
              })
            })
          }
          
          if (tableData.fields.length > 0) {
            sectionData.tables.push(tableData)
          }
        })
        
        if (sectionData.tables.length > 0) {
          rawData.sections.push(sectionData)
        }
        
        // 在所有表格處理完成後，清理重複的 G3a 欄位（只保留最後一個）
        // 先收集所有 G3a 欄位（跨所有 sections 和 tables）
        const allG3aFields = []
        rawData.sections.forEach(section => {
          section.tables.forEach(table => {
            table.fields.forEach((field, fieldIndex) => {
              if (field.fieldName && field.fieldName.startsWith('G3a')) {
                allG3aFields.push({ section, table, field, fieldIndex })
              }
            })
          })
        })
        
        // 如果有多個 G3a 欄位，只保留最後一個，移除其他的
        if (allG3aFields.length > 1) {
          // 找到包含完整說明文字的 G3a 欄位（優先保留）
          // 如果沒有，則保留最後一個
          let lastG3a = allG3aFields[allG3aFields.length - 1]
          // 同時檢查全形和半形括號
          const fullG3a = allG3aFields.find(({ field }) => 
            field.fieldName && (
              field.fieldName.includes('（截肢者僅針對所剩關節評估）') ||
              field.fieldName.includes('(截肢者僅針對所剩關節評估)')
            )
          )
          if (fullG3a) {
            lastG3a = fullG3a
          }
          
          // 確保最終保留的欄位值被正確清理
          if (lastG3a && lastG3a.field && lastG3a.field.fieldValue) {
            let cleanedValue = lastG3a.field.fieldValue
            // 移除獨立的括號說明文字（例如：(截肢者僅針對所剩關節評估)）
            cleanedValue = cleanedValue.replace(/(^|\s)（[^）]{5,}）/g, '$1')
            cleanedValue = cleanedValue.replace(/(^|\s)\([^)]{5,}\)/g, '$1')
            // 移除末尾的星號
            cleanedValue = cleanedValue.replace(/[＊*]\s*$/, '')
            cleanedValue = cleanedValue.replace(/\s+/g, ' ').trim()
            // 更新欄位值
            lastG3a.field.fieldValue = cleanedValue
            // 同時更新 rawData.allFields 中的值
            if (lastG3a.field.fieldName && rawData.allFields[lastG3a.field.fieldName]) {
              rawData.allFields[lastG3a.field.fieldName] = cleanedValue
            }
          }
          
          // 移除其他 G3a 欄位（保留選中的那個）
          allG3aFields.forEach(({ section, table, field, fieldIndex }) => {
            // 跳過要保留的欄位
            if (field === lastG3a.field) {
              return
            }
            
            // 從 table.fields 中移除
            const indexInTable = table.fields.findIndex((f, idx) => 
              idx === fieldIndex && f.fieldName === field.fieldName
            )
            if (indexInTable !== -1) {
              table.fields.splice(indexInTable, 1)
            }
            
            // 從 rawData.allFields 中移除
            if (field.fieldName && rawData.allFields[field.fieldName] && 
                field.fieldName !== lastG3a.field.fieldName) {
              delete rawData.allFields[field.fieldName]
            }
          })
        }
      }
    })
    
    // 統計資訊
    rawData.metadata.totalSections = rawData.sections.length
    rawData.metadata.totalFields = Object.keys(rawData.allFields).length
    rawData.metadata.totalTables = rawData.sections.reduce((sum, s) => sum + s.tables.length, 0)
    
    return rawData
  } catch (error) {
    throw new Error('HTML 原始資料提取失敗: ' + error.message)
  }
}

/**
 * 清理文字（移除特殊符號、星號等）
 */
const cleanText = (text) => {
  let cleaned = text
    .replace(/[＊※★\*]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  
  // 移除 setQtip 相關內容（例如：setQtip('...', '...', '...')）
  cleaned = cleaned.replace(/setQtip\s*\([^)]*\)/gi, '')
  
  // 如果以「 說明」結尾（前面有空格），則移除「說明」及前面的空格
  // 例如：「長照福利身份 說明 setQtip(...)」 -> 「長照福利身份」（setQtip 已移除，只剩「 說明」結尾）
  // 但「介接說明」這種情況（沒有空格分隔）則保留
  cleaned = cleaned.replace(/\s+說明\s*$/, '').trim()
  
  return cleaned.trim()
}

/**
 * 從 td 元素中提取值（包括 checkbox、input 等）
 */
const extractFieldValueFromTd = (td) => {
  try {
    // 檢查是否有 label（通常代表是 checkbox/radio 選項）
    const labels = td.querySelectorAll('label')
    if (labels.length > 0) {
      // 檢查是否有任何 checkbox 圖片
      const hasCheckboxes = td.querySelector('img[src*="checkbox"]') !== null
      
      if (hasCheckboxes) {
        // 如果有 checkbox，只提取有勾選的項目
        const checkedItems = []
        labels.forEach(label => {
          // 檢查 label 中是否有 checkbox_checked 圖片
          const checkedImg = label.querySelector('img[src*="checkbox_checked"]')
          if (checkedImg) {
            // 克隆 label 並移除 img
            const clonedLabel = label.cloneNode(true)
            clonedLabel.querySelectorAll('img').forEach(img => img.remove())
            
            // 移除所有包含「跳答」相關文字的 span 元素（I項目處理）
            const spansInLabel = clonedLabel.querySelectorAll('span')
            spansInLabel.forEach(span => {
              const spanText = span.textContent || ''
              if (spanText.match(/跳答/)) {
                span.remove()
              }
            })
            
            let text = clonedLabel.textContent.trim()
            // 清理欄位值：移除各種不需要的後綴文字（支援中文＊和英文*）
            // 匹配模式：＊【續答...】、*【續答...】、＊ [續答...]、* [續答...] 等
            text = text.replace(/[＊*]\s*[【\[]\s*續答[^】\]]*[】\]]/g, '')
            // 再次清理，確保移除所有相關模式（無額外空格的情況）
            text = text.replace(/[＊*]\s*[【\[]續答[^】\]]*[】\]]/g, '')
            // 移除所有跳答相關文字：＊【跳答...】、*【跳答...】、【跳答...】等模式（I項目處理）
            // 使用更寬鬆的匹配，確保所有「跳答」相關文字都被移除
            const beforeJumpAnswer = text
            // 先移除最完整的格式：＊【跳答I02】、＊【跳答J大題】等
            text = text.replace(/[＊*]?\s*[【\[]?\s*跳答[^】\]]*[】\]]?\s*/g, '')
            // 再次清理，確保移除所有殘留（更寬鬆的匹配，包括各種變體）
            text = text.replace(/[【\[]?\s*[＊*]?\s*跳答[^】\s]*[】\]]?\s*/g, '')
            // 最後一次清理，移除所有包含「跳答」的文字（最寬鬆的匹配）
            text = text.replace(/\s*跳答[^】\s]*[】\]]?\s*/g, '')
            // 移除「※」開頭的說明文字
            text = text.replace(/※\s*[^。]*[。]?/g, '')
            // 移除函數調用（例如：setQtip('g4b3HINT', 'top left','right bottom')）
            text = text.replace(/[a-zA-Z_$][a-zA-Z0-9_$]*\s*\([^)]*\)/g, '')
            // 移除獨立的括號說明文字（例如：(截肢者僅針對所剩關節評估)）
            text = text.replace(/(^|\s)\([^)]{5,}\)/g, '$1')
            text = text.trim()
            if (text) {
              checkedItems.push(text)
            }
          }
        })
        
        // 如果有 checkbox 但沒有勾選項目，返回空字串
        if (checkedItems.length > 0) {
          return checkedItems.join('、')
        } else {
          return ''
        }
      }
    }
    
    // 檢查是否有 input
    const inputs = td.querySelectorAll('input[type="text"], input:not([type])')
    if (inputs.length > 0) {
      const values = []
      inputs.forEach(input => {
        if (input.value) {
          values.push(input.value)
        }
      })
      if (values.length > 0) {
        return values.join(', ')
      }
    }
    
    // 一般文字內容
    // 移除 label 標籤，只保留實際值
    const clonedTd = td.cloneNode(true)
    
    // 移除所有包含「跳答」相關文字的 span 元素（例如：<span>＊【跳答I02】</span>）（I項目處理）
    // 這些 span 通常用於顯示跳答說明，不應該出現在欄位值中
    // 先獲取所有 span，然後從內層到外層移除（避免移除父元素後子元素引用失效）
    const allSpans = Array.from(clonedTd.querySelectorAll('span'))
    // 按深度排序（深度深的先處理），這樣可以先移除內層的 span
    allSpans.sort((a, b) => {
      let depthA = 0, depthB = 0
      let parentA = a.parentElement, parentB = b.parentElement
      while (parentA && parentA !== clonedTd) {
        depthA++
        parentA = parentA.parentElement
      }
      while (parentB && parentB !== clonedTd) {
        depthB++
        parentB = parentB.parentElement
      }
      return depthB - depthA // 深度深的在前
    })
    
    allSpans.forEach(span => {
      const spanText = span.textContent || ''
      // 如果 span 中包含「跳答」相關文字（例如：跳答I02、跳答I03、跳答J大題等），就移除它
      if (spanText.match(/跳答/)) {
        span.remove()
      }
    })
    
    // 移除所有 label（這些通常是選項名稱）
    const allLabels = clonedTd.querySelectorAll('label')
    allLabels.forEach(label => {
      // 如果 label 內沒有 checkbox_checked 圖片，就移除
      const hasChecked = label.querySelector('img[src*="checkbox_checked"]')
      if (!hasChecked) {
        label.remove()
      }
    })
    
    // 移除所有未選中的 checkbox 圖片
    const uncheckedImgs = clonedTd.querySelectorAll('img[src*="checkbox"][src*="unchecked"], img[src*="radio"][src*="unchecked"]')
    uncheckedImgs.forEach(img => {
      const parent = img.parentElement
      if (parent) {
        parent.remove()
      }
    })
    
    let value = clonedTd.textContent
      .replace(/\s+/g, ' ')
      .trim()
    
    // 如果值為空，嘗試直接從原始 td 取得所有文字節點
    if (!value) {
      const textNodes = []
      const walker = document.createTreeWalker(td, NodeFilter.SHOW_TEXT, null, false)
      let node
      while (node = walker.nextNode()) {
        const text = node.textContent.trim()
        if (text && !text.match(/^[\s\n\r]*$/)) {
          textNodes.push(text)
        }
      }
      value = textNodes.join(' ')
    }
    
    // 清理欄位值：移除各種不需要的後綴文字
    if (value) {
      // 移除 ＊【續答...】、*【續答...】、＊[續答...]、*[續答...] 等模式
      // 匹配多種變體：＊ 【續答...】、* 【續答...】、＊【續答...】、*【續答...】 等
      value = value.replace(/[＊*]\s*[【\[]\s*續答[^】\]]*[】\]]/g, '')
      // 再次清理，確保移除所有相關模式（無額外空格的情況）
      value = value.replace(/[＊*]\s*[【\[]續答[^】\]]*[】\]]/g, '')
      
      // 移除所有跳答相關文字：＊【跳答...】、*【跳答...】、【跳答...】等模式（I項目處理）
      // 使用更寬鬆的匹配，確保所有「跳答」相關文字都被移除
      const beforeJumpAnswer = value
      // 先移除最完整的格式：＊【跳答I02】、＊【跳答J大題】等
      value = value.replace(/[＊*]?\s*[【\[]?\s*跳答[^】\]]*[】\]]?\s*/g, '')
      // 再次清理，確保移除所有殘留（更寬鬆的匹配，包括各種變體）
      value = value.replace(/[【\[]?\s*[＊*]?\s*跳答[^】\s]*[】\]]?\s*/g, '')
      // 最後一次清理，移除所有包含「跳答」的文字（最寬鬆的匹配）
      value = value.replace(/\s*跳答[^】\s]*[】\]]?\s*/g, '')
      
      // 移除「※」開頭的說明文字（例如：※ E11題若個案無法回答者，可由主要照顧者代答。）
      value = value.replace(/※\s*[^。]*[。]?/g, '')
      
      // 移除函數調用（例如：setQtip('g4b3HINT', 'top left','right bottom')）
      value = value.replace(/[a-zA-Z_$][a-zA-Z0-9_$]*\s*\([^)]*\)/g, '')
      
      // 移除括號內的說明文字（例如：(截肢者僅針對所剩關節評估)），這些應該是欄位名稱的一部分，不應該出現在值中
      // 只移除獨立的括號說明（前面有空格或開頭，後面跟著結束），避免移除選項中的說明
      // 匹配模式：前面有空格或開頭，然後是括號，內容超過一定長度（說明文字通常較長）
      value = value.replace(/(^|\s)\([^)]{5,}\)/g, '$1')
      
      // 移除多餘的空白
      value = value.replace(/\s+/g, ' ').trim()
    }
    
    return value || ''
  } catch (error) {
    return td.textContent.trim()
  }
}

export default {
  parseHTMLToUserData,
  parseHTMLToRawData,
  validateUserData,
  parseMultipleHTMLFiles,
  convertROCToWestern
}

