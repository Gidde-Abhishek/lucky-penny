# Lucky Penny

One-click best practices setup for Claude Code.

Lucky Penny is a Claude Code plugin that configures everything you need for an effective Claude Code workflow — CLAUDE.md templates, smart settings, productivity hooks, and an integrated memory system.

## Features

- **CLAUDE.md Generation** — Auto-detects your project stack and generates a tailored CLAUDE.md with coding conventions, build commands, and best practices
- **Smart Settings** — Applies sensible defaults based on your experience level (beginner/experienced/team)
- **Productivity Hooks** — SessionStart checks, memory context injection, session summaries
- **Persistent Memory** — Cross-session memory system (forked from claude-mem) so Claude remembers what you worked on
- **Intelligent Merging** — Never overwrites your existing configs — merges new best practices alongside your customizations

## Installation

```bash
# Install from GitHub marketplace
claude plugin add abhishekgidde/lucky-penny
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
2. Ask your experience level
3. Generate a CLAUDE.md with best practices for your stack
4. Apply smart settings
5. Optionally enable the memory system

## Commands

| Command | Description |
|---------|-------------|
| `/setup` | Run the interactive setup wizard |
| `/configure` | Change settings after initial setup |
| `/status` | View current Lucky Penny configuration |

## Supported Stacks

**Languages:** JavaScript, TypeScript, Python, Go, Rust, Java

**Frameworks:** React, Next.js, Vue, Angular, Django, Flask, FastAPI, Express

**Monorepo tools:** Nx, Turborepo, Lerna, pnpm workspaces

## Configuration

After setup, your config is stored in `.lucky-penny/config.json`:

```json
{
  "version": "1.0.0",
  "memory": { "enabled": true, "port": 37778 },
  "hooks": { "sessionStartContext": true, "claudeMdCheck": true },
  "template": { "language": "typescript", "framework": "nextjs" },
  "experienceLevel": "experienced"
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
- Best practices guide by Abhishek Chandrakant Gidde

## License

MIT
