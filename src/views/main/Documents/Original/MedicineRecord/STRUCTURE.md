# MedicineRecord 功能結構文檔

## 功能概述

MedicineRecord（就醫及藥品紀錄）是一個完整的醫療記錄管理系統，主要用於管理住民的醫院就診紀錄和用藥紀錄。系統包含兩個主要部分：
1. **醫院就診紀錄** - 記錄住民的就醫資訊
2. **用藥紀錄** - 記錄住民在每次就診後的用藥資訊

## 文件結構

```
src/views/main/Documents/Original/MedicineRecord/
├── index.vue                          # 主頁面：顯示醫院就診紀錄和用藥紀錄列表
├── MedicalRecordAdd.vue               # 醫院就診紀錄新增/編輯對話框
├── MedicineRecordAdd.vue              # 用藥紀錄新增/編輯對話框
├── PrintOption.vue                    # 列印選項設定對話框
├── PrintPage.vue                      # 列印頁面（給藥紀錄單）
├── BranchList.vue                     # 科別列表管理組件
├── DoctorList.vue                     # 醫生列表管理組件
├── HospitalList.vue                   # 醫院列表管理組件
└── MainCauseOfTreatmentList.vue       # 就診主因列表管理組件
```

## 數據庫結構

### 主要數據表

1. **medical_record** - 醫院就診紀錄
   - `snkey` - 主鍵
   - `u_snkey` - 住民編號（關聯到 user 表）
   - `date` - 就診日期
   - `hospital_snkey` - 醫院編號（關聯到 hospital 表）
   - `branch_snkey` - 科別編號（關聯到 branch 表）
   - `doctor_snkey` - 醫生編號（關聯到 doctor 表）
   - `main_cause_of_treatment_snkey` - 就診主因編號（關聯到 main_cause_of_treatment 表）
   - `return_date` - 回診日期
   - `car` - 交通工具
   - `accompany` - 陪同人員
   - `datalist` - JSON 格式的完整資料
   - `createInfo` - 建立資訊
   - `editInfo` - 修改資訊

2. **medicine_record** - 用藥紀錄
   - `snkey` - 主鍵
   - `medical_snkey` - 就診紀錄編號（關聯到 medical_record 表）
   - `user_snkey` - 住民編號（關聯到 user 表）
   - `medicine_snkey` - 藥品編號（關聯到 medicine 表）
   - `unit_snkey` - 單位編號（關聯到 unit 表）
   - `method_snkey` - 用法編號（關聯到 method 表）
   - `eat_medicine_time_snkey` - 用藥時間編號（關聯到 eat_medicine_time 表）
   - `dosage` - 劑量
   - `quantity` - 用量
   - `medicine_counts` - 給藥次數
   - `start_date` - 開始日期
   - `medicineEndInfo` - 藥物用完資訊
   - `stop` - 停藥標記
   - `datalist` - JSON 格式的完整資料
   - `createInfo` - 建立資訊
   - `editInfo` - 修改資訊

### 參考數據表

3. **hospital** - 醫院列表
   - `snkey` - 主鍵
   - `name` - 醫院名稱
   - `create_man` - 建立人資訊

4. **branch** - 科別列表
   - `snkey` - 主鍵
   - `name` - 科別名稱
   - `create_man` - 建立人資訊

5. **doctor** - 醫生列表
   - `snkey` - 主鍵
   - `name` - 醫生名稱
   - `create_man` - 建立人資訊

6. **main_cause_of_treatment** - 就診主因列表
   - `snkey` - 主鍵
   - `name` - 就診主因名稱
   - `create_man` - 建立人資訊

7. **medicine** - 藥品列表
   - `snkey` - 主鍵
   - `name` - 藥品名稱
   - `effect` - 作用
   - `create_man` - 建立人資訊

8. **unit** - 單位列表
   - `snkey` - 主鍵
   - `name` - 單位名稱（如：顆、粒、cc等）
   - `create_man` - 建立人資訊

9. **method** - 用法列表
   - `snkey` - 主鍵
   - `name` - 用法名稱（如：飯前、飯後等）
   - `create_man` - 建立人資訊

10. **eat_medicine_time** - 用藥時間列表
    - `snkey` - 主鍵
    - `name` - 用藥時間名稱
    - `time` - 時間
    - `day` - 間隔天數
    - `repeatWeek` - 每週重複
    - `repeatDate` - 每月重複日期
    - `create_man` - 建立人資訊

## 組件關係圖

```
index.vue (主頁面)
├── MedicalRecordAdd.vue (醫院就診紀錄新增/編輯)
│   ├── HospitalList.vue (醫院列表管理)
│   ├── BranchList.vue (科別列表管理)
│   ├── DoctorList.vue (醫生列表管理)
│   └── MainCauseOfTreatmentList.vue (就診主因列表管理)
│
├── MedicineRecordAdd.vue (用藥紀錄新增/編輯)
│   ├── MedicineList.vue (藥品列表管理) [位於 @/components/]
│   ├── UnitList.vue (單位列表管理) [位於 @/components/]
│   ├── MethodList.vue (用法列表管理) [位於 @/components/]
│   └── EatMedicineTimeList.vue (用藥時間列表管理) [位於 @/components/]
│
└── PrintOption.vue (列印選項設定)
    └── PrintPage.vue (列印頁面)
```

## 組件詳細說明

### 1. index.vue - 主頁面

**功能**：
- 顯示醫院就診紀錄列表
- 顯示選定就診紀錄的用藥紀錄列表
- 提供搜尋、排序、分頁功能
- 提供列印功能

**主要狀態**：
- `medicalRecordItems` - 醫院就診紀錄列表
- `medicalRecordList` - 當前選定的就診紀錄
- `medicineRecordItems` - 當前就診紀錄的用藥紀錄列表
- `eatMedicineTimeItems` - 用藥時間選項列表

**主要方法**：
- `getMedicalData()` - 取得該住民的所有就診紀錄
- `getMedicineRecord()` - 取得選定就診紀錄的用藥紀錄
- `selectMedicalRecord(item)` - 選擇就診紀錄
- `edit(item)` - 編輯就診紀錄
- `del(delData)` - 刪除就診紀錄（連同相關用藥紀錄）
- `editMedicineRecord(item)` - 編輯用藥紀錄
- `delMedicineRecord(item)` - 刪除用藥紀錄
- `stopMedicine(item)` - 停藥標記
- `printConfirm()` - 列印確認
- `goPrint()` - 前往列印頁面

**API 調用**：
- `api.options('byjson/searchByKeyValue/{databaseName}/medical_record')` - 取得就診紀錄
- `api.options('byjson/searchByKeyValue/{databaseName}/medicine_record')` - 取得用藥紀錄
- `api.get('eat_medicine_time')` - 取得用藥時間列表

### 2. MedicalRecordAdd.vue - 醫院就診紀錄新增/編輯

**功能**：
- 新增/編輯醫院就診紀錄
- 管理就診相關資訊（醫院、科別、醫生、就診主因等）
- 提供「載入最近一次就診資料」功能

**主要狀態**：
- `list` - 表單資料（reactive 物件）
- `hospitalItems` - 醫院選項列表
- `branchItems` - 科別選項列表
- `doctorItems` - 醫生選項列表
- `main_cause_of_treatmentItems` - 就診主因選項列表

**主要方法**：
- `openForAdd()` - 開啟新增模式
- `openForEdit(item)` - 開啟編輯模式
- `insertLast()` - 載入最近一次就診資料
- `handleAdd()` - 新增就診紀錄
- `handleEdit()` - 編輯就診紀錄
- `getSelect()` - 重新載入選項列表

**API 調用**：
- `api.get('hospital')` - 取得醫院列表
- `api.get('branch')` - 取得科別列表
- `api.get('doctor')` - 取得醫生列表
- `api.get('main_cause_of_treatment')` - 取得就診主因列表
- `api.add('medical_record', postData)` - 新增就診紀錄
- `api.post('medical_record', postData)` - 編輯就診紀錄

**暴露方法**：
- `openForAdd()` - 供父組件調用開啟新增模式
- `openForEdit(item)` - 供父組件調用開啟編輯模式

### 3. MedicineRecordAdd.vue - 用藥紀錄新增/編輯

**功能**：
- 新增/編輯用藥紀錄
- 管理用藥相關資訊（藥品、單位、用法、用藥時間等）
- 檢查重複用藥
- 計算藥物用完日期

**主要狀態**：
- `list` - 表單資料（reactive 物件）
- `medicineItems` - 藥品選項列表
- `unitItems` - 單位選項列表
- `methodItems` - 用法選項列表
- `eat_medicine_timeItems` - 用藥時間選項列表
- `allUsedMedicineItems` - 所有使用中的藥物列表（用於檢查重複）

**主要方法**：
- `openForAdd()` - 開啟新增模式
- `openForEdit(item)` - 開啟編輯模式
- `handleAdd()` - 新增用藥紀錄
- `handleEdit()` - 編輯用藥紀錄
- `getSelect()` - 重新載入選項列表
- `getMedicine()` - 檢查重複用藥
- `getEatMedicineTime()` - 計算給藥次數和藥物用完日期
- `getAllUsedMedicine()` - 取得所有使用中的藥物（用於檢查重複）

**API 調用**：
- `api.get('medicine')` - 取得藥品列表
- `api.get('unit')` - 取得單位列表
- `api.get('method')` - 取得用法列表
- `api.get('eat_medicine_time')` - 取得用藥時間列表
- `api.options('byjson/searchByKeyValue/{databaseName}/medicine_record')` - 取得所有使用中的藥物
- `api.add('medicine_record', postData)` - 新增用藥紀錄
- `api.post('medicine_record', postData)` - 編輯用藥紀錄

**暴露方法**：
- `openForAdd()` - 供父組件調用開啟新增模式
- `openForEdit(item)` - 供父組件調用開啟編輯模式

### 4. PrintOption.vue - 列印選項設定

**功能**：
- 設定列印選項
- 設定生命徵象指定列印內容
- 設定資料距離今日天數

**主要狀態**：
- `list` - 列印設定資料
- `signlifeFields` - 生命徵象欄位列表

**主要方法**：
- `open()` - 開啟對話框
- `selectAll()` - 全選
- `noAll()` - 全不選
- `printOK()` - 確認列印

**暴露方法**：
- `open()` - 供父組件調用開啟對話框

### 5. PrintPage.vue - 列印頁面

**功能**：
- 顯示給藥紀錄單列印頁面
- 支援分頁列印
- 顯示上半月和下半月的給藥紀錄

**主要狀態**：
- `medicineRecordItems` - 用藥紀錄列表
- `printMonth` - 列印月份
- `perPageItemsPrintSet` - 每頁筆數

**主要方法**：
- `filterUpMedicine()` - 篩選上半月用藥紀錄
- `filterDownMedicine()` - 篩選下半月用藥紀錄
- `printPageSet(page, type)` - 分頁處理
- `showWeek(day)` - 顯示星期

### 6. 列表管理組件（BranchList.vue, DoctorList.vue, HospitalList.vue, MainCauseOfTreatmentList.vue）

**功能**：
- 管理各自的參考資料列表（醫院、科別、醫生、就診主因）
- 提供新增、修改、刪除功能
- 提供搜尋功能

**統一結構**：
- 使用 `v-dialog` 顯示管理介面
- 使用 `v-icon` 作為觸發按鈕
- 使用 `v-list` 顯示列表
- 支援搜尋過濾

**主要方法**：
- `getAllData()` - 取得所有資料
- `addOK()` - 確認新增
- `editOK()` - 確認修改
- `del(delData)` - 刪除資料
- `enterEditMode(item)` - 進入修改模式
- `cancelEditMode()` - 取消修改模式

**事件發送**：
- `@getSelect` - 當資料變更時發送，通知父組件更新選項列表

## 主要功能流程

### 1. 新增醫院就診紀錄流程

```
1. 使用者點擊「新增就診紀錄」按鈕
2. MedicalRecordAdd.vue 的 openForAdd() 被調用
3. 載入參考資料（醫院、科別、醫生、就診主因列表）
4. 顯示新增對話框
5. 使用者填寫表單資料
6. 點擊「確認新增」
7. 驗證表單
8. 調用 api.add('medical_record', postData)
9. 發送 'getMedicalData' 事件給父組件
10. 父組件刷新就診紀錄列表
```

### 2. 新增用藥紀錄流程

```
1. 使用者點擊就診紀錄（selectMedicalRecord）
2. 載入該就診紀錄的用藥紀錄列表
3. 使用者點擊「新增用藥紀錄」按鈕
4. MedicineRecordAdd.vue 的 openForAdd() 被調用
5. 載入參考資料（藥品、單位、用法、用藥時間列表）
6. 載入所有使用中的藥物（用於檢查重複）
7. 顯示新增對話框
8. 使用者選擇藥品、單位、用法、用藥時間等
9. 系統自動計算給藥次數和藥物用完日期
10. 檢查重複用藥
11. 點擊「確認新增」
12. 驗證表單
13. 調用 api.add('medicine_record', postData)
14. 發送 'getMedicineRecord' 事件給父組件
15. 父組件刷新用藥紀錄列表
```

### 3. 列印流程

```
1. 使用者設定列印月份
2. 選擇列印功能（列印藥單 / 前往多筆列印頁面）
3. 設定每頁筆數（列印藥單時）
4. 開啟 PrintOption.vue 設定列印選項
5. 設定生命徵象指定列印內容
6. 設定資料距離今日天數
7. 確認列印
8. 開啟 PrintPage.vue 列印頁面
9. 系統根據月份和設定篩選用藥紀錄
10. 生成給藥紀錄單並顯示
```

## 數據流

### 1. 醫院就診紀錄數據流

```
User (使用者選擇住民)
  ↓
index.vue (顯示該住民的就診紀錄)
  ↓
MedicalRecordAdd.vue (新增/編輯就診紀錄)
  ↓
API: api.add/post('medical_record')
  ↓
數據庫: medical_record 表
  ↓
index.vue (刷新列表)
```

### 2. 用藥紀錄數據流

```
index.vue (選擇就診紀錄)
  ↓
getMedicineRecord() (取得該就診的用藥紀錄)
  ↓
MedicineRecordAdd.vue (新增/編輯用藥紀錄)
  ↓
API: api.add/post('medicine_record')
  ↓
數據庫: medicine_record 表
  ↓
index.vue (刷新列表)
```

### 3. 參考資料數據流

```
列表管理組件 (HospitalList, BranchList, etc.)
  ↓
API: api.get('hospital'), api.get('branch'), etc.
  ↓
數據庫: hospital, branch, doctor, etc. 表
  ↓
發送 @getSelect 事件
  ↓
父組件 (MedicalRecordAdd, MedicineRecordAdd)
  ↓
重新載入選項列表
```

## API 端點

### 主要端點

1. **取得就診紀錄**
   - 方法：`api.options()`
   - 端點：`byjson/searchByKeyValue/{databaseName}/medical_record`
   - 參數：`{ key: 'u_snkey', value: userSnkey }`

2. **新增就診紀錄**
   - 方法：`api.add()`
   - 端點：`general/add/{databaseName}/medical_record`
   - 參數：就診紀錄資料（包含 datalist JSON）

3. **編輯就診紀錄**
   - 方法：`api.post()`
   - 端點：`general/edit/{databaseName}/medical_record`
   - 參數：包含 snkey 的就診紀錄資料

4. **刪除就診紀錄**
   - 方法：`api.delete()`
   - 端點：`general/delv3/{databaseName}/medical_record`
   - 參數：`{ snkey, tablename, info }`

5. **取得用藥紀錄**
   - 方法：`api.options()`
   - 端點：`byjson/searchByKeyValue/{databaseName}/medicine_record`
   - 參數：`{ key: 'medical_snkey', value: medicalSnkey }`

6. **新增用藥紀錄**
   - 方法：`api.add()`
   - 端點：`general/add/{databaseName}/medicine_record`
   - 參數：用藥紀錄資料（包含 datalist JSON）

7. **編輯用藥紀錄**
   - 方法：`api.post()`
   - 端點：`general/edit/{databaseName}/medicine_record`
   - 參數：包含 snkey 的用藥紀錄資料

8. **刪除用藥紀錄**
   - 方法：`api.delete()`
   - 端點：`general/delv3/{databaseName}/medicine_record`
   - 參數：`{ snkey, tablename, info }`

### 參考資料端點

9. **取得參考資料列表**
   - 方法：`api.get()`
   - 端點：`general/getAll/{databaseName}/{tableName}`
   - 支援的表：`hospital`, `branch`, `doctor`, `main_cause_of_treatment`, `medicine`, `unit`, `method`, `eat_medicine_time`

## 事件系統

### 事件定義

1. **@getMedicalData** (MedicalRecordAdd → index.vue)
   - 觸發時機：新增或編輯就診紀錄成功後
   - 作用：通知父組件刷新就診紀錄列表

2. **@getMedicineRecord** (MedicineRecordAdd → index.vue)
   - 觸發時機：新增或編輯用藥紀錄成功後
   - 作用：通知父組件刷新用藥紀錄列表

3. **@getSelect** (列表管理組件 → 父組件)
   - 觸發時機：新增、修改或刪除參考資料成功後
   - 作用：通知父組件重新載入選項列表

## 技術特點

### 1. 數據存儲方式
- 主要資料使用 `datalist` 欄位以 JSON 格式存儲
- 關聯資料使用外鍵（`_snkey`）存儲
- 建立和修改資訊使用 `createInfo` 和 `editInfo` 陣列存儲

### 2. 重複檢查機制
- 用藥紀錄會檢查同一就診紀錄中是否重複新增相同藥品
- 新增用藥時會檢查該住民是否在相同時間段內使用相同藥品

### 3. 自動計算功能
- 根據用藥時間設定自動計算給藥次數
- 根據劑量、用量、給藥次數自動計算藥物用完日期

### 4. 列印功能
- 支援按月列印給藥紀錄單
- 支援設定每頁筆數
- 支援分頁列印（上半月/下半月）
- 支援列印選項設定（生命徵象、資料範圍等）

## 相依組件

### 外部組件

1. **@/components/MedicineList.vue** - 藥品列表管理
2. **@/components/UnitList.vue** - 單位列表管理
3. **@/components/MethodList.vue** - 用法列表管理
4. **@/components/EatMedicineTimeList.vue** - 用藥時間列表管理
5. **@/components/PaginatedIterator.vue** - 分頁迭代器

### 使用的外部庫

- Vue 3 (Composition API)
- Vuetify 3
- Pinia (狀態管理)
- dayjs (日期處理)
- qs (查詢字串處理)

## 路由配置

```javascript
{
  path: 'MedicineRecord',
  name: 'MedicineRecord',
  component: () => import('@/views/main/Documents/Original/MedicineRecord/index.vue')
}
```

路由路徑：`/main/Documents/MedicineRecord`

## 權限要求

- 無特殊權限要求（預設為 `pass`）

## 注意事項

1. **數據關聯性**
   - 刪除就診紀錄時，會同時刪除相關的所有用藥紀錄
   - 用藥紀錄必須關聯到一個有效的就診紀錄

2. **時間計算**
   - 用藥時間的計算依賴於 `eat_medicine_time` 表的設定
   - 支援間隔天數、每週重複、每月重複等多種模式

3. **列印功能**
   - 列印頁面使用實體線表格設計
   - 支援上半月和下半月分開列印
   - 每頁筆數可自訂

4. **參考資料管理**
   - 所有參考資料（醫院、科別、醫生等）都有獨立的管理組件
   - 修改參考資料後會自動更新父組件的選項列表

## 未來擴展建議

1. 支援批次新增用藥紀錄
2. 支援用藥紀錄的批次修改
3. 支援用藥紀錄的匯出功能
4. 支援更豐富的列印格式選項
5. 支援用藥紀錄的統計分析功能

