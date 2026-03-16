# Claude Code Best Practices Guide
### A Ready Reckoner for Developers at Choice Techlab Solutions Pvt Ltd

**Author:** Abhishek Chandrakant Gidde
**Date:** March 2026
**Version:** 1.0

---

## Table of Contents

1. [What is Claude Code?](#1-what-is-claude-code)
2. [Getting Started](#2-getting-started)
3. [The CLAUDE.md File — The Single Most Important Thing](#3-the-claudemd-file)
4. [Essential Commands & Keyboard Shortcuts](#4-essential-commands--keyboard-shortcuts)
5. [The Right Way to Work with Claude Code](#5-the-right-way-to-work-with-claude-code)
6. [Context Engineering — The Core Skill](#6-context-engineering--the-core-skill)
7. [Skills — Reusable Workflows](#7-skills--reusable-workflows)
8. [Hooks — Automation Callbacks](#8-hooks--automation-callbacks)
9. [MCP Servers — Extending Claude's Capabilities](#9-mcp-servers)
10. [Sub-Agents — Parallel Isolated Work](#10-sub-agents)
11. [Parallel Development — The Multiplier](#11-parallel-development)
12. [Git Integration & Safety](#12-git-integration--safety)
13. [IDE Setup Guide](#13-ide-setup-guide)
14. [Cost & Token Optimization](#14-cost--token-optimization)
15. [Security & Permissions](#15-security--permissions)
16. [Organizational Rollout Playbook](#16-organizational-rollout-playbook)
17. [CLAUDE.md Templates by Stack](#17-claudemd-templates-by-stack)
18. [Quick Reference Cheat Sheet](#18-quick-reference-cheat-sheet)

---

## 1. What is Claude Code?

Claude Code is Anthropic's official CLI tool that puts an AI coding agent directly in your terminal. Unlike browser-based AI chat (ChatGPT, Claude.ai), Claude Code:

- **Lives in your codebase** — it reads your files, understands your project structure, and makes edits directly.
- **Runs commands** — it can build, test, lint, and debug by executing real shell commands.
- **Has persistent memory** — via CLAUDE.md files, it remembers your project's rules across sessions.
- **Is composable** — skills, hooks, MCP servers, and sub-agents can be chained into powerful workflows.
- **Supports parallel work** — run multiple instances simultaneously across features and projects.

**Why this matters for Choice Techlab:** We have 200+ developers across Go, Node.js, Python, .NET, and mobile stacks. Claude Code lets us encode our coding standards, architecture patterns, and validation workflows so that AI-generated code follows our conventions from the first attempt — not after 5 rounds of "no, do it this way."

---

## 2. Getting Started

### Installation

```bash
# Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version
```

### Authentication

```bash
# Interactive login (opens browser)
claude auth login

# Or set API key directly
export ANTHROPIC_API_KEY="sk-ant-..."
```

### First Run

```bash
# Navigate to your project root — ALWAYS start from the root
cd /path/to/your/project

# Launch Claude Code
claude

# First thing to do: generate your initial CLAUDE.md
/init
```

**Rule #1: Always run `claude` from your project's root directory.** This is where Claude picks up your CLAUDE.md, settings, and skills. If you run it from a subdirectory, it misses critical context.

### Key CLI Flags

| Flag | Purpose | Example |
|---|---|---|
| `claude` | Interactive session | `claude` |
| `claude -p "query"` | Non-interactive (print and exit) | `claude -p "explain this error"` |
| `claude -c` | Continue last conversation | `claude -c` |
| `claude -r` | Resume a specific session | `claude -r` |
| `--model <model>` | Choose model | `claude --model opus` |
| `--dangerously-skip-permissions` | YOLO mode (sandboxed envs only) | See [Security](#15-security--permissions) |
| `-w` / `--worktree` | Git worktree for parallel dev | See [Parallel Development](#11-parallel-development) |

---

## 3. The CLAUDE.md File

> **"80% of users can get excellent results simply by having a well-crafted CLAUDE.md."**

This is the single highest-impact thing you can do. A CLAUDE.md file is a persistent instruction set that Claude reads at the start of every session. Think of it as your project's AI constitution.

### 3.1 File Hierarchy

Claude reads CLAUDE.md files from multiple locations and merges them:

| Location | Scope | Git? | Who maintains |
|---|---|---|---|
| `~/.claude/CLAUDE.md` | Global (all projects) | No | Individual developer |
| `<project>/CLAUDE.md` | Project (entire repo) | Yes | Tech lead / team |
| `<project>/.claude/CLAUDE.md` | Project local (personal) | .gitignored | Individual developer |
| `<subdir>/CLAUDE.md` | Directory-scoped | Yes | Sub-team |

**For Choice Techlab:** Every repository should have a committed `CLAUDE.md` at the root. Individual developers add personal preferences in `.claude/CLAUDE.md` (gitignored).

### 3.2 Structure — Priority is Top to Bottom

Claude reads top-to-bottom and gives higher weight to content at the top. Structure accordingly:

```markdown
# CLAUDE.md

## Project Overview
[What this project is, 2-3 sentences]

## Tech Stack
[Languages, frameworks, key dependencies]

## Architecture
[High-level architecture: services, layers, data flow]
[Key directories and what they contain]

## Build & Validation
[EXACT commands to build, test, lint, run]

## Code Conventions
[Naming, patterns, import ordering, file structure]

## Rules
[ALWAYS do X, NEVER do Y — with reasons]

## Common Pitfalls
[Things that trip up contributors, human or AI]
```

### 3.3 What to Include

**Build & validation commands** — This is the most impactful section. It creates a self-correction loop: Claude runs the command, sees failures, fixes them automatically.

```markdown
## Build & Validation
- Build: `go build ./...`
- Test all: `go test ./...`
- Test single: `go test ./path/to/package -run TestName`
- Lint: `golangci-lint run`
- Format: `gofmt -w .`
```

**Domain context** — Things unique to your organization that Claude cannot know from training data:

```markdown
## Domain Context
- We use an internal RPC framework called "ChoiceRPC" — see /pkg/choicerpc/
- All API responses must use our standard envelope: { data, error, meta }
- Database migrations use our custom tool `ctmigrate`, NOT golang-migrate
```

**Explicit rules with reasons** — The "why" helps Claude apply rules correctly in edge cases:

```markdown
## Rules
- ALWAYS use structured logging via our `pkg/logger` — never `fmt.Println` or `log.Print`
  (Reason: our observability pipeline depends on structured JSON logs)
- NEVER modify files in /internal/legacy/ without explicit approval
  (Reason: these are shared across 12 services and changes require cross-team review)
- ALWAYS run `make lint` before considering a task complete
```

**Example snippets** — Especially for homegrown patterns:

```markdown
## API Handler Pattern
All handlers must follow this pattern:
​```go
func (h *Handler) GetUser(ctx context.Context, req *GetUserRequest) (*GetUserResponse, error) {
    // 1. Validate
    if err := req.Validate(); err != nil {
        return nil, status.InvalidArgument(err)
    }
    // 2. Execute
    user, err := h.userService.Get(ctx, req.UserID)
    if err != nil {
        return nil, err
    }
    // 3. Transform and return
    return toGetUserResponse(user), nil
}
​```
```

### 3.4 Conditional Includes (Modular CLAUDE.md)

For large projects, split CLAUDE.md into focused files and import them:

```markdown
# CLAUDE.md

## Project Overview
Our main API service...

@docs/api-conventions.md
@docs/database-patterns.md
@docs/testing-guide.md
```

The `@path/to/file.md` syntax imports that file's content into the CLAUDE.md. This keeps the root file concise while allowing detailed docs for specific topics.

### 3.5 CLAUDE.local.md — Personal Overrides

Every CLAUDE.md location also supports a `.local.md` variant:

| File | Purpose |
|---|---|
| `CLAUDE.md` | Team-shared rules (committed) |
| `CLAUDE.local.md` | Personal preferences (gitignored) |
| `.claude/CLAUDE.md` | Team-shared (alt location) |
| `.claude/CLAUDE.local.md` | Personal (alt location) |

Use `CLAUDE.local.md` for things like:

- Your preferred verbosity level
- Personal workflow shortcuts
- Machine-specific paths or environment notes

### 3.7 What NOT to Include

| Don't Include | Why |
|---|---|
| Generic advice ("write clean code") | Claude already knows this; it wastes tokens |
| Full file contents | Reference paths instead |
| Secrets or credentials | Security risk, especially in committed files |
| More than ~300 lines | Bloat degrades performance and increases cost |
| Frequently changing info | Use `.claude/CLAUDE.md` (local) for ephemeral notes |

### 3.8 Maintenance

**Never edit CLAUDE.md manually.** When Claude makes a repeated mistake:

```
You: "Update the CLAUDE.md rules so we never use fmt.Println again — always use our structured logger."
```

Claude updates the file for you, keeping it consistent.

**Treat committed CLAUDE.md like infrastructure code** — require PR reviews for changes. A bad rule affects every developer's AI experience.

### 3.9 The Validation Loop — Most Important Concept

The single most important factor in Claude Code effectiveness:

```
┌─────────────────────────────────────────┐
│  1. Claude makes a change               │
│  2. Claude runs validation (build/test)  │
│  3. Claude sees the output               │
│  4. Claude fixes any issues              │
│  5. Repeat until clean                   │
└─────────────────────────────────────────┘
```

**Without this loop**, Claude is guessing. **With it**, Claude is self-correcting. Invest heavily in making your build/test/lint commands fast, reliable, and documented in CLAUDE.md.

---

## 4. Essential Commands & Keyboard Shortcuts

### Keyboard Shortcuts (Memorize These)

| Shortcut | Action | When to Use |
|---|---|---|
| `Shift+Tab` | Toggle Plan mode ↔ Edit mode | Every new feature starts in Plan |
| `Escape` | Interrupt generation | When Claude goes off-track |
| `Escape Escape` | Clear input / Rewind UI | Quick input reset |
| `Up Arrow` | Recall previous prompt | Re-run or modify last prompt |
| Drag & drop image | Add screenshot to context | UI work, error screenshots |

### Slash Commands

| Command | What It Does | When to Use |
|---|---|---|
| `/init` | Analyze codebase, create CLAUDE.md | First time setup per repo |
| `/clear` | Clear context window | Starting unrelated task |
| `/compact` | Summarize current context | Save context space mid-session |
| `/context` | Show context usage breakdown | Audit token consumption |
| `/model` | Switch model mid-session | Toggle Opus/Sonnet by task complexity |
| `/resume` | Recover previous session | Lost terminal, continue work |
| `/mcp` | List installed MCP servers | Audit active integrations |
| `/help` | Show all commands & shortcuts | Reference |
| `/permissions` | Manage tool permissions | Security audit |
| `/cost` | Show token usage and cost | Monitor spending |
| `/doctor` | Check installation health | Troubleshooting |
| `/config` | Open settings editor | Adjust settings |
| `/memory` | Edit CLAUDE.md files | Quick rule updates |
| `/status` | Show session status | Session info |

### Model Selection

| Model | Best For | Cost |
|---|---|---|
| **Opus** | Complex architecture, multi-file refactors, planning | Highest |
| **Sonnet** | Routine coding, bug fixes, tests, quick tasks | Medium |
| **Haiku** | Simple queries, explanations, formatting | Lowest |

**Recommendation:** Default to Sonnet for everyday work. Use Opus when you need deep architectural reasoning or multi-file coordination.

---

## 5. The Right Way to Work with Claude Code

### 5.1 Always Start in Plan Mode

This is the most important workflow habit:

```
1. Start Claude Code
2. Press Shift+Tab → Plan mode
3. Describe what you want to build/fix
4. Read the plan critically — challenge assumptions
5. Iterate on the plan until it's solid
6. Switch to Edit mode → let Claude execute
```

**Why:** Good context built during planning produces dramatically better code. Jumping straight to code generation leads to wasted tokens on wrong approaches.

### 5.2 Treat Claude as a Pair Programmer, Not a Magic Box

- **Challenge its suggestions.** The first answer is not always the best.
- **Provide feedback.** "No, we don't use that pattern here — we do X instead."
- **Course correct early.** Watch the thinking output. If Claude is making wrong assumptions, hit `Escape` and redirect.
- **Don't be afraid to interrupt.** Claude handles interruptions gracefully. Hit `Escape`, then clarify or change direction.

### 5.3 Fresh Context Beats Bloated Context

> **"Context is best served fresh and condensed."**

| Do | Don't |
|---|---|
| Start each feature with `/clear` | Let old debugging context bleed into new features |
| Build context deliberately in Plan mode | Jump between unrelated tasks in one session |
| Keep prompts focused and specific | Dump entire requirements docs into the prompt |
| Interrupt and redirect when off-track | Let Claude generate pages of wrong code |

### 5.4 The Iterative Workflow

```
Plan → Execute → Validate → Fix → Commit
  ↑                              |
  └──────── (if major issues) ───┘
```

1. **Plan** — Start in Plan mode. Build shared understanding.
2. **Execute** — Switch to Edit mode. Let Claude write code.
3. **Validate** — Claude runs build/test/lint (from CLAUDE.md commands).
4. **Fix** — Claude reads errors and self-corrects.
5. **Commit** — Ask Claude to create a commit with a good message.

---

## 6. Context Engineering — The Core Skill

Context engineering is the meta-skill that makes everything else work. It's about giving Claude exactly the right information — and nothing more.

### 6.1 Audit Your Context Regularly

```
/context
```

This shows what's consuming your context window. Look for:
- **MCP tools** taking up excessive space
- **Old conversation turns** that are no longer relevant
- **Large file contents** that were read but no longer needed

### 6.2 The Second Brain Pattern

For long-running projects, maintain a local knowledge base:

```
# At end of a productive session:
You: "Save a summary of our architecture decisions to my local .claude/CLAUDE.md"

# At start of a new session:
You: "Load my project context from .claude/CLAUDE.md"
```

This lets you **lazy-load context** — only pull in what you need for the current task.

### 6.3 Context Hygiene Rules

1. **One feature per session.** Use `/clear` between unrelated tasks.
2. **Don't retry blindly.** If something fails 2-3 times, stop and rethink the approach — don't let failed attempts pollute context.
3. **Compact before major work.** If you've been debugging and now want to build a feature, `/compact` first.
4. **Use sub-agents for side work.** Investigations that don't need the main context should run in sub-agents.

---

## 7. Skills — Reusable Workflows

Skills are saved workflows (Markdown files) that become slash commands. They are Claude Code's automation primitive.

### 7.1 Where Skills Live

```
.claude/skills/          # Project-level (commit to share with team)
~/.claude/skills/        # User-level (personal)
```

### 7.2 Skill File Format

Skills are Markdown files with optional YAML frontmatter for arguments:

```markdown
---
description: Run full CI validation pipeline
arguments:
  - name: target
    description: The module or directory to validate
    required: false
---

# Full CI Check

Run the complete validation pipeline on {{target}} (or the entire project if not specified):
1. Lint the code
2. Run type checking
3. Run tests
4. Build the project
```

- **`{{argument_name}}`** is replaced with the provided value when invoked.
- Skills appear in autocomplete when you type `/` in the REPL.

### 7.3 Creating Skills

**Never create skills manually.** Do the workflow once, then save it:

```
You: "Run our full CI validation: lint, type-check, test, and build."
[Claude runs everything]
You: "Save what we just did as a skill called 'full-ci-check'."
```

This creates `.claude/skills/full-ci-check.md` and registers `/full-ci-check`.

### 7.4 Updating Skills

```
You: "Update the full-ci-check skill to also run security audit after tests."
```

### 7.5 Skills for Choice Techlab (Recommended)

Consider creating team-wide skills for:

| Skill | What It Does |
|---|---|
| `/pr-create` | Create PR with your team's template and test plan |
| `/full-validate` | Run complete build + lint + test pipeline |
| `/review-code` | Review code against team conventions |
| `/db-migrate` | Run database migration workflow |
| `/deploy-staging` | Deploy to staging with safety checks |
| `/incident-report` | Generate incident report template |

### 7.6 Composability

Skills can trigger other primitives:

```
Skill → runs Bash commands
     → invokes MCP servers
     → spawns sub-agents
     → chains other skills
```

This composability is what makes Claude Code powerful at scale.

---

## 8. Hooks — Automation Callbacks

Hooks run shell commands at specific points in Claude Code's execution lifecycle.

### 8.1 Hook Types

| Hook | When It Fires |
|---|---|
| `PreToolUse` | Before Claude executes a tool |
| `PostToolUse` | After successful tool execution |
| `PostToolUseError` | After a tool fails |
| `Notification` | When Claude sends a notification |
| `Stop` | When Claude finishes a response |
| `SubAgentStop` | When a sub-agent finishes |

### 8.2 Environment Variables in Hooks

Hook commands have access to these environment variables:

| Variable | Available In | Description |
| --- | --- | --- |
| `CLAUDE_TOOL_NAME` | PreToolUse, PostToolUse | Name of the tool being used |
| `CLAUDE_TOOL_INPUT` | PreToolUse, PostToolUse | JSON string of tool input |
| `CLAUDE_TOOL_OUTPUT` | PostToolUse | Tool output/result |
| `CLAUDE_FILE_PATH` | PostToolUse (Edit/Write) | Path of the file being modified |
| `CLAUDE_SESSION_ID` | All | Current session ID |
| `CLAUDE_PROJECT_DIR` | All | Project root directory |

**Hook behavior:**

- Hooks run **synchronously** and block execution.
- Exit code 0 = success. Non-zero = tool call is blocked/aborted.
- For `PreToolUse`: non-zero exit blocks the tool; stdout is shown to Claude as the reason.
- For `Stop`: non-zero exit causes Claude to continue working (with stdout as feedback).

### 8.3 Configuration

Hooks live in settings files (`.claude/settings.json`):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "command": "npx prettier --write $CLAUDE_FILE_PATH"
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash(rm -rf:*)",
        "command": "echo 'BLOCKED: Destructive operation not allowed' && exit 1"
      }
    ]
  }
}
```

### 8.4 Recommended Hooks for Teams

**Auto-format on edit** (never commit unformatted code):
```json
{
  "PostToolUse": [
    { "matcher": "Edit", "command": "your-formatter $CLAUDE_FILE_PATH" }
  ]
}
```

**Block destructive operations:**
```json
{
  "PreToolUse": [
    { "matcher": "Bash(rm -rf:*)", "command": "echo 'BLOCKED' && exit 1" },
    { "matcher": "Bash(drop table:*)", "command": "echo 'BLOCKED' && exit 1" }
  ]
}
```

**Notification when done** (for long-running tasks):
```json
{
  "Stop": [
    { "command": "osascript -e 'display notification \"Claude finished\" with title \"Claude Code\"'" }
  ]
}
```

**Best practice:** Ask Claude to set up hooks: "Add a post-tool-use hook that runs gofmt on any Go file I edit."

---

## 9. MCP Servers

MCP (Model Context Protocol) servers extend Claude Code with external tool access.

### 9.1 Managing MCPs

```bash
# Add an MCP server
claude mcp add playwright -- npx @anthropic/mcp-playwright

# List installed servers
claude mcp list

# Remove a server
claude mcp remove playwright

# Or configure in .claude/settings.json
```

### 9.2 Useful MCP Servers

| MCP Server | Purpose | Recommended For |
|---|---|---|
| Playwright | Browser automation, E2E testing | Web developers |
| GitHub | PR/issue management | All developers |
| Figma | Design file access | Frontend developers |
| PostgreSQL/MySQL | Database queries | Backend developers |
| Xcode | iOS build & simulation | iOS developers |

### 9.3 Critical Warning: Token Bloat

**MCPs are the #1 source of context window bloat.** Every MCP exposes tool definitions that consume tokens on every single message exchange.

Rules:
1. **Only install MCPs you actively need** for the current project.
2. **Audit regularly** with `/context` to see MCP token consumption.
3. **Prefer bash scripts** over MCPs for simple tasks — much cheaper.
4. **Disable project-level** MCPs you're not using: `/mcp` to manage.

### 9.4 Finding MCPs

Don't search the web manually:

```
You: "Find me a good PostgreSQL MCP and install it for this project."
```

Claude will find, evaluate, and install it for you. Just verify it chose a well-maintained one.

---

## 10. Sub-Agents

Sub-agents are isolated Claude instances spawned from your main session.

### 10.1 When to Use Sub-Agents

**Good uses** (atomic, independent work):
- "Spawn a sub-agent to investigate if we have any unused dependencies."
- "Spawn a sub-agent to check our error handling patterns across the codebase."
- "Spawn a sub-agent to generate API documentation."

**Bad uses** (needs main session context):
- Testing code that was just written (needs the code context)
- Validation that depends on recent conversation
- Anything that requires back-and-forth iteration

### 10.2 Key Limitation

Sub-agents return **only their output** to the parent session — NOT their full reasoning trace. The parent doesn't know *how* the sub-agent arrived at its answer. For work that needs the full context chain, keep it in the main session.

### 10.3 Anti-Pattern Alert

Don't create "CEO agent," "Product agent," "Design agent" hierarchies. This fragments context and produces worse results. **Bring work to the context, don't spread context across agents.**

---

## 11. Parallel Development

This is the force multiplier that changes how you work.

### 11.1 The Multi-Instance Workflow ("Starcraft Mode")

Run multiple Claude Code instances simultaneously:

```
Terminal Tab 1: Feature A (Plan mode → building context)
Terminal Tab 2: Feature B (Edit mode → generating code)
Terminal Tab 3: Bug fix (running tests, self-correcting)
Terminal Tab 4: Different project entirely
```

**Cycle between them:** While one instance is executing, build context in another. You're always productive.

### 11.2 Git Worktrees for Same-Project Parallelism

Multiple Claude instances editing the same files will conflict. Use git worktrees:

```bash
# Claude creates an isolated copy of the repo
claude --worktree

# Or named worktree
claude -w feature-auth
```

Each worktree is a separate branch with its own working directory. Changes can be merged back when ready.

### 11.3 iTerm2 / Terminal Setup

| Shortcut (iTerm2) | Action |
|---|---|
| `Cmd+D` | Split pane (new instance) |
| `Cmd+[` / `Cmd+]` | Switch between panes |
| `Cmd+T` | New tab |
| Rename tabs | Label by project/task for orientation |

### 11.4 Notifications

Enable notifications so you know when an instance finishes:

```
You: "Change notifications to play a sound when you finish execution."
```

---

## 12. Git Integration & Safety

### 12.1 Use Git as Your Safety Net

Claude Code has a rewind feature, but **git is better and more reliable**:

- Commit frequently — before starting risky changes.
- Use Claude for commit messages: "Create a commit for what we just did."
- Use Claude for PRs: "Create a PR with our template."

### 12.2 Recommended Git Workflow with Claude

```
1. git checkout -b feature/my-feature
2. claude                           # Start Claude Code
3. [Plan → Execute → Validate]
4. "Create a commit for the auth changes"
5. [More work...]
6. "Create a PR targeting main"
```

### 12.3 Create Skills for Your Git Workflow

```
You: "Create a skill called 'pr-create' that creates a PR with this template:
## Summary
[bullet points]
## Test Plan
[checklist]
## Reviewer Notes
[anything unusual]"
```

---

## 13. IDE Setup Guide

### 13.1 VS Code (Primary)

1. Install the **Claude Code** extension from the VS Code marketplace.
2. Claude Code can run in the VS Code integrated terminal — file navigation syncs automatically.
3. Inline diff view shows proposed changes before accepting.

**Recommended:** Run Claude Code in the VS Code terminal for quick tasks; use a separate terminal (iTerm2) for parallel multi-instance work.

### 13.2 JetBrains IDEs (IntelliJ, WebStorm, GoLand, PyCharm)

JetBrains integration is available. Claude Code connects to the IDE and can navigate files, show diffs, and sync with the editor.

### 13.3 Xcode (iOS/macOS)

- Install the **Xcode MCP** for build and simulation capabilities.
- Add Xcode build commands to your CLAUDE.md.
- Claude can control the iOS Simulator via MCP for debugging.

### 13.4 Android Studio

- Use the terminal within Android Studio or a separate terminal.
- Add Gradle build commands to CLAUDE.md.
- Consider MCP servers for ADB interaction.

---

## 14. Cost & Token Optimization

| Strategy | Impact | Effort |
|---|---|---|
| Keep CLAUDE.md under 300 lines | Reduces baseline cost every session | Low |
| Use `/clear` between tasks | Prevents context contamination | Low |
| Start in Plan mode | Avoids wasted generation | Low |
| Minimize MCP servers | Each adds tokens to every message | Medium |
| Use Sonnet for routine tasks | 5-10x cheaper than Opus | Low |
| `--max-budget-usd` in CI | Hard cost cap | Low |
| Interrupt early when off-track | Saves wasted tokens | Low |
| Lazy-load context (second brain) | Only load what current task needs | Medium |
| Audit with `/context` regularly | Find and fix token waste | Low |

### Budget Controls

```bash
# Non-interactive mode with cost cap
claude -p "generate tests for auth module" --max-budget-usd 2

# Set model for cost-sensitive work
claude --model sonnet
```

---

## 15. Security & Permissions

### 15.1 Permission Modes

| Mode | Behavior | Use When |
|---|---|---|
| `default` | Asks permission for each tool | Learning / untrusted codebases |
| `plan` | Read-only, no modifications | Code review, investigation |
| `acceptEdits` | Auto-approve edits, ask for bash | Normal development |
| `bypassPermissions` | Skip all checks | Sandboxed/throwaway envs ONLY |

### 15.2 Permission Pattern Syntax

Permissions use glob patterns to match tools and their arguments:

```text
ToolName                    # Match the entire tool
Bash(npm run build)         # Match exact bash command
Bash(npm test*)             # Match bash commands starting with "npm test"
Write(src/**)               # Match file writes under src/
Edit(src/**)                # Match file edits under src/
mcp__server-name__tool      # Match specific MCP tool
```

### 15.3 Team Security Settings

Commit this to every repo (`.claude/settings.json`):

```json
{
  "permissions": {
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(drop database:*)",
      "Bash(curl * | bash:*)"
    ]
  }
}
```

### 15.4 Rules for Choice Techlab

1. **NEVER** use `--dangerously-skip-permissions` on machines connected to production.
2. **NEVER** put API keys, tokens, or credentials in CLAUDE.md files.
3. **ALWAYS** review destructive operations even if Claude suggests them.
4. **Audit** MCP server configurations — only allow company-vetted servers.
5. Use `.claude/settings.json` (committed) for team guardrails.
6. Use `.claude/settings.local.json` (gitignored) for personal preferences.

---

## 16. Organizational Rollout Playbook

### Phase 1: Foundation (Week 1-2)

| Action | Owner |
|---|---|
| Install Claude Code for pilot group (10-15 devs) | DevOps / Platform |
| Create CLAUDE.md for 3-5 key repositories | Tech leads |
| Commit `.claude/settings.json` with security guardrails | Tech leads |
| Run initial training session using this guide | Abhishek |

### Phase 2: Standards (Week 3-4)

| Action | Owner |
|---|---|
| Gather feedback from pilot group | Abhishek |
| Refine CLAUDE.md files based on common AI mistakes | Tech leads |
| Create shared skills for team workflows (PR, deploy, test) | Senior devs |
| Set up hooks for auto-formatting per stack | Tech leads |

### Phase 3: Scale (Month 2-3)

| Action | Owner |
|---|---|
| Roll out to all 200+ developers | DevOps / Platform |
| Create stack-specific CLAUDE.md templates | Stack owners |
| Establish CLAUDE.md review process (like code review) | Engineering managers |
| Monitor cost and set budget guidelines | Finance / Engineering |

### Phase 4: Optimize (Ongoing)

| Action | Owner |
|---|---|
| Track common Claude mistakes → update CLAUDE.md rules | All developers |
| Share useful personal skills with the team | All developers |
| Evaluate new MCP servers and plugins | Platform team |
| Review and prune CLAUDE.md files quarterly | Tech leads |

### Onboarding Flow for New Developers

```
1. Developer clones repo → gets CLAUDE.md + .claude/settings.json automatically
2. Developer runs `claude` → Claude already knows the project
3. Developer creates ~/.claude/CLAUDE.md for personal preferences
4. Developer creates .claude/settings.local.json for personal tool prefs
5. Developer runs `/help` → learns commands
6. Developer starts first task in Plan mode
```

---

## 17. CLAUDE.md Templates by Stack

### Go Template

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview
[Brief description of the service/application]

## Tech Stack
- Go [version] with standard library and [key deps]
- Database: [PostgreSQL/MySQL/MongoDB]
- Build: Make

## Architecture
- /cmd/ — Application entry points
- /internal/ — Private application code
- /pkg/ — Public library code
- /api/ — API definitions (protobuf/OpenAPI)

## Build & Validation
- Build: `make build`
- Test all: `make test`
- Test single: `go test ./internal/path/to/package -run TestName -v`
- Lint: `make lint` (runs golangci-lint)
- Format: `gofmt -w .`
- Generate: `make generate` (protobuf, mocks, etc.)

## Code Conventions
- Error handling: always wrap errors with `fmt.Errorf("context: %w", err)`
- Logging: use `pkg/logger` structured logger, never `fmt.Println`
- Context: pass `context.Context` as first parameter to all functions
- Naming: follow Go conventions — short variable names, exported for public API

## Rules
- ALWAYS run `make lint` before considering a task complete
- NEVER use `interface{}` — use `any` (Go 1.18+)
- ALWAYS add table-driven tests for new functions
- NEVER commit generated code changes without running `make generate` first
```

### Node.js / TypeScript Template

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview
[Brief description]

## Tech Stack
- Node.js [version] with TypeScript [version]
- Framework: [Express/Fastify/NestJS/Next.js]
- Database: [PostgreSQL with Prisma / MongoDB with Mongoose]
- Package manager: [npm/yarn/pnpm]

## Architecture
- /src/ — Application source code
- /src/modules/ — Feature modules
- /src/common/ — Shared utilities, middleware, decorators
- /tests/ — Test files (mirrors src structure)
- /prisma/ — Database schema and migrations

## Build & Validation
- Install: `npm install`
- Build: `npm run build`
- Dev: `npm run dev`
- Test all: `npm test`
- Test single: `npm test -- --testPathPattern="module-name"`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`
- Format: `npx prettier --write .`

## Code Conventions
- Strict TypeScript — no `any` types, use `unknown` and narrow
- Imports: absolute paths via @ alias (e.g., `@/modules/auth`)
- Error handling: custom AppError classes, central error middleware
- API responses: standard envelope `{ success, data, error, meta }`

## Rules
- ALWAYS run `npm run lint && npx tsc --noEmit` before considering a task complete
- NEVER use `var` — only `const` and `let`
- ALWAYS use async/await, never raw Promises with .then()
- NEVER leave console.log in production code — use the logger service
```

### Python Template

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview
[Brief description]

## Tech Stack
- Python [version]
- Framework: [FastAPI/Django/Flask]
- Database: [PostgreSQL with SQLAlchemy / MongoDB]
- Package manager: [poetry/pip/uv]

## Architecture
- /src/app/ — Application code
- /src/app/api/ — API route handlers
- /src/app/models/ — Database models
- /src/app/services/ — Business logic
- /tests/ — Test files (pytest)

## Build & Validation
- Install: `poetry install`
- Run: `poetry run uvicorn app.main:app --reload`
- Test all: `poetry run pytest`
- Test single: `poetry run pytest tests/test_file.py::test_function -v`
- Lint: `poetry run ruff check .`
- Format: `poetry run ruff format .`
- Type check: `poetry run mypy src/`

## Code Conventions
- Type hints on all function signatures
- Pydantic models for all API request/response schemas
- Dependency injection via FastAPI's Depends()
- Async handlers for all I/O-bound operations

## Rules
- ALWAYS run `poetry run ruff check . && poetry run mypy src/` before considering complete
- NEVER use `print()` for logging — use `structlog` or `logging`
- ALWAYS use Pydantic for data validation at API boundaries
- NEVER write raw SQL — use SQLAlchemy ORM/query builder
```

### .NET Template

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview
[Brief description]

## Tech Stack
- .NET [version] with C# [version]
- Framework: ASP.NET Core [Web API / MVC / Blazor]
- Database: [SQL Server / PostgreSQL] with Entity Framework Core
- Build: dotnet CLI

## Architecture
- /src/API/ — Web API project (controllers, middleware)
- /src/Application/ — Business logic, CQRS handlers
- /src/Domain/ — Domain entities, value objects
- /src/Infrastructure/ — Database, external services
- /tests/ — Unit and integration tests (xUnit)

## Build & Validation
- Build: `dotnet build`
- Test all: `dotnet test`
- Test single: `dotnet test --filter "FullyQualifiedName~TestClassName.TestMethodName"`
- Run: `dotnet run --project src/API`
- Format: `dotnet format`

## Code Conventions
- CQRS pattern with MediatR for commands/queries
- Repository pattern for data access
- Nullable reference types enabled
- Async all the way — no `.Result` or `.Wait()` on tasks

## Rules
- ALWAYS run `dotnet build && dotnet test` before considering complete
- NEVER use `DateTime.Now` — use `IDateTimeProvider` for testability
- ALWAYS use cancellation tokens in async methods
- NEVER throw generic `Exception` — use domain-specific exception types
```

### Mobile — iOS (Swift) Template

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview
[Brief description]

## Tech Stack
- Swift [version], SwiftUI
- Minimum deployment: iOS [version]
- Dependencies: Swift Package Manager

## Architecture
- MVVM pattern with SwiftUI
- /Sources/Features/ — Feature modules
- /Sources/Core/ — Shared services, networking, models
- /Sources/UI/ — Reusable UI components

## Build & Validation
- Build: `xcodebuild -scheme AppName -destination 'platform=iOS Simulator,name=iPhone 16' build`
- Test: `xcodebuild -scheme AppName -destination 'platform=iOS Simulator,name=iPhone 16' test`
- Lint: `swiftlint`

## Rules
- ALWAYS use SwiftUI for new views, never UIKit
- NEVER force unwrap optionals — use guard let or if let
- ALWAYS use @MainActor for view models
```

### Mobile — Android (Kotlin) Template

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview
[Brief description]

## Tech Stack
- Kotlin, Jetpack Compose
- Minimum SDK: [version]
- Architecture: MVVM with Clean Architecture layers
- DI: Hilt/Dagger

## Build & Validation
- Build: `./gradlew assembleDebug`
- Test: `./gradlew test`
- Lint: `./gradlew lint`
- Format: `./gradlew ktlintFormat`

## Rules
- ALWAYS use Jetpack Compose for new UI, never XML layouts
- ALWAYS use coroutines for async work, never callbacks
- NEVER use `GlobalScope` — use viewModelScope or lifecycleScope
```

---

## 18. Quick Reference Cheat Sheet

### Starting a Session

```bash
claude                  # Interactive session
claude -c               # Continue last session
claude -r               # Resume specific session
claude --model opus     # Use Opus model
claude -p "query"       # One-shot query
claude -w               # Git worktree (parallel dev)
```

### In-Session Commands

```
/init          Generate CLAUDE.md for this project
/clear         Reset context (start fresh)
/compact       Summarize context to save space
/context       Audit what is consuming tokens
/model         Switch model mid-session
/resume        Recover previous session
/mcp           List MCP servers
/help          Show all commands
/permissions   Manage permissions
```

### Keyboard Shortcuts

```
Shift+Tab      Toggle Plan ↔ Edit mode
Escape         Interrupt generation
Escape Escape  Clear input / Rewind
Up Arrow       Previous prompt
```

### Workflow Checklist

```
□ Run from project root directory
□ Ensure CLAUDE.md exists (/init if not)
□ Start in Plan mode (Shift+Tab)
□ Build context through conversation
□ Switch to Edit mode when plan is solid
□ Let Claude validate (build/test/lint)
□ Review generated code
□ Commit with Claude ("create a commit for this")
□ /clear before starting next unrelated task
```

### Files to Commit (per repo)

```
CLAUDE.md                       ← Project rules (team-shared)
.claude/settings.json           ← Security guardrails, hooks
.claude/skills/*.md             ← Shared workflow skills
```

### Files to .gitignore

```
.claude/settings.local.json     ← Personal settings
.claude/CLAUDE.md               ← Personal project notes
```

### Emergency Commands

```
Escape         Stop Claude mid-generation
/clear         Nuclear reset of context
git stash      Save work before risky operation
/resume        Recover lost session
```

---

## Appendix: Key Principles Summary

| # | Principle |
|---|---|
| 1 | **CLAUDE.md is king.** A good rules file solves 80% of problems. |
| 2 | **Validation loops are everything.** Claude must be able to build, test, and self-correct. |
| 3 | **Context is best served fresh and condensed.** Don't bloat it. |
| 4 | **Always start in Plan mode.** Think first, execute second. |
| 5 | **Interrupt early and often.** Don't let Claude go off-track. |
| 6 | **Never edit CLAUDE.md manually.** Ask Claude to update its own rules. |
| 7 | **MCPs are powerful but expensive.** Only install what you need. |
| 8 | **Git is your safety net.** Commit often. |
| 9 | **Parallel instances are the multiplier.** Learn to juggle sessions. |
| 10 | **Treat committed CLAUDE.md like infrastructure.** Require reviews. |

---

*This guide is a living document. As our organization's practices evolve with Claude Code, update this guide to reflect what works.*

*For questions, feedback, or contributions, contact Abhishek Chandrakant Gidde.*
