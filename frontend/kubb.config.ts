import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTs } from "@kubb/plugin-ts";

export default defineConfig({
  name: "gpmanager",
  input: {
    path: "../docs/swagger.json",
  },
  output: {
    path: "./src/lib/api/kubb",
    clean: true,
    format: "biome",
    lint: "biome",
    defaultBanner: false,
    extension: {
      ".ts": "",
    },
  },
  plugins: [
    pluginOas({
      output: {
        path: "./types",
      },
    }),
    pluginTs({
      output: {
        path: "./types",
      },
    }),
    pluginClient({
      output: {
        path: "./client",
      },
      importPath: "../client",
    }),
  ],
});
