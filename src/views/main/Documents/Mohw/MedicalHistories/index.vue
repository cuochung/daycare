<template>
  <div class="MedicalHistoriesList">
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
              <span>疾病史評估表</span>
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
import popupadd from "@/views/document/mohw/MedicalHistories/Add";
import dayjs from "dayjs";
import mohwFn from '@/assets/js/mohwFn'

export default {
  components: { popupadd },
  data() {
    return {
      useDataBase: 'medicalhistories',
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
      // finalPostData.AnsOther_1 = postItem.AnsOther_1
      // finalPostData.AnsOther_2 = postItem.AnsOther_2
      // finalPostData.MedicalHistoryQuestions = [
      //       {
      //         "Question": "心臟問題(只包含心臟)",
      //         "Answer": postItem.qq1
      //       },
      //       {
      //         "Question": "周邊血管系統問題(包括高血壓)",
      //         "Answer": postItem.qq2
      //       },
      //       {
      //         "Question": "造血系統問題(貧血、血球、淋巴、骨髓、脾臟等)",
      //         "Answer": postItem.qq3
      //       },
      //       {
      //         "Question": "呼吸系統問題(肺部、支氣管、氣管及抽菸狀況)",
      //         "Answer": postItem.qq4
      //       },
      //       {
      //         "Question": "眼耳鼻喉問題",
      //         "Answer": postItem.qq5
      //       },
      //       {
      //         "Question": "上消化道問題(食道、胃、十二指腸)",
      //         "Answer": postItem.qq6
      //       },
      //       {
      //         "Question": "下消化道問題(小腸、大腸、直腸)",
      //         "Answer": postItem.qq7
      //       },
      //       {
      //         "Question": "肝膽胰臟問題",
      //         "Answer": postItem.qq8
      //       },
      //       {
      //         "Question": "腎臟問題",
      //         "Answer": postItem.qq9
      //       },
      //       {
      //         "Question": "其他泌尿生殖系統問題(輸尿管、尿道、膀胱、攝護腺、其他生殖系統問題)",
      //         "Answer": postItem.qq10
      //       },
      //       {
      //         "Question": "肌肉骨骼皮膚問題",
      //         "Answer": postItem.qq11
      //       },
      //       {
      //         "Question": "神經系統問題(腦部、脊髓、周邊神經等、不包含失智症)",
      //         "Answer": postItem.qq12
      //       },
      //       {
      //         "Question": "內分泌、感染與代謝問題(包含糖尿病、甲狀腺、肥胖、乳房異常、感染性疾病與毒藥物問題)",
      //         "Answer": postItem.qq13
      //       },
      //       {
      //         "Question": "情緒與行為問題(包括憂鬱、焦慮、激躁、急性混亂、瞻妄及失智症等問題)",
      //         "Answer": postItem.qq14
      //       }
      //     ]

      let postData = [postItem];
      let finalPostData = mohwFn.returnMedicalHistoriesJSON(postData)
      //因應衛福部會新增表單的情況；改成在 store 建構一個 mohwAllManArrs 空陣列表單備用
      let finalObj = {
        CaseID: this.$store.state.uData.id_num,
        EndDate: this.$store.state.uData.in_date,
        ...this.$store.state.mohwAllManArrs
      }
      finalObj['MedicalHistories'] = finalPostData //設置指定的資料內容

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
      //       MedicalHistories: [finalPostData],
      //       DrugSafeties: [],
      //       BodyEvaluations: [],
      //       PressureInjuries: [],
      //       FallRisks: [],
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
.MedicalHistoriesList {
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