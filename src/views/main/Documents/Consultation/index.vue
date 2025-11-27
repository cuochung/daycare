<template>
  <div class="ConsultationList">
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
              <span>轉介照會單</span>
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

              <!-- <v-btn class="mx-1 primary" @click.stop="goPrint">
                多筆列印頁面
                <v-icon class="mx-1">mdi-printer</v-icon>
              </v-btn> -->
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
                    <thead style="background-color: #e3f2fd">
                      <tr>
                        <th></th>
                        <th>預照會人員</th>
                        <th>照會原因及狀況 [照會人員] {日期}</th>

                        <th>專業照會回覆 [照會人員] {日期}</th>

                        <th>追蹤處理</th>
                        <th>處理者簽名</th>
                        <th>日期</th>
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
                              <v-list-item @click="print(item)">
                                <v-list-item-title>列印</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </td>
                        <td>{{ rebuild_persons(item) }}</td>
                        <td>{{ rebuild_result(item) }}</td>
                        <td>{{ rebuild_personResponse(item) }}</td>
                        <td>{{ item.track_response }}</td>
                        <td>{{ item.track_name }}</td>
                        <td>{{ item.track_name_date }}</td>
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

    <!-- <pre>{{items}}</pre> -->
  </div>
</template>

<script>
import qs from "qs";
import popupadd from "@/views/document/ConsultationAdd";
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
      itemsPerPage: 10,
    };
  },
  mounted() {
    this.getAllData();
  },
  methods: {
    // goPrint() {
    //   this.$router.push("/main/printmanager/nutritionprintmanage");
    // },
    getAllData() {
      var postData = {
        key: "u_snkey",
        value: this.$store.state.uData.snkey,
      };

      //取得所有資料
      //this.$store.commit("setLoadingOn"); //讀取畫面on
      this.axios
        .post(
          "general/getByKey/" +
            this.$store.state.databaseName +
            "/consultation",
          qs.stringify(postData)
        )
        .then((rs) => {
          this.items = this.viewData = rs.data.map((item) => {
            let newItem = JSON.parse(item.datalist);
            newItem.snkey = item.snkey;
            newItem.u_snkey = item.u_snkey;
            newItem.create_man = item.create_man;
            newItem.edit_man = item.edit_man;
            return newItem;
          });
          // this.$store.commit("setLoadingOff"); //讀取畫面off
          this.sortBy();
        });
    },
    sortBy() {
      //依name排序
      this.viewData = this.viewData.sort(function (a, b) {
        return parseInt(a.date) < parseInt(b.date) ? 1 : -1;
      });
    },
    edit(item) {
      //修改功能
      this.$refs.editProcess.$emit("fromParent", item);
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
          tablename: "consultation",
          info: JSON.stringify(delData),
        };

        if (res) {
          this.axios
            .post(
              "general/delv3/" + this.$store.state.databaseName + "/consultation",
              qs.stringify(postData)
            )
            .then((rs) => {
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
    print(item) {
      //列印功能
      // sessionStorage.setItem("printData", JSON.stringify(item));
      let routeData = this.$router.resolve({path: "/print/consultationprint",query:{data:JSON.stringify(item)}});
      window.open(routeData.href, "_blank");
    },
    search() {
      var searchArr = this.serachKey.split(" ");
      var outputitems = [...this.items];
      var str = "";
      searchArr.forEach((key) => {
        if (key != "") {
          outputitems = outputitems.filter((item) => {
            str = JSON.stringify(item).toUpperCase();
            if (str.includes(key.toUpperCase())) {
              return item;
            }
          });
        }
      });
      this.viewData = outputitems;
    },
    //構築照會人員
    rebuild_persons(item) {
      let msg = "";
      if (item.doctor) {
        msg += " 醫生";
      }
      if (item.nutritionist) {
        msg += " 營養師";
      }
      if (item.socialworker) {
        msg += " 社工";
      }
      if (item.rehabilitation) {
        msg += " 物理治療師";
      }
      if (item.attendant) {
        msg += " 照服員";
      }
      if (item.otherworker) {
        msg += " 其他";
      }
      if (item.otherworker && item.otherworker_content) {
        msg += ":" + item.otherworker_content;
      }

      return msg;
    },
    //構築照會原因
    rebuild_result(item) {
      let msg = "";
      if (item.result1 && item.result1_content) {
        msg += " 精神及行為異常:" + item.result1_content;
      }
      if (item.result2 && item.result2_content) {
        msg += " 健康狀況異常:" + item.result2_content;
      }
      if (item.result3 && item.result3_content) {
        msg += " 日常生活無法自理:" + item.result3_content;
      }
      if (item.result4 && item.result4_content) {
        msg += " 肢體功能退化:" + item.result4_content;
      }
      if (item.result5 && item.result5_content) {
        msg += " 疑自殺意圖:" + item.result5_content;
      }
      if (item.result6 && item.result6_content) {
        msg += " 服藥不合作:" + item.result6_content;
      }
      if (item.result7 && item.result7_content) {
        msg += " 營養狀況異常:" + item.result7_content;
      }
      if (item.result8 && item.result8_content) {
        msg += " 其他:" + item.result8_content;
      }

      if (item.nurse_name) {
        msg += " [護理人員:" + item.nurse_name + "]";
      }
      if (item.nurse_name_date) {
        msg += " {日期:" + item.nurse_name_date + "}";
      }

      return msg;
    },
    //構築照會回覆
    rebuild_personResponse(item) {
      let msg = "";
      if (item.doctor_response) {
        msg += " 醫師照會回覆:" + item.doctor_response;
      }
      if (item.doctor_name) {
        msg += " [照會人員:" + item.doctor_name + "]";
      }
      if (item.doctor_name_date) {
        msg += " {日期:" + item.doctor_name_date + "}";
      }

      if (item.nutritionist_response) {
        msg += " 營養師照會回覆:" + item.nutritionist_response;
      }
      if (item.nutritionist_name) {
        msg += " [照會人員:" + item.nutritionist_name + "]";
      }
      if (item.nutritionist_name_date) {
        msg += " {日期:" + item.nutritionist_name_date + "}";
      }

      if (item.socialworker_response) {
        msg += " 社工照會回覆:" + item.socialworker_response;
      }
      if (item.socialworker_name) {
        msg += " [照會人員:" + item.socialworker_name + "]";
      }
      if (item.socialworker_name_date) {
        msg += " {日期:" + item.socialworker_name_date + "}";
      }

      if (item.rehabilitation_response) {
        msg += " 物理治療師照會回覆:" + item.rehabilitation_response;
      }
      if (item.rehabilitation_name) {
        msg += " [照會人員:" + item.rehabilitation_name + "]";
      }
      if (item.rehabilitation_name_date) {
        msg += " {日期:" + item.rehabilitation_name_date + "}";
      }

      if (item.attendant_response) {
        msg += " 照服員照會回覆:" + item.attendant_response;
      }
      if (item.attendant_name) {
        msg += " [照會人員:" + item.attendant_name + "]";
      }
      if (item.attendant_name_date) {
        msg += " {日期:" + item.attendant_name_date + "}";
      }

      if (item.otherworker_response) {
        msg +=
          " 其他人員(" +
          item.otherworker_content +
          ")照會回覆:" +
          item.otherworker_response;
      }
      if (item.otherworker_name) {
        msg += " [照會人員:" + item.otherworker_name + "]";
      }
      if (item.otherworker_name_date) {
        msg += " {日期:" + item.otherworker_name_date + "}";
      }

      return msg;
    },
  },
};
</script>


<style lang="scss">
.ConsultationList {
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