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

## Intro

This part documents the initial frontend decisions for theme consistency, data flow, and resilient product-listing UX.

## Context

E-commerce pages require fast feedback and stable UI states, especially around loading, filtering, and errors.

## Work done

- Established theme tokens early to keep dark mode consistent.
- Used RTK Query for predictable request and cache behavior.
- Standardized loading and error states in listing views.

```ts
const { data, isLoading, error } = useGetProductsQuery({ categoryId, page });
```

## Challenges

The main challenge was keeping UI responsive without introducing brittle state logic as filters and categories grow.

## Result

The listing flow became easier to reason about and users get clearer feedback during loading and failure states.

## Next step

Part 2 covers product listing performance and perceived speed improvements.
