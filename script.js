// ==================================================
// 🌌 Júpiter 3.2.1 — Painel NTI Ramon Sesc Mogi
// ==================================================

const LS_KEYS = {
  fixed: "jupiter.fixed.checks.v1",
  tasks: "jupiter.tasks.v1",
  week: "jupiter.week.anchor",
  calls: "jupiter.calls.v1",
  themeManual: "jupiter.theme.manual",
  overdueToggle: "jupiter.overdue.toggle"
};

let fixedState = JSON.parse(localStorage.getItem(LS_KEYS.fixed) || "{}");
let tasks = JSON.parse(localStorage.getItem(LS_KEYS.tasks) || "[]");
let calls = JSON.parse(localStorage.getItem(LS_KEYS.calls) || "[]");
let selectedDate = todayISO();
let anchor = parseInt(localStorage.getItem(LS_KEYS.week) || Date.now(), 10);
let highlightOverdue = JSON.parse(localStorage.getItem(LS_KEYS.overdueToggle) || "true");

// ---------- Utilitários ----------
function uid(){ return crypto?.randomUUID ? crypto.randomUUID() : "id-" + Math.random().toString(36).slice(2)+Date.now();}
function todayISO(){ return new Date().toISOString().slice(0,10); }
function dayISO(d){ return d.toISOString().slice(0,10); }
function escapeHtml(s){ return s.replace(/[&<>\"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function statusColor(status){
  switch(status){
    case "Parado": return "#ff4c4c";
    case "Pausado": case "Aguardando resposta": case "Em pausa": return "#ffae42";
    case "Em andamento": return "#3b82f6";
    case "Concluído": case "Finalizado": return "#22c55e";
    default: return "#999";
  }
}

// ---------- FIXED GROUPS ----------
const FIXED_GROUPS=[{key:"cftv",title:"📹 Aplicativos e Softwares – CFTV",items:[{t:"Verificar NVR e câmeras"}],info:`<strong>Checklist - Abertura da UO</strong><br>Realizar verificação completa do sistema de monitoramento e das câmeras conectadas ao NVR.`},{key:"catracas",title:"🎫 Equipamentos e Periféricos – Catracas (Piscina)",items:[{t:"Verificar catracas (testes OK)"}],info:`<strong>Na hora de registrar chamado:</strong> Piscina<br><em>Acesso remoto:</em> testar, ir na barra, fechar e abrir novamente.<br><br><strong>Checklist - Abertura da UO</strong><br>- Conexão no servidor <code>10.72.15.3</code><br>- Verificação do sistema Controle de Acesso<br>- Equipamentos conectados <code>10.72.20.14</code> e <code>10.72.20.15</code><br>- Respondendo ping<br>- Teste in-loco com cartão mestre (vestuário)`},{key:"pabx",title:"📞 Catálogo Técnico – NTI – PABX Nuvem",items:[{t:"Testar ligações do PABX"}],info:`<strong>Checklist - Abertura da UO</strong><br>- Ligação para tronco da UO (11 4728-6200)<br>- Atendimento da URA<br>- Ligação para o telefone (11 4728-6231)<br>- Atendimento OK<br>- Ligação externa OK`},{key:"sat",title:"🧾 Equipamentos e Periféricos – SAT",items:[{t:"Testar conectividade dos SATs"}],info:`Testar ping no CMD para:<br>10.72.122.1 (AT TV) • 10.72.122.2 (Central 03) • 10.72.122.3 (CPD)<br>10.72.122.5 (AT porta) • 10.72.122.6 (Central 02) • 10.72.122.7 (Central 01)<br>10.72.122.8 (CPD) • 10.72.122.9 (Loja) • 10.72.122.10 / 11 (PDV Evento)`},{key:"totem",title:"🖥️ Equipamentos – Totem Autoatendimento",items:[{t:"Verificar TOTEMs e acesso remoto"}],info:`<strong>Rprinter:</strong> 10.72.15.4 — <em>rprinter.mogi</em><br><strong>Senha:</strong> m0g1@2021!<br><br>IPs: <code>10.72.123.102</code> e <code>10.72.123.103</code><br>Confirmar uptime e reiniciar se necessário.`},{key:"lp_dados",title:"🌐 Catálogo Técnico – LP de Dados (Internet – Mogi)",items:[{t:"Monitorar link da UO"}],info:`Acompanhar no Grafana:<br><a href='https://dashboard.sescsp.org.br/' target='_blank'>https://dashboard.sescsp.org.br/</a>`}];

// ---------- Persistência ----------
function saveFixed(){ localStorage.setItem(LS_KEYS.fixed, JSON.stringify(fixedState)); renderFixedProgress(); }
function saveTasks(){ localStorage.setItem(LS_KEYS.tasks, JSON.stringify(tasks)); renderWeek(); renderTasksOfDay(); renderTaskList(); renderDashboard(); }
function saveCalls(){ localStorage.setItem(LS_KEYS.calls, JSON.stringify(calls)); renderCalls(); renderDashboard(); }

// ---------- Fixed render ----------
function renderFixed(){
  const host=document.getElementById("fixedContainer"); host.innerHTML="";
  FIXED_GROUPS.forEach(group=>{
    const det=document.createElement("details"); det.open=true;
    const sum=document.createElement("summary"); sum.textContent=group.title; det.appendChild(sum);
    const ul=document.createElement("ul"); ul.className="check";
    group.items.forEach((it,i)=>{
      const id=`${group.key}::${i}`;
      const li=document.createElement("li");
      const cb=document.createElement("input"); cb.type="checkbox"; cb.checked=!!fixedState[id];
      cb.addEventListener("change",()=>{ fixedState[id]=cb.checked; saveFixed(); });
      const label=document.createElement("div"); label.innerHTML=`<strong>${it.t}</strong>`;
      li.append(cb,label); ul.appendChild(li);
    });
    const info=document.createElement("div"); info.className="info-block"; info.innerHTML=group.info;
    det.append(ul,info); host.appendChild(det);
  });
  renderFixedProgress();
}
function renderFixedProgress(){
  const total=FIXED_GROUPS.reduce((a,g)=>a+g.items.length,0);
  const done=Object.values(fixedState).filter(Boolean).length;
  const pct=Math.round((done/total)*100)||0;
  const bar=document.getElementById("fixedProgress"); const txt=document.getElementById("fixedPercent");
  if(bar) bar.style.width=pct+"%"; if(txt) txt.textContent=`${pct}% concluído`;
}
document.getElementById("btnResetFixed").addEventListener("click",()=>{
  if(confirm("Reiniciar marcações das checklists obrigatórias?")){ fixedState={}; saveFixed(); renderFixed(); }
});
function markAllFixed(state){
  FIXED_GROUPS.forEach(g=>g.items.forEach((_,i)=>fixedState[`${g.key}::${i}`]=state));
  saveFixed(); renderFixed();
}

// ---------- Calendário & tarefas ----------
function startOfWeek(ts){ const d=new Date(ts); const w=(d.getDay()+6)%7; d.setHours(0,0,0,0); d.setDate(d.getDate()-w); return d; }
function endOfWeek(ts){ const s=startOfWeek(ts); return new Date(s.getTime()+6*86400000); }
function changeWeek(delta){ const d=new Date(anchor); d.setDate(d.getDate()+delta*7); anchor=d.getTime(); localStorage.setItem(LS_KEYS.week,String(anchor)); renderWeek(); renderDashboard(); }

function renderWeek(){
  const host=document.getElementById("calendarWeek"); host.innerHTML="";
  const s=startOfWeek(anchor); const e=endOfWeek(anchor);
  document.getElementById("weekRange").textContent=`${s.toLocaleDateString()} — ${e.toLocaleDateString()}`;
  document.getElementById("dashRange").textContent=`Semana: ${s.toLocaleDateString()} — ${e.toLocaleDateString()}`;

  const today=todayISO();

  for(let i=0;i<7;i++){
    const d=new Date(s.getTime()+i*86400000);
    const iso=dayISO(d);
    const box=document.createElement("div");
    box.className="day"+(iso===selectedDate?" active":"");

    // alerta de atraso
    if(highlightOverdue && iso < today){
      const hasOverdue = tasks.some(t=>t.date===iso && t.status!=="Concluído" && t.status!=="Feito");
      if(hasOverdue) box.classList.add("alert");
    }

    const h=document.createElement("h4");
    h.textContent=d.toLocaleDateString(undefined,{weekday:"short",day:"2-digit",month:"2-digit"});
    box.appendChild(h);

    const tForDay=tasks.filter(t=>t.date===iso);
    const pend=tForDay.filter(t=>t.status!=="Concluído" && t.status!=="Feito").length;
    const badge=document.createElement("span"); badge.className="badge";
    badge.textContent=`${tForDay.length} tarefas • ${pend} pend.`;
    box.appendChild(badge);

    box.onclick=()=>{ selectedDate=iso; renderWeek(); renderTasksOfDay(); };
    host.appendChild(box);
  }
}

function addTask(){
  const desc=document.getElementById("taskDesc").value.trim();
  const status=document.getElementById("taskStatus").value;
  const date=document.getElementById("taskDate").value || selectedDate;
  const cat=document.getElementById("taskCat").value.trim();
  if(!desc) return alert("Descreva a ação.");
  tasks.push({id:uid(),desc,status,date,cat});
  document.getElementById("taskDesc").value="";
  saveTasks();
}
function clearDone(){ tasks=tasks.filter(t=>t.status!=="Concluído" && t.status!=="Feito"); saveTasks(); }
function setStatus(id,next){ const t=tasks.find(x=>x.id===id); if(t){ t.status=next; saveTasks(); } }
function removeTask(id){ tasks=tasks.filter(t=>t.id!==id); saveTasks(); }

function renderTasksOfDay(){
  const host=document.getElementById("tasksOfDay"); host.innerHTML="";
  const filter=document.getElementById("filterStatus").value;
  const list=tasks.filter(t=>t.date===selectedDate && (!filter || t.status===filter));

  const title=document.createElement("h3");
  title.innerHTML=`📅 ${new Date(selectedDate).toLocaleDateString()}`;
  host.appendChild(title);

  if(list.length===0){ host.innerHTML+=`<p class='hint'>Nenhuma tarefa cadastrada para este dia.</p>`; return; }

  list.forEach(t=>{
    const item=document.createElement("div"); item.className="task-card";
    item.style.borderLeft=`6px solid ${statusColor(t.status)}`;
    item.style.background=`${statusColor(t.status)}20`;
    item.innerHTML=`
      <div class="task-header">
        <strong>${escapeHtml(t.desc)}</strong>
        <span class="status">${t.status}</span>
      </div>
      <div class="meta">${t.cat || "Sem categoria"} • ${t.date}</div>
      <div class="actions">
        <button class="btn ghost" onclick="setStatus('${t.id}','Parado')">Parado</button>
        <button class="btn ghost" onclick="setStatus('${t.id}','Pausado')">Pausado</button>
        <button class="btn ghost" onclick="setStatus('${t.id}','Em andamento')">Em andamento</button>
        <button class="btn ghost" onclick="setStatus('${t.id}','Concluído')">Concluído</button>
        <button class="btn ghost" onclick="removeTask('${t.id}')">🗑️</button>
      </div>`;
    host.appendChild(item);
  });
}

function renderTaskList(){
  const host=document.getElementById("taskList"); host.innerHTML="";
  const sorted=[...tasks].sort((a,b)=>a.date.localeCompare(b.date));
  sorted.forEach(t=>{
    const row=document.createElement("div"); row.className="task-item";
    const dot=document.createElement("input"); dot.type="checkbox";
    dot.checked=(t.status==="Concluído" || t.status==="Feito");
    dot.addEventListener("change",()=>setStatus(t.id,dot.checked?"Concluído":"Em andamento"));
    const body=document.createElement("div");
    body.innerHTML=`<div>${escapeHtml(t.desc)}</div><div class='meta'>${t.date}${t.cat?" • "+escapeHtml(t.cat):""} • Status: ${t.status}</div>`;
    const actions=document.createElement("div"); actions.className="task-actions";
    const b1=btn("Parado",()=>setStatus(t.id,"Parado"));
    const b2=btn("Em andamento",()=>setStatus(t.id,"Em andamento"));
    const b3=btn("Excluir",()=>removeTask(t.id));
    actions.append(b1,b2,b3); row.append(dot,body,actions); host.appendChild(row);
  });
}
function btn(label,fn){ const b=document.createElement("button"); b.className="btn ghost"; b.textContent=label; b.onclick=fn; return b; }

// ---------- Chamados ----------
function addCall(){
  const number=document.getElementById("callNumber").value.trim();
  const desc=document.getElementById("callDesc").value.trim();
  const status=document.getElementById("callStatus").value;
  if(!number || !desc) return alert("Informe o número do chamado e a descrição.");
  calls.push({id:uid(),number,desc,status,createdAt:new Date().toISOString()});
  document.getElementById("callNumber").value=""; document.getElementById("callDesc").value="";
  saveCalls();
}
function updateCallStatus(id,next){ const c=calls.find(x=>x.id===id); if(c){ c.status=next; saveCalls(); } }
function editCall(id){
  const c=calls.find(x=>x.id===id); if(!c) return;
  const n=prompt("Editar número do chamado:",c.number); if(n===null) return;
  const d=prompt("Editar descrição:",c.desc); if(d===null) return;
  c.number=(n.trim()||c.number); c.desc=(d.trim()||c.desc); saveCalls();
}
function removeCall(id){ calls=calls.filter(c=>c.id!==id); saveCalls(); }
function renderCalls(){
  const host=document.getElementById("callList"); host.innerHTML="";
  if(calls.length===0){ host.innerHTML="<p class='hint'>Sem chamados em atenção no momento.</p>"; return; }
  const order={"Em andamento":1,"Aguardando resposta":2,"Em pausa":3,"Finalizado":9};
  const ordered=[...calls].sort((a,b)=> (order[a.status]??5)-(order[b.status]??5) || (a.createdAt||"").localeCompare(b.createdAt||""));
  ordered.forEach(c=>{
    const card=document.createElement("div"); card.className="call-card";
    card.style.borderLeft=`6px solid ${statusColor(c.status)}`;
    card.style.background=`${statusColor(c.status)}20`;
    const when=c.createdAt?new Date(c.createdAt).toLocaleString():"";
    card.innerHTML=`
      <div class="call-head">
        <div>Chamado ${escapeHtml(c.number)}</div>
        <span class="status pill">${c.status}</span>
      </div>
      <div class="call-meta">${escapeHtml(c.desc)}${when?" • Aberto em "+when:""}</div>
      <div class="call-actions">
        <button class="btn ghost" onclick="updateCallStatus('${c.id}','Em andamento')">Em andamento</button>
        <button class="btn ghost" onclick="updateCallStatus('${c.id}','Aguardando resposta')">Aguardando</button>
        <button class="btn ghost" onclick="updateCallStatus('${c.id}','Em pausa')">Em pausa</button>
        <button class="btn ghost" onclick="updateCallStatus('${c.id}','Finalizado')">Finalizado</button>
        <button class="btn ghost" onclick="editCall('${c.id}')">✏️ Editar</button>
        <button class="btn ghost" onclick="removeCall('${c.id}')">🗑️ Remover</button>
      </div>`;
    host.appendChild(card);
  });
}

// ---------- Dashboard ----------
function renderDashboard() {
  const s = startOfWeek(anchor);
  const e = endOfWeek(anchor);
  const inWeek = tasks.filter(t => {
    const d = new Date(t.date + "T00:00:00");
    return d >= s && d <= e;
  });

  const total = inWeek.length;
  const done = inWeek.filter(t => t.status === "Concluído" || t.status === "Feito").length;
  const pend = total - done;
  const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0; // corrigido
  const openCalls = calls.filter(c => c.status !== "Finalizado").length;

  // KPIs padrão
  setText("kpiTotal", total);
  setText("kpiDone", done);
  setText("kpiPend", pend);
  setText("kpiPct", pct + "%");
  setText("kpiCalls", openCalls);

  // Cor dinâmica do percentual
  const pctEl = document.getElementById("kpiPct");
  if (pctEl) {
    let color;
    if (pct < 50) color = "#ff4c4c"; // vermelho
    else if (pct < 80) color = "#ffae42"; // amarelo
    else color = "#22c55e"; // verde
    pctEl.style.color = color;
  }
}


// ---------- Backup / Import ----------
function exportBackup(){
  const data={fixedState,tasks,calls,anchor,selectedDate};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob); const a=document.createElement("a");
  a.href=url; a.download=`jupiter_backup_${todayISO()}.json`; a.click(); URL.revokeObjectURL(url);
}
async function importBackup(file){
  try{
    const data=JSON.parse(await file.text());
    fixedState=data.fixedState||{}; tasks=data.tasks||[]; calls=data.calls||[];
    anchor=data.anchor||Date.now(); selectedDate=data.selectedDate||todayISO();
    saveFixed(); saveTasks(); saveCalls();
    localStorage.setItem(LS_KEYS.week,String(anchor));
    renderFixed(); renderWeek(); renderTasksOfDay(); renderTaskList(); renderCalls(); renderDashboard();
    alert("Backup importado com sucesso!");
  }catch(e){ alert("Falha ao importar: "+e.message); }
}

// ---------- CSV ----------
function exportCSV(){
  // tarefas.csv
  const tHeader = "id;data;status;categoria;descricao\n";
  const tRows = tasks.map(t=>`${t.id};${t.date};${t.status};${(t.cat||"").replace(/;/g,",")};"${(t.desc||"").replace(/"/g,'""')}"`).join("\n");
  downloadText(tHeader+tRows, `tarefas_${todayISO()}.csv`, "text/csv");

  // chamados.csv
  const cHeader = "id;numero;status;aberto_em;descricao\n";
  const cRows = calls.map(c=>`${c.id};${c.number};${c.status};${c.createdAt||""};"${(c.desc||"").replace(/"/g,'""')}"`).join("\n");
  downloadText(cHeader+cRows, `chamados_${todayISO()}.csv`, "text/csv");
}
function downloadText(content, filename, mime){
  const blob=new Blob([content],{type:mime}); const url=URL.createObjectURL(blob);
  const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
}

// ---------- Tema ----------
function applyAutoThemeOnce(){
  const manual=localStorage.getItem(LS_KEYS.themeManual);
  if(manual) { document.documentElement.dataset.theme = manual; return; }
  const hour=new Date().getHours();
  document.documentElement.dataset.theme = (hour>=18 || hour<6) ? "dark" : "light";
}

// ---------- Eventos topo ----------
document.getElementById("btnTheme").addEventListener("click",()=>{
  const dark=document.documentElement.dataset.theme!=="light";
  document.documentElement.dataset.theme = dark? "light":"dark";
  localStorage.setItem(LS_KEYS.themeManual, document.documentElement.dataset.theme);
});
document.getElementById("btnExport").addEventListener("click",()=>window.print());
document.getElementById("btnBackup").addEventListener("click", exportBackup);
document.getElementById("btnImport").addEventListener("click",()=>document.getElementById("importFile").click());
document.getElementById("importFile").addEventListener("change",e=>{
  const f=e.target.files?.[0]; if(f) importBackup(f);
});
document.getElementById("btnCSV").addEventListener("click", exportCSV);
document.getElementById("btnOverdue").addEventListener("click",()=>{
  highlightOverdue = !highlightOverdue;
  localStorage.setItem(LS_KEYS.overdueToggle, JSON.stringify(highlightOverdue));
  document.getElementById("btnOverdue").textContent = `🔔 Destacar atrasadas: ${highlightOverdue?"ON":"OFF"}`;
  renderWeek();
});

document.getElementById("btnNew").addEventListener("click",()=>document.getElementById("taskDesc").focus());

// ---------- Inicialização ----------
function init(){
  applyAutoThemeOnce();
  document.getElementById("btnOverdue").textContent = `🔔 Destacar atrasadas: ${highlightOverdue?"ON":"OFF"}`;
  renderFixed();
  renderWeek();
  renderTasksOfDay();
  renderTaskList();
  renderCalls();
  renderDashboard();
}
init();
