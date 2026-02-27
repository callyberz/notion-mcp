import { build } from "esbuild";

const libsqlWeb = {
  name: "libsql-web",
  setup(build) {
    // Redirect @libsql/client (native) → @libsql/client/web (HTTP-only)
    build.onResolve({ filter: /^@libsql\/client$/ }, () => ({
      path: "@libsql/client/web",
      external: true,
    }));
    build.onResolve({ filter: /^@libsql\/client\/web$/ }, () => ({
      path: "@libsql/client/web",
      external: true,
    }));
  },
};

await build({
  entryPoints: ["apps/api/src/vercel.ts"],
  bundle: true,
  outfile: "api/index.js",
  platform: "node",
  target: "node18",
  format: "esm",
  plugins: [libsqlWeb],
});

console.log("✓ API bundled to api/index.js");
