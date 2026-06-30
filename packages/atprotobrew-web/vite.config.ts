import path from "node:path";
import { lingui } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tamaguiPlugin } from "@tamagui/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import macros from "vite-plugin-babel-macros";

export default defineConfig({
	plugins: [
		react(),
		babel({
			babelConfig: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
		lingui(),
		macros(),
		tamaguiPlugin({
			config: path.resolve(__dirname, "node_modules/@atprotobrew/common/tamagui.config.ts"),
			components: ["tamagui"],
		}),
		tailwindcss(),
	],
	resolve: {
		dedupe: ["react", "react-dom"],
		alias: {
			"lucide-react-native": path.resolve(__dirname, "../../node_modules/lucide-react"),
		},
	},
	optimizeDeps: {
		exclude: ["@atprotobrew/tokens", "@atprotobrew/common"],
	},
	server: {
		// Bind to all interfaces so the OAuth redirect to http://127.0.0.1:<port>/
		// reaches the dev server even on macOS where localhost resolves to ::1 (IPv6).
		host: true,
	},
});
