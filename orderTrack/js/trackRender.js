function getURL() {
  var searchParams = new URLSearchParams(window.location.search);
  var orderID = searchParams.get("orderID");
  if (orderID != null && orderID != null) {
    renderPageMain(orderID);
  }
  console.log("URL" + orderID);
}

async function renderPageMain(orderID) {
  var orderData = JSON.parse(localStorage.getItem("orderData", orderData));
  if (
    localStorage.getItem("orderData", orderData) === null ||
    countDateTime(localStorage.getItem("lastUpdataTime")) > 30 * 60 ||
    orderID != orderData.orderID
  ) {
    console.log("updateData");
    await fetch(
      `https://us-central1-onlineshop-76640.cloudfunctions.net/randomNumber?orderID=${orderID}`
    )
      .then(async function (response) {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        await response.json().then(function (data) {
          orderData = data;
          localStorage.setItem("orderData", JSON.stringify(orderData));
          localStorage.setItem("lastUpdataTime", getCurrentDateTime());
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  } else {
    //orderData = JSON.parse(localStorage.getItem("orderData", orderData));
  }
  //console.log(orderData);
  $("#admin__monitor").empty();
  var orderTitleString = `
  <div class="admin__monitor__title">以下為閣下之訂單資料</div>
  <div class="admin__monitor__subtitle" style="padding-bottom: 0px;">更新時間：${getWordDateTime()}</div>
  <div class="admin__monitor__goods">
      <div class="admin__monitor__title">訂單狀態</div>
      <div class="admin__monitor__item">
      訂單現況：${
        orderData.isCancel === "true"
          ? "訂單已取消"
          : orderData.isPaid === "true"
          ? orderData.isBook === "true"
            ? orderData.isShip === "true"
              ? orderData.isFinish === "true"
                ? "訂單完成，希望您滿意我哋既服務，歡迎下次再搵我哋！"
                : "已出貨，請時刻留意寄運公司，追蹤貨物既去向，準備收取您期待已久嘅台灣風味！"
              : "待出貨，我哋既駐台北店主正聯絡寄運公司，送出您嘅貨品～"
            : "備貨中，我哋既駐台北店主正為您備貨～"
          : "待付款，我哋會在收到付款後為您備貨～"
      }
      </div>
      <div class="admin__monitor__item" style="display: flex;">
      順豐單號：${
        orderData.isShip === "true"
          ? orderData.shipNumber +
            `<div class="function__bar">
        <div class="function__bar__btn" onclick="window.open('https://www.sf-express.com/tw/tc/dynamic_function/waybill/#search/bill-number/` +
            orderData.shipNumber +
            `')">
        順豐運單追蹤
        </div>
      </div>`
          : "貨件尚未出貨"
      }
      </div>
    </div>
    <div class="admin__monitor__block">
        <div class="admin__monitor__title">客戶資料</div>
        <div class="admin__monitor__item">
        訂單編號：${orderID}
        </div>
        <div class="admin__monitor__item">
        訂單日期：${orderData.orderTime}
        </div>
        <div class="admin__monitor__item">
        收件人名稱：${orderData.customerName}
        </div>
        <div class="admin__monitor__item">
        收件人電話：${orderData.phoneNumber}
        </div>
        <div class="admin__monitor__item">
        收件人地址：${orderData.address}
        </div>
    </div>`;
  $("#admin__monitor").append(orderTitleString);
}

function checkIsNewPage(savedOrderID) {}

function getWordDateTime() {
  currentdate = localStorage.getItem("lastUpdataTime");
  wordDate = currentdate.substring(0, 4) + "/";
  wordDate += currentdate.substring(4, 6) + "/";
  wordDate += currentdate.substring(6, 8) + " ";
  wordDate += currentdate.substring(8, 10) + ":";
  wordDate += currentdate.substring(10, 12) + ":";
  wordDate += currentdate.substring(12, 14);
  return wordDate;
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
function countDateTime(dataTime) {
  var ans = getCurrentDateTime() - dataTime;
  console.log(ans);
  return ans;
}
getURL();
function setOrderLocalStorage(orderData) {
  localStorage.setItem("orderData", orderData);
}
