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
   - Config version: [version]
   - CLAUDE.md: [exists/missing] (template: [language]/[framework], applied: [appliedAt date])
   - Experience level: [beginner/experienced/team]
   - Memory system: [enabled/disabled]
   - Hooks:
     - Session start context: [on/off] — loads project context on startup
     - CLAUDE.md check: [on/off] — warns if CLAUDE.md is missing
     - Memory tracking: [on/off] — records sessions for cross-session recall
     - Session summaries: [on/off] — summarizes sessions on end
   - Last setup: [setup.completedAt] (wizard v[setup.wizardVersion])

4. If no `.lucky-penny/config.json` exists, inform the user they need to run `/setup` first.
