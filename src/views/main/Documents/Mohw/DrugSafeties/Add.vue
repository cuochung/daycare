<template>
  <div class="HealthyHabitsAdd">
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
            <v-autocomplete label="是否有長期使用藥物" :items="LongUseingItems" v-model="list.LongUseing"></v-autocomplete>
            <div v-if="list.LongUseing == '有'">
              <div class="d-flex">
                <v-autocomplete :items="YnItems2" label="目前使用中的藥物種類" v-model="list.qq1"
                  :rules="emptyRules"></v-autocomplete>
                <v-text-field type="number" label="總共幾種" v-model="list.qq1Statement1" :rules="emptyRules"
                  v-if="list.qq1 == '有'" class="mx-2"></v-text-field>
              </div>
              <v-autocomplete :items="YnItems" label="使用精神用藥" v-model="list.qq2" :rules="emptyRules"></v-autocomplete>
              <v-autocomplete :items="YnItems" label="使用止痛用藥" v-model="list.qq3" :rules="emptyRules"></v-autocomplete>
              <v-autocomplete :items="YnKindItems" label="是否存在多重用藥問題(自動判讀)" v-model="list.qq4"
                readonly></v-autocomplete>
              <div class="d-flex">
                <v-autocomplete :items="YnItems" label="目前是否使用有自行購藥或保健營養品(電台、他人介紹..等非醫療院所取得)" v-model="list.qq5"
                  :rules="emptyRules"></v-autocomplete>
                <v-text-field type="number" label="總共幾種" v-model="list.qq5Statement5" :rules="emptyRules"
                  v-if="list.qq5 == '有'" class="mx-2"></v-text-field>
              </div>
            </div>
            <v-alert color="primary" class="ma-0 pa-1" outlined>
              <div class="d-flex align-center">
                <h2>使用中之藥物</h2>
                <v-btn class="success mx-2" small @click.stop="addMedicine()"><v-icon>mdi-plus</v-icon> 新增</v-btn>
              </div>
              <v-divider class="my-2"></v-divider>
              <div v-for="item,index in list.DrugInUses" :key="index" class="grey lighten-3 pa-2 mt-1"
                style="border-radius:5px;">
                <div class="d-flex justify-space-between">
                  <span>#{{ index+1 }}</span>
                  <v-btn class="error" small @click.stop="delMedicine(index)"><v-icon>mdi-close</v-icon> 刪除</v-btn>
                </div>
                <div class="d-flex gap-5">
                  <v-text-field label="品項" v-model="item.Name" :rules="emptyRules"></v-text-field>
                  <v-text-field label="劑量" type="number" v-model="item.Volume" :rules="emptyRules"></v-text-field>
                  <v-text-field label="劑量單位" v-model="item.VolumeUnit" :rules="emptyRules"></v-text-field>
                  <v-text-field label="頻率" v-model="item.Frequency" class="mx-2" :rules="emptyRules"></v-text-field>
                  <v-text-field label="目的" v-model="item.Purpose" :rules="emptyRules"></v-text-field>
                </div>
                <v-text-field label="備註" v-model="item.Remark"></v-text-field>
              </div>
            </v-alert>
          </v-form>
          <!-- {{ list }} -->
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
  props: ["useDataBase","items"], //本表單使用的主要資料庫;用於讀取,新增,修改,刪除时指定的資料庫名
  data() {
    return {
      dialog: false,
      list: {}, //表單內資料
      processType: "", //存放頁面執行是add新增或edit修改
      title: "",
      titleStyle: "",
      emptyRules: [(v) => !!v || "不可空白"],
      loading: false,

      LongUseingItems:["有","無"],
      YnItems: ["無", "有", "不知道"],
      YnItems2: ["有", "不知道"],
      YnKindItems: ["無", "≧5種", "≧9種", "不知道"],
    };
  },

  watch: {
    list: {
      handler(val) {
        if (val.qq1 == "不知道") {
          this.$set(val, "qq4", "不知道");
        } else {
          if (val.qq1Statement1 < 5 || val.qq1 == "無") {
            this.$set(val, "qq4", "無");
          }
          if (val.qq1Statement1 >= 5) {
            if (val.qq1Statement1 >= 9) {
              this.$set(val, "qq4", "≧9種");
            }else{
              this.$set(val, "qq4", "≧5種");
            }
          }
          
        }
      },
      deep: true,
    },
  },

  methods: {
    addProcess() {
      this.processType = "add";
      this.title = "新增資料";
      this.titleStyle = "font-weight-black error lighten-2";
      this.list = {
        DrugInUses:[],
      };
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
        this.list.create_man =
          this.$store.state.pData.username +
          "(" +
          dayjs().format("YYYY-MM-DD HH:mm:ss") +
          ")";
        this.list.create_man_snkey = this.$store.state.pData.snkey;
        var postData = {
          datalist: JSON.stringify(this.list),
        };
        this.loading = true;
        this.$api.options(
          "general/add/" +
            this.$store.state.databaseName +
            "/" +
            this.useDataBase,
          postData
        ).then((rs) => {
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
        if (!this.list.edit_man) {
          this.list.edit_man = "";
        }
        this.list.edit_man =
          this.$store.state.pData.username +
          "(" +
          dayjs().format("YYYY-MM-DD HH:mm:ss") +
          ")" +
          this.list.edit_man;
        let postData = {
          snkey: this.list.snkey,
          datalist: JSON.stringify(this.list),
          edit_man: "pass",
        };

        this.loading = true;
        this.$api.options(
          "general/edit/" +
            this.$store.state.databaseName +
            "/" +
            this.useDataBase,
          postData
        ).then((rs) => {
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

    //新增使用中藥物
    addMedicine(){
      this.list.DrugInUses.push({
        "Name": "",
        "Volume": "",
        "Frequency": "",
        "Purpose": "",
        "Remark": ""
      })
    },
    delMedicine(index){
      this.list.DrugInUses.splice(index,1)
    }
  },
};
</script>