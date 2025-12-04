import store from '@/store';  //直接引用vuex中的store內容
import dayjs from 'dayjs';
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);


var PDVFn = {
  //回傳當月需要的資料OBJ 跌倒fallevent
  returnMonthDataFallEvent(analysisItems, month) {
    // console.log(4,PDVFn.returnMonthPDV(this.setMonth));
    let LivingManCounts = this.returnMonthPDV(month);
    return {
      a: LivingManCounts,
      b: analysisItems.filter((i) => i.Date.includes(month)).length,
      b1: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.reason.includes("因住民健康狀況")
      ).length,
      b2: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.reason.includes("因治療或藥物反應")
      ).length,
      b3: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.reason.includes("因環境中危險因子")
      ).length,
      b4: analysisItems.filter(
        (i) =>
          i.Date.includes(month) && i.reason.includes("因其他因素")
      ).length,
      c: analysisItems.filter(
        (i) => i.Date.includes(month) && i.hurt != "無"
      ).length,
      c1: analysisItems.filter(
        (i) => i.Date.includes(month) && i.hurt == "1級"
      ).length,
      c2: analysisItems.filter(
        (i) => i.Date.includes(month) && i.hurt == "2級"
      ).length,
      c3: analysisItems.filter(
        (i) => i.Date.includes(month) && i.hurt == "3級"
      ).length,
      d: analysisItems.filter((i) => i.Date.includes(month)).length,
      e: analysisItems.filter(
        (i) => i.Date.includes(month) && i.counts == ">1次"
      ).length,
    };
  },

  //壓力性損傷 PressureEvent
  returnMonthDataPressureEvent(analysisItems, month) {
    // console.log(4,PDVFn.returnMonthPDV(this.setMonth));
    let LivingManCounts = this.returnMonthPDV(month);
    return {
      a: LivingManCounts,
      //b值 測量當日有壓力性損傷住民人數 -> OKDate(癒合日期)值不存在表示還沒好
      b: analysisItems.filter((i) => !i.OKDate).length,
      b1: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.hurtlv.includes("1級")
      ).length,
      b2: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.hurtlv.includes("2級")
      ).length,
      b3: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.hurtlv.includes("3級")
      ).length,
      b4: analysisItems.filter(
        (i) =>
          i.Date.includes(month) && i.hurtlv.includes("4級")
      ).length,
      b5: analysisItems.filter(
        (i) =>
          i.Date.includes(month) && i.hurtlv.includes("無法分級")
      ).length,
      b6: analysisItems.filter(
        (i) =>
          i.Date.includes(month) && i.hurtlv.includes("深部組織")
      ).length,
      b7: analysisItems.filter(
        (i) =>
          i.Date.includes(month) && i.hurtlv.includes("黏膜層")
      ).length,
      c: LivingManCounts,
      d: analysisItems.filter((i) => i.Date.includes(month)).length,
    };
  },

  //感染指標 InfectionEvent ; matchpipelineItems為有使用導尿管類的紀錄.要另外處理
  returnMonthDataInfectionEvent(analysisItems, month, matchpipelineItems) {
    // console.log(4,PDVFn.returnMonthPDV(this.setMonth));
    let LivingManCounts = this.returnMonthPDV(month);
    let data = {
      a: LivingManCounts,
      //b值 測量當日有感染住民人數 -> OKDate(癒合日期)值不存在表示還沒好
      b: analysisItems.filter((i) => i.Date.includes(month) && !i.OKDate).length,
      c: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.part == "呼吸道感染"
      ).length,
      c1: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.part.includes("下呼吸道感染")
      ).length,
      d: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.part.includes("泌尿道感染")
      ).length,
      d1: this.returnMonthPDVForPipeline(month, matchpipelineItems),
      // d2: LivingManCounts - this.returnMonthPDVForPipeline(month, matchpipelineItems),
      d3: analysisItems.filter(
        //1.取得指定月份中,有泌尿道感染的資料
        (i) =>
          i.Date.includes(month) &&
          i.part.includes("泌尿道感染")
      ).filter(i => {
        //2.在1的資料中.比對管路資料裡有match的user
        let match = matchpipelineItems.filter(pItem => {
          return pItem.u_snkey == i.userData.snkey
        })
        //3.match的資料中.有沒有符合指定月份的;例如:開始2022-01-21 ~結束 2022-02-04 ;那就就包含在一月跟二月都符合;只要有一筆符合就算
        let MonthLastDay = dayjs(month).daysInMonth(); //取得指定月份最後一日

        let finded = match.find(mi => {
          for (let day = 1; day <= MonthLastDay ; day++) {
            if (dayjs(month + '-' + day).isBetween(mi.start_date, mi.end_day, null, '[]')) {
              return true
            }
          }
        })
        if (finded){return i}

      }).length,
      e: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.part.includes("皮膚感染")
      ).length,
      e1: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.part.includes("皮膚及軟組織感染(蜂窩性組織炎/軟組織/傷口感染)")
      ).length,
      e2: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.part.includes("疥瘡感染")
      ).length,
      f: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.part.includes("腸胃道感染")
      ).length,


    };
    //額外處理
    data.d2 = LivingManCounts - data.d1;
    data.d4 = data.d - data.d3 

    return data;
  },
  //輸入月份 -> 回傳每月導尿管使用人日數
  returnMonthPDVForPipeline(month, matchpipelineItems) {
    let MonthLastDay = dayjs(month).daysInMonth(); //取得指定月份最後一日

    let DayPDV = []; //設定指定月份人日數陣列
    for (let day = 1; day <= MonthLastDay; day++) {
      DayPDV.push({
        day: day,
        value: this.pipeline_used_day(month, day, matchpipelineItems).length,
      });
    }
    return DayPDV.reduce((total, i) => {
      return (total += parseInt(i.value));
    }, 0);
  },
  //取得指定月份,指定日的導尿管使用人日數
  pipeline_used_day(month, day, matchpipelineItems) {
    const thisDay = dayjs(month).format("YYYY-MM-" + day);
    let matchData = matchpipelineItems.filter((i) => {
      return (
        dayjs(thisDay).format("YYYY-MM-DD") >=
        dayjs(i.start_day).format("YYYY-MM-DD") &&
        (dayjs(thisDay).format("YYYY-MM-DD") <=
          dayjs(i.end_day).format("YYYY-MM-DD") ||
          i.end_day == "0000-00-00")
      );
    });

    //判斷是否住院中 -> 住院中就不算人日數
    // matchData = matchData.filter((i, index) => {
    //   let findData = store.state.behospitalizedItems.find((j) => {
    //     return i.u_snkey === j.u_snkey;
    //   });

    //   if (findData) {
    //     if (
    //       dayjs(thisDay).format("YYYY-MM-DD") >=
    //       dayjs(findData.start_day).format("YYYY-MM-DD") &&
    //       (dayjs(thisDay).format("YYYY-MM-DD") <=
    //         dayjs(findData.end_day).format("YYYY-MM-DD") ||
    //         findData.end_day == "0000-00-00")
    //     ) {
    //       // count++;
    //       // console.log(count,dayjs(thisDay).format("YYYY-MM-DD"),i.uname,"hospital", findData);
    //     } else {
    //       return i;
    //     }
    //   } else {
    //     return i;
    //   }
    // });

    return matchData;
  },

  //回傳當月需要的資料OBJ 約束 ConstraintEvent
  returnMonthDataConstraintEvent(analysisItems, month) {
    let LivingManCounts = this.returnMonthPDV(month);
    return {
      a: LivingManCounts,
      b: analysisItems.filter((i) => i.Date.includes(month)).length,
      c1: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.reason.includes("預防跌倒")
      ).length,
      c2: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.reason.includes("預防自拔管路")
      ).length,
      c3: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.reason.includes("預防自傷")
      ).length,
      c4: analysisItems.filter(
        (i) =>
          i.Date.includes(month) && i.reason.includes("行為紊亂")
      ).length,
      c5: analysisItems.filter(
        (i) =>
          i.Date.includes(month) && i.reason.includes("協助治療(短期)")
      ).length,
      c6: analysisItems.filter(
        (i) =>
          i.Date.includes(month) && i.reason.includes("其他")
      ).length,
      e: analysisItems.filter(
        (i) => i.Date.includes(month) && i.equipmentArrs.length > 1
      ).length,
      f: analysisItems.filter(
        (i) => i.Date.includes(month) && i.releaseOK
      ).length,
      
    };
  },

  //回傳當月需要的資料OBJ 非計畫性轉急性住院事件 UnplannedEvent
  returnMonthDataUnplannedEvent(analysisItems, month) {
    let LivingManCounts = this.returnMonthPDV(month);
    let livingNewCounts = this.returnMonthNew(month);
    return {
      a: this.getbed_used_day(month, 5).length,  //依每月五日為基準
      b: analysisItems.filter((i) => i.Date.includes(month)).length,
      c: LivingManCounts,
      d: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          !i.unplanned
      ).length,
      e: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.unplanned
      ).length,
      f: livingNewCounts,
      g: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.livein72hour
      ).length,
      h: analysisItems.filter(
        (i) =>
          i.Date.includes(month) &&
          i.unplanned
      ).length,
      i1: analysisItems.filter(
        (i) =>
          i.Date.includes(month) && i.reason &&
          i.reason.includes("因心血管代償機能減退")
      ).length,
      i2: analysisItems.filter(
        (i) =>
          i.Date.includes(month) && i.reason && 
          i.reason.includes("因骨折之治療或評估")
      ).length,
      i3: analysisItems.filter(
        (i) =>
          i.Date.includes(month) && i.reason &&
          i.reason.includes("因腸胃道出血")
      ).length,
      i4: analysisItems.filter(
        (i) =>
          i.Date.includes(month) && i.reason &&
          i.reason.includes("因感染")
      ).length,
      i5: analysisItems.filter(
        (i) =>
          i.Date.includes(month) && i.reason &&
          i.reason.includes("因其他內外科原因")
      ).length,
      
    };
  },

  //輸入月份 -> 回傳每月人日數
  returnMonthPDV(month) {
    let MonthLastDay = dayjs(month).daysInMonth(); //取得指定月份最後一日

    let DayPDV = []; //設定指定月份人日數陣列
    for (let day = 1; day <= MonthLastDay; day++) {
      DayPDV.push({
        day: day,
        value: this.getbed_used_day(month, day).length,
      });
    }
    return DayPDV.reduce((total, i) => {
      return (total += parseInt(i.value));
    }, 0);
  },
  //取得指定月份,指定日的人日數
  getbed_used_day(month, day) {
    const thisDay = dayjs(month).format("YYYY-MM-" + day);

    let matchData = store.state.bed_usedItems.filter((i) => {
      return (
        dayjs(thisDay).format("YYYY-MM-DD") >=
        dayjs(i.start_day).format("YYYY-MM-DD") &&
        (dayjs(thisDay).format("YYYY-MM-DD") <=
          dayjs(i.end_day).format("YYYY-MM-DD") ||
          i.end_day == "0000-00-00")
      );
    });

    //判斷是否住院中 -> 住院中就不算人日數
    return matchData.filter((i, index) => {
      let findData = store.state.behospitalizedItems.find((j) => {
        return i.u_snkey === j.u_snkey;
      });

      if (findData) {
        if (
          dayjs(thisDay).format("YYYY-MM-DD") >=
          dayjs(findData.start_day).format("YYYY-MM-DD") &&
          (dayjs(thisDay).format("YYYY-MM-DD") <=
            dayjs(findData.end_day).format("YYYY-MM-DD") ||
            findData.end_day == "0000-00-00")
        ) {
          // count++;
          // console.log(count,dayjs(thisDay).format("YYYY-MM-DD"),i.uname,"hospital", findData);
        } else {
          return i;
        }
      } else {
        return i;
      }
    });
  },
  //輸入月份 -> 回傳每月人日數
  returnMonthNew(month) {
    let MonthLastDay = dayjs(month).daysInMonth(); //取得指定月份最後一日

    let DayPDV = []; //設定指定月份人日數陣列
    for (let day = 1; day <= MonthLastDay; day++) {
      DayPDV.push({
        day: day,
        value: this.getnew(month, day).length,
      });
    }
    return DayPDV.reduce((total, i) => {
      return (total += parseInt(i.value));
    }, 0);
  },
  //取得每日新住民數
  getnew(month,day) {
    const thisDay = dayjs(month).format("YYYY-MM-" + day);
    return store.state.bed_usedItems.filter((i) => (
        dayjs(thisDay).format("YYYY-MM-DD") ==
        dayjs(i.start_day).format("YYYY-MM-DD")
      )
    );
  },

  
}

export default PDVFn;