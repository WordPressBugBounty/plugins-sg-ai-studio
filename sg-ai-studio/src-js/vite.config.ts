import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

interface BuildTarget {
  entry: string;
  name: string;
  fileName: string;
  cssFileName: string;
}

const buildTargets: Record<string, BuildTarget> = {
  chat: {
    entry: resolve(__dirname, "src/chat/main.tsx"),
    name: "WPAIStudioChat",
    fileName: "js/chat.js",
    cssFileName: "css/chat.css",
  },
  settings: {
    entry: resolve(__dirname, "src/settings/main.tsx"),
    name: "WPAIStudioSettings",
    fileName: "js/settings.js",
    cssFileName: "css/settings.css",
  },
};

function createBuildConfig(buildTarget?: string): UserConfig {
  const target = buildTarget && buildTargets[buildTarget];

  // dev server
  if (!target) {
    return defineConfig({
      plugins: [react()],
      resolve: {
        alias: {
          "@": resolve(__dirname, "src"),
        },
      },
      define: {
        "process.env.NODE_ENV": '"development"',
      },
    });
  }

  // Production builds Chat and Settings
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: false,
      lib: {
        entry: target.entry,
        name: target.name,
        fileName: () => target.fileName,
        formats: ["umd"],
      },
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            const fileName = assetInfo.names?.[0] || assetInfo.originalFileName || "unknown";

            if (fileName === "style.css") {
              return target.cssFileName;
            }

            if (fileName.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
              return `images/${fileName}`;
            }

            return fileName;
          },
        },
      },
      cssCodeSplit: false,
    },
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  });
}

export default createBuildConfig(process.env.BUILD_TARGET);
