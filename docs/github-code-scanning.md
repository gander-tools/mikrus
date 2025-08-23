# GitHub Code Scanning Integration

Complete guide to the GitHub Code Scanning integration in the mikrus repository security workflow.

## Overview

GitHub Code Scanning is now fully integrated into the security workflow, providing comprehensive static analysis and vulnerability detection directly in the GitHub Security tab.

## Integrated Security Tools

### 1. Snyk Integration
**Purpose**: Professional vulnerability scanning for dependencies and container images  
**Output**: SARIF reports uploaded to GitHub Security tab  
**Category**: `snyk-dependencies`

**Features**:
- Dependency vulnerability scanning
- License compliance checking
- Security advisory integration
- Real-time alerts in GitHub Security tab

### 2. CodeQL Analysis
**Purpose**: Semantic code analysis for security vulnerabilities  
**Output**: Security alerts and code scanning results  
**Category**: `/language:javascript`

**Features**:
- Static application security testing (SAST)
- CWE (Common Weakness Enumeration) detection
- Security-focused query suites
- Custom security rules

### 3. GitHub Security Advisories
**Purpose**: Check for active security advisories affecting the repository  
**Output**: Advisory summary and severity analysis

**Features**:
- Real-time advisory monitoring
- Severity-based alerting
- Integration with GitHub's vulnerability database

## Code Scanning Workflow

### Automatic Triggers
- **Daily Schedule**: 2:00 AM UTC via cron
- **Manual Dispatch**: Can be triggered manually
- **Workflow Call**: Called by other workflows (CI pipeline)
- **Pull Requests**: Runs on all PRs for incremental analysis

### Scan Types

#### 1. Dependency Scanning (Snyk)
```yaml
- Scans: package.json dependencies
- Output: snyk.sarif file
- Upload: GitHub Code Scanning API
- Severity Levels: Critical, High, Medium, Low
```

#### 2. Code Analysis (CodeQL)
```yaml
- Languages: JavaScript/TypeScript
- Queries: security-extended, security-and-quality
- Focus: Security vulnerabilities and code quality
- Output: Native GitHub Code Scanning results
```

#### 3. Advisory Monitoring
```yaml
- Source: GitHub Security Advisory Database
- Scope: Repository-specific advisories
- Action: Automatic alert on critical/high severity
```

## Security Tab Integration

### Viewing Results

1. **Navigate to Security Tab**
   - Go to: https://github.com/gander-tools/mikrus/security

2. **Code Scanning Alerts**
   - Click "Code scanning" to view all alerts
   - Filter by tool: Snyk, CodeQL, etc.
   - View severity levels and recommendations

3. **Security Advisories**
   - Click "Security advisories" for dependency alerts
   - Review Dependabot alerts and recommendations

### Alert Categories

#### Snyk Dependency Alerts
- **Category**: `snyk-dependencies`
- **Focus**: Package vulnerabilities, license issues
- **Actions**: Update dependency versions, apply patches

#### CodeQL Security Alerts  
- **Category**: `/language:javascript`
- **Focus**: Code-level security issues
- **Actions**: Fix vulnerable code patterns, improve security

## Configuration Files

### CodeQL Configuration
**File**: `.github/codeql/codeql-config.yml`

**Key Settings**:
```yaml
# Security-focused query suites
queries:
  - security-extended
  - security-and-quality

# Targeted scanning paths
paths:
  - src/
  - bin/

# Excluded paths
paths-ignore:
  - node_modules/
  - "**/*.test.ts"
  - docs/
```

### Workflow Configuration
**File**: `.github/workflows/security-scan.yml`

**Key Features**:
- SHA-pinned actions for supply chain security
- SARIF upload with proper categorization
- Comprehensive error handling
- Integration with security monitoring dashboard

## Security Workflow Jobs

### Job Dependencies
```
dependency-scan → snyk-scan → sarif-upload
license-scan → compliance-check
secrets-scan → trufflehog → pattern-validation
supply-chain-security → integrity-validation
codeql-analysis → static-analysis → security-alerts
github-security-advisory → advisory-monitoring
security-monitoring → dashboard-summary
```

### Permissions Required
```yaml
permissions:
  contents: read          # Repository access
  security-events: write  # Upload to Security tab
  actions: read          # CodeQL workflow access
```

## Monitoring and Alerts

### Security Dashboard
**Location**: Workflow run logs → Security Event Monitoring job

**Metrics Tracked**:
- Scan success/failure status
- Severity distribution
- Alert trends
- Response times

### Real-time Notifications
- **Slack/Email**: Configure in repository settings
- **GitHub Notifications**: Automatic on security alerts
- **Workflow Failures**: Immediate notification system

## Best Practices

### Development Workflow
1. **Pre-commit**: Run local security checks
2. **Pull Request**: Security scans run automatically
3. **Review**: Address any security alerts before merge
4. **Monitor**: Regular review of Security tab

### Security Alert Handling
1. **Triage**: Review alert severity and impact
2. **Investigate**: Understand the security implication
3. **Fix**: Apply recommended remediation
4. **Verify**: Confirm fix resolves the alert
5. **Document**: Record security incident if applicable

### Regular Maintenance
- **Weekly**: Review Security tab for new alerts
- **Monthly**: Update security scanning tools and rules
- **Quarterly**: Review and update security policies

## Troubleshooting

### Common Issues

#### SARIF Upload Failures
```bash
# Check file existence and format
ls -la *.sarif
jq . snyk.sarif  # Validate JSON format

# Verify permissions
# Ensure security-events: write permission
```

#### CodeQL Analysis Failures
```bash
# Check build process
bun run build

# Review CodeQL logs
# Look for compilation errors or missing dependencies
```

#### Missing Security Alerts
```bash
# Verify workflow completion
gh run list --workflow=security-scan.yml

# Check Security tab directly
# https://github.com/gander-tools/mikrus/security
```

### Debug Commands
```bash
# Test SARIF file validity
npx @microsoft/sarif-multitool validate snyk.sarif

# Check security-events permission
gh api repos/:owner/:repo --jq '.permissions'

# View recent code scanning alerts
gh api repos/:owner/:repo/code-scanning/alerts
```

## Integration with CI/CD

### Branch Protection
Required status checks now include:
- `Security Scan / Dependency Security Scan`
- `Security Scan / License Compliance Scan`
- `Security Scan / Secrets and Sensitive Data Scan`
- `Security Scan / Supply Chain Security`

### Pull Request Flow
1. **Automatic Scanning**: All security scans run on PR creation
2. **Incremental Analysis**: CodeQL analyzes only changed code
3. **Status Checks**: PR blocked if critical security issues found
4. **Review Process**: Security alerts visible in PR interface

### Release Pipeline
- Security scans must pass before release
- Security monitoring dashboard provides release health metrics
- Critical/high severity issues block releases

## Security Metrics

### Key Performance Indicators
- **Mean Time to Detection (MTTD)**: Average time to identify security issues
- **Mean Time to Resolution (MTTR)**: Average time to fix security issues
- **Security Alert Backlog**: Number of unresolved security alerts
- **False Positive Rate**: Percentage of alerts that are false positives

### Reporting
- **Weekly Security Reports**: Automated via workflow logs
- **Security Dashboard**: Real-time metrics in workflow monitoring
- **Trend Analysis**: Historical security posture tracking

## Advanced Configuration

### Custom Security Rules
Add custom CodeQL queries in `.github/codeql/custom-queries/`

### Third-party Tool Integration
```yaml
# Example: Adding Semgrep
- name: Run Semgrep
  uses: semgrep/semgrep-action@v1
  with:
    publishToken: ${{ secrets.SEMGREP_APP_TOKEN }}
    publishDeployment: true
```

### SARIF Processing
```yaml
# Custom SARIF processing
- name: Process SARIF results
  run: |
    # Custom filtering or enhancement of SARIF results
    jq '.runs[].results[] | select(.level == "error")' results.sarif
```

---

## Quick Reference

### Important URLs
- **Security Tab**: https://github.com/gander-tools/mikrus/security
- **Code Scanning**: https://github.com/gander-tools/mikrus/security/code-scanning
- **Workflow Runs**: https://github.com/gander-tools/mikrus/actions/workflows/security-scan.yml

### Key Files
- `.github/workflows/security-scan.yml` - Main security workflow
- `.github/codeql/codeql-config.yml` - CodeQL configuration
- `docs/github-security-setup.md` - Setup instructions

### Commands
```bash
# Trigger security scan
gh workflow run security-scan.yml

# View security alerts
gh api repos/:owner/:repo/code-scanning/alerts

# Check SARIF files
find . -name "*.sarif" -exec jq . {} \;
```

---

**Security Level**: Enterprise Grade 🏆  
**Code Scanning**: Fully Integrated ✅  
**SARIF Support**: Complete ✅  
**Real-time Alerts**: Active 🚨