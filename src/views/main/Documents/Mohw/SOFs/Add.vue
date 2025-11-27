<template>
  <div class="SOFsAdd">
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
            <v-text-field label="備註(無法評估時請備註原因)" v-model="list.remark"></v-text-field>
            <div v-if="!list.remark">
              <v-autocomplete :items="YnItems"
                label="體重減輕 [非刻意減重狀況下，過去一年體重減少3公斤或5%以上?(先問個案體重和一年相較差不多還是減少?如果減少再問大約減少幾公斤?)]" v-model="list.qq1"
                :rules="emptyRules" return-object></v-autocomplete>
              <v-autocomplete :items="YnItems" label="下肢功能 [無法在不用手支撐的情況下，從椅子上站起來五次]" v-model="list.qq2"
                :rules="emptyRules" return-object></v-autocomplete>
              <v-autocomplete :items="YnItems" label="活力降低 [過去一週內，有覺得提不起勁做事?(一個禮拜三天以上有這個感覺)]" v-model="list.qq3"
                :rules="emptyRules" return-object></v-autocomplete>
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
        { text: '是', Point: 1 },
        { text: '否', Point: 0 },
      ],


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