function closeLayer(x) {
  x.classList.toggle("change");
  buildingPopUpLayer.style.display = "none";
}

function openAlertLayer(message) {
  buildingPopUpLayer.style.display = "flex";
  console.log(message);
  $("#alertContent").text(message);
}
