`use strict`;

const cars = [
  "Maruti Suzuki Baleno",
  "Maruti Suzuki WagonR",
  "Maruti Suzuki Vitara Brezza",
  "Tata Nexon",
  "Maruti Suzuki Alto",
  "Hyundai Creta",
  "Tata Punch",
  "Maruti Suzuki Eeco",
  "Maruti Suzuki Dzire",
  "Maruti Suzuki Swift",
  "Hyundai Venue",
  "Maruti Suzuki Ertiga",
  "Hyundai Grand i10",
  "Kia Seltos",
  "Mahindra Bolero",
  "Kia Sonet",
  "Maruti Suzuki S-Presso",
  "Hyundai i20 Elite",
  "Tata Tiago",
  "Mahindra Scorpio",
  "Toyota Innova Crysta",
  "Mahindra XUV700",
  "Maruti Suzuki Celerio",
  "Maruti Suzuki Ignis",
  "Kia Carens",
  "Volkswagon Taigun",
];

function carFinder(carArray, carName) {
  let t0 = performance.now();
  let found = false;
  for (let i = 0; i < carArray.length; i++) {
    if (carArray[i] === carName) {
      console.log(`Found your car ${carName}`);
      found = true;
    }
  }
  if (!found) console.log(`Not able to find your car`);
  let t1 = performance.now();
  console.log(`Your search took ${t1 - t0} milli seconds`);
}

carFinder(cars, "Volkswagon Taigun");

const massiveArray = new Array(10000).fill("4 stroke engine");
carFinder(massiveArray, "Volkswagon Taigun");
