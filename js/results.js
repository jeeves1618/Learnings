`use strict`;
const searchParams = new URLSearchParams(window.location.search);

let bodyElement = document.querySelector("body");

let enteredToken = "";

let searchToken = searchParams.get("token");
if (searchToken == null) searchToken = "None";
if (searchToken.toUpperCase().includes("FICTION")) searchToken = "Novel";
if (searchToken.toUpperCase().includes("FICTION")) searchToken = "Novel";
if (searchToken.toUpperCase().includes("SECURITIES")) searchToken = "Finance";
if (searchToken.toUpperCase().includes("MUTUAL")) searchToken = "Finance";
if (searchToken.toUpperCase().includes("BUSINESS")) searchToken = "Management";
if (searchToken.toUpperCase().includes("ACCOUNTING")) searchToken = "Finance";
if (searchToken.toUpperCase().includes("STOCK")) searchToken = "Finance";
if (searchToken.toUpperCase().includes("EQUIT")) searchToken = "Finance";
if (searchToken.toUpperCase().includes("MARKETS")) searchToken = "ECONOMICS";
if (searchToken.toUpperCase().includes("MUST READS"))
  searchToken = "MUST-READS";
if (searchToken.toUpperCase().includes("MUST READ")) searchToken = "MUST-READS";
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
  homeRefElement.href = "myreads.html";
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
  let searchTokens = searchToken.toUpperCase().split(" ");
  let bookListElement = document.getElementById("book-list");
  for (const element of formatedData) {
    let bookFound = searchEngine(
      element,
      searchToken.toUpperCase(),
      bookListElement
    );
    if (bookFound) countOfBooksSelected++;
  }

  if (countOfBooksSelected == 0 && searchTokens.length > 1) {
    console.log("Two tokens?");
    for (const element of formatedData) {
      for (const token of searchTokens) {
        let bookFound = searchEngine(
          element,
          token.toUpperCase(),
          bookListElement
        );
        if (bookFound) countOfBooksSelected++;
      }
    }
  }

  if (countOfBooksSelected == 0) {
    bookListElement.append(
      (document.createElement("strong").textContent =
        "Sorry, I do not have any books matching your criteria! Please try again.")
    );
  }
};

const searchEngine = function (element, searchToken, bookListElement) {
  let countOfBooksSelected = 0;
  if (searchToken === "MUST-READS") {
    if (element.allTimeGreatIndicator.toUpperCase().includes("YES")) {
      addBookToPage(element, bookListElement);
      countOfBooksSelected++;
    }
  }
  if (element.bookGenre.toUpperCase().includes(searchToken)) {
    addBookToPage(element, bookListElement);
    countOfBooksSelected++;
  } else if (element.bookTitle.toUpperCase().includes(searchToken)) {
    addBookToPage(element, bookListElement);
    countOfBooksSelected++;
  } else if (assignAuthors(element).toUpperCase().includes(searchToken)) {
    addBookToPage(element, bookListElement);
    countOfBooksSelected++;
  } else {
    console.log("Token " + searchToken + " not matched");
  }
  if (countOfBooksSelected > 0) return true;
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
  if (element.allTimeGreatIndicator === "Yes") {
    console.log("Yes, " + element.bookTitle + " is all time great");
    let allTimeGreatTextElement = document.createElement("sup");
    allTimeGreatTextElement.className = "highlight-sup";
    allTimeGreatTextElement.textContent = "Must Read!";
    orderedListElement.append(allTimeGreatTextElement);
  }
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

document
  .querySelector("#search-input")
  .addEventListener("keypress", function (event) {
    console.log("Search requested for " + enteredToken);
    if (event.key === "Enter") {
      event.preventDefault();
      location.href = "results.html?token=" + enteredToken;
    }
    enteredToken = enteredToken + event.key;
  });
