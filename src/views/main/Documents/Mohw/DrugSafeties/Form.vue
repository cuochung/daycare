<template>
  <div>
    <v-form ref="form" class="pa-2 d-flex flex-wrap">
      <v-text-field class="mt-2" readonly dense outlined hide-details
        type="date"
        label="評估日期"
        v-model="list.Date"
        :rules="emptyRules"
      ></v-text-field>
      <v-text-field class="mt-2" readonly dense outlined hide-details
        label="是否有長期使用藥物"
        :items="LongUseingItems"
        v-model="list.LongUseing"
      ></v-text-field>
    </v-form>

    <div v-if="list.LongUseing == '有'" class="pa-2 d-flex flex-wrap">
        <div class="d-flex">
          <v-text-field class="mt-2" readonly dense outlined hide-details
            :items="YnItems"
            label="目前使用中的藥物種類"
            v-model="list.qq1"
            :rules="emptyRules"
          ></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details
            type="number"
            label="總共幾種"
            v-model="list.qq1Statement1"
            :rules="emptyRules"
            v-if="list.qq1 == '有'"
          
          ></v-text-field>
        </div>
        <v-text-field class="mt-2" readonly dense outlined hide-details
          :items="YnItems"
          label="使用精神用藥"
          v-model="list.qq2"
          :rules="emptyRules"
        ></v-text-field>
        <v-text-field class="mt-2" readonly dense outlined hide-details
          :items="YnItems"
          label="使用止痛用藥"
          v-model="list.qq3"
          :rules="emptyRules"
        ></v-text-field>
        <v-text-field class="mt-2" readonly dense outlined hide-details
          :items="YnKindItems"
          label="是否存在多重用藥問題(自動判讀)"
          v-model="list.qq4"
        ></v-text-field>
        <div class="d-flex">
          <v-text-field class="mt-2" readonly dense outlined hide-details
            style="min-width:390px"
            :items="YnItems"
            label="目前是否使用有自行購藥(電台、他人介紹…等非醫療院所取得)"
            v-model="list.qq5"
            :rules="emptyRules"
          ></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details
            type="number"
            label="總共幾種"
            v-model="list.qq5Statement5"
            :rules="emptyRules"
            v-if="list.qq5 == '有'"
          
          ></v-text-field>
        </div>
      </div>

    <v-alert class="ma-2 pa-1" outlined>
      <div class="d-flex align-center">
        <h3>使用中之藥物</h3>
        <!-- <v-btn class="success mx-2" small @click.stop="addMedicine()"><v-icon>mdi-plus</v-icon> 新增</v-btn> -->
      </div>
      <v-divider class="my-2"></v-divider>
      <div
        v-for="(item, index) in list.DrugInUses"
        :key="index"
        class="grey lighten-3 pa-2 mt-1"
        style="border-radius: 5px"
      >
        <div class="d-flex justify-space-between">
          <span>#{{ index + 1 }}</span>
          <!-- <v-btn class="error" small @click.stop="delMedicine(index)"
            ><v-icon>mdi-close</v-icon> 刪除</v-btn
          > -->
        </div>
        <v-text-field class="mt-2" readonly dense outlined hide-details
          label="品項"
          v-model="item.Name"
          :rules="emptyRules"
        ></v-text-field>
        <div class="d-flex">
          <v-text-field class="mt-2" readonly dense outlined hide-details
            label="劑量"
            v-model="item.Volume"
            :rules="emptyRules"
          ></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details
            label="頻率"
            v-model="item.Frequency"
          
            :rules="emptyRules"
          ></v-text-field>
          <v-text-field class="mt-2" readonly dense outlined hide-details
            label="目的"
            v-model="item.Purpose"
            :rules="emptyRules"
          ></v-text-field>
        </div>
        <v-text-field class="mt-2" readonly dense outlined hide-details label="備註" v-model="item.Remark"></v-text-field>
      </div>
    </v-alert>
  </div>
</template>

<script>
export default {
  props: ["list"],
  data() {
    return {
      emptyRules: [(v) => !!v || "不可空白"],

      LongUseingItems: ["有", "無"],
      YnItems: ["無", "有", "不知道"],
      YnKindItems: ["無", "≧5種", "≧9種", "不知道"],
    };
  },
};
</script>