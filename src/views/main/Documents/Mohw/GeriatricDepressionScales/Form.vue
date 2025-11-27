<template>
  <div>
    <v-form ref="form" class="pa-2 d-flex flex-wrap">
      <v-text-field class="mt-2" readonly dense outlined hide-details type="date" label="評估日期" v-model="list.Date" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="YnItems" label="您對您的生活感到滿意嗎？ " v-model="list.qq1.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="YnItems2" label="您是否常常感到厭煩？" v-model="list.qq2.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field style="min-width:250px;" class="mt-2" readonly dense outlined hide-details :items="YnItems" label="您是否常常感到無論做什麼都沒有用？" v-model="list.qq3.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field style="min-width:400px;" class="mt-2" readonly dense outlined hide-details :items="YnItems" label="您是否比較喜歡待在家裡，較不喜歡外出及不喜歡做新的事？" v-model="list.qq4.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="YnItems" label="您是否感覺活得很沒有價值？" v-model="list.qq5.text" :rules="emptyRules" return-object></v-text-field>
      
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
        {text: '是',Point: 0},
        {text: '否',Point: 1},
      ],
      YnItems2:[
        {text: '是',Point: 1},
        {text: '否',Point: 0},
      ],
    }
  }
}
</script>