const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");

module.exports = defineConfig({
  plugins: [react()],
  root: "web",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
