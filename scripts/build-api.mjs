import { build } from "esbuild";

await build({
  entryPoints: ["apps/api/src/vercel.ts"],
  bundle: true,
  outfile: "api/index.js",
  platform: "node",
  target: "node18",
  format: "esm",
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
});

console.log("✓ API bundled to api/index.js");
