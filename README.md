# Lucky Penny

One-click best practices setup for Claude Code.

Lucky Penny is a Claude Code plugin that configures everything you need for an effective Claude Code workflow — CLAUDE.md templates, smart settings, productivity hooks, and an integrated memory system. The setup wizard explains WHY each feature matters, so any new user becomes a power user.

## Features

- **Interactive Setup Wizard** — 7-step educational flow that walks you through every feature with explanations, not just config dumps
- **CLAUDE.md Generation** — Auto-detects your project stack and generates a tailored CLAUDE.md with coding conventions, build commands, and best practices
- **Smart Settings** — Applies sensible defaults based on your experience level (beginner/experienced/team) with appropriate safety guardrails
- **Productivity Hooks** — Session start context loading, CLAUDE.md health checks, memory tracking, session summaries — each explained and individually toggleable
- **Persistent Memory** — Cross-session memory system (forked from claude-mem) so Claude remembers what you worked on
- **Brainstorm Skill** — Lightweight "think before you code" workflow that helps you evaluate 2-3 approaches before jumping to implementation
- **Intelligent Merging** — Never overwrites your existing configs — merges new best practices alongside your customizations

## Installation

```bash
claude plugin add Gidde-Abhishek/lucky-penny
```

## Quick Start

```bash
# Navigate to your project
cd /path/to/your/project

# Start Claude Code
claude

# Run the setup wizard
/setup
```

The wizard will:
1. Detect your language, framework, and tooling
2. Ask your experience level (with concrete behavior differences)
3. Generate a CLAUDE.md with best practices for your stack
4. **Walk you through each hook** — what it does, why it matters, and let you toggle each one
5. Offer the memory system with concrete examples of how it helps
6. Preview changes before applying
7. Give you a tailored "What's Next" power user guide

## Commands & Skills

| Command/Skill | Description |
|---------------|-------------|
| `/setup` | Run the interactive setup wizard |
| `/configure` | Change settings after initial setup |
| `/status` | View current Lucky Penny configuration |
| `brainstorm` | Think before you code — clarify, propose 2-3 approaches, decide |
| `best-practices` | Get advice on Claude Code conventions and workflows |
| `mem-search` | Search cross-session memory for past work |

## Supported Stacks

**Languages:** JavaScript, TypeScript, Python, Go, Rust, Java

**Frameworks:** React, Next.js, Vue, Angular, Django, Flask, FastAPI, Express

**Monorepo tools:** Nx, Turborepo, Lerna, pnpm workspaces

## Configuration

After setup, your config is stored in `.lucky-penny/config.json`:

```json
{
  "version": "1.1.0",
  "experienceLevel": "experienced",
  "memory": { "enabled": true, "useExternalClaudeMem": false },
  "hooks": {
    "sessionStartContext": true,
    "claudeMdCheck": true,
    "memoryTracking": true,
    "sessionSummaries": true
  },
  "template": { "language": "typescript", "framework": "nextjs", "appliedAt": "2026-03-17T..." },
  "setup": { "completedSteps": ["detection", "experience", "template", "hooks", "memory", "apply"], "completedAt": "2026-03-17T...", "wizardVersion": "2.0" }
}
```

## Memory System

When enabled, Lucky Penny tracks your work across sessions:
- What you built, fixed, and decided
- Session summaries for quick context recall
- Searchable via MCP tools

The memory system uses a local SQLite database at `~/.lucky-penny-mem/` and runs a background Bun worker service on port 37778.

## Credits

- Memory system forked from [claude-mem](https://github.com/thedotmack/claude-mem) by Alex Newman (AGPL-3.0)
- Built by Abhishek Gidde

## License

MIT
