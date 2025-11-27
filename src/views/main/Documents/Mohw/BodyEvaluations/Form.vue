<template>
  <div>
    <v-form ref="form" class="pa-2">
      <v-text-field class="mt-2" readonly dense outlined hide-details type="date" label="評估日期" v-model="list.Date"
        :rules="emptyRules"></v-text-field>

      <div>
        <h3>意識</h3>
        <v-row>
          <v-col cols="4" class="pt-0">
            <v-text-field class="mt-2" readonly dense outlined hide-details label="睜眼" :items="mind1Items"
              v-model="list.mind1.text" :rules="emptyRules"></v-text-field>
          </v-col>
          <v-col cols="4" class="pt-0">
            <v-text-field class="mt-2" readonly dense outlined hide-details label="語言" :items="mind2Items"
              v-model="list.mind2.text" :rules="emptyRules"></v-text-field>
          </v-col>
          <v-col cols="4" class="pt-0">
            <v-text-field class="mt-2" readonly dense outlined hide-details label="運動" :items="mind3Items"
              v-model="list.mind3.text" :rules="emptyRules"></v-text-field>
          </v-col>
        </v-row>
      </div>

      <div>
        <h3>視力</h3>
        <v-text-field class="mt-2" readonly dense outlined hide-details label="視力" :items="vision1Items"
          v-model="list.vision1.text" :rules="emptyRules"></v-text-field>
        <div v-if="list.vision1 && list.vision1.text == '有障礙'">
          <v-text-field class="mt-2" readonly dense outlined hide-details label="視力-部位" :items="vision2Items"
            v-model="list.vision2.text" :rules="emptyObjRules" multiple></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="視力-影響日常活動" :items="vision3Items"
            v-model="list.vision3.text" :rules="emptyRules"></v-text-field>
          <div class="d-flex">
            <v-text-field class="mt-2" readonly dense outlined hide-details label="視力-輔具" :items="vision4Items"
              v-model="list.vision4.text" :rules="emptyRules"></v-text-field>
            <v-text-field class="mt-2" readonly dense outlined hide-details label="選擇輔具"
              :items="vision4MultipleAnswerItems" v-model="list.vision4.MultipleAnswer.text" :rules="emptyObjRules"
              v-if="list.vision4 && list.vision4.text == '有'" multiple></v-text-field>
          </div>
        </div>
      </div>

      <div>
        <h3>聽力</h3>
        <v-text-field class="mt-2" readonly dense outlined hide-details label="聽力" :items="hearing1Items"
          v-model="list.hearing1.text" :rules="emptyRules"></v-text-field>
        <div v-if="list.hearing1 && list.hearing1.text == '有障礙'">
          <v-text-field class="mt-2" readonly dense outlined hide-details label="聽力-部位" :items="hearing2Items"
            v-model="list.hearing2.text" :rules="emptyObjRules" multiple></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="聽力-影響日常活動" :items="hearing3Items"
            v-model="list.hearing3.text" :rules="emptyRules"></v-text-field>
          <div class="d-flex">
            <v-text-field class="mt-2" readonly dense outlined hide-details label="聽力-輔具" :items="hearing4Items"
              v-model="list.hearing4.text" :rules="emptyRules"></v-text-field>
            <v-text-field class="mt-2" readonly dense outlined hide-details label="選擇輔具"
              :items="hearing4MultipleAnswerItems" v-model="list.hearing4.MultipleAnswer.text" :rules="emptyObjRules"
              v-if="list.hearing4 && list.hearing4.text == '有'" multiple></v-text-field>
            <v-text-field class="mt-2" readonly dense outlined hide-details label="選擇耳朵" :items="hearing4OtherItems"
              v-model="list.hearing4.Other.text" :rules="emptyObjRules"
              v-if="list.hearing4 && list.hearing4.Other && list.hearing4.MultipleAnswer" multiple></v-text-field>
          </div>
        </div>
      </div>

      <div>
        <h3>溝通</h3>
        <v-text-field class="mt-2" readonly dense outlined hide-details label="溝通" :items="communicate1Items"
          v-model="list.communicate1.text" :rules="emptyRules"></v-text-field>
        <div v-if="list.communicate1 && list.communicate1.text == '有障礙'" class="d-flex">
          <v-text-field class="mt-2" readonly dense outlined hide-details label="影響日常活動" :items="communicate2Items"
            v-model="list.communicate2.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="說話" :items="communicate3Items"
            v-model="list.communicate3.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="理解" :items="communicate4Items"
            v-model="list.communicate4.text" :rules="emptyRules"></v-text-field>
        </div>
      </div>

      <div>
        <h3>口腔</h3>
        <div class="d-flex flex-wrap">
          <v-text-field class="mt-2" readonly dense outlined hide-details label="口腔外觀" :items="oralCavity1Items"
            v-model="list.oralCavity1.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="選擇異常狀況"
            :items="oralCavity1MultipleAnswerItems" v-model="list.oralCavity1.MultipleAnswer.text"
            :rules="emptyObjRules" v-if="list.oralCavity1 && list.oralCavity1.text == '異常'" multiple></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明"
            v-model="list.oralCavity1.Other" v-if="list.oralCavity1 && list.oralCavity1.text == '異常'"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="特殊進食" :items="oralCavity2Items"
            v-model="list.oralCavity2.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="選擇異常狀況"
            :items="oralCavity2MultipleAnswerItems" v-model="list.oralCavity2.MultipleAnswer.text"
            :rules="emptyObjRules" v-if="list.oralCavity2 && list.oralCavity2.text == '有'" multiple></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="特殊種類說明"
            v-model="list.oralCavity2.Other" v-if="list.oralCavity2 && list.oralCavity2.text == '有'"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="假牙狀況" :items="oralCavity3Items"
            v-model="list.oralCavity3.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="選擇位置"
            :items="oralCavity3MultipleAnswerItems" v-model="list.oralCavity3.MultipleAnswer.text"
            :rules="emptyObjRules" v-if="list.oralCavity3 && list.oralCavity3.text == '有活動假牙'" multiple></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他位置說明"
            v-model="list.oralCavity3.Other" v-if="list.oralCavity3 && list.oralCavity3.text == '有活動假牙'"></v-text-field>
        </div>
      </div>

      <h3>胃腸</h3>
      <div class="d-flex justify-space-between">
        <div class="d-flex">
          <v-text-field class="mt-2" readonly dense outlined hide-details label="腹部狀態" :items="Gastrointestinal1Items"
            v-model="list.Gastrointestinal1.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明"
            v-model="list.Gastrointestinal1.Other"
            v-if="list.Gastrointestinal1 && list.Gastrointestinal1.text == '其他'"></v-text-field>
        </div>
        <div class="d-flex">
          <v-text-field class="mt-2" readonly dense outlined hide-details label="腸蠕動" :items="Gastrointestinal2Items"
            v-model="list.Gastrointestinal2.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明"
            v-model="list.Gastrointestinal2.Other"
            v-if="list.Gastrointestinal2 && list.Gastrointestinal2.text == '其他'"></v-text-field>
        </div>
        <div class="d-flex">
          <v-text-field class="mt-2" readonly dense outlined hide-details label="消化狀態" :items="Gastrointestinal3Items"
            v-model="list.Gastrointestinal3.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明"
            v-model="list.Gastrointestinal3.Other"
            v-if="list.Gastrointestinal3 && list.Gastrointestinal3.text == '其他'"></v-text-field>
        </div>
      </div>

      <div>
        <h3>排泄</h3>
        <h3>排便情況</h3>
        <div class="d-flex flex-wrap">
          <v-text-field class="mt-2" readonly dense outlined hide-details label="排便型態" :items="excretion1Items"
            v-model="list.excretion1.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明" v-model="list.excretion1.Other"
            v-if="list.excretion1 && list.excretion1.text == '其他'"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="排便顏色" :items="excretion2Items"
            v-model="list.excretion2.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明" v-model="list.excretion2.Other"
            v-if="list.excretion2 && list.excretion2.text == '其他'"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="排便輔助" :items="excretion3Items"
            v-model="list.excretion3.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="選擇位置"
            :items="excretion3MultipleAnswerItems" v-model="list.excretion3.MultipleAnswer.text" :rules="emptyObjRules"
            v-if="list.excretion3 && list.excretion3.text == '有'"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明" v-model="list.excretion3.Other"
            v-if="list.excretion3 && list.excretion3.text == '有'"></v-text-field>
        </div>
        <h3>排尿情況</h3>
        <div class="d-flex wrap">
          <v-text-field class="mt-2" readonly dense outlined hide-details label="排尿型態" :items="excretion4Items"
            v-model="list.excretion4.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="選擇位置"
            :items="excretion4MultipleAnswerItems" v-model="list.excretion4.MultipleAnswer.text" :rules="emptyObjRules"
            v-if="list.excretion4 && list.excretion4.text == '異常'"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明" v-model="list.excretion4.Other"
            v-if="list.excretion4 && list.excretion4.text == '異常'"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="排尿顏色" :items="excretion5Items"
            v-model="list.excretion5.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明" v-model="list.excretion5.Other"
            v-if="list.excretion5 && list.excretion5.text == '異常'"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="排尿輔助" :items="excretion6Items"
            v-model="list.excretion6.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="選擇位置"
            :items="excretion6MultipleAnswerItems" v-model="list.excretion6.MultipleAnswer.text" :rules="emptyObjRules"
            v-if="list.excretion6 && list.excretion6.text == '有'"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明" v-model="list.excretion6.Other"
            v-if="list.excretion6 && list.excretion6.text == '有'"></v-text-field>
        </div>
      </div>

      <div>
        <h3>皮膚</h3>
        <div class="d-flex wrap">
          <v-text-field class="mt-2" readonly dense outlined hide-details label="溫度" :items="skin1Items"
            v-model="list.skin1.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明" v-model="list.skin1.Other"
            v-if="list.skin1 && list.skin1.text == '其他'"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="濕度" :items="skin2Items"
            v-model="list.skin2.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明" v-model="list.skin2.Other"
            v-if="list.skin2 && list.skin2.text == '其他'"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="顏色" :items="skin3Items"
            v-model="list.skin3.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明" v-model="list.skin3.Other"
            v-if="list.skin3 && list.skin3.text == '其他'"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="水腫級數" :items="skin4Items"
            v-model="list.skin4.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="部位" v-model="list.skin4.Other"
            :rules="emptyRules" v-if="list.skin4 && list.skin4.text == '有'"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="水腫等級" :items="skin5Items"
            v-model="list.skin5.text" :rules="emptyRules" v-if="list.skin4 && list.skin4.text == '有'"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="完整" :items="skin6Items"
            v-model="list.skin6.text" :rules="emptyRules"></v-text-field>
        </div>
      </div>

      <div>
        <h3>肌力</h3>
        <div class="d-flex wrap">
          <v-text-field class="mt-2" readonly dense outlined hide-details label="左上肢" :items="muscle1Items"
            v-model="list.muscle1.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="右上肢" :items="muscle2Items"
            v-model="list.muscle2.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="左下肢" :items="muscle3Items"
            v-model="list.muscle3.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="右下肢" :items="muscle4Items"
            v-model="list.muscle4.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="行動能力問題" :items="muscle5Items"
            v-model="list.muscle5.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="肌力-輔具" :items="muscle6Items"
            v-model="list.muscle6.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="選擇輔具"
            :items="muscle6MultipleAnswerItems" v-model="list.muscle6.MultipleAnswer.text" :rules="emptyObjRules"
            v-if="list.muscle6 && list.muscle6.text == '有'" multiple></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明" v-model="list.muscle6.Other"
            v-if="list.muscle6 && list.muscle6.text == '有'"></v-text-field>
        </div>
      </div>

      <div>
        <h3>跌倒</h3>
        <v-text-field class="mt-2" readonly dense outlined hide-details label="跌倒" :items="fall1Items"
          v-model="list.fall1.text" :rules="emptyRules"></v-text-field>
        <div v-if="list.fall1 && list.fall1.text == '有'" class="d-flex">
          <v-text-field class="mt-2" readonly dense outlined hide-details label="跌倒次數"
            v-model="list.fall1.Answer0"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="選擇受傷情況"
            :items="fall1MultipleAnswerItems" v-model="list.fall1.MultipleAnswer.text" :rules="emptyObjRules"
            multiple></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明"
            v-model="list.fall1.Other"></v-text-field>
        </div>
      </div>

      <div>
        <h3>行為</h3>
        <v-text-field class="mt-2" readonly dense outlined hide-details label="行為" :items="behavior1Items"
          v-model="list.behavior1.text" :rules="emptyRules"></v-text-field>
        <div v-if="list.behavior1 && list.behavior1.text == '有干擾行為'" class="d-flex">
          <v-text-field class="mt-2" readonly dense outlined hide-details label="選擇行為"
            :items="behavior1MultipleAnswerItems" v-model="list.behavior1.MultipleAnswer.text" :rules="emptyObjRules"
            multiple></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明"
            v-model="list.behavior1.Other"></v-text-field>
        </div>
      </div>

      <div>
        <h3>睡眠</h3>
        <v-text-field class="mt-2" readonly dense outlined hide-details label="睡眠" :items="sleep1Items"
          v-model="list.sleep1.text" :rules="emptyRules"></v-text-field>
        <div v-if="list.sleep1 && list.sleep1.text == '有障礙'">
          <div class="d-flex">
            <v-text-field class="mt-2" readonly dense outlined hide-details label="選擇行為"
              :items="sleep1MultipleAnswerItems" v-model="list.sleep1.MultipleAnswer" :rules="emptyObjRules"
              multiple></v-text-field>
            <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明"
              v-model="list.sleep1.Other"></v-text-field>
          </div>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="服用藥物" :items="sleep2Items"
            v-model="list.sleep2.text" :rules="emptyRules"></v-text-field>
          <div v-if="list.sleep2 && list.sleep2.text == '有'">
            <div class="d-flex">
              <v-autocomplete class="mt-2" readonly dense outlined hide-details label="藥物類別" :items="sleep3Items"
                v-model="list.sleep3" :rules="emptyObjRules" multiple></v-autocomplete>
              <v-text-field class="mt-2" readonly dense outlined hide-details label="其他內容說明"
                v-model="list.sleep3[0].Other" v-if="list.sleep3"></v-text-field>
              <v-text-field class="mt-2" readonly dense outlined hide-details label="服用頻率" :items="sleep4Items"
                v-model="list.sleep4.text" :rules="emptyRules"></v-text-field>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3>呼吸</h3>
        <div class="d-flex">
          <v-text-field class="mt-2" readonly dense outlined hide-details label="輔助器" :items="breathe1Items"
            v-model="list.breathe1.text" :rules="emptyRules"></v-text-field>
          <div class="d-flex" v-if="list.breathe1 && list.breathe1.text == '有'">
            <v-text-field class="mt-2" readonly dense outlined hide-details label="選擇輔助器"
              :items="breathe1MultipleAnswerItems" v-model="list.breathe1.MultipleAnswer"
              :rules="emptyObjRules"></v-text-field>
            <v-text-field class="mt-2" readonly dense outlined hide-details label="其他說明"
              v-model="list.breathe1.Other"></v-text-field>
          </div>
        </div>
        <div class="d-flex"
          v-if="list.breathe1 && list.breathe1.text == '有' && list.breathe1.MultipleAnswer && list.breathe1.MultipleAnswer.includes('氧氣機')">
          <v-text-field class="mt-2" readonly dense outlined hide-details label="鼻導管" :items="breathe2Items"
            v-model="list.breathe2.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="L/min" v-model="list.breathe2.Other"
            v-if="list.breathe2 && list.breathe2.text == '有'"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="氧氣面罩" :items="breathe3Items"
            v-model="list.breathe3.text" :rules="emptyRules"></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details label="%" v-model="list.breathe3.Other"
            v-if="list.breathe3 && list.breathe3.text == '有'"></v-text-field>
        </div>
      </div>

      <div>
        <h3>疫苗</h3>
        <v-text-field class="mt-2" readonly dense outlined hide-details label="疫苗" :items="vaccine1Items"
          v-model="list.vaccine1.text" :rules="emptyRules"></v-text-field>
        <div v-if="list.vaccine1 && list.vaccine1.text == '有'">
          <v-row v-for="item, index in list.vaccine1.MultipleAnswer" :key="index">
            <v-col><v-checkbox :label="item.kind" v-model="item.selected" hide-details></v-checkbox></v-col>
            <v-col><v-text-field class="mt-2" readonly dense outlined hide-details type="number" label="西元/年"
                v-model="item.year"></v-text-field></v-col>
            <v-col><v-checkbox label="不記得" v-model="item.forget" hide-details></v-checkbox></v-col>
          </v-row>
        </div>
      </div>


    </v-form>
  </div>
</template>

<script>
export default {
  props: ['list'],
  data() {
    return {
      emptyRules: [(v) => !!v || "不可空白"],
      emptyObjRules: [v => Boolean(Object.keys(v || {})[0]) || "不可空白"],

      //意識
      mind1Items: [
        { Question: '睜眼', text: 4 },
        { Question: '睜眼', text: 3 },
        { Question: '睜眼', text: 2 },
        { Question: '睜眼', text: 1 },
        { Question: '睜眼', text: '閉眼' },
      ],
      mind2Items: [
        { Question: '語言', text: 5 },
        { Question: '語言', text: 4 },
        { Question: '語言', text: 3 },
        { Question: '語言', text: 2 },
        { Question: '語言', text: 1 },
        { Question: '語言', text: '失語症' },
        { Question: '語言', text: '失聰' },
        { Question: '語言', text: '插氣管內管' },
        { Question: '語言', text: '氣切' },
      ],
      mind3Items: [
        { Question: '運動', text: 6 },
        { Question: '運動', text: 5 },
        { Question: '運動', text: 4 },
        { Question: '運動', text: 3 },
        { Question: '運動', text: 2 },
        { Question: '運動', text: 1 },
      ],
      //視力
      vision1Items: [
        { Question: '視力', text: '有障礙' },
        { Question: '視力', text: '無障礙' },
        { Question: '視力', text: '不知道' },
      ],
      vision2Items: [
        { Question: '視力-部位', text: '左(白內障、青光眼、老花眼、近視、其他)' },
        { Question: '視力-部位', text: '右(白內障、青光眼、老花眼、近視、其他)' }
      ],
      vision3Items: [
        { Question: '視力-影響日常活動', text: '否' },
        { Question: '視力-影響日常活動', text: '是' },
      ],
      vision4Items: [
        { Question: '視力-輔具', text: '無' },
        { Question: '視力-輔具', text: '有' },
      ],
      vision4MultipleAnswerItems: ['眼鏡', '放大鏡', '義眼左眼', '義眼右眼', '其他'],
      //聽力
      hearing1Items: [
        { Question: '聽力', text: '有障礙' },
        { Question: '聽力', text: '無障礙' },
        { Question: '聽力', text: '不知道' },
      ],
      hearing2Items: [
        { Question: '聽力-部位', text: '左(重聽、失聰)' },
        { Question: '聽力-部位', text: '右(重聽、失聰)' }
      ],
      hearing3Items: [
        { Question: '聽力-影響日常活動', text: '否' },
        { Question: '聽力-影響日常活動', text: '是' },
      ],
      hearing4Items: [
        { Question: '聽力-輔具', text: '無' },
        { Question: '聽力-輔具', text: '有' },
      ],
      hearing4MultipleAnswerItems: ['助聽器', '其他'],
      hearing4OtherItems: ['左耳', '右耳'],
      //聽力
      communicate1Items: [
        { Question: '溝通', text: '有障礙' },
        { Question: '溝通', text: '無障礙' },
      ],
      communicate2Items: [
        { Question: '溝通-影響日常活動', text: '新問題(4週內)' },
        { Question: '溝通-影響日常活動', text: '舊問題(4週以上)' },
      ],
      communicate3Items: [
        { Question: '說話', text: '良好' },
        { Question: '說話', text: '不清楚' },
        { Question: '說話', text: '僅可簡單表達句子(詞)' },
        { Question: '說話', text: '僅可表達零碎的字' },
        { Question: '說話', text: '無法言語' },
      ],
      communicate4Items: [
        { Question: '理解', text: '良好' },
        { Question: '理解', text: '僅可理解簡單句子(詞)' },
        { Question: '理解', text: '僅可理解關鍵字' },
        { Question: '理解', text: '無法理解' },
      ],
      //口腔
      oralCavity1Items: [
        { Question: '口腔外觀', text: '正常' },
        { Question: '口腔外觀', text: '異常' },
      ],
      oralCavity1MultipleAnswerItems: ['蒼白', '紅腫', '黏膜瘀血或出血', '潰瘍', '其它'],
      oralCavity2Items: [
        { Question: '特殊進食', text: '無' },
        { Question: '特殊進食', text: '有' },
      ],
      oralCavity2MultipleAnswerItems: ['鼻胃管', '胃腸造廔', '特殊種類'],
      oralCavity3Items: [
        { Question: '假牙狀況', text: '無' },
        { Question: '假牙狀況', text: '全口多處無牙，但未裝假牙' },
        { Question: '假牙狀況', text: '有活動假牙' },
        { Question: '假牙狀況', text: '有固定式假牙' },
      ],
      oralCavity3MultipleAnswerItems: ['上顎', '下顎', '全口', '其他'],
      //胃腸
      Gastrointestinal1Items: [
        { Question: '腹部狀態', text: '正常' },
        { Question: '腹部狀態', text: '脹' },
        { Question: '腹部狀態', text: '硬' },
        { Question: '腹部狀態', text: '腫塊' },
        { Question: '腹部狀態', text: '腹水' },
        { Question: '腹部狀態', text: '壓痛' },
        { Question: '腹部狀態', text: '反彈痛' },
        { Question: '腹部狀態', text: '其他' },
      ],
      Gastrointestinal2Items: [
        { Question: '腸蠕動', text: '正常' },
        { Question: '腸蠕動', text: '快' },
        { Question: '腸蠕動', text: '慢' },
        { Question: '腸蠕動', text: '其他' },
      ],
      Gastrointestinal3Items: [
        { Question: '消化狀態', text: '正常' },
        { Question: '消化狀態', text: '不好' },
        { Question: '消化狀態', text: '非常不好' },
        { Question: '消化狀態', text: '其他' },
      ],
      //排泄
      excretion1Items: [
        { Question: '排便型態', text: '正常(至少每三天排便一次)' },
        { Question: '排便型態', text: '不知道' },
        { Question: '排便型態', text: '便秘' },
        { Question: '排便型態', text: '腹瀉' },
        { Question: '排便型態', text: '失禁' },
        { Question: '排便型態', text: '其他' },
      ],
      excretion2Items: [
        { Question: '排便顏色', text: '黃褐' },
        { Question: '排便顏色', text: '墨綠' },
        { Question: '排便顏色', text: '黑便' },
        { Question: '排便顏色', text: '其他' },
        { Question: '排便顏色', text: '不知道' },
      ],
      excretion3Items: [
        { Question: '排便輔助', text: '有' },
        { Question: '排便輔助', text: '無' },
        { Question: '排便輔助', text: '不知道' },
      ],
      excretion3MultipleAnswerItems: ['腸造瘻', '其他'],
      excretion4Items: [
        { Question: '排尿型態', text: '正常' },
        { Question: '排尿型態', text: '多' },
        { Question: '排尿型態', text: '少' },
        { Question: '排尿型態', text: '不知道' },
        { Question: '排尿型態', text: '異常' },
      ],
      excretion4MultipleAnswerItems: ['失禁', '無尿', '頻尿', '排尿困難', '血液透析', '腹膜透析', '其他'],
      excretion5Items: [
        { Question: '排尿顏色', text: '正常' },
        { Question: '排尿顏色', text: '不知道' },
        { Question: '排尿顏色', text: '異常' },
      ],
      excretion6Items: [
        { Question: '排尿輔助', text: '有' },
        { Question: '排尿輔助', text: '無' },
        { Question: '排尿輔助', text: '不知道' },
      ],
      excretion6MultipleAnswerItems: ['尿布', '間歇導尿', '導尿管', '膀胱造瘻', '其他'],
      //皮膚
      skin1Items: [
        { Question: '溫度', text: '溫暖' },
        { Question: '溫度', text: '冰冷' },
        { Question: '溫度', text: '其他' },
      ],
      skin2Items: [
        { Question: '濕度', text: '無異常' },
        { Question: '濕度', text: '過度乾燥' },
        { Question: '濕度', text: '盜汗' },
        { Question: '濕度', text: '其他' },
      ],
      skin3Items: [
        { Question: '顏色', text: '無異常' },
        { Question: '顏色', text: '蒼白' },
        { Question: '顏色', text: '潮紅' },
        { Question: '顏色', text: '發紺' },
        { Question: '顏色', text: '黃疸' },
        { Question: '顏色', text: '其他' },
      ],
      skin4Items: [
        { Question: '水腫級數', text: '無' },
        { Question: '水腫級數', text: '有' },
      ],
      skin4OtherItems: ['輕', '中', '重', '極重'],
      skin5Items: [
        { Question: '水腫等級', text: '輕' },
        { Question: '水腫等級', text: '中' },
        { Question: '水腫等級', text: '重' },
        { Question: '水腫等級', text: '極重' },
      ],
      skin6Items: [
        { Question: '完整', text: '是' },
        { Question: '完整', text: '否' },
      ],
      //肌力
      muscle1Items: [
        { Question: '左上肢', text: 5 },
        { Question: '左上肢', text: 4 },
        { Question: '左上肢', text: 3 },
        { Question: '左上肢', text: 2 },
        { Question: '左上肢', text: 1 },
        { Question: '左上肢', text: '無法測量' },
      ],
      muscle2Items: [
        { Question: '右上肢', text: 5 },
        { Question: '右上肢', text: 4 },
        { Question: '右上肢', text: 3 },
        { Question: '右上肢', text: 2 },
        { Question: '右上肢', text: 1 },
        { Question: '右上肢', text: '無法測量' },
      ],
      muscle3Items: [
        { Question: '左下肢', text: 5 },
        { Question: '左下肢', text: 4 },
        { Question: '左下肢', text: 3 },
        { Question: '左下肢', text: 2 },
        { Question: '左下肢', text: 1 },
        { Question: '左下肢', text: '無法測量' },
      ],
      muscle4Items: [
        { Question: '右下肢', text: 5 },
        { Question: '右下肢', text: 4 },
        { Question: '右下肢', text: 3 },
        { Question: '右下肢', text: 2 },
        { Question: '右下肢', text: 1 },
        { Question: '右下肢', text: '無法測量' },
      ],
      muscle5Items: [
        { Question: '行動能力問題', text: '可獨立於戶外行走' },
        { Question: '行動能力問題', text: '可戶外行走但需人陪伴' },
        { Question: '行動能力問題', text: '只能於室內獨立行走' },
        { Question: '行動能力問題', text: '只能於室內行走且需人陪伴' },
        { Question: '行動能力問題', text: '無法行走' },
      ],
      muscle6Items: [
        { Question: '肌力-輔具', text: '無' },
        { Question: '肌力-輔具', text: '有' },
      ],
      muscle6MultipleAnswerItems: [
        '義肢左手', '義肢右手', '義肢左腳', '義肢右腳', '副木左手', '副木右手', '副木左腳', '副木右腳', '助行器', '單柺', '三/四腳柺', '輪椅', '電動車', '氣墊床', '其他'
      ],
      //跌倒
      fall1Items: [
        { Question: '跌倒', text: '無' },
        { Question: '跌倒', text: '有' },
        { Question: '跌倒', text: '不知道' },
      ],
      fall1MultipleAnswerItems: [
        '瘀青', '皮肉傷口', '頭部外傷', '顱內出血', '腕部骨折', '脊椎骨折', '髖部骨折', '其他'
      ],
      //行為
      behavior1Items: [
        { Question: '行為', text: '無干擾行為' },
        { Question: '行為', text: '有干擾行為' },
      ],
      behavior1MultipleAnswerItems: ['攻擊行為', '自傷', '遊走', '其他'],
      //睡眠
      sleep1Items: [
        { Question: '睡眠', text: '無障礙' },
        { Question: '睡眠', text: '不知道' },
        { Question: '睡眠', text: '有障礙' },
      ],
      sleep1MultipleAnswerItems: ['不易入睡', '早睡', '斷續睡眠', '日夜顛倒', '其他'],
      sleep2Items: [
        { Question: '服用藥物', text: '無' },
        { Question: '服用藥物', text: '有' },
      ],
      sleep3Items: [
        { Question: '藥物類別', text: '抗焦慮劑' },
        { Question: '藥物類別', text: '鎮靜劑' },
        { Question: '藥物類別', text: '抗憂鬱劑' },
        { Question: '藥物類別', text: '抗精神病劑' },
        { Question: '藥物類別', text: '其他' },
      ],
      sleep4Items: [
        { Question: '服用頻率', text: '偶爾' },
        { Question: '服用頻率', text: '每週1-2次' },
        { Question: '服用頻率', text: '每週3-6次' },
        { Question: '服用頻率', text: '每天' },
      ],
      //呼吸
      breathe1Items: [
        { Question: '輔助器', text: '無' },
        { Question: '輔助器', text: '有' },
      ],
      breathe1MultipleAnswerItems: ['氧氣機', '呼吸器', '其他'],
      breathe2Items: [
        { Question: '鼻導管', text: '有' },
        { Question: '鼻導管', text: '無' },
      ],
      breathe3Items: [
        { Question: '氧氣面罩', text: '有' },
        { Question: '氧氣面罩', text: '無' },
      ],
      //疫苗
      vaccine1Items: [
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
      ],
    }
  }
}
</script>