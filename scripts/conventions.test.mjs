import { test } from "node:test";
import { verifyConventions } from "./verify-conventions.mjs";

test(
  "Should keep tooling identical across all six templates",
  verifyConventions,
);
