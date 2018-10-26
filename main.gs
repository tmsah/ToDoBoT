// プロパティ取得
var PROPERTIES = PropertiesService.getScriptProperties();//ファイル > プロジェクトのプロパティから設定した環境変数的なもの

//スプレッドシート情報
var SP_ID = PROPERTIES.getProperty('SP_ID') //プロパティに設定した、スプレッドシートのID

// LINE情報
var LINE_ACCESS_TOKEN = PROPERTIES.getProperty('LINE_ACCESS_TOKEN');
var line_endpoint = 'https://api.line.me/v2/bot/message/reply'; 
var WEB_HOOK_URL = PROPERTIES.getProperty("WEB_HOOK_URL") //Google Apps Scriptで作成したアプリのURL

function doGet() {
  return HtmlService.createTemplateFromFile("ToDo管理").evaluate();
}


//LINEからWebhock URLあてに、HTTP POSTリクエストが送られてきたときに実行される関数
function doPost(e) {
  var json = JSON.parse(e.postData.contents);

  //返信するためのトークン取得
  var reply_token= json.events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }
  
  //スプレッドシートを取得
  var File = SpreadsheetApp.openById(SP_ID);
  var baseSheet = File.getSheetByName("タスク管理（全員）"); 

  //送られたLINEメッセージを取得
  var user_message = json.events[0].message.text;  

  //返信する内容を作成
  var reply_messages = [""];
  if (user_message　== 'なう') { //全員の作業中のToDoを返す
    reply_messages = allToDo(baseSheet);
  } else if (user_message == 'タスク') {    //タスク表を返す  
    reply_messages = ["https://docs.google.com/spreadsheets/d/18UT_i1sobL5dX7NzoYOuCxAIT3TcHVqQoJZ6T8NnHdA/edit#gid=0"];    
  } else if (user_message == 'おさる') {    //ホームページのURLを返す
    reply_messages = ["http://www.osarunomori.jp/"];
  }else {
    //説明を返す
    reply_messages = ['"なう"で全員の作業中のToDo，"タスク"でタスク表，"おさる"でホームページのURLを送ります．'];
  }

  // メッセージを返信
  var messages;
  messages = reply_messages.map(function (v) {
    return {'type': 'text', 'text': v}; 
  });    

  //HTTP POSTリクエストをLINE BOTに送信
  UrlFetchApp.fetch(line_endpoint, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + LINE_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token,
      'messages': messages,
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

function allToDo(baseSheet){ 
  var reply_messages = [""];
  for(var i=3; i<=baseSheet.getLastRow(); i++){
    var progress = baseSheet.getRange(i,7).getValue();
    if(progress == '作業中'){
      reply_messages = [reply_messages + baseSheet.getRange(i,1).getValue() + ", " + baseSheet.getRange(i,6).getValue() + "\n"];
      }
    }
  return reply_messages;
}