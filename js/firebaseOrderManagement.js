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
var db = firebase.firestore();
var twdToHKD = 3.7;

//readOrder
function showReadOrderItem() {
  $("#admin__monitor").empty();
  var titleString = `
    <div class="admin__monitor__title">查看訂單</div>
    `;
  $("#admin__monitor").append(titleString);
  db.collection("order")
    .get()
    .then(
      function (querySnapshot) {
        querySnapshot.forEach(function (ordersh) {
          var orderInfo = ordersh.data();
          var orderTitleString = `
          <div class="admin__monitor__chooseItem ${
            orderInfo.isCancel === "true"
              ? "admin__monitor__chooseItem-gray"
              : orderInfo.isPaid === "true"
              ? orderInfo.isShip === "true"
                ? orderInfo.isFinish === "true"
                  ? "admin__monitor__chooseItem-green"
                  : "admin__monitor__chooseItem-yellow"
                : "admin__monitor__chooseItem-orange"
              : "admin__monitor__chooseItem-red"
          }" onclick="showReadOrderInfo(${ordersh.id})">
          ${ordersh.id}　收件人：${orderInfo.customerName}　${
            orderInfo.isCancel === "true"
              ? "已取消"
              : orderInfo.isPaid === "true"
              ? orderInfo.isShip === "true"
                ? orderInfo.isFinish === "true"
                  ? "搞掂曬"
                  : "出咗貨"
                : "備緊貨"
              : "要收數"
          }</div></div>
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
  var orderInfo = "";
  var titleString = `
    <div class="admin__monitor__block">
    <div class="admin__monitor__title">客戶資料</div>
    `;
  await db
    .collection("order")
    .doc(orderID.toString())
    .get()
    .then(
      function (ordersh) {
        orderInfo = ordersh.data();
        titleString += `
        <div class="admin__monitor__item">
        訂單編號：${ordersh.id}
        </div>
          <div class="admin__monitor__item">
          訂單日期：${orderInfo.orderTime}
          </div>
          <div class="admin__monitor__item">
          收件人名稱：${orderInfo.customerName}
          </div>
          <div class="admin__monitor__item">
          收件人電話：${orderInfo.phoneNumber}
          </div>
          <div class="admin__monitor__item">
          收件人地址：${orderInfo.address}
          </div>
          <div class="admin__monitor__item">
          其他聯絡方法：${orderInfo.otherContacts}
          </div>
          <div class="admin__monitor__item">
          聯絡方法之用戶名：${orderInfo.contactsName}
          </div>
          <div class="admin__monitor__title">運送資料</div>
          <div class="admin__monitor__item">
          訂單是否已收款：${orderInfo.isPaid === "true" ? "已收款" : "未收款"}
          </div>
          <div class="admin__monitor__item">
          訂單是否已出貨：${orderInfo.isShip === "true" ? "已出貨" : "未出貨"}
          </div>
          <div class="admin__monitor__item">
          順豐單號：${orderInfo.shipNumber}
          </div>
          <div class="admin__monitor__item">
          訂單是否已完成：${orderInfo.isFinish === "true" ? "已完成" : "未完成"}
          </div>
          <div class="admin__monitor__item">
          訂單是否已取消：${orderInfo.isCancel === "true" ? "是" : "否"}
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
  var titleString = `
    <div class="admin__monitor__block" style="background-color: #f3c6c686;">
      <div class="admin__monitor__title">全單總價格：</div>
        <div class="admin__monitor__item" id="orderTotalPriceNTD">入貨總價格(NTD)：
        </div>
        <div class="admin__monitor__item" id="orderTotalPriceHKD">定價總價格(HKD)：
        </div>
    </div>
  `;
  $("#admin__monitor").append(titleString);
  var goodsValueString = `
  <div class="admin__monitor__title">貨品清單</div>
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
  await db
    .collection("order")
    .doc(orderID.toString())
    .collection("goods")
    .get()
    .then(
      function (querySnapshot) {
        querySnapshot.forEach(function (orderSh) {
          goodsValueString += `<div class="admin__monitor__goods">`;
          var goodsValue = orderSh.data();
          goodsValueString += `
          <form name="form" id="form${orderSh.id}">
          <tr class="admin__monitor__goodsTable__itemTR">
            <th class="admin__monitor__goodsTable__itemTH">${orderSh.id}</th>
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

// add new order
async function showAddOrderForm() {
  $("#admin__monitor").empty();
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

  await db
    .collection("order")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        lastOrderID = Number(doc.id) + 1;
      });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
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
          收件人名稱：
            <input
              type="text"
              name="customerName"
              id="customerName"
              required
            />
          </div>
          <div class="admin__monitor__item">
          收件人電話：
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              required
            />
          </div>
          <div class="admin__monitor__item">
          收件人收貨地址：
            <input
              type="text"
              name="address"
              id="address"
              required
            />
          </div>
          <div class="admin__monitor__item">
            其他聯絡方法：
            <select name="otherContacts" id="otherContacts" class="selection">
            　<option value="none" SELECTED>無</option>
            　<option value="Whatsapp">Whatsapp</option>
            <option value="IG">IG</option>
            <option value="Facebook">Facebook</option>
            </select>
          </div>
          <div class="admin__monitor__item">
            聯絡方法之用戶名：
            <input type="text" name="contactsName" id="contactsName"
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
  this.isPaid = "false";
  this.isCancel = "false";
  if (
    orderTime != "" &&
    customerName != "" &&
    phoneNumber != "" &&
    address != ""
  ) {
    await db
      .collection("order")
      .doc(orderID.toString())
      .set({
        orderTime: form.elements.orderTime.value,
        customerName: form.elements.customerName.value,
        phoneNumber: form.elements.phoneNumber.value,
        address: form.elements.address.value,
        isShip: this.isShip,
        shipNumber: this.shipNumber,
        isFinish: this.isFinish,
        isPaid: this.isPaid,
        isCancel: this.isCancel,
      })
      .then(function () {
        alert("新增訂單成功");
        updateUpdateDateTime(orderID);
        showEditOrderForm(orderID);
        return;
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
        return;
      });
  } else {
    alert("新增失敗！！！未有填寫全部資料");
  }
}

// edit order info

function showOrderItem() {
  $("#admin__monitor").empty();
  var titleString = `
    <div class="admin__monitor__title">修改訂單：</div>
    `;
  $("#admin__monitor").append(titleString);
  db.collection("order")
    .get()
    .then(
      function (querySnapshot) {
        querySnapshot.forEach(function (ordersh) {
          var orderInfo = ordersh.data();
          var orderTitleString = `
          <div class="admin__monitor__chooseItem ${
            orderInfo.isCancel === "true"
              ? "admin__monitor__chooseItem-gray"
              : orderInfo.isPaid === "true"
              ? orderInfo.isShip === "true"
                ? orderInfo.isFinish === "true"
                  ? "admin__monitor__chooseItem-green"
                  : "admin__monitor__chooseItem-yellow"
                : "admin__monitor__chooseItem-orange"
              : "admin__monitor__chooseItem-red"
          }" onclick="showEditOrderForm(${ordersh.id})">${
            ordersh.id
          }　收件人：${orderInfo.customerName}　${
            orderInfo.isCancel === "true"
              ? "已取消"
              : orderInfo.isPaid === "true"
              ? orderInfo.isShip === "true"
                ? orderInfo.isFinish === "true"
                  ? "搞掂曬"
                  : "出咗貨"
                : "備緊貨"
              : "要收數"
          }</div></div>
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
  var orderTitleString = `
    <div class="admin__monitor__block">
    <div class="admin__monitor__title">客戶資料</div>
    `;
  db.collection("order")
    .doc(orderID.toString())
    .get()
    .then(
      function (ordersh) {
        var orderInfo = ordersh.data();
        orderTitleString += `
        <div class="admin__monitor__item">
        訂單編號：${ordersh.id}
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
          收件人名稱：
            <input
              type="text"
              name="customerName"
              id="customerName"
              value="${orderInfo.customerName}" required
            />
          </div>
          <div class="admin__monitor__item">
          收件人電話：
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              value="${orderInfo.phoneNumber}" required
            />
          </div>
          <div class="admin__monitor__item">
          收件人地址：
            <input
              type="text"
              name="address"
              id="address"
              value="${orderInfo.address}" required
            />
          </div>
          <div class="admin__monitor__item">
            其他聯絡方法：
            <select name="otherContacts" id="otherContacts" class="selection">
            　<option value="none" ${
              orderInfo.otherContacts === "none" ? "SELECTED" : ""
            }>無</option>
            　<option value="Whatsapp" ${
              orderInfo.otherContacts === "Whatsapp" ? "SELECTED" : ""
            }>Whatsapp</option>
            <option value="IG" ${
              orderInfo.otherContacts === "IG" ? "SELECTED" : ""
            }>IG</option>
            <option value="Facebook" ${
              orderInfo.otherContacts === "Facebook" ? "SELECTED" : ""
            }>Facebook</option>
            </select>
          </div>
          <div class="admin__monitor__item">
            聯絡方法之用戶名：
            <input type="text" name="contactsName" id="contactsName" value="${
              orderInfo.contactsName
            }"
            />
          </div>
          <div class="admin__monitor__title">處理流程</div>
          <div class="admin__monitor__item">
            是否已收款：
            <input type="checkbox" id="isPaid" name="isPaid" ${
              orderInfo.isPaid === "true" ? "checked" : ""
            }>
          </div>
          <div class="admin__monitor__item">
          是否已出貨：
          <input type="checkbox" id="isShip" name="isShip" ${
            orderInfo.isShip === "true" ? "checked" : ""
          }>
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
          是否已完成：
          <input type="checkbox" id="isFinish" name="isFinish" ${
            orderInfo.isFinish === "true" ? "checked" : ""
          }>
          </div>
          <div class="admin__monitor__item">
          是否已取消訂單：
          <select name="isCancel" id="isCancel${ordersh.id}" class="selection">
          　<option value="true" ${
            orderInfo.isCancel === "true" ? "SELECTED" : ""
          }>是</option>
          　<option value="false" ${
            orderInfo.isCancel === "false" ? "SELECTED" : ""
          }>否</option>
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

//edit good
async function showEditGoodsForm(orderID) {
  var lastGoodsID = 0;
  var titleString = `
    <div class="admin__monitor__block" style="background-color: #f3c6c686;">
      <div class="admin__monitor__title">全單總價格：</div>
        <div class="admin__monitor__item" id="orderTotalPriceNTD">入貨總價格(NTD)：
        </div>
        <div class="admin__monitor__item" id="orderTotalPriceHKD">定價總價格(HKD)：
        </div>
    </div>
  `;
  $("#admin__monitor").append(titleString);
  var titleString = `
  <div class="admin__monitor__title">貨品清單</div>
  `;
  $("#admin__monitor").append(titleString);
  await db
    .collection("order")
    .doc(orderID.toString())
    .collection("goods")
    .get()
    .then(
      function (querySnapshot) {
        querySnapshot.forEach(function (ordersh) {
          var goodsValueString = `<div class="admin__monitor__goods">`;
          var goodsValue = ordersh.data();
          goodsValueString += `
          <form name="form" id="form${ordersh.id}">
          <div class="admin__monitor__item">編號：
          ${ordersh.id}
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
            class="price${ordersh.id}"
            value="${goodsValue.price}" oninput="updateTotalPrice(${orderID},${
            ordersh.id
          })" required
            />
          </div>
          <div class="admin__monitor__item" id="priceHKD${
            ordersh.id
          }">入貨單價(HKD)：${Math.ceil(goodsValue.price / twdToHKD)}
          </div>
          <div class="admin__monitor__item">售價單價(HKD)：
          <input
            type="number"
            name="priceHKD"
            id="priceHKD"
            class="priceHKD${ordersh.id}"
            value="${
              goodsValue.priceHKD
            }" oninput="updateTotalPrice(${orderID},${ordersh.id})" required
            />
          </div>
          <div class="admin__monitor__item">數量：
            <input
            type="number"
            name="count"
            id="count"
            class="count${ordersh.id}"
            value="${goodsValue.count}" oninput="updateTotalPrice(${orderID},${
            ordersh.id
          })" required
            />
          </div>
          <div class="admin__monitor__item" id="totalPrice${
            ordersh.id
          }">入貨總值(NTD)：${goodsValue.price * goodsValue.count}
          </div>
          <div class="admin__monitor__item" id="totalPriceHKD${
            ordersh.id
          }">售價總值(HKD)：${goodsValue.priceHKD * goodsValue.count}
          </div>
          </form>
          <input
          type="button"
          name="submit"
          value="更新貨品資料"
          onclick="updateItemGoodsInfo(${orderID},${ordersh.id}, 0);"
              />
              <input
          type="button"
          name="submit"
          value="刪除貨品"
          onclick="removeItemGoodsInfo(${orderID},${ordersh.id});"
              />
          `;
          goodsValueString += `</div>`;
          $("#admin__monitor").append(goodsValueString);
          lastGoodsID = Number(ordersh.id) + 1;
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

async function removeItemGoodsInfo(orderID, goodsID) {
  if (
    confirm("請再次確定是不真的要刪除此貨品？ 一旦確定將無法取消。") == true
  ) {
    await db
      .collection("order")
      .doc(orderID.toString())
      .collection("goods")
      .doc(goodsID.toString())
      .delete()
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

async function removeItemOrderInfo(orderID) {
  if (
    confirm("請再次確定是不真的要刪除此訂單？ 一旦確定將無法取消。") == true
  ) {
    await db
      .collection("order")
      .doc(orderID.toString())
      .delete()
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

async function countAllTotalPrice(orderID) {
  var orderTotalPrice = 0;
  var orderTotalPriceHKD = 0;
  await db
    .collection("order")
    .doc(orderID.toString())
    .collection("goods")
    .get()
    .then(
      function (querySnapshot) {
        querySnapshot.forEach(function (orderSh) {
          var orderInfo = orderSh.data();
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
    await db
      .collection("order")
      .doc(orderID.toString())
      .collection("goods")
      .doc(goodsID.toString())
      .set({
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
  const form = document.forms["form"];
  var orderTime = form.elements.orderTime.value;
  var customerName = form.elements.customerName.value;
  var phoneNumber = form.elements.phoneNumber.value;
  var address = form.elements.address.value;
  var shipNumber = form.elements.shipNumber.value;
  var isShip = form.elements.isShip.checked.toString();
  var isFinish = form.elements.isFinish.checked.toString();
  var isPaid = form.elements.isPaid.checked.toString();
  var isCancel = form.elements.isCancel.value;
  var otherContacts = form.elements.isPaid.value;
  if (isPaid === "false" && isShip === "false" && isFinish === "true") {
    //F F T
    if (confirm("邏輯錯誤！！還沒收款或寄貨就完成訂單？") == false) {
      return 0;
    }
  } else if (isPaid === "false") {
    if (isShip === "true") {
      //F T F
      if (confirm("邏輯錯誤！！還沒收款就寄貨？") == false) {
        return 0;
      }
    }
  }
  if (
    orderTime != "" &&
    customerName != "" &&
    phoneNumber != "" &&
    address != "" &&
    shipNumber != "" &&
    otherContacts != ""
  ) {
    await db
      .collection("order")
      .doc(orderID.toString())
      .update({
        orderTime: form.elements.orderTime.value,
        customerName: form.elements.customerName.value,
        phoneNumber: form.elements.phoneNumber.value,
        address: form.elements.address.value,
        isShip: form.elements.isShip.checked.toString(),
        shipNumber: form.elements.shipNumber.value,
        isFinish: form.elements.isFinish.checked.toString(),
        isPaid: form.elements.isPaid.checked.toString(),
        otherContacts: form.elements.otherContacts.value,
        contactsName:
          form.elements.contactsName.value != ""
            ? form.elements.contactsName.value
            : "none",
        isCancel: form.elements.isCancel.value,
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
  await db
    .collection("order")
    .doc(orderID.toString())
    .update({
      leastUpdateTime: datetime,
      updateUser: tempUser.displayName,
    })
    .then(function () {
      return true;
    })
    .catch(function () {
      return false;
    });
}
