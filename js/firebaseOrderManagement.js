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
//show order item list
function showOrderItem(mode) {
  console.log(mode);
  var orderByRef = localStorage.getItem("orderOrderBy");
  var orderRef = localStorage.getItem("orderOrder");
  $("#admin__monitor").empty();
  var titleString = `
      <div class="admin__monitor__title">查看及管理訂單：</div>
      <div class="function__bar">
      <select name="orderOrderBy" id="orderOrderBy" class="selection" onchange="setOrderLocalStorage()">
      　<option value="orderTime" ${
        orderByRef === "orderTime" ? "SELECTED" : ""
      }>依訂單日期</option>
      　<option value="leastUpdateTime" ${
        orderByRef === "leastUpdateTime" ? "SELECTED" : ""
      }>依最後更新日期</option>
        <option value="customerName" ${
          orderByRef === "customerName" ? "SELECTED" : ""
        }>依收件人名稱</option>
      </select>
      <div class="function__bar__text">
          倒序：
          <input type="checkbox" id="orderOrder" name="orderOrder" ${
            orderRef === "true" ? "checked" : ""
          } onclick="setOrderLocalStorage()">
      </div>
        <div class="function__bar__btn" onclick="showAddOrderForm()">
          新增訂單
        </div>
      </div>
      `;
  $("#admin__monitor").append(titleString);
  db.collection("order")
    .orderBy(orderByRef, orderRef === "true" ? "desc" : "asc")
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
            }" onclick="${
            mode == 1
              ? "showEditOrderForm(" + ordersh.id + ")"
              : "showReadOrderInfo(" + ordersh.id + ")"
          }">${ordersh.id}　收件人：${orderInfo.customerName}　${
            orderInfo.isCancel === "true"
              ? "已取消"
              : orderInfo.isPaid === "true"
              ? orderInfo.isBook === "true"
                ? orderInfo.isShip === "true"
                  ? orderInfo.isFinish === "true"
                    ? "搞掂曬"
                    : "出咗貨"
                  : "待出貨"
                : "備緊貨"
              : "待收數"
          }</br>
          總入貨價(NTD)：${orderInfo.orderTotalPriceNTD}(HKD：${
            Math.round((orderInfo.orderTotalPriceNTD / twdToHKD) * 10) / 10
          })　總定價(HKD)：${orderInfo.orderTotalPriceHKD}　毛利(HKD)：${
            orderInfo.profitHKD
          }(${
            Math.round(
              ((orderInfo.orderTotalPriceHKD -
                Math.round((orderInfo.orderTotalPriceNTD / twdToHKD) * 10) /
                  10) /
                Math.round((orderInfo.orderTotalPriceNTD / twdToHKD) * 10) /
                10) *
                10000 *
                10
            ) / 10
          }%)
          </div>
          </div>
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
  var orderTotalPrice = 0;
  var orderInfo = "";
  var titleString = `
    <div class="admin__monitor__title">修改貨品${orderID}資料</div>
    <div class="function__bar">
      <div class="function__bar__btn" onclick="showOrderItem(0)">
        返回查看所有訂單
      </div>
      <div class="function__bar__btn" onclick="showEditOrderForm(${orderID})">
        修改訂單
      </div>
      <div class="function__bar__btn" onclick="window.open('orderTrack/index.html?orderID=${orderID}')">
        訂單查詢
      </div>
      <div class="function__bar__btn" onclick="window.open('printPage/index.html?orderID=${orderID}')">
        製作收據
      </div>
    </div>
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
          <div class="admin__monitor__item" style="display:flex;">
          收件人名稱：${orderInfo.customerName}
          <div class="function__bar">
            <div class="function__bar__btn" onclick="addressInfoCopyToClipboard()">
              複製收件人資料
            </div>
          </div>
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
          訂單是否已訂貨：${orderInfo.isBook === "true" ? "已訂貨" : "未訂貨"}
          </div>
          <div class="admin__monitor__item">
          訂單是否已出貨：${orderInfo.isShip === "true" ? "已出貨" : "未出貨"}
          </div>
          <div class="admin__monitor__item" style="display: flex;">
          順豐單號：${orderInfo.shipNumber}
          <div class="function__bar">
            <div class="function__bar__btn" onclick="window.open('https://www.sf-express.com/tw/tc/dynamic_function/waybill/#search/bill-number/${
              orderInfo.shipNumber
            }')">
              運單追蹤
            </div>
          </div>
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
        <div class="admin__monitor__item" id="orderTotalPriceNTD">入貨總價格(NTD)：${
          orderInfo.orderTotalPriceNTD
        }　(HKD：${
    Math.round((orderInfo.orderTotalPriceNTD / twdToHKD) * 10) / 10
  })
        </div>
        <div class="admin__monitor__item" id="orderTotalPriceHKD">定價總價格(HKD)：${
          orderInfo.orderTotalPriceHKD
        }
        </div>
        <div class="admin__monitor__item" id="profitHKD">毛利(HKD)：${
          orderInfo.profitHKD
        }(${
    Math.round(
      ((orderInfo.orderTotalPriceHKD -
        Math.round((orderInfo.orderTotalPriceNTD / twdToHKD) * 10) / 10) /
        Math.round((orderInfo.orderTotalPriceNTD / twdToHKD) * 10) /
        10) *
        10000 *
        10
    ) / 10
  }%)
        </div>
    </div>
  `;
  orderTotalPrice = orderInfo.orderTotalPriceHKD;
  $("#admin__monitor").append(titleString);
  var goodsCopyText = "";
  var goodsValueString = `
  <div class="admin__monitor__title">貨品清單</div>
  <div class="function__bar">
    <div class="function__bar__btn" onclick="copyToClipboard()">
      一鍵複製訂單訊息
    </div>
  </div>
  <table class="admin__monitor__goodsTable">
    <tr class="admin__monitor__goodsTable__titleTR">
      <th class="admin__monitor__goodsTable__titleTH">ID</th>
      <th class="admin__monitor__goodsTable__titleTH">貨品名稱</th>
      <th class="admin__monitor__goodsTable__titleTH">入貨單價</th>
      <th class="admin__monitor__goodsTable__titleTH">售價單價(HKD)</th>
      <th class="admin__monitor__goodsTable__titleTH">數量</th>
      <th class="admin__monitor__goodsTable__titleTH admin__monitor__goodsTable__titleTH-important">入貨總價</th>
      <th class="admin__monitor__goodsTable__titleTH admin__monitor__goodsTable__titleTH-important">售價總價(HKD)</th>
      <th class="admin__monitor__goodsTable__titleTH admin__monitor__goodsTable__titleTH-important">毛利</th>
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
              ${Math.round((goodsValue.price / twdToHKD) * 10) / 10}(HKD)
            </th>
            <th class="admin__monitor__goodsTable__itemTH">
              ${goodsValue.priceHKD}
            </th>
            <th class="admin__monitor__goodsTable__itemTH">${
              goodsValue.count
            }</th>
            <th class="admin__monitor__goodsTable__itemTH admin__monitor__goodsTable__itemTH-important totalPrice">${
              goodsValue.goodsTotalPrice
            }(TWD)
            </br>
            ${
              Math.round((goodsValue.goodsTotalPrice / twdToHKD) * 10) / 10
            }(HKD)
            </th>
            <th class="admin__monitor__goodsTable__itemTH admin__monitor__goodsTable__itemTH-important totalPriceHKD">${
              goodsValue.goodsTotalPriceHKD
            }</th>
            <th class="admin__monitor__goodsTable__itemTH admin__monitor__goodsTable__itemTH-important totalPriceHKD">${
              Math.round(
                (goodsValue.goodsTotalPriceHKD -
                  Math.round((goodsValue.goodsTotalPrice / twdToHKD) * 10) /
                    10) *
                  10
              ) / 10
            }
            </br>
            (${
              Math.round(
                ((goodsValue.goodsTotalPriceHKD -
                  Math.round((goodsValue.goodsTotalPrice / twdToHKD) * 10) /
                    10) /
                  Math.round((goodsValue.goodsTotalPrice / twdToHKD) * 10) /
                  10) *
                  10000 *
                  10
              ) / 10
            }%)
            </th>
          </tr>
          `;
          goodsCopyText += `${goodsValue.goodsName}　${goodsValue.count}件\n`;
        });
        goodsCopyText += `共HKD ${orderTotalPrice}（未包含順豐郵費）\n麻煩確認一下商品名稱、數量、係咪正確，總共金額有冇問題，之後話俾我知，唔該曬～`;
        //countAllTotalPrice(orderID);
        goodsValueString += `</table>
        <div class="admin__monitor__subtitle" style="margin:20px 0;">最後更新係於 ${orderInfo.leastUpdateTime}由${orderInfo.updateUser}</div>
        <textarea name="message" rows="10" cols="30" id="copyToClipboard">${goodsCopyText}</textarea>
        <textarea name="message" rows="10" cols="30" id="addressInfoCopyToClipboard">${orderInfo.customerName}，${orderInfo.phoneNumber}，${orderInfo.address}</textarea>
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
  var lastOrderID = getCurrentDateTime();
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
  this.isBook = "false";
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
        isBook: this.isBook,
        otherContacts: form.elements.otherContacts.value,
        contactsName:
          form.elements.contactsName.value != ""
            ? form.elements.contactsName.value
            : "none",
      })
      .then(function () {
        openAlertLayer("新增訂單成功");
        updateUpdateDateTime(orderID);
        showEditOrderForm(orderID);
        return;
      })
      .catch(function () {
        openAlertLayer(
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
    openAlertLayer("新增失敗！！！未有填寫全部資料");
  }
}

// edit order info

function showEditOrderForm(orderID) {
  $("#admin__monitor").empty();
  var orderTitleString = `
    <div class="admin__monitor__title">查看訂單${orderID}資料</div>
    <div class="function__bar">
      <div class="function__bar__btn" onclick="showReadOrderInfo(${orderID})">
        返回查看本訂單資料
      </div>
    </div>
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
            是否已訂貨：
          <input type="checkbox" id="isBook" name="isBook" ${
            orderInfo.isBook === "true" ? "checked" : ""
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
  var lastGoodsID = getCurrentDateTime();
  var titleString = `
    <div class="admin__monitor__block" style="background-color: #f3c6c686;">
      <div class="admin__monitor__title">全單總價格：</div>
        <div class="admin__monitor__item" id="orderTotalPriceNTD">入貨總價格(NTD)：
        </div>
        <div class="admin__monitor__item" id="orderTotalPriceHKD">定價總價格(HKD)：
        </div>
        <div class="admin__monitor__item" id="profitHKD">毛利(HKD)：
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
          }">入貨單價(HKD)：${
            Math.round((goodsValue.price / twdToHKD) * 10) / 10
          }
          </div>
          <div class="admin__monitor__item" style="display: flex;">售價單價(HKD)：
            <input
              type="number"
              name="priceHKD"
              id="priceHKD"
              class="priceHKD${ordersh.id}"
              value="${
                goodsValue.priceHKD
              }" oninput="updateTotalPrice(${orderID},${ordersh.id})" required
              />
            <div class="function__bar">
              <div id="TWDPriceAutoDiv${
                ordersh.id
              }" class="function__bar__btn" onclick="TWDPriceAutoDiv(${orderID},${
            ordersh.id
          })">自動除3</div>
            </div>
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
          <div class="admin__monitor__item totalPrice" id="totalPrice${
            ordersh.id
          }">入貨總值(NTD)：${goodsValue.goodsTotalPrice}
          </div>
          <div class="admin__monitor__item totalPriceHKD" id="totalPriceHKD${
            ordersh.id
          }">售價總值(HKD)：${goodsValue.goodsTotalPriceHKD}
          </div>
          <div class="admin__monitor__item profitHKD" id="profitHKD${
            ordersh.id
          }">毛利百份比：
          ${
            Math.round(
              ((goodsValue.goodsTotalPriceHKD -
                Math.round((goodsValue.goodsTotalPrice / twdToHKD) * 10) / 10) /
                Math.round((goodsValue.goodsTotalPrice / twdToHKD) * 10) /
                10) *
                10000 *
                10
            ) / 10
          }%
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
      <div class="admin__monitor__item" style="display: flex;">售價單價(HKD)：
      <input
        type="number"
        name="priceHKD"
        id="priceHKD"
        class="priceHKD${lastGoodsID}" oninput="updateTotalPrice(${orderID},${lastGoodsID})" required
        />
        <div class="function__bar">
              <div id="TWDPriceAutoDiv${lastGoodsID}" class="function__bar__btn" onclick="TWDPriceAutoDiv(${orderID},${lastGoodsID})">自動除3</div>
            </div>
      </div>
      <div class="admin__monitor__item">數量：
        <input
        type="number"
        name="count"
        id="count"
        class="count${lastGoodsID}" oninput="updateTotalPrice(${orderID},${lastGoodsID})" required
        />
      </div>
      <div class="admin__monitor__item totalPrice" id="totalPrice${lastGoodsID}">入貨總值(NTD)：0
      </div>
      <div class="admin__monitor__item totalPriceHKD" id="totalPriceHKD${lastGoodsID}">售價總值(HKD)：0
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
        openAlertLayer("刪除貨品成功");
        updateUpdateDateTime(orderID);
        showEditOrderForm(orderID);
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
        openAlertLayer("刪除訂單成功");
        $("#admin__monitor").empty();
        showOrderItem(0);
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
        $("#admin__monitor").empty();
      });
  }
}

async function countAllTotalPrice(orderID) {
  console.log("in countAllTotalPrice");
  var orderTotalPrice = 0;
  var orderTotalPriceHKD = 0;
  var profitHKD = 0;
  for (
    var i = 0;
    i < document.getElementsByClassName("totalPrice").length;
    i++
  ) {
    orderTotalPrice += Number(
      document.getElementsByClassName("totalPrice")[i].innerHTML.slice(10)
    );
    orderTotalPriceHKD += Number(
      document.getElementsByClassName("totalPriceHKD")[i].innerHTML.slice(10)
    );
  }

  document.getElementById("orderTotalPriceNTD").innerHTML =
    "入貨總價格(NTD)：" +
    orderTotalPrice +
    "　(HKD：" +
    Math.round((orderTotalPrice / twdToHKD) * 10) / 10 +
    ")";
  document.getElementById("orderTotalPriceHKD").innerHTML =
    "定價總價格(HKD)：" + orderTotalPriceHKD;
  profitHKD =
    Math.round((orderTotalPriceHKD - orderTotalPrice / twdToHKD) * 10) / 10;

  document.getElementById("profitHKD").innerHTML =
    "毛利(HKD)：" +
    profitHKD +
    "(" +
    Math.round(
      ((orderTotalPriceHKD -
        Math.round((orderTotalPrice / twdToHKD) * 10) / 10) /
        Math.round((orderTotalPrice / twdToHKD) * 10) /
        10) *
        10000 *
        10
    ) /
      10 +
    "%)";
}

function TWDPriceAutoDiv(orderID, goodsID) {
  goodsInpriceTWD = document.getElementsByClassName("price" + goodsID)[0].value;
  console.log(goodsInpriceTWD);
  document.getElementsByClassName("priceHKD" + goodsID)[0].value = Math.round(
    goodsInpriceTWD / 3
  );
  updateTotalPrice(orderID, goodsID);
}

function updateTotalPrice(orderID, goodsID) {
  var count = document.getElementsByClassName("count" + goodsID)[0].value;
  var goodsInTotalPriceTWD =
    document.getElementsByClassName("price" + goodsID)[0].value * count;
  document.getElementById("totalPrice" + goodsID).innerHTML =
    "入貨總值(NTD)：" + goodsInTotalPriceTWD;
  var goodsInPriceHKD =
    Math.round(
      (document.getElementsByClassName("price" + goodsID)[0].value / twdToHKD) *
        10
    ) / 10;
  document.getElementById("priceHKD" + goodsID).innerHTML =
    "入貨單價(HKD)：" + goodsInPriceHKD;
  var goodsTotalPriceHKD =
    document.getElementsByClassName("priceHKD" + goodsID)[0].value * count;

  document.getElementById("totalPriceHKD" + goodsID).innerHTML =
    "售價總值(HKD)：" + goodsTotalPriceHKD;

  document.getElementById("profitHKD" + goodsID).innerHTML =
    "毛利百份比：" +
    Math.round(
      ((document.getElementsByClassName("priceHKD" + goodsID)[0].value -
        Math.round(goodsInPriceHKD * 10) / 10) /
        Math.round(goodsInPriceHKD * 10) /
        10) *
        10000 *
        10
    ) /
      10 +
    "%";
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
        openAlertLayer("更新貨品資料成功");
        updateUpdateDateTime(orderID);
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
        $("#admin__monitor").empty();
      });
  } else {
    openAlertLayer("建立失敗！！！未有填寫全部資料");
  }
  //countAllTotalPrice(orderID);
  var orderTotalPrice = 0;
  var _orderTotalPriceHKD = 0;
  var _profitHKD = 0;
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
          _orderTotalPriceHKD += orderInfo.goodsTotalPriceHKD;
        });
      },
      (rej) => {
        console.log(rej);
      }
    );
  _profitHKD =
    Math.round((_orderTotalPriceHKD - orderTotalPrice / twdToHKD) * 10) / 10;
  await db
    .collection("order")
    .doc(orderID.toString())
    .update({
      orderTotalPriceNTD: orderTotalPrice,
      orderTotalPriceHKD: _orderTotalPriceHKD,
      profitHKD: _profitHKD,
    })
    .then(function () {
      return true;
    })
    .catch(function () {
      return false;
    });
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
  var isBook = form.elements.isBook.checked.toString();
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
        isBook: form.elements.isBook.checked.toString(),
        contactsName:
          form.elements.contactsName.value != ""
            ? form.elements.contactsName.value
            : "none",
        isCancel: form.elements.isCancel.value,
      })
      .then(function () {
        openAlertLayer("更新訂單成功");
        updateUpdateDateTime(orderID);
      })
      .catch(function () {
        openAlertLayer(
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
    openAlertLayer("建立失敗！！！未有填寫全部資料");
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

function getCurrentDateTime() {
  var currentdate = new Date();
  var currentDateTime =
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
  return currentDateTime;
}

function setOrderLocalStorage() {
  localStorage.setItem(
    "orderOrderBy",
    document.getElementById("orderOrderBy").value
  );
  localStorage.setItem(
    "orderOrder",
    document.getElementById("orderOrder").checked
  );
  showOrderItem(0);
}

function copyToClipboard() {
  var copyText = document.getElementById("copyToClipboard");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  console.log(copyText.value);
}

function addressInfoCopyToClipboard() {
  var copyText = document.getElementById("addressInfoCopyToClipboard");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  console.log(copyText.value);
}

$(document).ready(function () {
  console.log("check localstorage");
  if (localStorage.getItem("orderOrderBy") === null) {
    console.log("orderOrderBy null");
    localStorage.setItem("orderOrderBy", "orderTime");
  } else {
    console.log("orderOrderBy exist");
  }
  if (localStorage.getItem("orderOrder") === null) {
    console.log("orderOrder null");
    localStorage.setItem("orderOrder", true);
  } else {
    console.log("orderOrder exist");
  }
});
