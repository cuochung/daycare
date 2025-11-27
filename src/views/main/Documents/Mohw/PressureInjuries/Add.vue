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
            <v-autocomplete :items="qq1Items" label="知覺感受" v-model="list.qq1" :rules="emptyRules" return-object></v-autocomplete>
            <v-autocomplete :items="qq2Items" label="潮溼程度" v-model="list.qq2" :rules="emptyRules" return-object></v-autocomplete>
            <v-autocomplete :items="qq3Items" label="活動能力" v-model="list.qq3" :rules="emptyRules" return-object></v-autocomplete>
            <v-autocomplete :items="qq4Items" label="移動能力" v-model="list.qq4" :rules="emptyRules" return-object></v-autocomplete>
            <v-autocomplete :items="qq5Items" label="營養攝取" v-model="list.qq5" :rules="emptyRules" return-object></v-autocomplete>
            <v-autocomplete :items="qq6Items" label="摩擦力/剪力" v-model="list.qq6" :rules="emptyRules" return-object></v-autocomplete>
            
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
  props:['useDataBase',"items"],  //本表單使用的主要資料庫;用於讀取,新增,修改,刪除时指定的資料庫名
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
        {text: '完全受限：因為意識減弱或使用鎮定劑，對疼痛刺激沒有反應',Point: 1},
        {text: '大部分受限：只對疼痛刺激有反應；除了呻吟或焦躁不安，無法表達不適',Point: 2},
        {text: '稍微受限：對指令有反應；但有時無法表達不適；(一或兩個肢體對疼痛或不適的感覺能力受限)',Point: 3},
        {text: '沒有受損：對指令有反應；能表達不適',Point: 4},
      ],
      qq2Items:[
        {text: '總是潮溼：皮膚總是被汗水、大小便等浸潤；每兩小時予病人翻身時，都會發現皮膚是潮溼的',Point: 1},
        {text: '經常潮溼：皮膚經常是浸潤的；衣褲/尿布/看護墊等至少每8小時需更換 ≧ 2次',Point: 2},
        {text: '偶爾潮溼：皮膚偶爾是浸潤的；衣褲/尿布/看護墊等至少每8小時需更換1次',Point: 3},
        {text: '很少潮溼：皮膚通常保持乾燥；衣褲/尿布/看護墊等只需要依常規的時間，每天更換一次',Point: 4},
      ],
      qq3Items:[
        {text: '受限於床上',Point: 1},
        {text: '受限於椅子：無法行走或走路極為困難；無法支撐自己的體重',Point: 2},
        {text: '偶爾走動：但是步行短距離，有時需要協助；大部份時間在床上或椅子上',Point: 3},
        {text: '經常走動',Point: 4},
      ],
      qq4Items:[
        {text: '完全無法自行移動',Point: 1},
        {text: '大部份需協助才能移動',Point: 2},
        {text: '少部份需協助才能移動',Point: 3},
        {text: '無限制',Point: 4},
      ],
      qq5Items:[
        {text: '總攝取量 < 50%',Point: 1},
        {text: '50% ≦ 總攝取量 < 75%',Point: 2},
        {text: '總攝取量 ≧ 75%',Point: 3},
        {text: '總攝取量完整',Point: 4},
      ],
      qq6Items:[
        {text: '有此問題：移動時需要中度到極大的協助；完全抬起來而不與床單接觸是不可能的',Point: 1},
        {text: '有潛在問題：移動時需要輕微協助',Point: 2},
        {text: '沒有明顯問題：可獨立在床上或椅子上移動',Point: 3},
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