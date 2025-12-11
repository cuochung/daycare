<template>
  <div class="signlifelistmulti">
    <h2 class="grey--text d-flex justify-space-between py-3 px-4">
      <div>
        <v-icon class="mx-1">mdi-table-large</v-icon>
        <span>生命徵象紀錄單(多筆)</span>
      </div>
      <!-- <v-btn @click="checkIsAdd(tempData)">TEST</v-btn> -->
      <v-spacer></v-spacer>
      <div class="white px-2 red--text" style="border-radius: 5px">
        目前編輯: {{ editingData() }}
      </div>
    </h2>

    <v-form ref="form">
      <v-card>
        <v-card-title>
          <v-col cols="12" md="2">
            <v-text-field type="date" label="評估日期" v-model="nowday" :rules="emptyRules"></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field type="time" label="評估時間" v-model="nowtime" :rules="emptyRules"></v-text-field>
          </v-col>
          <!-- <PDDImportExcel @excelDatas="importExcelDatas" /> -->
          <v-btn class="primary" @click="saveData()">存入資料</v-btn>
          <v-btn class="success ml-1" @click="emptyData()">清空資料</v-btn>

          <v-spacer></v-spacer>
          <v-btn v-if="isSignlifeSession" class="primary" @click="getSessionData()">
            載入暫存資料</v-btn>
          <v-btn class="error ml-1" @click="delData()">刪除評估日期所有資料</v-btn>
          <v-btn class="warning ml-1" @click="checkIsAdd(true)">判斷指定日期資料狀態</v-btn>
        </v-card-title>
        <v-card-text>
          <v-simple-table fixed-header class="mt-2 text-no-wrap" height="65vh">
            <template v-slot:default>
              <thead class="title">
                <tr>
                  <!-- <th>u_snkey</th> -->
                  <th></th>
                  <th>床號</th>
                  <th>姓名</th>
                  <!-- <th>1.評估時間</th> -->
                  <!-- <th>2.檢查結果</th> -->
                  <th>血壓(H)</th>
                  <th>血壓(L)</th>
                  <th>脈搏</th>
                  <th>體溫</th>
                  <th>呼吸</th>
                  <th>血糖</th>
                  <th>血氧濃度</th>
                  <th>疼痛指數</th>
                  <th>GCS-E</th>
                  <th>GCS-V</th>
                  <th>GCS-M</th>
                  <th>大便次數</th>
                  <th>體重</th>
                  <!-- <th>備註</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in tempData" :key="index" @click.stop="editCol = index">
                  <td>
                    <div v-if="item.isAddInfo" class="white--text d-inline">
                      <span v-if="item.isAddInfo.state" class="primary pa-1">[資料已存檔]</span>
                      <span v-else class="error pa-1">[資料未建立]</span>
                    </div>
                  </td>
                  <td>{{ item.bed_name }}</td>
                  <td>
                    <!-- <PDDqrcode :item="item" />  -->
                    {{ item.name }}

                  </td>
                  <td @keyup.up="changeCol('--')" @keyup.down="changeCol('++')" @keyup.left="changeRow('--')"
                    @keyup.right="changeRow('++')">
                    <span v-if="index != editCol">{{
                      tempData[index].bp_h
                      }}</span>
                    <v-text-field v-model="tempData[index].bp_h" v-if="index == editCol" ref="focuspoint"
                      @focus="editRow = 0" :rules="pb_h_Rules"></v-text-field>
                  </td>
                  <td @keyup.up="changeCol('--')" @keyup.down="changeCol('++')" @keyup.left="changeRow('--')"
                    @keyup.right="changeRow('++')">
                    <span v-if="index != editCol">{{
                      tempData[index].bp_l
                      }}</span>
                    <v-text-field v-model="tempData[index].bp_l" v-if="index == editCol" ref="focuspoint"
                      @focus="editRow = 1" :rules="pb_l_Rules"></v-text-field>
                  </td>
                  <td @keyup.up="changeCol('--')" @keyup.down="changeCol('++')" @keyup.left="changeRow('--')"
                    @keyup.right="changeRow('++')">
                    <span v-if="index != editCol">{{
                      tempData[index].pulse
                      }}</span>
                    <v-text-field v-model="tempData[index].pulse" v-if="index == editCol" ref="focuspoint"
                      @focus="editRow = 2" :rules="pulse_Rules"></v-text-field>
                  </td>
                  <td @keyup.up="changeCol('--')" @keyup.down="changeCol('++')" @keyup.left="changeRow('--')"
                    @keyup.right="changeRow('++')">
                    <span v-if="index != editCol">{{
                      tempData[index].temperature
                      }}</span>
                    <v-text-field v-model="tempData[index].temperature" v-if="index == editCol" ref="focuspoint"
                      @focus="editRow = 3" :rules="temperature_Rules"></v-text-field>
                  </td>
                  <td @keyup.up="changeCol('--')" @keyup.down="changeCol('++')" @keyup.left="changeRow('--')"
                    @keyup.right="changeRow('++')">
                    <span v-if="index != editCol">{{
                      tempData[index].breath
                      }}</span>
                    <v-text-field v-model="tempData[index].breath" v-if="index == editCol" ref="focuspoint"
                      @focus="editRow = 4" :rules="breath_Rules"></v-text-field>
                  </td>
                  <td @keyup.up="changeCol('--')" @keyup.down="changeCol('++')" @keyup.left="changeRow('--')"
                    @keyup.right="changeRow('++')">
                    <span v-if="index != editCol">{{
                      tempData[index].blood_sugar
                      }}</span>
                    <v-text-field v-model="tempData[index].blood_sugar" v-if="index == editCol" ref="focuspoint"
                      @focus="editRow = 5"></v-text-field>
                  </td>
                  <td @keyup.up="changeCol('--')" @keyup.down="changeCol('++')" @keyup.left="changeRow('--')"
                    @keyup.right="changeRow('++')">
                    <span v-if="index != editCol">{{
                      tempData[index].blood_oxygen
                      }}</span>
                    <v-text-field v-model="tempData[index].blood_oxygen" v-if="index == editCol" ref="focuspoint"
                      @focus="editRow = 6" :rules="blood_oxygen_Rules"></v-text-field>
                  </td>
                  <td @keyup.up="changeCol('--')" @keyup.down="changeCol('++')" @keyup.left="changeRow('--')"
                    @keyup.right="changeRow('++')">
                    <span v-if="index != editCol">{{
                      tempData[index].pain
                      }}</span>
                    <v-text-field v-model="tempData[index].pain" v-if="index == editCol" ref="focuspoint"
                      @focus="editRow = 7" :rules="pain_Rules"></v-text-field>
                  </td>
                  <td @keyup.up="changeCol('--')" @keyup.down="changeCol('++')" @keyup.left="changeRow('--')"
                    @keyup.right="changeRow('++')">
                    <span v-if="index != editCol">{{
                      tempData[index].gcs_e
                      }}</span>
                    <v-text-field v-model="tempData[index].gcs_e" v-if="index == editCol" ref="focuspoint"
                      @focus="editRow = 8" :rules="gcs_e_Rules"></v-text-field>
                  </td>
                  <td @keyup.up="changeCol('--')" @keyup.down="changeCol('++')" @keyup.left="changeRow('--')"
                    @keyup.right="changeRow('++')">
                    <span v-if="index != editCol">{{
                      tempData[index].gcs_v
                      }}</span>
                    <v-text-field v-model="tempData[index].gcs_v" v-if="index == editCol" ref="focuspoint"
                      @focus="editRow = 9" :rules="gcs_v_Rules"></v-text-field>
                  </td>
                  <td @keyup.up="changeCol('--')" @keyup.down="changeCol('++')" @keyup.left="changeRow('--')"
                    @keyup.right="changeRow('++')">
                    <span v-if="index != editCol">{{
                      tempData[index].gcs_m
                      }}</span>
                    <v-text-field v-model="tempData[index].gcs_m" v-if="index == editCol" ref="focuspoint"
                      @focus="editRow = 10" :rules="gcs_m_Rules"></v-text-field>
                  </td>
                  <td @keyup.up="changeCol('--')" @keyup.down="changeCol('++')" @keyup.left="changeRow('--')"
                    @keyup.right="changeRow('++')">
                    <span v-if="index != editCol">{{
                      tempData[index].stool
                      }}</span>
                    <v-text-field v-model="tempData[index].stool" v-if="index == editCol" ref="focuspoint"
                      @focus="editRow = 11" :rules="twoLength_Rules"></v-text-field>
                  </td>
                  <td @keyup.up="changeCol('--')" @keyup.down="changeCol('++')" @keyup.left="changeRow('--')"
                    @keyup.right="changeRow('++')">
                    <span v-if="index != editCol">{{
                      tempData[index].weight
                      }}</span>
                    <v-text-field v-model="tempData[index].weight" v-if="index == editCol" ref="focuspoint"
                      @focus="editRow = 12"></v-text-field>
                  </td>
                  <!-- <td
                    @keyup.up="changeCol('--')"
                    @keyup.down="changeCol('++')"
                    @keyup.left="changeRow('--')"
                    @keyup.right="changeRow('++')"
                  >
                    <span v-if="index != editCol">{{tempData[index].note}}</span>
                    <v-text-field
                      v-model="tempData[index].note"
                      v-if="index == editCol"
                      ref="focuspoint"
                      @focus="editRow=14"
                    ></v-text-field>
                  </td>-->
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-form>

    <!-- <pre>    {{feeItems}}    </pre> -->
  </div>
</template>

<script>
import PDDImportExcel from "@/components/PddComponents/PDDImportExcel.vue";
import PDDqrcode from '@/components/PddComponents/PDDqrcode.vue'

import dayjs from "dayjs";

export default {
  components: { PDDImportExcel, PDDqrcode },
  data() {
    return {
      isSignlifeSession: false, //判斷session是否存在上次輸入資料
      useritems: [], //病歷資料
      serachKey: "", //搜尋欄
      tempData: [], //儲存前暫存資料庫
      feeItems: [], //暫存會計項目資料
      // date: dayjs().format("YYYY-MM-DD"),
      nowday: dayjs().format("YYYY-MM-DD"), //日期暫存
      nowtime: dayjs().format("HH:mm:ss"), //時間暫存
      emptyRules: [(v) => !!v || "不可空白"],
      pb_h_Rules: [
        (v) => v == "" || (v.length < 4 && !v.includes(".")) || "數值不合法",
      ],
      pb_l_Rules: [(v) => v == "" || (v > 0 && v < 150) || "數值不合法"],
      // pb_l_Rules: [
      //   (v) => v == "" || (v.length < 3 && !v.includes(".")) || "數值不合法",
      // ],
      pulse_Rules: [
        (v) => v == "" || (v.length < 4 && !v.includes(".")) || "數值不合法",
      ],
      temperature_Rules: [
        (v) =>
          v == "" ||
          (v <= 42 && v.length <= 4 && !v.includes("..")) ||
          "數值不合法",
      ],
      breath_Rules: [
        (v) => v == "" || (v <= 40 && !v.includes(".")) || "數值不合法",
      ],
      blood_oxygen_Rules: [
        (v) => v == "" || (v <= 100 && !v.includes(".")) || "數值不合法",
      ],
      pain_Rules: [
        (v) => v == "" || (v <= 10 && !(v % 2)) || "只接受2,4,6,8,10",
      ],
      gcs_e_Rules: [(v) => v == "" || (v >= 1 && v <= 4) || "只接受1-4"],
      gcs_v_Rules: [
        (v) =>
          v == "" ||
          (v >= 1 && v <= 5) ||
          v == "T" ||
          v == "A" ||
          v == "E" ||
          "只接受1-5,A,T,E",
      ],
      gcs_m_Rules: [(v) => v == "" || (v >= 1 && v <= 6) || "只接受1-6"],
      twoLength_Rules: [(v) => v == "" || v.length <= 2 || "數值不合法"],
      editCol: 0, //編輯中的列
      editRow: 0, //編輯中的行
    };
  },

  watch: {
    editCol() {
      // if (this.$refs.form.validate()) {
      if (this.editCol < 0) this.editCol = 0;
      if (this.editCol > this.tempData.length - 1)
        this.editCol = this.tempData.length - 1;
      this.setfocus();
      // }
    },
    editRow() {
      if (this.editRow < 0) {
        this.editCol--;
        this.editRow = 12;
      }

      if (this.editRow > 12) {
        this.editCol++;
        this.editRow = 0;
      }

      this.setfocus();
    },
  },

  mounted() {
    this.auth = this.$store.state.pData;
    this.getAllData();
    this.getFee();

    //判斷signlifes session是否存在
    this.isSignlifeSession = sessionStorage.getItem("signlifts") ? true : false;
  },

  methods: {
    //透過 excel 載入資料
    importExcelDatas(datas) {
      console.log('importExcelDatas', datas);
      
      // 遍歷 Excel 匯入的資料
      datas.forEach(excelData => {
      // 在 tempData 中尋找符合條件的資料
      const matchedItem = this.tempData.find(item => 
        item.bed_name.includes(excelData['房號']) && 
        item.name.includes(excelData['姓名'])
      );
      
      // 如果找到符合的資料，則更新相應欄位
      if (matchedItem) {
        matchedItem.bp_l = excelData['數值1'];
        matchedItem.bp_h = excelData['數值2'];
        matchedItem.pulse = excelData['數值3'];
        matchedItem.temperature = excelData['數值4'];
        matchedItem.breath = excelData['數值5'];
      }
    });
  },
    //載入session中的資料
    getSessionData() {
      this.tempData = JSON.parse(sessionStorage.getItem("signlifts"));
    },
    emptyData() {
      this.$confirm("確認清空資料?").then((rs) => {
        if (rs) {
          this.getAllData();
        }
      });
    },
    //2023.7.11 判斷新增資料是否已存在
    checkIsAdd(checkAll = false) {
      // console.log('checkIsAdd')
      let checkDatas = this.tempData.filter((item) => {
        delete item.isAddInfo; //要先刪掉，不然判斷長度會有問題

        let strLen =
          JSON.stringify(Object.values(item)).length -
          item.bed_name.length -
          item.name.length -
          item.u_snkey.length;
        //目前空資料長度為58(有增,減欄位時要修正)
        return strLen > 58;
      });

      if (checkAll) {
        //checkAll為true時,直接判斷指定日期的全部資料存在狀態
        checkDatas = this.tempData;
      }

      let searhKey = {
        key: "date='" + this.nowday + "'",
      };

      let url = `general/searchByWhere/${this.$store.state.databaseName}/signlife`;

      this.$api.options(url, searhKey).then((newDatas) => {
        console.log("general/searchByWhere", newDatas.length);
        let addProcessExisterror = false;
        checkDatas.forEach((i) => {
          let match = newDatas.find((newData) => newData.u_snkey == i.u_snkey);
          if (match) {
            this.$set(i, "isAddInfo", { state: true });
          } else {
            this.$set(i, "isAddInfo", { state: false });
            addProcessExisterror = true;
          }
        });

        if (addProcessExisterror && !checkAll) {
          let pop = {
            msg: "新增資料過程有誤,部分資料未建立,請重新建構 [資料未建立] 的資料!!",
            type: true,
            theme: "error",
          };
          this.$store.commit("snackbar", pop);
        }
      });
    },
    getFee() {
      this.$api.get("fee").then((rs) => {
        this.feeItems = rs;
      });
    },
    changeCol(val) {
      if (this.$refs.form.validate()) {
        if (val == "--") {
          this.editCol--;
        } else {
          this.editCol++;
        }
      }
    },
    changeRow(val) {
      if (this.$refs.form.validate()) {
        if (val == "--") {
          this.editRow--;
        } else {
          this.editRow++;
        }
      }
    },
    editingData() {
      if (this.tempData.length > 0) {
        return `${this.tempData[this.editCol].bed_name} / ${
          this.tempData[this.editCol].name
        }`;
      }
    },
    setfocus() {
      this.$nextTick(() => {
        this.$refs.focuspoint[this.editRow].focus();
      });
    },
    getAllData() {
      //取得所有資料
      this.$api
        .options("user/getAll/" + this.$store.state.databaseName + "/user")
        .then((rs) => {
          let userItems = rs
            .filter((i) => !!i.bed_name)
            .sort(function (a, b) {
              var a = a.bed_name;
              var b = b.bed_name;

              if (a === b) {
                return 0;
              } else if (a === null) {
                return 1;
              } else if (b === null) {
                return -1;
              } else {
                return a > b ? 1 : -1;
              }
            });

          // this.sortBy();
          this.tempData = userItems.map((item) => {
            return {
              u_snkey: item.snkey,
              name: item.name,
              bed_name: item.bed_name,
              time: "",
              result: "",
              weight: "",
              bp_h: "",
              bp_l: "",
              pulse: "",
              temperature: "",
              breath: "",
              blood_sugar: "",
              blood_oxygen: "",
              pain: "",
              gcs_e: "",
              gcs_v: "",
              gcs_m: "",
              stool: "",
              note: "",
            };
          });
        });
    },
    saveData() {
      if (this.nowday.length == 0) {
        var pop = { msg: "評估日期不可為空白!!", type: true, theme: "warning" };
        this.$store.commit("snackbar", pop);
        return false;
      }

      if (this.nowtime.length == 0) {
        var pop = { msg: "評估時間不可為空白!!", type: true, theme: "warning" };
        this.$store.commit("snackbar", pop);
        return false;
      }

      //存檔前加入session裡
      sessionStorage.setItem("signlifts", JSON.stringify(this.tempData));
      this.isSignlifeSession = true;

      //存入資料
      this.$confirm("確認存入資料?").then((res) => {
        if (res) {
          // console.log('run saveData');
          this.$store.commit("getTime"); //取得現在時間
          var create_man =
            this.$store.state.pData.username +
            "(" +
            this.$store.state.time +
            ")"; //執行動作的人,時間,內容

          //取出有資料的 matchData 代表目前有資料的內容;
          let matchData = this.tempData.filter((item) => {
            //2023.7.16 判斷長度前要先去除 isAddInfo 不然長度計算會有問題
            delete item.isAddInfo;

            let strLen =
              JSON.stringify(Object.values(item)).length -
              item.bed_name.length -
              item.name.length -
              item.u_snkey.length;
            //目前空資料長度為58(有增,減欄位時要修正)
            return strLen > 58;
          });

          //這裡另外建構postData 是為了不影響  matchData 裡的資料,單純建構 postData 去
          let postData = JSON.parse(JSON.stringify(matchData));

          // console.log(postData.length);

          postData = postData.map((item) => {
            item["date"] = this.nowday;
            item["time"] = this.nowtime;
            item["create_man"] = create_man;
            delete item.name;
            delete item.bed_name;
            delete item.isAddInfo; //2023.7.11 加入刪除判斷isAdd,用來判斷本次新增後的資料狀態
            return item;
          });

          if (postData.length != 0) {
            this.$api
              .options(
                "general/addMulti/" +
                  this.$store.state.databaseName +
                  "/signlife",
                postData
              )
              .then((rs) => {
                console.log("general/addMulti/", rs);
                let matchErr = rs.filter((i) => !i.state);
                console.log(matchErr);
                if (matchErr.length) {
                  var pop = {
                    msg: "紀錄過程有誤,請再確認",
                    type: true,
                    theme: "error",
                  };
                  this.$store.commit("snackbar", pop);
                }else{
                  var pop = { msg: "已新增", type: true, theme: "success" };
                  this.$store.commit("snackbar", pop);
                  //2023.7.11 加入判斷已存入資料是否都在存在
                  this.checkIsAdd();

                  //判斷血糖 -> 有含血糖資料時新增資料到會計項目中
                  this.checkBloodSugar(postData);
                  // this.getAllData();
                }
              });
          } else {
            var pop = {
              msg: "未輸入任何資料!!請重新確認!!",
              type: true,
              theme: "warning",
            };
            this.$store.commit("snackbar", pop);
          }
        }
      });
    },
    //判斷是否有血糖
    checkBloodSugar(postData) {
      //判斷血糖->會計資料
      var feeData = this.feeItems.find((i) => {
        return i.name.includes("驗血糖/次");
      });
      if (!feeData) {
        alert("未建立[驗血糖/次]的會計項目,請通知會計或系統工程師!!");
        // var pop = { msg: "未建立[驗血糖/次]的會計項目,請通知會計或系統工程師!!", type: true, theme: "warning" };
        // this.$store.commit("snackbar", pop);
        return false;
      }

      //判斷是否含血糖的資料
      const matchData = postData.filter((i) => {
        return !!i.blood_sugar;
      });

      if (matchData.length > 0) {
        var postData = [];
        matchData.forEach((i) => {
          postData.push({
            user_snkey: i.u_snkey,
            fee_snkey: feeData.snkey,
            date: this.nowday,
            start_day: this.nowday,
            end_day: this.nowday,
            quantity: 1,
            price: feeData.price,
            note: "(A)Multi",
            create_man:
              this.$store.state.pData.username +
              "(" +
              dayjs().format("YYYY-MM-DD HH:mm:ss") +
              ")", //執行動作的人,時間,內容
          });
        });

        /* 20201106判斷日期是否超過26日 */
        postData = postData.filter((i) => {
          if (dayjs(i.date).format("DD") >= 26) {
            i.note =
              i.date +
              "調整為" +
              dayjs(i.date).add(1, "month").format("YYYY-MM-01") +
              i.note;
            i.date = dayjs(i.date).add(1, "month").format("YYYY-MM-01");
          }
          return i;
        });
        /* 20201106判斷日期是否超過26日 end*/
      }

      this.$api
        .options(
          "general/addMulti/" + this.$store.state.databaseName + "/accounting",
          postData
        )
        .then((rs) => {
          console.log('checkBloodSugar,general/addMulti/',rs)
          let matchErr = rs.filter((i) => !i.state);
          console.log(matchErr);
          if (matchErr.length) {
            // var pop = {
            //   msg: "會計費用[驗血糖/次]紀錄過程有誤,請再確認",
            //   type: true,
            //   theme: "error",
            // };
            // this.$store.commit("snackbar", pop);
          } else {
            var pop = {
              msg: "紀錄已新增 ; 會計費用[驗血糖/次]已新增]",
              type: true,
              theme: "success",
            };
            this.$store.commit("snackbar", pop);
          }
        });
    },
    delData() {
      if (this.nowday.length == 0) {
        var pop = { msg: "評估日期不可為空白!!", type: true, theme: "warning" };
        this.$store.commit("snackbar", pop);
        return false;
      }

      //刪除指定評估日期的所有資料
      this.$confirm("確認刪除指定評估日期的所有資料?").then((res) => {
        if (res) {
          let delData = {
            date: this.nowday,
            info: `${this.$store.state.pData.username}(${dayjs().format(
              "YYYY-MM-DD HH:ss:mm"
            )})(${this.nowday})`,
            //刪除的人(刪除時間)(刪除的日期date)
          };

          this.$api
            .options(
              "signlife/delMultiv2/" +
                this.$store.state.databaseName +
                "/signlife",
              delData
            )
            .then((rs) => {
              // console.log(rs.data);
              if (rs.state == 1) {
                var pop = { msg: "已刪除", type: true, theme: "success" };
                this.$store.commit("snackbar", pop);
                this.checkIsAdd(true);
              }
              if (rs.state == "nomatch") {
                var pop = {
                  msg: "無符合的日期!!",
                  type: true,
                  theme: "warning",
                };
                this.$store.commit("snackbar", pop);
              }
            });
        }
      });
    },
  },
};
</script>


<style lang="scss">
.signlifelistmulti {
  h2 {
    span {
      vertical-align: middle;
    }
  }
  thead {
    th {
      font-size: 1.2rem;
      font-family: "微軟正黑體";
    }
  }
  tbody {
    td {
      font-size: 1rem;
    }
  }
}
</style>