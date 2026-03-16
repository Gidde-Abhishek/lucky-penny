---
name: best-practices
description: "Claude Code best practices advisor. Use when users ask about coding conventions, Claude Code workflows, context engineering, CLAUDE.md structure, hooks setup, or how to work effectively with Claude Code. Triggers on questions like 'how should I structure CLAUDE.md', 'best way to use Claude Code', 'what hooks should I set up', 'how to optimize tokens'."
---

# Claude Code Best Practices Advisor

Provide guidance on Claude Code best practices based on the Lucky Penny knowledge base. Reference the user's existing CLAUDE.md and project configuration when giving advice.

## Key Principles

1. **CLAUDE.md is king** — A well-crafted CLAUDE.md solves 80% of problems. It should include build commands, code conventions, explicit rules with reasons, and domain context.

2. **Validation loops are everything** — Claude must be able to build, test, and self-correct. Document exact build/test/lint commands in CLAUDE.md.

3. **Context is best served fresh and condensed** — Use `/clear` between unrelated tasks. Don't let old debugging context bleed into new features.

4. **Always start in Plan mode** — Press Shift+Tab. Think first, execute second. Good planning produces dramatically better code.

5. **Interrupt early and often** — Watch Claude's thinking. Hit Escape and redirect if it's going off-track.

6. **Git is your safety net** — Commit frequently before risky changes. Use Claude for commit messages and PRs.

7. **MCPs are powerful but expensive** — Only install what you actively need. Audit with `/context`.

8. **Parallel instances multiply throughput** — Run multiple Claude sessions on separate features using git worktrees.

## CLAUDE.md Structure (Priority Order)

Structure content top-to-bottom by importance — Claude gives higher weight to earlier content:

1. **Project Overview** — What this project is (2-3 sentences)
2. **Tech Stack** — Languages, frameworks, key dependencies
3. **Architecture** — High-level structure, key directories, data flow
4. **Build & Validation** — EXACT commands (most impactful section)
5. **Code Conventions** — Naming, patterns, import ordering
6. **Rules** — ALWAYS/NEVER with reasons (the "why" helps Claude apply rules in edge cases)
7. **Common Pitfalls** — Things that trip up contributors

## Rules for CLAUDE.md

- Keep under 300 lines (bloat degrades performance)
- Include build/test/lint commands (enables self-correction loop)
- Add domain context Claude can't know from training data
- Use ALWAYS/NEVER with reasons for rules
- Include example code snippets for homegrown patterns
- Use `@path/to/file.md` syntax for modular includes
- Never include secrets, full file contents, or generic advice

## Hooks Recommendations

- **Auto-format on edit**: PostToolUse hook running formatter on edited files
- **Block destructive ops**: PreToolUse hook blocking `rm -rf`, `drop table`, etc.
- **Notification on done**: Stop hook sending OS notification

## When Giving Advice

1. Check the user's existing CLAUDE.md and `.lucky-penny/config.json`
2. Tailor advice to their detected stack and experience level
3. Provide concrete examples, not abstract principles
4. Reference their specific project structure when possible
5. Suggest running `/setup` if they haven't configured Lucky Penny yet
