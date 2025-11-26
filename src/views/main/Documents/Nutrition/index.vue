<template>
  <div class="nutritionlist">
    <v-card class="mt-2">
      <v-card-title>
        <v-row>
          <v-col cols="12" md="8">
            <h2 class="subheading grey--text">
              <v-icon class="mx-1">fas fa-file-alt</v-icon>
              <span>
                {{this.$store.state.uData.p_code}} /
                {{this.$store.state.uData.name}}
              </span>
              <span>營養評估單</span>
            </h2>
          </v-col>
          <v-col cols="12" md="4">
            <!-- 功能表 -->
            <v-toolbar dense>
              <v-text-field
                hide-details
                prepend-icon="mdi-magnify"
                single-line
                label="搜尋"
                v-model="serachKey"
                @keyup.stop="search()"
              ></v-text-field>

              <popupadd
                :viewData="viewData"
                @getAllData="getAllData"
                ref="editProcess"
                v-model="edititem"
              ></popupadd>

              <v-btn class="mx-1 primary" @click.stop="goPrint">
                多筆列印頁面
                <v-icon class="mx-1">mdi-printer</v-icon>
              </v-btn>
            </v-toolbar>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-card class="mt-2">
          <v-card-text>
            <!-- 表單內容 -->
            <v-data-iterator
              :items="viewData"
              :items-per-page.sync="itemsPerPage"
              :footer-props="{ itemsPerPageOptions }"
            >
              <template v-slot:default="props">
                <v-simple-table fixed-header class="mt-2 text-no-wrap">
                  <template v-slot:default>
                    <thead style="background-color: #e3f2fd;">
                      <tr>
                        <th></th>
                        <th>評估日期</th>
                        <th>活動狀況</th>
                        <th>體重</th>
                        <th>BMI</th>
                        <th>食慾</th>
                        <th>飲食質地</th>
                        <th>進食方式</th>
                        <th>飲食處方</th>
                        <th>熱量(Kcal)</th>
                        <th>醣類(%)</th>
                        <th>醣類(g)</th>
                        <th>蛋白質(%)</th>
                        <th>蛋白質(g)</th>
                        <th>脂肪(%)</th>
                        <th>脂肪(g)</th>
                        <th>營養建議</th>
                        <th v-if="$store.state.cData.isShowCreaterName">紀錄人姓名</th>
                        <th v-if="$store.state.cData.isShowCreaterInfo">紀錄人紀錄</th>
                        <th v-if="$store.state.cData.isShowEditerInfo">修改紀錄</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item,index) in props.items" :key="index">
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
                              <!-- <v-list-item @click="print(item)">
                                <v-list-item-title>
                                  <router-link
                                    :to="{name:'nutritionprint'}"
                                    target="_blank"
                                    style="text-decoration:none;"
                                  >列印</router-link>
                                </v-list-item-title>
                              </v-list-item> -->
                            </v-list>
                          </v-menu>
                        </td>
                        <td>{{item.date}}</td>
                        <td>{{item.action}}</td>
                        <td>{{item.weight}}</td>
                        <td>{{item.bmi}}</td>
                        <td>{{item.appetite}}</td>
                        <td>{{item.texture}}</td>
                        <td>{{item.eat}}</td>
                        <td>{{item.dietprescription}}</td>
                        <td>{{item.kcal}}</td>
                        <td>{{item.carbohydrate}}</td>
                        <td>{{item.carbohydrate_g}}</td>
                        <td>{{item.protein}}</td>
                        <td>{{item.protein_g}}</td>
                        <td>{{item.fat}}</td>
                        <td>{{item.fat_g}}</td>
                        <td>{{item.suggest}}</td>
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

    <!-- <pre>{{viewData}}</pre> -->
  </div>
</template>

<script>
import qs from "qs";
import popupadd from "@/views/document/NutritionAdd";
import dayjs from "dayjs";

export default {
  components: { popupadd },
  data() {
    return {
      items: [], //目前讀取進來的資料庫
      viewData: [], //顯示的資料
      serachKey: "",
      edititem: {}, //修改中資料
      itemsPerPageOptions: [10, 20, 30],
      itemsPerPage: 10
    };
  },
  mounted() {
    this.getAllData();
  },
  methods: {
    goPrint() {
      this.$router.push("/main/printmanager/nutritionprintmanage");
    },
    getAllData() {
      var postData = {
        key: "u_snkey",
        value: this.$store.state.uData.snkey
      };

      //取得所有資料
      //this.$store.commit("setLoadingOn"); //讀取畫面on
      this.axios
        .post(
          "general/getByKey/" + this.$store.state.databaseName + "/nutrition",
          qs.stringify(postData)
        )
        .then(rs => {
          // console.log(rs.data)
          this.items = this.viewData = rs.data;
          // this.$store.commit("setLoadingOff"); //讀取畫面off
          this.sortBy();
        });
    },
    sortBy() {
      //依name排序
      this.viewData = this.viewData.sort(function(a, b) {
        return parseInt(a.date) < parseInt(b.date) ? 1 : -1;
      });
    },
    edit(item) {
      //修改功能
      this.edititem = item;
      this.$refs.editProcess.$emit("fromParent");
    },
     del(delData) {
      //刪除功能
      this.$confirm("確認刪除?").then(res => {
        delData.delman =
          this.$store.state.pData.username +
          "(" +
          dayjs().format("YYYY-MM-DD HH:mm:ss") +
          ")";
        var postData = {
          snkey:delData.snkey,
          tablename:'nutrition',
          info: JSON.stringify(delData),
        };

        if (res) {
          this.axios
            .post(
              "general/delv3/" + this.$store.state.databaseName + "/nutrition",
              qs.stringify(postData)
            )
            .then(rs => {
              // console.log(rs.data);
              if (rs.data.state == 1) {
                var pop = { msg: "已刪除", type: true, theme: "success" };
                this.$store.commit("snackbar", pop);
                this.getAllData();
              }
            });
        }
      });
    },
    //2022.1.9 棄用;暫時都以多筆列印頁面取代
    // print(item) {
    //   //列印功能
    //   sessionStorage.setItem("printData", JSON.stringify(item));
    // },
    search() {
      var searchArr = this.serachKey.split(" ");
      var outputitems = [...this.items];
      var str = "";
      searchArr.forEach(key => {
        if (key != "") {
          outputitems = outputitems.filter(item => {
            str = JSON.stringify(item).toUpperCase();
            if (str.includes(key.toUpperCase())) {
              return item;
            }
          });
        }
      });
      this.viewData = outputitems;
    }
  }
};
</script>


<style lang="scss">
.nutritionlist {
  h2 {
    span {
      vertical-align: middle;
    }
  }
  thead {
    th {
      font-size: 1.2rem;
      font-family: "微軟正黑體";
      color: red;
    }
  }
  tbody {
    td {
      font-size: 1rem;
    }
  }
}
</style>