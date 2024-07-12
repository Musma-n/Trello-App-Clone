const main = document.querySelector("#main");
const addCardBtn = document.querySelector("#addCard");

let draggedElement = null;

const addTask = (event) => {
  event.preventDefault();

  const currentForm = event.target;
  const value = currentForm.elements[0].value;
  const parent = currentForm.parentElement;
  const ticket = createTicket(value, parent.children[0].innerText);

  if (!value) return;

  parent.insertBefore(ticket, currentForm.nextSibling);

  const h3Value = parent.children[0].innerText;

  if (!Array.isArray(savedTasks[h3Value])) {
    savedTasks[h3Value] = [];
  }

  savedTasks[h3Value].push(value);

  localStorage.setItem("savedTasks", JSON.stringify(savedTasks));

  currentForm.reset();
};

const createCard = (cardTitle) => {
  const cardDiv = document.createElement("div");
  const cardHeader = document.createElement("h3");
  const cardForm = document.createElement("form");
  const taskInput = document.createElement("input");
  const deleteBtn = document.createElement("button");

  const headerText = document.createTextNode(cardTitle);

  cardDiv.setAttribute("class", "column");
  taskInput.setAttribute("type", "text");
  taskInput.setAttribute("placeholder", "Add task");

  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-card-btn");
  deleteBtn.addEventListener("click", () => {
    main.removeChild(cardDiv);
    delete savedTasks[cardTitle];
    localStorage.setItem("savedTasks", JSON.stringify(savedTasks));
  });

  cardHeader.appendChild(headerText);
  cardForm.appendChild(taskInput);
  cardDiv.appendChild(cardHeader);
  cardDiv.appendChild(deleteBtn);
  cardDiv.appendChild(cardForm);

  cardForm.addEventListener("submit", addTask);

  cardDiv.addEventListener("dragleave", (event) => event.preventDefault());
  cardDiv.addEventListener("dragover", (event) => event.preventDefault());

  cardDiv.addEventListener("drop", (event) => {
    const targetElement = event.target;

    if (targetElement.className.includes("column")) {
      targetElement.appendChild(draggedElement);
    }

    if (targetElement.className.includes("ticket")) {
      targetElement.parentElement.appendChild(draggedElement);
    }
  });

  return cardDiv;
};

const createTicket = (value, cardTitle) => {
  const ticket = document.createElement("div");
  const ticketText = document.createElement("p");
  const deleteBtn = document.createElement("button");
  const elementText = document.createTextNode(value);

  ticket.setAttribute("draggable", "true");
  ticket.setAttribute("class", "ticket");

  deleteBtn.textContent = "X";
  deleteBtn.setAttribute("class", "delete-ticket");

  deleteBtn.addEventListener("click", () => {
    ticket.remove();
    const index = savedTasks[cardTitle].indexOf(value);
    if (index > -1) {
      savedTasks[cardTitle].splice(index, 1);
      localStorage.setItem("savedTasks", JSON.stringify(savedTasks));
    }
  });

  ticketText.appendChild(elementText);
  ticket.appendChild(ticketText);
  ticket.appendChild(deleteBtn);

  ticket.addEventListener("mousedown", (event) => {
    draggedElement = event.target.closest('.ticket');
  });

  return ticket;
};

let savedTasks = JSON.parse(localStorage.getItem("savedTasks")) || {};

for (const title in savedTasks) {
  const card = createCard(title);

  const tasksArray = savedTasks[title];

  for (let i = 0; i < tasksArray.length; i++) {
    const taskElement = createTicket(tasksArray[i], title);
    card.insertBefore(taskElement, card.lastElementChild.nextSibling);
  }

  main.insertBefore(card, addCardBtn);
}

addCardBtn.addEventListener("click", () => {
  const cardTitle = prompt("Enter card name:");

  if (!cardTitle) return;

  const newCard = createCard(cardTitle);

  main.insertBefore(newCard, addCardBtn);
});
