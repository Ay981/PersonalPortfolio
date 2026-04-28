---
title: 'ZeroDay   Part 3: The Intelligence Edge'
description: 'How I gave ZeroDay a brain   Gemini AI auto-triage, pgvector semantic search that finds meaning instead of matching letters, and a React frontend built as a stateful command center.'
projectKey: 'zeroday'
projectName: 'ZeroDay Bug Bounty Platform'
part: 3
pubDate: 2026-04-25
tags:
  - AI
  - pgvector
  - React
---

## Intro

Fast and secure is table stakes. What separates a portfolio project from a platform is intelligence   the system doing work that used to require a human. Part 3 is where ZeroDay stops being a database with a UI and becomes something closer to a co-pilot for security teams.

---

## Context

Security triage is genuinely hard. An admin reviewing a flood of bug reports has to read each one, assess the severity, cross-reference known vulnerability patterns, and decide what to act on first   all before their morning coffee. I wanted the platform to do the first pass automatically.

And there was a second problem: keyword search is dumb. A Security Lead searching for "Database Leak" gets zero results if every relevant report is titled "SQL Injection." The words don't match, but the *meaning* does. That gap needed closing.

---

## Work Done

### 1. AI Auto-Triage with Google Gemini

Every incoming bug report now gets automatically analyzed before a human opens it.

When a researcher submits a report, a background job fires   silently, without touching the response time. That job sends the report to **Gemini 2.5 Flash** with a structured prompt: *assess the risk, write an executive summary, suggest a severity level.*

```php
// Background worker   runs after 201 is already returned to the user

$prompt = "You are a senior security analyst. Analyze this vulnerability report
           and return: 1) An executive risk summary (2-3 sentences), 
           2) A suggested severity (Critical/High/Medium/Low), 
           3) Key attack vectors identified.\n\nReport: {$this->report->description}";

$response = Http::post($geminiUrl, [
    'contents' => [['parts' => [['text' => $prompt]]]]
]);

// Stored in a JSONB column   queryable, indexable, flexible
$this->report->update([
    'ai_analysis' => $response->json('candidates.0.content')
]);
```

The result lands in a **PostgreSQL JSONB column**   not a text dump, but a structured object. This means I can later query *across* AI analyses: filter all reports where Gemini flagged "authentication bypass," or sort by AI-suggested severity.

When an admin opens the report, the triage box is already filled. The AI has done the reading. The human makes the decision.

> **Simple version:** Every new bug report gets a first-read from an AI analyst that never sleeps. By the time a human opens the ticket, there's already a risk summary waiting.

---

### 2. Semantic Search with pgvector

This is the feature I'm most proud of. And it starts with a simple insight: words are a lossy representation of meaning.

"SQL Injection" and "Database Leak" describe overlapping concepts   an attacker exploiting a database through malformed input. A keyword search sees two different strings. A semantic search sees the relationship.

Here's how it works:

1. When a bug report is saved, I send its text to an embedding model (Google's `text-embedding-004`). The model returns a **768-dimensional vector**   a list of 768 numbers that encodes the semantic meaning of the text.
2. That vector is stored in PostgreSQL using the **pgvector** extension.
3. When an admin searches, the query gets embedded the same way.
4. PostgreSQL finds the reports whose vectors are *closest* to the query vector   closest meaning = most relevant result.

```php
// Convert the search query into a meaning-vector
$searchVector = $this->getEmbedding($searchQuery); // Returns [0.023, -0.847, ...]

// Find reports whose meaning is closest to the query
// <=> is the cosine distance operator from pgvector
return $query->orderByRaw("embedding <=> ?", [$searchVector])
             ->where("embedding <=> ? < 0.3", [$searchVector]) // Similarity threshold
             ->limit(20);
```

Search "Database Leak" → finds "SQL Injection on Login." Search "privilege escalation" → finds "admin panel bypass via cookie manipulation." The system understands *what you mean*, not just what you typed.

> **Simple version:** Normal search is like Ctrl+F   it looks for the exact letters. Semantic search is like asking a colleague   they understand what you're looking for and find the relevant thing, even if the words don't match.

> **Technical version:** Each document is a point in 768-dimensional space. Similar meanings cluster together. Cosine distance measures the angle between two vectors   a small angle means similar meaning. pgvector's `<=>` operator does this comparison in optimized C, across the entire reports table, in milliseconds.

---

### 3. React State Orchestration   The Command Center

The frontend isn't an afterthought. It's a stateful command center where every piece of state is deliberate.

**URL as Source of Truth**

Filters, pagination, and search queries live in the browser's address bar   not in component state.

```
/reports?page=3&severity=Critical&search=RCE&sort=newest
```

This means every view is **deep-linkable and shareable**. A security lead can send a filtered URL to a colleague and they land on the exact same view. Refreshing the page doesn't lose your filters. It's a small decision with a big UX impact.

**TanStack Query + Optimistic Updates**

When an admin deletes a report, it disappears from the UI in **0ms**. The DELETE request fires in the background. If it fails, the item reappears with an error toast. If it succeeds, nothing changes visually   it's already gone.

```tsx
const deleteReport = useMutation({
  mutationFn: (id: number) => api.delete(`/reports/${id}`),
  onMutate: async (id) => {
    // Remove from cache immediately   don't wait for server
    queryClient.setQueryData(['reports'], (old) =>
      old?.filter((r) => r.id !== id)
    );
  },
  onError: (_, id, context) => {
    // Server said no   put it back
    queryClient.setQueryData(['reports'], context.previousReports);
    toast.error('Failed to delete. Please try again.');
  }
});
```

**Sileo UI Toasts**

Real-time feedback uses morphing SVG toasts   the icon transitions from loading spinner to checkmark or error state with a smooth shape tween. It's a small detail. It makes the platform feel like software someone actually cared about building.

---

## Challenges

The hardest part of pgvector was the migration: adding a `vector(768)` column to an existing table and backfilling embeddings for hundreds of existing reports. I batched the embedding generation to avoid hitting the API rate limit, storing progress checkpoints so the job could resume if interrupted.

The semantic search threshold was also non-obvious. Too low (`< 0.1`) and only near-identical texts match. Too high (`< 0.5`) and you get noise. `0.3` was the sweet spot for ZeroDay's use case, found through manual testing with real report pairs.

---

## Result

- Every report triaged by AI before a human opens it   severity suggested, risk summarized
- Semantic search finds conceptual matches across 768-dimensional meaning-space
- UI deletes, updates, and responds in 0ms with optimistic state
- Every view is deep-linkable via URL state   shareable, bookmarkable, resumable

---

## Closing

ZeroDay is the result of 9 weeks of systems engineering. Not 9 weeks of coding   9 weeks of making architectural decisions and living with their consequences.

The N+1 fix taught me to always watch the query log. The XSS migration taught me that convenience and security are usually at odds, and security wins. The pgvector implementation taught me that the line between "feature" and "research" is thin when you're building something genuinely new.

If there's a throughline: every decision was made by asking *what breaks at scale?* and then fixing it before scale arrived.

---

