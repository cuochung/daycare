### 照顧服務管理資訊平臺 HTML 匯入欄位對應說明

此文件說明從「照顧服務管理資訊平臺」匯出的 HTML 檔，經由 `htmlParser.js` → `parseHTMLToUserData()` 解析後，系統會為「個案基本資料 / User」建構的欄位與來源欄位對應關係。

---

### 一、基本資料

| 系統欄位(key) | 說明 | 照服平台 HTML 來源欄位 (th 文字) |
| --- | --- | --- |
| `name` | 個案姓名 | `個案姓名` |
| `id_num` | 個案身分證字號（只取第一段連續字串） | `個案身分證` |
| `birthday` | 出生日期，會將民國年格式 (例：036/03/20) 轉成西元 `YYYY-MM-DD` | `個案生日` |
| `sex` | 性別 | `性別` |
| `phone` | 個案電話 | `個案電話` |

---

### 二、地址與居住相關

| 系統欄位(key) | 說明 | 來源欄位 |
| --- | --- | --- |
| `registered_address` | 戶籍地址 | `戶籍地址` |
| `living_address` | 居住/通訊地址 | `居住(通訊)地址` |
| `living_status` | 目前居住狀況 | `目前居住狀況` |
| `living_location` | 居住地（長照量表 A5） | `A5.居住地` |
| `in_institution` | 目前是否居住於機構及其說明 | `目前居住機構` |

---

### 三、語言、婚姻、教育、就業、身分別

| 系統欄位(key) | 說明 | 來源欄位 |
| --- | --- | --- |
| `languages` | 常用語言（多選陣列） | 於 `table.table-bordered` 中 `常用語言` 這列，勾選的 `checkbox_checked` 圖示對應的文字 |
| `marriage_status` | 婚姻狀況 | 優先：`A1.個案婚姻狀況`；若找不到則用：`個案婚姻狀況` |
| `education` | 教育程度 | 優先：`A2.個案教育程度`；若找不到則用：`個案教育程度` |
| `welfare_status` | 長照福利身份 | `長照福利身份` |
| `indigenous` | 是否具原住民身分 | `原住民身分` |
| `indigenous_tribe` | 原住民族別 | `原住民族別` |
| `employment` | 是否就業中（文字描述） | `就業中` |
| `employment_willingness` | 就業意願 | `就業意願` |
| `identity_types` | 個案身分別（多選陣列） | 於 `table.table-bordered` 中 `個案身分別` 這列之 checkbox 勾選項目 |

---

### 四、近期醫療／住院相關

| 系統欄位(key) | 說明 | 來源欄位 |
| --- | --- | --- |
| `recent_hospitalization` | 最近三個月是否有住院及其簡要描述 | `最近三個月有住院` |
| `hospitalization_reason` | 住院原因 | 目前未自 HTML 解析，固定為空字串 `''` |

---

### 五、聯絡人與代理人 (`contactMan` 陣列)

`contactMan` 為陣列，每一筆元素格式：

- `man`: 姓名  
- `relationship`: 與個案關係  
- `phone`: 聯絡電話  
- `address`: 地址  

解析來源：

1. **主要聯絡人資料**
   - 由 `extractContactInfo(doc, '主要聯絡人資料')` 取得
   - 會去找 `<h5>` 含「主要聯絡人資料」標題底下的第一個 `table.table-bordered`，再依下列欄位對應：
     - `姓名` → `man`
     - `關係` → `relationship`
     - `手機` → `phone`
     - `地址` → `address`
   - 若 `man` 有值，會被 push 進 `userData.contactMan`。

2. **代理人**
   - 由 `extractContactInfo(doc, '代理人')` 取得
   - 對應欄位同上；若 `relationship` 解析不到，預設填入 `'代理人'`
   - 若 `man` 有值，同樣 push 進 `contactMan`。

---

### 六、福利身份 (`Welfare`)

`Welfare` 結構：

```text
Welfare: {
  MajorIllnessCert: { Value: '無' | '有', Other: string },
  DisabilityCert: { Value: string, Other: string[] }
}
```

| 系統欄位(key) | 說明 | 來源欄位與規則 |
| --- | --- | --- |
| `Welfare.MajorIllnessCert.Value` | 是否有重大傷病證明 | 由 `重大傷病證明` 內容判斷：含「有」→ `'有'`，否則 `'無'` |
| `Welfare.MajorIllnessCert.Other` | 重大傷病說明文字 | `說明` |
| `Welfare.DisabilityCert.Value` | 身心障礙證明情形文字 | `身心障礙證明`；若內容含「無」則為 `'無'`，否則保留原文字 |
| `Welfare.DisabilityCert.Other` | 身心障礙類別（多選陣列） | `身心障礙類別` 的 checkbox 勾選項目文字 |

---

### 七、主要／次要照顧者

#### 1. 主要照顧者 (`primary_caregiver`)

結構：

```text
primary_caregiver: {
  name,
  id_num,
  sex,
  age,
  relationship
}
```

| 系統欄位(key) | 說明 | 來源欄位 |
| --- | --- | --- |
| `primary_caregiver.name` | 主要照顧者姓名 | `B1a.主要照顧者姓名` |
| `primary_caregiver.id_num` | 主要照顧者身分證字號（只取第一段連續字串） | `主要照顧者身分證` |
| `primary_caregiver.sex` | 主要照顧者性別 | `B2.主要照顧者性別` |
| `primary_caregiver.age` | 主要照顧者年齡 | `B3.主要照顧者年齡` |
| `primary_caregiver.relationship` | 與個案關係 | 優先：`B1b.與個案之關係`；若找不到則：`B1.與主要照顧者關係` |

#### 2. 次要照顧者 (`secondary_caregiver`)

結構：

```text
secondary_caregiver: {
  name,
  id_num,
  sex,
  relationship
}
```

| 系統欄位(key) | 說明 | 來源欄位 |
| --- | --- | --- |
| `secondary_caregiver.name` | 次要照顧者姓名 | `B4.次要照顧者姓名` |
| `secondary_caregiver.id_num` | 次要照顧者身分證字號（只取第一段連續字串） | `次要照顧者身分證` |
| `secondary_caregiver.sex` | 次要照顧者性別 | `次要照顧者性別` |
| `secondary_caregiver.relationship` | 與個案關係 | 優先：`B5.次要照顧者與個案之關係`；若找不到則：`B5.與次要照顧者關係` |

#### 3. 其他照顧相關旗標

| 系統欄位(key) | 說明 | 來源欄位 |
| --- | --- | --- |
| `has_primary_caregiver` | 是否有主要照顧者 | `B1.個案是否有主要照顧者` |
| `primary_caregiver_disability` | 主要照顧者是否領有身心障礙證明 | `B3.1.主要照顧者是否領有身心障礙證明` |
| `has_secondary_caregiver` | 是否有次要照顧者 | `個案是否有次要照顧者` |

---

### 八、ADL 評估 (`adl_assessment`)

`adl_assessment` 結構（每一項為原始文字，如「可獨立完成 (6分)」，`total_score` 為解析後分數加總）：

```text
adl_assessment: {
  e1_eating,
  e2_bathing,
  e3_grooming,
  e4_dressing,
  e5_bowel_control,
  e6_bladder_control,
  e7_toileting,
  e8_transfer,
  e9_walking,
  e10_stairs,
  e11_mobility,
  total_score
}
```

| 系統欄位(key) | 說明 | 來源欄位 |
| --- | --- | --- |
| `adl_assessment.e1_eating` | E1. 吃飯 | `E1.吃飯` |
| `adl_assessment.e2_bathing` | E2. 洗澡 | `E2.洗澡` |
| `adl_assessment.e3_grooming` | E3. 個人修飾 | `E3.個人修飾` |
| `adl_assessment.e4_dressing` | E4. 穿脫衣物 | `E4.穿脫衣物` |
| `adl_assessment.e5_bowel_control` | E5. 大便控制 | `E5.大便控制` |
| `adl_assessment.e6_bladder_control` | E6. 小便控制 | `E6.小便控制` |
| `adl_assessment.e7_toileting` | E7. 上廁所 | `E7.上廁所` |
| `adl_assessment.e8_transfer` | E8. 移位 | `E8.移位` |
| `adl_assessment.e9_walking` | E9. 走路 | `E9.走路` |
| `adl_assessment.e10_stairs` | E10. 上下樓梯 | `E10.上下樓梯` |
| `adl_assessment.e11_mobility` | E11. 行動能力描述 | `E11.請問您目前行動能力如何` |
| `adl_assessment.total_score` | ADL 總分 | 由上述 E1–E10 每項文字中擷取 `(\d+)分` 加總 |

---

### 九、IADL 評估 (`iadl_assessment`)

`iadl_assessment` 結構：

```text
iadl_assessment: {
  f1_phone,
  f2_shopping,
  f3_meal_prep,
  f4_housework,
  f5_laundry,
  f6_transportation,
  f7_medication,
  f8_finance,
  total_score
}
```

| 系統欄位(key) | 說明 | 來源欄位 |
| --- | --- | --- |
| `iadl_assessment.f1_phone` | F1. 使用電話 | `F1.使用電話` |
| `iadl_assessment.f2_shopping` | F2. 購物 | `F2.購物` |
| `iadl_assessment.f3_meal_prep` | F3. 備餐 | `F3.備餐` |
| `iadl_assessment.f4_housework` | F4. 家務維持 | `F4.家務維持` |
| `iadl_assessment.f5_laundry` | F5. 洗衣服 | `F5.洗衣服` |
| `iadl_assessment.f6_transportation` | F6. 使用交通工具 | `F6.使用交通工具` |
| `iadl_assessment.f7_medication` | F7. 服用藥物 | `F7.服用藥物` |
| `iadl_assessment.f8_finance` | F8. 處理財務 | `F8.處理財務` |
| `iadl_assessment.total_score` | IADL 總分 | 由上述 F1–F8 文字中擷取 `(\d+)分` 加總 |

---

### 十、溝通能力 (`communication_ability`)

結構：

```text
communication_ability: {
  c1_hearing,
  c2_vision,
  c3_expression,
  c4_understanding
}
```

| 系統欄位(key) | 說明 | 來源欄位 |
| --- | --- | --- |
| `communication_ability.c1_hearing` | C1. 聽力 | `C1.聽力` |
| `communication_ability.c2_vision` | C2. 視力 | `C2.視力` |
| `communication_ability.c3_expression` | C3. 表達能力 | `C3.表達能力` |
| `communication_ability.c4_understanding` | C4. 理解能力 | `C4.理解能力` |

---

### 十一、認知功能 (`cognitive_function`)

結構：

```text
cognitive_function: {
  d1_short_term_memory,
  d2_long_term_memory,
  d3_orientation,
  d4_calculation,
  d5_judgment
}
```

| 系統欄位(key) | 說明 | 來源欄位 |
| --- | --- | --- |
| `cognitive_function.d1_short_term_memory` | D1. 短期記憶 | `D1.短期記憶` |
| `cognitive_function.d2_long_term_memory` | D2. 長期記憶 | `D2.長期記憶` |
| `cognitive_function.d3_orientation` | D3. 定向感 | `D3.定向感` |
| `cognitive_function.d4_calculation` | D4. 計算能力 | `D4.計算能力` |
| `cognitive_function.d5_judgment` | D5. 判斷能力 | `D5.判斷能力` |

---

### 十二、系統管理用欄位 / 匯入紀錄

這些欄位不是直接來自 HTML 顯示文字，而是系統在匯入或儲存時自動產生／補齊：

| 系統欄位(key) | 說明 | 來源與行為 |
| --- | --- | --- |
| `hidden` | 是否隱藏個案（預設空字串） | 在解析時固定為 `''` |
| `picInfo.picName` | 個案照片檔名 | 解析時預設空字串；若更新既有個案則沿用原資料 |
| `picInfo.picOriginalName` | 個案照片原始檔名 | 同上 |
| `createInfo` | 建立紀錄（建立者、時間、備註） | 新增個案時於匯入流程 (`ImportHTMLDialog.vue`) 中由登入者與當下時間填入，備註為「從 HTML 匯入」 |
| `editInfo` | 編輯紀錄陣列 | 若為更新既有個案，會在匯入時新增一筆，備註「從 HTML 匯入更新」 |
| `imported_from_html` | 是否由 HTML 匯入（布林旗標） | 解析時固定為 `true` |
| `import_date` | HTML 匯入時間（ISO 字串） | 解析時寫入 `new Date().toISOString()` |
| `raw_data.source` | 原始資料來源描述 | 固定為 `照顧服務管理資訊平臺` |
| `raw_data.import_timestamp` | 匯入時間戳 | `new Date().toISOString()` |
| `raw_data.data_summary.name` | 匯入摘要：姓名 | 取自 `userData.name` |
| `raw_data.data_summary.id_num` | 匯入摘要：身分證 | 取自 `userData.id_num` |
| `raw_data.data_summary.birthday` | 匯入摘要：生日 | 取自 `userData.birthday` |
| `raw_data.data_summary.adl_score` | 匯入摘要：ADL 總分 | 取自 `userData.adl_assessment.total_score` |
| `raw_data.data_summary.iadl_score` | 匯入摘要：IADL 總分 | 取自 `userData.iadl_assessment.total_score` |

> **備註：** `p_code`（病歷號）、`snkey` 等主鍵欄位是在匯入 API (`user` 資料表) 存檔流程中產生或沿用，並非直接由 HTML 解析而來。

---

## 十三、目前不一致的欄位（HTML 中有但解析器未提取）

以下欄位在照服平台 HTML 檔案中存在，但目前 `htmlParser.js` 的 `parseHTMLToUserData()` 函數**尚未提取**，導致這些資料在匯入時會遺失：

### 1. 住院相關

| HTML 欄位 | 說明 | 目前狀態 |
| --- | --- | --- |
| `住院原因（含急診）` | 住院原因的詳細描述（例：114082跌倒腦出血手術） | ❌ 未提取，`hospitalization_reason` 固定為空字串 `''` |

### 2. 疾病史（G4e）

| HTML 欄位 | 說明 | 目前狀態 |
| --- | --- | --- |
| `G4e.疾病名稱` | 24 種疾病選項（高血壓、糖尿病、骨骼系統、視覺疾病、腦血管意外等） | ❌ 未提取 |
| `目前正在治療` | 每種疾病是否正在治療 | ❌ 未提取 |
| `目前使用藥物` | 每種疾病是否使用藥物 | ❌ 未提取 |

### 3. 進階照顧（G5）

| HTML 欄位 | 說明 | 目前狀態 |
| --- | --- | --- |
| `G5a.個案目前是否接受進階照顧` | 是否接受進階照顧 | ❌ 未提取 |
| `G5a-01` ~ `G5a-23` | 23 種進階照顧項目（鼻胃管、氣切護理、呼吸器、抽痰、氧氣治療等）及其使用狀態 | ❌ 未提取 |

### 4. 其他 G 大題子題

| HTML 欄位 | 說明 | 目前狀態 |
| --- | --- | --- |
| `G1a.過去1個月中，個案身體疼痛的程度` | 疼痛評估 | ❌ 未提取 |
| `G2a.個案現在的皮膚狀況` | 皮膚狀況評估 | ❌ 未提取 |
| `G3a.四肢關節僵硬受限制` | 關節僵硬評估 | ❌ 未提取 |
| `G4a.個案過去3個月體重是否減輕` | 體重變化 | ❌ 未提取 |
| `G4b.個案身體質量指數（BMI）` | BMI 值 | ❌ 未提取 |
| `G4c.個案一般的飲食狀況` | 飲食狀況 | ❌ 未提取 |
| `G4d.衰弱評估（SOF）` | G4d1-G4d3 三項衰弱評估 | ❌ 未提取 |
| `G4f.個案尋求必要醫療時，是否需要服務介入協助` | 醫療協助需求 | ❌ 未提取 |
| `G6a.個案是否有任何關於吞嚥困難的情形或症狀` | 吞嚥困難評估（可複選） | ❌ 未提取 |
| `G6b.個案有無接受過吞嚥訓練` | 吞嚥訓練 | ❌ 未提取 |
| `G7.個案被診斷為失智症後，照顧者是否有接受教導` | 失智症照顧者教導（可複選） | ❌ 未提取 |
| `G8a-G8e.跌倒、平衡及安全` | 坐姿平衡、站立平衡、跌倒次數、移位異常、擔心跌倒、危險認知 | ❌ 未提取 |

### 5. 居家環境與社會參與（H 大題）

| HTML 欄位 | 說明 | 目前狀態 |
| --- | --- | --- |
| `H1a.個案目前的居住狀況` | 居住狀況 | ❌ 未提取 |
| `H1b.目前哪些人與個案同住` | 同住人員（可複選） | ❌ 未提取 |
| `H1c.個案居住在幾樓` | 樓層 | ❌ 未提取 |
| `H1d.是否有電梯` | 電梯 | ❌ 未提取 |
| `H1e.居住處是否有任何環境上的障礙` | 環境障礙（可複選） | ❌ 未提取 |
| `H2a.個案與親朋好友多久會聯絡1次` | 社交聯絡頻率 | ❌ 未提取 |
| `H2b.個案目前是否有參與活動` | 參與活動狀況 | ❌ 未提取 |
| `H2c.最近三個月內為了與親友互動、參與活動，是否需要服務介入協助` | 社交協助需求 | ❌ 未提取 |
| `H2c1.需要協助的方式` | 協助方式 | ❌ 未提取 |
| `H2c2.需要協助的頻率` | 協助頻率 | ❌ 未提取 |

### 6. 情緒及行為型態（I 大題）

| HTML 欄位 | 說明 | 目前狀態 |
| --- | --- | --- |
| `I01-14a.在過去三個月內，個案是否有出現該類行為` | 14 種情緒及行為型態（遊走、日夜顛倒、語言攻擊、肢體攻擊、干擾行為、抗拒照護、妄想、幻覺、恐懼或焦慮、憂鬱及負性症狀、自傷行為及自殺、重複行為、對物品的攻擊行為、其他不適當以及不潔行為） | ❌ 未提取 |
| `I01-14b.在過去一週內，個案若有出現該類行為，多久？` | 各行為的發生頻率 | ❌ 未提取 |

### 7. 主要照顧者負荷（J 大題）

| HTML 欄位 | 說明 | 目前狀態 |
| --- | --- | --- |
| `J01.睡眠受到干擾` | 照顧者睡眠干擾 | ❌ 未提取 |
| `J02.體力上的負荷` | 照顧者體力負荷 | ❌ 未提取 |
| `J03.需分配時間照顧其他家人` | 時間分配 | ❌ 未提取 |
| `J04.對個案的行為感到困擾` | 行為困擾 | ❌ 未提取 |
| `J05.無法承受照顧壓力` | 照顧壓力 | ❌ 未提取 |

### 8. 主要照顧者工作與支持（K 大題）

| HTML 欄位 | 說明 | 目前狀態 |
| --- | --- | --- |
| `K1.是否與個案同住` | 同住狀況 | ❌ 未提取 |
| `K2-K7` | 其他照顧者工作與支持相關問題 | ❌ 未提取 |

### 9. 其他欄位

| HTML 欄位 | 說明 | 目前狀態 |
| --- | --- | --- |
| `A4.年齡` | 個案年齡 | ❌ 未提取（僅有生日） |
| `A5.居住地` | 居住地 | ⚠️ 有提取 `living_location`，但欄位名稱可能不一致 |
| `C1.個案意識狀態` | 意識狀態 | ❌ 未提取（僅有 C1-C4 的聽力、視力、表達、理解） |
| `目前聘請看護幫忙照顧` | 是否聘請看護 | ❌ 未提取 |
| `曾聘請外籍看護人數` | 外籍看護人數 | ❌ 未提取 |
| `申請服務種類` | 申請的服務種類（可複選） | ❌ 未提取 |

---

### 建議

若需要完整匯入照服平台的所有資料，建議：

1. **優先處理**：住院原因、疾病史（G4e）、進階照顧（G5）、情緒及行為型態（I）、照顧者負荷（J）
2. **次要處理**：其他 G 大題子題、H 大題（居家環境與社會參與）、K 大題（照顧者工作與支持）
3. **擴充解析器**：在 `htmlParser.js` 中新增對應的提取函數，並在 `parseHTMLToUserData()` 中呼叫

---

