---
title: 'E-Commerce Frontend: Theme, Data Flow, and UX'
description: 'Part 1 on dark mode strategy, RTK Query patterns, and resilient client-side UX.'
projectKey: 'ecommerce-frontend'
projectName: 'E-Commerce Frontend'
part: 1
pubDate: 2026-04-18
tags:
  - Next.js
  - TypeScript
  - RTK Query
---

## Theme system first

I prioritized theme architecture early because visual consistency affects every component.
A stable token system made dark mode easier to maintain as pages expanded.

## Data flow notes

RTK Query helped keep request state predictable and avoided manual loading/error boilerplate.

```ts
const { data, isLoading, error } = useGetProductsQuery({ categoryId, page });
```

## Lesson learned

In commerce UI, reliability beats visual complexity. Clear loading states and failure paths improve trust more than decorative interactions.

## Add screenshots

Use local static images per project:

```md
![Product list view](/blog/ecommerce-frontend/listing-page.png)
```
