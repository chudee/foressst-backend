var system = require('system');
var webPage = require('webpage');
var page = webPage.create();

var logInPageUrl = "https://forest.skhu.ac.kr/Gate/UniLogin.aspx";
var mainPageUrl = "https://forest.skhu.ac.kr/Gate/UniMyMain.aspx";

var tried = false;

// 인자값으로 넘겨받은 학번, 비밀번호 불러오기
var ID = system.args[1];
var PW = system.args[2];

//　userAgent - IE 로 설정
page.settings.userAgent = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)";
page.settings.javascriptEnabled = true;

// Load Log In Page
page.open(logInPageUrl, function(status) {
});

// If Page is fully loaded
page.onLoadFinished = function(status) {
  if(page.url == logInPageUrl){
    if(tried){
      // If page's url is sams as log in page's url, but tried is true. this is an error!
      console.log("LOGIN FAILED");
      phantom.exit();
      }else{
    // If page's url is sams as log in page's url, call logIn()
      logIn();
    }
  }else if (page.url == mainPageUrl) {
    // If page's url is sams as main page's url, pass cookies of the page via console.log()
    console.log(JSON.stringify(page.cookies));
    /// Done, exit this script
    phantom.exit();
  }
};

function logIn(){
  tried = true;
  page.evaluate(function(id, pw){
    // Set ID and PW value into the form
    document.querySelector("input[name='txtID']").value = id;
    document.querySelector("input[name='txtPW']").value = pw;
    // Log In
    document.all.ibtnLogin.click();
  }, ID, PW);
}

// Error Handling
page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }

  console.error(msgStack.join('\n'));
  phantom.exit();
};
