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

I wanted to build a full-stack learning platform with a real workflow for students, instructors, and admins.
The goal was to balance product clarity with maintainable backend rules.

## Stack direction

I chose React + Vite for a fast frontend feedback loop, and Laravel for structured APIs and authentication.

```ts
// Example role guard concept used in frontend route handling
const canAccess = (role: 'student' | 'instructor' | 'admin', route: string) => {
	if (route.startsWith('/admin')) return role === 'admin';
	if (route.startsWith('/instructor')) return role === 'instructor' || role === 'admin';
	return true;
};
```

## Lesson learned

Define role boundaries early. If roles are loosely defined at the beginning, every new feature introduces hidden authorization debt.

## Image support

### Example screenshot

![ACT E-Learning course listing example](/projects/ACTelearning.png)

When adding screenshots, place images in `public/blog/act-elearning/` and reference them like this:

```md
![Dashboard screenshot](/blog/act-elearning/dashboard-v1.png)
```
