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
            <v-autocomplete :items="qq1Items" label="年紀≧65歲以上" v-model="list.qq1" :rules="emptyRules" return-object></v-autocomplete>
            <v-autocomplete :items="qq2Items" label="過去一年內曾跌倒" v-model="list.qq2" :rules="emptyRules" return-object></v-autocomplete>
            <div class="d-flex">
              <v-autocomplete :items="qq3Items" label="最近意識/認知出現異常" v-model="list.qq3" :rules="emptyRules" return-object class="mr-2"></v-autocomplete>
              <v-autocomplete :items="qq3OptionsItems" label="異常選擇" v-model="list.qq3.Options" :rules="emptyObjRules" multiple v-if="list.qq3 && list.qq3.text == '是'"></v-autocomplete>
            </div>
            <div class="d-flex">
              <v-autocomplete :items="qq4Items" label="活動功能異常" v-model="list.qq4" :rules="emptyRules" return-object class="mr-2"></v-autocomplete>
              <v-autocomplete :items="qq4OptionsItems" label="異常選擇" v-model="list.qq4.Options" :rules="emptyObjRules" multiple v-if="list.qq4 && list.qq4.text == '是'"></v-autocomplete>
            </div>
            <div class="d-flex">
              <v-autocomplete :items="qq5Items" label="體能虛弱" v-model="list.qq5" :rules="emptyRules" return-object class="mr-2"></v-autocomplete>
              <v-autocomplete :items="qq5OptionsItems" label="異常選擇" v-model="list.qq5.Options" :rules="emptyObjRules" multiple v-if="list.qq5 && list.qq5.text == '是'"></v-autocomplete>
            </div>
            <div class="d-flex">
              <v-autocomplete :items="qq6Items" label="知覺障礙" v-model="list.qq6" :rules="emptyRules" return-object class="mr-2"></v-autocomplete>
              <v-autocomplete :items="qq6OptionsItems" label="異常選擇" v-model="list.qq6.Options" :rules="emptyObjRules" multiple v-if="list.qq6 && list.qq6.text == '是'"></v-autocomplete>
            </div>
            <div class="d-flex">
              <v-autocomplete :items="qq7Items" label="暈眩/低血壓" v-model="list.qq7" :rules="emptyRules" return-object class="mr-2"></v-autocomplete>
              <v-autocomplete :items="qq7OptionsItems" label="異常選擇" v-model="list.qq7.Options" :rules="emptyObjRules" multiple v-if="list.qq7 && list.qq7.text == '是'"></v-autocomplete>
            </div>
            <div class="d-flex">
              <v-autocomplete :items="qq8Items" label="使用藥物" v-model="list.qq8" :rules="emptyRules" return-object class="mr-2"></v-autocomplete>
              <v-autocomplete :items="qq8OptionsItems" label="異常選擇" v-model="list.qq8.Options" :rules="emptyObjRules" multiple v-if="list.qq8 && list.qq8.text == '是'"></v-autocomplete>
              <v-text-field v-if="list.qq8 && list.qq8.Options && list.qq8.Options.includes('其他')" label="其他說明" v-model="list.qq8.Other" :rules="emptyRules" class="ml-2"></v-text-field>
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
  props:['useDataBase','items'],  //本表單使用的主要資料庫;用於讀取,新增,修改,刪除时指定的資料庫名
  data() {
    return {
      dialog: false,
      list: {}, //表單內資料
      processType: "", //存放頁面執行是add新增或edit修改
      title: "",
      titleStyle: "",
      emptyRules: [(v) => !!v || "不可空白"],
      emptyObjRules: [v => Boolean(Object.keys(v || {})[0]) || "不可空白"],
      loading: false,

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
        this.$api.options("general/add/" + this.$store.state.databaseName + "/" + this.useDataBase,postData)
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
          edit_man: 'pass'
        };

        this.loading = true;
        this.$api.options("general/edit/" + this.$store.state.databaseName + "/" + this.useDataBase,postData)
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