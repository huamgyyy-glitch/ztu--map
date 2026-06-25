import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const ignoredWorkspaceDirs = [
  "asset_work",
  "qa-screenshots",
  "UI素材整理",
  "UI设计方案",
  "ui设计参考",
  "ui元素",
  "古城素材",
  "昭通古城风景",
];

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    strictPort: true,
    watch: {
      ignored: [
        "**/node_modules/**",
        "**/dist/**",
        "**/.vite/**",
        ...ignoredWorkspaceDirs.map((dir) => `**/${dir}/**`),
        "**/src/*.broken-backup-*",
        "**/src/*.overwritten-*",
      ],
    },
  },
});
