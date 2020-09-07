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
  <div class="admin__monitor__item" style="font-weight: 400;">麻煩確認一下商品名稱、數量、係咪正確，總共金額有冇問題，如果冇問題，請按下一步繼續！</div>
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
    <div class="admin__monitor__item" style="font-weight: 400;">請輸入收件人資料，然後按下一步。<br>請小心填寫資料。如資料有誤，以致貨件無法送到閣下手上，請自行承擔。</div>
    `;
  goodsValueString += `
    <form name="form" id="form">
        <div class="admin__monitor__item">
        收件人姓氏：
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
        收件人中文收貨地址：
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
        <div class="admin__monitor__item" style="font-weight: 400;">請小心確認資料。如資料有誤，請按重新輸入，如無誤請按下一步<br>如資料有誤，以致貨件無法送到閣下手上，請自行承擔。</div>
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
        <div class="function__bar__btn" name="submit" onclick="showPayment(${orderID})">
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
        finishProcess(orderID);
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
  <div class="admin__monitor__item" style="font-weight: 400;">請根據訂單既總金額，使用以下付款方式，完成付款，最後按完成！</div>
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
        <div class="function__bar__btn" onclick="window.location.assign('../orderTrack/index.html?orderID=${orderID}')">
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
  <div class="admin__monitor__item" style="font-size: 22px; padding-top: 36px; font-weight: 400; color: #f00;"">請將入帳收據或頁面Cap圖或影相inbox到我哋既IG或FB，謝謝！</div>
  <div class="admin__monitor__title" style="font-weight: 400;">您可以按以下「訂單追蹤頁面」，追蹤您的訂單情況及資料。</div>
  `;
  goodsValueString += `
    <div class="function__bar">
        <div class="function__bar__btn" onclick="setInfo(${orderID})">
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
