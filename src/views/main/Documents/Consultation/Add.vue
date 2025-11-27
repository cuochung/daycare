<template>
  <div class="ConsultationAdd">
    <v-dialog v-model="dialog" width="auto">
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
            <v-card>
              <v-alert color="primary" outlined>
                <h3>預計照會人員:</h3>
                <v-row justify="space-around" class="pl-4">
                  <v-checkbox
                    label="醫師"
                    v-model="list.doctor"
                    value="true"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    label="營養師"
                    v-model="list.nutritionist"
                    value="true"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    label="社工"
                    v-model="list.socialworker"
                    value="true"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    label="物理治療師"
                    v-model="list.rehabilitation"
                    value="true"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    label="照服員"
                    v-model="list.attendant"
                    value="true"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    label="其他人員"
                    v-model="list.otherworker"
                    value="true"
                    hide-details
                  ></v-checkbox>
                  <v-text-field
                    label="其他人員"
                    v-model="list.otherworker_content"
                    class="ml-2"
                    v-if="list.otherworker"
                    hide-details
                  ></v-text-field>
                </v-row>
              </v-alert>

              <v-alert color="primary" outlined>
                <h3>照會原因及狀況:</h3>
                <v-row class="pl-4">
                  <v-checkbox
                    label="精神及行為異常"
                    v-model="list.result1"
                    value="true"
                    hide-details
                  ></v-checkbox>
                  <v-text-field
                    label="內容"
                    v-model="list.result1_content"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>
                <v-row class="pl-4">
                  <v-checkbox
                    label="健康狀況異常"
                    v-model="list.result2"
                    value="true"
                    hide-details
                  ></v-checkbox>
                  <v-text-field
                    label="內容"
                    v-model="list.result2_content"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>
                <v-row class="pl-4">
                  <v-checkbox
                    label="日常生活無法自理"
                    v-model="list.result3"
                    value="true"
                    hide-details
                  ></v-checkbox>
                  <v-text-field
                    label="內容"
                    v-model="list.result3_content"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>
                <v-row class="pl-4">
                  <v-checkbox
                    label="肢體功能退化"
                    v-model="list.result4"
                    value="true"
                    hide-details
                  ></v-checkbox>
                  <v-text-field
                    label="內容"
                    v-model="list.result4_content"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>
                <v-row class="pl-4">
                  <v-checkbox
                    label="疑自殺意圖"
                    v-model="list.result5"
                    value="true"
                    hide-details
                  ></v-checkbox>
                  <v-text-field
                    label="內容"
                    v-model="list.result5_content"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>
                <v-row class="pl-4">
                  <v-checkbox
                    label="服藥不合作"
                    v-model="list.result6"
                    value="true"
                    hide-details
                  ></v-checkbox>
                  <v-text-field
                    label="內容"
                    v-model="list.result6_content"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>
                <v-row class="pl-4">
                  <v-checkbox
                    label="營養狀況異常"
                    v-model="list.result7"
                    value="true"
                    hide-details
                  ></v-checkbox>
                  <v-text-field
                    label="內容"
                    v-model="list.result7_content"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>
                <v-row class="pl-4">
                  <v-checkbox
                    label="其他"
                    v-model="list.result8"
                    value="true"
                    hide-details
                  ></v-checkbox>
                  <v-text-field
                    label="內容"
                    v-model="list.result8_content"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>

                <v-row>
                  <v-text-field
                    label="護理人員"
                    v-model="list.nurse_name"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                  <v-text-field
                    label="日期"
                    type="date"
                    v-model="list.date"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>
              </v-alert>

              <v-alert color="primary" outlined v-if="list.doctor">
                <h3>醫師照會回覆</h3>
                <v-textarea
                  rows="8"
                  filled
                  v-model="list.doctor_response"
                  hide-details
                ></v-textarea>
                <v-row>
                  <v-text-field
                    label="照會人員"
                    v-model="list.doctor_name"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                  <v-text-field
                    label="日期"
                    type="date"
                    v-model="list.doctor_name_date"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>
              </v-alert>
              <v-alert color="primary" outlined v-if="list.nutritionist">
                <h3>營養師照會回覆</h3>
                <v-textarea
                  rows="8"
                  filled
                  v-model="list.nutritionist_response"
                  hide-details
                ></v-textarea>
                <v-row>
                  <v-text-field
                    label="照會人員"
                    v-model="list.nutritionist_name"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                  <v-text-field
                    label="日期"
                    type="date"
                    v-model="list.nutritionist_name_date"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>
              </v-alert>
              <v-alert color="primary" outlined v-if="list.socialworker">
                <h3>社工照會回覆</h3>
                <v-textarea
                  rows="8"
                  filled
                  v-model="list.socialworker_response"
                  hide-details
                ></v-textarea>
                <v-row>
                  <v-text-field
                    label="照會人員"
                    v-model="list.socialworker_name"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                  <v-text-field
                    label="日期"
                    type="date"
                    v-model="list.socialworker_name_date"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>
              </v-alert>
              <v-alert color="primary" outlined v-if="list.rehabilitation">
                <h3>物理治療師照會回覆</h3>
                <v-textarea
                  rows="8"
                  filled
                  v-model="list.rehabilitation_response"
                  hide-details
                ></v-textarea>
                <v-row>
                  <v-text-field
                    label="照會人員"
                    v-model="list.rehabilitation_name"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                  <v-text-field
                    label="日期"
                    type="date"
                    v-model="list.rehabilitation_name_date"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>
              </v-alert>
              <v-alert color="primary" outlined v-if="list.attendant">
                <h3>照服員照會回覆</h3>
                <v-textarea
                  rows="8"
                  filled
                  v-model="list.attendant_response"
                  hide-details
                ></v-textarea>
                <v-row>
                  <v-text-field
                    label="照會人員"
                    v-model="list.attendant_name"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                  <v-text-field
                    label="日期"
                    type="date"
                    v-model="list.attendant_name_date"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>
              </v-alert>
              <v-alert color="primary" outlined v-if="list.otherworker">
                <h3>其他人員({{ list.otherworker_content }})照會回覆</h3>
                <v-textarea
                  rows="8"
                  filled
                  v-model="list.otherworker_response"
                  hide-details
                ></v-textarea>
                <v-row>
                  <v-text-field
                    label="照會人員"
                    v-model="list.otherworker_name"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                  <v-text-field
                    label="日期"
                    type="date"
                    v-model="list.otherworker_name_date"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>
              </v-alert>

              <v-alert color="success" outlined>
                <h3>追蹤處理</h3>
                <v-textarea
                  rows="8"
                  filled
                  v-model="list.track_response"
                  hide-details
                ></v-textarea>
                <v-row>
                  <v-text-field
                    label="處理者簽名"
                    v-model="list.track_name"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                  <v-text-field
                    label="日期"
                    type="date"
                    v-model="list.track_name_date"
                    class="ml-2"
                    hide-details
                  ></v-text-field>
                </v-row>
              </v-alert>
            </v-card>
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
import qs from "qs";
import dayjs from "dayjs";

export default {
  data() {
    return {
      dialog: false,
      list: {}, //表單內資料
      oldList: {}, //未修改前的表單內資料
      processType: "", //存放頁面執行是add新增或edit修改
      title: "",
      titleStyle: "",
      emptyRules: [(v) => !!v || "不可空白"],

      loading: false,
    };
  },

  mounted() {
    //父組件要執行本組件時的function時的設定 (showFromParent) id是暫存傳過來的值
    this.$on("fromParent", function (item) {
      this.dialog = true;
      this.editProcess(item);
    });
  },

  methods: {
    addProcess() {
      //進入畫面時,執行的是新增作業
      this.processType = "add";
      this.title = "新增資料";
      this.titleStyle = "font-weight-black error lighten-2";
    },
    editProcess(item) {
      //進入畫面時,執行的是修改作業
      this.processType = "edit";
      this.title = "修改資料";
      this.titleStyle = "font-weight-black success lighten-2";
      this.oldList = item; //將頁面資料與父項的資料連結
      this.list = { ...item }; //複制一份實際修改資料內容
    },
    addOK() {
      //確認新增
      if (this.$refs.form.validate()) {
        this.$store.commit("getTime"); //取得現在時間
        var postData = {
          u_snkey: this.$store.state.uData.snkey,
          datalist: JSON.stringify(this.list),
          create_man:
            this.$store.state.pData.username +
            "(" +
            this.$store.state.time +
            ")", //執行動作的人,時間,內容
        };

        this.loading = true;
        this.axios
          .post(
            "general/add/" + this.$store.state.databaseName + "/consultation",
            qs.stringify(postData)
          )
          .then((rs) => {
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
          theme: "warning",
        };
        this.$store.commit("snackbar", pop);
      }
    },
    editOK() {
      //確認修改
      if (this.$refs.form.validate()) {
        this.$store.commit("getTime"); //取得現在時間
        var postData = {
          snkey: this.list.snkey,
          datalist: JSON.stringify(this.list),
          edit_man:
            this.$store.state.pData.username +
            "(" +
            this.$store.state.time +
            ")", //執行動作的人,時間,內容
        };

        this.loading = true;
        this.axios
          .post(
            "general/edit/" + this.$store.state.databaseName + "/consultation",
            qs.stringify(postData)
          )
          .then((rs) => {
            if (rs.data.state == 1) {
              var pop = { msg: "已修改", type: true, theme: "success" };
              this.$store.commit("snackbar", pop);
              this.dialog = false;

              for (var i in this.list) {
                if (this.oldList[i] == undefined) {
                  this.$set(this.oldList, i, "");
                }
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
          theme: "warning",
        };
        this.$store.commit("snackbar", pop);
      }
    },
  },
};
</script>
