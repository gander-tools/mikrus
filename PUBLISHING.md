# Publishing Guide

This document describes the publishing setup for the `mikrus` CLI package.

## Package Information

- **Author**: Adam Gąsowski (GitHub: @gander)
- **Organization**: Gander Tools (GitHub: @gander-tools)
- **Package name**: `mikrus` (no scope)
- **Executable**: `mikrus`
- **NPM account**: gander
- **Repository**: https://github.com/gander-tools/mikrus

## Package Configuration

The `mikrus` package is configured as a public NPM package:

- **Package name**: `mikrus` (no scope)
- **Publisher**: gander (NPM account)
- **Registry**: https://registry.npmjs.org/
- **Access**: public
- **Provenance**: enabled for supply chain security

## NPM Token Setup (Required Before First Publishing)

**IMPORTANT**: This setup is required before the first release can be published.

1. **Generate NPM Automation Token**:
   ```bash
   # Login to NPM (if not already logged in)
   npm login --auth-type=web
   
   # Generate automation token
   npm token create --type=automation
   ```

2. **Configure GitHub Organization Secret**:
   - Go to: https://github.com/organizations/gander-tools/settings/secrets/actions
   - Click "New organization secret"
   - Name: `NPM_TOKEN`
   - Value: `npm_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` (token from step 1)
   - Select repositories: `gander-tools/mikrus`

3. **Verify Token Permissions**:
   ```bash
   # Test token (optional)
   curl -H "Authorization: Bearer npm_XXXXXXXX" https://registry.npmjs.org/-/whoami
   ```

## Publishing Process

### Automatic Publishing (GitHub Actions Only)

Publishing is handled exclusively through GitHub Actions. **Local publishing is not supported.**

1. Create and push a version tag:
   ```bash
   # Update version in package.json first
   git add package.json
   git commit -m "bump version to 1.0.0"
   
   # Create and push tag
   git tag v1.0.0
   git push origin main
   git push origin v1.0.0
   ```

2. The GitHub Actions workflow will automatically:
   - Build the project and create GitHub release with artifacts and checksums
   - Run comprehensive build and integration tests
   - Publish to NPM with provenance (only if all tests pass)
   - Verify the published package

### Publishing Requirements

- Publishing is **only available through GitHub Actions**
- Tag must follow semantic versioning (e.g., `v1.0.0`)
- All unit tests, linting, and build must pass
- Integration tests (CLI help/version commands) must pass
- NPM publishing only proceeds if all prerequisites are met

## Security Features

### NPM Provenance

The package is published with NPM provenance enabled, which:
- Links the published package to its source code
- Provides cryptographic proof of the build process
- Enables verification of package authenticity

### Package Integrity

Each release includes:
- SHA256 checksums for all release artifacts
- GitHub Releases with signed commits
- Build artifacts verification

### Verification

Users can verify package authenticity:

```bash
# Verify NPM provenance
npm audit signatures

# Verify checksums (for GitHub releases)
sha256sum -c mikrus-1.0.0.tar.gz.sha256
```

## Requirements

- Node.js 20+
- Repository must have `id-token: write` permissions for provenance
- Clean Git history (no uncommitted changes)

## Troubleshooting

### Publishing Fails

1. Ensure package version is incremented
2. Verify repository permissions
3. Check build process completed successfully

### Provenance Issues

- Ensure `id-token: write` permission is set
- Verify GitHub Actions environment
- Check NPM registry supports provenance

### Version Conflicts

- Use `npm view mikrus versions --json` to check existing versions
- Ensure version follows semantic versioning
- Update package.json version before tagging