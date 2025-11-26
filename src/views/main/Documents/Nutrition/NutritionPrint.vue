<template>
  <div class="nutritionprint">
    <div>
      <v-card-title></v-card-title>

      <v-card-text class="mt-3">
        <!-- 畫面顯示內容區域 -->
        <h3>{{cData.company_name}}</h3>

        <div class="text-center border-bottom my-2">
          <h1>
            <strong>營養評估單</strong>
          </h1>
        </div>

        <table
          class="table table-bordered table-sm bg-light form_title text-nowrap"
          style="border:2px #000000 solid;"
        >
          <tr>
            <td class="text-center align-middle">
              <strong>基本資料</strong>
            </td>
            <td>
              <v-row>
                <v-col cols="4">姓名: {{uData.name}}</v-col>
                <v-col cols="4">性別: {{uData.sex}}</v-col>
                <v-col cols="4">評估日期: {{list.date}}</v-col>
                <v-col cols="4">年齡: {{age}}</v-col>
                <v-col cols="4">身高: {{uData.height}}</v-col>
                <v-col cols="4">標準體重(IBW):{{ibw}}</v-col>
              </v-row>
            </td>
          </tr>

          <tr>
            <td class="text-center align-middle">
              <strong>生理資料</strong>
            </td>
            <td>
              <v-row>
                <v-col cols="12">疾病史: {{uData.hadadisease}}</v-col>
                <v-col cols="4">活動狀況: {{list.action}}</v-col>
                <v-col cols="8">
                  腸胃狀況:
                  <span v-if="nursingassessmentItems.gastrointestinal1">正常;</span>
                  <span v-if="nursingassessmentItems.gastrointestinal2">食慾增加;</span>
                  <span v-if="nursingassessmentItems.gastrointestinal3">食慾減少;</span>
                  <span v-if="nursingassessmentItems.gastrointestinal4">咀嚼困難;</span>
                  <span v-if="nursingassessmentItems.gastrointestinal5">吞嚥困難;</span>
                  <span v-if="nursingassessmentItems.gastrointestinal6">噁心;</span>
                  <span v-if="nursingassessmentItems.gastrointestinal7">嘔吐;</span>
                  <span v-if="nursingassessmentItems.gastrointestinal8">腹脹;</span>
                  <span v-if="nursingassessmentItems.gastrointestinal9">胃不適;</span>
                  <span v-if="nursingassessmentItems.gastrointestinal10">腹水;</span>
                  <span v-if="nursingassessmentItems.gastrointestinal11">體重改變;</span>
                  <span v-if="nursingassessmentItems.gastrointestinal12">便秘;</span>
                  <span v-if="nursingassessmentItems.gastrointestinal13">腹瀉;</span>
                  <span v-if="nursingassessmentItems.gastrointestinal14">痔瘡;</span>
                  <span v-if="nursingassessmentItems.gastrointestinal15">血便,</span>
                  <span
                    v-if="nursingassessmentItems.gastrointestinal16"
                  >{{nursingassessmentItems.gastrointestinal16}}</span>
                </v-col>
                <v-col cols="4">當月體重: {{list.weight}}</v-col>
                <v-col cols="4">BMI: {{list.bmi}}</v-col>
                <!-- <v-col cols="4">體重變化:{{list.weightChange}}</v-col> 2021.9.15 修改成不顯示 -->
              </v-row>
            </td>
          </tr>

          <tr>
            <td class="text-center align-middle">
              <strong>飲食資料</strong>
            </td>
            <td>
              <v-row>
                <v-col cols="4">咀嚼能力: {{list.occlusal}}</v-col>
                <v-col cols="4">吞嚥能力: {{list.swallowing}}</v-col>
                <v-col cols="4">食慾: {{list.appetite}}</v-col>
                <v-col cols="4">飲食質地: {{list.texture}}</v-col>
                <v-col cols="4">進食方式: {{list.eat}}</v-col>
              </v-row>
            </td>
          </tr>

          <tr>
            <td class="text-center align-middle">
              <strong>評估</strong>
            </td>
            <td>
              <v-row>
                <v-col cols="4">飲食處方: {{list.dietprescription}}</v-col>
                <v-col cols="8">熱量(Kcal): {{list.kcal}}</v-col>
                <v-col cols="4">醣類(%): {{list.carbohydrate}}</v-col>
                <v-col cols="4">蛋白質(%): {{list.protein}}</v-col>
                <v-col cols="4">脂肪(%): {{list.fat}}</v-col>
                <v-col cols="4">醣類(g): {{list.carbohydrate_g}}</v-col>
                <v-col cols="4">蛋白質(g): {{list.protein_g}}</v-col>
                <v-col cols="4">脂肪(g): {{list.fat_g}}</v-col>
              </v-row>
            </td>
          </tr>

          <tr>
            <td class="text-center align-middle">
              <strong>營養建議</strong>
            </td>
            <td>
              <v-row>
                <v-col cols="8">
                  <textarea cols="80" rows="10" v-model="list.suggest"></textarea>
                </v-col>
                <v-col cols="4" class="d-flex align-end">營養師: {{list.create_man | filterName}}</v-col>
              </v-row>
            </td>
          </tr>
        </table>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions></v-card-actions>
      <!-- <pre>{{ nursingassessmentItems}}</pre>
      <pre>{{ nutritionItems }}</pre>
      <pre>{{ recordItems }}</pre> -->
    </div>
  </div>
</template>

<script>
import qs from "qs";
import dayjs from "dayjs";

export default {
  data() {
    return {
      cData: {},
      pData: {},
      uData: {},
      list: {}, //表單內資料
      nursingassessmentItems: {},
      nutritionItems: [],
      recordItems: []
    };
  },

  filters: {
    filterName(val) {
      if (val != undefined) {
        var name = val.split("(");
        return name[0];
      }
    },
    
  },

  computed: {
    age() {
      return dayjs().format("YYYY") - dayjs(this.uData.birthday).format("YYYY");
    },
    ibw() {
      //IBW = 身高(公尺)*身高(公尺)*22，例如1.7*1.7*22=63.58
      var ibw = (this.uData.height / 100) * (this.uData.height / 100) * 22;
      return ibw.toFixed(2);
    }
  },

  mounted() {
    this.cData = JSON.parse(sessionStorage.getItem("cData"));
    this.pData = JSON.parse(sessionStorage.getItem("pData"));
    this.uData = JSON.parse(sessionStorage.getItem("uData"));
    this.list = JSON.parse(sessionStorage.getItem("printData"));
    this.getNursingassessment(); //取得入住護理評估(本病歷的)
    this.getNutrition(); //取得營養評估單(本病歷的)
    this.getRecord();
  },

  methods: {
    //設置住民定期評估表 (咀嚼能力：住民定期評估表→口腔吞嚥→咬合	吞嚥能力：住民定期評估表→口腔吞嚥→吞嚥能力)
    setRecord(){
        // var thismonth = dayjs(this.list.date).format("YYYY-MM");
        
        if (this.recordItems.length > 0){
        //20210102 由抓當月最後一筆,更動為直接抓日期最後一筆
          let rs = this.recordItems.sort((a,b) => {
            return a.date < b.date ? 1 : -1;
          });
          // var rs = this.recordItems.filter(i => {
          //   return i.date.includes(thismonth);
          // });
          
          this.$set(this.list, "occlusal" , rs[0].occlusal);
          this.$set(this.list, "swallowing" , rs[0].swallowing);
        }
      
    }
    ,
    //計算體重變化
    weightChangeCalculation() {
      if (this.nutritionItems != undefined) {
        var lastmonth = dayjs(this.list.date)
          .subtract(1, "month")
          .format("YYYY-MM");
        var lastmonthdata = this.nutritionItems.filter(i => {
          return i.date.includes(lastmonth);
        });
        if (lastmonthdata.length > 0) {
          var lastmonthweight = lastmonthdata[0].weight; //取得上個月的體重
          //公式=(當月體重-上月體重)/上月體重*100，例如(65-63)/65*100=3.07
          var value = ((this.list.weight - lastmonthweight).toFixed(2)) / parseInt(lastmonthweight) * 100;
          // ((parseInt(this.list.weight) - parseInt(lastmonthweight)))
          //  / parseInt(lastmonthweight)) * 100;
          // console.log(this.list.weight,lastmonthweight,lastmonthweight,value);
          this.$set(this.list, "weightChange", value.toFixed(2));
        }
      }
    },
    //取得入住護理評估(本病歷的)
    getNursingassessment() {
      var postData = {
        key: "u_snkey",
        value: this.uData.snkey
      };

      //this.$store.commit("setLoadingOn"); //讀取畫面on
      this.axios
        .post(
          "general/getByKey/" +
            this.$store.state.databaseName +
            "/nursingassessment",
          qs.stringify(postData)
        )
        .then(rs => {
          if (rs.data.length) {
            this.nursingassessmentItems = rs.data[0];
          }
          // this.$store.commit("setLoadingOff"); //讀取畫面off
        });
    },
    //取得營養評估單(本病歷的)
    getNutrition() {
      var postData = {
        key: "u_snkey",
        value: this.uData.snkey
      };

      //取得所有資料
      //this.$store.commit("setLoadingOn"); //讀取畫面on
      this.axios
        .post(
          "general/getByKey/" + this.$store.state.databaseName + "/nutrition",
          qs.stringify(postData)
        )
        .then(rs => {
          this.nutritionItems = rs.data;

          this.weightChangeCalculation();
          // this.$store.commit("setLoadingOff"); //讀取畫面off
        });
    },
    //取得住民定期評估表
    getRecord() {
      var postData = {
        key: "u_snkey",
        value: this.uData.snkey
      };

      //取得所有資料
      //this.$store.commit("setLoadingOn"); //讀取畫面on
      this.axios
        .post(
          "general/getByKey/" + this.$store.state.databaseName + "/record",
          qs.stringify(postData)
        )
        .then(rs => {
          //  console.log(rs.data)
          this.recordItems = rs.data.map(i=>{
            let newItem = JSON.parse(i.datalist);
            return newItem;
          });
          this.setRecord();
          // this.$store.commit("setLoadingOff"); //讀取畫面off
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.nutritionprint {
  @import "node_modules/bootstrap/scss/bootstrap";
  @import "node_modules/bootstrap-vue/src/index.scss";

  .form_title {
    font-size: 1.2rem;
    // text-align: center;
    font-family: "微軟正黑體";
  }
  .vertical-mode {
    writing-mode: tb-rl;
    -webkit-writing-mode: vertical-rl;
    writing-mode: vertical-rl;
  }
}
</style>