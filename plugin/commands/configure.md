---
description: Reconfigure Lucky Penny settings — toggle memory, change templates, update hooks
allowed-tools: [Bash, Read, Write, Edit, AskUserQuestion]
---

Reconfigure the Lucky Penny plugin settings for this project.

1. Read the current configuration:
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/config-store.js" read
   ```

2. Present the current state to the user:
   - Experience level
   - CLAUDE.md template (language/framework) and when it was applied
   - Memory system: enabled/disabled
   - Active hooks

3. Ask what the user wants to change:
   - **Experience level** — beginner / experienced / team
   - **CLAUDE.md template** — regenerate with a different language/framework template
   - **Memory system** — toggle on/off
   - **Hooks** — toggle individual hooks

4. Apply changes:
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/config-store.js" update '<updates-json>'
   ```

5. If the user wants to regenerate CLAUDE.md, run the setup engine with the new template preferences. Warn that this will merge new sections (existing content is preserved).

6. Confirm changes and show the updated configuration.
