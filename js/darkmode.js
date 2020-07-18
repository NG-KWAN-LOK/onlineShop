function DarkMode(x) {
  x.classList.toggle("change");
  if (
    document.getElementsByTagName("body")[0].getAttribute("data-theme") === ""
  ) {
    setDarkMode("dark");
    localStorage.setItem("darkMode", "dark");
    console.log("on");
  } else {
    setDarkMode("light");
    localStorage.setItem("darkMode", "light");
    console.log("off");
  }
}
function readModeToSwitchMode() {
  if (localStorage.getItem("darkMode") === "light") {
    setDarkMode("light");
  } else if (localStorage.getItem("darkMode") === "dark") {
    setDarkMode("dark");
  }
}

function setDarkMode(mode) {
  if (mode === "dark") {
    document.getElementById("darkModeSwitch").checked = true;
    document.getElementById("PhoneTopDarkModeSwitch").checked = true;
    document.getElementsByTagName("body")[0].setAttribute("data-theme", "dark");
    document.getElementById("logoImg__Top").src = "image/logo_light.png";
    document.getElementById("logoImg__phoneTop").src = "image/logo_light.png";
    document.getElementById("logoImg__footer").src = "image/logo_light.png";
    $("#logoImg__Top").on("error", function () {
      $(this).attr("src", "../image/logo_light.png");
    });
    $("#logoImg__phoneTop").on("error", function () {
      $(this).attr("src", "../image/logo_light.png");
    });
    $("#logoImg__footer").on("error", function () {
      $(this).attr("src", "../image/logo_light.png");
    });
    console.log("dark");
  } else if (mode === "light") {
    document.getElementById("darkModeSwitch").checked = false;
    document.getElementById("PhoneTopDarkModeSwitch").checked = false;
    document.getElementsByTagName("body")[0].setAttribute("data-theme", "");
    document.getElementById("logoImg__Top").src = "image/logo.png";
    document.getElementById("logoImg__phoneTop").src = "image/logo.png";
    document.getElementById("logoImg__footer").src = "image/logo.png";
    $("#logoImg__Top").on("error", function () {
      $(this).attr("src", "../image/logo.png");
    });
    $("#logoImg__phoneTop").on("error", function () {
      $(this).attr("src", "../image/logo.png");
    });
    $("#logoImg__footer").on("error", function () {
      $(this).attr("src", "../image/logo.png");
    });
    console.log("light");
  }
}

$(document).ready(function () {
  console.log("check localstorage");
  if (localStorage.getItem("darkMode") === null) {
    console.log("darkMode null");
    localStorage.setItem("darkMode", "light");
  } else {
    console.log("darkMode exist");
  }
  readModeToSwitchMode();
});

console.log(localStorage.getItem("darkMode"));
