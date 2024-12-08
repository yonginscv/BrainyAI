<div align="center">
<img src="https://raw.githubusercontent.com/luyu0279/BrainyAi/main/misc/logo.png" width="350px">
<h2>BrainyAI: a free and open-source browser sidebar plugin that offers a cost-free alternative to products like Sider, Monica, and Merlin. </h2>

[![GitHub license](https://img.shields.io/badge/license-GPL%203.0-blue)](https://github.com/luyu0279/BrainyAi/blob/main/LICENSE)

English ｜ [简体中文](README_ZH-CN.md)
<p>
  <a style="font-size: 28px" href="https://chromewebstore.google.com/detail/brainyai/jmcllpdchgacpnpgechgncndkfdogdah?utm_source=github&utm_medium=pr&utm_campaign=0614">
  ⏬⏬ Download BrainyAI from Chrome Web Store
</a>
</p>
</div>

<br>

## Introduction

🧠**BrainyAI** is a completely free Chrome browser extension. Users only need to log in once to various AI websites, and then they can bring the capabilities of large models into their daily work habits and scenarios using BrainyAI. With a convenient sidebar, **BrainyAI** offers features such as AI chat aggregation, AI search, AI reading, and enhanced AI web browsing.

When using **BrainyAI**, users don’t need to leave their current web page. They can leverage advanced large language models like **GPT-4**, **GPT-4o**, **Claude**, **Gemini**, **Moonshot**, and **LLaMA3** for tasks such as conversation, search, summarizing web pages, and reading files—all completely free. BrainyAI is a free alternative to similar products like **[Sider AI](https://sider.ai)**, **[Monica](https://monica.im)**, **[Merlin](https://www.getmerlin.in)**, and **[MaxAI](https:///www.maxai.me)**. 🌐


<br>


## Key features

- 🤖 Group Chat with Top-Tier AIs at Once, for Free
- 🔍 Multiple Answers from Top-Tier AI Search Engines, for Free
- 📚 Top-Tier AIs to assist with Web/YouTube summaries, for Free
- 💬 Engage in conversations with Top-Tier AIs across documents, for Free


<br>


| Features | Screenshot                                                                                         | 
| -------- |----------------------------------------------------------------------------------------------------| 
| Group Chat     | ![20240614-190440](https://raw.githubusercontent.com/luyu0279/BrainyAi/main/misc/group_chat.gif)   | 
| Multiple Answers from Top-Tier AI Search Engines  | ![20240614-191334](https://raw.githubusercontent.com/luyu0279/BrainyAi/main/misc/multi_answer.gif) | 
| Web/YouTube summaries     | ![20240614-191334](https://raw.githubusercontent.com/luyu0279/BrainyAi/main/misc/summaries.gif)                                       | 





<br>
<br>


## Supported LLMs



| LLMs | Provider | status |
| -------- | -------- | -------- |
| Gpt3.5     | chatgpt.com     | Supported     |
| Gpt4     | chatgpt.com     | Supported     |
| Gpt4o     | chatgpt.com     | Supported     |
| Gpt4     | copilot.microsoft.com     | Supported  |
| Gemini     | gemini.google.com     | Supported     |
| Moonshot     | kimi.moonshot.cn     | Supported     |
| LLama 3    | perplexity.ai     | Supported     |
| Claude 3 haiku     | perplexity.ai     | Supported     |
| Gemma-7b    | perplexity.ai     | Supported     |
| llava-v1.6    | perplexity.ai     | Supported     |
| Mistral-8×22b| perplexity.ai     | Supported     |
| Claude 3     | claude.ai     | Soon     |


More is coming.

<br>

## Privacy

At BrainyAI, we prioritize user privacy and take every measure to safeguard your personal information. We never upload or share any sensitive data, including but not limited to:

- Local cookie information
- Chat session data
- Account information
- Etc.

All chat history, settings, and login data are securely stored locally on your device. We never collect or access this information from our servers.

<br>
<br>


---

## For developers


### Getting started

First, install the dependencies:

```bash
npm install pnpm -g
```

```bash
pnpm install
```

Then, start the development server:

```bash
pnpm dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

For further guidance, [visit plasmo Documentation](https://docs.plasmo.com/)

### Making production build

Run the following:

```bash
pnpm build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

### Making production(debug) build, which will reserve the logs

Run the following:

```bash
pnpm build:staing
```



## Community

<a href="https://discord.gg/FXgVQQwP8s">
    <img src="https://img.shields.io/discord/981138088757690398?label=Discord&logo=discord&logoColor=white&style=for-the-badge" alt="Discord">
</a>
