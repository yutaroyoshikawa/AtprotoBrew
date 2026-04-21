import { defineConfig } from "@lingui/cli";

export default defineConfig({
	sourceLocale: "ja",
	locales: ["ja", "en"],
	catalogs: [
		{
			path: "<rootDir>/src/locales/{locale}/messages",
			include: ["<rootDir>/src"],
		},
	],
});
