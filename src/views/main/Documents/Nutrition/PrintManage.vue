<template>
  <div class="nutritionprintmanage">
    <v-row>
      <v-col cols="12" md="6">
        <h2 class="subheading grey--text">
          <v-icon class="mx-1">mdi-food</v-icon>
          <span>營養評估單列印管理</span>
        </h2>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn class="mx-1 primary" @click.stop="goNutrition">回營養評估單頁面</v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="3">
            <v-card>
              <v-card-title class="primary lighten-2 white--text">病歷資料列表</v-card-title>
              <v-card-text class="mt-2">
                <v-toolbar dense>
                  <v-text-field
                    hide-details
                    prepend-icon="mdi-magnify"
                    single-line
                    label="搜尋"
                    v-model="serachKey"
                  ></v-text-field>
                </v-toolbar>

                <div style="overflow:auto">
                  <v-list class="mt-2" height="60vh">
                    <v-list-item-group v-model="model" color="primary">
                      <v-list-item
                        v-for="(item, i) in searchfilter"
                        :key="i"
                        @click="getUserAccounting(item)"
                      >
                        <v-list-item-icon class="mx-2">
                          <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>{{item.name}} 床號:{{item.bed_name}}</v-list-item-title>
                          <v-list-item-subtitle>病歷號:{{item.p_code}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="9">
            <v-card>
              <v-card-title class="primary lighten-2 white--text">
                營養評估單列表
                <v-spacer></v-spacer>
                {{selectUser.name}} 病歷號:{{selectUser.p_code}} 床號:{{selectUser.bed_name}}
              </v-card-title>
              <v-card-text>
                <v-simple-table fixed-header class="text-no-wrap">
                  <template v-slot:default>
                    <thead style="background-color: #e3f2fd;">
                      <tr>
                        <th>選取</th>
                        <th>評估日期</th>
                        <th>體重</th>
                        <th>BMI</th>
                        <th>飲食處方</th>
                        <th>熱量(Kcal)</th>
                        <th>醣類(%)</th>
                        <th>醣類(g)</th>
                        <th>蛋白質(%)</th>
                        <th>蛋白質(g)</th>
                        <th>脂肪(%)</th>
                        <th>脂肪(g)</th>
                        <th>營養建議</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item,index) in nutritionfilter" :key="index">
                        <td>
                          <v-checkbox v-model="item.check"></v-checkbox>
                        </td>
                        <td>{{item.date}}</td>
                        <td>{{item.weight}}</td>
                        <td>{{item.bmi}}</td>
                        <td>{{item.dietprescription}}</td>
                        <td>{{item.kcal}}</td>
                        <td>{{item.carbohydrate}}</td>
                        <td>{{item.carbohydrate_g}}</td>
                        <td>{{item.protein}}</td>
                        <td>{{item.protein_g}}</td>
                        <td>{{item.fat}}</td>
                        <td>{{item.fat_g}}</td>
                        <td>{{item.suggest}}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>

            <v-card class="mt-2">
              <v-card-title class="primary lighten-2 white--text">
                已選取資料 - 已選取 {{checkedNutritionfilter.length}} 筆
                <v-spacer></v-spacer>
                <v-btn
                  class="error"
                  @click="printConfirm"
                  v-if="checkedNutritionfilter.length > 0"
                >確認列印</v-btn>
              </v-card-title>
              <v-card-text>
                <v-simple-table fixed-header class="text-no-wrap">
                  <template v-slot:default>
                    <thead style="background-color: #e3f2fd;">
                      <tr>
                        <th>病歷號</th>
                        <th>姓名</th>
                        <th>床號</th>
                        <th>評估日期</th>
                        <th>體重</th>
                        <th>BMI</th>
                        <th>飲食處方</th>
                        <th>熱量(Kcal)</th>
                        <th>醣類(%)</th>
                        <th>醣類(g)</th>
                        <th>蛋白質(%)</th>
                        <th>蛋白質(g)</th>
                        <th>脂肪(%)</th>
                        <th>脂肪(g)</th>
                        <th>營養建議</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item,index) in checkedNutritionfilter" :key="index">
                        <td>
                          <v-icon color="red" @click="item.check=''">mdi-close</v-icon>
                          {{item.p_code}}
                        </td>
                        <td>{{item.name}}</td>
                        <td>{{item.bed_name}}</td>
                        <td>{{item.date}}</td>
                        <td>{{item.weight}}</td>
                        <td>{{item.bmi}}</td>
                        <td>{{item.dietprescription}}</td>
                        <td>{{item.kcal}}</td>
                        <td>{{item.carbohydrate}}</td>
                        <td>{{item.carbohydrate_g}}</td>
                        <td>{{item.protein}}</td>
                        <td>{{item.protein_g}}</td>
                        <td>{{item.fat}}</td>
                        <td>{{item.fat_g}}</td>
                        <td>{{item.suggest}}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- <pre> {{selectUser}} </pre> -->
  </div>
</template>

<script>
import qs from "qs";
import feelist from "@/components/FeeList";
import dayjs from "dayjs";

export default {
  components: { feelist },
  data() {
    return {
      items: [], //病歷資料
      NutritionItems: [], //所有營養評估資料
      serachKey: "", //病歷搜尋欄
      model: "", //list初選值
      selectUser: [] //目前選擇病歷
      // nowday: dayjs().format("YYYY-MM-DD"), //日期暫存
      // nowmonth: dayjs().format("YYYY-MM"), //日期暫存
    };
  },

  computed: {
    searchfilter() {
      var keys = this.serachKey.split(" ");
      var str = "";

      return keys.reduce(function(prev, element) {
        return prev.filter(item => {
          str = JSON.stringify(item).toUpperCase();
          if (str.includes(element.toUpperCase())) {
            return item;
          }
        });
      }, this.items);
    },
    nutritionfilter() {
      //取出指定病歷的評估單
      return this.NutritionItems.filter(item => {
        // return item.u_snkey == this.selectUser.snkey;
        if (item.u_snkey == this.selectUser.snkey) {
          item["p_code"] = this.selectUser.p_code;
          item["name"] = this.selectUser.name;
          item["sex"] = this.selectUser.sex;
          item["birthday"] = this.selectUser.birthday;
          item["height"] = this.selectUser.height;
          // item["weight"] = this.selectUser.weight;
          item["hadadisease"] = this.selectUser.hadadisease;
          item["bed_name"] = this.selectUser.bed_name;
          return item;
        }
      });
    },
    checkedNutritionfilter() {
      //取出己選取的評估單
      var i = this.NutritionItems.filter(item => {
        return item.check == true;
      });
      return this.sortBybedname(i);
    }
  },

  mounted() {
    // this.auth = this.$store.state.pData;
    this.getAllData();
    this.getNutrition();
  },

  methods: {
    goNutrition() {
      this.$router.push("/main/document/nutritionlist");
    },
    sortBybedname(items) {
      //病歷依床號排序
      return items.sort(function(a, b) {
        var a = a.bed_name;
        var b = b.bed_name;

        if (a === b) {
          return 0;
        } else if (a === null) {
          return 1;
        } else if (b === null) {
          return -1;
        } else {
          return a > b ? 1 : -1;
        }
      });
    },
    getAllData() {
      console.log("取得所有病歷資料");
      //取得所有病歷資料
      //this.$store.commit("setLoadingOn"); //讀取畫面on
      //取得所有資料
      this.axios
        .post("user/getAll/" + this.$store.state.databaseName)
        .then(rs => {
          this.items = rs.data;
          this.items = this.sortBybedname(this.items);
          // this.$store.commit("setLoadingOff"); //讀取畫面off
        });
    },
    getNutrition() {
      console.log("取得所有營養評估單資料");
      //取得所有營養評估單資料
      //this.$store.commit("setLoadingOn"); //讀取畫面on
      this.axios
        .post("general/getAll/" + this.$store.state.databaseName + "/nutrition")
        .then(rs => {
          // console.log(rs.data)
          this.NutritionItems = rs.data.map(item => {
            item["check"] = "";
            return item;
          });
          // this.$store.commit("setLoadingOff"); //讀取畫面off
        });
    },
    getUserAccounting(item) {
      //取得點選的病歷資料 -> 顯示指定病歷的營養評估資料
      this.selectUser = item;
    },
    printConfirm() {
      //判斷確認列印
      this.$confirm("確認顯示列印畫面?").then(res => {
        if (res) {
          // let routeData = this.$router.resolve({ path: '/reportpreview', query: {  id: id } });
          sessionStorage.setItem("printData", JSON.stringify(this.checkedNutritionfilter));
          let routeData = this.$router.resolve({
            path: "/print/nutritionmultiprint"
          });
          window.open(routeData.href, "_blank");
        }
      });
    }
  }
};
</script>


<style lang="scss">
.nutritionprintmanage {
  h2 {
    span {
      vertical-align: middle;
    }
  }
  thead {
    th {
      font-size: 1rem;
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