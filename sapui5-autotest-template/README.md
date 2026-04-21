# SAPUI5 自动化测试最小模板

这个模板包含三层测试：
- QUnit 单元测试
- OPA5 集成测试
- UI5 Service（wdi5 现代实现）端到端测试

## 目录结构

- `webapp/test/unit`：QUnit
- `webapp/test/integration`：OPA5
- `test/e2e`：WebdriverIO + wdio-ui5-service

## 运行方式

```bash
npm install
npm run start
```

启动后可访问：
- `http://localhost:8080/test/testsuite.qunit.html`

运行命令：

```bash
npm run test:unit
npm run test:opa
npm run test:e2e
```

## 说明

1. 先执行 `npm run start` 以启动本地 UI5 服务。
2. `test:e2e` 依赖 Chrome/Chromedriver，请确保本机可用。
3. 你可以把 `demo.autotest` 替换为自己的命名空间，并同步修改测试文件内 `viewName` 和模块路径。
