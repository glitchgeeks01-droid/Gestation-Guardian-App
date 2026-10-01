---
name: deep-code-audit-and-cleanup
description: >-
  Performs a strict 3-phase technical debt audit (Reconnaissance, Approval, Cleanup) to identify and surgically remove junk code (LOJC) while preserving surrounding logic and verifying type safety.
---

# Deep Code Audit & Cleanup

## Overview
This skill safely audits a codebase for "junk code" (technical debt) and surgically removes it through a strict 3-phase workflow. It relies on the agent's ability to dynamically generate analysis scripts, evaluate AST/linting rules, and repair its own deletions if they break type safety.

## Workflow

### Phase 1: Reconnaissance
- **Scope:** Scan the designated folders provided by the user.
- **Exclusions:** Always ignore `build`, `dist`, `node_modules`, and `venv` directories.
- **Definitions:**
  - **LOC:** Total lines of code.
  - **LOJC (Lines of Junk Code):** Dead code (unreachable/unused functions), commented-out logic blocks (excluding JSDoc/docstrings), unused imports/dependencies, duplicate code blocks (>10 lines), orphaned database tables, unused indexes, redundant queries, and commented-out SQL/NoSQL logic.
- **Execution:** Autonomously write and run temporary scripts (e.g., Node.js, Python, or shell) and leverage existing linters (like `eslint`) to calculate the exact LOC, LOJC, and Junk Percentage `(LOJC / LOC) * 100`.

### Phase 2: Approval
- **Reporting:** Output a clean Markdown report summarizing the findings.
- **Content:** Include a summary table (Layer, LOC, LOJC, Percentage) and explicitly list the "Top 3 worst files" by LOJC.
- **Call to Action:** End the report by explicitly proposing to clean up those Top 3 files.
- **BLOCKING:** You MUST stop and wait for the user's explicit authorization before modifying or deleting any code.

### Phase 3: Targeted Cleanup
- **Execution:** Once approved, surgically remove the identified junk code from the target files.
- **Constraints:** Do not alter active state-management, logic, reducers, or actions. Preserve all original formatting and indentation of surrounding healthy code.
- **Verification:** Autonomously run the local project's linter or compiler (e.g., `tsc --noEmit`, `npm run lint`) to verify that the deletions did not break syntax or type safety.
- **Error Handling (Self-Correction):** 
  - If the post-cleanup linter/build fails, attempt to automatically self-correct the code exactly **once** (e.g., fixing a broken type assertion caused by the deletion).
  - If the secondary check still fails, immediately **revert** the deletion, stop, and alert the user to prevent broken code.
- **Summary:** Output a final summary showing exactly which lines or blocks were removed from each file.

## Common Mistakes
- Proceeding to Phase 3 without explicit user approval.
- Altering formatting or fixing unrelated typos during the cleanup phase.
- Forgetting to run the project's build/lint commands after deletion.
- Attempting to self-correct a failed build more than once instead of reverting.
