---
title: 'ACT E-Learning: Course Data Modeling and API Contracts'
description: 'Part 2 placeholder covering course entities, enrollment flow, and API response shape decisions.'
projectKey: 'act-elearning'
projectName: 'ACT E-Learning Platform'
part: 2
pubDate: 2026-04-19
tags:
  - API Design
  - Data Modeling
  - Laravel
---

## What I focused on

This part documents how course entities were structured and how enrollment interactions were translated into predictable API contracts.

## Placeholder notes

- Validate input shape at request boundaries.
- Keep course, lesson, and enrollment concerns decoupled.
- Return stable response envelopes for frontend caching.

```ts
// Placeholder pseudo-contract
export type EnrollmentResponse = {
	data: {
		enrollmentId: string;
		courseId: string;
		status: 'active' | 'completed';
	};
};
```

## Next part idea

In Part 3, I’ll cover quiz attempts, scoring strategy, and progress calculation tradeoffs.
