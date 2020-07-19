var provider = new firebase.auth.GoogleAuthProvider();
var token = "";
var user = "";
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
          alert("登出成功");
        } else if (eventCode === 1) {
          alert("您已閒置超過3分鐘，系統自動登出");
        } else {
          console.log("Login Inited");
        }
        user = "";
        token = "";
      },
      function (error) {
        alert("登出失敗");
      }
    );
}
firebase.auth().onAuthStateChanged(async function (user) {
  $("#admin__content").empty();
  $("#admin__choosePage").empty();
  $("#admin__monitor").empty();
  var userIsAdmin = "";
  var userName = "";
  if (user) {
    var UserRef = firebase.database().ref("/user/" + user.uid);
    await UserRef.once("value").then(
      (res) => {
        var dataInfo = res.val();
        userIsAdmin = dataInfo.admin;
        userName = dataInfo.name;
        return true;
      },
      (rej) => {
        console.log(rej);
        return true;
      }
    );
    if (userIsAdmin === true) {
      alert("歡迎管理員" + userName + "大大");
      console.log("Login success");
      var divContent = `
    <div class="admin__content__title">歡迎管理員 ${userName}大大</div>
    <div class="admin__content__logout" onclick="logout()">
        <div class="admin__content__logout__btn">登出系統</div>
    </div>
    <div class="admin__content__text">
        請選擇您想管理之項目：
    </div>
    <div class="admin__content__chooseItem" onclick="showReadOrderItem()">
        查看訂單
    </div>
    <div class="admin__content__chooseItem" onclick="showAddOrderForm()">
        加入新訂單
    </div>
    <div class="admin__content__chooseItem" onclick="showOrderItem()">
        修改訂單
    </div>
    `;
      //autoLogout();
    } else {
      alert("很抱歉，您不是管理員，請您找管理員尋求協助");
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
  }
  $("#admin__content").append(divContent);
});
logout(999);
console.log(user);
var oTimerId;
function Timeout() {
  console.log("autoLogout");
  logout(1);
}
function ReCalculate() {
  clearTimeout(oTimerId);
  if (user != "") {
    oTimerId = setTimeout(function () {
      Timeout(1);
    }, 3 * 60 * 1000);
  }
}
document.onmousedown = ReCalculate;
document.onmousemove = ReCalculate;
document.onkeydown = ReCalculate;
ReCalculate();
