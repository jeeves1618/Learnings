`use strict`;

const searchParams = new URLSearchParams(window.location.search);

let bodyElement = document.querySelector("body");
let enteredToken = "";
let annualReads = 0;
let yearOfReading = searchParams.get("year");
const currentDate = new Date();
let currentYear = currentDate.getFullYear();
if (yearOfReading == null) yearOfReading = currentYear;
console.log(yearOfReading);

let booksReadData = [];
let xaxisCategories = [];
const mainHeaderElement = document.getElementById("main-header-year");
mainHeaderElement.textContent = "My " + yearOfReading + " Reads";
const titleElement = document.querySelector("title");
titleElement.textContent = "My " + yearOfReading + " Reads";

let formatPage = function (formatedData) {
  let prevMonth = "00";
  let currentMonthInteger = 0;
  const bookListElement = document.getElementById("book-list");
  for (const element of formatedData) {
    let yearToBeConsidered = filterByYear(element);

    if (yearToBeConsidered == yearOfReading) {
      let currentMonth = element.dateOfReading.substring(5, 7);
      if (currentMonth > prevMonth) {
        breakMonth(currentMonth, bookListElement);
        if (prevMonth != "00") booksReadData.push(currentMonthInteger);
        currentMonthInteger = 0;
        prevMonth = currentMonth;
      }
      addBookToPage(element, bookListElement);
      currentMonthInteger = currentMonthInteger + 1;
      console.log(element.bookTitle + " " + currentMonthInteger);
    }
  }
  booksReadData.push(currentMonthInteger);
  annualReads = booksReadData.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  charterFunction(booksReadData);
};
const getTopics = function () {
  fetch(
    `https://raw.githubusercontent.com/jeeves1618/Spring-Learnings/master/Librarian%202.0/src/main/resources/book-list.json`
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
      formatPage(
        formatedData.sort((b1, b2) =>
          b1.dateOfReading < b2.dateOfReading
            ? -1
            : b1.dateOfReading > b2.dateOfReading
            ? 1
            : 0
        )
      );
    });
};

const filterByYear = function (book) {
  let yearToBeConsidered;

  if (book.dateOfReading.substring(0, 4) === "0001") {
    if (book.dateOfPurchase.substring(0, 4) === "2024") {
      yearToBeConsidered = "0001";
    } else {
      yearToBeConsidered = book.dateOfPurchase.substring(0, 4);
    }
  } else {
    yearToBeConsidered = book.dateOfReading.substring(0, 4);
  }
  return yearToBeConsidered;
};

const addBookToPage = function (element, bookListElement) {
  //const bookListElement = document.getElementById("book-list");

  let linkElement = document.createElement("a");
  linkElement.href = element.shoppingUrl;
  linkElement.target = "_blank";
  bookListElement.append(linkElement);
  let orderedListElement = document.createElement("li");
  linkElement.append(orderedListElement);
  let bookNameElement = document.createElement("strong");
  bookNameElement.textContent = element.bookTitle;
  orderedListElement.append(bookNameElement);
  let authorNameElement = document.createElement("em");
  authorNameElement.textContent = assignAuthors(element);
  orderedListElement.append(authorNameElement);
  orderedListElement.append("  ");
  const starElement = [];
  for (let i = 0; i < element.ratingOfUsefulness; i++) {
    starElement[i] = document.createElement("span");
    starElement[i].className = "glyphicon glyphicon-star";
  }
  for (let i = 0; i < element.ratingOfUsefulness; i++) {
    orderedListElement.append(starElement[i]);
  }
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
let treshold = Math.max(5, Math.floor(0.1 * pageWidth));
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

const charterFunction = function (booksReadData, xaxisCategories) {
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
      text:
        "My journey through " +
        annualReads +
        " books in " +
        yearOfReading +
        "...",
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
      categories: [
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
      ],
    },
    yaxis: {
      stepSize: 5,
    },
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
};
