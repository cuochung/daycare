<template>
  <div class="nutritionadd">
    <v-dialog v-model="dialog" width="auto">
      <template v-slot:activator="{ on }">
        <v-icon color="red lighten-2" dark v-on="on" @click="addProcess">mdi-plus-circle</v-icon>
      </template>

      <v-card>
        <v-card-title :class="titleStyle" primary-title>{{title}}</v-card-title>

        <v-card-text>
          <v-form ref="form" class="mt-3">
            <v-row>
              <v-col cols="12">
                <v-alert color="primary" outlined>
                  <h2>基本資料:</h2>
                  <v-container>
                    床號:{{this.$store.state.uData.bed_name}} / 入住日期:{{this.$store.state.uData.in_date}} / 姓名:{{this.$store.state.uData.name}} / 性別:{{this.$store.state.uData.sex}} / 生日:{{this.$store.state.uData.birthday}}
                    / 年齡:{{age}} / 身高:{{this.$store.state.uData.height}} / 標準體重(IBW): {{ibw}}
                    <br />
                    曾患疾病:{{this.$store.state.uData.hadadisease}}
                  </v-container>
                </v-alert>
              </v-col>

              <v-card>
                <v-card-text>
                  <v-col cols="3">
                    <v-text-field label="評估日期" v-model="list.date" type="date" :rules="emptyRules"></v-text-field>
                  </v-col>
                  <v-col cols="9"></v-col>
                  <v-col cols="12">
                    <v-alert color="primary" outlined>
                      <h3>生理資料</h3>
                      <v-row>
                        <v-col cols="12" sm="3">
                          <v-combobox :items="actionItems" label="活動狀況" v-model="list.action"></v-combobox>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field label="體重" v-model="list.weight"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field label="BMI" :value="bmi" readonly outlined></v-text-field>
                        </v-col>
                      </v-row>
                    </v-alert>
                  </v-col>

                  <v-col cols="12">
                    <v-alert color="primary" outlined>
                      <h3>飲食資料</h3>
                      <v-row>
                        <v-col cols="12" sm="3">
                          <v-combobox :items="appetiteItems" label="食慾" v-model="list.appetite"></v-combobox>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-combobox :items="textureItems" label="飲食質地" v-model="list.texture"></v-combobox>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-combobox :items="eatItems" label="進食方式" v-model="list.eat"></v-combobox>
                        </v-col>
                      </v-row>
                    </v-alert>
                  </v-col>

                  <v-col cols="12">
                    <v-alert color="primary" outlined>
                      <h3>評估</h3>
                      <v-row>
                        <v-col cols="12" sm="3">
                          <v-combobox
                            :items="dietprescriptionItems"
                            label="飲食處方"
                            v-model="list.dietprescription"
                          ></v-combobox>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field label="醣類(%)" v-model="list.carbohydrate"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field label="蛋白質(%)" v-model="list.protein"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field label="脂肪(%)" v-model="list.fat"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-combobox :items="kcalItems" label="熱量(Kcal)" v-model="list.kcal"></v-combobox>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field label="醣類(g)" :value="carbohydrate_g" readonly outlined></v-text-field>
                        </v-col>
                        
                        <v-col cols="12" sm="3">
                          <v-text-field label="蛋白質(g)" :value="protein_g" readonly outlined></v-text-field>
                        </v-col>
                        
                        <v-col cols="12" sm="3">
                          <v-text-field label="脂肪(g)" :value="fat_g" readonly outlined></v-text-field>
                        </v-col>
                      </v-row>
                    </v-alert>
                  </v-col>

                  <v-col cols="12">
                    <v-alert color="primary" outlined>
                      <h3>營養建議</h3>
                      <v-row>
                        <v-col cols="12" sm="8">
                          <v-textarea rows="20" label="營養建議" v-model="list.suggest"></v-textarea>
                          <!-- <v-combobox :items="suggestItems" label="營養建議" v-model="list.suggest"></v-combobox> -->
                        </v-col>
                        <v-col cols="12" sm="4">
                          <v-sheet color="primary" class="white--text">
                            <h3>常用營養建議內容</h3>
                          </v-sheet>
                          <v-text-field
                            label="新增內容"
                            outlined
                            hide-details
                            class="mt-2"
                            append-icon="mdi-plus-circle"
                            @click:append="addSuggest"
                            v-model="newSuggest"
                          ></v-text-field>

                          <div style="overflow:auto">
                            <v-list height="300px">
                              <v-list-item-group>
                                <v-list-item v-for="(item, i) in suggestItems" :key="i">
                                  <v-list-item-content @click="insertMsg(item)">
                                    <v-list-item-title class="d-flex">
                                      {{item.name}}
                                      <v-spacer></v-spacer>
                                      <v-icon color="red" @click.stop="delSuggest(item)">mdi-close</v-icon>
                                    </v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                              </v-list-item-group>
                            </v-list>
                          </div>
                        </v-col>
                      </v-row>
                    </v-alert>
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="primary" @click="addOK" v-if="processType=='add'" :loading="loading" :disabled="loading">確認新增</v-btn>
          <v-btn class="success" @click="editOK" v-if="processType=='edit'" :loading="loading" :disabled="loading">確認修改</v-btn>
        </v-card-actions>
        <!-- <pre>{{list}}</pre>  -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import qs from "qs";
import dayjs from "dayjs";

export default {
  data() {
    return {
      dialog: false,
      list: {
        snkey: "",
        date: "",
        suggest: ""
      }, //表單內資料
      oldList: {}, //未修改前的表單內資料
      processType: "", //存放頁面執行是add新增或edit修改
      title: "",
      titleStyle: "",
      emptyRules: [v => !!v || "不可空白"],
      actionItems: ["臥床", "輕度", "中度", "重度"],
      appetiteItems: ["好", "尚可", "差"],
      textureItems: ["乾飯", "稀飯", "細碎","糊狀","流質"],
      eatItems: ["由口進食", "鼻胃管灌食", "胃造廔"],
      dietprescriptionItems: ["普通餐", "糖尿病餐", "低鹽餐", "低油餐", "灌食"],
      kcalItems: ["1300", "1400", "1500", "1600", "1700", "1800"],
      suggestItems: [],
      age: dayjs().format("YYYY") - dayjs(this.$store.state.uData.birthday).format("YYYY"),
      newSuggest: "",
      loading:false,
    };
  },
  props: ["edititem", "viewData"],
  mounted() {
    //父組件要執行本組件時的function時的設定 (showFromParent) id是暫存傳過來的值
    this.$on("fromParent", function() {
      this.dialog = true;
      this.editProcess();
    });

    this.getSuggestItems();
  },
  model: {
    prop: "edititem"
    // event: "parentData"
  },

  watch: {
    edititem: [
      {
        handler: "editProcess"
      }
    ]
  },

  computed: {
    bmi() {
      //BMI = 當月體重(公斤)/身高(公尺)^2
      this.list.bmi =
        this.list.weight /
        ((this.$store.state.uData.height / 100) *
          (this.$store.state.uData.height / 100));
      return (this.list.bmi = this.list.bmi.toFixed(2));
    },
    ibw() {
      //IBW = 身高(公尺)*身高(公尺)*22，例如1.7*1.7*22=63.58
      var ibw =
        (this.$store.state.uData.height / 100) *
        (this.$store.state.uData.height / 100) *
        22;
      return ibw.toFixed(2);
    },
    carbohydrate_g() {
      // 醣類(g)=熱量*醣類(%)/4
      this.list.carbohydrate_g =
        (this.list.kcal * (this.list.carbohydrate / 100)) / 4;
      return (this.list.carbohydrate_g = this.list.carbohydrate_g.toFixed(0));
    },
    protein_g() {
      this.list.protein_g = (this.list.kcal * (this.list.protein / 100)) / 4;
      return (this.list.protein_g = this.list.protein_g.toFixed(0));
    },
    fat_g() {
      this.list.fat_g = (this.list.kcal * (this.list.fat / 100)) / 9;
      return (this.list.fat_g = this.list.fat_g.toFixed(0));
    }
  },

  methods: {
    addProcess() {
      //進入畫面時,執行的是新增作業
      this.processType = "add";
      this.title = "新增資料";
      this.titleStyle = "font-weight-black error lighten-2";
      // this.list = {};

      //設定最後一筆資料為新增時的預設值及清除新增中不必要的值
      if (this.viewData.length > 0) {
        this.list = { ...this.viewData[0] };
      } else {
        this.list.suggest = "";
      }
      this.list.snkey = "";
      this.list.date = "";
      this.list.edit_man = "";
    },
    editProcess() {
      //進入畫面時,執行的是修改作業
      this.processType = "edit";
      this.title = "修改資料";
      this.titleStyle = "font-weight-black success lighten-2";
      this.oldList = this.edititem; //將頁面資料與父項的資料連結
      this.list = { ...this.edititem }; //複制一份實際修改資料內容
    },
    addOK() {
      //確認新增
      if (this.$refs.form.validate()) {
        this.$store.commit("getTime"); //取得現在時間
        this.list.u_snkey = this.$store.state.uData.snkey;
        this.list["create_man"] =
          this.$store.state.pData.username + "(" + this.$store.state.time + ")"; //執行動作的人,時間,內容

        this.loading = true;
        this.axios
          .post(
            "general/add/" + this.$store.state.databaseName + "/nutrition",
            qs.stringify(this.list)
          )
          .then(rs => {
            // console.log(rs.data)
            if (rs.data.state == 1) {
              var pop = { msg: "已新增", type: true, theme: "success" };
              this.$store.commit("snackbar", pop);
              this.list = {};
              this.dialog = false;
              this.$emit("getAllData");
              this.loading = false;
            }
          });
      } else {
        var pop = {
          msg: "資料輸入不完全!!請重新確認!!",
          type: true,
          theme: "warning"
        };
        this.$store.commit("snackbar", pop);
      }
    },
    editOK() {
      //確認修改
      if (this.$refs.form.validate()) {
        this.$store.commit("getTime"); //取得現在時間
        this.list["edit_man"] =
          this.$store.state.pData.username + "(" + this.$store.state.time + ")"; //執行動作的人,時間,內容

        this.loading = true;
        this.axios
          .post(
            "general/edit/" + this.$store.state.databaseName + "/nutrition",
            qs.stringify(this.list)
          )
          .then(rs => {
            if (rs.data.state == 1) {
              var pop = { msg: "已修改", type: true, theme: "success" };
              this.$store.commit("snackbar", pop);
              this.dialog = false;

              for (var i in this.list) {
                //將各個欄位的資料透過一對一的去比對,就可以使vue對資料會有反應
                this.oldList[i] = this.list[i];
              }
              this.loading = false;
            }
          });
      } else {
        var pop = {
          msg: "資料輸入不完全!!請重新確認!!",
          type: true,
          theme: "warning"
        };
        this.$store.commit("snackbar", pop);
      }
    },
    getSuggestItems() {
      //this.$store.commit("setLoadingOn"); //讀取畫面on
      this.axios
        .post("general/getAll/" + this.$store.state.databaseName + "/suggest")
        .then(rs => {
          // console.log(rs.data)
          this.suggestItems = rs.data;
          // this.$store.commit("setLoadingOff"); //讀取畫面off
        });
    },
    addSuggest() {
      //新增常用營養建議內容
      if (this.newSuggest != "") {
        //判斷重覆
        var repeat = this.suggestItems.filter(item => {
          if (this.newSuggest == item.name) {
            return item;
          }
        });
        if (repeat.length > 0) {
          var pop = { msg: "不可重覆!!", type: true, theme: "warning" };
          this.$store.commit("snackbar", pop);
          return;
        }

        this.$store.commit("getTime"); //取得現在時間
        var postData = {
          name: this.newSuggest,
          create_man:
            this.$store.state.pData.username +
            "(" +
            this.$store.state.time +
            ")" //執行動作的人,時間,內容
        };

        this.axios
          .post(
            "general/add/" + this.$store.state.databaseName + "/suggest",
            qs.stringify(postData)
          )
          .then(rs => {
            // console.log(rs.data)
            var pop = { msg: "已新增", type: true, theme: "success" };
            this.$store.commit("snackbar", pop);
            this.newSuggest = "";
            this.getSuggestItems();
            // this.$store.commit("setLoadingOff"); //讀取畫面off
          });
      }
    },
    delSuggest(delData) {
      //刪除功能
      this.$confirm("確認刪除?").then((res) => {
        delData.delman = this.$store.state.pData.username + "(" + dayjs().format("YYYY-MM-DD HH:mm:ss") + ")";
        var postData = {
          snkey: delData.snkey,
          tablename: "suggest",
          info: JSON.stringify(delData),
        };

        if (res) {
          this.axios
            .post(
              "general/delv3/" + this.$store.state.databaseName + "/suggest",
              qs.stringify(postData)
            )
            .then((rs) => {
              console.log(rs.data);
              if (rs.data.state == 1) {
                var pop = { msg: "已刪除", type: true, theme: "success" };
                this.$store.commit("snackbar", pop);
                this.getSuggestItems();
              }
            });
        }
      });
    },
    insertMsg(item) {
      //新增訊息到suggest中
      this.list.suggest += item.name;
    }
  }
};
</script>
