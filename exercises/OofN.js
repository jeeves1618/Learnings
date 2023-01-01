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
  let found = false;
  let noOfOperations = 0;
  for (let i = 0; i < carArray.length; i++) {
    noOfOperations++;
    if (carArray[i] === carName) {
      console.log(`Found your car ${carName}`);
      found = true;
    }
  }
  if (!found) console.log(`Not able to find your car`);
  console.log(
    `The number of inputs is ${carArray.length} and the number of operations is ${noOfOperations}`
  );
}

carFinder(cars, "Volkswagon Taigun");

const massiveArray = new Array(10000).fill("4 stroke engine");
carFinder(massiveArray, "Volkswagon Taigun");
