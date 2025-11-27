<template>
  <div>
    <v-form ref="form" class="pa-2 d-flex flex-wrap">
      <v-text-field class="mt-2" readonly dense outlined hide-details type="date" label="評估日期" v-model="list.Date" :rules="emptyRules"></v-text-field>
      <v-text-field style="min-width:800px;" class="mt-2" readonly dense outlined hide-details :items="YnItems" label="體重減輕 [非刻意減重狀況下，過去一年體重減少3公斤或5%以上?(先問個案體重和一年相較差不多還是減少?如果減少再問大約減少幾公斤?)]" v-model="list.qq1.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field style="min-width:300px;" class="mt-2" readonly dense outlined hide-details :items="YnItems" label="下肢功能 [無法在不用手支撐的情況下，從椅子上站起來五次]" v-model="list.qq2.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="YnItems" label="活力降低 [過去一週內，有覺得提不起勁做事?(一個禮拜三天以上有這個感覺)]" v-model="list.qq3.text" :rules="emptyRules" return-object></v-text-field>
      
    </v-form>
  </div>
</template>

<script>
export default {
  props:['list'],
  data(){
    return {
      emptyRules: [(v) => !!v || "不可空白"],

      YnItems:[
        {text: '是',Point: 1},
        {text: '否',Point: 0},
      ],
    }
  }
}
</script>