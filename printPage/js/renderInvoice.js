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

function getURL() {
  var searchParams = new URLSearchParams(window.location.search);
  var orderID = searchParams.get("orderID");
  if (orderID != null && orderID != null) {
    renderPageMain(orderID);
  }
  console.log("URL" + orderID);
}

async function renderPageMain(orderID) {
  var contentString = `<div class="printPage__page" id="printPage__page">`;
  var orderTotalPrice = 0;
  contentString += renderHeader();
  await db
    .collection("order")
    .doc(orderID)
    .get()
    .then(function (ordersh) {
      orderInfo = ordersh.data();
      console.log(orderInfo);
      contentString += `
          <div class="printPage__page__content__basicInfo">
              <div class="printPage__page__content__basicInfo__customerInfo">
                  <table class="customerInfo__table">
                  <tr class="customerInfo__table__tr">
                      <td class="customerInfo__table__th-title" colspan="2">
                      顧客資料
                      </th>
                  </tr>
                  <tr class="customerInfo__table__tr">
                      <th class="customerInfo__table__th">收件人名稱</th>
                      <th class="customerInfo__table__th-content">${nameStar(
                        orderInfo.customerName
                      )}</th>
                  </tr>
                  <tr class="customerInfo__table__tr">
                      <th class="customerInfo__table__th">收件人電話</th>
                      <th class="customerInfo__table__th-content">${orderInfo.phoneNumber.substring(
                        0,
                        3
                      )}${stringStar(orderInfo.phoneNumber.length, 3)}</th>
                  </tr>
                  <tr class="customerInfo__table__tr">
                      <th class="customerInfo__table__th">收件地址</th>
                      <th class="customerInfo__table__th-content">
                      ${orderInfo.address.substring(0, 6)}${stringStar(
        orderInfo.address.length,
        6
      )}
                      </th>
                  </tr>
                  <tr></tr>
                  </table>
              </div>
              <div class="printPage__page__content__basicInfo__orderInfo">
                  <table class="orderInfo__table">
                  <tr class="orderInfo__table__tr">
                      <th class="orderInfo__table__th">訂單日期</th>
                      <th class="orderInfo__table__th-content">${
                        orderInfo.orderTime
                      }</th>
                  </tr>
                  <tr class="orderInfo__table__tr">
                      <th class="orderInfo__table__th">印單日期</th>
                      <th class="orderInfo__table__th-content">${getCurrentDateTime()}</th>
                  </tr>
                  <tr class="orderInfo__table__tr">
                      <th class="orderInfo__table__th">訂單編號</th>
                      <th class="orderInfo__table__th-content">${
                        ordersh.id
                      }</th>
                  </tr>
                  <tr></tr>
                  </table>
              </div>
          </div>
          `;
      orderTotalPrice = orderInfo.orderTotalPriceHKD;
      return true;
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
  contentString += `<div
    class="printPage__page__content"
    id="printPage__page__content"
  >
        <table class="printPage__page__content__orderTabel">
          <tr class="printPage__page__content__orderTabel__titleTR">
            <th class="printPage__page__content__orderTabel__titleTH">編號</th>
            <th class="printPage__page__content__orderTabel__titleTH-name">商品名稱</th>
            <th class="printPage__page__content__orderTabel__titleTH-count">數量</th>
            <th class="printPage__page__content__orderTabel__titleTH-price">單價(HKD)</th>
            <th class="printPage__page__content__orderTabel__titleTH-price">總價(HKD)</th>
          </tr>
    `;
  var goodCount = 0;
  await db
    .collection("order")
    .doc(orderID)
    .collection("goods")
    .get()
    .then(
      function (querySnapshot) {
        querySnapshot.forEach(function (orderSh) {
          var goodsValue = orderSh.data();
          goodCount += 1;
          console.log(goodsValue);
          contentString += `
            <tr class="printPage__page__content__orderTabel__TR${
              goodCount % 2 == 0 ? "" : "-gray"
            }">
                <th class="printPage__page__content__orderTabel__TH">${goodCount}</th>
                <th class="printPage__page__content__orderTabel__TH">${
                  goodsValue.goodsName
                }</th>
                <th class="printPage__page__content__orderTabel__TH-count">${
                  goodsValue.count
                }</th>
                <th class="printPage__page__content__orderTabel__TH">${
                  goodsValue.priceHKD
                }</th>
                <th class="printPage__page__content__orderTabel__TH">${
                  goodsValue.goodsTotalPriceHKD
                }</th>
            </tr>
        `;
        });
      },
      (rej) => {
        console.log(rej);
      }
    );
  contentString += `
    <tr class="printPage__page__content__orderTabel__TR${
      (goodCount + 1) % 2 == 0 ? "" : "-gray"
    }">
        <th class="printPage__page__content__orderTabel__TH"colspan="5">--止--</th>
    </tr>
    <tr class="printPage__page__content__orderTabel__FooterTR">
    <th class="printPage__page__content__orderTabel__FooterTH" colspan="3"></th>
        <th class="printPage__page__content__orderTabel__FooterTH-totalPrice">總計</th>
        <th class="printPage__page__content__orderTabel__FooterTH-totalPrice">HK$ ${orderTotalPrice}</th>
    </tr>
    <tr class="printPage__page__content__orderTabel__EndTR">
          <th class="printPage__page__content__orderTabel__EndTH"colspan="5">--以下為空--</th>
      </tr>
  </table>
  </div>`;
  contentString += renderFooter();
  contentString += `</div>`;
  $("#printPage").append(contentString);
}
function renderHeader() {
  var contentString = `<div class="printPage__page__header" id="printPage__page__header">
  <div class="printPage__page__header__logo">
    <img src="../image/orderLogo.jpg" width="200" />
  </div>
  <div class="printPage__page__header__title">INVOICE</div>
</div>`;
  return contentString;
}
function renderFooter() {
  var contentString = `<div class="printPage__page__footer" id="printPage__page__footer">
  <div class="printPage__page__footer__note">
      <div class="printPage__page__footer__note-title">備註：</div><div class="printPage__page__footer__note-content">1. 貨物出門，恕不退換。 2. 商品送出前已經檢查和妥善包裝，如遇缺漏、損毀，請聯絡我們。 3. 如商品因運送而導致損毀等問題，我們將不會退換，有關商品運送風險詳情可聯絡香港順豐快遞。</div>
      </div>
      <div class="printPage__page__footer__socialMedia">
        <img src="../image/ig.png" width="25">　Instagram &　
        <img src="../image/fb.png" width="25">　Facebook：Taiwan.Mart
      </div>
      <div class="printPage__page__footer__endding">
        <div class="printPage__page__footer__endding-text">Thank you for your support!<br>Please come again :)</div>
      </div>
  </div>
</div>`;
  return contentString;
}
function stringStar(length, minus) {
  var stringStar = "";
  stringStar += "＊".repeat(length - minus);
  return stringStar;
}

function nameStar(name) {
  var checkEnglish = /^[A-Za-z0-9]*$/;
  if (checkEnglish.test(name.charAt(0))) {
    console.log("eng");
    var englishName = name.split(" ");
    console.log(englishName.length);
    var displayName = englishName[0] + " ";
    for (var i = 1; i < englishName.length; i++) {
      displayName += englishName[i][0];
      displayName += "*".repeat(englishName[i].length - 1);
      displayName += " ";
    }
    return displayName;
  } else {
    console.log("chi");
    var displayName = name.charAt(0);
    displayName += "＊".repeat(name.length - 1);
    return displayName;
  }
}

function getCurrentDateTime() {
  var currentdate = new Date();
  var currentDateTime =
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
  return currentDateTime;
}

getURL();
