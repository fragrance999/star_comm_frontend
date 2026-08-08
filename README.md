# star_comm_frontend

星邻社 App 端代码仓库，使用 uni-app、Vue3 和 TypeScript 构建账户基础能力与星灵最小体验。

## 技术栈

- Node 24
- uni-app
- Vue3
- TypeScript
- Pinia
- HBuilderX

## 本地环境

系统环境由开发者自己维护。建议先确认：

```bash
nvm use 24
node -v
npm -v
```

期望 Node 为 `v24.x`。

安装依赖：

```bash
npm install
```

说明：DCloud npm 包的 `latest` tag 当前会解析到 Vue2 线。本项目使用 Vue3/Vite，因此 `package.json` 已锁定 DCloud `vue3` tag 对应版本，不要随意改回 `latest`。

创建本地环境变量：

```bash
cp .env.example .env
```

默认后端地址：

```text
http://127.0.0.1:8000/api/v1
```

## 启动 H5

先确认后端已启动：

```text
http://127.0.0.1:8000/health
```

然后启动前端：

```bash
npm run dev:h5
```

## 服务器 H5 部署

服务器部署由后端仓库的生产 Compose 统一编排：

```text
star_comm_api/deploy/production/docker-compose.yml
```

生产构建时前端使用同源接口：

```text
VITE_API_BASE_URL=/api/v1
```

因此手机访问 `http://82.156.43.206` 时，前端请求会走：

```text
http://82.156.43.206/api/v1
```

## HBuilderX

可以用 HBuilderX 打开本仓库进行 uni-app 开发、真机运行和云打包。

后续 Android 测试包优先使用 HBuilderX 云打包 APK。iOS 测试包需要 Apple Developer 账号和证书，建议后续通过 TestFlight 分发。

## 已实现页面

```text
登录页
注册页
星灵创建
首次访谈与候选记忆确认
星灵流式聊天
星灵首页
我的页面
```

当前能力：

- 登录
- 注册并自动登录
- token 本地保存
- 刷新页面恢复登录态
- 退出登录
- 创建星灵并选择形态、性格和主动联系频率
- H5 SSE 流式对话、断点恢复与第一条记忆确认
- 星灵性格和主动联系频率调整

## 分支规则

基础环境和登录模块可以在 `main` 分支完成。登录模块完成后，后续业务内容开发从 `main` 新建 `feature/*` 分支。
