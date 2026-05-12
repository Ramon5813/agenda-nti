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
// =====================================
// MENU / PAGES
// =====================================

const menuButtons =
  document.querySelectorAll(".menu");

const pages =
  document.querySelectorAll(".page");

menuButtons.forEach(button => {

  button.addEventListener("click", () => {

    // REMOVE ACTIVE MENU
    menuButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    // ADD ACTIVE MENU
    button.classList.add("active");

    // PAGE ID
    const pageId =
      button.dataset.page;

    // HIDE PAGES
    pages.forEach(page => {
      page.classList.remove("active-page");
    });

    // SHOW PAGE
    document
      .getElementById(pageId)
      .classList
      .add("active-page");

  });

});

/* ================================= */
/* CALENDAR */
/* ================================= */

.calendar-section {

  display: grid;

  grid-template-columns: 2fr 1fr;

  gap: 20px;

  margin-top: 25px;

}

.calendar-top {

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 20px;

}

.calendar-top button {

  width: 45px;
  height: 45px;

  border: none;

  border-radius: 12px;

  cursor: pointer;

  background:
    linear-gradient(
      135deg,
      #3b82f6,
      #8b5cf6
    );

  color: white;

  font-size: 18px;

}

.calendar-weekdays {

  display: grid;

  grid-template-columns: repeat(7,1fr);

  gap: 10px;

  margin-bottom: 10px;

}

.calendar-weekdays div {

  text-align: center;

  color: #94a3b8;

  font-size: 14px;

}

.calendar-grid {

  display: grid;

  grid-template-columns: repeat(7,1fr);

  gap: 10px;

}

.calendar-day {

  min-height: 100px;

  background: rgba(255,255,255,0.03);

  border: 1px solid rgba(255,255,255,0.08);

  border-radius: 16px;

  padding: 10px;

  cursor: pointer;

  transition: 0.25s;

  position: relative;

}

.calendar-day:hover {

  transform: translateY(-2px);

  background: rgba(255,255,255,0.06);

}

.calendar-day-number {

  font-size: 14px;

  color: #94a3b8;

}

.calendar-day.active-day {

  border:
    2px solid #3b82f6;

}

.calendar-event-dot {

  width: 8px;
  height: 8px;

  border-radius: 999px;

  background: #8b5cf6;

  margin-top: 6px;

}

/* ================================= */
/* EVENTS */
/* ================================= */

#eventList {

  margin-top: 20px;

}

.event-card {

  background: rgba(255,255,255,0.04);

  border: 1px solid rgba(255,255,255,0.08);

  border-radius: 16px;

  padding: 15px;

  margin-bottom: 15px;

}

.event-card h4 {

  margin-bottom: 8px;

}

.event-card p {

  color: #94a3b8;

  margin-bottom: 10px;

}

.event-card button {

  border: none;

  padding: 10px 14px;

  border-radius: 10px;

  cursor: pointer;

  background:
    rgba(255,255,255,0.08);

  color: white;

}

/* ================================= */
/* RESPONSIVO */
/* ================================= */

@media(max-width: 1100px){

  .calendar-section {

    grid-template-columns: 1fr;

  }

}

@media(max-width: 700px){

  .calendar-grid {

    gap: 6px;

  }

  .calendar-day {

    min-height: 80px;

    padding: 6px;

  }

}
