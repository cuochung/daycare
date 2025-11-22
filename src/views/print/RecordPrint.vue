<template>
  <tbody>
    <!-- 意識狀態 -->
    <tr>
      <td class="form_title" rowspan="4">
        <span class="vertical-mode">意識狀態</span>
      </td>
      <td>意識程度</td>
      <td colspan="2">1.清醒 2.混亂 3.瞻妄 4.嗜睡 5.木僵 6.植物人 7.昏迷 8.其他</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'ideology')) }}</td>
    </tr>
    <tr>
      <td rowspan="3">GCS</td>
      <td>E 睜眼反應 eye open</td>
      <td>
        1.對任何刺激均無反應
        <br />2.疼痛刺激張開眼睛
        <br />3.聲音刺激張開眼睛
        <br />4.自動睜開
      </td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'e')) }}</td>
    </tr>
    <tr>
      <td>M 最佳活動反應 best motor response</td>
      <td>
        1.疼痛刺激沒有反應
        <br />2.強直性伸張狀
        <br />3.異常屈曲
        <br />4.退縮
        <br />5.能辨識痛點
        <br />6.依照指令動作
      </td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'm')) }}</td>
    </tr>
    <tr>
      <td>V 最佳語言反應 best verbal response</td>
      <td>
        1.疼痛刺激無法引起反應
        <br />2.喃喃且無法理解的聲音
        <br />3.嗜睡
        <br />4.混亂
        <br />5.清醒
      </td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'v')) }}</td>
    </tr>

    <!-- 心肺功能 -->
    <tr>
      <td class="form_title" rowspan="4">
        <span class="vertical-mode">心肺功能</span>
      </td>
      <td>心律</td>
      <td colspan="2">1.規則 2.不規則</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'heart_rate')) }}</td>
    </tr>
    <tr>
      <td>呼吸型態</td>
      <td colspan="2">1.正常 2.端坐 3.呼吸器輔助 4.氧氣使用:____升/分 5.其他</td>
      <td v-for="index in 5" :key="index">
        {{ formatValue(checkData(index - 1, 'breath_state')) }}
        {{ formatValue(checkData(index - 1, 'breath_state_content')) }}
      </td>
    </tr>
    <tr>
      <td>呼吸音</td>
      <td colspan="2">N:正常 W:喘鳴 Ra:囉聲 Rh:乾囉音 C:爆裂音</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'breath_sound')) }}</td>
    </tr>
    <tr>
      <td>痰</td>
      <td colspan="2">0.無 1.自咳 2.抽痰(顏色/量)</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'sputum')) }}</td>
    </tr>
    <!-- 口腔吞嚥 -->
    <tr>
      <td class="form_title" rowspan="3">
        <span class="vertical-mode">口腔吞嚥</span>
      </td>
      <td>黏膜</td>
      <td colspan="2">0.完整 1.破損</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'mucosa')) }}</td>
    </tr>
    <tr>
      <td>咬合</td>
      <td colspan="2">0.不影響咀嚼 1.會影響咀嚼 2.不由口進食</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'occlusal')) }}</td>
    </tr>
    <tr>
      <td>吞嚥能力</td>
      <td colspan="2">0.平順 1.偶嗆(1-3次) 2.常嗆食(3次以上) 3.無吞嚥能力 4.無法得知</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'swallowing')) }}</td>
    </tr>
    <!-- 排泄功能 -->
    <tr>
      <td class="form_title" rowspan="6">
        <span class="vertical-mode">排泄功能</span>
      </td>
      <td>小便性質</td>
      <td colspan="2">0.清澈 1.混濁 2.有沉澱物</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'pee')) }}</td>
    </tr>
    <tr>
      <td>排尿方式</td>
      <td colspan="2">0.至廁所或使用尿壼(便盆椅) 1.尿布 2.尿套 3.間歇性導尿 4.存留導尿管</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'urination')) }}</td>
    </tr>
    <tr>
      <td rowspan="3">腸蠕動</td>
      <td>腸音</td>
      <td>0.正常 1.過慢 2.過速 3.無</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'intestinal_peristalsis')) }}</td>
    </tr>
    <tr>
      <td>脹氣</td>
      <td>0.無 1.有</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'flatulence')) }}</td>
    </tr>
    <tr>
      <td>硬塊</td>
      <td>0.無 1.有(註明部位)</td>
      <td v-for="index in 5" :key="index">
        {{ formatValue(checkData(index - 1, 'hard_block')) }}
        {{ formatValue(checkData(index - 1, 'hard_block_content')) }}
      </td>
    </tr>
    <tr>
      <td>排便處理</td>
      <td colspan="2">0.正常 1.軟便劑 2.輕瀉劑 3.灌腸 4.挖便 5.造瘻口 6.其他</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'defecation_treatment')) }}</td>
    </tr>
    <!-- 皮膚狀態 -->
    <tr>
      <td class="form_title" rowspan="3">
        <span class="vertical-mode">皮膚狀態</span>
      </td>
      <td>外觀</td>
      <td colspan="2">A.正常 B.鬆弛 C.乾燥 D.搔癢 E.水腫 F.瘀血 G.疹子 H.腫塊 I.水泡</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'skin_exterior')) }}</td>
    </tr>
    <tr>
      <td>完整性</td>
      <td colspan="2">0.完整 1.破損(請填寫部位)</td>
      <td v-for="index in 5" :key="index">
        {{ formatValue(checkData(index - 1, 'skin_complete')) }}
        {{ formatValue(checkData(index - 1, 'skin_complete_content')) }}
      </td>
    </tr>
    <tr>
      <td>肢體水腫</td>
      <td colspan="2">
        0.無水腫 1.水腫程度:1+ 2+ 3+ 4+
        <br />
        <span class="small">
          +:凹陷 2mm,但很快恢復,且下肢看不到水腫
          <br />++:中度凹陷 4mm,但10~15秒後才恢復
          <br />+++:深度凹陷 6mm,持續較久的時間才恢復,下肢可見腫脹
          <br />++++:嚴重凹陷 8mm,會凹陷一段時間,下肢已經非常腫脹
        </span>
      </td>
      <td v-for="index in 5" :key="index">
        <table class="table">
          <tr>
            <td colspan="3">
              右
              <span class="float-right">左</span>
            </td>
          </tr>
          <tr>
            <td>{{ formatValue(checkData(index - 1, 'limb_edema1')) }}</td>
            <td rowspan="2" class="p-0 m-0">
              <div class="d-flex justify-center">
                <img :src="smanPic" alt="sman" />
              </div>
            </td>
            <td>{{ formatValue(checkData(index - 1, 'limb_edema2')) }}</td>
          </tr>
          <tr>
            <td>{{ formatValue(checkData(index - 1, 'limb_edema3')) }}</td>
            <td>{{ formatValue(checkData(index - 1, 'limb_edema4')) }}</td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- 肢體活動 -->
    <tr>
      <td class="form_title" rowspan="5">
        <span class="vertical-mode">肢體活動</span>
      </td>
      <td rowspan="3">平衡</td>
      <td>坐姿</td>
      <td rowspan="3">0.穩定 1.稍穩定 2.極不穩定 3.無法執行</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'balance1')) }}</td>
    </tr>
    <tr>
      <td>站姿</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'balance2')) }}</td>
    </tr>
    <tr>
      <td>步行</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'balance3')) }}</td>
    </tr>
    <tr>
      <td>關節</td>
      <td colspan="2">0.正常 1.受限 2.失能</td>
      <td v-for="index in 5" :key="index">
        <table class="table">
          <tr>
            <td colspan="3">
              右
              <span class="float-right">左</span>
            </td>
          </tr>
          <tr>
            <td>{{ formatValue(checkData(index - 1, 'joint1')) }}</td>
            <td rowspan="2" class="p-0 m-0">
              <div class="d-flex justify-center">
                <img :src="smanPic" alt="sman" />
              </div>
            </td>
            <td>{{ formatValue(checkData(index - 1, 'joint2')) }}</td>
          </tr>
          <tr>
            <td>{{ formatValue(checkData(index - 1, 'joint3')) }}</td>
            <td>{{ formatValue(checkData(index - 1, 'joint4')) }}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>肌力</td>
      <td colspan="2">5分:正常 4分:運動稍受阻力 3分:無法支重 2分:無重力時可作水平 1分:可見肌肉收縮 0分:完全無法動</td>
      <td v-for="index in 5" :key="index">
        <table class="table">
          <tr>
            <td colspan="3">
              右
              <span class="float-right">左</span>
            </td>
          </tr>
          <tr>
            <td>{{ formatValue(checkData(index - 1, 'muscle_strength1')) }}</td>
            <td rowspan="2" class="p-0 m-0">
              <img :src="smanPic" alt="sman" />
            </td>
            <td>{{ formatValue(checkData(index - 1, 'muscle_strength2')) }}</td>
          </tr>
          <tr>
            <td>{{ formatValue(checkData(index - 1, 'muscle_strength3')) }}</td>
            <td>{{ formatValue(checkData(index - 1, 'muscle_strength4')) }}</td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- 疼痛情形 -->
    <tr>
      <td class="form_title" rowspan="4">
        <span class="vertical-mode">疼痛情形</span>
      </td>
      <td>疼痛部位</td>
      <td colspan="2">0.無 1.有:加註部位</td>
      <td v-for="index in 5" :key="index">
        {{ formatValue(checkData(index - 1, 'pain')) }}
        {{ formatValue(checkData(index - 1, 'pain_content')) }}
      </td>
    </tr>
    <tr>
      <td>疼痛程度</td>
      <td colspan="2">住民主訴或護理人員經由疼痛評估表評分 0=無疼痛 1-3=輕度疼痛 4-6=中度疼痛 7-10=嚴重疼痛</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'pain_lv')) }}</td>
    </tr>
    <tr>
      <td>疼痛頻率</td>
      <td colspan="2">1.少於每日 2.每日疼痛 3.無法得知</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'pain_rate')) }}</td>
    </tr>
    <tr>
      <td>止痛藥物使用</td>
      <td colspan="2">0.無 1.有</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'painkiller')) }}</td>
    </tr>
    <!-- 知覺溝通能力 -->
    <tr>
      <td class="form_title" rowspan="6">
        <span class="vertical-mode">知覺溝通能力</span>
      </td>
      <td>助聽器</td>
      <td colspan="2">0.無 1.有</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'hearing_aid')) }}</td>
    </tr>
    <tr>
      <td>聽力</td>
      <td colspan="2">0.正常 1.重聽 2.無法判斷</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'hearing')) }}</td>
    </tr>
    <tr>
      <td>視力</td>
      <td colspan="2">0.正常 1.可見報紙大標題 2.可變識物體形狀 3.其他</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'vision')) }}</td>
    </tr>
    <tr>
      <td>表達能力</td>
      <td colspan="2">0.可清楚表達 1.部分可理解 2.難以理解 3.無法判斷</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'expression')) }}</td>
    </tr>
    <tr>
      <td>溝通方式</td>
      <td colspan="2">0.一般會語 1.書面溝通 2.身體語言(手勢) 3.其他</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'communication')) }}</td>
    </tr>
    <tr>
      <td>了解他人談話語意</td>
      <td colspan="2">0.完全能夠了解 1.部分了解 2.難以了解 3.無法判斷</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'understand')) }}</td>
    </tr>
    <!-- 口腔評估 -->
    <tr>
      <td class="form_title" rowspan="5">
        <span class="vertical-mode">口腔評估</span>
      </td>
      <td>嘴唇乾燥等級</td>
      <td colspan="2">1.無乾燥 2.乾燥無裂痕 3.乾燥、龜裂、出血</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'oralassessment1')) }}</td>
    </tr>
    <tr>
      <td>舌苔等級</td>
      <td colspan="2">1.無舌苔 2.有微白色 3.明顯舌苔、黃、白或其他異色</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'oralassessment2')) }}</td>
    </tr>
    <tr>
      <td>唾液量</td>
      <td colspan="2">1.正常 2.黏稠 3.量少 4.量多</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'oralassessment3')) }}</td>
    </tr>
    <tr>
      <td>牙齒狀況</td>
      <td colspan="2">1.正常 2.蛀牙 3.牙周病 4.動搖 5.無牙 6.假牙 7.其他</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'oralassessment4')) }}</td>
    </tr>
    <tr>
      <td>口腔黏膜</td>
      <td colspan="2">1.正常 2.破損 3.潰瘍 4.紅腫 5.出血 6.其他</td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'oralassessment5')) }}</td>
    </tr>
    <!-- 口臭評估 -->
    <tr>
      <td class="form_title">
        <span class="vertical-mode">口臭評估</span>
      </td>
      <td colspan="3">
        等級一:無口臭
        <br />等級二:懷疑或輕微有口臭
        <br />等級三:中度口臭,確實聞到口臭
        <br />等級四:強烈口臭明顯,但檢查者勉強忍受
        <br />等級五:嚴重口臭味道很強,檢查者無法忍受
      </td>
      <td v-for="index in 5" :key="index">{{ formatValue(checkData(index - 1, 'badbreath')) }}</td>
    </tr>
  </tbody>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import smanPic from '@/assets/img/sman.png'

const matchDate = ref([])
const recordItems = ref([])

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
  const matchinfo = recordItems.value.find((i) => i.date === matchkey)
  return matchinfo?.[key] ?? ''
}

onMounted(() => {
  try {
    const printData = JSON.parse(sessionStorage.getItem('printData') || '{}')
    matchDate.value = printData.matchDate || []
    recordItems.value = (printData.record || []).map((i) => {
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

img {
  width: 70px;
}

.table {
  width: 100%;
  border-collapse: collapse;

  td,
  th {
    border: 1px solid #000;
    padding: 4px;
  }
}

@media print {
  tbody {
    td,
    th {
      border: 1px solid #000 !important;
      padding: 4px;
    }
  }

  .table {
    td,
    th {
      border: 1px solid #000 !important;
      padding: 2px;
    }
  }
}
</style>
