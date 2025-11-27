<template>
  <div>
    <v-form ref="form" class="pa-2 d-flex flex-wrap">
      <v-text-field class="mt-2" readonly dense outlined hide-details type="date" label="評估日期" v-model="list.Date" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details label="主要診斷(ICD10)" v-model="list.AnsOther_1" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details label="次要診斷" v-model="list.AnsOther_2" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="QuestionItems" label="心臟問題(只包含心臟)" v-model="list.qq1" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="QuestionItems" label="周邊血管系統問題(包括高血壓)" v-model="list.qq2" :rules="emptyRules"></v-text-field>
      <v-text-field style="min-width: 300px;" class="mt-2" readonly dense outlined hide-details :items="QuestionItems" label="造血系統問題(貧血、血球、淋巴、骨髓、脾臟等)" v-model="list.qq3" :rules="emptyRules"></v-text-field>
      <v-text-field style="min-width: 300px;" class="mt-2" readonly dense outlined hide-details :items="QuestionItems" label="呼吸系統問題(肺部、支氣管、氣管及抽菸狀況)" v-model="list.qq4" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="QuestionItems" label="眼耳鼻喉問題" v-model="list.qq5" :rules="emptyRules"></v-text-field>
      <v-text-field style="min-width: 230px;" class="mt-2" readonly dense outlined hide-details :items="QuestionItems" label="上消化道問題(食道、胃、十二指腸)" v-model="list.qq6" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="QuestionItems" label="下消化道問題(小腸、大腸、直腸)" v-model="list.qq7" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="QuestionItems" label="肝膽胰臟問題" v-model="list.qq8" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="QuestionItems" label="腎臟問題" v-model="list.qq9" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" style="min-width: 430px;" readonly dense outlined hide-details :items="QuestionItems" label="其他泌尿生殖系統問題(輸尿管、尿道、膀胱、攝護腺、其他生殖系統問題)" v-model="list.qq10" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="QuestionItems" label="肌肉骨骼皮膚問題" v-model="list.qq11" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" style="min-width: 520px;" readonly dense outlined hide-details :items="QuestionItems" label="內分泌、感染與代謝問題(包含糖尿病、甲狀腺、肥胖、乳房異常、感染性疾病與毒藥物問題)" v-model="list.qq13" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" style="min-width: 400px;" readonly dense outlined hide-details :items="QuestionItems" label="神經系統問題(腦部、脊髓、周邊神經等、不包含失智症)" v-model="list.qq12" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" style="min-width: 420px;" readonly dense outlined hide-details :items="QuestionItems" label="情緒與行為問題(包括憂鬱、焦慮、激躁、急性混亂、瞻妄及失智症等問題)" v-model="list.qq14" :rules="emptyRules"></v-text-field>
    </v-form>
  </div>
</template>

<script>
export default {
  props:['list'],
  data(){
    return {
      emptyRules: [(v) => !!v || "不可空白"],

      QuestionItems:['無','輕微','中等','重度','極重度'],
    }
  }
}
</script>
