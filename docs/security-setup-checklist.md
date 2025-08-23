# GitHub Security Setup Checklist

Quick checklist for implementing OWASP CI/CD Security enhancements.

## Pre-Setup Requirements
- [ ] Repository admin access to `gander-tools/mikrus`
- [ ] GitHub CLI (`gh`) installed and authenticated
- [ ] Snyk account created (https://snyk.io/)
- [ ] NPM account with automation token

---

## 🏗️ GitHub Environments Setup

### Production Environment
- [ ] Navigate to: https://github.com/gander-tools/mikrus/settings/environments
- [ ] Click "New environment" → Name: `production`
- [ ] Configure protection rules:
  - [ ] ✅ Required reviewers: Add your username
  - [ ] ✅ Deployment branches: Selected branches only → `main`
- [ ] Save environment

### NPM Production Environment  
- [ ] Click "New environment" → Name: `npm-production`
- [ ] Configure protection rules:
  - [ ] ✅ Required reviewers: Add your username
  - [ ] ✅ Deployment branches: Selected branches only → `main`
- [ ] Add environment secret:
  - [ ] Secret name: `NPM_TOKEN`
  - [ ] Secret value: Your NPM automation token
- [ ] Save environment

---

## 🔐 Repository Secrets Configuration

### Snyk Token Setup
- [ ] Login to https://snyk.io/
- [ ] Go to: Account Settings → General → Auth Token
- [ ] Copy your token
- [ ] Navigate to: https://github.com/gander-tools/mikrus/settings/secrets/actions
- [ ] Click "New repository secret"
- [ ] Name: `SNYK_TOKEN`
- [ ] Value: Your Snyk token
- [ ] Save secret

### Verify Secrets
```bash
# Check all secrets are configured
gh secret list
```
Expected output: `SNYK_TOKEN`

---

## 🔒 Branch Protection Setup

- [ ] Navigate to: https://github.com/gander-tools/mikrus/settings/branches
- [ ] Click "Add rule" or edit existing rule for `main`
- [ ] Configure settings:
  - [ ] ✅ Require a pull request before merging
  - [ ] ✅ Require status checks to pass before merging
  - [ ] ✅ Require branches to be up to date before merging
  - [ ] ✅ Require conversation resolution before merging
  - [ ] ✅ Do not allow bypassing the above settings

### Required Status Checks
Add these exact names (case-sensitive):
- [ ] `Lint & Format`
- [ ] `Test (Node 20)`
- [ ] `Test (Node 22)`
- [ ] `Build`
- [ ] `Security Scan / Dependency Security Scan`
- [ ] `Security Scan / License Compliance Scan`
- [ ] `Security Scan / Secrets and Sensitive Data Scan`
- [ ] `Security Scan / Supply Chain Security`
- [ ] `Integration Test`

---

## 🧪 Verification Tests

### Test Security Scan
```bash
# Trigger manual security scan
gh workflow run security-scan.yml

# Check results
gh run list --workflow=security-scan.yml --limit=3
```

### Test Environment Approval
```bash
# Create test release tag (triggers approval workflow)
git tag v0.0.2-test
git push origin v0.0.2-test
```

- [ ] Navigate to: https://github.com/gander-tools/mikrus/actions
- [ ] Find the Release workflow run
- [ ] Verify it shows "Waiting for approval" status
- [ ] Go to: https://github.com/gander-tools/mikrus/settings/environments
- [ ] Click `production` → Review pending deployment → Approve

### Verify Security Features
- [ ] Check GitHub Security tab: https://github.com/gander-tools/mikrus/security
- [ ] Verify Code Scanning shows Snyk results
- [ ] Review TruffleHog secret detection in workflow logs
- [ ] Confirm security monitoring dashboard works

---

## ✅ Final Security Checklist

- [ ] **Environments**: Both `production` and `npm-production` created with approval gates
- [ ] **Secrets**: `SNYK_TOKEN` configured and working
- [ ] **Environment Secrets**: `NPM_TOKEN` in npm-production environment
- [ ] **Branch Protection**: Main branch protected with 9 required status checks
- [ ] **Security Scans**: All security workflows passing
- [ ] **Approval Workflow**: Environment deployment approvals working
- [ ] **No Secret Exposure**: Verified no secrets in logs or public areas

---

## 📊 Expected Results

### Security Dashboard
- **OWASP Compliance**: 10/10 (100%)
- **Security Level**: Enterprise Grade 🏆
- **Protected Branches**: 1 (main)
- **Environment Gates**: 2 (production, npm-production)
- **Security Scans**: 5 (Dependency, License, Secrets, Supply Chain, Monitoring)

### Active Security Features
- 🛡️ **TruffleHog**: Advanced secret detection
- 🔍 **Snyk**: Professional vulnerability scanning  
- 🚨 **Real-time Alerts**: Immediate security notifications
- 🔒 **Environment Gates**: Manual approval for production
- 📊 **Security Dashboard**: Comprehensive monitoring
- 📝 **Audit Trail**: Complete security event logging

---

## 🆘 Troubleshooting

**Environment creation fails**:
- Verify you have admin permissions
- Check environment name spelling (exact: `production`, `npm-production`)

**SNYK_TOKEN not working**:
- Test token: `curl -H "Authorization: token YOUR_TOKEN" https://snyk.io/api/v1/user/me`
- Regenerate token if needed

**Approval workflow not triggered**:
- Verify environments have reviewers configured
- Check tag format: `v*.*.*` (e.g., `v0.0.2-test`)

**Security scans failing**:
- Check SNYK_TOKEN is configured
- Review workflow logs for specific errors
- Verify TruffleHog installation in logs

---

**Setup Time**: ~15 minutes  
**Maintenance**: Monthly token rotation, weekly security review  
**Support**: Review complete guide in `docs/github-security-setup.md`