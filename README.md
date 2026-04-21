# fiori_autotest

用于整理和演示 SAPUI5 自动化测试相关样例，仓库当前包含一个最小模板、一个完整 Demo、一个独立的 Demo 自动化测试工程、一个可视化测试工具，以及辅助测试脚本。

## 目录说明

- `sapui5-autotest-template`: SAPUI5 自动化测试最小模板，包含 QUnit、OPA5 和 wdi5。
- `sapui5-testing-demo`: 基于 SAPUI5 Testing Tutorial 整理的完整示例，保留应用代码与 `webapp/test` 开发测试资源。
- `sapui5-testing-demo-autotest`: `sapui5-testing-demo` 对应的独立自动化测试工程，包含 WDIO、wdi5、headless QUnit/OPA 和 artifact 输出。
- `sapui5-test-tool`: 独立的本地 Web UI 工具，可在浏览器里选择兄弟项目、启动 UI5 服务并执行测试脚本。
- `test脚本`: 额外测试脚本或实验性内容。

## 环境要求

- Node.js 18 或更高版本
- npm 9 或更高版本
- Chrome 浏览器

## 快速开始

### 1. 运行最小模板

```bash
cd sapui5-autotest-template
npm install
npm run start
```

常用命令：

```bash
npm run test:unit
npm run test:opa
```

### 3. 运行 Demo 的独立自动化测试工程

```bash
cd sapui5-testing-demo-autotest
npm install
npm run test:all:ci
```

常用命令：

```bash
npm run test:unit:ci
npm run test:opa:ci
npm run test:e2e:ci
npm run test:all:ci
```

### 2. 运行完整 Demo

```bash
cd sapui5-testing-demo
npm install
npm run start
```

常用访问地址：

- `http://localhost:8082/test.html`
- `http://localhost:8082/test/mockServer.html`
- `http://localhost:8082/test/testsuite.qunit.html`

常用命令：

```bash
npm run test:unit
npm run test:opa
npm run test:e2e
```

## 说明

- `sapui5-testing-demo-autotest` 依赖本机 Chrome/Chromedriver 环境。
- 两个子项目都使用各自目录下的 `package.json` 独立管理依赖。
- 如果要基于模板创建新项目，优先从 `sapui5-autotest-template` 开始。