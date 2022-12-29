const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
console.log(backlogList);
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;
// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    //JSON.parse() converts web server data into a JS object
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}
getSavedColumns();
//filter arrays to remove empty items
const filterArray = (array) => {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
};
// Set localStorage Arrays
function updateSavedColumns() {
  //The localStorage allows you to access data saved across browser sessions. LocalStorage has no expiration time
  //localStorage.setItem(keyName,keyValue) accesses the current domain's local storage and adds a data item to it
  //keyName is a string containing the name of the key you want to create
  //JSON.stringify converts any object into a string JSON
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  arrayNames.forEach((arr, index) => {
    localStorage.setItem(`${arr}Items`, JSON.stringify(listArrays[index]));
  });
}
updateSavedColumns();

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)"); //sets the attribute ondragstart="drag(event)"
  listEl.setAttribute("contenteditable", "true");
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index},${column})`);
  //Append
  columnEl.appendChild(listEl);
  //.appendChild() adds a node to the end of the list of children of a specified parent node
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}
//allow arrays to reflect drag and drop items
const rebuildArrays = () => {
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
};
//when item starts dragging
const drag = (event) => {
  draggedItem = event.target;
};
//Column Allows for Item to Drop
const allowDrop = (event) => {
  //have to use event not 'e'
  event.preventDefault();
};
//when item enters column area
const dragEnter = (column) => {
  listColumns.forEach((item) => item.classList.remove("over"));
  listColumns[column].classList.add("over");
  currentColumn = column;
};
// Dropping Item in Column
const drop = (event) => {
  event.preventDefault();
  console.log("ondrop fired");
  //remove background color/padding
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  // add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  rebuildArrays();
};
//Add to Column List, Reset Textbox
const addToColumn = (column) => {
  console.log(addItems[column].textContent);
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
};

//show add item input box
const showInputBox = (column) => {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
};
//hide add item input box
const hideInputBox = (column) => {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
};
//On Load
updateDOM();

//update item- delete if necessary, or update array value
const updateItem = (id, column) => {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;

  console.log(selectedColumnEl[id].textContent);
  console.log(selectedArray);
  if (!selectedColumnEl[id].textContent) {
    delete selectedArray[id];
  }
  3;
  updateDOM();
};
