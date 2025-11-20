<template>
  <div class="InspectionreportPrintOption">
    <v-dialog v-model="dialog" width="50vw">
      <!-- <template v-slot:activator="{ on }">
        <v-icon color="red lighten-2" dark v-on="on" @click="enterAdd">mdi-plus-circle</v-icon>
      </template>-->
      <v-form ref="form" class="mt-3">
        <v-card>
          <v-card-title :class="titleClass" primary-title>{{title}}</v-card-title>

          <v-card-text>
            <v-alert color="primary" outlined class="mt-2">
              <v-text-field
                label="檢驗報告單起始時間"
                type="date"
                v-model="list.startDay"
                :rules="emptyRules"
              ></v-text-field>
              <v-divider class="my-3"></v-divider>
              <v-text-field label="檢驗報告單結束時間" type="date" v-model="list.endDay" :rules="emptyRules"></v-text-field>
            </v-alert>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn class="primary" @click="printOK('no')">指定時間列印</v-btn>
            <v-btn class="primary mx-2" @click="printOK('all')">全部列印</v-btn>
            <!-- <v-btn class="error" @click="addOK" v-if="process=='add'">確認新增</v-btn>
            <v-btn class="success" @click="editOK" v-if="process=='edit'">確認修改</v-btn>-->
          </v-card-actions>
          <!-- <pre>{{list}}</pre> -->
        </v-card>
      </v-form>
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
      list: {},
      emptyRules: [v => !!v || "不可空白"],
      title: "", //抬頭
      titleClass: "", //抬頭顯示樣式
      process: "", //儲存執行動作
      items: [], //暫存指定病歷的全部護理紀錄
      signlifeItems: [] //暫存生命徵象資料
    };
  },

  mounted() {
    //父組件要執行本組件時的function時的設定 (showFromParent) id是暫存傳過來的值
    this.$on("childFn", function(item) {
      this.dialog = true;
      this.enterProcess(item);
    });
  },

  methods: {
    enterProcess(items) {
      //執行修改流程(本案只拿來顯示畫面,透過父項目的控制)
      this.process = "edit";
      this.title = "列印檢驗報告單設定";
      this.titleClass = "font-weight-black primary lighten-2";
      this.items = items;
    },
    //確認列印
    printOK(printAll) {
      if (printAll == "no") {
        if (this.$refs.form.validate()) {
          this.$confirm("確認顯示列印畫面?").then(res => {
            if (res) {
              var postData = this.items.filter(i => {
                if (
                  dayjs(i.date).format("YYYY-MM-DD") >=
                    dayjs(this.list.startDay).format("YYYY-MM-DD") &&
                  dayjs(i.date).format("YYYY-MM-DD") <=
                    dayjs(this.list.endDay).format("YYYY-MM-DD")
                ) {
                  return i;
                }
              });

              postData = postData.sort(function(a, b) {
                return a.date > b.date ? 1 : -1;
              });
              // var printData = {
              //   medicalData: item,
              //   medicineData: medicineData,
              //   signlifeData: signlifeData,
              //   printSet: this.list
              // };

              //送出資料到列印頁面
              sessionStorage.setItem("printData", JSON.stringify(postData));
              let routeData = this.$router.resolve({
                path: "/print/inspectionreportprint"
              });
              window.open(routeData.href, "_blank");
            }
          });
        }
      } else {
        this.$confirm("確認顯示列印畫面?").then(res => {
          if (res) {
            var postData = this.items.sort(function(a, b) {
              return a.date > b.date ? 1 : -1;
            });

            // var printData = {
            //   medicalData: item,
            //   medicineData: medicineData,
            //   signlifeData: signlifeData,
            //   printSet: this.list
            // };

            //送出資料到列印頁面
            sessionStorage.setItem("printData", JSON.stringify(postData));
            let routeData = this.$router.resolve({
              path: "/print/inspectionreportprint"
            });
            window.open(routeData.href, "_blank");
          }
        });
      }
    }
  }
};
</script>

