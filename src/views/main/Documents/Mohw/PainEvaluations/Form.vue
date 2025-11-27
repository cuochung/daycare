<template>
  <div>
    <v-form ref="form" class="pa-2">
      <v-text-field class="mt-2" readonly dense outlined hide-details type="date" label="評估日期" v-model="list.Date" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details label="備註" v-model="list.qq5"></v-text-field>
      <div v-if="!list.qq5">
        <v-text-field class="mt-2" readonly dense outlined hide-details label="部位" v-model="list.qq1" :rules="emptyRules"></v-text-field>
        <v-text-field class="mt-2" readonly dense outlined hide-details type="number" label="分數" v-model="list.qq2" :rules="emptyRules"></v-text-field>
        <v-text-field class="mt-2" readonly dense outlined hide-details label="時間" v-model="list.qq3" :rules="emptyRules"></v-text-field>
        <v-text-field class="mt-2" readonly dense outlined hide-details label="性質" v-model="list.qq4" :rules="emptyRules"></v-text-field>
      </div>
      

      <!-- <v-alert color="red" outlined>
        疼痛分數以1到10分來評估自己感覺疼痛程度。
        「1-3分」為輕微疼痛
        「4-6分」為中度疼痛
        「7-9分」為重度疼痛
        「10分」為最無法忍受的疼痛程度
        若個案無疼痛或其他情形請填寫備註。
      </v-alert> -->
      
    </v-form>
  </div>
</template>

<script>
export default {
  props:['list'],
  data(){
    return {
      emptyRules: [(v) => !!v || "不可空白"],
    }
  }
}
</script>