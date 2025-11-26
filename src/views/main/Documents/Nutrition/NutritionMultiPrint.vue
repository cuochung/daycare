<template>
  <div class="NutritionMultiPrint">
    <div class="py-0 my-0" v-for="(list,index) in items" :key="index">
      <p style="page-break-after:always" v-if="printnextpage(index, items)"></p>
      <h3 v-if="reprint(index,items)">{{cData.company_name}}</h3>

      <div class="text-center border-bottom my-2" v-if="reprint(index,items)">
        <h1>
          <strong>營養評估單</strong>
        </h1>
      </div>

      <table
        class="table table-bordered table-sm bg-light form_title text-nowrap py-0 my-0"
        style="border:2px #000000 solid;"
      >
        <tr v-if="reprint(index,items)">
          <td class="text-center align-middle">
            <strong>基本資料</strong>
          </td>
          <td colspan="2">
            <v-row>
              <v-col cols="4">姓名: {{list.name}}</v-col>
              <v-col cols="4">性別: {{list.sex}}</v-col>
              <v-col cols="4">年齡: {{list.birthday | age}}</v-col>
              <v-col cols="4">身高: {{list.height}}</v-col>
              <v-col cols="4">標準體重(IBW):{{list | ibw}}</v-col>
              <v-col cols="12">疾病史: {{list.hadadisease}}</v-col>
            </v-row>
          </td>
        </tr>

        <tr>
          <td rowspan="4">
            評估日期:
            <br />
            {{list.date}}
          </td>
          <td class="text-center align-middle">
            <strong>生理資料</strong>
          </td>
          <td>
            <v-row>
              <v-col cols="4">活動狀況: {{list.action}}</v-col>
              <v-col cols="8">
                <div class="d-flex">
                  <span>腸胃狀況: {{getgastrointestinal(list)}}</span> 
                  <v-text-field hide-details class="ml-2 ma-0 pa-0"></v-text-field>
                </div>
              </v-col>
              <v-col cols="4">當月體重: {{list.weight}}</v-col>
              <v-col cols="4">BMI: {{list.bmi}}</v-col>
              <!-- <v-col cols="4">體重變化:{{weightChangeCalculation(list)}}</v-col>  2021.9.15 修改成不顯示 -->
            </v-row>
          </td>
        </tr>

        <tr>
          <td class="text-center align-middle">
            <strong>飲食資料</strong>
          </td>
          <td>
            <v-row>
              <v-col cols="4">咀嚼能力: {{setRecord(list,'occlusal')}}</v-col>
              <v-col cols="4">吞嚥能力: {{setRecord(list,'swallowing')}}</v-col>
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
                <pre style="border:0px">{{list.suggest}}</pre>
              </v-col>
              <v-col cols="4">營養師: {{list.create_man | filterName}}</v-col>
            </v-row>
          </td>
        </tr>
      </table>
    </div>
    <!-- <pre>{{items}}</pre> -->
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  data() {
    return {
      cData: {},
      pData: {},
      uData: {},
      items: [], //準備列印資料
      nursingassessmentItems: [],
      nutritionItems: [],
      recordItems: []
    };
  },

  filters: {
    filterName(val) {
      var nameArr = val.split("(");
      return nameArr[0];
    },
    age(val) {
      return dayjs().format("YYYY") - dayjs(val).format("YYYY");
    },
    ibw(item) {
      //IBW = 身高(公尺)*身高(公尺)*22，例如1.7*1.7*22=63.58
      var ibw = (item.height / 100) * (item.height / 100) * 22;
      return ibw.toFixed(2);
    }
  },

  mounted() {
    this.setAllData();
  },

  methods: {
    //是否列印跳頁設定
    printnextpage(index, items) {
      if (index == 0) {
        return false;
      } else {
        if (items[index].name == items[index - 1].name) {
          return false;
        } else {
          return true;
        }
      }
    },
    //是否列印抬頭的設定
    reprint(index, items) {
      if (index == 0) {
        return true;
      } else {
        if (items[index].name == items[index - 1].name) {
          return false;
        } else {
          return true;
        }
      }
    },
    setAllData() {
      this.cData = JSON.parse(sessionStorage.getItem("cData"));
      this.pData = JSON.parse(sessionStorage.getItem("pData"));
      // this.uData = JSON.parse(sessionStorage.getItem("uData"));
      this.items = JSON.parse(sessionStorage.getItem("printData"))
      // .sort((a,b)=>{
      //   return a.date > b.date ? 1 : -1;
      // });
      this.getNursingassessment(); //取得入住護理評估(所有的)
      this.getNutrition(); //取得營養評估單(所有的)
      this.getRecord();  //取得住民定期評估表
    },
    //取得入住護理評估(全部)
    getNursingassessment() {
      //this.$store.commit("setLoadingOn"); //讀取畫面on
      this.axios
        .post(
          "general/getall/" +
            this.$store.state.databaseName +
            "/nursingassessment"
        )
        .then(rs => {
          this.nursingassessmentItems = rs.data;

          // this.$store.commit("setLoadingOff"); //讀取畫面off
        });
    },
    //判斷指定病歷的入住護理評估資料
    getgastrointestinal(list) {
      if (this.nursingassessmentItems.length > 0) {
        var rs = this.nursingassessmentItems.filter(i => {
          return (
            i.u_snkey == list.u_snkey &&
            dayjs(i.date).format("YYYY-MM") ==
              dayjs(list.date).format("YYYY-MM")
          );
        });

        if (rs.length) {
          const listdata = rs[0];
          var outtext = "";
          if (listdata.gastrointestinal1) {
            outtext += "正常;";
          }
          if (listdata.gastrointestinal2) {
            outtext += "食慾增加;";
          }
          if (listdata.gastrointestinal3) {
            outtext += "食慾減少;";
          }
          if (listdata.gastrointestinal4) {
            outtext += "咀嚼困難;";
          }
          if (listdata.gastrointestinal5) {
            outtext += "吞嚥困難;";
          }
          if (listdata.gastrointestinal6) {
            outtext += "噁心;";
          }
          if (listdata.gastrointestinal7) {
            outtext += "嘔吐;";
          }
          if (listdata.gastrointestinal8) {
            outtext += "腹脹;";
          }
          if (listdata.gastrointestinal9) {
            outtext += "胃不適;";
          }
          if (listdata.gastrointestinal10) {
            outtext += "腹水;";
          }
          if (listdata.gastrointestinal11) {
            outtext += "體重改變;";
          }
          if (listdata.gastrointestinal12) {
            outtext += "便秘;";
          }
          if (listdata.gastrointestinal13) {
            outtext += "腹瀉;";
          }
          if (listdata.gastrointestinal14) {
            outtext += "痔瘡;";
          }
          if (listdata.gastrointestinal15) {
            outtext += "血便;";
          }
          if (listdata.gastrointestinal16) {
            outtext += listdata.gastrointestinal16;
          }
          return outtext;
        }else{
          return '';
        }
      }
    },
    //取得營養評估單(全部)
    getNutrition() {
      //取得所有資料
      //this.$store.commit("setLoadingOn"); //讀取畫面on
      this.axios
        .post(
          "general/getall/" + this.$store.state.databaseName + "/nutrition")
        .then(rs => {
          this.nutritionItems = rs.data;
          // this.$store.commit("setLoadingOff"); //讀取畫面off
        });
    },
    //計算體重變化
    weightChangeCalculation(list) {
      if (this.nutritionItems.length > 0) {
        var lastmonth = dayjs(list.date).subtract(1, "month").format("YYYY-MM");
        
        var rs = this.nutritionItems.filter(i => {
          return (
            i.u_snkey == list.u_snkey && dayjs(i.date).format("YYYY-MM") == lastmonth
          );
        });

        if (rs.length){
          var lastmonthweight = rs[0].weight; //取得上個月的體重
          //公式=(當月體重-上月體重)/上月體重*100，例如(65-63)/65*100=3.07
          var value = (parseInt(list.weight) - parseInt(lastmonthweight)) / parseInt(lastmonthweight) * 100;
          return value.toFixed(2);
        }else{
          return '無上個月的體重資料';
        }
      }
    },
    //取得住民定期評估表(全部)
    getRecord() {
      //取得所有資料
      //this.$store.commit("setLoadingOn"); //讀取畫面on
      this.axios
        .post("general/getall/" + this.$store.state.databaseName + "/record")
        .then(rs => {
          this.recordItems = rs.data;
          // this.$store.commit("setLoadingOff"); //讀取畫面off
        });
    },
    //代入住民定期評估資料
    setRecord(list,col) {
      if (this.recordItems.length > 0) {
        var rs = this.recordItems.filter(i => {
          return (
            i.u_snkey == list.u_snkey 
            // && dayjs(i.date).format("YYYY-MM") == dayjs(list.date).format("YYYY-MM")
          );
        });

        if (rs.length > 0){
          return JSON.parse(rs[0].datalist)[col];
        }
      }
      
    },
  }
};
</script>

<style lang="scss" scoped>
.NutritionMultiPrint {
  @import "node_modules/bootstrap/scss/bootstrap";
  @import "node_modules/bootstrap-vue/src/index.scss";

  .form_title,
  pre {
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