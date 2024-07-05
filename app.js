const main = document.querySelector("#main");
const addCardBtn = document.querySelector("#addCard");

let woElementJoUthaHuaHy = null;

const addTask = (event) => {
  event.preventDefault();

  const currentForm = event.target;
  const value = currentForm.elements[0].value;
  const parent = currentForm.parentElement;
  const ticket = createTicket(value);

  if (!value) return;

  parent.insertBefore(ticket, currentForm);

  const h3Value = parent.children[0].innerText;

  if (!Array.isArray(savedTasks[h3Value])) {
    savedTasks[h3Value] = [];
  }

  savedTasks[h3Value].push(value);

  localStorage.setItem("savedTasks", JSON.stringify(savedTasks));

  currentForm.reset();
};

const myCreateCard = (cardTitle) => {
  const myDiv = document.createElement("div");
  const myH3 = document.createElement("h3");
  const myForm = document.createElement("form");
  const myInput = document.createElement("input");

  const h3Text = document.createTextNode(cardTitle);

  myDiv.setAttribute("class", "column");
  myInput.setAttribute("type", "text");
  myInput.setAttribute("placeholder", "add task");

  myH3.appendChild(h3Text);
  myForm.appendChild(myInput);
  myDiv.appendChild(myH3);
  myDiv.appendChild(myForm);

  myForm.addEventListener("submit", addTask);

  myDiv.addEventListener("dragleave", (event) => event.preventDefault());
  myDiv.addEventListener("dragover", (event) => event.preventDefault());

  myDiv.addEventListener("drop", (event) => {
    const jisElementPerDropKiyaJaRahaHo = event.target;

    if (jisElementPerDropKiyaJaRahaHo.className.includes("column")) {
      jisElementPerDropKiyaJaRahaHo.appendChild(woElementJoUthaHuaHy);
    }

    if (jisElementPerDropKiyaJaRahaHo.className.includes("ticket")) {
      jisElementPerDropKiyaJaRahaHo.parentElement.appendChild(
        woElementJoUthaHuaHy
      );
    }
  });

  return myDiv;
};

const createTicket = (value) => {
  //
  const ticket = document.createElement("p");
  const elementText = document.createTextNode(value);

  ticket.setAttribute("draggable", "true");
  ticket.setAttribute("class", "ticket");
  ticket.appendChild(elementText);

  ticket.addEventListener("mousedown", (event) => {
    woElementJoUthaHuaHy = event.target;
    console.log("1");
  });

  return ticket;
};

let savedTasks = JSON.parse(localStorage.getItem("savedTasks"));

if (!savedTasks) {
  savedTasks = {};
}

for (const title in savedTasks) {
  const card = myCreateCard(title);

  const arrayOfTasks = savedTasks[title];

  for (let i = 0; i < arrayOfTasks.length; i++) {
    const p = createTicket(arrayOfTasks[i]);

    card.insertBefore(p, card.lastElementChild);
  }

  main.insertBefore(card, addCardBtn);
}

addCardBtn.addEventListener("click", () => {
  const cardTitle = prompt("enter card name?");

  if (!cardTitle) return;

  const yourDiv = myCreateCard(cardTitle);

  main.insertBefore(yourDiv, addCardBtn);
});