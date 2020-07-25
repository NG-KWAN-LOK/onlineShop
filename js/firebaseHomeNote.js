function showHomeNote() {
  console.log("showHomeNote");
  $("#admin__note").empty();
  var titleString = `
      <div class="admin__monitor__title">公告：</div>
      `;
  $("#admin__note").append(titleString);
  db.collection("note")
    .doc("home")
    .get()
    .then(function (notesh) {
      var noteInfo = notesh.data();
      var orderTitleString = `
        <div class="admin__monitor__subtitle">${noteInfo.content}</div>
        <div class="admin__monitor__subtitle" style="margin:20px 0;">最後更新係於 ${noteInfo.leastUpdateTime}由${noteInfo.updateUser}</div>
        <div class="function__bar">
        <div class="function__bar__btn" onclick="editHomeNote()">
          更改公告
        </div>
      </div>
        `;
      $("#admin__note").append(orderTitleString);
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
}

function editHomeNote() {
  $("#admin__monitor").empty();
  var titleString = `
    <div class="admin__monitor__title">更改公告內容</div>
      <div class="function__bar">
        <div class="function__bar__btn" onclick="showHomeNote()">
          放棄更改
        </div>
      </div>
    `;
  $("#admin__monitor").append(titleString);
  db.collection("note")
    .doc("home")
    .get()
    .then(function (notesh) {
      var noteInfo = notesh.data();
      var orderTitleString = `
      <textarea id="homeNote" name="homeNote" rows="10" cols="50">${noteInfo.content}
      </textarea>
      </br>
      <input type="button" value="提交" onclick="updateHomeNote()">
        `;
      $("#admin__monitor").append(orderTitleString);
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
}
function updateHomeNote() {
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
  db.collection("note")
    .doc("home")
    .set({
      content: document.getElementById("homeNote").value,
      leastUpdateTime: datetime,
      updateUser: tempUser.displayName,
    })
    .then(function () {
      openAlertLayer("更改公告內容成功");
      $("#admin__monitor").empty();
      showHomeNote();
    })
    .catch(function () {
      openAlertLayer(
        "伺服器發生錯誤。如果您是管理員，請尋找真·管理員協助。 或者 你是駭客 ㄇㄌㄈㄎ！！"
      );
      if (user === "") {
        logout(999);
        $("#admin__content").empty();
        $("#admin__choosePage").empty();
        $("#admin__monitor").empty();
        var divContent = `
      <div class="admin__login">
          <div class="admin__login__title">請先登入</div>
          <div id="singUpRedirect" onclick="googleLoginRedirect()">
              使用google帳號登入
          </div>
      </div>`;
        $("#admin__content").append(divContent);
      }
    });
}
