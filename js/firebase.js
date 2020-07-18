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
        value="送出"
        onclick="newItemOrder(${orderID});"
            />
      </form>
        `;
      $("#admin__monitor").append(orderTitleString);
      // res.forEach((orderSh, orderIndex) => {
      //   var orderInfo = orderSh.val();
      //   console.log(orderInfo);
      //   var orderTitleString = `
      //   <div class="admin__monitor__item">${orderInfo}</div>
      //   `;
      //   $("#admin__monitor").append(orderTitleString);
      // });
    },
    (rej) => {
      console.log(rej);
    }
  );
  var divContent = `<div class="admin__monitor__title">
  你可查看及修改以下訂單資料：
</div>
<div class="admin__monitor__subtitle">
  請填寫以下表格（全部值必須填寫）
</div>
<form name="form" id="form">
  <div class="admin__monitor__item">
    住址（中文）：
    <input
      type="text"
      name="adress_chi"
      id="adress_chi"
      value="${district_chi}Buddy路1號" required
    />
  </div>
  <div class="admin__monitor__item">
    住址（英文）：
    <input type="text" name="adress_eng" id="adress_eng" value="1-Buddy Road, ${district_eng}" required />
  </div>
  <div class="admin__monitor__item">
    住址（日文）：
    <input
      type="text"
      name="adress_jp"
      id="adress_jp"
      value="${district_jp}Buddy路-1" required
    />
  </div>
  <div class="admin__monitor__item">
    住址所在之地區（中文）：
    <input
      type="text"
      name="district_chi"
      id="district_chi"
      value="${district_chi}" required
    />
  </div>
  <div class="admin__monitor__item">
    住址所在之地區（英文）：
    <input
      type="text"
      name="district_eng"
      id="district_eng"
      value="${district_eng}" required
    />
  </div>
  <div class="admin__monitor__item">
    住址所在之地區（日文）：
    <input type="text" name="district_jp" id="district_jp" value="${district_jp}" required />
  </div>
  <div class="admin__monitor__item">
    建築物名稱（中文）：
    <input
      type="text"
      name="name_chi"
      id="name_chi"
      value="新建築" required
    />
  </div>
  <div class="admin__monitor__item">
    建築物名稱（英文）：
    <input
      type="text"
      name="name_eng"
      id="name_eng"
      value="New Building" required
    />
  </div>
  <div class="admin__monitor__item">
    建築物名稱（日文）：
    <input
      type="text"
      name="name_jp"
      id="name_jp"
      value="新しビール" required
    />
  </div>
  <div class="admin__monitor__item">
    所在地圖之X座標：
    <input type="text" name="x" id="x" value="365" required />
  </div>
  <div class="admin__monitor__item">
    所在地圖之Y座標：
    <input type="text" name="y" id="y" value="453" required />
  </div>
  <div class="admin__monitor__item">
    所在地圖之Z座標：
    <input type="text" name="z" id="z" value="70" required />
  </div>
  <div class="admin__monitor__item">
    內裝（中文）：
    <input
      type="text"
      name="內裝"
      id="內裝"
      value="有" required
    />
  </div>
  <div class="admin__monitor__item">
    內裝 （英文）：
    <input
      type="text"
      name="inside"
      id="inside"
      value="Yes" required
    />
  </div>
  <div class="admin__monitor__item">
    內裝（日文）：
    <input
      type="text"
      name="インテリア"
      id="インテリア"
      value="あり" required
    />
  </div>
  <div class="admin__monitor__item">
    用途（中文）：
    <input
      type="text"
      name="用途"
      id="用途"
      value="古蹟" required
    />
  </div>
  <div class="admin__monitor__item">
    用途（英文）：
    <input
      type="text"
      name="Utilization"
      id="Utilization"
      value="Monument" required
    />
  </div>
  <div class="admin__monitor__item">
    用途（日文）
    <input
      type="text"
      name="用途_jp"
      id="用途_jp"
      value="遺跡" required
    />
  </div>
  <input
    type="button"
    name="submit"
    value="送出"
    onclick="newItemBuilding('${districtId}');"
  />
</form>`;
  $("#admin__monitor").append(divContent);
}
