import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import assert from "node:assert/strict";
import { templates } from "./create.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
async function files(directory, prefix = "") {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = join(prefix, entry.name);
    if (entry.isDirectory())
      result.push(...(await files(join(directory, entry.name), relative)));
    else result.push(relative);
  }
  return result;
}
export async function verifyConventions() {
  const commonFiles = await files(join(root, "conventions"));
  const sharedDependencies = JSON.parse(
    await readFile(join(root, "conventions/dev-dependencies.json"), "utf8"),
  );
  for (const template of templates) {
    for (const file of commonFiles) {
      if (["dev-dependencies.json", "lint-staged.json"].includes(file))
        continue;
      assert.equal(
        await readFile(join(root, "templates", template, file), "utf8"),
        await readFile(join(root, "conventions", file), "utf8"),
        `${template}: ${file} differs`,
      );
    }
    const pkg = JSON.parse(
      await readFile(join(root, "templates", template, "package.json"), "utf8"),
    );
    assert.deepEqual(
      pkg["lint-staged"],
      JSON.parse(
        await readFile(join(root, "conventions/lint-staged.json"), "utf8"),
      ),
    );
    assert.equal(pkg.packageManager, "pnpm@10.13.1");
    for (const [name, version] of Object.entries(sharedDependencies))
      assert.equal(
        pkg.devDependencies[name],
        version,
        `${template}: ${name} differs`,
      );
  }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await verifyConventions();
  console.log(
    "All six templates share identical conventions and tool versions.",
  );
}
