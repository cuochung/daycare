<template>
  <div class="CareRecordAdd">
    <v-dialog v-model="dialog" persistent>
      <template v-slot:activator="{ on }">
        <v-icon color="red lighten-2" dark v-on="on" @click="addProcess">mdi-plus-circle</v-icon>
      </template>

      <v-card>
        <v-card-title :class="titleStyle" primary-title>{{
          title
          }}
          <v-spacer></v-spacer>
          <v-icon @click="dialog = false">mdi-close</v-icon>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" class="mt-3">
            <div class="spaceStyle">
              <v-row class="px-2">
                <v-col cols="12" md="6">
                  <v-text-field type="date" label="照護日期" v-model="list.Date" :rules="emptyRules"></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field type="time" label="照護時間-開始" v-model="list.Time" :rules="emptyRules"></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field type="time" label="照護時間-結束" v-model="list.Time2" :rules="emptyRules"></v-text-field>
                </v-col>

              </v-row>
            </div>


            <div class="spaceStyle mt-2">
              <div class="bannerStyle">生理監測</div>
              <v-row class="px-2">
                <v-col cols="12" md="2">
                  <v-text-field type="number" label="身高/公分" v-model="list.Height"></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field type="number" label="體重/公分" v-model="list.Weight"></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <div class="d-flex align-center">
                    <v-text-field type="number" label="身體質量指數(BMI)" v-model="bmiValue" readonly></v-text-field>
                    <span>kg/m<sup>2</sup></span>
                  </div>
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field type="number" label="臂中圍/公分" v-model="list.ArmW"></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field type="number" label="小腿圍/公分" v-model="list.LegW"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field type="text"
                    :label="`體重變化之原因(100字內) [目前字數：${list && list.with_weight_other ? list.with_weight_other.length : 0 }]`"
                    v-model="list.with_weight_other"></v-text-field>
                </v-col>


              </v-row>
            </div>

            <div class="spaceStyle mt-2">
              <div class="bannerStyle">照護管理類別</div>
              <div class="pa-2">
                <div class="subZone">
                  <v-select :items="YnItems" label="是否發生跌倒" v-model="list.IsFallDown" :rules="emptyRules"></v-select>
                  <div v-if="list.IsFallDown == '是'">
                    <div v-for="item, index in list.FallDowns" :key="index" class="d-flex gap-5">
                      <v-icon @click="delArrEvent(list.FallDowns, index)" color="red">mdi-close</v-icon>
                      <v-row>
                        <v-col cols="12" md="2"><v-text-field type="date" label="發生日期" v-model="item.Date"
                            :rules="emptyRules"></v-text-field></v-col>
                        <v-col cols="12" md="2"><v-select :items="timeItems" label="發生時間" v-model="item.Time"
                            :rules="emptyRules"></v-select></v-col>
                        <v-col cols="12" md="8"><v-text-field :label="`發生原因(100字內) [目前字數：${item.Statement.length}]`"
                            v-model="item.Statement" :rules="emptyRules"></v-text-field></v-col>
                      </v-row>

                    </div>
                    <v-btn @click="addArrEvent(list.FallDowns)" class="error">新增跌倒</v-btn>
                  </div>
                </div>

                <div class="subZone">
                  <v-select :items="YnItems" label="是否發生皮膚損傷*(新發生之皮膚損傷，排除收案前已有之皮膚損傷)" v-model="list.IsSkinDamages"
                    :rules="emptyRules"></v-select>
                  <div v-if="list.IsSkinDamages == '是'">
                    <v-row v-for="item, index in list.SkinDamages" :key="index">
                      <v-col cols="12" md="6">
                        <div class="d-flex">
                          <v-icon @click="delArrEvent(list.SkinDamages, index)" color="red">mdi-close</v-icon>
                          <v-select item-text="Value" :items="SkinDamagesItems" label="發生類型" v-model="item.Kind"
                            :rules="emptyObjRules" return-object @change="handleKindChange($event, item)"></v-select>
                          <v-text-field v-if="item.Kind.Value == '其他'" class="ml-2" label="發生類型其他說明"
                            v-model="item.Kind.Other" :rules="emptyRules"></v-text-field>
                        </div>
                      </v-col>
                      <v-col cols="12" md="3"><v-text-field type="date" label="發生日期" v-model="item.Date"
                          :rules="emptyRules"></v-text-field></v-col>
                      <v-col cols="12" md="3"><v-select :items="timeItems" label="發生時間" v-model="item.Time"
                          :rules="emptyRules"></v-select></v-col>
                      <v-col cols="12"><v-text-field :label="`發生原因(100字內) [目前字數：${item.Statement.length}]`"
                          v-model="item.Statement" :rules="emptyRules"></v-text-field></v-col>
                    </v-row>
                    <v-btn @click="addArrEvent(list.SkinDamages)" class="error">新增皮膚損傷</v-btn>
                  </div>
                </div>

                <div class="subZone">
                  <v-select :items="YnItems" label="是否發生身體約束" v-model="list.IsRestraint" :rules="emptyRules"></v-select>
                  <div v-if="list.IsRestraint == '是'">
                    <div v-for="item, index in list.Restraints" :key="index" class="d-flex gap-5">
                      <v-icon @click="delArrEvent(list.Restraints, index)" color="red">mdi-close</v-icon>
                      <v-row>
                        <v-col cols="12" md="2"><v-text-field type="date" label="發生日期" v-model="item.Date"
                            :rules="emptyRules"></v-text-field></v-col>
                        <v-col cols="12" md="2"><v-select :items="timeItems" label="發生時間" v-model="item.Time"
                            :rules="emptyRules"></v-select></v-col>
                        <v-col cols="12" md="8"><v-text-field :label="`發生原因(100字內) [目前字數：${item.Statement.length}]`"
                            v-model="item.Statement" :rules="emptyRules"></v-text-field></v-col>
                      </v-row>

                    </div>
                    <v-btn @click="addArrEvent(list.Restraints)" class="error">新增身體約束</v-btn>
                  </div>
                </div>

                <div class="subZone">
                  <v-select :items="YnItems" label="是否發生感染" v-model="list.IsEmergency" :rules="emptyRules"></v-select>
                  <div v-if="list.IsEmergency == '是'">
                    <v-row v-for="item, index in list.Emergencys" :key="index">
                      <v-col cols="12" md="6">
                        <div class="d-flex">
                          <v-icon @click="delArrEvent(list.Emergencys, index)" color="red">mdi-close</v-icon>
                          <v-select item-text="Value" :items="EmergencysItems" label="發生類型" v-model="item.Kind"
                            :rules="emptyObjRules" return-object @change="handleKindChange($event, item)"></v-select>
                          <v-text-field v-if="item.Kind.Value == '其他'" class="ml-2" label="發生類型其他說明"
                            v-model="item.Kind.Other" :rules="emptyRules"></v-text-field>
                        </div>
                      </v-col>
                      <v-col cols="12" md="3"><v-text-field type="date" label="發生日期" v-model="item.Date"
                          :rules="emptyRules"></v-text-field></v-col>
                      <v-col cols="12" md="3"><v-select :items="timeItems" label="發生時間" v-model="item.Time"
                          :rules="emptyRules"></v-select></v-col>
                      <v-col cols="12"><v-text-field :label="`發生原因(100字內) [目前字數：${item.Statement.length}]`"
                          v-model="item.Statement" :rules="emptyRules"></v-text-field></v-col>
                    </v-row>
                    <v-btn @click="addArrEvent(list.Emergencys)" class="error">新增感染</v-btn>
                  </div>
                </div>

                <div class="subZone">
                  <v-select :items="YnItems" label="是否發生非計畫性住院*(不在計畫中之住院，或非預期性的疾病變化而住院)" v-model="list.IsUnplanned"
                    :rules="emptyRules"></v-select>
                  <div v-if="list.IsUnplanned == '是'">
                    <v-row v-for="item, index in list.Unplanneds" :key="index">
                      <v-col cols="12" md="6">
                        <div class="d-flex">
                          <v-icon @click="delArrEvent(list.Unplanneds, index)" color="red">mdi-close</v-icon>
                          <v-select item-text="Value" :items="UnplannedsItems" label="發生類型" v-model="item.Kind"
                            :rules="emptyObjRules" return-object @change="handleKindChange($event, item)"></v-select>
                          <v-text-field v-if="item.Kind.Value == '其他'" class="ml-2" label="發生類型其他說明"
                            v-model="item.Kind.Other" :rules="emptyRules"></v-text-field>
                        </div>
                      </v-col>
                      <v-col cols="12" md="3"><v-text-field type="date" label="發生日期" v-model="item.Date"
                          :rules="emptyRules"></v-text-field></v-col>
                      <v-col cols="12" md="3"><v-select :items="timeItems" label="發生時間" v-model="item.Time"
                          :rules="emptyRules"></v-select></v-col>
                      <v-col cols="12"><v-text-field :label="`發生原因(100字內) [目前字數：${item.Statement.length}]`"
                          v-model="item.Statement" :rules="emptyRules"></v-text-field></v-col>
                    </v-row>
                    <v-btn @click="addArrEvent(list.Unplanneds)" class="error">新增非計畫性住院</v-btn>

                  </div>
                </div>


              </div>
            </div>


            <div class="spaceStyle mt-2">
              <div class="bannerStyle">緊急事件紀錄</div>
              <div class="px-2">
                <v-select :items="YnItems" label="是否發生緊急事件" v-model="list.IsEmergencyEvents"
                  :rules="emptyRules"></v-select>
                <div v-if="list.IsEmergencyEvents == '是'">
                  <v-row v-for="item, index in list.EmergencyEvents" :key="index">
                    <v-col cols="12" md="6">
                      <div class="d-flex">
                        <v-icon @click="delArrEvent(list.EmergencyEvents, index)" color="red">mdi-close</v-icon>
                        <v-select item-text="Value" :items="EmergencyEventsItems" label="發生類型"
                          v-model="item.EmergencyType" :rules="emptyObjRules" return-object></v-select>
                        <v-text-field v-if="item.EmergencyType.Value == '其他'" class="ml-2" label="發生類型其他說明"
                          v-model="item.EmergencyType.Other" :rules="emptyRules"></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3"><v-text-field type="date" label="發生日期" v-model="item.Date"
                        :rules="emptyRules"></v-text-field></v-col>
                    <v-col cols="12" md="3"><v-select :items="timeItems" label="發生時間" v-model="item.Time"
                        :rules="emptyRules"></v-select></v-col>
                    <v-col cols="12">
                      <v-text-field :label="`發生原因(100字內) [目前字數：${item.Reason.length}]`" v-model="item.Reason"
                        :rules="emptyRules"></v-text-field>
                      <v-text-field label="事件敘述" v-model="item.Description" :rules="emptyRules"></v-text-field>
                      <v-text-field label="事件通報及處理過程" v-model="item.Process" :rules="emptyRules"></v-text-field>
                      <v-text-field label="事件檢討紀錄" v-model="item.Report" :rules="emptyRules"></v-text-field>

                    </v-col>
                  </v-row>
                  <v-btn @click="addEmergencyEvents(list.EmergencyEvents)" class="error">新增緊急事件</v-btn>
                </div>
              </div>
            </div>


            <div class="spaceStyle mt-2">
              <div class="bannerStyle">照護紀錄</div>
              <div class="px-2">
                <v-textarea auto-grow v-model="list.Statement"></v-textarea>
              </div>
            </div>

          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="primary" @click="addOK" v-if="processType == 'add'" :loading="loading"
            :disabled="loading">確認新增</v-btn>
          <v-btn class="success" @click="editOK" v-if="processType == 'edit'" :loading="loading"
            :disabled="loading">確認修改</v-btn>
        </v-card-actions>
        <!-- <pre>{{ this.$store.state.pData }}</pre>  -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import citys from "@/assets/json/citys.json"; //引入郵遞區號的json檔

export default {
  props: ['useDataBase', 'items'],  //本表單使用的主要資料庫;用於讀取,新增,修改,刪除时指定的資料庫名
  data() {
    return {
      dialog: false,
      list: {}, //表單內資料
      processType: "", //存放頁面執行是add新增或edit修改
      title: "",
      titleStyle: "",
      emptyRules: [(v) => !!v || "不可空白"],
      emptyObjRules: [v => Boolean(Object.keys(v || {})[0]) || "不可空白"],
      loading: false,

      // RecordSourceItems: ["家訪", "電訪", "其他(含家屬主動通知、鄰居告知等)"],
      // LiveItems: ["在宅(居家)", "養護機構/長照機構", "護理之家", "其他"],
      // UseResourcesItems: ["健保第一類", "健保第二類", "健保第三類", "健保第四類", "健保安寧居家", "健保呼吸器依賴", "健保其他", "長照 2.0", "自費"],
      // ServiceItems: ["氣切護理", "留置導尿管護理", "留置鼻胃管護理", "膀胱灌洗", "三/四期壓力性損傷傷口護理", "大量液體點滴注射", "造口護理", "安寧居家訪視", "長照 2.0 服務 A 碼", "長照 2.0 服務 B 碼", "長照 2.0 服務 C 碼", "其他(如自費、關懷據點、公衛業務)"],
      YnItems: ['是', '否'],
      timeItems: ["大夜（00：00～08：00）", "白天（08：00～16：00）", "小夜（16：00～24：00）"],
      UnplannedItems: [
        { Value: "心血管代償機能減退", "Other": null },
        { Value: "骨折之治療或評估", "Other": null },
        { Value: "腸胃道出血", "Other": null },
        { Value: "呼吸系統", "Other": null },
        { Value: "呼吸系統", "Other": null },
        { Value: "呼吸系統", "Other": null },
        { Value: "其他", "Other": null },
      ],
      SkinDamagesItems: [
        { Value: "一般性傷口", "Other": null },
        { Value: "壓力性損傷", "Other": null },
        { Value: "失禁性皮膚炎", "Other": null },
        { Value: "撕膠皮膚損傷", "Other": null },
        { Value: "其他", "Other": null }
      ],
      EmergencysItems: [
        { Value: "呼吸道感染", "Other": null },
        { Value: "泌尿道感染", "Other": null },
        { Value: "疥瘡感染", "Other": null },
        { Value: "其他", "Other": null },
      ],
      UnplannedsItems: [
        { Value: "心血管代償機能減退", "Other": null },
        { Value: "骨折之治療或評估", "Other": null },
        { Value: "腸胃道出血", "Other": null },
        { Value: "感染", "Other": null },
        { Value: "呼吸系統", "Other": null },
        { Value: "其他", "Other": null },
      ],

      EmergencyEventsItems: [
        { Value: "管路滑脫", "Other": null },
        { Value: "生命徵象惡化", "Other": null },
        { Value: "自殺", "Other": null },
        { Value: "藥物", "Other": null },
        { Value: "暴力", "Other": null },
        { Value: "跌倒", "Other": null },
        { Value: "哽嗆", "Other": null },
        { Value: "其他", "Other": null },
      ]
    }
  },

  computed: {
    //bmi值計算 -> 新增時要寫入資料庫裡.對應的值是list.bmi
    bmiValue() {
      if (this.list.Height && this.list.Weight) {
        let heightVal = this.list.Height / 100
        return (this.list.Weight / (heightVal * heightVal)).toFixed(1)
      } else {
        return ''
      }
    },
    CitysItems() {
      return citys.citys;
    },
    //依選擇的縣市回傳鄉鎮市區
    returnZones() {
      if (this.list.City) {
        return citys.zones.filter(i => i.includes(this.list.City)).map(i => i.replace(this.list.City, ''))
      }
    },
  },

  methods: {
    handleKindChange(selectedValue, item) {
      // 創建新的對象副本
      item.Kind = {
        Value: selectedValue.Value,
        Other: selectedValue.Other
      };
    },

    //新增事件
    addArrEvent(arr) {
      arr.push({
        "Date": "",
        "Time": "",
        "Kind": {},
        "Statement": ""
      })
    },

    //刪除皮膚損傷/緊急事件紀錄; 2024.12.18 改為通用型
    delArrEvent(Arr, index) {
      this.$confirm("確認刪除?").then((res) => {
        if (res) {
          Arr.splice(index, 1);
          var pop = { msg: "已刪除;未執行新增/修改前,記錄將不會保存", type: true, theme: "success" };
          this.$store.commit("snackbar", pop);
        }
      });
    },


    addEmergencyEvents(Arr) {
      Arr.push({
        "EmergencyType": "",
        "Date": "",
        "Time": "",
        "Reason": "",
        "Description": "",
        "Process": "",
        "Report": "",
        "CreateID": this.$store.state.pData.idNum ? this.$store.state.pData.idNum : "DMSTEST01"
      })
    },

    addProcess() {
      this.processType = "add";
      this.title = "新增資料";
      this.titleStyle = "font-weight-black error lighten-2";
      this.list = {
        FallDowns: [
          {
            "Date": "",
            "Time": "",
            "Kind": null,
            "Statement": ""
          }
        ],
        SkinDamages: [
          {
            "Date": "",
            "Time": "",
            "Kind": "",
            "Statement": ""
          }
        ],
        Restraints: [
          {
            "Date": "",
            "Time": "",
            "Kind": null,
            "Statement": ""
          }
        ],
        Emergencys: [
          {
            "Date": "",
            "Time": "",
            "Kind": "",
            "Statement": ""
          }
        ],
        Unplanneds: [
          {
            "Date": "",
            "Time": "",
            "Kind": "",
            "Statement": ""
          }
        ],

        EmergencyEvents: [
          {
            "EmergencyType": "",
            "Date": "",
            "Time": "",
            "Reason": "",
            "Description": "",
            "Process": "",
            "Report": "",
            "CreateID": this.$store.state.pData.idNum ? this.$store.state.pData.idNum : "DMSTEST01"
          }
        ]
      };
      if (this.items.length) {
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
        this.list.create_man_snkey = this.$store.state.pData.snkey;
        this.list.bmi = this.bmiValue;

        var postData = {
          datalist: JSON.stringify(this.list)
        };
        this.loading = true;
        this.$api.add(this.useDataBase, postData)
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
        if (!this.list.edit_man) { this.list.edit_man = '' }
        this.list.edit_man = this.$store.state.pData.username + "(" + dayjs().format("YYYY-MM-DD HH:mm:ss") + ")" + this.list.edit_man;
        this.list.bmi = this.bmiValue;

        let postData = {
          snkey: this.list.snkey,
          datalist: JSON.stringify(this.list),
          edit_man: 'pass'
        };

        this.loading = true;
        this.$api.post(this.useDataBase, postData)
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


<style>
.subZone {
  margin-top: 5px;
  border: 1px solid lightskyblue;
  padding: 5px;
  border-radius: 5px;
  background-color: lightgrey
}
</style>