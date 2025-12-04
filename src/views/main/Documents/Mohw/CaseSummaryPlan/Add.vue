<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <FloatingPanel title="快速操作">
      <v-sheet color="primary-lighten-5" variant="tonal" elevation="2" rounded="lg" class="pa-3">
        <div class="d-flex flex-column" style="gap: 8px;">
          <v-btn variant="tonal" color="secondary" block prepend-icon="mdi-close" @click="closeDialog">
            取消
          </v-btn>
          <v-btn v-if="processType === 'add'" color="primary" variant="flat" block :loading="loading" 
            prepend-icon="mdi-check" @click="handleAdd">
            確認新增
          </v-btn>
          <v-btn v-else color="primary" variant="flat" block :loading="loading" 
            prepend-icon="mdi-content-save" @click="handleEdit">
            確認修改
          </v-btn>
        </div>
      </v-sheet>
    </FloatingPanel>

    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-file-document-edit</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold mb-1">{{ headerTitle }}</h2>
            <p class="text-body-2 mb-0">{{ headerSubtitle }}</p>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" color="white" @click="closeDialog" />
      </v-sheet>

      <v-card-text class="px-6 py-5">
        <v-form ref="formRef">
          <!-- 評估日期 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="primary-lighten-5" elevation="1" border>
            <v-text-field v-model="list.Date" type="date" label="評估日期" variant="outlined" density="comfortable"
              prepend-inner-icon="mdi-calendar" :rules="requiredDateRules" />
          </v-sheet>

          <!-- 問題項目 -->
          <div v-for="(item, index) in list.Questions" :key="index">
            <!-- 分類標題 -->
            <v-sheet v-if="index == 0 || index == 12 || index == 14" class="mt-6 mb-4 pa-3" rounded="lg"
              :color="getCategoryColor(index)" elevation="2">
              <div class="d-flex align-center">
                <v-icon :color="getCategoryIconColor(index)" size="24" class="mr-3">{{ getCategoryIcon(index)
                  }}</v-icon>
                <h2 class="text-h6 font-weight-bold mb-0">{{ getCategoryTitle(index) }}</h2>
              </div>
            </v-sheet>

            <!-- 問題項目卡片 -->
            <v-sheet class="mb-4 pa-4" rounded="lg" :color="getQuestionColor(item.QuestionType)" elevation="1" border>
              <!-- 問題標題和勾選 -->
              <div class="d-flex align-center mb-3">
                <v-checkbox v-model="item.checked" hide-details density="comfortable" color="primary"
                  class="mr-3"></v-checkbox>
                <div class="flex-grow-1" @click="item.checked = !item.checked" style="cursor: pointer;">
                  <v-text-field v-if="item.checked && index == 14" label="問題敘述" v-model="item.Question"
                    :rules="emptyRules" variant="outlined" density="comfortable" prepend-inner-icon="mdi-pencil"
                    @click.stop></v-text-field>
                  <div v-else class="d-flex align-center py-2">
                    <v-icon :color="getQuestionColor(item.QuestionType)" class="mr-2"
                      size="20">mdi-check-circle-outline</v-icon>
                    <span class="text-body-1 font-weight-medium">{{ item.Question }}</span>
                  </div>
                </div>
              </div>

              <!-- 摘要備註 -->
              <v-text-field class="mb-3" label="摘要備註" v-model="item.Answer" variant="outlined" density="comfortable"
                prepend-inner-icon="mdi-note-text" placeholder="請填寫問題摘要說明"></v-text-field>

              <!-- 展開的詳細內容 -->
              <v-expand-transition>
                <div v-if="item.checked">
                  <!-- 目標設定 -->
                  <v-sheet class="mb-4 pa-4" rounded="md" color="purple-lighten-5" elevation="0" border>
                    <div class="d-flex align-center mb-3">
                      <v-icon color="purple" class="mr-2">mdi-bullseye-arrow</v-icon>
                      <h3 class="text-subtitle-1 font-weight-bold">目標設定</h3>
                      <v-spacer></v-spacer>
                      <v-checkbox label="主要目標" v-model="item.IsMainTarget" hide-details density="comfortable"
                        color="purple"></v-checkbox>
                    </div>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field label="目標敘述" v-model="item.TargetStatement" :rules="emptyRules" variant="outlined"
                          density="comfortable" prepend-inner-icon="mdi-text"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field type="date" label="預計達成日期" v-model="item.EstimatedDate" :rules="emptyRules"
                          variant="outlined" density="comfortable"
                          prepend-inner-icon="mdi-calendar-clock"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field type="date" label="目標建立日期" v-model="item.TargetCreateDate" :rules="emptyRules"
                          variant="outlined" density="comfortable"
                          prepend-inner-icon="mdi-calendar-check"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-text-field class="mt-3" label="目標2 (針對目標敘述可進行微調或補充說明)" v-model="item.TargetStatement2"
                      variant="outlined" density="comfortable" prepend-inner-icon="mdi-text-box-outline"></v-text-field>
                  </v-sheet>

                  <!-- 措施內容 -->
                  <v-sheet class="mb-4 pa-4" rounded="md" color="blue-lighten-5" elevation="0" border>
                    <div class="d-flex align-center mb-3">
                      <v-icon color="blue" class="mr-2">mdi-clipboard-list</v-icon>
                      <h3 class="text-subtitle-1 font-weight-bold">措施內容</h3>
                      <v-spacer></v-spacer>
                      <v-btn size="small" color="blue" variant="tonal" prepend-icon="mdi-plus"
                        @click="item.MeasureContent.push({ content: '' })">新增措施</v-btn>
                    </div>
                    <div v-for="(Mitem, Mindex) in item.MeasureContent" :key="Mindex" class="mb-3">
                      <v-sheet class="pa-3" rounded="sm" color="white" elevation="0" border>
                        <v-row align="center">
                          <v-col cols="12" md="5">
                            <v-text-field :label="'措施 ' + (Mindex + 1)" v-model="Mitem.content" :rules="emptyRules"
                              variant="outlined" density="comfortable"
                              prepend-inner-icon="mdi-format-list-bulleted"></v-text-field>
                          </v-col>
                          <v-col cols="12" md="3">
                            <v-text-field type="date" label="措施建立日期" v-model="Mitem.MeasureCreateDate"
                              :rules="emptyRules" variant="outlined" density="comfortable"
                              prepend-inner-icon="mdi-calendar"></v-text-field>
                          </v-col>
                          <v-col cols="12" md="3" v-if="item.suggestItems">
                            <v-select :items="returnItems(item.suggestItems)" label="參考措施選擇" v-model="Mitem.content"
                              variant="outlined" density="comfortable" prepend-inner-icon="mdi-lightbulb-on"
                              @update:model-value="(val) => Mitem.content = val"></v-select>
                          </v-col>
                          <v-col cols="12" md="1" v-if="item.suggestItems" class="text-center">
                            <v-btn icon="mdi-close" color="error" variant="text" size="small"
                              @click="item.MeasureContent.splice(Mindex, 1)"></v-btn>
                          </v-col>
                          <v-col cols="12" md="1" v-else class="text-center">
                            <v-btn icon="mdi-close" color="error" variant="text" size="small"
                              @click="item.MeasureContent.splice(Mindex, 1)"></v-btn>
                          </v-col>
                        </v-row>
                      </v-sheet>
                    </div>
                  </v-sheet>

                  <!-- 評估記錄 -->
                  <v-sheet class="mb-4 pa-4" rounded="md" color="green-lighten-5" elevation="0" border>
                    <div class="d-flex align-center mb-3">
                      <v-icon color="green" class="mr-2">mdi-file-document-edit-outline</v-icon>
                      <h3 class="text-subtitle-1 font-weight-bold">評估記錄</h3>
                      <v-spacer></v-spacer>
                      <v-btn size="small" color="green" variant="tonal" prepend-icon="mdi-plus"
                        @click="item.EvaluationContent.push({ content: '', date: '', time: '' })">新增記錄</v-btn>
                    </div>
                    <div v-for="(Eitem, Eindex) in item.EvaluationContent" :key="Eindex" class="mb-3">
                      <v-sheet class="pa-3" rounded="sm" color="white" elevation="0" border>
                        <v-row align="center">
                          <v-col cols="12" md="4">
                            <v-text-field :label="'記錄 ' + (Eindex + 1)" v-model="Eitem.content" :rules="emptyRules"
                              variant="outlined" density="comfortable"
                              prepend-inner-icon="mdi-note-edit"></v-text-field>
                          </v-col>
                          <v-col cols="12" md="3">
                            <v-text-field type="date" label="記錄日期" v-model="Eitem.date" :rules="emptyRules"
                              variant="outlined" density="comfortable" prepend-inner-icon="mdi-calendar"></v-text-field>
                          </v-col>
                          <v-col cols="12" md="3">
                            <v-text-field type="time" label="記錄時間" v-model="Eitem.time" :rules="emptyRules"
                              variant="outlined" density="comfortable" prepend-inner-icon="mdi-clock"></v-text-field>
                          </v-col>
                          <v-col cols="12" md="2" class="text-center">
                            <v-btn icon="mdi-close" color="error" variant="text" size="small"
                              @click="item.EvaluationContent.splice(Eindex, 1)"></v-btn>
                          </v-col>
                        </v-row>
                      </v-sheet>
                    </div>
                  </v-sheet>
                </div>
              </v-expand-transition>
            </v-sheet>
          </div>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-6 py-4">
        <v-spacer />
        <v-btn variant="tonal" color="secondary" @click="closeDialog">
          取消
        </v-btn>
        <v-btn v-if="processType === 'add'" color="primary" variant="flat" :loading="loading" @click="handleAdd">
          確認新增
        </v-btn>
        <v-btn v-else color="primary" variant="flat" :loading="loading" @click="handleEdit">
          確認修改
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import FloatingPanel from '@/components/FloatingPanel.vue'

import { ref, reactive, computed, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const emit = defineEmits(['refresh', 'getAllData'])

const props = defineProps({
  useDataBase: {
    type: String,
    default: 'casesummaryplan',
  },
  items: {
    type: Array,
    default: () => [],
  },
})

const store = useStore()
const { proxy } = getCurrentInstance()

const dialog = ref(false)
const processType = ref('add')
const loading = ref(false)
const formRef = ref(null)
const list = reactive({
  Questions: []
})

const requiredDateRules = [(v) => !!v || '不可空白']
const emptyRules = [(v) => !!v || '不可空白']

const headerTitle = computed(() => (processType.value === 'add' ? '新增需求摘要&照護計畫' : '修改需求摘要&照護計畫'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民需求摘要並制定照護計畫，包含問題評估、目標設定、措施執行等。'
    : '更新既有評估紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const getQuestionColor = (questionType) => {
  if (questionType === '功能狀態') return 'blue-lighten-5'
  if (questionType === '心智狀態') return 'green-lighten-5'
  if (questionType === '其他') return 'orange-lighten-5'
  return 'grey-lighten-5'
}

const getCategoryColor = (index) => {
  if (index === 0) return 'blue-darken-1'
  if (index === 12) return 'green-darken-1'
  if (index === 14) return 'orange-darken-1'
  return 'grey-darken-1'
}

const getCategoryIconColor = (index) => {
  return 'white'
}

const getCategoryIcon = (index) => {
  if (index === 0) return 'mdi-cog'
  if (index === 12) return 'mdi-brain'
  if (index === 14) return 'mdi-dots-horizontal'
  return 'mdi-help-circle'
}

const getCategoryTitle = (index) => {
  if (index === 0) return '《功能狀態》問題項目'
  if (index === 12) return '《心智狀態》問題項目'
  if (index === 14) return '《其他狀態》問題項目'
  return ''
}

const returnItems = (key) => {
  //多重用藥
  if (key == 'Items0') {
    return [
      '確認個案不適症狀。',
      '轉介相關醫療機構調整個案用藥。',
      '衛教個案規則服藥之重要性，教導其了解藥物服用時間。',
      '指導照護者使用不同形式餵食，如磨粉餵食，或加入蜂蜜、糖等改變藥水味道，或使用製作果凍粉將藥粉融入餵食。',
      '提供藥盒予照護者，指導其規律予個案服用藥物。',
      '由居服員或照護者保管藥物，定時定量給藥。',
      '設計每日吃藥時間表，服藥前告知服藥時間及藥物，服藥完畢後，在日曆上打勾、簽名。'
    ]
  }

  //聽力不良
  if (key == 'Items2') {
    return [
      '指導照護者放慢語速、講話清晰，話語多重複幾次、搭配肢體語言。'
    ]
  }

  //溝通障礙
  if (key == 'Items3') {
    return [
      '轉介並與個案及照顧者說明社區服務據點的服務模式。',
      '安排個案參加據點課程或活動，增加其社交互動機會。',
      '請照護者安排個案漸進式參加據點活動，帶其外出。',
      '鼓勵個案到據點上課，並說明社交互動重要性。'
    ]
  }

  //排便問題
  if (key == 'Items4') {
    return [
      '指導照護者紀錄個案日常排尿時間及尿量，確認失禁類型、當前解尿狀況。',
      '指導照護者制定個案規律的如廁時間，每1小時或是1.5小時規律的帶個案如廁。',
      '衛教照護者睡前勿給予個案攝取過多液體及水分，減少夜尿情形。',
      '指導照護者使用尿壺等工具放置於房內。',
      '對個案執行凱格爾運動訓練。',
      '指導照護者空間規劃。如廁所處光線打亮、放置明顯的廁所標示(如圖片、顏色或於地面黏貼腳丫印地貼，引導個案如廁。)',
      '指導照護者於個案內褲裡放襯墊。',
      '個案失禁後將其帶離開團體活動，清潔後再回到團體，低調以維持其尊嚴。',
      '個案失禁後清潔和擦乾肛門周圍，以避免感染和促進舒適。',
      '將濕掉的部分弄出來給個案看，並讓個案聞到味道，使其願意更換。',
      '指導照護者紀錄個案日常進食及排便狀況，透過紀錄引導飲食攝取。',
      '指導照護者制定個案規律之如廁時間。',
      '衛教照護者增加水分或蔬果進食量，一天飲水量盡量達1000cc。如準備果凍類或稠狀食物增加水分攝取。',
      '指導照護者腹部按摩技巧，一天2-3次協助個案腹部按摩。',
      '指導個案及照護者，個案進食後不要立刻平躺。',
      '指導照護者，個案每隔3天未解便則可使用甘油球灌腸。',
      '觀察個案尿液顏色及尿量，評估是否有感染跡象。',
      '指導照護者會陰部沖洗。',
      '監測個案尿道感染的症狀及徵象。',
      '衛教每日攝取水份2000-3000cc',
      '衛教攝取相關飲食 (如蔓越莓果汁、vitc、洛神花茶等)，維持弱酸性尿。',
      '指導照護者擠壓尿管、保持暢通。',
      '衛教照護者需為個案提供隱密性環境。',
      '衛教照護者執行有利於排尿姿勢。',
      '鼓勵照顧者並給予正向支持，必要時學習照顧方法。',
      '提供衛教單張。',
      '指導照護者正確固定位置，避免拉扯、受壓或尿液逆流情形。',
      '指導照護者蓄尿袋應低於膀胱以防尿液逆流而感染。',
      '根據醫囑每30天更換尿管。',
      '每日執行尿管照護。',
      '執行膀胱灌洗並觀察尿管引流情形。',
      '執行會陰部清潔。',
      '執行並教導膀胱訓練。',
      '維持個案引流系統於無菌密閉狀態且通暢。'
    ]
  }

  //解尿問題
  if (key == 'Items5') {
    return [
      "指導照護者紀錄個案日常排尿時間及尿量，確認失禁類型、當前解尿狀況。",
      "指導照護者制定個案規律的如廁時間，每1小時或是1.5小時規律的帶個案如廁。",
      "衛教照護者睡前勿給予個案攝取過多液體及水分，減少夜尿情形。",
      "指導照護者使用尿壺等工具放置於房內。",
      "對個案執行凱格爾運動訓練。",
      "指導照護者空間規劃。如廁所處光線打亮、放置明顯的廁所標示(如圖片、顏色或於地面黏貼腳丫印地貼，引導個案如廁。)",
      "指導照護者於個案內褲裡放襯墊。",
      "個案失禁後將其帶離開團體活動，清潔後再回到團體，低調以維持其尊嚴。",
      "個案失禁後清潔和擦乾肛門周圍，以避免感染和促進舒適。",
      "將濕掉的部分弄出來給個案看，並讓個案聞到味道，使其願意更換。",
      "指導照護者紀錄個案日常進食及排便狀況，透過紀錄引導飲食攝取。",
      "指導照護者制定個案規律之如廁時間。",
      "衛教照護者增加水分或蔬果進食量，一天飲水量盡量達1000cc。如準備果凍類或稠狀食物增加水分攝取。",
      "指導照護者腹部按摩技巧，一天2-3次協助個案腹部按摩。",
      "指導個案及照護者，個案進食後不要立刻平躺。",
      "指導照護者，個案每隔3天未解便則可使用甘油球灌腸。",
      "觀察個案尿液顏色及尿量，評估是否有感染跡象。",
      "指導照護者會陰部沖洗。",
      "監測個案尿道感染的症狀及徵象。",
      "衛教每日攝取水份2000-3000cc",
      "衛教攝取相關飲食 (如蔓越莓果汁、vitc、洛神花茶等)，維持弱酸性尿。",
      "指導照護者擠壓尿管、保持暢通。",
      "衛教照護者需為個案提供隱密性環境。",
      "衛教照護者執行有利於排尿姿勢。",
      "鼓勵照顧者並給予正向支持，必要時學習照顧方法。",
      "提供衛教單張。",
      "指導照護者正確固定位置，避免拉扯、受壓或尿液逆流情形。",
      "指導照護者蓄尿袋應低於膀胱以防尿液逆流而感染。",
      "根據醫囑每30天更換尿管。",
      "每日執行尿管照護。",
      "執行膀胱灌洗並觀察尿管引流情形。",
      "執行會陰部清潔。",
      "執行並教導膀胱訓練。",
      "維持個案引流系統於無菌密閉狀態且通暢。"
    ]
  }

  //生活功能
  if (key == 'Items6') {
    return [
      '指導照護者提升個案的沐浴意願，利用誘因來幫助個案洗澡，比如食物或是個案喜歡穿的衣服等。',
      '指導照護者協助個案肢體活動，避免持續臥床及合併症發生。'
    ]
  }

  //跌倒問題
  if (key == 'Items7') {
    return [
      "居家空間評估，指導照護者增加住家無障礙設施。",
      "指導照護者於個案床旁增加扶手或欄杆，避免夜間起身跌倒。",
      "指導照護者於寢室增加小夜燈，避免夜間起身跌倒。。",
      "指導照護者調整室內光線照明，保持光線的明亮。",
      "指導照護者浴室及廁所地面隨時保持乾燥或加鋪止滑墊。",
      "衛教照護者應避免更動傢俱擺設的位置，並經常保持走道通暢。",
      "衛教個案規律的運動以加強肌肉力量、骨骼關節的活動度和心肺功能。",
      "衛教個案下床或從椅子起身的速度宜放慢，可先坐在床邊，無不適再下床行走。",
      "衛教高風險個案其處於高危險跌倒情形，需有親友或居服人員陪伴方可下床活動。",
      "衛教個案及照護者，個案應著適當衣物、鞋子，勿過大過長、以免跌倒。",
      "衛教個案及照護者輔具使用(如：便盆椅、手杖、輪椅等)。",
      "安排個案參與復建，透過教導並加強步態平衡及肌力的訓練，定時評估四肢肌力及活動度。",
      "注意遊走路線有無障礙物，應減少不必要的家具及地板雜物，讓動線變寬敞。",
      "指導照護者注意個案遊走時之情況，是否係因生理需求(如需如廁、肚子餓或不適)。",
      "對照護者、個案進行防跌衛教。",
      "衛教照護者若確認個案安全，可不必加以干涉或糾正。",
      "評估個案當前活動情形及體力。",
      "指導照護者為個案安排日常活動，設計日常作息規劃表。",
      "對個案及照護者進行預防跌倒衛教。",
      "請照護者紀錄個案日常活動狀況，依據日常情形設計並執行個案活動規劃。",
      "指導個案進行關節、肌力運動方式。",
      "衛教照護者協助個案一天2-3次每次20-30分鐘，執行被動關節運動及肌力訓練。",
      "指導照護者移位技巧。",
      "指導照護者翻身擺位方式。",
      "指導照護者進行個案被動及主動運動方式。",
      "請照護者紀錄個案日常狀況並進行評估。",
      "評估個案居家活動安全，建議照護者家中加裝輔具、預防跌倒。",
      "建立個案日常運動常規以維持肌耐力。",
      "衛教個案透過運動增加下肢肌力、跌倒預防。",
      "指導照護者檢視環境安全，如家中樓梯黏貼防滑條及扶把。",
      "指導照護者依個案狀況增加運動頻率及次數。"
    ]
  }

  //營養問題
  if (key == 'Items8') {
    return [
      "指導照護者採少量多餐及安撫轉移技巧，減少個案重複進食。",
      "指導照護者為個案準備少量點心，以滿足其進食要求。",
      "指導照護者紀錄個案日常狀況，衛教血糖控制的重要，建議冰箱中避免含糖份的食物和飲料。",
      "指導照護者採少量多餐予個案進食。",
      "指導照護者採少量多餐予個案進食，或增加配方奶維持營養。",
      "指導照護者多鼓勵與安撫個案，並準備其喜好食物。",
      "指導照護者，個案餵食之技巧。",
      "指導照護者準備一些食物置於個案常經過之處，讓個案看到時可拿起來吃，並說明居家活動安全的注意事項。",
      "了解個案發生進食障礙之原因。",
      "每日評估個案熱量，計算個案所需營養。",
      "指導照護者選擇適合個案的食物及烹煮方法。",
      "執行口腔訓練，大聲講ㄚ~ㄧ~ㄛ~ㄨ訓練口腔肌肉群，指導及衛教照護者每天至少兩次，每次10下。",
      "指導照護者個案過久不吞時，提供個案喜歡的果汁、湯、飲品，增加其吞嚥的動機。",
      "確認個案嗆咳之食物及發生情形。",
      "指導照護者餵食技巧及口腔清潔技巧。",
      "指導照護者使用果凍補充水分，並示範製作果凍增加飲水量。",
      "執行個案雙臉頰按摩，並衛教照護者其技巧。",
      "指導照護者紀錄個案血糖日常狀況，並提供相關衛教。",
      "衛教照護者說明飲食控制方法，規律飲食及藥物，減少澱粉及糖分的攝取量。",
      "衛教照護者低升醣指數之飲食予照護者。",
      "衛教照護者及各案，每日水分攝取量應於1500 CC以上。",
      "請個案進行每週至少三次、每次20~30分鐘的運動，以達到微出汗但不覺得疲累為原則。",
    ]
  }

  //壓傷風險
  if (key == 'Items9') {
    return [
      "了解造成壓瘡的原因、評估目前傷口。",
      "評估傷口狀況，若惡化須隨時至醫院就醫。",
      "指導照護者每1到2小時協助個案變更姿勢，避免同一部位長時間持續受到壓迫。",
      "指導照護者若個案久坐，每15到20分鐘應抬高臀部一次，每次抬高5到10秒以上。",
      "衛教照護者保持皮膚乾爽及清潔，定期清洗個案衣物或床單。",
      "定期換藥及指導照護者傷口照顧技巧。",
      "指導照護者透過與個案說話轉移注意力，邊說話邊塗乳液。",
    ]
  }

  //疼痛問題
  if (key == 'Items10') {
    return [
      '給予個案疼痛評估及緩解疼痛的照護措施。'
    ]
  }

  //認知障礙
  if (key == 'Items12') {
    return [
      "衛教照護者放置熟悉物品如收音機，勿更動常用物品位置。",
      "衛教照護者使用窗簾，增加個案白天及夜間的感官刺激。",
      "指導照護者紀錄個案日常狀況，依據每日紀錄調整照護方式。",
      "衛教照護者使個案增加社會接觸，如聊天問答或是外出變換環境，讓其感受周遭環境。",
      "衛教照護者將原個案常使用之風險性物品收起(如刀具等)或新增安全防護。",
      "指導照護者刺激個案認知功能，如陪伴聊天、看新聞，或使用日曆告訴個案日期及說明天氣。",
      "衛教照護者引導個案進行日常活動，勿取代其原本可執行能力、維持個案功能。",
      "執行認知照護及功能刺激，增加個案現實感。",
      "執行照護時，叫喚個案的稱謂、並告知預執行的活動及程序。",
      "運用簡單遊戲如手握復健球，訓練個案手部協調功能。",
      "衛教照護者將室內燈光調亮，減少個案的不安及錯亂現象。",
      "指導照護者暫時先離開現場，待5至10分鐘再返回並叫換個案稱謂。",
      "指導照護者不與其爭辯，依個案喜好轉移注意力，如愛喝附近飲料店的紅茶，可陪伴外出購買再回家。",
      "衛教照護者多用正向鼓勵的言語與個案對話，勿用考試的方式。",
      "指導照護者放慢語速、講話清晰，話語多重複幾次、搭配肢體語言。",
      "瞭解個案生活模式及照護者的居家照顧方式。",
      "評估並建議是否就醫使用精神相關藥物。",
      "衛教照護者居家精神行為照顧方法。",
      "指導照護者安撫個案情緒，轉移注意力。",
      "指導照護者確認個案安全性，安撫其情緒並協助返家。",
      "協助照護者申請防走失手鍊。",
      "了解個案走失發生原因。",
      "提供照護者防走失相關措施，如申請失智手鍊、走失辨識布標以及指紋奈印。",
      "指導照護者於個案起床、用餐等固定時間，提醒個案當下時間，增加時間定向感。",
      "指導照護者於個案常待區域放置大時鐘，以利查看現在時間。",
      "協助照護者規劃個案白天活動，安排規律作息。",
      "衛教照護者利用戶外光線，增加個案感官刺激。",
      "評估並建議是否就醫使用睡眠相關藥物。",
      "衛教照護者安排個案白天活動，調整其日夜作息。",
      "指導照護者讓個案多曬太陽，增加退黑激素、以減少日夜顛倒問題。",
      "指導照護者夜晚維持燈光昏暗，夜眠時幫個案戴上眼罩及耳塞。",
      "指導照護者提升個案自我自信心，給予正向鼓勵。",
      "指導照護者增加個案社交互動機會。",
      "協助個案進行記憶力練習。",
      "衛教照護者維持個案熟悉、穩定的生活環境，勿進行大幅變化。",
      "指導照護者不與其爭辯，可順其話題、帶其外出或從事其他活動，轉移注意力。",
      "衛教照護者給予個案安全隱私照護，於行為發生時暫時迴避、或請個案離開，使個案抒發情緒及性慾。",
    ]
  }

  //憂鬱問題
  if (key == 'Items13') {
    return [
      "評估個案情緒變化是否影響食慾及睡眠，指導照護者觀察三餐進食量，記錄睡眠時數及夜眠品質。",
      "評估個案情緒變化，適時阻斷負向思考，並教導適當的因應技巧，採正向方式宣洩情緒。",
      "衛教照護者使用懷舊治療如討論過去的活動、事件與經驗，運用原本熟悉技能如烹飪，增進自信心及訓練認知功能",
      "衛教照護者加強個案目前保有的功能，避免逐漸退化，鼓勵執行簡單家務，給予肯定及支持。",
      "衛教照護者面對個案不正面對質及衝突也不直接批評及當面指責， 減少個案不安與害怕並給予心理支持。",
      "衛教照護者視個案的情況，耐心、簡要的重覆說明行為順序及步驟，語調清晰且觀察溝通效果。",
      "引導個案表達情緒及心理問題。",
      "鼓勵個案表達與同住的家人之互動過程，適時引導個案察覺與家人互動正向之處。",
      "鼓勵個案增加與人群互動情形。",
      "衛教照護者安撫情緒，不與其爭辯。",
      "衛教照護者確定個案安全下，可暫時先離開現場。",
      "指導照護者瞭解情緒觸發原因，依據原因轉移注意力。",
      "鼓勵個案維持適當的社交活動，建立日常生活常規",
      "衛教照護者多陪伴以減少不安與焦慮。",
      "引導個案表達感受並予以情緒支持。",
      "引導個案分享生命歷程。",
      "安排固定人員照護，採友善與尊重的態度，主動自我介紹，以取得信任。",
    ]
  }

  return []
}

const defaultQuestions = [
  { QuestionType: "功能狀態", Question: "多重用藥", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false, suggestItems: 'Items0' },
  { QuestionType: "功能狀態", Question: "視力不良", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false },
  { QuestionType: "功能狀態", Question: "聽力不良", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false, suggestItems: 'Items2' },
  { QuestionType: "功能狀態", Question: "溝通障礙", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false, suggestItems: 'Items3' },
  { QuestionType: "功能狀態", Question: "排便問題", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false, suggestItems: 'Items4' },
  { QuestionType: "功能狀態", Question: "解尿問題", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false, suggestItems: 'Items5' },
  { QuestionType: "功能狀態", Question: "生活功能", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false, suggestItems: 'Items6' },
  { QuestionType: "功能狀態", Question: "跌倒問題", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false, suggestItems: 'Items7' },
  { QuestionType: "功能狀態", Question: "營養問題", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false, suggestItems: 'Items8' },
  { QuestionType: "功能狀態", Question: "壓傷風險", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false, suggestItems: 'Items9' },
  { QuestionType: "功能狀態", Question: "疼痛問題", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false, suggestItems: 'Items10' },
  { QuestionType: "功能狀態", Question: "衰弱問題", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false },
  { QuestionType: "心智狀態", Question: "認知障礙", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false, suggestItems: 'Items12' },
  { QuestionType: "心智狀態", Question: "憂鬱問題", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false, suggestItems: 'Items13' },
  { QuestionType: "其他", Question: "其他", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false },
]

const openForAdd = () => {
  processType.value = 'add'
  Object.keys(list).forEach(key => delete list[key])
  list.Questions = JSON.parse(JSON.stringify(defaultQuestions))

  if (props.items && props.items.length > 0) {
    const firstItem = JSON.parse(JSON.stringify(props.items[0]))
    //2024.6.13 加入 其他
    let match = firstItem.Questions?.filter(i => i.QuestionType == '其他') || []
    if (match.length == 0 && firstItem.Questions) {
      firstItem.Questions.push(
        { QuestionType: "其他", Question: "其他", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false }
      )
    }

    delete firstItem.snkey
    delete firstItem.user_snkey
    delete firstItem.createInfo
    delete firstItem.create_man
    delete firstItem.create_man_snkey
    delete firstItem.editInfo
    delete firstItem.edit_man
    delete firstItem.uploadData
    delete firstItem.uploadState
    Object.assign(list, firstItem)
  }

  dialog.value = true
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const openForEdit = (item) => {
  dialog.value = true
  processType.value = 'edit'
  Object.keys(list).forEach(key => delete list[key])
  const itemCopy = JSON.parse(JSON.stringify(item))
  
  //2024.6.13 加入 其他
  let match = itemCopy.Questions?.filter(i => i.QuestionType == '其他') || []
  if (match.length == 0 && itemCopy.Questions) {
    itemCopy.Questions.push(
      { QuestionType: "其他", Question: "其他問題", MeasureContent: [{ "content": "" }], EvaluationContent: [{ "content": "", date: "", time: "" }], checked: false }
    )
  }
  
  Object.assign(list, itemCopy)
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const closeDialog = () => {
  dialog.value = false
  loading.value = false
}

const handleAdd = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完全!!請重新確認!!',
      closeTime: 3,
    })
    return
  }

  loading.value = true
  list.user_snkey = store.state.uData.snkey
  list.createInfo = {
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }

  try {
    const postData = {
      datalist: JSON.stringify(list),
    }
    const response = await api.add(props.useDataBase, postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已新增',
        closeTime: 2,
      })
      dialog.value = false
      emit('refresh')
      emit('getAllData')
    } else {
      store.showToastMulti({
        type: 'error',
        message: '新增失敗，請稍後再試',
        closeTime: 3,
      })
    }
  } catch (error) {
    console.error('Add error:', error)
    store.showToastMulti({
      type: 'error',
      message: '新增失敗，請稍後再試',
      closeTime: 3,
    })
  } finally {
    loading.value = false
  }
}

const handleEdit = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完全!!請重新確認!!',
      closeTime: 3,
    })
    return
  }

  loading.value = true

  if (!list.editInfo) {
    list.editInfo = []
  }
  list.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })

  try {
    const postData = {
      snkey: list.snkey,
      datalist: JSON.stringify(list),
    }
    const response = await api.post(props.useDataBase, postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已修改',
        closeTime: 2,
      })
      dialog.value = false
      emit('refresh')
      emit('getAllData')
    } else {
      store.showToastMulti({
        type: 'error',
        message: '修改失敗，請稍後再試',
        closeTime: 3,
      })
    }
  } catch (error) {
    console.error('Edit error:', error)
    store.showToastMulti({
      type: 'error',
      message: '修改失敗，請稍後再試',
      closeTime: 3,
    })
  } finally {
    loading.value = false
  }
}

defineExpose({
  openForAdd,
  openForEdit,
})
</script>
