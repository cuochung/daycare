import { CARE_FEE_SCHEDULE_OPTIONS } from './careFeeOptions.js'

const SERVICE_SECTION_KEYWORDS = ['照顧及專業服務', '交通接送', '喘息服務', '勞動部短照', '其他(OTHT)', '縣市自辨項目']
const SERVICE_ITEM_FIELD_REGEX = /\[(金額|服務數量|小計|項次|服務項目)\]/i

function isServiceSection(sectionTitle) {
  if (!sectionTitle) return false
  return SERVICE_SECTION_KEYWORDS.some(kw => sectionTitle.includes(kw))
}

function isServiceItemField(fieldName) {
  return fieldName && SERVICE_ITEM_FIELD_REGEX.test(fieldName)
}

function extractServiceItemName(fieldName) {
  if (!fieldName) return ''
  return fieldName.replace(/\[(金額|服務數量|小計)\]$/, '').trim()
}

function extractServiceFieldType(fieldName) {
  if (!fieldName) return ''
  const matches = fieldName.match(/\[([^\]]+)\]$/g)
  if (matches && matches.length > 0) {
    return matches[matches.length - 1].replace(/[\[\]]/g, '')
  }
  const m = fieldName.match(/\[(.+?)\]/)
  return m ? m[1] : ''
}

function organizeServiceItems(fields) {
  const itemsMap = {}
  if (!Array.isArray(fields)) return []
  fields.forEach(field => {
    if (!field?.fieldName || !isServiceItemField(field.fieldName)) return
    const itemName = extractServiceItemName(field.fieldName)
    const fieldType = extractServiceFieldType(field.fieldName)
    if (!itemName) return
    if (!itemsMap[itemName]) {
      itemsMap[itemName] = { name: itemName, 金額: '', 服務數量: '', 小計: '' }
    }
    if (['金額', '服務數量', '小計'].includes(fieldType)) {
      itemsMap[itemName][fieldType] = field.fieldValue != null ? String(field.fieldValue) : ''
    }
  })
  return Object.values(itemsMap)
}

function extractCodeFromItemName(itemName) {
  if (!itemName) return ''
  const m = itemName.match(/^([A-Z]{2}\d{2,})/)
  return m ? m[1] : (itemName.split('[')[0] || '').trim()
}

const CARE_FEE_CODES = new Set(CARE_FEE_SCHEDULE_OPTIONS.map(o => o.code))

/**
 * 從 userFullData 的 rawData（解析後的 HTML 區段）中，取出「收費表有列」的服務項目。
 * rawData 結構：{ sections: [ { sectionTitle, tables: [ { fields: [ { fieldName, fieldValue } ] } ] } ] }
 * @returns {Array<{ code, name, 金額, 服務數量, 小計, day_type }>}
 */
export function getCareFeeServiceItemsFromRawData(rawData) {
  if (!rawData?.sections || !Array.isArray(rawData.sections)) return []
  const merged = {}
  for (const section of rawData.sections) {
    if (!isServiceSection(section.sectionTitle)) continue
    for (const table of section.tables || []) {
      const fields = table.fields || []
      if (!fields.some(f => isServiceItemField(f.fieldName))) continue
      const items = organizeServiceItems(fields)
      for (const item of items) {
        const code = extractCodeFromItemName(item.name)
        if (!CARE_FEE_CODES.has(code)) continue
        const opt = CARE_FEE_SCHEDULE_OPTIONS.find(o => o.code === code)
        const key = code
        if (!merged[key]) {
          merged[key] = {
            code,
            name: item.name,
            金額: item.金額,
            服務數量: item.服務數量,
            小計: item.小計,
            day_type: opt?.day_type || 'full',
          }
        } else {
          merged[key].服務數量 = merged[key].服務數量 || item.服務數量
          merged[key].小計 = merged[key].小計 || item.小計
        }
      }
    }
  }
  return Object.values(merged)
}
