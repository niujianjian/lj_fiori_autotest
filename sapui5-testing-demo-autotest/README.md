# SAPUI5 Testing Demo Autotest

这是 `sapui5-testing-demo` 的独立自动化测试工程。

- 被测应用保留在 `../sapui5-testing-demo`
- 应用内开发测试保留在 `../sapui5-testing-demo/webapp/test`
- 本目录只承载根级自动化测试工程：WDIO 配置、QUnit/OPA headless 校验、wdi5 e2e、失败截图和文本 artifact

## 安装

```bash
npm install
```

## 常用命令

```bash
npm run test:unit:ci
npm run test:opa:ci
npm run test:e2e:ci
npm run test:all:ci
```

这些命令会通过 `npm --prefix ../sapui5-testing-demo run start:ci` 启动被测应用，然后再执行自动化测试。

## 故意失败的 artifact 验证

```bash
npm run test:unit:report-failure:ci
npm run test:e2e:report-failure:ci
```

这两条命令失败是预期行为，用于验证截图和文本报告是否会生成到 `test-results/`。

## 目录说明

- `test/e2e`: wdi5 端到端脚本
- `test/qunit`: QUnit 和 OPA 的 headless 校验脚本
- `test/wdio`: 共用 WDIO 配置和 artifact helper
- `test-results`: 运行后生成的截图和文本报告