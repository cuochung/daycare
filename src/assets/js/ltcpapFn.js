//衛福部相關 function
import api from '@/assets/js/api'
import store from '@/store';  //直接引用vuex中的store內容
import dayjs from 'dayjs'

var ltcpapFn = {
  //上傳資料到衛福部 -> 紀錄成功的ticket (單筆式)
  pushToMOHW(postItem, useDataBase, jsonfile) {
    return new Promise((resolve, reject) => {
      // resolve(false);
      if (store.state.cData.sKEY && store.state.cData.aID) {
        var SecretKey = store.state.cData.sKEY;
        var id = store.state.cData.aID;
      } else {
        let pop = {
          msg: "衛福部授權碼不合法,請重新確認!!",
          type: true,
          theme: "warning",
        };
        store.commit("snackbar", pop);
        resolve(false);
      }
      let url = `${store.state.mohw_url}/Evaluation`;

      // test server info
      // url = `http://114.34.167.172:49153/NursingHome/API/nhcApi/Evaluation`;
      if (store.state.mohw_url.includes('NursingHome')) {
        SecretKey = "ApEy6o08+Ij3lCK/c+JSA55aSMarOb";
      }
      // SecretKey = "ApEy6o08+Ij3lCK/c+JSA55aSMarOb";
      // id = "7405310211";
      // test server info end

      let postData = {
        url: url,
        SecretKey: SecretKey,
        AGENCY_ID: id,
        jsonfile: jsonfile,
      };

      api.options("posttoapi/postjson", postData).then((rs) => {
        console.log('pushToMOHW', rs);
        // let newRs = JSON.parse(rs);
        if (rs.code == 200) {
          postItem.uploadData = rs;
          if (postItem.uploadState) { delete postItem.uploadState }

          let updateData = {
            snkey: postItem.snkey,
            datalist: JSON.stringify(postItem),
            edit_man: "pass",
          };
          api.options("general/edit/" + store.state.databaseName + "/" + useDataBase, updateData)
            .then((rs) => {
              if (rs.state == 1) {
                let pop = { msg: "上傳成功!", type: true, theme: "success" };
                store.commit("snackbar", pop);
                resolve(true)
                // this.getAllData();
              }
            });
        }
      });

    });
  },
  //判斷上傳到衛福部的狀態
  // checkMOHWData(postItem, useDataBase, showMsg = true) {
  //   return new Promise((resolve, reject) => {
  //     let SecretKey = store.state.cData.sKEY;
  //     let id = store.state.cData.aID;
  //     let url = `${store.state.mohw_url}/GetLogByTicket`;
  //     let formData = {
  //       ticket: postItem.uploadData.ticket,
  //     };

  //     // test server info
  //     // url = `http://114.34.167.172:49153/NursingHome/API/nhcApi/GetLogByTicket`;
  //     if (store.state.mohw_url.includes('NursingHome')) {
  //       SecretKey = "ApEy6o08+Ij3lCK/c+JSA55aSMarOb";
  //     }
  //     // SecretKey = "ApEy6o08+Ij3lCK/c+JSA55aSMarOb";
  //     // id = "7405310211";
  //     // test server info end

  //     let postData = {
  //       url: url,
  //       SecretKey: SecretKey,
  //       AGENCY_ID: id,
  //       formData: formData,
  //     };

  //     api.options("posttoapi/getlog", postData)
  //       .then((rs) => {
  //         console.log(rs)
  //         let newRs = rs;
  //         // let newRs = JSON.parse(rs);
  //         if (newRs.code == 200 && JSON.parse(newRs.data)[0].log_content.includes('一般全人評估處理完成')) {
  //           // console.log(postItem,'OK')
  //           //2024.3.20 加入顯示個別回傳資料內容;
  //           //由AlertMohwMessage.vue 統一顯示;
  //           //只要state.msgcontentItems裡,有資料就會自動顯示
  //           // let data = JSON.parse(newRs.data);
  //           // store.commit("setData", {
  //           //   tableName: "msgcontent",
  //           //   data: data,
  //           // });
  //           //2024.3.20 加入顯示個別回傳資料內容end

  //           postItem.uploadState = newRs;

  //           let updateData = {
  //             snkey: postItem.snkey,
  //             datalist: JSON.stringify(postItem),
  //             edit_man: "pass",
  //           };
  //           api.options("general/edit/" + store.state.databaseName + "/" + useDataBase, updateData)
  //             .then((rs) => {
  //               if (rs.state == 1) {
  //                 if (showMsg) {
  //                   let pop = { msg: "確認已上傳成功!", type: true, theme: "success" };
  //                   store.commit("snackbar", pop);
  //                 }
  //                 resolve(newRs)
  //               }
  //             });
  //         } else {
  //           // console.log(postItem, 'error')
  //           resolve(newRs)
  //           // if (showMsg) {
  //           //   let pop = {
  //           //     msg: "上傳未完成,請五分鐘後再確認!",
  //           //     type: true,
  //           //     theme: "warning",
  //           //   };
  //           //   store.commit("snackbar", pop);
  //           // }
  //         }

  //         let data = JSON.parse(newRs.data);
  //         store.commit("setData", {
  //           tableName: "msgcontent",
  //           data: data,
  //         });
  //       });

  //   })
  // },

  //指定api,上傳到衛福部 ;目前用到的api有 BaseData->個人資料 
  // async uploadtoMOHW(datas, mohwapi) {
  //   console.log('uploadtoMOHW', datas, mohwapi)
  //   if (store.state.cData.sKEY && store.state.cData.aID) {
  //     var SecretKey = store.state.cData.sKEY;
  //     var id = store.state.cData.aID;
  //   } else {
  //     let pop = {
  //       msg: "衛福部授權碼不合法,請重新確認!!",
  //       type: true,
  //       theme: "warning",
  //     };
  //     store.commit("snackbar", pop);
  //     return false;
  //   }
  //   let url = `${store.state.mohw_url}/${mohwapi}`;

  //   //路徑含 'NursingHome' 代表上傳的為測試機 SecretKey 切為測試機
  //   if (store.state.mohw_url.includes('NursingHome')) {
  //     SecretKey = "ApEy6o08+Ij3lCK/c+JSA55aSMarOb";
  //   }
  //   // test info zone
  //   // url = `http://114.34.167.172:49153/NursingHome/API/nhcApi/BaseData`;
  //   // id = "7405310211";
  //   // test info zone end

  //   let postData = {
  //     url: url,
  //     SecretKey: SecretKey,
  //     AGENCY_ID: id,
  //     jsonfile: JSON.stringify({ DataList: datas }),
  //   };

  //   return await api.options("posttoapi/postjson", postData).then((rs) => {
  //     console.log(rs);
  //     let newRs = rs;
  //     // let newRs = JSON.parse(rs);
  //     if (newRs.code == 200) {
  //       // alert("上傳成功!");
  //       let pop = {
  //         msg: "上傳成功!",
  //         type: true,
  //         theme: "success",
  //       };
  //       store.commit("snackbar", pop);
  //       // return true
  //       // }else{
  //       // return false
  //     }
  //     return newRs;
  //   });
  // },


  //建立各表單(陣列)JSON資料  
  //健康習慣評估表 json 檔
  returnHealthyHabitsJSON(postItems) {
    let dataArr = [];

    postItems.forEach(postItem => {
      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );
      if (findNurse && findNurse.idNum) {
        postItem.NurseID = findNurse.idNum;
      } else {
        postItem.NurseID = "N223456789";
      }

      // postItem.AssessmentNo = this.items.length; //目前資料筆數

      dataArr.push({
        "Date": postItem.Date,
        "NurseID": postItem.NurseID,
        "AssessmentNo": postItem.AssessmentNo,
        "IsSmoking": postItem.IsSmoking,
        "QuitSmoking": postItem.QuitSmoking ? postItem.QuitSmoking : 0,
        "BeforeSmoking": postItem.BeforeSmoking ? postItem.BeforeSmoking : 0,
        "SmokingYear": postItem.SmokingYear ? postItem.SmokingYear : 0,
        "IsAlcohol": postItem.IsAlcohol,
        "QuitAlcohol": postItem.QuitAlcohol ? postItem.QuitAlcohol : 0,
        "BeforequitAlcohol": postItem.BeforequitAlcohol ? postItem.BeforequitAlcohol : 0,
        "AlcoholYear": postItem.AlcoholYear ? postItem.AlcoholYear : 0,
        "IsBetelNut": postItem.IsBetelNut,
        "QuitBetelNut": postItem.QuitBetelNut ? postItem.QuitBetelNut : 0,
        "BeforequitBetelNut": postItem.BeforequitBetelNut ? postItem.BeforequitBetelNut : 0,
        "BetelNutYear": postItem.BetelNutYear ? postItem.BetelNutYear : 0,
        "IsAllergy": postItem.IsAllergy,
        "Allergy_Desc": postItem.Allergy_Desc ? postItem.Allergy_Desc : null,
        "IsAllergyDrug": postItem.IsAllergyDrug ? postItem.IsAllergyDrug : null,
        "AllergyDrug_Desc": postItem.AllergyDrug_Desc ? postItem.AllergyDrug_Desc : null
      })
    })

    return dataArr;
  },

  //建構 疾病史評估表 QC102 json檔
  returnMedicalHistoriesJSON(postItems, user) {
    let dataArr = [];

    postItems.forEach(postItem => {
      function returnVal(val) {
        if (val == '無') return 0
        if (val == '輕微') return 1
        if (val == '中等') return 2
        if (val == '重度') return 3
        if (val == '極重度') return 4
      }

      dataArr.push({
        "MAIN_ID": Number(user.id_num.replace(/\D/g, '')), //2025.4.23 只把身分證的英文去掉
        "ASSESSMENT_DT": dayjs(postItem.Date).format("YYYYMMDD"),
        "ASSESSMENT_USER": postItem.create_man.split('(')[0],
        "MAIN_DIAGNOSE": postItem.AnsOther_1,
        "SECOND_DIAGNOSE": postItem.AnsOther_2,
        "Q1": returnVal(postItem.qq1),
        "Q1_REMARK": "備註內容",
        "Q2": returnVal(postItem.qq2),
        "Q2_REMARK": "備註內容",
        "Q3": returnVal(postItem.qq3),
        "Q3_REMARK": "備註內容",
        "Q4": returnVal(postItem.qq4),
        "Q4_REMARK": "備註內容",
        "Q5": returnVal(postItem.qq5),
        "Q5_REMARK": "備註內容",
        "Q6": returnVal(postItem.qq6),
        "Q6_REMARK": "備註內容",
        "Q7": returnVal(postItem.qq7),
        "Q7_REMARK": "備註內容",
        "Q8": returnVal(postItem.qq8),
        "Q8_REMARK": "備註內容",
        "Q9": returnVal(postItem.qq9),
        "Q9_REMARK": "備註內容",
        "Q10": returnVal(postItem.qq10),
        "Q10_REMARK": "備註內容",
        "Q11": returnVal(postItem.qq11),
        "Q11_REMARK": "備註內容",
        "Q12": returnVal(postItem.qq12),
        "Q12_REMARK": "備註內容",
        "Q13": returnVal(postItem.qq13),
        "Q13_REMARK": "備註內容",
        "Q14": returnVal(postItem.qq14),
        "Q14_REMARK": "備註內容"
      })
    })
    return dataArr;
  },

  //建構 藥物安全性評估表 QC103 json檔
  returnDrugSafetiesJSON(postItems, user) {
    let dataArr = [];

    postItems.forEach(postItem => {
      function returnVal(val) {
        if (val == '無') return "5"
        if (val == '有') return "10"
        if (val == '不知道') return "15"
      }

      function returnValQ2(val) {
        if (val == '無') return "5"
        if (val == '≧5種') return "10"
        if (val == '≧9種') return "15"
        if (val == '不知道') return "20"

      }

      function returnDrugInUses(items) {
        return items.map(i => ({
          "ITEM": i.Name,
          "DOSAGE": "1",
          "DOSAGE_MEASUREMENT": i.Volume,
          "FREQUENCY": i.Frequency,
          "PURPOSE": i.Purpose,
          "REMARK": i.Remark != "" ? i.Remark : '無'
        }))
      }

      dataArr.push({
        "MAIN_ID": Number(user.id_num.replace(/\D/g, '')), //2025.4.23 只把身分證的英文去掉
        "ASSESSMENT_DT": dayjs(postItem.Date).format("YYYYMMDD"),
        "ASSESSMENT_USER": postItem.create_man.split('(')[0],
        "IS_LONG_MED": postItem.LongUseing == '有' ? "1" : "0",
        "Q1_TOTAL": postItem.LongUseing == '有' && postItem.qq1 == '有' ? Number(postItem.qq1Statement1) : null,
        "Q1_UNKNOWN": postItem.LongUseing == '有' && postItem.qq1 == '不知道' ? "5" : null,
        "Q1_1": postItem.LongUseing == '有' ? returnVal(postItem.qq2) : null,
        "Q1_2": postItem.LongUseing == '有' ? returnVal(postItem.qq3) : null,
        "Q2": postItem.LongUseing == '有' ? returnValQ2(postItem.qq4) : "5",
        "Q3": postItem.LongUseing == '有' ? returnVal(postItem.qq5) : "5",
        "Q3_TOTAL": postItem.qq5 == '有' ? Number(postItem.qq5Statement5) : 0,
        "QC103_A_LIST": postItem.DrugInUses.length ? returnDrugInUses(postItem.DrugInUses) : '[]'
      })
    })
    return dataArr;
  },

  //建構 身體評估評估表 QC104 json檔
  returnBodyEvaluationsJSON(postItems, user) {
    let dataArr = [];

    postItems.forEach(postItem => {
      // console.log('postItem', postItem.skin4)
      //判斷護理人員身分證字號 ;不存在時先用預設值
      // let findNurse = store.state.personnelItems.find(
      //   (i) => i.snkey == postItem.create_man_snkey
      // );

      // let finalPostData = {}
      // finalPostData.Date = postItem.Date;
      // if (findNurse && findNurse.idNum) {
      //   finalPostData.NurseID = findNurse.idNum;
      // } else {
      //   finalPostData.NurseID = "N223456789";
      // }


      function returnC_OPEN_EYE(val) {
        if (val == '4') return '5'
        if (val == '3') return '10'
        if (val == '2') return '15'
        if (val == '1') return '20'
        if (val == '閉眼') return '25'
      }

      function reutrnC_LANGUAGE(val) {
        val = val.toString()
        if (val == '5') return '5'
        if (val == '4') return '10'
        if (val == '3') return '15'
        if (val == '2') return '20'
        if (val == '1') return '25'
        if (val == '失語症') return '30'
        if (val == '失聰') return '35'
        if (val == '插氣管內管') return '40'
        if (val == '氣切') return '45'
      }

      // function reutrnC_LANGUAGE(val) {
      //   val = val.toString();
      //   // 替換邏輯對應表
      //   const replacements = {
      //     5: '5',
      //     4: '10',
      //     3: '15',
      //     2: '20',
      //     1: '25',
      //     '失語症': '30',
      //     '失聰': '35',
      //     '插氣管內管': '40',
      //     '氣切': '45',
      //   };

      //   // Check if val is an array
      //   if (Array.isArray(val)) {
      //     return val.map(item => replacements[item] || item);
      //   } else {
      //     // If val is a single value, return it as an array
      //     return [replacements[val] || val];
      //   }
      // }

      function returnC_SPORT(val) {
        if (val == '6') return '5'
        if (val == '5') return '10'
        if (val == '4') return '15'
        if (val == '3') return '20'
        if (val == '2') return '25'
        if (val == '1') return '30'
      }

      function returnOPT(val) {
        if (val == '無障礙') return '5'
        if (val == '不知道') return '10'
        if (val == '有障礙') return '15'
      }

      function returnV_OBS_Y(val) {
        console.log('run return v obs y', val)
        // 替換邏輯對應表
        const replacements = {
          '左眼白內障': '5',
          '左眼青光眼': '10',
          '左眼老花眼': '15',
          '左眼近視': '20',
          '左眼其他': '99',
          '右眼白內障': '5',
          '右眼青光眼': '10',
          '右眼老花眼': '15',
          '右眼近視': '20',
          '右眼其他': '99',
        };

        const leftEyeResults = [];
        const rightEyeResults = [];

        val.forEach(item => {
          const text = item.text; // 提取 text 屬性
          if (text.includes('左眼')) {
            leftEyeResults.push(replacements[text] || text);
          } else if (text.includes('右眼')) {
            rightEyeResults.push(replacements[text] || text);
          }
        });

        return {
          leftEye: leftEyeResults,
          rightEye: rightEyeResults
        };
      }

      // function returnV_OBS_Y(val, side) {
      //   if (val.includes('左(白內障、青光眼、老花眼、近視、其他)') && side == 'left') {
      //     return ['5', '10', '15', '20', '99']
      //   }
      //   if (val.includes('右(白內障、青光眼、老花眼、近視、其他)') && side == 'right') {
      //     return ['5', '10', '15', '20', '99']
      //   }

      //   return []
      // }

      function returnH_OBS_Y(val, side) {
        console.log('run returnH_OBS_Y', val, side);
        const result = [];

        val.forEach(item => {
          if (item.text.includes('左耳重聽') && side == 'left') {
            result.push('5');
          }
          if (item.text.includes('左耳失聰') && side == 'left') {
            result.push('10');
          }
          if (item.text.includes('右耳重聽') && side == 'right') {
            result.push('5');
          }
          if (item.text.includes('右耳失聰') && side == 'right') {
            result.push('10');
          }
          
        });

        return result;
      }

      function returnV_HAS_AUX_Y(val) {
        // 替換邏輯對應表
        const replacements = {
          '眼鏡': '5',
          '放大鏡': '10',
          '義眼左眼': '15',
          '義眼右眼': '20',
          '其他': '99'
        };

        return val.map(item => replacements[item] || item);
      }

      function returnH_HAS_AUX_Y(val) {
        // 替換邏輯對應表
        const replacements = {
          '助聽器左耳': '5',
          '助聽器右耳': '10',
          '其他': '99'
        };

        return val.map(item => replacements[item] || item);
      }

      function returnCOM_OPT(val) {
        if (val == '無障礙') return '5'
        if (val == '有障礙') return '10'
      }

      function returnCOM_TALK(val) {
        if (val == '良好') return '5'
        if (val == '不清楚') return '10'
        if (val == '僅可簡單表達句子(詞)') return '15'
        if (val == '僅可表達零碎的字') return '20'
        if (val == '無法言語') return '25'
      }

      function returnCOM_UNDERSTAND(val) {
        if (val == '良好') return '5'
        if (val == '僅可理解簡單句子(詞)') return '10'
        if (val == '僅可理解關鍵字') return '15'
        if (val == '無法理解') return '20'
      }

      function returnO_LOOK_ABNORMAL(val) {
        const replacements = {
          '蒼白': '5',
          '紅腫': '10',
          '黏膜瘀血或出血': '15',
          '潰瘍': '20',
          '其他': '99'
        };

        return val.map(item => replacements[item] || item);
      }

      function returnO_HAS_EAT_Y(val) {
        const replacements = {
          '鼻胃管': '5',
          '胃腸造廔': '10',
          '特殊種類': '99',
        };

        return val.map(item => replacements[item] || item);
      }

      function returnO_DENTURE(val) {
        if (val == '無') return '5'
        if (val == '全口多處無牙，但未裝假牙') return '10'
        if (val == '有活動假牙') return '15'
        if (val == '有固定式假牙') return '20'
      }

      function returnO_DENTURE15(val) {
        const replacements = {
          '上顎': '5',
          '下顎': '10',
          '全口': '15',
          '其他': '99',
        };

        return val.map(item => replacements[item] || item);
      }

      function returnS_ABDOMEN(val) {
        if (val == '正常') return '5'
        if (val == '脹') return '10'
        if (val == '硬') return '15'
        if (val == '腫塊') return '20'
        if (val == '腹水') return '25'
        if (val == '壓痛') return '30'
        if (val == '反彈痛') return '35'
        if (val == '其他') return '99'
      }
      function returnS_SQUIRM(val) {
        if (val == '正常') return '5'
        if (val == '快') return '10'
        if (val == '慢') return '15'
        if (val == '其他') return '99'
      }
      function returnS_DIGESTION(val) {
        if (val == '正常') return '5'
        if (val == '不好') return '10'
        if (val == '非常不好') return '15'
        if (val == '其他') return '99'
      }

      function returnED_FORM(val) {
        if (val == '正常(至少每三天排便一次)') return '5'
        if (val == '不知道') return '10'
        if (val == '便秘') return '15'
        if (val == '腹瀉') return '20'
        if (val == '失禁') return '25'
        if (val == '其他') return '99'
      }
      function returnED_COLOR(val) {
        if (val == '黃褐') return '5'
        if (val == '墨綠') return '10'
        if (val == '黑便') return '15'
        if (val == '不知道') return '20'
        if (val == '其他') return '99'
      }
      function returnED_AUX(val) {
        if (val == '無') return '5'
        if (val == '不知道') return '10'
        if (val == '有') return '15'
      }

      function returnED_AUX_Y(val) {
        if (val == '腸造瘻') return '5'
        if (val == '其他') return '99'
      }

      function returnEU_FORM(val) {
        if (val == '正常') return '5'
        if (val == '多') return '10'
        if (val == '少') return '15'
        if (val == '不知道') return '20'
        if (val == '異常') return '25'
      }

      function returnEU_FORM_25(val) {
        if (val == '失禁') return '5'
        if (val == '無尿') return '10'
        if (val == '頻尿') return '15'
        if (val == '排尿困難') return '20'
        if (val == '血液透析') return '25'
        if (val == '腹膜透析') return '30'
        if (val == '其他') return '99'
      }

      function returnEU_COLOR(val) {
        if (val == '正常') return '5'
        if (val == '不知道') return '10'
        if (val == '異常') return '15'
      }
      function returnEU_AUX(val) {
        if (val == '無') return '5'
        if (val == '不知道') return '10'
        if (val == '有') return '15'
      }
      function returnEU_AUX_Y(val) {
        if (val == '尿布') return '5'
        if (val == '間歇導尿') return '10'
        if (val == '導尿管') return '15'
        if (val == '膀胱造瘻') return '20'
        if (val == '其他') return '99'
      }

      //皮膚
      function returnSKIN_WARM(val) {
        if (val == '溫暖') return '5'
        if (val == '冰冷') return '10'
        if (val == '其他') return '99'
      }
      function returnSKIN_WET(val) {
        if (val == '無異常') return '5'
        if (val == '過度乾燥') return '10'
        if (val == '盜汗') return '15'
        if (val == '其他') return '99'
      }
      function returnSKIN_COLOR(val) {
        if (val == '無異常') return '5'
        if (val == '蒼白') return '10'
        if (val == '潮紅') return '15'
        if (val == '發紺') return '20'
        if (val == '黃疸') return '25'
        if (val == '其他') return '99'
      }
      function returnPartList(val) { //處理 等級對應的 值
        // if (!val || !Array.isArray(val)) return []
        if (!val.QC104_Part_LIST && val.skin5) {
          console.log('returnPartList,run old data')
          val.QC104_Part_LIST = [
            {
              PART_NAME: val.skin4.Other,
              PART_LEVEL: val.skin5.text
            }
          ]
        }

        return val.QC104_Part_LIST.map(item => {
          const levelMapping = {
            '輕': '5',
            '中': '10',
            '重': '15',
            '極重': '20'
          }

          return {
            ...item,
            PART_LEVEL: levelMapping[item.PART_LEVEL] || item.PART_LEVEL
          }
        })
      }
      function returnSKIN_HAS_EDEMA_LEVEL(val) {
        if (val == '輕') return '5'
        if (val == '中') return '10'
        if (val == '重') return '15'
        if (val == '極重') return '20'
      }
      function returnM_LV(val) {
        if (val == '5') return '5'
        if (val == '4') return '10'
        if (val == '3') return '15'
        if (val == '2') return '20'
        if (val == '1') return '25'
        if (val == '0') return '30'
        if (val == '無法測量') return '35'
      }
      function returnM_MOVE(val) {
        if (val == '可獨立於戶外行走') return '5'
        if (val == '可戶外行走但需人陪伴') return '10'
        if (val == '只能於室內獨立行走') return '15'
        if (val == '只能於室內行走且需人陪伴') return '20'
        if (val == '無法行走') return '25'
      }

      function returnM_HAS_AUX_Y(val) {
        const replacements = {
          '義肢左手': '5',
          '義肢右手': '10',
          '義肢左腳': '15',
          '義肢右腳': '20',
          '副木左手': '25',
          '副木右手': '30',
          '副木左腳': '35',
          '副木右腳': '40',
          '助行器': '45',
          '單柺': '50',
          '三/四腳柺': '55',
          '輪椅': '60',
          '電動車': '65',
          '氣墊床': '70',
          '其他': '99',
        };

        return val.map(item => replacements[item] || item);
      }

      //跌倒
      function returnF_OPT(val) {
        if (val == '無') return '5'
        if (val == '有') return '10'
        if (val == '不知道') return '15'
      }
      function returnF_HAS_HURT_Y(val) {
        const replacements = {
          '瘀青': '5',
          '皮肉傷口': '10',
          '頭部外傷': '15',
          '顱內出血': '20',
          '腕部骨折': '25',
          '脊椎骨折': '30',
          '髖部骨折': '35',
          '其他': '99',
        };

        return val.map(item => replacements[item] || item);
      }

      //行為
      function returnB_OPT_Y(val) {
        const replacements = {
          '攻擊行為': '5',
          '自傷': '10',
          '遊走': '15',
          '其他': '99',
        };

        return val.map(item => replacements[item] || item);
      }

      //睡眠
      function returnSLEEP_OPT_Y(val) {
        const replacements = {
          '不易入睡': '5',
          '早睡': '10',
          '斷續睡眠': '15',
          '日夜顛倒': '20',
          '其他': '99',
        };

        return val.map(item => replacements[item] || item);
      }
      function returnSLEEP_MED_TYPE(val) {
        const mapping = {
          '抗焦慮劑': '5',
          '鎮靜劑': '10',
          '抗憂鬱劑': '15',
          '抗精神病劑': '20',
          '其他': '99'
        };

        return val.map(item => mapping[item.text]);
      }
      function returnSLEEP_FREQ(val) {
        if (val == '偶爾') return '5'
        if (val == '每週1-2次') return '10'
        if (val == '每週3-6次') return '15'
        if (val == '每天') return '20'
      }

      //呼吸
      function returnBREATHE_HAS_AUX_Y(val) {
        if (val == '氧氣機') return '5'
        if (val == '呼吸器') return '10'
        if (val == '其他') return '99'
      }
      function returnBREATHE_HAS_AUX_Y_OX(val) {
        const result = [];
        if (val.breathe2.text == '有') result.push('5');
        if (val.breathe3.text == '有') result.push('10');
        return result;
      }

      //疫苗
      function returnVACCINE_OPT(val, user) {
        if (val == '無') return '5'
        if (val == '不知道') return '10'
        if (val == '有') return '15'
      }
      function returnVACCINE_TYPE(val) {
        // 定義對應表
        const mapping = {
          '流感疫苗': '5',
          '肺炎雙球菌疫苗': '10',
          'COVID-19疫苗': '15',
          '其他': '20',
        };

        const selectedItems = [];
        if (val.MultipleAnswer) {
          val.MultipleAnswer.forEach(answer => {
            if (answer.selected === true && mapping[answer.kind]) {
              selectedItems.push(mapping[answer.kind]);
            }
          });
        }

        return selectedItems;
      }
      function findYear(data, targetKind) {
        const item = data.MultipleAnswer.find(
          answer => answer.kind == targetKind && answer.selected == true
        );
        if (item && item.year) {
          const parts = item.year.split('.');
          return parts[parts.length - 1];
        }
        return null;
      };
      function checkForget(data, targetKind) {
        const item = data.MultipleAnswer.find(
          answer => answer.kind == targetKind && answer.selected == true && answer.forget == true
        );
        return item ? true : false;
      };

      dataArr.push({
        "MAIN_ID": Number(user.id_num.replace(/\D/g, '')), //2025.4.23 只把身分證的英文去掉
        "ASSESSMENT_DT": dayjs(postItem.Date).format("YYYYMMDD"),
        "ASSESSMENT_USER": postItem.create_man.split('(')[0],
        "C_OPEN_EYE": returnC_OPEN_EYE(postItem.mind1.text.toString()),
        "C_LANGUAGE": reutrnC_LANGUAGE(postItem.mind2.text), //2025.2.25 建構成 陣列; 2025.9.2 改回字串
        "C_SPORT": returnC_SPORT(postItem.mind3.text.toString()),

        //視力項目
        "V_OPT": returnOPT(postItem.vision1.text.toString()),
        "V_OBS_Y_L": postItem.vision1.text == '有障礙' ? returnV_OBS_Y(postItem.vision2).leftEye : [],
        "V_OBS_Y_R": postItem.vision1.text == '有障礙' ? returnV_OBS_Y(postItem.vision2).rightEye : [],
        "V_OBS_Y_L_OTHER": postItem.vision1.text == '有障礙' && returnV_OBS_Y(postItem.vision2).leftEye.toString() == "99" ? postItem.vision2[0].V_HAS_OBS_Y_L_OTHER : '',
        "V_OBS_Y_R_OTHER": postItem.vision1.text == '有障礙' && returnV_OBS_Y(postItem.vision2).rightEye.toString() == "99" ? postItem.vision2[0].V_HAS_OBS_Y_R_OTHER : '',

        "V_IS_ACT": postItem.vision1.text == '有障礙' ? postItem.vision3.text == '是' ? true : false : null,
        "V_HAS_AUX": postItem.vision1.text == '有障礙' ? postItem.vision4.text == '有' ? true : false : null,
        "V_HAS_AUX_Y": (postItem.vision4 && postItem.vision4.text == '有') ? returnV_HAS_AUX_Y(postItem.vision4.MultipleAnswer) : [],
        // "V_HAS_AUX_Y": ["10", "99"],
        "V_HAS_AUX_Y_OTHER": (postItem.vision4 && postItem.vision4.MultipleAnswer && postItem.vision4.MultipleAnswer.includes('其他')) ? postItem.vision4.Other : null,


        //聽力項目
        "H_OPT": returnOPT(postItem.hearing1.text.toString()),
        "H_OBS_Y_L": (postItem.hearing1.text == '有障礙' && postItem.hearing2) ? returnH_OBS_Y(postItem.hearing2, 'left') : [],
        "H_OBS_Y_R": (postItem.hearing1.text == '有障礙' && postItem.hearing2) ? returnH_OBS_Y(postItem.hearing2, 'right') : [],
        // "H_OBS_Y_L": ["5", "10"],
        // "H_OBS_Y_R": ["5", "10"],
        // "H_OBS_Y_L": ["15", "99"], //跟中衛的有出入,中衛的只有左或右
        "H_IS_ACT": postItem.hearing1.text == '有障礙' ? postItem.hearing3.text == '是' ? true : false : null,
        "H_HAS_AUX": postItem.hearing1.text == '有障礙' ? postItem.hearing4.text == '有' ? true : false : null,
        "H_HAS_AUX_Y": (postItem.hearing4 && postItem.hearing4.text == '有') ? returnH_HAS_AUX_Y(postItem.hearing4.MultipleAnswer) : [],
        // "H_HAS_AUX_Y": ["5", "99"],
        "H_HAS_AUX_Y_OTHER": (postItem.hearing4 && postItem.hearing4.MultipleAnswer && postItem.hearing4.MultipleAnswer.includes('其他')) ? postItem.hearing4.Other : null,

        //溝通項目
        "COM_OPT": returnCOM_OPT(postItem.communicate1.text),
        "COM_IS_ACT": postItem.communicate1.text == '有障礙' ? postItem.communicate2.text == '新問題(4週內)' ? 5 : 10 : null,
        "COM_TALK": postItem.communicate1.text == '有障礙' ? returnCOM_TALK(postItem.communicate3.text) : null,
        "COM_UNDERSTAND": postItem.communicate1.text == '有障礙' ? returnCOM_UNDERSTAND(postItem.communicate4.text) : null,

        //口腔
        "O_LOOK": postItem.oralCavity1.text == '正常' ? "5" : "10",
        "O_LOOK_ABNORMAL": postItem.oralCavity1.text == '異常' ? returnO_LOOK_ABNORMAL(postItem.oralCavity1.MultipleAnswer) : [],
        "O_LOOK_ABNORMAL_OTHER": postItem.oralCavity1.text == '異常' && postItem.oralCavity1.MultipleAnswer.includes('其他') ? postItem.oralCavity1.Other : null,
        "O_HAS_EAT": postItem.oralCavity2.text == '有' ? "1" : "0",
        "O_HAS_EAT_Y": postItem.oralCavity2.text == '有' ? returnO_HAS_EAT_Y(postItem.oralCavity2.MultipleAnswer) : [],
        "O_HAS_EAT_Y_OTHER": postItem.oralCavity2.text == '有' && postItem.oralCavity2.MultipleAnswer && postItem.oralCavity2.MultipleAnswer.includes('特殊種類') ? postItem.oralCavity2.Other : null,
        "O_DENTURE": returnO_DENTURE(postItem.oralCavity3.text),
        "O_DENTURE_15": postItem.oralCavity3 && postItem.oralCavity3.text == '有活動假牙' ? returnO_DENTURE15(postItem.oralCavity3.MultipleAnswer) : [],
        "O_DENTURE_15_OTHER": postItem.oralCavity3 && postItem.oralCavity3.text == "有活動假牙" && postItem.oralCavity3.MultipleAnswer.includes('其他') ? postItem.oralCavity3.Other : null,
        //口腔備有個人口腔清潔工具; 中衛未建構;先給預設值
        "O_HAS_TOOL": "0",
        "O_CLEAN_TOOL1": ["5", "10", "15", "20"],
        "O_CLEAN_TOOL2": ["5", "10"],
        "O_CLEAN_TOOL3": [],
        "O_SITUATION": "5",

        //胃腸
        "S_ABDOMEN": returnS_ABDOMEN(postItem.Gastrointestinal1.text),
        "S_ABDOMEN_OTHER": postItem.Gastrointestinal1 && postItem.Gastrointestinal1.text == '其他' ? postItem.Gastrointestinal1.Other : null,
        "S_SQUIRM": returnS_SQUIRM(postItem.Gastrointestinal2.text),
        "S_SQUIRM_OTHER": postItem.Gastrointestinal2 && postItem.Gastrointestinal2.text == '其他' ? postItem.Gastrointestinal2.Other : null,
        "S_DIGESTION": returnS_DIGESTION(postItem.Gastrointestinal3.text),
        "S_DIGESTION_OTHER": postItem.Gastrointestinal3 && postItem.Gastrointestinal3.text == '其他' ? postItem.Gastrointestinal3.Other : null,

        //排泄
        "ED_FORM": returnED_FORM(postItem.excretion1.text),
        "ED_FORM_OTHER": postItem.excretion1 && postItem.excretion1.text == '其他' ? postItem.excretion1.Other : null,
        "ED_COLOR": returnED_COLOR(postItem.excretion2.text),
        "ED_COLOR_OTHER": postItem.excretion2 && postItem.excretion2.text == '其他' ? postItem.excretion2.Other : null,
        "ED_AUX": returnED_AUX(postItem.excretion3.text),
        //排便輔助 中衛是單選
        "ED_AUX_Y": postItem.excretion3 && postItem.excretion3.text == '有' ? returnED_AUX_Y(postItem.excretion3.MultipleAnswer) : null,
        "ED_AUX_Y_OTHER": postItem.excretion3 && postItem.excretion3.MultipleAnswer && postItem.excretion3.MultipleAnswer == '其他' ? postItem.excretion3.Other : null,

        //排尿
        "EU_FORM": returnEU_FORM(postItem.excretion4.text),
        "EU_FORM_25": postItem.excretion4 && postItem.excretion4.text == '異常' ? returnEU_FORM_25(postItem.excretion4.MultipleAnswer) : null,
        "EU_FORM_25_OTHER": postItem.excretion4 && postItem.excretion4.text == '異常' && postItem.excretion4.MultipleAnswer == '其他' ? postItem.excretion4.Other : null,
        "EU_COLOR": returnEU_COLOR(postItem.excretion5.text),
        "EU_COLOR_OTHER": postItem.excretion5.text == '異常' ? postItem.excretion5.Other : null,
        "EU_AUX": returnEU_AUX(postItem.excretion6.text),
        "EU_AUX_Y": postItem.excretion6.text == '有' && postItem.excretion6.MultipleAnswer ? returnEU_AUX_Y(postItem.excretion6.MultipleAnswer) : null,
        "EU_AUX_Y_OTHER": postItem.excretion6.text == '有' && postItem.excretion6.MultipleAnswer && postItem.excretion6.MultipleAnswer == '其他' ? postItem.excretion6.Other : null,

        //皮膚
        "SKIN_WARM": returnSKIN_WARM(postItem.skin1.text),
        "SKIN_WARM_OTHER": postItem.skin1 && postItem.skin1.text == '其他' ? postItem.skin1.Other : null,
        "SKIN_WET": returnSKIN_WET(postItem.skin2.text),
        "SKIN_WET_OTHER": postItem.skin2 && postItem.skin2.text == '其他' ? postItem.skin2.Other : null,
        "SKIN_COLOR": returnSKIN_COLOR(postItem.skin3.text),
        "SKIN_COLOR_OTHER": postItem.skin3 && postItem.skin3.text == '其他' ? postItem.skin3.Other : null,
        "SKIN_HAS_EDEMA": postItem.skin4.text == '有' ? "1" : "0",
        // 2025.9.11 改由 QC104_PART_LIST 決定部位及等級
        "QC104_PART_LIST": postItem.skin4 && postItem.skin4.text == '有' ? returnPartList(postItem) : [],
        // "SKIN_HAS_EDEMA_SCORE": postItem.skin4 && postItem.skin4.text == '有' && postItem.skin4.Other ? postItem.skin4.Other : null,
        // "SKIN_HAS_EDEMA_LEVEL": postItem.skin4 && postItem.skin4.text == '有' && postItem.skin5 ? returnSKIN_HAS_EDEMA_LEVEL(postItem.skin5.text) : null,
        "SKIN_FULL": postItem.skin6.text == '有' ? "1" : "0",

        //肌力
        "M_UPPER_LEFT": returnM_LV(postItem.muscle1.text.toString()),
        "M_UPPER_RIGHT": returnM_LV(postItem.muscle2.text.toString()),
        "M_BOTTOM_LEFT": returnM_LV(postItem.muscle3.text.toString()),
        "M_BOTTOM_RIGHT": returnM_LV(postItem.muscle4.text.toString()),
        "M_MOVE": returnM_MOVE(postItem.muscle5.text),
        "M_HAS_AUX": postItem.muscle6.text == '有' ? "1" : "0",
        "M_HAS_AUX_Y": postItem.muscle6.text == '有' ? returnM_HAS_AUX_Y(postItem.muscle6.MultipleAnswer) : [],
        "M_HAS_AUX_Y_OTHER": postItem.muscle6.text == '有' && postItem.muscle6.MultipleAnswer && postItem.muscle6.MultipleAnswer.includes('其他') ? postItem.muscle6.Other : null,

        //跌倒
        "F_OPT": returnF_OPT(postItem.fall1.text),
        // "F_OPT_10_TIMES": postItem.fall1.text == '有' ? Number(postItem.fall1.Answer0) : 0,
        "F_OPT_10_TIMES": postItem.fall1.text == '有' ? (isNaN(Number(postItem.fall1.Answer0)) ? 1 : Number(postItem.fall1.Answer0)) : 0,
        "F_HAS_HURT": postItem.fall1.text == '有' && postItem.fall1.MultipleAnswer && postItem.fall1.MultipleAnswer.length ? "1" : "",
        "F_HAS_HURT_Y": postItem.fall1.text == '有' && postItem.fall1.MultipleAnswer ? returnF_HAS_HURT_Y(postItem.fall1.MultipleAnswer) : [],
        "F_HAS_HURT_Y_OTHER": postItem.fall1.text == '有' && postItem.fall1.MultipleAnswer && postItem.fall1.MultipleAnswer.includes('其他') ? postItem.fall1.Other : null,

        //行為
        "B_OPT": postItem.behavior1.text == '有干擾行為' ? "10" : "5",
        "B_OPT_Y": (postItem.behavior1.text == '有干擾行為' && postItem.behavior1.MultipleAnswer) ? returnB_OPT_Y(postItem.behavior1.MultipleAnswer) : [],
        "B_OPT_Y_OTHER": postItem.behavior1.text == '有干擾行為' && postItem.behavior1.MultipleAnswer && postItem.behavior1.MultipleAnswer.includes('其他') ? postItem.behavior1.Other : null,

        //睡眠
        "SLEEP_OPT": returnOPT(postItem.sleep1.text),
        "SLEEP_OPT_Y": postItem.sleep1.text == '有障礙' && postItem.sleep1.MultipleAnswer ? returnSLEEP_OPT_Y(postItem.sleep1.MultipleAnswer) : [],
        "SLEEP_OPT_Y_OTHER": postItem.sleep1.text == '有障礙' && postItem.sleep1.MultipleAnswer && postItem.sleep1.text == '有障礙' && postItem.sleep1.MultipleAnswer.includes('其他') ? postItem.sleep1.text == '有障礙' && postItem.sleep1.Other : "",
        "SLEEP_HAS_MED": postItem.sleep2 && postItem.sleep2.text == '有' ? "1" : "0",
        "SLEEP_HAS_MED_OTHER": null,
        // "SLEEP_HAS_MED_OTHER": postItem.sleep3 && postItem.sleep3[0].Other ? postItem.sleep3[0].Other : '',

        "SLEEP_MED_TYPE": postItem.sleep2 && postItem.sleep2.text == '有' && postItem.sleep3.length ? returnSLEEP_MED_TYPE(postItem.sleep3) : [],
        "SLEEP_MED_TYPE_OTHER": postItem.sleep3 && postItem.sleep3[0].Other ? postItem.sleep3[0].Other : '',

        "SLEEP_FREQ": postItem.sleep2 && postItem.sleep2.text == '有' && postItem.sleep4 ? returnSLEEP_FREQ(postItem.sleep4.text) : null,

        //呼吸
        "BREATHE_HAS_AUX": postItem.breathe1.text == '有' ? "1" : "0",
        "BREATHE_HAS_AUX_Y": postItem.breathe1.text == '有' && postItem.breathe1.MultipleAnswer ? returnBREATHE_HAS_AUX_Y(postItem.breathe1.MultipleAnswer) : "",
        "BREATHE_HAS_AUX_Y_OX": postItem.breathe1.text == '有' && postItem.breathe1.MultipleAnswer && postItem.breathe1.MultipleAnswer.includes("氧氣機") ? returnBREATHE_HAS_AUX_Y_OX(postItem) : [],
        "BREATHE_HAS_AUX_Y_OX_NOSE": postItem.breathe1.text == '有' && postItem.breathe2 && postItem.breathe2.text == '有' ? Number(postItem.breathe2.Other.substring(0, 1)) : 0,
        "BREATHE_HAS_AUX_Y_OX_MASK": postItem.breathe1.text == '有' && postItem.breathe3 && postItem.breathe3.text == '有' ? Number(postItem.breathe3.Other.substring(0, 1)) : 0,
        "BREATHE_HAS_AUX_Y_OTHER": postItem.breathe1.text == '有' && postItem.breathe1.MultipleAnswer && postItem.breathe1.MultipleAnswer.includes('其他') ? postItem.breathe1.Other : "",

        //疫苗
        "VACCINE_OPT": returnVACCINE_OPT(postItem.vaccine1.text, user),
        "VACCINE_TYPE": postItem.vaccine1.text == '有' ? returnVACCINE_TYPE(postItem.vaccine1) : [],
        "VACCINE_OPT_Y_5_YEAR": postItem.vaccine1.text == '有' ? findYear(postItem.vaccine1, '流感疫苗') : null,
        "VACCINE_OPT_Y_10_YEAR": postItem.vaccine1.text == '有' ? findYear(postItem.vaccine1, '肺炎雙球菌疫苗') : null,
        "VACCINE_OPT_Y_15_YEAR": postItem.vaccine1.text == '有' ? findYear(postItem.vaccine1, 'COVID-19疫苗') : null,
        "VACCINE_OPT_Y_99_YEAR": postItem.vaccine1.text == '有' ? findYear(postItem.vaccine1, '其他') : null,
        "VACCINE_OPT_Y_5_REM": postItem.vaccine1.text == '有' ? checkForget(postItem.vaccine1, '流感疫苗') : null,
        "VACCINE_OPT_Y_10_REM": postItem.vaccine1.text == '有' ? checkForget(postItem.vaccine1, '肺炎雙球菌疫苗') : null,
        "VACCINE_OPT_Y_15_REM": postItem.vaccine1.text == '有' ? checkForget(postItem.vaccine1, 'COVID-19疫苗') : null,
        "VACCINE_OPT_Y_99_REM": postItem.vaccine1.text == '有' ? checkForget(postItem.vaccine1, '其他') : null,
        "VACCINE_OPT_OTHER": postItem.vaccine1.text == '有' && postItem.vaccine1.MultipleAnswer[3].selected ? "疫苗其他" : null
      })
    })
    return dataArr;
  },


  //建構 壓力性損傷危險評估 QC105 json檔
  returnPressureInjuriesJSON(postItems, user) {
    let dataArr = [];

    postItems.forEach(postItem => {

      function returnFEEL(val) {
        if (val == '完全受限：因為意識減弱或使用鎮定劑，對疼痛刺激沒有反應') return '5'
        if (val == '大部分受限：只對疼痛刺激有反應；除了呻吟或焦躁不安，無法表達不適') return '10'
        if (val == '稍微受限：對指令有反應；但有時無法表達不適；(一或兩個肢體對疼痛或不適的感覺能力受限)') return '15'
        if (val == '沒有受損：對指令有反應；能表達不適') return '20'
      }
      function returnWET(val) {
        if (val == '總是潮溼：皮膚總是被汗水、大小便等浸潤；每兩小時予病人翻身時，都會發現皮膚是潮溼的') return '5'
        if (val == '經常潮溼：皮膚經常是浸潤的；衣褲/尿布/看護墊等至少每8小時需更換 ≧ 2次') return '10'
        if (val == '偶爾潮溼：皮膚偶爾是浸潤的；衣褲/尿布/看護墊等至少每8小時需更換1次') return '15'
        if (val == '很少潮溼：皮膚通常保持乾燥；衣褲/尿布/看護墊等只需要依常規的時間，每天更換一次') return '20'
      }
      function returnACT(val) {
        if (val == '受限於床上') return '5'
        if (val == '受限於椅子：無法行走或走路極為困難；無法支撐自己的體重') return '10'
        if (val == '偶爾走動：但是步行短距離，有時需要協助；大部份時間在床上或椅子上') return '15'
        if (val == '經常走動') return '20'
      }
      function returnMOVE(val) {
        if (val == '完全無法自行移動') return '5'
        if (val == '大部份需協助才能移動') return '10'
        if (val == '少部份需協助才能移動') return '15'
        if (val == '無限制') return '20'
      }
      function returnNUTRITION(val) {
        if (val == '總攝取量 < 50%') return '5'
        if (val == '50% ≦ 總攝取量 < 75%') return '10'
        if (val == '總攝取量 ≧ 75%') return '15'
        if (val == '總攝取量完整') return '20'
      }
      function returnFRICTION(val) {
        if (val == '有此問題：移動時需要中度到極大的協助；完全抬起來而不與床單接觸是不可能的') return '5'
        if (val == '有潛在問題：移動時需要輕微協助') return '10'
        if (val == '沒有明顯問題：可獨立在床上或椅子上移動') return '15'
      }


      dataArr.push({
        "MAIN_ID": Number(user.id_num.replace(/\D/g, '')), //2025.4.23 只把身分證的英文去掉
        "ASSESSMENT_DT": dayjs(postItem.Date).format("YYYYMMDD"),
        "ASSESSMENT_USER": postItem.create_man.split('(')[0],
        "FEEL": returnFEEL(postItem.qq1.text),
        "WET": returnWET(postItem.qq2.text),
        "ACT": returnACT(postItem.qq3.text),
        "MOVE": returnMOVE(postItem.qq4.text),
        "NUTRITION": returnNUTRITION(postItem.qq5.text),
        "FRICTION": returnFRICTION(postItem.qq6.text)
      })
    })
    return dataArr;

  },

  //建構 跌倒危險性評估 QC106 json檔
  returnFallRisksJSON(postItems, user) {
    let dataArr = [];

    postItems.forEach(postItem => {

      function returnCOGNITION_ITEM(val) {
        // console.log(val);
        const mapping = {
          '曾突發意識改變': '5',
          '曾突發全身性抽蓄': '10',
          '目前意識狀態變差': '15',
          '目前心智狀態變差': '20',
          '躁動': '25',
          '合作度差': '30',
          '麻醉未醒': '35'
        };

        return val.map(item => mapping[item]);
      }
      function returnACTLESS_ITEM(val) {
        const mapping = {
          '活動障礙': '5',
          '一側肢體肌力≦4分': '10',
          '平衡感障礙': '15',
          '行走協調功能差': '20',
        };

        return val.map(item => mapping[item]);
      }
      function returnWEAK_ITEM(val) {
        const mapping = {
          '無力': '5',
          '活動費力': '10',
          '身體耐受力不足': '15',
          '行動遲緩': '20',
        };

        return val.map(item => mapping[item]);
      }
      function returnFEEL_ITEM(val) {
        const mapping = {
          '雙眼視力障礙': '5',
          '位置感缺失': '10',
          '偏盲': '15',
          '半邊忽略': '20',
          '無法判定': '25',
        };

        return val.map(item => mapping[item]);
      }
      function returnDIZZINESS_ITEM(val) {
        const mapping = {
          '頭暈': '5',
          '暈眩': '10',
          '姿位性低血壓': '15',
          '低血壓': '20',
        };

        return val.map(item => mapping[item]);
      }
      function returnMED_ITEM(val) {
        const mapping = {
          '麻醉止痛劑': '5',
          '鎮靜安眠劑': '10',
          '散瞳劑': '15',
          '鎮攣劑': '20',
          '肌肉鬆弛劑': '25',
          '降壓利尿劑': '30',
          '瀉劑': '35',
          '抗鬱劑': '40',
          '其他': '99',
        };

        return val.map(item => mapping[item]);
      }

      dataArr.push({
        "MAIN_ID": Number(user.id_num.replace(/\D/g, '')), //2025.4.23 只把身分證的英文去掉
        "ASSESSMENT_DT": dayjs(postItem.Date).format("YYYYMMDD"),
        "ASSESSMENT_USER": postItem.create_man.split('(')[0],
        "IS_OLD": postItem.qq1.text == '是' ? true : false,
        "IS_FALL": postItem.qq2.text == '是' ? true : false,
        "IS_COGNITION": postItem.qq3.text == '是' ? true : false,
        "COGNITION_ITEM": postItem.qq3.text == '是' ? returnCOGNITION_ITEM(postItem.qq3.Options) : [],
        "IS_ACTLESS": postItem.qq4.text == '是' ? true : false,
        "ACTLESS_ITEM": postItem.qq4.text == '是' ? returnACTLESS_ITEM(postItem.qq4.Options) : [],
        "IS_WEAK": postItem.qq5.text == '是' ? true : false,
        "WEAK_ITEM": postItem.qq5.text == '是' ? returnWEAK_ITEM(postItem.qq5.Options) : [],
        "IS_FEEL": postItem.qq6.text == '是' ? true : false,
        "FEEL_ITEM": postItem.qq6.text == '是' ? returnFEEL_ITEM(postItem.qq6.Options) : [],
        "IS_DIZZINESS": postItem.qq7.text == '是' ? true : false,
        "DIZZINESS_ITEM": postItem.qq7.text == '是' ? returnDIZZINESS_ITEM(postItem.qq7.Options) : [],
        "IS_MED": postItem.qq8.text == '是' ? true : false,
        "MED_ITEM": postItem.qq8.text == '是' ? returnMED_ITEM(postItem.qq8.Options) : [],
        "MED_ITEM_OTHER": postItem.qq8.text == '是' && postItem.qq8.Options && postItem.qq8.Options.includes('其他') ? postItem.qq8.Other : ""
      })
    })
    return dataArr;
  },

  //建構 日常生活功能評估 QC107 json檔
  returnADLsJSON(postItems, user) {
    let dataArr = [];

    postItems.forEach(postItem => {
      function returnEAT(val) {
        if (val == '不需他人協助，在合理的時間(一小時)內，可自行用餐具取用眼前食物，或能自行取用穿脫進食輔具，將餐盤內食物吃完。') return '5'
        if (val == '需他人協助取用或切好食物或穿脫進食輔具，但可自行吃飯。') return '10'
        if (val == '無法自行取食。') return '15'
      }
      function returnMOVE(val) {
        if (val == '可自行坐起，且由床移位至椅子或輪椅，使用輪椅的煞車及腳踏板，都不需要他人協助，且沒有安全上的顧慮。') return '5'
        if (val == '移位時需要少部分協助或提醒，且有安全上的顧慮。') return '10'
        if (val == '可自行坐起，但移位至椅子或輪椅，需他人大部份的協助。') return '15'
        if (val == '不能自行移位，完全需他人協助才能坐起或移位。') return '20'
      }
      function returnHEALTH(val) {
        if (val == '可自行刷牙、洗臉、洗手、梳頭及刮鬍子。') return '5'
        if (val == '他人協助才能完成上述盥洗項目。') return '10'
      }
      function returnTOILET(val) {
        if (val == '可自行上下馬桶，穿脫衣褲且不弄髒衣物，自行取用衛生紙擦拭清潔，且不需他人協助。如使用便盆(尿壺)，可自行取放並清洗乾淨。') return '5'
        if (val == '需扶持使用馬桶或便盆(尿壺)，協助整理衣物或使用衛生紙或協助清理便盆(尿壺)。') return '10'
        if (val == '完全需要他人協助。') return '15'
      }
      function returnBATH(val) {
        if (val == '可自行完成盆浴、淋浴或擦澡。') return '5'
        if (val == '他人協助才能完成，或可自行完成，但執行困難或清潔度不佳。') return '10'
      }
      function returnWALK(val) {
        if (val == '使用或不使用輔具(包括拐杖、支架、義肢或助行器)皆可獨立行走50公尺以上，無安全顧慮。') return '5'
        if (val == '需他人稍微扶持(如一手攙扶)或口頭教導，才可行走50公尺以上(一口氣走完或中間休息一次)。') return '10'
        if (val == '雖無法行走，但可獨立操作輪椅或電動輪椅(包含轉彎、進門及接近桌子、床沿)並可推行輪椅50公尺以上。') return '15'
        if (val == '不能行走50公尺，且無法操縱輪椅，完全依賴他人。') return '20'
      }

      function returnSTAIRS(val) {
        // console.log('returnSTAIRS',val)
        if (val == '可自行上下樓梯(可抓扶手或用柺扙)。') return '5'
        if (val == '需要他人稍微扶持(指一手輕扶)或口頭指導。') return '10'
        if (val == '完全無法上下樓梯。') return '15'
      }
      function returnWEAR(val) {
        if (val == '可自行穿脫衣褲鞋襪，必要時使用輔具。') return '5'
        if (val == '在別人幫助下，可自行完成一半以上動作。') return '10'
        if (val == '需要他人完全幫忙。') return '15'
      }
      function returnDEFECATE(val) {
        if (val == '無失禁(控)，或當便秘、需要時能自行使用塞劑、甘油球，不需他人協助。') return '5'
        if (val == '偶而失禁(控)(每週不超過一次)，或當便秘時需協助使用塞劑。') return '10'
        if (val == '失禁(控)(每週超過二次(含)以上)或當便秘時需要灌腸。') return '15'
      }
      function returnPEE(val) {
        if (val == '日夜皆無尿失禁(控)，可完全自我控制。') return '5'
        if (val == '偶而失禁(控)(每週不超過一次)，使用尿布尿套時需他人幫忙。') return '10'
        if (val == '失禁(控)(每週超過二次(含)以上)或使用導尿管。') return '15'
      }


      dataArr.push({
        "MAIN_ID": Number(user.id_num.replace(/\D/g, '')), //2025.4.23 只把身分證的英文去掉
        "ASSESSMENT_DT": dayjs(postItem.Date).format("YYYYMMDD"),
        "ASSESSMENT_USER": postItem.create_man.split('(')[0],
        "EAT": returnEAT(postItem.qq1.text),
        "MOVE": returnMOVE(postItem.qq2.text),
        "HEALTH": returnHEALTH(postItem.qq3.text),
        "TOILET": returnTOILET(postItem.qq4.text),
        "BATH": returnBATH(postItem.qq5.text),
        "WALK": returnWALK(postItem.qq6.text),
        "STAIRS": returnSTAIRS(postItem.qq7.text),
        "WEAR": returnWEAR(postItem.qq8.text),
        "DEFECATE": returnDEFECATE(postItem.qq9.text),
        "PEE": returnPEE(postItem.qq10.text)
      })
    })
    return dataArr;

  },

  //建構 工具性日常生活活動功能評估 QC108 json檔
  returnIADLsJSON(postItems, user) {
    let dataArr = [];

    postItems.forEach(postItem => {

      function returnSHOPPING(val) {
        if (val == '能獨立完成所有購物需求。') return '5'
        if (val == '只能獨立購買簡單日常必需品。') return '10'
        if (val == '每一次購物都需要有人陪，只要有人陪伴就可以完成購物。') return '15'
        if (val == '完全不會獨立購物。') return '20'
      }
      function returnHOUSE_WORK(val) {
        if (val == '能單獨處理家事或偶而需要協助較繁重的家事(如：搬動家具、清理廚房且完成歸位)。') return '5'
        if (val == '能做較簡單的家事，如洗碗、鋪床、疊被。') return '10'
        if (val == '能做較簡單的家事，但不能達到可被接受的整潔程度。') return '15'
        if (val == '所有的家事都需要別人協助。') return '20'
        if (val == '完全不會做家事。') return '25'
      }
      function returnFINANCE(val) {
        if (val == '可獨立處理財務(指到郵局(銀行)提存款、支付房租、帳單、給錢、找錢等)。') return '5'
        if (val == '可以處理日常的購買(給錢、找錢)，但需要別人協助與銀行往來或大宗買賣。') return '10'
        if (val == '完全不能處理錢財。') return '15'
      }
      function returnFOOD(val) {
        if (val == '能獨立計畫、準備食材及佐料、烹煮和擺設一頓飯菜。') return '5'
        if (val == '如果準備好一切食材及佐料，會做一頓的飯菜。') return '10'
        if (val == '會將已做好的飯菜加熱。') return '15'
        if (val == '需要別人把飯菜煮好、擺好。') return '20'
      }
      function returnTRAFFIC(val) {
        if (val == '能夠自己開車、騎車或自己搭乘大眾運輸工具。') return '5'
        if (val == '能夠自己搭乘計程車但不能搭乘大眾運輸工具。') return '10'
        if (val == '當有人陪同時，可搭乘大眾運輸工具。') return '15'
        if (val == '只能在有人協助或陪同時，可搭乘計程車或自用車。') return '20'
        if (val == '完全不能出門。') return '25'
      }
      function returnTELEPHONE(val) {
        if (val == '能獨立使用電話，含查電話簿、撥號等。') return '5'
        if (val == '僅能撥熟悉的電話號碼(個案只能撥少於5組的常用電話)。') return '10'
        if (val == '僅能接電話，但不能撥電話。') return '15'
        if (val == '完全不會使用電話。') return '20'
      }
      function returnLAUNDRY(val) {
        if (val == '自己清洗所有衣物。') return '5'
        if (val == '只能清洗小件衣物(如內衣褲、襪子)，需協助晾曬衣物或洗滌厚重衣物。') return '10'
        if (val == '需完全協助，所有衣物需完全由別人協助洗及晾曬。') return '15'
      }
      function returnTAKE_MED(val) {
        if (val == '能自己負責在正確的時間服用正確的藥物。') return '5'
        if (val == '如果能事先將藥物的份量備妥，則可自行服用。') return '10'
        if (val == '不能自己負責服藥。') return '15'
      }

      dataArr.push({
        "MAIN_ID": Number(user.id_num.replace(/\D/g, '')), //2025.4.23 只把身分證的英文去掉
        "ASSESSMENT_DT": dayjs(postItem.Date).format("YYYYMMDD"),
        "ASSESSMENT_USER": postItem.create_man.split('(')[0],
        "SHOPPING": returnSHOPPING(postItem.qq1.text),
        "HOUSE_WORK": returnHOUSE_WORK(postItem.qq2.text),
        "FINANCE": returnFINANCE(postItem.qq3.text),
        "FOOD": returnFOOD(postItem.qq4.text),
        "TRAFFIC": returnTRAFFIC(postItem.qq5.text),
        "TELEPHONE": returnTELEPHONE(postItem.qq6.text),
        "LAUNDRY": returnLAUNDRY(postItem.qq7.text),
        "TAKE_MED": returnTAKE_MED(postItem.qq8.text),
      })
    })
    return dataArr;

  },

  //建構 認知功能評估 QC109 json檔
  returnDementiasJSON(postItems, user) {
    let dataArr = [];

    postItems.forEach(postItem => {

      function returnDEGREE(val) {
        if (val == '心智功能完好') return '5'
        if (val == '輕度智力缺損') return '10'
        if (val == '中度智力缺損') return '15'
        if (val == '嚴重智力缺損') return '20'
      }

      function returnNoDEGREE(postItem) {
        const keys = ['qq1', 'qq2', 'qq3', 'qq4', 'qq5', 'qq6', 'qq7', 'qq8', 'qq9', 'qq10', 'qq11']
        let wrongCount = 0
        keys.forEach(k => {
          const q = postItem && postItem[k]
          const text = q && q.text
          if (text !== '對') wrongCount++
        })
        if (wrongCount <= 2) return '5'
        if (wrongCount <= 4) return '10'
        if (wrongCount <= 7) return '15'
        return '20'
      }

      let val = {}
      val.MAIN_ID = Number(user.id_num.replace(/\D/g, ''))
      val.ASSESSMENT_DT = dayjs(postItem.Date).format("YYYYMMDD")
      val.ASSESSMENT_USER = postItem.create_man.split('(')[0]
      val.IS_ASSESSMENT = postItem.qq12 ? "1" : "0"
      val.REMARK = postItem.qq12 ? postItem.qq12 : ""

      //2025.9.15 調整為 如果 qq12(remark) 為空白時，才有以下的值
      if (!postItem.qq12) {
        val.Q1 = postItem.qq1.text == '對' ? '5' : '10'
        val.Q2 = postItem.qq2.text == '對' ? '5' : '10'
        val.Q3 = postItem.qq3.text == '對' ? '5' : '10'
        val.Q4 = postItem.qq4.text == '對' ? '5' : '10'
        val.Q4_A = postItem.qq5.text == '對' ? '5' : '10'
        val.Q5 = postItem.qq6.text == '對' ? '5' : '10'
        val.Q6 = postItem.qq7.text == '對' ? '5' : '10'
        val.Q7 = postItem.qq8.text == '對' ? '5' : '10'
        val.Q8 = postItem.qq9.text == '對' ? '5' : '10'
        val.Q9 = postItem.qq10.text == '對' ? '5' : '10'
        val.Q10 = postItem.qq11.text == '對' ? '5' : '10'
        val.DEGREE = postItem.DEGREE ? returnDEGREE(postItem.DEGREE) : returnNoDEGREE(postItem)
      }

      dataArr.push(val)
      // dataArr.push({
      //   "MAIN_ID": Number(user.id_num.replace(/\D/g, '')), //2025.4.23 只把身分證的英文去掉
      //   "ASSESSMENT_DT": dayjs(postItem.Date).format("YYYYMMDD"),
      //   "ASSESSMENT_USER": postItem.create_man.split('(')[0],
      //   //2025.9.3 加入 無法評估判定欄位 透過 REMARK 決定
      //   "IS_ASSESSMENT" : postItem.qq12 ? "1" : "0",
      //   "REMARK": postItem.qq12 ? postItem.qq12 : "",
      //   "Q1": !postItem.qq12 ? postItem.qq1.text == '對' ? '5' : '10' : '',
      //   "Q2": !postItem.qq12 ? postItem.qq2.text == '對' ? '5' : '10' : '',
      //   "Q3": !postItem.qq12 ? postItem.qq3.text == '對' ? '5' : '10' : '',
      //   "Q4": !postItem.qq12 ? postItem.qq4.text == '對' ? '5' : '10' : '',
      //   "Q4_A": !postItem.qq12 ? postItem.qq5.text == '對' ? '5' : '10' : '',
      //   "Q5": !postItem.qq12 ? postItem.qq6.text == '對' ? '5' : '10' : '',
      //   "Q6": !postItem.qq12 ? postItem.qq7.text == '對' ? '5' : '10' : '',
      //   "Q7": !postItem.qq12 ? postItem.qq8.text == '對' ? '5' : '10' : '',
      //   "Q8": !postItem.qq12 ? postItem.qq9.text == '對' ? '5' : '10' : '',
      //   "Q9": !postItem.qq12 ? postItem.qq10.text == '對' ? '5' : '10' : '',
      //   "Q10": !postItem.qq12 ? postItem.qq11.text == '對' ? '5' : '10' : '',
      //   //2024.12.11 暫時給預設值,中衛無此欄位;相關程式碼 returnDEGREE()
      //   //2025.3.14 中衛目前設定為 remark 裡有值時，其他欄位可不填；上方各問題，在無資料時預設錯誤
      //   "DEGREE": !postItem.DEGREE ? returnDEGREE(postItems.DEGREE) : '',
      // })
    })
    return dataArr;



  },

  //建構 簡式健康量表 QC110 json檔
  returnBSRS5sJSON(postItems, user) {
    let dataArr = [];

    function returnQ(val) {
      if (val == '完全沒有') return '5'
      if (val == '輕微') return '10'
      if (val == '中等程度') return '15'
      if (val == '厲害') return '15'
      if (val == '非常厲害') return '15'
    }

    postItems.forEach(postItem => {
      dataArr.push({
        "MAIN_ID": Number(user.id_num.replace(/\D/g, '')), //2025.4.23 只把身分證的英文去掉
        "ASSESSMENT_DT": dayjs(postItem.Date).format("YYYYMMDD"),
        "ASSESSMENT_USER": postItem.create_man.split('(')[0],
        "IS_ASSESSMENT": postItem.remark ? "1" : "0", //2025.9.3 加入 無法評估判定欄位 透過 remark 決定
        "REMARK": postItem.remark ? postItem.remark : "",
        "Q1": !postItem.remark ? returnQ(postItem.qq1.text) : '',
        "Q2": !postItem.remark ? returnQ(postItem.qq2.text) : '',
        "Q3": !postItem.remark ? returnQ(postItem.qq3.text) : '',
        "Q4": !postItem.remark ? returnQ(postItem.qq4.text) : '',
        "Q5": !postItem.remark ? returnQ(postItem.qq5.text) : '',
        "Q6": !postItem.remark ? returnQ(postItem.qq6.text) : '',
      })
    })
    return dataArr;
  },

  //建構 情緒問題評估 json檔 (2024.12.12 暫缺)
  // returnGeriatricDepressionScalesJSON(postItems, user) {
  //   let dataArr = [];

  //   postItems.forEach(postItem => {

  //     dataArr.push({
  //       "MAIN_ID": Number(user.id_num.replace(/\D/g, '')), //2025.4.23 只把身分證的英文去掉
  //       "ASSESSMENT_DT": dayjs(postItem.Date).format("YYYYMMDD"),
  //       "ASSESSMENT_USER": postItem.create_man.split('(')[0],
  //       "REMARK": "",
  //       "Q1": "10",
  //       "Q2": "5",
  //       "Q3": "10",
  //       "Q4": "5",
  //       "Q4_A": "10",
  //       "Q5": "5",
  //       "Q6": "10"
  //     })
  //   })
  //   return dataArr;


  // },

  //建構 簡易營養評估 QC111 json檔
  returnMNASFsJSON(postItems, user) {
    let dataArr = [];

    postItems.forEach(postItem => {

      function returnQ1(val) {
        if (val == '嚴重食慾不佳') return '5'
        if (val == '中度食慾不佳') return '10'
        if (val == '食慾無變化') return '15'
      }
      function returnQ2(val) {
        if (val == '體重減輕>3公斤') return '5'
        if (val == '不知道') return '10'
        if (val == '體重減輕1~3公斤') return '15'
        if (val == '體重無改變') return '20'
      }
      function returnQ3(val) {
        if (val == '臥床或輪椅') return '5'
        if (val == '可以下床活動或離開輪椅但無法自由活動') return '10'
        if (val == '可以自由走動') return '15'
      }
      function returnQ5(val) {
        if (val == '嚴重認知障礙或抑鬱') return '5'
        if (val == '輕度痴呆') return '10'
        if (val == '無精神問題') return '15'
      }
      function returnQ6Type(val) {
        if (val.qq6) {
          //代表選了bmi的部分
          return '5'
        } else {
          //代表選了小腿圍的部分 或 臂中圍的部分
          if (val.qq7.includes('小腿圍')) return '10';
          return '15'
        }
      }
      function returnQ6(val) {
        if (val.qq6) {
          //代表選了bmi的部分
          let getVal = val.qq6.text;
          if (getVal == 'BMI<19') return '5'
          if (getVal == '19≦BMI<21') return '10'
          if (getVal == '21≦BMI<23') return '15'
          if (getVal == 'BMI≧23') return '20'
        } else {
          //代表選了小腿圍的部分 或 臂中圍的部分
          let getVal = val.qq7.text;
          if (getVal == '小腿圍<31') return '25'
          if (getVal == '小腿圍≧31') return '30'
          if (getVal == '臂中圍<22') return '35'
          if (getVal == '臂中圍≧22') return '40'
        }
      }
      // function returnQ6(val) {
      //   if (val == 'BMI<19') return '5'
      //   if (val == '19≦BMI<21') return '10'
      //   if (val == '21≦BMI<23') return '15'
      //   if (val == 'BMI≧23') return '20'
      //   if (val == null) return null
      // }
      // function returnQ6fitQ7(val) {
      //   if (val == 'BMI<19') return '25'
      //   if (val == '19≦BMI<21') return '30'
      //   if (val == '21≦BMI<23') return '35'
      //   if (val == 'BMI≧23') return '40'
      //   if (val == null) return null
      // }
      // function returnQ7(val) {
      //   if (val == '小腿圍<31') return '25'
      //   if (val == '小腿圍≧31') return '30'
      //   if (val == '臂中圍<22') return '35'
      //   if (val == '臂中圍≧22') return '40'
      //   if (val == null) return null
      // }


      dataArr.push({
        "MAIN_ID": Number(user.id_num.replace(/\D/g, '')), //2025.4.23 只把身分證的英文去掉
        "ASSESSMENT_DT": dayjs(postItem.Date).format("YYYYMMDD"),
        "ASSESSMENT_USER": postItem.create_man.split('(')[0],
        "REMARK": "",
        "Q1": returnQ1(postItem.qq1.text),
        "Q2": returnQ2(postItem.qq2.text),
        "Q3": returnQ3(postItem.qq3.text),
        "Q4": postItem.qq4.text == '是' ? '5' : '10',
        "Q5": returnQ5(postItem.qq5.text),
        "Q6_TYPE": returnQ6Type(postItem),
        "Q6": returnQ6(postItem)
        // "Q6_TYPE": postItem.qq6 ? returnQ6(postItem.qq6.text) : null,
        // "Q6": postItem.qq7 ? returnQ7(postItem.qq7.text) : returnQ6fitQ7(postItem.qq6.text), //2025.3.5 qq7不存在時，先用qq6的值去代替
      })
    })
    return dataArr;
  },

  //建構 疼痛評估 QC112 json檔
  returnPainEvaluationsJSON(postItems, user) {
    let dataArr = [];

    postItems.forEach(postItem => {

      dataArr.push({
        "MAIN_ID": Number(user.id_num.replace(/\D/g, '')), //2025.4.23 只把身分證的英文去掉
        "ASSESSMENT_DT": dayjs(postItem.Date).format("YYYYMMDD"),
        "ASSESSMENT_USER": postItem.create_man.split('(')[0],
        "REMARK": postItem.qq5 ? postItem.qq5 : null,
        "QC112_A_LIST": postItem.qq5 == null ? [
          {
            "PARTS": postItem.qq1 ? postItem.qq1 : null,
            "SCORE": postItem.qq2 ? postItem.qq2 : null,
            "TIME": postItem.qq3 ? postItem.qq3 : null,
            "NATURE": postItem.qq4 ? postItem.qq4 : null,
            "REMARK": ""
          }
        ] : []
      })
    })
    return dataArr;
  },

  //建構 衰弱評估 QC113 json檔
  returnSOFsJSON(postItems, user) {
    let dataArr = [];

    postItems.forEach(postItem => {

      dataArr.push({
        "MAIN_ID": Number(user.id_num.replace(/\D/g, '')), //2025.4.23 只把身分證的英文去掉
        "ASSESSMENT_DT": dayjs(postItem.Date).format("YYYYMMDD"),
        "ASSESSMENT_USER": postItem.create_man.split('(')[0],
        "IS_ASSESSMENT": postItem.remark ? "1" : "0", //2025.9.3 加入 無法評估判定欄位 透過 remark 決定
        "REMARK": postItem.remark ? postItem.remark : "",
        "IS_WEIGHT": !postItem.remark ? postItem.qq1.text == '是' ? true : false : '',
        "IS_LIMBS": !postItem.remark ? postItem.qq2.text == '是' ? true : false : '',
        "IS_ACT": !postItem.remark ? postItem.qq3.text == '是' ? true : false : '',
      })
    })
    return dataArr;

  },

  //建構 需求摘要&照護計畫 問題列表及照護計畫 QC114 json檔
  returnCaseSummaryPlanJSON(postItems, user) {
    let dataArr = [];

    postItems.forEach(postItem => {

      // console.log(postItem)
      const newItems = {};
      postItem.Questions.forEach(question => {
        newItems[question.Question] = question;
      });

      dataArr.push({
        "MAIN_ID": Number(user.id_num.replace(/\D/g, '')), //2025.4.23 只把身分證的英文去掉
        "ASSESSMENT_DT": dayjs(postItem.Date).format("YYYYMMDD"),
        "ASSESSMENT_USER": postItem.create_man.split('(')[0],
        // "QC100_ID": "275157095",
        "Q1_PLAN": "照護計畫內容",
        "Q1_SDT": "20240101",
        "Q1_EDT": "20240201",
        "Q2_PLAN": "照護計畫內容",
        "Q2_SDT": "20240101",
        "Q2_EDT": "20240201",
        "Q3_PLAN": "照護計畫內容",
        "Q3_SDT": "20240101",
        "Q3_EDT": "20240201",
        "Q4_PLAN": "照護計畫內容",
        "Q4_SDT": "20240101",
        "Q4_EDT": "20240201",
        "Q5_PLAN": "照護計畫內容",
        "Q5_SDT": "20240101",
        "Q5_EDT": "20240201",
        "Q6_PLAN": "照護計畫內容",
        "Q6_SDT": "20240101",
        "Q6_EDT": "20240201",
        "Q7_PLAN": "照護計畫內容",
        "Q7_SDT": "20240101",
        "Q7_EDT": "20240201",
        "Q8_PLAN": "照護計畫內容",
        "Q8_SDT": "20240101",
        "Q8_EDT": "20240201",
        "Q9_PLAN": "照護計畫內容",
        "Q9_SDT": "20240101",
        "Q9_EDT": "20240201",
        "Q10_PLAN": "照護計畫內容",
        "Q10_SDT": "20240101",
        "Q10_EDT": "20240201",
        "Q11_PLAN": "照護計畫內容",
        "Q11_SDT": "20240101",
        "Q11_EDT": "20240201",
        "Q12_PLAN": "照護計畫內容",
        "Q12_SDT": "20240101",
        "Q12_EDT": "20240201",
        "Q13_PLAN": "照護計畫內容",
        "Q13_SDT": "20240101",
        "Q13_EDT": "20240201",
        "Q14_PLAN": "照護計畫內容",
        "Q14_SDT": "20240101",
        "Q14_EDT": "20240201"
      })
    })
    return dataArr;

  }

  //建立各表單(陣列)JSON資料--end
}

export default ltcpapFn;