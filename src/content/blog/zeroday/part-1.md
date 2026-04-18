---
title: 'ZeroDay API: Structuring an Authenticated Bug Reporting API'
description: 'Part 1 on Sanctum auth flow, resource responses, and report lifecycle endpoints.'
projectKey: 'zeroday'
projectName: 'ZeroDay API'
part: 1
pubDate: 2026-04-18
tags:
  - Laravel
  - API
  - Sanctum
---

## API goals

I wanted a clear API that supports secure authentication and practical bug report management.
The main priority was consistency in response shape and endpoint behavior.

## Consistent response shape

Using Laravel resources around a `data` wrapper helped keep frontend parsing predictable.

```json
{
  "data": {
    "id": 195,
    "title": "Race condition in report exporter",
    "status": "Open"
  }
}
```

## Lesson learned

The biggest speedup for frontend integration is response consistency, not endpoint count.
A small, stable contract saves time across the whole project lifecycle.
