# 番茄钟 · 专注学习计时

一个给自己用的番茄钟网页 App：点一下开始倒计时，到点响铃提醒继续学习，并自动按天汇总今天一共学了多久。可以装到 iPhone 桌面，当成原生 App 使用。

> 改造自 [drt-dave/pomodoro](https://github.com/drt-dave/pomodoro)（MIT License）。

**已上线：<https://shichao194416.github.io/pomodoro/>**
用 iPhone 的 **Safari** 打开这个地址 → 分享 → 添加到主屏幕，就能当 App 用。

---

## 功能

**计时**
- 学习时长与休息时长分开设置（默认 25 分钟 / 5 分钟）
- **墙钟倒计时**：按真实时间戳计算剩余时间，锁屏或切到别的 App 再回来，时间依然准确
- **到点强提醒**：全屏弹窗 + 连响 3 声（+ 支持设备震动），一个按钮直接「开始休息 / 继续学习」
- **屏幕常亮**：计时期间用 Screen Wake Lock 保持亮屏（iOS 16.4+），确保到点一定响

**每日总结**
- 今日学习时长（大字）、今日番茄数、连续天数、累计天数
- 每天一行历史记录 + 按当天时长的柱状条
- **只统计专注时段**，休息不计入学习时长

**其他**
- **横屏专注模式**：手机横过来自动进入全屏沉浸界面 —— 只有发光进度环、大倒计时、开始/暂停按钮和右上角「退出横屏」。其余界面（顶栏、底栏、标签、备注、统计）**整体卸载**，DOM 里都干净
- 退出专注模式后有双栏布局可用（左侧大倒计时，右侧标签与备注），顶栏的 ⤢ 按钮可以随时回到专注模式
- 标签与备注：给每次专注打标签、写备注，可按标签筛选
- 离线可用：Service Worker 预缓存全部资源（含提示音）
- 深色模式，6 种语言（简体中文 / English / Español / Français / Esperanto / Русский）

---

## 本地开发

```bash
npm install
npm run dev            # http://127.0.0.1:5173
```

## 构建与预览

```bash
npm run build                     # 产物在 dist/
npm run serve                     # 静态预览 http://127.0.0.1:4173
npm run serve -- 4173 0.0.0.0     # 顺带在局域网暴露，手机同 Wi-Fi 可访问
```

查看 iPhone 尺寸效果（横屏 + 竖屏对照）：<http://127.0.0.1:4173/__dev/frame.html>

## 测试

```bash
npm test
```

`src/App.smoke.test.tsx` 在 jsdom 里真实渲染整个 App，覆盖：中文界面渲染、每日汇总只算专注时段（排除休息）、无记录时的空状态。

## 重新生成图标

iOS 不认 SVG 图标，所以图标是真实 PNG。它们由 `tools/make-icons.mjs` 用 Node 内置 `zlib` 手写 PNG 编码器绘制，不依赖任何图形库：

```bash
npm run icons
```

## 部署到 GitHub Pages

线上地址：<https://shichao194416.github.io/pomodoro/>
仓库：<https://github.com/shichao194416/pomodoro>

Pages 的发布源是 **`gh-pages` 分支**（`main` 放源码，`gh-pages` 放构建产物）。

### 为什么不是 GitHub Actions 自动构建

原本的 `deploy.yml` 放在 `.github/workflows/` 下，但 GitHub 规定：**推送/修改工作流文件需要 Token 具备 `workflow` 权限**，而当前 gh 登录的 Token 只有 `gist, read:org, repo`，因此推送被拒：

```
refusing to allow an OAuth App to create or update workflow
`.github/workflows/deploy.yml` without `workflow` scope
```

所以工作流文件被移到了 `deploy/github-actions-deploy.yml` 作为备用方案（内容仍然有效）。
如果你以后想启用全自动构建：

```bash
gh auth refresh -h github.com -s workflow
mkdir -p .github/workflows
git mv deploy/github-actions-deploy.yml .github/workflows/deploy.yml
git commit -m "启用 Actions 自动部署"
```

然后再去仓库 **Settings → Pages → Source** 改成 **GitHub Actions**。

### 日常更新：一条命令

```bash
npm run deploy          # 用 /pomodoro/ 基路径构建，并把 dist 推到 gh-pages
npm run verify          # 检查线上每个资源是否都返回 200
```

`npm run deploy` **只访问 `api.github.com`**，不走 `git push`。这一点很重要：部分网络环境（尤其国内）会阻断 `github.com:443` 但 `api.github.com` 正常，此时 `git push` 会超时失败，而 `npm run deploy` 仍然能用。

先用 `npm run netcheck` 可以诊断当前网络对各个 GitHub 主机的连通性。

### 直接用 git push

网络正常时也可以照常：

```bash
git push
```

注意 `main` 分支的推送**不包含** `.github/workflows/` 下的文件（已移走），所以不会触发 `workflow` 权限问题。推完后还需要 `npm run deploy` 才会更新线上站点。

---

## iPhone 安装

完整步骤见 [iPhone安装教程.md](./iPhone安装教程.md)。要点：

1. 用 **Safari** 打开 <https://shichao194416.github.io/pomodoro/>
2. 点「分享」→「添加到主屏幕」
3. 桌面出现番茄图标，点开即全屏运行

---

## 已知限制（重要）

- iOS **不允许网页 App 在后台弹通知**，也**无法锁定横屏**。本 App 的对策是计时期间保持屏幕常亮；如果手动锁屏或切走，回到 App 时会立即补响提醒（时间按真实流逝计算，不会算错）。
- iPhone 侧面的**静音拨杆**会静音网页音频，学习时请关掉静音。
- 数据存在本机 Safari 的 `localStorage`。清理 Safari 网站数据，或删除主屏幕图标，都会丢失记录。

---

## 目录结构

```
src/
  components/
    Timer.tsx               倒计时主界面
    SessionAlert.tsx        到点全屏提醒（不自动消失）
    DailySummary.tsx        每日总结
    SettingsPanel.tsx       设置面板
  hooks/
    useWakeLock.ts          屏幕常亮
    useSound.ts             提示音
    pomodoro/
      useTimer.ts           墙钟倒计时引擎
      useTimerCompletion.ts 到点处理：记录、响铃、切换阶段
  utils/
    alarm.ts                Web Audio 音频解锁与播放（iOS 关键）
    translations.ts         6 种语言文案
    formatTime.ts           时间格式化
  App.smoke.test.tsx        运行时冒烟测试
tools/
  make-icons.mjs            生成 PNG 图标
  serve.mjs                 零依赖静态预览服务器
  deploy-pages.mjs          一键部署（构建 + API 推送到 gh-pages）
  gh-api-push.mjs           用 GitHub REST API 推送目录到某个分支
  verify-site.mjs           校验线上资源是否全部可访问
  netcheck.mjs              诊断 GitHub 各主机连通性
  fetch-gh.mjs              下载便携版 gh CLI
deploy/
  github-actions-deploy.yml 可选的 Actions 自动部署（需 workflow 权限）
dev/
  frame.html                iPhone 横竖屏尺寸预览页
```

---

## License

MIT。改造自 [drt-dave/pomodoro](https://github.com/drt-dave/pomodoro)，原项目同样以 MIT 发布。
