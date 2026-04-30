# 小智 (xiaozhi)

EchoBraid echoapp — 管理 [xiaozhi.me](https://xiaozhi.me) 的智能体、设备、音色、对话历史和 MCP 接入点。

## 功能

- 智能体：列表、创建、编辑、删除
- 设备：绑定、列表、设备端 MCP 工具调用
- 音色 / LLM 模型选择（编辑弹窗内联）
- 对话历史浏览
- MCP 接入点 token 生成
- 内置会话助手（`echoagent_invoke`）：自然语言操作上述能力

## 能力

- `ui` — WebContentsView 加载 `index.html`
- `network` — 直连 `xiaozhi.me` REST API
- `storage` — JWT token 存 `localStorage`
- `echoagent_invoke` — 调用 EchoAgent LLM 完成会话助手

## 登录

手机号 + 验证码登录走 EchoBraid bridge fetch（绕 CORS）。浏览器调试模式只能粘贴已通过 CLI 取得的 JWT。

JWT 仅写本地 `localStorage`（key: `xiaozhi.jwt` / `xiaozhi.base`），不上传任何第三方。
