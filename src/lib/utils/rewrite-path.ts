function normalizePath(path: string) {
  return path.replace(/\\/g, "/");
}

function getDirname(filePath: string) {
  return normalizePath(filePath).split("/").slice(0, -1).join("/") || "/";
}

function joinPaths(...parts: string[]) {
  return normalizePath(parts.join("/")).replace(/\/+/g, "/");
}

function relativePath(from: string, to: string) {
  const fromParts = normalizePath(from).split("/");
  const toParts = normalizePath(to).split("/");

  while (fromParts.length && toParts.length && fromParts[0] === toParts[0]) {
    fromParts.shift();
    toParts.shift();
  }

  return (
    "../".repeat(fromParts.length) + // <-- no -1 here
    toParts.join("/").replace(/\.tsx?$/, "")
  );
}

type SandpackFile =
  | string
  | { code: string; readOnly?: boolean; active?: boolean; hidden?: boolean };

export function rewriteSandpackAliases(
  files: Record<string, SandpackFile>,
  alias = "@",
  aliasPath = "/src",
) {
  const rewritten: Record<string, SandpackFile> = {};

  for (const filePath in files) {
    const file = files[filePath];

    // Extract code string whether file is string or object
    const code = typeof file === "string" ? file : file.code;

    // Skip non-code files (e.g. json, css)
    if (!filePath.match(/\.(ts|tsx|js|jsx)$/)) {
      rewritten[filePath] = file;
      continue;
    }

    const fileDir = getDirname(filePath);

    const replacedCode = code.replace(
      new RegExp(`(["'\`])${alias}/([^"'\`]+)\\1`, "g"),
      (_match, quote, importPath) => {
        const fullImportPath = joinPaths(aliasPath, importPath);
        const relPath = relativePath(fileDir, fullImportPath);
        const normalized = relPath.startsWith(".") ? relPath : `./${relPath}`;
        return `${quote}${normalized}${quote}`;
      },
    );

    // If original was string, convert to object with code only
    if (typeof file === "string") {
      rewritten[filePath] = { code: replacedCode };
    } else {
      // Preserve other file props
      rewritten[filePath] = { ...file, code: replacedCode };
    }
  }

  return rewritten;
}
