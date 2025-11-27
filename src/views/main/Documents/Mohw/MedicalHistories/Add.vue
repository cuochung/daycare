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
            <v-text-field label="主要診斷(ICD10)" v-model="list.AnsOther_1" :rules="emptyRules"></v-text-field>
            <v-text-field label="次要診斷" v-model="list.AnsOther_2" :rules="emptyRules"></v-text-field>

            <!-- <v-row> -->
              <!-- <v-col cols="6"> -->
                <v-autocomplete :items="QuestionItems" label="心臟問題(只包含心臟)" v-model="list.qq1" :rules="emptyRules"></v-autocomplete>
              <!-- </v-col> -->
              <!-- <v-col cols="6"> -->
                <v-autocomplete :items="QuestionItems" label="周邊血管系統問題(包括高血壓)" v-model="list.qq2" :rules="emptyRules"></v-autocomplete>
              <!-- </v-col> -->
              <!-- <v-col cols="6"> -->
                <v-autocomplete :items="QuestionItems" label="造血系統問題(貧血、血球、淋巴、骨髓、脾臟等)" v-model="list.qq3" :rules="emptyRules"></v-autocomplete>
              <!-- </v-col> -->
              <!-- <v-col cols="6"> -->
                <v-autocomplete :items="QuestionItems" label="呼吸系統問題(肺部、支氣管、氣管及抽菸狀況)" v-model="list.qq4" :rules="emptyRules"></v-autocomplete>
              <!-- </v-col> -->
              <!-- <v-col cols="6"> -->
                <v-autocomplete :items="QuestionItems" label="眼耳鼻喉問題" v-model="list.qq5" :rules="emptyRules"></v-autocomplete>
              <!-- </v-col> -->
              <!-- <v-col cols="6"> -->
                <v-autocomplete :items="QuestionItems" label="上消化道問題(食道、胃、十二指腸)" v-model="list.qq6" :rules="emptyRules"></v-autocomplete>
              <!-- </v-col> -->
              <!-- <v-col cols="6"> -->
                <v-autocomplete :items="QuestionItems" label="下消化道問題(小腸、大腸、直腸)" v-model="list.qq7" :rules="emptyRules"></v-autocomplete>
              <!-- </v-col> -->
              <!-- <v-col cols="6"> -->
                <v-autocomplete :items="QuestionItems" label="肝膽胰臟問題" v-model="list.qq8" :rules="emptyRules"></v-autocomplete>
              <!-- </v-col> -->
              <!-- <v-col cols="6"> -->
                <v-autocomplete :items="QuestionItems" label="腎臟問題" v-model="list.qq9" :rules="emptyRules"></v-autocomplete>
              <!-- </v-col> -->
              <!-- <v-col cols="6"> -->
                <v-autocomplete :items="QuestionItems" label="其他泌尿生殖系統問題(輸尿管、尿道、膀胱、攝護腺、其他生殖系統問題)" v-model="list.qq10" :rules="emptyRules"></v-autocomplete>
              <!-- </v-col> -->
              <!-- <v-col cols="6"> -->
                <v-autocomplete :items="QuestionItems" label="肌肉骨骼皮膚問題" v-model="list.qq11" :rules="emptyRules"></v-autocomplete>
              <!-- </v-col> -->
              <!-- <v-col cols="6"> -->
                <v-autocomplete :items="QuestionItems" label="神經系統問題(腦部、脊髓、周邊神經等、不包含失智症)" v-model="list.qq12" :rules="emptyRules"></v-autocomplete>
              <!-- </v-col> -->
              <!-- <v-col cols="6"> -->
                <v-autocomplete :items="QuestionItems" label="內分泌、感染與代謝問題(包含糖尿病、甲狀腺、肥胖、乳房異常、感染性疾病與毒藥物問題)" v-model="list.qq13" :rules="emptyRules"></v-autocomplete>
              <!-- </v-col> -->
              <!-- <v-col cols="6"> -->
                <v-autocomplete :items="QuestionItems" label="情緒與行為問題(包括憂鬱、焦慮、激躁、急性混亂、瞻妄及失智症等問題)" v-model="list.qq14" :rules="emptyRules"></v-autocomplete>
              <!-- </v-col> -->
            <!-- </v-row> -->
            
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
      loading: false,

      QuestionItems:['無','輕微','中等','重度','極重度'],
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