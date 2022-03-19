// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editId = "";

// ****** EVENT LISTENERS **********
// load items
window.addEventListener("DOMContentLoaded", setupItems);

// clear items
clearBtn.addEventListener("click", clearItems);
// form events
form.addEventListener("submit", addItem);
// ****** FUNCTIONS **********
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;

    //create a unique id without using an external library
    const id = new Date().getTime().toString();
    if (value !== "" && editFlag === false) {
        displayItem(id, value);
        // display alert
        displayAlert("item added", "success");
        //show container
        container.classList.add("show-container");
        // add to local storage
        addToLocalStorage(id, value);
        //set back to default
        setBackToDefault();
    } else if (value !== "" && editFlag === true) {
        editElement.innerHTML = value;
        displayAlert("value changed", "success");
        //edit local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    } else {
        displayAlert("please enter value", "danger");
    }
}

// delete function
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    console.log(id);
    list.removeChild(element);
    //hide the container
    if (list.children.length == 0) {
        container.classList.remove("show-container");
    }
    displayAlert("item removed", "danger");
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    //set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";
}

// display alert
function displayAlert(text, action) {
    alert.classList.add(`alert-${action}`);
    alert.textContent = text;
    //remove alert
    setTimeout(function () {
        alert.classList.remove(`alert-${action}`);
        alert.textContent = "";
    }, 2000);
}
//clear items
function clearItems() {
    const items = document.querySelectorAll(".grocery-item");

    if (items.length > 0) {
        items.forEach(function (item) {
            list.removeChild(item);
        });
    }
    container.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
}

// set back to default
function setBackToDefault() {
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

// ****** LOCAL STORAGE **********

function getLocalStorage() {
    return localStorage.getItem("list")
        ? JSON.parse(localStorage.getItem("list"))
        : [];
}
function addToLocalStorage(id, value) {
    const grocery = { id: id, value: value };
    let items = getLocalStorage();
    items.push(grocery);
    setLocalStorage(items);
}

function removeFromLocalStorage(id) {
    const items = getLocalStorage();
    const index = items.forEach(function (item, index) {
        if (item.id === id) {
            return index;
        }
    });
    items.splice(index, 1);
    setLocalStorage(items);
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    setLocalStorage(items);
}

function setLocalStorage(items) {
    localStorage.setItem("list", JSON.stringify(items));
}
// ****** SETUP ITEMS **********
//load items from local storage
function setupItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        container.classList.add("show-container");
        items.forEach(function (item) {
            displayItem(item.id, item.value);
        });
    }
}
function displayItem(id, value) {
    container.classList.add("show-container");
    const element = document.createElement("article");
    // add class to element
    element.classList.add("grocery-item");
    // add id to element
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    //create HTML node from element
    element.innerHTML = `<p class="title">${value}</p>
                        <div class="btn-container">
                            <button type="button" class="edit-btn">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="delete-btn">
                                <i class="fas fa-trash"></i>
                            </button>
                            </div>`;

    //edit event Listener
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
    //delete event Listener
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    // append child
    list.appendChild(element);
}
