<template>
  <v-dialog v-model="dialog" persistent max-width="1200">
    <v-card rounded="xl" class="sociopsychological-add">
      <v-sheet
        class="sociopsychological-add__header px-6 py-4"
        :color="headerColor"
        rounded="t-xl"
      >
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="48" :color="headerColor" class="mr-4">
              <v-icon color="white" size="26">mdi-account-group</v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h6 font-weight-bold mb-1">{{ headerTitle }}</h2>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ headerSubtitle }}
              </p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
        </div>
      </v-sheet>

      <v-divider />

      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="formValid">
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field type="date" label="評估日期" v-model="list.date" :rules="emptyRules" variant="outlined"
                    density="comfortable"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="sociopsychological-add-alert-left-border">
                    <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                      <h2>1.意識狀態：</h2>
                    </v-sheet>
                    <v-select v-model="list.stateConsciousness" :items="stateConsciousnessOptions" label="意識狀態" multiple
                      chips closable-chips class="ml-3 mt-3" variant="outlined" density="comfortable"></v-select>
                    <v-text-field class="ml-3 mt-2" label="其他內容" v-model="list.stateConsciousnessOther"
                      v-if="list.stateConsciousness && list.stateConsciousness.includes('其他')" variant="outlined"
                      density="comfortable"></v-text-field>
                  </v-alert>
                </v-col>

                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="sociopsychological-add-alert-left-border">
                    <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                      <h2>2.精神狀態：</h2>
                    </v-sheet>
                    <v-select v-model="list.mentalState" :items="mentalStateOptions" label="精神狀態" multiple chips
                      closable-chips class="ml-3 mt-3" variant="outlined" density="comfortable"></v-select>
                    <v-text-field class="ml-3 mt-2" label="其他內容" v-model="list.mentalStateOther"
                      v-if="list.mentalState && list.mentalState.includes('其他')" variant="outlined"
                      density="comfortable"></v-text-field>
                  </v-alert>
                </v-col>

                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="sociopsychological-add-alert-left-border">
                    <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                      <h2>3.社會需求評估：</h2>
                    </v-sheet>
                    <v-select v-model="list.socialNeedsAssessment" :items="socialNeedsAssessmentOptions" label="社會需求評估"
                      multiple chips closable-chips class="ml-3 mt-3" variant="outlined"
                      density="comfortable"></v-select>
                    <v-text-field class="ml-3 mt-2" label="其他內容" v-model="list.socialNeedsAssessmentOther"
                      v-if="list.socialNeedsAssessment && list.socialNeedsAssessment.includes('其他')" variant="outlined"
                      density="comfortable"></v-text-field>
                  </v-alert>
                </v-col>

                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="sociopsychological-add-alert-left-border">
                    <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                      <h2>4.人際關係狀況：</h2>
                    </v-sheet>
                    <v-select v-model="list.interpersonalRelationship" :items="interpersonalRelationshipOptions"
                      label="人際關係狀況" multiple chips closable-chips class="ml-3 mt-3" variant="outlined"
                      density="comfortable"></v-select>
                    <v-text-field class="ml-3 mt-2" label="其他內容" v-model="list.interpersonalRelationshipOther"
                      v-if="list.interpersonalRelationship && list.interpersonalRelationship.includes('其他')"
                      variant="outlined" density="comfortable"></v-text-field>
                  </v-alert>
                </v-col>

                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="sociopsychological-add-alert-left-border">
                    <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                      <h2>5.情緒狀況：</h2>
                    </v-sheet>
                    <v-select v-model="list.emotionalState" :items="emotionalStateOptions" label="情緒狀況" multiple chips
                      closable-chips class="ml-3 mt-3" variant="outlined" density="comfortable"></v-select>
                    <v-text-field class="ml-3 mt-2" label="其他內容" v-model="list.emotionalStateOther"
                      v-if="list.emotionalState && list.emotionalState.includes('其他')" variant="outlined"
                      density="comfortable"></v-text-field>
                  </v-alert>
                </v-col>

                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="sociopsychological-add-alert-left-border">
                    <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                      <h2>6.心理評估：</h2>
                    </v-sheet>
                    <v-select v-model="list.psychologicalAssessment" :items="psychologicalAssessmentOptions"
                      label="心理評估" multiple chips closable-chips class="ml-3 mt-3" variant="outlined"
                      density="comfortable"></v-select>
                    <v-text-field class="ml-3 mt-2" label="其他內容" v-model="list.psychologicalAssessmentOther"
                      v-if="list.psychologicalAssessment && list.psychologicalAssessment.includes('其他')"
                      variant="outlined" density="comfortable"></v-text-field>
                  </v-alert>
                </v-col>

                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="sociopsychological-add-alert-left-border">
                    <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                      <h2>7.主要溝通方式：</h2>
                    </v-sheet>
                    <v-select v-model="list.mainCommunicationMethods" :items="mainCommunicationMethodsOptions"
                      label="主要溝通方式" multiple chips closable-chips class="ml-3 mt-3" variant="outlined"
                      density="comfortable"></v-select>
                    <v-text-field class="ml-3 mt-2" label="其他內容" v-model="list.mainCommunicationMethodsOther"
                      v-if="list.mainCommunicationMethods && list.mainCommunicationMethods.includes('其他')"
                      variant="outlined" density="comfortable"></v-text-field>
                  </v-alert>
                </v-col>

                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="sociopsychological-add-alert-left-border">
                    <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                      <h2>8.溝通效果：</h2>
                    </v-sheet>
                    <v-select v-model="list.communicationEffect" :items="communicationEffectOptions" label="溝通效果"
                      multiple chips closable-chips class="ml-3 mt-3" variant="outlined"
                      density="comfortable"></v-select>
                    <v-text-field class="ml-3 mt-2" label="其他內容" v-model="list.communicationEffectOther"
                      v-if="list.communicationEffect && list.communicationEffect.includes('其他')" variant="outlined"
                      density="comfortable"></v-text-field>
                  </v-alert>
                </v-col>

                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="sociopsychological-add-alert-left-border">
                    <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                      <h2>9.語言理解情形：</h2>
                    </v-sheet>
                    <v-select v-model="list.languageComprehension" :items="languageComprehensionOptions" label="語言理解情形"
                      multiple chips closable-chips class="ml-3 mt-3" variant="outlined"
                      density="comfortable"></v-select>
                    <v-text-field class="ml-3 mt-2" label="其他內容" v-model="list.languageComprehensionOther"
                      v-if="list.languageComprehension && list.languageComprehension.includes('其他')" variant="outlined"
                      density="comfortable"></v-text-field>
                  </v-alert>
                </v-col>

                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="sociopsychological-add-alert-left-border">
                    <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                      <h2>10.語言表達情形：</h2>
                    </v-sheet>
                    <v-select v-model="list.languageExpression" :items="languageExpressionOptions" label="語言表達情形"
                      multiple chips closable-chips class="ml-3 mt-3" variant="outlined"
                      density="comfortable"></v-select>
                    <v-text-field class="ml-3 mt-2" label="其他內容" v-model="list.languageExpressionOther"
                      v-if="list.languageExpression && list.languageExpression.includes('其他')" variant="outlined"
                      density="comfortable"></v-text-field>
                  </v-alert>
                </v-col>

                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="sociopsychological-add-alert-left-border">
                    <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                      <h2>11.其他行為問題：(可複選)</h2>
                    </v-sheet>
                    <v-select v-model="list.otherBehavior" :items="otherBehaviorOptions" label="其他行為問題" multiple chips
                      closable-chips class="ml-3 mt-3" variant="outlined" density="comfortable"></v-select>
                    <v-text-field class="ml-3 mt-2" label="其他內容" v-model="list.otherBehaviorOther"
                      v-if="list.otherBehavior && list.otherBehavior.includes('其他')" variant="outlined"
                      density="comfortable"></v-text-field>
                  </v-alert>
                </v-col>

                <v-col cols="12">
                  <v-alert color="success" variant="outlined" class="sociopsychological-add-alert-left-border-success">
                    <v-sheet color="success dark-1" class="pa-2 white--text" elevation="4">
                      <h2>綜合評估及建議：</h2>
                    </v-sheet>
                    <v-textarea class="ml-3" label="其他內容" v-model="list.comprehensiveAssessmentRecommendations"
                      variant="outlined" density="comfortable"></v-textarea>
                  </v-alert>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="flat" @click="addOK" v-if="process == 'add'" :loading="loading"
          :disabled="loading">確認新增</v-btn>
        <v-btn color="success" variant="flat" @click="editOK" v-if="process == 'edit'" :loading="loading"
          :disabled="loading">確認修改</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, ref } from 'vue'
import dayjs from 'dayjs'

import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const store = useStore()
const { proxy } = getCurrentInstance()

const emit = defineEmits(['refresh'])

const dialog = ref(false)
const formRef = ref(null)
const formValid = ref(false)
const loading = ref(false)
const process = ref('')
const list = ref()

const emptyRules = [(v) => !!v || '不可空白']

// 選項列表
const stateConsciousnessOptions = ref(['清楚', '不清楚', '對刺激有反應', '無法評估', '其他'])

const mentalStateOptions = ref(['佳', '普通', '不佳', '無法評估', '其他'])

const socialNeedsAssessmentOptions = ref([
  '拒絕被服務',
  '發脾氣',
  '沉默不語',
  '想家及思念家人',
  '拒絕飲食',
  '主動交友',
  '無法評估',
  '其他',
])

const interpersonalRelationshipOptions = ref([
  '主動與人互動',
  '被動式互動',
  '不喜愛與人互動',
  '經常與人衝突',
  '疏離',
  '退縮',
  '拒絕',
  '無法評估',
  '其他',
])

const emotionalStateOptions = ref([
  '情緒正常',
  '情緒低落',
  '經常哭泣',
  '容易恐懼',
  '經常焦慮不安',
  '情緒不穩定',
  '脾氣暴怒',
  '容易衝動',
  '容易興奮',
  '淡漠',
  '無法評估',
  '其他',
])

const psychologicalAssessmentOptions = ref([
  '害怕/恐懼',
  '哭泣/難過',
  '緊張/焦慮',
  '躁動',
  '絕望/憂鬱',
  '被遺棄感',
  '感到憤怒',
  '孤獨/無助',
  '興奮/高昂',
  '友善',
  '無法評估',
  '其他',
])

const mainCommunicationMethodsOptions = ref([
  '口語',
  '手語',
  '筆談',
  '聲音',
  '表情',
  '疏離',
  '退縮',
  '拒絕',
  '手勢動作',
  '無法評估',
  '其他',
])

const communicationEffectOptions = ref([
  '能完全理解他說的話',
  '能部份理解他說的話',
  '完全無法理解他說的話',
  '其他',
])

const languageComprehensionOptions = ref([
  '完全聽得懂別人說的話',
  '聽得懂語句但無法理解抽象內容',
  '只聽的懂日常生活詞彙',
  '大部分的話要加上手勢或動作後才能瞭解',
  '完全聽不懂別人說的話',
  '無法評估',
  '其他',
])

const languageExpressionOptions = ref([
  '沒問題',
  '口吃或說話費力',
  '聲音沙啞',
  '只會仿說',
  '發音不清楚',
  '只會用簡單的句子表達',
  '只會用詞彙或單字表達',
  '無法評估',
  '其他',
])

const otherBehaviorOptions = ref(['沒問題', '過動', '離座遊走', '自言自語', '無法評估', '其他'])

const headerTitle = computed(() => {
  return process.value === 'add' ? '新增社會心理評估' : '修改社會心理評估'
})

const headerSubtitle = computed(() =>
  process.value === 'add'
    ? '評估住民意識狀態、精神狀態、社會需求與人際關係等。'
    : '更新社會心理評估，追蹤住民心理社會狀況變化。'
)

const headerColor = computed(() => (process.value === 'add' ? 'primary' : 'success'))

const resetForm = () => {
  list.value = {
    date: '',
    stateConsciousness: [],
    stateConsciousnessOther: '',
    mentalState: [],
    mentalStateOther: '',
    socialNeedsAssessment: [],
    socialNeedsAssessmentOther: '',
    interpersonalRelationship: [],
    interpersonalRelationshipOther: '',
    emotionalState: [],
    emotionalStateOther: '',
    psychologicalAssessment: [],
    psychologicalAssessmentOther: '',
    mainCommunicationMethods: [],
    mainCommunicationMethodsOther: '',
    communicationEffect: [],
    communicationEffectOther: '',
    languageComprehension: [],
    languageComprehensionOther: '',
    languageExpression: [],
    languageExpressionOther: '',
    otherBehavior: [],
    otherBehaviorOther: '',
    comprehensiveAssessmentRecommendations: '',
  }
  formRef.value?.resetValidation()
}

const openForAdd = () => {
  process.value = 'add'
  resetForm()
  dialog.value = true
}

const openForEdit = (item) => {
  process.value = 'edit'
  
  // 確保所有陣列欄位都是陣列
  list.value = JSON.parse(JSON.stringify(item))
  
  formRef.value?.resetValidation()
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  resetForm()
}

const addOK = async () => {
  await nextTick()
  
  if (!formRef.value) {
    store.showToastMulti({
      type: 'warning',
      message: '表單尚未初始化',
      closeTime: 5,
    })
    return
  }

  let valid = false
  try {
    const result = await formRef.value.validate()
    valid = result.valid !== false
  } catch (error) {
    console.error('表單驗證錯誤:', error)
    valid = false
  }

  if (!valid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完全!!請重新確認!!',
      closeTime: 5,
    })
    return
  }

  try {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const addData = {
      datalist: JSON.stringify({
        ...list.value,
        u_snkey: store.state.uData.snkey,
        createInfo: {
          snkey: store.state.pData.snkey,
          name: store.state.pData.username,
          time: now,
        },
        editInfo: [],
      }),
    }

    loading.value = true
    const rs = await api.add('sociopsychological', addData)

    if (rs && rs.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已新增',
        closeTime: 3,
      })
      resetForm()
      dialog.value = false
      emit('refresh')
    } else {
      store.showToastMulti({
        type: 'error',
        message: '新增失敗',
        closeTime: 5,
      })
    }
  } catch (error) {
    console.error('新增資料失敗:', error)
    store.showToastMulti({
      type: 'error',
      message: '新增資料失敗',
      closeTime: 5,
    })
  } finally {
    loading.value = false
  }
}

const editOK = async () => {
  await nextTick()
  
  if (!formRef.value) {
    store.showToastMulti({
      type: 'warning',
      message: '表單尚未初始化',
      closeTime: 5,
    })
    return
  }

  let valid = false
  try {
    const result = await formRef.value.validate()
    valid = result.valid !== false
  } catch (error) {
    console.error('表單驗證錯誤:', error)
    valid = false
  }

  if (!valid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完全!!請重新確認!!',
      closeTime: 5,
    })
    return
  }

  try {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const currentData = { ...list.value }
    
    if (!Array.isArray(currentData.editInfo)) {
      currentData.editInfo = []
    }
    
    currentData.editInfo.unshift({
      snkey: store.state.pData.snkey,
      name: store.state.pData.username,
      time: now,
    })

    const postData = {
      snkey: list.value.snkey,
      datalist: JSON.stringify(currentData),
    }

    loading.value = true
    const rs = await api.post('sociopsychological', postData)

    if (rs && rs.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已修改',
        closeTime: 3,
      })
      dialog.value = false
      emit('refresh')
    } else {
      store.showToastMulti({
        type: 'error',
        message: '修改失敗',
        closeTime: 5,
      })
    }
  } catch (error) {
    console.error('修改資料失敗:', error)
    store.showToastMulti({
      type: 'error',
      message: '修改資料失敗',
      closeTime: 5,
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

<style scoped lang="scss">
.sociopsychological-add {
  &__header {
    background-image: linear-gradient(135deg, rgba(33, 150, 243, 0.12), rgba(33, 150, 243, 0.04));
  }
}

.sociopsychological-add-alert-left-border {
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
}

.sociopsychological-add-alert-left-border-success {
  border-left: 4px solid rgb(var(--v-theme-success)) !important;
}
</style>
