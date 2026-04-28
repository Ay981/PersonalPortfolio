---
title: 'ZeroDay     Part 2: Hardening the Fortress'
description: 'How I eliminated XSS token theft with HttpOnly cookies, built a three-tier Redis rate limiter, and made the UI feel instant with background job queues.'
projectKey: 'zeroday'
projectName: 'ZeroDay Bug Bounty Platform'
part: 2
pubDate: 2026-04-21
tags:
  - Security
  - Redis
  - Laravel
---

## Intro

A fast platform means nothing if it's leaking credentials. Part 2 is where I stopped thinking like a developer and started thinking like an attacker. Every decision in this layer answers one question: *what happens if someone is actively trying to break this?*

---

## Context

ZeroDay handles sensitive security data     vulnerability disclosures, zero-days, researcher identities. A breach here isn't a bug, it's a headline. The three threats I prioritized: session hijacking via XSS, brute-force on auth endpoints, and slow I/O blocking the user experience.

Each one had a clean, surgical fix.

---

## Work Done

### 1. Neutralizing XSS via Session Migration

The most common auth mistake in modern SPAs: storing tokens in `localStorage`. It's convenient, it's everywhere in tutorials, and it's a critical security flaw.

Here's the attack: a single XSS injection     one rogue `<script>` tag     and the attacker runs `localStorage.getItem('token')` and owns the session. It takes one line of JavaScript.

The fix is architectural, not cosmetic. I migrated the entire authentication system to **Laravel Sanctum SPA Cookies** with `HttpOnly` flags.

```
Set-Cookie: XSRF-TOKEN=...; HttpOnly; Secure; SameSite=Strict
```

`HttpOnly` means JavaScript **cannot read this cookie.** Not your code. Not theirs. The browser sends it automatically with every request, but it's physically inaccessible to any script running on the page.

I paired this with a **CSRF handshake**: before any state-changing request, the frontend fetches a fresh CSRF token from `/sanctum/csrf-cookie`. The server validates it on every write. Cross-site request forgery requires guessing that token     it can't.

> **Simple version:** `localStorage` is like leaving your house key under the doormat     any script can grab it. HttpOnly cookies are kept in a sealed vault only the browser can open. Scripts can't touch it.

---

### 2. Tiered API Firewall

Not all endpoints carry the same risk. A rate limiter that treats the login endpoint the same as a GET request isn't a security strategy     it's theater.

I built a **three-tier risk model** backed by Redis:

| Tier | Endpoint Type | Limit |
|------|--------------|-------|
| 🔴 Auth | Login, password reset | 5 req/min |
| 🟡 Upload | Bug report submission | 10 req/min |
| 🟢 API | General read endpoints | 60 req/min |

```php
// app/Providers/AppServiceProvider.php

RateLimiter::for('auth', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip()); // Brute-force kill switch
});

RateLimiter::for('uploads', function (Request $request) {
    return Limit::perMinute(10)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});
```

Redis stores the counters in memory     no database hits, negligible latency. An attacker hammering the login endpoint hits a wall after 5 attempts. The rest of the platform keeps running unbothered.

> **Simple version:** A bouncer at a club doesn't treat everyone the same     VIPs get a different line, suspicious visitors get a closer look. Same principle here. The riskier the door, the tighter the limit.

---

### 3. Background Queues     The "Never Wait" Rule

Sending an email takes 2–5 seconds. A webhook call can take longer. If the HTTP request that triggers those actions has to *wait* for them to complete, the user is staring at a spinner for no good reason.

I implemented the **Producer-Consumer pattern** using Laravel Queues backed by Redis.

How it works:
1. User registers → controller dispatches a `SendVerificationEmail` job → returns `201 Created` in **~20ms**
2. A background worker picks up the job → handles the Gmail SMTP handshake → done, silently

```php
// Dispatch and forget     the worker handles the rest
SendVerificationEmail::dispatch($user);

return response()->json(['message' => 'Account created.'], 201);
```

The UI never waits on I/O. The worker doesn't care about response times     it just processes the queue. This pattern also gives you retry logic for free: if Gmail is down, the job re-queues and tries again.

> **Simple version:** Imagine a restaurant where the waiter takes your order and immediately confirms it     they don't stand there watching the chef cook. The kitchen runs independently. That's a queue.

---

## Challenges

The trickiest part of the SPA cookie setup was the CORS configuration. Sanctum requires the frontend origin to be explicitly trusted, and cookies only attach when the domains align correctly. Getting `SESSION_DOMAIN`, `SANCTUM_STATEFUL_DOMAINS`, and the frontend's `withCredentials: true` to agree took a full debugging session     but once it clicked, the auth layer felt genuinely solid.

The rate limiter was simpler technically but harder to calibrate. 5 attempts per minute on auth is tight     tight enough to block attackers, loose enough for a user who fat-fingers their password twice.

---

## Result

- Auth tokens physically inaccessible to JavaScript     XSS can't steal sessions
- Login endpoint: 5 req/min hard cap, backed by Redis
- Email verification: UI responds in ~20ms, SMTP handled in background
- Zero blocking I/O in any user-facing request path

---

## Next Step

Part 3 is where the platform gets a brain. AI auto-triage with Gemini, semantic search with pgvector, and a React frontend built as a stateful command center.

---

