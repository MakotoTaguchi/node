const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const url = require("url");
const qs = require("querystring");

const index_page = fs.readFileSync("./index.ejs", "utf-8");
const other_page = fs.readFileSync("./other.ejs", "utf-8");
const style_css = fs.readFileSync("./style.css", "utf-8");

var server = http.createServer(getFromClient);

server.listen(3000);
console.log("Server start!");

function getFromClient(request, response) {
  var url_parts = url.parse(request.url, true);
  switch (url_parts.pathname) {

    case "/":
      response_index(request, response);
      break;

    case "/other":
      response_other(request, response);
      break;

    case "/style.css":
      response.writeHead(200, {
        "Content-Type": "text/css"
      });
      response.write(style_css);
      response.end();
      break;

    default:
      response.writeHead(200, {
        "Content-Type": "text/plain",
      });
      response.end('no page...');
      break;
  }
}

var data = {
  msg: 'no message...'
};

// indexページ
function response_index(request, response) {
  // POSTアクセス
  if (request.method == 'POST') {
    var body = '';

    // データ受信
    request.on('data', (data) => {
      body += data;
    });

    // データ受信終了
    request.on('end', () => {
      data = qs.parse(body);
      write_index(request, response);
    });
  } else {
    write_index(request, response);
  }
}

function write_index(request, response) {
  var msg = "伝言を表示します。"
  var content = ejs.render(index_page, {
    title: "Index",
    content: msg,
    data: data,
  });
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  response.write(content);
  response.end();
}

var data2 = {
  'Taro': ['taro@yamada', '09-999-999', 'Tokyo'],
  'Hanako': ['hanako@flower', '080-888-888', 'Yokohama'],
  'Sachiko': ['sachi@happy', '070-777-777', 'Nagoya'],
  'Ichiro': ['ichi@baseball', '060-666-666', 'USA'],
}

// Otherページ
function response_other(request, response) {
  var msg = "これはOtherページです。";
  var content = ejs.render(other_page, {
    title: "Other",
    content: msg,
    data: data2,
    filename: 'data_name'
  });
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  response.write(content);
  response.end();
}

// // POSTアクセス
// if (request.method == 'POST') {
//   var body = '';

//   // データ受信
//   request.on('data', (data) => {
//     body += data;
//   });

//   // データ受信終了
//   request.on('end', () => {
//     var post_data = qs.parse(body);
//     msg += 'あなたは、「' + post_data.msg + '」と書きました。';
//     var content = ejs.render(other_page, {
//       title: "Other",
//       content: msg,
//     });
// response.writeHead(200, {
//   'Content-Type': 'text/html'
// });
// response.write(content);
// response.end();
//   });
// } else {
//   var msg = "ページがありません。"
//   var content = ejs.render(other_page, {
//     title: "Other",
//     content: msg,
//   });
//   response.writeHead(200, {
//     'Content-Type': 'text/html'
//   });
//   response.write(content);
//   response.end();
// }
// }