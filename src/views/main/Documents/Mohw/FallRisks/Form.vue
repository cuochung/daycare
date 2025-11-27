<template>
  <div>
    <v-form ref="form" class="pa-2 d-flex flex-wrap">
      <v-text-field class="mt-2" readonly dense outlined hide-details type="date" label="評估日期" v-model="list.Date" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq1Items" label="年紀≧65歲以上" v-model="list.qq1.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq2Items" label="過去一年內曾跌倒" v-model="list.qq2.text" :rules="emptyRules" return-object></v-text-field>
      <div class="d-flex">
        <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq3Items" label="最近意識/認知出現異常" v-model="list.qq3.text" :rules="emptyRules" return-object ></v-text-field>
        <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq3OptionsItems" label="異常選擇" v-model="list.qq3.Options" :rules="emptyRules" multiple v-if="list.qq3 && list.qq3.text == '是'"></v-text-field>
      </div>
      <div class="d-flex">
        <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq4Items" label="活動功能異常" v-model="list.qq4.text" :rules="emptyRules" return-object ></v-text-field>
        <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq4OptionsItems" label="異常選擇" v-model="list.qq4.Options" :rules="emptyRules" multiple v-if="list.qq4 && list.qq4.text == '是'"></v-text-field>
      </div>
      <div class="d-flex">
        <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq5Items" label="體能虛弱" v-model="list.qq5.text" :rules="emptyRules" return-object ></v-text-field>
        <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq5OptionsItems" label="異常選擇" v-model="list.qq5.Options" :rules="emptyRules" multiple v-if="list.qq5 && list.qq5.text == '是'"></v-text-field>
      </div>
      <div class="d-flex">
        <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq6Items" label="知覺障礙" v-model="list.qq6.text" :rules="emptyRules" return-object ></v-text-field>
        <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq6OptionsItems" label="異常選擇" v-model="list.qq6.Options" :rules="emptyRules" multiple v-if="list.qq6 && list.qq6.text == '是'"></v-text-field>
      </div>
      <div class="d-flex">
        <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq7Items" label="暈眩/低血壓" v-model="list.qq7.text" :rules="emptyRules" return-object ></v-text-field>
        <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq7OptionsItems" label="異常選擇" v-model="list.qq7.Options" :rules="emptyRules" multiple v-if="list.qq7 && list.qq7.text == '是'"></v-text-field>
      </div>
      <div class="d-flex">
        <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq8Items" label="使用藥物" v-model="list.qq8.text" :rules="emptyRules" return-object ></v-text-field>
        <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq8OptionsItems" label="異常選擇" v-model="list.qq8.Options" :rules="emptyRules" multiple v-if="list.qq8 && list.qq8.text == '是'"></v-text-field>
      </div>
      
    </v-form>
  </div>
</template>

<script>
export default {
  props:['list'],
  data(){
    return {
      emptyRules: [(v) => !!v || "不可空白"],

      qq1Items:[{text: '否',Point: 0}, {text: '是',Point: 1},],
      qq2Items:[{text: '否',Point: 0}, {text: '是',Point: 3},],
      qq3Items:[{text: '否',Point: 0}, {text: '是',Point: 3},],
      qq4Items:[{text: '否',Point: 0}, {text: '是',Point: 3},],
      qq5Items:[{text: '否',Point: 0}, {text: '是',Point: 3},],
      qq6Items:[{text: '否',Point: 0}, {text: '是',Point: 3},],
      qq7Items:[{text: '否',Point: 0}, {text: '是',Point: 3},],
      qq8Items:[{text: '否',Point: 0}, {text: '是',Point: 3},],

      qq3OptionsItems:[
        '曾突發意識改變','曾突發全身性抽蓄','目前意識狀態變差','目前心智狀態變差','躁動','合作度差','麻醉未醒'
      ],
      qq4OptionsItems:[
        '活動障礙','一側肢體肌力≦4分','平衡感障礙','行走協調功能差'
      ],
      qq5OptionsItems:[
        '無力','活動費力','身體耐受力不足','行動遲緩'
      ],
      qq6OptionsItems:[
        '雙眼視力障礙','位置感缺失','偏盲','半邊忽略','無法判定'
      ],
      qq7OptionsItems:[
        '頭暈','暈眩','姿位性低血壓','低血壓'
      ],
      qq8OptionsItems:[
        '麻醉止痛劑','鎮靜安眠劑','散瞳劑','鎮攣劑','肌肉鬆弛劑','降壓利尿劑','瀉劑','抗鬱劑','其他'
      ],
    }
  }
}
</script>