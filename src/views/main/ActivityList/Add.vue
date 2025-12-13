<template>
  <v-dialog v-model="dialog" persistent fullscreen>
      <v-card>
        <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4">
          <div class="d-flex align-center">
            <v-avatar size="48" color="white" variant="tonal" class="mr-4">
              <v-icon color="white" size="28">mdi-calendar-clock</v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h6 font-weight-bold mb-1">{{ headerTitle }}</h2>
              <p class="text-body-2 mb-0">{{ headerSubtitle }}</p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="checkClose" />
        </v-sheet>

        <v-card-text class="px-6 py-5">
          <v-form ref="formRef">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="list.name" label="活動名稱" prepend-inner-icon="mdi-shape-outline" variant="outlined"
                  density="comfortable" :rules="requiredRules" />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="list.date" label="日期" type="date" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="list.time" label="時間" prepend-inner-icon="mdi-clock-outline" variant="outlined"
                  density="comfortable" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="list.target" label="目標" prepend-inner-icon="mdi-target-account"
                  variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="list.location" label="地點" prepend-inner-icon="mdi-map-marker" variant="outlined"
                  density="comfortable" />
              </v-col>
              <v-col cols="12" md="8">
                <v-autocomplete v-model="list.memberArray" :items="uitems" label="參加成員"
                  prepend-inner-icon="mdi-account-multiple" variant="outlined" chips multiple closable-chips
                  item-title="text" item-value="snkey" return-object density="comfortable" :rules="requiredRules" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field :model-value="userCounts" label="參加人數" readonly variant="outlined"
                  density="comfortable" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="list.device" label="器具設備" prepend-inner-icon="mdi-dumbbell" variant="outlined"
                  density="comfortable" />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="list.leader" label="帶領者" prepend-inner-icon="mdi-account-tie" variant="outlined"
                  density="comfortable" />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="list.helper" label="協助者" prepend-inner-icon="mdi-account-multiple-check"
                  variant="outlined" density="comfortable" />
              </v-col>

              <v-col cols="12">
                <v-card variant="tonal" color="primary">
                  <v-card-title class="d-flex align-center">
                    <h3 class="text-subtitle-1 font-weight-medium mb-0">活動時間表</h3>
                    <v-spacer />
                    <v-btn color="primary" variant="tonal" size="small" prepend-icon="mdi-plus-circle"
                      @click="activityAdd">
                      新增時間點
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-row v-for="(item, index) in list.scheduleArray" :key="index">
                      <v-col cols="12" md="4">
                        <v-text-field v-model="item.time" label="活動時間" hide-details variant="outlined"
                          density="comfortable" />
                      </v-col>
                      <v-col cols="12" md="8" class="d-flex align-center">
                        <v-text-field v-model="item.content" label="活動內容" hide-details class="flex-grow-1 mr-2"
                          variant="outlined" density="comfortable" />
                        <v-btn icon="mdi-close" color="error" variant="text" @click="activityDel(index)" />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card variant="tonal" color="secondary" rounded="lg">
                  <v-card-title class="d-flex align-center">
                    <v-icon color="secondary" class="mr-2">mdi-image-multiple-outline</v-icon>
                    <h3 class="text-subtitle-1 font-weight-medium mb-0">活動照片</h3>
                    <v-spacer />
                    <v-btn color="secondary" variant="tonal" prepend-icon="mdi-plus-circle" size="small"
                      @click="fileInput?.click()" :loading="uploading">
                      選擇照片
                    </v-btn>
                    <input ref="fileInput" type="file" multiple accept="image/*" class="d-none" @change="onFileSelected" />
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <!-- 預覽新選擇的照片 -->
                    <v-row v-if="previewImages.length">
                      <v-col v-for="(preview, index) in previewImages" :key="`preview-${index}`" cols="12" sm="6" md="4">
                        <v-sheet color="white" rounded="lg" class="pa-2 position-relative">
                          <v-img :src="preview.preview" aspect-ratio="1" rounded="lg" cover>
                            <v-overlay absolute :model-value="preview.uploading" class="d-flex align-center justify-center">
                              <v-progress-circular color="secondary" indeterminate size="32"></v-progress-circular>
                            </v-overlay>
                          </v-img>
                          <!-- 上傳狀態標籤 -->
                          <v-chip 
                            v-if="preview.uploaded" 
                            size="small" 
                            color="success" 
                            variant="flat" 
                            class="position-absolute"
                            style="top: 8px; left: 8px; z-index: 2;" 
                            prepend-icon="mdi-check-circle">
                            已上傳
                          </v-chip>
                          <!-- <v-chip 
                            v-else-if="preview.uploading" 
                            size="small" 
                            color="warning" 
                            variant="flat" 
                            class="position-absolute"
                            style="top: 8px; left: 8px; z-index: 2;" 
                            prepend-icon="mdi-upload">
                            上傳中
                          </v-chip> -->
                          <v-chip 
                            v-else 
                            size="small" 
                            color="info" 
                            variant="flat" 
                            class="position-absolute"
                            style="top: 8px; left: 8px; z-index: 2;" 
                            prepend-icon="mdi-clock-outline">
                            待上傳
                          </v-chip>
                          <v-btn icon="mdi-close" size="small" color="error" variant="flat" class="position-absolute"
                            style="top: 8px; right: 8px;" @click.stop="removePreview(index)" />
                          <div class="text-caption text-center mt-2 text-truncate">{{ preview.fileName }}</div>
                        </v-sheet>
                      </v-col>
                    </v-row>

                    <!-- 已存在的照片 -->
                  <v-row v-if="existingPics.length" class="mb-4">
                    <v-col v-for="(item, index) in existingPics" :key="`existing-${index}-${getPicName(item)}`"
                      cols="12" sm="6" md="4">
                      <v-sheet color="white" rounded="lg" class="pa-2 position-relative">
                        <v-img :src="`${baseUrl}/upload/activity/${getPicName(item)}`" aspect-ratio="1" rounded="lg"
                          cover>
                          <template #placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                              <v-progress-circular color="secondary" indeterminate size="32"></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                        <!-- 已上傳標籤 -->
                        <v-chip size="small" color="success" variant="flat" class="position-absolute"
                          style="top: 8px; left: 8px; z-index: 2;" prepend-icon="mdi-check-circle">
                          已上傳
                        </v-chip>
                        <v-btn icon="mdi-close" size="small" color="error" variant="flat" class="position-absolute"
                          style="top: 8px; right: 8px;" @click.stop="removeExistingPic(item, index)" />
                      </v-sheet>
                    </v-col>
                  </v-row>

                    <!-- 空狀態 -->
                    <v-sheet v-if="!existingPics.length && !previewImages.length" color="grey-lighten-5" rounded="lg"
                      class="d-flex flex-column align-center justify-center pa-8" style="min-height: 200px;">
                      <v-icon color="grey" size="48" class="mb-4">mdi-image-off-outline</v-icon>
                      <span class="text-body-2 text-medium-emphasis">尚未選擇任何照片</span>
                      <span class="text-caption text-medium-emphasis mt-2">點擊「選擇照片」按鈕開始上傳</span>
                    </v-sheet>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-textarea v-model="list.explanation" label="活動說明" variant="outlined" auto-grow rows="3"
                  prepend-inner-icon="mdi-note-text-outline" density="comfortable" />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea v-model="list.suggest" label="活動檢討與建議" variant="outlined" auto-grow rows="3"
                  prepend-inner-icon="mdi-clipboard-list-outline" density="comfortable" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="px-6 py-4">
          <v-spacer />
          <v-btn variant="tonal" color="secondary" @click="checkClose">
            取消
          </v-btn>
          <v-btn v-if="processType === 'add'" color="primary" variant="flat" @click="addOK">
            確認新增
          </v-btn>
          <v-btn v-else color="primary" variant="flat" @click="editOK">
            確認修改
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const emit = defineEmits(['finish-add', 'finish-edit', 'refresh'])

const store = useStore()
const { proxy } = getCurrentInstance()

const dialog = ref(false)
const processType = ref('add')
const headerTitle = computed(() =>
  processType.value === 'add' ? '新增活動參與紀錄表' : '修改活動參與紀錄表'
)
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '請填寫活動資訊與參與成員'
    : '更新內容後記得送出保存'
)
const headerColor = computed(() =>
  processType.value === 'add' ? 'primary-darken-1' : 'green-darken-2'
)

const fileInput = ref(null)
const formRef = ref(null)
const uitems = ref([])
const uploading = ref(false)

// 照片相關
const existingPics = ref([]) // 已存在的照片（編輯時）
const previewImages = ref([]) // 預覽的新照片
const deletedPics = ref([]) // 標記為待刪除的照片

const requiredRules = [(v) => !!v || '不可空白']

const createDefaultList = () => ({
  snkey: '',
  name: '',
  date: dayjs().format('YYYY-MM-DD'),
  time: '',
  target: '',
  location: '',
  memberArray: [],
  scheduleArray: [{ time: '', content: '' }],
  device: '',
  leader: '',
  helper: '',
  picItems: [],
  explanation: '',
  suggest: '',
  createInfo: {},
  editInfo: [],
})

const list = reactive(createDefaultList())

const baseUrl = computed(() => store.state.base_url)

const userCounts = computed(() => {
  const men = list.memberArray.filter((item) => item.sex === '男').length
  const women = list.memberArray.filter((item) => item.sex === '女').length
  return `總人數:${list.memberArray.length}人, 男:${men}人, 女:${women}人`
})

const resetList = () => {
  Object.assign(list, createDefaultList())
}

const openAdd = () => {
  resetList()
  processType.value = 'add'
  existingPics.value = []
  previewImages.value = []
  dialog.value = true
}

const getPicName = (item) => {
  // 支援兩種資料格式：字串或物件
  if (typeof item === 'string') {
    return item
  }
  if (item && typeof item === 'object') {
    return item.picName || item
  }
  return item
}

const openEdit = (item) => {
  resetList()
  Object.assign(list, JSON.parse(JSON.stringify(item)))
  console.log('openEdit list: ', list)
  processType.value = 'edit'
  // 處理 picItems 可能是字串陣列或物件陣列
  existingPics.value = Array.isArray(item.picItems) 
    ? item.picItems.map(pic => {
        // 如果是字串，保持原樣
        if (typeof pic === 'string') {
          return pic
        }
        // 如果是物件，保持原樣（包含 picName, picOriginalName 等）
        return pic
      })
    : []
  previewImages.value = []
  dialog.value = true
}

const checkClose = async () => {
  if (previewImages.value.length > 0 || deletedPics.value.length > 0) {
    const confirmResult = await proxy?.$swal?.({
      title: '取消將清除所有變更（預覽照片及刪除標記），確認？',
      icon: 'question',
      toast: false,
      timer: null,
      showConfirmButton: true,
      showCancelButton: true,
      position: 'center',
    })
    if (!confirmResult?.isConfirmed) {
      return
    }
  }
  dialog.value = false
}

const uploadPictures = async () => {
  uploading.value = true
  const uploadedPics = []

  try {
    // 上傳新選擇的照片
    if (previewImages.value.length > 0) {
      for (const preview of previewImages.value) {
        if (preview.uploading || preview.uploaded) continue

        preview.uploading = true
        const fd = new FormData()
        fd.append('files[]', preview.file)
        if (list.snkey) {
          fd.append('snkey', list.snkey)
        }

        try {
          const rs = await api.uploadMulti('activity', fd)
          if (Array.isArray(rs) && rs.length > 0) {
            uploadedPics.push(...rs)
            preview.uploaded = true // 標記為已上傳
          }
        } catch (error) {
          console.error('上傳照片失敗:', error)
        } finally {
          preview.uploading = false
        }
      }
    }

    // 刪除標記為待刪除的照片（批量刪除）
    if (deletedPics.value.length > 0) {
      try {
        const picNames = deletedPics.value.map(pic => getPicName(pic))
        await api.delFileMulti('activity', picNames)
      } catch (error) {
        console.error('批量刪除照片失敗:', error)
        store.showToastMulti({
          type: 'error',
          message: '批量刪除照片失敗，請稍後再試',
          closeTime: 3,
        })
      }
    }

    // 合併結果：保留未刪除的已存在照片 + 新上傳的照片
    const remainingPics = existingPics.value.filter(pic => {
      const picName = getPicName(pic)
      return !deletedPics.value.some(deleted => getPicName(deleted) === picName)
    })

    return [...remainingPics, ...uploadedPics]
  } catch (error) {
    console.error('處理照片失敗:', error)
    store.showToastMulti({
      type: 'error',
      message: '照片處理失敗，請稍後再試',
      closeTime: 3,
    })
    return existingPics.value
  } finally {
    uploading.value = false
  }
}

const addOK = async () => {
  const result = await formRef.value?.validate()
  if (!result?.valid) {
    proxy?.$swal?.({
      title: '請填寫必填欄位',
      icon: 'warning',
      toast: true,
      timer: 2000,
      showConfirmButton: false,
    })
    return
  }

  // 上傳照片（新增時只需要上傳新照片，不需要處理刪除）
  if (previewImages.value.length > 0) {
    uploading.value = true
    const uploadedPics = []
    
    try {
      for (const preview of previewImages.value) {
        if (preview.uploaded) continue // 跳過已上傳的照片
        
        preview.uploading = true
        const fd = new FormData()
        fd.append('files[]', preview.file)

        const rs = await api.uploadMulti('activity', fd)
        if (Array.isArray(rs) && rs.length > 0) {
          uploadedPics.push(...rs)
          preview.uploaded = true // 標記為已上傳
        }
        preview.uploading = false
      }
      list.picItems = uploadedPics
    } catch (error) {
      console.error('上傳照片失敗:', error)
      store.showToastMulti({
        type: 'error',
        message: '照片上傳失敗，請稍後再試',
        closeTime: 3,
      })
      uploading.value = false
      return
    } finally {
      uploading.value = false
    }
  } else {
    list.picItems = []
  }

  emit('finish-add', JSON.parse(JSON.stringify(list)))
  dialog.value = false
}

const editOK = async () => {
  const result = await formRef.value?.validate()
  if (!result?.valid) {
    proxy?.$swal?.({
      title: '請填寫必填欄位',
      icon: 'warning',
      toast: true,
      timer: 2000,
      showConfirmButton: false,
    })
    return
  }

  // 上傳新照片並刪除標記的照片
  const uploadedPics = await uploadPictures()
  list.picItems = uploadedPics

  emit('finish-edit', JSON.parse(JSON.stringify(list)))
  dialog.value = false
}

const getUserData = async () => {
  const rs = await api.get(`user`)
  if (Array.isArray(rs)) {
    uitems.value = rs.map((i) => {
      const parsed = JSON.parse(i.datalist || '{}')
      return {
        ...parsed,
        snkey: i.snkey,
      }
    }).map((item) => ({
      snkey: item.snkey,
      text: `${item.name}`,
      sex: item.sex,
    }))
  }
}

const activityAdd = () => {
  list.scheduleArray.push({ time: '', content: '' })
}

const activityDel = (index) => {
  list.scheduleArray.splice(index, 1)
}

const onFileSelected = (event) => {
  const files = Array.from(event.target.files || [])
  if (files.length === 0) {
    event.target.value = ''
    return
  }

  const extensionTypes = ['gif', 'png', 'jpg', 'jpeg', 'webp']
  let errorMsg = ''

  files.forEach((file) => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !extensionTypes.includes(extension)) {
      errorMsg = `檔案:${file.name}不是支援的影像檔案格式`
      return
    }
    if (file.name.includes('++')) {
      errorMsg = `檔案:${file.name}檔名不可包含( ++ )`
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      errorMsg = `檔案:${file.name}不能超過5M`
      return
    }

    // 生成預覽
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImages.value.push({
        file,
        fileName: file.name,
        preview: e.target?.result?.toString() ?? '',
        uploading: false,
        uploaded: false // 新增上傳狀態標記
      })
    }
    reader.readAsDataURL(file)
  })

  if (errorMsg) {
    proxy?.$swal?.({
      title: errorMsg,
      icon: 'warning',
      toast: true,
      timer: 2500,
      showConfirmButton: false,
    })
  }

  event.target.value = ''
}

const removePreview = (index) => {
  previewImages.value.splice(index, 1)
}

const removeExistingPic = (item, index) => {
  // 標記為待刪除，不立即刪除
  deletedPics.value.push(item)
  existingPics.value.splice(index, 1)
  store.showToastMulti({
    type: 'info',
    message: '照片已標記為待刪除，確認修改時才會真正刪除',
    closeTime: 2,
  })
}

onMounted(() => {
  getUserData()
})

defineExpose({
  openAdd,
  openEdit,
})
</script>

<style scoped>
.d-none {
  display: none;
}
</style>
