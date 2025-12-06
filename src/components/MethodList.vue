<template>
  <div class="methodlist">
    <v-dialog v-model="dialog" width="70%">
      <template v-slot:activator="{ props: activatorProps }">
        <v-icon color="brown" dark large v-bind="activatorProps" @click="enterProcess">mdi-cog-box</v-icon>
      </template>

      <v-card>
        <v-card-title :class="titleStyle" primary-title>{{ title }}</v-card-title>

        <v-card-text>
          <v-form ref="formRef" class="mt-3">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  prepend-inner-icon="mdi-format-list-bulleted"
                  label="用法名 or 搜尋"
                  v-model="list.name"
                  :rules="emptyRules"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn color="primary" variant="flat" block @click="addOK" v-show="!editMode">確認新增</v-btn>
                <v-btn color="success" variant="flat" block @click="editOK" v-show="editMode">確認修改</v-btn>
                <v-btn color="error" variant="flat" block class="mt-1" @click="cancelEditMode" v-show="editMode">取消修改</v-btn>
              </v-col>
            </v-row>
          </v-form>

          <v-card class="my-2" v-show="!editMode" style="overflow:auto" rounded="lg" variant="outlined">
            <v-card-text>
              <v-sheet color="primary" variant="tonal" class="text-center pa-2 mb-3" rounded="md">
                <h3 class="text-subtitle-1 font-weight-medium">已建構用法列表(點選可修改)</h3>
              </v-sheet>
              <v-list height="50vh" lines="two">
                <v-list-item
                  v-for="(item, i) in filterItems"
                  :key="i"
                  :value="item"
                  @click.stop="enterEditMode(item)"
                  variant="tonal"
                  class="mb-1"
                >
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-format-list-bulleted</v-icon>
                  </template>
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                  <template v-slot:append>
                    <v-btn
                      icon="mdi-delete-outline"
                      variant="text"
                      color="error"
                      size="small"
                      @click.stop="del(item)"
                    />
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const emit = defineEmits(['getSelect'])

const store = useStore()
const { proxy } = getCurrentInstance()

const items = ref([])
const list = reactive({
  name: '',
})
const dialog = ref(false)
const title = ref('')
const titleStyle = ref('')
const editMode = ref(false)
const formRef = ref(null)

const emptyRules = [(v) => !!v || '不可空白']

const filterItems = computed(() => {
  if (items.value.length > 0) {
    const searchStr = list.name.toUpperCase()
    return items.value.filter((item) => {
      const str = JSON.stringify(item).toUpperCase()
      return str.includes(searchStr)
    })
  }
  return []
})

const getAllData = async () => {
  try {
    const response = await api.get('method')
    if (response && response.length > 0) {
      const newData = response.map((item) => ({
        snkey: item.snkey,
        name: item.name,
        text: item.name,
      }))
      items.value = newData.sort((a, b) => {
        return parseInt(a.snkey) < parseInt(b.snkey) ? 1 : -1
      })
    }
  } catch (error) {
    console.error('getAllData error:', error)
  }
}

const enterProcess = () => {
  title.value = '用法資料管理'
  titleStyle.value = 'font-weight-black primary lighten-2'
}

const addOK = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) return

  // 判斷重覆
  const repeat = items.value.find((item) => list.name == item.name)

  if (repeat !== undefined) {
    store.showToastMulti({
      type: 'warning',
      message: '不可重覆!!',
      closeTime: 3,
    })
    return
  }

  list.create_man = store.state.pData.username + '(' + dayjs().format('YYYY-MM-DD HH:mm:ss') + ')'

  try {
    const postData = {
      name: list.name,
      create_man: list.create_man,
    }

    const response = await api.add('method', postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已新增',
        closeTime: 2,
      })
      getAllData()
      list.name = ''
      formRef.value?.resetValidation()
      emit('getSelect')
    }
  } catch (error) {
    console.error('addOK error:', error)
    store.showToastMulti({
      type: 'error',
      message: '新增失敗，請稍後再試',
      closeTime: 3,
    })
  }
}

const del = async (delData) => {
  const result = await proxy.$swal({
    title: '確認刪除?',
    text: '此操作無法復原',
    icon: 'question',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center',
  })

  if (result.isConfirmed) {
    delData.delman = store.state.pData.username + '(' + dayjs().format('YYYY-MM-DD HH:mm:ss') + ')'

    const postData = {
      snkey: delData.snkey,
      tablename: 'method',
      info: JSON.stringify(delData),
    }

    try {
      const response = await api.delete('method', postData)
      if (response?.state == 1) {
        store.showToastMulti({
          type: 'success',
          message: '已刪除',
          closeTime: 2,
        })
        getAllData()
        emit('getSelect')
      }
    } catch (error) {
      console.error('del error:', error)
      store.showToastMulti({
        type: 'error',
        message: '刪除失敗，請稍後再試',
        closeTime: 3,
      })
    }
  }
}

const enterEditMode = (item) => {
  list.snkey = item.snkey
  list.name = item.text
  list.edit_man = ''
  editMode.value = true
}

const editOK = async () => {
  try {
    const postData = {
      snkey: list.snkey,
      name: list.name,
      edit_man: list.edit_man || store.state.pData.username + '(' + dayjs().format('YYYY-MM-DD HH:mm:ss') + ')',
    }

    const response = await api.post('method', postData)
    if (response?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已修改',
        closeTime: 2,
      })
      getAllData()
      emit('getSelect')
      list.name = ''
      formRef.value?.resetValidation()
      editMode.value = false
    }
  } catch (error) {
    console.error('editOK error:', error)
    store.showToastMulti({
      type: 'error',
      message: '修改失敗，請稍後再試',
      closeTime: 3,
    })
  }
}

const cancelEditMode = () => {
  editMode.value = false
  list.name = ''
  formRef.value?.resetValidation()
}

onMounted(() => {
  getAllData()
})
</script>

<style lang="scss">
// .methodlist{
//   font-family: '微軟正黑體';
// }
</style>

