window.addEventListener("DOMContentLoaded", (event) => {
  console.log("Something got clicked");
  console.log(event.target.id);
  // Retrieving data:
  let text = localStorage.getItem("testJSON");
  let obj = JSON.parse(text);
  let numberOfItemsInCart = 0;
  if (obj == null) {
    numberOfItemsInCart = 0;
  } else {
    console.log("obj.length : " + obj.length);
    console.log(obj);
    numberOfItemsInCart = obj.length;
  }
  document.getElementById("nav-no-of-items-cart").textContent =
    "(" + numberOfItemsInCart + ")";
  let i = 0;
  let totalPrice = 0;
  let serialNumber = 1;
  let d = new Date();
  let e = new Date();
  if (obj == null) {
    document.getElementById("cart-title").textContent =
      "You haven't planned your learnings yet!";
    document.getElementById("cart-button-title").textContent =
      "Check out the topics";
    var cartButtonLink = document.getElementById("cart-button-link");
    cartButtonLink.href = "topics.html";
  } else {
    document.getElementById("cart-title").textContent = "My Learning Roadmap";
    document.getElementById("cart-button-title").textContent = "Save Roadmap";
    for (let orderItems = 0; orderItems < obj.length; orderItems++) {
      document.getElementById("dorders").innerHTML +=
        `<section class="row">
    <div class="road-map-tile col-md-12">
      
      <div class="row">
        <div class="col-lg-3 col-sm-4 col-xs-6 col-xxs-12">
          <div class="shop-item-photo hidden-xs hidden-xxs">
            <div>
              <a href=""
                ><span id="nav-no-of-items-cart" class="glyphicon glyphicon glyphicon-road"></span
              ></a>
            </div>
            <img
              class="img-responsive"
              width="250"
              height="150"
              src="` +
        obj[orderItems].image +
        `"
              alt="Item"
            />
          </div>
          </div>
         
        
        <div class="road-map-description col-lg-5 col-sm-4 col-xs-12 col-xxs-12">
          <h3 class="menu-item-title">` +
        obj[orderItems].name +
        `</span></h3>
        </div>
        <div class="menu-item-price col-lg-3 col-sm-4 col-xs-6 col-xxs-12">` +
        obj[orderItems].effortInDays +
        ` days</div>
      </div>
      
    </div>
    </section>`;
      if (i % 2 === 1 && i > 0) {
        document.getElementById(
          "dorders"
        ).innerHTML += `<div class="clearfix visible-lg-block visible-md-block"></div>`;
      }
      i++;
      totalPrice = totalPrice + obj[orderItems].effortInDays;
    }
  }
  console.log(d.toDateString());
  e.setDate(e.getDate() + totalPrice);
  console.log(e.toDateString());
  document.getElementById(
    "dorders"
  ).innerHTML += `<hr><div class="road-map-tile col-md-12">
  <div class="road-map-summary col-sm-7 col-xs-12 col-xxs-12">
      <h3 class="menu-item-title" id="road-map-message"></h3>
      
    </div>
  
</div><br><hr>`;
  if (totalPrice > 0) {
    document.getElementById("road-map-message").textContent =
      `You have a learning roadmap defined for ` +
      totalPrice +
      ` days from ` +
      d.toDateString() +
      ` to ` +
      e.toDateString();
  } else
    document.getElementById("road-map-message").textContent =
      "Time to get started!";
});

function clearCache() {
  localStorage.clear();
}
