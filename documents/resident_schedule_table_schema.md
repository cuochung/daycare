# 住民排班設定表 (resident_schedule) 結構說明

供後端建立 MariaDB 表使用，與既有 `user` 表相同採 `datalist` JSON 儲存，以配合 `general/getAll`、`general/add`、`general/edit`、`general/delv3` API。

## 表名

`resident_schedule`

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
| user_snkey | string | 關聯 user 表 |
| month | string | 適用月份，如 "YYYY-MM" |
| schedule_type | string | 照顧組合代碼，如 BB07、BB08、GA09（對應收費表） |
| weekdays | string | 每週使用日，如 "1,2,3,4,5"（1=週一） |
| quota_type | string | "month" 每月 / "year" 每年 |
| day_type | string | "full" 全日 / "half" 半日 |

同一住民可有多筆（例如 BB07 全日 + BB08 半日 並存）。
