```javascript id="q8l2ka"
// =========================================
// 🌌 JUPITER CORE v4.0
// =========================================

// =========================================
// STORAGE
// =========================================

const STORAGE = {

  tasks: "jupiter.tasks.v4",
  calls: "jupiter.calls.v4",
  bases: "jupiter.bases.v4"

};

// =========================================
// DATA
// =========================================

let tasks =
  JSON.parse(localStorage.getItem(STORAGE.tasks)) || [];

let calls =
  JSON.parse(localStorage.getItem(STORAGE.calls)) || [];

let bases =
  JSON.parse(localStorage.getItem(STORAGE.bases)) || [
    {
      id: crypto.randomUUID(),
      title: "Checklist Abertura UO",
      items: [
        "Verificar câmeras",
        "Testar PABX",
        "Checar SAT",
        "Validar TOTEM"
      ]
    },
    {
      id: crypto.randomUUID(),
      title: "Infraestrutura",
      items: [
        "Verificar switch",
        "Checar internet",
        "Monitorar servidores"
      ]
    }
  ];

// =========================================
// HELPERS
// =========================================

function saveAll() {

  localStorage.setItem(
    STORAGE.tasks,
    JSON.stringify(tasks)
  );

  localStorage.setItem(
    STORAGE.calls,
    JSON.stringify(calls)
  );

  localStorage.setItem(
    STORAGE.bases,
    JSON.stringify(bases)
  );

}

function formatDate(date) {

  if (!date) return "-";

  return new Date(date)
    .toLocaleDateString("pt-BR");

}

function createId() {

  return crypto.randomUUID();

}

// =========================================
// STATUS STYLE
// =========================================

function getStatusClass(status) {

  switch (status) {

    case "Concluído":
      return "status-done";

    case "Pausado":
      return "status-pause";

    case "Parado":
      return "status-stop";

    default:
      return "status-progress";

  }

}

// =========================================
// TASKS
// =========================================

function addTask() {

  const title =
    document
      .getElementById("taskTitle")
      .value
      .trim();

  const description =
    document
      .getElementById("taskDescription")
      .value
      .trim();

  const status =
    document
      .getElementById("taskStatus")
      .value;

  const priority =
    document
      .getElementById("taskPriority")
      .value;

  const category =
    document
      .getElementById("taskCategory")
      .value
      .trim();

  const date =
    document
      .getElementById("taskDate")
      .value;

  if (!title) {

    alert("Digite um título.");
    return;

  }

  const task = {

    id: createId(),

    title,
    description,
    status,
    priority,
    category,
    date,

    createdAt:
      new Date().toISOString(),

    checklist: []

  };

  tasks.unshift(task);

  saveAll();

  renderTasks();
  renderKPIs();
  renderCalendar();

  clearTaskForm();

}

function clearTaskForm() {

  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskCategory").value = "";
  document.getElementById("taskDate").value = "";

}

function deleteTask(id) {

  tasks = tasks.filter(
    task => task.id !== id
  );

  saveAll();

  renderTasks();
  renderKPIs();
  renderCalendar();

}

function changeTaskStatus(id) {

  const task =
    tasks.find(t => t.id === id);

  if (!task) return;

  const nextStatus =
    prompt(
      "Novo status:\n\nEm andamento\nPausado\nParado\nConcluído",
      task.status
    );

  if (!nextStatus) return;

  task.status = nextStatus;

  saveAll();

  renderTasks();
  renderKPIs();
  renderCalendar();

}

function renderTasks() {

  const taskList =
    document.getElementById("taskList");

  taskList.innerHTML = "";

  const search =
    document
      .getElementById("searchTask")
      .value
      .toLowerCase();

  const filtered =
    tasks.filter(task => {

      return (
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search)
      );

    });

  if (!filtered.length) {

    taskList.innerHTML = `
      <p style="color:var(--muted)">
        Nenhuma tarefa encontrada.
      </p>
    `;

    return;

  }

  filtered.forEach(task => {

    const card =
      document.createElement("div");

    card.className = "task-card";

    card.innerHTML = `

      <div class="task-top">

        <div class="task-title">
          ${task.title}
        </div>

        <div class="task-status ${getStatusClass(task.status)}">
          ${task.status}
        </div>

      </div>

      <p style="color:var(--muted)">
        ${task.description || "Sem descrição"}
      </p>

      <div class="task-meta">

        <div class="meta-pill">
          📅 ${formatDate(task.date)}
        </div>

        <div class="meta-pill">
          ⚡ ${task.priority}
        </div>

        <div class="meta-pill">
          🏷️ ${task.category || "Sem categoria"}
        </div>

      </div>

      <div
        style="
          display:flex;
          gap:10px;
          margin-top:16px;
        "
      >

        <button
          class="primary-btn small"
          onclick="changeTaskStatus('${task.id}')"
        >
          Status
        </button>

        <button
          class="action-btn"
          onclick="deleteTask('${task.id}')"
        >
          <i class="fa-solid fa-trash"></i>
        </button>

      </div>

    `;

    taskList.appendChild(card);

  });

}

// =========================================
// KPI
// =========================================

function renderKPIs() {

  const total =
    tasks.length;

  const done =
    tasks.filter(
      t => t.status === "Concluído"
    ).length;

  const pending =
    tasks.filter(
      t => t.status !== "Concluído"
    ).length;

  const openCalls =
    calls.filter(
      c => c.status !== "Finalizado"
    ).length;

  document.getElementById("kpiTotal")
    .textContent = total;

  document.getElementById("kpiDone")
    .textContent = done;

  document.getElementById("kpiPending")
    .textContent = pending;

  document.getElementById("kpiCalls")
    .textContent = openCalls;

}

// =========================================
// CALENDAR
// =========================================

let currentWeek =
  new Date();

function renderCalendar() {

  const calendar =
    document.getElementById("weekCalendar");

  calendar.innerHTML = "";

  const start =
    startOfWeek(currentWeek);

  for (let i = 0; i < 7; i++) {

    const day =
      new Date(start);

    day.setDate(
      start.getDate() + i
    );

    const iso =
      day.toISOString().split("T")[0];

    const dayTasks =
      tasks.filter(
        task => task.date === iso
      );

    const dayCard =
      document.createElement("div");

    dayCard.className =
      "calendar-day";

    dayCard.innerHTML = `

      <h4>
        ${day.toLocaleDateString(
          "pt-BR",
          {
            weekday: "short",
            day: "2-digit"
          }
        )}
      </h4>

    `;

    dayTasks.forEach(task => {

      const taskDiv =
        document.createElement("div");

      taskDiv.className =
        "calendar-task";

      taskDiv.innerHTML =
        task.title;

      dayCard.appendChild(taskDiv);

    });

    calendar.appendChild(dayCard);

  }

}

function startOfWeek(date) {

  const d =
    new Date(date);

  const day =
    d.getDay();

  const diff =
    d.getDate() - day + (day === 0 ? -6 : 1);

  d.setDate(diff);

  return d;

}

// =========================================
// BASES
// =========================================

function renderBases() {

  const container =
    document.getElementById("baseContainer");

  container.innerHTML = "";

  bases.forEach(base => {

    const card =
      document.createElement("div");

    card.className =
      "base-card";

    card.innerHTML = `

      <h4>${base.title}</h4>

      <div>

        ${base.items.map(item => `

          <div class="base-item">

            <input type="checkbox"/>

            <span>${item}</span>

          </div>

        `).join("")}

      </div>

    `;

    container.appendChild(card);

  });

}

// =========================================
// CALLS
// =========================================

function addCall() {

  const number =
    document
      .getElementById("callNumber")
      .value
      .trim();

  const description =
    document
      .getElementById("callDescription")
      .value
      .trim();

  const status =
    document
      .getElementById("callStatus")
      .value;

  if (!number || !description) {

    alert("Preencha os campos.");
    return;

  }

  const call = {

    id: createId(),

    number,
    description,
    status,

    createdAt:
      new Date().toISOString()

  };

  calls.unshift(call);

  saveAll();

  renderCalls();
  renderKPIs();

  clearCallForm();

}

function clearCallForm() {

  document.getElementById("callNumber").value = "";
  document.getElementById("callDescription").value = "";

}

function deleteCall(id) {

  calls = calls.filter(
    c => c.id !== id
  );

  saveAll();

  renderCalls();
  renderKPIs();

}

function renderCalls() {

  const list =
    document.getElementById("callList");

  list.innerHTML = "";

  if (!calls.length) {

    list.innerHTML = `
      <p style="color:var(--muted)">
        Nenhum chamado aberto.
      </p>
    `;

    return;

  }

  calls.forEach(call => {

    const card =
      document.createElement("div");

    card.className =
      "call-card";

    card.innerHTML = `

      <div
        style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:10px;
        "
      >

        <strong>
          #${call.number}
        </strong>

        <div class="
          task-status
          ${getStatusClass(call.status)}
        ">
          ${call.status}
        </div>

      </div>

      <p style="color:var(--muted)">
        ${call.description}
      </p>

      <div
        style="
          margin-top:16px;
          display:flex;
          justify-content:space-between;
          align-items:center;
        "
      >

        <small style="color:var(--muted)">
          ${formatDate(call.createdAt)}
        </small>

        <button
          class="action-btn"
          onclick="deleteCall('${call.id}')"
        >
          <i class="fa-solid fa-trash"></i>
        </button>

      </div>

    `;

    list.appendChild(card);

  });

}

// =========================================
// EVENTS
// =========================================

document
  .getElementById("addTaskBtn")
  .addEventListener(
    "click",
    addTask
  );

document
  .getElementById("addCallBtn")
  .addEventListener(
    "click",
    addCall
  );

document
  .getElementById("searchTask")
  .addEventListener(
    "input",
    renderTasks
  );

document
  .getElementById("prevWeek")
  .addEventListener(
    "click",
    () => {

      currentWeek.setDate(
        currentWeek.getDate() - 7
      );

      renderCalendar();

    }
  );

document
  .getElementById("nextWeek")
  .addEventListener(
    "click",
    () => {

      currentWeek.setDate(
        currentWeek.getDate() + 7
      );

      renderCalendar();

    }
  );

// =========================================
// INIT
// =========================================

function init() {

  renderTasks();
  renderCalls();
  renderKPIs();
  renderCalendar();
  renderBases();

}

init();
```
