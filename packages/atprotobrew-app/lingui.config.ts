import { defineConfig } from "@lingui/cli";
import path from "path";
import { fileURLToPath } from "url";
import rootConfig from "../../lingui.config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	...rootConfig,
	rootDir: __dirname,
	catalogs: [
		{
			path: "<rootDir>/locales/{locale}/messages",
			include: ["<rootDir>/components", "<rootDir>/modules", "<rootDir>/app"],
			exclude: ["**/node_modules/**", "**/*.test.*"],
		},
	],
});
