<template>
  <div>
    <v-form ref="form" class="pa-2 d-flex flex-wrap">
      <v-text-field class="mt-2" readonly dense outlined hide-details type="date" label="評估日期" v-model="list.Date"
      ></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details label="睡眠困難，譬如難以入睡、易醒或早醒"
        v-model="list.qq1.text" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details label="感覺緊張或不安"
        v-model="list.qq2.text" return-object></v-text-field>
      <v-text-field style="min-width:250px;" class="mt-2" readonly dense outlined hide-details
        label="覺得容易苦惱或動怒" v-model="list.qq3.text" return-object></v-text-field>
      <v-text-field style="min-width:400px;" class="mt-2" readonly dense outlined hide-details
        label="感覺憂鬱、心情低落" v-model="list.qq4.text" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details label="覺得比不上別人"
        v-model="list.qq5.text" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details label="有自殺的想法"
        v-model="list.qq6.text" return-object></v-text-field>

    </v-form>
  </div>
</template>

<script>
export default {
  props:['list'],
  data(){
    return {
      // emptyRules: [(v) => !!v || "不可空白"],

      // YnItems:[
      //   {text: '是',Point: 0},
      //   {text: '否',Point: 1},
      // ],
      // YnItems2:[
      //   {text: '是',Point: 1},
      //   {text: '否',Point: 0},
      // ],
    }
  }
}
</script>