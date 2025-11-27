<template>
  <div>
    <v-form ref="form" class="pa-2">
      <v-text-field class="mt-2" readonly dense outlined hide-details type="date" label="評估日期" v-model="list.Date" :rules="emptyRules"></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq1Items" label="購物" v-model="list.qq1.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq2Items" label="家務" v-model="list.qq2.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq3Items" label="理財" v-model="list.qq3.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq4Items" label="備食" v-model="list.qq4.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq5Items" label="交通" v-model="list.qq5.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq6Items" label="電話" v-model="list.qq6.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq7Items" label="洗衣" v-model="list.qq7.text" :rules="emptyRules" return-object></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details :items="qq8Items" label="服藥" v-model="list.qq8.text" :rules="emptyRules" return-object></v-text-field>
      
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
        {text: '能獨立完成所有購物需求。',Point: 1},
        {text: '只能獨立購買簡單日常必需品。',Point: 0},
        {text: '每一次購物都需要有人陪，只要有人陪伴就可以完成購物。',Point: 0},
        {text: '完全不會獨立購物。',Point: 0},
      ],
      qq2Items:[
        {text: '能單獨處理家事或偶而需要協助較繁重的家事(如：搬動家具、清理廚房且完成歸位)。',Point: 1},
        {text: '能做較簡單的家事，如洗碗、鋪床、疊被。',Point: 1},
        {text: '能做較簡單的家事，但不能達到可被接受的整潔程度。',Point: 1},
        {text: '所有的家事都需要別人協助。',Point: 1},
        {text: '完全不會做家事。',Point: 0},
      ],
      qq3Items:[
        {text: '可獨立處理財務(指到郵局(銀行)提存款、支付房租、帳單、給錢、找錢等)。',Point: 1},
        {text: '可以處理日常的購買(給錢、找錢)，但需要別人協助與銀行往來或大宗買賣。',Point: 1},
        {text: '完全不能處理錢財。',Point: 0},
      ],
      qq4Items:[
        {text: '能獨立計畫、準備食材及佐料、烹煮和擺設一頓飯菜。',Point: 1},
        {text: '如果準備好一切食材及佐料，會做一頓的飯菜。',Point: 0},
        {text: '會將已做好的飯菜加熱。',Point: 0},
        {text: '需要別人把飯菜煮好、擺好。',Point: 0},
      ],
      qq5Items:[
        {text: '能夠自己開車、騎車或自己搭乘大眾運輸工具。',Point: 1},
        {text: '能夠自己搭乘計程車但不能搭乘大眾運輸工具。',Point: 1},
        {text: '當有人陪同時，可搭乘大眾運輸工具。',Point: 1},
        {text: '只能在有人協助或陪同時，可搭乘計程車或自用車。',Point: 0},
        {text: '完全不能出門。 ',Point: 0},
      ],
      qq6Items:[
        {text: '能獨立使用電話，含查電話簿、撥號等。',Point: 1},
        {text: '僅能撥熟悉的電話號碼(個案只能撥少於 5 組的常用電話)。',Point: 1},
        {text: '僅能接電話，但不能撥電話。 ',Point: 1},
        {text: '完全不會使用電話。',Point: 0},
      ],
      qq7Items:[
        {text: '自己清洗所有衣物。',Point: 1},
        {text: '只能清洗小件衣物(如內衣褲、襪子)，需協助晾曬衣物或洗滌厚重衣物。',Point: 1},
        {text: '需完全協助，所有衣物需完全由別人協助洗及晾曬。',Point: 0},
      ],
      qq8Items:[
        {text: '能自己負責在正確的時間服用正確的藥物。',Point: 1},
        {text: '如果能事先將藥物的份量備妥，則可自行服用。',Point: 0},
        {text: '不能自己負責服藥。',Point: 0},
      ],
    }
  }
}
</script>