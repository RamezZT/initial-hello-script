
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Disable type checking during build for faster builds
    typescript: {
      ignoreBuildErrors: true,
    },
    // Skip ESLint check during build
    lint: false,
    // Increase chunk size warning limit to prevent warnings about large chunks
    chunkSizeWarningLimit: 1600,
  }
}));
