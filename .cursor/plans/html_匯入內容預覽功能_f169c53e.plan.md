---
name: HTML 匯入內容預覽功能
overview: 在 User 功能中新增一個對話框組件，用於選擇 HTML 檔案並顯示從中截取到的所有資訊。支援 JSON 樹狀結構和格式化表格兩種顯示方式，可切換查看。
todos:
  - id: create_preview_dialog
    content: 創建 HTMLPreviewDialog.vue 組件，包含檔案選擇、解析和顯示功能
    status: completed
  - id: implement_json_view
    content: 實作 JSON 樹狀結構顯示（可展開/收合）
    status: completed
    dependencies:
      - create_preview_dialog
  - id: implement_formatted_table
    content: 實作格式化表格顯示（分類顯示各類資料）
    status: completed
    dependencies:
      - create_preview_dialog
  - id: add_toggle_switch
    content: 新增顯示模式切換功能（JSON/表格）
    status: completed
    dependencies:
      - implement_json_view
      - implement_formatted_table
  - id: integrate_to_user_page
    content: 在 User/index.vue 中新增預覽按鈕並整合組件
    status: completed
    dependencies:
      - create_preview_dialog
isProject: false
---

# HTML 匯入內容預覽功能

## 目標

在 `src/views/main/User` 功能中新增一個對話框，用於選擇並預覽從「照顧服務管理資訊平臺」HTML 檔案中截取到的所有資訊。

## 實作內容

### 1. 創建新的預覽對話框組件

- **檔案**: `src/views/main/User/HTMLPreviewDialog.vue`
- **功能**:
- 檔案選擇器（支援 .html/.htm）
- 使用現有的 `htmlParser.js` 解析 HTML 檔案
- 顯示解析結果，支援兩種顯示模式：
  - **JSON 樹狀結構**：使用可展開/收合的 JSON 檢視器
  - **格式化表格**：分類顯示（基本資料、聯絡人、照顧者、評估資料等）
- 可切換顯示模式
- 顯示解析狀態（成功/失敗、錯誤訊息）

### 2. 整合到 User 頁面

- **檔案**: `src/views/main/User/index.vue`
- **修改**:
- 在工具列新增「預覽 HTML 內容」按鈕
- 引入並使用 `HTMLPreviewDialog` 組件
- 按鈕位置：與「匯入 HTML」按鈕並列

### 3. 顯示內容結構

根據 `htmlParser.js` 的解析結果，顯示以下分類：

- **基本資料**：姓名、身分證、生日、性別、電話、地址等
- **聯絡人資料**：主要聯絡人、代理人
- **照顧者資料**：主要照顧者、次要照顧者
- **評估資料**：ADL、IADL、溝通能力、認知功能
- **福利資料**：重大傷病、身心障礙證明
- **其他資料**：語言、婚姻狀況、教育程度等
- **原始資料摘要**：`raw_data` 內容

## 技術細節

### 使用現有工具

- `htmlParser.js` 的 `parseHTMLToUserData()` 函數解析 HTML
- `parseMultipleHTMLFiles()` 支援批次解析（但預覽功能先支援單檔）

### 顯示組件

- JSON 樹狀結構：使用 Vue 的遞迴組件或第三方 JSON 檢視器
- 格式化表格：使用 Vuetify 的 `v-data-table` 或自訂表格

### 錯誤處理

- 顯示解析錯誤訊息
- 顯示驗證錯誤（如必填欄位缺失）

## 檔案清單

1. **新增檔案**:

- `src/components/HTMLPreviewDialog.vue` - 預覽對話框組件

1. **修改檔案**:

- `src/views/main/User/index.vue` - 新增預覽按鈕和組件引用

## 注意事項

- 此功能僅用於預覽，不執行實際匯入

