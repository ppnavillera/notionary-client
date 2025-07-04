import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // build 설정을 추가합니다.
    rollupOptions: {
      input: {
        // 여러 진입점을 설정합니다.
        popup: resolve(__dirname, "index.html"), // 기존 팝업 진입점
        background: resolve(__dirname, "src/background.ts"), // 새로운 백그라운드 진입점
        content: resolve(__dirname, "src/content.ts"), // 추가
      },
      output: {
        // 출력 파일 이름을 설정합니다.
        // entryFileNames: (chunkInfo) => {
        //   // background.ts의 출력 파일 이름을 background.js로 고정합니다.
        //   return chunkInfo.name === "background"
        //     ? "background.js"
        //     : "assets/[name].js";
        // },
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "background") return "background.js";
          if (chunkInfo.name === "content") return "content.js";
          return "assets/[name].js";
        },
      },
    },
  },
  assetsInclude: ["**/*.json"],
});
