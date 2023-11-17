// getting todos from storage
function getTodosFromStorage() {
  return JSON.parse(localStorage.getItem("todos"));
}

//first time setting todos to an empty array
let todos = getTodosFromStorage();

if (!todos) {
  localStorage.setItem("todos", "[]");
}

// getting sections
const tabs = document.querySelectorAll(".sections_items");

// getting view
const view = document.querySelector(".view");

function showView(html) {
  view.innerHTML = html;
}

// read all
function getTodosAndReturnHtml() {
  let todos = getTodosFromStorage();
  if (todos.length == 0) {
    return "<p>No Task Found</p>";
  }
  let html = todos
    .map((todo) => {
      return `<div class="todo flex items-center justify-between">
        <h2>${todo.title}</h2>
        <div class="flex items-center gap-2">
        <img width=20px" height="20px" src="/assests/editIcon.svg"/ alt="edit" onclick="editTodo('${
          todo.id
        }','1')">
        ${
          todo.status == "active"
            ? `<input type="checkbox" class="myCheckbox" onchange="updateAndUpdateTheTab('1','${todo.id}')">`
            : `<input type="checkbox" class="myCheckbox" checked onchange="updateAndUpdateTheTab('1','${todo.id}')">`
        }
        </div>
    </div>`;
    })
    .join(" ");
  return html;
}

// read active
function getActiveTodosReturnHtml() {
  let todos = getTodosFromStorage();
  let activeTodos = todos.filter((todo) => todo.status == "active");
  if (activeTodos.length == 0) {
    return "<p>No Pending Found</p>";
  }
  let html = activeTodos
    .map((todo) => {
      return `<div class="todo flex items-center justify-between">
      <h2>${todo.title}</h2>
      <input type="checkbox" class="myCheckbox" onchange="updateAndUpdateTheTab('2','${todo.id}')">
  </div>`;
    })
    .join(" ");
  return html;
}

// read completed
function getComTodosAndReturnHtml() {
  let todos = getTodosFromStorage();
  let doneTodos = todos.filter((todo) => todo.status == "done");
  if (doneTodos.length == 0) {
    return "<p>No Task is Completed</p>";
  }
  let html = doneTodos
    .map((todo) => {
      return `<div class="todo flex items-center justify-between">
      <h2>${todo.title}</h2>
      <div class="flex items-center gap-2">
       <img width=20px" height="20px" src="/assests/deleteIcon.svg"/ alt="delete" onclick="delteTodo('${todo.id}')">
      <input type="checkbox" class="myCheckbox" checked onchange="updateAndUpdateTheTab('3','${todo.id}')">
      </div>
  </div>`;
    })
    .join(" ");
  return html;
}

// getting input_box & getting create buttton
const InputBox = document.querySelector(".input__box");
const createButton = document.querySelector(".btn");

function createTodo() {
  let todoText = InputBox.value;
  if (!todoText || todoText == "") {
    return alert("Todo can't be empty!!!");
  }
  let newTodo = {
    id: generateUniqueID(),
    title: todoText,
    status: "active",
    createdAt: new Date(),
  };

  let lastTodos = getTodosFromStorage();
  lastTodos.push(newTodo);

  localStorage.setItem("todos", JSON.stringify(lastTodos));
  InputBox.value = "";
  alert("task added");
  showView(getTodosAndReturnHtml());
  switchTabAction("1");
}

window.addEventListener("DOMContentLoaded", () => {
  tabs[0].classList.add("active");
  showView(getTodosAndReturnHtml());
});

function switchTabAction(id) {
  tabs.forEach((tab) => {
    tab.classList.remove("active");
    if (tab.dataset.id == id) {
      tab.classList.add("active");
    }
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    let tab_id = e.target.dataset.id;
    switch (tab_id) {
      case "1":
        switchTabAction(tab_id);
        showView(getTodosAndReturnHtml());
        break;
      case "2":
        getActiveTodosReturnHtml();
        switchTabAction(tab_id);
        showView(getActiveTodosReturnHtml());
        break;
      case "3":
        switchTabAction(tab_id);
        showView(getComTodosAndReturnHtml());
    }
  });
});

function generateUniqueID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

window.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    let btnType = createButton.dataset.type;
    if (btnType == "create") {
      createTodo();
    } else {
      let newTitle = InputBox.value;
      if (!newTitle) {
        return alert("title can't be empty");
      } else {
        let todos = getTodosFromStorage();
        let targetTodo = todos.filter(
          (todo) => todo.id == createButton.dataset.id
        )[0];
        targetTodo.title = newTitle;
        localStorage.setItem("todos", JSON.stringify(todos));
        updateTab(createButton.dataset.tabId);
        setBtntoCreateMode();
      }
    }
  }
});

createButton.addEventListener("click", (e) => {
  let btnType = createButton.dataset.type;
  if (btnType == "create") {
    createTodo();
  } else {
    let newTitle = InputBox.value;
    if (!newTitle) {
      return alert("title can't be empty");
    } else {
      let todos = getTodosFromStorage();
      let targetTodo = todos.filter(
        (todo) => todo.id == createButton.dataset.id
      )[0];
      targetTodo.title = newTitle;
      localStorage.setItem("todos", JSON.stringify(todos));
      updateTab(createButton.dataset.tabId);
      setBtntoCreateMode();
    }
  }
});

// update and update the current tab

function updateAndUpdateTheTab(tab_id, task_id) {
  let todos = getTodosFromStorage();
  let target = todos.filter((todo) => todo.id == task_id)[0];

  if (target.status == "active") {
    target.status = "done";
  } else {
    target.status = "active";
  }

  localStorage.setItem("todos", JSON.stringify(todos));

  updateTab(tab_id);
}

function updateTab(tab_number) {
  if (tab_number == "1") {
    showView(getTodosAndReturnHtml());
  } else if (tab_number == "2") {
    showView(getActiveTodosReturnHtml());
  } else {
    showView(getComTodosAndReturnHtml());
  }
}

//delteTodo
function delteTodo(id) {
  let todos = getTodosFromStorage();
  let otherTodos = todos.filter((todo) => todo.id != id);
  localStorage.setItem("todos", JSON.stringify(otherTodos));
  updateTab("3");
}

//edit todo
function editTodo(id, tab_id) {
  let todos = getTodosFromStorage();
  let target = todos.filter((todo) => todo.id == id)[0];
  InputBox.value = target.title;
  createButton.dataset.type = "edit";
  createButton.innerText = "Update";
  createButton.dataset.id = id;
  createButton.dataset.tabId = tab_id;
}

function setBtntoCreateMode() {
  InputBox.value = "";
  createButton.dataset.type = "create";
  createButton.innerHTML = `<svg
  xmlns="http://www.w3.org/2000/svg"
  height="24"
  viewBox="0 -960 960 960"
  width="24"
  fill="white"
>
  <path
    d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
  />
</svg>
<span>Add Task</span>`;
  createButton.dataset.id = "";
  createButton.dataset.tabId = "";
}
