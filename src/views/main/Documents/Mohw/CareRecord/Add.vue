<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-clipboard-text</v-icon>
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
          <!-- 照護日期和時間 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="primary-lighten-5" elevation="1" border>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="list.Date" type="date" label="照護日期" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-calendar" :rules="emptyRules"></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="list.Time" type="time" label="照護時間-開始" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-clock-outline" :rules="emptyRules"></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="list.Time2" type="time" label="照護時間-結束" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-clock-end" :rules="emptyRules"></v-text-field>
              </v-col>
            </v-row>
          </v-sheet>

          <!-- 生理監測 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="blue-lighten-5" elevation="1" border>
            <div class="d-flex align-center mb-3">
              <v-icon color="blue" class="mr-2">mdi-heart-pulse</v-icon>
              <h3 class="text-h6 font-weight-bold">生理監測</h3>
            </div>
            <v-row>
              <v-col cols="12" md="2">
                <v-text-field v-model="list.Height" type="number" label="身高/公分" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-human-male-height"></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field v-model="list.Weight" type="number" label="體重/公斤" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-scale-bathroom"></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <div class="d-flex align-center">
                  <v-text-field v-model="bmiValue" type="number" label="身體質量指數(BMI)" readonly variant="outlined"
                    density="comfortable" prepend-inner-icon="mdi-calculator"></v-text-field>
                  <span class="ml-2 text-body-2">kg/m²</span>
                </div>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field v-model="list.ArmW" type="number" label="臂中圍/公分" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-ruler"></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field v-model="list.LegW" type="number" label="小腿圍/公分" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-ruler"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="list.with_weight_other" type="text"
                  :label="`體重變化之原因(100字內) [目前字數：${list?.with_weight_other?.length || 0}]`" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-note-text"></v-text-field>
              </v-col>
            </v-row>
          </v-sheet>

          <!-- 照護管理類別 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="green-lighten-5" elevation="1" border>
            <div class="d-flex align-center mb-3">
              <v-icon color="green" class="mr-2">mdi-clipboard-list</v-icon>
              <h3 class="text-h6 font-weight-bold">照護管理類別</h3>
            </div>

            <!-- 是否發生跌倒 -->
            <v-sheet class="mb-4 pa-3" rounded="md" color="white" elevation="0" border>
              <v-select :items="YnItems" label="是否發生跌倒" v-model="list.IsFallDown" :rules="emptyRules"
                variant="outlined" density="comfortable" prepend-inner-icon="mdi-alert-circle"></v-select>
              <div v-if="list.IsFallDown == '是'">
                <div v-for="(item, index) in list.FallDowns" :key="index" class="mb-3">
                  <v-sheet class="pa-3" rounded="sm" color="grey-lighten-4" elevation="0" border>
                    <div class="d-flex align-center mb-2">
                      <v-icon @click="delArrEvent(list.FallDowns, index)" color="error" class="mr-2">mdi-close</v-icon>
                      <span class="text-body-2 font-weight-medium">跌倒事件 {{ index + 1 }}</span>
                    </div>
                    <v-row>
                      <v-col cols="12" md="2">
                        <v-text-field type="date" label="發生日期" v-model="item.Date" :rules="emptyRules"
                          variant="outlined" density="comfortable"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-select :items="timeItems" label="發生時間" v-model="item.Time" :rules="emptyRules"
                          variant="outlined" density="comfortable"></v-select>
                      </v-col>
                      <v-col cols="12" md="8">
                        <v-text-field :label="`發生原因(100字內) [目前字數：${item.Statement?.length || 0}]`"
                          v-model="item.Statement" :rules="emptyRules" variant="outlined" density="comfortable"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-sheet>
                </div>
                <v-btn @click="addArrEvent(list.FallDowns)" color="error" variant="tonal" prepend-icon="mdi-plus">新增跌倒</v-btn>
              </div>
            </v-sheet>

            <!-- 是否發生皮膚損傷 -->
            <v-sheet class="mb-4 pa-3" rounded="md" color="white" elevation="0" border>
              <v-select :items="YnItems"
                label="是否發生皮膚損傷*(新發生之皮膚損傷，排除收案前已有之皮膚損傷)" v-model="list.IsSkinDamages"
                :rules="emptyRules" variant="outlined" density="comfortable" prepend-inner-icon="mdi-alert-circle"></v-select>
              <div v-if="list.IsSkinDamages == '是'">
                <div v-for="(item, index) in list.SkinDamages" :key="index" class="mb-3">
                  <v-sheet class="pa-3" rounded="sm" color="grey-lighten-4" elevation="0" border>
                    <div class="d-flex align-center mb-2">
                      <v-icon @click="delArrEvent(list.SkinDamages, index)" color="error" class="mr-2">mdi-close</v-icon>
                      <span class="text-body-2 font-weight-medium">皮膚損傷 {{ index + 1 }}</span>
                    </div>
                    <v-row>
                      <v-col cols="12" md="6">
                        <div class="d-flex align-center">
                          <v-select :items="SkinDamagesItems" label="發生類型"
                            v-model="item.Kind" :rules="emptyObjRules" return-object item-title="Value" item-value="Value"
                            @update:model-value="(val) => handleKindChange(val, item)"
                            variant="outlined" density="comfortable" class="flex-grow-1"></v-select>
                          <v-text-field v-if="item.Kind?.Value == '其他'" class="ml-2" label="發生類型其他說明"
                            v-model="item.Kind.Other" :rules="emptyRules" variant="outlined" density="comfortable"
                            style="flex: 0 0 200px;"></v-text-field>
                        </div>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field type="date" label="發生日期" v-model="item.Date" :rules="emptyRules"
                          variant="outlined" density="comfortable"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-select :items="timeItems" label="發生時間" v-model="item.Time" :rules="emptyRules"
                          variant="outlined" density="comfortable"></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field :label="`發生原因(100字內) [目前字數：${item.Statement?.length || 0}]`"
                          v-model="item.Statement" :rules="emptyRules" variant="outlined" density="comfortable"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-sheet>
                </div>
                <v-btn @click="addArrEvent(list.SkinDamages)" color="error" variant="tonal" prepend-icon="mdi-plus">新增皮膚損傷</v-btn>
              </div>
            </v-sheet>

            <!-- 是否發生身體約束 -->
            <v-sheet class="mb-4 pa-3" rounded="md" color="white" elevation="0" border>
              <v-select :items="YnItems" label="是否發生身體約束" v-model="list.IsRestraint" :rules="emptyRules"
                variant="outlined" density="comfortable" prepend-inner-icon="mdi-alert-circle"></v-select>
              <div v-if="list.IsRestraint == '是'">
                <div v-for="(item, index) in list.Restraints" :key="index" class="mb-3">
                  <v-sheet class="pa-3" rounded="sm" color="grey-lighten-4" elevation="0" border>
                    <div class="d-flex align-center mb-2">
                      <v-icon @click="delArrEvent(list.Restraints, index)" color="error" class="mr-2">mdi-close</v-icon>
                      <span class="text-body-2 font-weight-medium">身體約束 {{ index + 1 }}</span>
                    </div>
                    <v-row>
                      <v-col cols="12" md="2">
                        <v-text-field type="date" label="發生日期" v-model="item.Date" :rules="emptyRules"
                          variant="outlined" density="comfortable"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-select :items="timeItems" label="發生時間" v-model="item.Time" :rules="emptyRules"
                          variant="outlined" density="comfortable"></v-select>
                      </v-col>
                      <v-col cols="12" md="8">
                        <v-text-field :label="`發生原因(100字內) [目前字數：${item.Statement?.length || 0}]`"
                          v-model="item.Statement" :rules="emptyRules" variant="outlined" density="comfortable"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-sheet>
                </div>
                <v-btn @click="addArrEvent(list.Restraints)" color="error" variant="tonal" prepend-icon="mdi-plus">新增身體約束</v-btn>
              </div>
            </v-sheet>

            <!-- 是否發生感染 -->
            <v-sheet class="mb-4 pa-3" rounded="md" color="white" elevation="0" border>
              <v-select :items="YnItems" label="是否發生感染" v-model="list.IsEmergency" :rules="emptyRules"
                variant="outlined" density="comfortable" prepend-inner-icon="mdi-alert-circle"></v-select>
              <div v-if="list.IsEmergency == '是'">
                <div v-for="(item, index) in list.Emergencys" :key="index" class="mb-3">
                  <v-sheet class="pa-3" rounded="sm" color="grey-lighten-4" elevation="0" border>
                    <div class="d-flex align-center mb-2">
                      <v-icon @click="delArrEvent(list.Emergencys, index)" color="error" class="mr-2">mdi-close</v-icon>
                      <span class="text-body-2 font-weight-medium">感染事件 {{ index + 1 }}</span>
                    </div>
                    <v-row>
                      <v-col cols="12" md="6">
                        <div class="d-flex align-center">
                          <v-select :items="EmergencysItems" label="發生類型"
                            v-model="item.Kind" :rules="emptyObjRules" return-object item-title="Value" item-value="Value"
                            @update:model-value="(val) => handleKindChange(val, item)"
                            variant="outlined" density="comfortable" class="flex-grow-1"></v-select>
                          <v-text-field v-if="item.Kind?.Value == '其他'" class="ml-2" label="發生類型其他說明"
                            v-model="item.Kind.Other" :rules="emptyRules" variant="outlined" density="comfortable"
                            style="flex: 0 0 200px;"></v-text-field>
                        </div>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field type="date" label="發生日期" v-model="item.Date" :rules="emptyRules"
                          variant="outlined" density="comfortable"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-select :items="timeItems" label="發生時間" v-model="item.Time" :rules="emptyRules"
                          variant="outlined" density="comfortable"></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field :label="`發生原因(100字內) [目前字數：${item.Statement?.length || 0}]`"
                          v-model="item.Statement" :rules="emptyRules" variant="outlined" density="comfortable"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-sheet>
                </div>
                <v-btn @click="addArrEvent(list.Emergencys)" color="error" variant="tonal" prepend-icon="mdi-plus">新增感染</v-btn>
              </div>
            </v-sheet>

            <!-- 是否發生非計畫性住院 -->
            <v-sheet class="mb-4 pa-3" rounded="md" color="white" elevation="0" border>
              <v-select :items="YnItems"
                label="是否發生非計畫性住院*(不在計畫中之住院，或非預期性的疾病變化而住院)" v-model="list.IsUnplanned"
                :rules="emptyRules" variant="outlined" density="comfortable" prepend-inner-icon="mdi-alert-circle"></v-select>
              <div v-if="list.IsUnplanned == '是'">
                <div v-for="(item, index) in list.Unplanneds" :key="index" class="mb-3">
                  <v-sheet class="pa-3" rounded="sm" color="grey-lighten-4" elevation="0" border>
                    <div class="d-flex align-center mb-2">
                      <v-icon @click="delArrEvent(list.Unplanneds, index)" color="error" class="mr-2">mdi-close</v-icon>
                      <span class="text-body-2 font-weight-medium">非計畫性住院 {{ index + 1 }}</span>
                    </div>
                    <v-row>
                      <v-col cols="12" md="6">
                        <div class="d-flex align-center">
                          <v-select :items="UnplannedsItems" label="發生類型"
                            v-model="item.Kind" :rules="emptyObjRules" return-object item-title="Value" item-value="Value"
                            @update:model-value="(val) => handleKindChange(val, item)"
                            variant="outlined" density="comfortable" class="flex-grow-1"></v-select>
                          <v-text-field v-if="item.Kind?.Value == '其他'" class="ml-2" label="發生類型其他說明"
                            v-model="item.Kind.Other" :rules="emptyRules" variant="outlined" density="comfortable"
                            style="flex: 0 0 200px;"></v-text-field>
                        </div>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field type="date" label="發生日期" v-model="item.Date" :rules="emptyRules"
                          variant="outlined" density="comfortable"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-select :items="timeItems" label="發生時間" v-model="item.Time" :rules="emptyRules"
                          variant="outlined" density="comfortable"></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field :label="`發生原因(100字內) [目前字數：${item.Statement?.length || 0}]`"
                          v-model="item.Statement" :rules="emptyRules" variant="outlined" density="comfortable"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-sheet>
                </div>
                <v-btn @click="addArrEvent(list.Unplanneds)" color="error" variant="tonal" prepend-icon="mdi-plus">新增非計畫性住院</v-btn>
              </div>
            </v-sheet>
          </v-sheet>

          <!-- 緊急事件紀錄 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="orange-lighten-5" elevation="1" border>
            <div class="d-flex align-center mb-3">
              <v-icon color="orange" class="mr-2">mdi-alert</v-icon>
              <h3 class="text-h6 font-weight-bold">緊急事件紀錄</h3>
            </div>
            <v-select :items="YnItems" label="是否發生緊急事件" v-model="list.IsEmergencyEvents" :rules="emptyRules"
              variant="outlined" density="comfortable" prepend-inner-icon="mdi-alert-circle"></v-select>
            <div v-if="list.IsEmergencyEvents == '是'">
              <div v-for="(item, index) in list.EmergencyEvents" :key="index" class="mb-3">
                <v-sheet class="pa-4" rounded="sm" color="white" elevation="0" border>
                  <div class="d-flex align-center mb-3">
                    <v-icon @click="delArrEvent(list.EmergencyEvents, index)" color="error" class="mr-2">mdi-close</v-icon>
                    <span class="text-body-1 font-weight-bold">緊急事件 {{ index + 1 }}</span>
                  </div>
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="d-flex align-center">
                        <v-select :items="EmergencyEventsItems" label="發生類型"
                          v-model="item.EmergencyType" :rules="emptyObjRules" return-object item-title="Value" item-value="Value"
                          variant="outlined" density="comfortable" class="flex-grow-1"></v-select>
                        <v-text-field v-if="item.EmergencyType?.Value == '其他'" class="ml-2" label="發生類型其他說明"
                          v-model="item.EmergencyType.Other" :rules="emptyRules" variant="outlined" density="comfortable"
                          style="flex: 0 0 200px;"></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field type="date" label="發生日期" v-model="item.Date" :rules="emptyRules"
                        variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-select :items="timeItems" label="發生時間" v-model="item.Time" :rules="emptyRules"
                        variant="outlined" density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field :label="`發生原因(100字內) [目前字數：${item.Reason?.length || 0}]`" v-model="item.Reason"
                        :rules="emptyRules" variant="outlined" density="comfortable" prepend-inner-icon="mdi-note-text"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="事件敘述" v-model="item.Description" :rules="emptyRules" variant="outlined"
                        density="comfortable" prepend-inner-icon="mdi-text"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="事件通報及處理過程" v-model="item.Process" :rules="emptyRules" variant="outlined"
                        density="comfortable" prepend-inner-icon="mdi-clipboard-text"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="事件檢討紀錄" v-model="item.Report" :rules="emptyRules" variant="outlined"
                        density="comfortable" prepend-inner-icon="mdi-file-document-edit"></v-text-field>
                    </v-col>
                  </v-row>
                </v-sheet>
              </div>
              <v-btn @click="addEmergencyEvents(list.EmergencyEvents)" color="error" variant="tonal" prepend-icon="mdi-plus">新增緊急事件</v-btn>
            </div>
          </v-sheet>

          <!-- 照護紀錄 -->
          <v-sheet class="mb-6 pa-4" rounded="lg" color="purple-lighten-5" elevation="1" border>
            <div class="d-flex align-center mb-3">
              <v-icon color="purple" class="mr-2">mdi-file-document-edit</v-icon>
              <h3 class="text-h6 font-weight-bold">照護紀錄</h3>
            </div>
            <v-textarea v-model="list.Statement" auto-grow variant="outlined" density="comfortable"
              placeholder="請填寫照護過程的詳細記錄" rows="4"></v-textarea>
          </v-sheet>
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
import { ref, reactive, computed, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const emit = defineEmits(['refresh', 'getAllData'])

const props = defineProps({
  useDataBase: {
    type: String,
    default: 'carerecord',
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
const list = reactive({})

const emptyRules = [(v) => !!v || '不可空白']
const emptyObjRules = [(v) => Boolean(Object.keys(v || {})[0]) || '不可空白']

const headerTitle = computed(() => (processType.value === 'add' ? '新增照護紀錄' : '修改照護紀錄'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民照護過程，包含生命徵象、身體狀況、照護措施等評估項目。'
    : '更新既有照護紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

const bmiValue = computed(() => {
  if (list.Height && list.Weight) {
    const heightVal = list.Height / 100
    return (list.Weight / (heightVal * heightVal)).toFixed(1)
  }
  return ''
})

const YnItems = ['是', '否']
const timeItems = ['大夜（00：00～08：00）', '白天（08：00～16：00）', '小夜（16：00～24：00）']

const SkinDamagesItems = [
  { Value: '一般性傷口', Other: null },
  { Value: '壓力性損傷', Other: null },
  { Value: '失禁性皮膚炎', Other: null },
  { Value: '撕膠皮膚損傷', Other: null },
  { Value: '其他', Other: null }
]

const EmergencysItems = [
  { Value: '呼吸道感染', Other: null },
  { Value: '泌尿道感染', Other: null },
  { Value: '疥瘡感染', Other: null },
  { Value: '其他', Other: null },
]

const UnplannedsItems = [
  { Value: '心血管代償機能減退', Other: null },
  { Value: '骨折之治療或評估', Other: null },
  { Value: '腸胃道出血', Other: null },
  { Value: '感染', Other: null },
  { Value: '呼吸系統', Other: null },
  { Value: '其他', Other: null },
]

const EmergencyEventsItems = [
  { Value: '管路滑脫', Other: null },
  { Value: '生命徵象惡化', Other: null },
  { Value: '自殺', Other: null },
  { Value: '藥物', Other: null },
  { Value: '暴力', Other: null },
  { Value: '跌倒', Other: null },
  { Value: '哽嗆', Other: null },
  { Value: '其他', Other: null },
]

const handleKindChange = (selectedValue, item) => {
  item.Kind = {
    Value: selectedValue?.Value || '',
    Other: selectedValue?.Other || null
  }
}

const addArrEvent = (arr) => {
  arr.push({
    Date: '',
    Time: '',
    Kind: {},
    Statement: ''
  })
}

const delArrEvent = async (Arr, index) => {
  const result = await proxy?.$swal?.({
    title: '確認刪除?',
    icon: 'question',
    showConfirmButton: true,
    showCancelButton: true,
    toast: false,
    timer: null,
    position: 'center'
  })

  if (result.isConfirmed) {
    Arr.splice(index, 1)
    store.showToastMulti({
      type: 'success',
      message: '已刪除;未執行新增/修改前,記錄將不會保存',
      closeTime: 2,
    })
  }
}

const addEmergencyEvents = (Arr) => {
  Arr.push({
    EmergencyType: {},
    Date: '',
    Time: '',
    Reason: '',
    Description: '',
    Process: '',
    Report: '',
    CreateID: store.state.pData.idNum || 'DMSTEST01'
  })
}

const defaultList = {
  FallDowns: [
    {
      Date: '',
      Time: '',
      Kind: null,
      Statement: ''
    }
  ],
  SkinDamages: [
    {
      Date: '',
      Time: '',
      Kind: {},
      Statement: ''
    }
  ],
  Restraints: [
    {
      Date: '',
      Time: '',
      Kind: null,
      Statement: ''
    }
  ],
  Emergencys: [
    {
      Date: '',
      Time: '',
      Kind: {},
      Statement: ''
    }
  ],
  Unplanneds: [
    {
      Date: '',
      Time: '',
      Kind: {},
      Statement: ''
    }
  ],
  EmergencyEvents: [
    {
      EmergencyType: {},
      Date: '',
      Time: '',
      Reason: '',
      Description: '',
      Process: '',
      Report: '',
      CreateID: store.state.pData.idNum || 'DMSTEST01'
    }
  ]
}

const openForAdd = () => {
  processType.value = 'add'
  Object.keys(list).forEach(key => delete list[key])
  Object.assign(list, JSON.parse(JSON.stringify(defaultList)))

  if (props.items && props.items.length > 0) {
    const firstItem = JSON.parse(JSON.stringify(props.items[0]))
    delete firstItem.snkey
    delete firstItem.user_snkey
    delete firstItem.createInfo
    delete firstItem.create_man
    delete firstItem.create_man_snkey
    delete firstItem.editInfo
    delete firstItem.edit_man
    delete firstItem.uploadData
    delete firstItem.uploadState
    const normalizedItem = normalizeEventData(firstItem)
    Object.assign(list, normalizedItem)
  }

  dialog.value = true
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const normalizeKindObject = (kind) => {
  if (!kind) return {}
  if (typeof kind === 'string') {
    // 如果是字符串，嘗試在 items 中查找匹配的對象
    return { Value: kind, Other: null }
  }
  if (kind.Value) {
    return { Value: kind.Value, Other: kind.Other || null }
  }
  return {}
}

const normalizeEventData = (data) => {
  // 標準化 SkinDamages
  if (data.SkinDamages && Array.isArray(data.SkinDamages)) {
    data.SkinDamages = data.SkinDamages.map(item => ({
      ...item,
      Kind: normalizeKindObject(item.Kind)
    }))
  }
  // 標準化 Emergencys
  if (data.Emergencys && Array.isArray(data.Emergencys)) {
    data.Emergencys = data.Emergencys.map(item => ({
      ...item,
      Kind: normalizeKindObject(item.Kind)
    }))
  }
  // 標準化 Unplanneds
  if (data.Unplanneds && Array.isArray(data.Unplanneds)) {
    data.Unplanneds = data.Unplanneds.map(item => ({
      ...item,
      Kind: normalizeKindObject(item.Kind)
    }))
  }
  // 標準化 EmergencyEvents
  if (data.EmergencyEvents && Array.isArray(data.EmergencyEvents)) {
    data.EmergencyEvents = data.EmergencyEvents.map(item => ({
      ...item,
      EmergencyType: normalizeKindObject(item.EmergencyType)
    }))
  }
  return data
}

const openForEdit = (item) => {
  dialog.value = true
  processType.value = 'edit'
  Object.keys(list).forEach(key => delete list[key])
  const itemCopy = JSON.parse(JSON.stringify(item))
  const normalizedItem = normalizeEventData(itemCopy)
  Object.assign(list, normalizedItem)
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
  list.bmi = bmiValue.value

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
  list.bmi = bmiValue.value

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
