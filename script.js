// Default todo list key for global usage
let globalTodo = JSON.parse(localStorage.getItem("todo")) || [];

// Get the day from the query parameters (default to "Default" if no day is provided)
const params = new URLSearchParams(window.location.search);
const currentDay = params.get("day") || "Default";
const todoKey = `todo-${currentDay}`;

// Retrieve day-specific todo list or initialize an empty array
let todo = JSON.parse(localStorage.getItem(todoKey)) || [];

// DOM Elements
const todoInput = document.getElementById("toDoInput");
const todoList = document.getElementById("toDoList");
const todoCount = document.getElementById("toDoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");

// Initialize
document.addEventListener("DOMContentLoaded", function () { 
  // Update header to reflect the day
  const header = document.querySelector("h2");
  header.textContent = `To-Do List for Day ${currentDay}`;

  addButton.addEventListener("click", addTask);
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents default Enter key behavior
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);
  displayTasks();
});

function addTask() {
  const newTask = todoInput.value.trim();
  if (newTask !== "") {
    todo.push({ text: newTask, disabled: false });
    saveToLocalStorage();
    todoInput.value = "";
    displayTasks();
  }
}

function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    const p = document.createElement("p");
    p.innerHTML = `
      <div class="todo-container">
        <input type="checkbox" class="todo-checkbox" id="input-${index}" ${
      item.disabled ? "checked" : ""
    }>
        <p id="todo-${index}" class="${
      item.disabled ? "disabled" : ""
    }" onclick="editTask(${index})">${item.text}</p>
      </div>
    `;
    p.querySelector(".todo-checkbox").addEventListener("change", () =>
      toggleTask(index)
    );
    todoList.appendChild(p);
  });
  todoCount.textContent = todo.length;
}

function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`);
  const existingText = todo[index].text;
  const inputElement = document.createElement("input");

  inputElement.value = existingText;
  todoItem.replaceWith(inputElement);
  inputElement.focus();

  inputElement.addEventListener("blur", function () {
    const updatedText = inputElement.value.trim();
    if (updatedText) {
      todo[index].text = updatedText;
      saveToLocalStorage();
    }
    displayTasks();
  });
}

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayTasks();
}

function deleteAllTasks() {
  todo = [];
  saveToLocalStorage();
  displayTasks();
}

function saveToLocalStorage() {
  localStorage.setItem(todoKey, JSON.stringify(todo));
}
