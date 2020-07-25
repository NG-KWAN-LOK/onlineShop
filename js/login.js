var provider = "";
firebase
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.NONE)
  .then(function () {
    provider = new firebase.auth.GoogleAuthProvider();
    //return firebase.auth().signInWithRedirect(provider);
  })
  .catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
var token = "";
var user = "";
var tempUser = "";
console.log(user);
function googleLoginRedirect() {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      // 可以獲得 Google 提供 token，token可透過 Google API 獲得其他數據。
      token = result.credential.accessToken;
      user = result.user;
    });
}
async function logout(eventCode = 0) {
  await firebase
    .auth()
    .signOut()
    .then(
      function () {
        if (eventCode === 0) {
          openAlertLayer("登出成功");
          clearInterval(oCountdownID);
        } else if (eventCode === 1) {
          openAlertLayer("您已閒置超過7分鐘，系統自動登出");
          clearInterval(oCountdownID);
        } else {
          console.log("Login Inited");
          clearInterval(oCountdownID);
        }
        user = "";
        token = "";
      },
      function (error) {
        openAlertLayer("登出失敗");
      }
    );
}
firebase.auth().onAuthStateChanged(async function (user) {
  $("#admin__note").empty();
  $("#admin__content").empty();
  $("#admin__choosePage").empty();
  $("#admin__monitor").empty();
  $('[id="topLogOutbtn"]').empty();
  $("#phoneTopUserStauts").empty();
  $("#phoneTopOrderMenu").empty();
  $("#admin__login").empty();
  var userIsAdmin = "";
  var userName = "";
  var leastOnlineTime = "";
  tempUser = user;
  if (user) {
    console.log(user);
    var UserRef = firebase.database().ref("/user/" + user.uid);
    await UserRef.once("value").then(
      (res) => {
        var dataInfo = res.val();
        if (dataInfo === null) {
          return false;
        }
        userIsAdmin = dataInfo.admin;
        userName = dataInfo.name;
        leastOnlineTime = dataInfo.leastOnlineTime;
        return true;
      },
      (rej) => {
        console.log("login failed");
        console.log(rej);
        return true;
      }
    );
    if (userIsAdmin === true) {
      console.log("logging");
      ReCalculate();
      var currentdate = new Date();
      var datetime =
        currentdate.getFullYear() +
        "/" +
        (currentdate.getMonth() + 1 < 10 ? "0" : "") +
        (currentdate.getMonth() + 1) +
        "/" +
        (currentdate.getDate() < 10 ? "0" : "") +
        currentdate.getDate() +
        " " +
        (currentdate.getHours() < 10 ? "0" : "") +
        currentdate.getHours() +
        ":" +
        (currentdate.getMinutes() < 10 ? "0" : "") +
        currentdate.getMinutes() +
        ":" +
        (currentdate.getSeconds() < 10 ? "0" : "") +
        currentdate.getSeconds();
      openAlertLayer("歡迎管理員" + userName + "大大");
      console.log("Login success");
      var divContent = `
      <div class="admin__content__title">歡迎管理員 ${userName}大大</div>
      <div class="admin__content__title" style="font-weight: 300; font-size: 16px;">上次上線於 ${leastOnlineTime}</div>
      `;
      $("#admin__content").append(divContent);
      $("#phoneTopUserStauts").append(divContent);
      var logOutContent = `
      <div class="Top__nav_container__language__title" id="autoLogoutCountDown" style="font-weight: 300; font-size: 16px;">系列於 後自動登出</div>
      <div class="Top__nav_container__language__topLogOutbtn__logout">
          <div class="Top__nav_container__language__topLogOutbtn__logout__btn" onclick="logout()">登出系統</div>
      </div>`;
      $('[id="topLogOutbtn"]').append(logOutContent);
      divContent = `
      <div class="admin__content__text">
          訂單管理
      </div>
      <div class="admin__content__chooseItem" onclick="showOrderItem(0)">
          查看及管理訂單
      </div>
      <div class="admin__content__text">
          貨品管理
      </div>
      <div class="admin__content__chooseItem" onclick="showGoodsListItem()">
          查看及管理貨品目錄
      </div>
      `;
      $("#phoneTopOrderMenu").append(divContent);
      $("#admin__content").append(divContent);
      showHomeNote();
      await firebase
        .database()
        .ref("/user/" + user.uid)
        .update({
          leastOnlineTime: datetime,
        })
        .then(function () {
          return true;
        })
        .catch(function () {
          return false;
        });
      //autoLogout();
    } else {
      openAlertLayer("很抱歉，您不是管理員，請您找管理員尋求協助");
      logout(999);
    }
  } else {
    var divContent = `
    <div class="admin__login">
        <div class="admin__login__title">請先登入</div>
        <div id="singUpRedirect" onclick="googleLoginRedirect()">
            使用google帳號登入
        </div>
    </div>`;
    logout(999);
    $("#admin__login").append(divContent);
  }
});
console.log(user);
console.log(tempUser);
var oCountdownID;
var countdownClock = 0;
function Timeout() {
  console.log("autoLogout");
  logout(1);
}
function ReCalculate() {
  var timer = 7 * 60;
  clearInterval(oCountdownID);
  if (
    user != "" ||
    (tempUser != "" && tempUser != null && tempUser != undefined)
  ) {
    //console.log("start count");
    oCountdownID = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      if (--timer < 0) {
        Timeout(1);
        clearInterval(oCountdownID);
      }
      $('[id="autoLogoutCountDown"]').text(
        "系統於 " + minutes + ":" + seconds + " 後自動登出"
      );
      //console.log(minutes + ":" + seconds);
    }, 1000);
    document.onmousedown = ReCalculate;
    document.onmousemove = ReCalculate;
    document.onkeydown = ReCalculate;
  }
}
console.log(countdownClock);
//ReCalculate();

function getUserName() {
  return user;
}
