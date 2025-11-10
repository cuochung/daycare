<template>
  <div class="userlist">
    <v-row>
      <v-col cols="12">
        <v-sheet class="userlist__hero" elevation="0" rounded="xl">
          <div class="userlist__hero-content d-flex justify-space-between align-center">
            <div class="d-flex align-center mb-2">
              <v-avatar size="44" color="primary" variant="tonal" class="mr-3">
                <v-icon color="primary">mdi-badge-account-horizontal</v-icon>
              </v-avatar>
              <div>
                <h2 class="userlist__title mb-1">病歷管理 & 維護</h2>
                <p class="userlist__subtitle mb-0">維護日間照護服務團隊，快速掌握病歷資訊與即時狀態。</p>
              </div>
            </div>

            <div class="d-flex align-center">
              <v-chip class="userlist__tag" prepend-icon="mdi-theme-light-dark" size="small" variant="outlined">
                Daycare Style
              </v-chip>
              <v-spacer></v-spacer>
              <v-btn class="ml-2" variant="outlined" color="primary" size="small" prepend-icon="mdi-refresh"
                @click="getAllData">
                重新整理
              </v-btn>
            </div>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-sheet class="userlist__toolbar" elevation="0" rounded="xl">
          <v-row align="center" no-gutters>
            <v-col cols="12" md="8">
              <v-text-field v-if="auth.user_search_key" v-model="searchKey" label="搜尋住民關鍵字" density="comfortable"
                variant="outlined" prepend-inner-icon="mdi-magnify" hide-details single-line class="pr-md-4"
                @keyup.shift.alt.72="changeHidden"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="d-flex justify-end mt-3 mt-md-0">
              <popupadd v-if="auth.user_add_key" ref="childFn" @getAllData="getAllData"></popupadd>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>

    <PaginatedIterator :items="filteredItems" v-model:items-per-page="itemsPerPage"
      :items-per-page-options="itemsPerPageOptions" class="mt-4">
      <template #default="{ items }">
        <v-card variant="outlined" class="user-panel">
          <v-card-title class="d-flex align-center user-panel__title">
            <div>
              <div class="text-subtitle-1 font-weight-bold">目前總筆數：{{ itemsTotal }}</div>
              <div class="text-caption text-medium-emphasis">顯示筆數：{{ filteredCount }}</div>
            </div>
            <v-spacer></v-spacer>
            <div class="d-flex align-center gap-2"></div>
          </v-card-title>

          <v-card-text class="pa-0">
            <v-list class="user-list" lines="three">
              <template v-for="({ raw }, index) in items" :key="raw?.snkey ?? index">
                <v-list-item :class="[
                    'user-list__item',
                    raw?.sex === '男' ? 'user-list__item--male' : 'user-list__item--female'
                  ]" @click.stop="edit(raw)">
                  <template #prepend>
                    <v-avatar size="64" color="primary-lighten-5">
                      <img v-if="raw?.pic_url && raw.pic_url !== 'lazypic.jpg'"
                        :src="`${baseUrl}/upload/thumb/${raw.pic_url}`" :alt="raw?.name ?? 'user'"
                        class="user-avatar" />
                      <v-icon v-else color="primary">mdi-account-circle</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="d-flex align-center">
                    <v-icon color="yellow" size="20" v-if="raw?.hidden === 'true'">
                      mdi-eye-off-outline
                    </v-icon>
                    <span class="ml-2 font-weight-medium">
                      {{ raw?.p_code ?? '--' }} / {{ raw?.name ?? '未命名' }}
                    </span>
                  </v-list-item-title>

                  <v-list-item-subtitle class="text-body-2">
                    性別：{{ raw?.sex ?? '未知' }}　
                    入住：{{ raw?.in_date || '未知' }}
                  </v-list-item-subtitle>

                  <div class="d-flex align-center flex-wrap mt-2 gap-2">
                    <v-chip v-if="raw?.publicexpenses === 'true'" size="small" class="status-chip status-chip--public"
                      variant="tonal">
                      公費
                    </v-chip>
                    <v-chip v-if="raw?.dnr === 'true'" size="small" class="status-chip status-chip--dnr"
                      variant="tonal">
                      <v-icon size="16">mdi-heart-circle</v-icon>
                    </v-chip>
                    <!-- <v-chip v-if="raw?.takeadayoff" size="small" class="status-chip status-chip--leave" variant="tonal">
                      請假中
                    </v-chip>
                    <v-chip v-if="raw?.behospitalized" size="small" class="status-chip status-chip--hospital"
                      variant="tonal">
                      住院中
                    </v-chip> -->
                    <v-chip size="small" class="status-chip status-chip--edit" variant="tonal">最後異動：{{ raw?.updateTime
                      ?? '--' }}</v-chip>
                  </div>

                  <template #append>
                    <div class="d-flex align-center">
                      <v-btn icon size="small" color="primary" variant="tonal" class="mr-1" @click.stop="print(raw)">
                        <v-icon>mdi-printer</v-icon>
                      </v-btn>
                      <v-btn icon size="small" color="success" variant="text" class="mr-1"
                        @click.stop="goDocument(raw)">
                        <v-icon>mdi-view-list</v-icon>
                      </v-btn>
                      <v-btn v-if="auth.user_del_key" icon size="small" color="error" variant="text" :loading="loading"
                        :disabled="loading" @click.stop="del(raw)">
                        <v-icon>mdi-account-remove-outline</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-list-item>
                <v-divider inset></v-divider>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </template>
    </PaginatedIterator>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'
import popupadd from '@/views/main/User/Add.vue'

import PaginatedIterator from '@/components/PaginatedIterator.vue'

const store = useStore()
const router = useRouter()
const { proxy } = getCurrentInstance()

const usingDatabase = ref('user')
const childFn = ref(null)
const allItems = ref([])
const searchKey = ref('')
const itemsPerPage = ref(12)
const itemsPerPageOptions = [
  { title: '12', value: 12 },
  { title: '24', value: 24 },
  { title: '36', value: 36 }
]
const loading = ref(false)
const userHidden = ref(store.state.cData?.sethidden ?? '')

const baseUrl = computed(() => store.state.base_url)
const auth = computed(() => store.state.pData ?? {})
const itemsTotal = computed(() => allItems.value.length)
const filteredItems = computed(() => {
  const keys = searchKey.value.trim().split(/\s+/).filter(Boolean)
  if (keys.length === 0) {
    return allItems.value
  }

  return allItems.value.filter((item) => {
    const content = JSON.stringify(item).toUpperCase()
    return keys.every((key) => content.includes(key.toUpperCase()))
  })
})

const filteredCount = computed(() => filteredItems.value.length)

const sortBy = (data) => {
  return data.sort((a, b) => {
    const valA = a.bed_name
    const valB = b.bed_name

    if (valA === valB) return 0
    if (valA === null) return 1
    if (valB === null) return -1
    return valA > valB ? 1 : -1
  })
}

const getAllData = async () => {
  const response = await api.get('user')

  // console.log('response user', response)

  let data = response.map((i) => ({
    ...JSON.parse(i.datalist),
    snkey: i.snkey,
    createTime: i.createTime,
    updateTime: i.updateTime,
  }))

  if (userHidden.value === 'true') {
    data = data.filter((item) => item.hidden === '')
  }

  allItems.value = sortBy(data)
}

const changeHidden = () => {
  userHidden.value = userHidden.value === 'true' ? 'false' : 'true'
  getAllData()
}

const edit = (item) => {
  if (auth.value.user_edit_key && childFn.value?.editProcess) {
    childFn.value.editProcess(item)
      } else {
    store.showToastMulti({
      type: 'warning',
      message: '修改功能未授權!!',
      closeTime: 2,
    })
  }
}

const del = async (item) => {
  proxy.$swal({
    title: '確認要刪除嗎?',
    text: '此操作無法復原',
    icon: 'warning',
    toast: false,
    timer: null,
    showConfirmButton: true,
    showCancelButton: true,
    position: 'center'
  }).then(async (result) => {
    if (result.isConfirmed) {

      item.delInfo = {
        name: store.state.pData.name,
        time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      }

      const postData = {
        snkey: item.snkey,
        tablename: usingDatabase.value,
        datalist: JSON.stringify(item),
      }

      const rs = await api.delete(usingDatabase.value, postData)
      if (rs.state == 1) {


        if (item.picInfo && item.picInfo.picName && item.picInfo.picName != "lazypic.jpg") {
          console.log('del process run del pic')
          await delExistPic(uploadItem.value.picInfo.picName)
        }

        proxy.$swal({
          icon: "success",
          title: "刪除成功",
          confirmButtonText: '確定',
          confirmButtonColor: '#3085d6',
          allowEscapeKey: false
        })

        await getAllData();
      }
    }
  })
}


const print = (item) => {
  const routeData = router.resolve({
    path: '/print/userprint',
    query: { data: JSON.stringify(item) }
  })
  window.open(routeData.href, '_blank')
}

const goDocument = (item) => {
  sessionStorage.setItem('uData', JSON.stringify(item))
  if (store.state.pData.pharmacist_key) {
    router.push('/main/document/pharmacistevaluationlist')
      } else {
    router.push('/main/document/medicinerecordlist')
  }
}


onMounted(async () => {
  await getAllData()
})
</script>

<style scoped lang="scss">
.userlist {
  padding: 12px;
  background: linear-gradient(135deg, rgba(168, 197, 181, 0.25), rgba(123, 163, 184, 0.18));

  .userlist__container {
    max-width: 1320px;
    margin: 0 auto;
  }

  .userlist__hero {
    background: linear-gradient(135deg, rgba(74, 107, 95, 0.18), rgba(123, 163, 184, 0.2));
    border: 1px solid var(--daycare-divider-light);
    box-shadow: 0 10px 24px rgba(74, 107, 95, 0.18);
    padding: 24px;
  }

  .userlist__hero-content {
    color: var(--daycare-primary);
  }

  .userlist__title {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--daycare-primary);
  }

  .userlist__subtitle {
    color: rgba(74, 107, 95, 0.85);
  }

  .userlist__tag {
    border-color: rgba(90, 122, 111, 0.35) !important;
    color: var(--daycare-primary) !important;
    background-color: rgba(90, 122, 111, 0.1);
  }

  .userlist__summary-row {
    margin-top: 16px;
  }

  .summary-card {
    border-radius: 18px;
    padding: 20px 22px;
    box-shadow: 0 12px 30px rgba(74, 107, 95, 0.12);
    border: 1px solid rgba(91, 143, 163, 0.18);

    &__title {
      font-size: 0.95rem;
      font-weight: 600;
      color: rgba(74, 107, 95, 0.85);
      letter-spacing: 1px;
    }

    &__value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--daycare-primary);
      margin: 8px 0;
    }

    &__caption {
      font-size: 0.85rem;
      color: rgba(74, 107, 95, 0.6);
    }
  }

  .userlist__toolbar {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--daycare-divider-light);
    padding: 16px 20px;
    box-shadow: 0 8px 24px var(--daycare-shadow-light);
  }

  .user-panel {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid var(--daycare-divider-light);
    box-shadow: 0 10px 30px var(--daycare-shadow-light);
    backdrop-filter: blur(8px);
  }

  .user-panel__title {
    color: var(--daycare-primary);
  }

  .user-list {
    padding-inline: 0;
  }

  .user-list__item {
    border-left: 4px solid transparent;
    transition: background-color 0.2s ease, transform 0.2s ease;
    border-radius: 12px;
    margin: 6px 12px;
    padding-block: 12px;
    background-color: rgba(255, 255, 255, 0.6);

    &:hover {
      background-color: var(--daycare-divider-light);
      transform: translateX(2px);
    }
  }

  .user-list__item--male {
    border-left-color: var(--daycare-primary);
  }

  .user-list__item--female {
    border-left-color: var(--daycare-accent);
  }

  .user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 4px 12px var(--daycare-shadow);
  }

  .gap-2 {
    gap: 8px;
  }

  .status-chip {
    color: var(--daycare-primary);
    background-color: rgba(74, 107, 95, 0.12) !important;
    font-weight: 500;

    &--public {
      color: var(--daycare-primary);
    }

    &--dnr {
      color: #c95050;
      background-color: rgba(201, 80, 80, 0.12) !important;
    }

    &--leave {
      color: #2f855a;
      background-color: rgba(47, 133, 90, 0.12) !important;
    }

    &--hospital {
      color: #d97706;
      background-color: rgba(217, 119, 6, 0.12) !important;
    }
  }
}
</style>