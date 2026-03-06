# Quick Start Guide

> Get started with SuperCleudocode in 5 minutes.

## 1. Install (2 minutes)

```bash
# Cleudocode Core
cleudocode plugin install supercleudocode-plugin

# Or clone manually
git clone https://github.com/cleudocode/cleudocodehub.skill.git
cd cleudocodehub.skill/supercleudocode-plugin
```

## 2. Activate (30 seconds)

```bash
# Manual activation
@supercleudocode

# Or skills auto-trigger based on context
```

## 3. Your First Workflow (3 minutes)

### Scenario: Create a new feature

```bash
# Step 1: Brainstorm design (automatic)
# Just describe what you want to build
"I need a user login form"

# Step 2: Skill activates automatically
# Agent will ask clarifying questions one at a time
# Present 2-3 approaches with trade-offs
# Get your approval on design

# Step 3: Plan creation (automatic)
# Breaks design into 2-5 minute tasks
# Shows exact file paths and code

# Step 4: Execution (automatic)
# Dispatches subagents per task
# Each task uses TDD (RED-GREEN-REFACTOR)

# Step 5: Code review (automatic)
# Reviews against plan
# Reports issues by severity

# Step 6: Merge (automatic)
# Verifies all tests pass
# Presents merge options
```

## 4. Essential Commands

```bash
# List all skills
*super-skill --list

# Show skill documentation
*super-skill test-driven-development

# Create implementation plan
*super-plan "add user registration"

# Execute plan
*super-execute

# Run tests
*super-test --coverage

# Request review
*super-review

# Deploy
*super-deploy staging
```

## 5. MADMAX Integration

```bash
# MADMAX orchestrates everything
@madmax *orchestrate new-feature

# MADMAX delegates to skills
@madmax *delegate @brainstorming "design auth system"
@madmax *delegate @testing "create test suite"

# MADMAX coordinates parallel work
@madmax *coordinate @dev @testing @code-review
```

## 6. Next Steps

### Learn the Skills

| Skill | When to Use |
|-------|-------------|
| [brainstorming](skills/brainstorming/SKILL.md) | Before ANY creative work |
| [test-driven-development](skills/test-driven-development/SKILL.md) | When implementing features |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | When fixing bugs |
| [writing-plans](skills/writing-plans/SKILL.md) | After design approval |

### Read Full Documentation

- [Complete README](README.md)
- [Commands Reference](commands/README.md)
- [Using SuperCleudocode](skills/using-supercleudocode/SKILL.md)

### Configure

```json
{
  "supercleudocode": {
    "autoTrigger": true,
    "skills": {
      "test-driven-development": true,
      "brainstorming": true,
      "writing-plans": true
    }
  }
}
```

## 7. Common Workflows

### New Feature
```
@brainstorming → *git-worktree → @writing-plans → 
@subagent-driven-development → *super-test → 
*super-review → *finish-branch
```

### Bug Fix
```
@systematic-debugging → @brainstorming → 
*git-worktree → @test-driven-development → 
*verification-before-completion → *super-review
```

### Code Review
```
*super-review → @requesting-code-review → 
@receiving-code-review → *super-test → 
approve/request-changes
```

## 8. Get Help

```bash
# Show all commands
*help

# Show skill status
*super-skill --status

# View documentation
*super-skill using-supercleudocode
```

## 9. Troubleshooting

### Skill not triggering?
```bash
# Manually activate
*super-skill --activate skill-name
```

### Command not found?
```bash
# Verify installation
cleudocode plugin list

# Reinstall if needed
cleudocode plugin reinstall supercleudocode-plugin
```

## 10. Join the Community

- **Issues**: https://github.com/cleudocode/cleudocodehub.skill/issues
- **Discussions**: https://github.com/cleudocode/cleudocodehub.skill/discussions
- **MADMAX Agent**: ../.agents/agents/madmax.md

---

**That's it! You're ready to use SuperCleudocode.** 🚀

Start with `@brainstorming` for your next feature and let the skills guide you.

```
— SuperCleudocode, elevating development 🚀

"Skills are shortcuts to excellence."
```
