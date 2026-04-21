# SAPUI5 Test Tool

这是一个独立放在 `fiori_autotest-main` 下的本地测试工具，用浏览器 UI 去控制兄弟目录里的 SAPUI5 测试项目。

## 能力

- 自动发现同级目录下带 `package.json` 的可运行项目
- 选择目标项目后启动 `start:ci` 或 `start`
- 在 UI 中直接执行 `test:unit:ci`、`test:opa:ci`、`test:e2e:ci`、`test:all:ci`
- 显示最近任务和实时日志
- 支持停止当前 server 或正在运行的测试任务

## 启动

```bash
cd sapui5-test-tool
npm install
npm start
```

默认地址：`http://127.0.0.1:8095`

## 当前推荐搭配

- `sapui5-testing-demo`
- `sapui5-autotest-template`

只要兄弟目录项目存在 `package.json` 且定义了脚本，这个工具都能发现并显示。