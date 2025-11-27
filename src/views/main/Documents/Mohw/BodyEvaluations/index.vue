<template>
  <div class="BodyEvaluationsList">
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
              <span>身體評估評估表</span>
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
        <v-card class="mt-2">
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
    <!-- {{items}} -->
  </div>
</template>

<script>
import popupadd from "@/views/document/mohw/BodyEvaluations/Add";
import dayjs from "dayjs";
import mohwFn from '@/assets/js/mohwFn'

export default {
  components: { popupadd },
  data() {
    return {
      useDataBase: 'bodyevaluations',
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
      this.$api.options(
        "general/getAll/" + this.$store.state.databaseName + "/" + this.useDataBase
      ).then((rs) => {
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
          this.$api.options(
            "general/delv3/" +
            this.$store.state.databaseName +
            "/" +
            postData.tablename,
            postData
          ).then((rs) => {
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
      // console.log(this.dataToJson(postItem)); return false;

      const res = await this.$confirm('確認上傳資料到衛福部?');
      if (res) {
        mohwFn.pushToMOHW(postItem, this.useDataBase, JSON.stringify(this.dataToJson(postItem)))
          .then(rs => {
            if (rs) { this.getAllData() }
          })
      }
    },
    //判斷上傳到衛福部的狀態
    checkMOHWData(postItem) {
      mohwFn.checkMOHWData(postItem, this.useDataBase)
        .then(rs => { if (rs) { this.getAllData() } })
    },
    //資料轉成適合的JSON檔；
    // 2025.2.2 調整資料內容為直接把資料建構成 衛福部要求的 json格式內容
    dataToJson(postItem) {
      // console.log('postItem',postItem);return false;
      //判斷護理人員身分證字號 ;不存在時先用預設值
      // let findNurse = this.$store.state.personnelItems.find(
      //   (i) => i.snkey == postItem.create_man_snkey
      // );

      // let finalPostData = {}
      // finalPostData.Date = postItem.Date;
      // if (findNurse && findNurse.idNum) {
      //   finalPostData.NurseID = findNurse.idNum;
      // } else {
      //   finalPostData.NurseID = "N223456789";
      // }
      // finalPostData.AssessmentNo = this.items.length; //目前資料筆數

      // 取得資料的 text
      // function returnvText(val) {
      //   let str = ""
      //   val.forEach((item, index) => {
      //     if (index > 0) { str += ',' }
      //     str += item.text;
      //   })
      //   return str;
      // }
      // // 取得疫苗的種類
      // function returnVaccineKind(val) {
      //   let str = ""
      //   val.forEach((item) => {
      //     if (item.selected) {
      //       if (str.length > 0) { str += ',' }
      //       str += item.kind;
      //     }
      //   })
      //   return str;
      // }
      // // 取得疫苗的年份或記不記得
      // function returnVaccineYearForget(val) {
      //   let str = ""
      //   val.forEach((item) => {
      //     if (item.selected) {
      //       if (str.length > 0) { str += ',' }
      //       str += item.forget ? '不記得' : item.year;
      //     }
      //   })
      //   return str;
      // }

      // finalPostData.BodyQuestions = [
      //   {
      //     "Question": "睜眼",
      //     "Answer": postItem.mind1.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "語言",
      //     "Answer": postItem.mind2.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "運動",
      //     "Answer": postItem.mind3.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   //視力
      //   {
      //     "Question": "視力",
      //     "Answer": postItem.vision1.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "視力-部位",
      //     "Answer": postItem.vision2 ? returnvText(postItem.vision2) : "",
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "視力-影響日常活動",
      //     "Answer": postItem.vision1.text == '有障礙' ? postItem.vision3.text : '',
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "視力-輔具",
      //     "Answer": postItem.vision1.text == '有障礙' ? postItem.vision4.text : '',
      //     "MultipleAnswer": postItem.vision1.text == '有障礙' && postItem.vision4.text ? postItem.vision4.MultipleAnswer.toString() : "",
      //     "Other": postItem.vision1.text == '有障礙' && postItem.vision4.text && postItem.vision4.MultipleAnswer.includes('其他') ? postItem.vision4.Other : ""
      //   },
      //   //聽力
      //   {
      //     "Question": "聽力",
      //     "Answer": postItem.hearing1.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "聽力-部位",
      //     "Answer": postItem.hearing2 ? returnvText(postItem.hearing2) : "",
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "聽力-影響日常活動",
      //     "Answer": postItem.hearing1.text == '有障礙' ? postItem.hearing3.text : '',
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "聽力-輔具",
      //     "Answer": postItem.hearing1.text == '有障礙' ? postItem.hearing4.text : '',
      //     "MultipleAnswer": postItem.hearing1.text == '有障礙' && postItem.hearing4.text ? postItem.hearing4.MultipleAnswer.toString() : "",
      //     "Other": postItem.hearing1.text == '有障礙' && postItem.hearing4.text && postItem.hearing4.MultipleAnswer.includes('其他') ? postItem.hearing4.Other : ""
      //   },
      //   //溝通
      //   {
      //     "Question": "溝通",
      //     "Answer": postItem.communicate1.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "溝通-影響日常活動",
      //     "Answer": postItem.communicate1.text == '有障礙' ? postItem.communicate2.text : '',
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "說話",
      //     "Answer": postItem.communicate1.text == '有障礙' ? postItem.communicate3.text : '',
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "理解",
      //     "Answer": postItem.communicate1.text == '有障礙' ? postItem.communicate4.text : '',
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   //口腔
      //   {
      //     "Question": "口腔外觀",
      //     "Answer": postItem.oralCavity1.text,
      //     "MultipleAnswer": postItem.oralCavity1.text == '異常' ? postItem.oralCavity1.MultipleAnswer.toString() : "",
      //     "Other": postItem.oralCavity1.text == '異常' && postItem.oralCavity1.MultipleAnswer.includes('其他') ? postItem.oralCavity1.Other : ""
      //   },
      //   {
      //     "Question": "特殊進食",
      //     "Answer": postItem.oralCavity2.text,
      //     "MultipleAnswer": postItem.oralCavity2.text == '有' ? postItem.oralCavity2.MultipleAnswer.toString() : "",
      //     "Other": postItem.oralCavity2.text == '有' && postItem.oralCavity2.MultipleAnswer.includes('特殊種類') ? postItem.oralCavity2.Other : ""
      //   },
      //   {
      //     "Question": "假牙狀況",
      //     "Answer": postItem.oralCavity3.text,
      //     "MultipleAnswer": postItem.oralCavity3.text == '有活動假牙' ? postItem.oralCavity3.MultipleAnswer.toString() : "",
      //     "Other": postItem.oralCavity3.text == '有活動假牙' && postItem.oralCavity3.MultipleAnswer.includes('其他') ? postItem.oralCavity3.Other : ""
      //   },
      //   {
      //     "Question": "備有個人口腔清潔工具",
      //     "Answer": postItem.oralCavity4.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {

      //     "Question": "備有個人口腔清潔工具-有自然牙、固定或活動假牙者",
      //     "Answer": "",
      //     "MultipleAnswer": postItem.oralCavity5MultipleAnswer ? postItem.oralCavity5MultipleAnswer.toString() : "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "備有個人口腔清潔工具-配戴活動假牙者",
      //     "Answer": "",
      //     "MultipleAnswer": postItem.oralCavity6MultipleAnswer ? postItem.oralCavity6MultipleAnswer.toString() : "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "備有個人口腔清潔工具-全口無牙且無活動假牙者",
      //     "Answer": "",
      //     "MultipleAnswer": postItem.oralCavity7MultipleAnswer ? postItem.oralCavity7MultipleAnswer.toString() : "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "口腔保健情形",
      //     "Answer": "平均每日執行飯後、睡前口腔清潔工作",
      //     "MultipleAnswer": postItem.oralCavity8MultipleAnswer.toString(),
      //     "Other": ""
      //   },
      //   //胃腸
      //   {
      //     "Question": "腹部狀態",
      //     "Answer": postItem.Gastrointestinal1.text,
      //     "MultipleAnswer": "",
      //     "Other": postItem.Gastrointestinal1.text == '其他' ? postItem.Gastrointestinal1.Other : ""
      //   },
      //   {
      //     "Question": "腸蠕動",
      //     "Answer": postItem.Gastrointestinal2.text,
      //     "MultipleAnswer": "",
      //     "Other": postItem.Gastrointestinal2.text == '其他' ? postItem.Gastrointestinal2.Other : ""
      //   },
      //   {
      //     "Question": "消化狀態",
      //     "Answer": postItem.Gastrointestinal3.text,
      //     "MultipleAnswer": "",
      //     "Other": postItem.Gastrointestinal3.text == '其他' ? postItem.Gastrointestinal3.Other : "",
      //   },
      //   //排泄
      //   {
      //     "Question": "排便型態",
      //     "Answer": postItem.excretion1.text,
      //     "MultipleAnswer": "",
      //     "Other": postItem.excretion1.text == '其他' ? postItem.excretion1.Other : ""
      //   },
      //   {
      //     "Question": "排便顏色",
      //     "Answer": postItem.excretion2.text,
      //     "MultipleAnswer": "",
      //     "Other": postItem.excretion2.text == '其他' ? postItem.excretion2.Other : "",
      //   },
      //   {
      //     "Question": "排便輔助",
      //     "Answer": postItem.excretion3.text,
      //     "MultipleAnswer": postItem.excretion3.text == '有' ? postItem.excretion3.MultipleAnswer.toString() : "",
      //     "Other": postItem.excretion3.text == '有' && postItem.excretion3.MultipleAnswer.includes('其他') ? postItem.excretion3.Other : ""
      //   },
      //   {
      //     "Question": "排尿型態",
      //     "Answer": postItem.excretion4.text,
      //     "MultipleAnswer": postItem.excretion4.text == '異常' ? postItem.excretion4.MultipleAnswer.toString() : "",
      //     "Other": postItem.excretion4.text == '異常' && postItem.excretion4.MultipleAnswer.includes('其他') ? postItem.excretion4.Other : ""
      //   },
      //   {
      //     "Question": "排尿顏色",
      //     "Answer": postItem.excretion5.text,
      //     "MultipleAnswer": "",
      //     "Other": postItem.excretion5.text == '異常' ? postItem.excretion5.Other : ""
      //   },
      //   {
      //     "Question": "排尿輔助",
      //     "Answer": postItem.excretion6.text,
      //     "MultipleAnswer": postItem.excretion6.text == '有' ? postItem.excretion6.MultipleAnswer.toString() : "",
      //     "Other": postItem.excretion6.text == '有' && postItem.excretion6.MultipleAnswer.includes('其他') ? postItem.excretion6.Other : ""
      //   },
      //   //皮膚
      //   {
      //     "Question": "溫度",
      //     "Answer": postItem.skin1.text,
      //     "MultipleAnswer": "",
      //     "Other": postItem.skin1.text == '其他' ? postItem.skin1.Other : ""
      //   },
      //   {
      //     "Question": "濕度",
      //     "Answer": postItem.skin2.text,
      //     "MultipleAnswer": "",
      //     "Other": postItem.skin2.text == '其他' ? postItem.skin2.Other : ""
      //   },
      //   {
      //     "Question": "顏色",
      //     "Answer": postItem.skin3.text,
      //     "MultipleAnswer": "",
      //     "Other": postItem.skin3.text == '其他' ? postItem.skin3.Other : ""
      //   },
      //   {
      //     "Question": "水腫級數",
      //     "Answer": postItem.skin4.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "水腫等級",
      //     "Answer": postItem.skin4.text == '有' ? postItem.skin5.text : "",
      //     "MultipleAnswer": "",
      //     "Other": postItem.skin4.text == '有' ? postItem.skin4.Other : "",
      //   },
      //   {
      //     "Question": "完整",
      //     "Answer": postItem.skin6.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   //肌力
      //   {
      //     "Question": "左上肢",
      //     "Answer": postItem.muscle1.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "右上肢",
      //     "Answer": postItem.muscle2.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "左下肢",
      //     "Answer": postItem.muscle3.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "右下肢",
      //     "Answer": postItem.muscle4.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "行動能力問題",
      //     "Answer": postItem.muscle5.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "肌力-輔具",
      //     "Answer": postItem.muscle6.text,
      //     "MultipleAnswer": postItem.muscle6.text == '有' ? postItem.muscle6.MultipleAnswer.toString() : "",
      //     "Other": postItem.muscle6.text == '有' && postItem.muscle6.MultipleAnswer.includes('其他') ? postItem.muscle6.Other : ""
      //   },
      //   //跌倒
      //   {
      //     "Question": "跌倒",
      //     "Answer": postItem.fall1.text,
      //     "MultipleAnswer": postItem.fall1.text == '有' ? postItem.fall1.MultipleAnswer.toString() : "",
      //     "Other": postItem.fall1.text == '有' && postItem.fall1.MultipleAnswer.includes('其他') ? postItem.fall1.Other : ""
      //   },
      //   {
      //     "Question": "跌倒次數",
      //     "Answer": postItem.fall1.text == '有' ? postItem.fall1.Answer0 : "",
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   //行為
      //   {
      //     "Question": "行為",
      //     "Answer": postItem.behavior1.text,
      //     "MultipleAnswer": postItem.behavior1.text == '有干擾行為' ? postItem.behavior1.MultipleAnswer.toString() : "",
      //     "Other": postItem.behavior1.text == '有干擾行為' && postItem.behavior1.MultipleAnswer.includes('其他') ? postItem.behavior1.Other : ""
      //   },
      //   //睡眠
      //   {
      //     "Question": "睡眠",
      //     "Answer": postItem.sleep1.text,
      //     "MultipleAnswer": postItem.sleep1.text == '有障礙' ? postItem.sleep1.MultipleAnswer.toString() : "",
      //     "Other": postItem.sleep1.text == '有障礙' && postItem.sleep1.MultipleAnswer.includes('其他') ? postItem.sleep1.Other : ""
      //   },
      //   {
      //     "Question": "服用藥物",
      //     "Answer": postItem.sleep2.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "藥物類別",
      //     "Answer": "",
      //     "MultipleAnswer": postItem.sleep2.text == '有' ? returnvText(postItem.sleep3) : "",
      //     "Other": postItem.sleep2.text == '有' && returnvText(postItem.sleep3).includes('其他') ? postItem.sleep3[0].Other : ""
      //   },
      //   {
      //     "Question": "服用頻率",
      //     "Answer": postItem.sleep2.text == '有' ? postItem.sleep4.text : '',
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   //呼吸
      //   {
      //     "Question": "輔助器",
      //     "Answer": postItem.breathe1.text,
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "有輔助器",
      //     "Answer": postItem.breathe1.text == '有' ? postItem.breathe1.MultipleAnswer.toString() : "",
      //     "MultipleAnswer": postItem.breathe1.text == '有' && postItem.breathe1.MultipleAnswer.includes('氧氣機') ? "鼻導管,氧氣面罩" : "",
      //     "Other": postItem.breathe1.text == '有' && postItem.breathe1.MultipleAnswer.includes('其他') ? postItem.breathe1.Other : ""
      //   },
      //   {
      //     "Question": "鼻導管",
      //     "Answer": postItem.breathe2 && postItem.breathe2.text == '有' && postItem.breathe2.Other ? postItem.breathe2.Other : "",
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "氧氣面罩",
      //     "Answer": postItem.breathe3 && postItem.breathe3.text == '有' && postItem.breathe3.Other ? postItem.breathe3.Other : "",
      //     "MultipleAnswer": "",
      //     "Other": ""
      //   },
      //   {
      //     "Question": "疫苗",
      //     "Answer": postItem.vaccine1.text,
      //     "MultipleAnswer": postItem.vaccine1.text == '有' ? returnVaccineKind(postItem.vaccine1.MultipleAnswer) : "",
      //     "Other": postItem.vaccine1.text == '有' ? returnVaccineYearForget(postItem.vaccine1.MultipleAnswer) : "",
      //   }
      // ]

      //2025.2.4 統一改為由 mohwFn 來處理
      let postData = [postItem];
      let finalPostData = mohwFn.returnBodyEvaluationsJSON(postData)
      //因應衛福部會新增表單的情況；改成在 store 建構一個 mohwAllManArrs 空陣列表單備用
      let finalObj = {
        CaseID: this.$store.state.uData.id_num,
        EndDate: this.$store.state.uData.in_date,
        ...this.$store.state.mohwAllManArrs
      }
      finalObj['BodyEvaluations'] = finalPostData //設置指定的資料內容

      //建構回傳的資料基本架構
      let finalData = {
        DataList: []
      }
      finalData.DataList.push(finalObj)
      return finalData;


    },
    //回覆回傳後的時間
    returnState(item) {
      let data = JSON.parse(item.uploadState.data)
      return dayjs(data[0].log_date).format("YYYY-MM-DD HH:mm:ss");
    },


  },
};
</script>

<style lang="scss">
.BodyEvaluationsList {
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