// Learn more https://docs.expo.io/guides/customizing-metro
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// .js インポートを .ts / .tsx にもフォールバックさせる
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs", "cjs"];

config.resolver.resolveRequest = (context, moduleName, platform) => {
	if (moduleName.endsWith(".js")) {
		try {
			return context.resolveRequest(context, moduleName, platform);
		} catch {
			const tsName = moduleName.replace(/\.js$/, "");
			return context.resolveRequest(context, tsName, platform);
		}
	}
	return context.resolveRequest(context, moduleName, platform);
};

config.watchFolders = [workspaceRoot];

const { transformer, resolver } = config;

config.transformer = {
	...transformer,
	babelTransformerPath: require.resolve("@lingui/metro-transformer/expo"),
};
config.resolver = {
	...resolver,
	sourceExts: [...resolver.sourceExts, "po", "pot"],
};

module.exports = config;
