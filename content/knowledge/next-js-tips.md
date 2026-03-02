---
title: Next.js App Router 踩坑记录
date: '2026-03-03'
description: 关于如何解析 Markdown 和应用 Server Components。
---

使用 `getSortedPostsData` 可以无缝对接服务端组件，将数据渲染出来。

## 关键点
不要在 `generateStaticParams` 之外使用 Node.js `fs`，要注意运行环境。
