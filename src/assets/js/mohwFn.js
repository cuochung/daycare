//衛福部相關 function
import api from '@/assets/js/api'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
createApp().use(createPinia())
import { useStore } from '@/stores/useStore'
const store = useStore();

var mohwFn = {
  /*
  上傳資料到衛福部 -> 紀錄成功的ticket ; 
  2022.9.30 新增 apiFn = 'Evaluation' 預設值為全人評估; 
  需求摘要 CaseSummary
  居護照護計畫 CarePlan 
  照護紀錄 CareRecord
  */
  pushToMOHW(postItem, useDataBase, jsonfile, apiFn = 'Evaluation') {
    return new Promise((resolve, reject) => {
      // resolve(false);
      if (store.state.cData.sKEY && store.state.cData.aID) {
        var SecretKey = store.state.cData.sKEY;
        var id = store.state.cData.aID;
      } else {
        store.showToastMulti({
          type: "warning",
          message: "衛福部授權碼不合法,請重新確認!!",
          closeTime: 5,
        });
        resolve(false);
      }
      let url = `${store.state.mohw_url}/${apiFn}`;

      // test server info
      // url = `http://114.34.167.172:49153/NursingHome/API/nhcApi/Evaluation`;
      if (store.state.mohw_url.includes('NursingHome')) {
        // SecretKey = "ApEy6o08+Ij3lCK/c+JSA55aSMarOb";
        SecretKey = "Nb/ZHjwe4zey1BuksPiWqf/AQ6e2b0";
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

          //更新ticket 到各表單記錄資料;2024.4.6 如果apiFn 是 CarePlan 就不更新記錄;只記錄前一次 CaseSummary 時的trick
          if (apiFn == 'CarePlan') {
            // let pop = { msg: "上傳成功!", type: true, theme: "success" };
            // store.commit("snackbar", pop);
            resolve(true)
          } else {
            let updateData = {
              snkey: postItem.snkey,
              datalist: JSON.stringify(postItem),
              edit_man: "pass",
            };
            api.options("general/edit/" + store.state.databaseName + "/" + useDataBase, updateData)
              .then((rs) => {
                if (rs.state == 1) {
                  store.showToastMulti({
                    type: "success",
                    message: "已上傳!! <br> 實際上傳狀況請參照 <br>衛福部綜合功能-[實際上傳狀態]",
                    closeTime: 5,
                  });
                  resolve(true)
                  // this.getAllData();
                }
              });

          }
        } else {
          alert(rs.message);
        }

      });

    });
  },
  //判斷上傳到衛福部的狀態
  checkMOHWData(postItem, useDataBase, apiFn = 'Evaluation', showMsg = true) {
    let setReturnMsg = {
      Evaluation: '全人評估處理完成',
      CarePlan: '需求摘要資料處理完成',
      CareRecord: '照護紀錄處理完成',
    }

    return new Promise((resolve, reject) => {
      let SecretKey = store.state.cData.sKEY;
      let id = store.state.cData.aID;
      let url = `${store.state.mohw_url}/GetLogByTicket`;
      let formData = {
        ticket: postItem.uploadData.ticket,
      };

      // test server info
      // url = `http://114.34.167.172:49153/NursingHome/API/nhcApi/GetLogByTicket`;
      if (store.state.mohw_url.includes('NursingHome')) {
        // SecretKey = "ApEy6o08+Ij3lCK/c+JSA55aSMarOb";
        SecretKey = "Nb/ZHjwe4zey1BuksPiWqf/AQ6e2b0";
      }
      // SecretKey = "ApEy6o08+Ij3lCK/c+JSA55aSMarOb";
      // id = "7405310211";
      // test server info end

      let postData = {
        url: url,
        SecretKey: SecretKey,
        AGENCY_ID: id,
        formData: formData,
      };

      api.options("posttoapi/getlog", postData)
        .then((rs) => {
          console.log('postRS:', typeof (rs), rs, setReturnMsg[apiFn])

          if (rs.code == 400){
            console.log('run 400 status',rs)
            store.showToastMulti({
              type: "warning",
              message: "上傳未完成,請五分鐘後再確認!或參考衛福部綜合功能中的 顯示衛福上傳狀態",
              closeTime: 5,
            });
          }

          if (rs.code == 200){
            console.log('run 200 status', rs)

            if (rs.data.includes(setReturnMsg[apiFn])){
              postItem.uploadState = rs;

              let updateData = {
                snkey: postItem.snkey,
                datalist: JSON.stringify(postItem),
                edit_man: "pass",
              };
              api.options("general/edit/" + store.state.databaseName + "/" + useDataBase, updateData)
                .then((rs) => {
                  if (rs.state == 1) {
                    if (showMsg) {
                      store.showToastMulti({
                        type: "success",
                        message: "確認已上傳成功!",
                        closeTime: 5,
                      });
                    }
                    resolve(rs)
                  }
                });
            }
          }

          //測試json格式
          function isJsonString(str) {
            try {
              JSON.parse(str); // 嘗試解析字串
              return true; // 如果解析成功，回傳 true
            } catch (e) {
              return false; // 如果解析失敗，回傳 false
            }
          }

          let rsData
          if (isJsonString(rs.data)){
            // console.log(1)
            rsData = JSON.parse(rs.data)
          }else{
            // console.log(2)
            rsData = {
              log_date : rs.data,
              log_content : rs.data
            }
            
          }

          // console.log('rsData',rsData)
          
          // 設置訊息內容到 state (如果需要保留此功能，可以在 store 中添加對應的 state)
          // store.state.msgcontent = rsData;


          //2024.12.18 以下為舊版判斷
          // let newRs = rs
          // if (typeof (rs) == 'string') {
          //   newRs = JSON.parse(rs);
          // }
          // if (newRs.code == 200
          //   && !JSON.parse(newRs.data)[0].log_content.includes('異常')  //2022.10.2調整為回傳code為200就算成功
          // ) {
          //   postItem.uploadState = newRs;

          //   let updateData = {
          //     snkey: postItem.snkey,
          //     datalist: JSON.stringify(postItem),
          //     edit_man: "pass",
          //   };
          //   api.options("general/edit/" + store.state.databaseName + "/" + useDataBase, updateData)
          //     .then((rs) => {
          //       if (rs.state == 1) {
          //         if (showMsg) {
          //           let pop = { msg: "確認已上傳成功!", type: true, theme: "success" };
          //           store.commit("snackbar", pop);
          //         }
          //         resolve(newRs)
          //       }
          //     });
          // } else {
          //   // console.log(postItem, 'error')
          //   if (showMsg) {
          //     let pop = {
          //       msg: "上傳未完成,請五分鐘後再確認!或參考衛福部綜合功能中的 顯示衛福上傳狀態",
          //       type: true,
          //       theme: "warning",
          //     };
          //     store.commit("snackbar", pop);
          //   }
          //   resolve(newRs)
          // }

          // if (newRs.code == 400) {
          //   let pop = {
          //     msg: newRs.message,
          //     type: true,
          //     theme: "warning",
          //   };
          //   store.commit("snackbar", pop);
          // }

          // if (typeof (newRs.data) == 'string') { newRs.data = JSON.parse(newRs.data) }
          // store.commit("setData", {
          //   tableName: "msgcontent",
          //   data: newRs.data,
          // });
        });

    })
  },

  //指定api,上傳到衛福部 ;目前用到的api有 BaseData->個人資料 
  async uploadtoMOHW(datas, mohwapi) {
    console.log('uploadtoMOHW', datas, mohwapi)
    if (store.state.cData.sKEY && store.state.cData.aID) {
      var SecretKey = store.state.cData.sKEY;
      var id = store.state.cData.aID;
    } else {
      store.showToastMulti({
        type: "warning",
        message: "衛福部授權碼不合法,請重新確認!!",
        closeTime: 5,
      });
      return false;
    }
    let url = `${store.state.mohw_url}/${mohwapi}`;

    //路徑含 'NursingHome' 代表上傳的為測試機 SecretKey 切為測試機
    if (store.state.mohw_url.includes('NursingHome')) {
      // SecretKey = "ApEy6o08+Ij3lCK/c+JSA55aSMarOb";
      SecretKey = "Nb/ZHjwe4zey1BuksPiWqf/AQ6e2b0";
    }
    // test info zone
    // url = `http://114.34.167.172:49153/NursingHome/API/nhcApi/BaseData`;
    // id = "7405310211";
    // test info zone end

    let postData = {
      url: url,
      SecretKey: SecretKey,
      AGENCY_ID: id,
      jsonfile: JSON.stringify({ DataList: datas }),
    };

    return await api.options("posttoapi/postjson", postData).then((rs) => {
      console.log(rs);
      let newRs = rs;
      // let newRs = JSON.parse(rs);
      if (newRs.code == 200) {
        // alert("上傳成功!");
        store.showToastMulti({
          type: "success",
          message: "上傳成功!",
          closeTime: 5,
        });
        // return true
        // }else{
        // return false
      }
      return newRs;
    });
  },


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

  //建構 疾病史評估表 json檔
  returnMedicalHistoriesJSON(postItems) {
    let dataArr = [];

    postItems.forEach(postItem => {
      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      let finalPostData = {}
      finalPostData.Date = postItem.Date;
      if (findNurse && findNurse.idNum) {
        finalPostData.NurseID = findNurse.idNum;
      } else {
        finalPostData.NurseID = "N223456789";
      }

      // finalPostData.AssessmentNo = this.items.length; //目前資料筆數
      finalPostData.AnsOther_1 = postItem.AnsOther_1
      finalPostData.AnsOther_2 = postItem.AnsOther_2
      finalPostData.MedicalHistoryQuestions = [
        {
          "Question": "心臟問題(只包含心臟)",
          "Answer": postItem.qq1
        },
        {
          "Question": "周邊血管系統問題(包括高血壓)",
          "Answer": postItem.qq2
        },
        {
          "Question": "造血系統問題(貧血、血球、淋巴、骨髓、脾臟等)",
          "Answer": postItem.qq3
        },
        {
          "Question": "呼吸系統問題(肺部、支氣管、氣管及抽菸狀況)",
          "Answer": postItem.qq4
        },
        {
          "Question": "眼耳鼻喉問題",
          "Answer": postItem.qq5
        },
        {
          "Question": "上消化道問題(食道、胃、十二指腸)",
          "Answer": postItem.qq6
        },
        {
          "Question": "下消化道問題(小腸、大腸、直腸)",
          "Answer": postItem.qq7
        },
        {
          "Question": "肝膽胰臟問題",
          "Answer": postItem.qq8
        },
        {
          "Question": "腎臟問題",
          "Answer": postItem.qq9
        },
        {
          "Question": "其他泌尿生殖系統問題(輸尿管、尿道、膀胱、攝護腺、其他生殖系統問題)",
          "Answer": postItem.qq10
        },
        {
          "Question": "肌肉骨骼皮膚問題",
          "Answer": postItem.qq11
        },
        {
          "Question": "神經系統問題(腦部、脊髓、周邊神經等、不包含失智症)",
          "Answer": postItem.qq12
        },
        {
          "Question": "內分泌、感染與代謝問題(包含糖尿病、甲狀腺、肥胖、乳房異常、感染性疾病與毒藥物問題)",
          "Answer": postItem.qq13
        },
        {
          "Question": "情緒與行為問題(包括憂鬱、焦慮、激躁、急性混亂、瞻妄及失智症等問題)",
          "Answer": postItem.qq14
        }
      ]

      dataArr.push(finalPostData)
    })
    return dataArr;
  },

  //建構 藥物安全性評估表 json檔
  returnDrugSafetiesJSON(postItems) {
    let dataArr = [];

    postItems.forEach(postItem => {
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      let finalPostData = {}
      finalPostData.Date = postItem.Date;

      if (findNurse && findNurse.idNum) {
        finalPostData.NurseID = findNurse.idNum;
      } else {
        finalPostData.NurseID = "N223456789";
      }
      
      // finalPostData.AssessmentNo = this.items.length; //目前資料筆數

      if (postItem.LongUseing == '有') {
        finalPostData.Questions = [
          {
            "Question": "是否有長期使用藥物",
            "Answer": "有",
            "Statement1": ""
          },
          {
            "Question": "目前使用中的藥物種類",
            "Answer": `有`,
            "Statement1": `${postItem.qq1Statement1}`
          },
          {
            "Question": "使用精神用藥",
            "Answer": postItem.qq2,
            "Statement1": ""
          },
          {
            "Question": "使用止痛用藥",
            "Answer": postItem.qq3,
            "Statement1": ""
          },
          {
            "Question": "是否存在多重用藥問題",
            "Answer": postItem.qq4,
            "Statement1": ""
          },
          {
            "Question": "目前是否使用有自行購藥或保健營養品(電台、他人介紹..等非醫療院所取得)",
            "Answer": postItem.qq5,
            "Statement1": postItem.qq5 == '有' ? postItem.qq5Statement5 : ''
          }
        ]
      } else {
        finalPostData.Questions = [
          {
            "Question": "是否有長期使用藥物",
            "Answer": "無",
            "Statement1": ""
          }
        ]
      }

      finalPostData.DrugInUses = postItem.DrugInUses;
      dataArr.push(finalPostData)
    })
    return dataArr;
  },

  //建構 身體評估評估表 json檔
  returnBodyEvaluationsJSON(postItems) {
    let dataArr = [];

    postItems.forEach(postItem => {
      // 2025.9.11 加入判斷水腫等級部位資料是否存在；如果存在則使用QC104_Part_LIST 組成資料；未組成資料時；顯示錯誤訊息
      if (postItem.skin4 && postItem.skin4.text == '有' && (!postItem.QC104_Part_LIST || postItem.QC104_Part_LIST.length == 0)) {
        alert('衛福部調整水腱級數格式：水腫等級&部位設定至少要有一項!!')
        return;
      }
      

      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      let finalPostData = {}
      finalPostData.Date = postItem.Date;
      if (findNurse && findNurse.idNum) {
        finalPostData.NurseID = findNurse.idNum;
      } else {
        finalPostData.NurseID = "N223456789";
      }
      // finalPostData.AssessmentNo = this.items.length; //目前資料筆數
      // finalPostData.BodyQuestions = []

      //處理BodyQuestions內需要的資料格式
      // Object.values(postItem).forEach((i, index) => {
      //   if (typeof (i) == 'object' && !i.code) {  //物件類別資料才是要判斷的內容 i.code是表示是回傳的資料狀況
      //     if (i.length == undefined && i.Question != '疫苗' && i.Question != '跌倒') {  //標準資料
      //       // console.log('1.標準資料:',index);
      //       /* 2023.4.20 只處理額外缺少的資料;原始存在的判斷不新增缺的,都由最下面的
      //         finalPostData.BodyQuestions.push( this.returnBodyQuestionsType1(i) ) 去處理
      //         新增如果資料是視力時,而且資料不是"有障礙"時,要另外放入預設值
      //         新增如果資料是聽力時,而且資料不是"有障礙"時,要另外放入預設值
      //         新增如果資料是溝通時,而且資料是"無障礙"時,要另外放入預設值
      //         新增如果資料是水腫級數時,而且資料是"無"時,要另外放入預設值
      //         新增如果資料是睡眠時,而且資料不是"有障礙"時,要另外放入預設值
      //         新增如果資料是輔助器時,而且資料是"無"時,要另外放入預設值
      //       */
      //       if (i.Question == '視力' && i.text != '有障礙') {
      //         finalPostData.BodyQuestions.push(
      //           {
      //             "Question": "視力-部位",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           },
      //           {
      //             "Question": "視力-影響日常活動",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           },
      //           {
      //             "Question": "視力-輔具",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           }
      //         )
      //       }
      //       if (i.Question == '聽力' && i.text != '有障礙') {
      //         finalPostData.BodyQuestions.push(
      //           {
      //             "Question": "聽力-部位",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           },
      //           {
      //             "Question": "聽力-影響日常活動",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           },
      //           {
      //             "Question": "聽力-輔具",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           }
      //         )
      //       }
      //       if (i.Question == '溝通' && i.text == '無障礙') {
      //         finalPostData.BodyQuestions.push(
      //           {
      //             "Question": "溝通-影響日常活動",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           },
      //           {
      //             "Question": "說話",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           },
      //           {
      //             "Question": "理解",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           }
      //         )
      //       }
      //       if (i.Question == '水腫級數' && i.text == '無') {
      //         finalPostData.BodyQuestions.push(
      //           {
      //             "Question": "水腫等級",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           }
      //         )
      //       }
      //       if (i.Question == '睡眠' && i.text != '有障礙') {
      //         finalPostData.BodyQuestions.push(
      //           {
      //             "Question": "服用藥物",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           },
      //           {
      //             "Question": "藥物類別",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           },
      //           {
      //             "Question": "服用頻率",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           }
      //         )
      //       }
      //       if (i.Question == '服用藥物' && i.text == '無') {
      //         finalPostData.BodyQuestions.push(
      //           {
      //             "Question": "藥物類別",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           },
      //           {
      //             "Question": "服用頻率",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           }
      //         )
      //       }
      //       if (i.Question == '輔助器' && i.text == '無') {
      //         finalPostData.BodyQuestions.push(
      //           {
      //             "Question": "有輔助器",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           },
      //           {
      //             "Question": "鼻導管",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           },
      //           {
      //             "Question": "氧氣面罩",
      //             "Answer": "",
      //             "MultipleAnswer": "",
      //             "Other": ""
      //           }
      //         )
      //       }
      //       if (i.Question == '輔助器' && i.text == '有') {
      //         finalPostData.BodyQuestions.push(
      //           {
      //             "Question": "有輔助器",
      //             "Answer": i.MultipleAnswer,
      //             "MultipleAnswer": i.Other,
      //             "Other": ""
      //           },
      //         )
      //       }

      //       finalPostData.BodyQuestions.push(this.returnBodyQuestionsType1(i))
      //     }

      //     if (i.length == undefined && i.Question == '跌倒') {  //標準資料 -> vaccine1-疫苗 要另外處理
      //       // console.log('3.標準資料-跌倒:',index);
      //       finalPostData.BodyQuestions.push(this.returnBodyQuestionsType2(i))

      //       //2023.4.20 新增處理跌倒次數資料
      //       let pushData = {};
      //       if (i.text == '無') {
      //         pushData = {
      //           "Question": "跌倒次數",
      //           "Answer": "",
      //           "MultipleAnswer": "",
      //           "Other": ""
      //         }
      //       } else {
      //         pushData = {
      //           "Question": "跌倒次數",
      //           "Answer": i.Answer0,
      //           "MultipleAnswer": "",
      //           "Other": ""
      //         }
      //       }
      //       finalPostData.BodyQuestions.push(pushData)

      //     }

      //     if (i.length == undefined && i.Question == '疫苗') {  //標準資料 -> vaccine1-疫苗 要另外處理
      //       // console.log('2.標準資料-疫苗:',index);
      //       finalPostData.BodyQuestions.push(this.returnBodyQuestionsType3(i))
      //     }

      //     if (i.length && i.length != undefined) {  //Answer兩筆物件以上類型
      //       // console.log('4.兩筆物件以上類型:',i,index,i);
      //       finalPostData.BodyQuestions.push(this.returnBodyQuestionsType4(i))
      //     }

      //   }
      // })

      // 取得資料的 text
      function returnvText(val) {
        console.log('val',val)
        let str = ""
        val.forEach((item, index) => {
          if (index > 0) { str += ',' }
          str += item.text;
        })
        return str;
      }
      // 取得疫苗的種類
      function returnVaccineKind(val) {
        let str = ""
        val.forEach((item) => {
          if (item.selected) {
            if (str.length > 0) { str += ',' }
            str += item.kind;
          }
        })
        return str;
      }
      // 取得疫苗的年份或記不記得
      function returnVaccineYearForget(val) {
        let str = ""
        val.forEach((item) => {
          if (item.selected) {
            if (str.length > 0) { str += ',' }
            str += item.forget ? '不記得' : item.year;
          }
        })
        return str;
      }

      //水腫等級&部位
      function returnPartList(val,type) {
        let str = ""
        val.forEach((item,index) => {
          if (index > 0){
            str += ',';  
          }
          str += item[type];
        })
        return str;
      }

      //處理視力左右眼其他狀況
      function returnVision2Other(val){
        let vision2String = returnvText(val);
        let str = []
        if (vision2String.includes('左眼其他')) { str.push(val[0].V_HAS_OBS_Y_L_OTHER.replace(/,/g, "，")) }
        if (vision2String.includes('右眼其他')) { str.push(val[0].V_HAS_OBS_Y_R_OTHER.replace(/,/g, "，")) }
        return str.toString()
      }


      finalPostData.BodyQuestions = [
        {
          "Question": "睜眼",
          "Answer": postItem.mind1.text,
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "語言",
          "Answer": postItem.mind2.text,
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "運動",
          "Answer": postItem.mind3.text,
          "MultipleAnswer": "",
          "Other": ""
        },
        //視力
        {
          "Question": "視力",
          "Answer": postItem.vision1.text,
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "視力-部位",
          "Answer": "",
          "MultipleAnswer": postItem.vision2 ? returnvText(postItem.vision2) : "",
          "Other": postItem.vision2 ? returnVision2Other(postItem.vision2) : "",
          // "Other": postItem.vision2 && postItem.vision2[0].Other ? postItem.vision2[0].Other : ""
        },
        {
          "Question": "視力-影響日常活動",
          "Answer": postItem.vision1.text == '有障礙' ? postItem.vision3.text : '',
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "視力-輔具",
          "Answer": postItem.vision1.text == '有障礙' ? postItem.vision4.text : '',
          "MultipleAnswer": postItem.vision1.text == '有障礙' && postItem.vision4.text != '無' ? postItem.vision4.MultipleAnswer.toString() : "",
          "Other": postItem.vision1.text == '有障礙' && postItem.vision4.text != '無' && postItem.vision4.MultipleAnswer.includes('其他') ? postItem.vision4.Other : ""
        },
        //聽力
        {
          "Question": "聽力",
          "Answer": postItem.hearing1.text,
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "聽力-部位",
          "Answer": "",
          "MultipleAnswer": postItem.hearing2 ? returnvText(postItem.hearing2) : "", //2025.9.3 調整為MultipleAnswer放置主要答案
          "Other": ""
        },
        {
          "Question": "聽力-影響日常活動",
          "Answer": postItem.hearing1.text == '有障礙' ? postItem.hearing3.text : '',
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "聽力-輔具",
          "Answer": postItem.hearing1.text == '有障礙' ? postItem.hearing4.text : '',
          "MultipleAnswer": postItem.hearing1.text == '有障礙' && postItem.hearing4.text != '無' ? postItem.hearing4.MultipleAnswer.toString() : "",
          "Other": postItem.hearing1.text == '有障礙' && postItem.hearing4.text != '無' && postItem.hearing4.MultipleAnswer.includes('其他') ? postItem.hearing4.Other : ""
        },
        //溝通
        {
          "Question": "溝通",
          "Answer": postItem.communicate1.text,
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "溝通-影響日常活動",
          "Answer": postItem.communicate1.text == '有障礙' ? postItem.communicate2.text : '',
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "說話",
          "Answer": postItem.communicate1.text == '有障礙' ? postItem.communicate3.text : '',
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "理解",
          "Answer": postItem.communicate1.text == '有障礙' ? postItem.communicate4.text : '',
          "MultipleAnswer": "",
          "Other": ""
        },
        //口腔
        {
          "Question": "口腔外觀",
          "Answer": postItem.oralCavity1.text,
          "MultipleAnswer": postItem.oralCavity1.text == '異常' ? postItem.oralCavity1.MultipleAnswer.toString() : "",
          "Other": postItem.oralCavity1.text == '異常' && postItem.oralCavity1.MultipleAnswer.includes('其他') ? postItem.oralCavity1.Other : ""
        },
        {
          "Question": "特殊進食",
          "Answer": postItem.oralCavity2.text,
          "MultipleAnswer": postItem.oralCavity2.text == '有' ? postItem.oralCavity2.MultipleAnswer.toString() : "",
          "Other": postItem.oralCavity2.text == '有' && postItem.oralCavity2.MultipleAnswer.includes('特殊種類') ? postItem.oralCavity2.Other : ""
        },
        {
          "Question": "假牙狀況",
          "Answer": postItem.oralCavity3.text,
          "MultipleAnswer": postItem.oralCavity3.text == '有活動假牙' ? postItem.oralCavity3.MultipleAnswer.toString() : "",
          "Other": postItem.oralCavity3.text == '有活動假牙' && postItem.oralCavity3.MultipleAnswer.includes('其他') ? postItem.oralCavity3.Other : ""
        },
        {
          "Question": "備有個人口腔清潔工具",
          "Answer": postItem.oralCavity4.text,
          "MultipleAnswer": "",
          "Other": ""
        },
        {

          "Question": "備有個人口腔清潔工具-有自然牙、固定或活動假牙者",
          "Answer": "",
          "MultipleAnswer": postItem.oralCavity5MultipleAnswer ? postItem.oralCavity5MultipleAnswer.toString() : "",
          "Other": ""
        },
        {
          "Question": "備有個人口腔清潔工具-配戴活動假牙者",
          "Answer": "",
          "MultipleAnswer": postItem.oralCavity6MultipleAnswer ? postItem.oralCavity6MultipleAnswer.toString() : "",
          "Other": ""
        },
        {
          "Question": "備有個人口腔清潔工具-全口無牙且無活動假牙者",
          "Answer": "",
          "MultipleAnswer": postItem.oralCavity7MultipleAnswer ? postItem.oralCavity7MultipleAnswer.toString() : "",
          "Other": ""
        },
        {
          "Question": "口腔保健情形",
          "Answer": "平均每日執行飯後、睡前口腔清潔工作",
          "MultipleAnswer": postItem.oralCavity8MultipleAnswer.toString(),
          "Other": ""
        },
        //胃腸
        {
          "Question": "腹部狀態",
          "Answer": postItem.Gastrointestinal1.text,
          "MultipleAnswer": "",
          "Other": postItem.Gastrointestinal1.text == '其他' ? postItem.Gastrointestinal1.Other : ""
        },
        {
          "Question": "腸蠕動",
          "Answer": postItem.Gastrointestinal2.text,
          "MultipleAnswer": "",
          "Other": postItem.Gastrointestinal2.text == '其他' ? postItem.Gastrointestinal2.Other : ""
        },
        {
          "Question": "消化狀態",
          "Answer": postItem.Gastrointestinal3.text,
          "MultipleAnswer": "",
          "Other": postItem.Gastrointestinal3.text == '其他' ? postItem.Gastrointestinal3.Other : "",
        },
        //排泄
        {
          "Question": "排便型態",
          "Answer": postItem.excretion1.text,
          "MultipleAnswer": "",
          "Other": postItem.excretion1.text == '其他' ? postItem.excretion1.Other : ""
        },
        {
          "Question": "排便顏色",
          "Answer": postItem.excretion2.text,
          "MultipleAnswer": "",
          "Other": postItem.excretion2.text == '其他' ? postItem.excretion2.Other : "",
        },
        {
          "Question": "排便輔助",
          "Answer": postItem.excretion3.text,
          "MultipleAnswer": postItem.excretion3.text == '有' ? postItem.excretion3.MultipleAnswer.toString() : "",
          "Other": postItem.excretion3.text == '有' && postItem.excretion3.MultipleAnswer.includes('其他') ? postItem.excretion3.Other : ""
        },
        {
          "Question": "排尿型態",
          "Answer": postItem.excretion4.text,
          "MultipleAnswer": postItem.excretion4.text == '異常' ? postItem.excretion4.MultipleAnswer.toString() : "",
          "Other": postItem.excretion4.text == '異常' && postItem.excretion4.MultipleAnswer.includes('其他') ? postItem.excretion4.Other : ""
        },
        {
          "Question": "排尿顏色",
          "Answer": postItem.excretion5.text,
          "MultipleAnswer": "",
          "Other": postItem.excretion5.text == '異常' ? postItem.excretion5.Other : ""
        },
        {
          "Question": "排尿輔助",
          "Answer": postItem.excretion6.text,
          "MultipleAnswer": postItem.excretion6.text == '有' ? postItem.excretion6.MultipleAnswer.toString() : "",
          "Other": postItem.excretion6.text == '有' && postItem.excretion6.MultipleAnswer.includes('其他') ? postItem.excretion6.Other : ""
        },
        //皮膚
        {
          "Question": "溫度",
          "Answer": postItem.skin1.text,
          "MultipleAnswer": "",
          "Other": postItem.skin1.text == '其他' ? postItem.skin1.Other : ""
        },
        {
          "Question": "濕度",
          "Answer": postItem.skin2.text,
          "MultipleAnswer": "",
          "Other": postItem.skin2.text == '其他' ? postItem.skin2.Other : ""
        },
        {
          "Question": "顏色",
          "Answer": postItem.skin3.text,
          "MultipleAnswer": "",
          "Other": postItem.skin3.text == '其他' ? postItem.skin3.Other : ""
        },
        {
          "Question": "水腫級數",
          "Answer": postItem.skin4.text,
          "MultipleAnswer": "",
          "Other": ""
        },
        //舊版；2025.9.11 後改為新版本；水腫等級部位；透過QC104_Part_LIST 組成資料
        {
          "Question": "水腫等級",
          "Answer": postItem.skin4.text == '有' ? returnPartList(postItem.QC104_Part_LIST,'PART_LEVEL') : "",
          "MultipleAnswer": "",
          "Other": postItem.skin4.text == '有' ? returnPartList(postItem.QC104_Part_LIST,'PART_NAME') : "",
        },
        // { 
        //   "Question": "水腫等級",
        //   "Answer": postItem.skin4.text == '有' ? postItem.skin5.text : "",
        //   "MultipleAnswer": "",
        //   "Other": postItem.skin4.text == '有' ? postItem.skin4.Other : "",
        // },
        {
          "Question": "完整",
          "Answer": postItem.skin6.text,
          "MultipleAnswer": "",
          "Other": ""
        },
        //肌力
        {
          "Question": "左上肢",
          "Answer": postItem.muscle1.text,
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "右上肢",
          "Answer": postItem.muscle2.text,
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "左下肢",
          "Answer": postItem.muscle3.text,
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "右下肢",
          "Answer": postItem.muscle4.text,
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "行動能力問題",
          "Answer": postItem.muscle5.text,
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "肌力-輔具",
          "Answer": postItem.muscle6.text,
          "MultipleAnswer": postItem.muscle6.text == '有' ? postItem.muscle6.MultipleAnswer.toString() : "",
          "Other": postItem.muscle6.text == '有' && postItem.muscle6.MultipleAnswer.includes('其他') ? postItem.muscle6.Other : ""
        },
        //跌倒
        {
          "Question": "跌倒",
          "Answer": postItem.fall1.text,
          "MultipleAnswer": postItem.fall1.text == '有' ? postItem.fall1.MultipleAnswer.toString() : "",
          "Other": postItem.fall1.text == '有' && postItem.fall1.MultipleAnswer.includes('其他') ? postItem.fall1.Other : ""
        },
        {
          "Question": "跌倒次數",
          "Answer": postItem.fall1.text == '有' ? postItem.fall1.Answer0 : "",
          "MultipleAnswer": "",
          "Other": ""
        },
        //行為
        {
          "Question": "行為",
          "Answer": postItem.behavior1.text,
          "MultipleAnswer": postItem.behavior1.text == '有干擾行為' ? postItem.behavior1.MultipleAnswer.toString() : "",
          "Other": postItem.behavior1.text == '有干擾行為' && postItem.behavior1.MultipleAnswer.includes('其他') ? postItem.behavior1.Other : ""
        },
        //睡眠
        {
          "Question": "睡眠",
          "Answer": postItem.sleep1.text,
          "MultipleAnswer": postItem.sleep1.text == '有障礙' ? postItem.sleep1.MultipleAnswer.toString() : "",
          "Other": postItem.sleep1.text == '有障礙' && postItem.sleep1.MultipleAnswer.includes('其他') ? postItem.sleep1.Other : ""
        },
        {
          "Question": "服用藥物",
          "Answer": postItem.sleep1.text == '有障礙' ? postItem.sleep2.text : '',
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "藥物類別",
          "Answer": "",
          "MultipleAnswer": postItem.sleep1.text == '有障礙' && postItem.sleep2.text == '有' ? returnvText(postItem.sleep3) : "",
          "Other": postItem.sleep1.text == '有障礙' && postItem.sleep2.text == '有' && returnvText(postItem.sleep3).includes('其他') ? postItem.sleep3[0].Other : ""
        },
        {
          "Question": "服用頻率",
          "Answer": postItem.sleep1.text == '有障礙' && postItem.sleep2.text == '有' ? postItem.sleep4.text : '',
          "MultipleAnswer": "",
          "Other": ""
        },
        //呼吸
        {
          "Question": "輔助器",
          "Answer": postItem.breathe1.text,
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "有輔助器",
          "Answer": postItem.breathe1.text == '有' ? postItem.breathe1.MultipleAnswer.toString() : "",
          "MultipleAnswer": postItem.breathe1.text == '有' && postItem.breathe1.MultipleAnswer.includes('氧氣機') ? "鼻導管,氧氣面罩" : "",
          "Other": postItem.breathe1.text == '有' && postItem.breathe1.MultipleAnswer.includes('其他') ? postItem.breathe1.Other : ""
        },
        {
          "Question": "鼻導管",
          "Answer": postItem.breathe2 && postItem.breathe2.text == '有' && postItem.breathe2.Other ? postItem.breathe2.Other : "",
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "氧氣面罩",
          "Answer": postItem.breathe3 && postItem.breathe3.text == '有' && postItem.breathe3.Other ? postItem.breathe3.Other : "",
          "MultipleAnswer": "",
          "Other": ""
        },
        {
          "Question": "疫苗",
          "Answer": postItem.vaccine1.text,
          "MultipleAnswer": postItem.vaccine1.text == '有' ? returnVaccineKind(postItem.vaccine1.MultipleAnswer) : "",
          "Other": postItem.vaccine1.text == '有' ? returnVaccineYearForget(postItem.vaccine1.MultipleAnswer) : "",
        }
      ]

      dataArr.push(finalPostData)
    })
    return dataArr;
  },
  //重建BodyQuestions的資料
  // returnBodyQuestionsType1(i) {
  //   // console.log(i.Question)
  //   return {
  //     "Question": i.Question,
  //     "Answer": i.text,
  //     "MultipleAnswer": i.MultipleAnswer ? returnMultipleAnswer(i) : "",
  //     "Other": i.Other ? returnOther(i.Other) : "",
  //   }

  //   function returnMultipleAnswer(item) {
  //     let val = ""
  //     if (typeof (item.MultipleAnswer) == 'object') {
  //       Object.values(item.MultipleAnswer).forEach((AnswerItem, index) => {
  //         if (index > 0) { val += ',' }
  //         val += AnswerItem;
  //       })
  //     } else {
  //       val += item.MultipleAnswer
  //     }
  //     return val;
  //   }

  //   function returnOther(item) {
  //     if (typeof (item) == 'object') {
  //       let val = ""
  //       item.forEach((i, index) => {
  //         if (index) { val += ',' }
  //         val += i;
  //       })
  //       return val;
  //     } else {
  //       return item;
  //     }
  //   }

  // },
  // returnBodyQuestionsType2(i) {  //目前只有跌倒一個專用
  //   return {
  //     "Question": i.Question,
  //     "Answer0": i.Answer0 ? i.Answer0 : 0,
  //     "Answer": i.text,
  //     "MultipleAnswer": i.MultipleAnswer ? returnMultipleAnswer(i) : "",
  //     "Other": i.Other ? i.Other : "",
  //   }

  //   function returnMultipleAnswer(item) {
  //     let val = ""
  //     Object.values(item.MultipleAnswer).forEach((AnswerItem, index) => {
  //       if (index > 0) { val += ',' }
  //       val += AnswerItem;
  //     })
  //     return val;
  //   }

  // },
  // returnBodyQuestionsType3(i) {  //目前只有疫苗一個專用
  //   return {
  //     "Question": i.Question,
  //     "Answer": i.text,
  //     "MultipleAnswer": i.text == '有' ? returnMultipleAnswer(i, 'kind') : '',
  //     "Other": i.text == '有' ? returnMultipleAnswer(i, 'year') : '',
  //   }

  //   function returnMultipleAnswer(item, type) {
  //     let val = ""
  //     // console.log(item.MultipleAnswer,item)
  //     Object.values(item.MultipleAnswer).forEach((AnswerItem, index) => {
  //       if (AnswerItem.selected) {
  //         if (val.length > 0) { val += ',' }
  //         if (AnswerItem.forget && type == 'year') {
  //           val += '不記得';
  //         } else {
  //           val += AnswerItem[type];
  //         }
  //       }
  //     })
  //     return val;
  //   }

  // },
  // returnBodyQuestionsType4(i) {  ////兩筆物件以上類型
  //   return {
  //     "Question": i[0].Question,
  //     "Answer": returnDataType(i, 'text'),
  //     "MultipleAnswer": returnDataType(i, 'text'),
  //     "Other": i[0].Other ? i[0].Other : "",
  //   }

  //   function returnDataType(item, type) {
  //     let val = ""
  //     Object.values(item).forEach((dItem, index) => {

  //       if (index > 0) { val += ',' }
  //       val += dItem[type];
  //     })
  //     return val;
  //   }
  // },
  //建構 身體評估評估表 json檔 end

  //建構 壓力性損傷危險評估 json檔
  returnPressureInjuriesJSON(postItems) {
    let dataArr = [];

    postItems.forEach(postItem => {
      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      let finalPostData = {}
      finalPostData.Date = postItem.Date;
      if (findNurse && findNurse.idNum) {
        finalPostData.NurseID = findNurse.idNum;
      } else {
        finalPostData.NurseID = "N223456789";
      }
      // finalPostData.AssessmentNo = this.items.length; //目前資料筆數
      finalPostData.IsBraden = "已評估",
        finalPostData.Questions = [
          {
            "Question": "知覺感受",
            "Answer": postItem.qq1.text,
            "Point": postItem.qq1.Point
          },
          {
            "Question": "潮溼程度",
            "Answer": postItem.qq2.text,
            "Point": postItem.qq2.Point
          },
          {
            "Question": "活動能力",
            "Answer": postItem.qq3.text,
            "Point": postItem.qq3.Point
          },
          {
            "Question": "移動能力",
            "Answer": postItem.qq4.text,
            "Point": postItem.qq4.Point
          },
          {
            "Question": "營養攝取",
            "Answer": postItem.qq5.text,
            "Point": postItem.qq5.Point
          },
          {
            "Question": "摩擦力/剪力",
            "Answer": postItem.qq6.text,
            "Point": postItem.qq6.Point
          }
        ]

      dataArr.push(finalPostData)
    })
    return dataArr;

  },

  //建構 跌倒危險性評估 json檔
  returnFallRisksJSON(postItems) {
    let dataArr = [];

    postItems.forEach(postItem => {
      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      let finalPostData = {}
      finalPostData.Date = postItem.Date;
      if (findNurse && findNurse.idNum) {
        finalPostData.NurseID = findNurse.idNum;
      } else {
        finalPostData.NurseID = "N223456789";
      }
      // finalPostData.AssessmentNo = this.items.length; //目前資料筆數
      finalPostData.Questions = [
        {
          "Question": "年紀65歲以上",
          "Answer": postItem.qq1.text,
          "Options": "",
          // "Point": postItem.qq1.Point
        },
        {
          "Question": "過去一年內曾跌倒",
          "Answer": postItem.qq2.text,
          "Options": "",
          // "Point": postItem.qq2.Point
        },
        {
          "Question": "最近意識/認知出現異常",
          "Answer": postItem.qq3.text,
          "Options": postItem.qq3.text == '是' ? returnOptions(postItem.qq3.Options) : null,
          // "Point": postItem.qq3.Point
        },
        {
          "Question": "活動功能異常",
          "Answer": postItem.qq4.text,
          "Options": postItem.qq4.text == '是' ? returnOptions(postItem.qq4.Options) : null,
          // "Point": postItem.qq4.Point
        },
        {
          "Question": "體能虛弱",
          "Answer": postItem.qq5.text,
          "Options": postItem.qq5.text == '是' ? returnOptions(postItem.qq5.Options) : null,
          // "Point": postItem.qq5.Point
        },
        {
          "Question": "知覺障礙",
          "Answer": postItem.qq6.text,
          "Options": postItem.qq6.text == '是' ? returnOptions(postItem.qq6.Options) : null,
          // "Point": postItem.qq6.Point
        },
        {
          "Question": "暈眩/低血壓",
          "Answer": postItem.qq7.text,
          "Options": postItem.qq7.text == '是' ? returnOptions(postItem.qq7.Options) : null,
          // "Point": postItem.qq7.Point
        },
        {
          "Question": "使用藥物",
          "Answer": postItem.qq8.text,
          "Options": postItem.qq8.text == '是' ? returnOptions(postItem.qq8.Options) : null,
          // "Point": postItem.qq8.Point,
          "Other": postItem.qq8 && postItem.qq8.Options && postItem.qq8.Options.includes('其他') ? postItem.qq8.Other : ""
        }
      ]

      function returnOptions(OptionsItems) {
        let val = ''
        OptionsItems.forEach((i, index) => {
          if (index) { val += ',' }
          val += i;
        })
        return val;
      }

      dataArr.push(finalPostData)
    })
    return dataArr;
  },

  //建構 日常生活功能評估 json檔
  returnADLsJSON(postItems) {
    let dataArr = [];

    postItems.forEach(postItem => {
      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      let finalPostData = {}
      finalPostData.Date = postItem.Date;
      if (findNurse && findNurse.idNum) {
        finalPostData.NurseID = findNurse.idNum;
      } else {
        finalPostData.NurseID = "N223456789";
      }
      // finalPostData.AssessmentNo = this.items.length; //目前資料筆數
      finalPostData.IsBarthel = "已評估",
        finalPostData.Questions = [
          {
            "Question": "進食",
            "Answer": postItem.qq1.text,
            "Point": postItem.qq1.Point
          },
          {
            "Question": "移位",
            "Answer": postItem.qq2.text,
            "Point": postItem.qq2.Point
          },
          {
            "Question": "衛生",
            "Answer": postItem.qq3.text,
            "Point": postItem.qq3.Point
          },
          {
            "Question": "如廁",
            "Answer": postItem.qq4.text,
            "Point": postItem.qq4.Point
          },
          {
            "Question": "洗澡",
            "Answer": postItem.qq5.text,
            "Point": postItem.qq5.Point
          },
          {
            "Question": "走動",
            "Answer": postItem.qq6.text,
            "Point": postItem.qq6.Point
          },
          {
            "Question": "樓梯",
            "Answer": postItem.qq7.text,
            "Point": postItem.qq7.Point
          },
          {
            "Question": "穿脫",
            "Answer": postItem.qq8.text,
            "Point": postItem.qq8.Point
          },
          {
            "Question": "大便",
            "Answer": postItem.qq9.text,
            "Point": postItem.qq9.Point
          },
          {
            "Question": "小便",
            "Answer": postItem.qq10.text,
            "Point": postItem.qq10.Point
          }
        ]

      dataArr.push(finalPostData)
    })
    return dataArr;

  },

  //建構 工具性日常生活活動功能評估 json檔
  returnIADLsJSON(postItems) {
    let dataArr = [];

    postItems.forEach(postItem => {
      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      let finalPostData = {}
      finalPostData.Date = postItem.Date;
      if (findNurse && findNurse.idNum) {
        finalPostData.NurseID = findNurse.idNum;
      } else {
        finalPostData.NurseID = "N223456789";
      }
      // finalPostData.AssessmentNo = this.items.length; //目前資料筆數
      finalPostData.IsIADL = "已評估",
        finalPostData.Questions = [
          {
            "Question": "購物",
            "Answer": postItem.qq1.text,
            "Point": postItem.qq1.Point
          },
          {
            "Question": "家務",
            "Answer": postItem.qq2.text,
            "Point": postItem.qq2.Point
          },
          {
            "Question": "理財",
            "Answer": postItem.qq3.text,
            "Point": postItem.qq3.Point
          },
          {
            "Question": "備食",
            "Answer": postItem.qq4.text,
            "Point": postItem.qq4.Point
          },
          {
            "Question": "交通",
            "Answer": postItem.qq5.text,
            "Point": postItem.qq5.Point
          },
          {
            "Question": "電話",
            "Answer": postItem.qq6.text,
            "Point": postItem.qq6.Point
          },
          {
            "Question": "洗衣",
            "Answer": postItem.qq7.text,
            "Point": postItem.qq7.Point
          },
          {
            "Question": "服藥",
            "Answer": postItem.qq8.text,
            "Point": postItem.qq8.Point
          }
        ]
      dataArr.push(finalPostData)
    })
    return dataArr;

  },

  //建構 認知功能評估 json檔
  returnDementiasJSON(postItems) {
    let dataArr = [];

    postItems.forEach(postItem => {
      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      let finalPostData = {}
      finalPostData.Date = postItem.Date;
      if (findNurse && findNurse.idNum) {
        finalPostData.NurseID = findNurse.idNum;
      } else {
        finalPostData.NurseID = "N223456789";
      }
      
      // finalPostData.AssessmentNo = this.items.length; //目前資料筆數

      if (postItem.qq12) { //判斷是否為無法評估 (qq12存在代表無法評估)
        finalPostData.Questions = []
        finalPostData.Statement = postItem.qq12
      } else {
        finalPostData.IsSPMSQ = "已評估",
          finalPostData.Questions = [
            {
              "Question": "今天是幾年幾月幾日？__年__月__日",
              "Answer": postItem.qq1.text,
              "Point": postItem.qq1.Point
            },
            {
              "Question": "今天是星期幾？",
              "Answer": postItem.qq2.text,
              "Point": postItem.qq2.Point
            },
            {
              "Question": "這裡是什麼地方？",
              "Answer": postItem.qq3.text,
              "Point": postItem.qq3.Point
            },
            {
              "Question": "你的電話號碼是幾號？",
              "Answer": postItem.qq4.text,
              "Point": postItem.qq4.Point
            },
            {
              "Question": "你住在什麼地方？",
              "Answer": postItem.qq5.text,
              "Point": postItem.qq5.Point
            },
            {
              "Question": "你幾歲了？",
              "Answer": postItem.qq6.text,
              "Point": postItem.qq6.Point
            },
            {
              "Question": "你的生日是哪一天？",
              "Answer": postItem.qq7.text,
              "Point": postItem.qq7.Point
            },
            {
              "Question": "現任總統是誰？",
              "Answer": postItem.qq8.text,
              "Point": postItem.qq8.Point
            },
            {
              "Question": "前任總統是誰？",
              "Answer": postItem.qq9.text,
              "Point": postItem.qq9.Point
            },
            {
              "Question": "你媽媽叫什麼名字？",
              "Answer": postItem.qq10.text,
              "Point": postItem.qq10.Point
            },
            {
              "Question": "從20減3開始算，一直減3減下去。",
              "Answer": postItem.qq11.text,
              "Point": postItem.qq11.Point
            }
          ]
      }


      dataArr.push(finalPostData)
    })
    return dataArr;



  },

  //建構 簡式健康量表評估 json檔
  returnBSRS5sJSON(postItems) {
    let dataArr = [];

    postItems.forEach(postItem => {
      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      let finalPostData = {}
      finalPostData.Date = postItem.Date;
      if (findNurse && findNurse.idNum) {
        finalPostData.NurseID = findNurse.idNum;
      } else {
        finalPostData.NurseID = "N223456789";
      }
      // finalPostData.AssessmentNo = this.items.length; //目前資料筆數
      // finalPostData.IsGDS5 = "已評估",
      // finalPostData.Statement = "情緒備註"

      if (postItem.note) { //判斷是否為無法評估 (note存在代表無法評估)
        finalPostData.Questions = []
        finalPostData.Statement = postItem.note
      } else {
        finalPostData.Questions = [
          {
            "Question": "睡眠困難，譬如難以入睡、易醒或早醒",
            "Answer": postItem.qq1.text,
            "Point": postItem.qq1.Point
          },
          {
            "Question": "感覺緊張或不安",
            "Answer": postItem.qq2.text,
            "Point": postItem.qq2.Point
          },
          {
            "Question": "覺得容易苦惱或動怒",
            "Answer": postItem.qq3.text,
            "Point": postItem.qq3.Point
          },
          {
            "Question": "感覺憂鬱、心情低落",
            "Answer": postItem.qq4.text,
            "Point": postItem.qq4.Point
          },
          {
            "Question": "覺得比不上別人",
            "Answer": postItem.qq5.text,
            "Point": postItem.qq5.Point
          },
          {
            "Question": "有自殺的想法",
            "Answer": postItem.qq6.text,
            "Point": postItem.qq5.Point
          },

        ]
      }
      dataArr.push(finalPostData)
    })
    return dataArr;
  },

  //建構 情緒問題評估 json檔
  returnGeriatricDepressionScalesJSON(postItems) {
    let dataArr = [];

    postItems.forEach(postItem => {
      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      let finalPostData = {}
      finalPostData.Date = postItem.Date;
      if (findNurse && findNurse.idNum) {
        finalPostData.NurseID = findNurse.idNum;
      } else {
        finalPostData.NurseID = "N223456789";
      }
      // finalPostData.AssessmentNo = this.items.length; //目前資料筆數
      // finalPostData.IsGDS5 = "已評估",
      finalPostData.Statement = "情緒備註"

      if (postItem.note) { //判斷是否為無法評估 (note存在代表無法評估)
        finalPostData.Questions = []
        finalPostData.Statement = postItem.note
      } else {
        finalPostData.Questions = [
          {
            "Question": "您對您的生活感到滿意嗎？",
            "Answer": postItem.qq1.text,
            "Point": postItem.qq1.Point
          },
          {
            "Question": "您是否常常感到厭煩？",
            "Answer": postItem.qq2.text,
            "Point": postItem.qq2.Point
          },
          {
            "Question": "您是否常常感到無論做什麼都沒有用？",
            "Answer": postItem.qq3.text,
            "Point": postItem.qq3.Point
          },
          {
            "Question": "您是否比較喜歡待在家裡，較不喜歡外出及不喜歡做新的事？",
            "Answer": postItem.qq4.text,
            "Point": postItem.qq4.Point
          },
          {
            "Question": "您是否感覺活得很沒有價值？",
            "Answer": postItem.qq5.text,
            "Point": postItem.qq5.Point
          }
        ]
      }
      dataArr.push(finalPostData)
    })
    return dataArr;


  },

  //建構 簡易營養評估 json檔
  returnMNASFsJSON(postItems) {
    let dataArr = [];

    postItems.forEach(postItem => {
      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      let finalPostData = {}
      finalPostData.Date = postItem.Date;
      if (findNurse && findNurse.idNum) {
        finalPostData.NurseID = findNurse.idNum;
      } else {
        finalPostData.NurseID = "N223456789";
      }
      // finalPostData.AssessmentNo = this.items.length; //目前資料筆數
      finalPostData.IsMNASF = "已評估",
        finalPostData.Questions = [
          {
            "Question": "過去三個月之中，是否因食慾不佳、消化問題、咀嚼或吞嚥困難，以致進食量減少？",
            "Answer": postItem.qq1.text,
            // "Point": postItem.qq1.Point
          },
          {
            "Question": "近三個月體重變化",
            "Answer": postItem.qq2.text,
            // "Point": postItem.qq2.Point
          },
          {
            "Question": "行動力",
            "Answer": postItem.qq3.text,
            // "Point": postItem.qq3.Point
          },
          {
            "Question": "過去三個月內曾有精神性壓力或急性疾病發作？",
            "Answer": postItem.qq4.text,
            // "Point": postItem.qq4.Point
          },
          {
            "Question": "神經精神問題",
            "Answer": postItem.qq5.text,
            // "Point": postItem.qq5.Point
          },
          // {
          //   "Question": "身體質量指數(BMI)=體重(公斤)/身高(公尺)2",
          //   "Answer": postItem.qq6 ? postItem.qq6.text : "",
          //   // "Point": postItem.qq6 ? postItem.qq6.Point : 0
          // },
          // {
          //   "Question": "若BMI無法取得,用小腿圍或臂中圍代替(公分)",
          //   "Answer": postItem.qq7 ? postItem.qq7.text : "",
          //   // "Point": postItem.qq7 ? postItem.qq7.Point : 0
          // },

        ]

      if (postItem.qq6 && postItem.qq6.text != '') {
        finalPostData.Questions.push({
          "Question": "身體質量指數(BMI)=體重(公斤)/身高(公尺)2",
          "Answer": postItem.qq6.text,
        },
          {
            "Question": "若BMI無法取得，用小腿圍或臂中圍代替(公分)",
            "Answer": "",
          })
      } else {
        finalPostData.Questions.push({
          "Question": "身體質量指數(BMI)=體重(公斤)/身高(公尺)2",
          "Answer": ""
        }, {
          "Question": "若BMI無法取得，用小腿圍或臂中圍代替(公分)",
          "Answer": postItem.qq7.text,
        })
      }
      dataArr.push(finalPostData)
    })
    return dataArr;
  },

  //建構 疼痛評估 json檔
  returnPainEvaluationsJSON(postItems) {
    let dataArr = [];

    postItems.forEach(postItem => {
      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      let finalPostData = {}
      finalPostData.Date = postItem.Date;
      if (findNurse && findNurse.idNum) {
        finalPostData.NurseID = findNurse.idNum;
      } else {
        finalPostData.NurseID = "N223456789";
      }
      // finalPostData.AssessmentNo = this.items.length; //目前資料筆數
      // finalPostData.IsPaint = "已評估";

      finalPostData.Statement = postItem.qq5 ? postItem.qq5 : '疼痛評估備註'
      if (postItem.qq5) {
        finalPostData.Questions = []
      } else {
        finalPostData.Questions = [
          {
            "Question": "部位",
            "Answer": postItem.qq1 ? postItem.qq1 : null,
          },
          {
            "Question": "分數",
            "Answer": postItem.qq2 ? postItem.qq2 : null,
          },
          {
            "Question": "時間",
            "Answer": postItem.qq3 ? postItem.qq3 : null,
          },
          {
            "Question": "性質",
            "Answer": postItem.qq4 ? postItem.qq4 : null,
          },
          {
            "Question": "備註",
            "Answer": postItem.qq5 ? postItem.qq5 : '疼痛評估備註',
          }
        ]
      }
      dataArr.push(finalPostData)
    })
    return dataArr;
  },

  //建構 衰弱評估 json檔
  returnSOFsJSON(postItems) {
    let dataArr = [];

    postItems.forEach(postItem => {
      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      let finalPostData = {}
      finalPostData.Date = postItem.Date;
      if (findNurse && findNurse.idNum) {
        finalPostData.NurseID = findNurse.idNum;
      } else {
        finalPostData.NurseID = "N223456789";
      }
      // finalPostData.AssessmentNo = this.items.length; //目前資料筆數
      // finalPostData.IsSOF = "已評估",
      finalPostData.Questions = [
        {
          "Question": "體重減輕",
          "Answer": postItem.qq1.text,
          "Point": postItem.qq1.Point
        },
        {
          "Question": "下肢功能",
          "Answer": postItem.qq2.text,
          "Point": postItem.qq2.Point
        },
        {
          "Question": "活力降低",
          "Answer": postItem.qq3.text,
          "Point": postItem.qq3.Point
        }
      ]
      dataArr.push(finalPostData)
    })
    return dataArr;

  },

  //建構 需求摘要 json檔
  returnCaseSummaryJSON(postItems, user) {
    // let dataArr = [];

    let DataList = []
    postItems.forEach(postItem => {
      let match = postItem.Questions.filter(i => i.checked)

      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      if (findNurse && findNurse.idNum) {
        findNurse = findNurse.idNum;
      } else {
        findNurse = "N223456789";
      }

      match.forEach(i => {
        DataList.push({
          "CaseID": user.id_num,
          "EndDate": user.in_date,
          "Date": postItem.Date,
          "Summary": {
            "QuestionType": i.QuestionType,
            "Question": i.Question,
            "Answer": i.Answer ? i.Answer : null
          },
          "NurseID": findNurse
        })
      });

      // dataArr.push(DataList)
    })

    return DataList;
  },
  //建構 居護照護計畫 json檔
  returnCarePlanJSON(postItems, user) {
    let Targets = []
    let Measures = []
    let Evaluations = []

    postItems.forEach(postItem => {
      let match = postItem.Questions.filter(i => i.checked)

      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      if (findNurse && findNurse.idNum) {
        findNurse = findNurse.idNum;
      } else {
        findNurse = "N223456789";
      }

      match.forEach(item => {
        Targets.push({
          "CaseID": user.id_num,
          "EndDate": user.in_date,
          "SummaryCreateDate": postItem.Date,
          "Summary": item.Question,
          "SummaryAnswer": item.Answer, //2024.6.13 加入備註
          "TargetCreateDate": item.TargetCreateDate ? item.TargetCreateDate : postItem.Date,
          "TargetStatement": item.TargetStatement,
          "TargetStatement2": item.TargetStatement2,
          "EstimatedDate": item.EstimatedDate,
          "IsMainTarget": item.IsMainTarget ? item.IsMainTarget : false,
          "NurseID": findNurse
        })

        item.MeasureContent.forEach((Mitem) => {
          Measures.push({
            "CaseID": user.id_num,
            "EndDate": user.in_date,
            "SummaryCreateDate": postItem.Date,
            "Summary": item.Question,
            "SummaryAnswer": item.Answer, //2024.6.13 加入備註
            "TargetStatement": item.TargetStatement,
            "MeasureCreateDate": Mitem.MeasureCreateDate ? Mitem.MeasureCreateDate : postItem.Date,
            "MeasureContent": Mitem.content,
            "NurseID": findNurse
          })
        })

        item.EvaluationContent.forEach((Mitem) => {
          Evaluations.push({
            "CaseID": user.id_num,
            "EndDate": user.in_date,
            "SummaryCreateDate": postItem.Date,
            "Summary": item.Question,
            "SummaryAnswer": item.Answer, //2024.6.13 加入備註
            "TargetStatement": item.TargetStatement,
            "EvaluationContent": Mitem.content,
            "EvaluationDate": Mitem.date,
            "EvaluationTime": Mitem.time,
            "NurseID": findNurse
          })
        })
      })


    })

    return {
      "Targets": Targets,
      "Measures": Measures,
      "Evaluations": Evaluations
    };

  },

  //建構 照護紀錄 json檔
  returnCareRecordJSON(postItems, user) {
    let dataArr = [];
    postItems.forEach(postItem => {
      let finalPostData = {
        "CaseID": user.id_num,
        "EndDate": user.in_date,
        "Date": postItem.Date,
        "Time": postItem.Time,
        "Time2": postItem.Time2,
        "Height": postItem.Height,
        "Weight": postItem.Weight,
        "BMI": postItem.bmi,
        "weight_reason": postItem.with_weight_other ? postItem.with_weight_other : "",

        "Statement": postItem.Statement,
        "FJMEvaluation": "未評估"
      }

      //判斷護理人員身分證字號 ;不存在時先用預設值
      let findNurse = store.state.personnelItems.find(
        (i) => i.snkey == postItem.create_man_snkey
      );

      if (findNurse && findNurse.idNum) {
        finalPostData.NurseID = findNurse.idNum;
      } else {
        finalPostData.NurseID = "N223456789";
      }


      //跌倒判斷
      finalPostData.IsFallDown = postItem.IsFallDown
      if (postItem.IsFallDown == '是') {
        finalPostData.FallDowns = postItem.FallDowns
      }
      //皮膚損傷判斷
      finalPostData.IsSkinDamages = postItem.IsSkinDamages
      if (postItem.IsSkinDamages == '是') {
        finalPostData.SkinDamages = postItem.SkinDamages
      }
      //身體約束判斷
      finalPostData.IsRestraint = postItem.IsRestraint
      if (postItem.IsRestraint == '是') {
        finalPostData.Restraints = postItem.Restraints
      }
      //感染判斷
      finalPostData.IsEmergency = postItem.IsEmergency
      if (postItem.IsEmergency == '是') {
        finalPostData.Emergency = postItem.Emergencys
      }
      //非計畫性住院判斷
      finalPostData.IsUnplanned = postItem.IsUnplanned
      if (postItem.IsUnplanned == '是') {
        finalPostData.Unplanned = postItem.Unplanneds
      }

      //緊急事件紀錄判斷
      finalPostData.IsEmergencyEvents = postItem.IsEmergencyEvents
      if (postItem.IsEmergencyEvents == '是') {
        finalPostData.EmergencyEvents = postItem.EmergencyEvents
      }

      dataArr.push(finalPostData)
    })
    return dataArr
  },

  //建立各表單(陣列)JSON資料--end
}

export default mohwFn;