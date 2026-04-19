---
title: 'Building ACT E-Learning: Architecture Decisions'
description: 'Part 1 on role-based LMS design, backend/frontend split, and why I chose this stack.'
projectKey: 'act-elearning'
projectName: 'ACT E-Learning Platform'
part: 1
pubDate: 2026-04-18
tags:
  - React
  - Laravel
  - Architecture
---

## Why this project

## Intro

This part covers the initial architecture decisions for ACT E-Learning and why I set boundaries before adding UI complexity.

## Context

The project is a role-based LMS for students, instructors, and admins. I needed a structure that keeps authorization clear as features grow.

## Work done

- Defined role boundaries and access rules up front.
- Chose React + Vite for fast frontend iteration.
- Chose Laravel for authenticated API structure and backend rules.

```ts
const canAccess = (role: 'student' | 'instructor' | 'admin', route: string) => {
	if (route.startsWith('/admin')) return role === 'admin';
	if (route.startsWith('/instructor')) return role === 'instructor' || role === 'admin';
	return true;
};
```

## Challenges

The main challenge was preventing role logic from becoming scattered across routes and components.

## Result

Access control became predictable and easier to maintain, which reduced hidden authorization debt before larger features landed.

## Next step

The next part covers course data modeling and API contracts for enrollment and content delivery.
