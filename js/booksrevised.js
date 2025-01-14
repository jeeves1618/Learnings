`use strict`;

const searchParams = new URLSearchParams(window.location.search);

let bodyElement = document.querySelector("body");
let enteredToken = "";
let annualReads = 0;
let yearOfReading = searchParams.get("year");
const currentDate = new Date();
let currentYear = currentDate.getFullYear();
let displayLastTwelveMonths = false;
if (yearOfReading == null) {
  displayLastTwelveMonths = true;
  yearOfReading = currentYear;
}

let booksReadData = [];
let xaxisCategories = [];
let titleText = "My " + yearOfReading + " Reads";
if (displayLastTwelveMonths) titleText = "My Reads in Past 12 Months";
const mainHeaderElement = document.getElementById("main-header-year");
mainHeaderElement.textContent = titleText;
const titleElement = document.querySelector("title");
titleElement.textContent = titleText;
var x = window.matchMedia("(max-width: 575px)");
/*
x.addEventListener("change", function () {
  getTopics();
});
*/

const charterFunction = function (
  booksReadData,
  xaxisCategories,
  graphCaptionText
) {
  var options = {
    series: [
      {
        name: "Books Read",
        data: booksReadData,
      },
    ],
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    colors: ["#545454"],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: graphCaptionText,
      align: "center",
      style: {
        fontFamily: "Inconsolata",
        fontSize: "16",
      },
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: xaxisCategories,
    },
    yaxis: {
      stepSize: 1,
    },
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
};

let formatPage = function (formatedData) {
  let prevMonth = "00";
  let monthsNumsOfYear = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  if (displayLastTwelveMonths) {
    prevMonth = monthsNumsOfYear[11 - currentDate.getMonth()];
  }
  let currentMonthInteger = 0;
  let skippedMonths = 0;
  const bookListElement = document.getElementById("book-list");
  let monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  for (const element of formatedData) {
    let yearToBeConsidered = filterByYear(element);

    if (yearToBeConsidered == yearOfReading) {
      let currentMonth = element.dateOfReading.substring(5, 7);
      if (currentMonth < prevMonth) {
        skippedMonths = parseInt(currentMonth) - parseInt(prevMonth) - 1;
        console.log(
          "skippedMonths : " +
            skippedMonths +
            "currentMonth and  prevMonth : " +
            currentMonth +
            " and " +
            prevMonth
        );
      } else if (currentMonth > prevMonth && currentMonth != "00") {
        skippedMonths =
          Math.abs(parseInt(currentMonth) - parseInt(prevMonth)) - 1;
      } else {
        skippedMonths = 0;
      }
      if (prevMonth != "00") booksReadData.push(currentMonthInteger);
      for (var pushCounter = 0; pushCounter < skippedMonths; pushCounter++) {
        booksReadData.push(0);
      }

      breakMonth(currentMonth, bookListElement);
      currentMonthInteger = 0;
      prevMonth = currentMonth;
    }
    addBookToPage(element, bookListElement);
    currentMonthInteger = currentMonthInteger + 1;
  }

  let xaxisCategories = [];
  xaxisCategories = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (x.matches) {
    xaxisCategories = [
      "J",
      "F",
      "M",
      "A",
      "M",
      "J",
      "J",
      "A",
      "S",
      "O",
      "N",
      "D",
    ];

    booksReadData.push(currentMonthInteger);
    skippedMonths = 0;
    if (booksReadData.length < 12) skippedMonths = 12 - booksReadData.length;
    for (var pushCounter = 0; pushCounter < skippedMonths; pushCounter++) {
      booksReadData.push(0);
    }
    annualReads = booksReadData.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
  }
  let graphCaptionText =
    "My tryst with " + annualReads + " books in " + yearOfReading + "...";
  if (displayLastTwelveMonths) {
    graphCaptionText =
      "My tryst with " +
      annualReads +
      " books in the last twelve months" +
      "...";
  }
  console.log("booksReadData: " + booksReadData);
  charterFunction(booksReadData, xaxisCategories, graphCaptionText);
};
const getTopics = function () {
  //fetch(`http://localhost:8080/book-list.json`)
  // For testing with local Json. `https://raw.githubusercontent.com/jeeves1618/Spring-Learnings/master/Librarian%202.0/src/main/resources/book-list.json`
  fetch(
    `https://raw.githubusercontent.com/jeeves1618/Spring-Learnings/master/Librarian%202.0/src/main/resources/read-list.json`
  )
    .then(function (ajaxResponse) {
      //ajaxResponse can't be read since it is a readstream.
      //So, you have to use a json method, which itself is an async function returning a promisr
      return ajaxResponse.json();
    })
    .then(function (formatedData) {
      for (const book of formatedData) {
        if (book.dateOfReading == "0001-01-01")
          book.dateOfReading = book.dateOfPurchase;
      }
      //Sorting based on date last read and passing it to format page function
      if (displayLastTwelveMonths) {
        formatPage(
          formatedData.sort((b1, b2) =>
            b1.dateOfReading > b2.dateOfReading
              ? -1
              : b1.dateOfReading < b2.dateOfReading
              ? 1
              : 0
          )
        );
      } else {
        formatPage(
          formatedData.sort((b1, b2) =>
            b1.dateOfReading < b2.dateOfReading
              ? -1
              : b1.dateOfReading > b2.dateOfReading
              ? 1
              : 0
          )
        );
      }
    });
};

const filterByYear = function (book) {
  let yearToBeConsidered;
  let dateToBeConsidered;
  let oneYearBeforeDate = new Date();
  let todayDate = currentDate.toISOString().split("T")[0];

  if (book.dateOfReading.substring(0, 4) === "0001") {
    if (book.dateOfPurchase.substring(0, 4) === "2025") {
      yearToBeConsidered = "0001";
      dateToBeConsidered = "0001-01-01";
    } else {
      yearToBeConsidered = book.dateOfPurchase.substring(0, 4);
      dateToBeConsidered = book.dateOfPurchase;
    }
  } else {
    yearToBeConsidered = book.dateOfReading.substring(0, 4);
    dateToBeConsidered = book.dateOfReading;
  }
  if (displayLastTwelveMonths) {
    oneYearBeforeDate.setFullYear(currentDate.getFullYear() - 1); // Subtract 1 year
    oneYearBeforeDate.setMonth(currentDate.getMonth() + 1); // Add 1 month

    // Step 3: Reset the day to the 1st of the month
    oneYearBeforeDate.setDate(1);

    // Step 4: Format the result as YYYY-MM-DD
    const year = oneYearBeforeDate.getFullYear();
    const month = String(oneYearBeforeDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(oneYearBeforeDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    if (formattedDate < dateToBeConsidered)
      yearToBeConsidered = currentDate.getFullYear();
  }
  return yearToBeConsidered;
};

const addBookToPage = function (element, bookListElement) {
  //const bookListElement = document.getElementById("book-list");
  //http://127.0.0.1:5501/results.html?token=Must%20Reads
  let linkElement = document.createElement("a");
  linkElement.href = element.shoppingUrl;
  linkElement.target = "_blank";
  //bookListElement.append(linkElement);
  let orderedListElement = document.createElement("li");
  bookListElement.append(orderedListElement);
  //linkElement.append(orderedListElement);
  // Create an image element
  let imageElement = document.createElement("img");
  // Set the source of the image
  imageElement.src =
    "http://raw.githubusercontent.com/jeeves1618/Spring-Learnings/refs/heads/master/Librarian%202.0/src/main/resources/static" +
    element.imageFileName;
  // Set the size of the image using REM units
  imageElement.style.width = "4rem";
  imageElement.style.height = "6rem";
  imageElement.style.marginRight = "2rem";

  // 3. Create a table with 1 row and 2 columns
  const table = document.createElement("table");
  table.style.border = "none"; // Remove table border
  table.style.width = "100%";

  const row = document.createElement("tr");

  // Create the first column for the image
  const imgCell = document.createElement("td");

  imgCell.appendChild(imageElement); // Insert image into the first cell
  //imgCell.style.width = "20%"; // Extend to fill the rest of the screen space
  // Create the second column for random text
  const textCell = document.createElement("td");
  textCell.style.width = "100%"; // Extend to fill the rest of the screen space
  //xtCell.style.display = "inline-block";
  //textCell.style.whiteSpace = "nowrap";

  // Add the image to the DOM, for example to the body
  let bookNameElement = document.createElement("strong");
  bookNameElement.textContent = element.bookTitle;
  if (element.allTimeGreatIndicator === "Yes") {
    let allTimelinkElement = document.createElement("a");
    allTimelinkElement.href = "/Learnings/results.html?token=Must%20Reads";
    textCell.appendChild(allTimelinkElement);
    //orderedListElement.append(allTimelinkElement);
    console.log("Yes, " + element.bookTitle + " is all time great");
    let allTimeGreatTextElement = document.createElement("sup");
    allTimeGreatTextElement.className = "highlight-sup";
    allTimeGreatTextElement.textContent = "Must Read!";
    allTimelinkElement.append(allTimeGreatTextElement);
  }
  linkElement.append(bookNameElement);

  textCell.appendChild(linkElement);
  //orderedListElement.append(linkElement);
  const spaceTextElement = document.createElement("span");
  spaceTextElement.textContent = "   ";
  textCell.appendChild(spaceTextElement);
  //orderedListElement.append("  ");
  if (element.readingNotesUrl != null && element.readingNotesUrl > " ") {
    let notesLinkElement = document.createElement("a");
    notesLinkElement.href = element.readingNotesUrl;
    notesLinkElement.target = "_blank";
    let notesElement = document.createElement("span");
    notesElement.className = "glyphicon glyphicon-comment glyphicon-color";
    notesLinkElement.style.margin = "0 0 0 1rem";
    notesLinkElement.append(notesElement);

    textCell.appendChild(notesLinkElement);
    //orderedListElement.append(notesLinkElement);
  }
  let authorNameElement = document.createElement("em");
  authorNameElement.textContent = assignAuthors(element);
  textCell.appendChild(authorNameElement);
  //orderedListElement.append(authorNameElement);
  textCell.appendChild(spaceTextElement);
  //orderedListElement.append("  ");
  const starElement = [];
  for (let i = 0; i < element.ratingOfUsefulness; i++) {
    starElement[i] = document.createElement("span");
    starElement[i].className = "glyphicon glyphicon-star";
  }
  for (let i = 0; i < element.ratingOfUsefulness; i++) {
    textCell.appendChild(starElement[i]);
    //orderedListElement.append(starElement[i]);
  }

  // Append both cells to the row
  row.appendChild(imgCell);
  row.appendChild(textCell);

  // Append the row to the table
  table.appendChild(row);

  // Add the table to the list item
  orderedListElement.appendChild(table);
  //orderedListElement.append(imageElement);
};

const scrollManager = function () {
  let nextYear = Number(yearOfReading) + 1;
  let prevYear = Number(yearOfReading) - 1;

  let prevRefElement = document.createElement("a");
  prevRefElement.href = "/Learnings/myreads.html?year=" + prevYear;

  bodyElement.append(prevRefElement);
  let prevLinkElement = document.createElement("span");
  prevLinkElement.textContent = "<-- " + prevYear;
  prevLinkElement.id = "prev-year";
  console.log(prevLinkElement);
  prevRefElement.append(prevLinkElement);

  let nextRefElement = document.createElement("a");
  nextRefElement.href = "/Learnings/myreads.html?year=" + nextYear;
  bodyElement.append(nextRefElement);
  let nextLinkElement = document.createElement("span");
  nextLinkElement.textContent = nextYear + " -->";
  nextLinkElement.id = "next-year";
  if (Number(yearOfReading) < currentYear)
    nextRefElement.append(nextLinkElement);
};

const breakMonth = function (currentMonth, bookListElement) {
  console.log("Month : " + currentMonth + " Element : " + bookListElement);
  if (currentMonth == undefined) {
    console.log("Undefined");
  } else {
    let imageElement = document.createElement("img");
    imageElement.src = "img/months/" + currentMonth + ".jpg";
    imageElement.className = "center";
    imageElement.id = "month_image";
    bookListElement.append(imageElement);
  }
  //<img src="img/months/jan.jpg" class="center" />
};

const breakElement = function () {
  let blankSpace = document.createTextNode("\u00A0");
  let doubleSpace = document.createTextNode("\u00A0\u00A0");
  bodyElement.append(document.createElement("br"));
  bodyElement.append(document.createElement("br"));
  bodyElement.append(document.createElement("br"));
};

const assignAuthors = function (book) {
  let authorsString = " By " + book.authorFirstName + " " + book.authorLastName;
  if (book.authorsFirstName2 != " ") {
    if (book.authorsFirstName3 == " ") {
      authorsString =
        authorsString +
        " and " +
        book.authorsFirstName2 +
        " " +
        book.authorsLastName2;

      return authorsString;
    } else {
      authorsString =
        authorsString +
        " , " +
        book.authorsFirstName2 +
        " " +
        book.authorsLastName2;
    }
  } else {
    return authorsString;
  }

  if (book.authorsFirstName4 == " " && book.authorsFirstName3 != " ") {
    authorsString =
      authorsString +
      " and " +
      book.authorsFirstName3 +
      " " +
      book.authorsLastName3;

    return authorsString;
  } else {
    authorsString =
      authorsString +
      " , " +
      book.authorsFirstName3 +
      " " +
      book.authorsLastName3;
  }
  if (book.authorsFirstName4 != " ") {
    authorsString =
      authorsString +
      " and " +
      book.authorsFirstName4 +
      " " +
      book.authorsLastName4;
    return authorsString;
  }
  return authorsString;
};
const lineSeperator = function () {
  bodyElement.append(document.createElement("hr"));
};

getTopics();
lineSeperator();
scrollManager();
breakElement();

document.querySelector("#search-button").addEventListener("click", function () {
  const searchToken = document.querySelector(".form-control");
  console.log("Search requested for " + searchToken.value);
  location.href = "results.html?token=" + searchToken.value;
});

document
  .querySelector("#search-button-2")
  .addEventListener("click", function () {
    const searchToken = document.querySelector(".form-control-2");
    console.log("Search requested for " + searchToken.value);
    location.href = "results.html?token=" + searchToken.value;
  });

document
  .querySelector("#search-input")
  .addEventListener("keypress", function (event) {
    console.log("Search requested for " + enteredToken);
    if (event.key === "Enter") {
      event.preventDefault();
      document.querySelector("#search-button").click();
    }
    enteredToken = enteredToken + event.key;
  });

let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = Math.max(5, Math.floor(0.3 * pageWidth));
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

const limit = Math.tan(((45 * 1.5) / 180) * Math.PI);
const gestureZone = document.getElementById("modalContent");

gestureZone.addEventListener(
  "touchstart",
  function (event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
  },
  false
);

gestureZone.addEventListener(
  "touchend",
  function (event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
  },
  false
);

function handleGesture(e) {
  let x = touchendX - touchstartX;
  let y = touchendY - touchstartY;
  let xy = Math.abs(x / y);
  let yx = Math.abs(y / x);
  if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
    if (yx <= limit) {
      if (x < 0) {
        let nextYear = Number(yearOfReading) + 1;
        if (Number(yearOfReading) < currentYear)
          document.querySelector("#next-year").click();
        console.log("left");
      } else {
        document.querySelector("#prev-year").click();
        console.log("right");
      }
    }
    if (xy <= limit) {
      if (y < 0) {
        console.log("top");
      } else {
        console.log("bottom");
      }
    }
  } else {
    console.log("tap");
  }
}
