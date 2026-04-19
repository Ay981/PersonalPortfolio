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

## Intro

This part focuses on enforcing safe order transitions and capturing traceable admin actions.

## Context

With the workflow baseline in place, this step adds guardrails so invalid actions do not corrupt operational state.

## Work done

- Added transition restrictions between statuses.
- Planned audit-friendly tracking for who performed actions.
- Introduced explicit rejection reasons for better support context.

```ts
const canTransition = (from: string, to: string) => {
	const allowed: Record<string, string[]> = {
		pending: ['in_progress', 'rejected'],
		in_progress: ['delivered'],
	};
	return allowed[from]?.includes(to) ?? false;
};
```

## Challenges

The tradeoff was strict workflow safety versus flexibility for unusual operations.

## Result

Admin actions became more predictable and easier to audit.

## Next step

Part 3 will cover receipt verification UX and reconciliation edge cases.
