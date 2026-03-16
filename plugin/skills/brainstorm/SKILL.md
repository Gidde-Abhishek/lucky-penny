---
name: brainstorm
description: "Lightweight brainstorming skill for thinking before coding. Use when the user wants to build something new, add a feature, make a design decision, or is unsure how to approach a problem. Triggers on phrases like 'how should I build this', 'I want to add', 'what approach', 'help me think through', 'brainstorm', or 'design decision'."
---

# Brainstorm: Think Before You Code

A lightweight skill for structured thinking before implementation. Spend 2-5 minutes clarifying the problem and evaluating approaches — avoid the "jump straight to code" trap that leads to rework.

## When to Use

- User wants to build something new
- User wants to add a feature to an existing codebase
- User faces a design decision with multiple valid approaches
- User is unsure how to approach a problem
- User explicitly asks to brainstorm or think through something

## When NOT to Use

- Bug fixes with obvious solutions — just fix the bug
- Simple refactors or renames
- Tasks the user has already decided how to do
- User says "just do it" or "skip planning"

If the answer is obvious and the user knows what they want, say: "This seems straightforward — should I just go ahead, or do you want to explore alternatives first?"

## The Flow

### Phase 1: Understand (1-2 clarifying questions max)

Before proposing anything, make sure you understand:

1. **What** they want to achieve (the goal, not the implementation)
2. **Why** it matters (context helps evaluate tradeoffs)
3. **Constraints** they already know about (existing patterns, tech choices, performance requirements)

Ask at most 2 clarifying questions using AskUserQuestion. If the request is already clear, skip straight to Phase 2.

**Good clarifying questions:**
- "Is this user-facing or internal tooling?"
- "Does this need to work with [existing system X] or is it standalone?"
- "Any performance constraints I should know about?"

**Bad clarifying questions (avoid these):**
- "Can you tell me more about your project?" — too open-ended
- "What's your testing strategy?" — premature detail
- "Have you considered using X?" — proposing before understanding

### Phase 2: Propose (2-3 approaches with tradeoffs)

Present 2-3 concrete approaches. For each:

**Approach A: [Descriptive Name]**
- **How it works:** 1-2 sentences
- **Pros:** 2-3 bullet points
- **Cons:** 1-2 bullet points
- **Best when:** 1 sentence on when this approach shines

**Approach B: [Descriptive Name]**
- **How it works:** 1-2 sentences
- **Pros:** 2-3 bullet points
- **Cons:** 1-2 bullet points
- **Best when:** 1 sentence

[Optional Approach C if meaningfully different]

**Recommendation:** State which approach you'd recommend and why, but make it clear the user decides.

**Guidelines for good approaches:**
- Each approach must be meaningfully different — not minor variations of the same idea
- Include at least one "simple but limited" option and one "more work but more flexible" option
- Ground approaches in the actual codebase — reference existing patterns, files, utilities, and conventions. Check what exists before proposing something new.
- Be honest about tradeoffs — don't soft-pedal the cons. Every approach has real downsides.

### Phase 3: Decide

Let the user pick. Accept their choice without pushback. If they want to modify an approach or combine elements, that's fine — work with them.

Once they decide, briefly summarize:
- The chosen approach in one sentence
- First 2-3 concrete implementation steps
- Key files that will be created or modified

Then proceed to implementation. For larger tasks, suggest: "This is a bigger change — want to use Plan mode (Shift+Tab) so I can think through the full implementation before writing code?"

## Principles

- **Speed over formality.** This should take 2-5 minutes, not 20. No spec documents, no design reviews, no formal write-ups.
- **Grounded in code.** Always check the actual codebase first. What patterns already exist? What utilities can be reused? Don't propose abstractions that duplicate existing code.
- **Honest tradeoffs.** Every approach has downsides. Name them clearly. Users trust you more when you're direct about cons.
- **User decides.** Present options and recommend one, but never override the user's choice. If they pick the approach you didn't recommend, respect it and execute well.
- **Know when to skip.** Not everything needs brainstorming. If the path is obvious, say so and move on. Forcing a brainstorm session on a trivial task wastes time and erodes trust.
