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
              <v-text-field
                hide-details
                prepend-icon="mdi-magnify"
                single-line
                label="搜尋"
                v-model="searchKey"
              ></v-text-field>

              <popupadd ref="childFn" @getAllData="getAllData" :useDataBase="useDataBase" :items="items"></popupadd>
            </v-toolbar>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-card class="mt-2">
          <v-card-text>
            <!-- 表單內容 -->
            <v-data-iterator
              :items="searchfilter"
              :items-per-page.sync="itemsPerPage"
              :footer-props="{ itemsPerPageOptions }"
            >
              <template v-slot:default="props">
                <v-simple-table fixed-header class="mt-2 text-no-wrap">
                  <template v-slot:default>
                    <thead style="background-color: #e3f2fd">
                      <tr>
                        <th></th>
                        <th>上傳紀錄</th>
                        <th>評估日期</th>
                        
                        <th>紀錄人</th>
                        <th>修改紀錄</th>
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
                                <v-list-item-title
                                  >上傳衛福部</v-list-item-title
                                >
                              </v-list-item>
                              <v-list-item
                                @click="checkMOHWData(item)"
                                v-if="item.uploadData"
                              >
                                <v-list-item-title
                                  >確認上傳資料狀況</v-list-item-title
                                >
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
                        
                        <td>{{ item.create_man }}</td>
                        <td>{{ item.edit_man }}</td>
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
          .sort((a,b)=>a.Date < b.Date ? 1 : -1);
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
    async pushToMOHW(postItem){
      const res = await this.$confirm('確認上傳資料到衛福部?');
      if (res){
        mohwFn.pushToMOHW(postItem,this.useDataBase,JSON.stringify(this.dataToJson(postItem)))
        .then(rs=>{ if (rs){ this.getAllData() }
        })
      }
    },
    //判斷上傳到衛福部的狀態
    checkMOHWData(postItem) {
        mohwFn.checkMOHWData(postItem,this.useDataBase)
        .then(rs=>{ if (rs){ this.getAllData() }})
    },
    //資料轉成適合的JSON檔
    dataToJson(postItem) {

      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = this.$store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      let finalPostData = {}
      finalPostData.Date = postItem.Date;
      if (findNurse && findNurse.idNum) {
        finalPostData.NurseID = findNurse.idNum;
      } else {
        finalPostData.NurseID = "N223456789";
      }
      finalPostData.AssessmentNo = this.items.length; //目前資料筆數
      finalPostData.BodyQuestions = []

      //處理BodyQuestions內需要的資料格式
      Object.values(postItem).forEach((i,index)=>{
        if (typeof(i) == 'object' && !i.code){  //物件類別資料才是要判斷的內容 i.code是表示是回傳的資料狀況
          if (i.length == undefined && i.Question != '疫苗' && i.Question != '跌倒'){  //標準資料
            // console.log('1.標準資料:',index);
            /* 2023.4.20 只處理額外缺少的資料;原始存在的判斷不新增缺的,都由最下面的
              finalPostData.BodyQuestions.push( this.returnBodyQuestionsType1(i) ) 去處理
              新增如果資料是視力時,而且資料不是"有障礙"時,要另外放入預設值
              新增如果資料是聽力時,而且資料不是"有障礙"時,要另外放入預設值
              新增如果資料是溝通時,而且資料是"無障礙"時,要另外放入預設值
              新增如果資料是水腫級數時,而且資料是"無"時,要另外放入預設值
              新增如果資料是睡眠時,而且資料不是"有障礙"時,要另外放入預設值
              新增如果資料是輔助器時,而且資料是"無"時,要另外放入預設值
            */
            if (i.Question == '視力' && i.text != '有障礙'){
              finalPostData.BodyQuestions.push(
                {
                  "Question": "視力-部位",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                },
                {
                  "Question": "視力-影響日常活動",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                },
                {
                  "Question": "視力-輔具",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                }
              )
            }
            if (i.Question == '聽力' && i.text != '有障礙'){
              finalPostData.BodyQuestions.push(
                {
                  "Question": "聽力-部位",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                },
                {
                  "Question": "聽力-影響日常活動",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                },
                {
                  "Question": "聽力-輔具",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                }
              )
            }
            if (i.Question == '溝通' && i.text == '無障礙'){
              finalPostData.BodyQuestions.push(
                {
                  "Question": "溝通-影響日常活動",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                },
                {
                  "Question": "說話",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                },
                {
                  "Question": "理解",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                }
              )
            }
            if (i.Question == '水腫級數' && i.text == '無'){
              finalPostData.BodyQuestions.push(
                {
                  "Question": "水腫等級",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                }
              )
            }
            if (i.Question == '睡眠' && i.text != '有障礙'){
              finalPostData.BodyQuestions.push(
                {
                  "Question": "服用藥物",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                },
                {
                  "Question": "藥物類別",
                  "Answer": "",
                  "MultipleAnswer":"",
                  "Other": ""
                },
                {
                  "Question": "服用頻率",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                }
              )
            }
            if (i.Question == '服用藥物' && i.text == '無'){
              finalPostData.BodyQuestions.push(
                {
                  "Question": "藥物類別",
                  "Answer": "",
                  "MultipleAnswer":"",
                  "Other": ""
                },
                {
                  "Question": "服用頻率",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                }
              )
            }
            if (i.Question == '輔助器' && i.text == '無'){
              finalPostData.BodyQuestions.push(
                {
                  "Question": "有輔助器",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                },
                {
                  "Question": "鼻導管",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                },
                {
                  "Question": "氧氣面罩",
                  "Answer": "",
                  "MultipleAnswer": "",
                  "Other": ""
                }
              )
            }
            if (i.Question == '輔助器' && i.text == '有'){
              finalPostData.BodyQuestions.push(
                {
                  "Question": "有輔助器",
                  "Answer": i.MultipleAnswer,
                  "MultipleAnswer": i.Other,
                  "Other": ""
                },
              )
              //2023.7.19 加入判斷如果有輔助器的情況下,選擇的輔助器不是 氧氣機 時,都要加入空值的鼻導管跟氧氣面罩
              if (i.MultipleAnswer != "氧氣機"){
                finalPostData.BodyQuestions.push(
                  {
                    "Question": "鼻導管",
                    "Answer": "",
                    "MultipleAnswer": "",
                    "Other": ""
                  },
                  {
                    "Question": "氧氣面罩",
                    "Answer": "",
                    "MultipleAnswer": "",
                    "Other": ""
                  }
                )
              }
            }

            finalPostData.BodyQuestions.push( this.returnBodyQuestionsType1(i) )
          }


          if (i.length == undefined && i.Question == '跌倒'){  //標準資料 -> vaccine1-疫苗 要另外處理
            // console.log('3.標準資料-跌倒:',index);
            finalPostData.BodyQuestions.push( this.returnBodyQuestionsType2(i) )
            
            //2023.4.20 新增處理跌倒次數資料
            let pushData = {};
            if (i.text == '無'){
                pushData = {
                    "Question": "跌倒次數",
                    "Answer": "",
                    "MultipleAnswer": "",
                    "Other": ""
                }
              }else{
                pushData = {
                    "Question": "跌倒次數",
                    "Answer": i.Answer0,
                    "MultipleAnswer": "",
                    "Other": ""
                }
              }
              finalPostData.BodyQuestions.push(pushData)

          }

          if (i.length == undefined && i.Question == '疫苗'){  //標準資料 -> vaccine1-疫苗 要另外處理
            // console.log('2.標準資料-疫苗:',index);
            finalPostData.BodyQuestions.push( this.returnBodyQuestionsType3(i) )
          }

          if (i.length && i.length != undefined){  //Answer兩筆物件以上類型
            // console.log('4.兩筆物件以上類型:',i,index,i);
            finalPostData.BodyQuestions.push( this.returnBodyQuestionsType4(i) )
          }

        }
      })

      //因應衛福部會新增表單的情況；改成在 store 建構一個 mohwAllManArrs 空陣列表單備用
      let finalObj = {
        CaseID: this.$store.state.uData.id_num,
        EndDate: this.$store.state.uData.in_date,
        ...this.$store.state.mohwAllManArrs
      }
      finalObj['BodyEvaluations'].push(finalPostData) //設置指定的資料內容

      //建構回傳的資料基本架構
      let finalData = {
        DataList: []
      }
      finalData.DataList.push(finalObj)
      return finalData;    

      // return {
      //   DataList: [
      //     {
      //       CaseID: this.$store.state.uData.id_num,
      //       EndDate: this.$store.state.uData.in_date,
      //       HealthyHabits: [],
      //       MedicalHistories: [],
      //       DrugSafeties: [],
      //       BodyEvaluations: [finalPostData],
      //       PressureInjuries: [],
      //       FallRisks: [],
      //       ADLs: [],
      //       IADLs: [],
      //       Dementias: [],
      //       GeriatricDepressionScales: [],
      //       MNASFs: [],
      //       PainEvaluations: [],
      //       SOFs: [],
      //     },
      //   ],
      // };
    },
    //回覆回傳後的時間
    returnState(item){
      let data = JSON.parse(item.uploadState.data)
      return dayjs(data[0].log_date).format("YYYY-MM-DD HH:mm:ss");
    },
    //重建BodyQuestions的資料
    returnBodyQuestionsType1(i){
      // console.log(typeof(i.Other),i.Question)
      return {
        "Question": i.Question,
        "Answer": i.text,
        "MultipleAnswer": i.MultipleAnswer ? returnMultipleAnswer(i) : "",
        "Other":  i.Other ? returnOther(i.Other) : "",
      }

     
      
      function returnMultipleAnswer(item){
        let val = ""
        if (typeof(item.MultipleAnswer) == 'object'){
          Object.values(item.MultipleAnswer).forEach((AnswerItem,index)=>{
            if (index > 0) {val += ','}
            val += AnswerItem;
          })
        }else{
          val += item.MultipleAnswer
        }
        return val;
      } 

      function returnOther(item){
        if (typeof(item) == 'object'){
          let val = ""
          item.forEach((i,index)=>{
            if (index){ val += ','}
            val += i;
          })
          return val;
        }else{
          return item;
        }
      }
      
    },
    returnBodyQuestionsType2(i){  //目前只有跌倒一個專用
      return {
        "Question": i.Question,
        "Answer0": i.Answer0 ? i.Answer0 : 0,
        "Answer": i.text,
        "MultipleAnswer": i.MultipleAnswer ? returnMultipleAnswer(i) : "",
        "Other":  i.Other ? i.Other : "",
      }
      
      function returnMultipleAnswer(item){
        let val = ""
        Object.values(item.MultipleAnswer).forEach((AnswerItem,index)=>{
          if (index > 0) {val += ','}
          val += AnswerItem;
        })
        return val;
      } 
      
    },
    returnBodyQuestionsType3(i){  //目前只有疫苗一個專用
      return {
        "Question": i.Question,
        "Answer": i.text,
        "MultipleAnswer": i.text == '有' ? returnMultipleAnswer(i,'kind') : '',
        "Other": i.text == '有' ? returnMultipleAnswer(i,'year') : '',
      }
      
      function returnMultipleAnswer(item,type){
        let val = ""
        // console.log(item.MultipleAnswer,item)
        Object.values(item.MultipleAnswer).forEach((AnswerItem,index)=>{
          if (AnswerItem.selected){
            if (val.length > 0) {val += ','}
            if (AnswerItem.forget && type == 'year'){
              val += '不記得';
            }else{
              val += AnswerItem[type];
            }
          }
        })
        return val;
      } 
      
    },
    returnBodyQuestionsType4(i){  ////兩筆物件以上類型
      return {
        "Question": i[0].Question,
        "Answer": returnDataType(i,'text'),
        "MultipleAnswer": returnDataType(i,'text'),
        "Other":  i[0].Other ? i[0].Other : "",
      }
      
      function returnDataType(item,type){
        let val = ""
        Object.values(item).forEach((dItem,index)=>{
          
          if (index > 0) {val += ','}
          val += dItem[type];
        })
        return val;
      } 
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