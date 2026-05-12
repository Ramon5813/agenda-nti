/* ================================= */
/* STORAGE */
/* ================================= */

let tasks =
  JSON.parse(
    localStorage.getItem("tasks")
  ) || [];

let events =
  JSON.parse(
    localStorage.getItem("events")
  ) || [];

/* ================================= */
/* ELEMENTOS */
/* ================================= */

const taskTitle =
  document.querySelector("#taskTitle");

const taskDescription =
  document.querySelector("#taskDescription");

const taskStatus =
  document.querySelector("#taskStatus");

const addTaskBtn =
  document.querySelector("#addTaskBtn");

const taskList =
  document.querySelector("#taskList");

const searchInput =
  document.querySelector("#searchInput");

const kpiTotal =
  document.querySelector("#kpiTotal");

const kpiDone =
  document.querySelector("#kpiDone");

const kpiPending =
  document.querySelector("#kpiPending");

/* ================================= */
/* CALENDÁRIO */
/* ================================= */

const calendarGrid =
  document.querySelector("#calendarGrid");

const monthTitle =
  document.querySelector("#monthTitle");

const prevMonth =
  document.querySelector("#prevMonth");

const nextMonth =
  document.querySelector("#nextMonth");

const eventTitle =
  document.querySelector("#eventTitle");

const eventDescription =
  document.querySelector("#eventDescription");

const addEventBtn =
  document.querySelector("#addEventBtn");

const eventList =
  document.querySelector("#eventList");

/* ================================= */
/* DATA */
/* ================================= */

let currentDate = new Date();

let selectedDate =
  formatDate(new Date());

/* ================================= */
/* FORMAT DATE */
/* ================================= */

function formatDate(date){

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2,"0");

  const day =
    String(
      date.getDate()
    ).padStart(2,"0");

  return `${year}-${month}-${day}`;

}

/* ================================= */
/* SAVE */
/* ================================= */

function saveTasks(){

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );

}

function saveEvents(){

  localStorage.setItem(
    "events",
    JSON.stringify(events)
  );

}

/* ================================= */
/* TASKS */
/* ================================= */

function renderTasks(){

  taskList.innerHTML = "";

  const search =
    searchInput.value.toLowerCase();

  const filtered =
    tasks.filter(task =>

      task.title
        .toLowerCase()
        .includes(search)

    );

  filtered.forEach(task => {

    const div =
      document.createElement("div");

    div.className = "task";

    let statusClass =
      "status-progress";

    if(task.status === "Pausado"){

      statusClass =
        "status-pause";

    }

    if(task.status === "Concluído"){

      statusClass =
        "status-done";

    }

    div.innerHTML = `

      <div class="task-top">

        <div class="task-title">

          ${task.title}

        </div>

        <div class="task-status ${statusClass}">

          ${task.status}

        </div>

      </div>

      <p>

        ${task.description}

      </p>

      <div class="task-buttons">

        <button onclick="deleteTask(${task.id})">

          Excluir

        </button>

      </div>

    `;

    taskList.appendChild(div);

  });

  updateKpis();

}

function addTask(){

  if(
    taskTitle.value.trim() === ""
  ){

    return;

  }

  const task = {

    id: Date.now(),

    title:
      taskTitle.value,

    description:
      taskDescription.value,

    status:
      taskStatus.value

  };

  tasks.push(task);

  saveTasks();

  renderTasks();

  taskTitle.value = "";

  taskDescription.value = "";

}

function deleteTask(id){

  tasks =
    tasks.filter(
      task => task.id !== id
    );

  saveTasks();

  renderTasks();

}

addTaskBtn.addEventListener(
  "click",
  addTask
);

searchInput.addEventListener(
  "input",
  renderTasks
);

/* ================================= */
/* KPI */
/* ================================= */

function updateKpis(){

  kpiTotal.innerText =
    tasks.length;

  const done =
    tasks.filter(task =>

      task.status ===
      "Concluído"

    ).length;

  kpiDone.innerText =
    done;

  kpiPending.innerText =
    tasks.length - done;

}

/* ================================= */
/* CALENDÁRIO */
/* ================================= */

function renderCalendar(){

  calendarGrid.innerHTML = "";

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const months = [

    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"

  ];

  monthTitle.innerText =
    `${months[month]} ${year}`;

  /* ESPAÇOS VAZIOS */

  for(
    let i = 0;
    i < firstDay;
    i++
  ){

    const empty =
      document.createElement("div");

    calendarGrid.appendChild(empty);

  }

  /* DIAS */

  for(
    let day = 1;
    day <= daysInMonth;
    day++
  ){

    const div =
      document.createElement("div");

    div.className =
      "calendar-day";

    const dateString =
      `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    div.innerHTML = `

      <div class="calendar-day-number">

        ${day}

      </div>

    `;

    /* EVENTOS */

    const hasEvent =
      events.some(
        event =>
          event.date === dateString
      );

    if(hasEvent){

      const dot =
        document.createElement("div");

      dot.className =
        "calendar-event-dot";

      div.appendChild(dot);

    }

    /* DIA ATIVO */

    if(
      selectedDate === dateString
    ){

      div.classList.add(
        "active-day"
      );

    }

    /* CLICK */

    div.addEventListener(
      "click",
      () => {

        selectedDate =
          dateString;

        renderCalendar();

        renderEvents();

      }
    );

    calendarGrid.appendChild(div);

  }

}

/* ================================= */
/* TROCAR MÊS */
/* ================================= */

prevMonth.addEventListener(
  "click",
  () => {

    currentDate.setMonth(
      currentDate.getMonth() - 1
    );

    renderCalendar();

  }
);

nextMonth.addEventListener(
  "click",
  () => {

    currentDate.setMonth(
      currentDate.getMonth() + 1
    );

    renderCalendar();

  }
);

/* ================================= */
/* EVENTOS */
/* ================================= */

function renderEvents(){

  eventList.innerHTML = "";

  const filtered =
    events.filter(
      event =>
        event.date === selectedDate
    );

  filtered.forEach(event => {

    const div =
      document.createElement("div");

    div.className =
      "event-card";

    div.innerHTML = `

      <h4>

        ${event.title}

      </h4>

      <p>

        ${event.description}

      </p>

      <button onclick="deleteEvent(${event.id})">

        Excluir

      </button>

    `;

    eventList.appendChild(div);

  });

}

function addEvent(){

  if(
    eventTitle.value.trim() === ""
  ){

    return;

  }

  const event = {

    id: Date.now(),

    title:
      eventTitle.value,

    description:
      eventDescription.value,

    date:
      selectedDate

  };

  events.push(event);

  saveEvents();

  renderCalendar();

  renderEvents();

  eventTitle.value = "";

  eventDescription.value = "";

}

function deleteEvent(id){

  events =
    events.filter(
      event => event.id !== id
    );

  saveEvents();

  renderCalendar();

  renderEvents();

}

addEventBtn.addEventListener(
  "click",
  addEvent
);

/* ================================= */
/* INIT */
/* ================================= */

renderTasks();

renderCalendar();

renderEvents();
