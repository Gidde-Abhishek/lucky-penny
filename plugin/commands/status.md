---
description: Show Lucky Penny configuration status for this project
allowed-tools: [Bash, Read]
---

Show the current Lucky Penny plugin configuration status.

1. Read the configuration:
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/config-store.js" read
   ```

2. Check if CLAUDE.md exists in the project root.

3. Present a clean summary:

   **Lucky Penny Status**
   - CLAUDE.md: [exists/missing] (template: [language]/[framework], applied: [date])
   - Experience level: [beginner/experienced/team]
   - Memory system: [enabled/disabled]
   - Hooks:
     - Session start context: [on/off]
     - CLAUDE.md check: [on/off]
     - Memory tracking: [on/off]
     - Session summaries: [on/off]

4. If no `.lucky-penny/config.json` exists, inform the user they need to run `/setup` first.
