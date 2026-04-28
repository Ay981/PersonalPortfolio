---
title: 'ZeroDay    Part 1: Building a High-Performance Data Engine'
description: 'How I killed 501 database queries, implemented GIN full-text search in PostgreSQL, and designed a stable API contract that survives schema changes.'
projectKey: 'zeroday'
projectName: 'ZeroDay Bug Bounty Platform'
part: 1
pubDate: 2026-04-18
tags:
  - Laravel
  - PostgreSQL
  - Performance
---

## Intro

I didn't want to build another generic CRUD app. I wanted to engineer something that could handle thousands of vulnerability reports under real load    fast, predictable, and clean. ZeroDay is a Bug Bounty platform: security researchers report exploits, companies manage triage. This first part is about what happens before any user even sees the UI    the data layer, and why getting it right changes everything.

---

## Context

Most tutorials stop at "it works." I wanted to know *why it's slow*    and then fix it properly.

ZeroDay's core is a reports feed: every bug, every severity level, every researcher's submission flowing into a dashboard. The moment I seeded the database with 500+ reports and loaded that dashboard, I knew I had a problem. The problem had a name, and it was already well-known. I just hadn't met it yet.

---

## Work Done

### 1. Killing the N+1 Bloodbath

When Laravel renders a list of reports, it has a naive default: fetch the reports, *then* fetch the related user and program for each one    individually. 500 reports meant **501 separate database queries** on a single page load.

This is called the **N+1 problem**, and it's one of the most common silent killers in web apps. The fix isn't clever    it's just knowing it exists.

```php
// app/Services/ReportService.php

public function listReports(array $filters)
{
    return Report::with(['user', 'program']) // Eager load: fetch relations in 1 query
        ->latest()
        ->filter($filters)
        ->paginate(15);
}
```

`with(['user', 'program'])` tells Laravel: *before you return anything, fetch all the related users and programs in bulk.* The result? **551 queries → 2 queries.** Same data, a fraction of the cost.

> **Simple version:** Instead of asking the database 500 "who wrote this?" questions one-by-one, we ask once: "who wrote *all* of these?"

---

### 2. PostgreSQL GIN Indexing for Full-Text Search

`LIKE '%keyword%'` queries are the enemy of scale. They scan every row, every time. I migrated from SQLite to **PostgreSQL** specifically to use its built-in full-text search engine with **GIN (Generalized Inverted Index)** indexing.

Think of a GIN index like a book's index page    instead of reading every page to find "RCE," you go straight to the page number. PostgreSQL builds that index for you.

```sql
-- The raw proof of elite speed
EXPLAIN ANALYZE
SELECT * FROM reports
WHERE to_tsvector('english', title || ' ' || description)
      @@ websearch_to_tsquery('english', 'RCE');

-- RESULT: Bitmap Index Scan on reports_search_index (actual time=0.028ms)
-- Execution Time: 0.082 ms
```

Searching **10,000+ reports** for a keyword: **0.082ms**. That's not a typo.

> **Simple version:** PostgreSQL's full-text search doesn't just scan rows    it uses a pre-built map of every word across every report. Finding "RCE" is instant because the map already knows exactly where it lives.

---

### 3. The Data Contract (API Resources)

APIs break frontends when the backend changes. I treated the API like a **standalone product** with a stable public contract    if the database schema changes, the JSON response doesn't.

Laravel API Resources act as a transformation layer: raw Eloquent model goes in, clean JSON envelope comes out.

```json
{
  "data": {
    "id": 551,
    "slug": "rce-in-auth-module-af82z",
    "title": "Remote Code Execution in Auth Module",
    "severity": "Critical",
    "submitted_by": {
      "name": "Aymen",
      "reputation": 1500,
      "level": 15
    },
    "created_at": "2026-04-28T08:00:00Z"
  }
}
```

The frontend always gets `submitted_by.name`. Whether the database column is called `users.full_name` or `users.display_name` is irrelevant    the Resource handles the mapping.

> **Simple version:** Think of it as a translator sitting between the database and the frontend. The frontend speaks one language (the contract), the database can speak whatever it wants.

---

## Challenges

The N+1 discovery was humbling. It's the kind of bug that doesn't throw an error    it just silently degrades. The only reason I caught it was by watching the query log while scrolling the dashboard. **Laravel Debugbar** showed me 551 queries stacked up, and that number alone was the diagnosis.

The harder challenge was convincing myself to migrate from SQLite to PostgreSQL mid-project. It felt like over-engineering at the time. It wasn't    the GIN index alone justified it, and Part 3 (pgvector) would've been impossible without that migration.

---

## Result

- Dashboard load: **551 queries → 2**
- Full-text search on 10,000+ records: **0.082ms**
- API contract stable and decoupled from schema changes
- Foundation ready for the security and intelligence layers ahead

---

## Next Step

Part 2 is about locking the fortress. XSS-proof authentication with Sanctum SPA cookies, a tiered Redis rate limiter, and background queues so the UI never waits on I/O.

---

