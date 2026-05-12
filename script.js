// ======================================
// 🌌 JUPITER CORE
// ======================================

// STORAGE
const STORAGE_KEY = "jupiter.tasks";

// ARRAY
let tasks =
  JSON.parse(
    localStorage.getItem(STORAGE_KEY)
  ) || [];

// ======================================
// ELEMENTOS
// ======================================

const taskTitle =
  document.getElementById("taskTitle");

const taskDescription =
  document.getElementById("taskDescription");

const taskStatus =
  document.getElementById("taskStatus");

const addTaskBtn =
  document.getElementById("addTaskBtn");

const taskList =
  document.getElementById("taskList");

const searchInput =
  document.getElementById("searchInput");

// KPI
const kpiTotal =
  document.getElementById("kpiTotal");

const kpiDone =
  document.getElementById("kpiDone");

const kpiPending =
  document.getElementById("kpiPending");

// ======================================
// SAVE
// ======================================

function saveTasks() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tasks)
  );

}

// ======================================
// STATUS STYLE
// ======================================

function getStatusClass(status) {

  switch(status){

    case "Concluído":
      return "status-done";

    case "Pausado":
      return "status-pause";

    default:
      return "status-progress";

  }

}

// ======================================
// ADD TASK
// ======================================

function addTask() {

  const title =
    taskTitle.value.trim();

  const description =
    taskDescription.value.trim();

  const status =
    taskStatus.value;

  if(!title){

    alert("Digite um título.");
    return;

  }

  const task = {

    id: Date.now(),

    title,
    description,
    status,

    createdAt:
      new Date().toISOString()

  };

  tasks.unshift(task);

  saveTasks();

  renderTasks();

  updateKPIs();

  clearForm();

}

// ======================================
// CLEAR FORM
// ======================================

function clearForm(){

  taskTitle.value = "";
  taskDescription.value = "";

  taskStatus.value =
    "Em andamento";

}

// ======================================
// DELETE TASK
// ======================================

function deleteTask(id){

  tasks =
    tasks.filter(
      task => task.id !== id
    );

  saveTasks();

  renderTasks();

  updateKPIs();

}

// ======================================
// CHANGE STATUS
// ======================================

function changeStatus(id){

  const task =
    tasks.find(
      task => task.id === id
    );

  if(!task) return;

  if(task.status === "Em andamento"){

    task.status = "Pausado";

  }

  else if(task.status === "Pausado"){

    task.status = "Concluído";

  }

  else {

    task.status = "Em andamento";

  }

  saveTasks();

  renderTasks();

  updateKPIs();

}

// ======================================
// RENDER TASKS
// ======================================

function renderTasks(){

  taskList.innerHTML = "";

  const search =
    searchInput.value.toLowerCase();

  const filteredTasks =
    tasks.filter(task => {

      return (

        task.title
          .toLowerCase()
          .includes(search)

        ||

        task.description
          .toLowerCase()
          .includes(search)

      );

    });

  if(filteredTasks.length === 0){

    taskList.innerHTML = `
      <p style="
        color:#94a3b8;
      ">
        Nenhuma tarefa encontrada.
      </p>
    `;

    return;

  }

  filteredTasks.forEach(task => {

    const div =
      document.createElement("div");

    div.className = "task";

    div.innerHTML = `

      <div class="task-top">

        <div class="task-title">
          ${task.title}
        </div>

        <div class="
          task-status
          ${getStatusClass(task.status)}
        ">
          ${task.status}
        </div>

      </div>

      <p>
        ${task.description || "Sem descrição"}
      </p>

      <div class="task-buttons">

        <button
          onclick="changeStatus(${task.id})"
        >
          Alterar status
        </button>

        <button
          onclick="deleteTask(${task.id})"
        >
          Excluir
        </button>

      </div>

    `;

    taskList.appendChild(div);

  });

}

// ======================================
// KPIS
// ======================================

function updateKPIs(){

  const total =
    tasks.length;

  const done =
    tasks.filter(
      task =>
        task.status === "Concluído"
    ).length;

  const pending =
    tasks.filter(
      task =>
        task.status !== "Concluído"
    ).length;

  kpiTotal.textContent =
    total;

  kpiDone.textContent =
    done;

  kpiPending.textContent =
    pending;

}

// ======================================
// EVENTS
// ======================================

addTaskBtn.addEventListener(
  "click",
  addTask
);

searchInput.addEventListener(
  "input",
  renderTasks
);

// ======================================
// INIT
// ======================================

renderTasks();

updateKPIs();
