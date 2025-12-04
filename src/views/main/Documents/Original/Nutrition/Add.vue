<template>
  <div class="nutritionadd">
    <v-dialog v-model="dialog" fullscreen persistent>
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          class="nutrition-add-btn"
          color="primary"
          variant="elevated"
          prepend-icon="mdi-plus-circle"
          elevation="6"
          @click="openForAdd"
        >
          新增營養評估
        </v-btn>
      </template>

      <v-card rounded="xl">
        <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
          <div class="d-flex align-center">
            <v-avatar size="48" color="white" variant="tonal" class="mr-4">
              <v-icon color="white" size="28">mdi-food</v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h6 font-weight-bold mb-1">{{ headerTitle }}</h2>
              <p class="text-body-2 mb-0">{{ headerSubtitle }}</p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
        </v-sheet>

        <v-card-text class="pt-6">
          <v-form ref="formRef" class="mt-3">
            <v-row>
              <v-col cols="12">
                <v-alert color="primary" border="start" variant="tonal">
                  <h3 class="text-subtitle-1 font-weight-bold mb-2">基本資料</h3>
                  <div class="text-body-2">
                    床號: {{ uData.bed_name }} / 入住日期: {{ uData.in_date }} / 姓名: {{ uData.name }} / 性別: {{ uData.sex }} / 生日: {{ uData.birthday }}
                    / 年齡: {{ age }} / 身高: {{ uData.height }} / 標準體重(IBW): {{ ibw }}
                    <br />
                    曾患疾病: {{ uData.hadadisease }}
                  </div>
                </v-alert>
              </v-col>

              <v-col cols="12">
                <v-card variant="outlined" rounded="lg">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="3">
                        <v-text-field
                          label="評估日期"
                          v-model="list.date"
                          type="date"
                          :rules="emptyRules"
                          variant="outlined"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-alert color="primary" border="start" variant="tonal" class="mt-4">
                      <h3 class="text-subtitle-1 font-weight-bold mb-2">生理資料</h3>
                      <v-row>
                        <v-col cols="12" sm="3">
                          <v-select
                            :items="actionItems"
                            label="活動狀況"
                            v-model="list.action"
                            variant="outlined"
                            density="comfortable"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field
                            label="體重"
                            v-model="list.weight"
                            variant="outlined"
                            density="comfortable"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field label="BMI" v-model="bmi" readonly variant="outlined" density="comfortable"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-alert>

                    <v-alert color="primary" border="start" variant="tonal" class="mt-4">
                      <h3 class="text-subtitle-1 font-weight-bold mb-2">飲食資料</h3>
                      <v-row>
                        <v-col cols="12" sm="3">
                          <v-select
                            :items="appetiteItems"
                            label="食慾"
                            v-model="list.appetite"
                            variant="outlined"
                            density="comfortable"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-select
                            :items="textureItems"
                            label="飲食質地"
                            v-model="list.texture"
                            variant="outlined"
                            density="comfortable"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-select
                            :items="eatItems"
                            label="進食方式"
                            v-model="list.eat"
                            variant="outlined"
                            density="comfortable"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-alert>

                    <v-alert color="primary" border="start" variant="tonal" class="mt-4">
                      <h3 class="text-subtitle-1 font-weight-bold mb-2">評估</h3>
                      <v-row>
                        <v-col cols="12" sm="3">
                          <v-select
                            :items="dietprescriptionItems"
                            label="飲食處方"
                            v-model="list.dietprescription"
                            variant="outlined"
                            density="comfortable"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field
                            label="醣類(%)"
                            v-model="list.carbohydrate"
                            variant="outlined"
                            density="comfortable"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field
                            label="蛋白質(%)"
                            v-model="list.protein"
                            variant="outlined"
                            density="comfortable"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field
                            label="脂肪(%)"
                            v-model="list.fat"
                            variant="outlined"
                            density="comfortable"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-select
                            :items="kcalItems"
                            label="熱量(Kcal)"
                            v-model="list.kcal"
                            variant="outlined"
                            density="comfortable"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field
                            label="醣類(g)"
                            v-model="carbohydrate_g"
                            readonly
                            variant="outlined"
                            density="comfortable"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field
                            label="蛋白質(g)"
                            v-model="protein_g"
                            readonly
                            variant="outlined"
                            density="comfortable"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field
                            label="脂肪(g)"
                            v-model="fat_g"
                            readonly
                            variant="outlined"
                            density="comfortable"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-alert>

                    <v-alert color="primary" border="start" variant="tonal" class="mt-4">
                      <h3 class="text-subtitle-1 font-weight-bold mb-2">營養建議</h3>
                      <v-row>
                        <v-col cols="12" md="8">
                          <v-textarea
                            rows="20"
                            label="營養建議"
                            v-model="list.suggest"
                            variant="outlined"
                            density="comfortable"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-sheet color="primary" class="white--text pa-3 mb-2" rounded="sm">
                            <h3 class="text-subtitle-1 font-weight-bold">常用營養建議內容</h3>
                          </v-sheet>
                          <v-text-field
                            label="新增內容"
                            variant="outlined"
                            hide-details
                            class="mt-2"
                            append-inner-icon="mdi-plus-circle"
                            @click:append-inner="addSuggest"
                            v-model="newSuggest"
                            density="comfortable"
                          ></v-text-field>

                          <div style="overflow: auto">
                            <v-list height="300px">
                              <v-list-item v-for="(item, i) in suggestItems" :key="i">
                                <v-list-item-title class="d-flex align-center">
                                  <span @click="insertMsg(item)" class="flex-grow-1" style="cursor: pointer">
                                    {{ item.name }}
                                  </span>
                                  <v-icon color="error" @click.stop="delSuggest(item)" size="small">mdi-close</v-icon>
                                </v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </div>
                        </v-col>
                      </v-row>
                    </v-alert>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="px-6 py-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="flat"
            @click="addOK"
            v-if="processType == 'add'"
            :loading="loading"
            :disabled="loading"
          >
            確認新增
          </v-btn>
          <v-btn
            color="success"
            variant="flat"
            @click="editOK"
            v-if="processType == 'edit'"
            :loading="loading"
            :disabled="loading"
          >
            確認修改
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const store = useStore()
const { proxy } = getCurrentInstance()

const emit = defineEmits(['getAllData'])

const dialog = ref(false)
const formRef = ref(null)
const list = ref({
  snkey: '',
  date: '',
  suggest: '',
})
const processType = ref('')
const loading = ref(false)
const suggestItems = ref([])
const newSuggest = ref('')

const emptyRules = [(v) => !!v || '不可空白']
const actionItems = ['臥床', '輕度', '中度', '重度']
const appetiteItems = ['好', '尚可', '差']
const textureItems = ['乾飯', '稀飯', '細碎', '糊狀', '流質']
const eatItems = ['由口進食', '鼻胃管灌食', '胃造廔']
const dietprescriptionItems = ['普通餐', '糖尿病餐', '低鹽餐', '低油餐', '灌食']
const kcalItems = ['1300', '1400', '1500', '1600', '1700', '1800']

const uData = computed(() => store.state?.uData ?? {})

const age = computed(() => {
  if (!uData.value.birthday) return ''
  return dayjs().format('YYYY') - dayjs(uData.value.birthday).format('YYYY')
})

const ibw = computed(() => {
  if (!uData.value.height) return ''
  const ibwValue = (uData.value.height / 100) * (uData.value.height / 100) * 22
  return ibwValue.toFixed(2)
})

const bmi = computed(() => {
  if (!list.value.weight || !uData.value.height) return ''
  const bmiValue = list.value.weight / ((uData.value.height / 100) * (uData.value.height / 100))
  list.value.bmi = bmiValue.toFixed(2)
  return list.value.bmi
})

const carbohydrate_g = computed(() => {
  if (!list.value.kcal || !list.value.carbohydrate) return ''
  const value = (list.value.kcal * (list.value.carbohydrate / 100)) / 4
  list.value.carbohydrate_g = value.toFixed(0)
  return list.value.carbohydrate_g
})

const protein_g = computed(() => {
  if (!list.value.kcal || !list.value.protein) return ''
  const value = (list.value.kcal * (list.value.protein / 100)) / 4
  list.value.protein_g = value.toFixed(0)
  return list.value.protein_g
})

const fat_g = computed(() => {
  if (!list.value.kcal || !list.value.fat) return ''
  const value = (list.value.kcal * (list.value.fat / 100)) / 9
  list.value.fat_g = value.toFixed(0)
  return list.value.fat_g
})

const headerTitle = computed(() => (processType.value === 'add' ? '新增營養評估' : '修改營養評估'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民營養狀況評估，包含生理資料、飲食資料、營養建議等完整資訊。'
    : '更新既有營養評估紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const resetRecord = () => {
  list.value = {
    snkey: '',
    date: '',
    suggest: '',
    action: '',
    weight: '',
    bmi: '',
    appetite: '',
    texture: '',
    eat: '',
    dietprescription: '',
    carbohydrate: '',
    protein: '',
    fat: '',
    kcal: '',
    carbohydrate_g: '',
    protein_g: '',
    fat_g: '',
  }
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const openForAdd = () => {
  resetRecord()
  processType.value = 'add'
  dialog.value = true
}

const openForEdit = (item) => {
  processType.value = 'edit'
  list.value = JSON.parse(JSON.stringify(item))
  dialog.value = true
}

const addOK = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完全!!請重新確認!!',
      closeTime: 3,
    })
    return
  }

  list.value.u_snkey = store.state.uData.snkey
  list.value.createInfo = {
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
  list.value.editInfo = []

  let postData = {
    datalist: JSON.stringify(list.value)
  }

  loading.value = true
  try {
    const response = await api.add('nutrition', postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已新增',
        closeTime: 2,
      })
      list.value = { snkey: '', date: '', suggest: '' }
      dialog.value = false
      emit('getAllData')
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

const editOK = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完全!!請重新確認!!',
      closeTime: 3,
    })
    return
  }

  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
  list.value.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: timestamp
  })

  let postData = {
    snkey: list.value.snkey,
    datalist: JSON.stringify(list.value),
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }

  loading.value = true
  try {
    const response = await api.post('nutrition', postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已修改',
        closeTime: 2,
      })
      dialog.value = false
      emit('getAllData')
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

const getSuggestItems = async () => {
  try {
    const response = await api.get('suggest')
    suggestItems.value = response || []
  } catch (error) {
    console.error('Get suggest items error:', error)
  }
}

const addSuggest = async () => {
  if (!newSuggest.value) return

  const repeat = suggestItems.value.filter((item) => {
    return newSuggest.value == item.name
  })
  if (repeat.length > 0) {
    store.showToastMulti({
      type: 'warning',
      message: '不可重覆!!',
      closeTime: 2,
    })
    return
  }

  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const payload = {
    name: newSuggest.value,
    createInfo: {
      snkey: store.state.pData.snkey,
      name: store.state.pData.username,
      time: timestamp
    },
  }

  try {
    const response = await api.add('suggest', payload)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已新增',
        closeTime: 2,
      })
      newSuggest.value = ''
      await getSuggestItems()
    }
  } catch (error) {
    console.error('Add suggest error:', error)
  }
}

const delSuggest = async (delData) => {
  const result = await proxy.$swal({
    title: '確認刪除常用營養建議內容嗎？',
    text: '此操作無法復原',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center'
  })

  if (result.isConfirmed) {
    delData.delman = store.state.pData.username + '(' + dayjs().format('YYYY-MM-DD HH:mm:ss') + ')'
    const payload = {
      snkey: delData.snkey,
      tablename: 'suggest',
      info: JSON.stringify(delData),
    }

    try {
      const response = await api.delete('suggest', payload)
      if (response?.state == 1) {
        store.showToastMulti({
          type: 'success',
          message: '已刪除',
          closeTime: 2,
        })
        await getSuggestItems()
      }
    } catch (error) {
      console.error('Delete suggest error:', error)
    }
  }
}

const insertMsg = (item) => {
  list.value.suggest = (list.value.suggest || '') + item.name
}

defineExpose({
  openForAdd,
  openForEdit,
})

onMounted(() => {
  getSuggestItems()
})
</script>

<style scoped lang="scss">
// 樣式可以根據需要添加
</style>
