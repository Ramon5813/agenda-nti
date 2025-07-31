let currentWeekStart = getStartOfWeek(new Date());

document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
});

function addTask() {
  const desc = document.getElementById("taskDesc").value.trim();
  const status = document.getElementById("taskStatus").value;
  const date = document.getElementById("taskDate").value;

  if (!desc || !date) return alert("Preencha a descrição e a data.");

  const tasks = getTasks();
  tasks.push({ id: crypto.randomUUID(), desc, status, date });
  saveTasks(tasks);

  document.getElementById("taskDesc").value = "";
  document.getElementById("taskDate").value = "";
  renderCalendar();
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderCalendar() {
  const calendar = document.getElementById("calendarWeek");
  calendar.innerHTML = "";

  const weekRange = document.getElementById("weekRange");
  const start = new Date(currentWeekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  weekRange.textContent = formatDate(start) + " - " + formatDate(end);

  const tasks = getTasks();

  for (let i = 0; i < 7; i++) {
    const day = new Date(currentWeekStart);
    day.setDate(currentWeekStart.getDate() + i);
    const iso = day.toISOString().split("T")[0];

    const dayTasks = tasks.filter(t => t.date === iso);

    const div = document.createElement("div");
    div.className = "day";

    const dayName = day.toLocaleDateString("pt-BR", { weekday: "long" });
    const dateStr = day.toLocaleDateString("pt-BR");

    div.innerHTML = `<h3>${dayName} - ${dateStr}</h3>`;

    dayTasks.forEach((task) => {
      const taskDiv = document.createElement("div");
      // Classe para cor pelo status
      taskDiv.className = `task ${task.status.toLowerCase().replace(" ", "-")}`;
      taskDiv.dataset.status = task.status;

      // Textarea descrição
      const textarea = document.createElement("textarea");
      textarea.rows = 2;
      textarea.value = task.desc;
      textarea.style.resize = "vertical";
      textarea.style.transition = "all 0.2s ease";

      // Contador de caracteres
      const charCount = document.createElement("div");
      charCount.className = "char-count";
      charCount.textContent = `${textarea.value.length} caracteres`;

      textarea.oninput = () => {
        charCount.textContent = `${textarea.value.length} caracteres`;
      };

      textarea.onchange = () => {
        task.desc = textarea.value;
        updateTask(task.id, task);
      };

      // Botão mostrar/ocultar textarea
      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = "🡣 Mostrar mais";
      toggleBtn.className = "toggle";

      let expanded = false;
      toggleBtn.onclick = () => {
        expanded = !expanded;
        textarea.rows = expanded ? 5 : 2;
        toggleBtn.textContent = expanded ? "🡡 Mostrar menos" : "🡣 Mostrar mais";
      };

      // Select status
      const select = document.createElement("select");
      ["Em andamento", "Feito", "Parado"].forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        if (opt === task.status) option.selected = true;
        select.appendChild(option);
      });

      select.onchange = () => {
        task.status = select.value;
        updateTask(task.id, task);
        renderCalendar(); // Atualiza cor
      };

      // Botão remover
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "🗑";
      removeBtn.className = "remove";
      removeBtn.onclick = () => {
        deleteTask(task.id);
        renderCalendar();
      };

      // Agrupar botão e toggle
      const btnGroup = document.createElement("div");
      btnGroup.style.display = "flex";
      btnGroup.style.justifyContent = "space-between";
      btnGroup.style.alignItems = "center";
      btnGroup.style.marginTop = "0.3rem";

      const leftGroup = document.createElement("div");
      leftGroup.style.display = "flex";
      leftGroup.style.gap = "0.4rem";

      leftGroup.appendChild(toggleBtn);
      leftGroup.appendChild(removeBtn);

      btnGroup.appendChild(leftGroup);
      btnGroup.appendChild(select);

      taskDiv.appendChild(textarea);
      taskDiv.appendChild(charCount);
      taskDiv.appendChild(btnGroup);

      div.appendChild(taskDiv);
    });

    calendar.appendChild(div);
  }
}

function updateTask(id, updatedTask) {
  let tasks = getTasks();
  tasks = tasks.map(t => (t.id === id ? updatedTask : t));
  saveTasks(tasks);
}

function deleteTask(id) {
  let tasks = getTasks();
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
}

function changeWeek(offset) {
  currentWeekStart.setDate(currentWeekStart.getDate() + offset * 7);
  renderCalendar();
}

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Segunda-feira
  return new Date(d.setDate(diff));
}

function formatDate(date) {
  return date.toLocaleDateString("pt-BR");
}
