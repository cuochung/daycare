<template>
  <div class="medicinerecordadd">
    <v-dialog v-model="dialog" width="auto">
      <template v-slot:activator="{ on }">
        <v-icon color="red lighten-2" dark v-on="on" @click="addProcess">mdi-plus-circle</v-icon>
      </template>

      <v-card>
        <v-card-title :class="titleStyle" primary-title>{{title}}</v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12" md="6" class="d-flex align-center">
                <v-combobox
                  label="藥品"
                  :items="medicineItems"
                  v-model="list.medicinedata"
                  :rules="emptyRules"
                  @change="getMedicine"
                ></v-combobox>
                <MedicineList @getSelect="getSelect"></MedicineList>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="作用" v-model="list.medicinedata.effect" outlined readonly v-if="list.medicinedata!=undefined"></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="d-flex align-center">
                <v-combobox
                  label="單位"
                  :items="unitItems"
                  v-model="list.unitdata"
                  :rules="emptyRules"
                ></v-combobox>
                <UnitList @getSelect="getSelect"></UnitList>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field label="劑量" v-model="list.dosage"></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field label="注意事項" v-model="list.attention"></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="d-flex align-center">
                <v-combobox
                  label="用法"
                  :items="methodItems"
                  v-model="list.methoddata"
                  :rules="emptyRules"
                ></v-combobox>
                
                <MethodList @getSelect="getSelect"></MethodList>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field label="用量" v-model="list.quantity" :rules="emptyRules"></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="d-flex align-center">
                <v-combobox
                  label="給藥時間"
                  :items="eat_medicine_timeItems"
                  v-model="list.eat_medicine_timedata"
                  @change="getEatMedicineTime"
                  :rules="emptyRules"
                ></v-combobox>
                
                <EatMedicineTimeList @getSelect="getSelect"></EatMedicineTimeList>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  label="給藥起始日期"
                  type="date"
                  v-model="list.start_date"
                  :rules="emptyRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  label="給藥起始時間"
                  :items="start_timeItems"
                  v-model="list.start_time"
                  :rules="emptyRules"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field label="給藥次數" type="number" v-model="list.medicine_counts" :rules="emptyRules"></v-text-field>
              </v-col>
              <v-col cols="12" md="9">
                <v-text-field label="藥物用完資訊" readonly outlined :value="medicineEndInfo"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="primary"
            @click="addOK"
            v-if="processType=='add'"
            :loading="loading"
            :disabled="loading"
          >確認新增</v-btn>
          <v-btn
            class="success"
            @click="editOK"
            v-if="processType=='edit'"
            :loading="loading"
            :disabled="loading"
          >確認修改</v-btn>
        </v-card-actions>
        <!-- <pre>{{list}}</pre> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import qs from "qs";
import datepicker from "@/components/DatePicker";
import dayjs from "dayjs";

import Selecter from "@/components/Selecter";
import MedicineList from "@/components/MedicineList";
import UnitList from "@/components/UnitList";
import MethodList from "@/components/MethodList";
import EatMedicineTimeList from "@/components/EatMedicineTimeList";

export default {
  components: {
    datepicker,
    Selecter,
    MedicineList,
    UnitList,
    MethodList,
    EatMedicineTimeList,
  },

  props: ["medicalRecordList", "medicalRecordItems", "medicineRecordItems"],

  data() {
    return {
      dialog: false,
      list: {
        medicinedata: {},
        unitdata: {},
        methoddata: {},
        eat_medicine_timedata: {},
        start_date: "",
        start_time: "",
        medicine_counts: "",
      }, //表單內資料
      oldList: {}, //未修改前的表單內資料
      processType: "", //存放頁面執行是add新增或edit修改
      title: "",
      titleStyle: "",
      emptyRules: [(v) => !!v || "不可空白"],
      start_timeItems: [], //存放起始時間選擇
      intervalDay: 1, //存放間隔天數
      // effect: "",
      EatMedicineTime: "",
      allUsedMedicineItems: [],
      loading: false,
      medicineItems: [],
      unitItems: [],
      methodItems: [],
      eat_medicine_timeItems: [],
    };
  },

  created() {
    this.getSelect();
    this.getAllUsedMedicine();
  },

  mounted() {
    //父組件要執行本組件時的function時的設定 (showFromParent) id是暫存傳過來的值
    this.$on("fromParent", function (item) {
      this.dialog = true;
      this.editProcess(item);
    });
  },

  watch: {
    list(val) {
      if (val.name != undefined && val.start_date != undefined) {
        if (val.name.length > 0 && val.start_date.length > 0) {
          // console.log(val);
          //判斷本次藥物使用是否重覆
          // console.log(this.allUsedMedicineItems);
          var matchData = this.allUsedMedicineItems.filter((i) => {
            return (
              i.medicine_snkey == val.medicine_snkey &&
              val.start_date >= i.start_date &&
              val.start_date <= i.end_date
            );
          });
          // console.log(matchData);
          if (matchData.length > 0 && this.processType == "add") {
            var matchMedical = this.medicalRecordItems.find((i) => {
              return i.snkey == matchData[0].medical_snkey;
            });
            // console.log(matchMedical)
            var msg = `與 [${matchMedical.date}] [${matchMedical.hospital_name}-${matchMedical.branch_name}]`;
            var pop = {
              msg: msg + ",藥品使用重覆!!,請注意!!",
              type: true,
              theme: "warning",
            };
            this.$store.commit("snackbar", pop);
          }
          //判斷本次藥物使用是否重覆end
        }
      }
    },
  },

  computed: {
    //藥物用完資訊
    medicineEndInfo() {
      if (
        this.list.eat_medicine_timedata != undefined &&
        this.list.start_date != "" &&
        this.list.start_time != "" &&
        this.list.medicine_counts != ""
      ) {
        // console.log("run in", this.list.eat_medicine_timedata);

        //2025.10.3 加入判斷指定日期loop給藥的狀況
        if (this.list.eat_medicine_timedata && this.list.eat_medicine_timedata.repeatDate) {
          console.log('run repeatDate');

          let DateArrs = this.list.eat_medicine_timedata.repeatDate.split(',').map(d => parseInt(d, 10));
          let TimeArrs = this.list.eat_medicine_timedata.time.split(',').map(t => parseInt(t, 10));
          let startDate = dayjs(this.list.start_date);
          let startTime = parseInt(this.list.start_time, 10);

          // 🔹 檢查 start_date 是否在指定日期內
          if (!DateArrs.includes(startDate.date())) {
            this.$store.commit("snackbar", {
              msg: `起始給藥日期不在指定的用藥日期範圍內：${DateArrs.join(',')},請確認!!`,
              type: true,
              theme: "warning",
            });
            return '起始給藥日期不在指定的用藥日期範圍內';
          }

          console.log('DateArrs', DateArrs, 'TimeArrs', TimeArrs, 'startDate', startDate.format('YYYY-MM-DD'), 'startTime', startTime);

          let finalDate = null;
          let finalTime = null;
          let checkDate = startDate.clone();
          let currentTimeIndex = TimeArrs.indexOf(startTime); // 起始日從選定時間開始

          // 使用 for 迴圈，執行次數由 medicine_counts 決定
          for (let i = 0; i < this.list.medicine_counts; i++) {
            // 找下一個符合指定日期的日子
            while (!DateArrs.includes(checkDate.date())) {
              checkDate = checkDate.add(1, 'day');
              currentTimeIndex = 0; // 每天從第一個時間開始
            }

            // 記錄本次投藥
            finalDate = checkDate.clone();
            finalTime = TimeArrs[currentTimeIndex];

            // 準備下一次投藥
            currentTimeIndex++;
            if (currentTimeIndex >= TimeArrs.length) {
              currentTimeIndex = 0;
              checkDate = checkDate.add(1, 'day'); // 往後一天
            }
          }

          // 最終結果
          this.list.medicineEndInfo = '日期:' + finalDate.format('YYYY-MM-DD') + ' 時段:' + finalTime;
          return this.list.medicineEndInfo;
        }

        //2025.10.3 加入判斷指定星期 loop給藥的狀況
        if (this.list.eat_medicine_timedata && this.list.eat_medicine_timedata.repeatWeek && this.list.eat_medicine_timedata.repeatWeek.length > 0) {
          console.log('run repeatWeek');

          // 將 repeatWeek 轉成數字陣列，1~7 (1=一, 7=日)
          let WeekArrs = this.list.eat_medicine_timedata.repeatWeek.split(',').map(w => parseInt(w, 10));
          let TimeArrs = this.list.eat_medicine_timedata.time.split(',').map(t => parseInt(t, 10));
          let startDate = dayjs(this.list.start_date);
          let startTime = parseInt(this.list.start_time, 10);

          // 🔹 檢查起始日期是否落在指定星期
          let startWeek = startDate.day() === 0 ? 7 : startDate.day(); // dayjs 0=日 -> 7
          if (!WeekArrs.includes(startWeek)) {
            this.$store.commit("snackbar", {
              msg: `起始給藥日期的星期不在指定用藥星期範圍內：${WeekArrs.join(',')}, 請確認!!`,
              type: true,
              theme: "warning",
            });
            return '起始給藥日期的星期不在指定用藥星期範圍內';
          }

          console.log('WeekArrs', WeekArrs, 'TimeArrs', TimeArrs, 'startDate', startDate.format('YYYY-MM-DD'), 'startTime', startTime);

          let finalDate = null;
          let finalTime = null;
          let checkDate = startDate.clone();
          let currentTimeIndex = TimeArrs.indexOf(startTime); // 起始日從選定時間開始

          // 使用 for 迴圈，執行次數由 medicine_counts 決定
          for (let i = 0; i < this.list.medicine_counts; i++) {
            // 找下一個符合指定星期的日期
            while (!WeekArrs.includes(checkDate.day() === 0 ? 7 : checkDate.day())) {
              checkDate = checkDate.add(1, 'day');
              currentTimeIndex = 0; // 每天從第一個時間開始
            }

            // 記錄本次投藥
            finalDate = checkDate.clone();
            finalTime = TimeArrs[currentTimeIndex];

            // 準備下一次投藥
            currentTimeIndex++;
            if (currentTimeIndex >= TimeArrs.length) {
              currentTimeIndex = 0;
              checkDate = checkDate.add(1, 'day'); // 往後一天
            }
          }

          // 最終結果
          this.list.medicineEndInfo = '日期:' + finalDate.format('YYYY-MM-DD') + ' 時段:' + finalTime;
          return this.list.medicineEndInfo;
        }



        console.log('run original')
        let addday = Math.ceil(
          this.list.medicine_counts / this.start_timeItems.length
        ); //取得藥物使用天數
        let intervaldaycount = Math.floor(
          (this.list.medicine_counts - 1) / this.start_timeItems.length
        ); //取得額外間隔天數的次數
        let last = (this.list.medicine_counts - 1) % this.start_timeItems.length; //取得餘數->代表當日用藥時刻
        let selectIndex = this.start_timeItems.indexOf(this.list.start_time); //取得藥物使用時間的index
        let nextDay = 0;

        if (selectIndex + last >= this.start_timeItems.length) {
          nextDay = 1;
        }
        let newindex = (selectIndex + last) % this.start_timeItems.length;

        dayjs().format();
        if (this.intervalDay > 1) {
          //判斷用藥間隔天數
          this.list.medicineEndInfo =
            "日期:" +
            dayjs(this.list.start_date)
              .add(
                addday -
                  1 +
                  intervaldaycount * (this.intervalDay - 1) +
                  nextDay,
                "day"
              )
              .format("YYYY-MM-DD") +
            " 時段:" +
            this.start_timeItems[newindex];
        } else {
          this.list.medicineEndInfo =
            "日期:" +
            dayjs(this.list.start_date)
              .add(addday - 1 + nextDay, "day")
              .format("YYYY-MM-DD") +
            " 時段:" +
            this.start_timeItems[newindex];
        }
        return this.list.medicineEndInfo;
      }
    },
  },

  methods: {
    //取得各項選單的資料
    getSelect() {
      this.getSelectItems("medicine");
      this.getSelectItems("unit");
      this.getSelectItems("method");
      this.getSelectItems("eat_medicine_time");
    },
    mapData(database, data) {
      this[database + "Items"] = data.map((item) => {
        if (database == "medicine") {
          return {
            snkey: item.snkey,
            text: item.name,
            effect: item.effect,
          };
        }

        if (database == "eat_medicine_time") {
          // let item = item.map(i => ({
          //   ...i,
          //   repeatWeek: i.repeatWeek ? JSON.parse(i.repeatWeek) : []
          // }))
          // if (item.repeatWeek) {
          //   item.repeatWeek = JSON.parse(item.repeatWeek);
          // } else {
          //   item.repeatWeek = [];
          // }

          return {
            snkey: item.snkey,
            text: item.repeatWeek ? item.name + " [" + item.time + "]" + " / 每周 " + item.repeatWeek :
              item.repeatDate ? (item.name + " [" + item.time + "]" + " / 每月 " + item.repeatDate) + "號" :
                (item.name + " [" + item.time + "]" + " / 間隔 " + item.day + "天"),
            // text:
            //   item.name + " [" + item.time + "]" + " / 間隔 " + item.day + "天",
            time: item.time,
            day: item.day,
            repeatWeek: item.repeatWeek,
            repeatDate: item.repeatDate ? item.repeatDate : '',
          };
        }

        return {
          snkey: item.snkey,
          text: item.name,
        };
      });
    },
    //選取藥品時的反應
    getMedicine() {
      if (this.list.medicinedata == null ){ return false }

      //判斷本次藥物使用是否重覆
      let item = this.list.medicinedata;
      let repeat = this.medicineRecordItems.find((i) => {
        return i.medicine_snkey == item.snkey;
      });
      if (repeat != undefined) {
        let pop = {
          msg: "本次就診藥品輸入重覆,請確認!!",
          type: true,
          theme: "warning",
        };
        this.$store.commit("snackbar", pop);
      }
      //判斷本次藥物使用是否重覆end
      // this.effect = item.effect;
    },
    //選取吃藥時間時的反應
    getEatMedicineTime() {
      //取得吃藥時間
      // this.EatMedicineTime = this.list.eat_medicine_timedata.text;
      if (this.list.eat_medicine_timedata == null){
        var pop = { msg: "未正確選擇給藥時間或給藥時間不正確,請重新確認!!", type: true, theme: "warning" };
        this.$store.commit("snackbar", pop);
        return false;
      }
      if (this.list.eat_medicine_timedata.snkey == undefined){
        var pop = { msg: "未正確選擇給藥時間或給藥時間不正確,請重新確認!!", type: true, theme: "warning" };
        this.$store.commit("snackbar", pop);
        return false;
      }
      this.list.start_time = "";
      this.start_timeItems = this.list.eat_medicine_timedata.time.split(",");
      this.intervalDay = this.list.eat_medicine_timedata.day; //間隔天數

      // this.setMedicineEndInfo();
    },
    //取得各項選單資料
    getSelectItems(database) {
      //this.$store.commit("setLoadingOn"); //讀取畫面on
      this.axios
        .post(
          "general/getall/" + this.$store.state.databaseName + "/" + database
        )
        .then((rs) => {
          // this[database + "Items"] = rs.data;
          this.mapData(database, rs.data);
          // this.$store.commit("setLoadingOff"); //讀取畫面off
        });
    },
    getAllUsedMedicine() {
      //this.$store.commit("setLoadingOn"); //讀取畫面on
      var postData = {
        key: "user_snkey",
        value: this.$store.state.uData.snkey,
      };

      this.axios
        .post(
          "general/getByKey/" +
            this.$store.state.databaseName +
            "/medicine_record",
          qs.stringify(postData)
        )
        .then((rs) => {
          // console.log('medicine_record',rs.data)
          this.allUsedMedicineItems = rs.data.map((i) => {
            var newItem = i;
            newItem.end_date = newItem.medicineEndInfo.substr(3, 10);
            return newItem;
          });
          // this.$store.commit("setLoadingOff"); //讀取畫面off
        });
    },
    addProcess() {
      //進入畫面時,執行的是新增作業
      this.processType = "add";
      this.title = "新增用藥";
      this.titleStyle = "font-weight-black error lighten-2";
      (this.list = {
        start_date: "",
        start_time: "",
        medicine_counts: "",
      }), //表單內資料
        // this.EatMedicineTime = "";
        this.$nextTick(() => {
          this.$refs.form.resetValidation();
        });
    },
    editProcess(item) {
      //進入畫面時,執行的是修改作業
      this.processType = "edit";
      this.title = "修改用藥";
      this.titleStyle = "font-weight-black success lighten-2";
      this.oldList = item; //將頁面資料與父項的資料連結
      this.list = { ...item }; //複制一份實際修改資料內容

      var checkCol = ["medicine","unit","method","eat_medicine_time",];
      checkCol.forEach(i=>{
        this[i+'Items'].find(cItem=>{
          if (cItem.snkey == this.list[i+'_snkey']){
            this.$set(this.list, i+'data', cItem);
          }
        })
      });  
      // this.getMedicine();  //不寫會看不到副作用
      this.getEatMedicineTime(); //不寫會抓不到時間
      this.list.start_time = item.start_time;

    },
    //確認新增
    addOK() {
      if (this.$refs.form.validate()) {
        this.$store.commit("getTime"); //取得現在時間
        var postData = {
          user_snkey:this.$store.state.uData.snkey,
          medical_snkey:this.medicalRecordList.snkey,
          medicine_snkey : this.list.medicinedata.snkey,
          unit_snkey:this.list.unitdata.snkey,
          method_snkey:this.list.methoddata.snkey,
          eat_medicine_time_snkey:this.list.eat_medicine_timedata.snkey,
          dosage:this.list.dosage,
          attention:this.list.attention,
          quantity:this.list.quantity,
          start_date:this.list.start_date,
          start_time:this.list.start_time,
          medicine_counts:this.list.medicine_counts,
          medicineEndInfo:this.list.medicineEndInfo,
          create_man:this.$store.state.pData.username + "(" + this.$store.state.time + ")", //執行動作的人,時間,內容
        }

        this.loading = true;
        this.axios
          .post(
            "general/add/" +
              this.$store.state.databaseName +
              "/medicine_record",
            qs.stringify(postData)
          )
          .then((rs) => {
            // console.log(rs.data)
            if (rs.data.state == 1) {
              var pop = { msg: "已新增", type: true, theme: "success" };
              this.$store.commit("snackbar", pop);
              this.dialog = false;
              this.$emit("getMedicineRecord");
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
    //確認修改
    editOK() {
      if (this.$refs.form.validate()) {
       this.$store.commit("getTime"); //取得現在時間
        var postData = {
          snkey:this.list.snkey,
          user_snkey:this.$store.state.uData.snkey,
          medical_snkey:this.medicalRecordList.snkey,
          medicine_snkey : this.list.medicinedata.snkey,
          unit_snkey:this.list.unitdata.snkey,
          method_snkey:this.list.methoddata.snkey,
          eat_medicine_time_snkey:this.list.eat_medicine_timedata.snkey,
          dosage:this.list.dosage,
          attention:this.list.attention,
          quantity:this.list.quantity,
          start_date:this.list.start_date,
          start_time:this.list.start_time,
          medicine_counts:this.list.medicine_counts,
          medicineEndInfo:this.list.medicineEndInfo,
          edit_man:this.$store.state.pData.username + "(" + this.$store.state.time + ")", //執行動作的人,時間,內容
        }

        this.axios
          .post(
            "general/edit/" +
              this.$store.state.databaseName +
              "/medicine_record",
            qs.stringify(postData)
          )
          .then((rs) => {
            if (rs.data.state == 1) {
              var pop = { msg: "已修改", type: true, theme: "success" };
              this.$store.commit("snackbar", pop);
              this.dialog = false;
              this.$emit("getMedicineRecord");
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
    // getUnit(item) {
    //   this.list.unit_snkey = item.snkey;
    //   this.list.unit_name = item.text;
    // },
    // getMethod(item) {
    //   this.list.method_snkey = item.snkey;
    //   this.list.method_name = item.text;
    // },
    //取得所有該病歷使用過的所有藥物

    //取得藥物
    // getMedicine(item) {
    //   //判斷本次藥物使用是否重覆
    //   var repeat = this.medicineRecordItems.some((i) => {
    //     return i.medicine_snkey == item.snkey;
    //   });
    //   if (repeat) {
    //     var pop = {
    //       msg: "本次就診藥品輸入重覆,請確認!!",
    //       type: true,
    //       theme: "warning",
    //     };
    //     this.$store.commit("snackbar", pop);
    //   }
    //   //判斷本次藥物使用是否重覆end

    //   this.list.medicine_snkey = item.snkey;
    //   this.list.name = item.text;
    //   this.effect = item.effect;
    // },
    // getEatMedicineTime(item) {
    //   //取得吃藥時間
    //   this.list.eat_medicine_time_snkey = item.snkey;
    //   this.EatMedicineTime = item.text;
    //   this.list.start_time = "";
    //   this.start_time = item.time.split(",");
    //   this.intervalDay = item.day; //間隔天數
    // },
    
  },
};
</script>

<style lang="scss">
// .medicinerecordadd{
//   font-family: '微軟正黑體';
// }
</style>