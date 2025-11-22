<template>
  <tbody>
    <!-- 入住適應暨心理社會評估 -->
    <tr>
      <td class="form_title" rowspan="12">
        <span class="vertical-mode">簡易心智狀態 SPMSQ ( 錯誤請打X )</span>
      </td>
      <td>1</td>
      <td colspan="2">今天是幾號? (年、月、日都對才算正確)</td>
      <td v-for="index in 5" :key="index">{{ formatAnswer(checkData(index - 1, 'q1')) }}</td>
    </tr>
    <tr>
      <td>2</td>
      <td colspan="2">今天是星期幾? (星期對才算正確)</td>
      <td v-for="index in 5" :key="index">{{ formatAnswer(checkData(index - 1, 'q2')) }}</td>
    </tr>
    <tr>
      <td>3</td>
      <td colspan="2">這是什麼地方? (對所在地有任何的描述都正確;說"我的家"或正確說出城鎮、醫院、機構的名稱都可以)</td>
      <td v-for="index in 5" :key="index">{{ formatAnswer(checkData(index - 1, 'q3')) }}</td>
    </tr>
    <tr>
      <td>4-1</td>
      <td colspan="2">您的電話號碼是幾號? (經確認號碼後証實無誤即算正確;或在會談時,能在二次間隔較長時間內重覆相同的號碼即算正確)</td>
      <td v-for="index in 5" :key="index">{{ formatAnswer(checkData(index - 1, 'q4-1')) }}</td>
    </tr>
    <tr>
      <td>4-2</td>
      <td colspan="2">您住在什麼地方? (如長輩沒有電話才問此問題)</td>
      <td v-for="index in 5" :key="index">{{ formatAnswer(checkData(index - 1, 'q4-2')) }}</td>
    </tr>
    <tr>
      <td>5</td>
      <td colspan="2">您幾歲了? (年齡與出生年月日符合才算正確)</td>
      <td v-for="index in 5" :key="index">{{ formatAnswer(checkData(index - 1, 'q5')) }}</td>
    </tr>
    <tr>
      <td>6</td>
      <td colspan="2">您的出生年月日? (年、月、日都對才算正確)</td>
      <td v-for="index in 5" :key="index">{{ formatAnswer(checkData(index - 1, 'q6')) }}</td>
    </tr>
    <tr>
      <td>7</td>
      <td colspan="2">現任的總統是誰? (姓氏正確即可)</td>
      <td v-for="index in 5" :key="index">{{ formatAnswer(checkData(index - 1, 'q7')) }}</td>
    </tr>
    <tr>
      <td>8</td>
      <td colspan="2">前任的總統是誰? (姓氏正確即可)</td>
      <td v-for="index in 5" :key="index">{{ formatAnswer(checkData(index - 1, 'q8')) }}</td>
    </tr>
    <tr>
      <td>9</td>
      <td colspan="2">您媽媽叫什麼名字? (不需要特別証實,只需長輩說出一個與他不同的女性姓名即可)</td>
      <td v-for="index in 5" :key="index">{{ formatAnswer(checkData(index - 1, 'q9')) }}</td>
    </tr>
    <tr>
      <td>10</td>
      <td colspan="2">從20減3開始算,一直減3減下去 (期間如有出現任何錯誤或無法繼續進行即算錯誤)</td>
      <td v-for="index in 5" :key="index">{{ formatAnswer(checkData(index - 1, 'q10')) }}</td>
    </tr>
    <tr>
      <td></td>
      <td>
        註1:進行方式:
        <br />依上表所列的問題,詢問住民並將結果紀錄下來,(如果住民家中沒有電話,可將4-1題改為4-2題),答錯的問題請紀錄下來。
        <br />註2:失智症狀評估標準:
        <br />錯0~2題:心智功功能完整
        <br />錯3~4題:輕度心智功能障礙
        <br />錯5~7題:中度心智功能障礙
        <br />錯8~10題:重度心智功能障礙
      </td>
      <td>錯幾題</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'total')) }}</td>
    </tr>
  </tbody>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const matchDate = ref([])
const items = ref([])

const formatValue = (val) => {
  if (val === undefined || val === null || val === '') return '—'
  if (typeof val === 'string' && val.includes('.')) {
    const strArr = val.split('.')
    return strArr[0]
  }
  return val
}

const formatAnswer = (val) => {
  if (val === undefined || val === null || val === '') return '—'
  
  // 處理字串格式（如 "1.0"）
  if (typeof val === 'string' && val.includes('.')) {
    const strArr = val.split('.')
    val = strArr[0]
  }
  
  // 轉換為數字進行比較
  const numVal = Number(val)
  
  if (numVal === 1 || val === '1') {
    return '×'
  } else if (numVal === 0 || val === '0') {
    return '○'
  }
  
  return val
}

const checkData = (index, key) => {
  const matchkey = matchDate.value[index]
  if (!matchkey) return ''
  const matchinfo = items.value.find((i) => i.date === matchkey)
  return matchinfo?.[key] ?? ''
}

onMounted(() => {
  try {
    const printData = JSON.parse(sessionStorage.getItem('printData') || '{}')
    matchDate.value = printData.matchDate || []
    items.value = (printData.spmsq || []).map((i) => {
      try {
        return JSON.parse(i.datalist || '{}')
      } catch {
        return {}
      }
    })
  } catch (error) {
    console.error('讀取列印資料失敗:', error)
  }
})
</script>

<style lang="scss">
tbody {
  td,
  th {
    border: 1px solid #000;
    padding: 8px;
  }
}

.vertical-mode {
  writing-mode: vertical-rl;
  -webkit-writing-mode: vertical-rl;
  white-space: nowrap;
}

.form_title {
  font-size: 1.2rem;
  text-align: center;
  font-weight: 600;
  background: rgba(33, 150, 243, 0.08);
}

@media print {
  tbody {
    td,
    th {
      border: 1px solid #000 !important;
      padding: 4px;
    }
  }
}
</style>
