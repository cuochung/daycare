/**
 * 社區式服務類長期照顧服務收費標準表 - 照顧組合選項
 * 僅收費表有列之組合才算（documents/照顧組合收費.md）
 * 供排班設定 schedule_type 下拉與全日/半日對應使用
 */
export const CARE_FEE_SCHEDULE_OPTIONS = [
  { code: 'BB01', label: '日間照顧（全日）—第一型', day_type: 'full' },
  { code: 'BB02', label: '日間照顧（半日）—第一型', day_type: 'half' },
  { code: 'BB03', label: '日間照顧（全日）—第二型', day_type: 'full' },
  { code: 'BB04', label: '日間照顧（半日）—第二型', day_type: 'half' },
  { code: 'BB05', label: '日間照顧（全日）—第三型', day_type: 'full' },
  { code: 'BB06', label: '日間照顧（半日）—第三型', day_type: 'half' },
  { code: 'BB07', label: '日間照顧（全日）—第四型', day_type: 'full' },
  { code: 'BB08', label: '日間照顧（半日）—第四型', day_type: 'half' },
  { code: 'BB09', label: '日間照顧（全日）—第五型', day_type: 'full' },
  { code: 'BB10', label: '日間照顧（半日）—第五型', day_type: 'half' },
  { code: 'BB11', label: '日間照顧（全日）—第六型', day_type: 'full' },
  { code: 'BB12', label: '日間照顧（半日）—第六型', day_type: 'half' },
  { code: 'BB13', label: '日間照顧（全日）—第七型', day_type: 'full' },
  { code: 'BB14', label: '日間照顧（半日）—第七型', day_type: 'half' },
  { code: 'GA03', label: '日間照顧中心喘息服務—全日', day_type: 'full' },
  { code: 'GA04', label: '日間照顧中心喘息服務—半日', day_type: 'half' },
  { code: 'SC03', label: '短照服務（全日）', day_type: 'full' },
  { code: 'SC04', label: '短照服務（半日）', day_type: 'half' },
]

export const QUOTA_TYPES = [
  { value: 'month', label: '每月' },
  { value: 'year', label: '每年' },
]

export const DAY_TYPES = [
  { value: 'full', label: '全日' },
  { value: 'half', label: '半日' },
]

export const WEEKDAY_LABELS = {
  1: '週一',
  2: '週二',
  3: '週三',
  4: '週四',
  5: '週五',
  6: '週六',
  7: '週日',
}
