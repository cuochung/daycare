# 出席排班表 (attendance_schedule) 結構說明

供後端建立 MariaDB 表使用，與既有表相同採 `datalist` JSON 儲存，配合 `general/addMulti`、`byjson/getZoneData` 等 API。

## 表名

`attendance_schedule`

## 建議欄位（與既有表一致）

| 欄位 | 型別 | 說明 |
|------|------|------|
| snkey | 主鍵 | 由後端產生 |
| datalist | TEXT/JSON | 見下方 JSON 結構 |
| createTime | 依既有慣例 | |
| updateTime | 依既有慣例 | |

## datalist JSON 結構

| 鍵 | 型別 | 說明 |
|------|------|------|
| month | string | 適用月份，如 "YYYY-MM" |
| date | string | 日期，如 "YYYY-MM-DD"（供 getZoneData 區間查詢） |
| period | string | "am" 上午 / "pm" 下午 |
| user_snkey | string | 關聯 user 表 |
| schedule_type | string | 照顧組合代碼，如 BB07、BB08（對應收費表） |
| day_type | string | "full" 全日 / "half" 半日 |
| resident_schedule_snkey | string | 關聯 resident_schedule 表（來源排班） |
| checked_in | number | 0/1 是否已簽到 |
| 出席 | number | 0/1 同 checked_in（相容） |
| checked_in_time | string | 簽到勾選時間，YYYY-MM-DD HH:mm |
| 簽到時間 | string | 同 checked_in_time（相容） |
| medicine_taken_time | string | 吃藥勾選時間，YYYY-MM-DD HH:mm |
| 吃藥時間 | string | 同 medicine_taken_time（相容） |
| ate_time | string | 進食勾選時間，YYYY-MM-DD HH:mm |
| 進食時間 | string | 同 ate_time（相容） |
| arrival_time | string | 到機構時間，如 "08:30" |
| 到機構時間 | string | 同 arrival_time（相容） |
| attendance_status | string | 出席情況 |
| 出席情況 | string | 同 attendance_status（相容） |
| temperature | string | 體溫 |
| 體溫 | string | 同 temperature（相容） |
| pulse | string | 脈搏 |
| 脈搏 | string | 同 pulse（相容） |
| blood_pressure | string | 血壓，如 "120/80" |
| 血壓 | string | 同 blood_pressure（相容） |
| blood_oxygen | string | 血氧 |
| 血氧 | string | 同 blood_oxygen（相容） |
| respiration | string | 呼吸 |
| 呼吸 | string | 同 respiration（相容） |
| medicine_taken | number | 0/1 有無吃藥 |
| 吃藥 | number | 0/1 同 medicine_taken（相容） |
| ate | number | 0/1 有無進食 |
| 進食 | number | 0/1 同 ate（相容） |

## 查詢方式

- **依月份區間**：`byjson/getZoneData`，`key: 'date'`，`start: 當月第一天`，`end: 當月最後一天`

## 4.3 容量與收費規則

建構時依下列規則產生記錄：

- **上午/下午各 28 人**：每日期段（AM/PM）最多 28 筆
- **收費表組合**：僅收費表有列之 schedule_type（BB01–BB14、GA03/GA04、SC03/SC04）
- **組數當月用完**：後續可擴充配額檢查
