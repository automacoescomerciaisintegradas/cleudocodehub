# SuperCleudocode Commands

> "Commands are the interface to mastery." — SuperCleudocode

## Overview

SuperCleudocode provides powerful commands for orchestrating development workflows.

## Command Registry

### Core Commands

| Command | Args | Description |
|---------|------|-------------|
| `*super-init` | `[project-name]` | Initialize new project with SuperCleudocode workflow |
| `*super-skill` | `[skill-name]` | Activate or show skill documentation |
| `*super-plan` | `[feature]` | Create implementation plan for feature |
| `*super-execute` | `[plan-id]` | Execute approved plan |
| `*super-review` | `[target]` | Request code review |
| `*super-deploy` | `[env]` | Deploy to environment |
| `*super-debug` | `[issue]` | Start systematic debugging |
| `*super-test` | `[target]` | Run test suite |

---

## Command Details

### `*super-init`

Initialize a new project with SuperCleudocode workflow.

**Usage:**
```bash
*super-init my-project
*super-init my-project --template nodejs-api
*super-init my-project --template react-app
```

**Options:**
- `--template <name>` - Project template to use
- `--skip-install` - Skip dependency installation
- `--git` - Initialize git repository (default: true)

**Templates Available:**
- `nodejs-api` - Node.js API with Express
- `react-app` - React application with Vite
- `python-api` - Python API with FastAPI
- `fullstack` - Full-stack with React + Node.js

**Example:**
```bash
# Initialize React app
*super-init my-app --template react-app

# Initialize Node.js API
*super-init my-api --template nodejs-api

# Initialize without installing deps
*super-init my-project --template nodejs-api --skip-install
```

---

### `*super-skill`

Activate or show skill documentation.

**Usage:**
```bash
*super-skill
*super-skill test-driven-development
*super-skill --list
*super-skill --activate brainstorming
```

**Options:**
- `--list` - List all available skills
- `--activate <name>` - Activate specific skill
- `--deactivate <name>` - Deactivate specific skill
- `--status` - Show active skills

**Example:**
```bash
# List all skills
*super-skill --list

# Show TDD skill documentation
*super-skill test-driven-development

# Activate brainstorming skill
*super-skill --activate brainstorming

# Show active skills
*super-skill --status
```

---

### `*super-plan`

Create implementation plan for a feature.

**Usage:**
```bash
*super-plan "add user authentication"
*super-plan "implement shopping cart" --from-design docs/design.md
*super-plan "refactor database layer" --priority high
```

**Options:**
- `--from-design <file>` - Use existing design document
- `--priority <level>` - Priority: low, medium, high, critical
- `--output <file>` - Save plan to file

**Example:**
```bash
# Create plan from description
*super-plan "add user profile page"

# Create plan from approved design
*super-plan "implement notifications" --from-design docs/plans/notifications-design.md

# High priority plan
*super-plan "fix authentication bug" --priority critical
```

---

### `*super-execute`

Execute approved plan.

**Usage:**
```bash
*super-execute
*super-execute --plan plan-2026-03-06.md
*super-execute --from-task 1 --to-task 5
*super-execute --parallel --agents 3
```

**Options:**
- `--plan <file>` - Execute specific plan file
- `--from-task <n>` - Start from task N
- `--to-task <n>` - End at task N
- `--parallel` - Execute tasks in parallel
- `--agents <n>` - Number of subagents to dispatch

**Example:**
```bash
# Execute current plan
*super-execute

# Execute specific plan
*super-execute --plan docs/plans/auth-plan.md

# Execute tasks 1-5
*super-execute --from-task 1 --to-task 5

# Execute with 3 parallel subagents
*super-execute --parallel --agents 3
```

---

### `*super-review`

Request code review.

**Usage:**
```bash
*super-review
*super-review --target src/auth/
*super-review --security
*super-review --pr 42
```

**Options:**
- `--target <path>` - Review specific path
- `--security` - Security-focused review
- `--performance` - Performance-focused review
- `--pr <number>` - Review pull request

**Example:**
```bash
# Review all changes
*super-review

# Review specific directory
*super-review --target src/services/

# Security review
*super-review --security --target src/auth/

# Review pull request
*super-review --pr 42
```

---

### `*super-deploy`

Deploy to environment.

**Usage:**
```bash
*super-deploy
*super-deploy staging
*super-deploy production --verify
*super-deploy production --rollback v1.2.3
```

**Options:**
- `--verify` - Run verification after deploy
- `--rollback <version>` - Rollback to version
- `--dry-run` - Simulate deployment

**Example:**
```bash
# Deploy to staging
*super-deploy staging

# Deploy to production with verification
*super-deploy production --verify

# Dry run
*super-deploy production --dry-run

# Rollback
*super-deploy production --rollback v1.2.3
```

---

### `*super-debug`

Start systematic debugging.

**Usage:**
```bash
*super-debug
*super-debug "dashboard hangs on refresh"
*super-debug --issue "tests failing intermittently"
*super-debug --log error.log
```

**Options:**
- `--issue <description>` - Issue description
- `--log <file>` - Analyze log file
- `--repro <steps>` - Reproduction steps

**Example:**
```bash
# Debug with description
*super-debug "user data null on fast refresh"

# Debug with log file
*super-debug --log error.log

# Debug with reproduction steps
*super-debug --repro "1. Login 2. Go to dashboard 3. Refresh"
```

---

### `*super-test`

Run test suite.

**Usage:**
```bash
*super-test
*super-test --type unit
*super-test --type integration --coverage
*super-test --watch src/auth/
```

**Options:**
- `--type <type>` - Test type: unit, integration, e2e, all
- `--coverage` - Generate coverage report
- `--watch <path>` - Watch mode for path
- `--verbose` - Verbose output

**Example:**
```bash
# Run all tests
*super-test

# Run unit tests with coverage
*super-test --type unit --coverage

# Run integration tests
*super-test --type integration

# Watch mode
*super-test --watch src/
```

---

## MADMAX Integration

SuperCleudocode commands integrate with MADMAX agent:

```bash
# MADMAX orchestrates commands
@madmax *super-init my-app --template react-app

# MADMAX delegates
@madmax *delegate @testing "*super-test --coverage"
@madmax *delegate @code-review "*super-review --security"

# MADMAX coordinates
@madmax *coordinate @dev "*super-execute" @testing "*super-test"
```

---

## Aliases

| Alias | Command |
|-------|---------|
| `*init` | `*super-init` |
| `*skill` | `*super-skill` |
| `*plan` | `*super-plan` |
| `*exec` | `*super-execute` |
| `*review` | `*super-review` |
| `*deploy` | `*super-deploy` |
| `*debug` | `*super-debug` |
| `*test` | `*super-test` |

---

## Configuration

### Command Defaults

```json
{
  "supercleudocode": {
    "commands": {
      "deploy": {
        "defaultEnvironment": "staging",
        "requireVerification": true
      },
      "test": {
        "defaultType": "all",
        "requireCoverage": true,
        "minCoverage": 80
      },
      "review": {
        "autoRequest": true,
        "securityScan": true
      }
    }
  }
}
```

---

## Examples

### Full Workflow

```bash
# 1. Initialize project
*super-init my-app --template react-app

# 2. Plan feature
*super-plan "add user authentication"

# 3. Execute plan
*super-execute

# 4. Run tests
*super-test --coverage

# 5. Request review
*super-review --security

# 6. Deploy to staging
*super-deploy staging

# 7. Deploy to production
*super-deploy production --verify
```

### Debugging Session

```bash
# 1. Start debugging
*super-debug "dashboard hangs on refresh"

# 2. After fix, run tests
*super-test --watch src/dashboard/

# 3. Request review
*super-review

# 4. Deploy fix
*super-deploy production --verify
```

---

## Troubleshooting

### Command Not Found

```bash
# Verify plugin is installed
*super-skill --status

# Reinstall plugin
cleudocode plugin reinstall supercleudocode-plugin
```

### Skill Not Activating

```bash
# Manually activate skill
*super-skill --activate skill-name

# Check skill triggers
*super-skill --status
```

### Plan Execution Fails

```bash
# Check plan is approved
*super-plan --status

# Re-execute from failed task
*super-execute --from-task N
```

---

**Version**: 1.0.0
**License**: MIT
