`use strict`;
const searchParams = new URLSearchParams(window.location.search);

let bodyElement = document.querySelector("body");

let searchToken = searchParams.get("token");
const currentDate = new Date();
let currentYear = currentDate.getFullYear();

const titleElement = document.querySelector("title");
titleElement.textContent = "Search Results";

const lineSeperator = function () {
  bodyElement.append(document.createElement("hr"));
};

const homeScreen = function () {
  let divHomeRefElement = document.createElement("div");
  divHomeRefElement.id = "home-link-div";
  bodyElement.append(divHomeRefElement);

  let homeRefElement = document.createElement("a");
  homeRefElement.href = "/Learnings/myreads.html";
  homeRefElement.textContent = "Home";
  homeRefElement.id = "home-link";
  divHomeRefElement.append(homeRefElement);
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

let formatPage = function (formatedData) {
  let countOfBooksSelected = 0;
  const bookListElement = document.getElementById("book-list");
  for (const element of formatedData) {
    if (element.bookGenre.toUpperCase().includes(searchToken.toUpperCase())) {
      addBookToPage(element, bookListElement);
      countOfBooksSelected++;
    } else if (
      element.bookTitle.toUpperCase().includes(searchToken.toUpperCase())
    ) {
      addBookToPage(element, bookListElement);
      countOfBooksSelected++;
    } else if (
      assignAuthors(element).toUpperCase().includes(searchToken.toUpperCase())
    ) {
      addBookToPage(element, bookListElement);
      countOfBooksSelected++;
    } else {
      console.log("Token " + searchToken + " not matched");
    }
  }

  if (countOfBooksSelected == 0) {
    bookListElement.append(
      (document.createElement("strong").textContent =
        "Sorry, I do not have any books matching your criteria! Please try again.")
    );
  }
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
    return authorsString;
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
};

const breakElement = function () {
  let blankSpace = document.createTextNode("\u00A0");
  let doubleSpace = document.createTextNode("\u00A0\u00A0");
  bodyElement.append(document.createElement("br"));
  bodyElement.append(document.createElement("br"));
  bodyElement.append(document.createElement("br"));
};

lineSeperator();
homeScreen();
getTopics();
breakElement();
document.querySelector("#search-button").addEventListener("click", function () {
  const searchToken = document.querySelector(".form-control");
  console.log("Search requested for " + searchToken.value);
  location.href = "results.html?token=" + searchToken.value;
});
