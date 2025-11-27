<template>
  <div>
    <v-form ref="form" class="pa-2">
      <v-text-field class="mt-2" readonly dense outlined hide-details type="date" label="評估日期" v-model="list.Date" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq1Items" label="進食" v-model="list.qq1.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq2Items" label="移位" v-model="list.qq2.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq3Items" label="衛生" v-model="list.qq3.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq4Items" label="如廁" v-model="list.qq4.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq5Items" label="洗澡" v-model="list.qq5.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq6Items" label="走動" v-model="list.qq6.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq7Items" label="樓梯" v-model="list.qq7.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq8Items" label="穿脫" v-model="list.qq8.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq9Items" label="大便" v-model="list.qq9.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq10Items" label="小便" v-model="list.qq10.text" :rules="emptyRules" return-object></v-text-field>
      
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
        {text: '不需他人協助，在合理的時間(一小時)內，可自行用餐具取用眼前食物，或能自行取用穿脫進食輔具，將餐盤內食物吃完。',Point: 10},
        {text: '需他人協助取用或切好食物或穿脫進食輔具，但可自行吃飯。',Point: 5},
        {text: '無法自行取食。',Point: 0},
      ],
      qq2Items:[
        {text: '可自行坐起，且由床移位至椅子或輪椅，使用輪椅的煞車及腳踏板，都不需要他人協助，且沒有安全上的顧慮。',Point: 15},
        {text: '移位時需要少部分協助或提醒，且有安全上的顧慮。',Point: 10},
        {text: '可自行坐起，但移位至椅子或輪椅，需他人大部份的協助。',Point: 5},
        {text: '不能自行移位，完全需他人協助才能坐起或移位。',Point: 0},
      ],
      qq3Items:[
        {text: '可自行刷牙、洗臉、洗手、梳頭及刮鬍子。',Point: 5},
        {text: '他人協助才能完成上述盥洗項目。',Point: 0},
      ],
      qq4Items:[
        {text: '可自行上下馬桶，穿脫衣褲且不弄髒衣物，自行取用衛生紙擦拭清潔，且不需他人協助。如使用便盆(尿壺)，可自行取放並清洗乾淨。',Point: 10},
        {text: '需扶持使用馬桶或便盆(尿壺)，協助整理衣物或使用衛生紙或協助清理便盆(尿壺)。',Point: 5},
        {text: '完全需要他人協助。',Point: 0},
      ],
      qq5Items:[
        {text: '可自行完成盆浴、淋浴或擦澡。',Point: 5},
        {text: '他人協助才能完成，或可自行完成，但執行困難或清潔度不佳。',Point: 0},
      ],
      qq6Items:[
        {text: '使用或不使用輔具(包括拐杖、支架、義肢或助行器)皆可獨立行走50公尺以上，無安全顧慮。',Point: 15},
        {text: '需他人稍微扶持(如一手攙扶)或口頭教導，才可行走50公尺以上(一口氣走完或中間休息一次)。',Point: 10},
        {text: '雖無法行走，但可獨立操作輪椅或電動輪椅(包含轉彎、進門及接近桌子、床沿)並可推行輪椅50公尺以上。',Point: 5},
        {text: '不能行走50公尺，且無法操縱輪椅，完全依賴他人。',Point: 5},
      ],
      qq7Items:[
        {text: '可自行上下樓梯(可抓扶手或用柺扙)。',Point: 10},
        {text: '需要他人稍微扶持(指一手輕扶)或口頭指導。',Point: 5},
        {text: '完全無法上下樓梯。',Point: 0},
      ],
      qq8Items:[
        {text: '可自行穿脫衣褲鞋襪，必要時使用輔具。',Point: 10},
        {text: '在別人幫助下，可自行完成一半以上動作。',Point: 5},
        {text: '需要他人完全幫忙。',Point: 0},
      ],
      qq9Items:[
        {text: '無失禁(控)，或當便秘、需要時能自行使用塞劑、甘油球，不需他人協助。',Point: 10},
        {text: '偶而失禁(控)(每週不超過一次)，或當便秘時需協助使用塞劑。',Point: 5},
        {text: '失禁(控)(每週超過二次(含)以上)或當便秘時需要灌腸。',Point: 0},
      ],
      qq10Items:[
        {text: '日夜皆無尿失禁(控)，可完全自我控制。',Point: 10},
        {text: '偶而失禁(控)(每週不超過一次)，使用尿布尿套時需他人幫忙。',Point: 5},
        {text: '失禁(控)(每週超過二次(含)以上)或使用導尿管。',Point: 0},
      ],
    }
  }
}
</script>