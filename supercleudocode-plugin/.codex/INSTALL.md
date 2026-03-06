# SuperCleudocode Plugin Installation for Codex

## Installation

### Option 1: Direct Install (Recommended)

```bash
# Clone or fetch the plugin
git clone https://github.com/cleudocode/cleudocodehub.skill.git
cd cleudocodehub.skill/supercleudocode-plugin

# Install plugin
codex plugin install .
```

### Option 2: Remote Install

```bash
# Fetch from GitHub
codex plugin install github:cleudocode/cleudocodehub.skill/supercleudocode-plugin
```

### Option 3: Manual Install

1. Download this repository
2. Copy `supercleudocode-plugin` to your codex plugins directory:
   ```bash
   cp -r supercleudocode-plugin ~/.codex/plugins/
   ```
3. Enable the plugin:
   ```bash
   codex plugin enable supercleudocode-plugin
   ```

## Verification

After installation, verify the plugin is active:

```bash
codex plugin list
```

You should see `supercleudocode-plugin` in the list.

## Usage

Once installed, the plugin activates automatically when you start coding tasks.

### Check Active Skills

```bash
codex skills list
```

### Manual Activation

```bash
@supercleudocode
```

## Configuration

Create or update `~/.codex/config.json`:

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
codex plugin update supercleudocode-plugin
```

## Uninstall

```bash
codex plugin uninstall supercleudocode-plugin
```

## Troubleshooting

### Plugin Not Loading

1. Check plugin is enabled: `codex plugin list`
2. Verify manifest: `cat ~/.codex/plugins/supercleudocode-plugin/.codex/manifest.json`
3. Restart codex session

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
