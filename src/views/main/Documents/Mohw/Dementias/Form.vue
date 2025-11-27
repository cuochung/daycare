<template>
  <div>
    <v-form ref="form" class="pa-2">
      <v-text-field class="mt-2" readonly dense outlined hide-details type="date" label="評估日期" v-model="list.Date" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="YnItems" label="今天是幾年幾月幾日？__年__月__日 [年月日都對才算正確。]" v-model="list.qq1.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="YnItems" label="今天是星期幾？ [星期對才算正確。]" v-model="list.qq2.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="YnItems" label="這裡是什麼地方？ [對所在地的任何描述皆正確，如正確說出「我家」或「城鎮」等都可接受。]" v-model="list.qq3.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="YnItems" label="你的電話號碼是幾號？ [證實電話號碼無誤即算正確或會談時，能在兩次間隔較長的時間內重複相同的號碼即算正確。]" v-model="list.qq4.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="YnItems" label="你住在什麼地方？ [當個案沒有電話時才問。]" v-model="list.qq5.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="YnItems" label="你幾歲了？ [年齡與出生年月日符合才算正確。]" v-model="list.qq6.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="YnItems" label="你的生日是哪一天？ [年月日都對才算正確。]" v-model="list.qq7.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="YnItems" label="現任總統是誰？ [姓氏正確即可。]" v-model="list.qq8.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="YnItems" label="前任總統是誰？ [姓氏正確即可。]" v-model="list.qq9.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="YnItems" label="你媽媽叫什麼名字？ [不需特別證實，當個案說出一個與他不同的女性姓名即可。]" v-model="list.qq10.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="YnItems" label="從 20 減 3 開始算，一直減 3 減下去。 [期間如出現任何錯誤或無法繼續進行即算錯誤。]" v-model="list.qq11.text" :rules="emptyRules" return-object></v-text-field>
      
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
        {text: '對',Point: 1},
        {text: '錯',Point: 0},
      ],
    }
  }
}
</script>