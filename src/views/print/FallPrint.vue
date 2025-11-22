<template>
  <tbody>
    <!-- 跌倒危險因子評估表 -->
    <tr>
      <td class="form_title" rowspan="13">
        <span class="vertical-mode">跌倒危險因子評估表</span>
      </td>
      <td>1</td>
      <td>年齡</td>
      <td>0.小於65歲 1.大於65歲</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'age')) }}</td>
    </tr>
    <tr>
      <td>2</td>
      <td>跌倒病史</td>
      <td>0.無 5.有跌倒病史</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'history')) }}</td>
    </tr>
    <tr>
      <td>3</td>
      <td>活動能力</td>
      <td>0.無活動功能障礙,不需要他人、輔助器協助 1.有活動功能障礙,需他人、輔助器協助</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'active')) }}</td>
    </tr>
    <tr>
      <td>4</td>
      <td>意識狀態</td>
      <td>0.清醒有定向感 1.人、時、地混淆</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'conscious')) }}</td>
    </tr>
    <tr>
      <td>5</td>
      <td>行為</td>
      <td>0.正常 1.躁動不安 1.沮喪</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'behavior')) }}</td>
    </tr>
    <tr>
      <td>6</td>
      <td>夜間頻尿</td>
      <td>0.否 1.是</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'pee_rate')) }}</td>
    </tr>
    <tr>
      <td>7</td>
      <td>視覺障礙</td>
      <td>0.否 1.有</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'visual_impairment')) }}</td>
    </tr>
    <tr>
      <td>8</td>
      <td>步態平衡</td>
      <td>0.步態穩健平衡 1.步態不穩健平衡</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'gait_balance')) }}</td>
    </tr>
    <tr>
      <td>9</td>
      <td>藥物</td>
      <td>
        0.未使用以下藥物 2.服用以下二種藥物藥名
        <br />由下藥物中,標示出目前使用藥物種類:
        <br />1.抗組織胺 2.抗高血壓 3.鎮靜安眠藥 4.肌肉鬆弛劑 5.輕瀉劑 6.利尿劑 7.抗抑鬱藥 8.降血糖藥
      </td>
      <td v-for="index in 5" :key="index">
        {{ formatValue(checkData(index - 1, 'medicine')) }}
        {{ formatValue(checkData(index - 1, 'medicine_content')) }}
      </td>
    </tr>
    <tr>
      <td>10</td>
      <td>新入住或新轉入</td>
      <td>0.否 1.是</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'new_in')) }}</td>
    </tr>
    <tr>
      <td>11</td>
      <td>衣著(含鞋子)</td>
      <td>0.衣服、褲子大小合宜、鞋子防滑 1.衣服寬鬆、褲子太長、鞋子易滑</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'clothes')) }}</td>
    </tr>
    <tr>
      <td>12</td>
      <td>環境中熟悉物件</td>
      <td>0.擺放於健側或於熟悉位置 1.物件擺放被移動</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'familiar_object')) }}</td>
    </tr>
    <tr>
      <td colspan="2">
        ≧4分表示有跌倒傾向
        <small>出處:台灣長期照顧專業協會之機構品質指標監測操作手冊</small>
      </td>
      <td>總分</td>
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
    items.value = (printData.fall || []).map((i) => {
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
