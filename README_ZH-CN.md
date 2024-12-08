<div align="center">
<img src="https://raw.githubusercontent.com/luyu0279/BrainyAi/main/misc/logo.png" width="350px">
<h2>BrainyAI：一个免费且开源的浏览器侧边栏插件，提供了像 Sider、Monica 和 Merlin 等产品的免费替代方案。 </h2>

[![GitHub license](https://img.shields.io/badge/license-GPL%203.0-blue)](https://github.com/luyu0279/BrainyAi/blob/main/LICENSE)

[English](README.md) ｜ 简体中文
<p>
  <a style="font-size: 28px" href="https://chromewebstore.google.com/detail/brainyai/jmcllpdchgacpnpgechgncndkfdogdah?utm_source=github&utm_medium=pr&utm_campaign=0614">
  ⏬⏬ 从 Chrome web store 下载 BrainyAI
</a>
</p>
</div>


<br>

## 简介

🧠BrainyAI 是一个完全免费的 Chrome 浏览器扩展程序。用户只需一次登录到各种 AI 网站，然后他们就可以使用 BrainyAI 将大型模型的能力带入他们的日常工作和生活场景。通过便捷的侧边栏，BrainyAI 提供了 AI 聊天聚合、AI 搜索、AI 阅读和增强的 AI 网页浏览等功能。

使用 BrainyAI 时，用户无需离开当前网页。他们可以利用像 GPT-4、GPT-4o、Claude、Gemini、Moonshot 和 LLaMA3 这样的高级大型语言模型，执行对话、搜索、网页摘要和文件阅读等任务——完全免费。BrainyAI 是类似产品如  **[Sider AI](https://sider.ai)**, **[Monica](https://monica.im)**, **[Merlin](https://www.getmerlin.in)**, 和 **[MaxAI](https:///www.maxai.me)** 的免费替代品。🌐
<br>

## 主要特性

- 🤖 免费与多个顶级 AI 模型进行群聊
- 🔍 免费从多个顶级 AI 搜索引擎获取答案
- 📚 免费使用顶级 AI 模型协助进行网页/YouTube 摘要
- 💬 免费在文档中与顶级 AI 模型进行对话

<br>

| 特性                | 截图                                                                                                 | 
|-------------------|----------------------------------------------------------------------------------------------------| 
| 同时向多个模型提问         | ![20240614-190440](https://raw.githubusercontent.com/luyu0279/BrainyAi/main/misc/group_chat.gif)   | 
| 从多个顶级 AI 搜索引擎获取答案 | ![20240614-191334](https://raw.githubusercontent.com/luyu0279/BrainyAi/main/misc/multi_answer.gif) | 
| 网页/YouTube 摘要     | ![20240614-191334](https://raw.githubusercontent.com/luyu0279/BrainyAi/main/misc/summaries.gif)    | 

<br>
<br>

## 支持的 LLMs

| LLMs           | Provider              | status |
|----------------|-----------------------|--------|
| Gpt3.5         | chatgpt.com           | 支持     |
| Gpt4           | chatgpt.com           | 支持     |
| Gpt4o          | chatgpt.com           | 支持     |
| Gpt4           | copilot.microsoft.com | 支持     |
| Gemini         | gemini.google.com     | 支持     |
| Moonshot       | kimi.moonshot.cn      | 支持     |
| LLama 3        | perplexity.ai         | 支持     |
| Claude 3 haiku | perplexity.ai         | 支持     |
| Gemma-7b       | perplexity.ai         | 支持     |
| llava-v1.6     | perplexity.ai         | 支持     |
| Mistral-8×22b  | perplexity.ai         | 支持     |
| Claude 3       | claude.ai             | 即将推出   |


More is coming.

<br>

## 隐私

在 BrainyAI，我们优先考虑用户隐私，并采取一切措施保护您的个人信息。我们从不上传或分享任何敏感数据，包括但不限于：

- 本地 cookie 信息
- 聊天会话数据
- 账户信息
- 其他

所有聊天历史、设置和登录数据都安全地存储在您的设备上。我们从不从我们的服务器收集或访问这些信息。

<br>
<br>

---

## 如果你是开发者

### 开始开发

首先，安装必要的依赖：

```bash
npm install pnpm -g
```

```bash
pnpm install
```

然后，启动开发服务器：
```bash
pnpm dev
```

打开浏览器并加载适当的开发构建。例如，如果您正在为Chrome浏览器开发，使用manifest v3，请使用：`build/chrome-mv3-dev`。

关于开发框架的更多说明, [请访问 plasmo 文档](https://docs.plasmo.com/)

### 生产构建

运行以下命令：

```bash
pnpm build
```

### 包含调试信息的生产构建

运行以下命令：

```bash
pnpm build:staing
```

### 启用 GA4 Measurement protocol

```bash
mv .env.example .env
```

然后在 `.env` 文件中添加 GA4 Measurement ID 和 API Secret

## 欢迎加入我们的社区

<a href="https://discord.gg/FXgVQQwP8s">
    <img src="https://img.shields.io/discord/981138088757690398?label=Discord&logo=discord&logoColor=white&style=for-the-badge" alt="Discord">
</a>
