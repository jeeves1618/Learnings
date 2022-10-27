`use strict`;
let numberOfItemsInCart = 0;
let text = localStorage.getItem("testJSON");
let obj = JSON.parse(text);
if (obj == null) {
  numberOfItemsInCart = 0;
} else {
  console.log("obj.length : " + obj.length);
  numberOfItemsInCart = obj.length;
}
document.getElementById("nav-no-of-items-cart").textContent =
  "(" + numberOfItemsInCart + ")";
window.addEventListener("DOMContentLoaded", (event) => {
  console.log("Something got clicked");
  console.log(event.target.id);
  // Retrieving data:
  let text = localStorage.getItem("testJSON");
  let obj = JSON.parse(text);
  console.log(obj);
  localStorage.clear();
  let text1 = localStorage.getItem("testJSON");
  let obj1 = JSON.parse(text1);
  console.log(obj1);
});
