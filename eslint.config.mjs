import path from "node:path";
import url from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: path.dirname(url.fileURLToPath(import.meta.url)),
});

export default [
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("next/typescript"),
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**"],
  },
];
