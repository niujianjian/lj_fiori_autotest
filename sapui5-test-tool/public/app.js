const state = {
  projects: [],
  selectedProject: null,
  status: null
};

const projectSelect = document.getElementById("project-select");
const projectDescription = document.getElementById("project-description");
const selectedProjectName = document.getElementById("selected-project-name");
const selectedProjectPath = document.getElementById("selected-project-path");
const serverStatus = document.getElementById("server-status");
const taskStatus = document.getElementById("task-status");
const scriptButtons = document.getElementById("script-buttons");
const recentTasks = document.getElementById("recent-tasks");
const logView = document.getElementById("log-view");
const taskTemplate = document.getElementById("task-template");
const toolPort = document.getElementById("tool-port");

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || `Request failed: ${response.status}`);
  }
  return body;
}

function summarizeScript(scriptName) {
  if (scriptName === "test:all:ci") {
    return "Run full CI-friendly pipeline";
  }
  if (scriptName.startsWith("test:unit")) {
    return "Run QUnit checks";
  }
  if (scriptName.startsWith("test:opa")) {
    return "Run OPA integration flow";
  }
  if (scriptName.startsWith("test:e2e")) {
    return "Run wdi5 end-to-end flow";
  }
  if (scriptName.startsWith("start")) {
    return "Launch local UI5 server";
  }
  return "Run package script";
}

function renderProjects() {
  projectSelect.innerHTML = "";
  for (const project of state.projects) {
    const option = document.createElement("option");
    option.value = project.name;
    option.textContent = project.name;
    if (project.name === state.selectedProject) {
      option.selected = true;
    }
    projectSelect.append(option);
  }
  renderProjectMeta();
}

function renderProjectMeta() {
  const project = state.projects.find((item) => item.name === state.selectedProject);
  selectedProjectName.textContent = project ? project.name : "未选择项目";
  selectedProjectPath.textContent = project ? `../${project.name}` : "请选择一个可运行项目";
  projectDescription.textContent = project?.description || "";
  renderScriptButtons(project?.scripts || {});
}

function renderScriptButtons(scripts) {
  scriptButtons.innerHTML = "";
  const preferredOrder = [
    "test:unit:ci",
    "test:opa:ci",
    "test:e2e:ci",
    "test:all:ci",
    "test:unit:report-failure:ci",
    "test:e2e:report-failure:ci"
  ];
  const names = [
    ...preferredOrder.filter((name) => scripts[name]),
    ...Object.keys(scripts).filter((name) => !preferredOrder.includes(name) && name !== "start" && name !== "start:ci")
  ];

  if (names.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "当前项目没有可直接运行的测试脚本。";
    scriptButtons.append(empty);
    return;
  }

  for (const scriptName of names) {
    const button = document.createElement("button");
    button.className = "script-button";
    button.innerHTML = `<strong>${scriptName}</strong><small>${summarizeScript(scriptName)}</small>`;
    button.addEventListener("click", () => runTask(scriptName));
    scriptButtons.append(button);
  }
}

function renderStatus() {
  if (!state.status) {
    return;
  }

  toolPort.textContent = `Port ${state.status.tool.port}`;
  const selectedProject = state.status.selectedProject;
  if (selectedProject) {
    selectedProjectName.textContent = selectedProject.name;
    selectedProjectPath.textContent = selectedProject.path;
  }

  serverStatus.textContent = state.status.server ? `${state.status.server.scriptName} / running` : "idle";
  taskStatus.textContent = state.status.task ? `${state.status.task.scriptName} / running` : "idle";

  recentTasks.innerHTML = "";
  for (const task of state.status.recentTasks.slice(0, 8)) {
    const fragment = taskTemplate.content.cloneNode(true);
    fragment.querySelector(".task-script").textContent = task.scriptName;
    fragment.querySelector(".task-kind").textContent = task.kind;
    fragment.querySelector(".task-status").textContent = task.status;
    fragment.querySelector(".task-time").textContent = new Date(task.startedAt).toLocaleString();
    recentTasks.append(fragment);
  }

  logView.textContent = state.status.logs
    .map((entry) => `[${new Date(entry.time).toLocaleTimeString()}] [${entry.scope}] ${entry.line}`)
    .join("\n");
  logView.scrollTop = logView.scrollHeight;
}

async function loadProjects() {
  const data = await request("/api/projects");
  state.projects = data.projects;
  state.selectedProject = data.selectedProject;
  renderProjects();
}

async function loadStatus() {
  state.status = await request("/api/status");
  renderStatus();
}

async function selectProject(projectName) {
  await request("/api/projects/select", {
    method: "POST",
    body: JSON.stringify({ projectName })
  });
  state.selectedProject = projectName;
  renderProjectMeta();
  await loadStatus();
}

async function serverStart() {
  await request("/api/server/start", { method: "POST" });
  await loadStatus();
}

async function serverStop() {
  await request("/api/server/stop", { method: "POST" });
  await loadStatus();
}

async function runTask(scriptName) {
  await request("/api/tasks/run", {
    method: "POST",
    body: JSON.stringify({ scriptName })
  });
  await loadStatus();
}

async function stopTask() {
  await request("/api/tasks/stop", { method: "POST" });
  await loadStatus();
}

function bindEvents() {
  projectSelect.addEventListener("change", (event) => selectProject(event.target.value).catch(showError));
  document.getElementById("refresh-projects").addEventListener("click", () => loadProjects().catch(showError));
  document.querySelector('[data-action="server-start"]').addEventListener("click", () => serverStart().catch(showError));
  document.querySelector('[data-action="server-stop"]').addEventListener("click", () => serverStop().catch(showError));
  document.querySelector('[data-action="task-stop"]').addEventListener("click", () => stopTask().catch(showError));
  document.getElementById("clear-log-view").addEventListener("click", () => {
    logView.scrollTop = logView.scrollHeight;
  });
}

function showError(error) {
  window.alert(error.message);
}

async function boot() {
  bindEvents();
  await loadProjects();
  await loadStatus();
  window.setInterval(() => {
    loadStatus().catch(() => {});
  }, 2000);
}

boot().catch(showError);