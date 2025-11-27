<template>
  <div class="MNASFsAdd">
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
            <v-autocomplete :items="qq1Items" label="過去三個月之中，是否因食慾不佳、消化問題、咀嚼或吞嚥困難，以致進食量減少?" v-model="list.qq1" :rules="emptyRules" return-object></v-autocomplete>
            <v-autocomplete :items="qq2Items" label="近三個月體重變化" v-model="list.qq2" :rules="emptyRules" return-object></v-autocomplete>
            <v-autocomplete :items="qq3Items" label="行動力" v-model="list.qq3" :rules="emptyRules" return-object></v-autocomplete>
            <v-autocomplete :items="qq4Items" label="過去三個月內曾有精神性壓力或急性疾病發作?" v-model="list.qq4" :rules="emptyRules" return-object></v-autocomplete>
            <v-autocomplete :items="qq5Items" label="神經精神問題" v-model="list.qq5" :rules="emptyRules" return-object></v-autocomplete>
            <v-autocomplete :items="qq6Items" label="身體質量指數(BMI)=體重(公斤)/身高(公尺)2" v-model="list.qq6" return-object></v-autocomplete>
            <v-autocomplete :items="qq7Items" label="若BMI無法取得,用小腿圍或臂中圍代替(公分)" v-model="list.qq7" return-object></v-autocomplete>
            
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
        <!-- <pre>{{ list }}</pre>  -->
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

      qq1Items:[
        {text: '嚴重食慾不佳',Point: 0},
        {text: '中度食慾不佳',Point: 1},
        {text: '食慾無變化',Point: 2},
      ],
      qq2Items:[
        {text: '體重減輕>3公斤',Point: 0},
        {text: '不知道',Point: 1},
        {text: '體重減輕1~3公斤',Point: 2},
        {text: '體重無改變',Point: 3},
      ],
      qq3Items:[
        {text: '臥床或輪椅',Point: 0},
        {text: '可以下床活動或離開輪椅但無法自由活動',Point: 1},
        {text: '可以自由走動',Point: 2},
      ],
      qq4Items:[
        {text: '是',Point: 0},
        {text: '否',Point: 2},
      ],
      qq5Items:[
        {text: '嚴重認知障礙或抑鬱',Point: 0},
        {text: '輕度痴呆',Point: 1},
        {text: '無精神問題',Point: 2},
      ],
      qq6Items:[
        {text: 'BMI<19',Point: 0},
        {text: '19≦BMI<21',Point: 1},
        {text: '21≦BMI<23',Point: 2},
        {text: 'BMI≧23',Point: 3},
        {text: '',Point: 0},
      ],
      qq7Items:[
        {text: '小腿圍<31',Point: 0},
        {text: '小腿圍≧31',Point: 3},
        {text: '臂中圍<22',Point: 0},
        {text: '臂中圍≧22',Point: 3},
        {text: '',Point: 0},
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