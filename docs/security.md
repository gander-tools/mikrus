# Security Guidelines

## Overview

This document outlines the security measures and best practices implemented in the mikrus CLI tool.

## Security Features

### Input Validation
- All user inputs are validated and sanitized
- Model names must follow strict naming conventions
- File paths are validated to prevent directory traversal attacks

### File System Security  
- Generated files are restricted to the project directory
- Path traversal protection prevents writing outside allowed locations
- File existence checks prevent accidental overwrites

### Dependency Security
- Automated vulnerability scanning in CI/CD pipeline
- Package overrides for vulnerable dependencies
- Regular dependency updates and security audits

### Supply Chain Security
- Dependency integrity verification
- License compliance checking
- Automated security scanning for all dependencies

### CI/CD Security
- **Minimal Attack Surface**: Simplified 4-workflow architecture reduces potential attack vectors
- **Native GitHub Integration**: Leverages GitHub's native branch auto-deletion for better security
- **Workflow Isolation**: Each workflow has minimal, specific permissions and dependencies
- **Resource Protection**: Reduced workflow complexity prevents resource exhaustion attacks
- **Security-First Releases**: All releases require successful security validation before publishing
- **Provenance Verification**: NPM packages published with cryptographic provenance for supply chain integrity

## Security Best Practices

### For Users
1. **Keep Updated**: Always use the latest version of mikrus
2. **Validate Inputs**: Be cautious with model names and file paths
3. **Secure Environment**: Use mikrus in trusted development environments
4. **Review Generated Code**: Always review generated files before use

### For Developers
1. **Input Validation**: All user inputs must be validated
2. **Path Security**: Use secure path handling for file operations
3. **Error Handling**: Implement secure error handling without information disclosure
4. **Code Review**: All changes require security review

## Threat Model

### Identified Threats
1. **Path Traversal**: Malicious file paths could write outside the project directory
2. **Code Injection**: Template injection through unsanitized inputs  
3. **Supply Chain**: Vulnerable dependencies could introduce security risks
4. **Information Disclosure**: Error messages could reveal sensitive information

### Mitigations
1. **Input Sanitization**: All inputs are validated and sanitized
2. **Path Validation**: File paths are restricted to project directories
3. **Dependency Scanning**: Automated vulnerability scanning and updates
4. **Secure Error Handling**: Generic error messages without sensitive details

## Incident Response

### Reporting
- Use GitHub Security Advisories for vulnerability reports
- Email maintainers for sensitive issues
- Provide detailed reproduction steps

### Response Process
1. **Acknowledgment**: Within 24 hours
2. **Assessment**: Initial analysis within 72 hours
3. **Fix Development**: Priority based on severity
4. **Release**: Security patches released immediately
5. **Communication**: Security advisories published

## Security Testing

### Automated Testing
- Dependency vulnerability scanning
- Secret detection in source code  
- License compliance checking
- Supply chain security validation
- CI/CD workflow security validation
- Branch protection rule compliance

### Manual Testing
- Input validation testing
- Path traversal testing
- Template injection testing
- Error handling validation

## Compliance

### Standards
- Follow OWASP Top 10 security guidelines
- Implement secure coding practices
- Regular security assessments

### Documentation
- Security policy maintained in SECURITY.md
- Security advisories for all vulnerabilities
- Regular security audit reports

## Contact

For security questions or concerns:
- GitHub Issues: https://github.com/gander-tools/mikrus/issues
- Security Advisories: https://github.com/gander-tools/mikrus/security/advisories
- Maintainers: Via GitHub discussions
