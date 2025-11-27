<template>
  <div class="FallRisksList">
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
              <span>跌倒危險性評估</span>
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
import popupadd from "@/views/document/mohw/FallRisks/Add";
import dayjs from "dayjs";
import mohwFn from '@/assets/js/mohwFn'

export default {
  components: { popupadd },
  data() {
    return {
      useDataBase: 'fallrisks',
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
      //2025.2.4 統一改為由 mohwFn 來處理
      let postData = [postItem];
      let finalPostData = mohwFn.returnFallRisksJSON(postData)
      //因應衛福部會新增表單的情況；改成在 store 建構一個 mohwAllManArrs 空陣列表單備用
      let finalObj = {
        CaseID: this.$store.state.uData.id_num,
        EndDate: this.$store.state.uData.in_date,
        ...this.$store.state.mohwAllManArrs
      }
      finalObj['FallRisks'] = finalPostData //設置指定的資料內容

      //建構回傳的資料基本架構
      let finalData = {
        DataList: []
      }
      finalData.DataList.push(finalObj)
      return finalData;

      // console.log(postItem)
      // //判斷護理人員身分證字號 ;不存在時先用預設值
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
      // finalPostData.Questions = [
      //       {
      //         "Question": "年紀65歲以上",
      //         "Answer": postItem.qq1.text,
      //         "Options": "",
      //         // "Point": postItem.qq1.Point
      //       },
      //       {
      //         "Question": "過去一年內曾跌倒",
      //         "Answer": postItem.qq2.text,
      //         "Options": "",
      //         // "Point": postItem.qq2.Point
      //       },
      //       {
      //         "Question": "最近意識/認知出現異常",
      //         "Answer": postItem.qq3.text,
      //         "Options": postItem.qq3.text == '是' ? returnOptions(postItem.qq3.Options) : null,
      //         // "Point": postItem.qq3.Point
      //       },
      //       {
      //         "Question": "活動功能異常",
      //         "Answer": postItem.qq4.text,
      //         "Options": postItem.qq4.text == '是' ? returnOptions(postItem.qq4.Options) : null,
      //         // "Point": postItem.qq4.Point
      //       },
      //       {
      //         "Question": "體能虛弱",
      //         "Answer": postItem.qq5.text,
      //         "Options": postItem.qq5.text == '是' ?  returnOptions(postItem.qq5.Options) : null,
      //         // "Point": postItem.qq5.Point
      //       },
      //       {
      //         "Question": "知覺障礙",
      //         "Answer": postItem.qq6.text,
      //         "Options": postItem.qq6.text == '是' ?  returnOptions(postItem.qq6.Options) : null,
      //         // "Point": postItem.qq6.Point
      //       },
      //       {
      //         "Question": "暈眩/低血壓",
      //         "Answer": postItem.qq7.text,
      //         "Options": postItem.qq7.text == '是' ?  returnOptions(postItem.qq7.Options) : null,
      //         // "Point": postItem.qq7.Point
      //       },
      //       {
      //         "Question": "使用藥物",
      //         "Answer": postItem.qq8.text,
      //         "Options": postItem.qq8.text == '是' ?  returnOptions(postItem.qq8.Options) : null,
      //         // "Point": postItem.qq8.Point,
      //         "Other": postItem.qq8 && postItem.qq8.Options && postItem.qq8.Options.includes('其他') ? postItem.qq8.Other : ""
      //       }
      //     ]

      //     function returnOptions(OptionsItems){
      //       console.log('OptionsItems',OptionsItems)
      //       let val = ''
      //       OptionsItems.forEach((i,index)=>{
      //         if (index){val += ','}
      //         val += i;
      //       })
      //       return val;
      //     }

      //   return {
      //   DataList: [
      //     {
      //       CaseID: this.$store.state.uData.id_num,
      //       EndDate: this.$store.state.uData.in_date,
      //       HealthyHabits: [],
      //       MedicalHistories: [],
      //       DrugSafeties: [],
      //       BodyEvaluations: [],
      //       PressureInjuries: [],
      //       FallRisks: [finalPostData],
      //       ADLs: [],
      //       IADLs: [],
      //       Dementias: [],
      //       BSRS5s: [],
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
    }
  },
};
</script>

<style lang="scss">
.FallRisksList {
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