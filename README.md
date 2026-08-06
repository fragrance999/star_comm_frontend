# star_comm_frontend

星邻社 App 端代码仓库，第一阶段使用 uni-app、Vue3 和 TypeScript 搭建注册登录基础能力。

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

## HBuilderX

可以用 HBuilderX 打开本仓库进行 uni-app 开发、真机运行和云打包。

后续 Android 测试包优先使用 HBuilderX 云打包 APK。iOS 测试包需要 Apple Developer 账号和证书，建议后续通过 TestFlight 分发。

## 第一阶段页面

```text
登录页
注册页
首页占位
我的页面
```

第一阶段能力：

- 登录
- 注册并自动登录
- token 本地保存
- 刷新页面恢复登录态
- 退出登录

## 分支规则

基础环境和登录模块可以在 `main` 分支完成。登录模块完成后，后续业务内容开发从 `main` 新建 `feature/*` 分支。
