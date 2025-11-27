<template>
  <div class="CareSummaryPlanList">
    <v-card class="mt-2">
      <v-card-title>
        <v-row>
          <v-col cols="12" md="8">
            <h2 class="subheading grey--text">
              <v-icon class="mx-1">fas fa-file-alt</v-icon>
              <span>
                {{ this.$store.state.uData.p_code }} /
                {{ this.$store.state.uData.name }}
              </span>
              <span>需求摘要&照護計畫</span>
            </h2>
          </v-col>
          <v-col cols="12" md="4">
            <!-- 功能表 -->
            <v-toolbar dense rounded>
              <v-text-field hide-details prepend-icon="mdi-magnify" single-line label="搜尋"
                v-model="searchKey"></v-text-field>

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
                        <th></th>
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
                          <v-menu transition="scale-transition" offset-y>
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
    <!-- <pre>

        {{items}}
    </pre> -->
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
      useDataBase: 'casesummaryplan',
      items: [], //目前讀取進來的資料庫
      searchKey: "",
      itemsPerPageOptions: [10, 20, 30],
      itemsPerPage: 10,
    };
  },

  computed: {
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
        this.items = rs
          .map((i) => {
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
        var postData = {
          snkey: delData.snkey,
          tablename: this.useDataBase,
          info: JSON.stringify(delData),
        };

        if (res) {
          this.$api.delete(postData.tablename, postData).then((rs) => {
            if (rs.state == 1) {
              var pop = { msg: "已刪除", type: true, theme: "success" };
              this.$store.commit("snackbar", pop);
              this.getAllData();
            }
          });
        }
      });
    },
    //上傳資料到衛福部 -> 紀錄成功的ticket
    async pushToMOHW(postItem) {
      //判斷是否未評估任何一筆資料
      let match = postItem.Questions.filter(i => i.checked)
      if (match.length == 0) {
        var pop = { msg: "未評估任何一筆資料!!請重新確認", type: true, theme: "warning" };
        this.$store.commit("snackbar", pop);
        return false
      }

      const res = await this.$confirm('確認上傳資料到衛福部?');
      if (res) {
        /* 這裡處理是需求摘要&照護計畫 
          1.先處理需求摘要 -> 第四個參數 'CaseSummary' 為 照護紀錄的api
          2.處理照護計畫 -> 第四個參數 'CarePlan' 為 照護紀錄的api
        */
        let jsonfile = JSON.stringify(this.dataToJson_CaseSummary(postItem))
        // console.log('CaseSummary', jsonfile)
        await mohwFn.pushToMOHW(postItem, this.useDataBase, jsonfile, 'CaseSummary')
        
        // console.log('CaseSummaryRS',CaseSummaryRS)
        // .then(rs=>{ if (rs){ 
        // this.getAllData() 
        // }})

        jsonfile = JSON.stringify(this.dataToJson_CarePlan(postItem))
        // console.log('CarePlan:', jsonfile)
        await mohwFn.pushToMOHW(postItem, this.useDataBase, jsonfile, 'CarePlan')
          .then(rs => { if (rs) { this.getAllData() } })
      }
    },
    //判斷上傳到衛福部的狀態
    checkMOHWData(postItem) {
      mohwFn.checkMOHWData(postItem, this.useDataBase, 'CarePlan')
        .then(rs => {
          console.log('checkMOHWData rs', rs)
          if (rs) { this.getAllData() }
        })
    },

    //資料轉成適合的JSON檔-需求摘要部分
    dataToJson_CaseSummary(postItem) {
      //2025.2.4 統一改為由 mohwFn 來處理
      let postData = [postItem];
      let finalPostData = mohwFn.returnCaseSummaryJSON(postData, this.$store.state.uData)

      return {
        DataList: finalPostData
      };
      
      // //建構回傳的資料基本架構
      // let finalData = {
      //   DataList: []
      // }
      // finalData.DataList.push(finalObj)
      // return finalData;
      // let DataList = []
      // let match = postItem.Questions.filter(i => i.checked)

      // //判斷護理人員身分證字號 ;不存在時先用預設值
      // let findNurse = this.$store.state.personnelItems.find(
      //   (i) => i.snkey == postItem.create_man_snkey
      // );

      // if (findNurse && findNurse.idNum) {
      //   findNurse = findNurse.idNum;
      // } else {
      //   findNurse = "N223456789";
      // }

      // match.forEach(i => {
      //   DataList.push({
      //     "CaseID": this.$store.state.uData.id_num,
      //     "EndDate": this.$store.state.uData.in_date,
      //     "Date": postItem.Date,
      //     "Summary": {
      //       "QuestionType": i.QuestionType,
      //       "Question": i.Question,
      //       "Answer": i.Answer ? i.Answer : null
      //     },
      //     "NurseID": findNurse
      //   })
      // });

      // return {
      //   DataList: DataList
      // };
    },
    //資料轉成適合的JSON檔-照護計畫部分
    dataToJson_CarePlan(postItem) {
      //2025.2.4 統一改為由 mohwFn 來處理
      let postData = [postItem];
      let finalPostData = mohwFn.returnCarePlanJSON(postData, this.$store.state.uData)

      return {
        DataList: finalPostData
      };

      // let match = postItem.Questions.filter(i => i.checked)

      // //判斷護理人員身分證字號 ;不存在時先用預設值
      // let findNurse = this.$store.state.personnelItems.find(
      //   (i) => i.snkey == postItem.create_man_snkey
      // );

      // if (findNurse && findNurse.idNum) {
      //   findNurse = findNurse.idNum;
      // } else {
      //   findNurse = "N223456789";
      // }

      // let Targets = []
      // let Measures = []
      // let Evaluations = []
      // match.forEach(item => {
      //   Targets.push({
      //     "CaseID": this.$store.state.uData.id_num,
      //     "EndDate": this.$store.state.uData.in_date,
      //     "SummaryCreateDate": postItem.Date,
      //     "Summary": item.Question,
      //     "SummaryAnswer": item.Answer, //2024.6.13 加入備註
      //     "TargetCreateDate": item.TargetCreateDate ? item.TargetCreateDate : postItem.Date,
      //     "TargetStatement": item.TargetStatement,
      //     "TargetStatement2": item.TargetStatement2,
      //     "EstimatedDate": item.EstimatedDate,
      //     "IsMainTarget": item.IsMainTarget ? item.IsMainTarget : false,
      //     "NurseID": findNurse
      //   })

      //   item.MeasureContent.forEach((Mitem) => {
      //     Measures.push({
      //       "CaseID": this.$store.state.uData.id_num,
      //       "EndDate": this.$store.state.uData.in_date,
      //       "SummaryCreateDate": postItem.Date,
      //       "Summary": item.Question,
      //       "SummaryAnswer": item.Answer, //2024.6.13 加入備註
      //       "TargetStatement": item.TargetStatement,
      //       "MeasureCreateDate": Mitem.MeasureCreateDate ? Mitem.MeasureCreateDate : postItem.Date,
      //       "MeasureContent": Mitem.content,
      //       "NurseID": findNurse
      //     })
      //   })

      //   item.EvaluationContent.forEach((Mitem) => {
      //     Evaluations.push({
      //       "CaseID": this.$store.state.uData.id_num,
      //       "EndDate": this.$store.state.uData.in_date,
      //       "SummaryCreateDate": postItem.Date,
      //       "Summary": item.Question,
      //       "SummaryAnswer": item.Answer, //2024.6.13 加入備註
      //       "TargetStatement": item.TargetStatement,
      //       "EvaluationContent": Mitem.content,
      //       "EvaluationDate": Mitem.date,
      //       "EvaluationTime": Mitem.time,
      //       "NurseID": findNurse
      //     })
      //   })


      // })

      // return {
      //   DataList: {
      //     "Targets": Targets,
      //     "Measures": Measures,
      //     "Evaluations": Evaluations
      //   }
      // };
    },

    //回覆回傳後的時間
    returnState(item) {
      let data = JSON.parse(item.uploadState.data)
      return dayjs(data[0].log_date).format("YYYY-MM-DD HH:mm:ss");
    }
  },
};
</script>

<style lang="scss">
.CareSummaryPlanList {
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