## 2025.02.06
1. 新增出席排班表結構說明：`documents/attendance_schedule_table_schema.md`
   - 表名 `attendance_schedule`，datalist JSON 欄位定義（month、date、period、user_snkey、schedule_type、day_type、簽到/吃藥/進食/生命徵象等）
   - 查詢方式：byjson/getZoneData 依 date 區間；容量規則上午/下午各 28 人、收費表組合、組數當月用完
2. Cursor 技能目錄調整：`shuaya-alert-usage`、`shuaya-api-usage`、`shuaya-excel-import-fields` 更名為 `alert-usage`、`api-usage`、`excel-import-fields`（去掉 shuaya 前綴）
3. 異動檔案：`api.js`、`ResidentScheduleDialog.vue`、`AttendanceCalendar/index.vue`、`MedicineRecord/index.vue`、`NursingrecordlistdataList.vue`、`User/index.vue`

## 2025.12.15
1. 計畫改為 先由衛服部取得 html 格式的個人相關資料
裡面會包含 個人資料；全人評估表單；對應的費用
導入病歷及各項資料後；再依費用資料產出對應的載客班表；
- 載客班表的部分實際有載才算費用
- 費用列表參考 資料 目錄