`use strict`;
function printArray(array) {
  array.forEach((element) => {
    console.log(element);
  });
}

function logPairsOfArray(array) {
  for (let i = 0; i < array.length; i++) {
    for (let k = 0; k < array.length; k++) {
      if (i !== k) console.log(`[${array[i]},${array[k]}]`);
    }
  }
}

logPairsOfArray(["a", "b", "c", "d", "e", "f"]);
printArray(["a", "b", "c", "d", "e", "f"]);
