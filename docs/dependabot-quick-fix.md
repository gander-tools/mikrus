# Dependabot Quick Fix - Allow Bot Access

Quick solution for the error: `"Workflow initiated by non-human actor: dependabot (type: Bot). Add bot to allowed_bots list"`

## Immediate Fix (5 minutes)

### Option 1: Repository Settings (Recommended)

1. **Go to Actions Settings**
   - Navigate to: https://github.com/gander-tools/mikrus/settings/actions

2. **Update Actions Permissions**
   - Find "Actions permissions" section
   - Select: **"Allow gander-tools, and select non-gander-tools, actions and reusable workflows"**
   
3. **Add Dependabot to Allowed Actions**
   - In the text box "Allow specified actions and reusable workflows", add:
   ```
   dependabot/*,
   github/dependabot-*,
   actions/*
   ```

4. **Configure Fork PR Workflows**
   - Find "Fork pull request workflows from outside collaborators"
   - Select: **"Require approval for first-time contributors"** (not "Require approval for all outside collaborators")

5. **Save Changes**
   - Click "Save" at the bottom

### Option 2: If Using External Security System

If you're using a custom security system (like Claude Code with restricted bots), update the configuration:

1. **Find the security configuration file** (usually in repository settings or `.github/` folder)
2. **Add Dependabot to allowed bots list**:
   ```yaml
   allowed_bots:
     - "dependabot[bot]"
     - "github-actions[bot]"
   ```

### Option 3: Workflow-Level Fix (Already Applied)

The dependabot workflow has been updated with proper validation - this should resolve the issue automatically.

## Verification

After applying the fix:

```bash
# Check if dependabot can run workflows
gh workflow list

# View recent dependabot activity
gh pr list --author=app/dependabot

# Test the fix by triggering dependabot manually (if needed)
# This will create a PR that should now work
```

## Expected Behavior After Fix

- ✅ Dependabot can create PRs normally
- ✅ Dependabot auto-merge workflow runs without errors
- ✅ Security scans still run on dependabot PRs
- ✅ Manual approval still required for major version updates

## If Still Having Issues

1. **Check workflow run logs** for specific error details:
   - Go to: https://github.com/gander-tools/mikrus/actions
   - Click on failed workflow run
   - Review the error messages

2. **Contact repository admin** if you don't have sufficient permissions

3. **Review complete configuration guide**: `docs/dependabot-configuration.md`

---

**Fix Time**: 2-5 minutes  
**Risk Level**: Very Low (only affects dependency updates)  
**Recommended**: Option 1 for most cases