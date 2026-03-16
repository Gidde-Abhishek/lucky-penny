---
description: Set up Claude Code best practices for your project — CLAUDE.md, settings, hooks, and optional memory system
allowed-tools: [Bash, Read, Write, Glob, Grep, Edit, AskUserQuestion]
argument-hint: "[language/framework]"
---

Run the Lucky Penny setup wizard for this project. Use the `setup-wizard` skill to guide the user through configuration.

1. First, run the project detection script to understand the current project:
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/detect-project.js"
   ```

2. Based on the detection results, walk the user through the setup wizard as defined in the `setup-wizard` skill.

3. After collecting preferences, run the setup engine:
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/setup-engine.js" '<preferences-json>'
   ```

4. Read back the generated files and confirm everything looks correct with the user.

If the user provided a language/framework argument (in $ARGUMENTS), use that to pre-select the template instead of asking.
