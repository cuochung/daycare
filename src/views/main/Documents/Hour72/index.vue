<template>
  <div class="hour72">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <v-sheet class="hour72__hero" rounded="xl" elevation="0">
            <div class="d-flex flex-column flex-md-row justify-space-between align-start">
              <div class="d-flex align-center mb-4 mb-md-0">
                <v-avatar size="56" color="primary" variant="tonal" class="mr-4">
                  <v-icon color="primary" size="32">mdi-clock-time-four</v-icon>
                </v-avatar>
                <div>
                  <h2 class="hour72__title mb-1">72小時適應評估紀錄表</h2>
                  <p class="hour72__subtitle mb-0">
                    評估住民入住後72小時內的適應狀況，包含生理、心理、社會及認知功能等面向。
                  </p>
                </div>
              </div>

              <div class="d-flex align-center ga-2">
                <v-btn v-if="!newData" color="tertiary" ariant="flat" prepend-icon="mdi-printer" @click="print">
                  列印
                </v-btn>
                <v-btn color="primary" variant="flat" prepend-icon="mdi-content-save" @click="editOK">
                  確認儲存
                </v-btn>
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="hour72__meta d-flex flex-wrap ga-3">
              <v-chip variant="tonal" color="primary">
                住民：{{ residentName }}
              </v-chip>
              <v-chip variant="tonal" color="secondary">
                住編：{{ residentCode }}
              </v-chip>
            </div>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <v-form ref="form">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field type="date" label="評估日期" v-model="list.date" :rules="emptyRules"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-alert color="primary" variant="outlined" class="hour72-alert-left-border">
                      <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                        <h2>生理現況需求</h2>
                      </v-sheet>
                      <v-select v-model="list.physiologicalNeeds" :items="physiologicalNeedsOptions" label="生理現況需求"
                        multiple chips closable-chips class="ml-3 mt-3"></v-select>
                    </v-alert>
                  </v-col>

                  <v-col cols="12">
                    <v-alert color="primary" variant="outlined" class="hour72-alert-left-border">
                      <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                        <h2>心理評估</h2>
                      </v-sheet>
                      <v-select v-model="list.psychologicalAssessments" :items="psychologicalAssessmentsOptions"
                        label="心理評估" multiple chips closable-chips class="ml-3 mt-3"></v-select>
                      <v-text-field v-if="list.psychologicalAssessments && list.psychologicalAssessments.includes('其他')"
                        class="ml-3 mt-2" label="其他內容" v-model="list.psychologicalAssessmentOther"></v-text-field>
                    </v-alert>
                  </v-col>

                  <v-col cols="12">
                    <v-alert color="primary" variant="outlined" class="hour72-alert-left-border">
                      <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                        <h2>社會需求評估</h2>
                      </v-sheet>
                      <v-select v-model="list.socialNeedsAssessments" :items="socialNeedsAssessmentsOptions"
                        label="社會需求評估" multiple chips closable-chips class="ml-3 mt-3"></v-select>
                      <v-text-field v-if="list.socialNeedsAssessments && list.socialNeedsAssessments.includes('其他')"
                        class="ml-3 mt-2" label="其他內容" v-model="list.socialNeedsAssessmentOther"></v-text-field>
                    </v-alert>
                  </v-col>

                  <v-col cols="12">
                    <v-alert color="primary" variant="outlined" class="hour72-alert-left-border">
                      <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                        <h2>認知功能評估</h2>
                      </v-sheet>
                      <v-select v-model="list.cognitiveFunctionAssessments" :items="cognitiveFunctionAssessmentsOptions"
                        label="認知功能評估" multiple chips closable-chips class="ml-3 mt-3"></v-select>
                      <v-text-field
                        v-if="list.cognitiveFunctionAssessments && list.cognitiveFunctionAssessments.includes('其他')"
                        class="ml-3 mt-2" label="其他內容" v-model="list.cognitiveFunctionAssessmentOther"></v-text-field>
                    </v-alert>
                  </v-col>

                  <v-col cols="12">
                    <v-alert color="success" variant="outlined" class="hour72-alert-left-border-success">
                      <v-sheet color="success dark-1" class="pa-2 white--text" elevation="4">
                        <h2>社工處遇計畫</h2>
                      </v-sheet>
                      <v-select v-model="list.encounterPlans" :items="encounterPlansOptions" label="社工處遇計畫" multiple
                        chips closable-chips class="ml-3 mt-3"></v-select>
                      <v-text-field v-if="list.encounterPlans && list.encounterPlans.includes('其他')" class="ml-3 mt-2"
                        label="其他內容" v-model="list.encounterPlanOther"></v-text-field>
                    </v-alert>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, computed } from 'vue'
import { getCurrentInstance } from 'vue'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'
import dayjs from 'dayjs'

const store = useStore()
const { proxy } = getCurrentInstance()

const form = ref(null)
const hasUser = computed(() => Boolean(store.state?.uData?.snkey))
const residentName = computed(() => store.state?.uData?.name ?? '未選擇住民')
const residentCode = computed(() => store.state?.uData?.p_code ?? '---')
const list = ref({
  date: '',
  physiologicalNeeds: [],
  psychologicalAssessments: [],
  psychologicalAssessmentOther: '',
  socialNeedsAssessments: [],
  socialNeedsAssessmentOther: '',
  cognitiveFunctionAssessments: [],
  cognitiveFunctionAssessmentOther: '',
  encounterPlans: [],
  encounterPlanOther: ''
})
const newData = ref(false)

const emptyRules = [(v) => !!v || '不可空白']

// 選項列表 - 使用 ref 確保響應式
const physiologicalNeedsOptions = ref([
  '穩定生理',
  '疾病改善',
  '復健需求',
  '藥事服務'
])

const psychologicalAssessmentsOptions = ref([
  '害怕',
  '恐懼',
  '哭泣',
  '難過',
  '緊張',
  '焦慮',
  '躁動',
  '漫罵',
  '絕望',
  '憂鬱',
  '被遺棄感',
  '感到憤怒',
  '興奮',
  '高昂',
  '友善',
  '無法評估',
  '其他'
])

const socialNeedsAssessmentsOptions = ref([
  '主動交友',
  '拒絕被服務',
  '發脾氣',
  '沉默不語',
  '想家及思念家人',
  '拒絕飲食',
  '攻擊',
  '恐嚇他人',
  '自殘',
  '自殺行為',
  '無法評估',
  '其他'
])

const cognitiveFunctionAssessmentsOptions = ref([
  '思考力合乎情理',
  '思考力偏差',
  '記憶力正常',
  '記憶力偏差',
  '定向感正常',
  '定向感差',
  '計算能力偏差',
  '注意力正常',
  '注意力偏差',
  '時間錯亂',
  '缺乏現實感',
  '語言力異常',
  '行動力差',
  '建構力缺乏',
  '無法評估',
  '其他'
])

const encounterPlansOptions = ref([
  '通報社政單位',
  '社會福利諮詢',
  '依照本機構接案流程評估，完成相關紀錄',
  '協辦身心障礙鑑定',
  '與家屬討論了解期待並給予協助照護',
  '家庭關係協調與處遇',
  '依照醫師評估協助個案穩定用藥',
  '情緒支持與心理輔導',
  '社交技巧改善',
  '其他'
])

const getData = async () => {
  try {
    const url = `byjson/searchByKeyValue/${store.state.databaseName}/hour72`
    const payload = {
      key: 'u_snkey',
      value: store.state.uData.snkey
    }

    const rs = await api.options(url, payload)

    if (!rs || rs.length === 0) {
      newData.value = true
    } else {
      newData.value = false
      const matchData = rs.map((i) => {
        if (i.datalist) {
          try {
            const parsed = JSON.parse(i.datalist)
            parsed.snkey = i.snkey
            return parsed
          } catch {
            return {}
          }
        }
        return {}
      })
      if (matchData.length > 0 && matchData[0].snkey) {
        list.value = matchData[0]
      }
    }
  } catch (error) {
    console.error('讀取資料失敗:', error)
    store.showToastMulti({
      type: 'error',
      message: '讀取資料失敗',
      closeTime: 5
    })
  }
}

const addNew = async () => {
  try {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const addData = {
      datalist: JSON.stringify({
        ...list.value,
        u_snkey: store.state.uData.snkey,
        createInfo: {
          snkey: store.state.pData.snkey,
          name: store.state.pData.username,
          time: now
        }, 
        editInfo: []
      })
    }

    const rs = await api.add('hour72', addData)
    if (rs && rs.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已儲存',
        closeTime: 3
      })
      newData.value = false
      await getData()
    } else {
      store.showToastMulti({
        type: 'error',
        message: '儲存失敗',
        closeTime: 5
      })
    }
  } catch (error) {
    console.error('新增資料失敗:', error)
    store.showToastMulti({
      type: 'error',
      message: '新增資料失敗',
      closeTime: 5
    })
  }
}

const editOK = async () => {
  if (!form.value) {
    store.showToastMulti({
      type: 'warning',
      message: '表單尚未初始化',
      closeTime: 5
    })
    return
  }

  let valid = false
  try {
    const result = await form.value.validate()
    valid = result.valid !== false
  } catch (error) {
    console.error('表單驗證錯誤:', error)
    valid = false
  }

  if (!valid) {
    store.showToastMulti({
      type: 'warning',
      message: '評估日期不可為空白',
      closeTime: 5
    })
    return
  }

  try {
    if (newData.value) {
      await addNew()
    } else {
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

      const currentData = { ...list.value }
      currentData.editInfo.unshift({
        snkey: store.state.pData.snkey,
        name: store.state.pData.username,
        time: now
      })

      const postData = {
        snkey: list.value.snkey,
        datalist: JSON.stringify(currentData),
        updateTime: now
      }

      const rs = await api.post('hour72', postData)

      if (rs && rs.state == 1) {
        store.showToastMulti({
          type: 'success',
          message: '已儲存',
          closeTime: 3
        })
      } else {
        store.showToastMulti({
          type: 'error',
          message: '儲存失敗',
          closeTime: 5
        })
      }
    }
  } catch (error) {
    console.error('儲存資料失敗:', error)
    store.showToastMulti({
      type: 'error',
      message: '儲存資料失敗',
      closeTime: 5
    })
  }
}

const print = () => {
  const routeData = proxy.$router.resolve({
    path: '/Hour72Print',
    query: { data: JSON.stringify(list.value) }
  })
  window.open(routeData.href, '_blank')
}

onMounted(async () => {
  await nextTick()
  getData()
})
</script>

<style scoped lang="scss">
.hour72 {
  &__hero {
    padding: 28px;
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.12), rgba(33, 150, 243, 0.04));
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.87);
  }

  &__subtitle {
    font-size: 0.95rem;
    color: rgba(0, 0, 0, 0.6);
  }

  &__meta {
    margin-top: 12px;
  }

  .hour72-alert-left-border {
    border-left: 4px solid rgb(var(--v-theme-primary)) !important;
  }

  .hour72-alert-left-border-success {
    border-left: 4px solid rgb(var(--v-theme-success)) !important;
  }

  thead {
    th {
      font-size: 1.2rem;
      font-family: '微軟正黑體';
      color: red;
    }
  }

  tbody {
    td {
      font-size: 1rem;
    }
  }
}
</style>
