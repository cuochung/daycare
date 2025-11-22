<template>
  <tbody>
    <tr>
      <td class="form_title">
        <span class="vertical-mode">柯氏量表</span>
      </td>
      <td colspan="3">
        0級:完全活動,不受任何限制。
        <br />1級:能夠步行及維持輕度工作。如:簡單之家務。
        <br />2級:能夠步行及維持大部分自我照顧。但無法進行家務。
        <br />3級:只能維持有限的自我照顧，50％以上的清醒時間，活動限於在床或椅上。
        <br />4級:完全無活動，不能進行任何自我照顧，且完全限制在床或椅。
      </td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'klv')) }}</td>
    </tr>
    <tr>
      <td class="form_title" rowspan="11">
        <span class="vertical-mode">日常生活功能(巴氏量表)ADL</span>
      </td>
      <td>1</td>
      <td>進食</td>
      <td>
        10：自己在合理時間內(約十秒鐘吃一口)，可用筷子取食眼前的食物。若需進食輔具時，應會自行穿脫。
        <br />5：需別人幫忙穿脫進食輔具或只會用湯匙進食。
        <br />0：無法自行取食或耗費時間過長。
      </td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'eat')) }}</td>
    </tr>
    <tr>
      <td>2</td>
      <td>個人衛生</td>
      <td>
        5：可自行洗手、刷牙、洗臉及梳頭。
        <br />0：需要他人部分或完全協助。
      </td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'hygiene')) }}</td>
    </tr>
    <tr>
      <td>3</td>
      <td>上廁所</td>
      <td>
        10：可自行上下馬桶、穿脫衣服、不會弄髒衣服、會自行使用衛生紙擦拭。
        <br />5：需要協助保持姿勢的平衡、整理衣服或用衛生紙
        <br />0：無法自己完成。
      </td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'wc')) }}</td>
    </tr>
    <tr>
      <td>4</td>
      <td>洗澡</td>
      <td>
        5：能獨立完成(不論是盆浴或沐浴),不需別人在旁。
        <br />0：需別人協助。
      </td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'bathing')) }}</td>
    </tr>
    <tr>
      <td>5</td>
      <td>穿脫衣服</td>
      <td>
        10：可自己穿脫衣服、鞋子,自己扣釦子、上拉鍊或綁鞋帶。
        <br />5：在別人協助下,可自行完成一半以上動作。
        <br />0：不會自己做
      </td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'wear')) }}</td>
    </tr>
    <tr>
      <td>6</td>
      <td>大便控制</td>
      <td>
        10：不會失禁，能自行灌腸或使用塞劑。
        <br />5：偶爾會失禁(每週不超過一次)，需要他人協助使用灌腸或塞劑。
        <br />0：失禁,無法自己控制且需他人處理。
      </td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'stool')) }}</td>
    </tr>
    <tr>
      <td>7</td>
      <td>小便控制</td>
      <td>
        10：能自行控制不會有失禁,或能自行使用並清潔尿套、尿袋。
        <br />5：偶爾會失禁(每週不超過一次)，或尿急(無法等待放好便盆或及時趕到廁所)或需要他人協助處理尿套。
        <br />0：失禁,無法自己控制且需他人處理。
      </td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'pee')) }}</td>
    </tr>
    <tr>
      <td>8</td>
      <td>平地行走</td>
      <td>
        15：使用或不使用輔具,皆可獨立行走50公尺以上。
        <br />10：需他人稍微扶持或口頭指導才能行走50公尺以上。
        <br />5：雖無法行走，但可獨立操縱輪椅(包括轉彎、進門及接近桌子、床沿)並可推行輪椅50公尺以上。
        <br />0：完全無法行走,需別人幫忙推輪椅。
      </td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'walk')) }}</td>
    </tr>
    <tr>
      <td>9</td>
      <td>上下樓梯</td>
      <td>
        10：可自行上下樓梯。可使用扶手、枴杖等輔具。
        <br />5：需他人協助或監督才能上下樓梯。
        <br />0：無法上下樓梯。
      </td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'stairs')) }}</td>
    </tr>
    <tr>
      <td>10</td>
      <td>上下床或椅子</td>
      <td>
        15：整個過程可獨立完成。
        <br />10：移動身體時需要稍微協助、給予提醒、安全監督。
        <br />5：可以自行坐起,但從床上坐起時移動身體時需要他人協助。
        <br />0：不會自己移動。
      </td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'bed')) }}</td>
    </tr>
    <tr>
      <td colspan="2">0-20:完全依賴 21-60:嚴重依賴 61-90:中度依賴 91-99:輕度依賴 100:獨立</td>
      <td>總分</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'total')) }}</td>
    </tr>
  </tbody>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import smanPic from '@/assets/img/sman.png'

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
    items.value = (printData.kb || []).map((i) => {
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
