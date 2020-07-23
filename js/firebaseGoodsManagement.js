function showGoodsListItem() {
  $("#admin__monitor").empty();
  var orderByRef = localStorage.getItem("goodsListOrderBy");
  var orderRef = localStorage.getItem("goodsListOrder");
  var goodCount = 0;
  console.log(orderRef);
  var titleString = `
      <div class="admin__monitor__title">查看及管理貨品目錄</div>
        <div class="function__bar">
        <select name="goodsListOrderBy" id="goodsListOrderBy" class="selection" onchange="setGoodsLocalStorage()">
        　<option value="category" ${
          orderByRef === "category" ? "SELECTED" : ""
        }>依類別</option>
        　<option value="name" ${
          orderByRef === "name" ? "SELECTED" : ""
        }>依名稱</option>
          <option value="leastUpdateTime" ${
            orderByRef === "leastUpdateTime" ? "SELECTED" : ""
          }>依最後更新日期</option>
        </select>
        <div class="function__bar__text">
            倒序：
            <input type="checkbox" id="goodsListOrder" name="goodsListOrder" ${
              orderRef === "true" ? "checked" : ""
            } onclick="setGoodsLocalStorage()">
        </div>
        <div class="function__bar__btn" onclick="showAddGoodsListForm()">
          新增貨品
        </div>
      </div>
    `;
  $("#admin__monitor").append(titleString);
  db.collection("goods")
    .orderBy(orderByRef, orderRef === "true" ? "desc" : "asc")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (goodsh) {
        var goodInfo = goodsh.data();
        var orderTitleString = `
            <div class="admin__monitor__chooseItem ${
              goodCount % 2 == 0
                ? "admin__monitor__chooseItem-yellow"
                : "admin__monitor__chooseItem-lightYellow"
            }" onclick="showEditGoodsListForm(${goodsh.id})"><p>${goodsh.id}　${
          goodInfo.category === "0"
            ? goodInfo.category === "1"
              ? goodInfo.category === "2"
                ? "出售過之代購商品"
                : "Po文特別商品"
              : "Po文普通商品"
            : ""
        }　<span class="spanText">名稱：${goodInfo.name}</span></p><p>
          入貨價(NTD)：${goodInfo.inPriceNTD}(HKD：${
          Math.round((goodInfo.inPriceNTD / twdToHKD) * 10) / 10
        })　定價(HKD)：${goodInfo.priceHKD}　毛利(HKD)：${
          Math.round(
            (goodInfo.priceHKD -
              Math.round((goodInfo.inPriceNTD / twdToHKD) * 10) / 10) *
              10
          ) / 10
        }(${
          Math.round(
            ((goodInfo.priceHKD -
              Math.round((goodInfo.inPriceNTD / twdToHKD) * 10) / 10) /
              Math.round((goodInfo.inPriceNTD / twdToHKD) * 10) /
              10) *
              10000 *
              10
          ) / 10
        }%)</p>
          </div>
            `;
        goodCount += 1;
        $("#admin__monitor").append(orderTitleString);
      });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
}
function showGoodsListItemByOrder(sortName) {}

async function showReadgoodInfo(goodsID) {
  $("#admin__monitor").empty();
  var goodsInfo = "";
  var titleString = `
    <div class="admin__monitor__title">查看貨品${goodsID}資料</div>
      <div class="function__bar">
        <div class="function__bar__btn" onclick="showGoodsListItem()">
          返回查看所有貨品
        </div>
        <div class="function__bar__btn" onclick="showEditGoodsListForm(${goodsID})">
          修改資料
        </div>
      </div>
      `;
  $("#admin__monitor").append(titleString);
  await db
    .collection("goods")
    .doc(goodsID.toString())
    .get()
    .then(function (goodssh) {
      goodsInfo = goodssh.data();
      titleString = `
        <div class="admin__monitor__block">
            <div class="admin__monitor__title">貨品資料</div>
            <div class="admin__monitor__item">
            貨品編號：${goodssh.id}
            </div>
            <div class="admin__monitor__item">
            貨品類別：${
              goodsInfo.category === "0"
                ? goodsInfo.category === "1"
                  ? goodsInfo.category === "2"
                    ? "出售過之代購商品"
                    : "Po文特別商品"
                  : "Po文普通商品"
                : ""
            }
            </div>
            <div class="admin__monitor__item">
            貨品名稱：${goodsInfo.name}
            </div>
            <div class="admin__monitor__item">
            貨品網址：${goodsInfo.website}
            </div>
            <div class="admin__monitor__item">
            貨品所在FB：${goodsInfo.urlOnFacebook}
            </div>
            <div class="admin__monitor__item">
            貨品所在IG：${goodsInfo.urlOnIG}
            </div>
        </div>`;
      $("#admin__monitor").append(titleString);
      var titleString = `
        <div class="admin__monitor__goods">
            <div class="admin__monitor__title">
                貨品價格：
            </div>
            <div class="admin__monitor__item" id="inPriceNTD">
                入貨單價(NTD)：${goodsInfo.inPriceNTD}
            </div>
            <div class="admin__monitor__item" id="inPriceHKD">
                入貨單價(HKD)：${
                  Math.round((goodsInfo.inPriceNTD / twdToHKD) * 10) / 10
                }
            </div>
            <div class="admin__monitor__item" id="priceHKD">
                售價(HKD)：${goodsInfo.priceHKD}
            </div>
            <div class="admin__monitor__item" id="profitHKD">
                毛利(HKD)：${
                  Math.round(
                    (goodsInfo.priceHKD -
                      Math.round((goodsInfo.inPriceNTD / twdToHKD) * 10) / 10) *
                      10
                  ) / 10
                }(${
        Math.round(
          ((goodsInfo.priceHKD -
            Math.round((goodsInfo.inPriceNTD / twdToHKD) * 10) / 10) /
            Math.round((goodsInfo.inPriceNTD / twdToHKD) * 10) /
            10) *
            10000 *
            10
        ) / 10
      }%)
            </div>
        </div>
        <div class="admin__monitor__subtitle" style="margin:20px 0;">最後更新係於 ${
          goodsInfo.leastUpdateTime
        }由${goodsInfo.updateUser}</div>
        `;
      $("#admin__monitor").append(titleString);
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
}
async function showAddGoodsListForm() {
  $("#admin__monitor").empty();
  var lastGoodsID = getCurrentDateTime();
  console.log(lastGoodsID);
  var titleString = `
    <div class="admin__monitor__title">新增貨品編號為${lastGoodsID}之貨品資料</div>
    `;
  $("#admin__monitor").append(titleString);
  var orderTitleString = `
        <div class="admin__monitor__item">
        貨品編號：${lastGoodsID}
        </div>
        <form name="form${lastGoodsID}" id="form${lastGoodsID}">
        <div class="admin__monitor__item">
        貨品類別：
        <select name="category" id="category" class="selection">
        　<option value="0">Po文普通商品</option>
        　<option value="1">Po文特別商品</option>
        <option value="2">出售過之代購商品</option>
        </select>
        </div>
        <div class="admin__monitor__item">
        貨品名稱：
        <input
            type="text"
            name="name"
            id="name" required
        />
        </div>
        <div class="admin__monitor__item">
        貨品網址：
        <input
            type="text"
            name="website"
            id="website" required
        />
        </div>
        <div class="admin__monitor__item">
        貨品所在FB：
        <input
            type="text"
            name="urlOnFacebook"
            id="urlOnFacebook"
        />
        </div>
        <div class="admin__monitor__item">
        貨品所在IG：
        <input
            type="text"
            name="urlOnIG"
            id="urlOnIG"
        />
        </div>
        <div class="admin__monitor__title">
            貨品價格：
        </div>
        <div class="admin__monitor__item" id="inPriceNTD">
            入貨單價(NTD)：
            <input
                type="number"
                name="inPriceNTD"
                id="inPriceNTD"
                class="inPriceNTD${lastGoodsID}" oninput="updateGoodsPrice(${lastGoodsID})" required
            />
        </div>
        <div class="admin__monitor__item" id="inPriceHKD">
            入貨單價(HKD)：
        </div>
        <div class="admin__monitor__item" id="priceHKD">
            售價(HKD)：
            <input
                type="number"
                name="priceHKD"
                id="priceHKD"
                class="priceHKD${lastGoodsID}" oninput="updateGoodsPrice(${lastGoodsID})" required
            />
        </div>
        <div class="admin__monitor__item" id="profitHKD">
            毛利(HKD)：
        </div>
            <input
          type="button"
          name="submit"
          value="新增訂單客戶資料"
          onclick="updateGoodsListInfo(${lastGoodsID}, 1);"
              />
        </form>
          `;
  $("#admin__monitor").append(orderTitleString);
}

function showEditGoodsListForm(goodsID) {
  $("#admin__monitor").empty();
  var titleString = `
    <div class="admin__monitor__title">修改貨品${goodsID}資料</div>
      <div class="function__bar">
        <div class="function__bar__btn" onclick="showGoodsListItem()">
          返回查看所有
        </div>
      </div>
    `;
  $("#admin__monitor").append(titleString);
  db.collection("goods")
    .doc(goodsID.toString())
    .get()
    .then(
      function (goodssh) {
        var goodsInfo = goodssh.data();
        titleString = `
            <div class="admin__monitor__block">
                <div class="admin__monitor__title">貨品資料</div>
                <div class="admin__monitor__item">
                貨品編號：${goodssh.id}
                </div>
                <form name="form" id="form${goodssh.id}">
                <div class="admin__monitor__item">
                貨品類別：
                <select name="category" id="category" class="selection">
                　<option value="0" ${
                  goodsInfo.category === "0" ? "SELECTED" : ""
                }>Po文普通商品</option>
                　<option value="1" ${
                  goodsInfo.category === "1" ? "SELECTED" : ""
                }>Po文特別商品</option>
                <option value="2" ${
                  goodsInfo.category === "2" ? "SELECTED" : ""
                }>出售過之代購商品</option>
                </select>
                </div>
                <div class="admin__monitor__item">
                貨品名稱：
                <input
                    type="text"
                    name="name"
                    id="name"
                    value="${goodsInfo.name}" required
                />
                </div>
                <div class="admin__monitor__item">
                貨品網址：
                <input
                    type="text"
                    name="website"
                    id="website"
                    value="${goodsInfo.website}" required
                />
                </div>
                <div class="admin__monitor__item">
                貨品所在FB：
                <input
                    type="text"
                    name="urlOnFacebook"
                    id="urlOnFacebook"
                    value="${goodsInfo.urlOnFacebook}"
                />
                </div>
                <div class="admin__monitor__item">
                貨品所在IG：
                <input
                    type="text"
                    name="urlOnIG"
                    id="urlOnIG"
                    value="${goodsInfo.urlOnIG}"
                />
                </div>
                <div class="admin__monitor__title">
                    貨品價格：
                </div>
                <div class="admin__monitor__item" id="inPriceNTD">
                    入貨單價(NTD)：
                    <input
                        type="number"
                        name="inPriceNTD"
                        id="inPriceNTD"
                        class="inPriceNTD${goodssh.id}"
                        value="${
                          goodsInfo.inPriceNTD
                        }" oninput="updateGoodsPrice(${goodssh.id})" required
                    />
                </div>
                <div class="admin__monitor__item" id="inPriceHKD">
                    入貨單價(HKD)：${
                      Math.round((goodsInfo.inPriceNTD / twdToHKD) * 10) / 10
                    }
                </div>
                <div class="admin__monitor__item" id="priceHKD">
                    售價(HKD)：
                    <input
                        type="number"
                        name="priceHKD"
                        id="priceHKD"
                        class="priceHKD${goodssh.id}"
                        value="${
                          goodsInfo.priceHKD
                        }" oninput="updateGoodsPrice(${goodssh.id})" required
                    />
                </div>
                <div class="admin__monitor__item" id="profitHKD">
                    毛利(HKD)：${
                      Math.round(
                        (goodsInfo.priceHKD -
                          Math.round((goodsInfo.inPriceNTD / twdToHKD) * 10) /
                            10) *
                          10
                      ) / 10
                    }(${
          Math.round(
            ((goodsInfo.priceHKD -
              Math.round((goodsInfo.inPriceNTD / twdToHKD) * 10) / 10) /
              Math.round((goodsInfo.inPriceNTD / twdToHKD) * 10) /
              10) *
              10000 *
              10
          ) / 10
        }%)
        </div>
          </form>
          <input
          type="button"
          name="submit"
          value="更新貨品資料"
          onclick="updateGoodsListInfo(${goodsID}, 0);"
              />
              <input
          type="button"
          name="submit"
          value="刪除貨品"
          onclick="removeGoodsListInfo(${goodsID});"
              />
        </div>
        `;
        $("#admin__monitor").append(titleString);
        return true;
      },
      (rej) => {
        console.log(rej);
      }
    );
}

async function updateGoodsListInfo(goodsID, mode) {
  const form = document.forms["form" + goodsID];
  var category = form.elements.category.value;
  var name = form.elements.name.value;
  var website = form.elements.website.value;
  var inPriceNTD = form.elements.inPriceNTD.value;
  var priceHKD = form.elements.priceHKD.value;
  if (
    category != "" &&
    name != "" &&
    website != "" &&
    inPriceNTD != "" &&
    priceHKD != ""
  ) {
    await db
      .collection("goods")
      .doc(goodsID.toString())
      .set({
        category: form.elements.category.value,
        name: form.elements.name.value,
        website: form.elements.website.value,
        inPriceNTD: form.elements.inPriceNTD.value,
        priceHKD: form.elements.priceHKD.value,
        urlOnFacebook: form.elements.urlOnFacebook.value,
        urlOnIG: form.elements.urlOnIG.value,
      })
      .then(function () {
        alert("更新貨品資料成功");
        GoodsUpdateUpdateDateTime(goodsID);
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
    showEditGoodsListForm(goodsID);
  }
}

function updateGoodsPrice(goodsID) {
  var goodsInPriceHKD =
    Math.round(
      (document.getElementsByClassName("inPriceNTD" + goodsID)[0].value /
        twdToHKD) *
        10
    ) / 10;
  document.getElementById("inPriceHKD").innerHTML =
    "入貨單價(HKD)：" + goodsInPriceHKD;

  document.getElementById("profitHKD").innerHTML =
    "毛利(HKD)：" +
    Math.round(
      (document.getElementsByClassName("priceHKD" + goodsID)[0].value -
        goodsInPriceHKD) *
        10
    ) /
      10 +
    "(" +
    Math.round(
      ((document.getElementsByClassName("priceHKD" + goodsID)[0].value -
        goodsInPriceHKD) /
        goodsInPriceHKD) *
        100 *
        10
    ) /
      10 +
    "%)";
}

async function removeGoodsListInfo(goodsID) {
  if (
    confirm("請再次確定是不真的要刪除此貨品？ 一旦確定將無法取消。") == true
  ) {
    await db
      .collection("goods")
      .doc(goodsID.toString())
      .delete()
      .then(function () {
        alert("刪除貨品成功");
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

async function GoodsUpdateUpdateDateTime(goodsID) {
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
    .collection("goods")
    .doc(goodsID.toString())
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

function setGoodsLocalStorage() {
  localStorage.setItem(
    "goodsListOrderBy",
    document.getElementById("goodsListOrderBy").value
  );
  localStorage.setItem(
    "goodsListOrder",
    document.getElementById("goodsListOrder").checked
  );
  showGoodsListItem();
}

$(document).ready(function () {
  console.log("check localstorage");
  if (localStorage.getItem("goodsListOrderBy") === null) {
    console.log("goodsListOrderBy null");
    localStorage.setItem("goodsListOrderBy", "category");
  } else {
    console.log("goodsListOrderBy exist");
  }
  if (localStorage.getItem("goodsListOrder") === null) {
    console.log("goodsListOrder null");
    localStorage.setItem("goodsListOrder", false);
  } else {
    console.log("goodsListOrder exist");
  }
});
