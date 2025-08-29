// Application version - update this when releasing new versions
export const VERSION = "0.1.0";

// Git hash - use lazy evaluation for environments where git might not be available
let _gitHash: string | undefined;
const getGitHashSync = (): string => {
  if (_gitHash === undefined) {
    try {
      // Try environment variable first (CI builds)
      const envGitHash = Deno.env.get("GIT_HASH");
      if (envGitHash) {
        _gitHash = envGitHash.slice(0, 7);
        return _gitHash;
      }

      // Try git command for local development
      const command = new Deno.Command("git", {
        args: ["rev-parse", "--short", "HEAD"],
        stdout: "piped",
        stderr: "piped",
      });
      const { code, stdout } = command.outputSync();

      if (code === 0) {
        _gitHash = new TextDecoder().decode(stdout).trim();
      } else {
        _gitHash = "unknown";
      }
    } catch {
      _gitHash = "unknown";
    }
  }
  return _gitHash;
};

export const GIT_HASH = getGitHashSync();
