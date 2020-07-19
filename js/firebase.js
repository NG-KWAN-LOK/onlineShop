// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyASVeGuViwa5IRqiH7pzmJICXwcVcqZvXc",
  authDomain: "onlineshop-76640.firebaseapp.com",
  databaseURL: "https://onlineshop-76640.firebaseio.com",
  projectId: "onlineshop-76640",
  storageBucket: "onlineshop-76640.appspot.com",
  messagingSenderId: "22203923324",
  appId: "1:22203923324:web:bd448e2d449d876697c2f9",
  measurementId: "G-5P1RN4NES2",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
//Get Data
async function readDatabase(pagechoose) {
  $("#admin__monitor").empty();
  var DataRef = firebase.database().ref(pagechoose);
  console.log("In editDatabase" + pagechoose);
  var titleString = `
  <div class="admin__monitor__title">在資料庫${pagechoose}內有的資料</div>
  `;
  $("#admin__monitor").append(titleString);
  await DataRef.once("value").then(
    (res) => {
      res.forEach((Item, index) => {
        //console.log(Item.getKey());
        var itemKey = Item.getKey();
        itemValue = Item.val();
        console.log(itemValue);
        var divContent = `<div class="admin__monitor__item" style="padding:36px 0px 0px 0px">${itemKey}：</div>`;
        for (var title in itemValue) {
          //console.log(itemValue[title]);
          divContent += `<div class="admin__monitor__item" style="padding-left:64px">${title}：${itemValue[title]}</div>`;
          if (title === "goods") {
            for (var value in itemValue[title]) {
              divContent += `<div class="admin__monitor__item" style="padding-left:128px">${value}：</div>`;
              for (var goodsValue in itemValue[title][value]) {
                divContent += `<div class="admin__monitor__item" style="padding-left:192px">${goodsValue}：${itemValue[title][value][goodsValue]}</div>`;
                console.log(goodsValue);
              }
              divContent += `<div class="admin__monitor__item" style="padding-left:192px">totalPrice：${
                itemValue[title][value]["count"] *
                itemValue[title][value]["price"]
              }</div>`;
            }
          }
        }
        $("#admin__monitor").append(divContent);
      });
      return true;
    },
    (rej) => {
      console.log(rej);
      return true;
    }
  );
}

function showOrderItem() {
  $("#admin__monitor").empty();
  var DataRef = firebase.database().ref("order");
  var titleString = `
  <div class="admin__monitor__title">請選擇以下已加入資料庫之訂單：</div>
  `;
  $("#admin__monitor").append(titleString);
  DataRef.once("value").then(
    (res) => {
      res.forEach((orderSh, orderIndex) => {
        var orderInfo = orderSh.val();
        var orderTitleString = `
        <div class="admin__monitor__chooseItem" onclick="showEditOrderForm(${orderSh.getKey()})">${orderSh.getKey()}</div>
        `;
        $("#admin__monitor").append(orderTitleString);
      });
    },
    (rej) => {
      console.log(rej);
    }
  );
}
function showEditOrderForm(orderID) {
  $("#admin__monitor").empty();
  var DataRef = firebase.database().ref("/order/" + orderID);
  var titleString = `
  <div class="admin__monitor__title">以下為訂單編號${orderID}的資料</div>
  `;
  $("#admin__monitor").append(titleString);
  DataRef.once("value").then(
    (res) => {
      console.log(res.val());
      orderInfo = res.val();
      var orderTitleString = `
      <div class="admin__monitor__item">
      訂單編號：${res.getKey()}
      </div>
      <form name="form" id="form">
        <div class="admin__monitor__item">
        訂單日期：
          <input
            type="text"
            name="orderTime"
            id="orderTime"
            value="${orderInfo.orderTime}" required
          />
        </div>
        <div class="admin__monitor__item">
        訂單人名稱：
          <input
            type="text"
            name="customerName"
            id="customerName"
            value="${orderInfo.customerName}" required
          />
        </div>
        <div class="admin__monitor__item">
        訂單人電話：
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            value="${orderInfo.phoneNumber}" required
          />
        </div>
        <div class="admin__monitor__item">
        訂單人收貨地址：
          <input
            type="text"
            name="address"
            id="address"
            value="${orderInfo.address}" required
          />
        </div>
        <div class="admin__monitor__item">
        訂單是否已出貨：
          <input
            type="text"
            name="isShip"
            id="isShip"
            value="${orderInfo.isShip}" required
          />
        </div>
        <div class="admin__monitor__item">
        順豐單號：
          <input
            type="text"
            name="shipNumber"
            id="shipNumber"
            value="${orderInfo.shipNumber}" required
          />
        </div>
        <div class="admin__monitor__item">
        訂單是否已完成：
          <input
            type="text"
            name="isFinish"
            id="isFinish"
            value="${orderInfo.isFinish}" required
          />
        </div>
          <input
        type="button"
        name="submit"
        value="更新客戶資料"
        onclick="updateItemOrderInfo(${orderID});"
            />
            <input
        type="button"
        name="submit"
        value="刪除此客戶"
        onclick="removeItemOrderInfo(${orderID});"
            />
      </form>
        `;
      $("#admin__monitor").append(orderTitleString);
      showEditGoodsForm(orderID);
    },
    (rej) => {
      console.log(rej);
    }
  );
}
async function showEditGoodsForm(orderID) {
  var DataRef = firebase.database().ref("/order/" + orderID + "/goods");
  var lastGoodsID = 0;
  var titleString = `
<div class="admin__monitor__title">貨品</div>
`;
  $("#admin__monitor").append(titleString);
  await DataRef.once("value").then(
    (res) => {
      res.forEach((orderSh, orderIndex) => {
        var goodsValueString = `<div class="admin__monitor__goods">`;
        var goodsValue = orderSh.val();
        console.log(goodsValue);
        goodsValueString += `
        <form name="form" id="form${orderSh.getKey()}">
        <div class="admin__monitor__item">編號：
        ${orderSh.getKey()}
        </div>
        <div class="admin__monitor__item">貨品名稱：
          <input
          type="text"
          name="goodsName"
          id="goodsName"
          value="${goodsValue.goodsName}" required
          />
        </div>
        <div class="admin__monitor__item">貨品購買網址：
          <input
          type="text"
          name="website"
          id="website"
          value="${goodsValue.website}" required
          />
        </div>
        <div class="admin__monitor__item">單價(NTD)：
          <input
          type="number"
          name="price"
          id="price"
          class="price${orderSh.getKey()}"
          value="${
            goodsValue.price
          }" oninput="updateTotalPrice(${orderSh.getKey()})" required
          />
        </div>
        <div class="admin__monitor__item">數量：
          <input
          type="number"
          name="count"
          id="count"
          class="count${orderSh.getKey()}"
          value="${
            goodsValue.count
          }" oninput="updateTotalPrice(${orderSh.getKey()})" required
          />
        </div>
        <div class="admin__monitor__item" id="totalPrice${orderSh.getKey()}">總值(NTD)：${
          goodsValue.price * goodsValue.count
        }
        <br>總值(HKD)3.7:1：${Math.ceil(
          (goodsValue.price * goodsValue.count) / 3.7
        )}
        </div>
        </form>
        <input
        type="button"
        name="submit"
        value="更新貨品資料"
        onclick="updateItemGoodsInfo(${orderID}, ${orderSh.getKey()}, 0);"
            />
            <input
        type="button"
        name="submit"
        value="刪除貨品"
        onclick="removeItemGoodsInfo(${orderID}, ${orderSh.getKey()});"
            />
        `;
        goodsValueString += `</div>`;
        $("#admin__monitor").append(goodsValueString);
        lastGoodsID = Number(orderSh.getKey()) + 1;
        console.log(lastGoodsID);
      });
    },
    (rej) => {
      console.log(rej);
    }
  );
  var goodsValueString = `<div class="admin__monitor__goods" style = "background-color: #e2de9786;">`;
  goodsValueString += `
    <form name="form" id="form${lastGoodsID}">
    <div class="admin__monitor__item">增新貨物：${lastGoodsID}</div>
    <div class="admin__monitor__item">貨品名稱：
      <input
      type="text"
      name="goodsName"
      id="goodsName"
      required
      />
    </div>
    <div class="admin__monitor__item">貨品購買網址：
          <input
          type="text"
          name="website"
          id="website"
          required
          />
        </div>
    <div class="admin__monitor__item">單價(NTD)：
      <input
      type="number"
      name="price"
      id="price"
      class="price${lastGoodsID}"
      oninput="updateTotalPrice(${lastGoodsID})" required
      />
    </div>
    <div class="admin__monitor__item">數量：
      <input
      type="number"
      name="count"
      id="count"
      class="count${lastGoodsID}"
      oninput="updateTotalPrice(${lastGoodsID})" required
      />
    </div>
    <div class="admin__monitor__item" id="totalPrice${lastGoodsID}">總值(NTD)：0
    </div>
    </form>
    <input
    type="button"
    name="submit"
    value="增新貨品"
    onclick="updateItemGoodsInfo(${orderID}, ${lastGoodsID}, 1);"
        />
    `;
  goodsValueString += `</div>`;
  $("#admin__monitor").append(goodsValueString);
}
async function removeItemGoodsInfo(orderID, goodsID) {
  await firebase
    .database()
    .ref("order/" + orderID + "/goods/" + goodsID)
    .remove()
    .then(function () {
      alert("刪除資料成功");
      showEditOrderForm(orderID);
    })
    .catch(function () {
      alert(
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
      $("#admin__monitor").empty();
    });
}

function updateTotalPrice(goodsID) {
  console.log(goodsID);
  console.log(document.getElementsByClassName("price" + goodsID)[0].value);
  document.getElementById("totalPrice" + goodsID).innerHTML =
    "總值：(NTD)" +
    document.getElementsByClassName("price" + goodsID)[0].value *
      document.getElementsByClassName("count" + goodsID)[0].value +
    "<br>總值(HKD)3.7:1：" +
    Math.ceil(
      (document.getElementsByClassName("price" + goodsID)[0].value *
        document.getElementsByClassName("count" + goodsID)[0].value) /
        3.7,
      1
    );
}

async function updateItemGoodsInfo(orderID, goodsID, mode) {
  const form = document.forms["form" + goodsID];
  var goodsName = form.elements.goodsName.value;
  var price = form.elements.price.value;
  var count = form.elements.count.value;
  var website = form.elements.website.value;
  if (goodsName != "" && price != "" && count != "" && website != "") {
    await firebase
      .database()
      .ref("order/" + orderID + "/goods/" + goodsID)
      .update({
        goodsName: form.elements.goodsName.value,
        price: form.elements.price.value,
        count: form.elements.count.value,
        website: form.elements.website.value,
      })
      .then(function () {
        alert("更新資料成功");
      })
      .catch(function () {
        alert(
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
        $("#admin__monitor").empty();
      });
  } else {
    alert("建立失敗！！！未有填寫全部資料");
  }
  if (mode === 1) {
    showEditOrderForm(orderID);
  }
}

async function updateItemOrderInfo(orderID) {
  var DataRef = firebase.database().ref("order");
  var totalChild = 0;
  await DataRef.once("value").then(
    (res) => {
      res.forEach((Item, index) => {
        totalChild += 1;
      });
      return true;
    },
    (rej) => {
      console.log(rej);
      return true;
    }
  );
  console.log(totalChild);
  const form = document.forms["form"];
  var orderTime = form.elements.orderTime.value;
  var customerName = form.elements.customerName.value;
  var phoneNumber = form.elements.phoneNumber.value;
  var address = form.elements.address.value;
  var isShip = form.elements.isShip.value;
  var shipNumber = form.elements.shipNumber.value;
  var isFinish = form.elements.isFinish.value;
  if (
    orderTime != "" &&
    customerName != "" &&
    phoneNumber != "" &&
    address != "" &&
    isShip != "" &&
    shipNumber != "" &&
    isFinish != ""
  ) {
    firebase
      .database()
      .ref("order/" + orderID)
      .update({
        orderTime: form.elements.orderTime.value,
        customerName: form.elements.customerName.value,
        phoneNumber: form.elements.phoneNumber.value,
        address: form.elements.address.value,
        isShip: form.elements.isShip.value,
        shipNumber: form.elements.shipNumber.value,
        isFinish: form.elements.isFinish.value,
      })
      .then(function () {
        alert("更新資料成功");
      })
      .catch(function () {
        alert(
          "伺服器發生錯誤。如果您是管理員，請尋找真·管理員協助。 或者 你是駭客 ㄇㄌㄈㄎ！！"
        );
        if (user === "") {
          logout(999);
          $("#admin__content").empty();
          $("#admin__choosePage").empty();
          var divContent = `
    <div class="admin__login">
        <div class="admin__login__title">請先登入</div>
        <div id="singUpRedirect" onclick="googleLoginRedirect()">
            使用google帳號登入
        </div>
    </div>`;
          $("#admin__content").append(divContent);
        }
        $("#admin__monitor").empty();
      });
  } else {
    alert("建立失敗！！！未有填寫全部資料");
  }
}

async function showAddOrderForm() {
  $("#admin__monitor").empty();
  var DataRef = firebase.database().ref("/order/");
  var lastOrderID = 0;
  var currentdate = new Date();
  var datetime =
    currentdate.getFullYear() +
    (currentdate.getMonth() + 1 < 10 ? "0" : "") +
    (currentdate.getMonth() + 1) +
    (currentdate.getDate() < 10 ? "0" : "") +
    currentdate.getDate() +
    (currentdate.getHours() < 10 ? "0" : "") +
    currentdate.getHours() +
    (currentdate.getMinutes() < 10 ? "0" : "") +
    currentdate.getMinutes() +
    (currentdate.getSeconds() < 10 ? "0" : "") +
    currentdate.getSeconds();
  console.log(datetime);
  await DataRef.once("value").then(
    (res) => {
      res.forEach((Item, index) => {
        lastOrderID = Number(Item.getKey()) + 1;
      });
      return true;
    },
    (rej) => {
      console.log(rej);
      return true;
    }
  );
  console.log(lastOrderID);
  var titleString = `
  <div class="admin__monitor__title">增新訂單編號為${lastOrderID}的客戶資料</div>
  `;
  $("#admin__monitor").append(titleString);
  var orderTitleString = `
      <div class="admin__monitor__item">
      訂單編號：${lastOrderID}
      </div>
      <form name="form" id="form">
        <div class="admin__monitor__item">
        訂單日期：
          <input
            type="text"
            name="orderTime"
            id="orderTime"
            value = "${datetime}"
            required
          />
        </div>
        <div class="admin__monitor__item">
        訂單人名稱：
          <input
            type="text"
            name="customerName"
            id="customerName"
            required
          />
        </div>
        <div class="admin__monitor__item">
        訂單人電話：
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            required
          />
        </div>
        <div class="admin__monitor__item">
        訂單人收貨地址：
          <input
            type="text"
            name="address"
            id="address"
            required
          />
        </div>
          <input
        type="button"
        name="submit"
        value="新增訂單客戶資料"
        onclick="setItemOrderInfo(${lastOrderID});"
            />
      </form>
        `;
  $("#admin__monitor").append(orderTitleString);
}

async function setItemOrderInfo(orderID) {
  const form = document.forms["form"];
  var orderTime = form.elements.orderTime.value;
  var customerName = form.elements.customerName.value;
  var phoneNumber = form.elements.phoneNumber.value;
  var address = form.elements.address.value;
  this.isShip = "false";
  this.shipNumber = "NaN";
  this.isFinish = "false";
  if (
    orderTime != "" &&
    customerName != "" &&
    phoneNumber != "" &&
    address != "" &&
    this.isShip != "" &&
    this.shipNumber != "" &&
    this.isFinish != ""
  ) {
    firebase
      .database()
      .ref("order/" + orderID)
      .update({
        orderTime: form.elements.orderTime.value,
        customerName: form.elements.customerName.value,
        phoneNumber: form.elements.phoneNumber.value,
        address: form.elements.address.value,
        isShip: this.isShip,
        shipNumber: this.shipNumber,
        isFinish: this.isFinish,
      })
      .then(function () {
        alert("新增資料成功");
      })
      .catch(function () {
        alert(
          "伺服器發生錯誤。如果您是管理員，請尋找真·管理員協助。 或者 你是駭客 ㄇㄌㄈㄎ！！"
        );
        if (user === "") {
          logout(999);
          $("#admin__content").empty();
          $("#admin__choosePage").empty();
          var divContent = `
    <div class="admin__login">
        <div class="admin__login__title">請先登入</div>
        <div id="singUpRedirect" onclick="googleLoginRedirect()">
            使用google帳號登入
        </div>
    </div>`;
          $("#admin__content").append(divContent);
        }
        $("#admin__monitor").empty();
      });
  } else {
    alert("新增失敗！！！未有填寫全部資料");
  }
}

async function removeItemOrderInfo(orderID) {
  await firebase
    .database()
    .ref("order/" + orderID)
    .remove()
    .then(function () {
      alert("刪除訂單成功");
      $("#admin__monitor").empty();
    })
    .catch(function () {
      alert(
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
      $("#admin__monitor").empty();
    });
}
