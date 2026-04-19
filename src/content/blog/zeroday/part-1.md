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

## Intro

This part introduces how I structured the ZeroDay API for authenticated bug reporting.

## Context

The API needed secure authentication and predictable report workflows that frontend clients can integrate without guesswork.

## Work done

- Built endpoints around Sanctum-authenticated access.
- Standardized response envelopes with Laravel resources.
- Kept report lifecycle endpoints consistent in shape and behavior.

```json
{
  "data": {
    "id": 195,
    "title": "Race condition in report exporter",
    "status": "Open"
  }
}
```

## Challenges

The challenge was keeping the contract stable while still leaving room for future report metadata.

## Result

Frontend integration became faster because every endpoint follows the same response expectations.

## Next step

Part 2 covers validation strategy and consistent error handling.
