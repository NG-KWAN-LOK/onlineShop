var totalPrice = 0;
function setLocalStorage() {
  var receiverInfo = JSON.parse(
    localStorage.getItem("receiverInfo", receiverInfo)
  );
  if (receiverInfo == null) {
    receiverInfo = {
      customerName: "",
      phoneNumber: "",
      address: "",
    };
    localStorage.setItem("receiverInfo", JSON.stringify(receiverInfo));
  }
}
function getURL() {
  var searchParams = new URLSearchParams(window.location.search);
  var orderID = searchParams.get("orderID");
  if (orderID != null && orderID != null) {
    setLocalStorage();
    getGoodData(orderID);
  }
  console.log("URL" + orderID);
}

var goodData = "";

async function getGoodData(orderID) {
  await fetch(
    `https://us-central1-onlineshop-76640.cloudfunctions.net/orderGoodList?orderID=${orderID}`
  )
    .then(async function (response) {
      if (response.status !== 200) {
        $("#admin__monitor").empty();
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        goodData = "null";
        return;
      } else {
        console.log("data got");
      }
      await response.json().then(function (data) {
        goodData = data;
      });
    })
    .catch(function (err) {
      goodData = "error";
      console.log("Fetch Error :-S", err);
    });
  showGoodList(orderID);
}

async function showGoodList(orderID) {
  totalPrice = 0;
  //console.log(goodData);
  if (goodData != "false" && goodData != "null" && goodData != "error") {
    $("#admin__monitor").empty();
    var goodsValueString = `
  <div class="admin__monitor__title">確認商品清單　1/4</div>
  <div class="admin__monitor__item" style="font-weight: 400;">麻煩確認商品名稱及數量是否正確，然後核對總計。如一切正確，可按下一步繼續；若有錯漏，請即與我們聯絡，謝謝。</div>
  <table class="admin__monitor__goodsTable">
    <tr class="admin__monitor__goodsTable__titleTR">
      <th class="admin__monitor__goodsTable__titleTH">ID</th>
      <th class="admin__monitor__goodsTable__titleTH">貨品名稱</th>
      <th class="admin__monitor__goodsTable__titleTH">數量</th>
      <th class="admin__monitor__goodsTable__titleTH">單價(HKD)</th>
      <th class="admin__monitor__goodsTable__titleTH">總價(HKD)</th>
    </tr>
  `;
    var id = 1;
    goodData.forEach(function (orderSh) {
      //console.log(orderSh);
      goodsValueString += `
        <tr class="admin__monitor__goodsTable__itemTR">
            <th class="admin__monitor__goodsTable__itemTH">${id}</th>
            <th class="admin__monitor__goodsTable__itemTH">${orderSh.goodsName}</th>
            <th class="admin__monitor__goodsTable__itemTH">${orderSh.count}</th>
            <th class="admin__monitor__goodsTable__itemTH">${orderSh.priceHKD}</th>
            <th class="admin__monitor__goodsTable__itemTH">${orderSh.goodsTotalPriceHKD}</th>
        </tr>`;
      totalPrice += orderSh.goodsTotalPriceHKD;
      id += 1;
    });
    goodsValueString += `
  <tr class="admin__monitor__goodsTable__itemTR">
    <th class="admin__monitor__goodsTable__itemTH" colspan = "3" style="border-bottom: none;"></th>
    <th class="admin__monitor__goodsTable__itemTH admin__monitor__goodsTable__itemTH-important">總計：</th>
    <th class="admin__monitor__goodsTable__itemTH admin__monitor__goodsTable__itemTH-important">${totalPrice}</th>
  </tr>
  </table>
  <div class="admin__monitor__item" style="font-weight: 400;">未包含順豐郵費，順豐郵費為到付。</div>
    <div class="function__bar">
        <div class="function__bar__btn" onclick="EditInfo(${orderID})">
            下一步
        </div>
    </div>`;
    $("#admin__monitor").append(goodsValueString);
  } else if (goodData == "false") {
    $("#admin__monitor").empty();
    var goodsValueString = `
    <div class="admin__monitor__title">此訂單不提供此服務！</div>
`;
    $("#admin__monitor").append(goodsValueString);
    window.location.assign("../orderTrack/index.html?orderID=" + orderID);
  } else if (goodData == "error") {
    $("#admin__monitor").empty();
    var goodsValueString = `
    <div class="admin__monitor__title">網絡錯誤，請刷新網頁</div>
`;
    $("#admin__monitor").append(goodsValueString);
  } else {
    $("#admin__monitor").empty();
    var goodsValueString = `
    <div class="admin__monitor__title">404錯誤，訂單資料錯誤！</div>
`;
    $("#admin__monitor").append(goodsValueString);
  }
}
getURL();

function EditInfo(orderID) {
  $("#admin__monitor").empty();
  var receiverInfo = JSON.parse(
    localStorage.getItem("receiverInfo", receiverInfo)
  );
  //console.log(receiverInfo);
  var goodsValueString = `
    <div class="admin__monitor__title">輸入收件人資料　2/4</div>
    <div class="admin__monitor__item" style="font-weight: 400;">請輸入收件人資料，然後按下一步。<br>請小心填寫資料。一切因資料錯誤而以引致的運送問題，客人需自行承擔責任，本店恕不負責。</div>
    `;
  goodsValueString += `
    <form name="form" id="form">
        <div class="admin__monitor__item">
        收件人姓名：
        <input
            type="text"
            name="customerName"
            id="customerName"
            value = "${receiverInfo.customerName}"
            required
        />
        </div>
        <div class="admin__monitor__item">
        收件人手機電話：
        <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            value = "${receiverInfo.phoneNumber}"
            required
        />
        </div>
        <div class="admin__monitor__item">
        收件人中文收貨地址：<br>（使用順豐智能櫃或便利店取件需同時提供其代碼及詳細地址) <br>
        <input
            type="text"
            name="address"
            id="address"
            value = "${receiverInfo.address}"
            required
        />
        </div>
    `;

  goodsValueString += `
    <div class="function__bar">
    <div class="function__bar__btn" onclick="showGoodList(${orderID})">
            上一步
        </div>
        <div class="function__bar__btn" name="submit" onclick="confirmInfo(${orderID})">
            下一步
        </div>
    </div>
    </form>
    `;
  $("#admin__monitor").append(goodsValueString);
}
var customerName = "";
var phoneNumber = "";
var address = "";
function confirmInfo(orderID) {
  const form = document.forms["form"];
  customerName = form.elements.customerName.value;
  phoneNumber = form.elements.phoneNumber.value;
  address = form.elements.address.value;
  if (customerName != "" && phoneNumber != "" && address != "") {
    phoneno = /^\d{8}$/;
    if (phoneNumber.match(phoneno)) {
      $("#admin__monitor").empty();
      var goodsValueString = `
        <div class="admin__monitor__title">確認收件人資料　2/4</div>
        <div class="admin__monitor__item" style="font-weight: 400;">請再次確認運送資料，若無需更改可前往下一步。如有需要，可按重新輸入鍵更改資料。<br>免責聲明：一切因資料錯誤而以引致的運送問題，客人需自行承擔責任，本店恕不負責。</div>
        `;
      goodsValueString += `
        <div class="admin__monitor__item" style="border-bottom: none;">收件人姓氏：${customerName}</div>
        <div class="admin__monitor__item" style="border-bottom: none;">收件人手機電話：${phoneNumber}</div>
        <div class="admin__monitor__item" style="border-bottom: none;">收件人中文收貨地址：${address}</div>
        `;
      goodsValueString += `
    <div class="function__bar">
    <div class="function__bar__btn" onclick="EditInfo(${orderID})">
            重新輸入
        </div>
        <div class="function__bar__btn" name="submit" onclick="setInfo(${orderID})">
            下一步
        </div>
    </div>
    </form>
    `;
      $("#admin__monitor").append(goodsValueString);
    } else {
      openAlertLayer("錯誤！請輸入香港8位手機電話號碼！！！");
    }
  } else {
    openAlertLayer("錯誤！新增失敗未有填寫全部資料！！！");
  }
  receiverInfo = {
    customerName: customerName,
    phoneNumber: phoneNumber,
    address: address,
  };
  localStorage.setItem("receiverInfo", JSON.stringify(receiverInfo));
}

async function setInfo(orderID) {
  openAlertLayer("請稍等");
  await fetch(
    `https://us-central1-onlineshop-76640.cloudfunctions.net/setCustomerInfo?orderID=${orderID}&customerName=${customerName}&phoneNumber=${phoneNumber}&address=${address}&datetime=${getDateTime()}`
  )
    .then(async function (response) {
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        openAlertLayer("網絡錯誤！請重試！！！");
        return;
      } else {
        //finishProcess(orderID);
        closeAlertLayer();
        showPayment(orderID);
      }
      await response.json().then(function (data) {
        goodData = data;
      });
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });
  receiverInfo = {
    customerName: customerName,
    phoneNumber: phoneNumber,
    address: address,
  };
  localStorage.setItem("receiverInfo", JSON.stringify(receiverInfo));
  //console.log(receiverInfo);
}

function showPayment(orderID) {
  $("#admin__monitor").empty();
  var goodsValueString = `
  <div class="admin__monitor__title">付款　3/4</div>
  <div class="admin__monitor__item" style="font-weight: 400;">請根據下方顯示的應付金額，選用其中一種付款方式，完成付款，最後按完成鍵結束是次下單程序。<br>温馨提示：完成付款後，請記得截圖或拍照傳送給我們作記錄。</div>
  <div class="admin__monitor__item" style="font-size: 22px; padding-top: 36px; font-weight: 400; color: #f00;">應付金額：HKD$${totalPrice}</div>
  <div class="admin__monitor__title">Payme</div>
  <div class="admin__monitor__item" style="border-bottom: none;"><img style="width: 100%; max-width: 400px" src="../image/payme.jpg"></div>
  <div class="admin__monitor__title">FPS轉數快</div>
  <div class="admin__monitor__item" style="border-bottom: none;">YU S** Y**<br>識別碼：166312983</div>
  <div class="admin__monitor__title">Heng Seng Bank</div>
  <div class="admin__monitor__item" style="border-bottom: none;">YU S** Y**<br>288-594476-882</div>
  `;
  goodsValueString += `
    <div class="function__bar">
    <div class="function__bar__btn" onclick="EditInfo(${orderID})">
            上一步
        </div>
        <div class="function__bar__btn" onclick="finishProcess(${orderID})">
            完成
        </div>
    </div>
    `;
  $("#admin__monitor").append(goodsValueString);
}

function finishProcess(orderID) {
  $("#admin__monitor").empty();
  var goodsValueString = `
  <div class="admin__monitor__title">完成　4/4</div>
  <div class="admin__monitor__item" style="font-weight: 400;">恭喜您已完成資料輸入！</div>
  <div class="admin__monitor__item" style="font-size: 22px; padding-top: 36px; font-weight: 400; color: #f00;">請把入帳記錄截圖或拍照傳送給我們，謝謝！（Facebook/ Instagram: Taiwan.mart ）</div>
  <div class="admin__monitor__item" style="font-size: 20px; padding-top: 20px; border-bottom: 0px;">再次感謝閣下的選用本店的服務，希望在不久的將來能再次為你服務:)</div>
  <div class="admin__monitor__title" style="font-weight: 400;">您可以按以下「訂單追蹤頁面」，追蹤您的訂單情況及資料。</div>
  `;
  goodsValueString += `
    <div class="function__bar">
        <div class="function__bar__btn" onclick="window.location.assign('../orderTrack/index.html?orderID=${orderID}')">
        訂單追蹤頁面
        </div>
    </div>
    `;
  $("#admin__monitor").append(goodsValueString);
}
function getDateTime() {
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
  return datetime;
}
