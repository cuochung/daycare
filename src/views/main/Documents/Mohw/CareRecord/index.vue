<template>
  <div class="CareRecordList">
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
              <span>照護紀錄</span>
            </h2>
          </v-col>
          <v-col cols="12" md="6">
            <!-- 功能表 -->
            <v-toolbar dense rounded>
              <v-btn class="success" small v-model="isPrintSelect" @click="isPrintSelect = !isPrintSelect">列印模式</v-btn>
              <v-btn v-if="isPrintSelect && printCheckedCounts.length" class="primary ml-2" small
                @click="printConfirm()">
                <v-icon class="mr-1">mdi-printer</v-icon>
                確認列印
              </v-btn>

              <v-text-field hide-details prepend-icon="mdi-magnify" single-line label="搜尋" v-model="searchKey"
                class="ml-2"></v-text-field>

              <popupadd ref="childFn" @getAllData="getAllData" :useDataBase="useDataBase" :items="items"></popupadd>
            </v-toolbar>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-card class="mt-2" :color="$store.state.colorSet.bgColor1">
          <v-card-text>
            <!-- 表單內容 -->
            <v-data-iterator :items="searchfilter" :items-per-page.sync="itemsPerPage"
              :footer-props="{ itemsPerPageOptions }">
              <template v-slot:default="props">
                <v-simple-table fixed-header class="mt-2 text-no-wrap">
                  <template v-slot:default>
                    <thead style="background-color: #e3f2fd">
                      <tr>
                        <th><span v-if="isPrintSelect">列印選擇({{ printCheckedCounts.length }})</span></th>
                        <th>上傳紀錄</th>
                        <th>評估日期</th>

                        <th v-if="$store.state.cData.isShowCreaterName">紀錄人姓名</th>
                        <th v-if="$store.state.cData.isShowCreaterInfo">紀錄人紀錄</th>
                        <th v-if="$store.state.cData.isShowEditerInfo">修改紀錄</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in props.items" :key="index">
                        <td>
                          <v-checkbox v-if="isPrintSelect" v-model="item.printChecked" class="ma-0 pt-2"
                            hide-details></v-checkbox>
                          <v-menu v-else transition="scale-transition" offset-y>
                            <template v-slot:activator="{ on }">
                              <v-btn color="primary" dark v-on="on">功能</v-btn>
                            </template>
                            <v-list>
                              <v-list-item @click="edit(item)">
                                <v-list-item-title>修改</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="del(item)">
                                <v-list-item-title>刪除</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="pushToMOHW(item)">
                                <v-list-item-title>上傳衛福部</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="checkMOHWData(item)" v-if="item.uploadData">
                                <v-list-item-title>確認上傳資料狀況</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </td>
                        <td>
                          <div v-if="!item.uploadData">
                            <span>未上傳</span>
                          </div>
                          <div v-else>
                            <span>已上傳</span>
                            <span v-if="!item.uploadState">(未確認)</span>
                            <span v-if="item.uploadState">(已確認-{{ returnState(item) }})</span>
                          </div>
                        </td>
                        <td>{{ item.Date }}</td>

                        <td v-if="$store.state.cData.isShowCreaterName">{{(item.create_man).split('(')[0]}}</td>
                        <td v-if="$store.state.cData.isShowCreaterInfo">{{item.create_man}}</td>
                        <td v-if="$store.state.cData.isShowEditerInfo" class="text-truncate" style="max-width: 400px;">{{ item.edit_man }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
            </v-data-iterator>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
    <!-- {{items}} -->
  </div>
</template>

<script>
import popupadd from "./Add";
import dayjs from "dayjs";
import mohwFn from '@/assets/js/mohwFn'

export default {
  components: { popupadd },
  data() {
    return {
      useDataBase: 'carerecord',

      items: [], //目前讀取進來的資料庫
      searchKey: "",
      itemsPerPageOptions: [10, 20, 30],
      itemsPerPage: 10,

      isPrintSelect: false, //列印模式
    };
  },

  computed: {
    //已選擇列印項目
    printCheckedCounts() {
      return this.searchfilter.filter(i => i.printChecked)
    },
    searchfilter() {
      var keys = this.searchKey.split(" ");
      var str = "";
      return keys.reduce(function (prev, element) {
        return prev.filter((item) => {
          str = JSON.stringify(item).toUpperCase();
          if (str.includes(element.toUpperCase())) {
            return item;
          }
        });
      }, this.items);
    },
  },

  mounted() {
    this.getAllData();
  },

  methods: {
    getAllData() {
      //取得指定病歷的資料
      this.$api.get(this.useDataBase).then((rs) => {
        this.items = rs.map((i) => {
          return {
            ...JSON.parse(i.datalist),
            snkey: i.snkey,
          };
        })
          .filter((i) => i.user_snkey == this.$store.state.uData.snkey)
          .sort((a, b) => a.Date < b.Date ? 1 : -1);
      });
    },
    edit(item) {
      //修改功能
      this.$refs.childFn.editProcess(item);
    },
    del(delData) {
      //刪除功能
      this.$confirm("確認刪除?").then((res) => {
        delData.delman =
          this.$store.state.pData.username +
          "(" +
          dayjs().format("YYYY-MM-DD HH:mm:ss") +
          ")";
        let postData = {
          snkey: delData.snkey,
          tablename: this.useDataBase,
          info: JSON.stringify(delData),
        };

        if (res) {
          this.$api.delete(postData.tablename, postData).then((rs) => {
            if (rs.state == 1) {
              let pop = { msg: "已刪除", type: true, theme: "success" };
              this.$store.commit("snackbar", pop);
              this.getAllData();
            }
          });
        }
      });
    },
    //上傳資料到衛福部 -> 紀錄成功的ticket
    async pushToMOHW(postItem) {
      const res = await this.$confirm('確認上傳資料到衛福部?');
      if (res) {
        // 第四個參數 'CareRecord' 為 照護紀錄的api
        let jsonfile = JSON.stringify(this.dataToJson(postItem))

        mohwFn.pushToMOHW(postItem, this.useDataBase, jsonfile, 'CareRecord')
          .then(rs => {
            if (rs) { this.getAllData() }
          })
      }
    },
    //判斷上傳到衛福部的狀態
    checkMOHWData(postItem) {
      mohwFn.checkMOHWData(postItem, this.useDataBase, 'CareRecord')
        .then(rs => {
          console.log('rs', rs)
          if (rs) { this.getAllData() }
        })
    },
    //資料轉成適合的JSON檔
    dataToJson(postItem) {
      let postData = [postItem];
      let finalPostData = mohwFn.returnCareRecordJSON(postData, this.$store.state.uData)

      return {
        DataList: finalPostData
      };

      // let finalPostData = {
      //   "CaseID": this.$store.state.uData.id_num,
      //   "EndDate": this.$store.state.uData.in_date,
      //   "Date": postItem.Date,
      //   "Time": postItem.Time,
      //   "Time2": postItem.Time2,
      //   "Height": postItem.Height,
      //   "Weight": postItem.Weight,
      //   "BMI": postItem.bmi,

      //   "Statement": postItem.Statement,
      //   "FJMEvaluation": "未評估"
      // }

      // //判斷護理人員身分證字號 ;不存在時先用預設值
      // let findNurse = this.$store.state.personnelItems.find(
      //   (i) => i.snkey == postItem.create_man_snkey
      // );

      // if (findNurse && findNurse.idNum) {
      //   finalPostData.NurseID = findNurse.idNum;
      // } else {
      //   finalPostData.NurseID = "N223456789";
      // }


      // //跌倒判斷
      // finalPostData.IsFallDown = postItem.IsFallDown
      // if (postItem.IsFallDown == '是') {
      //   finalPostData.FallDowns = postItem.FallDowns
      // }
      // //皮膚損傷判斷
      // finalPostData.IsSkinDamages = postItem.IsSkinDamages
      // if (postItem.IsSkinDamages == '是') {
      //   finalPostData.SkinDamages = postItem.SkinDamages
      // }
      // //身體約束判斷
      // finalPostData.IsRestraint = postItem.IsRestraint
      // if (postItem.IsRestraint == '是') {
      //   finalPostData.Restraints = postItem.Restraints
      // }
      // //感染判斷
      // finalPostData.IsEmergency = postItem.IsEmergency
      // if (postItem.IsEmergency == '是') {
      //   finalPostData.Emergency = postItem.Emergencys
      // }
      // //非計畫性住院判斷
      // finalPostData.IsUnplanned = postItem.IsUnplanned
      // if (postItem.IsUnplanned == '是') {
      //   finalPostData.Unplanned = postItem.Unplanneds
      // }

      // //緊急事件紀錄判斷
      // finalPostData.IsEmergencyEvents = postItem.IsEmergencyEvents
      // if (postItem.IsEmergencyEvents == '是') {
      //   finalPostData.EmergencyEvents = postItem.EmergencyEvents
      // }
      // // console.log(JSON.stringify(finalPostData))
      // return {
      //   DataList: [finalPostData]
      // };
    },
    //回覆回傳後的時間
    returnState(item) {
      let data = JSON.parse(item.uploadState.data)
      return dayjs(data[0].log_date).format("YYYY-MM-DD HH:mm:ss");
    },
    //確認列印
    printConfirm() {
      this.$confirm("確認顯示列印畫面?").then(res => {
        if (res) {
          let printData = {
            data: this.printCheckedCounts
          }
          //送出資料到列印頁面
          let routeData = this.$router.resolve({ path: "/print/carerecordprint", query: { data: JSON.stringify(printData) } });
          window.open(routeData.href, "_blank");
        }
      })
    },
  },
};
</script>

<style lang="scss">
.CareRecordList {
  h2 {
    span {
      vertical-align: middle;
    }
  }

  thead {
    th {
      font-size: 1.2rem;
    }
  }

  tbody {
    td {
      font-size: 1rem;
    }
  }
}
</style>