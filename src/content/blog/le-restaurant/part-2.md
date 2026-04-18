---
title: 'Restaurant POS: Order State Machine and Admin Actions'
description: 'Part 2 placeholder on workflow transitions, guardrails for admin actions, and audit-friendly events.'
projectKey: 'le-restaurant'
projectName: 'My Restaurant v2 POS Dashboard'
part: 2
pubDate: 2026-04-19
tags:
  - Workflow
  - Supabase
  - Product Engineering
---

## Focus for this part

This placeholder captures the order lifecycle and how admin actions map to safe transitions.

## Placeholder implementation notes

- Restrict invalid status jumps.
- Persist who performed each admin action.
- Surface clear reason fields for rejected orders.

```ts
// Placeholder transition guard
const canTransition = (from: string, to: string) => {
	const allowed: Record<string, string[]> = {
		pending: ['in_progress', 'rejected'],
		in_progress: ['delivered'],
	};
	return allowed[from]?.includes(to) ?? false;
};
```

## Next part idea

Part 3 will cover receipt verification UX and reconciliation edge cases.
