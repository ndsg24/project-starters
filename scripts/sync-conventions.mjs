import { readFile, readdir, writeFile, mkdir, chmod } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { templates } from "./create.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
async function visit(directory, prefix = "") {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = join(prefix, entry.name);
    if (entry.isDirectory()) await visit(join(directory, entry.name), relative);
    else if (
      !["dev-dependencies.json", "lint-staged.json"].includes(relative)
    ) {
      const contents = await readFile(join(directory, entry.name));
      for (const template of templates) {
        const target = join(root, "templates", template, relative);
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, contents);
        if (relative.startsWith(".husky/")) await chmod(target, 0o755);
      }
    }
  }
}
await visit(join(root, "conventions"));
console.log(
  "Synced conventions. Update common tool dependencies together, then regenerate lockfiles.",
);
