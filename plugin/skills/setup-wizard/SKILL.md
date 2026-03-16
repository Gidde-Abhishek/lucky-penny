---
name: setup-wizard
description: "Interactive setup wizard for Claude Code best practices. Use when user runs /setup, asks to 'set up best practices', 'configure Claude Code', 'create CLAUDE.md', or wants to initialize a new project with Claude Code conventions."
---

# Lucky Penny Setup Wizard

Guide the user through setting up Claude Code best practices for their project. This is an interactive, conversational wizard.

## Step 1: Project Detection

Run the detection script to understand the project:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/detect-project.js"
```

Parse the JSON output. It will contain:
- `language` — detected programming language (javascript, typescript, python, go, rust, java, or unknown)
- `framework` — detected framework (react, nextjs, vue, angular, svelte, django, flask, fastapi, or none)
- `isMonorepo` — whether this is a monorepo
- `hasExistingClaudeMd` — whether CLAUDE.md already exists
- `hasExistingSettings` — whether .claude/settings.json exists
- `detectedTools` — list of detected tools (eslint, prettier, pytest, etc.)
- `packageManager` — npm, yarn, pnpm, bun, pip, cargo, go, or unknown

Present what was detected to the user in a brief summary.

## Step 2: Experience Level

Ask the user their experience level with Claude Code:

**Options:**
- **Beginner** — "I'm new to Claude Code and want sensible defaults"
- **Experienced** — "I know Claude Code well, give me power user settings"
- **Team** — "Setting this up for a team project with multiple contributors"

This determines the settings template applied.

## Step 3: CLAUDE.md Template

Based on the detected stack, recommend a template:

- If TypeScript + Next.js detected → recommend the Next.js template
- If Python + Django detected → recommend the Django template
- If Go detected → recommend the Go template
- etc.

Present the recommendation and ask the user:
- **Use recommended template** — apply the detected template
- **Choose a different template** — show all available templates
- **Custom** — start from a blank template with just section headers
- **Skip** — don't generate CLAUDE.md (if one already exists and they want to keep it)

If CLAUDE.md already exists, inform the user that their existing content will be preserved and new sections will be merged in.

## Step 4: Memory System

Ask the user if they want to enable persistent cross-session memory:

> "Lucky Penny includes a memory system that lets Claude remember context across sessions — what you worked on, decisions made, bugs fixed, and more. This uses a local SQLite database and runs a background worker service."

**Options:**
- **Enable memory** — full memory system with cross-session recall
- **Skip for now** — can enable later with `/configure`

If they already have `claude-mem` installed, note this and ask:
- **Use existing claude-mem** — skip built-in memory, avoid conflicts
- **Use Lucky Penny's memory** — use the built-in system (different namespace, no conflicts)

## Step 5: Apply Configuration

Collect all preferences into a JSON object and run the setup engine:

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
  "projectPath": "/path/to/project"
}'
```

## Step 6: Verify

After the setup engine completes:

1. Read the generated CLAUDE.md and show a summary to the user
2. Show what settings were applied/merged
3. Show which hooks are now active
4. If memory is enabled, confirm the worker can start

Ask: "Everything look good? You can customize any of this later with `/configure`."

## Important Notes

- **Never overwrite** existing user configurations — always merge
- If the user provides a language/framework in the command arguments, skip detection for those
- Keep the conversation brief — don't over-explain each step
- If something fails, provide a clear error and suggest `/configure` for manual adjustment
