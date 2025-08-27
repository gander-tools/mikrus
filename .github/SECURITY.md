# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of mikrus seriously. If you discover a security
vulnerability, please report it responsibly:

### 🔒 **Private Disclosure**

1. **GitHub Security Advisories** (Preferred):
   https://github.com/gander-tools/mikrus/security/advisories/new
2. **Security Issue**:
   https://github.com/gander-tools/mikrus/issues/new?labels=security&template=security_report.md

### 📋 **What to Include**

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Suggested fix (if known)
- Your contact information

### 🕐 **Response Timeline**

- **Acknowledgment**: Within 24 hours
- **Initial Assessment**: Within 72 hours
- **Status Updates**: Weekly until resolved
- **Fix Timeline**: Critical issues within 7 days, others within 30 days

### 🎯 **Scope**

**In Scope:**

- Authentication and authorization bypasses
- Code injection vulnerabilities
- Path traversal attacks
- Command injection
- Sensitive data exposure
- Dependency vulnerabilities

**Out of Scope:**

- Social engineering attacks
- Physical attacks
- Denial-of-service attacks
- Issues requiring physical access to user devices

## Security Features

### 🛡️ **Built-in Security Controls**

- **Input Validation**: All user inputs are validated and sanitized
- **Path Traversal Protection**: File operations are restricted to project
  directories
- **Rate Limiting**: CLI operations are rate-limited to prevent abuse
- **Dependency Scanning**: Automated vulnerability scanning in CI/CD
- **Secure Defaults**: Conservative security settings by default

### 🔍 **Security Monitoring**

- Automated dependency vulnerability scanning
- License compliance checking
- Secret detection in source code
- Supply chain security validation

## Security Updates

Security updates are released as patch versions and are documented in:

- GitHub Security Advisories
- Release notes with `[SECURITY]` tag
- CHANGELOG.md with a security section

## Contact

For questions about this security policy, contact:

- **Security Advisories**:
  https://github.com/gander-tools/mikrus/security/advisories/new
- **Security Issues**:
  https://github.com/gander-tools/mikrus/issues/new?labels=security&template=security_report.md
- **Maintainers**: https://github.com/gander-tools/mikrus/graphs/contributors

---

**Last Updated**: 2025-08-25\
**Policy Version**: 2.0
