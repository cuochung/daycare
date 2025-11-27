<template>
  <div class="HealthyHabitsAdd">
    <v-dialog v-model="dialog">
      <template v-slot:activator="{ on }">
        <v-icon color="red lighten-2" dark v-on="on" @click="addProcess"
          >mdi-plus-circle</v-icon
        >
      </template>

      <v-card>
        <v-card-title :class="titleStyle" primary-title>{{
          title
        }}</v-card-title>

        <v-card-text>
          <v-form ref="form" class="mt-3">
            <v-text-field type="date" label="評估日期" v-model="list.Date" :rules="emptyRules"></v-text-field>
            <div class="d-flex">
              <v-autocomplete :items="IsSmokingItems" label="吸菸" v-model="list.IsSmoking" :rules="emptyRules"></v-autocomplete>
              <v-text-field type="number" label="已戒菸(年)" v-model="list.QuitSmoking" class="mx-2" :rules="emptyRules" v-if="list.IsSmoking=='已戒菸'"></v-text-field>
              <v-text-field type="number" label="之前吸菸(年)" v-model="list.BeforeSmoking" :rules="emptyRules" v-if="list.IsSmoking=='已戒菸'"></v-text-field>
              <v-text-field type="number" label="吸菸約(年)" v-model="list.SmokingYear" class="mx-2" :rules="emptyRules" v-if="list.IsSmoking=='吸菸'"></v-text-field>
            </div>
            <div class="d-flex">
              <v-autocomplete :items="IsAlcoholItems" label="飲酒" v-model="list.IsAlcohol" :rules="emptyRules"></v-autocomplete>
              <v-text-field type="number" label="已戒酒(年)" v-model="list.QuitAlcohol" class="mx-2" :rules="emptyRules" v-if="list.IsAlcohol=='已戒酒'"></v-text-field>
              <v-text-field type="number" label="之前喝酒(年)" v-model="list.BeforequitAlcohol" :rules="emptyRules" v-if="list.IsAlcohol=='已戒酒'"></v-text-field>
              <v-text-field type="number" label="喝酒約(年)" v-model="list.AlcoholYear" class="mx-2" :rules="emptyRules" v-if="list.IsAlcohol=='喝酒'"></v-text-field>
            </div>
            <div class="d-flex">
              <v-autocomplete :items="IsBetelNutItems" label="嚼食檳榔" v-model="list.IsBetelNut" :rules="emptyRules"></v-autocomplete>
              <v-text-field type="number" label="已戒(年)" v-model="list.QuitBetelNut" class="mx-2" :rules="emptyRules" v-if="list.IsBetelNut=='已戒'"></v-text-field>
              <v-text-field type="number" label="之前嚼食(年)" v-model="list.BeforequitBetelNut" :rules="emptyRules" v-if="list.IsBetelNut=='已戒'"></v-text-field>
              <v-text-field type="number" label="嚼食約(年)" v-model="list.BetelNutYear" class="mx-2" :rules="emptyRules" v-if="list.IsBetelNut=='嚼食'"></v-text-field>
            </div>
            <div class="d-flex">
              <v-autocomplete :items="YesNoItems" label="食物過敏" v-model="list.IsAllergy" :rules="emptyRules"></v-autocomplete>
              <v-text-field label="食物過敏說明" v-model="list.Allergy_Desc" class="mx-2" :rules="emptyRules" v-if="list.IsAllergy=='有'"></v-text-field>
            </div>
            <div class="d-flex">
              <v-autocomplete :items="YesNoItems" label="藥物過敏" v-model="list.IsAllergyDrug" :rules="emptyRules"></v-autocomplete>
              <v-text-field label="藥物過敏說明" v-model="list.AllergyDrug_Desc" class="mx-2" :rules="emptyRules" v-if="list.IsAllergyDrug=='有'"></v-text-field>
            </div>
            
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="primary"
            @click="addOK"
            v-if="processType == 'add'"
            :loading="loading"
            :disabled="loading"
            >確認新增</v-btn
          >
          <v-btn
            class="success"
            @click="editOK"
            v-if="processType == 'edit'"
            :loading="loading"
            :disabled="loading"
            >確認修改</v-btn
          >
        </v-card-actions>
        <!-- <pre>{{this.$store.state.uData}}</pre>  -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  props:['items'], //使用中的全部資料,己排序過
  data() {
    return {
      dialog: false,
      list: {}, //表單內資料
      processType: "", //存放頁面執行是add新增或edit修改
      title: "",
      titleStyle: "",
      emptyRules: [(v) => !!v || "不可空白"],
      loading: false,

      IsSmokingItems:['不吸菸','已戒菸','吸菸'],
      IsAlcoholItems:['不喝酒','已戒酒','喝酒'],
      IsBetelNutItems:['不嚼','已戒','嚼食'],
      YesNoItems:['無','有','不知道'],
    };
  },

  methods: {
    addProcess() {
      this.processType = "add";
      this.title = "新增資料";
      this.titleStyle = "font-weight-black error lighten-2";
      this.list = {};
      if (this.items.length){
        this.list = JSON.parse(JSON.stringify(this.items[0]))
        delete this.list.snkey;
        delete this.list.user_snkey;
        delete this.list.create_man;
        delete this.list.create_man_snkey;
        delete this.list.edit_man;
        delete this.list.uploadData;
        delete this.list.uploadState;
      }
      this.$nextTick(() => {
        this.$refs.form.resetValidation();
      });

    },
    editProcess(item) {
      this.dialog = true;
      this.processType = "edit";
      this.title = "修改資料";
      this.titleStyle = "font-weight-black success lighten-2";
      this.list = JSON.parse(JSON.stringify(item)); //複制一份實際修改資料內容
    },
    addOK() {
      //確認新增
      if (this.$refs.form.validate()) {
        this.list.user_snkey = this.$store.state.uData.snkey;
        this.list.create_man = this.$store.state.pData.username + "(" + dayjs().format("YYYY-MM-DD HH:mm:ss") + ")";
        this.list.create_man_snkey  = this.$store.state.pData.snkey;
        var postData = {
          datalist: JSON.stringify(this.list)
        };
        this.loading = true;
        this.$api.options("general/add/" + this.$store.state.databaseName + "/healthyhabits",postData)
          .then((rs) => {
            if (rs.state == 1) {
              var pop = { msg: "已新增", type: true, theme: "success" };
              this.$store.commit("snackbar", pop);
              this.$emit("getAllData");
              this.dialog = false;
              this.loading = false;
              
            }
          });
      } else {
        var pop = {
          msg: "資料輸入不完全!!請重新確認!!",
          type: true,
          theme: "warning",
        };
        this.$store.commit("snackbar", pop);
      }
    },
    editOK() {
      //確認修改
      if (this.$refs.form.validate()) {
        if (!this.list.edit_man){this.list.edit_man = ''}
        this.list.edit_man = this.$store.state.pData.username + "(" + dayjs().format("YYYY-MM-DD HH:mm:ss") + ")" + this.list.edit_man;
        let postData = {
          snkey: this.list.snkey,
          datalist: JSON.stringify(this.list),
        };

        this.loading = true;
        this.$api.options("general/edit/" + this.$store.state.databaseName + "/healthyhabits",postData)
          .then((rs) => {
            if (rs.state == 1) {
              let pop = { msg: "已修改", type: true, theme: "success" };
              this.$store.commit("snackbar", pop);
              this.$emit("getAllData");
              this.loading = false;
              this.dialog = false;
            }
          });
      } else {
        let pop = {
          msg: "資料輸入不完全!!請重新確認!!",
          type: true,
          theme: "warning",
        };
        this.$store.commit("snackbar", pop);
      }
    },
  },
};
</script>