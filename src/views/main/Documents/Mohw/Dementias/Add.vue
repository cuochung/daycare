<template>
  <div class="DementiasAdd">
    <v-dialog v-model="dialog">
      <template v-slot:activator="{ on }">
        <v-icon color="red lighten-2" dark v-on="on" @click="addProcess">mdi-plus-circle</v-icon>
      </template>

      <v-card>
        <v-card-title :class="titleStyle" primary-title>{{
          title
        }}</v-card-title>

        <v-card-text>
          <v-form ref="form" class="mt-3">
            <v-text-field type="date" label="評估日期" v-model="list.Date" :rules="emptyRules"></v-text-field>
            <v-text-field label="備註(無法評估時請備註原因)" v-model="list.qq12"></v-text-field>
            <div v-if="!list.qq12">
              <v-autocomplete :items="YnItems" label="今天是幾年幾月幾日？__年__月__日 [年月日都對才算正確。]" v-model="list.qq1"
                :rules="emptyRules" return-object></v-autocomplete>
              <v-autocomplete :items="YnItems" label="今天是星期幾？ [星期對才算正確。]" v-model="list.qq2" :rules="emptyRules"
                return-object></v-autocomplete>
              <v-autocomplete :items="YnItems" label="這裡是什麼地方？ [對所在地的任何描述皆正確，如正確說出「我家」或「城鎮」等都可接受。]" v-model="list.qq3"
                :rules="emptyRules" return-object></v-autocomplete>
              <v-autocomplete :items="YnItems" label="你的電話號碼是幾號？ [證實電話號碼無誤即算正確或會談時，能在兩次間隔較長的時間內重複相同的號碼即算正確。]"
                v-model="list.qq4" :rules="emptyRules" return-object></v-autocomplete>
              <v-autocomplete :items="YnItems" label="你住在什麼地方？ [當個案沒有電話時才問。]" v-model="list.qq5" :rules="emptyRules"
                return-object></v-autocomplete>
              <v-autocomplete :items="YnItems" label="你幾歲了？ [年齡與出生年月日符合才算正確。]" v-model="list.qq6" :rules="emptyRules"
                return-object></v-autocomplete>
              <v-autocomplete :items="YnItems" label="你的生日是哪一天？ [年月日都對才算正確。]" v-model="list.qq7" :rules="emptyRules"
                return-object></v-autocomplete>
              <v-autocomplete :items="YnItems" label="現任總統是誰？ [姓氏正確即可。]" v-model="list.qq8" :rules="emptyRules"
                return-object></v-autocomplete>
              <v-autocomplete :items="YnItems" label="前任總統是誰？ [姓氏正確即可。]" v-model="list.qq9" :rules="emptyRules"
                return-object></v-autocomplete>
              <v-autocomplete :items="YnItems" label="你媽媽叫什麼名字？ [不需特別證實，當個案說出一個與他不同的女性姓名即可。]" v-model="list.qq10"
                :rules="emptyRules" return-object></v-autocomplete>
              <v-autocomplete :items="YnItems" label="從 20 減 3 開始算，一直減 3 減下去。 [期間如出現任何錯誤或無法繼續進行即算錯誤。]"
                v-model="list.qq11" :rules="emptyRules" return-object></v-autocomplete>

              <v-select :items="DEGREEItems" label="心智功能程度" v-model="list.DEGREE" :rules="emptyRules"></v-select>
            </div>

          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="primary" @click="addOK" v-if="processType == 'add'" :loading="loading"
            :disabled="loading">確認新增</v-btn>
          <v-btn class="success" @click="editOK" v-if="processType == 'edit'" :loading="loading"
            :disabled="loading">確認修改</v-btn>
        </v-card-actions>
        <!-- <pre>{{this.$store.state.uData}}</pre>  -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  props: ['useDataBase', 'items'],  //本表單使用的主要資料庫;用於讀取,新增,修改,刪除时指定的資料庫名
  data() {
    return {
      dialog: false,
      list: {}, //表單內資料
      processType: "", //存放頁面執行是add新增或edit修改
      title: "",
      titleStyle: "",
      emptyRules: [(v) => !!v || "不可空白"],
      loading: false,

      YnItems: [
        { text: '對', Point: 1 },
        { text: '錯', Point: 0 },
      ],
      DEGREEItems: [
        '心智功能完好',
        '輕度智力缺損',
        '中度智力缺損',
        '嚴重智力缺損']

    };
  },

  methods: {
    addProcess() {
      this.processType = "add";
      this.title = "新增資料";
      this.titleStyle = "font-weight-black error lighten-2";
      this.list = {};
      if (this.items.length) {
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
        this.list.create_man_snkey = this.$store.state.pData.snkey;
        var postData = {
          datalist: JSON.stringify(this.list)
        };
        this.loading = true;
        this.$api.options("general/add/" + this.$store.state.databaseName + "/" + this.useDataBase, postData)
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
        if (!this.list.edit_man) { this.list.edit_man = '' }
        this.list.edit_man = this.$store.state.pData.username + "(" + dayjs().format("YYYY-MM-DD HH:mm:ss") + ")" + this.list.edit_man;
        let postData = {
          snkey: this.list.snkey,
          datalist: JSON.stringify(this.list),
          edit_man: 'pass'
        };

        this.loading = true;
        this.$api.options("general/edit/" + this.$store.state.databaseName + "/" + this.useDataBase, postData)
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