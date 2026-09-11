# 番茄钟 · 专注学习计时

一个给自己用的番茄钟网页 App：点一下开始倒计时，到点响铃提醒继续学习，并自动按天汇总今天一共学了多久。可以装到 iPhone 桌面，当成原生 App 使用。

> 改造自 [drt-dave/pomodoro](https://github.com/drt-dave/pomodoro)（MIT License）。

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
- 横屏布局：手机横过来自动变成双栏（左侧大倒计时，右侧标签与备注）
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

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动跑测试、构建并发布。

`VITE_BASE` 由 workflow 自动设为 `/<仓库名>/`，本地构建根路径时无需设置。

---

## iPhone 安装

完整步骤见 [iPhone安装教程.md](./iPhone安装教程.md)。要点：

1. 用 **Safari** 打开部署好的 HTTPS 地址
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
dev/
  frame.html                iPhone 尺寸预览页
```

---

## License

MIT。改造自 [drt-dave/pomodoro](https://github.com/drt-dave/pomodoro)，原项目同样以 MIT 发布。
