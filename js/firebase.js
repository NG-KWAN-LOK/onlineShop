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
var twdToHKD = 3.7;
async function readDatabase(pagechoose) {
  $("#admin__monitor").empty();
  var DataRef = firebase.database().ref(pagechoose);
  console.log("In editDatabase" + pagechoose);
  var titleString = `
  <div class="admin__monitor__title">在資料庫${pagechoose}內有之資料</div>
  `;
  $("#admin__monitor").append(titleString);
  await DataRef.once("value").then(
    (res) => {
      res.forEach((Item, index) => {
        var itemKey = Item.getKey();
        itemValue = Item.val();
        console.log(itemValue);
        var divContent = `<div class="admin__monitor__item" style="padding:36px 0px 0px 0px">${itemKey}：</div>`;
        for (var title in itemValue) {
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
//readOrder
function showReadOrderItem() {
  $("#admin__monitor").empty();
  var DataRef = firebase.database().ref("order");
  var titleString = `
  <div class="admin__monitor__title">請選擇想查看之訂單：</div>
  `;
  $("#admin__monitor").append(titleString);
  DataRef.once("value").then(
    (res) => {
      res.forEach((orderSh, orderIndex) => {
        var orderInfo = orderSh.val();
        var orderTitleString = `
        <div class="admin__monitor__chooseItem ${
          orderInfo.isShip === "true"
            ? orderInfo.isFinish === "true"
              ? "admin__monitor__chooseItem-green"
              : "admin__monitor__chooseItem-orange"
            : "admin__monitor__chooseItem-red"
        }" onclick="showReadOrderInfo(${orderSh.getKey()})">${orderSh.getKey()}　訂單人：${
          orderInfo.customerName
        }　${orderInfo.isShip === "true" ? "已" : "未"}出貨　${
          orderInfo.isFinish === "true" ? "已" : "未"
        }結單</div></div>
        `;
        $("#admin__monitor").append(orderTitleString);
      });
    },
    (rej) => {
      console.log(rej);
    }
  );
}
async function showReadOrderInfo(orderID) {
  $("#admin__monitor").empty();
  var DataRef = firebase.database().ref("order/" + orderID);
  var orderInfo = "";
  var titleString = `
  <div class="admin__monitor__block">
  <div class="admin__monitor__title">在訂單${orderID}內之客戶資料</div>
  `;
  await DataRef.once("value").then(
    (res) => {
      orderInfo = res.val();
      titleString += `
      <div class="admin__monitor__item">
      訂單編號：${res.getKey()}
      </div>
        <div class="admin__monitor__item">
        訂單日期：${orderInfo.orderTime}
        </div>
        <div class="admin__monitor__item">
        訂單人名稱：${orderInfo.customerName}
        </div>
        <div class="admin__monitor__item">
        訂單人電話：${orderInfo.phoneNumber}
        </div>
        <div class="admin__monitor__item">
        訂單人收貨地址：${orderInfo.address}
        </div>
        <div class="admin__monitor__title">以下為訂單編號為${res.getKey()}之運送資料</div>
        <div class="admin__monitor__item">
        訂單是否已出貨：${orderInfo.isShip}
        </div>
        <div class="admin__monitor__item">
        順豐單號：${orderInfo.shipNumber}
        </div>
        <div class="admin__monitor__item">
        訂單是否已完成：${orderInfo.isFinish}
        </div>
        </div>`;
      $("#admin__monitor").append(titleString);
      return true;
    },
    (rej) => {
      console.log(rej);
      return true;
    }
  );
  var DataRef = firebase.database().ref("/order/" + orderID + "/goods");
  var titleString = `
  <div class="admin__monitor__block" style="background-color: #f3c6c686;">
    <div class="admin__monitor__title">訂單編號${orderID}之全單總價格：</div>
      <div class="admin__monitor__item" id="orderTotalPriceNTD">入貨總價格(NTD)：
      </div>
      <div class="admin__monitor__item" id="orderTotalPriceHKD">定價總價格(HKD)：
      </div>
  </div>
`;
  $("#admin__monitor").append(titleString);
  var goodsValueString = `
<div class="admin__monitor__title">以下為訂單編號${orderID}之貨品清單</div>
<table class="admin__monitor__goodsTable">
  <tr class="admin__monitor__goodsTable__titleTR">
    <th class="admin__monitor__goodsTable__titleTH">ID</th>
    <th class="admin__monitor__goodsTable__titleTH">貨品名稱</th>
    <th class="admin__monitor__goodsTable__titleTH">入貨單價</th>
    <th class="admin__monitor__goodsTable__titleTH">售價單價(HKD)</th>
    <th class="admin__monitor__goodsTable__titleTH">數量</th>
    <th class="admin__monitor__goodsTable__titleTH admin__monitor__goodsTable__titleTH-important">入貨總價(NTD)</th>
    <th class="admin__monitor__goodsTable__titleTH admin__monitor__goodsTable__titleTH-important">售價總價(HKD)</th>
  </tr>
`;
  await DataRef.once("value").then(
    (res) => {
      res.forEach((orderSh, orderIndex) => {
        goodsValueString += `<div class="admin__monitor__goods">`;
        var goodsValue = orderSh.val();
        goodsValueString += `
        <form name="form" id="form${orderSh.getKey()}">
        <tr class="admin__monitor__goodsTable__itemTR">
          <th class="admin__monitor__goodsTable__itemTH">${orderSh.getKey()}</th>
          <th class="admin__monitor__goodsTable__itemTH">
            <a href="${goodsValue.website}" target="_blank">
              ${goodsValue.goodsName}
            </a>
          </th>
          <th class="admin__monitor__goodsTable__itemTH">
            ${goodsValue.price}(NTD)
            <br>
            ${Math.ceil(goodsValue.price / twdToHKD)}(HKD)
          </th>
          <th class="admin__monitor__goodsTable__itemTH">
            ${goodsValue.priceHKD}
          </th>
          <th class="admin__monitor__goodsTable__itemTH">${
            goodsValue.count
          }</th>
          <th class="admin__monitor__goodsTable__itemTH admin__monitor__goodsTable__itemTH-important">${
            goodsValue.price * goodsValue.count
          }</th>
          <th class="admin__monitor__goodsTable__itemTH admin__monitor__goodsTable__itemTH-important">${
            goodsValue.goodsTotalPriceHKD
          }</th>
        </tr>
        `;
      });
      countAllTotalPrice(orderID);
      goodsValueString += `</table>
      <div class="admin__monitor__subtitle" style="margin:20px 0;">最後更新係於 ${orderInfo.leastUpdateTime}由${orderInfo.updateUser}</div>
      `;
      $("#admin__monitor").append(goodsValueString);
    },
    (rej) => {
      console.log(rej);
    }
  );
}
//editOrder
function showOrderItem() {
  $("#admin__monitor").empty();
  var DataRef = firebase.database().ref("order");
  var titleString = `
  <div class="admin__monitor__title">請選擇想修改之訂單：</div>
  `;
  $("#admin__monitor").append(titleString);
  DataRef.once("value").then(
    (res) => {
      res.forEach((orderSh, orderIndex) => {
        var orderInfo = orderSh.val();
        console.log(orderInfo);
        var orderTitleString = `
        <div class="admin__monitor__chooseItem ${
          orderInfo.isShip === "true"
            ? orderInfo.isFinish === "true"
              ? "admin__monitor__chooseItem-green"
              : "admin__monitor__chooseItem-orange"
            : "admin__monitor__chooseItem-red"
        }" onclick="showEditOrderForm(${orderSh.getKey()})">${orderSh.getKey()}　訂單人：${
          orderInfo.customerName
        }　${orderInfo.isShip === "true" ? "已" : "未"}出貨　${
          orderInfo.isFinish === "true" ? "已" : "未"
        }結單</div></div>
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
  var orderTitleString = `
  <div class="admin__monitor__block">
  <div class="admin__monitor__title">以下為訂單編號${orderID}之客戶資料</div>
  `;
  DataRef.once("value").then(
    (res) => {
      orderInfo = res.val();
      orderTitleString += `
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
        <div class="admin__monitor__title">以下為訂單編號為${res.getKey()}之運送資料</div>
        <div class="admin__monitor__item">
        訂單是否已出貨：
        <select name="isShip" id="isShip${res.getKey()}" class="selection">
        　<option value="true" ${
          orderInfo.isShip === "true" ? "SELECTED" : ""
        }>true</option>
        　<option value="false" ${
          orderInfo.isShip === "false" ? "SELECTED" : ""
        }>false</option>
        </select>
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
        <select name="isFinish" id="isFinish${res.getKey()}" class="selection">
        　<option value="true" ${
          orderInfo.isFinish === "true" ? "SELECTED" : ""
        }>true</option>
        　<option value="false" ${
          orderInfo.isFinish === "false" ? "SELECTED" : ""
        }>false</option>
        </select>
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
      </div>
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
  <div class="admin__monitor__block" style="background-color: #f3c6c686;">
    <div class="admin__monitor__title">訂單編號${orderID}之全單總價格：</div>
      <div class="admin__monitor__item" id="orderTotalPriceNTD">入貨總價格(NTD)：
      </div>
      <div class="admin__monitor__item" id="orderTotalPriceHKD">定價總價格(HKD)：
      </div>
  </div>
`;
  $("#admin__monitor").append(titleString);
  var titleString = `
<div class="admin__monitor__title">以下為訂單編號${orderID}之貨品清單</div>
`;
  $("#admin__monitor").append(titleString);
  await DataRef.once("value").then(
    (res) => {
      res.forEach((orderSh, orderIndex) => {
        var goodsValueString = `<div class="admin__monitor__goods">`;
        var goodsValue = orderSh.val();
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
        <div class="admin__monitor__item">入貨單價(NTD)：
          <input
          type="number"
          name="price"
          id="price"
          class="price${orderSh.getKey()}"
          value="${
            goodsValue.price
          }" oninput="updateTotalPrice(${orderID},${orderSh.getKey()})" required
          />
        </div>
        <div class="admin__monitor__item" id="priceHKD${orderSh.getKey()}">入貨單價(HKD)：${Math.ceil(
          goodsValue.price / twdToHKD
        )}
        </div>
        <div class="admin__monitor__item">售價單價(HKD)：
        <input
          type="number"
          name="priceHKD"
          id="priceHKD"
          class="priceHKD${orderSh.getKey()}"
          value="${
            goodsValue.priceHKD
          }" oninput="updateTotalPrice(${orderID},${orderSh.getKey()})" required
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
          }" oninput="updateTotalPrice(${orderID},${orderSh.getKey()})" required
          />
        </div>
        <div class="admin__monitor__item" id="totalPrice${orderSh.getKey()}">入貨總值(NTD)：${
          goodsValue.price * goodsValue.count
        }
        </div>
        <div class="admin__monitor__item" id="totalPriceHKD${orderSh.getKey()}">售價總值(HKD)：${
          goodsValue.priceHKD * goodsValue.count
        }
        </div>
        </form>
        <input
        type="button"
        name="submit"
        value="更新貨品資料"
        onclick="updateItemGoodsInfo(${orderID},${orderSh.getKey()}, 0);"
            />
            <input
        type="button"
        name="submit"
        value="刪除貨品"
        onclick="removeItemGoodsInfo(${orderID},${orderSh.getKey()});"
            />
        `;
        goodsValueString += `</div>`;
        $("#admin__monitor").append(goodsValueString);
        lastGoodsID = Number(orderSh.getKey()) + 1;
      });
    },
    (rej) => {
      console.log(rej);
    }
  );
  var goodsValueString = `<div class="admin__monitor__goods" style = "background-color: #e2de9786;">`;
  goodsValueString += `
    <form name="form" id="form${lastGoodsID}">
    <div class="admin__monitor__item">新增貨物：${lastGoodsID}</div>
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
    <div class="admin__monitor__item">入貨單價(NTD)：
      <input
      type="number"
      name="price"
      id="price"
      class="price${lastGoodsID}"
      oninput="updateTotalPrice(${orderID},${lastGoodsID})" required
      />
    </div>
    <div class="admin__monitor__item" id="priceHKD${lastGoodsID}">入貨單價(HKD)：0
    </div>
    <div class="admin__monitor__item">售價單價(HKD)：
    <input
      type="number"
      name="priceHKD"
      id="priceHKD"
      class="priceHKD${lastGoodsID}" oninput="updateTotalPrice(${orderID},${lastGoodsID})" required
      />
    </div>
    <div class="admin__monitor__item">數量：
      <input
      type="number"
      name="count"
      id="count"
      class="count${lastGoodsID}" oninput="updateTotalPrice(${orderID},${lastGoodsID})" required
      />
    </div>
    <div class="admin__monitor__item" id="totalPrice${lastGoodsID}">入貨總值(NTD)：0
    </div>
    <div class="admin__monitor__item" id="totalPriceHKD${lastGoodsID}">售價總值(HKD)：0
    </div>
    </form>
    <input
    type="button"
    name="submit"
    value="新增貨品"
    onclick="updateItemGoodsInfo(${orderID}, ${lastGoodsID}, 1);"
        />
    `;
  goodsValueString += `</div>`;
  $("#admin__monitor").append(goodsValueString);
  countAllTotalPrice(orderID);
}
async function countAllTotalPrice(orderID) {
  var DataRef = firebase.database().ref("order/" + orderID + "/goods");
  var orderTotalPrice = 0;
  var orderTotalPriceHKD = 0;
  await DataRef.once("value").then(
    (res) => {
      res.forEach((orderSh, orderIndex) => {
        var orderInfo = orderSh.val();
        orderTotalPrice += orderInfo.goodsTotalPrice;
        orderTotalPriceHKD += orderInfo.goodsTotalPriceHKD;
      });
    },
    (rej) => {
      console.log(rej);
    }
  );
  document.getElementById("orderTotalPriceNTD").innerHTML =
    "入貨總價格(NTD)：" + orderTotalPrice;
  document.getElementById("orderTotalPriceHKD").innerHTML =
    "定價總價格(HKD)：" + orderTotalPriceHKD;
  return orderTotalPrice;
}

async function removeItemGoodsInfo(orderID, goodsID) {
  if (
    confirm("請再次確定是不真的要刪除此貨品？ 一旦確定將無法取消。") == true
  ) {
    await firebase
      .database()
      .ref("order/" + orderID + "/goods/" + goodsID)
      .remove()
      .then(function () {
        alert("刪除貨品成功");
        updateUpdateDateTime(orderID);
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
}

function updateTotalPrice(orderID, goodsID) {
  document.getElementById("totalPrice" + goodsID).innerHTML =
    "入貨總值(NTD)：" +
    document.getElementsByClassName("price" + goodsID)[0].value *
      document.getElementsByClassName("count" + goodsID)[0].value;

  document.getElementById("priceHKD" + goodsID).innerHTML =
    "入貨單價(HKD)：" +
    Math.ceil(
      document.getElementsByClassName("price" + goodsID)[0].value / twdToHKD
    );
  document.getElementById("totalPriceHKD" + goodsID).innerHTML =
    "售價總值(HKD)：" +
    document.getElementsByClassName("priceHKD" + goodsID)[0].value *
      document.getElementsByClassName("count" + goodsID)[0].value;
  countAllTotalPrice(orderID);
}

async function updateItemGoodsInfo(orderID, goodsID, mode) {
  const form = document.forms["form" + goodsID];
  var goodsName = form.elements.goodsName.value;
  var price = form.elements.price.value;
  var count = form.elements.count.value;
  var website = form.elements.website.value;
  var priceHKD = form.elements.priceHKD.value;
  if (
    goodsName != "" &&
    price != "" &&
    count != "" &&
    website != "" &&
    priceHKD != ""
  ) {
    await firebase
      .database()
      .ref("order/" + orderID + "/goods/" + goodsID)
      .update({
        goodsName: form.elements.goodsName.value,
        price: form.elements.price.value,
        count: form.elements.count.value,
        website: form.elements.website.value,
        goodsTotalPrice: form.elements.price.value * form.elements.count.value,
        priceHKD: form.elements.priceHKD.value,
        goodsTotalPriceHKD:
          form.elements.priceHKD.value * form.elements.count.value,
      })
      .then(function () {
        alert("更新貨品資料成功");
        updateUpdateDateTime(orderID);
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
  countAllTotalPrice(orderID);
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
  const form = document.forms["form"];
  var orderTime = form.elements.orderTime.value;
  var customerName = form.elements.customerName.value;
  var phoneNumber = form.elements.phoneNumber.value;
  var address = form.elements.address.value;
  var shipNumber = form.elements.shipNumber.value;
  var isShip = form.elements.isShip.value;
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
        alert("更新訂單成功");
        updateUpdateDateTime(orderID);
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
  var titleString = `
  <div class="admin__monitor__title">新增訂單編號為${lastOrderID}之客戶資料</div>
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
        alert("新增訂單成功");
        updateUpdateDateTime(orderID);
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
  if (
    confirm("請再次確定是不真的要刪除此訂單？ 一旦確定將無法取消。") == true
  ) {
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
}

async function updateUpdateDateTime(orderID) {
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
  await firebase
    .database()
    .ref("order/" + orderID)
    .update({
      leastUpdateTime: datetime,
      updateUser: user.displayName,
    })
    .then(function () {
      return true;
    })
    .catch(function () {
      return false;
    });
}
