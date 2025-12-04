<template>
  <div class="medicineprint">
    <!-- 顯示名字切換按鈕 -->
    <!-- <div class="show-name-toggle no-print">
      <v-btn :class="isShowName ? 'grey' : 'primary'" @click="toggleShowName" class="mb-2">
        {{ isShowName ? '隱藏操作者' : '顯示操作者' }}
      </v-btn>
    </div> -->
    <div>
      <!-- 上半月 :key="'page'+i" 這個是因為不這樣寫在key索引上會報錯誤-->
      <div v-for="(page, i) in Math.ceil(filterUpMedicine().length / perPageItemsPrintSet)" :key="'page1' + i">
        <table class="form_title text-nowrap py-0 my-0" style="border:2px #000000 solid;" width="100%">
          <thead>
            <tr>
              <th style="border:0px" :colspan="upMonth + 2">
                <h3>{{ cData.company_name }}</h3>

                <div class="text-center">
                  <h1>
                    <strong>{{ printMonth }} 月 給藥紀錄單</strong>
                  </h1>
                </div>
              </th>
            </tr>
          </thead>

          <tbody v-for="(list, index) in printPageSet(page, 'up')" :key="index" style="border:1px #000000 solid;">
            <tr v-if="printTitle(index)">
              <th :colspan="upMonth + 2" class="usermsg py-0" style="border:2px #000000 solid;">
                <v-row>
                  <v-col cols="3" class="py-0">姓名: {{ uData.name }}</v-col>
                  <v-col cols="3" class="py-0">病歷號: {{ uData.p_code }}</v-col>
                  <v-col cols="3" class="py-0">床號: {{ uData.bed_name }}</v-col>
                  <v-col cols="3" class="text-right py-0">第{{ Math.ceil(index / perPageItemsPrintSet) + 1 }}頁 /
                    共{{ Math.ceil(filterUpMedicine().length / perPageItemsPrintSet) }}頁 /
                    共{{ filterUpMedicine().length }}筆</v-col>
                  <v-col cols="12" class="py-0">藥物過敏: {{ uData.allergyhistory2 }}</v-col>
                </v-row>
              </th>
            </tr>

            <tr class="text-center" v-if="printTitle(index)">
              <th style="border:2px #000000 solid;width:20%" class="align-middle">藥名及用藥資訊</th>
              <th style="border:2px #000000 solid;" class="align-middle">日期</th>
              <th style="border:2px #000000 solid;" v-for="index in upMonth" :key="index">
                {{ index }}
                <br />
                {{ showWeek(index) }}
              </th>
            </tr>

            <tr v-if="reprint(index, printPageSet(page, 'up'))" class="medicinename">
              <td style="border:1px #000000 solid;" :colspan="upMonth + 2">
                <strong>【{{ list.medical.hospital_name }}-{{ list.medical.branch_name }}
                  醫師:{{ list.medical.doctor_name }}】</strong>
              </td>
            </tr>

            <tr>
              <td style="border:1px #000000 solid;">
                <v-row>
                  <v-col cols="6" class="medicinename py-0 my-0">{{ list.name }} {{ checkRepeat(list) }}</v-col>
                  <v-col cols="6" class="text-right py-0 my-0 medicinedetail">{{ list.dosage }}</v-col>
                  <v-col cols="2" class="py-0 my-0 medicinedetail">{{ list.eat_medicine_time.name }} </v-col>
                  <v-col cols="10" class="text-right py-0 my-0 medicinedetail">{{ list.method_name }} / {{ list.quantity
                    }}
                    {{ list.unit_name }} / {{ returnEatMedicineTime(list) }}</v-col>
                  <v-col cols="12" class="py-0 my-0 medicinedetail">用藥期間:{{ list.start_date }}~{{ list.end_date
                    }}</v-col>
                </v-row>
              </td>

              <td class="text-center" style="border:1px #000000 solid;">
                <div class="text-center" style="margin-bottom:1px;">早</div>
                <div class="text-center" style="margin-bottom:1px;">中</div>
                <div class="text-center" style="margin-bottom:1px;">晚</div>
                <div class="text-center">睡前</div>
              </td>

              <td style="border:1px #000000 solid;" v-html="checkMediceTime(index, list)" v-for="index in upMonth"
                :key="index">
              </td>
            </tr>
          </tbody>

          <tbody class="footer" style="border:1px #000000 solid;" v-if="printPageSet(page, 'up').length > 0">
            <tr v-for="index in (perPageItemsPrintSet - printPageSet(page, 'up').length)" :key="index">
              <td style="border:1px #000000 solid;"></td>
              <td style="border:1px #000000 solid;">
                <div class="text-center" style="margin-bottom:1px;">早</div>
                <div class="text-center" style="margin-bottom:1px;">中</div>
                <div class="text-center" style="margin-bottom:1px;">晚</div>
                <div class="text-center">睡前</div>
              </td>
              <td style="border:1px #000000 solid;" v-for="index in upMonth" :key="index"></td>
            </tr>

            <tr>
              <td rowspan="4" style="border:1px #000000 solid;">
                <v-row class="medicinename">
                  <v-col cols="8">
                    禁食 N 檢查E
                    <br />手術 OP 拒絕X
                    <br />外出 O 睡眠S
                    <br />暫停 * 住院A
                  </v-col>
                  <v-col cols="4" class="text-right">
                    簽
                    <br />
                    <br />
                    <br />名
                  </v-col>
                </v-row>

                <br />
              </td>
              <td style="border:1px #000000 solid;" class="text-center align-middle">早</td>
              <td v-for="index in upMonth" :key="index" style="border:1px #000000 solid;"></td>
            </tr>
            <tr>
              <td style="border:1px #000000 solid;" class="text-center align-middle">中</td>
              <td v-for="index in upMonth" :key="index" style="border:1px #000000 solid;"></td>
            </tr>
            <tr>
              <td style="border:1px #000000 solid;" class="text-center align-middle">晚</td>
              <td v-for="index in upMonth" :key="index" style="border:1px #000000 solid;"></td>
            </tr>
            <tr>
              <td style="border:1px #000000 solid;" class="text-center align-middle">睡前</td>
              <td v-for="index in upMonth" :key="index" style="border:1px #000000 solid;"></td>
            </tr>
          </tbody>
        </table>

        <p style="page-break-after:always"></p>
      </div>

      <!-- 下半月 -->
      <div v-for="(page, i) in Math.ceil(filterDownMedicine().length / perPageItemsPrintSet)" :key="'page2' + i">
        <table class="form_title text-nowrap py-0 my-0" style="border:2px #000000 solid;" width="100%">
          <thead>
            <tr>
              <th style="border:0px" :colspan="(lastDay - 15) + 2">
                <h3>{{ cData.company_name }}</h3>

                <div class="text-center">
                  <h1>
                    <strong>{{ printMonth }} 月 給藥紀錄單</strong>
                  </h1>
                </div>
              </th>
            </tr>
          </thead>

          <tbody v-for="(list, index) in printPageSet(page, 'down')" :key="index" style="border:1px #000000 solid;">
            <tr v-if="printTitle(index)">
              <th :colspan="(lastDay - 15) + 2" class="usermsg py-0" style="border:2px #000000 solid;">
                <v-row>
                  <v-col cols="3" class="py-0">姓名: {{ uData.name }}</v-col>
                  <v-col cols="3" class="py-0">病歷號: {{ uData.p_code }}</v-col>
                  <v-col cols="3" class="py-0">床號: {{ uData.bed_name }}</v-col>
                  <v-col cols="3" class="text-right py-0">第{{ Math.ceil(index / perPageItemsPrintSet) + 1 }}頁 /
                    共{{ Math.ceil(filterDownMedicine().length / perPageItemsPrintSet) }}頁 /
                    共{{ filterDownMedicine().length }}筆</v-col>
                  <v-col cols="12" class="py-0">藥物過敏: {{ uData.allergyhistory2 }}</v-col>
                </v-row>
              </th>
            </tr>

            <tr class="text-center" v-if="printTitle(index)">
              <th style="border:2px #000000 solid;width:20%" class="align-middle">藥名及用藥資訊</th>
              <th style="border:2px #000000 solid;" class="align-middle">日期</th>
              <th style="border:2px #000000 solid;" v-for="index in (lastDay - 15)" :key="index">
                {{ index + 15 }}
                <br />
                {{ showWeek(index + 15) }}
              </th>
            </tr>

            <tr v-if="reprint(index, printPageSet(page, 'down'))" class="medicinename">
              <td style="border:1px #000000 solid;" :colspan="(lastDay - 15) + 2">
                <strong>【{{ list.medical.hospital_name }}-{{ list.medical.branch_name }}
                  醫師:{{ list.medical.doctor_name }}】</strong>
              </td>
            </tr>

            <tr>
              <td style="border:1px #000000 solid;">
                <v-row>
                  <v-col cols="6" class="medicinename py-0 my-0">{{ list.name }} {{ checkRepeat(list) }}</v-col>
                  <v-col cols="6" class="text-right py-0 my-0 medicinedetail">{{ list.dosage }}</v-col>
                  <v-col cols="2" class="py-0 my-0 medicinedetail">{{ list.eat_medicine_time.name }}
                    <!-- [{{ list.eat_medicine_time.time }}] -->
                  </v-col>
                  <v-col cols="10" class="text-right py-0 my-0 medicinedetail">{{ list.method_name }} / {{ list.quantity
                    }}
                    {{ list.unit_name }} / {{ returnEatMedicineTime(list) }}</v-col>
                  <v-col cols="12" class="py-0 my-0 medicinedetail">用藥期間:{{ list.start_date }}~{{ list.end_date
                    }}</v-col>
                </v-row>
              </td>

              <td class="text-center" style="border:1px #000000 solid;">
                <div class="text-center" style="margin-bottom:1px;">早</div>
                <div class="text-center" style="margin-bottom:1px;">中</div>
                <div class="text-center" style="margin-bottom:1px;">晚</div>
                <div class="text-center">睡前</div>
              </td>

              <td style="border:1px #000000 solid;" v-html="checkMediceTime(index + 15, list)"
                v-for="index in (lastDay - 15)" :key="index">
              </td>
            </tr>
          </tbody>

          <tbody class="footer" style="border:1px #000000 solid;" v-if="printPageSet(page, 'down').length > 0">
            <tr v-for="index in (perPageItemsPrintSet - printPageSet(page, 'down').length)" :key="index">
              <td style="border:1px #000000 solid;"></td>
              <td style="border:1px #000000 solid;">
                <div class="text-center" style="margin-bottom:1px;">早</div>
                <div class="text-center" style="margin-bottom:1px;">中</div>
                <div class="text-center" style="margin-bottom:1px;">晚</div>
                <div class="text-center">睡前</div>
              </td>
              <td style="border:1px #000000 solid;" v-for="index in (lastDay - 15)" :key="index"></td>
            </tr>

            <tr>
              <td rowspan="4" style="border:1px #000000 solid;">
                <v-row class="medicinename">
                  <v-col cols="8">
                    禁食 N 檢查E
                    <br />手術 OP 拒絕X
                    <br />外出 O 睡眠S
                    <br />暫停 * 住院A
                  </v-col>
                  <v-col cols="4" class="text-right">
                    簽
                    <br />
                    <br />
                    <br />名
                  </v-col>
                </v-row>

                <br />
              </td>
              <td style="border:1px #000000 solid;height:30px" class="text-center align-middle">早</td>
              <td v-for="index in (lastDay - 15)" :key="index" style="border:1px #000000 solid;"></td>
            </tr>
            <tr>
              <td style="border:1px #000000 solid;height:30px" class="text-center align-middle">中</td>
              <td v-for="index in (lastDay - 15)" :key="index" style="border:1px #000000 solid;"></td>
            </tr>
            <tr>
              <td style="border:1px #000000 solid;height:30px" class="text-center align-middle">晚</td>
              <td v-for="index in (lastDay - 15)" :key="index" style="border:1px #000000 solid;"></td>
            </tr>
            <tr>
              <td style="border:1px #000000 solid;height:30px" class="text-center align-middle">睡前</td>
              <td v-for="index in (lastDay - 15)" :key="index" style="border:1px #000000 solid;"></td>
            </tr>
          </tbody>
        </table>

        <p style="page-break-after:always"></p>
      </div>

      <!-- <pre>{{ items}}</pre> -->
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import "dayjs/locale/zh-tw";
// import api from "@/assets/js/api";

export default {
  data() {
    return {
      cData: {},
      pData: {},
      uData: {},
      items: [], //列印資料-藥單
      printMonth: "", //列印月份
      lastDay: "", //當月最後一日
      upMonth: 15, //設定上半月天數
      perPageItemsPrintSet: 10, //每頁列印筆數設定
      givenMap: {}, // 已給藥狀態表
      givenMapWithNames: {}, // 包含操作者名字的給藥狀態表
      loadingGivenStatus: false, // 載入給藥狀態中
      isShowName: false, // 是否顯示操作者名字
      styles: {
        timeCell: 'border:1px #000000 solid;margin-bottom:1px;cursor:pointer;',
        timeCellLast: 'border:1px #000000 solid;cursor:pointer;',
        checkmark: 'margin-left:3px;color:blue;font-weight:bold;',
        operatorName: 'font-size:1;color:#666;'
      }
    };
  },

  mounted() {
    this.cData = JSON.parse(sessionStorage.getItem("cData"));
    this.pData = JSON.parse(sessionStorage.getItem("pData"));
    this.uData = JSON.parse(sessionStorage.getItem("uData"));
    var printData = JSON.parse(sessionStorage.getItem("printData"));
    this.perPageItemsPrintSet = printData.printPerPage;
    this.items = printData.medicineData; //設定列印的藥物內容
    // console.log(this.items);
    this.printMonth = dayjs(printData.printMonth).format("YYYY-MM"); //設定列印的月份
    this.lastDay = dayjs(this.printMonth).endOf("month").format("DD"); //設定列印的最後一日

    // 載入已給藥狀態
    // this.loadGivenStatus();
  },

  methods: {
    //回傳用藥時間 類型
    returnEatMedicineTime(list) {
      if (list.eat_medicine_time.repeatWeek && list.eat_medicine_time.repeatWeek.length > 0) {
        return "每週:" + list.eat_medicine_time.repeatWeek
      } else if (list.eat_medicine_time.repeatDate && list.eat_medicine_time.repeatDate.length > 0) {
        return "每月:" + list.eat_medicine_time.repeatDate
      } else {
        return list.eat_medicine_time.day + " 天";
      }
    },
    // 產生唯一鍵：病歷號|醫令鍵|日期|時間
    makeKey(list, dateStr, timeStr) {
      const medKey = list.medical_snkey || list.medicine_snkey || "";
      return `${this.uData.p_code}|${medKey}|${dateStr}|${timeStr}`;
    },
    // 從資料庫載入已給藥狀態
    async loadGivenStatus() {
      try {
        this.loadingGivenStatus = true;
        console.log('開始載入給藥狀態...');
        console.log('搜尋條件:', {
          p_code: this.uData.p_code,
          print_month: this.printMonth
        });

        let searchKey = {
          key: `p_code='${this.uData.p_code}' AND print_month='${this.printMonth}'`,
        };
        let url = `general/searchByWhere/${this.$store.state.databaseName}/medicine_given_status`;

        const filteredData = await this.$api.options(url, searchKey)
        console.log('API 回應 (所有記錄):', filteredData);

        // const response = await this.$api.get('medicine_given_status');
        // console.log('API 回應 (所有記錄):', response);

        // 篩選出當前病患和月份的資料
        // const filteredData = response.filter(item => 
        //   item.p_code === this.uData.p_code && 
        //   item.print_month === this.printMonth
        // );
        // console.log('篩選後的資料:', filteredData);

        // 轉換為 givenMap 格式
        this.givenMap = {};
        this.givenMapWithNames = {};
        filteredData.forEach(item => {
          const key = `${item.p_code}|${item.medical_key}|${item.date}|${item.time}`;
          // 確保 is_given 值正確處理（1/0 或 true/false）
          this.givenMap[key] = item.is_given === 1 || item.is_given === true || item.is_given === '1';
          // 儲存包含操作者名字的資料
          this.givenMapWithNames[key] = {
            is_given: item.is_given === 1 || item.is_given === true || item.is_given === '1',
            lastEditMan: item.lastEditMan || ''
          };
        });

        console.log('載入已給藥狀態完成:', this.givenMap);
      } catch (error) {
        console.error('載入已給藥狀態失敗:', error);
        console.error('錯誤詳情:', {
          message: error.message,
          stack: error.stack,
          response: error.response
        });
        this.givenMap = {};
        // 可以顯示錯誤訊息給使用者
        this.$store.commit("snackbar", {
          msg: "載入給藥狀態失敗，請重新整理頁面",
          type: true,
          theme: "error"
        });
      } finally {
        this.loadingGivenStatus = false;
      }
    },

    isGiven(key) {
      const value = this.givenMap[key];
      // 處理數字 1/0 或布林值 true/false
      return value === 1 || value === true || value === '1';
    },

    // 儲存給藥狀態到資料庫
    async setGiven(key, val) {
      try {
        this.loadingGivenStatus = true;

        // 解析 key 取得資料
        const [p_code, medical_key, date, time] = key.split('|');

        // 準備 API 資料
        const apiData = {
          p_code: p_code,
          medical_key: medical_key,
          date: date,
          time: time,
          print_month: this.printMonth,
          is_given: val ? 1 : 0, // 儲存為數字 1/0
          updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          lastEditMan: this.pData.username
        };

        console.log('準備儲存給藥狀態:', apiData);

        // 檢查是否已存在記錄
        const existingRecord = await this.findExistingRecord(p_code, medical_key, date, time);
        console.log('找到現有記錄:', existingRecord);

        let result;
        if (existingRecord) {
          // 2025.10.8 調整為資料存在時，刪除
          console.log('刪除記錄:', apiData);
          let delData = {
            snkey: existingRecord.snkey,
            tablename: 'medicine_given_status',
            info: JSON.stringify(existingRecord),
          };
          result = await this.$api.delete('medicine_given_status', delData)

          // 更新現有記錄
          // const updateData = {
          //   ...apiData,
          //   snkey: existingRecord.snkey
          // };
          // console.log('更新記錄:', updateData);
          // result = await this.$api.post('medicine_given_status', updateData);
        } else {
          // 新增新記錄
          console.log('新增記錄:', apiData);
          result = await this.$api.add('medicine_given_status', apiData);
        }

        console.log('API 回應:', result);

        // 檢查 API 回應是否成功
        if (result && (result.code === 200 || result.state === true)) {
          console.log('儲存給藥狀態成功:', key, val);
          this.loadGivenStatus(); //重新載入狀態
        } else {
          console.error('API 回應失敗:', result);
          throw new Error(`API 回應失敗: ${JSON.stringify(result)}`);
        }

      } catch (error) {
        console.error('儲存給藥狀態失敗:', error);
        console.error('錯誤詳情:', {
          message: error.message,
          stack: error.stack,
          response: error.response
        });

        // 重新拋出錯誤，讓 onCellClick 可以處理回滾
        throw error;
      } finally {
        this.loadingGivenStatus = false;
      }
    },

    // 查找現有記錄
    async findExistingRecord(p_code, medical_key, date, time) {
      try {
        const response = await this.$api.get('medicine_given_status');
        console.log('查找記錄 - 搜尋條件:', { p_code, medical_key, date, time });
        console.log('查找記錄 - 所有記錄:', response);

        const found = response.find(item =>
          item.p_code === p_code &&
          item.medical_key === medical_key &&
          item.date === date &&
          item.time === time
        );

        console.log('查找記錄 - 找到的記錄:', found);
        return found;
      } catch (error) {
        console.error('查找現有記錄失敗:', error);
        return null;
      }
    },

    // async toggleGiven(key) {
    //   if (this.loadingGivenStatus) return; // 防止重複點擊

    //   const currentStatus = this.isGiven(key);
    //   const newStatus = !currentStatus;
    //   console.log('切換給藥狀態:', key, '從', currentStatus, '到', newStatus);

    //   await this.setGiven(key, newStatus);
    // },

    // 切換顯示操作者名字
    toggleShowName() {
      this.isShowName = !this.isShowName;
    },

    // 生成時間方塊 HTML
    generateTimeCellHtml(key, time, isLast = false) {
      const bg = this.isGiven(key) ? 'background-color:#c6f6d5;' : '';
      const checkmark = this.isGiven(key) ? `<span style="${this.styles.checkmark}">✓</span>` : '';

      // 名字只有在 is_given 為 1 且 isShowName 為 true 時才顯示
      const operatorName = (this.isGiven(key) && this.isShowName && this.givenMapWithNames[key] && this.givenMapWithNames[key].lastEditMan) ?
        `<br><small style="${this.styles.operatorName}">${this.givenMapWithNames[key].lastEditMan}</small>` : '';

      const cellStyle = isLast ? this.styles.timeCellLast : this.styles.timeCell;

      return `<div data-key="${key}" style="${cellStyle}${bg}" class="text-center">${time}${checkmark}${operatorName}</div>`;
    },

    // 事件委派：點擊任何有 data-key 的區塊就切換
    onCellClick(e) {
      if (this.loadingGivenStatus) return; // 載入中時不處理點擊

      const el = e.target.closest('[data-key]');
      if (!el) return;
      const key = el.getAttribute('data-key');
      if (!key) return;

      // 立即更新視覺狀態（樂觀更新）
      const currentStatus = this.isGiven(key);
      const newStatus = !currentStatus;

      // 先更新本地狀態和視覺
      this.$set(this.givenMap, key, newStatus);
      if (newStatus) {
        el.style.backgroundColor = '#c6f6d5';
      } else {
        el.style.backgroundColor = '';
      }

      // 然後同步到資料庫
      this.setGiven(key, newStatus).catch((error) => {
        // 如果 API 失敗，回滾本地狀態
        console.error('API 失敗，回滾狀態:', error);
        this.$set(this.givenMap, key, currentStatus);
        if (currentStatus) {
          el.style.backgroundColor = '#c6f6d5';
        } else {
          el.style.backgroundColor = '';
        }
        this.$store.commit("snackbar", {
          msg: "儲存給藥狀態失敗，請重試",
          type: true,
          theme: "error"
        });
      });
    },
    //判斷目前使用中的藥物是否有重覆
    checkRepeat(list) {
      // console.log(list)
      var matchData = this.items.filter((i) => {
        return (
          i.medical_snkey != list.medical_snkey &&
          i.medicine_snkey == list.medicine_snkey
        );
      });

      if (matchData.length > 0) {
        // console.log(list.start_day,matchData[0].end_date);
        if (
          list.start_date < matchData[0].end_date &&
          matchData[0].start_date < list.end_date
        ) {
          return "[*]";
        }
      }
    },
    //取得符合資料中(helf判斷->上半月up,下半月down),第N頁的資料
    printPageSet(page, helf) {
      if (helf == "up") {
        var pageData = this.filterUpMedicine();
      } else {
        var pageData = this.filterDownMedicine();
      }

      return pageData.filter((i, index) => {
        if (
          index >= (page - 1) * this.perPageItemsPrintSet &&
          index < page * this.perPageItemsPrintSet
        ) {
          // console.log(page, helf,i)
          return i;
        }
      });
    },
    // 排序函數：按照醫院、科別、醫生、snkey排序
    sortByHospitalBranchDoctor(matchs) {
      return matchs.sort((a, b) => {
        const medicalA = a.medical || {};
        const medicalB = b.medical || {};
        
        // 首先按照醫院排序
        const hospitalA = medicalA.hospital_snkey || medicalA.hospital_name || '';
        const hospitalB = medicalB.hospital_snkey || medicalB.hospital_name || '';
        if (hospitalA !== hospitalB) {
          return hospitalA > hospitalB ? 1 : -1;
        }

        // 如果醫院相同，按照科別排序
        const branchA = medicalA.branch_snkey || medicalA.branch_name || '';
        const branchB = medicalB.branch_snkey || medicalB.branch_name || '';
        if (branchA !== branchB) {
          return branchA > branchB ? 1 : -1;
        }

        // 如果醫院和科別都相同，按照醫生排序
        const doctorA = medicalA.doctor_name || '';
        const doctorB = medicalB.doctor_name || '';
        if (doctorA !== doctorB) {
          return doctorA > doctorB ? 1 : -1;
        }

        // 如果醫院、科別和醫生都相同，按照 snkey 由小到大排序
        const snkeyA = a.snkey || a.medical_snkey || a.medicine_snkey || (medicalA.snkey) || 0;
        const snkeyB = b.snkey || b.medical_snkey || b.medicine_snkey || (medicalB.snkey) || 0;
        const numA = parseInt(snkeyA, 10) || 0;
        const numB = parseInt(snkeyB, 10) || 0;
        if (numA !== numB) {
          return numA > numB ? 1 : -1;
        }

        // 如果都相同，保持原順序
        return 0;
      });
    },
    filterUpMedicine() {
      let items = this.items; // 列印資料-藥單
      let matchs = [];

      // 1. 一般型資料；隔幾日用藥的情況
      items.forEach((list) => {
        if (list.eat_medicine_time && list.eat_medicine_time.day && list.eat_medicine_time.day != '0') {
          let startDay = dayjs(list.start_date).format("YYYY-MM-DD");
          let endDay = dayjs(list.end_date).format("YYYY-MM-DD");

          // 判斷用藥期間是否與上半月 (1~15日) 有交集
          if (dayjs(endDay).isBefore(dayjs(this.printMonth).format("YYYY-MM-" + (this.upMonth + 1)))) {
            // 結束日在15日或之前，整個用藥期間都在上半月
            matchs.push(list);
          } else if (dayjs(startDay).isAfter(dayjs(this.printMonth).format("YYYY-MM-" + this.upMonth))) {
            // 開始日在16日之後，整個用藥期間都在下半月，不加入
          } else {
            // 用藥期間跨越上下半月，加入
            matchs.push(list);
          }
        }
      });

      // 2. 用藥時間類型為每月幾日的情況
      items.forEach((list) => {
        if (list.eat_medicine_time && list.eat_medicine_time.repeatDate && list.eat_medicine_time.repeatDate.length > 0) {
          let dateArr = list.eat_medicine_time.repeatDate.split(',').map(d => parseInt(d, 10));
          // 判斷 repeatDate 的日期有沒有在 1~15 之間
          for (let d of dateArr) {
            if (d >= 1 && d <= this.upMonth) {
              if (!matchs.includes(list)) {
                matchs.push(list);
              }
            }
          }
        }
      });

      // 3. 用藥時間類型為星期幾的情況
      items.forEach((list) => {
        if (list.eat_medicine_time && list.eat_medicine_time.repeatWeek && list.eat_medicine_time.repeatWeek.length > 0) {
          let weekArr = list.eat_medicine_time.repeatWeek.split(',').map(w => parseInt(w, 10));
          let startDay = dayjs(list.start_date).format("YYYY-MM-DD");
          let endDay = dayjs(list.end_date).format("YYYY-MM-DD");

          for (let d = 1; d <= this.upMonth; d++) {
            let thisDay = dayjs(this.printMonth).format("YYYY-MM-" + d);
            if (dayjs(thisDay).isBetween(startDay, endDay, null, '[]')) {
              let thisWeek = dayjs(thisDay).day() === 0 ? 7 : dayjs(thisDay).day(); // 0(日) -> 7
              if (weekArr.includes(thisWeek)) {
                if (!matchs.includes(list)) {
                  matchs.push(list);
                }
              }
            }
          }
        }
      });

      // console.log('filterUpMedicine 結果:', matchs);

      // 按照醫院、科別、醫生排序
      const sorted = this.sortByHospitalBranchDoctor(matchs);
      return sorted.reverse(); // 反轉順序
    },
    //取得符合1-15日
    // filterUpMedicine() {
    //   let matchs = this.items.filter((list) => {
    //     if (
    //       dayjs(list.start_date).format("YYYY-MM-DD") <=
    //       // dayjs(this.printMonth).format("YYYY-MM-" + lastday) ||
    //       dayjs(this.printMonth).format("YYYY-MM-" + 15) ||
    //       (dayjs(list.end_date).format("YYYY-MM") ==
    //         dayjs(this.printMonth).format("YYYY-MM") &&
    //         dayjs(list.end_date).format("YYYY-MM-DD") <=
    //         // dayjs(this.printMonth).format("YYYY-MM-" + lastday))
    //         dayjs(this.printMonth).format("YYYY-MM-" + 15))
    //     ) {
    //       return list;
    //     }
    //   });

    //   console.log('filterUpMedicine 結果:', matchs);
    //   // 判斷月份類別的資料
    //   // matchs = matchs.filter((list) => {
    //   //   // 用藥時間類型
    //   //   if ((list.eat_medicine_time.repeatDate && list.eat_medicine_time.repeatDate.length > 0)) {
    //   //     console.log('list.eat_medicine_time.repeatDate:', list);
    //   //     if ((list.eat_medicine_time.day && list.eat_medicine_time.day.length > 0)){
    //   //       return list;
    //   //     }
    //   //     // 判斷 repeatDate 的日期有沒有在 1~15 之間
    //   //     let dateArr = list.eat_medicine_time.repeatDate.split(',').map(d => parseInt(d, 10));
    //   //     for (let d of dateArr) {
    //   //       if (d >= 1 && d <= 15) {
    //   //         return list;
    //   //       }
    //   //     }
    //   //   }
    //   // });

    //   console.log('matchs 結果:', matchs);
      

    //   return matchs
    // },
    //取得符合15日-月底的資料
    filterDownMedicine(){
      let items = this.items; //列印資料-藥單
      let matchs = []

      //1. 一般型資料；隔幾日用藥的情況
      items.forEach((list) => {
        if (list.eat_medicine_time && list.eat_medicine_time.day && list.eat_medicine_time.day != '0') {
          let startDay = dayjs(list.start_date).format("YYYY-MM-DD");
          let endDay = dayjs(list.end_date).format("YYYY-MM-DD");
  
          // 判斷用藥期間是否與下半月有交集
          if (dayjs(startDay).isAfter(dayjs(this.printMonth).format("YYYY-MM-" + this.upMonth))) {
            // 用藥開始日在16日之後，整個用藥期間都在下半月
            matchs.push(list);
          } else if (dayjs(endDay).isBefore(dayjs(this.printMonth).format("YYYY-MM-" + (this.upMonth + 1)))) {
            // 用藥結束日在15日之前，整個用藥期間都在上半月，不加入
          } else {
            // 用藥期間跨越上下半月，加入
            matchs.push(list);
          }
        }
      });
      

      //2. 用藥時間類型為每月幾日的情況b
      items.forEach((list) => {
        if (list.eat_medicine_time && list.eat_medicine_time.repeatDate && list.eat_medicine_time.repeatDate.length > 0) {
          // 取得 repeatDate 陣列
          let dateArr = list.eat_medicine_time.repeatDate.split(',').map(d => parseInt(d, 10));
          // 判斷 repeatDate 的日期有沒有在16~月底之間
          for (let d of dateArr) {
            if (d >= (this.upMonth + 1) && d <= parseInt(this.lastDay, 10)) {
              // 如果 matchData 中還沒有這筆資料，才加入
              if (!matchs.includes(list)) {
                matchs.push(list);
              }
            }
          }
        }
      });

      //3 用藥時間類型為星期幾的情況
      items.forEach((list) => {
        if (list.eat_medicine_time && list.eat_medicine_time.repeatWeek && list.eat_medicine_time.repeatWeek.length > 0) {
          // 取得 repeatWeek 陣列
          let weekArr = list.eat_medicine_time.repeatWeek.split(',').map(w => parseInt(w, 10));
          // 判斷用藥期間內是否有在16~月底之間的該星期
          let startDay = dayjs(list.start_date).format("YYYY-MM-DD");
          let endDay = dayjs(list.end_date).format("YYYY-MM-DD");
          for (let d = 16; d <= parseInt(this.lastDay, 10); d++) {
            let thisDay = dayjs(this.printMonth).format("YYYY-MM-" + d);
            if (dayjs(thisDay).isBetween(startDay, endDay, null, '[]')) {
              let thisWeek = dayjs(thisDay).day() === 0 ? 7 : dayjs(thisDay).day(); // 0(日) -> 7
              if (weekArr.includes(thisWeek)) {
                // 如果 matchData 中還沒有這筆資料，才加入
                if (!matchs.includes(list)) {
                  matchs.push(list);
                }
              }
            }
          }
        }
      });

      // console.log('filterDownMedicine 結果:', matchs);

      // 按照醫院、科別、醫生排序
      const sorted = this.sortByHospitalBranchDoctor(matchs);
      return sorted.reverse(); // 反轉順序
    },
    // filterDownMedicine() {
    //   // return this.items;
    //   // var lastDay = dayjs(this.printMonth).endOf("Month").format("DD");

    //   let matchs = this.items.filter((list) => {
    //     if (
    //       dayjs(list.start_date).format("YYYY-MM-DD") >=
    //       dayjs(this.printMonth).format("YYYY-MM-" + 16) ||
    //       // dayjs(list.end_date).format("YYYY-MM") == dayjs(this.printMonth).format("YYYY-MM")
    //       dayjs(list.end_date).format("YYYY-MM-DD") >=
    //       dayjs(this.printMonth).format("YYYY-MM-" + 16)
    //     ) {
    //       return list;
    //     }
    //   });

    //   console.log('filterDownMedicine 結果:', matchs);
    //   // 判斷月份類別的資料
    //   // matchs = matchs.filter((list) => {
    //   //   // 用藥時間類型
    //   //   if (list.eat_medicine_time.repeatDate && list.eat_medicine_time.repeatDate.length > 0) {
    //   //     //判斷 repeatDate 的日期有沒有在16~月底之間
    //   //     let dateArr = list.eat_medicine_time.repeatDate.split(',').map(d => parseInt(d, 10));
    //   //     for (let d of dateArr) {
    //   //       if (d >= 16 && d <= parseInt(this.lastDay, 10)) {
    //   //         return list;
    //   //       }
    //   //     }
    //   //   }
    //   // });

    //   // console.log('matchs 結果:', matchs);
    //   return matchs
    // },
    //顯示星期
    showWeek(index) {
      var theDay = dayjs(this.printMonth).format("YYYY-MM" + index);
      return dayjs(theDay).locale("zh-tw").format("dddd").substr(2, 1);
    },
    printTitle(index) {
      if (index % this.perPageItemsPrintSet == 0) {
        return true;
      } else {
        return false;
      }
    },
    printFooter(index) {
      if (index % this.perPageItemsPrintSet == this.perPageItemsPrintSet - 1) {
        return true;
      } else {
        return false;
      }
    },
    //是否列印醫院的設定
    reprint(index, items) {
      // console.log(items);
      if (index == 0) {
        return true;
      } else {
        // if (items[index].medical.snkey == items[index - 1].medical.snkey) {
        if (
          items[index].medical.hospital_snkey ==
          items[index - 1].medical.hospital_snkey &&
          items[index].medical.branch_snkey ==
          items[index - 1].medical.branch_snkey
        ) {
          return false;
        } else {
          return true;
        }
      }
    },
    checkWeekRepeat(index, list) {
      // 計算當日日期
      let thisDay = dayjs(this.printMonth).format("YYYY-MM-" + index);
      thisDay = dayjs(thisDay).format("YYYY-MM-DD");

      let startDay = dayjs(list.start_date).format("YYYY-MM-DD");
      let endDay = dayjs(list.end_date).format("YYYY-MM-DD");

      // 不在範圍內直接返回空白
      if (thisDay < startDay || thisDay > endDay) return "　";

      // 將 repeatWeek 轉成數字陣列
      let weekArr = list.eat_medicine_time.repeatWeek.split(',').map(w => parseInt(w, 10));
      let thisWeek = dayjs(thisDay).day() === 0 ? 7 : dayjs(thisDay).day(); // 0(日) -> 7

      // 如果當日星期不在指定用藥星期，直接返回空白
      if (!weekArr.includes(thisWeek)) return "　";

      // 取得當日用藥時間陣列
      let timeArr = list.eat_medicine_time.time.split(",");
      let lastprintTime = list.medicineEndInfo.split(":")[2];

      let showTime = { 0: "<div>　</div>", 1: "<div>　</div>", 2: "<div>　</div>", 3: "<div>　</div>" };

      if (timeArr.length >= 5) {
        // 每日用藥 5 次以上，直接順序列印
        let start = (thisDay === startDay) ? "" : "runPrint";
        timeArr.forEach(i => {
          if (thisDay === startDay && i == list.start_time) start = "runPrint";
          if (start === "runPrint") {
            const key = this.makeKey(list, thisDay, i);
            showTime[0] += this.generateTimeCellHtml(key, i); // 多於5次的集中列印到 showTime[0]
          }
        });
        return showTime[0];
      } else {
        // 每日用藥少於5次，依時間段列印
        timeArr.forEach(i => {
          if (parseInt(i) <= 9 && parseInt(i) > 0) showTime[0] = this.generateTimeCellHtml(this.makeKey(list, thisDay, i), i);
          if (parseInt(i) >= 10 && parseInt(i) <= 15) showTime[1] = this.generateTimeCellHtml(this.makeKey(list, thisDay, i), i);
          if (parseInt(i) >= 16 && parseInt(i) <= 20) showTime[2] = this.generateTimeCellHtml(this.makeKey(list, thisDay, i), i);
          if (parseInt(i) >= 21) showTime[3] = this.generateTimeCellHtml(this.makeKey(list, thisDay, i), i, true);
        });
        return `${showTime[0]}${showTime[1]}${showTime[2]}${showTime[3]}`;
      }
    },
    checkDateRepeat(index, list) {
      // 計算當日日期
      let thisDay = dayjs(this.printMonth).format("YYYY-MM-" + index);
      thisDay = dayjs(thisDay).format("YYYY-MM-DD");

      let startDay = dayjs(list.start_date).format("YYYY-MM-DD");
      let endDay = dayjs(list.end_date).format("YYYY-MM-DD");

      // 不在範圍內直接返回空白
      if (thisDay < startDay || thisDay > endDay) return "　";

      // 將 repeatDate 轉成數字陣列 (日期)
      let dateArr = list.eat_medicine_time.repeatDate.split(',').map(d => parseInt(d, 10));
      let thisDate = dayjs(thisDay).date();

      // 如果當日日期不在指定用藥日期，直接返回空白
      if (!dateArr.includes(thisDate)) return "　";

      // 取得當日用藥時間陣列
      let timeArr = list.eat_medicine_time.time.split(",");
      let lastprintTime = list.medicineEndInfo.split(":")[2];

      let showTime = { 0: "<div>　</div>", 1: "<div>　</div>", 2: "<div>　</div>", 3: "<div>　</div>" };

      if (timeArr.length >= 5) {
        // 每日用藥 5 次以上，直接順序列印
        let start = (thisDay === startDay) ? "" : "runPrint";
        timeArr.forEach(i => {
          if (thisDay === startDay && i == list.start_time) start = "runPrint";
          if (start === "runPrint") {
            const key = this.makeKey(list, thisDay, i);
            showTime[0] += this.generateTimeCellHtml(key, i); // 多於5次的集中列印到 showTime[0]
          }
        });
        return showTime[0];
      } else {
        // 每日用藥少於5次，依時間段列印
        timeArr.forEach(i => {
          if (parseInt(i) <= 9 && parseInt(i) > 0) showTime[0] = this.generateTimeCellHtml(this.makeKey(list, thisDay, i), i);
          if (parseInt(i) >= 10 && parseInt(i) <= 15) showTime[1] = this.generateTimeCellHtml(this.makeKey(list, thisDay, i), i);
          if (parseInt(i) >= 16 && parseInt(i) <= 20) showTime[2] = this.generateTimeCellHtml(this.makeKey(list, thisDay, i), i);
          if (parseInt(i) >= 21) showTime[3] = this.generateTimeCellHtml(this.makeKey(list, thisDay, i), i, true);
        });
        return `${showTime[0]}${showTime[1]}${showTime[2]}${showTime[3]}`;
      }
    },
    //判斷給藥時間及當日是否需要列印的日期
    checkMediceTime(index, list) {
      // console.log(index, list)
      //判斷是否為每周重覆
      if (list.eat_medicine_time.repeatWeek && list.eat_medicine_time.repeatWeek.length > 0) {
        // console.log('check week repeat')
        return this.checkWeekRepeat(index, list);
      }

      if (list.eat_medicine_time.repeatDate && list.eat_medicine_time.repeatDate.length > 0) {
        //判斷是否為每月重覆
        // console.log('check date repeat')
        return this.checkDateRepeat(index, list);
      }

      // console.log('original')
      var thisDay = dayjs(this.printMonth).format("YYYY-MM-" + index);
      thisDay = dayjs(thisDay).format("YYYY-MM-DD");

      var startDay = dayjs(list.start_date).format("YYYY-MM-DD");
      var endDay = dayjs(list.end_date).format("YYYY-MM-DD");

      if (thisDay >= startDay && thisDay <= endDay) {
        //判斷是否為每日用藥 or 多日用藥
        if (
          dayjs(dayjs(thisDay) - dayjs(startDay).add(1, "day")).format("DD") % list.eat_medicine_time.day == 0
          || dayjs(thisDay) - dayjs(startDay) == 0
        ) {
          var timeArr = list.eat_medicine_time.time.split(",");
          var lastprintTime = list.medicineEndInfo.split(":")[2];

          //判斷每日用藥數超過5以上的狀況
          if (timeArr.length >= 5) {
            //每日用藥5次以上的列印
            console.log(timeArr, list.start_time, lastprintTime);
            var showTime = "";
            var start = "";

            //判斷是不是第一天使用藥物
            if (thisDay == startDay) {
              //第一天使用藥物
              timeArr.forEach((i) => {
                if (i == list.start_time) {
                  start = "runPrint";
                }

                if (start == 'runPrint') {
                  const key = this.makeKey(list, thisDay, i);
                  showTime += this.generateTimeCellHtml(key, i);
                }
              });
            } else {
              //判斷是不是最後一天
              if (thisDay == endDay) {
                //最後一天
                var stop = false;
                timeArr.forEach((i) => {
                  if (!stop) {
                    if (i == list.start_time) {
                      stop = true;
                    } else {
                      const key = this.makeKey(list, thisDay, i);
                      showTime += this.generateTimeCellHtml(key, i);
                    }

                  }
                });
              } else {
                //當日正常列印
                timeArr.forEach((i) => {
                  const key = this.makeKey(list, thisDay, i);
                  showTime += this.generateTimeCellHtml(key, i);
                });
              }
            }

            return showTime;


          } else {
            //正常列印
            var showTime = {
              0: "<div>　</div>",
              1: "<div>　</div>",
              2: "<div>　</div>",
              3: "<div>　</div>",
            };
            // console.log(list.medicineEndInfo);

            //判斷是不是第一天使用藥物
            if (thisDay == startDay) {
              // console.log(thisDay, timeArr, list.start_time);
              var start = "";
              timeArr.forEach((i) => {
                if (i == list.start_time) {
                  start = "runPrint";
                }

                if (start == "runPrint") {
                  if (parseInt(i) <= 9 && parseInt(i) > 0) {
                    const key = this.makeKey(list, thisDay, i);
                    showTime[0] = this.generateTimeCellHtml(key, i);
                  }
                  if (parseInt(i) >= 10 && parseInt(i) <= 15) {
                    const key = this.makeKey(list, thisDay, i);
                    showTime[1] = this.generateTimeCellHtml(key, i);
                  }
                  if (parseInt(i) >= 16 && parseInt(i) <= 20) {
                    const key = this.makeKey(list, thisDay, i);
                    showTime[2] = this.generateTimeCellHtml(key, i);
                  }
                  if (parseInt(i) >= 21) {
                    const key = this.makeKey(list, thisDay, i);
                    showTime[3] = this.generateTimeCellHtml(key, i, true); // 最後一個沒有 margin-bottom
                  }
                }
              });
            } else {
              var stop = "";
              //判斷是不是用藥的最後一天
              if (thisDay == endDay) {
                timeArr.filter((i) => {
                  // console.log('this:'+thisDay,'last day:'+i)
                  if (parseInt(i) <= 9 && parseInt(i) > 0) {
                    const key = this.makeKey(list, thisDay, i);
                    showTime[0] = this.generateTimeCellHtml(key, i);
                    if (i == lastprintTime) {
                      // console.log('早',i,lastprintTime)
                      return (stop = true);
                    } //判斷這個是最後列印時間,後面不再判斷
                  }

                  if (stop) {
                    return;
                  }

                  if (parseInt(i) >= 10 && parseInt(i) <= 15) {
                    const key = this.makeKey(list, thisDay, i);
                    showTime[1] = this.generateTimeCellHtml(key, i);
                    if (i == lastprintTime) {
                      // console.log('中',i,lastprintTime)
                      return (stop = true);
                    } //判斷這個是最後列印時間,後面不再判斷
                  }

                  if (stop) {
                    return;
                  }

                  if (parseInt(i) >= 16 && parseInt(i) <= 20) {
                    const key = this.makeKey(list, thisDay, i);
                    showTime[2] = this.generateTimeCellHtml(key, i);
                    if (i == lastprintTime) {
                      // console.log('晚',i,lastprintTime)
                      return (stop = true);
                    } //判斷這個是最後列印時間,後面不再判斷
                  }

                  if (stop) {
                    return;
                  }

                  if (parseInt(i) >= 21) {
                    const key = this.makeKey(list, thisDay, i);
                    showTime[3] = this.generateTimeCellHtml(key, i, true); // 最後一個沒有 margin-bottom
                  }
                  // console.log('this')
                });
                // console.log(showTime);
              } else {
                //目前只判斷了每天用藥,隔天用藥的未判斷
                timeArr.filter((i) => {
                  if (parseInt(i) <= 9 && parseInt(i) > 0) {
                    const key = this.makeKey(list, thisDay, i);
                    showTime[0] = this.generateTimeCellHtml(key, i);
                  }
                  if (parseInt(i) >= 10 && parseInt(i) <= 15) {
                    const key = this.makeKey(list, thisDay, i);
                    showTime[1] = this.generateTimeCellHtml(key, i);
                  }
                  if (parseInt(i) >= 16 && parseInt(i) <= 20) {
                    const key = this.makeKey(list, thisDay, i);
                    showTime[2] = this.generateTimeCellHtml(key, i);
                  }
                  if (parseInt(i) >= 21) {
                    const key = this.makeKey(list, thisDay, i);
                    showTime[3] = this.generateTimeCellHtml(key, i, true); // 最後一個沒有 margin-bottom
                  }
                });
              }
            }

            return `${showTime[0]}${showTime[1]}${showTime[2]}${showTime[3]}`;

          }

        }
      } else {
        //不列印
        return "　";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "node_modules/bootstrap/scss/bootstrap";
@import "node_modules/bootstrap-vue/src/index.scss";

.medicineprint {
  position: relative;

  .show-name-toggle {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
  }

  .form_title {
    font-size: 1rem;
    font-family: "微軟正黑體";

    .usermsg {
      font-size: 1.2rem;
    }
  }

  .medicinename {
    font-size: 1.4rem;
  }

  .medicinedetail {
    font-size: 1.2rem;
  }

  th {
    width: 35px;
  }

  td {
    padding: 2px;
  }

  .footer {
    tr {
      height: 60px;
    }
  }
}

@media print {
  .medicineprint {
    line-height: 22px;

    .form_title {
      font-size: 1rem;
      font-family: "微軟正黑體";

      .usermsg {
        font-size: 1.2rem;
      }
    }

    .medicinename {
      font-size: 1.4rem;
    }

    .medicinedetail {
      font-size: 1.2rem;
    }

    th {
      width: 35px;
    }

    td {
      padding: 2px;
    }

    .footer {
      tr {
        height: 60px;
      }
    }


    @page {
      size: A4 portrait;
      margin: 0cm;
      padding: 0cm;
    }
  }
}
</style>