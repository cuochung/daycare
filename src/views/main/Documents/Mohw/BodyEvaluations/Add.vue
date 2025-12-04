<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card rounded="xl">
      <v-sheet :color="headerColor" class="d-flex align-center justify-space-between px-6 py-4" rounded="t-xl">
        <div class="d-flex align-center">
          <v-avatar size="48" color="white" variant="tonal" class="mr-4">
            <v-icon color="white" size="28">mdi-account-cog</v-icon>
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
          <v-row class="mb-4">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="list.Date"
                type="date"
                label="評估日期"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-calendar"
                :rules="requiredDateRules"
              />
            </v-col>
          </v-row>

            <div class="zoneStyle">
              <h2>意識</h2>
              <v-row>
                <v-col cols="4" class="pt-0">
                  <v-autocomplete label="睜眼" :items="mind1Items" v-model="list.mind1" :rules="emptyRules" return-object
                    item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                </v-col>
                <v-col cols="4" class="pt-0">
                  <v-autocomplete label="語言" :items="mind2Items" v-model="list.mind2" :rules="emptyRules" return-object
                    item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                </v-col>
                <v-col cols="4" class="pt-0">
                  <v-autocomplete label="運動" :items="mind3Items" v-model="list.mind3" :rules="emptyRules" return-object
                    item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                </v-col>
              </v-row>
            </div>

            <div class="zoneStyle">
              <h2>視力</h2>
              <v-autocomplete label="視力" :items="vision1Items" v-model="list.vision1" :rules="emptyRules" return-object
                item-title="text" item-value="text" class="mt-0"></v-autocomplete>
              <div v-if="list.vision1 && list.vision1.text && list.vision1.text == '有障礙'">

                <v-select label="視力-部位" :items="vision2Items" v-model="list.vision2" :rules="emptyRules" return-object
                  item-title="text" item-value="text" class="mt-0" multiple></v-select>
                <v-text-field label="視力-部位-左眼其他說明" v-model="list.vision2[0].V_HAS_OBS_Y_L_OTHER"
                  v-if="list.vision2 && JSON.stringify(list.vision2).includes('左眼其他')" :rules="emptyRules"></v-text-field>
                <v-text-field label="視力-部位-右眼其他說明" v-model="list.vision2[0].V_HAS_OBS_Y_R_OTHER"
                  v-if="list.vision2 && JSON.stringify(list.vision2).includes('右眼其他')" :rules="emptyRules"></v-text-field>
                <!-- <v-text-field label="視力-部位-其他說明(左右眼都有其他時，請用小寫,隔開)" v-model="list.vision2[0].Other"
                  v-if="JSON.stringify(list.vision2).includes('其他')" :rules="emptyRules"></v-text-field> -->

                <v-autocomplete label="視力-影響日常活動" :items="vision3Items" v-model="list.vision3" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <div class="d-flex">
                  <v-autocomplete label="視力-輔具" :items="vision4Items" v-model="list.vision4" :rules="emptyRules"
                    return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                  <v-autocomplete label="選擇輔具" :items="vision4MultipleAnswerItems" v-model="list.vision4.MultipleAnswer"
                    :rules="emptyObjRules" class="mt-0 mx-2"
                    v-if="list.vision4 && list.vision4.text && list.vision4.text == '有'" multiple></v-autocomplete>
                  <v-text-field label="其他相關說明" v-model="list.vision4.Other"
                    v-if="list.vision4 && list.vision4.MultipleAnswer && list.vision4.MultipleAnswer.includes('其他')"
                    class="mt-0 mx-2" :rules="emptyRules"></v-text-field>
                </div>
              </div>
            </div>

            <div class="zoneStyle">
              <h2>聽力</h2>
              <v-autocomplete label="聽力" :items="hearing1Items" v-model="list.hearing1" :rules="emptyObjRules"
                return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
              <div v-if="list.hearing1 && list.hearing1.text == '有障礙'">
                <v-autocomplete label="聽力-部位" :items="hearing2Items" v-model="list.hearing2" :rules="emptyObjRules"
                  return-object item-title="text" item-value="text" class="mt-0" multiple></v-autocomplete>
                <v-autocomplete label="聽力-影響日常活動" :items="hearing3Items" v-model="list.hearing3" :rules="emptyObjRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <div class="d-flex">
                  <v-autocomplete label="聽力-輔具" :items="hearing4Items" v-model="list.hearing4" return-object
                    item-title="text" item-value="text" class="mt-0" :rules="emptyObjRules"></v-autocomplete>
                  <v-autocomplete label="選擇輔具" :items="hearing4MultipleAnswerItems"
                    v-model="list.hearing4.MultipleAnswer" :rules="emptyObjRules" class="mt-0 mx-2"
                    v-if="list.hearing4 && list.hearing4.text == '有'" multiple></v-autocomplete>
                  <v-text-field label="其他相關說明" v-model="list.hearing4.Other"
                    v-if="list.hearing4 && list.hearing4.MultipleAnswer && list.hearing4.MultipleAnswer.includes('其他')"
                    class="mt-0 mx-2" :rules="emptyRules"></v-text-field>
                  <!-- <v-autocomplete label="選擇耳朵" :items="hearing4OtherItems" v-model="list.hearing4.Other" :rules="emptyObjRules" class="mt-0 mx-2" v-if="list.hearing4 && list.hearing4.MultipleAnswer" multiple></v-autocomplete> -->
                </div>
              </div>
            </div>

            <div class="zoneStyle">
              <h2>溝通</h2>
              <v-autocomplete label="溝通" :items="communicate1Items" v-model="list.communicate1" :rules="emptyRules"
                return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
              <div v-if="list.communicate1 && list.communicate1.text == '有障礙'" class="d-flex">
                <v-autocomplete label="影響日常活動" :items="communicate2Items" v-model="list.communicate2"
                  :rules="emptyRules" return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-autocomplete label="說話" :items="communicate3Items" v-model="list.communicate3" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0 mx-2"></v-autocomplete>
                <v-autocomplete label="理解" :items="communicate4Items" v-model="list.communicate4" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
              </div>
            </div>

            <div class="zoneStyle">
              <h2>口腔</h2>
              <div class="d-flex">
                <v-autocomplete label="口腔外觀" :items="oralCavity1Items" v-model="list.oralCavity1" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-autocomplete label="選擇異常狀況" :items="oralCavity1MultipleAnswerItems"
                  v-model="list.oralCavity1.MultipleAnswer" :rules="emptyObjRules" class="mt-0 mx-2"
                  v-if="list.oralCavity1 && list.oralCavity1.text == '異常'" multiple></v-autocomplete>
                <v-text-field label="其他內容說明" v-model="list.oralCavity1.Other" :rules="emptyObjRules"
                  v-if="list.oralCavity1 && list.oralCavity1.text == '異常' && list.oralCavity1.MultipleAnswer && list.oralCavity1.MultipleAnswer.includes('其他')"></v-text-field>
              </div>
              <div class="d-flex align-center">
                <v-autocomplete label="特殊進食" :items="oralCavity2Items" v-model="list.oralCavity2" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-autocomplete label="選擇異常狀況" :items="oralCavity2MultipleAnswerItems"
                  v-model="list.oralCavity2.MultipleAnswer" :rules="emptyObjRules" class="mt-0 mx-2"
                  v-if="list.oralCavity2 && list.oralCavity2.text == '有'" multiple></v-autocomplete>
                <v-text-field label="特殊種類說明" v-model="list.oralCavity2.Other" :rules="emptyRules"
                  v-if="list.oralCavity2 && list.oralCavity2.MultipleAnswer && list.oralCavity2.MultipleAnswer.includes('特殊種類')"></v-text-field>
              </div>
              <div class="d-flex align-center">
                <v-autocomplete label="假牙狀況" :items="oralCavity3Items" v-model="list.oralCavity3" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-autocomplete label="選擇位置" :items="oralCavity3MultipleAnswerItems"
                  v-model="list.oralCavity3.MultipleAnswer" :rules="emptyObjRules" class="mt-0 mx-2"
                  v-if="list.oralCavity3 && list.oralCavity3.text == '有活動假牙'" multiple></v-autocomplete>
                <v-text-field label="其他位置說明" v-model="list.oralCavity3.Other" :rules="emptyRules"
                  v-if="list.oralCavity3 && list.oralCavity3.text == '有活動假牙' && list.oralCavity3.MultipleAnswer && list.oralCavity3.MultipleAnswer.includes('其他')"></v-text-field>
              </div>

              <div>
                <v-autocomplete label="備有個人口腔清潔工具" :items="oralCavity4Items" v-model="list.oralCavity4"
                  :rules="emptyRules" return-object item-title="text" item-value="text"></v-autocomplete>

                <div v-if="list.oralCavity4 && list.oralCavity4.text == '有'">
                  <h2 class="red--text">以下三項至少要選擇其中一項</h2>
                  <v-autocomplete label="備有個人口腔清潔工具-有自然牙、固定或活動假牙者" :items="oralCavity5MultipleAnswerItems"
                    v-model="list.oralCavity5MultipleAnswer" multiple></v-autocomplete>
                  <v-autocomplete label="備有個人口腔清潔工具-配戴活動假牙者" :items="oralCavity6MultipleAnswerItems"
                    v-model="list.oralCavity6MultipleAnswer" multiple></v-autocomplete>
                  <v-autocomplete label="備有個人口腔清潔工具-全口無牙且無活動假牙者" :items="oralCavity7MultipleAnswerItems"
                    v-model="list.oralCavity7MultipleAnswer" multiple></v-autocomplete>
                </div>
              </div>

              <div>
                <v-autocomplete label="口腔保健情形。平均每日執行飯後、睡前口腔清潔工作" :items="oralCavity8MultipleAnswerItems"
                  v-model="list.oralCavity8MultipleAnswer" :rules="emptyRules"></v-autocomplete>
              </div>

            </div>

            <div class="zoneStyle">
              <h2>胃腸</h2>
              <div class="d-flex justify-space-between">
                <div class="d-flex">
                  <v-autocomplete label="腹部狀態" :items="Gastrointestinal1Items" v-model="list.Gastrointestinal1"
                    :rules="emptyRules" return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                  <v-text-field label="其他內容說明" v-model="list.Gastrointestinal1.Other" :rules="emptyRules"
                    v-if="list.Gastrointestinal1 && list.Gastrointestinal1.text == '其他'"
                    class="mt-0 mx-2"></v-text-field>
                </div>
                <div class="d-flex">
                  <v-autocomplete label="腸蠕動" :items="Gastrointestinal2Items" v-model="list.Gastrointestinal2"
                    :rules="emptyRules" return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                  <v-text-field label="其他內容說明" v-model="list.Gastrointestinal2.Other" :rules="emptyRules"
                    v-if="list.Gastrointestinal2 && list.Gastrointestinal2.text == '其他'"
                    class="mt-0 mx-2"></v-text-field>
                </div>
                <div class="d-flex">
                  <v-autocomplete label="消化狀態" :items="Gastrointestinal3Items" v-model="list.Gastrointestinal3"
                    :rules="emptyRules" return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                  <v-text-field label="其他內容說明" v-model="list.Gastrointestinal3.Other" :rules="emptyRules"
                    v-if="list.Gastrointestinal3 && list.Gastrointestinal3.text == '其他'"
                    class="mt-0 mx-2"></v-text-field>
                </div>
              </div>
            </div>

            <div class="zoneStyle">
              <h2>排泄</h2>
              <h3>排便情況</h3>
              <div class="d-flex">
                <v-autocomplete label="排便型態" :items="excretion1Items" v-model="list.excretion1" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-text-field label="其他內容說明" v-model="list.excretion1.Other" :rules="emptyRules"
                  v-if="list.excretion1 && list.excretion1.text == '其他'" class="mt-0 mx-2"></v-text-field>
              </div>
              <div class="d-flex">
                <v-autocomplete label="排便顏色" :items="excretion2Items" v-model="list.excretion2" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-text-field label="其他內容說明" v-model="list.excretion2.Other" :rules="emptyRules"
                  v-if="list.excretion2 && list.excretion2.text == '其他'" class="mt-0 mx-2"></v-text-field>
              </div>
              <div class="d-flex">
                <v-autocomplete label="排便輔助" :items="excretion3Items" v-model="list.excretion3" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-autocomplete label="選擇位置" :items="excretion3MultipleAnswerItems"
                  v-model="list.excretion3.MultipleAnswer" :rules="emptyObjRules" class="mt-0 mx-2"
                  v-if="list.excretion3 && list.excretion3.text == '有'"></v-autocomplete>
                <v-text-field label="其他內容說明" v-model="list.excretion3.Other" :rules="emptyRules"
                  v-if="list.excretion3 && list.excretion3.MultipleAnswer && list.excretion3.MultipleAnswer == '其他'"
                  class="mt-0 mx-2"></v-text-field>
              </div>
              <h3>排尿情況</h3>
              <div class="d-flex">
                <v-autocomplete label="排尿型態" :items="excretion4Items" v-model="list.excretion4" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-autocomplete label="選擇位置" :items="excretion4MultipleAnswerItems"
                  v-model="list.excretion4.MultipleAnswer" :rules="emptyObjRules" class="mt-0 mx-2"
                  v-if="list.excretion4 && list.excretion4.text == '異常'"></v-autocomplete>
                <v-text-field label="其他內容說明" v-model="list.excretion4.Other" :rules="emptyRules"
                  v-if="list.excretion4 && list.excretion4.text == '異常' && list.excretion4.MultipleAnswer && list.excretion4.MultipleAnswer == '其他'"
                  class="mt-0 mx-2"></v-text-field>
              </div>
              <div class="d-flex">
                <v-autocomplete label="排尿顏色" :items="excretion5Items" v-model="list.excretion5" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-text-field label="其他內容說明" v-model="list.excretion5.Other" :rules="emptyRules"
                  v-if="list.excretion5 && list.excretion5.text == '異常'" class="mt-0 mx-2"></v-text-field>
              </div>
              <div class="d-flex">
                <v-autocomplete label="排尿輔助" :items="excretion6Items" v-model="list.excretion6" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-autocomplete label="選擇位置" :items="excretion6MultipleAnswerItems"
                  v-model="list.excretion6.MultipleAnswer" :rules="emptyObjRules" class="mt-0 mx-2"
                  v-if="list.excretion6 && list.excretion6.text == '有'"></v-autocomplete>
                <v-text-field label="其他內容說明" v-model="list.excretion6.Other" :rules="emptyRules"
                  v-if="list.excretion6 && list.excretion6.text == '有' && list.excretion6.MultipleAnswer == '其他'"
                  class="mt-0 mx-2"></v-text-field>
              </div>
            </div>

            <div class="zoneStyle">
              <h2>皮膚</h2>
              <div class="d-flex">
                <v-autocomplete label="溫度" :items="skin1Items" v-model="list.skin1" :rules="emptyRules" return-object
                  item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-text-field label="其他內容說明" v-model="list.skin1.Other"
                  v-if="list.skin1 && list.skin1.text && list.skin1.text == '其他'" :rules="emptyRules"
                  class="mt-0 mx-2"></v-text-field>
              </div>
              <div class="d-flex">
                <v-autocomplete label="濕度" :items="skin2Items" v-model="list.skin2" :rules="emptyRules" return-object
                  item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-text-field label="其他內容說明" v-model="list.skin2.Other"
                  v-if="list.skin2 && list.skin2.text && list.skin2.text == '其他'" :rules="emptyRules"
                  class="mt-0 mx-2"></v-text-field>
              </div>
              <div class="d-flex">
                <v-autocomplete label="顏色" :items="skin3Items" v-model="list.skin3" :rules="emptyRules" return-object
                  item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-text-field label="其他內容說明" v-model="list.skin3.Other"
                  v-if="list.skin3 && list.skin3.text && list.skin3.text == '其他'" :rules="emptyRules"
                  class="mt-0 mx-2"></v-text-field>
              </div>
              <div>
                <v-autocomplete label="水腫級數" :items="skin4Items" v-model="list.skin4" :rules="emptyRules" return-object
                  item-title="text" item-value="text" class="mt-0"></v-autocomplete>

                <div class="success lighten-4 pa-3" v-if="list.skin4 && list.skin4.text == '有'">
                  <div class="d-flex">
                    <h3>水腫等級&部位設定 (2025.9.11後新資料顯示區)</h3>
                    <v-spacer></v-spacer>
                    <div class="d-flex align-center gap-5">
                      <v-select label="水腫等級" :items="skin5Items" v-model="partList.PART_LEVEL"></v-select>
                      <v-text-field label="部位" v-model="partList.PART_NAME"></v-text-field>
                      <v-btn small class="success" @click="addPart()">新增部位</v-btn>
                    </div>
                  </div>
                  <hr>
                  <div class="d-flex mt-2 gap-5"
                    v-if="Array.isArray(list.QC104_Part_LIST) && list.QC104_Part_LIST.length">
                    <div v-for="(item, index) in list.QC104_Part_LIST" :key="index"
                      class="d-flex align-center justify-space-between pa-2 mb-2 rounded-5 white elevation-1">
                      <div class="d-flex align-center gap-5">
                        <v-chip small color="blue lighten-4" text-color="blue darken-3" class="mr-2">
                          等級: {{ item.PART_LEVEL ? item.PART_LEVEL : '等級資料錯誤' }}
                        </v-chip>
                        <v-chip small color="green lighten-4" text-color="green darken-3">
                          部位: {{ item.PART_NAME ? item.PART_NAME : '部位資料錯誤' }}
                        </v-chip>
                      </div>
                      <v-btn icon small @click="removePart(index)">
                        <v-icon color="red">mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </div>

                <div class="my-2 grey lighten-2 pa-3 d-flex gap-5" v-if="list.skin4 && list.skin4.text == '有'">
                  <h3>水腫等級(舊資料顯示區)</h3>
                  <v-autocomplete label="水腫等級" :items="skin5Items" v-model="list.skin5" return-object
                    item-title="text" item-value="text" class="mt-0" readonly></v-autocomplete>
                  <v-text-field label="部位" v-model="list.skin4.Other" class="mt-0 mx-2" readonly></v-text-field>
                </div>
              </div>
              <div class="d-flex">
                <v-autocomplete label="完整" :items="skin6Items" v-model="list.skin6" :rules="emptyRules" return-object
                  item-title="text" item-value="text" class="mt-0"></v-autocomplete>
              </div>
            </div>

            <div class="zoneStyle">
              <h2>肌力</h2>
              <div class="d-flex">
                <v-autocomplete label="左上肢" :items="muscle1Items" v-model="list.muscle1" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-autocomplete label="右上肢" :items="muscle2Items" v-model="list.muscle2" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-autocomplete label="左下肢" :items="muscle3Items" v-model="list.muscle3" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-autocomplete label="右下肢" :items="muscle4Items" v-model="list.muscle4" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
              </div>
              <v-autocomplete label="行動能力問題" :items="muscle5Items" v-model="list.muscle5" :rules="emptyRules"
                return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
              <div class="d-flex">
                <v-autocomplete label="肌力-輔具" :items="muscle6Items" v-model="list.muscle6" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-autocomplete label="選擇輔具" :items="muscle6MultipleAnswerItems" v-model="list.muscle6.MultipleAnswer"
                  :rules="emptyObjRules" class="mt-0 mx-2" v-if="list.muscle6 && list.muscle6.text == '有'"
                  multiple></v-autocomplete>
                <v-text-field label="其他內容說明" v-model="list.muscle6.Other" :rules="emptyRules"
                  v-if="list.muscle6 && list.muscle6.text == '有' && list.muscle6.MultipleAnswer && list.muscle6.MultipleAnswer.includes('其他')"
                  class="mt-0 mx-2"></v-text-field>
              </div>
            </div>

            <div class="zoneStyle">
              <h2>跌倒</h2>
              <v-autocomplete label="跌倒" :items="fall1Items" v-model="list.fall1" :rules="emptyRules" return-object
                item-title="text" item-value="text" class="mt-0"></v-autocomplete>
              <div v-if="list.fall1 && list.fall1.text == '有'" class="d-flex">
                <v-text-field label="跌倒次數" v-model="list.fall1.Answer0" class="mt-0"></v-text-field>
                <v-autocomplete label="選擇受傷情況" :items="fall1MultipleAnswerItems" v-model="list.fall1.MultipleAnswer"
                  :rules="emptyObjRules" class="mt-0 mx-2" multiple></v-autocomplete>
                <v-text-field label="其他內容說明"
                  v-if="list.fall1.text == '有' && list.fall1.MultipleAnswer && list.fall1.MultipleAnswer.includes('其他')"
                  v-model="list.fall1.Other" class="mt-0" :rules="emptyRules"></v-text-field>
              </div>
            </div>

            <div class="zoneStyle">
              <h2>行為</h2>
              <v-autocomplete label="行為" :items="behavior1Items" v-model="list.behavior1" :rules="emptyRules"
                return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
              <div v-if="list.behavior1 && list.behavior1.text == '有干擾行為'" class="d-flex">
                <v-autocomplete label="選擇行為" :items="behavior1MultipleAnswerItems"
                  v-model="list.behavior1.MultipleAnswer" :rules="emptyObjRules" class="mt-0 mr-2"
                  multiple></v-autocomplete>
                <v-text-field label="其他內容說明"
                  v-if="list.behavior1.text == '有干擾行為' && list.behavior1.MultipleAnswer && list.behavior1.MultipleAnswer.includes('其他')"
                  v-model="list.behavior1.Other" class="mt-0" :rules="emptyRules"></v-text-field>
              </div>
            </div>

            <div class="zoneStyle">
              <h2>睡眠</h2>
              <v-autocomplete label="睡眠" :items="sleep1Items" v-model="list.sleep1" :rules="emptyRules" return-object
                item-title="text" item-value="text" class="mt-0"></v-autocomplete>
              <div v-if="list.sleep1 && list.sleep1.text == '有障礙'">
                <div style="display: flex;gap: 10px;">
                  <v-autocomplete label="選擇行為" :items="sleep1MultipleAnswerItems" v-model="list.sleep1.MultipleAnswer"
                    :rules="emptyObjRules" class="mt-0" multiple></v-autocomplete>
                  <v-text-field
                    v-if="list.sleep1 && list.sleep1.MultipleAnswer && list.sleep1.MultipleAnswer.includes('其他')"
                    label="其他內容說明" v-model="list.sleep1.Other" class="mt-0" :rules="emptyRules"></v-text-field>
                </div>
                <v-autocomplete label="服用藥物" :items="sleep2Items" v-model="list.sleep2" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <div v-if="list.sleep2 && list.sleep2.text == '有'">
                  <div style="display: flex;gap: 10px;">
                    <v-autocomplete label="藥物類別" :items="sleep3Items" v-model="list.sleep3" :rules="emptyObjRules"
                      return-object item-title="text" item-value="text" class="mt-0" multiple></v-autocomplete>
                    <v-text-field v-if="checkSleep3(list.sleep3)" label="其他內容說明" v-model="list.sleep3[0].Other"
                      class="mt-0 mx-2" :rules="emptyRules"></v-text-field>
                    <v-autocomplete label="服用頻率" :items="sleep4Items" v-model="list.sleep4" :rules="emptyRules"
                      return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                  </div>
                </div>
              </div>
            </div>

            <div class="zoneStyle">
              <h2>呼吸</h2>
              <div style="display: flex;gap: 10px;">
                <v-autocomplete label="輔助器" :items="breathe1Items" v-model="list.breathe1" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <div class="d-flex" v-if="list.breathe1 && list.breathe1.text == '有'">
                  <v-autocomplete label="有輔助器" :items="breathe1MultipleAnswerItems"
                    v-model="list.breathe1.MultipleAnswer" :rules="emptyObjRules" class="mt-0"></v-autocomplete>
                  <v-text-field label="其他說明"
                    v-if="list.breathe1.MultipleAnswer && list.breathe1.MultipleAnswer.includes('其他')"
                    v-model="list.breathe1.Other" class="mt-0 ml-2"></v-text-field>
                </div>
              </div>
              <div class="d-flex gap-5"
                v-if="list.breathe1 && list.breathe1.text == '有' && list.breathe1.MultipleAnswer && list.breathe1.MultipleAnswer.includes('氧氣機')">
                <v-autocomplete label="鼻導管" :items="breathe2Items" v-model="list.breathe2" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-text-field type="number" label="L/min" v-model="list.breathe2.Other" class="mt-0 mx-2"
                  v-if="list.breathe2 && list.breathe2.text == '有'"></v-text-field>
                <v-autocomplete label="氧氣面罩" :items="breathe3Items" v-model="list.breathe3" :rules="emptyRules"
                  return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
                <v-text-field type="number" label="%" v-model="list.breathe3.Other" class="mt-0 ml-2"
                  v-if="list.breathe3 && list.breathe3.text == '有'"></v-text-field>
              </div>
              <!-- <pre>
               {{ list.breathe1 }}
               {{ list.breathe2 }}
               {{ list.breathe3 }}
              </pre> -->
            </div>
            <div class="zoneStyle">
              <h2>疫苗</h2>
              <v-autocomplete label="疫苗" :items="vaccine1Items" v-model="list.vaccine1" :rules="emptyRules"
                return-object item-title="text" item-value="text" class="mt-0"></v-autocomplete>
              <div v-if="list.vaccine1 && list.vaccine1.MultipleAnswer && list.vaccine1.text == '有'">
                <v-row v-for="item, index in list.vaccine1.MultipleAnswer" :key="index">
                  <v-col class="py-1"><v-checkbox :label="item.kind" v-model="item.selected" hide-details
                      class="pa-0"></v-checkbox></v-col>
                  <v-col class="py-1"><v-text-field type="number" label="西元/年" v-model="item.year" hide-details
                      class="pa-0"></v-text-field></v-col>
                  <v-col class="py-1"><v-checkbox label="不記得" v-model="item.forget" hide-details
                      class="pa-0"></v-checkbox></v-col>
                </v-row>
              </div>
            </div>
            <!-- <pre>{{ list.vaccine1.MultipleAnswer }}</pre>  -->
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
import { ref, reactive, computed, watch, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import api from '@/assets/js/api.js'
import { useStore } from '@/stores/useStore'

const emit = defineEmits(['refresh', 'getAllData'])

const props = defineProps({
  useDataBase: {
    type: String,
    default: 'bodyevaluations',
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

const requiredDateRules = [(v) => !!v || '不可空白']
const emptyRules = [(v) => !!v || '不可空白']
const emptyObjRules = [v => Boolean(Object.keys(v || {})[0]) || '不可空白']

const partList = ref({ PART_LEVEL: null, PART_NAME: '' }) //水腫等級部位輸入

const headerTitle = computed(() => (processType.value === 'add' ? '新增身體評估評估表' : '修改身體評估評估表'))
const headerSubtitle = computed(() =>
  processType.value === 'add'
    ? '填寫住民身體各項功能狀況評估，包含意識、視力、聽力、溝通、口腔、胃腸、排泄、皮膚、肌力、跌倒、行為、睡眠、呼吸、疫苗等評估項目。'
    : '更新既有評估紀錄，維持數據正確性與一致性。'
)
const headerColor = computed(() => (processType.value === 'add' ? 'primary' : 'success'))

//意識
const mind1Items = [
        { Question: '睜眼', text: 4 },
        { Question: '睜眼', text: 3 },
        { Question: '睜眼', text: 2 },
        { Question: '睜眼', text: 1 },
        { Question: '睜眼', text: '閉眼' },
      ]

const mind2Items = [
        { Question: '語言', text: 5 },
        { Question: '語言', text: 4 },
        { Question: '語言', text: 3 },
        { Question: '語言', text: 2 },
        { Question: '語言', text: 1 },
        { Question: '語言', text: '失語症' },
        { Question: '語言', text: '失聰' },
        { Question: '語言', text: '插氣管內管' },
        { Question: '語言', text: '氣切' },
      ]

const mind3Items = [
        { Question: '運動', text: 6 },
        { Question: '運動', text: 5 },
        { Question: '運動', text: 4 },
        { Question: '運動', text: 3 },
        { Question: '運動', text: 2 },
        { Question: '運動', text: 1 },
      ]

//視力
const vision1Items = [
        { Question: '視力', text: '有障礙' },
        { Question: '視力', text: '無障礙' },
        { Question: '視力', text: '不知道' },
      ]

const vision2Items = [
        { Question: '視力-部位', text: '左眼白內障' },
        { Question: '視力-部位', text: '左眼青光眼' },
        { Question: '視力-部位', text: '左眼老花眼' },
        { Question: '視力-部位', text: '左眼近視' },
        { Question: '視力-部位', text: '左眼其他' },
        { Question: '視力-部位', text: '右眼白內障' },
        { Question: '視力-部位', text: '右眼青光眼' },
        { Question: '視力-部位', text: '右眼老花眼' },
        { Question: '視力-部位', text: '右眼近視' },
        { Question: '視力-部位', text: '右眼其他' }
      ]

const vision3Items = [
        { Question: '視力-影響日常活動', text: '否' },
        { Question: '視力-影響日常活動', text: '是' },
      ]

const vision4Items = [
        { Question: '視力-輔具', text: '無' },
        { Question: '視力-輔具', text: '有' },
      ]

const vision4MultipleAnswerItems = ['眼鏡', '放大鏡', '義眼左眼', '義眼右眼', '其他']

//聽力
const hearing1Items = [
        { Question: '聽力', text: '有障礙' },
        { Question: '聽力', text: '無障礙' },
        { Question: '聽力', text: '不知道' },
      ]

const hearing2Items = [
        { Question: '聽力-部位', text: '左耳重聽' },
        { Question: '聽力-部位', text: '左耳失聰' },
        { Question: '聽力-部位', text: '右耳重聽' },
        { Question: '聽力-部位', text: '右耳失聰' },
      ]

const hearing3Items = [
        { Question: '聽力-影響日常活動', text: '否' },
        { Question: '聽力-影響日常活動', text: '是' },
      ]

const hearing4Items = [
        { Question: '聽力-輔具', text: '無' },
        { Question: '聽力-輔具', text: '有' },
      ]

const hearing4MultipleAnswerItems = ['助聽器左耳', '助聽器右耳', '其他']
const hearing4OtherItems = ['左耳', '右耳']

//溝通
const communicate1Items = [
        { Question: '溝通', text: '有障礙' },
        { Question: '溝通', text: '無障礙' },
      ]

const communicate2Items = [
        { Question: '溝通-影響日常活動', text: '新問題(4週內)' },
        { Question: '溝通-影響日常活動', text: '舊問題(4週以上)' },
      ]

const communicate3Items = [
        { Question: '說話', text: '良好' },
        { Question: '說話', text: '不清楚' },
        { Question: '說話', text: '僅可簡單表達句子(詞)' },
        { Question: '說話', text: '僅可表達零碎的字' },
        { Question: '說話', text: '無法言語' },
      ]

const communicate4Items = [
        { Question: '理解', text: '良好' },
        { Question: '理解', text: '僅可理解簡單句子(詞)' },
        { Question: '理解', text: '僅可理解關鍵字' },
        { Question: '理解', text: '無法理解' },
      ]

//口腔
const oralCavity1Items = [
        { Question: '口腔外觀', text: '正常' },
        { Question: '口腔外觀', text: '異常' },
      ]

const oralCavity1MultipleAnswerItems = ['蒼白', '紅腫', '黏膜瘀血或出血', '潰瘍', '其他']

const oralCavity2Items = [
        { Question: '特殊進食', text: '無' },
        { Question: '特殊進食', text: '有' },
      ]

const oralCavity2MultipleAnswerItems = ['鼻胃管', '胃腸造廔', '特殊種類']

const oralCavity3Items = [
        { Question: '假牙狀況', text: '無' },
        { Question: '假牙狀況', text: '全口多處無牙，但未裝假牙' },
        { Question: '假牙狀況', text: '有活動假牙' },
        { Question: '假牙狀況', text: '有固定式假牙' },
      ]

const oralCavity3MultipleAnswerItems = ['上顎', '下顎', '全口', '其他']

const oralCavity4Items = [
        { Question: '備有個人口腔清潔工具', text: '無' },
        { Question: '備有個人口腔清潔工具', text: '有' },
      ]

const oralCavity5MultipleAnswerItems = ['牙刷', '1000ppm含氟牙膏', '牙線/牙線棒/牙間刷', '漱口杯']
const oralCavity6MultipleAnswerItems = ['假牙專用軟毛牙刷', '假牙清潔錠']
const oralCavity7MultipleAnswerItems = ['海棉棒', '紗布']

const oralCavity8Items = [
        { Question: '口腔保健情形', text: '無' },
        { Question: '口腔保健情形', text: '有' },
      ]

const oralCavity8MultipleAnswerItems = ['至少2次', '少於2次']

//胃腸
const Gastrointestinal1Items = [
        { Question: '腹部狀態', text: '正常' },
        { Question: '腹部狀態', text: '脹' },
        { Question: '腹部狀態', text: '硬' },
        { Question: '腹部狀態', text: '腫塊' },
        { Question: '腹部狀態', text: '腹水' },
        { Question: '腹部狀態', text: '壓痛' },
        { Question: '腹部狀態', text: '反彈痛' },
        { Question: '腹部狀態', text: '其他' },
      ]

const Gastrointestinal2Items = [
        { Question: '腸蠕動', text: '正常' },
        { Question: '腸蠕動', text: '快' },
        { Question: '腸蠕動', text: '慢' },
        { Question: '腸蠕動', text: '其他' },
      ]

const Gastrointestinal3Items = [
        { Question: '消化狀態', text: '正常' },
        { Question: '消化狀態', text: '不好' },
        { Question: '消化狀態', text: '非常不好' },
        { Question: '消化狀態', text: '其他' },
      ]

//排泄
const excretion1Items = [
        { Question: '排便型態', text: '正常(至少每三天排便一次)' },
        { Question: '排便型態', text: '不知道' },
        { Question: '排便型態', text: '便秘' },
        { Question: '排便型態', text: '腹瀉' },
        { Question: '排便型態', text: '失禁' },
        { Question: '排便型態', text: '其他' },
      ]

const excretion2Items = [
        { Question: '排便顏色', text: '黃褐' },
        { Question: '排便顏色', text: '墨綠' },
        { Question: '排便顏色', text: '黑便' },
        { Question: '排便顏色', text: '其他' },
        { Question: '排便顏色', text: '不知道' },
      ]

const excretion3Items = [
        { Question: '排便輔助', text: '有' },
        { Question: '排便輔助', text: '無' },
        { Question: '排便輔助', text: '不知道' },
      ]

const excretion3MultipleAnswerItems = ['腸造瘻', '其他']

const excretion4Items = [
        { Question: '排尿型態', text: '正常' },
        { Question: '排尿型態', text: '多' },
        { Question: '排尿型態', text: '少' },
        { Question: '排尿型態', text: '不知道' },
        { Question: '排尿型態', text: '異常' },
      ]

const excretion4MultipleAnswerItems = ['失禁', '無尿', '頻尿', '排尿困難', '血液透析', '腹膜透析', '其他']

const excretion5Items = [
        { Question: '排尿顏色', text: '正常' },
        { Question: '排尿顏色', text: '不知道' },
        { Question: '排尿顏色', text: '異常' },
      ]

const excretion6Items = [
        { Question: '排尿輔助', text: '有' },
        { Question: '排尿輔助', text: '無' },
        { Question: '排尿輔助', text: '不知道' },
      ]

const excretion6MultipleAnswerItems = ['尿布', '間歇導尿', '導尿管', '膀胱造瘻', '其他']

//皮膚
const skin1Items = [
        { Question: '溫度', text: '溫暖' },
        { Question: '溫度', text: '冰冷' },
        { Question: '溫度', text: '其他' },
      ]

const skin2Items = [
        { Question: '濕度', text: '無異常' },
        { Question: '濕度', text: '過度乾燥' },
        { Question: '濕度', text: '盜汗' },
        { Question: '濕度', text: '其他' },
      ]

const skin3Items = [
        { Question: '顏色', text: '無異常' },
        { Question: '顏色', text: '蒼白' },
        { Question: '顏色', text: '潮紅' },
        { Question: '顏色', text: '發紺' },
        { Question: '顏色', text: '黃疸' },
        { Question: '顏色', text: '其他' },
      ]

const skin4Items = [
        { Question: '水腫級數', text: '無' },
        { Question: '水腫級數', text: '有' },
      ]

const skin4OtherItems = ['輕', '中', '重', '極重']

const skin5Items = [
        { Question: '水腫等級', text: '輕' },
        { Question: '水腫等級', text: '中' },
        { Question: '水腫等級', text: '重' },
        { Question: '水腫等級', text: '極重' },
      ]

const skin6Items = [
        { Question: '完整', text: '是' },
        { Question: '完整', text: '否' },
      ]

//肌力
const muscle1Items = [
        { Question: '左上肢', text: 5 },
        { Question: '左上肢', text: 4 },
        { Question: '左上肢', text: 3 },
        { Question: '左上肢', text: 2 },
        { Question: '左上肢', text: 1 },
        { Question: '左上肢', text: 0 },
        { Question: '左上肢', text: '無法測量' },
      ]

const muscle2Items = [
        { Question: '右上肢', text: 5 },
        { Question: '右上肢', text: 4 },
        { Question: '右上肢', text: 3 },
        { Question: '右上肢', text: 2 },
        { Question: '右上肢', text: 1 },
        { Question: '右上肢', text: 0 },
        { Question: '右上肢', text: '無法測量' },
      ]

const muscle3Items = [
        { Question: '左下肢', text: 5 },
        { Question: '左下肢', text: 4 },
        { Question: '左下肢', text: 3 },
        { Question: '左下肢', text: 2 },
        { Question: '左下肢', text: 1 },
        { Question: '左下肢', text: 0 },
        { Question: '左下肢', text: '無法測量' },
      ]

const muscle4Items = [
        { Question: '右下肢', text: 5 },
        { Question: '右下肢', text: 4 },
        { Question: '右下肢', text: 3 },
        { Question: '右下肢', text: 2 },
        { Question: '右下肢', text: 1 },
        { Question: '右下肢', text: 0 },
        { Question: '右下肢', text: '無法測量' },
      ]

const muscle5Items = [
        { Question: '行動能力問題', text: '可獨立於戶外行走' },
        { Question: '行動能力問題', text: '可戶外行走但需人陪伴' },
        { Question: '行動能力問題', text: '只能於室內獨立行走' },
        { Question: '行動能力問題', text: '只能於室內行走且需人陪伴' },
        { Question: '行動能力問題', text: '無法行走' },
      ]

const muscle6Items = [
        { Question: '肌力-輔具', text: '無' },
        { Question: '肌力-輔具', text: '有' },
      ]

const muscle6MultipleAnswerItems = [
  '義肢左手', '義肢右手', '義肢左腳', '義肢右腳', '副木左手', '副木右手', '副木左腳', '副木右腳', '助行器', '單柺', '三/四腳柺', '輪椅', '電動車', '氣墊床', '其他'
]

//跌倒
const fall1Items = [
        { Question: '跌倒', text: '無' },
        { Question: '跌倒', text: '有' },
        { Question: '跌倒', text: '不知道' },
      ]

const fall1MultipleAnswerItems = [
  '瘀青', '皮肉傷口', '頭部外傷', '顱內出血', '腕部骨折', '脊椎骨折', '髖部骨折', '其他'
]

//行為
const behavior1Items = [
        { Question: '行為', text: '無干擾行為' },
        { Question: '行為', text: '有干擾行為' },
      ]

const behavior1MultipleAnswerItems = ['攻擊行為', '自傷', '遊走', '其他']

//睡眠
const sleep1Items = [
        { Question: '睡眠', text: '無障礙' },
        { Question: '睡眠', text: '不知道' },
        { Question: '睡眠', text: '有障礙' },
      ]

const sleep1MultipleAnswerItems = ['不易入睡', '早睡', '斷續睡眠', '日夜顛倒', '其他']

const sleep2Items = [
        { Question: '服用藥物', text: '無' },
        { Question: '服用藥物', text: '有' },
      ]

const sleep3Items = [
        { Question: '藥物類別', text: '抗焦慮劑' },
        { Question: '藥物類別', text: '鎮靜劑' },
        { Question: '藥物類別', text: '抗憂鬱劑' },
        { Question: '藥物類別', text: '抗精神病劑' },
        { Question: '藥物類別', text: '其他' },
      ]

const sleep4Items = [
        { Question: '服用頻率', text: '偶爾' },
        { Question: '服用頻率', text: '每週1-2次' },
        { Question: '服用頻率', text: '每週3-6次' },
        { Question: '服用頻率', text: '每天' },
      ]

//呼吸
const breathe1Items = [
        { Question: '輔助器', text: '無' },
        { Question: '輔助器', text: '有' },
      ]

const breathe1MultipleAnswerItems = ['氧氣機', '呼吸器', '其他']

const breathe2Items = [
        { Question: '鼻導管', text: '有' },
        { Question: '鼻導管', text: '無' },
      ]

const breathe3Items = [
        { Question: '氧氣面罩', text: '有' },
        { Question: '氧氣面罩', text: '無' },
      ]

//疫苗
const vaccine1Items = [
        {
          Question: '疫苗', text: '有',
          MultipleAnswer: [
            { kind: '流感疫苗', selected: '', year: '', forget: false },
            { kind: '肺炎雙球菌疫苗', selected: '', year: '', forget: false },
            { kind: 'COVID-19疫苗', selected: '', year: '', forget: false },
            { kind: '其他', selected: '', year: '', forget: false },
          ],
        },
        { Question: '疫苗', text: '無' },
        { Question: '疫苗', text: '不知道' },
      ]

watch(list, (val) => {
  //2023.4.30 處理選單上如果後來更新資料為 無障礙 一類的 -> 相關值.刪除

  //2023.5.23 視力 不是 有障礙 -> 清空相關值
  if (val.vision1 && val.vision1.text != '有障礙') {
    val.vision2 = null
    val.vision3 = null
    val.vision4 = null
  }

  //聽力 -> 不是 有障礙 -> 清空相關值
  if (val.hearing1 && val.hearing1.text != '有障礙') {
    val.hearing2 = null
    val.hearing3 = null
    val.hearing4 = null
  }

  //溝通 -> 無障礙 -> 清空相關值
  if (val.communicate1 && val.communicate1.text == "無障礙") {
    val.communicate2 = null
    val.communicate3 = null
    val.communicate4 = null
  }

  //2023.5.7 呼吸 -> 輔助器 -> 無 -> 清空相關值
  if (val.breathe1 && val.breathe1.text == '無') {
    val.breathe2 = null
    val.breathe3 = null
    delete val.breathe1.MultipleAnswer
    delete val.breathe1.Other
  }
  //2023.5.11 水腫級數中的部位,調整成水腫部位及水腫等級的other都是同一值 list.skin4.Other = list.skin5.Other
  if (val.skin4 && val.skin4.Other) {
    val.skin5.Other = val.skin4.Other
  }

  //2024.10.16 睡眠 不是 有障礙 -> 清空相關值
  if (val.sleep1 && val.sleep1.text != '有障礙') {
    val.sleep2 = null
    val.sleep3 = null
    val.sleep4 = null
  }
}, { deep: true })

//新增水腫等級部位
const addPart = () => {
  if (!list.skin4 || list.skin4.text !== '有') {
    store.showToastMulti({
      type: 'warning',
      message: '請先選擇「水腫級數」為「有」',
      closeTime: 3,
    })
    return
  }

  if (!partList.value || !partList.value.PART_LEVEL || !partList.value.PART_NAME) {
    store.showToastMulti({
      type: 'warning',
      message: '請選擇水腫等級並輸入部位',
      closeTime: 3,
    })
    return
  }

  if (!Array.isArray(list.QC104_Part_LIST)) {
    list.QC104_Part_LIST = []
  }

  list.QC104_Part_LIST.unshift({
    PART_LEVEL: partList.value.PART_LEVEL,
    PART_NAME: partList.value.PART_NAME
  })

  // 清空輸入
  partList.value = { PART_LEVEL: null, PART_NAME: '' }
}

const removePart = (index) => {
  if (Array.isArray(list.QC104_Part_LIST)) {
    list.QC104_Part_LIST.splice(index, 1)
  }
}

//判斷 sleep3 是否包含 其他
const checkSleep3 = (items) => {
  if (items) {
    const match = items.filter(i => i.text == '其他')
    return match.length > 0
  }
  return false
}

const openForAdd = () => {
  processType.value = 'add'
  Object.keys(list).forEach(key => delete list[key])
  
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
    Object.assign(list, firstItem)
  }
  
  dialog.value = true
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const openForEdit = (item) => {
  dialog.value = true
  processType.value = 'edit'
  Object.keys(list).forEach(key => delete list[key])
  Object.assign(list, JSON.parse(JSON.stringify(item)))
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const closeDialog = () => {
  dialog.value = false
  loading.value = false
}
//判斷其他狀況的錯誤
const checkOtherError = () => {
  let errorMsg = ""
  //1.疫苗如果有勾選,那年份跟不記得至少要有一項有資料 ;2.如果疫苗選擇有,那選項不可以全部都沒勾選
  if (list.vaccine1 && list.vaccine1.MultipleAnswer) {
    const match = list.vaccine1.MultipleAnswer.filter(i =>
      i.selected && i.year == '' && i.forget == false
    )
    if (match.length) {
      errorMsg += '疫苗資料勾選後,需輸入年份或勾選不記得!'
    }

    const match2 = list.vaccine1.MultipleAnswer.filter(i => i.selected)
    if (match2.length == 0) {
      errorMsg += '未勾選任何疫苗資料!!'
    }
  }

  //2.水腫等級部位至少要有一項
  if (list.skin4 && list.skin4.text == '有' && (!list.QC104_Part_LIST || list.QC104_Part_LIST.length == 0)) {
    errorMsg += '水腫等級&部位設定至少要有一項!!'
  }

  return errorMsg
}

const handleAdd = async () => {
  const errorMsg = checkOtherError()
  if (errorMsg != '') {
    store.showToastMulti({
      type: 'warning',
      message: errorMsg,
      closeTime: 3,
    })
    return
  }

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

//確認修改
const handleEdit = async () => {
  const errorMsg = checkOtherError()
  if (errorMsg != '') {
    store.showToastMulti({
      type: 'warning',
      message: errorMsg,
      closeTime: 3,
    })
    return
  }

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

<style scoped lang="scss">
.zoneStyle {
  background-color: #F0F0F0;
  border: 1px solid black;
  border-radius: 5px;
  margin-top: 10px;
  padding: 10px;
}
</style>