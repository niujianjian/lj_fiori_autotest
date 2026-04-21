const express = require("express");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const toolRoot = __dirname;
const workspaceRoot = path.resolve(toolRoot, "..");
const port = Number(process.env.PORT || 8095);
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const state = {
  selectedProject: null,
  serverProcess: null,
  taskProcess: null,
  logs: [],
  tasks: [],
  startedAt: new Date().toISOString()
};
const maxLogEntries = 500;

app.use(express.json());
app.use(express.static(path.join(toolRoot, "public")));

function pushLog(scope, message) {
  const text = String(message || "").replace(/\r/g, "").trimEnd();
  if (!text) {
    return;
  }

  for (const line of text.split("\n")) {
    state.logs.push({
      time: new Date().toISOString(),
      scope,
      line
    });
  }

  if (state.logs.length > maxLogEntries) {
    state.logs.splice(0, state.logs.length - maxLogEntries);
  }
}

function isRunnableProject(projectDir) {
  const packageJsonPath = path.join(projectDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    return Boolean(pkg.scripts && Object.keys(pkg.scripts).length > 0);
  } catch {
    return false;
  }
}

function readPackage(projectName) {
  const packageJsonPath = path.join(workspaceRoot, projectName, "package.json");
  return JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
}

function listProjects() {
  return fs
    .readdirSync(workspaceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith("."))
    .filter((name) => name !== path.basename(toolRoot))
    .filter((name) => isRunnableProject(path.join(workspaceRoot, name)))
    .map((name) => {
      const pkg = readPackage(name);
      return {
        name,
        description: pkg.description || "",
        scripts: pkg.scripts || {}
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
}

function getSelectedProjectInfo() {
  if (!state.selectedProject) {
    return null;
  }

  try {
    const pkg = readPackage(state.selectedProject);
    return {
      name: state.selectedProject,
      description: pkg.description || "",
      scripts: pkg.scripts || {},
      path: path.join(workspaceRoot, state.selectedProject)
    };
  } catch {
    return null;
  }
}

function ensureProjectSelected() {
  const info = getSelectedProjectInfo();
  if (!info) {
    const error = new Error("No project selected.");
    error.statusCode = 400;
    throw error;
  }
  return info;
}

function runNpmScript(projectName, scriptName, kind) {
  const projectInfo = ensureProjectSelected();
  const scripts = projectInfo.scripts || {};
  if (!scripts[scriptName]) {
    const error = new Error(`Script '${scriptName}' does not exist in ${projectName}.`);
    error.statusCode = 400;
    throw error;
  }

  if (kind === "server" && state.serverProcess) {
    const error = new Error("A server process is already running.");
    error.statusCode = 409;
    throw error;
  }

  if (kind === "task" && state.taskProcess) {
    const error = new Error("A test task is already running.");
    error.statusCode = 409;
    throw error;
  }

  const child = spawn(npmCommand, ["run", scriptName], {
    cwd: path.join(workspaceRoot, projectName),
    env: process.env,
    shell: false,
    windowsHide: true
  });

  const meta = {
    kind,
    scriptName,
    projectName,
    startedAt: new Date().toISOString(),
    pid: child.pid,
    status: "running",
    exitCode: null
  };

  if (kind === "server") {
    state.serverProcess = child;
  } else {
    state.taskProcess = child;
  }
  state.tasks.unshift(meta);
  state.tasks = state.tasks.slice(0, 20);

  pushLog(kind, `[spawn] ${projectName} :: npm run ${scriptName}`);

  child.stdout.on("data", (chunk) => pushLog(kind, chunk.toString()));
  child.stderr.on("data", (chunk) => pushLog(kind, chunk.toString()));
  child.on("exit", (code, signal) => {
    meta.status = signal ? `stopped (${signal})` : code === 0 ? "completed" : "failed";
    meta.exitCode = code;
    meta.finishedAt = new Date().toISOString();
    pushLog(kind, `[exit] ${projectName} :: npm run ${scriptName} -> ${meta.status}`);
    if (kind === "server") {
      state.serverProcess = null;
    } else {
      state.taskProcess = null;
    }
  });

  child.on("error", (error) => {
    meta.status = "error";
    meta.error = error.message;
    pushLog(kind, `[error] ${error.message}`);
    if (kind === "server") {
      state.serverProcess = null;
    } else {
      state.taskProcess = null;
    }
  });

  return meta;
}

function stopProcess(kind) {
  const child = kind === "server" ? state.serverProcess : state.taskProcess;
  if (!child) {
    return false;
  }
  child.kill("SIGTERM");
  pushLog(kind, "[stop] termination requested");
  return true;
}

function buildStatus() {
  const project = getSelectedProjectInfo();
  return {
    tool: {
      name: "SAPUI5 Test Tool",
      port,
      startedAt: state.startedAt
    },
    selectedProject: project,
    server: state.tasks.find((task) => task.kind === "server" && task.status === "running") || null,
    task: state.tasks.find((task) => task.kind === "task" && task.status === "running") || null,
    recentTasks: state.tasks,
    logs: state.logs.slice(-150)
  };
}

app.get("/api/projects", (_req, res) => {
  const projects = listProjects();
  if (!state.selectedProject && projects.length > 0) {
    state.selectedProject = projects.find((project) => project.name === "sapui5-testing-demo")?.name || projects[0].name;
  }
  res.json({ projects, selectedProject: state.selectedProject });
});

app.get("/api/status", (_req, res) => {
  res.json(buildStatus());
});

app.post("/api/projects/select", (req, res, next) => {
  try {
    const { projectName } = req.body || {};
    const projects = listProjects();
    const match = projects.find((project) => project.name === projectName);
    if (!match) {
      const error = new Error("Project not found.");
      error.statusCode = 404;
      throw error;
    }
    if (state.serverProcess || state.taskProcess) {
      const error = new Error("Stop the running task or server before switching project.");
      error.statusCode = 409;
      throw error;
    }
    state.selectedProject = match.name;
    pushLog("system", `[select] active project -> ${match.name}`);
    res.json(buildStatus());
  } catch (error) {
    next(error);
  }
});

app.post("/api/server/start", (req, res, next) => {
  try {
    const project = ensureProjectSelected();
    const scriptName = project.scripts["start:ci"] ? "start:ci" : project.scripts.start ? "start" : null;
    if (!scriptName) {
      const error = new Error("No start script is available for the selected project.");
      error.statusCode = 400;
      throw error;
    }
    const task = runNpmScript(project.name, scriptName, "server");
    res.status(202).json({ ok: true, task, status: buildStatus() });
  } catch (error) {
    next(error);
  }
});

app.post("/api/server/stop", (_req, res) => {
  res.json({ ok: stopProcess("server") });
});

app.post("/api/tasks/run", (req, res, next) => {
  try {
    const { scriptName } = req.body || {};
    const project = ensureProjectSelected();
    const task = runNpmScript(project.name, scriptName, "task");
    res.status(202).json({ ok: true, task, status: buildStatus() });
  } catch (error) {
    next(error);
  }
});

app.post("/api/tasks/stop", (_req, res) => {
  res.json({ ok: stopProcess("task") });
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  pushLog("system", `[api-error] ${error.message}`);
  res.status(statusCode).json({ error: error.message });
});

app.listen(port, () => {
  pushLog("system", `SAPUI5 Test Tool is running on http://127.0.0.1:${port}`);
});