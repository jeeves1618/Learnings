`use strict`;

const searchParams = new URLSearchParams(window.location.search);

let bodyElement = document.querySelector("body");

let yearOfReading = searchParams.get("year");
const currentDate = new Date();
let currentYear = currentDate.getFullYear();
if (yearOfReading == null) yearOfReading = currentYear;
console.log(yearOfReading);

const mainHeaderElement = document.getElementById("main-header-year");
mainHeaderElement.textContent = "My " + yearOfReading + " Reads";

let formatPage = function (formatedData) {
  let prevMonth = "00";
  const bookListElement = document.getElementById("book-list");
  for (const element of formatedData) {
    let yearToBeConsidered = filterByYear(element);

    if (yearToBeConsidered == yearOfReading) {
      let currentMonth = element.dateOfReading.substring(5, 7);

      if (currentMonth > prevMonth) {
        breakMonth(currentMonth, bookListElement);
        prevMonth = currentMonth;
      }
      addBookToPage(element, bookListElement);
    }
  }
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
  authorNameElement.textContent =
    " By " + element.authorFirstName + " " + element.authorLastName;
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

const writeFooter = function () {
  let nextYear = Number(yearOfReading) + 1;
  let prevYear = Number(yearOfReading) - 1;
  bodyElement.append(document.createElement("hr"));
  let prevRefElement = document.createElement("a");
  prevRefElement.href = "/myreads.html?year=" + prevYear;

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
getTopics();
writeFooter();
breakElement();
