# Personal Portfolio + Project Devlog

This is an Astro portfolio website with:
- dark/light mode toggle
- project cards
- project-linked blog/devlog system
- Markdown support for code snippets and images

## Routes

- `/` → portfolio homepage
- `/blog` → all project devlogs
- `/blog/project/:projectKey` → devlog feed for one project
- `/blog/:slug` → individual post page

## Blog authoring model

Blog posts are stored in:

`src/content/blog/<project-key>/part-<n>.md`

Current project keys:
- `act-elearning`
- `ecommerce-frontend`
- `le-restaurant`
- `zeroday`

Each post requires frontmatter matching `src/content.config.ts`:

```yaml
---
title: "Post title"
description: "Short summary"
projectKey: "zeroday"
projectName: "ZeroDay API"
part: 2
pubDate: 2026-04-19
tags:
	- Laravel
	- API
draft: false
---
```

## Writing with code snippets

Use fenced blocks in Markdown:

````md
```ts
const result = await apiClient.get('/reports');
```
````

## Writing with images

1. Put images in `public/blog/<project-key>/...`
2. Reference in Markdown:

```md
![Example screenshot](/blog/zeroday/report-details.png)
```

## Development

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm preview`
