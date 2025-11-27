<template>
  <div>
    <v-form ref="form" class="pa-2">
      <v-text-field  class="mt-2" readonly dense outlined hide-details type="date" label="評估日期" v-model="list.Date" :rules="emptyRules"></v-text-field>
      <v-text-field  class="mt-2" readonly dense outlined hide-details :items="qq1Items" label="知覺感受" v-model="list.qq1.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field  class="mt-2" readonly dense outlined hide-details :items="qq2Items" label="潮溼程度" v-model="list.qq2.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field  class="mt-2" readonly dense outlined hide-details :items="qq3Items" label="活動能力" v-model="list.qq3.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field  class="mt-2" readonly dense outlined hide-details :items="qq4Items" label="移動能力" v-model="list.qq4.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field  class="mt-2" readonly dense outlined hide-details :items="qq5Items" label="營養攝取" v-model="list.qq5.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field  class="mt-2" readonly dense outlined hide-details :items="qq6Items" label="摩擦力/剪力" v-model="list.qq6.text" :rules="emptyRules" return-object></v-text-field>
      
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
        {text: '完全受限：因為意識減弱或使用鎮定劑，對疼痛刺激沒有反應',Point: 1},
        {text: '大部分受限：只對疼痛刺激有反應；除了呻吟或焦躁不安，無法表達不適',Point: 2},
        {text: '稍微受限：對指令有反應；但有時無法表達不適；(一或兩個肢體對疼痛或不適的感覺能力受限)',Point: 3},
        {text: '沒有受損：對指令有反應；能表達不適',Point: 4},
      ],
      qq2Items:[
        {text: '總是潮溼：皮膚總是被汗水、大小便等浸潤；每兩小時予病人翻身時，都會發現皮膚是潮溼的',Point: 1},
        {text: '經常潮溼：皮膚經常是浸潤的；衣褲/尿布/看護墊等至少每8小時需更換 ≧ 2次',Point: 2},
        {text: '偶爾潮溼：皮膚偶爾是浸潤的；衣褲/尿布/看護墊等至少每8小時需更換1次',Point: 3},
        {text: '很少潮溼：皮膚通常保持乾燥；衣褲/尿布/看護墊等只需要依常規的時間，每天更換一次',Point: 4},
      ],
      qq3Items:[
        {text: '受限於床上',Point: 1},
        {text: '受限於椅子：無法行走或走路極為困難；無法支撐自己的體重',Point: 2},
        {text: '偶爾走動：但是步行短距離，有時需要協助；大部份時間在床上或椅子上',Point: 3},
        {text: '經常走動',Point: 4},
      ],
      qq4Items:[
        {text: '完全無法自行移動',Point: 1},
        {text: '大部份需協助才能移動',Point: 2},
        {text: '少部份需協助才能移動',Point: 3},
        {text: '無限制',Point: 4},
      ],
      qq5Items:[
        {text: '總攝取量 < 50%',Point: 1},
        {text: '50% ≦ 總攝取量 < 75%',Point: 2},
        {text: '總攝取量 ≧ 75%',Point: 3},
        {text: '總攝取量完整',Point: 4},
      ],
      qq6Items:[
        {text: '有此問題：移動時需要中度到極大的協助；完全抬起來而不與床單接觸是不可能的',Point: 1},
        {text: '有潛在問題：移動時需要輕微協助',Point: 2},
        {text: '沒有明顯問題：可獨立在床上或椅子上移動',Point: 3},
      ],
    }
  }
}
</script>