`use strict`;

const searchParams = new URLSearchParams(window.location.search);

let bodyElement = document.querySelector("body");
let enteredToken = "";

let yearOfReading = searchParams.get("year");
const currentDate = new Date();
let currentYear = currentDate.getFullYear();
if (yearOfReading == null) yearOfReading = currentYear;
console.log(yearOfReading);

const mainHeaderElement = document.getElementById("main-header-year");
mainHeaderElement.textContent = "My " + yearOfReading + " Reads";
const titleElement = document.querySelector("title");
titleElement.textContent = "My " + yearOfReading + " Reads";

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
  console.log("Get Topics Invoked");
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
    console.log(book.authorFirstName + " " + book.authorsFirstName2);
    if (book.authorsFirstName3 == " ") {
      authorsString =
        authorsString +
        " and " +
        book.authorsFirstName2 +
        " " +
        book.authorsLastName2;
      console.log("Step 1 : " + authorsString);
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
    console.log("Step 2 : " + authorsString);
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
    console.log("Step 3 : " + authorsString);
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

let element = document.querySelector("body");
element.addEventListener("swipe", (event) => {
  titleElement.textContent = "Swipe Event";
});
// swiped-left
document.addEventListener("swiped-left", function (e) {
  //alert("Go Left");
});
// swiped-right
document.addEventListener("swiped-right", function (e) {
  //alert("Go Right");
});
export { getTopics };
