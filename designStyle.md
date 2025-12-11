1. 畫面風格是 日間照護風格
2. 主要配色都放在 assets/css/mystyle.css 裡
3. 依以上條件處理畫面的版面及配色
4. 語法改為 vue3
5. ui 使用 vuetify3；畫面結構儘量用 vuetify3的語法去架構
6. api的用法是 import api from '@/assets/js/api.js'
7. api使用到 general/getBykey 時;一律改為 byjson/searchByKeyValue
8. 使用到 PaginatedIterator 的組件時； form表單裡 v-for 使用時，資料要 加上 .raw 才讀到的內容
9. 遇到 confirm的寫法；結構跟參數如下; title,text 依需求更改
    proxy.$swal({
      title: '確認顯示列印畫面？',
      text: '列印畫面將在新的分頁中顯示，請再次確認。',
      icon: 'question',
      toast: false,
      timer: null,
      showConfirmButton: true,
      showCancelButton: true,
      position: 'center'
    })
10. 遇到 Add.vue 的頁面；頁面設計的 title；參照 /signlife/Add.vue 的 title 設計
11. 遇到 PrintPage.vue 時，使用到 bootstrap的都移除；表格採實體線設計
12. 遇到 index.vue 的頁面；使用到  normalizeRecord 時，保持下方的程式碼處理就可以了
const normalizeRecord = (row) => {
  const parsed = JSON.parse(row.datalist || '{}')
  return {
    ...parsed,
    snkey: row.snkey,
  }
}
13. 遇到資料使用到 CRUD 的邏輯；都參照 /signlife 目錄下 index.vue 及 Add.vue 之沒資料建構的方式處理
14. 遇到 viewData 顯示資料的寫法都棄用；依各畫面顯示時讀入的資料去處理就好
15. 使用 fromParent 的相關寫法棄用
16. 在 EvaluationMetrics 目錄下的；FallEvent 已完成；都參考這個目錄下的建構方式