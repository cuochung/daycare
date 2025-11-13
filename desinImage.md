1. `Add.vue` 個人照片卡片改為支援預覽：若未有影像顯示「未上傳任何照片」提示。
2. 選擇檔案後會將檔案與 Base64 預覽暫存在 `uploadImage`（`file`、`preview`），可隨時取消預覽重新選擇。
3. 按下 `確認新增` / `確認修改` 才會正式上傳：成功新增資料後（取得 `snkey`）或送出修改時，若有暫存檔案，會先刪除舊檔再上傳新檔。
4. 上傳成功後透過 `api.post('user', ...)` 只更新一次資料，並同步寫入 `list.picInfo.picName`、`list.picInfo.picOriginalName` 與 `list.pic_url`。
5. 原本的 list 結構維持不變，額外補上 `list.picInfo` 以集中管理影像資訊。*** End Patch