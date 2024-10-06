var x = window.matchMedia("(max-width: 575px)");
if (x.matches) {
}
var title_tab_1 = document.getElementById("title-tab-text-1");
var tile_tab = document.getElementsByClassName("tile");
title_tab_1.onclick = function () {
  window.location.href = "";
  title_tab_1.textContent = "Languages and Frameworks";
};
