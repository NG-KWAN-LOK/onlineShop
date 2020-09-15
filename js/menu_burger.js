function menu_burger(x) {
  x = document.getElementsByClassName("PhoneTop__mainnav__icon")[0];
  x.classList.toggle("change");
  if (PhoneTop__mainnav__container.style.transform === "translateX(0px)") {
    //PhoneTop__mainnav__container.style.display = "none";
    PhoneTop__mainnav__container.style.transform = "translateX(-1000px)";
  } else {
    //PhoneTop__mainnav__container.style.display = "flex";
    PhoneTop__mainnav__container.style.transform = "translateX(0px)";
  }
}

var version = "內測版V2.7";
var versionDate = "2020-9-15 20:07";

$("#topFooterLang_versionDate").append(version + " " + versionDate);
$("#topFooterLang_version").append(version);
