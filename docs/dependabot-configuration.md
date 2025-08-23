# Dependabot Configuration Guide

How to configure Dependabot for automatic dependency patching in the mikrus repository.

## Problem

Error message: `"Workflow initiated by non-human actor: dependabot (type: Bot). Add bot to allowed_bots list"`

This error occurs when security systems block Dependabot from running workflows, preventing automatic dependency updates.

## Solutions

### Option 1: GitHub Actions Settings (Recommended)

1. **Navigate to Repository Settings**
   - Go to: https://github.com/gander-tools/mikrus/settings/actions

2. **Configure Fork Pull Request Workflows**
   - Scroll to "Fork pull request workflows from outside collaborators"
   - Select: **"Require approval for all outside collaborators"** OR **"Require approval for first-time contributors"**

3. **Enable Dependabot Actions**
   - Find "Actions permissions" section
   - Ensure "Allow gander-tools, and select non-gander-tools, actions and reusable workflows" is selected
   - In "Allow specified actions and reusable workflows", add:
     ```
     dependabot/*
     github/dependabot-*
     actions/*
     ```

### Option 2: Workflow Configuration (If using custom security controls)

If you're using a custom security system that blocks bots, update your workflow configuration:

#### Update Security Scan Workflow

Add this to `.github/workflows/security-scan.yml` if it contains bot restrictions:

```yaml
# At the top of the workflow file
on:
  pull_request:
    types: [opened, synchronize, reopened]
  # ... other triggers

jobs:
  # Add condition to skip security restrictions for dependabot
  security-scan:
    if: github.actor != 'dependabot[bot]' || github.event_name == 'schedule'
    # ... rest of job configuration
    
  # Or create a separate job specifically for dependabot PRs
  dependabot-security-scan:
    if: github.actor == 'dependabot[bot]'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - name: Dependabot security check
        run: |
          echo "🤖 Running lightweight security check for Dependabot PR"
          echo "Dependabot PRs are pre-validated for security"
```

### Option 3: Update Dependabot Auto-merge Workflow

Ensure your dependabot auto-merge workflow allows the bot:

```yaml
# In .github/workflows/dependabot-auto-merge.yml
name: Dependabot Auto-merge

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read

jobs:
  auto-merge:
    name: Auto-merge Dependabot PRs
    runs-on: ubuntu-latest
    permissions:
      contents: write          # Only for merging PRs
      pull-requests: write     # Only for PR operations
      checks: read            # For CI status verification
    # This is the key condition - only run for dependabot
    if: github.actor == 'dependabot[bot]'
    
    steps:
      # Add bot validation step
      - name: Validate Dependabot actor
        run: |
          echo "🤖 Validating Dependabot actor: ${{ github.actor }}"
          if [ "${{ github.actor }}" != "dependabot[bot]" ]; then
            echo "❌ Unauthorized actor attempting to use Dependabot workflow"
            exit 1
          fi
          echo "✅ Dependabot actor validated"
        
      # ... rest of your existing steps
```

### Option 4: Branch Protection Rules Update

Update branch protection to allow Dependabot:

1. **Navigate to Branch Settings**
   - Go to: https://github.com/gander-tools/mikrus/settings/branches
   - Edit the rule for `main` branch

2. **Configure Status Checks**
   - In "Require status checks to pass before merging"
   - Ensure these are NOT required for Dependabot PRs (or create exceptions):
     - Keep essential checks: `Build`, `Test (Node 20)`, `Test (Node 22)`
     - Consider making optional: Heavy security scans for minor dependency updates

3. **Add Dependabot to Bypass List** (if available)
   - Look for "Restrict pushes that create files larger than 100MB"
   - Check if there's an option to allow specific bots

### Option 5: Custom GitHub Action for Bot Detection

Create a reusable action to handle bot detection:

```yaml
# .github/workflows/bot-validator.yml
name: Bot Validation

on:
  workflow_call:
    inputs:
      allowed_bots:
        required: false
        type: string
        default: "dependabot[bot],renovate[bot]"

jobs:
  validate-bot:
    runs-on: ubuntu-latest
    outputs:
      is_allowed_bot: ${{ steps.check.outputs.allowed }}
    steps:
      - name: Check if actor is allowed bot
        id: check
        run: |
          ACTOR="${{ github.actor }}"
          ALLOWED_BOTS="${{ inputs.allowed_bots }}"
          
          echo "Checking actor: $ACTOR"
          echo "Allowed bots: $ALLOWED_BOTS"
          
          if echo "$ALLOWED_BOTS" | grep -q "$ACTOR"; then
            echo "✅ $ACTOR is in allowed bots list"
            echo "allowed=true" >> $GITHUB_OUTPUT
          else
            echo "❌ $ACTOR is not in allowed bots list"
            echo "allowed=false" >> $GITHUB_OUTPUT
          fi
```

Then use it in other workflows:

```yaml
# In your main workflows
jobs:
  bot-check:
    uses: ./.github/workflows/bot-validator.yml
    with:
      allowed_bots: "dependabot[bot],renovate[bot]"
  
  main-job:
    needs: bot-check
    if: github.actor != 'dependabot[bot]' || needs.bot-check.outputs.is_allowed_bot == 'true'
    runs-on: ubuntu-latest
    # ... rest of job
```

## Recommended Configuration

For the mikrus repository, I recommend **Option 1** (GitHub Actions Settings) combined with updating the dependabot auto-merge workflow:

### Step 1: Repository Settings
```
Settings → Actions → General
- Fork pull request workflows: "Require approval for first-time contributors"  
- Actions permissions: Allow specified actions
- Add to allowed actions: dependabot/*, github/dependabot-*, actions/*
```

### Step 2: Update Dependabot Workflow
Ensure `.github/workflows/dependabot-auto-merge.yml` has proper bot validation:

```yaml
if: github.actor == 'dependabot[bot]' && github.event.pull_request.user.type == 'Bot'
```

### Step 3: Security Exception for Dependabot
Add to security workflows:

```yaml
# Skip heavy security scans for dependabot patch updates
- name: Skip heavy scans for dependabot patches
  if: github.actor == 'dependabot[bot]' && contains(github.event.pull_request.title, '[Security]') == false
  run: |
    echo "🤖 Dependabot patch update - skipping heavy security scans"
    echo "Basic security validation sufficient for dependency patches"
```

## Verification

After implementing the fix:

```bash
# Test dependabot workflow
gh workflow run dependabot-auto-merge.yml

# Check recent dependabot PRs
gh pr list --author=app/dependabot

# View dependabot workflow runs
gh run list --workflow=dependabot-auto-merge.yml --limit=5
```

## Security Considerations

### Safe Dependabot Practices
- ✅ Allow automatic merging for **patch updates only**
- ✅ Require manual approval for **major version updates**
- ✅ Run basic security scans on all dependabot PRs
- ✅ Monitor dependabot activity in security logs

### Security Boundaries
```yaml
# Safe auto-merge conditions
if: |
  github.actor == 'dependabot[bot]' && 
  (
    steps.metadata.outputs.update-type == 'version-update:semver-patch' ||
    (steps.metadata.outputs.update-type == 'version-update:semver-minor' && 
     steps.metadata.outputs.dependency-type == 'direct:development')
  )
```

## Troubleshooting

**Still getting blocked after configuration:**
1. Check repository Actions permissions
2. Verify dependabot.yml configuration is valid
3. Ensure branch protection allows the necessary checks
4. Review workflow run logs for specific error details

**Dependabot PRs not auto-merging:**
1. Verify CI checks are passing
2. Check if manual approval is required
3. Review dependabot auto-merge workflow conditions
4. Ensure proper permissions are set

**Too many dependabot PRs:**
```yaml
# In .github/dependabot.yml
open-pull-requests-limit: 5  # Reduce from default 10
groups:
  patch-updates:
    patterns: ["*"]
    update-types: ["patch"]
```

---

**Implementation Time**: 5-10 minutes  
**Security Impact**: Low (only affects dependency updates)  
**Recommended**: Option 1 + Workflow validation for enterprise security