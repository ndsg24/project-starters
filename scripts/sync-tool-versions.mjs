import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { templates } from "./create.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const versions = JSON.parse(
  await readFile(join(root, "conventions/dev-dependencies.json"), "utf8"),
);
const staged = JSON.parse(
  await readFile(join(root, "conventions/lint-staged.json"), "utf8"),
);
for (const template of templates) {
  const file = join(root, "templates", template, "package.json");
  const pkg = JSON.parse(await readFile(file, "utf8"));
  Object.assign(pkg.devDependencies, versions);
  pkg["lint-staged"] = staged;
  await writeFile(file, JSON.stringify(pkg, null, 2) + "\n");
}
console.log(
  "Synced common dependency versions. Run pnpm install in every template to update lockfiles.",
);
