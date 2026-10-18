// Folder-level `.vsnip.json` resolution. No vscode imports allowed here: this module is
// unit-tested directly (src/test/nipConfig.test.ts).
import { readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

export const CONFIG_FILE_NAME = ".vsnip.json";

export const CONFIG_KEYS = ["additionalProperties", "additionalStats", "additionalExtras"] as const;
export type ConfigKey = (typeof CONFIG_KEYS)[number];
export type ConfigAdditions = Record<ConfigKey, string[]>;

export interface ConfigProblem {
  message: string;
  line: number;
  character: number;
  length: number;
}

export interface LoadedConfigFile {
  path: string;
  additions: ConfigAdditions;
  // Stops the upward search, so `.vsnip.json` files in parent folders do not apply.
  root: boolean;
  problems: ConfigProblem[];
}

export type ParsedConfig = Omit<LoadedConfigFile, "path">;

const KNOWN_KEYS: readonly string[] = ["root", ...CONFIG_KEYS];

// Returns the file's text, or undefined when there is no config file at `path`.
export type ReadConfigFile = (path: string) => string | undefined;

export function emptyAdditions(): ConfigAdditions {
  return { additionalProperties: [], additionalStats: [], additionalExtras: [] };
}

// Shared by the settings path and `.vsnip.json`, so both accept the same spellings.
export function normalizeStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0);
}

function problemAt(text: string, offset: number, length: number, message: string): ConfigProblem {
  // Counts line breaks the way the editor does, lone \r included.
  const lines = text.slice(0, Math.max(offset, 0)).split(/\r\n|\r|\n/);
  return { message, line: lines.length - 1, character: lines[lines.length - 1].length, length };
}

// Points at the LAST `"key"` followed by a colon: JSON.parse keeps the last of duplicate keys,
// and the colon skips the same text used as a string value.
function problemAtKey(text: string, key: string, message: string): ConfigProblem {
  const quoted = JSON.stringify(key);
  for (let offset = text.lastIndexOf(quoted); offset >= 0; offset = text.lastIndexOf(quoted, offset - 1)) {
    let next = offset + quoted.length;
    while (next < text.length && " \t\r\n".includes(text[next])) next++;
    if (text[next] === ":") return problemAt(text, offset, quoted.length, message);
    if (offset === 0) break;
  }
  return problemAt(text, 0, 0, message);
}

export function parseConfigText(rawText: string): ParsedConfig {
  // Windows editors and PowerShell 5.1 write a UTF-8 BOM, which JSON.parse rejects.
  const text = rawText.charCodeAt(0) === 0xfeff ? rawText.slice(1) : rawText;
  const additions = emptyAdditions();
  const problems: ConfigProblem[] = [];
  let root = false;

  if (text.trim().length === 0) {
    return { additions, root, problems };
  }

  // A file that cannot be parsed cannot declare root either, so parent files keep applying.
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    problems.push(problemAt(text, 0, 0, `Invalid JSON, so this file is ignored: ${detail}`));
    return { additions, root, problems };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    problems.push(problemAt(text, 0, 0, "Expected a JSON object at the top level, so this file is ignored"));
    return { additions, root, problems };
  }

  for (const [key, value] of Object.entries(parsed)) {
    if (key === "$schema") continue;

    if (!KNOWN_KEYS.includes(key)) {
      problems.push(problemAtKey(text, key, `Unknown key "${key}" is ignored (expected ${KNOWN_KEYS.join(", ")})`));
      continue;
    }

    if (key === "root") {
      if (typeof value === "boolean") root = value;
      else problems.push(problemAtKey(text, key, '"root" must be true or false, so it is ignored'));
      continue;
    }

    if (!Array.isArray(value)) {
      problems.push(problemAtKey(text, key, `"${key}" must be an array of strings, so it is ignored`));
      continue;
    }

    if (value.some((entry) => typeof entry !== "string")) {
      problems.push(problemAtKey(text, key, `"${key}" contains non-string entries, which are ignored`));
    }
    additions[key as ConfigKey] = normalizeStringList(value);
  }

  return { additions, root, problems };
}

export const readConfigFileSync: ReadConfigFile = (path) => {
  try {
    return readFileSync(path, "utf8");
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code;
    // A `.vsnip.json` directory, or a path through a non-directory, means no config here.
    if (code === "ENOENT" || code === "ENOTDIR" || code === "EISDIR") {
      return undefined;
    }
    throw e;
  }
};

export interface NipConfigResolverOptions {
  read?: ReadConfigFile;
  // Called once per file each time it is (re)parsed, i.e. on a cache miss.
  onLoad?: (file: LoadedConfigFile) => void;
}

export class NipConfigResolver {
  // Keyed by directory; null records "no config file here" so misses are cached too.
  private readonly files = new Map<string, LoadedConfigFile | null>();
  private readonly read: ReadConfigFile;
  private readonly onLoad?: (file: LoadedConfigFile) => void;

  constructor(options: NipConfigResolverOptions = {}) {
    this.read = options.read ?? readConfigFileSync;
    this.onLoad = options.onLoad;
  }

  /** The config file directly in `dir`, if any. */
  load(dir: string): LoadedConfigFile | null {
    const cached = this.files.get(dir);
    if (cached !== undefined) {
      return cached;
    }

    const path = join(dir, CONFIG_FILE_NAME);
    let file: LoadedConfigFile | null;
    try {
      const text = this.read(path);
      file = text === undefined ? null : { path, ...parseConfigText(text) };
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      file = {
        path,
        additions: emptyAdditions(),
        root: false,
        problems: [problemAt("", 0, 0, `Could not read this file, so it is ignored: ${detail}`)],
      };
    }

    this.files.set(dir, file);
    if (file) this.onLoad?.(file);
    return file;
  }

  /**
   * Config files that apply to a document in `dir`, outermost first. Walks up to and including
   * `stopDir` (the workspace folder root), or the filesystem root without one, stopping early at
   * a file marked `"root": true`. `onVisit` sees every directory searched, with or without a file.
   */
  filesFor(dir: string, stopDir?: string, onVisit?: (dir: string) => void): LoadedConfigFile[] {
    const found: LoadedConfigFile[] = [];
    let current = dir;
    for (;;) {
      onVisit?.(current);
      const file = this.load(current);
      if (file) found.push(file);
      if (file?.root) break;

      // relative() compares case-insensitively on win32, so a document opened through a
      // differently-cased path still stops at its workspace folder.
      if (stopDir !== undefined && relative(stopDir, current) === "") break;
      const parent = dirname(current);
      if (parent === current) break;
      current = parent;
    }
    return found.reverse();
  }

  clear(): void {
    this.files.clear();
  }
}
