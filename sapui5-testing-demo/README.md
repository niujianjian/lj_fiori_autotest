# SAPUI5 Testing Demo

这个 demo 按 SAPUI5 官方 Testing Tutorial 的最终效果整理，覆盖以下测试主题：

- QUnit 单元测试
- OPA5 集成测试
- OData V2 Mock Server
- 列表分页、搜索、标签过滤、导航、用户输入
- 独立自动化测试工程对接

## 教程映射

- Step 1: 测试策略、入口页、Mock Server
- Step 2-5: formatter 和纯逻辑模块的单元测试
- Step 6-9: OPA5 的列表、分页、导航和详情页测试
- Step 10: 自动化执行入口
- Step 11-14: 搜索、用户输入、交互和标签过滤
- Step 15-16: 短日期 formatter 的 TDD 风格单元测试

## 目录结构

- webapp/test/unit: QUnit 测试
- webapp/test/integration: OPA5 页面对象和 Journey
- webapp/localService: metadata 与 mockdata

根目录自动化测试工程已经剥离到兄弟目录 `../sapui5-testing-demo-autotest`。
本项目只保留应用代码，以及 `webapp/test` 下给开发使用的单元测试和集成测试资源。

## 运行方式

```bash
npm install
npm run start
```

启动后可访问：

- <http://localhost:8082/test.html>
- <http://localhost:8082/test/mockServer.html>
- <http://localhost:8082/test/testsuite.qunit.html>

运行命令：

```bash
npm run test:unit
npm run test:opa
```

其中：

- `test:unit` 和 `test:opa` 会启动 UI5 server 并打开对应测试页面，适合本地手工调试。
- 如果要执行 Headless QUnit/OPA 校验、wdi5 e2e、失败截图和文本 artifact，请切换到 `../sapui5-testing-demo-autotest` 目录运行对应命令。

## CI 行为

- 独立自动化测试工程位于 `../sapui5-testing-demo-autotest`。
- 应用目录只保留 `start`、`start:ci`、`test:unit`、`test:opa` 这些与被测应用本身直接相关的入口。

## 说明

1. 工程默认使用 UI5 middleware 提供本地 OData mock 服务，直接访问应用即可看到 mock 数据。
2. `test/mockServer.html` 额外演示了浏览器侧 MockServer 的初始化方式，便于对照官方教程结构。
3. 根级自动化测试已经迁到 `../sapui5-testing-demo-autotest`，避免与应用目录混在一起。
