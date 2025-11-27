<template>
  <v-dialog v-model="dialog" persistent max-width="900" :retain-focus="false">
    <v-card rounded="xl" class="servicerecord-add">
      <v-sheet
        class="servicerecord-add__header px-6 py-4"
        :color="headerColor"
        rounded="t-xl"
      >
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="48" :color="headerColor" class="mr-4">
              <v-icon color="white" size="26">mdi-account-heart</v-icon>
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
                  <v-text-field label="評估日期" v-model="list.date" type="date" :rules="emptyRules" variant="outlined"
                    density="comfortable"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="servicerecord-add-alert-left-border">
                    <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                      <h2>基本資訊</h2>
                    </v-sheet>
                    <v-row class="ml-3 mt-3">
                      <v-col cols="12" sm="6" md="4">
                        <v-select :items="targetItems" label="服務對象" v-model="list.target" variant="outlined"
                          density="comfortable"></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select :items="typeItems" label="服務類型" v-model="list.type" variant="outlined"
                          density="comfortable"></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select :items="locationItems" label="服務地點" v-model="list.location" variant="outlined"
                          density="comfortable"></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select :items="modelItems" label="服務模式" v-model="list.model" variant="outlined"
                          density="comfortable"></v-select>
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-col>
                <v-col cols="12">
                  <v-alert color="primary" variant="outlined" class="servicerecord-add-alert-left-border">
                    <v-sheet color="blue dark-1" class="pa-2 white--text" elevation="4">
                      <h2>近況簡述</h2>
                    </v-sheet>
                    <v-textarea class="ml-3 mt-3" label="近況簡述" v-model="list.simplecontent" variant="outlined"
                      density="comfortable" rows="3"></v-textarea>
                  </v-alert>
                </v-col>
                <v-col cols="12">
                  <v-alert color="success" variant="outlined" class="servicerecord-add-alert-left-border-success">
                    <v-sheet color="success dark-1" class="pa-2 white--text" elevation="4">
                      <h2>下次計畫</h2>
                    </v-sheet>
                    <v-textarea class="ml-3 mt-3" label="下次計畫" v-model="list.nextplan" variant="outlined"
                      density="comfortable" rows="3"></v-textarea>
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
        <v-btn color="primary" variant="flat" @click="addOK" v-if="processType == 'add'" :loading="loading"
          :disabled="loading">確認新增</v-btn>
        <v-btn color="success" variant="flat" @click="editOK" v-if="processType == 'edit'" :loading="loading"
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
const processType = ref('')
const list = ref({})

const emptyRules = [(v) => !!v || '不可空白']

const targetItems = ['個案本人', '個案親友', '其他']
const typeItems = ['定期訪視', '疾病狀況', '家庭關係', '意見申訴', '情緒問題', '福利服務', '意外傷害', '個案研討', '其他']
const locationItems = ['機構內', '個案家中', '意見申訴', '醫療院所', '其他']
const modelItems = ['直接服務', '照會其他專業', '通報機構主管', '轉介其他單位']

const headerTitle = computed(() => {
  return processType.value === 'add' ? '新增服務紀錄' : '修改服務紀錄'
})

const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '記錄服務對象、類型、地點與服務內容等資訊。'
    : '更新服務紀錄，保留完整服務歷程。'
)

const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const resetForm = () => {
  list.value = {}
  formRef.value?.resetValidation()
}

const openForAdd = () => {
  processType.value = 'add'
  resetForm()
  dialog.value = true
}

const openForEdit = (item) => {
  processType.value = 'edit'
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
    const rs = await api.add('servicerecord', addData)

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
    const rs = await api.post('servicerecord', postData)

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
.servicerecord-add {
  &__header {
    background-image: linear-gradient(135deg, rgba(33, 150, 243, 0.12), rgba(33, 150, 243, 0.04));
  }
}

.servicerecord-add-alert-left-border {
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
}

.servicerecord-add-alert-left-border-success {
  border-left: 4px solid rgb(var(--v-theme-success)) !important;
}
</style>
