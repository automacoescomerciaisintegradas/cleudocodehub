# SuperCleudocode Plugin Installation for OpenCode

## Installation

### Option 1: Direct Install (Recommended)

```bash
# Clone or fetch the plugin
git clone https://github.com/cleudocode/cleudocodehub.skill.git
cd cleudocodehub.skill/supercleudocode-plugin

# Install plugin
opencode plugin install .
```

### Option 2: Remote Install

```bash
# Fetch from GitHub
opencode plugin install github:cleudocode/cleudocodehub.skill/supercleudocode-plugin
```

### Option 3: Manual Install

1. Download this repository
2. Copy `supercleudocode-plugin` to your opencode plugins directory:
   ```bash
   cp -r supercleudocode-plugin ~/.opencode/plugins/
   ```
3. Enable the plugin:
   ```bash
   opencode plugin enable supercleudocode-plugin
   ```

## Verification

After installation, verify the plugin is active:

```bash
opencode plugin list
```

You should see `supercleudocode-plugin` in the list.

## Usage

Once installed, the plugin activates automatically when you start coding tasks.

### Check Active Skills

```bash
opencode skills list
```

### Manual Activation

```bash
@supercleudocode
```

## Configuration

Create or update `~/.opencode/config.json`:

```json
{
  "plugins": {
    "supercleudocode-plugin": {
      "enabled": true,
      "autoActivate": true,
      "skills": {
        "test-driven-development": true,
        "brainstorming": true,
        "writing-plans": true,
        "systematic-debugging": true
      }
    }
  }
}
```

## Update

```bash
opencode plugin update supercleudocode-plugin
```

## Uninstall

```bash
opencode plugin uninstall supercleudocode-plugin
```

## Troubleshooting

### Plugin Not Loading

1. Check plugin is enabled: `opencode plugin list`
2. Verify manifest: `cat ~/.opencode/plugins/supercleudocode-plugin/.opencode/manifest.json`
3. Restart opencode session

### Skills Not Triggering

1. Check skill triggers match your workflow
2. Manually activate: `@supercleudocode`
3. Review skill documentation in `skills/` directory

## Support

- Documentation: `docs/README.md`
- Issues: https://github.com/cleudocode/cleudocodehub.skill/issues
- Skills Reference: `skills/using-supercleudocode/SKILL.md`

## License

MIT License - See LICENSE file for details
