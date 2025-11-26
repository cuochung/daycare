<template>
  <div class="hour72nutrition">
    <v-container fluid class="pa-0">
        <v-row>
          <v-col cols="12">
          <v-sheet class="hour72nutrition__hero" rounded="xl" elevation="0">
            <div class="d-flex flex-column flex-md-row justify-space-between align-start">
              <div class="d-flex align-center mb-4 mb-md-0">
                <v-avatar size="56" color="primary" variant="tonal" class="mr-4">
                  <v-icon color="primary" size="32">mdi-food-apple</v-icon>
                </v-avatar>
                <div>
                  <h2 class="hour72nutrition__title mb-1">72小時營養篩檢表</h2>
                  <p class="hour72nutrition__subtitle mb-0">
                    {{ residentName }} / {{ residentCode }}
                  </p>
                </div>
              </div>
              <div class="d-flex align-center ga-2">
                <v-btn color="primary" variant="flat" prepend-icon="mdi-printer" :disabled="!hasUser"
                  @click="handlePrint">
                  列印
                </v-btn>
              </div>
            </div>
          </v-sheet>
          </v-col>
        </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card rounded="xl" variant="outlined">
            <v-card-text>
              <v-form ref="formRef">
              <v-row>
                <v-col cols="12" md="6">
                    <v-text-field v-model="form.date" type="date" label="評估日期" variant="outlined"
                      :rules="[rules.required]" density="comfortable" prepend-inner-icon="mdi-calendar" />
                </v-col>
                </v-row>

                <v-row class="mt-2">
                <v-col cols="12">
                    <v-alert color="primary" border="start" variant="tonal" class="mb-4">
                      <v-sheet color="primary" class="pa-2 white--text mb-3" rounded="sm">
                        <h3 class="text-h6 font-weight-bold">1.體重變化</h3>
                    </v-sheet>
                    <v-row>
                        <v-col cols="3">入住身高 {{ uData.height }} cm</v-col>
                        <v-col cols="3">入住體重 {{ uData.weight }} kg</v-col>
                        <v-col cols="3">BMI {{ bmi }} kg/m<sup>2</sup></v-col>
                        <v-col cols="3">理想體重 {{ ibw }} kg</v-col>
                    </v-row>
                  </v-alert>
                </v-col>
                </v-row>

                <v-row>
                <v-col cols="12">
                    <v-alert color="primary" border="start" variant="tonal" class="mb-4">
                      <v-sheet color="primary" class="pa-2 white--text mb-3" rounded="sm">
                        <h3 class="text-h6 font-weight-bold">2.飲食攝取</h3>
                    </v-sheet>
                    <v-row>
                        <v-col cols="12">
                          <div class="text-body-2 font-weight-medium mb-2">(1)飲食種類:</div>
                          <v-row>
                            <v-col cols="12" md="8">
                              <v-select v-model="form.dietType" :items="dietTypeItems" label="飲食種類"
                                variant="outlined" density="comfortable" clearable multiple />
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-text-field v-model="form.diet5" label="其他內容" variant="outlined"
                                density="comfortable" />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12">
                          <div class="text-body-2 font-weight-medium mb-2">(2)飲食型態:</div>
                          <v-row>
                            <v-col cols="12" md="8">
                              <v-select v-model="form.dietForm" :items="dietFormItems" label="飲食型態"
                                variant="outlined" density="comfortable" clearable multiple />
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-text-field v-model="form.diet13" label="其他內容" variant="outlined"
                                density="comfortable" />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12">
                          <div class="text-body-2 font-weight-medium mb-2">(3)進食型態:</div>
                          <v-select v-model="form.eatingpattern" :items="eatingpatternItems" label="進食型態"
                            variant="outlined" density="comfortable" clearable />
                        </v-col>
                        <v-col cols="12">
                          <div class="text-body-2 font-weight-medium mb-2">(4)食物攝取量(與供應量比較):</div>
                          <v-row>
                            <v-col cols="6" md="3">
                              <v-select v-model="form.breakfast" :items="mealItems" label="早餐" variant="outlined"
                                density="comfortable" clearable />
                            </v-col>
                            <v-col cols="6" md="3">
                              <v-select v-model="form.lunch" :items="mealItems" label="午餐" variant="outlined"
                                density="comfortable" clearable />
                            </v-col>
                            <v-col cols="6" md="3">
                              <v-select v-model="form.dinner" :items="mealItems" label="晚餐" variant="outlined"
                                density="comfortable" clearable />
                            </v-col>
                            <v-col cols="6" md="3">
                              <v-select v-model="form.dessert" :items="mealItems" label="點心" variant="outlined"
                                density="comfortable" clearable />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12">
                          <div class="text-body-2 font-weight-medium mb-2">(5)飲食偏好:</div>
                          <v-select v-model="form.dietPreference" :items="dietPreferenceItems"
                            label="飲食偏好" variant="outlined" density="comfortable" clearable multiple />
                        </v-col>
                        <v-col cols="12">
                          <div class="text-body-2 font-weight-medium mb-2">(6)過敏食物:</div>
                          <v-select v-model="form.allergyFood" :items="allergyFoodItems" label="過敏食物"
                            variant="outlined" density="comfortable" clearable multiple />
                        </v-col>
                    </v-row>
                  </v-alert>
                </v-col>
                </v-row>

                <v-row>
                <v-col cols="12">
                    <v-alert color="primary" border="start" variant="tonal" class="mb-4">
                      <v-sheet color="primary" class="pa-2 white--text mb-3" rounded="sm">
                        <h3 class="text-h6 font-weight-bold">3.腸胃道症狀（超過兩星期）</h3>
                    </v-sheet>
                      <v-row>
                        <v-col cols="12" md="9">
                          <v-select v-model="form.gastrointestinal" :items="gastrointestinalItems"
                            label="腸胃道症狀" variant="outlined" density="comfortable" clearable multiple />
                      </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field v-model="form.gastrointestinal16" label="其他" variant="outlined"
                            density="comfortable" />
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-col>
                </v-row>

                <v-row>
                <v-col cols="12">
                    <v-alert color="primary" border="start" variant="tonal" class="mb-4">
                      <v-sheet color="primary" class="pa-2 white--text mb-3" rounded="sm">
                        <h3 class="text-h6 font-weight-bold">
                          4.功能性評估:（依柯氏表：0為無功能不全；1-2為可走動；3為輪椅；4為臥床）
                        </h3>
                    </v-sheet>
                      <h3 class="text-h5">{{ kbData.klv }}</h3>
                  </v-alert>
                </v-col>
                </v-row>

                <v-row>
                <v-col cols="12">
                    <v-alert color="primary" border="start" variant="tonal" class="mb-4">
                      <v-sheet color="primary" class="pa-2 white--text mb-3" rounded="sm">
                        <h3 class="text-h6 font-weight-bold">5.生理測驗：(0=正常；1+=輕微；2+普通；3+=嚴重)</h3>
                    </v-sheet>
                    <v-row>
                        <v-col cols="12" md="4">
                          <v-select v-model="form.physiologicaltest1" :items="physiologicaltestItems"
                            label="皮下脂肪減少(肩膀、三頭肌、胸、手)" variant="outlined" density="comfortable" clearable />
                      </v-col>  
                        <v-col cols="12" md="4">
                          <v-select v-model="form.physiologicaltest2" :items="physiologicaltestItems"
                            label="肌肉耗弱(四頭肌、三角肌)" variant="outlined" density="comfortable" clearable />
                      </v-col>  
                        <v-col cols="12" md="4">
                          <v-select v-model="form.physiologicaltest3" :items="physiologicaltestItems" label="下肢水腫"
                            variant="outlined" density="comfortable" clearable />
                      </v-col>  
                        <v-col cols="12" md="4">
                          <v-select v-model="form.physiologicaltest4" :items="physiologicaltestItems" label="腹水"
                            variant="outlined" density="comfortable" clearable />
                      </v-col>  
                        <v-col cols="12" md="4">
                          <v-select v-model="form.physiologicaltest5" :items="physiologicaltestItems" label="褥瘡"
                            variant="outlined" density="comfortable" clearable />
                      </v-col>  
                        <v-col cols="12" md="4">
                          <v-text-field v-model="form.physiologicaltest6" label="褥瘡級數" variant="outlined"
                            density="comfortable" />
                      </v-col>  
                    </v-row>
                  </v-alert>
                </v-col>
                </v-row>

                <v-row>
                <v-col cols="12">
                    <v-alert color="primary" border="start" variant="tonal" class="mb-4">
                      <v-sheet color="primary" class="pa-2 white--text mb-3" rounded="sm">
                        <h3 class="text-h6 font-weight-bold">
                          綜合主觀性評估（A=營養足夠；B=營養不足；C=嚴重營養不足）
                        </h3>
                    </v-sheet>
                      <v-select v-model="form.assessment" :items="assessmentItems" label="綜合主觀性評估"
                        variant="outlined" density="comfortable" clearable />
                  </v-alert>
                </v-col>
              </v-row>
              </v-form>
            </v-card-text>

            <v-divider />

            <v-card-actions class="px-6 py-4">
              <v-spacer />
              
              <v-btn color="primary" variant="flat" prepend-icon="mdi-content-save" :loading="loading"
                :disabled="loading" @click="handleSave">
                確認儲存
              </v-btn>

            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { computed, getCurrentInstance, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const store = useStore()
const { proxy } = getCurrentInstance()
const router = useRouter()

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  snkey: '',
  date: '',
  eatingpattern: '',
  breakfast: '',
  lunch: '',
  dinner: '',
  dessert: '',
  physiologicaltest1: '',
  physiologicaltest2: '',
  physiologicaltest3: '',
  physiologicaltest4: '',
  physiologicaltest5: '',
  physiologicaltest6: '',
  assessment: '',
  dietType: [],
  diet5: '',
  dietForm: [],
  diet13: '',
  dietPreference: [],
  allergyFood: [],
  gastrointestinal: [],
  gastrointestinal16: '',
  createInfo: null,
  editInfo: [],
})

const kbData = ref({})
const uData = computed(() => store.state?.uData ?? {})
const hasUser = computed(() => Boolean(store.state?.uData?.snkey))
const residentName = computed(() => store.state?.uData?.name ?? '未選擇住民')
const residentCode = computed(() => store.state?.uData?.p_code ?? '---')

const rules = {
  required: (value) => !!value || '不可空白',
}

const eatingpatternItems = [
  { title: '無人協助則無法進食', value: '無人協助則無法進食' },
  { title: '可以自己進食但較吃力', value: '可以自己進食但較吃力' },
  { title: '可以自己進食', value: '可以自己進食' },
]

const mealItems = [
  { title: '≧4/4', value: '≧4/4' },
  { title: '3/4', value: '3/4' },
  { title: '2/4', value: '2/4' },
  { title: '≦1/4', value: '≦1/4' },
]

const physiologicaltestItems = [
  { title: '0=正常', value: '0=正常' },
  { title: '1+=輕微', value: '1+=輕微' },
  { title: '2+普通', value: '2+普通' },
  { title: '3+=嚴重', value: '3+=嚴重' },
]

const assessmentItems = [
  { title: 'A=營養足夠', value: 'A=營養足夠' },
  { title: 'B=營養不足', value: 'B=營養不足' },
  { title: 'C=嚴重營養不足', value: 'C=嚴重營養不足' },
]

const dietTypeItems = [
  { title: '葷食', value: '葷食' },
  { title: '早素', value: '早素' },
  { title: '初一、十五早素', value: '初一、十五早素' },
  { title: '初一、十五全素', value: '初一、十五全素' },
]

const dietFormItems = [
  { title: '普通', value: '普通' },
  { title: '軟質', value: '軟質' },
  { title: '細碎', value: '細碎' },
  { title: '半流質', value: '半流質' },
  { title: '全流質', value: '全流質' },
  { title: '管灌', value: '管灌' },
  { title: '素食', value: '素食' },
]

const dietPreferenceItems = [
  { title: '無', value: '無' },
  { title: '奶蛋類', value: '奶蛋類' },
  { title: '肉類', value: '肉類' },
  { title: '蔬菜', value: '蔬菜' },
  { title: '海鮮', value: '海鮮' },
  { title: '其他', value: '其他' },
]

const allergyFoodItems = [
  { title: '無', value: '無' },
  { title: '乳製品', value: '乳製品' },
  { title: '蛋類', value: '蛋類' },
  { title: '牛肉', value: '牛肉' },
  { title: '麩質', value: '麩質' },
  { title: '海鮮', value: '海鮮' },
  { title: '其他', value: '其他' },
]

const gastrointestinalItems = [
  { title: '正常', value: '正常' },
  { title: '食慾增加', value: '食慾增加' },
  { title: '食慾減少', value: '食慾減少' },
  { title: '咀嚼困難', value: '咀嚼困難' },
  { title: '吞嚥困難', value: '吞嚥困難' },
  { title: '噁心', value: '噁心' },
  { title: '嘔吐', value: '嘔吐' },
  { title: '腹脹', value: '腹脹' },
  { title: '胃不適', value: '胃不適' },
  { title: '腹水', value: '腹水' },
  { title: '體重改變', value: '體重改變' },
  { title: '便秘', value: '便秘' },
  { title: '腹瀉', value: '腹瀉' },
  { title: '痔瘡', value: '痔瘡' },
  { title: '血便', value: '血便' },
]

const bmi = computed(() => {
  if (!uData.value.weight || !uData.value.height) return '—'
  const bmiValue =
    uData.value.weight / ((uData.value.height / 100) * (uData.value.height / 100))
  return bmiValue.toFixed(2)
})

const ibw = computed(() => {
  if (!uData.value.height) return '—'
  const ibwValue = (uData.value.height / 100) * (uData.value.height / 100) * 22
  return ibwValue.toFixed(2)
})

const getKbData = async () => {
  if (!hasUser.value) return

  const payload = {
    key: 'u_snkey',
    value: store.state.uData.snkey,
  }
  const url = `byjson/searchByKeyValue/${store.state.databaseName}/kb`
  const response = await api.options(url, payload)

  if (response && response.length > 0) {
    kbData.value = JSON.parse(response[0].datalist || '{}')
  }
}

// 從 uData.nursingAssessment 初始化 form 中的護理評估資料
const initNursingAssessmentData = () => {
  const na = uData.value?.nursingAssessment || {}
  Object.assign(form, {
    dietType: Array.isArray(na.dietTypes) ? na.dietTypes : [],
    diet5: na.dietTypesOther || '',
    dietForm: Array.isArray(na.dietTextures) ? na.dietTextures : [],
    diet13: na.dietTexturesOther || '',
    dietPreference: Array.isArray(na.dietPreference) ? na.dietPreference : [],
    allergyFood: Array.isArray(na.dietTaboo) ? na.dietTaboo : [],
    gastrointestinal: Array.isArray(na.gastrointestinal) ? na.gastrointestinal : [],
    gastrointestinal16: na.gastrointestinalOther || '',
  })
}

const fetchData = async () => {
  if (!hasUser.value) {
    resetForm()
    return
  }

  loading.value = true
  const payload = {
    key: 'u_snkey',
    value: store.state.uData.snkey,
  }
  const url = `byjson/searchByKeyValue/${store.state.databaseName}/hour72nutrition`
  const response = await api.options(url, payload)

  if (response && response.length > 0) {
    const data = JSON.parse(response[0].datalist || '{}')
    Object.assign(form, {
      ...data,
      snkey: response[0].snkey,
      editInfo: Array.isArray(data.editInfo) ? data.editInfo : [],
      createInfo: data.createInfo || null,
    })
  } else {
    resetForm()
    initNursingAssessmentData()
  }
  loading.value = false
}

const resetForm = () => {
  Object.assign(form, {
    snkey: '',
    date: '',
    eatingpattern: '',
    breakfast: '',
    lunch: '',
    dinner: '',
    dessert: '',
    physiologicaltest1: '',
    physiologicaltest2: '',
    physiologicaltest3: '',
    physiologicaltest4: '',
    physiologicaltest5: '',
    physiologicaltest6: '',
    assessment: '',
    dietType: [],
    diet5: '',
    dietForm: [],
    diet13: '',
    dietPreference: [],
    allergyFood: [],
    gastrointestinal: [],
    gastrointestinal16: '',
    createInfo: null,
    editInfo: [],
  })
}

const validateForm = async () => {
  const result = await formRef.value?.validate()
  return result?.valid ?? false
}

const handleSave = async () => {
  const isValid = await validateForm()
  if (!isValid) {
    store.showToastMulti({
      type: 'warning',
      message: '評估日期不可為空白',
      closeTime: 2,
    })
    return
  }

  loading.value = true
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')

  try {
    if (!form.snkey) {
      // 新增
      const payload = {
        datalist: JSON.stringify({
          ...form,
          u_snkey: store.state.uData.snkey,
          createInfo: {
            snkey: store.state.pData.snkey,
            name: store.state.pData.username,
            time: timestamp,
          },
          editInfo: [],
        }),
      }
      
      const response = await api.add('hour72nutrition', payload)
      if (response?.state == 1) {
        store.showToastMulti({
          type: 'success',
          message: '已儲存',
          closeTime: 2,
        })
        await fetchData()
      } else {
        store.showToastMulti({
          type: 'error',
          message: '儲存失敗，請稍後再試',
          closeTime: 3,
        })
      }
    } else {
      // 修改
      form.editInfo.unshift({
        snkey: store.state.pData.snkey,
        name: store.state.pData.username,
        time: timestamp,
      })

      const payload = {
        snkey: form.snkey,
        datalist: JSON.stringify(form),
        updateTime: timestamp,
      }

      const response = await api.post('hour72nutrition', payload)
      if (response?.state == 1) {
        store.showToastMulti({
          type: 'success',
          message: '已儲存',
          closeTime: 2,
        })
      } else {
        store.showToastMulti({
          type: 'error',
          message: '儲存失敗，請稍後再試',
          closeTime: 3,
        })
      }
    }
  } catch (error) {
    console.error('Save error:', error)
    store.showToastMulti({
      type: 'error',
      message: '儲存失敗，請稍後再試',
      closeTime: 3,
    })
  } finally {
    loading.value = false
  }
}

const handlePrint = () => {
  if (!hasUser.value) {
    proxy?.$swal?.({
      icon: 'warning',
      title: '請先選擇住民',
    })
    return
  }

  const postData = {
    list: form,
    nursingassessmentData: {
      dietType: form.dietType,
      diet5: form.diet5,
      dietForm: form.dietForm,
      diet13: form.diet13,
      dietPreference: form.dietPreference,
      allergyFood: form.allergyFood,
      gastrointestinal: form.gastrointestinal,
      gastrointestinal16: form.gastrointestinal16,
    },
    kbData: kbData.value,
  }
  const routeData = router.resolve({
    path: '/print/hour72nutritionprint',
    query: { data: JSON.stringify(postData) },
  })
  window.open(routeData.href, '_blank')
}

onMounted(async () => {
  await getKbData()
  initNursingAssessmentData()
  await fetchData()
})

watch(
  () => store.state?.uData?.snkey,
  async () => {
    await getKbData()
    initNursingAssessmentData()
    await fetchData()
  }
)

watch(
  () => uData.value?.nursingAssessment,
  () => {
    initNursingAssessmentData()
  },
  { deep: true }
)
</script>


<style scoped lang="scss">
.hour72nutrition {
  &__hero {
    padding: 28px;
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.12), rgba(33, 150, 243, 0.04));
  }

  &__title {
    font-weight: 700;
  }

  &__subtitle {
    color: rgba(0, 0, 0, 0.6);
  }
}
</style>
