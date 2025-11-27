<template>
  <form ref="form" class="pa-3 d-flex flex-wrap">
    <v-text-field class="mt-2" readonly dense outlined hide-details type="date" label="評估日期" v-model="list.Date" :rules="emptyRules"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details :items="IsSmokingItems" label="吸菸" v-model="list.IsSmoking" :rules="emptyRules"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details type="number" label="已戒菸(年)" v-model="list.QuitSmoking" :rules="emptyRules" v-if="list.IsSmoking=='已戒菸'"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details type="number" label="之前吸菸(年)" v-model="list.BeforeSmoking" :rules="emptyRules" v-if="list.IsSmoking=='已戒菸'"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details type="number" label="吸菸約(年)" v-model="list.SmokingYear" :rules="emptyRules" v-if="list.IsSmoking=='吸菸'"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details :items="IsAlcoholItems" label="飲酒" v-model="list.IsAlcohol" :rules="emptyRules"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details type="number" label="已戒酒(年)" v-model="list.QuitAlcohol" :rules="emptyRules" v-if="list.IsAlcohol=='已戒酒'"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details type="number" label="之前喝酒(年)" v-model="list.BeforequitAlcohol" :rules="emptyRules" v-if="list.IsAlcohol=='已戒酒'"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details type="number" label="喝酒約(年)" v-model="list.AlcoholYear" :rules="emptyRules" v-if="list.IsAlcohol=='喝酒'"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details :items="IsBetelNutItems" label="嚼食檳榔" v-model="list.IsBetelNut" :rules="emptyRules"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details type="number" label="已戒(年)" v-model="list.QuitBetelNut" :rules="emptyRules" v-if="list.IsBetelNut=='已戒'"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details type="number" label="之前嚼食(年)" v-model="list.BeforequitBetelNut" :rules="emptyRules" v-if="list.IsBetelNut=='已戒'"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details type="number" label="嚼食約(年)" v-model="list.BetelNutYear" :rules="emptyRules" v-if="list.IsBetelNut=='嚼食'"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details :items="YesNoItems" label="食物過敏" v-model="list.IsAllergy" :rules="emptyRules"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details label="食物過敏說明" v-model="list.Allergy_Desc" :rules="emptyRules" v-if="list.IsAllergy=='有'"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details :items="YesNoItems" label="藥物過敏" v-model="list.IsAllergyDrug" :rules="emptyRules"></v-text-field>
    <v-text-field class="mt-2" readonly dense outlined hide-details label="藥物過敏說明" v-model="list.AllergyDrug_Desc" :rules="emptyRules" v-if="list.IsAllergyDrug=='有'"></v-text-field>
  </form>
</template>

<script>
export default {
  props:['list'],
  data(){
    return {
      emptyRules: [(v) => !!v || "不可空白"],
      
      IsSmokingItems:['不吸菸','已戒菸','吸菸'],
      IsAlcoholItems:['不喝酒','已戒酒','喝酒'],
      IsBetelNutItems:['不嚼','已戒','嚼食'],
      YesNoItems:['無','有','不知道'],
    }
  },
}
</script>