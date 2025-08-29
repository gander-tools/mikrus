// Version is replaced during build process (see deno-release.yml)
// For development, falls back to "dev" version
export const VERSION = "%VERSION%" === "%VERSION%" ? "dev" : "%VERSION%";
export const GIT_HASH = "%GIT_HASH%" === "%GIT_HASH%" ? "local" : "%GIT_HASH%";
