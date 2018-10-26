// プロパティ取得
var PROPERTIES = PropertiesService.getScriptProperties();//ファイル > プロジェクトのプロパティから設定した環境変数的なもの

//スプレッドシート情報
var SP_ID = PROPERTIES.getProperty('SP_ID') //プロパティに設定した、スプレッドシートのID

// LINE情報
var LINE_ACCESS_TOKEN = PROPERTIES.getProperty('LINE_ACCESS_TOKEN');
var line_endpoint = 'https://api.line.me/v2/bot/message/reply'; 
var WEB_HOOK_URL = PROPERTIES.getProperty("WEB_HOOK_URL") //Google Apps Scriptで作成したアプリのURL

function doGet() {
  return HtmlService.createTemplateFromFile("相席アナライザー").evaluate();
}


//LINEからWebhock URLあてに、HTTP POSTリクエストが送られてきたときに実行される関数
function doPost(e) {
  var json = JSON.parse(e.postData.contents);

  //返信するためのトークン取得
  var reply_token= json.events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }

  //送られたLINEメッセージを取得
  var user_message = json.events[0].message.text;  

  //返信する内容を作成
  var reply_messages;
  if ('なう' == user_message) { //「なう」と送信されたら、現在の混雑状況の画像を返す
    reply_messages = ["https://docs.google.com/spreadsheets/d/e/2PACX-1vR5UzfrOLwJ5he4CA1r8VBaFWN2QWro01ok2GP3D2p24EsVtMj6Pm1lGQb9Yjv_BQNnzjpBiQcYXb59/pubchart?oid=442255862&format=image"];//グラフ画像を返信
  } else if ('ぶんせき' == user_message) {   //分析ページのURLを返します。
    reply_messages = ["https://script.google.com/macros/s/AKfycbx0bke55aKe1TD4UqAyR2FfdJWMJ4-R12fTYCwJiEpeChU2Kvfc/exec"];
  } else if ('あくせす' == user_message) {    //ホームページのURLを返します
    reply_messages = ["www.oriental-lounge.com"];
  }else {
    //説明を返す
    reply_messages = ['「なう」で現在の空席状況、「ぶんせき」で分析ページのURL、「あくせす」で詳細情報をお送りします。'];
  }

  // メッセージを返信
  var messages;
  if ('なう' == user_message) { //「なう」の時だけ画像を返す
    messages = reply_messages.map(function (v) {
      return {
        'type': 'image', 
        'originalContentUrl': v, 
        "previewImageUrl":v}; 
      } 
    );
  } else { 
    messages = reply_messages.map(function (v) {
    return {'type': 'text', 'text': v}; 
    });    
  }

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

//スプレッドシートを取得
var File = SpreadsheetApp.openById(SP_ID);
var baseSheet = File.getSheets()[0]; 

function MainFrame() {

  //TODO: スプレッドシートの決まった箇所に決まった値を挿入
  setManFemaleNumList(1,getMenFemaleArray(17,4,1,2)); //D17 2行分取得
  setManFemaleNumList(2,getMenFemaleArray(18,4,1,2));  
  setManFemaleNumList(3,getMenFemaleArray(19,4,1,2));  
}

//TODO:スプレッドシートに、相席ラウンジ　銀座店の現在の男女の数をリスト形式で返す
function setManFemaleNumList(sheetNum, manFemaleArray){
  var Sheet = File.getSheets()[sheetNum];
  Sheet.appendRow(manFemaleArray);
}


//TODO:指定範囲のセルから、男女の数をリスト形式に取得する

function getMenFemaleArray(row,col,rowNum,colNum){
  var array = baseSheet.getRange(row,col,rowNum,colNum).getValues()[0];
  var date = new Date();
  array.unshift(date)
  return array;
}