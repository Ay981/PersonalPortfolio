---
title: 'Restaurant POS Dashboard: Workflow Before UI'
description: 'Part 1 on modeling order states, admin actions, and receipt verification process.'
projectKey: 'le-restaurant'
projectName: 'My Restaurant v2 POS Dashboard'
part: 1
pubDate: 2026-04-18
tags:
  - Next.js
  - Supabase
  - Product Design
---

## Start from state transitions

I defined order statuses and transitions first (`pending`, `in_progress`, `delivered`, `rejected`) before building polished UI.
That made edge cases easier to reason about.

```ts
type OrderStatus = 'pending' | 'in_progress' | 'delivered' | 'rejected';
```

## Receipt review process

Manual review logic required clear feedback paths for both admins and users.
I treated decisions as domain events instead of just UI button clicks.

## Lesson learned

When operations and support teams use your product, workflow clarity is more important than dashboard aesthetics.
