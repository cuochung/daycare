<template>
  <tbody>
    <!-- Braden壓力性損傷風險評估表 -->
    <tr>
      <td class="form_title" rowspan="7">
        <span class="vertical-mode">Braden壓力性損傷風險評估表</span>
      </td>
      <td>1</td>
      <td>感覺知覺程度(sensory perception)</td>
      <td>1.完全限制 2.大部分受限制 3.稍微受限制 4.沒有損傷</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'sensory_perception')) }}</td>
    </tr>
    <tr>
      <td>2</td>
      <td>潮濕程度(moisture)</td>
      <td>1.總是潮濕 2.經常潮濕 3.偶爾潮濕 4.很少潮濕</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'moisture')) }}</td>
    </tr>
    <tr>
      <td>3</td>
      <td>活動力(activity)</td>
      <td>1.臥床不動 2.受限於輪椅活動 3.可偶爾下床活動 4.可經常下床行走</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'activity')) }}</td>
    </tr>
    <tr>
      <td>4</td>
      <td>移動力(mobility)</td>
      <td>1.完全無法自行翻身 2.大部分需要他人協助翻身 3.少部分需要他人協助翻身 4.可自行翻身</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'mobility')) }}</td>
    </tr>
    <tr>
      <td>5</td>
      <td>營養狀態(nutrition)</td>
      <td>1.營養非常差 2.營養差 3.營養稍差 4.營養好</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'nutrition')) }}</td>
    </tr>
    <tr>
      <td>6</td>
      <td>摩擦力/剪力(friction/shear)</td>
      <td>1.有此問題 2.有潛在問題 3.沒有明顯問題</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'friction_shear')) }}</td>
    </tr>
    <tr>
      <td colspan="2">
        <small>
          註1:「1分」:非常嚴重/危險(very severe);「2分」:嚴重/危險(severe);「3分」:有點嚴重/危險(slightly severe);「4分」:正常(normal)。
          <br />註2:滿分為23分,最低分為6分,分數愈高分表壓力性損傷危險性低,分數愈低分表壓力性損傷危險性高;應用於一般內外科切點為16分,應用於護理之家為18分(≦14分為中度危險;≦12分為高度危險)。
          出處:台灣長期照顧專業協會之機構品質指標監測操作手冊
        </small>
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
    items.value = (printData.braden || []).map((i) => {
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
