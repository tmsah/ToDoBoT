# ToDoBoT
GoogleSpreadSheetに書いてあるToDoをLineBotでインタラクティブに確認できる．

# How to use
- "なう"で全員の作業中のToDoを表示．
- "タスク"でToDo表を表示．
- "おさる"で[おさるの森](http://www.osarunomori.jp)のホームページのURLを表示．

ToDoを記述するGoogleSpreadSheetの仕様に関してはもう少し待ってね(これが分からないと使えないと思うけど．)．  
待ちきれない人はソースコード読めば最低限は分かるから勝手にやって．
# How to develop
__注意！__  
以下の説明はこのBotの最新版リリース時の環境における手順です．  
あなたが動かす時にはgoogle，LineのWebページにおけるUIや仕様が多少変わっているかもしれませんのでその時は自力で何とかして下さい(としか言えません．)．  

## アプリのダウンロード
- git cloneしたら，"main.gs"を自分のGoogleDriveの好きなところに置く．  
  - 分からなければこのWebページから"main.gs"のページを開いて全部コピペして．
- "Google Apps Script"から開く(そんなもの無いって人はダウンロード方法を調べて調達して下さい．)．  
- メニューの"ファイル"から"プロジェクトのプロパティ"を選択．  
- "スクリプトのプロパティ"を開き，それぞれ"プロパティ""値"の順で以下を入力し，最後に"保存"を押す．
  - "WEB_HOOK_URL": アプリのURL(後で詳しく述べます．)．  
  - "LINE_ACCESS_TOKEN": "LINE Developers"側で発行した，作りたいBotの"アクセストークン"を丸々コピーして貼り付ける．  
  - "SP_ID": 使いたいGoogleSpreadSheetのID(URLの"/d/"の直後から"/edit"の直前までの文字列)を入力．
  - "task_sheet": 使いたいGoogleSpreadSheetのURLを入力．
- メニューから"公開"を選択し，"ウェブアプリケーションとして導入"を選ぶ．  
- "現在のアプリケーションのURL"を一度控え，先述の"WEB_HOCK_URL"に入力．  
- "アプリケーションにアクセスできるユーザー"を"全員(匿名ユーザーを含む)"に設定．  
- "更新"を押してリリース完了！

## Line Botの設定  
- [Line@](https://at.line.me/jp/)のアカウントを作成する．  
- LINE@MANAGERから作りたいBotを開き，メニューの"アカウント設定"から"MessagingAPI設定"へ．  
- "LINE Developersで設定する"を選びLINE Developersを開く．  
- プランが"For Developer"になっていることを確認(別にこれじゃなくてもいいけど一番無難だと思う．)．  
- "Channel Secret"や"アクセストークン"が発行されていなかったら発行する．  
- "Webhook送信"を"利用する"に設定．  
- "Webhook URL"に自分のアプリのURLを入力．

# Others
- "アプリケーションにアクセスできるユーザー"を"全員(匿名ユーザーを含む)"に設定しておかないと，そもそもLINEがこのコードにアクセスできないって事態に陥る．  
- コーディングしてリリースする度に"プロジェクトバージョン"を"新規作成"にしてバージョンをあげてやらないと変更が反映されないから注意．
- GASをGitで管理するための[Chomeの拡張](https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo)を使うと便利．[使い方](https://tadaken3.hatenablog.jp/entry/gas-github)と[ソースコード](https://github.com/leonhartX/gas-github)も見れるよ．
- 初心者向けにめちゃめちゃ丁寧に説明書いたつもりだけど，git cloneできる時点で初心者じゃないよね．
