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
  tasks.push({ desc, status, date });
  localStorage.setItem("tasks", JSON.stringify(tasks));

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

  for (let i = 0; i < 7; i++) {
    const day = new Date(currentWeekStart);
    day.setDate(currentWeekStart.getDate() + i);
    const iso = day.toISOString().split("T")[0];

    const tasks = getTasks().filter(t => t.date === iso);

    const div = document.createElement("div");
    div.className = "day";

    const dayName = day.toLocaleDateString("pt-BR", { weekday: "long" });
    const dateStr = day.toLocaleDateString("pt-BR");

    div.innerHTML = `<h3>${dayName} - ${dateStr}</h3>`;

    tasks.forEach(task => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task";
      taskDiv.dataset.status = task.status;

      // Textarea da descrição
      const textarea = document.createElement("textarea");
      textarea.rows = 2;
      textarea.value = task.desc;
      textarea.style.resize = "vertical";
      textarea.style.transition = "all 0.2s ease";

      const charCount = document.createElement("div");
      charCount.className = "char-count";
      charCount.textContent = `${textarea.value.length} caracteres`;

      textarea.oninput = () => {
        charCount.textContent = `${textarea.value.length} caracteres`;
      };

      textarea.onchange = () => {
        const tasks = getTasks();
        const idx = tasks.findIndex(t => t.id === task.id);
        if (idx !== -1) {
          tasks[idx].desc = textarea.value;
          saveTasks(tasks);
        }
      };

      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = "🡣 Mostrar mais";
      toggleBtn.className = "toggle";

      let expanded = false;
      toggleBtn.onclick = () => {
        expanded = !expanded;
        textarea.rows = expanded ? 5 : 2;
        toggleBtn.textContent = expanded ? "🡡 Mostrar menos" : "🡣 Mostrar mais";
      };

      const clearBtn = document.createElement("button");
      clearBtn.textContent = "🧹 Limpar";
      clearBtn.className = "delete-desc";
      clearBtn.onclick = () => {
        textarea.value = "";
        charCount.textContent = "0 caracteres";
        textarea.dispatchEvent(new Event("change"));
      };

      const select = document.createElement("select");
      ["Em andamento", "Feito", "Parado"].forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        if (opt === task.status) option.selected = true;
        select.appendChild(option);
      });
      select.onchange = () => {
        const tasks = getTasks();
        const idx = tasks.findIndex(t => t.id === task.id);
        if (idx !== -1) {
          tasks[idx].status = select.value;
          saveTasks(tasks);
          renderCalendar();
        }
      };

      const remove = document.createElement("button");
      remove.textContent = "🗑";
      remove.className = "remove";
      remove.onclick = () => {
        const tasks = getTasks().filter(t => t.id !== task.id);
        saveTasks(tasks);
        renderCalendar();
      };

      const btnGroup = document.createElement("div");
      btnGroup.style.display = "flex";
      btnGroup.style.gap = "0.4rem";
      btnGroup.style.justifyContent = "flex-end";
      btnGroup.style.marginTop = "0.3rem";

      btnGroup.appendChild(toggleBtn);
      btnGroup.appendChild(clearBtn);
      btnGroup.appendChild(remove);

      taskDiv.appendChild(textarea);
      taskDiv.appendChild(charCount);
      taskDiv.appendChild(btnGroup);
      taskDiv.appendChild(select);

      div.appendChild(taskDiv);
    });

    calendar.appendChild(div);
  }
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
