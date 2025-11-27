<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center bg-primary-lighten-2">
        <v-icon color="primary" class="mr-2">mdi-printer</v-icon>
        <span class="text-h6 font-weight-bold">列印服務紀錄表設定</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="formValid">
          <v-alert type="info" variant="tonal" border="start" color="primary" class="mb-4"
            icon="mdi-information-outline">
            <div class="text-body-2 mb-3">
              請選擇要列印的服務紀錄日期範圍，或選擇全部列印。
            </div>
            <v-text-field v-model="formData.startDay" type="date" variant="outlined" density="comfortable"
              label="服務紀錄起始時間" :rules="[rules.required]" class="mb-3" />
            <v-divider class="my-3" />
            <v-text-field v-model="formData.endDay" type="date" variant="outlined" density="comfortable"
              label="服務紀錄結束時間" :rules="[rules.required]" />
          </v-alert>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="closeDialog">
          取消
        </v-btn>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-calendar-range" @click="handlePrintRange">
          指定時間列印
        </v-btn>
        <v-btn color="secondary" variant="flat" prepend-icon="mdi-printer" @click="handlePrintAll">
          全部列印
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import dayjs from 'dayjs'
import { getCurrentInstance, ref } from 'vue'
import { useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()
const router = useRouter()

const dialog = ref(false)
const formRef = ref(null)
const formValid = ref(false)
const items = ref([])

const formData = ref({
  startDay: '',
  endDay: '',
})

const rules = {
  required: (v) => !!v || '不可空白',
}

const openDialog = (data) => {
  items.value = data || []
  formData.value = {
    startDay: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    endDay: dayjs().format('YYYY-MM-DD'),
  }
  formRef.value?.resetValidation()
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  formData.value = {
    startDay: '',
    endDay: '',
  }
}

const handlePrintRange = async () => {
  const valid = await formRef.value?.validate()
  if (!valid?.valid) {
    proxy.$swal({
      icon: 'warning',
      title: '請填寫完整的日期範圍',
    })
    return
  }

  const result = await proxy.$swal({
    title: '確認顯示列印畫面？',
    text: '列印畫面將在新的分頁中顯示，請再次確認。',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center',
  })

  if (result?.isConfirmed) {
    // 過濾日期範圍內的資料
    const filtered = items.value.filter((item) => {
      const itemDate = dayjs(item.date).format('YYYY-MM-DD')
      const startDate = dayjs(formData.value.startDay).format('YYYY-MM-DD')
      const endDate = dayjs(formData.value.endDay).format('YYYY-MM-DD')
      return itemDate >= startDate && itemDate <= endDate
    })

    // 排序：由舊到新
    const sorted = filtered.sort((a, b) => {
      return dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1
    })

    // 存入 sessionStorage
    sessionStorage.setItem('printData', JSON.stringify(sorted))

    // 開啟列印頁面
    const routeData = router.resolve({
      path: '/ServicerecordPrint',
    })
    window.open(routeData.href, '_blank')
    closeDialog()
  }
}

const handlePrintAll = async () => {
  const result = await proxy.$swal({
    title: '確認顯示列印畫面？',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center',
  })

  if (result?.isConfirmed) {
    // 排序：由舊到新
    const sorted = items.value.sort((a, b) => {
      return dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1
    })

    // 存入 sessionStorage
    sessionStorage.setItem('printData', JSON.stringify(sorted))

    // 開啟列印頁面
    const routeData = router.resolve({
      path: '/ServicerecordPrint',
    })
    window.open(routeData.href, '_blank')
    closeDialog()
  }
}

defineExpose({
  openDialog,
})
</script>

<style scoped lang="scss">
// 樣式已由 Vuetify 3 元件處理
</style>

