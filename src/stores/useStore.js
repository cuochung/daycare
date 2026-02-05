import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('company', () => {
  const state = {
    verMsg: "2025.12.23.1",
    databaseName: "daycare", //資料庫名
    base_url: "http://localhost/daycareapi", //localhost測試用
    // base_url: "https://www.pddtvgame.com/daycareapi", //線上專用指定去讀圖片或其他東西的位置

    loading: false, //載入中

    //暫存用資料
    cData: {},  //廠商資料
    pData: {},  //使用者

    usingItems: [], //處理中頁面暫存資料
    customerItems: [], //會員資料

    //功能名稱,樣式,key值,引用圖片,授權,icon圖片設定,
    authKeys: [
      // {
      //   label: "會員畫面預覽", class: "ma-1 white--text", color: "green", keyName: 'pass',
      //   image: new URL('@/assets/img/website_normal.png', import.meta.url).href,
      //   route: "/main/Orderpagepv",
      //   authKey: "pass",
      //   icon: 'mdi-eye', // 預覽
      // },
      // {
      //   label: "各項設定", class: "ma-1 white--text", color: "green", keyName: 'orderset',
      //   image: new URL('@/assets/img/template_calender_j.jpg', import.meta.url).href,
      //   route: "/main/Orderset",
      //   authKey: "orderset_key",
      //   icon: 'mdi-cog', // 設定
      // },
      // {
      //   label: "消費記錄管理", class: "ma-1 white--text", color: "green", keyName: 'PurchaseRecord',
      //   image: new URL('@/assets/img/kankou_shopping_asia.png', import.meta.url).href,
      //   route: "/main/PurchaseRecord",
      //   authKey: "PurchaseRecord_key",
      //   icon: 'mdi-file-document', // 記錄管理
      // },
      // {
      //   label: "會員管理&批次消費作業", class: "ma-1 white--text", color: "green", keyName: 'customer',
      //   image: new URL('@/assets/img/my_number_card_omote.png', import.meta.url).href,
      //   route: "/main/Customer",
      //   authKey: "customer_key",
      //   icon: 'mdi-account-group', // 會員管理
      // },
      // {
      //   label: "人員管理", class: "ma-1 white--text", color: "purple", keyName: 'personnel',
      //   image: new URL('@/assets/img/job_one_operation_woman.png', import.meta.url).href,
      //   route: "/main/Personnel",
      //   authKey: "personnel_key",
      //   icon: 'mdi-account-tie', // 人員管理
      // },
      // {
      //   label: "登出", class: "ma-1 white--text", color: "dark", keyName: 'exit',
      //   image: new URL('@/assets/img/text_exit.png', import.meta.url).href,
      //   route: "/login",
      //   authKey: "exit_key",
      //   icon: 'mdi-logout', // 登出
      // },

      /**/
      {
        label: "病歷管理&維護", class: "ma-1", color: "blue", keyName: 'user',
        image: new URL('@/assets/img/computer_hakui_doctor_woman.png', import.meta.url).href,
        route: "/main/User",
        authKey: "user_key",
        icon: 'mdi-badge-account-horizontal',
      },
      // {
      //   label: "藥單管理", class: "ma-1", color: "blue", keyName: 'pass',
      //   image: new URL('@/assets/img/medical_medicine.png', import.meta.url).href,
      //   route: "/main/MedicineManage",
      //   authKey: "pass",
      //   icon: 'mdi-pill',
      // },
      // {
      //   label: "預約就診紀錄表", class: "ma-1", color: "blue", keyName: 'medicalrecordplan',
      //   image: new URL('@/assets/img/medical_oushin_car_man.png', import.meta.url).href,
      //   route: "/main/MedicalRecordPlan",
      //   authKey: "medicalrecordplan_key",
      //   icon: 'mdi-book-open-page-variant',
      // },
      // {
      //   label: "約束選擇表", class: "ma-1", color: "blue", keyName: 'constrainteventchecklist',
      //   image: new URL('@/assets/img/white_list.png', import.meta.url).href,
      //   route: "/main/ConstraintEventCheckList",
      //   authKey: "constrainteventchecklist_key",
      //   icon: 'mdi-book-open-page-variant',
      // },

      // {
      //   label: "生命徵象紀錄單(多單)", class: "ma-1", color: "primary", keyName: 'pass',
      //   image: new URL('@/assets/img/kenkoushindan_ketsuatsu.png', import.meta.url).href,
      //   route: "/main/signlifelistmulti",
      //   authKey: "pass",
      //   icon: 'mdi-table-large',
      // },
      // {
      //   label: "交班表", class: "ma-1", color: "success", keyName: 'pass',
      //   image: new URL('@/assets/img/hanashiai_nurse_woman.png', import.meta.url).href,
      //   route: "/main/handoverlist",
      //   authKey: "pass",
      //   icon: 'mdi-text-box-outline',
      // },
      // {
      //   label: "活動參與紀錄表", class: "ma-1", color: "warning", keyName: 'pass',
      //   image: new URL('@/assets/img/party_christmas.png', import.meta.url).href,
      //   route: "/main/activitylist",
      //   authKey: "pass",
      //   icon: 'mdi-ticket',
      // },

      // {
      //   label: "床位管理", class: "ma-1 white--text", color: "pink", keyName: 'bed',
      //   image: new URL('@/assets/img/kagu_sleep_futon_shiku.png', import.meta.url).href,
      //   route: "/main/bedlist",
      //   authKey: "bed_key",
      //   icon: 'mdi-bed-empty',
      // },
      // {
      //   label: "會計管理", class: "ma-1 white--text", color: "teal", keyName: 'accounting',
      //   image: new URL('@/assets/img/money_choubo.png', import.meta.url).href,
      //   route: "/main/accountinglist",
      //   authKey: "accounting_key",
      //   icon: 'mdi-cash',
      // },
      {
        label: "人員管理", class: "ma-1 white--text", color: "purple", keyName: 'personnel',
        image: new URL('@/assets/img/taiin_miokuri.png', import.meta.url).href,
        route: "/main/Personnel",
        authKey: "personnel_key",
        icon: 'mdi-account',
      },
      // {
      //   label: "住民分析", class: "ma-1 white--text", color: "purple", keyName: 'pass',
      //   image: new URL('@/assets/img/document_data_bunseki.png', import.meta.url).href,
      //   route: "/main/statisticalanalysis",
      //   authKey: "pass",
      //   icon: 'mdi-google-analytics',
      // },
      // {
      //   label: "照會討論紀錄表", class: "ma-1 white--text", color: "purple", keyName: 'pass',
      //   image: new URL('@/assets/img/kangoshi_kaigi.png', import.meta.url).href,
      //   route: "/main/notediscussionlist",
      //   authKey: "pass",
      //   icon: 'mdi-disqus',
      // },
      // {
      //   label: "疫情訪視預約單", class: "ma-1 white--text", color: "purple", keyName: 'pass',
      //   image: new URL('@/assets/img/template_calender_j.jpg', import.meta.url).href,
      //   route: "/main/vieworderlist",
      //   authKey: "pass",
      //   icon: 'mdi-book-open-page-variant',
      // },
      // {
      //   label: "公告欄", class: "ma-1 white--text", color: "indigo", keyName: 'mainboard',
      //   image: new URL('@/assets/img/keijiban.png', import.meta.url).href,
      //   route: "/main/mainboardlist",
      //   authKey: "mainboard_key",
      //   icon: 'mdi-clipboard',
      // },
      // {
      //   label: "指標監測分析", class: "ma-1 white--text", color: "indigo", keyName: 'qualityindex',
      //   image: new URL('@/assets/img/whiteboard_memo_woman2.png', import.meta.url).href,
      //   route: "/main/AnalysisOfEvaluationIndicators",
      //   authKey: "qualityindex_key",
      //   icon: 'mdi-chart-arc',
      // },

      {
        label: "出席一覽", class: "ma-1 white--text", color: "teal", keyName: 'attendance',
        image: new URL('@/assets/img/template_calender_j.jpg', import.meta.url).href,
        route: "/main/AttendanceCalendar",
        authKey: "pass",
        icon: 'mdi-calendar-month',
      },
      {
        label: "登出", class: "ma-1 white--text", color: "dark", keyName: 'exit',
        image: new URL('@/assets/img/text_exit.png', import.meta.url).href,
        route: "/login",
        authKey: "exit_key",
        icon: 'mdi-logout',
      },
    ],
  }

  //全域toast multi功能;基本上只把要toast的暫存在pinia裡,其他都由PDDToastMultiV2Pinia去控制顯示結果,
  const toasts = ref([])
  const showToastMulti = (newToast) => {
    console.log('newToast',newToast)
    let finalToast = {
      ...newToast,
      timeStamp: Date.now(), //設定時間,用在顯示動畫的key使用,也可以拿來計算動畫剩餘時間
      active: true, //動畫是否執行
      closeTime: newToast.closeTime ? newToast.closeTime : 5
    }
    toasts.value.push(finalToast)

    setTimeout(() => {
      closeShowToastMulti(finalToast.timeStamp)
    }, finalToast.closeTime * 1000)
  }
  //關閉toast內容 for multi ver.
  const closeShowToastMulti = (timeStamp) => {
    toasts.value.some((i, index) => {
      let str = JSON.stringify(i)
      if (str.includes(String(timeStamp)) && i.active) {
        toasts.value.splice(index, 1)
      }
    })
  }
  //全域toast multi功能 end

  return {
    state, //暫存用的都放這裡
    toasts, showToastMulti, closeShowToastMulti,  //multi toast用的到
    // handleImageError,
  }
})
