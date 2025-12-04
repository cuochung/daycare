<template>
  <div class="medicinerecordlist">
    <medicalPrintOption :medicalRecordItems="medicalRecordItems" :eatMedicineTimeItems="eatMedicineTimeItems"
      ref="enterEdit"></medicalPrintOption>

    <v-card class="mt-2">
      <v-card-title>
        <v-row>
          <v-col cols="12" md="6">
            <h2 class="subheading grey--text">
              <v-icon class="mx-1">fas fa-file-alt</v-icon>
              <span>
                {{ this.$store.state.uData.p_code }} /
                {{ this.$store.state.uData.name }}
              </span>
              <span>就醫及藥品紀錄維護</span>
            </h2>
          </v-col>

          <v-col cols="12" md="6" class="text-right py-0">
            <v-row>
              <v-col cols="6"></v-col>
              <v-col cols="6" class="d-flex align-center">
                <v-text-field label="列印月份設定" type="month" v-model="printMonth" hide-details></v-text-field>
                <!-- <v-btn class="primary" @click.stop="printConfirm"><v-icon class="mr-1" small>mdi-pill</v-icon>列印藥單</v-btn>
                <v-btn class="mx-1 primary" @click.stop="goPrint">前往多筆列印頁面</v-btn>-->
                <!-- 功能列表 -->
                <v-menu transition="scale-transition" offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on">功能</v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>
                        <v-btn class="primary" @click.stop="printConfirm">
                          <v-icon class="mx-2">mdi-pill</v-icon>
                          列印藥單
                          每頁 <input type="text" v-model="printPerPage" @click.stop="" maxlength="2" style="width:20px">筆
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>
                        <v-btn class="primary" @click.stop="goPrint">
                          <v-icon class="mx-2">mdi-printer</v-icon>
                          前往多筆列印頁面
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <!-- 表單內容 -->
        <!-- 醫院就診紀錄 -->
        <v-card>
          <v-card-title>
            <h3>醫院就診紀錄</h3>

            <v-spacer></v-spacer>
            <v-text-field prepend-icon="mdi-magnify" label="搜尋" v-model="serachKey"></v-text-field>
            <popupadd :medicalRecordItems="medicalRecordItems" @getMedicalData="getMedicalData" ref="editProcess">
            </popupadd>
          </v-card-title>

          <v-card-text>
            <v-data-iterator :items="filterItems" :items-per-page.sync="itemsPerPage"
              :footer-props="{ itemsPerPageOptions }">
              <template v-slot:default="props" style="overflow:auto">
                <v-simple-table fixed-header class="mt-2 text-no-wrap" height="50vh">
                  <template v-slot:default>
                    <thead>
                      <th><v-combobox :items="sortItems" label="排序依據" v-model="sortKey"></v-combobox></th>
                      <th>就診日</th>
                      <th>醫院/科別</th>
                      <th>科別</th>
                      <th>醫師</th>
                      <th>回診日期</th>
                      <th>就診主因</th>
                      <th v-if="$store.state.cData.isShowCreaterName">紀錄人姓名</th>
                      <th v-if="$store.state.cData.isShowCreaterInfo">紀錄人紀錄</th>
                      <th v-if="$store.state.cData.isShowEditerInfo">修改紀錄</th>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in props.items" :key="index" @click="
                        medicalRecordList = item;
                      getMedicineRecord()">
                        <td>
                          <v-menu transition="scale-transition" offset-y>
                            <template v-slot:activator="{ on }">
                              <v-btn color="primary" dark v-on="on" @click.stop>功能</v-btn>
                            </template>
                            <v-list>
                              <v-list-item @click.stop="edit(item)">
                                <v-list-item-title>修改</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click.stop="del(item)" :loading="loading" :disabled="loading">
                                <v-list-item-title>刪除</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click.stop="print(item)">
                                <v-list-item-title>列印</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click.stop="medicalCopy(item)">
                                <v-list-item-title>延續用藥</v-list-item-title>
                              </v-list-item>
                              <!-- <v-list-item @click.stop="enterNursingRecord(item)">
                                <v-list-item-title>轉入護理紀錄</v-list-item-title>
                              </v-list-item>-->
                            </v-list>
                          </v-menu>
                        </td>
                        <td>{{ item.date }}</td>
                        <td>{{ item.hospital_name }}</td>
                        <td>{{ item.branch_name }}</td>
                        <td>{{ item.doctor_name }}</td>
                        <td>{{ item.back_date }}</td>
                        <td>{{ item.main_cause_of_treatment_name }}</td>
                        <td v-if="$store.state.cData.isShowCreaterName">{{ (item.create_man).split('(')[0] }}</td>
                        <td v-if="$store.state.cData.isShowCreaterInfo">{{ item.create_man }}</td>
                        <td v-if="$store.state.cData.isShowEditerInfo" class="text-truncate" style="max-width: 400px;">
                          {{ item.edit_man }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
            </v-data-iterator>
          </v-card-text>
        </v-card>

        <!-- 用藥內容 -->
        <v-form ref="form">
          <v-card class="mt-2">
            <v-card-title>
              <h3>用藥內容</h3>
              <div v-if="medicalRecordList.date">({{ medicalRecordList.date }} / {{ medicalRecordList.hospital_name }} /
                {{ medicalRecordList.branch_name }})</div>
              <v-spacer></v-spacer>
              <MedicineRecordAdd v-if="medicalRecordList.date" :medicineRecordItems="medicineRecordItems"
                :medicalRecordList="medicalRecordList" :medicalRecordItems="medicalRecordItems"
                @getMedicineRecord="getMedicineRecord" ref="editMedicineProcess"></MedicineRecordAdd>
            </v-card-title>
            <v-card-text>
              <v-simple-table fixed-header class="mt-2 text-no-wrap">
                <thead>
                  <th></th>
                  <th>藥品</th>
                  <th>單位</th>
                  <th>劑量</th>
                  <th>用量</th>
                  <th>給藥次數</th>
                  <th>開始日期</th>
                  <th>藥物用完資訊</th>
                  <th>停藥</th>
                  <th v-if="$store.state.cData.isShowCreaterName">紀錄人姓名</th>
                  <th v-if="$store.state.cData.isShowCreaterInfo">紀錄人紀錄</th>
                  <th v-if="$store.state.cData.isShowEditerInfo">修改紀錄</th>

                </thead>
                <tbody>
                  <tr v-for="(item, index) in medicineRecordItems" :key="index">
                    <td>
                      <v-icon color="green" @click.stop="editMedicineRecord(item)">mdi-pencil</v-icon>
                      <v-icon color="red" @click.stop="delMedicineRecord(item)">mdi-close</v-icon>
                    </td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.unit_name }}</td>
                    <td>{{ item.dosage }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.medicine_counts }}</td>
                    <td>{{ item.start_date }}</td>
                    <td>{{ item.medicineEndInfo }}</td>
                    <td @click.stop="stopMedicine(item)">
                      <v-checkbox v-model="item.stop" value="true"></v-checkbox>
                    </td>
                    <td v-if="$store.state.cData.isShowCreaterName">{{ (item.create_man).split('(')[0] }}</td>
                    <td v-if="$store.state.cData.isShowCreaterInfo">{{ item.create_man }}</td>
                    <td v-if="$store.state.cData.isShowEditerInfo" class="text-truncate" style="max-width: 400px;">
                    {{ item.edit_man }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- <pre>{{medicineRecordItems}}</pre> -->
  </div>
</template>

<script>
import qs from "qs";
import popupadd from "@/views/document/MedicalRecordAdd";
import MedicineRecordAdd from "@/views/document/MedicineRecordAdd";
import datepicker from "@/components/DatePicker";
import medicalPrintOption from "@/components/medicalPrintOption"; //列印藥單前的內容設定
import dayjs from "dayjs";

export default {
  components: { popupadd, datepicker, MedicineRecordAdd, medicalPrintOption },
  data() {
    return {
      emptyRules: [(v) => !!v || "不可空白"],
      viewData: [], //顯示的資料
      serachKey: "",
      medicineEdititem: {}, //修改中資料-藥物
      itemsPerPageOptions: [10, 20, 30],
      itemsPerPage: 10,
      medicalRecordItems: [], //目前讀取進來的資料庫
      medicalRecordList: {}, //存放選取的就診醫院
      // medicineItems: [], //存放所有藥品
      medicineList: {}, //存放新增中藥物內容
      start_time: [], //存放起始時間選擇
      medicineRecordItems: [], //存放就診日當日用藥
      eatMedicineTimeItems: [], //存放吃藥時間
      printMonth: dayjs().format("YYYY-MM"), //列印月份
      // medicalPrintOptionSwitch: false,  //列印藥單前的內容設定開關
      loading: false,
      sortItems: [
        { text: '建檔日', key: 'snkey', type: 'int' },
        { text: '就診日', key: 'date', type: 'date' }
      ],
      sortKey: "",
      printPerPage: "10",
    };
  },

  filters: {
    //顯示就診主因是第幾次
    returnCounts(val) {
      if (val == 0) {
        return "";
      } else {
        return "(" + (Number(val) + 1) + ")";
      }
    },
  },

  computed: {
    //使用reduce輸出多重搜尋後的結果!!
    filterItems() {
      //搜尋後輸出的陣列
      var keys = this.serachKey.split(" ");
      var str = "";

      return keys.reduce(function (prev, element) {
        return prev.filter((item) => {
          str = JSON.stringify(item).toUpperCase();
          if (str.includes(element.toUpperCase())) {
            return item;
          }
        });
      }, this.medicalRecordItems);
    },
  },

  async mounted() {
    //之後跟create交換,因為不用mounted 按F5會抓不到DOM點
    await this.getMedicalData(); //取得就診紀錄
    await this.getEatMedicineTime(); //取得所有吃藥時間
    //this.getMedicineData(); //取得藥品資料
    // this.$store.dispatch("getItems", "eat_medicine_time");
  },

  watch: {
    sortKey() {
      // console.log(this.sortKey,'run watch');
      this.medicalRecordItems = this.sort(this.medicalRecordItems, this.sortKey.key, this.sortKey.type);
    },
  },

  methods: {
    goPrint() {
      this.$router.push("/main/printmanager/medicinerecordprintmanage");
    },
    //停藥切換
    stopMedicine(item) {
      var postData = {
        snkey: item.snkey,
        stop: item.stop,
        edit_man: "",
      };

      this.$api.post('medicine_record', postData)
        .then((rs) => {
          console.log('stopMedicine', rs);
          if (rs.state == 1) {
            var pop = { msg: "已修改", type: true, theme: "success" };
            this.$store.commit("snackbar", pop);
          }
        });
    },
    //確認列印藥單
    printConfirm() {
      // this.medicalPrintOptionSwitch = true;
      //判斷確認列印
      this.$confirm("確認顯示列印藥單畫面?").then((res) => {
        if (res) {
          //取得該病歷所有用藥資料(判斷列印月份,在指定月份內還在使用的才列印)
          var postData = {
            key: "user_snkey",
            value: this.$store.state.uData.snkey,
          };

          this.$api.options(`medicinerecord/getByKey/${this.$store.state.databaseName}`, postData)
            .then((rs) => {
              //判斷本月藥物中還在使用的
              var medicineData = rs.filter((i) => {
                if (
                  i.stop != "true" &&
                  dayjs(this.printMonth).format("YYYY-MM") >=
                  dayjs(i.start_date).format("YYYY-MM") &&
                  dayjs(this.printMonth).format("YYYY-MM") <=
                  dayjs(i.medicineEndInfo.substring(3, 13)).format("YYYY-MM")
                ) {
                  i["end_date"] = i.medicineEndInfo.substring(3, 13);
                  return i;
                }
              });

              if (medicineData.length == 0) {
                var pop = {
                  msg: "暫無符合資料,請重新確認月份",
                  type: true,
                  theme: "warning",
                };
                this.$store.commit("snackbar", pop);
                return false;
              }

              //取得各藥物的就診紀錄
              medicineData = medicineData.filter((i) => {
                var matchmedicalRecord = this.medicalRecordItems.find((j) => {
                  return i.medical_snkey == j.snkey;
                  // if (i.medical_snkey == j.snkey) {
                  //   i["medical"] = j;
                  //   return i;
                  // }
                });

                //不存在的就診資料不會被列入,不然列印時會出錯
                if (matchmedicalRecord) {
                  i["medical"] = matchmedicalRecord;
                  return i;
                }
              });

              //取得各藥物的吃藥時間紀錄
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

              medicineData = medicineData.sort(function (a, b) {
                return Number(a.medical_snkey) < Number(b.medical_snkey) ? 1 : -1;
              })

              // medicineData = medicineData.filter((i) => {
              //   return this.eatMedicineTimeItems.filter((j) => {
              //     if (i.eat_medicine_time_snkey == j.snkey) {
              //       i["eat_medicine_time"] = j;
              //       return i;
              //     }
              //   });
              // });

              var printData = {
                printMonth: this.printMonth,
                medicineData: medicineData,
                printPerPage: this.printPerPage,
              };

              //送出資料到列印頁面
              sessionStorage.setItem("printData", JSON.stringify(printData));
              let routeData = this.$router.resolve({
                path: "/print/medicineprint",
              });
              window.open(routeData.href, "_blank");
            });
        }
      });
    },
    //取得所有吃藥時間
    async getEatMedicineTime() {
      await this.$api.get("eat_medicine_time").then((rs) => {
        console.log('getEatMedicineTime', rs.length)
        this.eatMedicineTimeItems = rs;
      });
    },
    //取得就診紀錄
    async getMedicalData() {
      await this.$api.options(`medicinerecord/getByUserSnkey/${this.$store.state.databaseName}/${this.$store.state.uData.snkey}`)
        .then((rs) => {
          console.log('getMedicalData', rs.length)
          if (rs.length > 0) {
            this.medicalRecordItems = rs
            // .map((i, index) => {
            //   if (i["pipeline"].length > 0) {
            //     i["pipeline"] = JSON.parse(i.pipeline);
            //   } else {
            //     i["pipeline"] = [];
            //   }
            //   return i;
            // });

            this.sortKey = {
              text: "就診日",
              key: 'date',
              type: 'date'
            };  //設定這個可以影響搜尋的順序
          } else {
            this.medicalRecordItems = [];
            this.medicineRecordItems = [];
          }

        });
    },
    //取得就診當日的用藥內容
    getMedicineRecord() {
      let postData = {
        key: "medical_snkey",
        value: this.medicalRecordList.snkey,
      };

      this.$api.options(`medicinerecord/getByKey/${this.$store.state.databaseName}`, postData)
        .then((rs) => {
          console.log('getMedicineRecord', rs.length)
          this.medicineRecordItems = rs;
          this.sortBy("medicineRecordItems");
          var pop = {
            msg: "用藥內容已載入",
            type: true,
            theme: "success",
          };
          this.$store.commit("snackbar", pop);
        });
    },
    sort(items, key, type) {
      // console.log(items,key,type);
      return items.sort(function (a, b) {
        if (type == 'int') {
          return Number(a[key]) < Number(b[key]) ? 1 : -1;
        } else {
          return a[key] < b[key] ? 1 : -1;
        }

      })
    },
    sortBy(key) {
      if (key == "medicalRecordItems") {
        this.medicalRecordItems = this.medicalRecordItems.sort(function (a, b) {
          // return a.date < b.date ? 1 : -1;
          return Number(a.snkey) < Number(b.snkey) ? 1 : -1;
        });
      }

      if (key == "medicineRecordItems") {
        this.medicineRecordItems = this.medicineRecordItems.sort(function (
          a,
          b
        ) {
          return Number(a.snkey) < Number(b.snkey) ? 1 : -1;
        });
      }
    },
    editMedicineRecord(item) {
      //修改用藥
      this.$refs.editMedicineProcess.$emit("fromParent", item);
    },
    delMedicineRecord(delData) {
      //刪除用藥
      this.$confirm("確認刪除?").then((res) => {
        delData.delman =
          this.$store.state.pData.username +
          "(" +
          dayjs().format("YYYY-MM-DD HH:mm:ss") +
          ")";
        var postData = {
          snkey: delData.snkey,
          tablename: "medicine_record",
          info: JSON.stringify(delData),
        };

        if (res) {
          this.$api.delete('medicine_record', postData)
            .then((rs) => {
              console.log('delMedicineRecord', rs);
              if (rs.state == 1) {
                var pop = { msg: "已刪除", type: true, theme: "success" };
                this.$store.commit("snackbar", pop);
                this.getMedicineRecord();
              }
            });
        }
      });

    },
    edit(item) {
      //修改就診紀錄功能
      // this.edititem = item;
      this.$refs.editProcess.$emit("fromParent", item);
    },
    del(delData) {
      //刪除功能
      this.$confirm("確認刪除?將連同相關用藥內容一同刪除!!").then((res) => {
        if (res) {
          //刪除相關用藥內容
          this.$api.options(`medicinerecord/getMedicineRecordByMedicalSnkey/${this.$store.state.databaseName}/${delData.snkey}`)
            .then((rs) => {
              console.log('del medicinerecord', rs);
              rs.forEach((item) => {
                this.delMedicineRecordMulti(item);
              });
            });
          //刪除相關用藥內容end

          delData.delman =
            this.$store.state.pData.username +
            "(" +
            dayjs().format("YYYY-MM-DD HH:mm:ss") +
            ")";
          var postData = {
            snkey: delData.snkey,
            tablename: "medical_record",
            info: JSON.stringify(delData),
          };

          // if (res) {
          this.$api.delete('medical_record', postData)
            .then((rs) => {
              console.log('del medical_record', rs);
              if (rs.state == 1) {
                var pop = { msg: "已刪除", type: true, theme: "success" };
                this.$store.commit("snackbar", pop);
                this.getMedicalData();
                this.medicalRecordList = {};
                this.medicineRecordItems = [];
              }
            });

        }
      });
    },
    delMedicineRecordMulti(delData) {
      //刪除藥物(多筆,不判斷刪除)
      delData.delman =
        this.$store.state.pData.username +
        "(" +
        dayjs().format("YYYY-MM-DD HH:mm:ss") +
        ")";
      var postData = {
        snkey: delData.snkey,
        tablename: "medicine_record",
        info: JSON.stringify(delData),
      };

      this.$api.delete('medicine_record', postData)
        .then((rs) => {
          console.log('medicine_record 123 del', rs);
          if (rs.state == 1) {
            var pop = { msg: "已刪除", type: true, theme: "success" };
            this.$store.commit("snackbar", pop);
            // this.getAllData();
            this.medicineRecordItems = []; // 這裡要清空，不然有可能用會舊的就診資料去新增藥物
          }
        });

    },
    medicineEndInfoMath(medicineList, intervalDay, timeArr) {
      //藥物用完資訊
      var addday = Math.ceil(medicineList.medicine_counts / timeArr.length); //取得藥物使用天數
      var intervaldaycount = Math.floor(
        (medicineList.medicine_counts - 1) / timeArr.length
      ); //取得額外間隔天數的次數
      var last = (medicineList.medicine_counts - 1) % timeArr.length; //取得餘數->代表當日用藥時刻
      var selectIndex = timeArr.indexOf(medicineList.start_time); //取得藥物使用時間的index
      var nextDay = 0;

      if (selectIndex + last >= timeArr.length) {
        nextDay = 1;
      }
      var newindex = (selectIndex + last) % timeArr.length;

      dayjs().format();
      if (intervalDay > 1) {
        //判斷用藥間隔天數
        return (
          "日期:" +
          dayjs(medicineList.start_date)
            .add(
              addday - 1 + intervaldaycount * (intervalDay - 1) + nextDay,
              "day"
            )
            .format("YYYY-MM-DD") +
          " 時段:" +
          timeArr[newindex]
        );
      } else {
        return (
          "日期:" +
          dayjs(medicineList.start_date)
            .add(addday - 1 + nextDay, "day")
            .format("YYYY-MM-DD") +
          " 時段:" +
          timeArr[newindex]
        );
      }
      // return medicineList.medicineEndInfo;
    },
    //複製就診紀錄及用藥內容(取名為延續用藥)
    medicalCopy(item) {
      this.$confirm("確認延續用藥?").then((res) => {
        if (res) {
          var medicalRecord = { ...item }; //暫存就診紀錄

          //判斷回診日期的合法性
          // if (medicalRecord.back_date == "0000-00-00") {
          //   var pop = {
          //     msg: "無回診日期,請重新確認",
          //     type: true,
          //     theme: "warning"
          //   };
          //   this.$store.commit("snackbar", pop);
          //   return;
          // }

          //沒有回診日的時候,就設定成跟上次的就診日一樣
          if (medicalRecord.back_date == "0000-00-00") {
            medicalRecord.back_date = medicalRecord.date;
          }

          var postData = {
            date: medicalRecord.back_date,
            user_snkey: medicalRecord.user_snkey,
            hospital_snkey: medicalRecord.hospital_snkey,
            branch_snkey: medicalRecord.branch_snkey,
            doctor_snkey: medicalRecord.doctor_snkey,
            outpatient: medicalRecord.outpatient,
            main_cause_of_treatment_snkey:
              medicalRecord.main_cause_of_treatment_snkey,
            // main_cause_of_treatment: medicalRecord.main_cause_of_treatment,
            description: medicalRecord.description,
            count: Number(medicalRecord.count) + 1,
          };

          this.$store.commit("getTime"); //取得現在時間
          postData["create_man"] =
            this.$store.state.pData.username +
            "(" +
            this.$store.state.time +
            ")"; //執行動作的人,時間,內容

          this.$api.add('medical_record', postData)
            .then((rs) => {
              console.log('medical_record add', rs)
              if (rs.state == 1) {
                this.createMedicineRecord(medicalRecord, rs.snkey);
                var pop = { msg: "已新增資料", type: true, theme: "success" };
                this.$store.commit("snackbar", pop);
                this.getMedicalData();
              }
            });
        }
      });
    },
    // 取得就診用藥紀錄
    createMedicineRecord(medicalRecord, newMedicalRecordSnkey = null) {
      this.$api.options(`medicinerecord/getMedicineRecordByMedicalSnkey/${this.$store.state.databaseName}/${medicalRecord.snkey}`)
        .then((rs) => {
          console.log('getMedicineRecordByMedicalSnkey', rs)
          var newMedicineRecord = [];

          rs.forEach((item, index) => {
            //取得新的用藥日期及時間
            var newStartDate = item.medicineEndInfo.substr(3, 10);
            var newStartTime = item.medicineEndInfo.substr(17, 2);

            this.eatMedicineTimeItems.some((item2) => {
              if (item2.snkey == item.eat_medicine_time_snkey) {
                var intervalDay = item2.day;
                var timeArr = item2.time.split(",");
                if (timeArr.length == timeArr.indexOf(newStartTime) + 1) {
                  newStartDate = dayjs(newStartDate).add(intervalDay, "day").format("YYYY-MM-DD");
                  newStartTime = timeArr[0];
                } else {
                  newStartTime = timeArr[timeArr.indexOf(newStartTime) + 1];
                }
                //整理要新增的資料內容

                item.medical_snkey = newMedicalRecordSnkey;
                item.start_date = newStartDate;
                item.start_time = newStartTime;
                item.medicineEndInfo = this.medicineEndInfoMath(
                  item,
                  intervalDay,
                  timeArr
                );
                item["create_man"] =
                  this.$store.state.pData.username +
                  "(" +
                  dayjs().format("YYYY-MM-DD HH:mm:ss") +
                  ")"; //執行動作的人,時間,內容
                item["edit_man"] = "";
                delete item["snkey"];
                delete item["name"];
                delete item["method_name"];
                delete item["unit_name"];
                delete item["effect"];

                newMedicineRecord[index] = item;
              }
            });
            //取得新的用藥日期及時間end
          });

          //新增資料到資料庫中(多筆型)
          this.$api.options(`general/addMulti/${this.$store.state.databaseName}/medicine_record`, newMedicineRecord)
            .then((rs) => {
              console.log('general addMulti', rs);
              // if (rs.state == 1) {
              // var pop = { msg: "已新增", type: true, theme: "error" };
              // this.$store.commit("snackbar", pop);
              // this.getMedicineRecord();
              // }
            });
        });
      //取得就診用藥紀錄end
    },
    //建構護理紀錄內容:
    enterNursingRecord(item) {
      var NursingRecordData = {
        date: item.date,
        u_snkey: item.user_snkey,
        nursingrecord_content:
          "[就診紀錄內容]" +
          "\n" +
          "就診日期:" +
          item.date +
          "; 診別:" +
          item.outpatient +
          "; 時段:" +
          item.time +
          "; 醫院:" +
          item.hospital_name +
          "; 科別:" +
          item.branch_name +
          "; 醫生:" +
          item.doctor_name +
          "; 就診主因:" +
          item.main_cause_of_treatment_name +
          "; 回診日期:" +
          item.back_date +
          "; 使用車輛:" +
          item.car +
          "; 陪診人員:" +
          item.accompany +
          "; 管路:" +
          item.pipeline +
          "; 管路到期日:" +
          item.pipelinedate +
          "; 攜帶物品:" +
          item.carryitems +
          "\n\n" +
          "原因狀況描述:" +
          "\n" +
          item.description +
          "\n\n" +
          "就醫情形回覆:" +
          "\n" +
          item.response,
      }; //判斷護理紀錄資料是否存在

      let postData = {
        key: "u_snkey",
        value: this.$store.state.uData.snkey,
      };
      //取得該病歷所有護理紀錄資料
      this.$api.options(`general/getByKey/${this.$store.state.databaseName}/nursingrecord`, postData)
        .then((rs) => {
          console.log('general getbykey', rs)
          let matchData = rs.filter((i) => {
            return i.date == item.date;
          });

          this.$store.commit("getTime"); //取得現在時間
          if (matchData.length == 0) {
            //新增
            NursingRecordData["create_man"] = `${this.$store.state.pData.username}(${dayjs().format("YYYY-MM-DD HH:mm:ss")})`

            this.$api.add('nursingrecord', NursingRecordData)
              .then((rs) => {
                if (rs.state == 1) {
                  var pop = {
                    msg: "轉入護理紀錄-已新增",
                    type: true,
                    theme: "success",
                  };
                  this.$store.commit("snackbar", pop);
                }
              });
          } else {
            //修改
            NursingRecordData["snkey"] = matchData[0].snkey;
            NursingRecordData["nursingrecord_content"] =
              matchData[0].nursingrecord_content +
              NursingRecordData.nursingrecord_content;
            NursingRecordData["edit_man"] = `${this.$store.state.pData.username}(${dayjs().format("YYYY-MM-DD HH:mm:ss")})`

            this.$api.post('nursingrecord', NursingRecordData)
              .then((rs) => {
                console.log('nursingrecord 123', rs);
                if (rs.state == 1) {
                  var pop = {
                    msg: "轉入護理紀錄資料-已追加",
                    type: true,
                    theme: "success",
                  };
                  this.$store.commit("snackbar", pop);
                }
              });
          }
        });
    },
    //單筆就診紀錄列印
    print(item) {
      //判斷確認列印
      this.$refs.enterEdit.$emit("childFn", item);
    },
  },
};
</script>


<style lang="scss">
.medicinerecordlist {
  margin-bottom: 8vh;

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