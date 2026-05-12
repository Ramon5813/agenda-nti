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

const kpiTotal =
  document.getElementById("kpiTotal");

const kpiDone =
  document.getElementById("kpiDone");

const kpiPending =
  document.getElementById("kpiPending");

/* ================================= */
/* CALENDÁRIO */
/* ================================= */

const calendarGrid =
  document.getElementById("calendarGrid");

const monthTitle =
  document.getElementById("monthTitle");

const prevMonth =
  document.getElementById("prevMonth");

const nextMonth =
  document.getElementById("nextMonth");

const eventTitle =
  document.getElementById("eventTitle");

const eventDescription =
  document.getElementById("eventDescription");

const addEventBtn =
  document.getElementById("addEventBtn");

const eventList =
  document.getElementById("eventList");

/* ================================= */
/* DATA */
/* ================================= */

let currentDate =
  new Date();

let selectedDate =
  new Date();

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

      statusClass = "status-pause";

    }

    if(task.status === "Concluído"){

      statusClass = "status-done";

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

        <button onclick="deleteTask('${task.id}')">

          Excluir

        </button>

      </div>

    `;

    taskList.appendChild(div);

  });

  updateKpis();

}

function addTask(){

  if(taskTitle.value.trim() === ""){

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
      task => task.id != id
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
    tasks.filter(
      task =>
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

  for(let i = 0; i < firstDay; i++){

    const empty =
      document.createElement("div");

    calendarGrid.appendChild(empty);

  }

  for(let day = 1; day <= daysInMonth; day++){

    const div =
      document.createElement("div");

    div.className =
      "calendar-day";

    const fullDate =
      `${year}-${month+1}-${day}`;

    div.innerHTML = `

      <div class="calendar-day-number">

        ${day}

      </div>

    `;

    const hasEvent =
      events.some(
        event =>
          event.date === fullDate
      );

    if(hasEvent){

      const dot =
        document.createElement("div");

      dot.className =
        "calendar-event-dot";

      div.appendChild(dot);

    }

    div.addEventListener(
      "click",
      () => {

        selectedDate =
          fullDate;

        renderEvents();

        document
          .querySelectorAll(
            ".calendar-day"
          )
          .forEach(day => {

            day.classList.remove(
              "active-day"
            );

          });

        div.classList.add(
          "active-day"
        );

      }
    );

    calendarGrid.appendChild(div);

  }

}

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

      <button
        onclick="deleteEvent('${event.id}')"
      >

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

  renderEvents();

  renderCalendar();

  eventTitle.value = "";
  eventDescription.value = "";

}

function deleteEvent(id){

  events =
    events.filter(
      event =>
        event.id != id
    );

  saveEvents();

  renderEvents();

  renderCalendar();

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
