---
name: 🔒 Security Vulnerability Report
about: Report a security vulnerability in mikrus CLI (use GitHub Security Advisories for private disclosure)
title: "[SECURITY] "
labels: security, needs-triage
---

## ⚠️ Security Notice

**For sensitive security vulnerabilities, please use
[GitHub Security Advisories](https://github.com/gander-tools/mikrus/security/advisories/new)
for private disclosure.**

This public template should only be used for:

- General security improvements
- Security documentation issues
- Non-sensitive security questions
- Public security discussions after coordination

---

## 🔍 Vulnerability Details

**Vulnerability Type:**

- [ ] Command injection
- [ ] Path traversal
- [ ] Input validation bypass
- [ ] Authentication bypass
- [ ] Credential exposure
- [ ] API security issue
- [ ] Configuration security
- [ ] Other: ___________

**Affected Component:**

- [ ] CLI commands (`info`, `servers`, `restart`, etc.)
- [ ] Configuration handling (`~/.mikrus_cli.conf`)
- [ ] API client (mikr.us integration)
- [ ] Input validation (`generate` command)
- [ ] File operations
- [ ] Binary compilation
- [ ] Other: ___________

**Severity Assessment:**

- [ ] 🔴 Critical - Service disruption, data loss, remote code execution
- [ ] 🟠 High - Privilege escalation, sensitive data exposure
- [ ] 🟡 Medium - Limited access, information disclosure
- [ ] 🟢 Low - Security enhancement, best practice improvement

## 📋 Reproduction Steps

**Environment:**

- Deno version: [e.g., 2.4.0]
- Operating System: [e.g., Ubuntu 22.04, Windows 11, macOS 14]
- Installation method: [binary download/JSR/source compilation]

**Steps to reproduce:** 1. 2. 3.

**Expected secure behavior:**

<!-- What should happen from security perspective -->

**Actual vulnerable behavior:**

<!-- What actually happens that creates security risk -->

## 🎯 Impact Assessment

**Potential Impact:**

- [ ] Local file access outside project directory
- [ ] Command execution with elevated privileges
- [ ] Exposure of mikr.us API credentials
- [ ] VPS server unauthorized access
- [ ] Configuration file manipulation
- [ ] Network request manipulation
- [ ] Other: ___________

**Attack Scenarios:**

<!-- Describe realistic attack scenarios -->

**Affected Users:**

- [ ] All users
- [ ] Users with specific configurations
- [ ] Users on specific platforms
- [ ] Users with elevated privileges
- [ ] Other: ___________

## 🛡️ Security Context

**mikr.us VPS Context (if applicable):**

- Server affected: [Yes/No]
- API endpoint involved: [e.g., /info, /servers, /restart]
- Authentication method: [API key, other]
- Network exposure: [local/remote]

**Deno Security Context:**

- Required permissions: [--allow-read, --allow-write, --allow-net]
- JSR/URL imports involved: [Yes/No]
- Binary compilation affected: [Yes/No]

## 💡 Suggested Fix

**Proposed Solution:**

<!-- Your suggestion for fixing the vulnerability -->

**Security Best Practices:**

- [ ] Input sanitization improvements
- [ ] Authentication enhancements
- [ ] Permission restrictions
- [ ] Error message security
- [ ] Logging security
- [ ] Other: ___________

## 📚 References

**Related Security Standards:**

- [ ] OWASP CLI Security Guidelines
- [ ] CIS Controls
- [ ] NIST Cybersecurity Framework
- [ ] Other: ___________

**Documentation:**

- Security Policy: https://github.com/gander-tools/mikrus/blob/main/SECURITY.md
- mikr.us API docs: [if applicable]
- Related issues: [link any related issues]

## ✅ Reporter Checklist

- [ ] I have checked this is not a duplicate issue
- [ ] I have considered using Security Advisories for sensitive issues
- [ ] I have provided sufficient detail for reproduction
- [ ] I have assessed the potential impact accurately
- [ ] I am willing to work with maintainers on responsible disclosure

---

**Thank you for helping improve mikrus CLI security! 🔒**

For questions about this report or our security process, contact the maintainers
through our
[Security Policy](https://github.com/gander-tools/mikrus/blob/main/SECURITY.md).
