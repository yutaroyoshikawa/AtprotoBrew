import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		// Bind to all interfaces so the OAuth redirect to http://127.0.0.1:<port>/
		// reaches the dev server even on macOS where localhost resolves to ::1 (IPv6).
		host: true,
	},
});
