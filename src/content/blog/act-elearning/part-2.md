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

## Intro

This part focuses on how course entities and enrollment interactions are represented through stable API contracts.

## Context

After defining architecture in Part 1, the next step is making sure backend models and frontend expectations stay in sync.

## Work done

- Outlined entity boundaries for courses, lessons, and enrollments.
- Defined request and response shapes for enrollment flows.
- Kept response envelopes consistent for predictable frontend caching.

```ts
export type EnrollmentResponse = {
	data: {
		enrollmentId: string;
		courseId: string;
		status: 'active' | 'completed';
	};
};
```

## Challenges

The key tradeoff was balancing strict API contracts with flexibility for future course workflow changes.

## Result

The API shape is now clearer for clients and easier to validate at request boundaries.

## Next step

Part 3 will cover quiz attempts, scoring strategy, and progress calculation tradeoffs.
