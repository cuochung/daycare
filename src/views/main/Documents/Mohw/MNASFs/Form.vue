<template>
  <div>
    <v-form ref="form" class="pa-2 d-flex flex-wrap">
      <v-text-field class="mt-2" readonly dense outlined hide-details type="date" label="評估日期" v-model="list.Date" :rules="emptyRules"></v-text-field>
      <v-text-field style="min-width:500px;" class="mt-2" readonly dense outlined hide-details :items="qq1Items" label="過去三個月之中，是否因食慾不佳、消化問題、咀嚼或吞嚥困難，以致進食量減少?" v-model="list.qq1.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq2Items" label="近三個月體重變化" v-model="list.qq2.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq3Items" label="行動力" v-model="list.qq3.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field style="min-width:300px;" class="mt-2" readonly dense outlined hide-details :items="qq4Items" label="過去三個月內曾有精神性壓力或急性疾病發作?" v-model="list.qq4.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq5Items" label="神經精神問題" v-model="list.qq5.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq6Items" label="身體質量指數(BMI)=體重(公斤)/身高(公尺)2" v-model="list.qq6.text" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq7Items" label="若BMI無法取得，用小腿圍代替6-1.小腿圍(公分)" v-model="list.qq7" return-object></v-text-field>
      
    </v-form>
  </div>
</template>

<script>
export default {
  props:['list'],
  data(){
    return {
      emptyRules: [(v) => !!v || "不可空白"],

      qq1Items:[
        {text: '嚴重食慾不佳',Point: 0},
        {text: '中度食慾不佳',Point: 1},
        {text: '食慾無變化',Point: 2},
      ],
      qq2Items:[
        {text: '體重減輕>3公斤',Point: 0},
        {text: '不知道',Point: 1},
        {text: '體重減輕1~3公斤',Point: 2},
        {text: '體重無改變',Point: 3},
      ],
      qq3Items:[
        {text: '臥床或輪椅',Point: 0},
        {text: '可以下床活動或離開輪椅但無法自由活動',Point: 1},
        {text: '可以自由走動',Point: 2},
      ],
      qq4Items:[
        {text: '是',Point: 0},
        {text: '否',Point: 2},
      ],
      qq5Items:[
        {text: '嚴重認知障礙或抑鬱',Point: 0},
        {text: '輕度痴呆',Point: 1},
        {text: '無精神問題',Point: 2},
      ],
      qq6Items:[
        {text: 'BMI<19',Point: 0},
        {text: '19≦BMI<21',Point: 1},
        {text: '21≦BMI<23',Point: 2},
        {text: 'BMI≧23',Point: 3},
      ],
      qq7Items:[
        {text: '小腿圍<31',Point: 0},
        {text: '小腿圍≧31',Point: 3},
        {text: '臂中圍<22',Point: 0},
        {text: '臂中圍≧22',Point: 3},
      ],
    }
  }
}
</script>