---
name: setup-wizard
description: "Interactive setup wizard for Claude Code best practices. Use when user runs /setup, asks to 'set up best practices', 'configure Claude Code', 'create CLAUDE.md', or wants to initialize a new project with Claude Code conventions."
---

# Lucky Penny Setup Wizard v2

Guide the user through setting up Claude Code best practices for their project. This is an interactive, educational wizard that explains WHY each feature matters — not just what it does. The goal: any new user becomes a power user by the end.

## Step 1: Project Detection

Run the detection script:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/detect-project.js"
```

Parse the JSON output. Present results as a clear summary with context on WHY each detection matters:

**Example presentation:**
> **Project Analysis Complete**
>
> | Detected | Value | What This Means |
> |----------|-------|-----------------|
> | Language | TypeScript | TS-specific conventions, strict mode guidance, and type-checking commands will be added to your CLAUDE.md |
> | Framework | Next.js | App Router patterns, Server/Client Component guidance, and `next build` validation included |
> | Package Manager | pnpm | Build and test commands will use `pnpm run` |
> | Tools | ESLint, Prettier | Lint/format commands will be part of your validation loop — Claude will auto-check these after changes |
> | Monorepo | No | Single-package setup |
> | Existing CLAUDE.md | Yes | Your existing content will be preserved — new sections merged in, nothing overwritten |

If nothing is detected (empty directory), say so and suggest the user describe their project.

## Step 2: Experience Level

Ask the user their experience level with Claude Code. Explain what CONCRETELY changes:

**Options (present via AskUserQuestion):**

- **Beginner** — "Medium effort mode, strict safety rules (blocks `rm -rf`, `curl | bash`, database drops, `chmod 777`). Your CLAUDE.md will include workflow tips like when to use Plan mode and `/clear`."

- **Experienced** — "Medium effort mode, moderate safety (blocks destructive DB ops only). Leaner CLAUDE.md — assumes you already know Claude Code patterns."

- **Team** — "Medium effort mode, strict safety PLUS shared-branch protection (blocks force-push and direct push to main/master). CLAUDE.md includes collaborative conventions for multi-contributor projects."

## Step 3: CLAUDE.md Template

Based on detected stack, recommend a template:

- TypeScript + Next.js → Next.js template
- Python + Django → Django template
- Go → Go template
- etc.

Present the recommendation and options:
- **Use recommended template** — apply the detected template
- **Choose a different template** — show all available: JavaScript, Python, Go, Rust, React, Next.js, Django, Monorepo, Custom
- **Custom** — blank template with section headers only
- **Skip** — keep existing CLAUDE.md as-is (only if one exists)

If CLAUDE.md already exists, emphasize: "Your existing content is safe — we merge new sections in and never overwrite what you've written."

## Step 4: Hooks — What They Are and Which to Enable

This step is critical — hooks are what make the plugin actually useful day-to-day, and most users don't know they exist.

Start with a brief intro:
> **Hooks** are scripts that run automatically at key moments in your Claude Code session. They're the difference between "I installed a plugin" and "Claude actually understands my project every time I open it." Let me walk you through each one.

Present each hook with explanation and recommended default. Use AskUserQuestion with multiSelect so the user can toggle each one:

1. **Session Start Context** (recommended: ON)
   "When you open Claude Code (or run `/clear`), this hook automatically loads your project context. It checks that CLAUDE.md exists and, if memory is enabled, injects what you worked on recently. Think of it as Claude 'reading the room' before you start talking."

2. **CLAUDE.md Health Check** (recommended: ON)
   "Warns you if CLAUDE.md is missing or hasn't been set up. A missing or stale CLAUDE.md is the #1 reason Claude gives wrong answers about your project — this hook catches that early."

3. **Memory Tracking** (recommended: OFF unless they want memory)
   "Records what happens during your session — files edited, bugs fixed, decisions made — so Claude can recall it in future sessions. Requires the memory system (next step). If you're unsure, skip it for now."

4. **Session Summaries** (recommended: OFF unless they want memory)
   "When your session ends, this creates a summary of what was accomplished. Great for picking up where you left off tomorrow, or for handing off context to a teammate. Also requires the memory system."

**Important:** If the user enables Memory Tracking or Session Summaries, note that the memory system will need to be enabled in Step 5. Track this for the next step.

## Step 5: Memory System

If the user enabled memory-dependent hooks in Step 4, remind them:
> "You enabled Memory Tracking / Session Summaries in the previous step — those need the memory system to work."

Otherwise, introduce it fresh:
> "Lucky Penny includes a persistent memory system that lets Claude remember context across sessions. It stores what you worked on, decisions you made, and bugs you fixed in a local database."

Give a concrete example:
> **Example:** On Monday, you spend an hour debugging an auth token refresh bug. On Wednesday, you open a new session and ask "how did we fix the auth issue?" — Claude recalls the exact fix, which files you changed, and the reasoning behind your approach. No more re-explaining context.

**Options:**
- **Enable memory** — full memory system with cross-session recall
- **Skip for now** — can enable later with `/configure`

If `hasExistingClaudeMem` was detected in Step 1:
> "I noticed you have claude-mem already installed. You can:"
- **Use existing claude-mem** — Lucky Penny will skip its built-in memory to avoid conflicts
- **Use Lucky Penny's memory** — separate namespace, no conflicts with claude-mem

## Step 6: Apply Configuration

Before applying, show a preview of what will happen:

> **Here's what I'm about to set up:**
> - CLAUDE.md: [create new / merge into existing] using [template name] template
> - Settings: `.claude/settings.json` with [experience level] profile
> - Config: `.lucky-penny/config.json` tracking your preferences
> - Hooks enabled: [list the ones they chose]
> - Memory: [enabled / disabled]

Then run the setup engine with ALL collected preferences including hook toggles:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/setup-engine.js" '{
  "experienceLevel": "beginner|experienced|team",
  "template": {
    "language": "javascript",
    "framework": "nextjs"
  },
  "memory": {
    "enabled": true,
    "useExternalClaudeMem": false
  },
  "hooks": {
    "sessionStartContext": true,
    "claudeMdCheck": true,
    "memoryTracking": true,
    "sessionSummaries": true
  },
  "completedSteps": ["detection", "experience", "template", "hooks", "memory", "apply"],
  "projectPath": "/path/to/project"
}'
```

After it runs, read the generated CLAUDE.md and briefly confirm what was created.

## Step 7: What's Next — Become a Power User

Tailor the closing guidance to their experience level:

**For everyone:**
> **You're all set!** Here's how to get the most out of Lucky Penny:
> - `/status` — check your current configuration anytime
> - `/configure` — change settings, toggle hooks, switch templates
> - Your CLAUDE.md is a living document — edit it as your project evolves

**Beginner-specific additions:**
> **Quick tips to work effectively with Claude Code:**
> - **Plan mode (Shift+Tab):** Before asking Claude to build anything significant, switch to Plan mode first. Claude will think through the approach before writing code.
> - **`/clear`:** Use this between unrelated tasks to reset context. Claude works better with focused context.
> - **`/compact`:** If your conversation gets long, this summarizes and compresses it so Claude stays sharp.
> - **Validation loops:** Your CLAUDE.md now includes validation commands. Claude will run these after making changes — this is the single biggest factor in code quality.

**Experienced-specific additions:**
> - Your CLAUDE.md is intentionally lean — add project-specific patterns as you discover them.
> - Consider using the **brainstorm** skill when starting new features — it helps you think through 2-3 approaches before jumping to code.
> - Memory system (if enabled) works best when you let sessions run — it captures more context over longer conversations.

**Team-specific additions:**
> - **Commit CLAUDE.md** to version control so all team members benefit from the same conventions.
> - **Commit `.claude/settings.json`** too — this ensures consistent safety guardrails across the team.
> - Force-push to main/master is blocked by default. Use feature branches and PRs.
> - Session summaries (if enabled) are great for async handoffs — "here's what I worked on today."

## Important Rules

- **Never overwrite** existing user configurations — always merge
- If the user provides a language/framework in the command arguments, skip detection for those
- Be conversational but efficient — explain the WHY, don't lecture
- If something fails, provide a clear error and suggest `/configure` for manual adjustment
- Each step should feel like a conversation, not a form — adapt to the user's responses
