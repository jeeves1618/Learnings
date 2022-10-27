`use strict`;
//import menu from "./menu.json" assert { type: "json" };
let menu = new Array();
let orderList = new Array();
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
let title = window.location.href.split("=")[1].replace(/[^a-z,A-Z]/g, " ");
document.getElementById("menu-categories-title").textContent = title;
function loadJson(callback) {
  var XmlHttpRequest = new XMLHttpRequest();
  XmlHttpRequest.overrideMimeType("application/json");
  XmlHttpRequest.open("GET", "./data/menu.json", true);
  XmlHttpRequest.onreadystatechange = function () {
    if (XmlHttpRequest.readyState == 4 && XmlHttpRequest.status == "200") {
      // .open will NOT return a value
      // but simply returns undefined in async mode so use a callback
      callback(XmlHttpRequest.responseText);
    }
  };
  XmlHttpRequest.send(null);
}

loadJson(
  function (response) {
    menu = JSON.parse(response);
    console.log("Got the Json file");
    console.log(menu);
    /*
});
window.addEventListener(
  "DOMContentLoaded",
  (event) => {
*/
    console.log(menu);
    console.log(menu[0] + " and number of items in menu is " + menu.length);
    let packSizeGm = "250 gm";
    for (let i = 0; i < menu.length; i++) {
      if (i > 97) {
        packSizeGm = "200 gm";
      }
      console.log(
        menu[i].category.replace(/ /g, "") + "==" + title.replace(/ /g, "")
      );
      if (menu[i].category.replace(/ /g, "") == title.replace(/ /g, "")) {
        document.getElementById("dmenu").innerHTML +=
          `<div class="menu-item-tile col-md-6">
                <div class="row">
                    <div class="col-sm-5">
                    <div class="menu-item-photo">
                        <span id="cartIndicator_` +
          i +
          `"></span>
                        <img
                        class="img-responsive"
                        width="250"
                        height="150"
                        src="` +
          menu[i].image +
          `"
                        alt="Item"
                        />
                    </div>
                    
                    </div>
                    <div class="menu-item-description col-sm-7">
                    <h3 class="menu-item-title">` +
          menu[i].name +
          `</h3>
                    <p class="menu-item-details">
                    ` +
          menu[i].description +
          `
                    </p>
                    <p class="menu-item-pricing">
                    <span id="packsize">
                    Pack Size :
                    </span>
                    <select name="PackSize" id="PackSize_` +
          i +
          `">
                    <option value="` +
          Object.keys(menu[i].pricing)[0] +
          `">` +
          Object.keys(menu[i].pricing)[0] +
          `</option>
                    <option value="` +
          Object.keys(menu[i].pricing)[1] +
          `">` +
          Object.keys(menu[i].pricing)[1] +
          `</option>
                    <option value="` +
          Object.keys(menu[i].pricing)[2] +
          `">` +
          Object.keys(menu[i].pricing)[2] +
          `</option>
                    
                  </select>
        </p>
        <p class="menu-item-pricing">
                    <span id="numberOfCourses">
                    Quantity :
                    </span>
                    <select name="quantityselected" id="quantityselected_` +
          i +
          `">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="100">100</option>
                  </select>
                    </p>
                    <p class="calculated-price">
                    <span id="pricelabelofcourses">
                    Price :
                    </span>
                    <span id="priceofsweetpacks` +
          i +
          `">
                    ₹ ` +
          menu[i].pricing[packSizeGm] +
          `
                    </span>
                    </p>
                    <div id="add-to-cart-division">
                    <button id="placeorder_` +
          i +
          `" type="button" class="btn btn-primary mx-auto" >Add to Cart</button></div>
                </div>
                    </p>
                    </div>
                </div>
                
                </div>`;
      }
    }
    document.getElementById("check-out-button").textContent =
      "Proceed to checkout";

    document.getElementById("back-from-checkout-button").textContent =
      " Back to Categories .";
  },
  { once: true }
);
window.addEventListener("change", (event) => {
  console.log("Something Changed");
  console.log(event.target.id);
  let myArray = event.target.id.split("_");

  console.log(myArray[1]);
  let qtySelected = "quantityselected_" + myArray[1];
  let packSelected = "PackSize_" + myArray[1];
  console.log(
    "qtySelected : " + qtySelected + " packSelected : " + packSelected
  );
  let newqty = document.getElementById(qtySelected).value;
  let newqpack = document.getElementById(packSelected).value;
  console.log("newqty : " + newqty + " newqpack : " + newqpack);
  let newPrice = newqty * menu[myArray[1]].pricing[newqpack];
  document.getElementById("priceofsweetpacks" + myArray[1]).textContent =
    "₹" + newPrice;

  console.log(menu[myArray[1]].pricing["250 gm"]);
});
window.addEventListener("click", (event) => {
  console.log("Something got clicked");
  let eventMouse = event.target.id.substring(0, 5);
  let myArray = event.target.id.split("_");
  let qtySelected = "quantityselected_" + myArray[1];
  let packSelected = "PackSize_" + myArray[1];
  let numberInBasket;
  console.log(myArray[1]);
  let newqty = document.getElementById(qtySelected).value;
  let newqpack = document.getElementById(packSelected).value;
  console.log("newqty : " + newqty + " newqpack : " + newqpack);
  let newPrice = newqty * menu[myArray[1]].pricing[newqpack];
  console.log("Item Name : " + menu[myArray[1]].name + " Price : " + newPrice);
  if (eventMouse == "place") {
    let newqpack = document.getElementById(packSelected).value;
    let objFound = orderList.findIndex(
      (o) => o.id === menu[myArray[1]].id && o.sizeOfPack === newqpack
    );
    console.log("objFound : " + objFound);
    if (objFound == -1) {
      numberInBasket = " - " + Number(newqty);
      orderList.push({
        id: menu[myArray[1]].id,
        name: menu[myArray[1]].name,
        quantity: Number(newqty),
        sizeOfPack: newqpack,
        price: newPrice,
        image: menu[myArray[1]].image,
      });
    } else {
      console.log("objFound position: " + objFound);
      orderList[objFound].quantity += Number(newqty);
      orderList[objFound].price += newPrice;

      numberInBasket = " - " + orderList[objFound].quantity;
    }
    document.getElementById("cartIndicator_" + myArray[1]).innerHTML =
      `<a href="roadmap.html">

    <div>
        <span id="number-of-items-incart` +
      myArray[1] +
      `" class="glyphicon glyphicon glyphicon-road"></span></div
    ></a>`;
  }
  document.getElementById("number-of-items-incart" + myArray[1]).textContent =
    numberInBasket;
  // Storing data:
  console.log(orderList);
  const myJSON = JSON.stringify(orderList);
  localStorage.setItem("testJSON", myJSON);

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
});

function printMenu() {
  var userList = ["Tom", "John"];
  var filePath;
  var isMode;
  var fileObject;

  function writeToFile(path, binary, object) {
    print("Writing " + path + " to file...");
    var output = writeFile(path, mode, object);
    print("The number of bytes written to file was: " + output);
    return output;
  }

  filePath = "../data/order.json";
  isMode = null;
  fileObject = userList;
  writeToFile(filePath, isMode, fileObject);
}
