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

## Intro

This part covers how I designed the core POS workflow before polishing interface details.

## Context

The dashboard supports order handling and admin decision-making, so state transitions need to be explicit and reliable.

## Work done

- Defined the order lifecycle and valid transitions first.
- Modeled admin review actions as domain events.
- Built UI flows around operational clarity instead of visual effects.

```ts
type OrderStatus = 'pending' | 'in_progress' | 'delivered' | 'rejected';
```

## Challenges

The hardest part was keeping edge-case handling clear for both admins and customers.

## Result

Order workflows became easier to reason about and support teams get clearer action paths.

## Next step

Part 2 covers state-machine guardrails and audit-friendly admin actions.
