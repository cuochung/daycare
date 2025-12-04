<template>
  <div class="medicalPrintOption">
    <v-dialog v-model="dialog" width="50vw">
      <!-- <template v-slot:activator="{ on }">
        <v-icon color="red lighten-2" dark v-on="on" @click="enterAdd">mdi-plus-circle</v-icon>
      </template>-->

      <v-card>
        <v-card-title :class="titleClass" primary-title>{{title}}</v-card-title>

        <v-card-text>
          <v-alert color="primary" outlined class="mt-2">
            <div class="d-flex justify-space-between">
              <h3>生命徵象指定列印內容設定</h3>
              <div>
                <v-btn class="primary mr-1" @click="selectAll">全選</v-btn>
                <v-btn color="primary" outlined @click="noAll">全不選</v-btn>
              </div>
            </div>
            <v-row class="mx-1" justify="space-between">
              <v-checkbox label="評估日期" v-model="list.signlife.date" value="true"></v-checkbox>
              <v-checkbox label="評估時間" v-model="list.signlife.time" value="true"></v-checkbox>
              <v-checkbox label="檢查結果" v-model="list.signlife.result" value="true"></v-checkbox>
              <v-checkbox label="體重" v-model="list.signlife.weight" value="true"></v-checkbox>
              <v-checkbox label="血壓(H)" v-model="list.signlife.bp_h" value="true"></v-checkbox>
              <v-checkbox label="血壓(L)" v-model="list.signlife.bp_l" value="true"></v-checkbox>
              <v-checkbox label="脈搏" v-model="list.signlife.pulse" value="true"></v-checkbox>
              <v-checkbox label="體溫" v-model="list.signlife.temperature" value="true"></v-checkbox>
              <v-checkbox label="呼吸" v-model="list.signlife.breath" value="true"></v-checkbox>
              <v-checkbox label="血糖" v-model="list.signlife.blood_sugar" value="true"></v-checkbox>
              <v-checkbox label="血氧濃度" v-model="list.signlife.blood_oxygen" value="true"></v-checkbox>
              <v-checkbox label="疼痛指數" v-model="list.signlife.pain" value="true"></v-checkbox>
              <v-checkbox label="GCS-E" v-model="list.signlife.gcs_e" value="true"></v-checkbox>
              <v-checkbox label="GCS-V" v-model="list.signlife.gcs_v" value="true"></v-checkbox>
              <v-checkbox label="GCS-M" v-model="list.signlife.gcs_m" value="true"></v-checkbox>
              <v-checkbox label="大便次數" v-model="list.signlife.stool" value="true"></v-checkbox>
              <v-checkbox label="備註" v-model="list.signlife.note" value="true"></v-checkbox>
            </v-row>
            
            <v-divider class="my-3"></v-divider>
            <h3>資料距離今日天數設定</h3>
            <v-text-field label="天數" type="number" v-model="list.day"></v-text-field>
          </v-alert>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn class="primary" @click="printOK">確認列印</v-btn>
          <!-- <v-btn class="error" @click="addOK" v-if="process=='add'">確認新增</v-btn>
          <v-btn class="success" @click="editOK" v-if="process=='edit'">確認修改</v-btn>-->
        </v-card-actions>
        <!-- <pre>{{signlifeItems}}</pre> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import qs from "qs";
import dayjs from "dayjs";

export default {
  props: ["medicalRecordItems", "eatMedicineTimeItems"],
  data() {
    return {
      dialog: false,
      list: {
        signlife: {
          date: "",
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
          note: ""
        },
        day: 10
      },
      emptyRules: [v => !!v || "不可空白"],
      title: "", //抬頭
      titleClass: "", //抬頭顯示樣式
      process: "", //儲存執行動作
      items: [],
      signlifeItems:[],  //暫存生命徵象資料
    };
  },

  mounted() {
    //父組件要執行本組件時的function時的設定 (showFromParent) id是暫存傳過來的值
    this.$on("childFn", function(item) {
      this.dialog = true;
      this.enterProcess(item);
    });
    this.selectAll();
    this.getSignlife();
  },

  methods: {
    enterProcess(item) {
      //執行修改流程(本案只拿來顯示畫面,透過父項目的控制)
      this.process = "edit";
      this.title = "列印醫院就診紀錄設定";
      this.titleClass = "font-weight-black primary lighten-2";
      this.items = item;
    },
    getSignlife() {
      var postData = {
        key: "u_snkey",
        value: this.$store.state.uData.snkey
      };

      //取得所有資料
      //this.$store.commit("setLoadingOn"); //讀取畫面on
      this.axios
        .post(
          "general/getByKey/" + this.$store.state.databaseName + "/signlife",
          qs.stringify(postData)
        )
        .then(rs => {
          // console.log(rs.data)
          this.signlifeItems = rs.data;
          // this.$store.commit("setLoadingOff"); //讀取畫面off
        });
    },
    //確認列印
    printOK() {
      this.$confirm("確認顯示列印就診紀錄單畫面?").then(res => {
        if (res) {
          var item = this.items;
          //取得該病歷所有用藥資料(判斷列印月份,在指定月份內還在使用的才列印)
          var postData = {
            key: "user_snkey",
            value: this.$store.state.uData.snkey
          };

          this.axios
            .post(
              "medicinerecord/getByKey/" + this.$store.state.databaseName,
              qs.stringify(postData)
            )
            .then(rs => {
              //判斷還在使用的藥物->放入medicineData中
              // var checkDay = dayjs(item.date).format("YYYY-MM-DD");
              var medicineData = rs.data.filter(i => {
                if (
                  dayjs(item.date) >= dayjs(i.start_date) &&
                  dayjs(i.medicineEndInfo.substring(3, 13)) > dayjs(item.date)
                ) {
                  i["end_date"] = i.medicineEndInfo.substring(3, 13);
                  return i;
                }
              });

              //判斷本月藥物中還在使用的
              // var medicineData = rs.data.filter(i => {
              //   if (
              //     i.stop != "true" &&
              //     dayjs(this.printMonth).format("YYYY-MM") >=
              //       dayjs(i.start_date).format("YYYY-MM") &&
              //     dayjs(this.printMonth).format("YYYY-MM") <=
              //       dayjs(i.medicineEndInfo.substring(3, 13)).format("YYYY-MM")
              //   ) {
              //     i["end_date"] = i.medicineEndInfo.substring(3, 13);
              //     return i;
              //   }
              // });

              if (medicineData.length == 0) {
                // var pop = {
                //   msg: "暫無符合資料,請重新確認",
                //   type: true,
                //   theme: "warning"
                // };
                // this.$store.commit("snackbar", pop);
                // return false;
                item["medicineData"] = [];
              } else {
                //取得各藥物的就診紀錄
                // medicineData = medicineData.filter(i => {
                //   return this.medicalRecordItems.filter(j => {
                //     if (i.medical_snkey == j.snkey) {
                //       i["medical"] = j;
                //       return i;
                //     }
                //   });
                // });
                 medicineData = medicineData.filter((i) => {
                var matchmedicalRecord = this.medicalRecordItems.find((j) => {
                  return i.medical_snkey == j.snkey;
                });

                //不存在的就診資料不會被列入,不然列印時會出錯
                if (matchmedicalRecord) {
                  i["medical"] = matchmedicalRecord;
                  return i;
                }
              });

                //取得各藥物的吃藥時間紀錄
                // medicineData = medicineData.filter(i => {
                //   return this.eatMedicineTimeItems.filter(j => {
                //     if (i.eat_medicine_time_snkey == j.snkey) {
                //       i["eat_medicine_time"] = j;
                //       return i;
                //     }
                //   });
                // });

                medicineData = medicineData.filter((i) => {
                var matcheatMedicineTime = this.eatMedicineTimeItems.find(
                  (j) => {
                    return i.eat_medicine_time_snkey == j.snkey;
                  }
                );

                if (matcheatMedicineTime) {
                  i["eat_medicine_time"] = matcheatMedicineTime;
                  return i;
                }
              });
              }

              //判斷符合指定日數內的生命徵象資料 就診日往前推算的指定天數內
              this.list.startDay = dayjs(item.date).add(-this.list.day,"day").format("YYYY-MM-DD");
              this.list.endDay = dayjs(item.date).format("YYYY-MM-DD");
              let signlifeData = this.signlifeItems.filter(i=>{
                return (
                  dayjs(i.date).format("YYYY-MM-DD") >= dayjs(item.date).add(-this.list.day,"day").format("YYYY-MM-DD")
                  && dayjs(i.date).format("YYYY-MM-DD") <= dayjs(item.date).format("YYYY-MM-DD")
                )
              })

              //2024.5.10 加入取得最後一筆體重的功能
              let lastWeightVal = this.signlifeItems.filter(i=>i.weight)
              if (lastWeightVal){
                lastWeightVal = lastWeightVal.sort((a,b)=>a.date < b.date ? 1: -1)
              }

              let printData = {
                medicalData: item,
                medicineData: medicineData,
                signlifeData: signlifeData,
                printSet: this.list,
                lastWeightVal: lastWeightVal.length ? lastWeightVal[0].weight : 'null'
              };

              //送出資料到列印頁面
              sessionStorage.setItem("printData", JSON.stringify(printData));
              let routeData = this.$router.resolve({
                path: "/print/medicalprint"
              });
              window.open(routeData.href, "_blank");
            });
        }
      });
    },
    //全選
    selectAll() {
      for (var i in this.list.signlife) {
        this.list.signlife[i] = "true";
      }
    },
    //全不選
    noAll() {
      for (var i in this.list.signlife) {
        this.list.signlife[i] = "";
      }
    }
  }
};
</script>

