export function addBookToPage(element, bookListElement) {
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

  const row = document.createElement("tr");

  // Create the first column for the image
  const imgCell = document.createElement("td");

  imgCell.appendChild(imageElement); // Insert image into the first cell
  // Create the second column for random text
  const textCell = document.createElement("td");
  textCell.style.width = "100%"; // Extend to fill the rest of the screen space

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
}
