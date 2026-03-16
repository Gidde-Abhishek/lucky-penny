---
description: Set up Claude Code best practices for your project — interactive wizard that walks you through CLAUDE.md, settings, hooks, and memory with explanations
allowed-tools: [Bash, Read, Write, Glob, Grep, Edit, AskUserQuestion]
argument-hint: "[language/framework]"
---

Run the Lucky Penny setup wizard (v2) for this project. Use the `setup-wizard` skill to guide the user through a comprehensive, educational 7-step setup.

The wizard explains WHY each feature matters — not just what it does — so that new users become power users by the end.

1. Run `detect-project.js` to analyze the project
2. Walk through the `setup-wizard` skill's 7 steps:
   - Project detection summary (with context on each finding)
   - Experience level selection (with concrete behavior differences)
   - CLAUDE.md template choice
   - **Hooks education & selection** — explain each hook and let user toggle
   - Memory system decision
   - Preview and apply configuration
   - "What's Next" power user guide tailored to their level
3. Run `setup-engine.js` with all preferences including per-hook toggles
4. Confirm results

If the user provided a language/framework argument (in $ARGUMENTS), use that to pre-select the template instead of asking.
