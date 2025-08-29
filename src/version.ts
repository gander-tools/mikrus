// Version is replaced during build process (see deno-release.yml)
// For development, falls back to "dev" version
const VERSION_PLACEHOLDER = "%VERSION%";
const GIT_HASH_PLACEHOLDER = "%GIT_HASH%";

export const VERSION = VERSION_PLACEHOLDER === "%VERSION%" ? "dev" : VERSION_PLACEHOLDER;
export const GIT_HASH = GIT_HASH_PLACEHOLDER === "%GIT_HASH%" ? "local" : GIT_HASH_PLACEHOLDER;
