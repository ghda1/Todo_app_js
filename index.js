let tasks = [];

const taskElement = document.getElementById("todo");
const descriptionElement = document.getElementById("description");
const addButtonElement = document.getElementById("add-task");
const formElement = document.getElementById("todo-form");
const tasksList = document.getElementById("tasks-list");
const notificationElement = document.getElementById("notification");
const totalElement = document.getElementById("total");
const searchElement = document.getElementById("search-task");

let isEditing = false;
let taskBeingEdited = null;

function updateTotalTasks() {
  totalElement.textContent = "Total Tasks: " + tasks.length;
}

function renderTasks(tasks) {
  tasksList.innerHTML = "";
  tasks.forEach((task) => {
    const list = document.createElement("li");
    list.textContent = `${task.toDo}: ${task.description}`;
    list.classList.add("task");

    const checkBoxElement = document.createElement("input");
    checkBoxElement.setAttribute("type", "checkbox");
    checkBoxElement.checked = task.completed;

    checkBoxElement.addEventListener("change", () => {
      task.completed = checkBoxElement.checked;
      setTasksToLocalStorage(tasks);
    });

    const deleteButtonElement = document.createElement("button");
    deleteButtonElement.classList.add("delete-btn");
    deleteButtonElement.textContent = `Delete`;
    deleteButtonElement.addEventListener("click", () => deletTaskById(task.id));

    const editButtonElement = document.createElement("button");
    editButtonElement.classList.add("edit-btn");
    editButtonElement.textContent = `Edit`;
    editButtonElement.addEventListener("click", () => editTaskById(task.id));

    tasksList.appendChild(list);
    tasksList.appendChild(checkBoxElement);
    tasksList.appendChild(deleteButtonElement);
    tasksList.appendChild(editButtonElement);
  });

  updateTotalTasks();
}

function resetValues() {
  taskElement.value = "";
  descriptionElement.value = "";
  addButtonElement.textContent = "Add Task";
  isEditing = false;
  taskBeingEdited = null;
}

function deletTaskById(id) {
  tasks = tasks.filter((task) => task.id !== id);
  setTasksToLocalStorage(tasks);
  notificationElement.textContent = "Task Deleted";
  setTimeout(() => {
    notificationElement.textContent = "";
  }, 1000);
  renderTasks(tasks);
}

function editTaskById(id) {
  const findTask = tasks.find((task) => task.id === id);

  taskElement.value = findTask.toDo;
  descriptionElement.value = findTask.description;
  addButtonElement.textContent = "Save Update";
  isEditing = true;
  taskBeingEdited = findTask;
}

function setTasksToLocalStorage(data) {
  localStorage.setItem("tasks", JSON.stringify(data));
}

formElement.addEventListener("submit", (event) => {
  event.preventDefault();

  if (isEditing) {
    taskBeingEdited.toDo = taskElement.value;
    taskBeingEdited.description = descriptionElement.value;
    setTasksToLocalStorage(tasks);

    notificationElement.textContent = "Task Updated";
    setTimeout(() => {
      notificationElement.textContent = "";
    }, 1000);
  } else {
    const newTask = {
      id: Date.now() + Math.random(),
      toDo: taskElement.value,
      description: descriptionElement.value,
      completed: false,
    };

    tasks.push(newTask);
    setTasksToLocalStorage(tasks);

    notificationElement.textContent = "New Task Added";
    setTimeout(() => {
      notificationElement.textContent = "";
    }, 1000);
  }

  resetValues();
  renderTasks(tasks);
});

searchElement.addEventListener("keyup", (event) => {
  event.preventDefault();
  const searchValue = event.target.value.toLowerCase();
  var filterResult = tasks.filter((task) =>
    task.toDo.toLowerCase().includes(searchValue)
  );
  renderTasks(filterResult);
});

document.addEventListener("DOMContentLoaded", () => {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks(tasks);
  updateTotalTasks();
});
